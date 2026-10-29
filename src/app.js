import { h, mount, clear } from './ui/dom.js';
import { Router } from './core/router.js';
import { routes } from './ui/routes.js';
import { registerSW, applyUpdate, checkOffline, STATUS } from './pwa/offline.js';
import { StorageFullError } from './core/storage.js';
import { createAudio } from './audio/index.js';
import { loadContent } from './content/loader.js';
import { icon } from './ui/icons.js';
import { setBackHook } from './ui/common.js';
import { createInstall } from './pwa/install.js';
import { sceneSvg } from './map/scenes.js';
import { stampSvg } from './map/stamps.js';
import { SCENES } from './map/scenes.js';
import { openModal, confirmDialog, confetti } from './ui/components.js';
import { dayToDate } from './core/clock.js';
import { today as todayDay } from './ui/env.js';

const FULL_TOKYO = new Set(['n5_u01', 'n5_u02', 'n5_u03', 'n5_u05']);
const TABS = [
  { id: 'home', label: 'Home', icon: 'home', href: '#/', match: (p) => p === '/' || p === '/summary' },
  { id: 'explore', label: 'Explore', icon: 'map', href: '#/explore', match: (p) => p.startsWith('/explore') || p.startsWith('/dest') || p.startsWith('/tokyo') || p.startsWith('/map') },
  { id: 'learn', label: 'Learn', icon: 'book', href: '#/learn', match: (p) => /^\/(learn|lesson|review|kana|kanji|library|speak|comeback|exercise|activity|quest|drill)/.test(p) },
  { id: 'jlpt', label: 'JLPT', icon: 'exam', href: '#/jlpt', match: (p) => /^\/(jlpt|mock|result|readiness|planner|practice|exam)/.test(p) },
  { id: 'journal', label: 'Journal', icon: 'stamp', href: '#/journal', match: (p) => p.startsWith('/journal') || p.startsWith('/achievements') },
];

/** Where the header "back" button goes. Deterministic (a parent screen), so it never depends on browser history. */
export function parentOf(path) {
  const seg = path.split('/').filter(Boolean);
  if (!seg.length || ['explore', 'learn', 'jlpt', 'journal', 'summary'].includes(path.slice(1))) return null;
  const [a, b] = seg;
  if (a === 'dest' || a === 'tokyo') return { href: '#/explore', label: 'Explore' };
  if (a === 'achievements') return { href: '#/journal', label: 'Journal' };
  if (a === 'lesson' || a === 'review' || a === 'activity' || a === 'drill' || a === 'kana' || a === 'speak' || a === 'library') return { href: '#/learn', label: 'Learn' };
  if (a === 'kanji') return { href: '#/library', label: 'Library' };
  if (a === 'quest') return { href: '#/explore', label: 'Explore' };
  if (a === 'jlpt' && b) return { href: '#/jlpt', label: 'JLPT' };
  if (a === 'mock') return { href: '#/jlpt', label: 'JLPT' };
  if (a === 'exam' || a === 'readiness' || a === 'planner') return { href: '#/jlpt', label: 'JLPT' };
  if (a === 'me') return { href: '#/', label: 'Home' };
  if (['settings', 'audio', 'backup', 'storage', 'status', 'content', 'privacy', 'about', 'credits', 'tour'].includes(a)) return { href: '#/me', label: 'Me' };
  return { href: '#/', label: 'Home' };
}

