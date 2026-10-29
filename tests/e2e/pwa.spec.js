import { test, expect } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { watch, waitReady, waitSwReady, skipTour, solveSession } from './helpers.js';

const dist = join(process.cwd(), 'dist');

test.describe('Journey F: online load -> cache -> offline navigation and activities -> reload offline -> reconnect (AC02, AC03, J08)', () => {
  test('works offline after the first full load and recovers on reconnect', async ({ page, context }) => {
    const rec = watch(page);
    await page.goto('./'); await waitReady(page); await skipTour(page); await waitSwReady(page);
    await page.goto('./#/status'); await page.getByRole('button', { name: 'Check again' }).click();
    await expect(page.locator('#offline-indicator')).toHaveText('Ready offline');
    await context.setOffline(true);
    // navigation + an activity (lesson practice) + the map, all offline
    await page.goto('./#/explore'); await page.reload(); await waitReady(page);
    await expect(page.locator('[data-dest="tokyo"]')).toBeVisible();
    await page.goto('./#/lesson/n5_u01_l1');
    await page.getByRole('button', { name: 'Next', exact: true }).click(); await page.getByRole('button', { name: 'Next', exact: true }).click(); await page.getByRole('button', { name: 'Start practice' }).click();
    const res = await solveSession(page, { max: 6 });
    expect(res.length).toBeGreaterThanOrEqual(5);
    await page.evaluate(() => window.__tabi.store.flush());
    const facets = await page.evaluate(() => Object.keys(window.__tabi.store.state.srs).length);
    expect(facets).toBeGreaterThan(0);
    await page.reload(); await waitReady(page); // reload while offline keeps data and still renders
    expect(await page.evaluate(() => Object.keys(window.__tabi.store.state.srs).length)).toBe(facets);
    // content that was never cached shows a friendly message, not a blank screen
    await page.goto('./#/jlpt/N4');
    await expect(page.getByText(/not available offline yet|locked/i).first()).toBeVisible();
    // reconnect: the app keeps working and status is still ready
    await context.setOffline(false);
    await page.goto('./#/status'); await page.getByRole('button', { name: 'Check again' }).click();
    await expect(page.locator('#offline-indicator')).toHaveText('Ready offline');
    expect(rec.crossOrigin).toEqual([]);
  });
});

test.describe('manifest and install metadata (AC35 automatable part)', () => {
  test('manifest fields, 4 PNG icons, apple meta tags', async ({ page, request }) => {
    await page.goto('./');
    const m = await (await request.get('manifest.webmanifest')).json();
    expect(m).toMatchObject({ start_url: './#/', scope: './', display: 'standalone', background_color: '#FAF4E8', theme_color: '#233E78' });
    expect(m.id).toBe('./'); expect(m.shortcuts.map((x) => x.url)).toEqual(['./#/learn', './#/explore', './#/journal']);
    expect(m.icons.map((i) => i.sizes).sort()).toEqual(['192x192', '512x512', '512x512']);
    expect(m.icons.some((i) => i.purpose === 'maskable')).toBe(true);
    for (const src of [...m.icons.map((i) => i.src), 'icons/apple-touch-icon.png']) { const r = await request.get(src); expect(r.status()).toBe(200); expect(r.headers()['content-type']).toBe('image/png'); }
    expect(await page.locator('link[rel="apple-touch-icon"]').getAttribute('href')).toBe('./icons/apple-touch-icon.png');
    expect(await page.locator('meta[name="apple-mobile-web-app-capable"]').getAttribute('content')).toBe('yes');
    expect(await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content')).toContain("default-src 'self'");
  });
  test('service worker is scoped to the sub-path and the core precache stays under 8 MB', async ({ page, request }) => {
    await page.goto('./'); await waitReady(page); await waitSwReady(page);
    const scope = await page.evaluate(async () => (await navigator.serviceWorker.getRegistration()).scope);
    expect(scope).toMatch(/\/learn-japanese\/$/);
    const man = await (await request.get('precache-manifest.json')).json();
    expect(man.coreBytes).toBeLessThan(8 * 1024 * 1024);
    expect(man.entries.every((e) => !e.url.startsWith('/'))).toBe(true);
  });
});

test.describe('service-worker update flow: user-confirmed, data kept', () => {
  test('a new build is offered, only applied when the learner confirms, and progress survives', async ({ page }) => {
    test.setTimeout(90000);
    const swPath = join(dist, 'sw.js'); const manPath = join(dist, 'precache-manifest.json');
    const swOrig = readFileSync(swPath, 'utf8'); const manOrig = readFileSync(manPath, 'utf8');
    try {
      await page.goto('./'); await waitReady(page); await skipTour(page); await waitSwReady(page);
      await page.evaluate(() => window.__tabi.store.update('progress', (p) => ({ ...p, lessons: { keep_me: { doneAt: 1, score: 1, count: 1 } } })));
      await page.evaluate(() => window.__tabi.store.flush());
      const oldBuild = JSON.parse(manOrig).build;
      const next = 'updatetest01';
      writeFileSync(swPath, swOrig.replace(oldBuild, next));
      writeFileSync(manPath, manOrig.replace(oldBuild, next));
      await page.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); await r.update(); });
      await expect(page.getByText('An app update is ready.')).toBeVisible({ timeout: 20000 });
      // not applied yet: the page is still controlled by the old build
      expect(await page.evaluate(async () => (await caches.keys()).filter((k) => k.startsWith('jla-static-')).sort())).toEqual(expect.arrayContaining([`jla-static-${oldBuild}`, `jla-static-${next}`]));
      await page.getByRole('button', { name: 'Update now' }).click();
      await page.waitForFunction((n) => caches.keys().then((k) => !k.some((x) => x.includes('') && x !== `jla-static-${n}` && x.startsWith('jla-static-'))), next, { timeout: 20000 });
      await waitReady(page);
      expect(await page.evaluate(() => Object.keys(window.__tabi.store.state.progress.lessons))).toEqual(['keep_me']);
      await page.goto('./#/status'); await page.getByRole('button', { name: 'Check again' }).click();
      await expect(page.locator('#offline-indicator')).toHaveText('Ready offline');
    } finally { writeFileSync(swPath, swOrig); writeFileSync(manPath, manOrig); }
  });
});
