// The 22 sound ids from the spec (9 ambience loops, 6 scene effects, 7 feedback sounds), each rendered procedurally.
import { SR, rng, whiteNoise, pinkNoise, brownNoise, biquad, gain, mix, add, lfo, tone, burst, seamless, normalizePeak, schroederReverb } from './dsp.js';
import { hashString } from '../engine/prng.js';

const FADE = Math.floor(1.0 * SR);
const loopOf = (id, secs, build) => {
  const n = Math.floor(secs * SR); const r = rng(hashString(id));
  const raw = build(n + FADE, r);
  return normalizePeak(seamless(raw, n, FADE), 0.6);
};
const sparse = (total, r, count, minGap = 0.4) => { const t = []; for (let i = 0; i < count; i++) { let v; let tries = 0; do { v = r() * (total - 1.5) + 0.2; tries++; } while (t.some((x) => Math.abs(x - v) < minGap) && tries < 20); t.push(v); } return t.sort((a, b) => a - b); };

export const RECIPES = {
  amb_station_hall: { seconds: 20, render: () => loopOf('amb_station_hall', 20, (n, r) => {
    const bed = gain(biquad(brownNoise(n, r), 'lowpass', 900), 0.9);
    const murmur = schroederReverb(gain(biquad(pinkNoise(n, r), 'bandpass', 700, 0.8), (t) => 0.25 * (0.4 + 0.6 * lfo(0.23)(t) * lfo(0.37, 1.1)(t))), 0.4);
    const out = mix(bed, murmur);
    for (const at of sparse(20, r, 2, 6)) add(out, mix(tone(523.25, 0.9, { decay: 3, amp: 0.12 }), (() => { const t2 = tone(783.99, 0.9, { decay: 3, amp: 0.1 }); const y = new Float32Array(t2.length + Math.floor(0.35 * SR)); add(y, t2, Math.floor(0.35 * SR)); return y; })()), Math.floor(at * SR));
    return out;
  }) },
  amb_platform_trains: { seconds: 20, render: () => loopOf('amb_platform_trains', 20, (n, r) => {
    const bed = gain(biquad(pinkNoise(n, r), 'lowpass', 1800), 0.5); const out = mix(bed);
    for (let k = 0; k < 20 * 2.5; k++) { const at = k / 2.5; const swell = Math.sin(Math.PI * Math.min(1, Math.max(0, (at - 4) / 12))) ** 2; if (swell > 0.05) add(out, burst(0.05, r, { lp: 3500, hp: 900, amp: 0.7 * swell, decay: 60 }), Math.floor((at + (r() - 0.5) * 0.03) * SR)); }
    return out;
  }) },
  amb_city_street: { seconds: 20, render: () => loopOf('amb_city_street', 20, (n, r) => {
    const bed = gain(biquad(biquad(pinkNoise(n, r), 'highpass', 200), 'lowpass', 3000), (t) => 0.3 + 0.7 * lfo(0.11)(t));
    const out = mix(bed);
    for (const at of sparse(20, r, 2, 7)) { const len = Math.floor(3.5 * SR); const hum = new Float32Array(len); let ph = 0; for (let i = 0; i < len; i++) { ph += (2 * Math.PI * (62 + 14 * (i / len))) / SR; hum[i] = Math.sin(ph) * 0.2 * Math.sin(Math.PI * (i / len)) ** 2; } add(out, hum, Math.floor(at * SR)); }
    return out;
  }) },
  amb_residential_quiet: { seconds: 25, render: () => loopOf('amb_residential_quiet', 25, (n, r) => {
    const out = mix(gain(biquad(pinkNoise(n, r), 'lowpass', 600), 0.12), gain(biquad(brownNoise(n, r), 'lowpass', 120), 0.2));
    for (const at of sparse(25, r, 6, 2)) add(out, tone(3300 + r() * 1400, 0.18, { f1: 4200 + r() * 800, decay: 12, amp: 0.1 }), Math.floor(at * SR));
    return out;
  }) },
  amb_rain: { seconds: 20, render: () => loopOf('amb_rain', 20, (n, r) => {
    const bed = gain(biquad(pinkNoise(n, r), 'bandpass', 2500, 0.5), (t) => 0.3 + 0.5 * lfo(0.17)(t));
    const out = mix(bed);
    for (let k = 0; k < 140; k++) add(out, burst(0.012, r, { lp: 9000, hp: 3000, amp: 0.2, decay: 150 }), Math.floor(r() * n));
    return out;
  }) },
  amb_wind_nature: { seconds: 25, render: () => loopOf('amb_wind_nature', 25, (n, r) => {
    const base = brownNoise(n, r); const out = new Float32Array(n);
    const chunk = Math.floor(0.5 * SR);
    for (let s0 = 0; s0 < n; s0 += chunk) { const t = s0 / SR; const f = 350 + 450 * lfo(0.09)(t); const seg = biquad(base.slice(s0, s0 + chunk), 'bandpass', f, 1.2); out.set(seg, s0); }
    const rustle = gain(biquad(whiteNoise(n, r), 'highpass', 5000), (t) => 0.05 * lfo(0.31)(t) * lfo(0.13, 2)(t));
    return mix(out, rustle);
  }) },
  amb_garden_park: { seconds: 25, render: () => loopOf('amb_garden_park', 25, (n, r) => {
    const out = mix(gain(biquad(brownNoise(n, r), 'lowpass', 500), 0.25), gain(biquad(whiteNoise(n, r), 'bandpass', 2200, 2), (t) => 0.06 * (0.3 + 0.7 * lfo(7.3)(t) * lfo(0.5)(t))));
    for (const at of sparse(25, r, 5, 2.5)) add(out, tone(2800 + r() * 900, 0.15, { f1: 3600, decay: 14, amp: 0.1 }), Math.floor(at * SR));
    return out;
  }) },
  amb_shopping_arcade: { seconds: 20, render: () => loopOf('amb_shopping_arcade', 20, (n, r) => {
    const out = mix(schroederReverb(gain(biquad(pinkNoise(n, r), 'bandpass', 900, 0.7), (t) => 0.35 * (0.5 + 0.5 * lfo(0.2)(t))), 0.3));
    for (let k = 0; k < 36; k++) add(out, burst(0.03, r, { lp: 1500, hp: 300, amp: 0.25, decay: 80 }), Math.floor(r() * n));
    return out;
  }) },
  amb_coast_waves: { seconds: 24, render: () => loopOf('amb_coast_waves', 24, (n, r) => {
    const sw = (t) => { const p = (t % 12) / 12; return Math.sin(Math.PI * p) ** 2; };
    const out = mix(gain(biquad(pinkNoise(n, r), 'lowpass', 1500), (t) => 0.1 + 0.8 * sw(t)), gain(biquad(whiteNoise(n, r), 'highpass', 4000), (t) => 0.04 * sw(t)));
    for (const at of sparse(24, r, 2, 8)) add(out, tone(1500, 0.5, { f1: 2100, decay: 5, amp: 0.05 }), Math.floor(at * SR));
    return out;
  }) },
  sfx_shop_chime_generic: { ms: 900, render: () => { const y = new Float32Array(Math.floor(0.9 * SR)); add(y, tone(880, 0.5, { decay: 5, amp: 0.4, type: 'triangle' }), 0); add(y, tone(1318.5, 0.55, { decay: 5, amp: 0.35, type: 'triangle' }), Math.floor(0.2 * SR)); return normalizePeak(y, 0.7); } },
  sfx_door_slide: { ms: 600, render: () => { const r = rng(hashString('sfx_door_slide')); const n = Math.floor(0.6 * SR); const x = whiteNoise(n, r); const out = new Float32Array(n); const seg = 512; for (let s0 = 0; s0 < n; s0 += seg) { const t = s0 / n; out.set(biquad(x.slice(s0, s0 + seg), 'bandpass', 400 + 1100 * t, 2), s0); } for (let i = 0; i < n; i++) out[i] *= Math.sin(Math.PI * (i / n)); return normalizePeak(out, 0.6); } },
  sfx_footsteps_pavement: { ms: 2000, render: () => { const r = rng(hashString('sfx_footsteps_pavement')); const y = new Float32Array(2 * SR); [0.15, 0.65, 1.15, 1.65].forEach((t, i) => add(y, burst(0.09, r, { lp: 1800 - i * 100, hp: 150, amp: 0.8, decay: 38 }), Math.floor(t * SR))); return normalizePeak(y, 0.6); } },
  sfx_ticket_gate_beep_generic: { ms: 250, render: () => normalizePeak(tone(1397, 0.25, { decay: 4, amp: 0.5, attack: 0.004 }), 0.6) },
  sfx_crossing_signal_generic: { ms: 2000, render: () => { const y = new Float32Array(2 * SR); for (let k = 0; k < 8; k++) add(y, tone(k % 2 ? 932 : 1175, 0.2, { decay: 5, amp: 0.35, attack: 0.004 }), Math.floor(k * 0.25 * SR)); return normalizePeak(y, 0.6); } },
  sfx_train_door_chime_generic: { ms: 1200, render: () => { const y = new Float32Array(Math.floor(1.2 * SR)); add(y, tone(988, 0.55, { decay: 4, amp: 0.4, type: 'triangle' }), 0); add(y, tone(740, 0.6, { decay: 4, amp: 0.4, type: 'triangle' }), Math.floor(0.45 * SR)); return normalizePeak(y, 0.65); } },
  fb_correct: { ms: 300, render: () => { const y = new Float32Array(Math.floor(0.3 * SR)); add(y, tone(660, 0.14, { decay: 12, amp: 0.4 }), 0); add(y, tone(880, 0.16, { decay: 12, amp: 0.4 }), Math.floor(0.1 * SR)); return normalizePeak(y, 0.5); } },
  fb_incorrect: { ms: 300, render: () => normalizePeak(tone(196, 0.3, { decay: 9, amp: 0.4, attack: 0.01 }), 0.4) },
  fb_lesson_complete: { ms: 1000, render: () => { const y = new Float32Array(SR); [523.25, 659.25, 783.99].forEach((f, i) => add(y, tone(f, 0.5, { decay: 4, amp: 0.35 }), Math.floor(i * 0.18 * SR))); return normalizePeak(y, 0.6); } },
  fb_destination_unlock: { ms: 1200, render: () => { const y = new Float32Array(Math.floor(1.2 * SR)); add(y, tone(600, 1.1, { f1: 1200, decay: 3, amp: 0.3 }), 0); add(y, tone(1200, 1.0, { f1: 2400, decay: 4, amp: 0.12 }), Math.floor(0.05 * SR)); return normalizePeak(y, 0.6); } },
  fb_stamp: { ms: 500, render: () => { const r = rng(hashString('fb_stamp')); const y = new Float32Array(Math.floor(0.5 * SR)); add(y, burst(0.12, r, { lp: 1200, hp: 80, amp: 0.8, decay: 28 }), 0); add(y, tone(120, 0.4, { decay: 9, amp: 0.6 }), 0); return normalizePeak(y, 0.7); } },
  fb_achievement: { ms: 1000, render: () => { const y = new Float32Array(SR); [783.99, 987.77, 1174.66].forEach((f, i) => add(y, tone(f, 0.8, { decay: 3.5, amp: 0.25, type: 'triangle' }), Math.floor(i * 0.06 * SR))); return normalizePeak(y, 0.6); } },
  fb_nav_tap: { ms: 80, render: () => normalizePeak(tone(1800, 0.08, { decay: 60, amp: 0.2, attack: 0.002 }), 0.2) },
};
export const SOUND_IDS = Object.keys(RECIPES);
const cache = new Map();
export function renderSound(id) {
  if (!RECIPES[id]) throw new Error(`unknown sound ${id}`);
  if (!cache.has(id)) cache.set(id, RECIPES[id].render());
  return cache.get(id);
}
export const isAmbience = (id) => id.startsWith('amb_');
