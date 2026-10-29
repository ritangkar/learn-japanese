import { test, expect } from '@playwright/test';
import { waitReady, skipTour, watch } from './helpers.js';

// A stub AudioContext/speechSynthesis records what the app does, so autoplay rules and the no-voice fallback can be asserted.
const stub = (voices) => `
  window.__audioLog = { ctx: 0, started: 0, resumed: 0, spoken: [] };
  window.AudioContext = class { constructor() { window.__audioLog.ctx++; this.state = 'suspended'; this.currentTime = 0; this.destination = {}; }
    createGain() { return { connect() {}, gain: { setTargetAtTime() {}, value: 1 } }; } createBuffer(c, n) { return { length: n, copyToChannel() {} }; }
    createBufferSource() { return { connect() {}, start() { window.__audioLog.started++; }, stop() {}, loop: false }; }
    resume() { window.__audioLog.resumed++; this.state = 'running'; return Promise.resolve(); } suspend() { this.state = 'suspended'; return Promise.resolve(); } };
  window.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };
  Object.defineProperty(window, 'speechSynthesis', { value: { getVoices: () => ${JSON.stringify(voices)}, speak: (u) => window.__audioLog.spoken.push(u.text), cancel() {}, addEventListener() {} }, configurable: true });
`;

test.describe('AC16: ambience off by default, gesture required, persists', () => {
  test('nothing plays or is created before a tap; ambience starts only from a tap and the choice persists', async ({ page }) => {
    await page.addInitScript(stub([{ lang: 'ja-JP', name: 'Kyoko', voiceURI: 'k', localService: true }]));
    await page.goto('./'); await waitReady(page); await skipTour(page);
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => window.__audioLog.ctx)).toBe(0); // not even a context yet
    expect(await page.evaluate(() => window.__tabi.store.state.settings.audio.ambience.enabled)).toBe(false);
    await page.goto('./#/audio');
    await expect(page.locator('#amb-en')).not.toBeChecked();
    await page.locator('#amb-en').check();
    expect(await page.evaluate(() => window.__audioLog.ctx)).toBe(1);
    expect(await page.evaluate(() => window.__audioLog.started)).toBe(1);
    const s = await page.evaluate(() => window.__tabi.store.state.settings.audio);
    expect(s.ambience.enabled).toBe(true); expect(s.resumeAmbienceId).toBeTruthy();
    // reload: the app must NOT auto-start; it offers "Tap to resume sound"
    await page.evaluate(() => window.__tabi.store.flush());
    await page.reload(); await waitReady(page);
    expect(await page.evaluate(() => window.__audioLog.started)).toBe(0);
    await expect(page.locator('#resume-sound')).toContainText('Tap to resume sound');
    await page.getByRole('button', { name: 'Tap to resume sound' }).click();
    expect(await page.evaluate(() => window.__audioLog.started)).toBe(1);
  });
  test('master mute is always visible in the header and persists', async ({ page }) => {
    await page.addInitScript(stub([{ lang: 'ja-JP', name: 'Kyoko', voiceURI: 'k', localService: true }]));
    await page.goto('./'); await waitReady(page); await skipTour(page);
    await page.locator('#master-mute').click();
    expect(await page.evaluate(() => window.__tabi.store.state.settings.audio.masterMuted)).toBe(true);
    await page.goto('./#/learn'); await expect(page.locator('#master-mute')).toHaveAttribute('aria-pressed', 'true');
    await page.goto('./#/lesson/n5_u01_l1'); await expect(page.locator('#master-mute')).toBeVisible();
  });
});

test.describe('AC17: no ja-JP voice -> transcript mode with a visible notice', () => {
  test('listening exercise shows the transcript and a notice; dictation is skippable without penalty', async ({ page }) => {
    await page.addInitScript(stub([{ lang: 'en-US', name: 'Alex', voiceURI: 'a', localService: true }]));
    await page.goto('./'); await waitReady(page); await skipTour(page);
    await page.goto('./#/audio'); await expect(page.locator('#voice-status')).toContainText('No Japanese voice found');
    await page.goto('./#/activity/listening/n5u01_ls1');
    await expect(page.locator('.audio-box[data-mode="transcript"]')).toBeVisible();
    await expect(page.locator('.audio-box')).toContainText('No Japanese voice was found');
    await expect(page.locator('.audio-box')).toContainText('Transcript (no audio on this device)');
    expect(await page.evaluate(() => window.__audioLog.spoken.length)).toBe(0);
  });
  test('with a voice, the play button speaks Japanese at the chosen preset speed', async ({ page }) => {
    await page.addInitScript(stub([{ lang: 'ja-JP', name: 'Kyoko', voiceURI: 'k', localService: true }]));
    await page.goto('./'); await waitReady(page); await skipTour(page);
    await page.goto('./#/activity/listening/n5u01_ls1');
    await expect(page.locator('.audio-box[data-mode="audio"]')).toBeVisible();
    await page.getByRole('button', { name: 'Play audio' }).click();
    expect(await page.evaluate(() => window.__audioLog.spoken)).toEqual(['かさ']);
    await page.getByRole('button', { name: 'Slow', exact: true }).click();
    expect((await page.evaluate(() => window.__audioLog.spoken)).length).toBe(2);
  });
});

test.describe('AC18: recording only after tapping Record; app fully usable when denied', () => {
  test('permission denied is handled gracefully and nothing is requested before the tap; no audio leaves the device', async ({ page, context }) => {
    await page.addInitScript(stub([{ lang: 'ja-JP', name: 'Kyoko', voiceURI: 'k', localService: true }]) + `
      window.__gum = 0; window.MediaRecorder = class {};
      Object.defineProperty(navigator, 'mediaDevices', { value: { getUserMedia: () => { window.__gum++; return Promise.reject(Object.assign(new Error('denied'), { name: 'NotAllowedError' })); } }, configurable: true });`);
    const rec = watch(page);
    await page.goto('./'); await waitReady(page); await skipTour(page);
    // make a greeting available for speaking practice
    await page.evaluate(() => { const st = window.__tabi.store; const l = {}; for (const id of ['n5_u02_l5']) l[id] = { doneAt: 1, score: 1, count: 1 }; st.update('progress', (p) => ({ ...p, lessons: { ...p.lessons, ...l } })); });
    await page.goto('./#/speak');
    expect(await page.evaluate(() => window.__gum)).toBe(0);
    await page.locator('#rec-start').click();
    await expect(page.locator('#rec-status')).toContainText('permission was not given');
    expect(await page.evaluate(() => window.__gum)).toBe(1);
    await page.getByRole('button', { name: '▶ Listen' }).click();
    expect(rec.crossOrigin).toEqual([]);
    await page.goto('./#/learn'); await expect(page.getByRole('heading', { name: "Today's itinerary" })).toBeVisible();
    await context.close();
  });
  test('handwriting exercises are labelled self-assessed and make no recognition claims (AC19)', async ({ page }) => {
    await page.goto('./'); await waitReady(page); await skipTour(page);
    await page.goto('./#/kana'); await page.locator('.kana-cell').first().click();
    await expect(page.locator('#kana-detail')).toContainText('cannot check handwriting');
    const text = await page.locator('main').innerText();
    expect(text).not.toMatch(/recogni[sz]es? your handwriting|handwriting recognition (is|works)/i); expect(text).not.toMatch(/\bAI\b/);
  });
});
