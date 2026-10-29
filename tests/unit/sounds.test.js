import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { SOUND_IDS, renderSound, RECIPES, isAmbience } from '../../src/audio/sounds.js';
import { SR } from '../../src/audio/dsp.js';
import { loadSpec } from '../../scripts/lib/load-content.mjs';

const spec = loadSpec();
const lib = spec.audio_system.sound_library;
const hash = (a) => createHash('sha256').update(Buffer.from(a.buffer)).digest('hex');
const rms = (a, from = 0, to = a.length) => { let s = 0; for (let i = from; i < to; i++) s += a[i] * a[i]; return Math.sqrt(s / Math.max(1, to - from)); };

describe('22 procedural sounds (R011, D-006: original, zero recorded files)', () => {
  it('ids equal the spec sound_library exactly (22)', () => { expect(SOUND_IDS.sort()).toEqual(lib.map((s) => s.id).sort()); expect(SOUND_IDS.length).toBe(22); });
  for (const def of lib) {
    it(`${def.id}: renders, correct length, bounded, audible, deterministic`, () => {
      const a = renderSound(def.id);
      const secs = def.loop_seconds ?? def.duration_ms / 1000;
      expect(a.length).toBe(Math.floor(secs * SR) || a.length);
      if (def.duration_ms) expect(Math.abs(a.length / SR - def.duration_ms / 1000)).toBeLessThan(0.01);
      let peak = 0; let nan = false; for (const v of a) { peak = Math.max(peak, Math.abs(v)); if (!Number.isFinite(v)) nan = true; }
      expect(nan).toBe(false); expect(peak).toBeLessThanOrEqual(1); expect(peak).toBeGreaterThan(0.05);
      expect(rms(a)).toBeGreaterThan(0.002);
      expect(hash(RECIPES[def.id].render())).toBe(hash(a)); // same seed, same samples
    });
  }
  it('ambience loops are seamless: no click at the loop point, and levels at both ends are comparable', () => {
    for (const id of SOUND_IDS.filter(isAmbience)) {
      const a = renderSound(id); const n = a.length;
      const jump = Math.abs(a[0] - a[n - 1]);
      let maxStep = 0; for (let i = 1; i < 4000; i++) maxStep = Math.max(maxStep, Math.abs(a[i] - a[i - 1]));
      expect(jump, id).toBeLessThan(Math.max(0.35, maxStep * 4));
      const head = rms(a, 0, SR); const tail = rms(a, n - SR, n);
      expect(Math.abs(head - tail) / Math.max(head, tail), id).toBeLessThan(0.6);
    }
  });
  it('every sound is described as original and procedural in the spec (no file sizes)', () => {
    for (const s of lib) { expect(s.license).toMatch(/original/); expect(s.file_size_kb).toBe(0); }
  });
});
