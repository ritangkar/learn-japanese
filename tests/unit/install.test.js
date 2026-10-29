import { describe, it, expect, beforeEach, vi } from 'vitest';
import { detectPlatform, createInstall } from '../../src/pwa/install.js';

const UA = {
  iphoneSafari: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
  iphoneChrome: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/123.0 Mobile/15E148 Safari/604.1',
  iphoneFirefox: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/124.0 Mobile/15E148 Safari/605.1.15',
  android: 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36',
  desktop: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
};
const mq = (standalone) => (q) => ({ matches: standalone && /standalone/.test(q), addEventListener() {} });
const fakeWin = ({ standalone = false } = {}) => {
  const listeners = {};
  return { listeners, matchMedia: mq(standalone), document: { referrer: '' }, addEventListener: (t, f) => { (listeners[t] ||= []).push(f); }, emit: (t, e) => (listeners[t] || []).forEach((f) => f(e)) };
};
const store = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }; };

describe('detectPlatform', () => {
  it('recognises iPhone Safari, other iOS browsers, Android and desktop', () => {
    const w = fakeWin();
    expect(detectPlatform({ userAgent: UA.iphoneSafari, platform: 'iPhone' }, w)).toMatchObject({ ios: true, iosSafari: true, standalone: false });
    expect(detectPlatform({ userAgent: UA.iphoneChrome, platform: 'iPhone' }, w)).toMatchObject({ ios: true, iosSafari: false });
    expect(detectPlatform({ userAgent: UA.iphoneFirefox, platform: 'iPhone' }, w)).toMatchObject({ ios: true, iosSafari: false });
    expect(detectPlatform({ userAgent: UA.android, platform: 'Linux armv8l' }, w)).toMatchObject({ ios: false, android: true });
    expect(detectPlatform({ userAgent: UA.desktop, platform: 'Linux x86_64' }, w)).toMatchObject({ ios: false, android: false });
  });
  it('treats iPadOS (desktop-class user agent with touch) as iOS', () => {
    expect(detectPlatform({ userAgent: UA.desktop.replace('Linux x86_64', 'Macintosh; Intel Mac OS X 10_15_7'), platform: 'MacIntel', maxTouchPoints: 5 }, fakeWin()).ios).toBe(true);
  });
  it('detects standalone via display-mode and via navigator.standalone', () => {
    expect(detectPlatform({ userAgent: UA.android }, fakeWin({ standalone: true })).standalone).toBe(true);
    expect(detectPlatform({ userAgent: UA.iphoneSafari, standalone: true }, fakeWin()).standalone).toBe(true);
    expect(detectPlatform({ userAgent: UA.android }, fakeWin()).standalone).toBe(false);
  });
});

describe('install controller', () => {
  let win;
  beforeEach(() => { win = fakeWin(); vi.stubGlobal('window', win); vi.stubGlobal('localStorage', store()); vi.stubGlobal('navigator', { userAgent: UA.android, platform: 'Linux armv8l' }); });
  const promptEvent = (outcome = 'accepted') => { let prevented = false; return { preventDefault: () => { prevented = true; }, prompt: vi.fn(async () => {}), userChoice: Promise.resolve({ outcome }), get prevented() { return prevented; } }; };

  it('offers nothing until the browser fires beforeinstallprompt (no fake button on browsers with no install path)', () => {
    const inst = createInstall(win);
    expect(inst.mode()).toBe('manual'); expect(inst.shouldOffer()).toBe(false);
    win.emit('beforeinstallprompt', promptEvent());
    expect(inst.mode()).toBe('prompt'); expect(inst.shouldOffer()).toBe(true);
  });
  it('stashes the event (preventDefault) and calls prompt() only from prompt(); accepted -> installed', async () => {
    const inst = createInstall(win); const ev = promptEvent('accepted');
    win.emit('beforeinstallprompt', ev); expect(ev.prevented).toBe(true); expect(ev.prompt).not.toHaveBeenCalled();
    expect(await inst.prompt()).toBe('accepted'); expect(ev.prompt).toHaveBeenCalledTimes(1);
    expect(inst.mode()).toBe('installed'); expect(inst.shouldOffer()).toBe(false);
    expect(await inst.prompt()).toBe('unavailable'); // the event can only be used once
  });
  it('a dismissed native prompt snoozes the suggestion for 14 days and is not offered again until then', async () => {
    const inst = createInstall(win); win.emit('beforeinstallprompt', promptEvent('dismissed'));
    expect(await inst.prompt()).toBe('dismissed');
    win.emit('beforeinstallprompt', promptEvent());
    const now = Date.now();
    expect(inst.shouldOffer(now)).toBe(false); expect(inst.shouldOffer(now + 13 * 86400000)).toBe(false); expect(inst.shouldOffer(now + 15 * 86400000)).toBe(true);
  });
  it('"Not now" snoozes; resetDismissal brings the card back', () => {
    const inst = createInstall(win); win.emit('beforeinstallprompt', promptEvent());
    inst.dismiss(); expect(inst.shouldOffer()).toBe(false); inst.resetDismissal(); expect(inst.shouldOffer()).toBe(true);
  });
  it('appinstalled marks the app as installed', () => {
    const inst = createInstall(win); win.emit('beforeinstallprompt', promptEvent()); win.emit('appinstalled', {});
    expect(inst.mode()).toBe('installed'); expect(inst.shouldOffer()).toBe(false);
  });
  it('standalone launches are always "installed"; iOS Safari gets manual steps, other iOS browsers are told to use Safari', () => {
    const w2 = fakeWin({ standalone: true }); vi.stubGlobal('window', w2); expect(createInstall(w2).mode()).toBe('installed');
    vi.stubGlobal('window', win);
    vi.stubGlobal('navigator', { userAgent: UA.iphoneSafari, platform: 'iPhone' }); expect(createInstall(win).mode()).toBe('ios');
    vi.stubGlobal('navigator', { userAgent: UA.iphoneChrome, platform: 'iPhone' }); expect(createInstall(win).mode()).toBe('ios-other-browser');
    expect(createInstall(win).shouldOffer()).toBe(true);
  });
  it('the dismissal lives outside the learner data namespace (not exported with backups, not part of progress)', () => {
    const ls = store(); vi.stubGlobal('localStorage', ls); const inst = createInstall(win); inst.dismiss();
    expect(ls.getItem('jla:ui:install-dismissed')).not.toBeNull(); expect('jla:ui:install-dismissed'.startsWith('jla:v1:')).toBe(false);
  });
});
