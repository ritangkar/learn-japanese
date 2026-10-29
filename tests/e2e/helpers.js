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
    return !!(reg && reg.active);
  })).toBe(true);
}

/** Dismiss the first-run tour state so tests start on the normal screens. */
export async function skipTour(page) {
  await page.evaluate(() => {
    const raw = localStorage.getItem('jla:v1:meta');
    const meta = raw ? JSON.parse(raw) : { schemaVersion: 1, createdAt: Date.now() };
    meta.tourDone = true;
    localStorage.setItem('jla:v1:meta', JSON.stringify(meta));
  });
}
