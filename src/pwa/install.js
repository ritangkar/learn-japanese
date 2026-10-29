// Install experience. Browsers differ, so each platform gets what it can really do:
//  - Chromium (Android, desktop): the browser fires `beforeinstallprompt`; we keep the event and call prompt() from our own button.
//  - iPhone / iPad Safari: there is no install API; we show accurate Share -> "Add to Home Screen" steps and never claim success.
//  - iOS browsers other than Safari cannot install web apps: we say so and ask the learner to open the page in Safari.
//  - Browsers without either path (e.g. desktop Firefox/Safari): a short, honest note, no fake button.
// An installed (standalone) app never shows any install prompt. A dismissal is remembered for 14 days (UI preference only, not learner data).

const KEY = 'jla:ui:install-dismissed';
const SNOOZE_MS = 14 * 24 * 3600 * 1000;

export function detectPlatform(nav = navigator, win = window) {
  const ua = nav.userAgent || '';
  const ios = /iPhone|iPad|iPod/.test(ua) || (nav.platform === 'MacIntel' && nav.maxTouchPoints > 1);
  const iosSafari = ios && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA\//.test(ua) && /Safari/.test(ua);
  const standalone = !!((win.matchMedia && (win.matchMedia('(display-mode: standalone)').matches || win.matchMedia('(display-mode: fullscreen)').matches || win.matchMedia('(display-mode: minimal-ui)').matches)) || nav.standalone === true || (win.document && win.document.referrer.startsWith('android-app://')));
  return { ios, iosSafari, standalone, android: /Android/.test(ua) };
}

const read = () => { try { return Number(localStorage.getItem(KEY)) || 0; } catch { return 0; } };
const write = (v) => { try { if (v) localStorage.setItem(KEY, String(v)); else localStorage.removeItem(KEY); } catch { /* storage unavailable: the card may show again, which is harmless */ } };

export function createInstall(win = window) {
  const subs = new Set();
  let deferred = null; let installedNow = false; let outcome = null;
  const notify = () => subs.forEach((f) => f());
  win.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; notify(); });
  win.addEventListener('appinstalled', () => { installedNow = true; deferred = null; outcome = 'accepted'; notify(); });
  const mq = win.matchMedia ? win.matchMedia('(display-mode: standalone)') : null;
  if (mq && mq.addEventListener) mq.addEventListener('change', notify);

  const api = {
    /** 'installed' | 'prompt' (native prompt available) | 'ios' | 'ios-other-browser' | 'manual' */
    mode() {
      const p = detectPlatform();
      if (p.standalone || installedNow) return 'installed';
      if (deferred) return 'prompt';
      if (p.ios) return p.iosSafari ? 'ios' : 'ios-other-browser';
      return 'manual';
    },
    /** Should a proactive card be shown now? Never when installed, never while snoozed, never on platforms with no real install path. */
    shouldOffer(now = Date.now()) {
      const m = api.mode();
      if (m === 'installed' || m === 'manual') return false;
      return now - read() > SNOOZE_MS;
    },
    dismiss(now = Date.now()) { write(now); notify(); },
    resetDismissal() { write(0); notify(); },
    dismissedAt: read,
    async prompt() {
      if (!deferred) return 'unavailable';
      const ev = deferred; deferred = null; notify();
      await ev.prompt();
      const choice = await ev.userChoice; outcome = choice && choice.outcome;
      if (outcome === 'accepted') installedNow = true; else write(Date.now());
      notify();
      return outcome;
    },
    lastOutcome: () => outcome,
    subscribe(f) { subs.add(f); return () => subs.delete(f); },
  };
  return api;
}
