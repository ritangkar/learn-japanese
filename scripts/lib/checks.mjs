// Content validators A01-A16 (from spec.content_validation.automated_checks) plus extra checks X01-X11.
// Each check returns {id, name, status: 'pass'|'fail'|'not_run', errors: [{item, msg}], note?}.
import Ajv from 'ajv/dist/2020.js';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { COLLECTIONS, STATUS_ORDER, buildIndex, ungatedKanji, estimateSeconds, MAX_CHUNK_SECONDS, resolveProvenance, statusOf } from '../../src/content/model.js';
import { kanaToRomaji, normalizeJa, hasKanji, isKana } from '../../src/content/romaji.js';

const SCHEMA_DEF = { kana: 'kana', kanji: 'kanji', vocab: 'vocab', grammar: 'grammar', sentences: 'sentence', dialogues: 'dialogue', passages: 'passage', listening: 'listening', questions: 'question', lessons: 'lesson', quests: 'quest', mocks: 'mock' };
const TYPED = new Set(['kana_recall', 'dictation', 'typing_ja', 'construct']);
const CHOICE_TYPES = new Set(['mcq', 'kana_recog', 'fill_blank', 'translate', 'error_correction', 'reading_comp', 'listening_comp', 'dialogue_complete', 'context_vocab', 'exam_style', 'information_retrieval', 'timed_quiz']);
const KANA_TEXT = /^[ぁ-ゖァ-ヺー\s、。？！?!・「」…ー-]+$/;

const ok = (id, name, errors, extra = {}) => ({ id, name, status: errors.length ? 'fail' : 'pass', errors, ...extra });
const err = (item, msg) => ({ item, msg });

/** Every learner-facing Japanese string of an item with the ruby map that applies to it. */
export function japaneseStrings(kind, it) {
  const out = [];
  const add = (text, ruby, where) => { if (typeof text === 'string' && text) out.push({ text, ruby: ruby || {}, where }); };
  if (kind === 'sentences') add(it.text_ja, it.ruby, 'text_ja');
  if (kind === 'passages') { it.paragraphs.forEach((p, i) => add(p, it.ruby, `paragraph ${i}`)); add(it.title, it.ruby, 'title'); }
  if (kind === 'listening') it.script_turns.forEach((t, i) => add(t.text_ja, {}, `turn ${i}`));
  if (kind === 'questions') {
    const s = it.stem;
    add(s.ja, s.ruby, 'stem.ja'); add(s.context_ja, s.ruby, 'stem.context_ja'); add(s.audio_text, s.ruby, 'stem.audio_text');
    (it.choices || []).forEach((c) => { if (c.ja) add(c.text, s.ruby, `choice ${c.id}`); });
    if (TYPED.has(it.type) || it.type === 'sentence_order') (it.tiles || []).forEach((t, i) => add(t, s.ruby, `tile ${i}`));
    if (typeof it.answer === 'string' && (TYPED.has(it.type) || it.type === 'fill_blank')) add(it.answer, s.ruby, 'answer');
    (it.pairs || []).forEach((p, i) => p.forEach((x, j) => { if (/[぀-ヿ一-鿿]/.test(x)) add(x, s.ruby, `pair ${i}.${j}`); }));
  }
  if (kind === 'lessons') it.explain.forEach((b, i) => (b.examples || []).forEach((e, j) => add(e.ja, {}, `explain ${i}.${j}`)));
  if (kind === 'dialogues') add(it.title, {}, 'title');
  if (kind === 'vocab') add(it.reading_kana, {}, 'reading_kana');
  return out;
}

