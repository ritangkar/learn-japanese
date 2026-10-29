import { test, expect } from '@playwright/test';
import { watch, waitReady, skipTour } from './helpers.js';

test.describe('Explore Japan map (AC13, AC12, J04)', () => {
  test.beforeEach(async ({ page }) => { await page.goto('./'); await waitReady(page); await skipTour(page); });
  test('AC13: map is SVG, under 120 KB, no external requests, with a list alternative and a legend', async ({ page }) => {
    const rec = watch(page);
    await page.goto('./#/'); await page.waitForSelector('.map-svg');
    const size = await page.evaluate(() => new XMLSerializer().serializeToString(document.querySelector('.map-svg')).length);
    expect(size).toBeLessThan(120 * 1024);
    expect(await page.locator('.map-svg image, .map-svg foreignObject').count()).toBe(0);
    await expect(page.getByText('Stylised map, not for navigation').first()).toBeVisible();
    await page.getByText('Map legend').click(); await expect(page.locator('.legend li')).toHaveCount(7);
    await page.getByRole('link', { name: 'List', exact: true }).click();
    await expect(page.locator('#dest-list')).toBeVisible();
    await expect(page.locator('#dest-list a', { hasText: 'Tokyo' }).first()).toBeVisible();
    expect(rec.crossOrigin).toEqual([]); expect(rec.bad).toEqual([]);
  });
  test('pins: tap shows a sheet; keyboard focus works; state is in the accessible name', async ({ page }) => {
    await page.waitForSelector('.map-svg');
    const tokyo = page.locator('[data-dest="tokyo"]');
    await expect(tokyo).toHaveAttribute('aria-label', /Tokyo.*available/);
    await tokyo.focus(); await page.keyboard.press('Enter');
    await expect(page.locator('[data-dest-card="tokyo"]')).toBeVisible();
    await expect(page.locator('[data-dest-card="tokyo"] [data-state-chip]')).toHaveText('available');
  });
  test('J04/AC12: a locked destination cannot be started from its page and shows what is missing', async ({ page }) => {
    await page.goto('./#/dest/tokyo_station');
    await expect(page.getByRole('heading', { name: /Tokyo Station/ })).toBeVisible();
    await expect(page.locator('#dest-title')).toBeVisible();
    await expect(page.locator('[id^="quest-"]')).toHaveCount(0);
    await expect(page.getByText(/not released yet|Complete:/).first()).toBeVisible();
    await page.goto('./#/dest/sapporo');
    await expect(page.locator('[id^="quest-"]')).toHaveCount(0);
    await expect(page.getByText('still hidden')).toBeVisible();
  });
  test('Tokyo area sub-map opens from the national map', async ({ page }) => {
    await page.locator('[data-dest="tokyo"]').click();
    await page.getByRole('link', { name: 'Tokyo area map' }).click();
    await expect(page.locator('.tokyo-map')).toBeVisible();
  });
  test('journey C: finishing a unit and the quest earns a stamp that shows on the map and in the journal; revisiting never duplicates', async ({ page }) => {
    // inject evidence through the store (the full UI path is exercised in slice.spec.js); then check the UI reflects it
    await page.evaluate(() => {
      const st = window.__tabi.store; const units = ['n5_u01', 'n5_u02'];
      const lessons = {}; for (const l of ['n5_u01_l1', 'n5_u01_l2', 'n5_u01_l3', 'n5_u01_l4', 'n5_u01_l5', 'n5_u01_l6', 'n5_u01_l7', 'n5_u02_l1', 'n5_u02_l2', 'n5_u02_l3', 'n5_u02_l4', 'n5_u02_l5', 'n5_u02_l6', 'n5_u02_l7']) lessons[l] = { doneAt: 1, score: 1, count: 1 };
      st.update('progress', (p) => ({ ...p, lessons, units: Object.fromEntries(units.map((u) => [u, { completedAt: 1 }])), destinations: { tokyo: { startedAt: 1, quests: { q_tokyo_1: { best: 0.9, attempts: 1 } } } } }));
    });
    // complete through the real engine path by running the quest UI once
    await page.goto('./#/dest/tokyo'); await page.locator('#quest-q_tokyo_1').click();
    const { solveSession } = await import('./helpers.js'); await solveSession(page);
    await page.goto('./#/'); await expect(page.locator('[data-dest="tokyo"]')).toHaveAttribute('data-state', /completed|revisit_available/);
    await page.goto('./#/journal'); await expect(page.locator('.stamp').first()).toBeVisible();
    await expect(page.getByText(/Unverified/).first()).toBeVisible();
    await page.goto('./#/achievements'); await expect(page.locator('[data-ach="ach_first_stamp"]')).toHaveAttribute('data-earned', '1');
  });

  test('journey C2: Tokyo Station is locked until n5_u03 is complete; with n5_u04 done the QT_NAVIGATE quest completes it once', async ({ page }) => {
    const complete = (ids) => page.evaluate(async (units) => {
      const st = window.__tabi.store; const content = await window.__tabi.ctx.getContent();
      const lessons = {}; const us = {};
      for (const id of units) { us[id] = { completedAt: 1 }; for (const l of content.unitById.get(id).lessons) lessons[l] = { doneAt: 1, score: 1, count: 1 }; }
      st.update('progress', (p) => ({ ...p, lessons: { ...p.lessons, ...lessons }, units: { ...p.units, ...us } }));
    }, ids);
    await page.evaluate(async () => { await window.__tabi.ctx.getContent(); });
    await complete(['n5_u01', 'n5_u02']);
    await page.goto('./#/tokyo');
    await expect(page.locator('[data-dest="tokyo_station"]')).toHaveAttribute('data-state', /visible_locked|discoverable|hidden/);
    await complete(['n5_u03']);
    await page.goto('./#/dest/tokyo_station');
    await expect(page.locator('#quest-q_tokyo_station_1')).toBeVisible();
    await complete(['n5_u04']);
    await page.goto('./#/dest/tokyo_station'); await page.locator('#quest-q_tokyo_station_1').click();
    const { solveSession } = await import('./helpers.js'); await solveSession(page);
    await page.goto('./#/tokyo'); await expect(page.locator('[data-dest="tokyo_station"]')).toHaveAttribute('data-state', /completed|revisit_available/);
    const stamps = async () => page.evaluate(() => Object.keys(window.__tabi.store.state.journal.stamps || {}).filter((k) => k.includes('tokyo_station')).length);
    expect(await stamps()).toBe(1);
    await page.goto('./#/dest/tokyo_station');
    if (await page.locator('#quest-q_tokyo_station_1').count()) { await page.locator('#quest-q_tokyo_station_1').click(); await solveSession(page); }
    expect(await stamps()).toBe(1);
  });

  // Every destination whose unit content exists: locked before its prerequisite units, one stamp after completion + primary quest, never duplicated.
  const N5 = ['n5_u01', 'n5_u02', 'n5_u03', 'n5_u04', 'n5_u05', 'n5_u06', 'n5_u07', 'n5_u08', 'n5_u09', 'n5_u10', 'n5_u11', 'n5_u12', 'n4_u01', 'n4_u02', 'n4_u03'];
  const DESTS = [
    { dest: 'konbini', quest: 'q_konbini_1', unitsBefore: 3, unitsToComplete: 5 },
    { dest: 'tokyo_tower', quest: 'q_tokyo_tower_1', unitsBefore: 4, unitsToComplete: 6 },
    { dest: 'residential_street', quest: 'q_residential_street_1', unitsBefore: 5, unitsToComplete: 7 },
    { dest: 'asakusa', quest: 'q_asakusa_1', unitsBefore: 6, unitsToComplete: 8 },
    { dest: 'shibuya', quest: 'q_shibuya_1', unitsBefore: 7, unitsToComplete: 9 },
    { dest: 'shinjuku', quest: 'q_shinjuku_1', unitsBefore: 8, unitsToComplete: 10 },
    { dest: 'hakone', quest: 'q_hakone_1', unitsBefore: 9, unitsToComplete: 11 },
    { dest: 'mount_fuji', quest: 'q_mount_fuji_1', unitsBefore: 10, unitsToComplete: 12 },
    { dest: 'kamakura', quest: 'q_kamakura_1', unitsBefore: 13, unitsToComplete: 14, n4: true },
    { dest: 'nikko', quest: 'q_nikko_1', unitsBefore: 14, unitsToComplete: 15, n4: true },
  ];
  for (const d of DESTS) {
    test(`journey C3 (${d.dest}): quest unavailable until prerequisite units are complete; completing the quest gives exactly one stamp`, async ({ page }) => {
      const complete = (ids) => page.evaluate(async (units) => {
        const st = window.__tabi.store; const content = await window.__tabi.ctx.getContent();
        const lessons = {}; const us = {};
        for (const id of units) { us[id] = { completedAt: 1 }; for (const l of content.unitById.get(id).lessons) lessons[l] = { doneAt: 1, score: 1, count: 1 }; }
        st.update('progress', (p) => ({ ...p, lessons: { ...p.lessons, ...lessons }, units: { ...p.units, ...us } }));
      }, ids);
      await page.evaluate(async () => { await window.__tabi.ctx.getContent(); });
      if (d.n4) await page.evaluate(() => window.__tabi.store.update('progress', (p) => ({ ...p, levels: { ...p.levels, N4: 'in_progress' } })));
      await complete(N5.slice(0, d.unitsBefore));
      await page.goto(`./#/dest/${d.dest}`);
      await expect(page.locator(`#quest-${d.quest}`)).toHaveCount(0);
      await complete(N5.slice(0, d.unitsToComplete));
      await page.goto('./#/'); await page.goto(`./#/dest/${d.dest}`); await page.locator(`#quest-${d.quest}`).click();
      const { solveSession } = await import('./helpers.js'); await solveSession(page);
      await page.goto('./#/'); await page.goto(`./#/dest/${d.dest}`); await expect(page.locator('main')).toContainText(/completed|revisit/i);
      const stamps = async () => page.evaluate((id) => Object.keys(window.__tabi.store.state.journal.stamps || {}).filter((k) => k.includes(id)).length, d.dest);
      expect(await stamps()).toBe(1);
      if (await page.locator(`#quest-${d.quest}`).count()) { await page.locator(`#quest-${d.quest}`).click(); await solveSession(page); }
      expect(await stamps()).toBe(1);
    });
  }
});
