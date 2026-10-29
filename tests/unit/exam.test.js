import { describe, it, expect } from 'vitest';
import * as ex from '../../src/engine/exam.js';
import { readiness, examPlanner, NO_DATA, NOT_JLPT, ema } from '../../src/engine/readiness.js';
import { checkAnswer } from '../../src/engine/check.js';
import { emptyState, fxContent, realContent, DAY, NOW } from '../fixtures/state.js';
import { loadSpec } from '../../scripts/lib/load-content.mjs';

const spec = loadSpec();
const levelDef = (L) => spec.jlpt.levels.find((l) => l.level === L);
// FIXTURE questions for mock-engine tests (not shipped)
const mkQ = (id, section, correct = 'a') => ({ id, type: 'mcq', section, choices: [{ id: 'a', text: 'x' }, { id: 'b', text: 'y' }], answer: correct, instructional_level: 'N5', jlpt_item_type: null, tags: [section] });
const qs = [mkQ('q1', 'vocabulary'), mkQ('q2', 'vocabulary'), mkQ('q3', 'grammar'), mkQ('q4', 'reading'), mkQ('q5', 'listening'), mkQ('q6', 'listening')];
const mock = (L = 'N5') => ({ id: 'fx_mock', level: L, sections: levelDef(L).test_sections.map((ts, i) => ({ id: ts.id, official_section_name: ts.official_name, minutes: ts.minutes, question_ids: [['q1', 'q2'], ['q3', 'q4'], ['q5', 'q6']][i] || [] })) });
const T0 = 1_000_000;

