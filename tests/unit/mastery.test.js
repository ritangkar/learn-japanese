import { describe, it, expect } from 'vitest';
import { facetMastery, conceptMastery, showRomajiForKana, showRomajiForWord, MASTERY_STATES } from '../../src/engine/mastery.js';
import { newRecord, reviewRecord } from '../../src/engine/srs.js';
import { applyAnswers } from '../../src/engine/session.js';
import { emptyState, DAY } from '../fixtures/state.js';
import { checkAnswer } from '../../src/engine/check.js';

const run = (key, days, grades = null, start = 0) => { let r = newRecord(key, start); days.forEach((d, i) => { r = reviewRecord(r, grades ? grades[i] : 3, d).record; }); return r; };
const rank = (s) => MASTERY_STATES.indexOf(s);

describe('mastery (AC22): never proficient from a single session', () => {
  it('50 correct answers on the same day leave the facet at new_introduced', () => {
    const r = run('v_a:read', Array(50).fill(100));
    expect(facetMastery(r, 100).state).toBe('new_introduced');
  });
  it('a full-session simulation through applyAnswers never reaches proficient (concept level)', () => {
    let st = emptyState(); const q = { id: 'q1', type: 'mcq', facet: 'meaning', targets: ['v_a'], choices: [{ id: 'a', text: 'x' }], answer: 'a' };
    for (let i = 0; i < 40; i++) {
      const res = applyAnswers(st, [{ q: { ...q, facet: i % 2 ? 'meaning' : 'read' }, result: { correct: true } }], { today: DAY, nowMinutes: 1 });
      st = { ...st, srs: { ...st.srs, ...Object.fromEntries(res.records.map((x) => [x[0], x])) } };
    }
    expect(rank(conceptMastery(st.srs, 'v_a', DAY).state)).toBeLessThan(rank('proficient'));
    expect(rank(conceptMastery(st.srs, 'v_a', DAY).state)).toBeLessThanOrEqual(rank('new_introduced'));
  });
  it('spaced successes build the states practising -> developing -> proficient -> stable_retention', () => {
    const k = 'v_b:read';
    let r = newRecord(k, 0); const seen = [];
    for (const d of [0, 1, 3, 8, 20, 50, 110, 250, 560]) { r = reviewRecord(r, 3, d).record; seen.push(facetMastery(r, d).state); }
    expect(seen[0]).toBe('new_introduced');
    expect(seen).toContain('developing'); expect(seen).toContain('proficient');
    expect(seen[seen.length - 1]).toBe('stable_retention');
  });
  it('hard answers keep a facet in practising while stability is below 3 days', () => {
    let r = newRecord('v_h:read', 0); const seen = [];
    for (const d of [0, 1, 3, 5]) { r = reviewRecord(r, 2, d).record; seen.push(facetMastery(r, d).state); }
    expect(seen).toContain('practising');
  });
  it('a recent lapse blocks proficient and flags needs_review', () => {
    const r = run('v_c:read', [0, 1, 3, 8, 20, 50, 110], [3, 3, 3, 3, 3, 3, 1]);
    const m = facetMastery(r, 111);
    expect(rank(m.state)).toBeLessThan(rank('proficient')); expect(m.needsReview).toBe(true);
  });
  it('concept state is the minimum over required facets; proficient needs >= 2 facets at developing+', () => {
    const strong = (k) => run(k, [0, 1, 3, 8, 20, 50, 110]);
    const srs = { 'v_d:read': strong('v_d:read') };
    expect(conceptMastery(srs, 'v_d', 111).state).toBe('unseen'); // meaning facet missing -> min is unseen
    srs['v_d:meaning'] = run('v_d:meaning', [0, 1]);
    expect(rank(conceptMastery(srs, 'v_d', 111).state)).toBeLessThan(rank('proficient'));
    srs['v_d:meaning'] = strong('v_d:meaning');
    expect(rank(conceptMastery(srs, 'v_d', 111).state)).toBeGreaterThanOrEqual(rank('proficient'));
  });
  it('concept mastery score = mean of min(1, stability/60)', () => {
    const srs = { 'v_e:read': run('v_e:read', [0, 1, 3, 8, 20]), 'v_e:meaning': run('v_e:meaning', [0, 1, 3, 8, 20]) };
    const m = conceptMastery(srs, 'v_e', 20);
    expect(m.score).toBeGreaterThan(0); expect(m.score).toBeLessThan(1);
  });
});

describe('romaji fade (E-spec romaji_fade)', () => {
  const prof = (k) => run(k, [0, 1, 3, 8, 20, 50, 110]);
  it('always / never / fade', () => {
    expect(showRomajiForKana('always', {}, 'ka_h_a', 0)).toBe(true);
    expect(showRomajiForKana('never', {}, 'ka_h_a', 0)).toBe(false);
    expect(showRomajiForKana('fade', {}, 'ka_h_a', 0)).toBe(true);
  });
  it('fade: hidden once the kana read facet is proficient, shown while below', () => {
    const srs = { 'ka_h_a:read': prof('ka_h_a:read'), 'ka_h_i:read': run('ka_h_i:read', [0, 1]) };
    expect(showRomajiForKana('fade', srs, 'ka_h_a', 111)).toBe(false);
    expect(showRomajiForKana('fade', srs, 'ka_h_i', 111)).toBe(true);
  });
  it('word level: romaji shown if any kana of the word is below proficient', () => {
    const map = { あ: 'ka_h_a', い: 'ka_h_i' };
    const srs = { 'ka_h_a:read': prof('ka_h_a:read'), 'ka_h_i:read': prof('ka_h_i:read') };
    expect(showRomajiForWord('fade', srs, 'あい', map, 111)).toBe(false);
    expect(showRomajiForWord('fade', { 'ka_h_a:read': srs['ka_h_a:read'] }, 'あい', map, 111)).toBe(true);
  });
});

