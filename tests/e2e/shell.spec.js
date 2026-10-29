import { test, expect } from '@playwright/test';
import { watch, waitReady, waitSwReady, BASE_PATH } from './helpers.js';

test.describe('P1 shell under a GitHub-Pages style sub-path', () => {
  test('AC01: loads at /<repo>/ with no console errors, no 404s, no failed requests; AC04: zero cross-origin requests', async ({ page }) => {
    const rec = watch(page);
    await page.goto('./');
    await waitReady(page);
    await waitSwReady(page);
    await page.goto('./#/storage');
    await page.goto('./#/status');
    await page.waitForLoadState('networkidle');
    expect(rec.bad, `HTTP >= 400: ${rec.bad}`).toEqual([]);
    expect(rec.failed).toEqual([]);
    expect(rec.console).toEqual([]);
    expect(rec.crossOrigin).toEqual([]);
    for (const u of rec.requests) expect(new URL(u).pathname.startsWith(BASE_PATH), u).toBe(true);
  });

  test('deep link survives refresh (hash routing)', async ({ page }) => {
    await page.goto('./#/storage');
    await expect(page.getByRole('heading', { name: 'Storage health' })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Storage health' })).toBeVisible();
  });

  test('AC02: Ready offline only when every precache entry is in Cache Storage', async ({ page }) => {
    await page.goto('./');
    await waitReady(page);
    await waitSwReady(page);
    await page.goto('./#/status');
    await expect(page.locator('#offline-indicator')).toHaveText('Ready offline');
    // Negative: remove one cached file; the indicator must stop claiming readiness.
    const removed = await page.evaluate(async () => {
      const names = await caches.keys();
      const name = names.find((n) => n.startsWith('jla-static-'));
      const cache = await caches.open(name);
      const keys = await cache.keys();
      const victim = keys.find((k) => k.url.endsWith('.css'));
      await cache.delete(victim);
      return victim.url;
    });
    expect(removed).toContain('.css');
    await page.getByRole('button', { name: 'Check again' }).click();
    await expect(page.locator('#offline-indicator')).toHaveText('Partially ready');
  });

  test('manifest and icons resolve under the sub-path', async ({ request }) => {
    const m = await (await request.get('manifest.webmanifest')).json();
    expect(m.start_url).toBe('./#/');
    expect(m.scope).toBe('./');
    for (const i of m.icons) expect((await request.get(i.src)).status()).toBe(200);
    expect((await request.get('icons/apple-touch-icon.png')).status()).toBe(200);
  });
});
