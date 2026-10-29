import { describe, it, expect } from 'vitest';
import { emptyState, fxContent, DAY } from '../fixtures/state.js';
import { destinationStates, completeLesson, recordQuestResult, awardReward, levelCriteria, tryUnlockNext, recordLevelEvidence, unitProgress, awardXp, markStudyDay, recordSession, completeIfEligible } from '../../src/engine/progress.js';
import { newRecord, reviewRecord } from '../../src/engine/srs.js';

const doLesson = (state, content, id, score = 0.9) => { const r = completeLesson(state, content, id, { score, day: DAY }); return { ...r.state, srs: state.srs, _events: r.events, _new: r.newRecords }; };

describe('unit completion and lessons', () => {
  it('a unit completes only when all of its lessons are done', () => {
    const c = fxContent(); let s = emptyState();
    s = doLesson(s, c, 'fx_l1');
    expect(unitProgress(s.progress, c, 'fx_u1')).toMatchObject({ done: 1, total: 2, complete: false });
    s = doLesson(s, c, 'fx_l2');
    expect(unitProgress(s.progress, c, 'fx_u1').complete).toBe(true);
    expect(s.progress.units.fx_u1.completedAt).toBe(DAY);
  });
  it('introduced concepts are recorded and scheduled as new SRS facets due tomorrow', () => {
    const c = fxContent(); const r = completeLesson(emptyState(), c, 'fx_l1', { score: 1, day: DAY });
    expect(r.state.progress.introduced.vocab).toEqual(['v_fx1', 'v_fx2']);
    expect(r.newRecords.map((x) => x[0]).sort()).toEqual(['v_fx1:meaning', 'v_fx1:produce', 'v_fx1:read', 'v_fx2:meaning', 'v_fx2:produce', 'v_fx2:read']);
    expect(r.newRecords.every((x) => x[1] === DAY + 1)).toBe(true);
  });
});

describe('destination state machine (AC12, R025): education unlocks, geography never does', () => {
  it('initial states: current-level destinations visible/available, N4 destinations visible_locked, others hidden', () => {
    const c = fxContent(); const st = destinationStates(emptyState().progress, c);
    expect(st.fx_d1.state).toBe('available'); // no prerequisite units, level N5 unlocked
    expect(st.fx_d2.state).toBe('visible_locked');
    expect(st.fx_d3.state).toBe('visible_locked'); // first_visit_level is the next level
  });
  it('discoverable at >= 60 % of the lessons of its units, available only when all prerequisite units are complete', () => {
    const c = fxContent(); let s = emptyState();
    expect(destinationStates(s.progress, c).fx_d2.state).toBe('visible_locked');
    s = doLesson(s, c, 'fx_l1');
    expect(destinationStates(s.progress, c).fx_d2.state).toBe('visible_locked'); // 1 of 3 lessons = 33 %
    s = doLesson(s, c, 'fx_l2');
    // fx_d2 needs fx_u1 (2 lessons) + fx_u2 (1 lesson): 2/3 = 67 % -> discoverable, but fx_u1 is the prerequisite and is complete -> available
    expect(destinationStates(s.progress, c).fx_d2.state).toBe('available');
  });
  it('a destination cannot be available when its parent is completed but its own prerequisites are not (AC12)', () => {
    const c = fxContent();
    c.destById.get('fx_d2').parent_id = 'fx_d1';
    let s = emptyState();
    s = { ...s, progress: { ...s.progress, destinations: { fx_d1: { completedAt: DAY } } } }; // parent completed
    const st = destinationStates(s.progress, c);
    expect(st.fx_d1.state).toBe('completed');
    expect(st.fx_d2.state).not.toBe('available');
    expect(st.fx_d2.state).not.toBe('in_progress');
    expect(st.fx_d2.missingUnits).toEqual(['fx_u1']);
  });
  it('visiting, XP totals and time never unlock anything', () => {
    const c = fxContent(); let s = emptyState();
    s = { ...s, journal: { ...s.journal, xp: { total: 999999, byDay: {} } }, progress: { ...s.progress, currentDestination: 'fx_d2', destinations: { fx_d2: { startedAt: DAY } } } };
    expect(destinationStates(s.progress, c).fx_d2.state).not.toBe('in_progress');
  });
  it('unreleased prerequisite units block availability and are named in the reason', () => {
    const c = fxContent({ unreleased: ['fx_u2'] });
    const st = destinationStates(emptyState().progress, c);
    expect(st.fx_d2.state).toBe('visible_locked');
    expect(st.fx_d2.reason).toMatch(/not released/);
  });
  it('in_progress after the first quest result; completed needs completion units AND the primary quest accuracy', () => {
    const c = fxContent(); let s = emptyState();
    s = doLesson(s, c, 'fx_l1'); s = doLesson(s, c, 'fx_l2');
    let r = recordQuestResult(s, c, 'fx_q1', { accuracy: 0.5, items: 10, day: DAY }); s = r.state;
    expect(destinationStates(s.progress, c).fx_d1.state).toBe('in_progress');
    r = recordQuestResult(s, c, 'fx_q1', { accuracy: 0.8, items: 10, day: DAY }); s = r.state;
    expect(destinationStates(s.progress, c).fx_d1.state).toBe('completed');
    expect(r.events.map((e) => e.type)).toEqual(expect.arrayContaining(['stamp', 'postcard', 'destination_completed']));
  });
  it('quest accuracy alone does not complete a destination whose units are unfinished', () => {
    const c = fxContent(); const s = emptyState();
    const r = recordQuestResult(s, c, 'fx_q1', { accuracy: 1, items: 10, day: DAY });
    expect(destinationStates(r.state.progress, c).fx_d1.state).toBe('in_progress');
    expect(r.state.journal.stamps).toEqual({});
  });
  it('revisit_available when a higher level unlocks and an unfinished tier has released content; completed otherwise', () => {
    const c = fxContent();
    c.quests.push({ id: 'fx_qt', destination_id: 'fx_d1', tier: 'fx_d1_n4', type: 'QT_GREET', question_ids: ['a'], min_accuracy: 0.8, unit_id: 'fx_u3' });
    let s = emptyState();
    s = { ...s, progress: { ...s.progress, destinations: { fx_d1: { completedAt: DAY } } } };
    expect(destinationStates(s.progress, c).fx_d1.state).toBe('completed');
    s = { ...s, progress: { ...s.progress, levels: { ...s.progress.levels, N4: 'unlocked' } } };
    expect(destinationStates(s.progress, c).fx_d1.state).toBe('revisit_available');
  });
});

