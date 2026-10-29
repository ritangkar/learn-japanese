// Progression: units, destination state machine (spec progression_rules), rewards, XP, level unlock. Pure over snapshots.
import { PARAMS } from './params.js';
import { averageMastery } from './mastery.js';
import { lessonConcepts, LEVELS } from '../content/runtime.js';
import { localDay } from '../core/clock.js';
import { newRecord } from './srs.js';
import { facetKey, FACETS_BY_KIND, kindOfId } from './mastery.js';

export const DEST_STATES = Object.freeze(['hidden', 'visible_locked', 'discoverable', 'available', 'in_progress', 'completed', 'revisit_available']);

// ---------- units and lessons ----------
export function unitProgress(progress, content, unitId) {
  const u = content.unitById.get(unitId);
  const lessons = u?.lessons || [];
  const done = lessons.filter((l) => progress.lessons[l]).length;
  return { unitId, released: !!u?.released, total: lessons.length, done, pct: lessons.length ? done / lessons.length : 0, complete: !!u?.released && lessons.length > 0 && done === lessons.length };
}
export const unitComplete = (progress, content, unitId) => unitProgress(progress, content, unitId).complete;

/** First incomplete lesson of the earliest released unit that is unlocked (levels unlocked, prior units complete). */
export function nextLesson(progress, content) {
  for (const u of content.units) {
    if (!u.released || progress.levels[u.level] === 'locked') continue;
    for (const lid of u.lessons) if (!progress.lessons[lid]) return content.lessonById.get(lid) || null;
  }
  return null;
}

// ---------- XP and study days ----------
export const XP_BASE = { lesson: 20, review: 15, quest: 40, practice: 10, mock_section: 25, comeback: 15 };
export const XP_DAY_CAP = { lesson: 100, review: 60, quest: 120, practice: 60, mock_section: 100, comeback: 15 };
export function xpFor(type, accuracy) { return Math.round((XP_BASE[type] || 0) * (0.5 + 0.5 * Math.max(0, Math.min(1, accuracy)))); }

/** Award XP for an activity. Repeats of the same activity key beyond 2 give 0; per-day caps apply per activity type. */
export function awardXp(journal, { type, key, accuracy, day, amount = null }) {
  const completions = journal.xpKeys?.[key] || 0;
  const todayByType = journal.xp.byDay[day]?.[type] || 0;
  let xp = amount ?? xpFor(type, accuracy);
  if (completions >= 2) xp = 0;
  xp = Math.max(0, Math.min(xp, (XP_DAY_CAP[type] ?? 50) - todayByType));
  const byDay = { ...journal.xp.byDay, [day]: { ...(journal.xp.byDay[day] || {}), [type]: todayByType + xp } };
  // keep only the last 60 days of per-day detail
  const days = Object.keys(byDay).map(Number).sort((a, b) => a - b);
  for (const d of days.slice(0, Math.max(0, days.length - 60))) delete byDay[d];
  return { journal: { ...journal, xp: { total: journal.xp.total + xp, byDay }, xpKeys: { ...(journal.xpKeys || {}), [key]: completions + 1 } }, xp };
}

export function markStudyDay(journal, day) {
  if (journal.studyDays.includes(day)) return journal;
  const days = [...journal.studyDays, day].sort((a, b) => a - b).slice(-400);
  return { ...journal, studyDays: days };
}
/** Record a finished session. A study day = a core session completed OR >= 15 active minutes that day. */
export function recordSession(journal, { day, minutes, coreCompleted }) {
  const active = { ...journal.activeMinutes, [day]: (journal.activeMinutes[day] || 0) + minutes };
  const keys = Object.keys(active).map(Number).sort((a, b) => a - b);
  for (const k of keys.slice(0, Math.max(0, keys.length - 60))) delete active[k];
  let j = { ...journal, activeMinutes: active };
  if (coreCompleted || active[day] >= 15) j = markStudyDay(j, day);
  return j;
}

