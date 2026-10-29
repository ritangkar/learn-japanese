// Applies a batch of answers to SRS records, attempts and confusion counters. Pure (returns what to persist).
import { facetKeysFor } from './check.js';
import { newRecord, reviewRecord, decode, Grade, gradeFrom } from './srs.js';
import { PARAMS } from './params.js';

const FACET_CODE = { read: 'r', meaning: 'm', produce: 'p', listen: 'l', construct: 'c' };

/**
 * @param {{srs:object, concepts:object}} state
 * @param {{q:object, result:{correct:boolean, chosenConcept?:string, grade?:number}, latencyMs?:number, confidence?:string}[]} answers
 * @returns {{records:any[], attempts:any[], concepts:object}}
 */
export function applyAnswers(state, answers, { today, nowMinutes, retention = 0.9, medianMs = null }) {
  const working = { ...state.srs };
  const touched = new Map();
  const attempts = [];
  let concepts = state.concepts;
  for (const a of answers) {
    const { q, result } = a;
    const grade = result.selfGraded ? Number(result.grade) : gradeFrom({ correct: result.correct, confidence: a.confidence ?? null, latencyMs: a.latencyMs ?? null, medianMs });
    for (const key of facetKeysFor(q)) {
      const prev = working[key] || newRecord(key, today);
      const c = decode(prev);
      const repeatToday = c.reps > 0 && c.lastDay === today;
      let sched = 0;
      if (!repeatToday || grade === Grade.Again) {
        const r = reviewRecord(prev, grade, today, { retention });
        working[key] = r.record; touched.set(key, r.record); sched = c.state === 0 ? 0 : Math.max(0, c.due - c.lastDay);
        if (decode(r.record).lapses >= PARAMS.leech_lapses && !concepts.leech[key]) concepts = { ...concepts, leech: { ...concepts.leech, [key]: today } };
      } else if (!working[key]) { working[key] = prev; touched.set(key, prev); }
      const target = key.split(':')[0];
      attempts.push([nowMinutes, target, FACET_CODE[q.facet] || 'r', result.correct ? 1 : 0, Math.round(a.latencyMs || 0), q.type, sched]);
    }
    // confusion pair counter (wrong choice that maps to another concept)
    if (!result.correct && result.chosenConcept && q.targets[0] && result.chosenConcept !== q.targets[0]) {
      const pair = [q.targets[0], result.chosenConcept].sort().join('|');
      const cur = concepts.confusions[pair] || { events: [], streak: 0 };
      const events = [...cur.events, today].slice(-10);
      concepts = { ...concepts, confusions: { ...concepts.confusions, [pair]: { events, streak: 0, last: today } } };
    } else if (result.correct && q.type === 'contrast') {
      const pair = [...q.targets].sort().join('|');
      const cur = concepts.confusions[pair];
      if (cur) concepts = { ...concepts, confusions: { ...concepts.confusions, [pair]: { ...cur, streak: (cur.streak || 0) + 1 } } };
    }
  }
  return { records: [...touched.values()], attempts, concepts };
}