describe('rewards are idempotent (AC15)', () => {
  it('replaying the quest or re-running the completion check never duplicates stamps, postcards or XP', () => {
    const c = fxContent(); let s = emptyState();
    s = doLesson(s, c, 'fx_l1'); s = doLesson(s, c, 'fx_l2');
    let r = recordQuestResult(s, c, 'fx_q1', { accuracy: 0.9, items: 10, day: DAY }); s = r.state;
    const stampsOnce = JSON.stringify(s.journal.stamps); const xpOnce = s.journal.xp.total;
    for (let i = 0; i < 4; i++) { r = recordQuestResult(s, c, 'fx_q1', { accuracy: 1, items: 10, day: DAY + i }); s = r.state; s = completeIfEligible(s, c, c.destById.get('fx_d1'), DAY + i).state; }
    expect(Object.keys(s.journal.stamps)).toEqual(['stamp_fx_d1']);
    expect(Object.keys(s.journal.postcards)).toEqual(['postcard_fx_d1']);
    expect(JSON.stringify(s.journal.stamps)).toBe(stampsOnce);
    expect(s.journal.xp.total).toBe(xpOnce); // repeats beyond 2 give no XP and destination XP is keyed
  });
  it('awardReward is keyed by reward id', () => {
    const j = emptyState().journal; const ev = { day: DAY, accuracy: 1, items: 1 };
    const a = awardReward(j, 'stamp:x', 'stamp', { id: 'x', destination: 'd' }, ev);
    const b = awardReward(a.journal, 'stamp:x', 'stamp', { id: 'x', destination: 'd' }, ev);
    expect(a.awarded).toBe(true); expect(b.awarded).toBe(false); expect(b.journal).toBe(a.journal);
  });
  it('XP: repeats beyond 2 give 0 and per-day caps apply per activity type', () => {
    let j = emptyState().journal; const got = [];
    for (let i = 0; i < 4; i++) { const r = awardXp(j, { type: 'lesson', key: 'lesson:a', accuracy: 1, day: DAY }); j = r.journal; got.push(r.xp); }
    expect(got).toEqual([20, 20, 0, 0]);
    let k = emptyState().journal; let total = 0;
    for (let i = 0; i < 10; i++) { const r = awardXp(k, { type: 'lesson', key: `lesson:${i}`, accuracy: 1, day: DAY }); k = r.journal; total += r.xp; }
    expect(total).toBe(100); // day cap for lessons
  });
  it('first XP comes after lesson 1; study day rule: core session or >= 15 minutes', () => {
    const c = fxContent(); const r = completeLesson(emptyState(), c, 'fx_l1', { score: 1, day: DAY });
    expect(r.state.journal.xp.total).toBeGreaterThan(0);
    let j = recordSession(emptyState().journal, { day: DAY, minutes: 10, coreCompleted: false });
    expect(j.studyDays).toEqual([]);
    j = recordSession(j, { day: DAY, minutes: 6, coreCompleted: false });
    expect(j.studyDays).toEqual([DAY]);
    expect(markStudyDay(j, DAY)).toBe(j);
  });
});

