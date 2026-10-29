// Learning audio: Web Speech API (speechSynthesis) with ja-JP voice detection, chunking, rate presets and a no-voice fallback.
import { PARAMS } from '../engine/params.js';

export const RATE_PRESETS = Object.freeze({ normal: PARAMS.speech_rates.normal, slow: PARAMS.speech_rates.slow, very_slow: PARAMS.speech_rates.very_slow });
export const RATE_MIN = 0.5; export const RATE_MAX = 1.0;

/** Split Japanese text at sentence/clause punctuation so each utterance stays short (< ~12 s). */
export function chunkText(text, maxChars = 40) {
  const parts = text.split(/(?<=[。！？!?、，,])/u).map((s) => s.trim()).filter(Boolean);
  const out = [];
  for (const p of parts) {
    if ([...p].length <= maxChars) { out.push(p); continue; }
    const chars = [...p];
    for (let i = 0; i < chars.length; i += maxChars) out.push(chars.slice(i, i + maxChars).join(''));
  }
  return out.length ? out : [text];
}
export const clampRate = (r) => Math.min(RATE_MAX, Math.max(RATE_MIN, Number(r) || RATE_PRESETS.normal));

export function pickVoice(voices, preferredURI = null) {
  const ja = voices.filter((v) => /^ja([-_]|$)/i.test(v.lang));
  if (!ja.length) return null;
  if (preferredURI) { const p = ja.find((v) => v.voiceURI === preferredURI); if (p) return p; }
  return ja.find((v) => v.localService) || ja[0];
}

/** @param {object} [win] window-like object (tests inject a stub with speechSynthesis and SpeechSynthesisUtterance) */
export function createTts(win = globalThis, getSettings = () => ({})) {
  const synth = win.speechSynthesis || null;
  const state = { voices: [], ready: false, listeners: new Set() };
  const emit = () => state.listeners.forEach((f) => f(status()));
  function refresh() { state.voices = synth ? synth.getVoices() : []; state.ready = true; emit(); }
  if (synth) { refresh(); if (synth.addEventListener) synth.addEventListener('voiceschanged', refresh); else synth.onvoiceschanged = refresh; }
  function voice() { return pickVoice(state.voices, getSettings().audio?.learning?.voiceURI); }
  function status() {
    const v = voice();
    return { supported: !!synth, hasJapaneseVoice: !!v, local: !!(v && v.localService), voiceName: v ? v.name : null, voiceURI: v ? v.voiceURI : null, voices: state.voices.filter((x) => /^ja([-_]|$)/i.test(x.lang)).map((x) => ({ name: x.name, voiceURI: x.voiceURI, local: x.localService })), ready: state.ready };
  }
  function speak(text, { rate = null, onend = null } = {}) {
    const v = voice();
    if (!synth || !v) { if (onend) onend(false); return false; }
    const r = clampRate(rate ?? getSettings().audio?.learning?.rate ?? RATE_PRESETS.normal);
    synth.cancel();
    const chunks = chunkText(text);
    chunks.forEach((c, i) => {
      const u = new win.SpeechSynthesisUtterance(c);
      u.lang = 'ja-JP'; u.voice = v; u.rate = r; u.volume = Math.min(1, getSettings().audio?.learning?.volume ?? 1);
      if (i === chunks.length - 1 && onend) { u.onend = () => onend(true); u.onerror = () => onend(false); }
      synth.speak(u);
    });
    return true;
  }
  function stop() { if (synth) synth.cancel(); }
  return { status, speak, stop, refresh, onChange: (f) => { state.listeners.add(f); return () => state.listeners.delete(f); } };
}
