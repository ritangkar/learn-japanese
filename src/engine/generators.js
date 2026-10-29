// Deterministic practice generators (kana drills, vocabulary drills, listening drills). Seeded: same seed -> same questions.
import { shuffle, rng } from './prng.js';

const L = (a, i) => a[((i % a.length) + a.length) % a.length];

/**
 * @param {{type:string, from:'kana'|'vocab', ids?:string[], n:number}} spec
 * @param {{kana:object[], vocab:object[], seed:string, level?:string}} ctx
 */
export function generate(spec, ctx) {
  const kanaById = new Map(ctx.kana.map((k) => [k.id, k]));
  const vocabById = new Map(ctx.vocab.map((v) => [v.id, v]));
  const pool = (spec.ids && spec.ids.length ? spec.ids : (spec.from === 'kana' ? ctx.kana.map((k) => k.id) : ctx.vocab.map((v) => v.id)));
  const order = shuffle(pool, `${ctx.seed}|${spec.type}|order`);
  const items = Array.from({ length: spec.n }, (_, i) => L(order, i));
  const out = [];
  items.forEach((id, i) => {
    const q = build(spec.type, id, i, ctx, kanaById, vocabById);
    if (q) out.push(q);
  });
  if (spec.type === 'matching') return [buildMatching(pool, spec.n, ctx, kanaById)];
  return out;
}

const gid = (type, id, i) => `g_${type}_${id}_${i}`;
const baseQ = (type, id, i, f) => ({ id: gid(type, id, i), type, generated: true, instructional_level: 'N5', difficulty: 1, targets: [id], section: null, jlpt_item_type: null, ...f });

function distractors(correct, candidates, n, seed, key) {
  const r = rng(seed);
  const rest = candidates.filter((c) => key(c) !== key(correct));
  const seen = new Set([key(correct)]);
  const out = [];
  for (const c of shuffle(rest, `${seed}|d`)) { if (seen.has(key(c))) continue; seen.add(key(c)); out.push(c); if (out.length === n) break; }
  void r;
  return out;
}
const ids4 = ['a', 'b', 'c', 'd'];
function placeChoices(correct, wrongs, seed) {
  const all = shuffle([{ ...correct, ok: true }, ...wrongs], `${seed}|place`);
  return { choices: all.map((c, k) => ({ id: ids4[k], text: c.text, ...(c.ja ? { ja: true } : {}), ...(c.concept ? { concept: c.concept } : {}) })), answer: ids4[all.findIndex((c) => c.ok)] };
}

