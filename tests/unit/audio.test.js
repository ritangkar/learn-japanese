import { describe, it, expect } from 'vitest';
import { createAudio, duckFactor, startRecording, recorderSupport, INACTIVITY_MS } from '../../src/audio/index.js';
import { chunkText, pickVoice, clampRate, RATE_PRESETS, createTts } from '../../src/audio/tts.js';
import { defaultSettings } from '../../src/core/defaults.js';

// FIXTURE — fake Web Audio and speech APIs for tests (not shipped)
function fakeWin({ voices = [{ lang: 'ja-JP', name: 'Kyoko', voiceURI: 'kyoko', localService: true }], ctxState = 'suspended' } = {}) {
  const calls = { ctorCount: 0, resumes: 0, suspends: 0, spoken: [], gains: [], started: 0 };
  const node = () => ({ connect() {}, gain: { setTargetAtTime: (v) => calls.gains.push(v), value: 1 } });
  class AudioContext {
    constructor() { calls.ctorCount++; this.state = ctxState; this.currentTime = 0; this.destination = {}; }
    createGain() { const n = node(); return n; }
    createBuffer(c, n) { return { length: n, copyToChannel() {} }; }
    createBufferSource() { return { connect() {}, start() { calls.started++; }, stop() {}, loop: false }; }
    resume() { calls.resumes++; this.state = 'running'; return Promise.resolve(); }
    suspend() { calls.suspends++; this.state = 'suspended'; return Promise.resolve(); }
  }
  class Utter { constructor(t) { this.text = t; } }
  const synth = { getVoices: () => voices, speak: (u) => { calls.spoken.push(u); }, cancel() {}, addEventListener() {} };
  return { win: { AudioContext, SpeechSynthesisUtterance: Utter, speechSynthesis: synth }, calls };
}
const mk = (opts = {}, settingsPatch = {}) => {
  const settings = defaultSettings(); Object.assign(settings.audio, settingsPatch);
  const f = fakeWin(opts); const patches = []; let t = 1000;
  const audio = createAudio({ getSettings: () => ({ ...settings, audio: settings.audio }), updateAudio: (p) => { patches.push(p); Object.assign(settings.audio, p); }, win: f.win, now: () => t });
  return { audio, settings, patches, calls: f.calls, advance: (ms) => { t += ms; } };
};

describe('autoplay policy and defaults (R019, AC16)', () => {
  it('defaults: ambience off, effects on at 0.5, ambience volume 0.25, master 0.8, learning 1', () => {
    const a = defaultSettings().audio;
    expect(a.ambience.enabled).toBe(false); expect(a.ambience.volume).toBe(0.25); expect(a.master).toBe(0.8); expect(a.learning.volume).toBe(1); expect(a.effects.volume).toBe(0.5); expect(a.masterMuted).toBe(false);
  });
  it('no AudioContext exists until a user gesture calls unlock(); ambience cannot start before that', () => {
    const { audio, calls } = mk();
    expect(calls.ctorCount).toBe(0);
    expect(audio.ambience.start('amb_rain')).toBe(false); expect(audio.sfx('fb_correct')).toBe(false); expect(calls.ctorCount).toBe(0);
    expect(audio.unlock()).toBe(true); expect(calls.ctorCount).toBe(1); expect(calls.resumes).toBe(1);
  });
  it('after the gesture ambience starts, persists the choice and can be stopped', () => {
    const { audio, patches } = mk();
    audio.unlock(); expect(audio.ambience.start('amb_rain')).toBe(true); expect(audio.ambience.playing()).toBe(true);
    expect(patches.some((p) => p.resumeAmbienceId === 'amb_rain')).toBe(true);
    audio.ambience.stop(); expect(audio.ambience.playing()).toBe(false);
  });
  it('only ambience ids may loop; sound-effect ids are rejected as ambience and ambience ids as effects', () => {
    const { audio } = mk(); audio.unlock();
    expect(audio.ambience.start('fb_correct')).toBe(false); expect(audio.sfx('amb_rain')).toBe(false); expect(audio.sfx('fb_correct')).toBe(true);
  });
  it('"Tap to resume sound": enabled last session but not playing -> needsResume; starting clears it', () => {
    const { audio } = mk({}, { ambience: { enabled: true, volume: 0.25 }, resumeAmbienceId: 'amb_city_street' });
    expect(audio.needsResume()).toBe(true); expect(audio.status().needsResume).toBe(true);
    audio.ambience.start(null, true); expect(audio.needsResume()).toBe(false);
    expect(audio._state.ambId).toBe('amb_city_street');
  });
  it('silent study and master mute silence effects and ambience but speech still works', () => {
    const { audio, settings } = mk(); audio.unlock();
    settings.audio.silentStudy = true; expect(audio.sfx('fb_correct')).toBe(false);
    expect(audio.speak('ねこ')).toBe(true);
    settings.audio.silentStudy = false; settings.audio.masterMuted = true; expect(audio.sfx('fb_correct')).toBe(false);
  });
});