// ---------- rewards (idempotent) ----------
export function awardReward(journal, rewardId, kind, payload, evidence) {
  if (journal.rewards[rewardId]) return { journal, awarded: false };
  const rewards = { ...journal.rewards, [rewardId]: { kind, at: evidence.day, evidence } };
  const j = { ...journal, rewards };
  if (kind === 'stamp') j.stamps = { ...journal.stamps, [payload.id]: { destination: payload.destination, tier: payload.tier || null, day: evidence.day, accuracy: evidence.accuracy, items: evidence.items } };
  if (kind === 'postcard') j.postcards = { ...journal.postcards, [payload.id]: { destination: payload.destination, day: evidence.day } };
  if (kind === 'achievement') j.achievements = { ...journal.achievements, [payload.id]: { day: evidence.day, evidence: evidence.summary || null } };
  return { journal: j, awarded: true };
}

// ---------- destination state machine ----------
function highestUnlocked(progress) { let h = 0; LEVELS.forEach((L, i) => { if (progress.levels[L] && progress.levels[L] !== 'locked') h = i; }); return h; }

export function destinationStates(progress, content) {
  const hi = highestUnlocked(progress);
  const out = {};
  for (const d of content.destinations) {
    const stored = progress.destinations[d.id] || {};
    const firstIdx = LEVELS.indexOf(d.first_visit_level);
    const prereq = [...new Set(d.unlock.all_units_completed)];
    const all = [...new Set([...prereq, ...d.completion.units_completed])];
    const unreleased = all.filter((u) => !content.unitById.get(u)?.released);
    const missing = prereq.filter((u) => !unitComplete(progress, content, u));
    const lessonsDone = all.reduce((a, u) => a + unitProgress(progress, content, u).done, 0);
    const lessonsTotal = all.reduce((a, u) => a + (content.unitById.get(u)?.lessons.length || 0), 0);
    const pct = all.length === 0 ? 1 : (unreleased.length ? 0 : (lessonsTotal ? lessonsDone / lessonsTotal : 0));
    const levelUnlocked = progress.levels[d.unlock.level_unlocked] && progress.levels[d.unlock.level_unlocked] !== 'locked';
    const info = { id: d.id, missingUnits: missing, unreleasedUnits: unreleased, pct, levelUnlocked: !!levelUnlocked };
    // rule 6: revisit tiers become available when a higher level has unlocked and an unfinished tier has released content
    const tiers = (d.revisit_tiers || []).map((t) => ({ ...t, unlocked: LEVELS.indexOf(t.level) <= hi, done: !!stored.tiers?.[t.tier_id]?.doneAt, content: content.quests.some((q) => q.destination_id === d.id && q.tier === t.tier_id) }));
    info.tiers = tiers;
    if (stored.completedAt) {
      info.state = tiers.some((t) => t.unlocked && !t.done && t.content) ? 'revisit_available' : 'completed';
    } else if (levelUnlocked && missing.length === 0 && unreleased.filter((u) => prereq.includes(u)).length === 0) {
      info.state = stored.startedAt ? 'in_progress' : 'available';
    } else if (pct >= 0.6 && unreleased.length === 0) info.state = 'discoverable';
    else if (firstIdx === hi || firstIdx === hi + 1) info.state = 'visible_locked';
    else info.state = 'hidden';
    if (info.state === 'visible_locked' || info.state === 'discoverable') {
      info.reason = unreleased.length ? `Needs content that is not released yet: ${unreleased.join(', ')}` : !levelUnlocked ? `Level ${d.unlock.level_unlocked} is not unlocked yet` : `Complete: ${missing.join(', ')}`;
    }
    out[d.id] = info;
  }
  return out;
}

/** Mark a quest started (moves available -> in_progress). */
export function startDestination(progress, destId, day) {
  const cur = progress.destinations[destId] || {};
  if (cur.startedAt) return progress;
  return { ...progress, destinations: { ...progress.destinations, [destId]: { ...cur, startedAt: day } } };
}

/**
 * Record a quest result and complete the destination when both conditions hold (completion units done AND primary quest >= min accuracy).
 * Idempotent: completion rewards are keyed and never duplicated.
 */