describe('exam engine (AC23, R016)', () => {
  it('section minutes come from the official figures (N5 20/40/30) and timers count down', () => {
    let a = ex.createAttempt({ id: 'a1', mock: mock(), now: T0 });
    expect(a.sections.map((s) => s.minutes)).toEqual([20, 40, 30]);
    a = ex.startSection(a, T0);
    expect(ex.remainingMs(a.sections[0], T0 + 60000)).toBe(19 * 60000);
    expect(ex.warnings(a.sections[0], T0 + 15 * 60000).five).toBe(true);
    expect(ex.warnings(a.sections[0], T0 + 19 * 60000 + 30000).one).toBe(true);
    expect(ex.warnings(a.sections[0], T0 + 21 * 60000).expired).toBe(true);
  });
  it('auto-submits at zero and then locks the section; answers after lock are ignored', () => {
    let a = ex.startSection(ex.createAttempt({ id: 'a1', mock: mock(), now: T0 }), T0);
    a = ex.answer(a, 'q1', 'a', T0 + 1000);
    a = ex.tick(a, T0 + 20 * 60000 + 5);
    expect(a.sections[0].state).toBe('submitted');
    const locked = ex.answer(a, 'q2', 'a', T0 + 20 * 60000 + 10);
    expect(locked.sections[0].answers).toEqual({ q1: 'a' });
  });
  it('free navigation within a section: flagging, grid states, unanswered prompt', () => {
    let a = ex.startSection(ex.createAttempt({ id: 'a1', mock: mock(), now: T0 }), T0);
    a = ex.answer(a, 'q1', 'a', T0); a = ex.toggleFlag(a, 'q2');
    expect(ex.grid(a.sections[0]).map((g) => g.state)).toEqual(['answered', 'flagged']);
    a = ex.toggleFlag(a, 'q1'); expect(ex.grid(a.sections[0])[0].state).toBe('flagged');
    expect(ex.unanswered(a.sections[0])).toEqual(['q2']);
    expect(ex.answer(a, 'q3', 'a', T0)).toBe(a); // foreign question ignored
  });
  it('manual submit locks the section; the attempt finishes after the last section', () => {
    let a = ex.createAttempt({ id: 'a1', mock: mock(), now: T0 });
    for (let i = 0; i < 3; i++) { a = ex.startSection(a, T0 + i, a.current); a = ex.submitSection(a, T0 + 1000 * (i + 1)); a = ex.nextSection(a, T0); }
    expect(a.finished).toBe(true); expect(a.sections.every((s) => s.state === 'submitted')).toBe(true);
    expect(ex.answer(a, 'q1', 'a', T0)).toBe(a);
  });
  it('extended time (practice setting) multiplies the time by 1.5; default is off', () => {
    const a = ex.startSection(ex.createAttempt({ id: 'a1', mock: mock(), now: T0, extendedTime: true }), T0);
    expect(ex.remainingMs(a.sections[0], T0)).toBe(30 * 60000);
  });
  it('listening plays once per item in mock mode; replay allowed in practice mode', () => {
    let a = ex.createAttempt({ id: 'a1', mock: mock(), now: T0 });
    expect(ex.canPlay(a, 'ls1')).toBe(true); a = ex.recordPlay(a, 'ls1'); expect(ex.canPlay(a, 'ls1')).toBe(false);
    const p = ex.createAttempt({ id: 'a2', mock: mock(), now: T0, practiceMode: true }); expect(ex.canPlay(ex.recordPlay(p, 'x'), 'x')).toBe(true);
  });
  it('autosave every 30 s and resume info', () => {
    let a = ex.startSection(ex.createAttempt({ id: 'a1', mock: mock(), now: T0 }), T0);
    expect(ex.autosaveDue(a, T0 + 29000)).toBe(false); expect(ex.autosaveDue(a, T0 + 30000)).toBe(true);
    const copy = ex.serialize(a); expect(copy).toEqual(a);
    expect(ex.resumeInfo(copy, T0 + 60000).remainingMs).toBe(19 * 60000);
    expect(ex.resumeInfo(copy, T0 + 25 * 60000).expired).toBe(true);
  });
  const finish = (L, answers) => {
    let a = ex.createAttempt({ id: 'a1', mock: mock(L), now: T0 });
    for (let i = 0; i < a.sections.length; i++) { a = ex.startSection(a, T0, i); for (const qid of a.sections[i].questionIds) if (answers[qid] !== undefined) a = ex.answer(a, qid, answers[qid], T0); a = ex.submitSection(a, T0 + 1000); a = ex.nextSection(a, T0); }
    return ex.score(a, qs, levelDef(L), checkAnswer);
  };
  it('N5/N4 report TWO groups (language knowledge + reading, listening); N3-N1 three; percent only', () => {
    const r = finish('N5', { q1: 'a', q2: 'b', q3: 'a', q4: 'a', q5: 'a', q6: 'a' });
    expect(r.groups.map((g) => g.id)).toEqual(['language_knowledge_and_reading', 'listening']);
    expect(r.groups[0]).toMatchObject({ correct: 3, total: 4, percent: 75 }); expect(r.groups[1]).toMatchObject({ correct: 2, total: 2, percent: 100 });
    expect(ex.scoringGroups(levelDef('N4')).length).toBe(2); expect(ex.scoringGroups(levelDef('N3')).length).toBe(3); expect(ex.scoringGroups(levelDef('N1')).length).toBe(3);
  });
  it('bands are heuristic labels; balance warning at >= 25 points; unanswered counted', () => {
    const on = finish('N5', { q1: 'a', q2: 'a', q3: 'a', q4: 'a', q5: 'a', q6: 'a' }); expect(on.band).toBe('on_track');
    const warn = finish('N5', { q1: 'a', q2: 'a', q3: 'a', q4: 'a', q5: 'b', q6: 'b' }); expect(warn.balanceWarning).toBe(true); expect(warn.band).toBe('needs_work');
    const mid = finish('N5', { q1: 'a', q2: 'a', q3: 'b', q4: 'a', q5: 'a' }); expect(mid.unanswered).toBe(1); expect(['borderline', 'needs_work']).toContain(mid.band);
  });
  it('results contain no scaled /180 score, no pass/fail, no CEFR, and carry the practice-estimate label (AC23)', () => {
    const r = finish('N5', { q1: 'a', q2: 'a', q3: 'a', q4: 'a', q5: 'a', q6: 'a' });
    const text = JSON.stringify(r) + JSON.stringify(ex.summarize(ex.createAttempt({ id: 'z', mock: mock(), now: T0 }), r, DAY));
    expect(text).not.toMatch(/\/\s?180|\b180\b|pass(ed)?\b|fail(ed)?\b|CEFR|\bA1\b|\bB2\b/i);
    expect(r.label).toBe('Practice estimate — not a JLPT score'); expect(r.disclaimer).toBe('Original practice exam. Not an official JLPT paper.');
  });
  it('section practice time scales official minutes by the approximate blueprint', () => {
    const bp = { levels: { N5: { vocab: 25 } } };
    expect(ex.sectionPracticeMinutes(levelDef('N5'), 'vocab', bp, 10)).toBe(8); // ceil(10 * 20 / 25)
    expect(ex.sectionPracticeMinutes(levelDef('N5'), 'vocab', null, 10)).toBe(12);
  });
});