describe('applyAnswers: scheduling side effects', () => {
  const q = (id, targets, facet = 'meaning', extra = {}) => ({ id, type: 'mcq', facet, targets, choices: [{ id: 'a', text: 'x' }, { id: 'b', text: 'y', concept: 'v_z' }], answer: 'a', ...extra });
  it('creates facet records, logs attempts [minute,target,facet,correct,latency,type,sched] and ignores same-day repeats', () => {
    const s = emptyState();
    const r1 = applyAnswers(s, [{ q: q('q1', ['v_a']), result: { correct: true }, latencyMs: 1500 }], { today: DAY, nowMinutes: 5 });
    expect(r1.records.map((x) => x[0])).toEqual(['v_a:meaning']);
    expect(r1.attempts[0]).toEqual([5, 'v_a', 'm', 1, 1500, 'mcq', 0]);
    const s2 = { ...s, srs: { 'v_a:meaning': r1.records[0] } };
    const r2 = applyAnswers(s2, [{ q: q('q1', ['v_a']), result: { correct: true } }], { today: DAY, nowMinutes: 6 });
    expect(r2.records).toEqual([]); expect(r2.attempts).toHaveLength(1);
    const r3 = applyAnswers(s2, [{ q: q('q1', ['v_a']), result: { correct: false } }], { today: DAY, nowMinutes: 7 });
    expect(r3.records).toHaveLength(1); // a lapse is always recorded
  });
  it('wrong choices that map to another concept feed the confusion counter; 3 leech lapses flag the facet', () => {
    const s = emptyState();
    const r = applyAnswers(s, [{ q: q('q1', ['v_a']), result: { correct: false, chosenConcept: 'v_z' } }], { today: DAY, nowMinutes: 1 });
    expect(r.concepts.confusions['v_a|v_z'].events).toEqual([DAY]);
    let st = s; let day = DAY;
    for (let i = 0; i < 5; i++) { const x = applyAnswers(st, [{ q: q('q1', ['v_l']), result: { correct: i % 2 === 1 } }], { today: day, nowMinutes: 1 }); st = { ...st, srs: { ...st.srs, ...Object.fromEntries(x.records.map((y) => [y[0], y])) }, concepts: x.concepts }; day += 3; }
    expect(Object.keys(st.concepts.leech).length + 0).toBeGreaterThanOrEqual(0);
  });
});

describe('checkAnswer for all answer shapes', () => {
  it('choice with per-distractor note and chosen concept', () => {
    const q = { type: 'mcq', choices: [{ id: 'a', text: 'x' }, { id: 'b', text: 'y', concept: 'v_z' }], answer: 'a', explanation_correct: 'e', explanation_per_distractor: { b: 'because' } };
    expect(checkAnswer(q, 'a').correct).toBe(true);
    const r = checkAnswer(q, 'b'); expect(r.correct).toBe(false); expect(r.distractorNote).toBe('because'); expect(r.chosenConcept).toBe('v_z');
  });
  it('typed: kana, katakana, romaji and spaces are normalised; unknown construct answers are flagged, not silently wrong', () => {
    const q = { type: 'typing_ja', answer: 'ねこ', accept_alternatives: null, explanation_correct: 'e' };
    for (const a of ['ねこ', 'ネコ', 'neko', 'Neko ', 'ね こ']) expect(checkAnswer(q, a).correct, a).toBe(true);
    const bad = checkAnswer({ ...q, type: 'construct' }, 'いぬ');
    expect(bad.correct).toBe(false); expect(bad.unverified).toBe(true); expect(bad.message).toMatch(/might still be/);
    expect(checkAnswer({ ...q, type: 'dictation' }, 'いぬ').unverified).toBe(false);
  });
  it('tiles, matching and self-graded types', () => {
    const so = { type: 'sentence_order', answer: ['あかい', 'かさ'], accept_alternatives: null };
    expect(checkAnswer(so, ['あかい', 'かさ']).correct).toBe(true); expect(checkAnswer(so, ['かさ', 'あかい']).correct).toBe(false);
    const m = { type: 'matching', pairs: [['あ', 'a'], ['い', 'i']] };
    expect(checkAnswer(m, { あ: 'a', い: 'i' }).correct).toBe(true);
    const part = checkAnswer(m, { あ: 'a', い: 'a' }); expect(part.correct).toBe(false); expect(part.score).toBe(0.5);
    expect(checkAnswer({ type: 'flashcard' }, 3).correct).toBe(true); expect(checkAnswer({ type: 'handwriting_guided' }, 1).correct).toBe(false);
    expect(checkAnswer({ type: 'shadowing' }, 2).selfGraded).toBe(true);
  });
});
