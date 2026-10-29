// Pure-JS DSP used to pre-render every sound once into a Float32Array (then played from an AudioBuffer). Original recipes only:
// filtered noise, sine tones and seeded timing. No recordings, no jingles, no real announcements (R011, D-006).
// Deviation from the spec text: rendering uses plain JS instead of OfflineAudioContext, which gives identical results and
// makes every sound unit-testable in Node.
import { rng } from '../engine/prng.js';

export const SR = 22050;
const TWO_PI = Math.PI * 2;

export function whiteNoise(n, r) { const a = new Float32Array(n); for (let i = 0; i < n; i++) a[i] = r() * 2 - 1; return a; }
export function pinkNoise(n, r) { // Paul Kellet's economy filter
  const a = new Float32Array(n); let b0 = 0; let b1 = 0; let b2 = 0;
  for (let i = 0; i < n; i++) { const w = r() * 2 - 1; b0 = 0.99765 * b0 + w * 0.099046; b1 = 0.963 * b1 + w * 0.2965164; b2 = 0.57 * b2 + w * 1.0526913; a[i] = (b0 + b1 + b2 + w * 0.1848) * 0.2; }
  return a;
}
export function brownNoise(n, r) { const a = new Float32Array(n); let last = 0; for (let i = 0; i < n; i++) { last = (last + 0.02 * (r() * 2 - 1)) / 1.02; a[i] = last * 3.5; } return a; }

/** RBJ biquad. type: lowpass | highpass | bandpass. */
export function biquad(x, type, freq, q = 0.707, sr = SR) {
  const w0 = (TWO_PI * Math.min(freq, sr * 0.45)) / sr; const cos = Math.cos(w0); const alpha = Math.sin(w0) / (2 * q);
  let b0; let b1; let b2;
  if (type === 'lowpass') { b0 = (1 - cos) / 2; b1 = 1 - cos; b2 = (1 - cos) / 2; } else if (type === 'highpass') { b0 = (1 + cos) / 2; b1 = -(1 + cos); b2 = (1 + cos) / 2; } else { b0 = alpha; b1 = 0; b2 = -alpha; }
  const a0 = 1 + alpha; const a1 = -2 * cos; const a2 = 1 - alpha;
  const y = new Float32Array(x.length); let x1 = 0; let x2 = 0; let y1 = 0; let y2 = 0;
  for (let i = 0; i < x.length; i++) { const v = (b0 / a0) * x[i] + (b1 / a0) * x1 + (b2 / a0) * x2 - (a1 / a0) * y1 - (a2 / a0) * y2; x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = v; }
  return y;
}
export const gain = (x, g) => { const y = new Float32Array(x.length); for (let i = 0; i < x.length; i++) y[i] = x[i] * (typeof g === 'function' ? g(i / SR) : g); return y; };
export function mix(...tracks) { const n = Math.max(...tracks.map((t) => t.length)); const y = new Float32Array(n); for (const t of tracks) for (let i = 0; i < t.length; i++) y[i] += t[i]; return y; }
export function add(dst, src, at) { for (let i = 0; i < src.length && at + i < dst.length; i++) if (at + i >= 0) dst[at + i] += src[i]; return dst; }
export const lfo = (freq, phase = 0) => (t) => 0.5 + 0.5 * Math.sin(TWO_PI * freq * t + phase);
/** Exponentially decaying sine (or glide when f1 !== f0). */
export function tone(freq, dur, { f1 = freq, attack = 0.005, decay = 6, amp = 0.5, type = 'sine' } = {}) {
  const n = Math.floor(dur * SR); const y = new Float32Array(n); let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR; const f = freq + (f1 - freq) * (t / dur); ph += (TWO_PI * f) / SR;
    const env = Math.min(1, t / attack) * Math.exp(-decay * t) * Math.min(1, (dur - t) / 0.01);
    const w = type === 'triangle' ? (2 / Math.PI) * Math.asin(Math.sin(ph)) : Math.sin(ph);
    y[i] = w * env * amp;
  }
  return y;
}
export function burst(dur, r, { lp = 4000, hp = 200, amp = 0.5, decay = 30 } = {}) {
  const n = Math.floor(dur * SR); let x = whiteNoise(n, r);
  x = biquad(biquad(x, 'highpass', hp), 'lowpass', lp);
  for (let i = 0; i < n; i++) x[i] *= amp * Math.exp(-decay * (i / SR));
  return x;
}
/** Make a loop seamless by cross-fading the tail (rendered `fade` seconds past the end) into the head. */
export function seamless(x, loopSamples, fadeSamples) {
  const y = x.slice(0, loopSamples);
  for (let i = 0; i < fadeSamples; i++) { const w = i / fadeSamples; y[i] = x[i] * w + x[loopSamples + i] * (1 - w); }
  return y;
}
export function normalizePeak(x, peak = 0.8) { let m = 0; for (const v of x) m = Math.max(m, Math.abs(v)); if (m === 0) return x; const g = peak / m; for (let i = 0; i < x.length; i++) x[i] *= g; return x; }
export function schroederReverb(x, mixAmt = 0.3) {
  const combs = [[0.0297, 0.77], [0.0371, 0.75], [0.0411, 0.73], [0.0437, 0.71]]; const out = new Float32Array(x.length);
  for (const [d, g] of combs) { const dl = Math.floor(d * SR); const buf = new Float32Array(x.length); for (let i = 0; i < x.length; i++) { buf[i] = x[i] + (i >= dl ? buf[i - dl] * g : 0); out[i] += buf[i] / combs.length; } }
  const y = new Float32Array(x.length); for (let i = 0; i < x.length; i++) y[i] = x[i] * (1 - mixAmt) + out[i] * mixAmt; return y;
}
export { rng };