export function runAll(raw, ctx = {}) {
  const spec = ctx.spec;
  const idx = buildIndex(raw);
  const results = [];
  const items = [];
  for (const c of COLLECTIONS) for (const it of raw[c]) items.push({ kind: c, id: it.id, it });
  const ordOf = (unitId) => idx.order(unitId);

  // A01 JSON Schema conformance
  {
    const errors = [];
    const ajv = new Ajv({ allErrors: true, strict: false });
    const schema = ctx.schema;
    ajv.addSchema(schema);
    for (const { kind, id, it } of items) {
      const v = ajv.getSchema(`tabi-content#/$defs/${SCHEMA_DEF[kind]}`);
      if (!v(it)) for (const e of v.errors.slice(0, 4)) errors.push(err(id, `${e.instancePath || '/'} ${e.message}${e.params?.additionalProperty ? ` (${e.params.additionalProperty})` : ''}`));
    }
    const sv = ajv.getSchema('tabi-content#/$defs/statusEntry');
    for (const [id, st] of Object.entries(raw.status)) if (!sv(st)) errors.push(err(id, `status entry invalid: ${ajv.errorsText(sv.errors)}`));
    for (const u of raw.curriculum.units) if (!['to_be_authored', 'draft', 'auto_checked', 'human_reviewed'].includes(u.content_status)) errors.push(err(u.id, `unit content_status '${u.content_status}' not allowed`));
    results.push(ok('A01', 'JSON Schema conformance', errors, { checked: items.length }));
  }

  // A02 unique ids + dangling references
  {
    const errors = [];
    const seen = new Map();
    for (const { kind, id } of items) { if (seen.has(id)) errors.push(err(id, `duplicate id (also in ${seen.get(id)})`)); else seen.set(id, kind); }
    for (const u of raw.curriculum.units) { if (seen.has(u.id)) errors.push(err(u.id, 'unit id collides with an item id')); }
    const kindOf = (id) => idx.kind.get(id);
    const need = (from, id, kinds, label) => { if (!id) return; const k = kindOf(id); if (!k) errors.push(err(from, `${label}: '${id}' does not exist`)); else if (kinds && !kinds.includes(k)) errors.push(err(from, `${label}: '${id}' is a ${k}, expected ${kinds}`)); };
    for (const { kind, id, it } of items) {
      if (kind !== 'mocks' && kind !== 'quests' && !idx.units.has(it.unit_id) && it.unit_id) errors.push(err(id, `unit_id '${it.unit_id}' not in curriculum`));
      if (kind === 'vocab') it.example_sentence_ids.forEach((s) => need(id, s, ['sentences'], 'example_sentence_ids'));
      if (kind === 'vocab') (it.related_ids || []).forEach((s) => need(id, s, ['vocab'], 'related_ids'));
      if (kind === 'kanji') it.example_word_ids.forEach((s) => need(id, s, ['vocab'], 'example_word_ids'));
      if (kind === 'sentences') { it.vocab_ids.forEach((s) => need(id, s, ['vocab'], 'vocab_ids')); (it.grammar_ids || []).forEach((s) => need(id, s, ['grammar'], 'grammar_ids')); }
      if (kind === 'grammar') { it.examples.forEach((s) => need(id, s, ['sentences'], 'examples')); it.practice_question_ids.forEach((s) => need(id, s, ['questions'], 'practice_question_ids')); (it.contrast_with || []).forEach((s) => need(id, s, ['grammar'], 'contrast_with')); (it.prerequisites || []).forEach((s) => need(id, s, null, 'prerequisites')); }
      if (kind === 'dialogues') { it.turns.forEach((t) => need(id, t.sentence_id, ['sentences'], 'turn')); it.comprehension_question_ids.forEach((s) => need(id, s, ['questions'], 'comprehension_question_ids')); }
      if (kind === 'passages') it.question_ids.forEach((s) => need(id, s, ['questions'], 'question_ids'));
      if (kind === 'listening') it.question_ids.forEach((s) => need(id, s, ['questions'], 'question_ids'));
      if (kind === 'questions') {
        it.targets.forEach((s) => need(id, s, ['kana', 'kanji', 'vocab', 'grammar', 'sentences'], 'targets'));
        need(id, it.source_sentence_id, ['sentences'], 'source_sentence_id');
        if (it.stem.context_id) need(id, it.stem.context_id, ['passages', 'listening', 'dialogues', 'sentences'], 'stem.context_id');
        if (CHOICE_TYPES.has(it.type) && Array.isArray(it.choices) && typeof it.answer === 'string' && !it.choices.some((c) => c.id === it.answer)) errors.push(err(id, `answer '${it.answer}' is not a choice id`));
      }
      if (kind === 'lessons') {
        for (const [k, ids] of Object.entries(it.introduces || {})) ids.forEach((s) => need(id, s, [{ kana: 'kana', vocab: 'vocab', kanji: 'kanji', grammar: 'grammar' }[k]], `introduces.${k}`));
        for (const part of ['practice', 'context', 'exit_check']) { const p = it[part]; if (!p) continue; (p.question_ids || []).forEach((s) => need(id, s, ['questions'], `${part}.question_ids`)); (p.gen || []).forEach((g) => (g.ids || []).forEach((s) => need(id, s, ['kana', 'vocab'], `${part}.gen.ids`))); }
      }
      if (kind === 'quests') { it.question_ids.forEach((s) => need(id, s, ['questions'], 'question_ids')); (it.spiral_question_ids || []).forEach((s) => need(id, s, ['questions'], 'spiral_question_ids')); if (ctx.spec && !ctx.spec.destinations.some((d) => d.id === it.destination_id)) errors.push(err(id, `unknown destination ${it.destination_id}`)); }
      if (kind === 'mocks') it.sections.forEach((sec) => { sec.question_ids.forEach((s) => need(id, s, ['questions'], 'section.question_ids')); (sec.shared_passages || []).forEach((s) => need(id, s, ['passages'], 'shared_passages')); (sec.listening_ids || []).forEach((s) => need(id, s, ['listening'], 'listening_ids')); });
    }
    for (const id of Object.keys(raw.status)) if (!seen.has(id)) errors.push(err(id, 'status.json entry for a non-existent item'));
    for (const u of raw.curriculum.units) for (const l of u.lessons || []) need(u.id, l, ['lessons'], 'unit.lessons');
    results.push(ok('A02', 'Unique IDs and no dangling references', errors));
  }

  // A03 prerequisite DAG acyclic, unit order respected
  {
    const errors = [];
    const graph = new Map();
    for (const { kind, id, it } of items) if (kind === 'grammar') graph.set(id, it.prerequisites || []);
    const state = new Map();
    const visit = (n, stack) => {
      if (state.get(n) === 2) return;
      if (state.get(n) === 1) { errors.push(err(n, `prerequisite cycle: ${[...stack, n].join(' -> ')}`)); return; }
      state.set(n, 1);
      for (const m of graph.get(n) || []) if (graph.has(m)) visit(m, [...stack, n]);
      state.set(n, 2);
    };
    for (const n of graph.keys()) visit(n, []);
    for (const { kind, id, it } of items) {
      if (kind !== 'grammar') continue;
      for (const p of it.prerequisites || []) { const pi = idx.get(p); if (pi && pi.unit_id && ordOf(pi.unit_id) > ordOf(it.unit_id)) errors.push(err(id, `prerequisite '${p}' is introduced in a later unit`)); }
    }
    const lvl = ['N5', 'N4', 'N3', 'N2', 'N1'];
    let prev = -1;
    for (const u of raw.curriculum.units) { if (u.order <= prev) errors.push(err(u.id, 'curriculum order not strictly increasing')); prev = u.order; if (lvl.indexOf(u.level) < 0) errors.push(err(u.id, 'bad level')); }
    results.push(ok('A03', 'Prerequisite DAG is acyclic and unit order respected', errors));
  }

  // A04 reading kana-only and romaji round-trip
  {
    const errors = [];
    for (const { kind, id, it } of items) {
      if (kind === 'vocab') {
        if (!it.reading_kana || !isKana(it.reading_kana)) errors.push(err(id, `reading_kana '${it.reading_kana}' is not kana-only/non-empty`));
        else if (it.romaji !== kanaToRomaji(it.reading_kana)) errors.push(err(id, `romaji '${it.romaji}' != '${kanaToRomaji(it.reading_kana)}' from reading_kana`));
        if (!hasKanji(it.surface) && it.surface !== it.reading_kana) errors.push(err(id, `kana-only surface '${it.surface}' differs from reading '${it.reading_kana}'`));
      }
      if (kind === 'sentences') {
        if (!it.reading_kana || !KANA_TEXT.test(it.reading_kana)) errors.push(err(id, `reading_kana '${it.reading_kana}' contains non-kana`));
        if (!hasKanji(it.text_ja) && normalizeJa(it.text_ja) !== normalizeJa(it.reading_kana)) errors.push(err(id, 'kana-only text_ja differs from reading_kana'));
      }
      if (kind === 'kana' && it.romaji && !it.romaji.startsWith('(') && it.id !== 'ka_h_wo' && it.id !== 'ka_k_wo') {
        const r = kanaToRomaji(it.char);
        if (r !== it.romaji) errors.push(err(id, `romaji '${it.romaji}' != '${r}'`));
      }
      if (kind === 'kanji') [...it.on_readings, ...it.kun_readings].forEach((r) => { if (!isKana(r.replace(/[.-]/g, ''))) errors.push(err(id, `reading '${r}' not kana`)); });
    }
    results.push(ok('A04', 'Kana reading is kana-only and non-empty; romaji matches via converter round-trip', errors));
  }

  // A05 kanji gating
  {
    const errors = [];
    for (const { kind, id, it } of items) {
      if (!it.unit_id || !idx.units.has(it.unit_id)) continue;
      const intro = idx.introducedKanji(it.unit_id);
      for (const s of japaneseStrings(kind, it)) {
        if (kind === 'vocab') continue;
        const bad = ungatedKanji(s.text, s.ruby, intro);
        if (bad.length) errors.push(err(id, `${s.where}: kanji ${[...new Set(bad)].join('')} not introduced by ${it.unit_id} and has no furigana (ruby)`));
      }
    }
    results.push(ok('A05', 'Kanji gating (introduced earlier-or-equal, or furigana present)', errors));
  }

  // A06 vocabulary gating + consistency
  {
    const errors = [];
    for (const { kind, id, it } of items) {
      if (kind === 'sentences') for (const v of it.vocab_ids) {
        const vi = idx.get(v);
        if (!vi || idx.kind.get(v) !== 'vocab') continue;
        if (ordOf(vi.unit_id) > ordOf(it.unit_id)) errors.push(err(id, `uses vocab '${v}' introduced later (${vi.unit_id} > ${it.unit_id})`));
        if (!it.text_ja.includes(vi.surface) && !it.reading_kana.includes(vi.reading_kana)) errors.push(err(id, `vocab '${v}' (${vi.surface}) does not occur in the sentence`));
      }
      if (kind === 'questions') for (const t of it.targets) { const ti = idx.get(t); if (ti && ti.unit_id && ordOf(ti.unit_id) > ordOf(it.unit_id)) errors.push(err(id, `target '${t}' is introduced later (${ti.unit_id})`)); }
    }
    results.push(ok('A06', 'Vocabulary gating: referenced vocab introduced earlier-or-equal', errors));
  }

  // A07 reading plausibility (needs a build-time dictionary; none bundled)
  {
    const dict = ctx.dictionaryPath && existsSync(ctx.dictionaryPath);
    results.push(dict ? ok('A07', 'Reading plausibility (dictionary cross-check)', []) : { id: 'A07', name: 'Reading plausibility (dictionary cross-check)', status: 'not_run', errors: [], note: 'NOT RUN: no build-time dictionary present (third-party dictionary data is not used by default). Readings are NOT dictionary-verified.' });
  }

  // A08 MCQ integrity
  {
    const errors = [];
    for (const { kind, id, it } of items) {
      if (kind !== 'questions' || !CHOICE_TYPES.has(it.type)) continue;
      const ch = it.choices;
      if (!Array.isArray(ch) || ch.length < 2) { errors.push(err(id, 'needs at least 2 choices')); continue; }
      const ids = ch.map((c) => c.id); const texts = ch.map((c) => normalizeJa(c.text).toLowerCase());
      if (new Set(ids).size !== ids.length) errors.push(err(id, 'duplicate choice ids'));
      if (new Set(texts).size !== texts.length) errors.push(err(id, 'duplicate choice text'));
      if (typeof it.answer !== 'string' || ids.filter((x) => x === it.answer).length !== 1) errors.push(err(id, 'exactly one correct choice required'));
      if (it.stem.ja && texts.includes(normalizeJa(it.stem.ja).toLowerCase())) errors.push(err(id, 'a choice equals the stem text'));
      const poss = ch.map((c) => c.pos).filter(Boolean);
      if (poss.length && (poss.length !== ch.length || new Set(poss).size !== 1)) errors.push(err(id, 'distractors must share the same pos where tagged'));
      if (it.explanation_per_distractor) for (const k of Object.keys(it.explanation_per_distractor)) if (!ids.includes(k) || k === it.answer) errors.push(err(id, `explanation_per_distractor key '${k}' invalid`));
    }
    results.push(ok('A08', 'MCQ integrity', errors));
  }

  // A09 accept-list normalised and non-empty
  {
    const errors = [];
    for (const { kind, id, it } of items) {
      if (kind !== 'questions') continue;
      const typed = TYPED.has(it.type) || (it.type === 'fill_blank' && !it.choices);
      if (!typed && !it.accept_alternatives) continue;
      const ans = Array.isArray(it.answer) ? it.answer.join('') : it.answer;
      if (typed && !normalizeJa(ans)) errors.push(err(id, 'answer empty after normalisation'));
      const alts = (it.accept_alternatives || []).map((a) => normalizeJa(a));
      if (alts.some((a) => !a)) errors.push(err(id, 'empty accept alternative'));
      if (new Set(alts).size !== alts.length) errors.push(err(id, 'duplicate accept alternatives'));
      if (alts.includes(normalizeJa(ans))) errors.push(err(id, 'accept alternative duplicates the primary answer'));
    }
    results.push(ok('A09', 'Answer accept-list normalised (NFKC, kana variants) and non-empty', errors));
  }

  // mock helpers
  const mockQs = [];
  for (const m of raw.mocks) for (const s of m.sections) for (const qid of s.question_ids) { const q = idx.get(qid); if (q) mockQs.push({ mock: m.id, q }); }
  const qText = (q) => [q.stem.prompt, q.stem.ja, q.stem.context_ja, q.stem.audio_text, ...(q.choices || []).map((c) => c.text)].filter(Boolean).join('|');
  const grams = (t, n = 5) => { const s = normalizeJa(t).toLowerCase() || t; const g = new Set(); for (let i = 0; i + n <= s.length; i++) g.add(s.slice(i, i + n)); if (!g.size) g.add(s); return g; };
  const jacc = (a, b) => { let inter = 0; for (const x of a) if (b.has(x)) inter++; return inter / (a.size + b.size - inter || 1); };

  // A10 mock question uniqueness
  {
    const errors = [];
    const usedIn = new Map();
    for (const { mock, q } of mockQs) { if (usedIn.has(q.id) && usedIn.get(q.id) !== mock) errors.push(err(q.id, `question in more than one mock (${usedIn.get(q.id)}, ${mock})`)); usedIn.set(q.id, mock); }
    const hashes = new Map();
    const gs = [];
    for (const { mock, q } of mockQs) {
      const h = createHash('sha256').update(normalizeJa(qText(q)).toLowerCase()).digest('hex').slice(0, 16);
      if (hashes.has(h) && hashes.get(h) !== q.id) errors.push(err(q.id, `stem hash equals ${hashes.get(h)}`)); hashes.set(h, q.id);
      gs.push({ mock, id: q.id, g: grams(qText(q)) });
    }
    for (let i = 0; i < gs.length; i++) for (let j = i + 1; j < gs.length; j++) if (gs[i].id !== gs[j].id && jacc(gs[i].g, gs[j].g) >= 0.8) errors.push(err(gs[i].id, `5-gram Jaccard >= 0.8 with ${gs[j].id}`));
    results.push(ok('A10', 'Question uniqueness across mocks (id, stem hash, 5-gram Jaccard < 0.8)', errors, { mockQuestions: mockQs.length }));
  }

  // A11 passage and listening script uniqueness across mocks
  {
    const errors = [];
    const texts = [];
    const seenIds = new Map();
    for (const m of raw.mocks) for (const s of m.sections) {
      for (const pid of s.shared_passages || []) { const p = idx.get(pid); if (!p) continue; if (seenIds.has(pid) && seenIds.get(pid) !== m.id) errors.push(err(pid, `passage shared by mocks ${seenIds.get(pid)} and ${m.id}`)); seenIds.set(pid, m.id); texts.push({ id: pid, mock: m.id, g: grams(p.paragraphs.join('')) }); }
      for (const lid of s.listening_ids || []) { const l = idx.get(lid); if (!l) continue; if (seenIds.has(lid) && seenIds.get(lid) !== m.id) errors.push(err(lid, `listening item shared by mocks ${seenIds.get(lid)} and ${m.id}`)); seenIds.set(lid, m.id); texts.push({ id: lid, mock: m.id, g: grams(l.script_turns.map((t) => t.text_ja).join('')) }); }
    }
    for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) if (texts[i].mock !== texts[j].mock && jacc(texts[i].g, texts[j].g) >= 0.8) errors.push(err(texts[i].id, `text too similar to ${texts[j].id} (${texts[j].mock})`));
    results.push(ok('A11', 'Passage and listening-script uniqueness across mocks', errors));
  }

  // A12 mock timing equals jlpt official constants
  {
    const errors = [];
    if (!spec) errors.push(err('spec', 'spec not loaded'));
    else for (const m of raw.mocks) {
      const L = spec.jlpt.levels.find((l) => l.level === m.level);
      if (!L) { errors.push(err(m.id, 'unknown level')); continue; }
      if (m.sections.length !== L.test_sections.length) errors.push(err(m.id, `expected ${L.test_sections.length} sections`));
      L.test_sections.forEach((ts, i) => { const s = m.sections[i]; if (!s) return; if (s.minutes !== ts.minutes) errors.push(err(m.id, `section ${s.id}: ${s.minutes} min != official ${ts.minutes}`)); if (s.id !== ts.id) errors.push(err(m.id, `section id '${s.id}' != '${ts.id}'`)); if (s.official_section_name !== ts.official_name) errors.push(err(m.id, `section name '${s.official_section_name}' != '${ts.official_name}'`)); });
    }
    results.push(ok('A12', 'Mock timing equals jlpt official section minutes', errors));
  }

  // A13 TTS alignment and chunk length
  {
    const errors = [];
    const limitMora = MAX_CHUNK_SECONDS * 7.5 * 0.5;
    const checkSpoken = (id, spoken, shown, where) => {
      if (!spoken) { errors.push(err(id, `${where}: empty spoken text`)); return; }
      if (/[A-Za-z0-9<>{}]/.test(spoken)) errors.push(err(id, `${where}: spoken text contains non-Japanese markup/latin`));
      if (shown !== undefined && normalizeJa(shown) !== normalizeJa(spoken) && hasKanji(spoken) === false && hasKanji(shown) === false) errors.push(err(id, `${where}: spoken '${spoken}' != displayed '${shown}'`));
      const s = estimateSeconds(spoken.replace(/[^ぁ-ゖァ-ヺー]/g, ''), 0.5);
      if (s > MAX_CHUNK_SECONDS) errors.push(err(id, `${where}: estimated ${s.toFixed(1)}s > ${MAX_CHUNK_SECONDS}s at slowest rate (${limitMora} morae max)`));
    };
    for (const { kind, id, it } of items) {
      if (kind === 'listening') it.script_turns.forEach((t, i) => { checkSpoken(id, t.reading_kana || t.text_ja, undefined, `turn ${i}`); if (t.reading_kana && !hasKanji(t.text_ja) && normalizeJa(t.reading_kana) !== normalizeJa(t.text_ja)) errors.push(err(id, `turn ${i}: reading_kana differs from kana-only text`)); });
      if (kind === 'questions' && it.stem.audio_text) {
        checkSpoken(id, it.stem.audio_text, undefined, 'stem.audio_text');
        const ctxItem = it.stem.context_id && idx.get(it.stem.context_id);
        if (ctxItem && idx.kind.get(ctxItem.id) === 'listening' && !ctxItem.script_turns.some((t) => normalizeJa(t.text_ja) === normalizeJa(it.stem.audio_text) || normalizeJa(t.reading_kana || '') === normalizeJa(it.stem.audio_text))) errors.push(err(id, 'audio_text does not match any turn of its listening item'));
      }
      if (kind === 'questions' && it.type === 'listening_comp' && !it.stem.audio_text && !it.stem.context_id) errors.push(err(id, 'listening_comp needs audio_text or a listening context'));
    }
    results.push(ok('A13', 'TTS alignment: spoken text equals displayed text; chunk <= 12 s estimate', errors));
  }

  // A14 assets (manifest) - same rules as scripts/license-audit.mjs
  {
    const errors = [];
    const ALLOWED = ['CC0-1.0', 'CC-BY-4.0', 'CC-BY-3.0', 'owner-produced', 'original'];
    for (const a of raw.assets) {
      for (const f of ['id', 'name', 'type', 'origin', 'license', 'local_path', 'verified_by', 'verified_on']) if (!a[f]) errors.push(err(a.id || '?', `manifest field '${f}' missing`));
      if (a.origin === 'third_party') {
        if (!ALLOWED.includes(a.license)) errors.push(err(a.id, `license '${a.license}' not allowed`));
        for (const f of ['source_url', 'creator', 'retrieved_on']) if (!a[f]) errors.push(err(a.id, `third-party asset needs ${f}`));
        if (a.redistribution_allowed !== true) errors.push(err(a.id, 'redistribution_allowed must be true'));
        if (a.attribution_required && !a.attribution_text) errors.push(err(a.id, 'attribution text missing'));
      }
      if (a.local_path && ctx.root && !existsSync(join(ctx.root, a.local_path))) errors.push(err(a.id, `local_path '${a.local_path}' does not exist`));
    }
    results.push(ok('A14', 'Asset references exist; third-party assets have manifest entries with allowed licence', errors));
  }

  // A15 provenance
  {
    const errors = [];
    for (const { kind, id, it } of items) {
      if (kind === 'kana') continue;
      const p = resolveProvenance(it.provenance, raw.provenance);
      if (!p) { errors.push(err(id, `provenance profile '${it.provenance}' not found`)); continue; }
      if (!p.origin || !p.author || !p.license) errors.push(err(id, 'provenance incomplete'));
      if (p.origin === 'official_reference_link_only' && kind === 'questions') errors.push(err(id, 'official_reference_link_only items must not contain question text'));
      if (p.origin === 'open_data' && !p.source_url) errors.push(err(id, 'open_data item needs source_url'));
    }
    results.push(ok('A15', 'Provenance fields present; no official question text', errors));
  }

  // A16 coverage computation
  {
    const errors = [];
    let coverage = null;
    try { coverage = computeCoverage(raw, idx, spec); } catch (e) { errors.push(err('coverage', e.message)); }
    results.push(ok('A16', 'Coverage computation vs targets and status distribution', errors, { coverage }));
  }

  // ---- extra checks ----
  // X01 human_reviewed integrity
  {
    const errors = [];
    for (const [id, st] of Object.entries(raw.status)) {
      if (st.status === 'human_reviewed') {
        const r = st.review || {};
        if (!r.reviewer || !String(r.reviewer).trim()) errors.push(err(id, 'human_reviewed without a named reviewer'));
        if (!r.reviewed_on || !/^\d{4}-\d{2}-\d{2}$/.test(r.reviewed_on)) errors.push(err(id, 'human_reviewed without a reviewed_on date'));
      }
    }
    for (const u of raw.curriculum.units) if (u.content_status === 'human_reviewed') errors.push(err(u.id, 'unit marked human_reviewed: unit status is derived, never set by hand'));
    results.push(ok('X01', 'human_reviewed requires a named reviewer and date', errors));
  }
  // X02 placeholder scan (AC26)
  {
    const errors = [];
    const re = /\b(lorem ipsum|todo|tbd|fixme|coming soon|placeholder|dummy|xxx|sample text)\b/i;
    const scan = (id, v, path) => { if (typeof v === 'string') { if (re.test(v)) errors.push(err(id, `placeholder text at ${path}: '${v.slice(0, 50)}'`)); } else if (Array.isArray(v)) v.forEach((x, i) => scan(id, x, `${path}[${i}]`)); else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) scan(id, x, `${path}.${k}`); };
    for (const { id, it } of items) scan(id, it, '$');
    results.push(ok('X02', 'No placeholder text in shipped content (AC26)', errors));
  }
  // X03 spiral rule
  {
    const errors = []; const info = {};
    const byUnit = new Map();
    for (const q of raw.questions) { if (!byUnit.has(q.unit_id)) byUnit.set(q.unit_id, []); byUnit.get(q.unit_id).push(q); }
    for (const [u, qs] of byUnit) {
      const ord = ordOf(u);
      if (ord === 0) { info[u] = 'exempt (first unit)'; continue; }
      const spiral = qs.filter((q) => q.targets.some((t) => { const ti = idx.get(t); return ti && ti.unit_id && ordOf(ti.unit_id) < ord; })).length;
      info[u] = `${spiral}/${qs.length}`;
      if (qs.length && spiral / qs.length < 0.2) errors.push(err(u, `spiral rule: only ${spiral}/${qs.length} questions use earlier-unit items (< 20%)`));
    }
    results.push(ok('X03', 'Spiral rule: >= 20% of a unit\'s exercise items come from earlier units', errors, { info }));
  }
  // X04 grammar rule
  {
    const errors = [];
    for (const g of raw.grammar) {
      const qs = g.practice_question_ids.map((q) => idx.get(q)).filter(Boolean);
      if (qs.length < 6) errors.push(err(g.id, `needs >= 6 authored questions (has ${qs.length})`));
      if (new Set(qs.map((q) => q.type)).size < 3) errors.push(err(g.id, 'needs >= 3 exercise types'));
      if (g.examples.length < 3) errors.push(err(g.id, 'needs >= 3 example sentences'));
    }
    results.push(ok('X04', 'Each grammar point has >= 6 authored questions across >= 3 types', errors));
  }
  // X05 unit releasability
  {
    const errors = [];
    for (const u of raw.curriculum.units) {
      if (u.content_status === 'to_be_authored') continue;
      const has = (c) => raw[c].some((x) => x.unit_id === u.id);
      if (!has('lessons')) errors.push(err(u.id, 'unit has no lessons'));
      if (!has('listening')) errors.push(err(u.id, 'unit needs >= 1 listening activity'));
      if (!has('passages')) errors.push(err(u.id, 'unit needs >= 1 reading activity'));
      if (!has('vocab') && !has('kana')) errors.push(err(u.id, 'unit has no vocabulary or kana'));
      if (u.grammar_themes.length && !has('grammar')) errors.push(err(u.id, 'unit lists grammar themes but has no grammar points'));
      if ((u.lessons || []).length !== raw.lessons.filter((l) => l.unit_id === u.id).length) errors.push(err(u.id, 'curriculum unit.lessons does not list exactly the lessons of the unit'));
      const scopeKana = raw.kana.filter((k) => k.unit_id === u.id);
      const introduced = new Set(raw.lessons.filter((l) => l.unit_id === u.id).flatMap((l) => l.introduces.kana || []));
      for (const k of scopeKana) if (!introduced.has(k.id)) errors.push(err(u.id, `kana ${k.char} is in scope but no lesson introduces it`));
      const vIntro = new Set(raw.lessons.filter((l) => l.unit_id === u.id).flatMap((l) => l.introduces.vocab || []));
      for (const v of raw.vocab.filter((x) => x.unit_id === u.id)) if (!vIntro.has(v.id)) errors.push(err(v.id, 'vocab never introduced by a lesson of its unit'));
      for (const g of raw.grammar.filter((x) => x.unit_id === u.id)) if (!raw.lessons.some((l) => l.unit_id === u.id && (l.introduces.grammar || []).includes(g.id))) errors.push(err(g.id, 'grammar never introduced by a lesson'));
      const ss = raw.lessons.filter((l) => l.unit_id === u.id).map((l) => l.id);
      if (new Set(ss).size !== ss.length) errors.push(err(u.id, 'duplicate lessons'));
    }
    results.push(ok('X05', 'Authored units are complete (lessons, listening, reading, introductions)', errors));
  }
  // X06 kana-scope gating (kana-only learner text may use only kana introduced by that unit)
  {
    const errors = [];
    const kanaUnit = new Map();
    for (const k of raw.kana) {
      if ([...k.char].length !== 1) continue; // digraphs (kya, ...) reuse already-introduced kana plus small ya/yu/yo
      const key = `${k.script}:${k.char}`;
      if (!kanaUnit.has(key) || ordOf(k.unit_id) < ordOf(kanaUnit.get(key))) kanaUnit.set(key, k.unit_id);
    }
    const small = { ゃ: 1, ゅ: 1, ょ: 1, ぁ: 1, ぃ: 1, ぅ: 1, ぇ: 1, ぉ: 1, ャ: 1, ュ: 1, ョ: 1, ァ: 1, ィ: 1, ゥ: 1, ェ: 1, ォ: 1 };
    for (const { kind, id, it } of items) {
      if (!it.unit_id || !idx.units.has(it.unit_id)) continue;
      const ord = ordOf(it.unit_id);
      for (const s of japaneseStrings(kind, it)) {
        for (const ch of s.text) {
          const code = ch.codePointAt(0);
          let script = null; let base = ch;
          if (code >= 0x3041 && code <= 0x3096) script = 'hiragana'; else if (code >= 0x30a1 && code <= 0x30fa) script = 'katakana';
          if (!script) continue;
          if (small[ch]) continue; // youon members are checked as part of the combination below
          const u = kanaUnit.get(`${script}:${base}`);
          if (u === undefined) { if (!(ch === 'を' || ch === 'ー')) errors.push(err(id, `${s.where}: kana '${ch}' not in kana.json`)); continue; }
          if (ordOf(u) > ord) errors.push(err(id, `${s.where}: kana '${ch}' (unit ${u}) used before it is introduced in ${it.unit_id}`));
        }
      }
    }
    results.push(ok('X06', 'Kana-scope gating: kana used only after introduction', errors));
  }
  // X07 fixture leakage
  {
    const errors = [];
    for (const { id, it } of items) if (/fixture/i.test(id) || /FIXTURE\s*[—-]\s*not shipped/i.test(JSON.stringify(it))) errors.push(err(id, 'fixture data found in shipped content'));
    results.push(ok('X07', 'No fixture data in content/', errors));
  }
  // X08 forbidden claims
  {
    const errors = [];
    const re = /(\/\s?180\b|\bJLPT score\b|official (word |vocab|kanji|grammar )?list|official past paper|you will pass|guaranteed (to )?pass|\bCEFR\b|\b[ABC][12]\b level)/i;
    for (const { kind, id, it } of items) { const j = JSON.stringify(it); const m = re.exec(j); if (m && kind !== 'kana') errors.push(err(id, `forbidden claim text '${m[0]}'`)); }
    results.push(ok('X08', 'No fabricated JLPT claims (/180, official lists, pass predictions, CEFR)', errors));
  }
  // X09 status consistency
  {
    const errors = [];
    for (const [id, st] of Object.entries(raw.status)) if (st.status === 'human_reviewed' && STATUS_ORDER[statusOf(raw, id)] < STATUS_ORDER.human_reviewed) errors.push(err(id, 'status inconsistent'));
    for (const u of raw.curriculum.units) {
      if (['auto_checked', 'human_reviewed'].includes(u.content_status)) {
        for (const c of COLLECTIONS) for (const it of raw[c]) if (it.unit_id === u.id && STATUS_ORDER[statusOf(raw, it.id)] < STATUS_ORDER.auto_checked) errors.push(err(it.id, `unit ${u.id} is ${u.content_status} but this item is ${statusOf(raw, it.id)}`));
      }
    }
    for (const m of raw.mocks) for (const s of m.sections) for (const q of s.question_ids) if (STATUS_ORDER[statusOf(raw, q)] < STATUS_ORDER.auto_checked && STATUS_ORDER[statusOf(raw, m.id)] >= STATUS_ORDER.auto_checked) errors.push(err(m.id, `released mock contains non-auto_checked question ${q}`));
    results.push(ok('X09', 'Status consistency: released units/mocks contain only auto_checked or higher items', errors));
  }
  // X10 mock question section / item-type validity
  {
    const errors = [];
    for (const m of raw.mocks) {
      const L = spec?.jlpt.levels.find((l) => l.level === m.level);
      for (const s of m.sections) for (const qid of s.question_ids) {
        const q = idx.get(qid); if (!q) continue;
        if (!q.section) errors.push(err(qid, `mock question has no section (${m.id})`));
        if (q.instructional_level !== m.level) errors.push(err(qid, `question level ${q.instructional_level} in ${m.level} mock`));
        if (L && q.section && q.jlpt_item_type && !(L.item_types[q.section] || []).includes(q.jlpt_item_type)) errors.push(err(qid, `item type '${q.jlpt_item_type}' is not an official ${m.level} ${q.section} item type`));
      }
    }
    results.push(ok('X10', 'Mock questions carry section and an official item type valid for the level', errors));
  }
  // X11 lessons well-formed
  {
    const errors = [];
    for (const l of raw.lessons) {
      const ex = l.exit_check; if (!(ex.question_ids?.length || ex.gen?.length)) errors.push(err(l.id, 'exit_check is empty'));
      if ((ex.pass ?? 0.7) < 0.7) errors.push(err(l.id, 'exit_check pass mark must be >= 0.7 (lesson_structure)'));
      if (!l.practice.question_ids?.length && !l.practice.gen?.length) errors.push(err(l.id, 'practice is empty'));
    }
    results.push(ok('X11', 'Lessons have practice and an exit check >= 70%', errors));
  }
  // X12 lesson-level gating: vocabulary, examples and questions use only kana/words introduced by that lesson or earlier
  {
    const errors = [];
    const kanaChar = new Map(raw.kana.filter((k) => [...k.char].length === 1).map((k) => [k.id, k]));
    const lessonIdx = new Map(); // lessonId -> {unitOrd, i}
    const vocabAt = new Map(); // vocabId -> {unitOrd, i}
    for (const u of raw.curriculum.units) (u.lessons || []).forEach((lid, i) => lessonIdx.set(lid, { unit: u.id, ord: u.order, i }));
    for (const l of raw.lessons) { const li = lessonIdx.get(l.id); if (!li) continue; for (const v of l.introduces.vocab || []) vocabAt.set(v, li); }
    const known = (lessonId) => {
      const li = lessonIdx.get(lessonId); const set = new Set();
      for (const k of raw.kana) if (ordOf(k.unit_id) < li.ord) for (const ch of k.char) set.add(ch);
      for (const l of raw.lessons) { const lj = lessonIdx.get(l.id); if (lj && lj.unit === li.unit && lj.i <= li.i) for (const kid of l.introduces.kana || []) { const k = raw.kana.find((x) => x.id === kid); if (k) for (const ch of k.char) set.add(ch); } }
      for (const ch of 'ゃゅょっー、。？！ ・') set.add(ch);
      return set;
    };
    for (const l of raw.lessons) {
      const li = lessonIdx.get(l.id); if (!li) continue;
      const allowed = known(l.id);
      const kanjiOK = idx.introducedKanji(l.unit_id);
      const scan = (text, where, ruby) => { for (const ch of text) { const c = ch.codePointAt(0); if ((c >= 0x3041 && c <= 0x3096) || (c >= 0x30a1 && c <= 0x30fa)) { const h = String.fromCodePoint(c >= 0x30a1 ? c - 0x60 : c); if (!allowed.has(ch) && !allowed.has(h) && !raw.kana.some((k) => k.char === ch && ordOf(k.unit_id) < li.ord)) errors.push(err(l.id, `${where}: kana '${ch}' not yet introduced at this lesson`)); } } void kanjiOK; void ruby; };
      l.explain.forEach((b, bi) => (b.examples || []).forEach((e, ei) => scan(e.ja, `explain ${bi}.${ei}`)));
      for (const v of l.introduces.vocab || []) { const vi = idx.get(v); if (vi) scan(vi.reading_kana, `vocab ${v}`); }
      for (const part of ['practice', 'context', 'exit_check']) {
        const p = l[part]; if (!p) continue;
        for (const qid of p.question_ids || []) {
          const q = idx.get(qid); if (!q) continue;
          for (const st of japaneseStrings('questions', q)) scan(st.text, `${part} ${qid} ${st.where}`);
          for (const t of q.targets) {
            if (idx.kind.get(t) === 'vocab') { const at = vocabAt.get(t); const to = idx.get(t); if (to && (ordOf(to.unit_id) === li.ord) && at && at.i > li.i) errors.push(err(l.id, `${part}: ${qid} targets vocab ${t} introduced in a later lesson`)); }
            if (idx.kind.get(t) === 'kana') { const k = kanaChar.get(t); if (k) scan(k.char, `${part} ${qid} target ${t}`); }
          }
        }
        for (const g of p.gen || []) for (const gid of g.ids || []) {
          if (idx.kind.get(gid) === 'kana') { const k = kanaChar.get(gid); if (k) scan(k.char, `${part} gen ${gid}`); }
          if (idx.kind.get(gid) === 'vocab') { const vi = idx.get(gid); const at = vocabAt.get(gid); if (vi && ordOf(vi.unit_id) === li.ord && at && at.i > li.i) errors.push(err(l.id, `${part} gen: vocab ${gid} is introduced in a later lesson`)); }
        }
      }
    }
    results.push(ok('X12', 'Lesson-level gating: kana, vocabulary and questions appear only after the lesson that introduces them', errors));
  }
  return results;
}

