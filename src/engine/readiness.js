// Readiness indicators and the exam-date planner (spec readiness_dashboard). Everything is labelled internal practice data.
import { PARAMS } from './params.js';
import { averageMastery } from './mastery.js';
import { dueFacets } from './planner.js';
import { localDay } from '../core/clock.js';
import { lessonConcepts } from '../content/runtime.js';

export const NOT_JLPT = 'Not a JLPT score';
export const NO_DATA = 'Not enough data yet';
const MIN = PARAMS.readiness_min_attempts;

export function ema(values, alpha = 0.1) {
  if (!values.length) return null;
  let e = values[0];
  for (let i = 1; i < values.length; i++) e = alpha * values[i] + (1 - alpha) * e;
  return e;
}
const pct = (x) => (x === null ? null : Math.round(x * 1000) / 10);

export function levelConcepts(content, level, kind) {
  const pool = { vocab: content.vocab, grammar: content.grammar, kanji: content.kanji, kana: level === 'N5' ? content.kana.filter((k) => k.group === 'basic') : [] }[kind] || [];
  return pool.filter((x) => (x.instructional_level || level) === level).map((x) => x.id);
}

/** Returns indicator objects {id, label, value|null, display, enough, n, how}. */
export function readiness(state, content, level, nowMs, opts = {}) {
  const today = localDay(nowMs, opts.tzOffsetMinutes ?? 0);
  const ring = state.attempts.ring;
  const ind = {};
  const progressOf = (id, label, kind, how) => {
    const ids = levelConcepts(content, level, kind);
    const done = new Set(Object.values(state.progress.introduced).flat());
    const n = ids.filter((i) => done.has(i)).length; // attempts proxy: concepts actually introduced
    const v = ids.length ? averageMastery(state.srs, ids, today) : null;
    ind[id] = { id, label, value: v, display: v === null ? 'No released items' : `${pct(v).toFixed(0)} %`, enough: v !== null && n >= 1, n, total: ids.length, how };
  };
  progressOf('vocab_progress', 'Vocabulary progress', 'vocab', 'Average concept mastery score (0-100 %) over all released vocabulary of this level; a word counts as 0 until you have studied it. Mastery score = mean over required facets of min(1, stability / 60 days).');
  progressOf('grammar_progress', 'Grammar progress', 'grammar', 'Same calculation over released grammar points.');
  progressOf('kanji_progress', 'Kanji progress', 'kanji', 'Same calculation over released kanji (recognition and reading facets).');
  const typed = (types) => ring.filter((r) => types.includes(r[5])).slice(-50);
  const perf = (id, label, types, how, extra = '') => {
    const rows = typed(types); const all = ring.filter((r) => types.includes(r[5]));
    const e = ema(rows.map((r) => r[3]));
    ind[id] = { id, label, value: all.length >= MIN ? e : null, display: all.length >= MIN ? `${pct(e).toFixed(0)} %` : NO_DATA, enough: all.length >= MIN, n: all.length, how: `${how} Needs at least ${MIN} attempts; you have ${all.length}.${extra}` };
  };
  perf('listening_performance', 'Listening performance', ['listening_comp', 'dictation'], 'Exponential moving average (alpha 0.1) of correctness over your last 50 listening items.', ' Audio is synthetic device speech, so this is not exam-realistic.');
  perf('reading_performance', 'Reading performance', ['reading_comp', 'information_retrieval'], 'Exponential moving average (alpha 0.1) of correctness over your last 50 reading items.');
  // timed performance
  const timed = state.exams.attempts.filter((a) => a.level === level && (a.kind === 'mock' || a.kind === 'section')).slice(-5);
  const timedQs = timed.reduce((t, a) => t + Object.values(a.totals).reduce((x, [, n]) => x + n, 0), 0);
  const timedAcc = timed.length ? timed.reduce((t, a) => t + Object.values(a.totals).reduce((x, [c]) => x + c, 0), 0) / Math.max(1, timedQs) : null;
  const paceRatio = timed.length ? timed.reduce((t, a) => t + a.durationMs, 0) / Math.max(1, timed.reduce((t, a) => t + a.allottedMs, 0)) : null;
  ind.timed_performance = { id: 'timed_performance', label: 'Timed performance', value: timedQs >= MIN ? timedAcc : null, display: timedQs >= MIN ? `${pct(timedAcc).toFixed(0)} % · pace ${paceRatio.toFixed(2)}` : NO_DATA, enough: timedQs >= MIN, n: timedQs, paceRatio, how: `Mean accuracy on timed sections over your last 5 attempts, with pace ratio = time used / time allowed. Needs at least ${MIN} timed questions; you have ${timedQs}.` };
  // retention
  const cutoffMin = (today - 30) * 1440; // attempts carry minutes since the epoch
  const longRows = ring.filter((r) => r[6] >= 7 && r[0] >= cutoffMin);
  ind.retention = { id: 'retention', label: 'Retention', value: longRows.length >= 30 ? longRows.reduce((a, r) => a + r[3], 0) / longRows.length : null, display: longRows.length >= 30 ? `${pct(longRows.reduce((a, r) => a + r[3], 0) / longRows.length).toFixed(0)} %` : NO_DATA, enough: longRows.length >= 30, n: longRows.length, how: 'Share of correct answers among reviews whose scheduled interval was 7 days or more. Needs at least 30 such reviews.' };
  // weak areas
  const byTarget = {}; const byType = {};
  for (const r of ring) { (byTarget[r[1]] ||= []).push(r[3]); (byType[r[5]] ||= []).push(r[3]); }
  const weak = [...Object.entries(byTarget).map(([k, v]) => ({ kind: 'concept', id: k, n: v.length, acc: v.reduce((a, b) => a + b, 0) / v.length })), ...Object.entries(byType).map(([k, v]) => ({ kind: 'exercise type', id: k, n: v.length, acc: v.reduce((a, b) => a + b, 0) / v.length }))]
    .filter((w) => w.n >= 5 && w.acc < 0.6).sort((a, b) => a.acc - b.acc || (a.id < b.id ? -1 : 1)).slice(0, 5);
  ind.weak_areas = { id: 'weak_areas', label: 'Weak areas', value: weak, display: weak.length ? `${weak.length} area${weak.length === 1 ? '' : 's'}` : 'None found (needs 5 or more attempts per item)', enough: true, n: ring.length, how: 'Up to 5 concepts or exercise types with accuracy below 60 % over at least 5 attempts.' };
  const due = dueFacets(state, today).length; const ratio = due / PARAMS.review_cards_per_core_session_cap;
  ind.review_backlog = { id: 'review_backlog', label: 'Review backlog', value: ratio, display: `${due} due · ${ratio <= 1 ? 'on top of it' : ratio <= 2 ? 'a little behind' : 'catch-up mode'}`, enough: true, n: due, how: 'Due review items divided by the daily review cap (25). Above 2 the planner switches to catch-up mode.' };
  ind.mock_history = { id: 'mock_history', label: 'Mock history', value: state.exams.attempts.filter((a) => a.level === level && a.kind === 'mock').slice(-10), display: `${state.exams.attempts.filter((a) => a.level === level && a.kind === 'mock').length} attempt(s)`, enough: true, n: state.exams.attempts.length, how: 'Your mock attempts with practice percent per scoring group. Practice estimates only.' };
  // internal readiness
  const W = { vocab_progress: 0.2, grammar_progress: 0.2, kanji_progress: 0.1, reading_performance: 0.15, listening_performance: 0.15, retention: 0.1, timed_performance: 0.1 };
  const avail = Object.entries(W).filter(([k]) => ind[k].enough && ind[k].value !== null);
  const perfAvail = avail.filter(([k]) => !k.endsWith('_progress')).length;
  let overall = { id: 'internal_readiness', label: 'Internal readiness', value: null, display: NO_DATA, enough: false, caption: NOT_JLPT, how: `Weighted blend (vocabulary 20 %, grammar 20 %, kanji 10 %, reading 15 %, listening 15 %, retention 10 %, timed 10 %) of the indicators that have enough data, capped at the lowest group score plus 25 points so imbalance is not hidden. Shown only when vocabulary progress and at least two performance indicators have enough data. ${NOT_JLPT}.` };
  if (ind.vocab_progress.enough && perfAvail >= 2) {
    const wsum = avail.reduce((a, [, w]) => a + w, 0);
    let v = avail.reduce((a, [k, w]) => a + w * ind[k].value, 0) / wsum;
    const groups = ['vocab_progress', 'grammar_progress', 'reading_performance', 'listening_performance'].filter((k) => ind[k].enough && ind[k].value !== null).map((k) => ind[k].value);
    if (groups.length) v = Math.min(v, Math.min(...groups) + 0.25);
    overall = { ...overall, value: v, display: `${pct(v).toFixed(0)} / 100 · based on ${avail.length} of 7 indicators`, enough: true };
  }
  ind.internal_readiness = overall;
  return ind;
}

