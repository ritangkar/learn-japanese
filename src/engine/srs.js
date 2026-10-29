// FSRS-4.5 scheduler. Equations and default weights were ported from the official open-spaced-repetition
// `ts-fsrs` package, version 3.5.7 (MIT; github.com/open-spaced-repetition/ts-fsrs), NOT from memory.
// tests/unit/srs.test.js compares every function with vectors produced by that library (tests/vectors/fsrs45.json).
// Documented deviation: the library schedules learning steps in minutes; this app schedules whole days (see docs/DECISIONS.md).
// Fuzz is disabled so scheduling is deterministic.

export const FSRS_SOURCE = Object.freeze({ package: 'ts-fsrs', version: '3.5.7', algorithm: 'FSRS-4.5', license: 'MIT' });
export const W = Object.freeze([0.5701, 1.4436, 4.1386, 10.9355, 5.1443, 1.2006, 0.8627, 0.0362, 1.629, 0.1342, 1.0166, 2.1174, 0.0839, 0.3204, 1.4676, 0.219, 2.8237]);
export const DECAY = -0.5;
export const FACTOR = 19 / 81;
export const MAX_INTERVAL = 36500;
export const State = Object.freeze({ New: 0, Learning: 1, Review: 2, Relearning: 3 });
export const Grade = Object.freeze({ Again: 1, Hard: 2, Good: 3, Easy: 4 });

const r8 = (x) => +x.toFixed(8);

export function forgettingCurve(elapsedDays, stability) { return r8((1 + (FACTOR * elapsedDays) / stability) ** DECAY); }
export function intervalModifier(retention) {
  if (retention <= 0 || retention > 1) throw new Error('Requested retention rate should be in the range (0,1]');
  return r8((retention ** (1 / DECAY) - 1) / FACTOR);
}
export function nextInterval(stability, retention = 0.9, maxInterval = MAX_INTERVAL) {
  return Math.min(Math.max(1, Math.round(stability * intervalModifier(retention))), maxInterval);
}
export const initStability = (grade, w = W) => Math.max(w[grade - 1], 0.1);
export const initDifficulty = (grade, w = W) => r8(Math.min(Math.max(w[4] - (grade - 3) * w[5], 1), 10));
const constrainD = (d) => Math.min(Math.max(r8(d), 1), 10);
const meanReversion = (init, cur, w = W) => r8(w[7] * init + (1 - w[7]) * cur);
export const nextDifficulty = (d, grade, w = W) => constrainD(meanReversion(w[4], d - w[6] * (grade - 3), w));
export function nextRecallStability(d, s, r, grade, w = W) {
  const hard = grade === Grade.Hard ? w[15] : 1;
  const easy = grade === Grade.Easy ? w[16] : 1;
  return r8(s * (1 + Math.exp(w[8]) * (11 - d) * s ** -w[9] * (Math.exp((1 - r) * w[10]) - 1) * hard * easy));
}
export function nextForgetStability(d, s, r, w = W) { return r8(w[11] * d ** -w[12] * ((s + 1) ** w[13] - 1) * Math.exp((1 - r) * w[14])); }

/**
 * Review one facet. Pure. `card` = {state, stability, difficulty, reps, lapses, lastDay}; `today` = day number.
 * Returns the new card plus `interval` (days until due) and the intervals each grade would have given.
 */
export function review(card, grade, today, { retention = 0.9 } = {}) {
  const next = { ...card, reps: card.reps + 1 };
  const elapsed = card.state === State.New ? 0 : Math.max(0, today - card.lastDay);
  let interval;
  if (card.state === State.New) {
    next.difficulty = initDifficulty(grade);
    next.stability = initStability(grade);
    // library: Again/Hard/Good enter Learning (minute-level steps there; next day here); only Easy graduates immediately
    if (grade === Grade.Easy) { next.state = State.Review; interval = nextInterval(initStability(Grade.Easy), retention); }
    else { next.state = State.Learning; interval = 1; }
  } else if (card.state === State.Learning || card.state === State.Relearning) {
    // library: stability and difficulty are unchanged while (re)learning
    const good = nextInterval(card.stability, retention);
    if (grade === Grade.Again || grade === Grade.Hard) { next.state = card.state; interval = 1; }
    else if (grade === Grade.Good) { next.state = State.Review; interval = good; }
    else { next.state = State.Review; interval = Math.max(nextInterval(card.stability, retention), good + 1); }
  } else {
    const d = card.difficulty; const s = card.stability;
    const r = forgettingCurve(elapsed, s);
    const sBy = { [Grade.Hard]: nextRecallStability(d, s, r, Grade.Hard), [Grade.Good]: nextRecallStability(d, s, r, Grade.Good), [Grade.Easy]: nextRecallStability(d, s, r, Grade.Easy) };
    let hard = nextInterval(sBy[Grade.Hard], retention); let good = nextInterval(sBy[Grade.Good], retention);
    hard = Math.min(hard, good); good = Math.max(good, hard + 1);
    const easy = Math.max(nextInterval(sBy[Grade.Easy], retention), good + 1);
    next.difficulty = nextDifficulty(d, grade);
    if (grade === Grade.Again) { next.state = State.Relearning; next.lapses = card.lapses + 1; next.stability = nextForgetStability(d, s, r); interval = 1; }
    else { next.state = State.Review; next.stability = sBy[grade]; interval = grade === Grade.Hard ? hard : grade === Grade.Good ? good : easy; }
  }
  next.lastDay = today;
  next.due = today + interval;
  return { card: next, interval, elapsed };
}

