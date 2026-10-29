import { h, mount, clear } from './ui/dom.js';
import { Router } from './core/router.js';
import { routes } from './ui/routes.js';
import { registerSW, applyUpdate, checkOffline, STATUS } from './pwa/offline.js';
import { StorageFullError } from './core/storage.js';
import { createAudio } from './audio/index.js';
import { loadContent } from './content/loader.js';

const TABS = [
  { id: 'explore', label: 'Explore', icon: '🗺', href: '#/', match: (p) => p === '/' || p.startsWith('/dest') || p.startsWith('/map') || p.startsWith('/journal') || p.startsWith('/achievements') },
  { id: 'learn', label: 'Learn', icon: '📖', href: '#/learn', match: (p) => /^\/(learn|lesson|review|kana|kanji|library|speak|comeback|exercise)/.test(p) },
  { id: 'jlpt', label: 'JLPT', icon: '📝', href: '#/jlpt', match: (p) => /^\/(jlpt|mock|result|readiness|planner|practice)/.test(p) },
  { id: 'me', label: 'Me', icon: '👤', href: '#/me', match: (p) => /^\/(me|settings|audio|backup|status|credits|tour|storage|privacy|about)/.test(p) },
];

export function applyDisplaySettings(settings) {
  const root = document.documentElement;
  const theme = settings.theme;
  if (theme === 'light' || theme === 'dark') root.setAttribute('data-theme', theme); else root.removeAttribute('data-theme');
  const reduce = settings.reducedMotion === 'on' || (settings.reducedMotion === 'system' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (reduce) root.setAttribute('data-motion', 'reduce'); else root.removeAttribute('data-motion');
  root.style.fontSize = `${Math.round(100 * (settings.textScale || 1))}%`;
}

export function startApp({ store, root }) {
  const ctx = { store, ui: { notice: null }, sw: { reg: null, offline: { status: STATUS.NOT_READY } }, installPrompt: null };
  ctx.audio = createAudio({ getSettings: () => store.state.settings, updateAudio: (patch) => store.update('settings', (x) => ({ ...x, audio: { ...x.audio, ...patch } })) });
  store.subscribe(() => ctx.audio.applyGains());
  const gesture = () => { ctx.audio.touch(); ctx.audio.unlock(); };
  window.addEventListener('pointerdown', gesture, { passive: true }); window.addEventListener('keydown', gesture);
  document.addEventListener('visibilitychange', () => ctx.audio.onVisibility(document.visibilityState === 'hidden'));
  setInterval(() => { if (ctx.audio.tickInactivity()) renderBanners(); }, 60000);
  ctx.getContent = () => { ctx._content ||= loadContent().catch((e) => { ctx._content = null; throw e; }); return ctx._content; };
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); ctx.installPrompt = e; });
  const bannerHost = h('div', { id: 'banners', role: 'region', 'aria-label': 'Notices' });
  const outlet = h('main', { id: 'main', class: 'main', tabindex: '-1' });
  const live = h('div', { id: 'live', class: 'sr-only', 'aria-live': 'polite', role: 'status' });
  const title = h('h1', { class: 'app-title' }, 'Tabi Nihongo');
  const tabbar = h('nav', { class: 'tabbar', 'aria-label': 'Main' });
  const header = h('header', { class: 'app-header' }, title, h('span', { id: 'header-tools' }));
  mount(root, header, bannerHost, outlet, live, tabbar);
  ctx.announce = (msg) => { live.textContent = ''; setTimeout(() => { live.textContent = msg; }, 20); };
  ctx.refreshBanners = () => renderBanners();
  ctx.headerTools = document.getElementById('header-tools');
  const muteBtn = h('button', { class: 'btn small', type: 'button', id: 'master-mute', 'aria-pressed': String(!!store.state.settings.audio.masterMuted), 'aria-label': 'Mute all sound', onclick: () => { store.update('settings', (x) => ({ ...x, audio: { ...x.audio, masterMuted: !x.audio.masterMuted } })); } }, '🔊');
  const syncMute = () => { const m = store.state.settings.audio.masterMuted; muteBtn.setAttribute('aria-pressed', String(m)); muteBtn.textContent = m ? '🔇' : '🔊'; muteBtn.setAttribute('aria-label', m ? 'Unmute all sound' : 'Mute all sound'); };
  ctx.headerTools.append(muteBtn); syncMute(); store.subscribe(syncMute);

  function renderTabs(path) {
    clear(tabbar);
    for (const t of TABS) {
      const cur = t.match(path);
      tabbar.append(h('a', { href: t.href, 'aria-current': cur ? 'page' : null }, h('span', { class: 'ico', 'aria-hidden': 'true' }, t.icon), t.label));
    }
  }

  function renderBanners() {
    clear(bannerHost);
    const st = store.state;
    if (!store.persistent) bannerHost.append(h('div', { class: 'banner warn', role: 'alert' }, 'Your browser blocks local storage, so progress is kept in memory only and is lost when you close this tab. Export a backup often (Me → Backup).'));
    if (store.readOnlyRecovery) bannerHost.append(h('div', { class: 'banner bad', role: 'alert' }, `Saved data is from a different app version (${store.readOnlyRecovery.error}). Nothing was changed or deleted. `, h('a', { href: '#/backup' }, 'Open Backup to export your data.')));
    const q = store.storage.notices.filter((n) => n.type === 'quarantine');
    if (q.length) bannerHost.append(h('div', { class: 'banner warn', role: 'status' }, `A damaged saved item (${[...new Set(q.map((n) => n.key))].join(', ')}) was set aside, not deleted, and defaults were loaded. `, h('a', { href: '#/storage' }, 'Storage health')));
    const health = store.storage.health();
    if (health === 'urgent' || ctx.ui.storageFull) {
      bannerHost.append(h('div', { class: 'banner bad', role: 'alert' }, 'Storage is nearly full. ', h('a', { class: 'btn', href: '#/backup' }, 'Export a backup now')));
    } else if (health === 'warn') bannerHost.append(h('div', { class: 'banner warn' }, 'Storage is getting full. ', h('a', { href: '#/storage' }, 'Storage health')));
    if (ctx.audio.needsResume()) bannerHost.append(h('div', { class: 'banner info', role: 'status', id: 'resume-sound' }, 'Ambience was on last time. ', h('button', { class: 'btn small', type: 'button', onclick: () => { ctx.audio.ambience.start(null, true); renderBanners(); } }, 'Tap to resume sound')));
    if (ctx.sw.reg && ctx.sw.reg.waiting) {
      bannerHost.append(h('div', { class: 'banner info', role: 'status' }, 'An app update is ready. ', h('button', { class: 'btn small', onclick: () => applyUpdate(ctx.sw.reg) }, 'Update now'), h('span', { class: 'small' }, 'Finish what you are doing first; your progress is kept.')));
    }
    if (st.meta && !st.meta.lastExportAt && Object.keys(st.progress.lessons).length >= 3 && !ctx.ui.hideExportNudge) {
      bannerHost.append(h('div', { class: 'banner info' }, 'Tip: you have no backup yet. ', h('a', { href: '#/backup' }, 'Export a backup file'), ' so progress survives a cleared browser.'));
    }
  }

  let current = null;
  const router = new Router(routes, (loc) => {
    current = loc;
    ctx.audio.setListeningMode(false);
    if (typeof ctx.cleanup === 'function') { try { ctx.cleanup(); } catch { /* ignore */ } ctx.cleanup = null; }
    renderTabs(loc.path);
    renderBanners();
    const render = loc.route ? loc.route.render : null;
    if (!store.state.meta.tourDone && loc.path === '/' && !ctx.tourSkipped) { location.replace('#/tour'); return; }
    clear(outlet);
    if (!render) { outlet.append(h('p', null, 'Page not found. ', h('a', { href: '#/' }, 'Back to start'))); return; }
    const hideChrome = !!loc.route.immersive;
    tabbar.hidden = hideChrome;
    document.body.classList.toggle('immersive', hideChrome);
    Promise.resolve(render({ ctx, ...loc })).then((el) => {
      if (current !== loc) return;
      clear(outlet);
      if (el) outlet.append(el);
      document.title = `${loc.route.title || 'Tabi Nihongo'} · Tabi Nihongo`;
      outlet.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }).catch((e) => {
      clear(outlet);
      outlet.append(h('div', { class: 'banner bad', role: 'alert' }, 'Something went wrong showing this page. Your data is safe. ', h('a', { href: '#/' }, 'Back to start')), h('pre', { class: 'small' }, String(e && e.message)));
    });
  });
  ctx.router = router;
  ctx.rerender = () => router.resolve();

  applyDisplaySettings(store.state.settings);
  let lastSettings = store.state.settings;
  store.subscribe((state) => { if (state.settings !== lastSettings) { lastSettings = state.settings; applyDisplaySettings(state.settings); } });

  const persist = () => { try { store.flush(); } catch (e) { if (e instanceof StorageFullError) { ctx.ui.storageFull = true; renderBanners(); } } };
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') persist(); });
  window.addEventListener('pagehide', persist);
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('jla:v1:') && !e.key.includes('quarantine')) {
      store.load();
      renderBanners();
      ctx.announce('Data changed in another tab and was reloaded.');
    }
  });
  window.addEventListener('beforeunload', persist);
  try { store.flush(); } catch { /* first flush after boot */ }

  router.start();
  window.addEventListener('load', async () => {
    try { ctx.sw.reg = await registerSW(() => renderBanners()); } catch { /* offline features unavailable */ }
    ctx.sw.offline = await checkOffline();
    renderBanners();
    if (store.persistent && navigator.storage && navigator.storage.persist) { try { await navigator.storage.persist(); } catch { /* optional */ } }
  });
  window.__tabi = { store, ctx }; // test hook: inspect state only; no behaviour depends on it
  return ctx;
}
