import { describe, it, expect } from 'vitest';
import { emptyState, fxContent, realContent, withDueFacets, withStudyDays, DAY, NOW } from '../fixtures/state.js';
import { plan, dueFacets, burySiblings, modalityGap, constructionGap, activeConfusions, examShare, weeksToExam, deferrals, dailyMinutesRecommendation, eligibleForSpiral } from '../../src/engine/planner.js';
import { completeLesson } from '../../src/engine/progress.js';
import { newRecord, reviewRecord } from '../../src/engine/srs.js';
import { PARAMS } from '../../src/engine/params.js';
import { shuffle } from '../../src/engine/prng.js';

const start = () => { const c = fxContent(); let s = emptyState(); const r = completeLesson(s, c, 'fx_l1', { score: 1, day: DAY - 1 }); s = { ...r.state, srs: {} }; return { c, s: withStudyDays(s, [DAY - 1]) }; };
const attempts = (rows) => ({ ring: rows, counters: { total: rows.length, correct: rows.filter((r) => r[3]).length } });
const row = (facet, ok, type = 'mcq', target = 'v_x', sched = 0, minute = 1) => [minute, target, facet, ok ? 1 : 0, 1000, type, sched];

describe('planner determinism and basics (AC20)', () => {
  it('same state + same time = identical plan (deep equality, repeated)', () => {
    const { c, s } = start(); const st = withDueFacets(s, 12);
    const a = plan(st, c, NOW); const b = plan(st, c, NOW); const d = plan(structuredClone(st), c, NOW);
    expect(a).toEqual(b); expect(a).toEqual(d);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
  it('every block carries a reason code and learner-facing reason text', () => {
    const { c, s } = start(); const p = plan(withDueFacets(s, 5), c, NOW);
    expect(p.blocks.length).toBeGreaterThan(0);
    for (const b of p.blocks) { expect(b.reason_code).toBeTruthy(); expect(b.reason_text.length).toBeGreaterThan(10); expect(b.minutes).toBeGreaterThan(0); }
  });
  it('default 30-minute plan follows the time budget (review 8, new 10, ...)', () => {
    const { c, s } = start(); const p = plan(withDueFacets(s, 24), c, NOW);
    const by = Object.fromEntries(p.blocks.map((b) => [b.type, b.minutes]));
    expect(by.lesson).toBe(10);
    expect(by.review).toBeLessThanOrEqual(8);
  });
});

describe('E01 backlog safety', () => {
  it('due > 2x cap: only cap reviews, rest deferred over 7 days with per-day cap, no new material', () => {
    const { c, s } = start(); const st = withDueFacets(s, 80);
    const p = plan(st, c, NOW);
    expect(p.mode).toBe('backlog'); expect(p.rules).toContain('E01');
    const rev = p.blocks.find((b) => b.type === 'review');
    expect(rev.items.length).toBe(25);
    expect(p.blocks.some((b) => b.type === 'lesson')).toBe(false);
    expect(p.deferrals.length).toBe(80 - 25);
    const perDay = {}; for (const d of p.deferrals) perDay[d.due] = (perDay[d.due] || 0) + 1;
    expect(Math.max(...Object.values(perDay))).toBeLessThanOrEqual(25);
    expect(Math.min(...p.deferrals.map((d) => d.due))).toBe(DAY + 1); expect(Math.max(...p.deferrals.map((d) => d.due))).toBeLessThanOrEqual(DAY + 7);
  });
  it('exactly 2x the cap is not backlog mode', () => {
    const { c, s } = start(); expect(plan(withDueFacets(s, 50), c, NOW).mode).not.toBe('backlog');
  });
  it('lowest-retrievability facets are scheduled first', () => {
    const { s } = start(); const st = withDueFacets(s, 30);
    const d = dueFacets(st, DAY); for (let i = 1; i < d.length; i++) expect(d[i - 1].r).toBeLessThanOrEqual(d[i].r);
  });
});

describe('E02 leech, E03 confusion, E06/E07 gaps', () => {
  it('E02: facets with >= 3 lapses are flagged; parked facets are skipped', () => {
    const { c, s } = start(); let st = { ...s, concepts: { ...s.concepts, leech: { 'v_fx1:meaning': DAY - 2 } } };
    expect(plan(st, c, NOW).rules).toContain('E02');
    st = { ...st, concepts: { ...st.concepts, parked: { 'v_fx1:meaning': DAY + 7 } } };
    expect(plan(st, c, NOW).rules).not.toContain('E02');
  });
  it('E03: 3 errors between a pair within 14 days triggers a contrast drill; cleared after 3 correct contrasts', () => {
    const base = emptyState().concepts;
    const trig = { ...base, confusions: { 'a|b': { events: [DAY - 3, DAY - 2, DAY - 1], streak: 0 } } };
    expect(activeConfusions(trig, DAY)).toEqual(['a|b']);
    expect(activeConfusions({ ...base, confusions: { 'a|b': { events: [DAY - 30, DAY - 20, DAY - 1], streak: 0 } } }, DAY)).toEqual([]);
    expect(activeConfusions({ ...base, confusions: { 'a|b': { events: [DAY - 3, DAY - 2, DAY - 1], streak: 3 } } }, DAY)).toEqual([]);
    const { c, s } = start();
    expect(plan({ ...s, concepts: trig }, c, NOW).blocks.some((b) => b.type === 'contrast')).toBe(true);
  });
  it('E06: modality gap >= 0.25 over >= 6 listening attempts adds a listening drill on the missed items', () => {
    const rows = [...Array.from({ length: 8 }, () => row('m', true)), ...Array.from({ length: 6 }, (_, i) => row('l', i < 2, 'listening_comp', `v_l${i}`))];
    const g = modalityGap(attempts(rows)); expect(g.gap).toBeGreaterThanOrEqual(0.25); expect(g.items).toContain('v_l5');
    expect(modalityGap(attempts(rows.slice(0, 10)))).toBeNull(); // not enough listening attempts
    const { c, s } = start(); expect(plan({ ...s, attempts: attempts(rows) }, c, NOW).blocks.some((b) => b.type === 'listening_drill')).toBe(true);
  });
  it('E07: recognition >= 0.8 and construction <= 0.6 over >= 5 attempts adds construction practice', () => {
    const rows = [...Array.from({ length: 10 }, (_, i) => row('r', i < 9)), ...Array.from({ length: 5 }, (_, i) => row('c', i < 2, 'sentence_order'))];
    expect(constructionGap(attempts(rows))).not.toBeNull();
    expect(constructionGap(attempts(rows.slice(0, 12)))).toBeNull();
    const { c, s } = start(); expect(plan({ ...s, attempts: attempts(rows) }, c, NOW).rules).toContain('E07');
  });
});

describe('E04 reviews, E05 new material gate', () => {
  it('E04: up to the cap of 25, siblings of the same concept are not adjacent', () => {
    const list = ['a:read', 'a:meaning', 'b:read', 'c:read', 'b:meaning', 'a:produce'].map((key) => ({ key, concept: key.split(':')[0] }));
    const out = burySiblings(list);
    for (let i = 1; i < out.length; i++) expect(out[i].concept).not.toBe(out[i - 1].concept);
    expect(out).toHaveLength(list.length);
    const { c, s } = start(); const p = plan(withDueFacets(s, 40), c, NOW);
    expect(p.blocks.find((b) => b.type === 'review').items.length).toBe(25);
  });
  it('E05: no new lesson when due > 1.5x cap, or recent accuracy < 0.7; allowed otherwise', () => {
    const { c, s } = start();
    expect(plan(withDueFacets(s, 37), c, NOW).blocks.some((b) => b.type === 'lesson')).toBe(true); // 37/25 = 1.48 <= 1.5
    expect(plan(withDueFacets(s, 38), c, NOW).blocks.some((b) => b.type === 'lesson')).toBe(false); // 38/25 = 1.52 > 1.5
    expect(plan(withDueFacets(s, 40), c, NOW).blocks.some((b) => b.type === 'lesson')).toBe(false);
    const low = attempts(Array.from({ length: 20 }, (_, i) => row('m', i < 10)));
    expect(plan({ ...s, attempts: low }, c, NOW).blocks.some((b) => b.type === 'lesson')).toBe(false);
    const ok = attempts(Array.from({ length: 20 }, (_, i) => row('m', i < 19)));
    expect(plan({ ...s, attempts: ok }, c, NOW).blocks.some((b) => b.type === 'lesson')).toBe(true);
  });
  it('E05: accuracy < 0.8 reduces the new-item budget by 30 %', () => {
    const { c, s } = start();
    const a = plan({ ...s, attempts: attempts(Array.from({ length: 20 }, (_, i) => row('m', i < 15))) }, c, NOW);
    const b = plan({ ...s, attempts: attempts(Array.from({ length: 20 }, (_, i) => row('m', i < 19))) }, c, NOW);
    expect(a.newItemBudget.words).toBe(Math.round(6 * 0.7)); expect(b.newItemBudget.words).toBe(6);
  });
});

describe('E08 quest, E09 exam proximity, E10 mastered, E11 revisit, E12 extension', () => {
  it('E08: adds one quest step for an available destination', () => {
    const c = fxContent(); const s = emptyState();
    const p = plan(s, c, NOW); const q = p.blocks.find((b) => b.type === 'quest');
    expect(q.destinationId).toBe('fx_d1'); expect(p.rules).toContain('E08');
  });
  it('E09: share of time at <= 8 / 4 / 2 weeks', () => {
    expect(examShare(9)).toBe(0); expect(examShare(8)).toBe(0.1); expect(examShare(4)).toBe(0.25); expect(examShare(2)).toBe(0.4); expect(examShare(0.5)).toBe(0.4); expect(examShare(null)).toBe(0);
    const { c, s } = start();
    const withDate = (days) => { const d = new Date((DAY + days) * 86400000).toISOString().slice(0, 10); return { ...s, settings: { ...s.settings, targetExamDate: d, targetLevel: 'N5' } }; };
    expect(weeksToExam(withDate(14).settings, DAY)).toBe(2);
    const p = plan(withDueFacets(withDate(14), 10), c, NOW);
    const ex = p.blocks.find((b) => b.type === 'exam_practice');
    expect(ex).toBeTruthy(); expect(ex.reason_text).toMatch(/not a score prediction/i);
    expect(p.blocks.find((b) => b.type === 'review').items.length).toBe(10); // reviews stay intact
    expect(plan(withDate(100), c, NOW).blocks.some((b) => b.type === 'exam_practice')).toBe(false);
  });
  it('E10: stable_retention concepts appear in spiral practice at most once per 3 weeks', () => {
    let r = newRecord('v_fx1:read', 1); for (const d of [1, 3, 8, 20, 50, 110, 250]) r = reviewRecord(r, 3, d).record;
    let r2 = newRecord('v_fx1:meaning', 1); for (const d of [1, 3, 8, 20, 50, 110, 250]) r2 = reviewRecord(r2, 3, d).record;
    const st = { ...emptyState(), srs: { 'v_fx1:read': r, 'v_fx1:meaning': r2 } };
    expect(eligibleForSpiral(st, 'v_fx1', 260, null)).toBe(true);
    expect(eligibleForSpiral(st, 'v_fx1', 260, 250)).toBe(false);
    expect(eligibleForSpiral(st, 'v_fx1', 272, 250)).toBe(true);
  });
  it('E12: extension blocks (10, 5, 10, 5) are optional and only on request', () => {
    const { c, s } = start();
    expect(plan(s, c, NOW).rules).not.toContain('E12');
    const p = plan(s, c, NOW, { extension: true });
    const ext = p.blocks.filter((b) => b.type === 'extension');
    expect(ext.map((b) => b.minutes)).toEqual([10, 5, 10, 5]); expect(ext.every((b) => b.core === false)).toBe(true);
    expect(p.optionalMinutes).toBeGreaterThanOrEqual(30);
  });
  it('E11: completed destination with a released unfinished tier is suggested as optional', () => {
    const c = fxContent(); c.quests.push({ id: 'fx_qt', destination_id: 'fx_d1', tier: 'fx_d1_n4', type: 'QT_GREET', question_ids: ['a'], min_accuracy: 0.8, unit_id: 'fx_u3' });
    let s = emptyState(); s = { ...s, progress: { ...s.progress, levels: { ...s.progress.levels, N4: 'unlocked' }, destinations: { fx_d1: { completedAt: DAY - 3 } } } };
    const p = plan(s, c, NOW); const rv = p.blocks.find((b) => b.type === 'revisit');
    expect(rv.core).toBe(false); expect(p.rules).toContain('E11');
  });
});

describe('missed days (R024, AC21)', () => {
  it('gap 0-2 days: normal plan', () => {
    const { c, s } = start(); expect(plan(withDueFacets(withStudyDays(s, [DAY - 2]), 10), c, NOW).mode).toBe('normal');
  });
  it('missed 4 days: comeback session of <= 15 reviews and no new items', () => {
    const { c, s } = start(); const st = withDueFacets(withStudyDays(s, [DAY - 4]), 40);
    const p = plan(st, c, NOW);
    expect(p.mode).toBe('comeback');
    expect(p.blocks.find((b) => b.type === 'review').items.length).toBeLessThanOrEqual(15);
    expect(p.blocks.some((b) => b.type === 'lesson')).toBe(false);
    expect(p.notes.join(' ')).not.toMatch(/miss|lazy|streak|shame|fail/i);
    expect(p.notes.join(' ')).toMatch(/nothing was lost/i);
  });
  it('gap 3 and gap 7 are comeback; gap 8+ is welcome-back with <= 20 reviews and the rest spread over 7 days', () => {
    const { c, s } = start(); const mk = (g) => plan(withDueFacets(withStudyDays(s, [DAY - g]), 60), c, NOW);
    expect(mk(3).mode).toBe('comeback'); expect(mk(7).mode).toBe('comeback');
    const w = mk(8); expect(w.mode).toBe('welcome_back');
    expect(w.blocks.find((b) => b.type === 'review').items.length).toBeLessThanOrEqual(20);
    expect(w.deferrals.length).toBe(60 - 20);
    expect(Math.max(...w.deferrals.map((d) => d.due))).toBeLessThanOrEqual(DAY + 7);
  });
  it('after the comeback session is done the plan returns to normal', () => {
    const { c, s } = start(); const st = withDueFacets(withStudyDays(s, [DAY - 5]), 10);
    const done = { ...st, journal: { ...st.journal, comebackDone: [DAY] } };
    expect(plan(done, c, NOW).mode).toBe('normal');
  });
  it('deferral helper respects the per-day cap', () => {
    const d = deferrals(Array.from({ length: 60 }, (_, i) => ({ key: `k${i}` })), DAY, 25, 7);
    expect(d.filter((x) => x.due === DAY + 1).length).toBe(25);
  });
});

describe('daily minutes recommendation and real content', () => {
  it('suggests lowering below 0.6x and raising above 1.3x, within [15, 60], never auto-changing', () => {
    const s = emptyState(); const mk = (m) => ({ ...s.journal, activeMinutes: Object.fromEntries(Array.from({ length: 5 }, (_, i) => [DAY - 1 - i, m])) });
    expect(dailyMinutesRecommendation(mk(10), s.settings, DAY).direction).toBe('lower');
    expect(dailyMinutesRecommendation(mk(45), s.settings, DAY).direction).toBe('raise');
    expect(dailyMinutesRecommendation(mk(30), s.settings, DAY)).toBeNull();
    expect(dailyMinutesRecommendation(mk(5), s.settings, DAY).suggest).toBeGreaterThanOrEqual(15);
  });
  it('a brand-new learner with the real N5 content gets a first-lesson plan', () => {
    const c = realContent(); const p = plan(emptyState(), c, NOW);
    expect(p.blocks[0].type).toBe('lesson'); expect(p.blocks[0].lessonId).toBe('n5_u01_l1');
  });
  it('shuffle is seeded (planning never uses unseeded randomness)', () => {
    expect(shuffle([1, 2, 3, 4, 5], 'x')).toEqual(shuffle([1, 2, 3, 4, 5], 'x'));
    expect(PARAMS.leech_lapses).toBe(3);
  });
});
