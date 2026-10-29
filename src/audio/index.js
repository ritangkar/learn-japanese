// Audio service: channels (master / ambience / learning / effects), gesture-gated Web Audio, ducking, persistence, recorder.
// Rules (R019): audio starts only after a user gesture; ambience is off by default; study in silence loses nothing.
import { createTts } from './tts.js';
import { renderSound, SOUND_IDS, isAmbience } from './sounds.js';
import { SR } from './dsp.js';

export const DUCK_DB = -18;
export const duckFactor = (db = DUCK_DB) => 10 ** (db / 20);
export const INACTIVITY_MS = 30 * 60 * 1000;

export function createAudio({ getSettings, updateAudio = () => {}, win = globalThis, now = () => Date.now() }) {
  const tts = createTts(win, getSettings);
  const S = () => getSettings().audio;
  const st = { ctx: null, unlocked: false, master: null, amb: null, fx: null, ambSrc: null, ambId: null, speaking: 0, contextMuted: false, lastActivity: now(), hiddenSuspended: false, listeners: new Set(), buffers: new Map() };
  const emit = () => st.listeners.forEach((f) => f(status()));
  const silent = () => S().masterMuted || S().silentStudy;

  function ensureCtx() {
    if (st.ctx) return st.ctx;
    const AC = win.AudioContext || win.webkitAudioContext;
    if (!AC) return null;
    st.ctx = new AC();
    st.master = st.ctx.createGain(); st.amb = st.ctx.createGain(); st.fx = st.ctx.createGain();
    st.amb.connect(st.master); st.fx.connect(st.master); st.master.connect(st.ctx.destination);
    applyGains();
    return st.ctx;
  }
  /** Must be called from a user gesture (pointerdown / keydown / click). Creates or resumes the AudioContext. */
  function unlock() {
    st.lastActivity = now();
    const c = ensureCtx(); if (!c) return false;
    if (c.state === 'suspended') { const p = c.resume(); if (p && p.catch) p.catch(() => {}); }
    st.unlocked = true; emit();
    return true;
  }
  function applyGains() {
    if (!st.ctx) return;
    const a = S(); const t = st.ctx.currentTime;
    st.master.gain.setTargetAtTime(a.masterMuted ? 0 : a.master, t, 0.05);
    const duck = st.speaking > 0 ? duckFactor() : 1;
    st.amb.gain.setTargetAtTime(silent() || st.contextMuted ? 0 : a.ambience.volume * duck, t, 0.15);
    st.fx.gain.setTargetAtTime(silent() || !a.effects.enabled ? 0 : a.effects.volume, t, 0.02);
  }
  function buffer(id) {
    if (!st.buffers.has(id)) { const data = renderSound(id); const b = st.ctx.createBuffer(1, data.length, SR); b.copyToChannel(data, 0); st.buffers.set(id, b); }
    return st.buffers.get(id);
  }
  function sfx(id) {
    if (!SOUND_IDS.includes(id) || isAmbience(id)) return false;
    if (!st.ctx || !st.unlocked || st.ctx.state !== 'running' || silent() || !S().effects.enabled) return false;
    const src = st.ctx.createBufferSource(); src.buffer = buffer(id); src.connect(st.fx); src.start(); return true;
  }
  const ambience = {
    /** Start looping ambience. Refuses unless the context was unlocked by a gesture (or `gesture` is passed from a handler). */
    start(id, gesture = false) {
      if (gesture) unlock();
      if (!st.unlocked || !st.ctx) return false;
      const pick = id || S().resumeAmbienceId || 'amb_city_street';
      if (!isAmbience(pick) || !SOUND_IDS.includes(pick)) return false;
      ambience.stop(true);
      const src = st.ctx.createBufferSource(); src.buffer = buffer(pick); src.loop = true; src.connect(st.amb); src.start();
      st.ambSrc = src; st.ambId = pick; st.lastActivity = now();
      updateAudio({ resumeAmbienceId: pick });
      applyGains(); emit(); return true;
    },
    stop(silentUpdate = false) { if (st.ambSrc) { try { st.ambSrc.stop(); } catch { /* already stopped */ } st.ambSrc = null; st.ambId = null; } if (!silentUpdate) emit(); },
    playing: () => !!st.ambSrc, current: () => st.ambId,
  };
  /** Learning speech never ducks itself; ambience ducks by 18 dB while the voice is speaking. */
  function speak(text, o = {}) {
    st.lastActivity = now();
    st.speaking++; applyGains();
    const done = () => { st.speaking = Math.max(0, st.speaking - 1); applyGains(); };
    const ok = tts.speak(text, { ...o, onend: () => { done(); if (o.onend) o.onend(); } });
    if (!ok) done();
    return ok;
  }
  /** Mute ambience during listening exercises, dictation and the mock listening section. */
  function setListeningMode(on) { st.contextMuted = on; applyGains(); }
  function onVisibility(hidden) {
    if (!st.ctx) return;
    if (hidden && st.ambSrc) { st.hiddenSuspended = true; st.ctx.suspend(); } else if (!hidden && st.hiddenSuspended) { st.hiddenSuspended = false; if (st.unlocked) st.ctx.resume(); }
  }
  function tickInactivity() { if (st.ambSrc && now() - st.lastActivity >= INACTIVITY_MS) { ambience.stop(); updateAudio({ ambience: { ...S().ambience, enabled: false } }); return true; } return false; }
  const touch = () => { st.lastActivity = now(); };
  /** True when ambience was enabled last session but cannot auto-start: the UI shows "Tap to resume sound". */
  const needsResume = () => S().ambience.enabled && !st.ambSrc && !silent();
  function status() { return { ...tts.status(), unlocked: st.unlocked, ambiencePlaying: !!st.ambSrc, ambienceId: st.ambId, ducked: st.speaking > 0, listeningMuted: st.contextMuted, contextState: st.ctx ? st.ctx.state : 'none', needsResume: needsResume() }; }
  return { tts, speak, stop: () => { tts.stop(); }, status, sfx, ambience, unlock, applyGains, setListeningMode, onVisibility, tickInactivity, touch, needsResume, onChange: (f) => { st.listeners.add(f); return () => st.listeners.delete(f); }, _state: st };
}

// ---------- speaking practice (optional, local only) ----------
export function recorderSupport(win = globalThis) {
  return !!(win.navigator && win.navigator.mediaDevices && win.navigator.mediaDevices.getUserMedia && win.MediaRecorder);
}
/** Starts only when called (the UI calls it from a tap on Record). Max 30 s. Audio never leaves the device. */
export async function startRecording(win = globalThis, { maxMs = 30000 } = {}) {
  if (!recorderSupport(win)) return { ok: false, reason: 'unsupported' };
  let stream;
  try { stream = await win.navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) { return { ok: false, reason: e && e.name === 'NotAllowedError' ? 'denied' : 'unavailable' }; }
  const chunks = []; const rec = new win.MediaRecorder(stream);
  rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
  const finished = new Promise((res) => { rec.onstop = () => { stream.getTracks().forEach((t) => t.stop()); const blob = new win.Blob(chunks, { type: rec.mimeType || 'audio/webm' }); res({ blob, url: win.URL.createObjectURL(blob) }); }; });
  rec.start();
  const timer = setTimeout(() => { if (rec.state !== 'inactive') rec.stop(); }, maxMs);
  return { ok: true, stop: () => { clearTimeout(timer); if (rec.state !== 'inactive') rec.stop(); return finished; } };
}