describe('level unlock (AC11): ALL criteria, released units only, no override', () => {
  const full = (c) => {
    let s = emptyState();
    s = doLesson(s, c, 'fx_l1'); s = doLesson(s, c, 'fx_l2'); s = doLesson(s, c, 'fx_l3');
    // strong mastery on every introduced concept
    const srs = {};
    for (const id of ['v_fx1', 'v_fx2']) for (const f of ['read', 'meaning']) { let r = newRecord(`${id}:${f}`, DAY - 200); for (const d of [-200, -190, -170, -120, -50, -10]) r = reviewRecord(r, 3, DAY + d).record; srs[`${id}:${f}`] = r; }
    return { ...s, srs };
  };
  it('cannot unlock N4 with curriculum done but no readiness check or milestone', () => {
    const c = fxContent(); const s = full(c);
    const crit = levelCriteria('N5', s, c, DAY);
    expect(crit.curriculum.met).toBe(true); expect(crit.readiness.met).toBe(false); expect(crit.milestone.met).toBe(false); expect(crit.allMet).toBe(false);
    const r = tryUnlockNext(s, c, 'N5', DAY, DAY);
    expect(r.unlocked).toBe(false); expect(r.state.progress.levels.N4).toBe('locked');
  });
  it('each criterion is individually required', () => {
    const c = fxContent(); const base = full(c);
    const withEv = (patch) => ({ ...base, progress: recordLevelEvidence(base.progress, 'N5', patch) });
    const all = { readinessPassedAt: DAY, readinessScore: 0.8, milestoneBest: 0.7 };
    expect(levelCriteria('N5', withEv(all), c, DAY).allMet).toBe(true);
    expect(levelCriteria('N5', withEv({ ...all, milestoneBest: 0.6 }), c, DAY).allMet).toBe(false);
    expect(levelCriteria('N5', withEv({ readinessScore: 0.8, milestoneBest: 0.7 }), c, DAY).allMet).toBe(false);
    const lowMastery = { ...withEv(all), srs: {} };
    expect(levelCriteria('N5', lowMastery, c, DAY).mastery.met).toBe(false);
    const missingLesson = { ...withEv(all), progress: { ...withEv(all).progress, lessons: { fx_l1: { doneAt: 1 }, fx_l2: { doneAt: 1 } } } };
    expect(levelCriteria('N5', missingLesson, c, DAY).curriculum.met).toBe(false);
  });
  it('unlocks N4 only when everything is met; thresholds apply to released units only', () => {
    const c = fxContent({ unreleased: [] }); let s = full(c);
    s = { ...s, progress: recordLevelEvidence(s.progress, 'N5', { readinessPassedAt: DAY, readinessScore: 0.75, milestoneBest: 0.65 }) };
    const r = tryUnlockNext(s, c, 'N5', DAY, DAY);
    expect(r.unlocked).toBe(true); expect(r.state.progress.levels.N4).toBe('unlocked');
    // with one unit unreleased the percentage is computed over the released ones only and flags partial content
    const c2 = fxContent({ unreleased: ['fx_u2'] });
    const crit = levelCriteria('N5', { ...s, progress: { ...s.progress, lessons: { fx_l1: { doneAt: 1 }, fx_l2: { doneAt: 1 } } } }, c2, DAY);
    expect(crit.releasedUnits).toBe(1); expect(crit.curriculum.value).toBe(100); expect(crit.partialContent).toBe(true);
  });
  it('the API has no override parameter (no UI bypass)', () => {
    expect(tryUnlockNext.length).toBe(5);
    const c = fxContent(); const s = emptyState();
    expect(tryUnlockNext({ ...s, progress: { ...s.progress, levels: { ...s.progress.levels } } }, c, 'N5', DAY, DAY, true).unlocked).toBe(false);
  });
});
