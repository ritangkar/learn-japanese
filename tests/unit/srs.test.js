import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import * as srs from '../../src/engine/srs.js';

const V = JSON.parse(readFileSync(new URL('../vectors/fsrs45.json', import.meta.url), 'utf8'));
const close = (a, b, eps = 1e-8) => Math.abs(a - b) <= eps;

describe('FSRS-4.5 port equals the official ts-fsrs 3.5.7 reference vectors (AC20 / D-010 / U-003)', () => {
  it('records which official source the vectors came from', () => {
    expect(V.source.package).toBe('ts-fsrs');
    expect(V.source.version).toBe(srs.FSRS_SOURCE.version);
    expect(V.w).toEqual([...srs.W]);
  });
  it('forgetting curve', () => { for (const v of V.pure.forgetting) expect(srs.forgettingCurve(v.t, v.s)).toBe(v.r); expect(V.pure.forgetting.length).toBeGreaterThan(40); });
  it('initial difficulty and stability', () => { for (const v of V.pure.initD) expect(srs.initDifficulty(v.g)).toBe(v.d); for (const v of V.pure.initS) expect(srs.initStability(v.g)).toBe(v.s); });
  it('next difficulty', () => { for (const v of V.pure.nextD) expect(srs.nextDifficulty(v.d, v.g)).toBe(v.v); });
  it('next recall stability', () => { for (const v of V.pure.recall) expect(srs.nextRecallStability(v.d, v.s, v.r, v.g)).toBe(v.v); expect(V.pure.recall.length).toBeGreaterThan(300); });
  it('next forget stability', () => { for (const v of V.pure.forget) expect(srs.nextForgetStability(v.d, v.s, v.r)).toBe(v.v); });
  it('interval modifier and next interval across retentions', () => { for (const v of V.pure.interval) { expect(srs.intervalModifier(v.ret)).toBe(v.mod); expect(srs.nextInterval(v.s, v.ret)).toBe(v.v); } });
  it('full review step from the Review state (stability, difficulty, interval, state, lapses)', () => {
    for (const v of V.review) {
      const card = { state: srs.State.Review, stability: v.s, difficulty: v.d, reps: 4, lapses: 0, lastDay: 100 };
      for (const g of [1, 2, 3, 4]) {
        const { card: out, interval } = srs.review(card, g, 100 + v.elapsed);
        const ref = v.out[g];
        expect(close(out.stability, ref.s), `S g${g} ${JSON.stringify(v)}`).toBe(true);
        expect(close(out.difficulty, ref.d), `D g${g}`).toBe(true);
        expect(out.state).toBe(ref.state);
        expect(out.lapses).toBe(ref.lapses);
        if (g !== 1) expect(interval, `interval g${g} d${v.d} s${v.s} t${v.elapsed}`).toBe(ref.days); // again is minutes in the library, one day here (documented)
      }
    }
  });
  it('new card: stability and difficulty equal; good/easy intervals equal', () => {
    for (const ref of V.newCard) {
      const { card, interval } = srs.review(srs.newCard(), ref.g, 100);
      expect(close(card.stability, ref.s)).toBe(true); expect(close(card.difficulty, ref.d)).toBe(true);
      expect(card.state).toBe(ref.state);
      if (ref.g === 4) expect(interval).toBe(ref.days);
    }
  });
  it('multi-review sequences driven by the library match step by step (state, S, D, interval)', () => {
    for (const seq of V.sequences) {
      let card = srs.newCard(); let day = 100;
      seq.steps.forEach((ref, i) => {
        const r = srs.review(card, ref.g, day);
        card = r.card;
        if (card.state === srs.State.Review || ref.state === srs.State.Review) {
          expect(card.state, `seq ${seq.grades} step ${i} state`).toBe(ref.state);
          expect(close(card.stability, ref.s), `seq ${seq.grades} step ${i} S ${card.stability} vs ${ref.s}`).toBe(true);
          expect(close(card.difficulty, ref.d), `seq step ${i} D`).toBe(true);
          expect(r.interval, `seq ${seq.grades} step ${i} interval`).toBe(Math.max(1, ref.days));
        }
        day += Math.max(1, ref.days);
      });
    }
  });
});

describe('scheduler behaviour', () => {
  it('is deterministic: identical input gives identical output', () => {
    const a = srs.review({ state: 2, stability: 7, difficulty: 5, reps: 3, lapses: 0, lastDay: 10 }, 3, 20);
    const b = srs.review({ state: 2, stability: 7, difficulty: 5, reps: 3, lapses: 0, lastDay: 10 }, 3, 20);
    expect(a).toEqual(b);
  });
  it('again increments lapses and drops stability; harder grades give shorter intervals', () => {
    const card = { state: 2, stability: 20, difficulty: 5, reps: 5, lapses: 0, lastDay: 0 };
    const again = srs.review(card, 1, 20); const hard = srs.review(card, 2, 20); const good = srs.review(card, 3, 20); const easy = srs.review(card, 4, 20);
    expect(again.card.lapses).toBe(1); expect(again.card.stability).toBeLessThan(20);
    expect(hard.interval).toBeLessThan(good.interval); expect(good.interval).toBeLessThan(easy.interval);
  });
  it('compact record round-trips within quantisation and packs success counters', () => {
    const rec = srs.newRecord('v_neko:meaning', 100);
    let r = srs.reviewRecord(rec, 3, 100).record;
    r = srs.reviewRecord(r, 3, 104).record;
    r = srs.reviewRecord(r, 3, 110).record;
    const d = srs.decode(r);
    expect(r).toHaveLength(8);
    expect(d.key).toBe('v_neko:meaning');
    expect(d.successes).toBe(2); expect(d.successDays).toBe(2); expect(d.state).toBe(2);
    const again = srs.encode(srs.decode(r));
    expect(again).toEqual(r);
  });
  it('same-day repeats never count as spaced successes', () => {
    let r = srs.newRecord('k', 50);
    for (let i = 0; i < 10; i++) r = srs.reviewRecord(r, 3, 50).record;
    expect(srs.decode(r).successes).toBe(0);
  });
  it('grade mapping follows the spec table', () => {
    expect(srs.gradeFrom({ correct: false })).toBe(1);
    expect(srs.gradeFrom({ correct: true })).toBe(3);
    expect(srs.gradeFrom({ correct: true, confidence: 'low' })).toBe(2);
    expect(srs.gradeFrom({ correct: true, latencyMs: 5000, medianMs: 2000 })).toBe(2);
    expect(srs.gradeFrom({ correct: true, confidence: 'high', latencyMs: 900, medianMs: 2000 })).toBe(4);
  });
});

describe('Leitner fallback table tests (documented, not the active scheduler)', () => {
  it('intervals table equals the spec', () => { expect([...srs.LEITNER_INTERVALS]).toEqual([0, 1, 3, 7, 16, 35, 75, 160]); });
  it('moves up on correct, resets to box 1 on wrong, drops two boxes for previously proficient items', () => {
    expect(srs.leitnerReview(1, true)).toEqual({ box: 2, interval: 3 });
    expect(srs.leitnerReview(7, true)).toEqual({ box: 7, interval: 160 });
    expect(srs.leitnerReview(5, false)).toEqual({ box: 1, interval: 1 });
    expect(srs.leitnerReview(5, false, { proficientBefore: true })).toEqual({ box: 3, interval: 7 });
    expect(srs.leitnerReview(2, false, { proficientBefore: true })).toEqual({ box: 1, interval: 1 });
  });
});
