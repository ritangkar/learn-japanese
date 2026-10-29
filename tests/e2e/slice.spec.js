import { test, expect } from '@playwright/test';
import { watch, waitReady, solveSession, skipTour, waitSwReady } from './helpers.js';

// Completes one lesson through the UI: explanation pages, practice, optional context, exit check.
async function doLesson(page, id) {
  await page.goto(`./#/lesson/${id}`);
  await expect(page.locator('.lesson-head h2')).toBeVisible();
  for (let i = 0; i < 8; i++) { const next = page.getByRole('button', { name: 'Next', exact: true }); if (await next.count()) await next.click(); else break; }
  await page.getByRole('button', { name: 'Start practice' }).click();
  for (let i = 0; i < 6; i++) {
    await solveSession(page);
    const cont = page.locator('.summary').getByRole('button', { name: /Continue|Finish/ });
    if (await cont.count()) await cont.click(); else break;
    if (await page.getByRole('heading', { name: /Lesson complete/ }).count()) break;
  }
  await expect(page.getByRole('heading', { name: /Lesson complete/ })).toBeVisible();
}

test.describe('VERTICAL SLICE: unit + Tokyo destination + review loop + export/import + offline', () => {
  test('N5 units 1-2, Tokyo quest -> stamp, review loop, export -> clean profile -> import, offline run', async ({ page, context, browser }) => {
    test.setTimeout(240000);
    const rec = watch(page);
    await page.goto('./'); await waitReady(page); await skipTour(page); await waitSwReady(page);
    // Tokyo starts "available" and the map shows it
    await expect(page.locator('[data-dest="tokyo"]')).toHaveAttribute('data-state', 'available');
    // unit n5_u01 and n5_u02 through the UI
    for (const l of ['n5_u01_l1', 'n5_u01_l2', 'n5_u01_l3', 'n5_u01_l4', 'n5_u01_l5', 'n5_u01_l6', 'n5_u01_l7']) await doLesson(page, l);
    for (const l of ['n5_u02_l1', 'n5_u02_l2', 'n5_u02_l3', 'n5_u02_l4', 'n5_u02_l5', 'n5_u02_l6', 'n5_u02_l7']) await doLesson(page, l);
    const units = await page.evaluate(() => Object.keys(window.__tabi.store.state.progress.units));
    expect(units).toEqual(expect.arrayContaining(['n5_u01', 'n5_u02']));
    // Tokyo quest: stamp only after the quest meets 80 %
    await page.goto('./#/dest/tokyo');
    await page.locator('#quest-q_tokyo_1').click();
    await solveSession(page, { correct: () => true });
    await expect(page.getByText(/Stamp earned: Tokyo/)).toBeVisible();
    const j = await page.evaluate(() => ({ stamps: Object.keys(window.__tabi.store.state.journal.stamps), post: Object.keys(window.__tabi.store.state.journal.postcards), dest: window.__tabi.store.state.progress.destinations.tokyo }));
    expect(j.stamps).toEqual(['stamp_tokyo']); expect(j.post).toEqual(['postcard_tokyo']); expect(j.dest.completedAt).toBeDefined();
    // replay never duplicates
    await page.goto('./#/dest/tokyo'); await page.locator('#quest-q_tokyo_1').click(); await solveSession(page);
    expect(await page.evaluate(() => Object.keys(window.__tabi.store.state.journal.stamps).length)).toBe(1);
    // map reflects completion
    await page.goto('./#/'); await expect(page.locator('[data-dest="tokyo"]')).toHaveAttribute('data-state', 'completed');
    // review loop: make some facets due, run the review
    await page.evaluate(() => { const st = window.__tabi.store; const recs = Object.values(st.state.srs).slice(0, 12).map((r) => { const c = [...r]; c[1] = 0; return c; }); st.putFacets(recs); });
    await page.goto('./#/review'); const rev = await solveSession(page); expect(rev.length).toBeGreaterThanOrEqual(10);
    await expect(page.getByRole('heading', { name: 'Review done' })).toBeVisible();
    // export
    await page.evaluate(() => window.__tabi.store.flush());
    await page.goto('./#/backup');
    const [dl] = await Promise.all([page.waitForEvent('download'), page.locator('#do-export').click()]);
    const path = await dl.path(); const fs = await import('node:fs'); const text = fs.readFileSync(path, 'utf8');
    expect(dl.suggestedFilename()).toMatch(/^japan-journey-backup-\d{8}-\d{4}\.json$/);
    const snapshot = await page.evaluate(() => ({ lessons: Object.keys(window.__tabi.store.state.progress.lessons).length, stamps: Object.keys(window.__tabi.store.state.journal.stamps).length, facets: Object.keys(window.__tabi.store.state.srs).length }));
    // clean profile (fresh context) -> import -> restored
    const ctx2 = await browser.newContext({ baseURL: page.url().split('#')[0] }); const p2 = await ctx2.newPage();
    await p2.goto('./'); await waitReady(p2); await skipTour(p2); await p2.goto('./#/backup');
    await p2.locator('#import-file').setInputFiles({ name: 'b.json', mimeType: 'application/json', buffer: Buffer.from(text) });
    await expect(p2.locator('#import-preview')).toContainText('Backup preview');
    await expect(p2.locator('#do-restore')).toBeDisabled();
    await p2.locator('#confirm-overwrite').check(); await p2.locator('#do-restore').click();
    await expect(p2.locator('#backup-status')).toContainText('Restored');
    const restored = await p2.evaluate(() => ({ lessons: Object.keys(window.__tabi.store.state.progress.lessons).length, stamps: Object.keys(window.__tabi.store.state.journal.stamps).length, facets: Object.keys(window.__tabi.store.state.srs).length }));
    expect(restored).toEqual(snapshot);
    await ctx2.close();
    // offline: the app, a lesson page and the map still work after going offline
    await page.goto('./#/status'); await page.getByRole('button', { name: 'Check again' }).click();
    await expect(page.locator('#offline-indicator')).toHaveText('Ready offline');
    await context.setOffline(true);
    await page.reload(); await waitReady(page);
    await page.evaluate(() => { location.hash = '#/'; });
    await expect(page.locator('[data-dest="tokyo"]')).toBeVisible();
    await page.goto('./#/review'); await expect(page.locator('main')).toBeVisible();
    await page.goto('./#/lesson/n5_u01_l1'); await expect(page.locator('.lesson-head h2')).toBeVisible();
    await context.setOffline(false);
    expect(rec.crossOrigin).toEqual([]);
  });
});