export const newCard = () => ({ state: State.New, stability: 0, difficulty: 0, reps: 0, lapses: 0, lastDay: 0, due: 0 });

// ---------- compact record: [facetKey, dueDay, stabilityX100, difficultyX100, reps, lapses, lastDay, stateCode] ----------
// stateCode packs: bits 0-1 FSRS state | bits 2-6 spaced successes (0..31) | bits 7-10 distinct success days (0..15) | bits 11-13 last three outcomes (1 = failed, bit0 newest).
export function packCode(state, successes, successDays, failBits) { return (state & 3) | (Math.min(successes, 31) << 2) | (Math.min(successDays, 15) << 7) | ((failBits & 7) << 11); }
export function unpackCode(code) { return { state: code & 3, successes: (code >> 2) & 31, successDays: (code >> 7) & 15, failBits: (code >> 11) & 7 }; }

export function decode(rec) {
  const c = unpackCode(rec[7]);
  return { key: rec[0], due: rec[1], stability: rec[2] / 100, difficulty: rec[3] / 100, reps: rec[4], lapses: rec[5], lastDay: rec[6], state: c.state, successes: c.successes, successDays: c.successDays, failBits: c.failBits };
}
export function encode(c) {
  return [c.key, c.due, Math.round(c.stability * 100), Math.round(c.difficulty * 100), c.reps, c.lapses, c.lastDay, packCode(c.state, c.successes, c.successDays, c.failBits)];
}
export function newRecord(key, today) { return encode({ key, ...newCard(), due: today, lastDay: today, successes: 0, successDays: 0, failBits: 0 }); }

/** Review a compact record; returns {record, interval, grade}. Spaced successes only count when at least one day has passed. */
export function reviewRecord(rec, grade, today, opts = {}) {
  const c = decode(rec);
  const { card, interval } = review(c, grade, today, opts);
  const success = grade >= Grade.Hard;
  const spaced = c.state !== State.New && today > c.lastDay;
  const out = { ...c, ...card, key: c.key };
  out.successes = c.successes + (success && spaced ? 1 : 0);
  out.successDays = c.successDays + (success && spaced ? 1 : 0);
  out.failBits = ((c.failBits << 1) | (success ? 0 : 1)) & 7;
  return { record: encode(out), interval, grade };
}
export const retrievability = (rec, today) => {
  const c = decode(rec);
  if (c.state === State.New) return 0;
  return forgettingCurve(Math.max(0, today - c.lastDay), Math.max(c.stability, 0.1));
};

/** Map an answer to an FSRS grade (spec spaced_repetition.grades). */
export function gradeFrom({ correct, confidence = null, latencyMs = null, medianMs = null }) {
  if (!correct) return Grade.Again;
  const slow = latencyMs != null && medianMs != null && latencyMs > 2 * medianMs;
  const fast = latencyMs != null && medianMs != null && latencyMs < 0.6 * medianMs;
  if (confidence === 'low' || slow) return Grade.Hard;
  if (confidence === 'high' && fast) return Grade.Easy;
  return Grade.Good;
}

// ---------- Leitner fallback (spec spaced_repetition.fallback_scheduler); not the active scheduler ----------
export const LEITNER_INTERVALS = Object.freeze([0, 1, 3, 7, 16, 35, 75, 160]);
export function leitnerReview(box, correct, { proficientBefore = false } = {}) {
  const max = LEITNER_INTERVALS.length - 1;
  const next = correct ? Math.min(box + 1, max) : (proficientBefore ? Math.max(1, box - 2) : 1);
  return { box: next, interval: LEITNER_INTERVALS[next] };
}
