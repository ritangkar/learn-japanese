/* Hand-written service worker (no libraries). Build values are injected by scripts/build-precache.mjs. */
const BUILD = '__BUILD__';
const PRECACHE = /*__PRECACHE__*/ []; // [{url, rev}] relative to the service-worker scope
const CONTENT_VERSION = '__CONTENT_VERSION__';
const STATIC_CACHE = `jla-static-${BUILD}`;
const CONTENT_CACHE = `jla-content-${CONTENT_VERSION}`;
const SCOPE = self.registration.scope;
const abs = (u) => new URL(u, SCOPE).href;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(STATIC_CACHE);
    // addAll rejects (install fails, previous version keeps serving) if any precache entry fails.
    await cache.addAll(PRECACHE.map((e) => new Request(abs(e.url), { cache: 'reload' })));
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keep = new Set([STATIC_CACHE, CONTENT_CACHE]);
    for (const k of await caches.keys()) {
      if ((k.startsWith('jla-static-') || k.startsWith('jla-content-')) && !keep.has(k)) await caches.delete(k);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  const d = event.data || {};
  if (d.type === 'SKIP_WAITING') self.skipWaiting();
  if (d.type === 'GET_BUILD') event.source && event.source.postMessage({ type: 'BUILD', build: BUILD });
});

const withTimeout = (p, ms) => new Promise((res, rej) => { const t = setTimeout(() => rej(new Error('timeout')), ms); p.then((v) => { clearTimeout(t); res(v); }, (e) => { clearTimeout(t); rej(e); }); });

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // never touch cross-origin requests
  event.respondWith((async () => {
    const staticCache = await caches.open(STATIC_CACHE);
    if (req.mode === 'navigate') {
      try {
        const res = await withTimeout(fetch(req), 3000);
        if (res && res.ok) return res;
        throw new Error('bad status');
      } catch {
        return (await staticCache.match(abs('index.html'))) || (await staticCache.match(abs('./'))) || Response.error();
      }
    }
    const hit = await staticCache.match(req, { ignoreSearch: true });
    if (hit) return hit; // precached assets: cache-first (URLs carry content hashes)
    const rel = url.href.slice(SCOPE.length);
    if (rel.startsWith('content/')) {
      const cc = await caches.open(CONTENT_CACHE);
      const cached = await cc.match(req);
      const network = fetch(req).then((res) => { if (res && res.ok) cc.put(req, res.clone()); return res; }).catch(() => null);
      if (cached) { network.catch(() => {}); return cached; } // stale-while-revalidate
      return (await network) || Response.error();
    }
    try { return await fetch(req); } catch { return Response.error(); }
  })());
});
