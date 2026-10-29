import { test, expect } from '@playwright/test';
import { watch, waitReady, skipTour, solveSession, solveCurrent } from './helpers.js';
import { seedProfile } from './profiles.js';

const fireInstallPrompt = (page, outcome = 'accepted') => page.evaluate((o) => {
  const e = new Event('beforeinstallprompt', { cancelable: true });
  e.prompt = async () => { window.__prompted = (window.__prompted || 0) + 1; };
  e.userChoice = Promise.resolve({ outcome: o, platform: 'web' });
  window.dispatchEvent(e);
}, outcome);

test.describe('Journey 1: first launch and installation', () => {
  test('a new learner sees a welcome, can skip into the app, and is not blocked by the install suggestion', async ({ page }) => {
    const rec = watch(page);
    await page.goto('./'); await waitReady(page);
    await expect(page).toHaveURL(/#\/tour/);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    await expect(page.locator('main h1')).toContainText('A journey across Japan');
    await skipTour(page);
    await expect(page.locator('main h1')).toContainText('Welcome aboard');
    await expect(page.locator('#start-today')).toContainText('Start your first lesson');
    expect(rec.console.filter((c) => !/favicon/.test(c))).toEqual([]);
  });

  test('Chromium: the install card appears only when the browser offers installation, triggers the native prompt from a click, and disappears afterwards', async ({ page }) => {
    await page.goto('./'); await waitReady(page);
    await expect(page.locator('#install-card')).toHaveCount(0); // nothing offered by the browser yet: no fake button
    await fireInstallPrompt(page);
    await expect(page.locator('#install-card')).toBeVisible(); // tour step 1
    await expect(page.locator('#install-btn')).toHaveText('Install app');
    await skipTour(page); // reloads the page, so the browser would fire the event again
    await fireInstallPrompt(page);
    await expect(page.locator('#install-card')).toBeVisible(); // also on Home
    await page.locator('#install-btn').click();
    await expect.poll(() => page.evaluate(() => window.__prompted)).toBe(1);
    await expect(page.locator('#install-card')).toHaveCount(0);
    await page.goto('./#/me');
    await expect(page.locator('#install-row')).toContainText('App installed');
  });

  test('"Not now" hides the card, survives a reload, and installation help can be reopened from Me', async ({ page }) => {
    await page.goto('./'); await waitReady(page); await skipTour(page);
    await fireInstallPrompt(page);
    await page.locator('#install-dismiss').click();
    await expect(page.locator('#install-card')).toHaveCount(0);
    await page.reload(); await waitReady(page); await fireInstallPrompt(page);
    await expect(page.locator('#install-card')).toHaveCount(0); // snoozed, not nagging
    await page.goto('./#/me');
    await expect(page.locator('#install-row')).toContainText('Install the app');
    await page.locator('#install-row').click();
    await expect.poll(() => page.evaluate(() => window.__prompted)).toBe(1);
  });

  test('an installed (standalone) app never shows an install prompt', async ({ page }) => {
    await page.addInitScript(() => { const orig = window.matchMedia.bind(window); window.matchMedia = (q) => (/display-mode:\s*standalone/.test(q) ? { matches: true, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false } : orig(q)); });
    await page.goto('./'); await waitReady(page); await skipTour(page);
    await fireInstallPrompt(page);
    await expect(page.locator('#install-card')).toHaveCount(0);
    await page.goto('./#/me'); await expect(page.locator('#install-row')).toContainText('App installed');
  });
});

test.describe('Journey 1b: iPhone / iPad guidance is accurate', () => {
  const IPHONE_SAFARI = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1';
  const IPHONE_CHROME = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/123.0.0.0 Mobile/15E148 Safari/604.1';
  test('Safari: "Install on iPhone" shows Share -> Add to Home Screen steps and never claims success', async ({ browser }) => {
    const ctx = await browser.newContext({ userAgent: IPHONE_SAFARI, viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    await page.goto('./'); await waitReady(page); await skipTour(page);
    await expect(page.locator('#install-btn')).toHaveText('Install on iPhone');
    await page.locator('#install-btn').click();
    const dlg = page.locator('dialog[open]');
    await expect(dlg).toContainText('Share'); await expect(dlg).toContainText('Add to Home Screen'); await expect(dlg).toContainText('7 days');
    await expect(dlg).not.toContainText(/installed successfully|has been installed/i);
    await dlg.getByRole('button', { name: 'Got it' }).click();
    await page.goto('./#/me'); await expect(page.locator('#install-row')).toContainText('Install the app'); // still not "installed": we cannot detect it from the browser
    await ctx.close();
  });
  test('other iOS browsers are told to open Safari', async ({ browser }) => {
    const ctx = await browser.newContext({ userAgent: IPHONE_CHROME, viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    await page.goto('./'); await waitReady(page); await skipTour(page);
    await page.locator('#install-btn').click();
    await expect(page.locator('dialog[open]')).toContainText('Safari');
    await ctx.close();
  });
});

test.describe('Home reflects genuine progress (dashboard states from synthetic profiles)', () => {
  test.beforeEach(async ({ page }) => { await page.goto('./'); await waitReady(page); await skipTour(page); });
  test('new learner: welcome, one clear first action, how it works, no fake stats', async ({ page }) => {
    await expect(page.locator('main')).toContainText('Welcome aboard');
    await expect(page.locator('#start-today')).toBeVisible();
    await expect(page.locator('.stat-row')).toHaveCount(0); await expect(page.locator('.goal-card')).toHaveCount(0);
    await expect(page.locator('main')).toContainText('How it works');
    await expect(page.locator('main')).toContainText('No stamps yet');
  });
  test('partial progress: continue card, ring and stats appear only once there is something to show', async ({ page }) => {
    await seedProfile(page, 'partial'); await page.reload(); await waitReady(page);
    await expect(page.locator('main h1')).toContainText('You are in Tokyo');
    await expect(page.locator('#start-today')).toContainText('Continue');
  });
  test('learner with a stamp and a streak: stamp preview, streak, XP and journey progress are real numbers from state', async ({ page }) => {
    await seedProfile(page, 'stamped'); await page.evaluate(() => window.__tabi.store.update('settings', (s) => ({ ...s, gamification: 'full' }))); await page.reload(); await waitReady(page);
    await expect(page.locator('.stamp-strip svg')).toHaveCount(1);
    await expect(page.locator('.stat.flame b')).toHaveText('3'); await expect(page.locator('.stat.gold b')).toHaveText('220');
    await expect(page.locator('#journey-title')).toContainText('N5 journey');
    await expect(page.locator('main')).toContainText('1 collected');
    await page.locator('a', { hasText: 'Open stamp book' }).click();
    await expect(page.locator('[data-stamp="tokyo"]')).toBeVisible();
  });
  test('streak profile: tiles match saved state', async ({ page }) => {
    await seedProfile(page, 'streak'); await page.evaluate(() => window.__tabi.store.update('settings', (s) => ({ ...s, gamification: 'full' }))); await page.reload(); await waitReady(page);
    await expect(page.locator('.stat.flame b')).toHaveText('5'); await expect(page.locator('.stat.gold b')).toHaveText('135');
  });
});

test.describe('Navigation: five tabs, consistent back, locked things explain themselves', () => {
  test.beforeEach(async ({ page }) => { await page.goto('./'); await waitReady(page); await skipTour(page); });
  test('the bottom navigation reaches every primary screen and marks the active one', async ({ page }) => {
    for (const [tab, url, h1] of [['Explore', /#\/explore/, 'Explore Japan'], ['Learn', /#\/learn/, 'itinerary'], ['JLPT', /#\/jlpt$/, 'JLPT area'], ['Journal', /#\/journal/, 'Stamp book'], ['Home', /#\/$/, 'Welcome aboard']]) {
      await page.locator('nav.tabbar').getByRole('link', { name: tab }).click();
      await expect(page).toHaveURL(url); await expect(page.locator('main h1').first()).toContainText(h1);
      await expect(page.locator('nav.tabbar a[aria-current="page"]')).toHaveText(tab);
    }
  });
  test('the header back button always goes to the parent screen; closing an unfinished lesson asks first', async ({ page }) => {
    await page.goto('./#/dest/tokyo');
    await page.locator('#header-back-btn').click(); await expect(page).toHaveURL(/#\/explore/);
    await page.goto('./#/kana'); await page.locator('#header-back-btn').click(); await expect(page).toHaveURL(/#\/learn/);
    await page.goto('./#/lesson/n5_u01_l1');
    await expect(page.locator('#header-back-btn')).toHaveAccessibleName(/Close and go back to Learn/);
    await page.getByRole('button', { name: 'Next', exact: true }).click(); await page.getByRole('button', { name: 'Next', exact: true }).click(); await page.getByRole('button', { name: 'Start practice' }).click();
    await solveCurrent(page); // one answer given
    await page.locator('#header-back-btn').click();
    const dlg = page.locator('dialog[open]'); await expect(dlg).toContainText('Leave this session?');
    await dlg.getByRole('button', { name: 'Keep going' }).click();
    await expect(page.locator('.exercise')).toBeVisible();
    await page.locator('#header-back-btn').click(); await page.locator('dialog[open]').getByRole('button', { name: 'Leave' }).click();
    await expect(page).toHaveURL(/#\/learn/);
  });
  test('every internal link on the primary screens resolves to a real screen (no dead ends)', async ({ page }) => {
    const bad = [];
    for (const r of ['#/', '#/explore', '#/explore?view=list', '#/learn', '#/jlpt', '#/jlpt/N5', '#/journal', '#/me', '#/settings', '#/dest/tokyo']) {
      await page.goto(`./${r}`); await page.waitForTimeout(250);
      const hrefs = await page.locator('main a[href^="#/"]').evaluateAll((els) => [...new Set(els.map((e) => e.getAttribute('href')))]);
      for (const href of hrefs) { await page.goto(`./${href}`); await page.waitForTimeout(120); const t = await page.locator('main').innerText(); if (/Page not found/.test(t) || !t.trim()) bad.push(`${r} -> ${href}`); }
    }
    expect(bad).toEqual([]);
  });
});

test.describe('Journey 4 and 5: stamp awarding and gamification (earned once, persisted, never duplicated)', () => {
  const finishUnits = (page) => page.evaluate(() => {
    const st = window.__tabi.store; const lessons = {};
    for (const l of ['n5_u01_l1', 'n5_u01_l2', 'n5_u01_l3', 'n5_u01_l4', 'n5_u01_l5', 'n5_u01_l6', 'n5_u01_l7', 'n5_u02_l1', 'n5_u02_l2', 'n5_u02_l3', 'n5_u02_l4', 'n5_u02_l5', 'n5_u02_l6', 'n5_u02_l7']) lessons[l] = { doneAt: 1, score: 1, count: 1 };
    st.update('progress', (p) => ({ ...p, lessons, units: { n5_u01: { completedAt: 1 }, n5_u02: { completedAt: 1 } } }));
  });
  test('passing the quest presses a stamp into the book exactly once; reload keeps it; replaying the quest awards nothing new', async ({ page }) => {
    await page.goto('./'); await waitReady(page); await skipTour(page); await finishUnits(page);
    expect(await page.evaluate(() => Object.keys(window.__tabi.store.state.journal.stamps).length)).toBe(0);
    await page.goto('./#/dest/tokyo'); await page.locator('#quest-q_tokyo_1').click();
    await solveSession(page, { award: false });
    const award = page.locator('#stamp-award');
    await expect(award).toBeVisible();
    await expect(award).toContainText('New stamp collected'); await expect(award).toContainText('Tokyo');
    await expect(award.locator('svg.stamp-art')).toBeVisible();
    await expect(page.locator('.summary')).toContainText('Stamp earned: Tokyo');
    await page.locator('#award-book').click();
    await expect(page).toHaveURL(/#\/journal/); await expect(page.locator('[data-stamp="tokyo"]')).toBeVisible();
    await expect(page.locator('main')).toContainText('1 of 10');
    const snapshot = () => page.evaluate(() => { const j = window.__tabi.store.state.journal; return { stamps: Object.keys(j.stamps).length, postcards: Object.keys(j.postcards).length, ach: Object.keys(j.achievements).length, rewards: Object.keys(j.rewards).length }; });
    const first = await snapshot(); expect(first.stamps).toBe(1);
    await page.reload(); await waitReady(page); await expect(page.locator('[data-stamp="tokyo"]')).toBeVisible(); expect(await snapshot()).toEqual(first);
    await page.goto('./#/dest/tokyo'); await page.locator('#quest-q_tokyo_1').click(); await solveSession(page); // replay: no award modal expected
    expect(await snapshot()).toEqual(first);
    await expect(page.locator('#stamp-award')).toHaveCount(0);
  });
  test('the stamp-awarding animation respects the reduced-motion setting', async ({ page }) => {
    await page.goto('./'); await waitReady(page); await skipTour(page); await finishUnits(page);
    await page.evaluate(() => window.__tabi.store.update('settings', (s) => ({ ...s, reducedMotion: 'on' })));
    await page.goto('./#/dest/tokyo'); await page.locator('#quest-q_tokyo_1').click(); await solveSession(page, { award: false });
    await expect(page.locator('#stamp-award')).toBeVisible();
    expect(await page.locator('.confetti').count()).toBe(0);
    const anim = await page.locator('#stamp-award svg.stamp-art').evaluate((el) => getComputedStyle(el).animationName);
    expect(anim).toBe('none');
    await page.keyboard.press('Escape'); await expect(page.locator('#stamp-award')).toHaveCount(0);
  });
  test('XP only grows with real activity and has repeat limits; the journal explains the rules', async ({ page }) => {
    await page.goto('./'); await waitReady(page); await skipTour(page);
    const xp = () => page.evaluate(() => window.__tabi.store.state.journal.xp.total);
    expect(await xp()).toBe(0);
    for (let i = 0; i < 3; i++) {
      await page.goto('./#/lesson/n5_u01_l1');
      await page.getByRole('button', { name: 'Next', exact: true }).click(); await page.getByRole('button', { name: 'Next', exact: true }).click(); await page.getByRole('button', { name: 'Start practice' }).click();
      await solveSession(page); // practice
      for (let k = 0; k < 3 && !(await page.getByRole('heading', { name: /Lesson complete/ }).count()); k++) { const cont = page.locator('.summary').getByRole('button', { name: /Continue|Finish/ }); if (await cont.count()) await cont.click(); await solveSession(page); }
    }
    const after = await xp(); expect(after).toBeGreaterThan(0);
    await page.goto('./#/journal');
    await page.locator('#how-rewards summary', { hasText: 'What earns XP' }).click();
    await expect(page.locator('#how-rewards')).toContainText('Repeating the same activity more than twice gives nothing');
    await expect(page.locator('#how-rewards dl')).toContainText(String(after));
  });
});

test.describe('Journey 6: JLPT states, unfinished attempt card, resume and discard', () => {
  test.beforeEach(async ({ page }) => { await page.goto('./'); await waitReady(page); await skipTour(page); });
  test('level cards: N5 open, N4-N1 locked with a reason; each locked level names what to do', async ({ page }) => {
    await page.goto('./#/jlpt');
    await expect(page.locator('[data-level="N5"]')).not.toHaveAttribute('data-state', 'locked');
    for (const L of ['N4', 'N3', 'N2', 'N1']) { await expect(page.locator(`[data-level="${L}"]`)).toHaveAttribute('data-state', 'locked'); await expect(page.locator(`[data-level="${L}"] .lock-note`)).toContainText('Locked'); }
    await expect(page.locator('main')).toContainText('Learn a topic'); await expect(page.locator('main')).toContainText('Take a mock exam');
  });
  test('an unfinished attempt shows title, section, time left, progress and consequences; Resume restores it; Discard asks first and deletes only the attempt', async ({ page }) => {
    await page.goto('./#/jlpt/N5'); await page.locator('#practice-vocabulary').click();
    await page.locator('#exam-resume').click(); await page.locator('#start-section').click();
    await expect(page.locator('#exam-timer')).toBeVisible();
    const { examAnswer } = await import('./helpers.js'); await examAnswer(page, true);
    await page.goto('./#/'); // leave without finishing
    const card = page.locator('#attempt-card'); await expect(card).toBeVisible();
    await expect(card).toContainText('Unfinished attempt'); await expect(card).toContainText(/N5 Vocabulary practice/); await expect(card).toContainText(/left in this section/);
    await expect(card).toContainText('continues exactly where you stopped'); await expect(card).toContainText('deletes this attempt');
    await expect(card.locator('[role="progressbar"]')).toBeVisible();
    await page.reload(); await waitReady(page); await expect(page.locator('#attempt-card')).toBeVisible(); // survives a reload
    await page.goto('./#/jlpt'); await expect(page.locator('#attempt-card')).toBeVisible();
    await page.locator('#discard-attempt').click();
    await expect(page.locator('dialog[open]')).toContainText('cannot be undone');
    await page.locator('#confirm-cancel').click(); await expect(page.locator('#attempt-card')).toBeVisible();
    await page.locator('#resume-attempt').click(); await expect(page.locator('#exam-timer')).toBeVisible(); // `?resume=1` goes straight back into the section
    expect(await page.evaluate(() => Object.keys(window.__tabi.store.state.examlive.sections[0].answers).length)).toBe(1);
    await page.goto('./#/jlpt'); await page.locator('#discard-attempt').click(); await page.locator('#confirm-ok').click();
    await expect(page.locator('#attempt-card')).toHaveCount(0);
    expect(await page.evaluate(() => window.__tabi.store.state.examlive)).toBeNull();
  });
});

test.describe('Journey 9: responsive layout, no clipped or covered controls', () => {
  const SCREENS = ['#/', '#/explore', '#/explore?view=list', '#/learn', '#/jlpt', '#/jlpt/N5', '#/journal', '#/me', '#/dest/tokyo', '#/achievements', '#/settings'];
  test('no horizontal overflow; the last content is reachable above the tab bar', async ({ page }) => {
    await page.goto('./'); await waitReady(page); await skipTour(page);
    const bad = [];
    for (const r of SCREENS) {
      await page.goto(`./${r}`); await page.waitForTimeout(350);
      const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      if (o.sw > o.cw + 1) bad.push(`${r}: horizontal overflow ${o.sw} > ${o.cw}`);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      const gap = await page.evaluate(() => { const main = document.querySelector('main'); const tb = document.querySelector('.tabbar'); const last = main.lastElementChild; if (!last || !tb) return 0; return tb.getBoundingClientRect().top - last.getBoundingClientRect().bottom; });
      if (gap < -1) bad.push(`${r}: last element covered by tab bar (${Math.round(gap)} px)`);
    }
    expect(bad).toEqual([]);
  });
  test('lesson controls and the sticky answer footer stay inside the viewport', async ({ page }) => {
    await page.goto('./'); await waitReady(page); await skipTour(page);
    await page.goto('./#/lesson/n5_u01_l1');
    const nb = page.getByRole('button', { name: 'Next', exact: true });
    await nb.scrollIntoViewIfNeeded(); const box = await nb.boundingBox(); const vh = page.viewportSize().height;
    expect(box.y + box.height).toBeLessThanOrEqual(vh + 1);
    await nb.click(); await page.getByRole('button', { name: 'Next', exact: true }).click(); await page.getByRole('button', { name: 'Start practice' }).click();
    const check = page.getByRole('button', { name: 'Check' }); await expect(check).toBeVisible();
    const b2 = await check.boundingBox(); expect(b2.y + b2.height).toBeLessThanOrEqual(vh + 1); expect(b2.y).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Journey 10: GitHub Pages sub-path production build', () => {
  test('fonts, icons, manifest shortcuts and the stamp/scene art load from the sub-path with no failed requests or console errors', async ({ page, request }) => {
    const rec = watch(page);
    await page.goto('./'); await waitReady(page); await skipTour(page);
    for (const r of ['#/explore', '#/journal', '#/dest/kyoto', '#/learn', '#/jlpt']) { await page.goto(`./${r}`); await page.waitForTimeout(250); }
    const fonts = await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, '')); });
    expect(fonts.some((f) => /Zen Kaku Gothic New/.test(f))).toBe(true);
    const m = await (await request.get('manifest.webmanifest')).json();
    expect(m.shortcuts.length).toBeGreaterThanOrEqual(3);
    for (const s of m.shortcuts) expect(s.url.startsWith('./#/')).toBe(true);
    for (const f of ['fonts/shippori-mincho-latin-700-normal.woff2', 'fonts/OFL-zen-kaku-gothic-new.txt', 'icons/icon-512.png']) expect((await request.get(f)).status(), f).toBe(200);
    expect(rec.failed).toEqual([]); expect(rec.bad).toEqual([]); expect(rec.crossOrigin).toEqual([]);
    expect(rec.console.filter((c) => !/favicon/.test(c))).toEqual([]);
  });
  test('deep links and refreshes work on the new routes', async ({ page }) => {
    for (const r of ['#/explore?view=list', '#/explore?stop=kyoto', '#/journal', '#/dest/nikko']) {
      await page.goto(`./${r}`); await waitReady(page); if (/#\/tour/.test(page.url())) await skipTour(page);
      await page.goto(`./${r}`); await page.reload(); await waitReady(page);
      await expect(page.locator('main h1').first()).toBeVisible();
    }
  });
});
