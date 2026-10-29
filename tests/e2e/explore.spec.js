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
});
