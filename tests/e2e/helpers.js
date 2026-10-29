import { expect } from '@playwright/test';

export const BASE_PATH = `/${process.env.REPO_NAME || 'learn-japanese'}/`;

/** Attach network/console recorders to a page. Returns an object with live arrays. */
export function watch(page) {
  const rec = { requests: [], failed: [], console: [], bad: [], crossOrigin: [] };
  const origin = new URL(page.context()._options?.baseURL || `http://localhost:${process.env.PORT || 4173}/`).origin;
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (u.protocol === 'data:' || u.protocol === 'blob:') return;
    rec.requests.push(r.url());
    if (u.origin !== origin) rec.crossOrigin.push(r.url());
  });
  page.on('requestfailed', (r) => rec.failed.push(`${r.url()} ${r.failure()?.errorText}`));
  page.on('response', (r) => { if (r.status() >= 400) rec.bad.push(`${r.status()} ${r.url()}`); });
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') rec.console.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => rec.console.push(`pageerror: ${e.message}`));
  return rec;
}

export async function waitReady(page) {
  await page.waitForSelector('#main');
  await page.waitForFunction(() => !!window.__tabi);
}

export async function waitSwReady(page) {
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await expect.poll(async () => page.evaluate(async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    return !!(reg && reg.active && navigator.serviceWorker.controller);
  }), { timeout: 15000 }).toBe(true).catch(async () => { await page.reload(); await page.waitForFunction(() => !!navigator.serviceWorker.controller); });
}

/** Mark the first-run tour as done in storage, reload, and land on the home screen. */
export async function skipTour(page) {
  await page.evaluate(() => {
    const raw = localStorage.getItem('jla:v1:meta');
    const meta = raw ? JSON.parse(raw) : { schemaVersion: 1, createdAt: Date.now() };
    meta.tourDone = true;
    localStorage.setItem('jla:v1:meta', JSON.stringify(meta));
  });
  await page.reload();
  await page.waitForFunction(() => !!window.__tabi);
  await page.evaluate(() => { location.hash = '#/'; });
  await page.waitForSelector('#start-today');
}

/** Solve the exercise currently shown, through the UI (clicks and typing). `correct=false` picks a wrong answer where possible. */
export async function solveCurrent(page, { correct = true } = {}) {
  const info = await page.evaluate(() => { const q = document.querySelector('.exercise')?.q; return q ? { type: q.type, answer: q.answer, pairs: q.pairs || null, tiles: q.tiles || null, choices: q.choices ? q.choices.map((c) => c.id) : null, id: q.id } : null; });
  if (!info) throw new Error('no exercise on screen');
  const ex = page.locator('.exercise');
  if (['flashcard', 'srs_review', 'handwriting_guided', 'shadowing'].includes(info.type)) {
    await ex.getByRole('button', { name: /Show answer|I have tried it/ }).click();
    await ex.getByRole('button', { name: correct ? /3 · Good/ : /1 · Again/ }).click();
  } else if (info.type === 'matching') {
    const pairs = correct ? info.pairs : info.pairs.map((p, i, a) => [p[0], a[(i + 1) % a.length][1]]);
    for (const [l, r] of pairs) { await ex.locator('.match-grid .col').nth(0).getByRole('button', { name: new RegExp(`^${l}`) }).click(); await ex.locator('.match-grid .col').nth(1).getByRole('button', { name: r, exact: true }).first().click(); }
    await ex.getByRole('button', { name: 'Check' }).click();
  } else if (info.type === 'sentence_order') {
    const order = correct ? info.answer : [...info.answer].reverse();
    for (const t of order) await ex.locator('.tiles.bank button:not([disabled])').filter({ hasText: new RegExp(`^${t}$`) }).first().click(); // used tiles stay in the bank (disabled), so a repeated word needs the next enabled one
    await ex.getByRole('button', { name: 'Check' }).click();
  } else if (info.choices) {
    const id = correct ? info.answer : info.choices.find((c) => c !== info.answer);
    await ex.locator(`[data-choice="${id}"]`).click();
    await ex.getByRole('button', { name: 'Check' }).click();
  } else if (info.type === 'dictation' && (await ex.getByRole('button', { name: /Skip \(no penalty\)/ }).count())) {
    await ex.getByRole('button', { name: /Skip \(no penalty\)/ }).click();
  } else {
    await ex.locator('input[type="text"]').fill(correct ? String(info.answer) : 'zzz');
    await ex.getByRole('button', { name: 'Check' }).click();
  }
  await ex.locator('.feedback').waitFor();
  const result = await ex.locator('.feedback').getAttribute('data-result');
  await ex.getByRole('button', { name: 'Continue' }).click();
  return { type: info.type, id: info.id, result };
}

/** Answer exercises until the session summary appears (or `max` reached). Returns the list of results. */
export async function solveSession(page, { correct = () => true, max = 60, award = true } = {}) {
  const results = [];
  for (let i = 0; i < max; i++) {
    if (await page.locator('.summary').count()) break;
    if (!(await page.locator('.exercise').count())) { await page.waitForTimeout(50); continue; }
    results.push(await solveCurrent(page, { correct: correct(i) }));
  }
  if (award) await dismissAward(page);
  return results;
}

/** In exam mode: answer the currently shown question (correct or wrong) by clicking a choice. */
export async function examAnswer(page, correct = true) {
  const info = await page.evaluate(() => { const q = document.querySelector('.exercise')?.q; return q ? { answer: q.answer, choices: (q.choices || []).map((c) => c.id) } : null; });
  const id = correct ? info.answer : info.choices.find((c) => c !== info.answer);
  await page.locator(`.exercise [data-choice="${id}"]`).click();
}
/** Answer every question of the active exam section in order, then submit it. `skip` = indexes to leave unanswered. */
export async function examRunSection(page, { correct = () => true, skip = [] } = {}) {
  const n = await page.locator('.qgrid .qg').count();
  for (let i = 0; i < n; i++) {
    if (!skip.includes(i)) await examAnswer(page, correct(i));
    if (i < n - 1) await page.locator('#q-next').click();
  }
  await page.locator('#q-submit').click();
  await page.locator('#confirm-submit').click();
}

/** The stamp-awarding moment is a modal dialog; when the summary announces a new stamp, wait for it and close it so the test can go on. */
export async function dismissAward(page) {
  const summary = page.locator('.summary');
  if (!(await summary.count())) return false;
  if (!/Stamp earned/.test(await summary.innerText())) return false;
  const btn = page.locator('#award-continue');
  await btn.waitFor({ state: 'visible', timeout: 5000 });
  await btn.click();
  await page.locator('#stamp-award').waitFor({ state: 'detached', timeout: 5000 });
  return true;
}
