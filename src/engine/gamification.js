// Weekly consistency ring (default 4 of 7 days) and optional streak with automatic grace. Pure.
import { weekStart } from '../core/clock.js';

/** Study days in the Monday-based week containing `day`. Grace: after two consecutive weeks meeting the goal, one missing day is covered automatically. */
export function weeklyRing(journal, day, goal = 4) {
  const set = new Set(journal.studyDays);
  const ws = weekStart(day);
  const count = (w) => { let n = 0; for (let d = w; d < w + 7; d++) if (set.has(d)) n++; return n; };
  const days = count(ws);
  let consecutive = 0;
  for (let w = ws - 7; consecutive < 2 && count(w) >= goal && w > ws - 7 * 60; w -= 7) consecutive++;
  const grace = consecutive >= 2 && days < goal && days >= goal - 1;
  const effectiveDays = Math.min(goal, days + (grace ? 1 : 0));
  return { days, goal, effectiveDays, graceApplied: grace, graceEarned: consecutive >= 2, met: effectiveDays >= goal, weekStart: ws };
}

/** Consecutive study days ending today (or yesterday). A single one-day gap is bridged automatically, at most once per 7 days. */
export function streak(journal, day) {
  const set = new Set(journal.studyDays);
  let d = set.has(day) ? day : day - 1;
  if (!set.has(d)) return { days: 0, graceUsed: 0 };
  let n = 0; let lastGap = -100; let graces = 0;
  for (;;) {
    if (set.has(d)) { n++; d--; continue; }
    if (set.has(d - 1) && d - lastGap > 7) { lastGap = d; graces++; d--; continue; }
    break;
  }
  return { days: n, graceUsed: graces };
}
