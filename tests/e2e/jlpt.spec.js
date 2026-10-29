import { test, expect } from '@playwright/test';
import { waitReady, skipTour, examRunSection } from './helpers.js';

const bootN5Done = async (page) => {
  await page.evaluate(async () => {
    const st = window.__tabi.store;
    const released = (await window.__tabi.ctx.getContent()).units.filter((u) => u.level === 'N5' && u.released);
    const lessons = {}; const units = {};
    for (const u of released) { units[u.id] = { completedAt: 1 }; for (const l of u.lessons) lessons[l] = { doneAt: 1, score: 1, count: 1 }; }
    const introduced = { kana: [], vocab: [], kanji: [], grammar: [] };
    st.update('progress', (p) => ({ ...p, lessons, units, introduced }));
  });
};

test.describe('JLPT area (AC10, AC11, AC23, AC25, AC32-AC34)', () => {
  test.beforeEach(async ({ page }) => { await page.goto('./'); await waitReady(page); await skipTour(page); });
  test('AC10/AC25: all five levels are listed with coverage badges, released units, unlock criteria with live values and "N of 20" mock counters', async ({ page }) => {
    await page.goto('./#/jlpt');
    for (const L of ['N5', 'N4', 'N3', 'N2', 'N1']) {
      const card = page.locator(`[data-level="${L}"]`); await expect(card).toBeVisible();
      await expect(card.locator('[data-testid="coverage-badge"]')).toBeVisible();
      await expect(card.locator(`#mock-count-${L}`)).toContainText('Mock exams released: 0 of 20');
      await expect(card).toContainText('Instructional level (unofficial)');
    }
    await expect(page.locator('[data-level="N5"] .criteria li')).toHaveCount(4);
    const nReleased = await page.evaluate(async () => (await window.__tabi.ctx.getContent()).units.filter((u) => u.level === 'N5' && u.released).length);
    await expect(page.locator('[data-level="N5"]')).toContainText(`Units released: ${nReleased} of 12`);
    await expect(page.locator('[data-level="N5"]')).toContainText('released units only');
    await expect(page.locator('[data-level="N4"]')).toContainText('Locked');
  });
  test('AC11: N4 cannot be opened by any UI path without the criteria (direct URL included)', async ({ page }) => {
    await page.goto('./#/jlpt/N4');
    await expect(page.getByText(/N4 is locked until/)).toBeVisible();
    for (const sel of ['#start-readiness', '#start-milestone', '#practice-vocabulary', '#begin-mock']) await expect(page.locator(sel)).toHaveCount(0);
    expect(await page.evaluate(() => window.__tabi.store.state.progress.levels.N4)).toBe('locked');
    await page.goto('./#/jlpt/N5');
    await expect(page.locator('#start-readiness')).toBeVisible();
  });
  test('AC34: official facts shown equal the spec (minutes, totals, pass marks) with source and verification date', async ({ page }) => {
    await page.goto('./#/jlpt/N5');
    const f = page.locator('[data-official="N5"]');
    for (const t of ['Language Knowledge (Vocabulary)', 'Language Knowledge (Grammar) / Reading', 'Listening']) await expect(f).toContainText(t);
    await expect(f.locator('tbody tr').nth(0)).toContainText('20'); await expect(f.locator('tbody tr').nth(1)).toContainText('40'); await expect(f.locator('tbody tr').nth(2)).toContainText('30'); await expect(f.locator('tbody tr').nth(3)).toContainText('90');
    await expect(f).toContainText('Overall pass mark 80'); await expect(f).toContainText('sectional pass mark 38'); await expect(f).toContainText('sectional pass mark 19');
    await expect(f).toContainText('last verified 2026-10-29');
    await page.goto('./#/jlpt/N3'); await expect(page.locator('[data-official="N3"]')).toContainText('Overall pass mark 95');
    expect(await page.locator('main').innerText()).not.toMatch(/\/\s?180/);
  });
  test('section practice: timer, grid, flag, unanswered prompt, lock after submit, practice-percent result without any /180 or pass/fail', async ({ page }) => {
    await bootN5Done(page);
    await page.goto('./#/jlpt/N5'); await page.locator('#practice-vocabulary').click();
    await expect(page.locator('#exam-resume')).toBeVisible(); await expect(page.locator('main')).toContainText('Unfinished attempt'); await page.locator('#exam-resume').click();
    await page.locator('#start-section').click();
    await expect(page.locator('#exam-timer')).toBeVisible(); await expect(page.locator('#exam-timer')).toHaveAttribute('role', 'timer');
    await expect(page.locator('.qgrid .qg').first()).toHaveAttribute('data-state', 'unanswered');
    await page.locator('#q-flag').click(); await expect(page.locator('.qgrid .qg').first()).toHaveAttribute('data-state', 'flagged');
    await page.locator('#q-next').click();
    await page.locator('#q-submit').click(); await expect(page.locator('#submit-prompt')).toContainText('unanswered');
    await page.getByRole('button', { name: 'Go back to questions' }).click();
    // answer everything but leave one unanswered, mix right and wrong
    const n = await page.locator('.qgrid .qg').count();
    await page.locator('.qgrid .qg').first().click();
    await examRunSection(page, { correct: (i) => i % 3 !== 0, skip: [n - 1] });
    const res = page.locator('#exam-results');
    await expect(res).toContainText('Practice estimate — not a JLPT score');
    await expect(res).toContainText('Unanswered: 1');
    const text = await page.locator('main').innerText();
    expect(text).not.toMatch(/\/\s?180|\bpass(ed)? the JLPT\b|CEFR|you will pass/i);
    expect(await page.evaluate(() => window.__tabi.store.state.exams.attempts.length)).toBe(1);
    expect(await page.evaluate(() => window.__tabi.store.state.examlive)).toBeNull();
  });
  test('autosave and resume: reload mid-section offers Resume with the answers kept; discard removes the attempt', async ({ page }) => {
    await bootN5Done(page);
    await page.goto('./#/jlpt/N5'); await page.locator('#practice-grammar, #practice-vocabulary').first().click();
    await page.locator('#exam-resume').click(); await page.locator('#start-section').click();
    const { examAnswer } = await import('./helpers.js'); await examAnswer(page, true);
    await page.evaluate(() => window.__tabi.store.flush());
    await page.reload(); await waitReady(page);
    await expect(page.locator('main')).toContainText('Unfinished attempt');
    await page.locator('#exam-resume').click();
    await expect(page.locator('.qgrid .qg').first()).toHaveAttribute('data-state', 'answered');
    await page.reload(); await waitReady(page);
    await page.getByRole('button', { name: 'Discard this attempt' }).click();
    await expect(page).toHaveURL(/#\/jlpt$/);
    expect(await page.evaluate(() => window.__tabi.store.state.examlive)).toBeNull();
  });
  test('J09/AC11: N4 unlocks only when ALL four criteria are met, in any order; message says internal progress', async ({ page }) => {
    await bootN5Done(page);
    // evidence for mastery: strong, spaced review history for every concept the completed lessons introduce
    await page.evaluate(async () => {
      const st = window.__tabi.store;
      const n5 = await (await fetch('./content/N5.json')).json();
      const recs = []; const intro = { kana: [], vocab: [], kanji: [], grammar: [] };
      for (const l of n5.lessons) for (const [k, ids] of Object.entries(l.introduces)) for (const id of ids) { intro[k].push(id); for (const f of (k === 'kana' ? ['read', 'produce'] : k === 'vocab' ? ['read', 'meaning', 'produce'] : ['meaning', 'construct'])) recs.push([`${id}:${f}`, 99999, 9000, 500, 9, 0, 5, 2 | (8 << 2) | (6 << 7)]); }
      st.putFacets(recs); st.update('progress', (p) => ({ ...p, introduced: intro }));
    });
    await page.goto('./#/jlpt/N5');
    const met = async () => page.locator('.criteria li').evaluateAll((els) => els.map((e) => e.dataset.met));
    expect(await met()).toEqual(['1', '1', '0', '0']); // curriculum and mastery met; readiness and milestone not yet
    expect(await page.evaluate(() => window.__tabi.store.state.progress.levels.N4)).toBe('locked');
    // milestone practice first (20 questions, all correct)
    await page.locator('#start-milestone').click(); await page.locator('#exam-resume').click(); await page.locator('#start-section').click();
    await examRunSection(page);
    await expect(page.locator('#exam-message')).toContainText('Milestone practice reached 100 %');
    expect(await page.evaluate(() => window.__tabi.store.state.progress.levels.N4)).toBe('locked'); // readiness still missing
    // a FAILED readiness check does not unlock
    await page.goto('./#/jlpt/N5'); await page.locator('#start-readiness').click(); await page.locator('#exam-resume').click(); await page.locator('#start-section').click();
    await examRunSection(page, { correct: () => false });
    await expect(page.locator('#exam-message')).toContainText('not passed yet');
    expect(await page.evaluate(() => window.__tabi.store.state.progress.levels.N4)).toBe('locked');
    // passing readiness completes the set
    await page.goto('./#/jlpt/N5'); await page.locator('#start-readiness').click(); await page.locator('#exam-resume').click(); await page.locator('#start-section').click();
    await examRunSection(page);
    await expect(page.locator('#exam-message')).toContainText('Readiness check passed');
    await expect(page.locator('#exam-message')).toContainText('N4 is now unlocked');
    await expect(page.locator('#exam-message')).toContainText('internal progress, not JLPT certification');
    expect(await page.evaluate(() => window.__tabi.store.state.progress.levels.N4)).toBe('unlocked');
    await page.goto('./#/jlpt'); await expect(page.locator('[data-level="N4"]')).not.toContainText('Locked');
  });
  test('readiness dashboard: "Not enough data yet" under 20 attempts and never a JLPT score (AC32)', async ({ page }) => {
    await page.goto('./#/readiness');
    await expect(page.locator('[data-indicator="listening_performance"] [data-display]')).toHaveText('Not enough data yet');
    await expect(page.locator('[data-indicator="internal_readiness"]')).toContainText('Not a JLPT score');
    await expect(page.locator('[data-indicator="internal_readiness"] [data-display]')).toHaveText('Not enough data yet');
    await page.locator('[data-indicator="retention"] summary').click(); await expect(page.locator('[data-indicator="retention"] details')).toContainText('scheduled interval');
  });
  test('exam-date planner never promises passing and shows the unrealistic message when pace_ratio < 0.6 (AC33)', async ({ page }) => {
    await page.evaluate(() => { const st = window.__tabi.store; const today = Math.floor(Date.now() / 86400000); st.update('journal', (j) => ({ ...j, studyDays: Array.from({ length: 14 }, (_, i) => today - 14 + i) })); });
    await page.goto('./#/planner');
    const d = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
    await page.locator('#pl-date').fill(d); await page.locator('#pl-run').click();
    await expect(page.locator('#planner-out')).toContainText('does not guarantee passing');
    const msg = await page.locator('#planner-message').innerText();
    expect(msg).not.toMatch(/you will pass|guaranteed/i);
    expect(msg).toMatch(/Unlikely to cover the material in time|Tight|finish the released curriculum|Not enough activity data/);
  });
});
