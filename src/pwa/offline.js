// Offline readiness is verified against Cache Storage, never assumed (AC02 / R006).
export const STATUS = { READY: 'ready', DOWNLOADING: 'downloading', PARTIAL: 'partial', UPDATE: 'update', NOT_READY: 'not_ready', UNSUPPORTED: 'unsupported' };

const baseUrl = () => new URL('./', document.baseURI).href;
const abs = (u) => new URL(u, baseUrl()).href;

/** Pure: compare expected entries with cached request URLs. */
export function compareCache(entries, cachedUrls) {
  const have = new Set(cachedUrls);
  const missing = entries.filter((e) => !have.has(e.url)).map((e) => e.url);
  return { total: entries.length, present: entries.length - missing.length, missing };
}

export async function readManifest() {
  const res = await fetch(abs('precache-manifest.json'), { cache: 'no-cache' });
  if (!res.ok) throw new Error('manifest');
  return res.json();
}

export async function checkOffline(deps = {}) {
  const hasSw = 'serviceWorker' in navigator && typeof caches !== 'undefined';
  if (!hasSw) return { status: STATUS.UNSUPPORTED, missing: [], present: 0, total: 0 };
  try {
    const manifest = deps.manifest || await readManifest();
    const cache = await caches.open(`jla-static-${manifest.build}`);
    const keys = (await cache.keys()).map((r) => r.url);
    const entries = manifest.entries.map((e) => ({ url: abs(e.url) }));
    const cmp = compareCache(entries, keys.map((k) => k.split('#')[0]));
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg && reg.waiting) return { status: STATUS.UPDATE, ...cmp, build: manifest.build };
    if (cmp.missing.length === 0 && reg && reg.active) return { status: STATUS.READY, ...cmp, build: manifest.build };
    if (reg && reg.installing) return { status: STATUS.DOWNLOADING, ...cmp, build: manifest.build };
    return { status: cmp.present > 0 ? STATUS.PARTIAL : STATUS.NOT_READY, ...cmp, build: manifest.build };
  } catch {
    return { status: STATUS.NOT_READY, missing: [], present: 0, total: 0 };
  }
}

export async function registerSW(onUpdate) {
  if (!('serviceWorker' in navigator)) return null;
  if (import.meta.env && import.meta.env.DEV) return null;
  const reg = await navigator.serviceWorker.register('./sw.js', { scope: './' });
  const notify = () => { if (reg.waiting && navigator.serviceWorker.controller) onUpdate(reg); };
  reg.addEventListener('updatefound', () => {
    const w = reg.installing;
    if (w) w.addEventListener('statechange', () => { if (w.state === 'installed') notify(); });
  });
  notify();
  return reg;
}

/** User-confirmed update: tell the waiting worker to activate, then reload once it controls the page. */
export function applyUpdate(reg) {
  if (!reg || !reg.waiting) return;
  navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), { once: true });
  reg.waiting.postMessage({ type: 'SKIP_WAITING' });
}
