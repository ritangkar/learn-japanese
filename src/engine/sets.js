// Builds question sets deterministically from lessons, plans and due facets. Pure.
import { generate } from './generators.js';
import { shuffle, hashString } from './prng.js';
import { kindOfId } from './mastery.js';

const genCtx = (content, seed) => ({ kana: content.kana, vocab: content.vocab, seed });

/** Questions of one lesson part (practice | context | exit_check): authored ids first, then generated drills. */
export function buildPart(lesson, part, content, seed) {
  const p = lesson[part];
  if (!p) return [];
  const authored = (p.question_ids || []).map((id) => content.questionById.get(id)).filter(Boolean);
  const generated = (p.gen || []).flatMap((g, i) => generate(g, genCtx(content, `${seed}|${lesson.id}|${part}|${i}`)));
  return interleave(authored, generated, `${seed}|${lesson.id}|${part}`);
}
function interleave(a, b, seed) {
  const all = [...a, ...b];
  return shuffle(all, seed);
}

const FACET_GEN = { read: 'vocab_read', meaning: 'vocab_meaning', produce: 'vocab_produce', listen: 'word_listen', construct: null };

/** One question for a due facet key like "v_neko:meaning". Prefers an authored question that exercises exactly that facet, rotating by day. */
export function questionForFacet(key, content, seed, day) {
  const [conceptId, facet] = key.split(':');
  const kind = kindOfId(conceptId);
  const authored = content.questions.filter((q) => q.facet === facet && q.targets.includes(conceptId) && q.type !== 'dictation' && q.type !== 'matching' && !(q.stem.audio_text && facet !== 'listen'));
  const gctx = genCtx(content, `${seed}|${key}`);
  if (kind === 'kana') {
    const type = facet === 'read' ? 'kana_recog' : 'kana_recall';
    const gen = generate({ type, from: 'kana', ids: [conceptId], n: 1 }, gctx)[0];
    const pickA = authored.filter((q) => q.type === type);
    return pickA.length && (hashString(`${key}${day}`) % 2 === 0) ? pickA[(day + hashString(key)) % pickA.length] : gen;
  }
  if (kind === 'vocab') {
    const t = FACET_GEN[facet];
    const gen = t ? generate({ type: t, from: 'vocab', ids: [conceptId], n: 1 }, gctx)[0] : null;
    if (authored.length && (!gen || hashString(`${key}${day}`) % 2 === 0)) return authored[(day + hashString(key)) % authored.length];
    return gen || null;
  }
  if (authored.length) return authored[(day + hashString(key)) % authored.length];
  return null;
}

export function reviewSet(keys, content, seed, day) {
  return keys.map((k) => questionForFacet(k, content, seed, day)).filter(Boolean);
}

/** Readiness-check / milestone question pool selection: stratified over skill groups, deterministic. */
export function stratified(pool, groupOf, n, seed) {
  const groups = new Map();
  for (const q of pool) { const g = groupOf(q); if (!groups.has(g)) groups.set(g, []); groups.get(g).push(q); }
  const names = [...groups.keys()].sort();
  const chosen = []; const lists = new Map(names.map((g) => [g, shuffle(groups.get(g), `${seed}|${g}`)]));
  let i = 0;
  while (chosen.length < n && names.some((g) => lists.get(g).length)) { const g = names[i % names.length]; i++; const x = lists.get(g).shift(); if (x) chosen.push(x); }
  return shuffle(chosen, `${seed}|final`);
}