export function recordQuestResult(state, content, questId, { accuracy, items, day }) {
  const q = content.quests.find((x) => x.id === questId);
  if (!q) return { state, events: [] };
  let { progress, journal } = state;
  const d = content.destById.get(q.destination_id);
  const cur = progress.destinations[d.id] || {};
  const qs = { ...(cur.quests || {}) };
  const prev = qs[questId] || { best: 0, attempts: 0 };
  qs[questId] = { best: Math.max(prev.best, accuracy), attempts: prev.attempts + 1, lastDay: day };
  progress = { ...progress, destinations: { ...progress.destinations, [d.id]: { ...cur, startedAt: cur.startedAt ?? day, quests: qs } } };
  const events = [];
  // xp: base * accuracy, repeats beyond 2 give 0
  const x = awardXp(journal, { type: 'quest', key: `quest:${questId}`, accuracy, day });
  journal = x.journal;
  if (x.xp) events.push({ type: 'xp', amount: x.xp });
  const res = completeIfEligible({ ...state, progress, journal }, content, d, day, items);
  return { state: res.state, events: [...events, ...res.events] };
}

export function completeIfEligible(state, content, d, day, items = 0) {
  let { progress, journal } = state;
  const st = progress.destinations[d.id] || {};
  const events = [];
  if (st.completedAt) return { state, events };
  const unitsOk = d.completion.units_completed.every((u) => unitComplete(progress, content, u));
  const primary = content.quests.find((q) => q.destination_id === d.id && !q.tier && q.type === (d.quests.find((x) => x.primary)?.type));
  const best = primary ? (st.quests?.[primary.id]?.best ?? 0) : 0;
  if (!unitsOk || !primary || best < d.completion.min_quest_accuracy) return { state, events };
  progress = { ...progress, destinations: { ...progress.destinations, [d.id]: { ...st, completedAt: day } } };
  const evidence = { day, accuracy: best, items: items || primary.question_ids.length, summary: `${d.name_en}: quest ${Math.round(best * 100)} %` };
  const stamp = awardReward(journal, `stamp:${d.rewards.stamp_id}`, 'stamp', { id: d.rewards.stamp_id, destination: d.id }, evidence);
  journal = stamp.journal; if (stamp.awarded) events.push({ type: 'stamp', id: d.rewards.stamp_id, destination: d.id });
  const post = awardReward(journal, `postcard:${d.rewards.postcard_id}`, 'postcard', { id: d.rewards.postcard_id, destination: d.id }, evidence);
  journal = post.journal; if (post.awarded) events.push({ type: 'postcard', id: d.rewards.postcard_id, destination: d.id });
  if (!journal.rewards[`xp:dest:${d.id}`]) {
    const x = awardXp(journal, { type: 'quest', key: `destxp:${d.id}`, amount: d.rewards.xp, day });
    journal = { ...x.journal, rewards: { ...x.journal.rewards, [`xp:dest:${d.id}`]: { kind: 'xp', at: day, evidence } } };
    events.push({ type: 'xp', amount: d.rewards.xp });
  }
  events.push({ type: 'destination_completed', id: d.id });
  return { state: { ...state, progress, journal }, events };
}

/** After a lesson completes, any destination whose quest was already passed may now be complete. */
export function reevaluateDestinations(state, content, day) {
  let s = state; const events = [];
  for (const d of content.destinations) { const r = completeIfEligible(s, content, d, day); s = r.state; events.push(...r.events); }
  return { state: s, events };
}

// ---------- lesson completion ----------
export function scheduleIntroduced(srs, conceptIds, today) {
  const recs = [];
  for (const id of conceptIds) {
    const kind = kindOfId(id); if (!kind) continue;
    const facets = kind === 'vocab' ? ['read', 'meaning', 'produce'] : FACETS_BY_KIND[kind].all.filter((f) => f !== 'listen');
    for (const f of facets) { const k = facetKey(id, f); if (!srs[k]) recs.push(newRecord(k, today + 1)); }
  }
  return recs;
}

/** Complete a lesson (exit check >= pass). Returns the new progress/journal, new SRS records to insert and events. */
export function completeLesson(state, content, lessonId, { score, day }) {
  const lesson = content.lessonById.get(lessonId);
  let { progress, journal } = state;
  const events = [];
  const first = !progress.lessons[lessonId];
  const prev = progress.lessons[lessonId];
  progress = { ...progress, lessons: { ...progress.lessons, [lessonId]: { doneAt: prev?.doneAt ?? day, score: Math.max(prev?.score ?? 0, score), count: (prev?.count || 0) + 1 } } };
  const concepts = lessonConcepts(lesson);
  const intro = { ...progress.introduced };
  for (const [k, ids] of Object.entries(lesson.introduces || {})) intro[k] = [...new Set([...(intro[k] || []), ...ids])];
  progress = { ...progress, introduced: intro };
  const x = awardXp(journal, { type: 'lesson', key: `lesson:${lessonId}`, accuracy: score, day });
  journal = x.journal; if (x.xp) events.push({ type: 'xp', amount: x.xp });
  if (first) events.push({ type: 'lesson_completed', id: lessonId });
  const unit = lesson.unit_id;
  const before = progress; // unit completion event
  if (unitComplete(progress, content, unit) && !before.units[unit]) { progress = { ...progress, units: { ...progress.units, [unit]: { completedAt: day } } }; events.push({ type: 'unit_completed', id: unit }); }
  const newRecords = scheduleIntroduced(state.srs, concepts, day);
  const res = reevaluateDestinations({ ...state, progress, journal }, content, day);
  return { state: res.state, newRecords, events: [...events, ...res.events] };
}