export function applyDisplaySettings(settings) {
  const root = document.documentElement;
  const theme = settings.theme;
  if (theme === 'light' || theme === 'dark') root.setAttribute('data-theme', theme); else root.removeAttribute('data-theme');
  const reduce = settings.reducedMotion === 'on' || (settings.reducedMotion === 'system' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (reduce) root.setAttribute('data-motion', 'reduce'); else root.removeAttribute('data-motion');
  root.style.fontSize = `${Math.round(100 * (settings.textScale || 1))}%`;
}

export function startApp({ store, root }) {
  const ctx = { store, ui: { notice: null }, sw: { reg: null, offline: { status: STATUS.NOT_READY } }, install: createInstall(), leaveGuard: null };
  ctx.audio = createAudio({ getSettings: () => store.state.settings, updateAudio: (patch) => store.update('settings', (x) => ({ ...x, audio: { ...x.audio, ...patch } })) });
  store.subscribe(() => ctx.audio.applyGains());
  const gesture = () => { ctx.audio.touch(); ctx.audio.unlock(); };
  window.addEventListener('pointerdown', gesture, { passive: true }); window.addEventListener('keydown', gesture);
  document.addEventListener('visibilitychange', () => ctx.audio.onVisibility(document.visibilityState === 'hidden'));
  setInterval(() => { if (ctx.audio.tickInactivity()) renderBanners(); }, 60000);
  ctx.getContent = () => { ctx._content ||= loadContent().catch((e) => { ctx._content = null; throw e; }); return ctx._content; };
  const bannerHost = h('div', { id: 'banners', role: 'region', 'aria-label': 'Notices' });
  const outlet = h('main', { id: 'main', class: 'main', tabindex: '-1' });
  const live = h('div', { id: 'live', class: 'sr-only', 'aria-live': 'polite', role: 'status' });
  const titleText = h('span', null, 'Tabi Nihongo');
  const title = h('h1', { class: 'app-title' }, icon('torii', { size: 24, cls: 'brand-mark' }), titleText);
  const tabbar = h('nav', { class: 'tabbar', 'aria-label': 'Main' });
  const backSlot = h('span', { id: 'header-back' });
  const headerBrand = h('span', { class: 'brand-slot' });
  const header = h('header', { class: 'app-header' }, backSlot, title, h('span', { id: 'header-tools' }));
  const sceneBg = h('div', { class: 'scene-bg', 'aria-hidden': 'true', id: 'scene-bg' }, h('div', { class: 'layer' }), h('div', { class: 'layer' }));
  const shell = h('div', { class: 'app-shell' }, header, bannerHost, outlet, live);
  mount(root, sceneBg, shell, tabbar);
  void headerBrand;
  ctx.announce = (msg) => { live.textContent = ''; setTimeout(() => { live.textContent = msg; }, 20); };
  ctx.refreshBanners = () => renderBanners();
  ctx.headerTools = document.getElementById('header-tools');
  const muteBtn = h('button', { class: 'icon-btn', type: 'button', id: 'master-mute', 'aria-pressed': String(!!store.state.settings.audio.masterMuted), 'aria-label': 'Mute all sound', onclick: () => { store.update('settings', (x) => ({ ...x, audio: { ...x.audio, masterMuted: !x.audio.masterMuted } })); } });
  const meLink = h('a', { class: 'icon-btn', href: '#/me', id: 'header-me', 'aria-label': 'Profile and settings' }, icon('user'));
  const syncMute = () => { const m = store.state.settings.audio.masterMuted; muteBtn.setAttribute('aria-pressed', String(m)); muteBtn.replaceChildren(icon(m ? 'mute' : 'volume')); muteBtn.setAttribute('aria-label', m ? 'Unmute all sound' : 'Mute all sound'); };
  ctx.headerTools.append(muteBtn, meLink); syncMute(); store.subscribe(syncMute);

  // --- location-aware backdrop: crossfades between destination scenes; never required for reading (cards sit on opaque surfaces) ---
  let sceneShown = null; let layerIdx = 0;
  ctx.setScene = (destId, { done } = {}) => {
    const doneSet = done || FULL_TOKYO; // page backdrops always show the complete scene; the layered reveal is kept for small cards
    const id = destId && SCENES[destId] ? destId : null;
    const key = id || null;
    document.body.classList.toggle('has-scene', !!id);
    outlet.classList.toggle('has-hero', !!id);
    if (key === sceneShown) return;
    sceneShown = key;
    if (!id) return;
    const layers = sceneBg.querySelectorAll('.layer');
    const next = layers[layerIdx % 2]; const prev = layers[(layerIdx + 1) % 2]; layerIdx++;
    next.replaceChildren(sceneSvg(id, { done: doneSet, cover: true, decorative: true }));
    next.classList.add('on'); prev.classList.remove('on');
    sceneBg.dataset.scene = id;
  };
  ctx.currentDestId = () => store.state.progress.currentDestination || 'tokyo';

  // --- navigation guard: closing a session with answers in progress asks first (answers already given are saved for review) ---
  ctx.confirmLeave = async (href) => {
    if (ctx.leaveGuard && ctx.leaveGuard()) {
      const ok = await confirmDialog({ title: 'Leave this session?', text: 'Your answers so far are saved for review, but this lesson or quest will not count as finished until you complete it.', confirmLabel: 'Leave', cancelLabel: 'Keep going', danger: true });
      if (!ok) return false;
    }
    ctx.leaveGuard = null; location.hash = href; return true;
  };

  // --- stamp awarding moment (called by the screens that earn a stamp; never on restore/import) ---
  ctx.celebrateStamp = async (content, destId) => {
    const d = content.destById.get(destId); if (!d) return;
    const st = store.state.journal.stamps[d.rewards.stamp_id];
    const art = stampSvg(d, { day: st ? st.day : todayDay(), motifs: SCENES[destId]?.motifs || [], pressed: true });
    ctx.audio.sfx('fb_stamp');
    confetti(ctx, 22);
    const view = h('div', { class: 'award', id: 'stamp-award' }, h('div', { class: 'paper-page' }, art), h('p', { class: 'eyebrow' }, 'New stamp collected'), h('h2', { style: 'margin:0' }, `${d.name_en} `, h('span', { lang: 'ja', class: 'ja' }, d.name_ja)), h('p', { style: 'margin:0' }, `Added to your stamp book on ${dayToDate(st ? st.day : todayDay())}.`));
    const r = await openModal({ title: 'Stamp earned', id: 'award', body: view, actions: [{ label: 'Keep going', value: 'continue', cancel: true, id: 'award-continue' }, { label: 'See my stamp book', value: 'book', kind: 'primary', id: 'award-book' }] });
    if (r === 'book') location.hash = '#/journal';
  };

  function renderTabs(path) {
    clear(tabbar);
    for (const t of TABS) {
      const cur = t.match(path);
      tabbar.append(h('a', { href: t.href, 'aria-current': cur ? 'page' : null, 'data-tab': t.id }, h('span', { class: 'tab-ico' }, icon(t.icon, { size: 22 })), t.label));
    }
  }
  setBackHook((href, label) => { ctx.backOverride = { href, label }; });
  function renderBack(path, immersive) {
    clear(backSlot);
    const par = ctx.backOverride || parentOf(path);
    if (!par) return;
    const closeIcon = immersive ? 'close' : 'back';
    backSlot.append(h('a', { class: 'icon-btn', id: 'header-back-btn', href: par.href, 'aria-label': immersive ? `Close and go back to ${par.label}` : `Back to ${par.label}`, onclick: (e) => { if (ctx.leaveGuard && ctx.leaveGuard()) { e.preventDefault(); ctx.confirmLeave(par.href); } } }, icon(closeIcon)));
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
    ctx.leaveGuard = null; ctx.backOverride = null;
    renderTabs(loc.path);
    renderBanners();
    const render = loc.route ? loc.route.render : null;
    if (!store.state.meta.tourDone && loc.path === '/' && !ctx.tourSkipped) { location.replace('#/tour'); return; }
    clear(outlet);
    if (!render) { outlet.append(h('p', null, 'Page not found. ', h('a', { href: '#/' }, 'Back to start'))); return; }
    const hideChrome = !!loc.route.immersive;
    renderBack(loc.path, hideChrome);
    titleText.textContent = loc.path === '/' ? 'Tabi Nihongo' : (loc.route.title || 'Tabi Nihongo');
    if (loc.route.scene === 'current') ctx.setScene(ctx.currentDestId()); else if (!loc.route.scene) ctx.setScene(null);
    tabbar.hidden = hideChrome;
    document.body.classList.toggle('immersive', hideChrome);
    Promise.resolve(render({ ctx, ...loc })).then((el) => {
      if (current !== loc) return;
      clear(outlet);
      if (el) outlet.append(el);
      renderBack(loc.path, hideChrome);
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