/** Coverage per level (counts of released = auto_checked or higher) against release-1 targets. */
export function computeCoverage(raw, idx, spec) {
  const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
  const targets = spec?.content_coverage_plan.dimensions.curriculum_coverage.release_1_targets_new_items_per_level || {};
  const cov = {};
  const vis = (id) => STATUS_ORDER[statusOf(raw, id)] >= STATUS_ORDER.auto_checked;
  for (const L of levels) {
    const units = raw.curriculum.units.filter((u) => u.level === L);
    const rel = units.filter((u) => ['auto_checked', 'human_reviewed'].includes(u.content_status));
    const mockOnly = new Set(raw.mocks.flatMap((m) => m.sections.flatMap((sec) => [...sec.question_ids, ...(sec.shared_passages || []), ...(sec.listening_ids || [])])));
    const count = (c) => raw[c].filter((x) => x.instructional_level === L && vis(x.id) && !mockOnly.has(x.id));
    const dist = { draft: 0, auto_checked: 0, human_reviewed: 0 };
    for (const c of COLLECTIONS) for (const x of raw[c]) if ((x.instructional_level || idx.unitLevel.get(x.unit_id) || x.level) === L) dist[statusOf(raw, x.id)]++;
    const releasedMocks = raw.mocks.filter((m) => m.level === L && vis(m.id)).length;
    cov[L] = {
      units_total: units.length, units_released: rel.length,
      vocab: count('vocab').length, kanji: count('kanji').length, grammar: count('grammar').length, dialogues: count('dialogues').length, passages: count('passages').length,
      kana: L === 'N5' ? raw.kana.filter((k) => vis(k.id)).length : 0, sentences: count('sentences').length, listening: count('listening').length,
      questions_authored: count('questions').filter((q) => !(q.tags || []).includes('templated')).length, questions_templated: count('questions').filter((q) => (q.tags || []).includes('templated')).length, targets: targets[L] || null, mocks_released: releasedMocks, mocks_target_long_term: 20, status_distribution: dist,
    };
  }
  return cov;
}