describe('readiness dashboard (AC32) and exam-date planner (AC33)', () => {
  const c = realContent();
  const rows = (n, ok, type, facet = 'r') => Array.from({ length: n }, (_, i) => [1, `v_t${i}`, facet, ok(i) ? 1 : 0, 1000, type, 0]);
  it('under 20 attempts shows "Not enough data yet" and never a number', () => {
    const s = { ...emptyState(), attempts: { ring: rows(19, () => true, 'listening_comp', 'l'), counters: { total: 19, correct: 19 } } };
    const r = readiness(s, c, 'N5', NOW);
    expect(r.listening_performance.display).toBe(NO_DATA); expect(r.listening_performance.value).toBeNull();
    expect(r.internal_readiness.display).toBe(NO_DATA);
    const s2 = { ...emptyState(), attempts: { ring: rows(20, () => true, 'listening_comp', 'l'), counters: { total: 20, correct: 20 } } };
    expect(readiness(s2, c, 'N5', NOW).listening_performance.value).toBeCloseTo(1, 5);
  });
  it('internal readiness is always captioned "Not a JLPT score" and never claims a JLPT score', () => {
    const r = readiness(emptyState(), c, 'N5', NOW);
    expect(r.internal_readiness.caption).toBe(NOT_JLPT);
    expect(JSON.stringify(r)).not.toMatch(/\/\s?180|passed the JLPT|CEFR/i);
    expect(r.internal_readiness.how).toMatch(/Not a JLPT score/);
  });
  it('internal readiness appears only with vocabulary progress plus two performance indicators', () => {
    let s = { ...emptyState() };
    s.attempts = { ring: [...rows(25, () => true, 'listening_comp', 'l'), ...rows(25, (i) => i % 2 === 0, 'reading_comp')], counters: { total: 50, correct: 38 } };
    s.progress = { ...s.progress, introduced: { ...s.progress.introduced, vocab: c.vocab.slice(0, 5).map((v) => v.id) } };
    const r = readiness(s, c, 'N5', NOW);
    expect(r.internal_readiness.enough).toBe(true);
    expect(r.internal_readiness.value).toBeLessThanOrEqual(Math.min(r.vocab_progress.value, r.reading_performance.value, r.listening_performance.value) + 0.25 + 1e-9);
  });
  it('weak areas list only items with >= 5 attempts and < 60 % accuracy', () => {
    const s = { ...emptyState(), attempts: { ring: [...rows(6, () => false, 'mcq', 'm').map((r) => { r[1] = 'v_weak'; return r; }), ...rows(3, () => false, 'mcq').map((r) => { r[1] = 'v_few'; return r; })], counters: { total: 9, correct: 0 } } };
    const w = readiness(s, c, 'N5', NOW).weak_areas.value;
    expect(w.some((x) => x.id === 'v_weak')).toBe(true); expect(w.some((x) => x.id === 'v_few')).toBe(false);
  });
  it('EMA helper', () => { expect(ema([1, 1, 1])).toBe(1); expect(ema([])).toBeNull(); expect(ema([0, 1], 0.1)).toBeCloseTo(0.1); });

  describe('exam-date planner', () => {
    const fc = fxContent();
    const base = () => emptyState();
    const date = (d) => new Date((DAY + d) * 86400000).toISOString().slice(0, 10);
    it('uses the spec formulae and the four message bands; never promises passing', () => {
      let s = base(); s = { ...s, journal: { ...s.journal, studyDays: Array.from({ length: 14 }, (_, i) => DAY - 14 + i) } };
      // 2 released N5 units, none complete, 4 weeks left -> required 0.5 units/week
      const mk = (done) => ({ ...s, progress: { ...s.progress, units: Object.fromEntries(done.map((u) => [u, { completedAt: DAY - 3 }])) } });
      const fast = examPlanner(mk(['fx_u1', 'fx_u2']), fc, NOW, { level: 'N5', targetDate: date(28) });
      expect(fast.message).toMatch(/completed every released unit/);
      const s0 = mk(['fx_u1']);
      const r = examPlanner(s0, fc, NOW, { level: 'N5', targetDate: date(7) });
      expect(r.weeksLeft).toBe(1); expect(r.remaining).toBe(1); expect(r.required).toBe(1); expect(r.current).toBe(0.5); expect(r.ratio).toBe(0.5);
      expect(r.message).toMatch(/Unlikely to cover the material in time/);
      const tight = examPlanner(mk(['fx_u1']), fc, NOW, { level: 'N5', targetDate: date(7 * 1) }); void tight;
      const t2 = examPlanner(mk(['fx_u1']), fc, NOW, { level: 'N5', targetDate: date(Math.round(7 / 0.7)) });
      expect(t2.message).toMatch(/Tight/);
      const ok = examPlanner(mk(['fx_u1']), fc, NOW, { level: 'N5', targetDate: date(7 * 3) });
      expect(ok.ratio).toBeGreaterThanOrEqual(1); expect(ok.message).toMatch(/not a prediction of passing/);
      for (const x of [fast, r, t2, ok]) { expect(x.caveats.join(' ')).toMatch(/does not guarantee passing/i); expect(x.message).not.toMatch(/you will pass|guarantee(d)? to pass/i); }
    });
    it('insufficient data (< 14 days of activity) shows the required pace only', () => {
      const r = examPlanner(base(), fc, NOW, { level: 'N5', targetDate: date(28) });
      expect(r.message).toMatch(/Not enough activity data yet/); expect(r.ratio).toBeNull(); expect(r.required).toBeCloseTo(2 / 4, 5);
    });
    it('past dates and missing dates are handled', () => {
      expect(examPlanner(base(), fc, NOW, { level: 'N5', targetDate: date(-3) }).message).toMatch(/already passed/);
      expect(examPlanner(base(), fc, NOW, { level: 'N5', targetDate: '' }).error).toBeTruthy();
    });
    it('partial content is stated in the caveats', () => {
      const r = examPlanner(base(), realContent(), NOW, { level: 'N4', targetDate: date(60) });
      expect(r.partialContent).toBe(true); expect(r.caveats.join(' ')).toMatch(/released/);
    });
  });
});