function build(type, id, i, ctx, kanaById, vocabById) {
  const seed = `${ctx.seed}|${type}|${id}|${i}`;
  if (type === 'kana_recog' || type === 'kana_recall' || type === 'kana_listen') {
    const k = kanaById.get(id); if (!k) return null;
    const sameScript = ctx.kana.filter((x) => x.script === k.script && x.group === 'basic' && x.romaji && !x.romaji.startsWith('('));
    const sim = sameScript.filter((x) => (k.similar_to || []).includes(x.char));
    const near = shuffle(sameScript.filter((x) => x.row === k.row), `${seed}|near`);
    const cand = [...sim, ...near, ...shuffle(sameScript, `${seed}|any`)];
    if (type === 'kana_recog') {
      const wrongs = distractors(k, cand.filter((x) => x.romaji !== k.romaji), 3, seed, (x) => x.romaji).map((x) => ({ text: x.romaji, concept: x.id }));
      const p = placeChoices({ text: k.romaji }, wrongs, seed);
      return baseQ('kana_recog', id, i, { stem: { prompt: 'Which sound is this kana?', ja: k.char }, ...p, explanation_correct: `${k.char} is read "${k.romaji}".`, facet: 'read', unit_id: k.unit_id });
    }
    if (type === 'kana_recall') {
      return baseQ('kana_recall', id, i, { stem: { prompt: `Write the ${k.script} for "${k.romaji}".` }, answer: k.char, explanation_correct: `"${k.romaji}" is written ${k.char}.`, facet: 'produce', unit_id: k.unit_id, difficulty: 2 });
    }
    const wrongs = distractors(k, cand, 3, seed, (x) => x.char).map((x) => ({ text: x.char, ja: true, concept: x.id }));
    const p = placeChoices({ text: k.char, ja: true }, wrongs, seed);
    return baseQ('listening_comp', id, i, { stem: { prompt: 'Which kana did you hear?', audio_text: k.char }, ...p, explanation_correct: `You heard ${k.char} ("${k.romaji}").`, facet: 'listen', unit_id: k.unit_id, tags: ['listening_relevant'] });
  }
  const v = vocabById.get(id); if (!v) return null;
  const cands = ctx.vocab.filter((x) => x.id !== v.id);
  if (type === 'vocab_meaning') {
    const wrongs = distractors(v, cands.filter((x) => x.meanings_en[0] !== v.meanings_en[0]), 3, seed, (x) => x.meanings_en[0]).map((x) => ({ text: x.meanings_en[0], concept: x.id }));
    const p = placeChoices({ text: v.meanings_en[0] }, wrongs, seed);
    return baseQ('mcq', id, i, { stem: { prompt: 'What does this word mean?', ja: v.surface, ruby: v.surface !== v.reading_kana ? { [v.surface]: v.reading_kana } : undefined }, ...p, explanation_correct: `${v.surface} (${v.romaji}) means "${v.meanings_en[0]}".`, facet: 'meaning', unit_id: v.unit_id });
  }
  if (type === 'vocab_produce') {
    const wrongs = distractors(v, cands.filter((x) => x.surface !== v.surface), 3, seed, (x) => x.surface).map((x) => ({ text: x.surface, ja: true, concept: x.id }));
    const p = placeChoices({ text: v.surface, ja: true }, wrongs, seed);
    return baseQ('mcq', id, i, { stem: { prompt: `Which word means "${v.meanings_en[0]}"?` }, ...p, explanation_correct: `"${v.meanings_en[0]}" is ${v.surface} (${v.romaji}).`, facet: 'produce', unit_id: v.unit_id });
  }
  if (type === 'word_listen') {
    const wrongs = distractors(v, cands.filter((x) => x.reading_kana !== v.reading_kana), 3, seed, (x) => x.reading_kana).map((x) => ({ text: x.reading_kana, ja: true, concept: x.id }));
    const p = placeChoices({ text: v.reading_kana, ja: true }, wrongs, seed);
    return baseQ('listening_comp', id, i, { stem: { prompt: 'Which word did you hear?', audio_text: v.reading_kana }, ...p, explanation_correct: `You heard ${v.reading_kana} (${v.romaji}), "${v.meanings_en[0]}".`, facet: 'listen', unit_id: v.unit_id, tags: ['listening_relevant'] });
  }
  if (type === 'flashcard') {
    return baseQ('flashcard', id, i, { stem: { prompt: 'Recall the meaning, then flip.', ja: v.surface }, answer: v.meanings_en[0], explanation_correct: `${v.surface} (${v.romaji}): ${v.meanings_en.join('; ')}`, facet: 'meaning', unit_id: v.unit_id });
  }
  return null;
}

function buildMatching(pool, n, ctx, kanaById) {
  const chosen = shuffle(pool, `${ctx.seed}|match`).slice(0, Math.min(n, 6)).map((id) => kanaById.get(id)).filter(Boolean);
  const pairs = chosen.map((k) => [k.char, k.romaji]);
  return { id: `g_matching_${chosen.map((k) => k.id).join('_').slice(0, 60)}`, type: 'matching', generated: true, instructional_level: 'N5', stem: { prompt: 'Match each kana with its sound.' }, pairs, answer: pairs.map((p) => p[0]), explanation_correct: 'Say each sound aloud as you match it.', facet: 'read', targets: chosen.map((k) => k.id), difficulty: 1, section: null, jlpt_item_type: null };
}