// ---------- level unlock (owner decision: ALL criteria; thresholds on released units only; no manual override) ----------
export function levelCriteria(level, state, content, today) {
  const L = PARAMS.level_unlock;
  const released = content.releasedUnits(level);
  const completed = released.filter((u) => unitComplete(state.progress, content, u.id));
  const pct = released.length ? (100 * completed.length) / released.length : 0;
  const conceptIds = [...new Set(content.lessons.filter((l) => content.unitLevel(l.unit_id) === level && state.progress.lessons[l.id]).flatMap(lessonConcepts))];
  const mastery = averageMastery(state.srs, conceptIds, today);
  const ev = state.progress.levelEvidence?.[level] || {};
  const c = {
    level, releasedUnits: released.length, totalUnits: content.units.filter((u) => u.level === level).length, completedUnits: completed.length,
    curriculum: { value: pct, min: L.released_units_completed_pct, met: released.length > 0 && pct >= L.released_units_completed_pct },
    mastery: { value: mastery, min: L.mastery_avg_min, met: conceptIds.length > 0 && mastery >= L.mastery_avg_min, concepts: conceptIds.length },
    readiness: { value: ev.readinessScore ?? null, min: L.readiness_pass, met: !!ev.readinessPassedAt },
    milestone: { value: ev.milestoneBest ?? null, min: L.milestone_pass, met: (ev.milestoneBest ?? 0) >= L.milestone_pass },
  };
  c.allMet = c.curriculum.met && c.mastery.met && c.readiness.met && c.milestone.met;
  c.next = LEVELS[LEVELS.indexOf(level) + 1] || null;
  c.partialContent = c.releasedUnits < c.totalUnits;
  return c;
}

export function levelState(level, state, content, today) {
  if (state.progress.levels[level] === 'locked') return 'locked';
  const c = levelCriteria(level, state, content, today);
  if (c.allMet) return 'milestone_practice_done';
  if (c.readiness.met) return 'readiness_passed';
  if (c.curriculum.met) return 'curriculum_complete';
  return c.completedUnits > 0 || Object.keys(state.progress.lessons).some((l) => content.lessonById.get(l)?.unit_id && content.unitLevel(content.lessonById.get(l).unit_id) === level) ? 'in_progress' : 'unlocked';
}

/** Unlock the next level iff every criterion is met. There is intentionally no override parameter. */
export function tryUnlockNext(state, content, level, today, day) {
  const c = levelCriteria(level, state, content, today);
  if (!c.allMet || !c.next || state.progress.levels[c.next] !== 'locked') return { state, unlocked: false, criteria: c };
  const progress = { ...state.progress, levels: { ...state.progress.levels, [c.next]: 'unlocked' }, levelEvidence: { ...state.progress.levelEvidence, [level]: { ...(state.progress.levelEvidence?.[level] || {}), unlockedNextAt: day } } };
  return { state: { ...state, progress }, unlocked: true, criteria: c };
}

export function recordLevelEvidence(progress, level, patch) {
  const cur = progress.levelEvidence?.[level] || {};
  const next = { ...cur, ...patch };
  if (patch.milestoneBest !== undefined) next.milestoneBest = Math.max(cur.milestoneBest ?? 0, patch.milestoneBest);
  if (patch.readinessScore !== undefined) next.readinessScore = Math.max(cur.readinessScore ?? 0, patch.readinessScore);
  return { ...progress, levelEvidence: { ...(progress.levelEvidence || {}), [level]: next } };
}

export { localDay };
