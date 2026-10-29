// Answer checking for all 23 exercise types. Pure. Unknown free-text answers are flagged, never silently marked wrong.
import { normalizeJa, typedToKana } from '../content/romaji.js';

export const SELF_GRADED = new Set(['flashcard', 'srs_review', 'handwriting_guided', 'shadowing']);
const norm = (s) => normalizeJa(s).toLowerCase();

export function checkAnswer(q, response) {
  const base = { explanation: q.explanation_correct, expected: q.answer };
  if (SELF_GRADED.has(q.type)) {
    const grade = Number(response); // 1..4 (again, hard, good, easy)
    return { ...base, correct: grade >= 2, score: grade >= 2 ? 1 : 0, grade, selfGraded: true };
  }
  if (q.type === 'conversation_sim') {
    const steps = q.steps || []; const picks = Array.isArray(response) ? response : [];
    const score = steps.length ? steps.reduce((a, st, i) => a + ({ best: 1, ok: 0.5, bad: 0 }[st.options.find((o) => o.id === picks[i])?.quality] ?? 0), 0) / steps.length : 0;
    return { ...base, correct: score >= 0.8, score };
  }
  if (q.type === 'matching') {
    const pairs = q.pairs || [];
    const given = response || {};
    const right = pairs.filter(([l, r]) => given[l] === r).length;
    return { ...base, correct: right === pairs.length, score: pairs.length ? right / pairs.length : 0, matched: right, total: pairs.length };
  }
  if (q.type === 'sentence_order' || Array.isArray(q.answer)) {
    const ans = Array.isArray(q.answer) ? q.answer : [q.answer];
    const got = Array.isArray(response) ? response : [];
    const joined = norm(got.join(''));
    const ok = got.length === ans.length && got.every((x, i) => x === ans[i]);
    const alt = (q.accept_alternatives || []).some((a) => norm(a) === joined);
    return { ...base, correct: ok || alt, score: ok || alt ? 1 : 0, usedAlternative: !ok && alt };
  }
  if (q.choices && q.choices.length) {
    const ok = response === q.answer;
    const why = !ok && q.explanation_per_distractor ? q.explanation_per_distractor[response] : null;
    const chosen = q.choices.find((c) => c.id === response);
    return { ...base, correct: ok, score: ok ? 1 : 0, distractorNote: why || null, chosenConcept: chosen?.concept || null };
  }
  // typed answer
  const typed = String(response ?? '');
  const t = norm(typed); const tk = typedToKana(typed);
  const accepted = [q.answer, ...(q.accept_alternatives || [])].map((a) => norm(String(a)));
  const ok = accepted.includes(t) || accepted.includes(norm(tk));
  if (ok) return { ...base, correct: true, score: 1, normalized: tk };
  const flag = q.type === 'construct' || q.type === 'typing_ja';
  return { ...base, correct: false, score: 0, unverified: flag, normalized: tk, message: flag ? 'This answer is not in our list of accepted answers. It might still be a valid way to say it: you can mark it as correct yourself.' : null };
}

/** Which SRS facet keys does a question exercise? One per target concept (never for sentence targets). */
export function facetKeysFor(q) {
  return (q.targets || []).filter((t) => /^(ka_|v_|kj_|g_)/.test(t)).map((t) => `${t}:${q.facet}`);
}