/** Exam-date planner (formulae from the spec). Never promises passing. */
export function examPlanner(state, content, nowMs, { level, targetDate }, opts = {}) {
  const today = localDay(nowMs, opts.tzOffsetMinutes ?? 0);
  const t = Date.parse(`${targetDate}T00:00:00Z`);
  if (!targetDate || Number.isNaN(t)) return { error: 'Choose a target date.' };
  const weeksLeft = (Math.floor(t / 86400000) - today) / 7;
  const released = content.releasedUnits(level);
  const remaining = released.filter((u) => !state.progress.units[u.id]).length;
  const required = remaining / Math.max(weeksLeft, 0.5);
  const done14 = released.filter((u) => { const d = state.progress.units[u.id]?.completedAt; return d !== undefined && today - d <= 14 && today - d >= 0; }).length;
  const current = done14 / 2;
  const activeDays = new Set([...state.journal.studyDays.filter((d) => today - d <= 14)]).size;
  const partial = released.length < content.units.filter((u) => u.level === level).length;
  const out = { weeksLeft, remaining, required, current, activeDays, level, partialContent: partial, ratio: null, message: '', caveats: ['This does not guarantee passing and is not a prediction of the exam result.', partial ? `Only ${released.length} of ${content.units.filter((u) => u.level === level).length} ${level} units are released, so this plan covers released material only.` : null, 'JLPT sessions are held twice a year; official dates change every year. The date above is the one you entered.'].filter(Boolean) };
  if (weeksLeft < 0) { out.message = 'That date has already passed. Choose a future date.'; return out; }
  if (remaining === 0) { out.message = 'You have completed every released unit at this level. New units appear as content is released; keep reviewing meanwhile. This is not a prediction of passing.'; out.ratio = null; return out; }
  if (activeDays < 14 && done14 === 0 && state.journal.studyDays.length < 14) { out.message = `Not enough activity data yet to estimate pace. Showing required pace only: about ${required.toFixed(1)} units per week.`; return out; }
  const ratio = required === 0 ? Infinity : current / required;
  out.ratio = ratio;
  out.message = ratio >= 1 ? 'At your recent pace you would finish the released curriculum before this date. This is not a prediction of passing.' : ratio >= 0.6 ? 'Tight. Consider more minutes per day or a later date.' : 'Unlikely to cover the material in time at your recent pace. Suggest a later exam session or a smaller target.';
  out.band = ratio >= 1 ? 'on_pace' : ratio >= 0.6 ? 'tight' : 'unlikely';
  return out;
}
export { lessonConcepts };