describe('ducking and learning-audio separation', () => {
  it('ambience ducks by 18 dB while the voice speaks and is restored afterwards; learning speech is never ducked', () => {
    expect(duckFactor()).toBeCloseTo(0.1259, 3);
    const { audio, calls } = mk(); audio.unlock(); audio.ambience.start('amb_rain');
    audio.speak('ねこ');
    expect(audio.status().ducked).toBe(true);
    expect(calls.gains.some((g) => Math.abs(g - 0.25 * duckFactor()) < 1e-6)).toBe(true);
    const u = calls.spoken[0]; u.onend(); // utterance finished
    expect(audio.status().ducked).toBe(false);
  });
  it('listening mode mutes ambience (listening exercises, dictation, mock listening)', () => {
    const { audio, calls } = mk(); audio.unlock(); audio.ambience.start('amb_rain');
    audio.setListeningMode(true); expect(audio.status().listeningMuted).toBe(true); expect(calls.gains[calls.gains.length - 1]).toBeDefined();
    audio.setListeningMode(false); expect(audio.status().listeningMuted).toBe(false);
  });
  it('page hidden suspends the context; visible resumes it; 30 minutes of inactivity stops ambience and disables the setting', () => {
    const m = mk(); m.audio.unlock(); m.audio.ambience.start('amb_rain');
    m.audio.onVisibility(true); expect(m.calls.suspends).toBe(1); m.audio.onVisibility(false); expect(m.calls.resumes).toBeGreaterThanOrEqual(2);
    m.advance(INACTIVITY_MS - 1000); expect(m.audio.tickInactivity()).toBe(false);
    m.advance(2000); expect(m.audio.tickInactivity()).toBe(true); expect(m.audio.ambience.playing()).toBe(false);
    expect(m.settings.audio.ambience.enabled).toBe(false);
  });
});

describe('learning audio (TTS) and the no-voice fallback (AC17, D-007)', () => {
  it('chunking keeps utterances short and splits at punctuation', () => {
    expect(chunkText('あ。い、う')).toEqual(['あ。', 'い、', 'う']);
    const long = 'あ'.repeat(100); expect(chunkText(long).every((c) => [...c].length <= 40)).toBe(true); expect(chunkText(long).join('')).toBe(long);
  });
  it('presets 0.9 / 0.65 / 0.5 and slider range 0.5-1.0', () => {
    expect(RATE_PRESETS).toEqual({ normal: 0.9, slow: 0.65, very_slow: 0.5 });
    expect(clampRate(0.2)).toBe(0.5); expect(clampRate(3)).toBe(1); expect(clampRate(0.75)).toBe(0.75);
  });
  it('voice selection prefers a local ja voice, honours the remembered voice, ignores other languages', () => {
    const v = [{ lang: 'en-US', voiceURI: 'a' }, { lang: 'ja-JP', voiceURI: 'b', localService: false }, { lang: 'ja_JP', voiceURI: 'c', localService: true }];
    expect(pickVoice(v).voiceURI).toBe('c'); expect(pickVoice(v, 'b').voiceURI).toBe('b'); expect(pickVoice([v[0]])).toBeNull();
  });
  it('with no ja-JP voice speak() returns false, status reports it, and nothing is spoken', () => {
    const f = fakeWin({ voices: [{ lang: 'en-US', name: 'Alex', voiceURI: 'alex', localService: true }] });
    const tts = createTts(f.win, () => defaultSettings());
    expect(tts.status().hasJapaneseVoice).toBe(false); expect(tts.speak('ねこ')).toBe(false); expect(f.calls.spoken).toHaveLength(0);
  });
  it('with a voice, speech uses ja-JP, the chosen rate and cancels first', () => {
    const f = fakeWin(); const tts = createTts(f.win, () => defaultSettings());
    expect(tts.speak('こんにちは。ねこ', { rate: 0.65 })).toBe(true);
    expect(f.calls.spoken.map((u) => [u.text, u.lang, u.rate])).toEqual([['こんにちは。', 'ja-JP', 0.65], ['ねこ', 'ja-JP', 0.65]]);
  });
});

describe('optional recorder (R020, AC18)', () => {
  it('unsupported -> graceful result; permission denied -> graceful result; nothing is requested at import time', async () => {
    expect(recorderSupport({})).toBe(false);
    expect(await startRecording({})).toEqual({ ok: false, reason: 'unsupported' });
    const denied = { navigator: { mediaDevices: { getUserMedia: () => Promise.reject(Object.assign(new Error('x'), { name: 'NotAllowedError' })) } }, MediaRecorder: class {} };
    expect(await startRecording(denied)).toEqual({ ok: false, reason: 'denied' });
  });
  it('getUserMedia is only called when startRecording is invoked, and recording stays as a local blob URL', async () => {
    let asked = 0; const stopped = [];
    class MR { constructor() { this.state = 'inactive'; this.mimeType = 'audio/webm'; } start() { this.state = 'recording'; } stop() { this.state = 'inactive'; this.ondataavailable({ data: { size: 3 } }); this.onstop(); } }
    const win = { navigator: { mediaDevices: { getUserMedia: async () => { asked++; return { getTracks: () => [{ stop: () => stopped.push(1) }] }; } } }, MediaRecorder: MR, Blob: class { constructor(p, o) { this.parts = p; this.type = o.type; } }, URL: { createObjectURL: () => 'blob:local' } };
    expect(asked).toBe(0);
    const r = await startRecording(win); expect(asked).toBe(1); expect(r.ok).toBe(true);
    const res = await r.stop(); expect(res.url).toBe('blob:local'); expect(stopped).toHaveLength(1);
  });
});
