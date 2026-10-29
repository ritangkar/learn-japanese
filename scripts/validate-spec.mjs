#!/usr/bin/env node
// Reproduces the checks V01-V34 of the previous (Python) validator against spec/application_spec.json.
// Usage: node scripts/validate-spec.mjs [path-to-spec]
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const SPEC_PATH = process.argv[2] || fileURLToPath(new URL('../spec/application_spec.json', import.meta.url));
export const EXPECTED_SHA256 = '1f02a1cada9f30d22cb0bdf33903c083ed95d4cacaacbc06d2e855144a0cb243';

/** Strict JSON parser: rejects duplicate keys, NaN/Infinity, trailing commas, comments. */
export function parseStrict(text) {
  let i = 0;
  const err = (m) => { throw new Error(`${m} at offset ${i}`); };
  const ws = () => { while (i < text.length && ' \t\n\r'.includes(text[i])) i++; };
  function value() {
    ws();
    const c = text[i];
    if (c === '{') return object();
    if (c === '[') return array();
    if (c === '"') return string();
    if (text.startsWith('true', i)) { i += 4; return true; }
    if (text.startsWith('false', i)) { i += 5; return false; }
    if (text.startsWith('null', i)) { i += 4; return null; }
    const m = /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/.exec(text.slice(i, i + 40));
    if (!m) err(`Unexpected token '${c}'`);
    i += m[0].length;
    return Number(m[0]);
  }
  function string() {
    const start = i;
    i++;
    while (i < text.length && text[i] !== '"') {
      if (text[i] === '\\') i += text[i + 1] === 'u' ? 6 : 2; else i++;
    }
    if (text[i] !== '"') err('Unterminated string');
    i++;
    return JSON.parse(text.slice(start, i));
  }
  function object() {
    const o = {};
    i++; ws();
    if (text[i] === '}') { i++; return o; }
    for (;;) {
      ws();
      if (text[i] !== '"') err('Expected string key');
      const k = string();
      if (Object.prototype.hasOwnProperty.call(o, k)) err(`Duplicate key "${k}"`);
      ws();
      if (text[i] !== ':') err("Expected ':'");
      i++;
      o[k] = value();
      ws();
      if (text[i] === ',') { i++; continue; }
      if (text[i] === '}') { i++; return o; }
      err("Expected ',' or '}'");
    }
  }
  function array() {
    const a = [];
    i++; ws();
    if (text[i] === ']') { i++; return a; }
    for (;;) {
      a.push(value());
      ws();
      if (text[i] === ',') { i++; continue; }
      if (text[i] === ']') { i++; return a; }
      err("Expected ',' or ']'");
    }
  }
  const v = value();
  ws();
  if (i !== text.length) err('Trailing content');
  return v;
}

const results = [];
const rec = (status, id, msg) => results.push({ status, id, msg });
const pass = (id, msg) => rec('PASS', id, msg);
const fail = (id, msg) => rec('FAIL', id, msg);
const warn = (id, msg) => rec('WARN', id, msg);
const check = (cond, id, okMsg, badMsg) => (cond ? pass(id, okMsg) : fail(id, badMsg));

const BRIEF_SECTIONS = ['meta', 'source_register', 'product_vision', 'objectives', 'user_profile', 'requirements', 'decisions', 'risks', 'limitations', 'content_coverage_plan', 'application_sections', 'screen_inventory', 'user_journeys', 'curriculum', 'language_content_schema', 'exercise_types', 'learning_engine', 'spaced_repetition', 'mastery_model', 'content_validation', 'jlpt', 'mock_examinations', 'readiness_dashboard', 'japan_exploration', 'regions', 'destinations', 'destination_quests', 'progression_rules', 'gamification', 'audio_system', 'visual_design', 'assets', 'asset_licensing', 'local_storage', 'backup_restore', 'offline_architecture', 'pwa', 'technical_architecture', 'accessibility', 'privacy', 'testing', 'deployment', 'acceptance_criteria', 'implementation_plan', 'open_questions'];

export function run(specPath = SPEC_PATH, { quiet = false } = {}) {
  results.length = 0;
  const raw = readFileSync(specPath, 'utf8');
  const sha = createHash('sha256').update(readFileSync(specPath)).digest('hex');
  check(sha === EXPECTED_SHA256, 'V00-sha256', `SHA-256 matches ${sha}`, `SHA-256 MISMATCH: expected ${EXPECTED_SHA256} got ${sha}`);

  let s;
  try { s = parseStrict(raw); } catch (e) {
    fail('V01', `strict JSON parse failed (also covers V02 duplicate keys): ${e.message}`);
    return finish(quiet);
  }
  const keys = Object.keys(s);
  check(keys.length === 45, 'V01', `valid strict JSON, ${(raw.length / 1024).toFixed(0)} KB, ${keys.length} top-level sections`, `expected 45 sections, got ${keys.length}`);
  pass('V02', 'no duplicate keys (strict parser)');
  const missing = BRIEF_SECTIONS.filter((k) => !(k in s));
  check(missing.length === 0, 'V03', `all ${BRIEF_SECTIONS.length} brief-suggested sections present`, `missing sections: ${missing}`);
  check(s.meta?.schema_version && s.meta.section_count === keys.length && JSON.stringify(s.meta.section_index) === JSON.stringify(keys), 'V04', 'schema_version present; section_count and section_index match', 'meta.schema_version/section_count/section_index inconsistent');

  // V05 id uniqueness
  const collections = {
    'requirements.hard': s.requirements.hard, 'requirements.recommended': s.requirements.recommended, destinations: s.destinations, regions: s.regions,
    acceptance_criteria: s.acceptance_criteria, screens: s.screen_inventory, journeys: s.user_journeys, decisions: s.decisions, sources: s.source_register,
    risks: s.risks, open_questions: s.open_questions, exercise_types: s.exercise_types, sounds: s.audio_system.sound_library, rules: s.learning_engine.rules,
    achievements: s.gamification.achievements, quest_types: s.destination_quests.types, limitations: s.limitations.items,
    automated_checks: s.content_validation.automated_checks,
  };
  for (const [name, arr] of Object.entries(collections)) {
    const ids = arr.map((x) => x.id);
    check(new Set(ids).size === ids.length && ids.every(Boolean), `V05-${name}`, `${name}: ${ids.length} unique ids`, `${name}: duplicate or missing ids`);
  }

  // V06/V07 curriculum
  const units = [];
  for (const [lvl, v] of Object.entries(s.curriculum.levels)) for (const u of v.units) units.push({ ...u, level: lvl });
  const unitIds = new Set(units.map((u) => u.id));
  check(units.length === 43 && unitIds.size === 43, 'V06', `${units.length} curriculum units across ${Object.keys(s.curriculum.levels).length} levels`, `expected 43 unique units, got ${units.length}/${unitIds.size}`);
  const kTarget = Object.fromEntries(Object.entries(s.content_coverage_plan.dimensions.curriculum_coverage.release_1_targets_new_items_per_level).map(([k, v]) => [k, v.kanji]));
  for (const lvl of Object.keys(s.curriculum.levels)) {
    const sum = s.curriculum.levels[lvl].units.reduce((a, u) => a + u.kanji_introduced_target, 0);
    check(sum === kTarget[lvl], `V07-${lvl}`, `${lvl}: unit kanji sum ${sum} vs coverage target ${kTarget[lvl]}`, `${lvl}: unit kanji sum ${sum} != coverage target ${kTarget[lvl]}`);
  }

  // V08 destination refs
  const regionIds = new Set(s.regions.map((r) => r.id));
  const soundIds = new Set(s.audio_system.sound_library.map((x) => x.id));
  const qtIds = new Set(s.destination_quests.types.map((t) => t.id));
  const destIds = new Set(s.destinations.map((d) => d.id));
  const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
  const probs = [];
  for (const d of s.destinations) {
    if (!regionIds.has(d.region_id)) probs.push(`${d.id}: region ${d.region_id}`);
    for (const sid of d.soundscape_ids || []) if (!soundIds.has(sid)) probs.push(`${d.id}: sound ${sid}`);
    for (const q of d.quests || []) if (!qtIds.has(q.type)) probs.push(`${d.id}: quest type ${q.type}`);
    for (const u of [...(d.unlock?.all_units_completed || []), ...(d.completion?.units_completed || [])]) if (!unitIds.has(u)) probs.push(`${d.id}: unit ${u}`);
    if (d.parent_id && !destIds.has(d.parent_id)) probs.push(`${d.id}: parent ${d.parent_id}`);
    if (d.is_geographic && (typeof d.latitude !== 'number' || typeof d.longitude !== 'number')) probs.push(`${d.id}: missing coords`);
    if (!(d.quests || []).some((q) => q.primary)) probs.push(`${d.id}: no primary quest`);
    if (!levels.includes(d.first_visit_level)) probs.push(`${d.id}: first_visit_level`);
  }
  check(probs.length === 0, 'V08', 'destination references (regions, sounds, quest types, units, parents, coords, primary quest) all consistent', `destination reference problems: ${probs.join('; ')}`);
  const lvlSet = new Set(s.destinations.map((d) => d.first_visit_level));
  check(levels.every((l) => lvlSet.has(l)), 'V09', `destinations exist for every level: ${[...lvlSet].sort()}`, 'a level has no destination');
  check(s.destinations.length === 27 && s.regions.length === 9, 'V10', '27 destinations, 9 regions (AC14)', `expected 27/9 got ${s.destinations.length}/${s.regions.length}`);
  const used = new Set(s.destinations.map((d) => d.region_id));
  const unused = [...regionIds].filter((r) => !used.has(r));
  check(unused.length === 0, 'V11', `every region has at least one destination: unused=[${unused}]`, `unused regions: ${unused}`);
  const order = s.japan_exploration.route.order;
  const byOrder = [...s.destinations].sort((a, b) => a.order - b.order).map((d) => d.id);
  check(JSON.stringify(order) === JSON.stringify(byOrder) && new Set(order).size === order.length, 'V12', 'route order equals destination order (no cycles: strict linear order)', 'route order differs from destination order');
  // V13 unit prerequisites: unit levels must not exceed destination level
  const lvlIdx = (l) => levels.indexOf(l);
  const bad13 = [];
  for (const d of s.destinations) for (const u of [...(d.unlock?.all_units_completed || []), ...(d.completion?.units_completed || [])]) {
    const ul = units.find((x) => x.id === u)?.level;
    if (ul && lvlIdx(ul) > lvlIdx(d.first_visit_level)) bad13.push(`${d.id}->${u}`);
  }
  check(bad13.length === 0, 'V13', 'unit prerequisites resolve and never point to a higher level than the destination', `unit prerequisite level violations: ${bad13}`);
  // V14 map bounds
  const b = s.japan_exploration.map.projection.bounds;
  const oob = s.destinations.filter((d) => d.is_geographic && (d.longitude < b.lon_min || d.longitude > b.lon_max || d.latitude < b.lat_min || d.latitude > b.lat_max)).map((d) => d.id);
  check(oob.length === 0, 'V14', 'all geographic destinations fall inside projection bounds', `out of bounds: ${oob}`);

  // V15 JLPT constants (official figures as recorded in the spec; fetched 2026-10-29)
  const OFFICIAL = {
    N5: { minutes: [20, 40, 30], total: 90, pass: 80, sect: [[120, 38], [60, 19]] },
    N4: { minutes: [25, 55, 35], total: 115, pass: 90, sect: [[120, 38], [60, 19]] },
    N3: { minutes: [30, 70, 40], total: 140, pass: 95, sect: [[60, 19], [60, 19], [60, 19]] },
    N2: { minutes: [105, 50], total: 155, pass: 90, sect: [[60, 19], [60, 19], [60, 19]] },
    N1: { minutes: [110, 55], total: 165, pass: 100, sect: [[60, 19], [60, 19], [60, 19]] },
  };
  const p15 = [];
  for (const L of s.jlpt.levels) {
    const o = OFFICIAL[L.level];
    if (JSON.stringify(L.test_sections.map((t) => t.minutes)) !== JSON.stringify(o.minutes)) p15.push(`${L.level} minutes`);
    if (L.total_minutes_excluding_breaks !== o.total || L.test_sections.reduce((a, t) => a + t.minutes, 0) !== o.total) p15.push(`${L.level} total`);
    if (L.overall_pass_mark !== o.pass) p15.push(`${L.level} pass mark`);
    if (JSON.stringify(L.scoring_sections.map((x) => [x.range[1], x.sectional_pass_mark])) !== JSON.stringify(o.sect)) p15.push(`${L.level} sectional`);
    if (L.scoring_sections.reduce((a, x) => a + x.range[1], 0) !== 180) p15.push(`${L.level} sum != 180`);
  }
  check(p15.length === 0, 'V15', 'JLPT minutes, pass marks, sectional marks, section ranges (sum 180) match the official figures recorded in the spec', `JLPT constants mismatch: ${p15}`);
  const it = Object.fromEntries(s.jlpt.levels.map((L) => [L.level, L.item_types]));
  const p16 = [];
  if (it.N2.vocabulary.indexOf('Word formation') < 0) p16.push('N2 word formation');
  for (const l of ['N5', 'N4', 'N3', 'N1']) if (it[l].vocabulary.includes('Word formation')) p16.push(`${l} has word formation`);
  if (it.N1.vocabulary.includes('Orthography')) p16.push('N1 orthography');
  for (const l of ['N5', 'N4', 'N3', 'N2']) if (!it[l].vocabulary.includes('Orthography')) p16.push(`${l} lacks orthography`);
  for (const l of ['N5', 'N4', 'N3']) if (it[l].listening.includes('Integrated comprehension')) p16.push(`${l} integrated listening`);
  if (!it.N1.listening.includes('Integrated comprehension') || !it.N2.listening.includes('Integrated comprehension')) p16.push('N1/N2 integrated listening');
  const longP = (l) => it[l].reading.includes('Comprehension (Long passages)');
  if (!longP('N3') || !longP('N1') || longP('N5') || longP('N4') || longP('N2')) p16.push('long-passage availability');
  check(p16.length === 0, 'V16', 'item-type availability per level matches the official composition table', `item type problems: ${p16}`);

  // V17/V18 mocks
  const mt = s.mock_examinations.targets;
  const relTarget = mt.release_1_target;
  const p17 = [];
  if (mt.per_level_long_term !== 20 || mt.total_long_term !== 100) p17.push('20/100');
  for (const l of levels) {
    if (!(mt.release_1_minimum_per_level <= relTarget[l] && relTarget[l] <= 20)) p17.push(`${l} target`);
    const cov = s.content_coverage_plan.dimensions.mock_examination_coverage;
    if (cov.release_1_target_per_level[l] !== relTarget[l]) p17.push(`${l} coverage-plan mismatch`);
    if (cov.release_1_minimum_per_level[l] < 1 || cov.release_1_minimum_per_level[l] > relTarget[l]) p17.push(`${l} min`);
  }
  check(p17.length === 0, 'V17', 'mock targets consistent: 20 per level, 100 total, minimum <= target <= 20 in both sections', `mock target problems: ${p17}`);
  const j = JSON.stringify([s.mock_examinations.status, s.limitations.items.find((x) => x.id === 'L-01')]);
  check(/NOT MET/i.test(s.mock_examinations.status) && /NOT met/.test(j), 'V18', 'release-1 shortfall against 20 per level is stated explicitly in mock_examinations and limitations', 'shortfall not stated');
  check(s.mock_examinations.scoring_policy.official_formula_replicated === false && s.mock_examinations.scoring_policy.forbidden.some((x) => /180/.test(x)), 'V19', 'mock scoring does not replicate an official formula', 'scoring policy problem');

  // V20 cross refs
  const refCheck = (label, ids, pattern) => {
    const found = new Set(raw.match(pattern) || []);
    const unknown = [...found].filter((x) => !new Set(ids).has(x));
    check(unknown.length === 0, `V20-${label}`, `all ${label} references resolve (${found.size} referenced)`, `unresolved ${label} refs: ${unknown}`);
  };
  refCheck('decision', s.decisions.map((x) => x.id), /\bD-\d{3}\b/g);
  refCheck('source', s.source_register.map((x) => x.id), /\bS\d{2}\b/g);
  refCheck('open question', s.open_questions.map((x) => x.id), /\bU-\d{3}\b/g);
  refCheck('limitation', s.limitations.items.map((x) => x.id), /\bL-\d{2}\b/g);

  // V21/V22 AC -> R
  const rIds = new Set(s.requirements.hard.map((r) => r.id));
  const badAc = s.acceptance_criteria.filter((a) => !a.requirements.length || a.requirements.some((r) => !rIds.has(r)));
  check(badAc.length === 0, 'V21', 'acceptance criteria reference existing requirements', `AC with bad requirement links: ${badAc.map((a) => a.id)}`);
  const covered = new Set(s.acceptance_criteria.flatMap((a) => a.requirements));
  const uncovered = [...rIds].filter((r) => !covered.has(r));
  check(uncovered.length === 0, 'V22', 'every hard requirement has at least one acceptance criterion', `requirements without AC: ${uncovered}`);

  // V23-V26 storage / assets
  const ls = s.local_storage.size_estimates;
  const rel = ls.release_1_facets_estimate * 40 / 1024;
  const full = ls.full_n5_to_n1_facets_estimate * 40 / 1048576;
  check(Math.abs(rel - ls.release_1_srs_kb_estimate) / ls.release_1_srs_kb_estimate < 0.1 && Math.abs(full - ls.full_srs_mb_estimate) / ls.full_srs_mb_estimate < 0.1, 'V23', `storage arithmetic: release-1 SRS ${rel.toFixed(0)} KB (stated ${ls.release_1_srs_kb_estimate}); full ${full.toFixed(2)} MB (stated ${ls.full_srs_mb_estimate})`, 'storage arithmetic differs by >10%');
  check(/assumption/i.test(ls.status), 'V24', 'storage estimates are labelled as assumptions, not measurements', 'estimates not labelled assumption');
  const th = s.local_storage.thresholds;
  check(th.warn_kb < th.urgent_kb && th.urgent_kb < 5000, 'V25', 'storage thresholds ordered and below ~5 MB quota', 'threshold ordering problem');
  check(s.assets.budgets.core_precache_total_mb_max === 8 && /8 MB/.test(s.offline_architecture.app_shell_vs_content), 'V26', 'asset budget 8 MB consistent with offline_architecture precache target', 'asset budget inconsistent');
  check(s.assets.planned.audio_files_in_release_1 === 0 && s.audio_system.sound_library.every((x) => x.file_size_kb === 0), 'V27', 'no recorded third-party audio files planned for release 1 (matches R011/D-006)', 'recorded audio planned');
  check(s.requirements.hard.every((r) => r.level === 'MUST'), 'V28', 'all hard requirements flagged MUST', 'a hard requirement is not MUST');
  check(s.requirements.hard.find((r) => r.id === 'R007').text.includes('localStorage') && /silent/i.test(JSON.stringify(s.decisions.find((d) => d.id === 'D-003'))), 'V29', 'localStorage requirement and no-silent-IndexedDB rule are present', 'localStorage rule missing');
  const prob30 = [];
  if (s.audio_system.sound_library.length !== 22) prob30.push('sound count != 22');
  if (s.exercise_types.length !== 23) prob30.push('exercise types != 23');
  if (s.acceptance_criteria.length !== 39) prob30.push('AC count != 39');
  check(prob30.length === 0, 'V30', 'no contradictions found by heuristic checks (22 sounds, 23 exercise types, 39 AC)', prob30.join('; '));

  // V31 placeholder scan: exempt *.criterion fields (AC26 itself names the forbidden words)
  const hits = [];
  (function scan(v, path) {
    if (typeof v === 'string') {
      if (path.endsWith('.criterion')) return;
      if (/\b(lorem ipsum|TODO|TBD|FIXME)\b/i.test(v)) hits.push(`${path}: ${v.slice(0, 60)}`);
    } else if (Array.isArray(v)) v.forEach((x, k) => scan(x, `${path}[${k}]`));
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) scan(x, `${path}.${k}`);
  })(s, '$');
  check(hits.length === 0, 'V31', 'no placeholder markers (lorem/TODO/TBD/FIXME) outside *.criterion fields', `placeholder markers: ${hits}`);
  const notes = s.destinations.map((d) => d.cultural_note?.status);
  check(notes.every((x) => x === 'draft_requires_fact_check'), 'V32', 'all cultural notes marked draft_requires_fact_check', 'a cultural note lacks the fact-check marker');
  const tags = {};
  for (const x of s.source_register) tags[x.tag] = (tags[x.tag] || 0) + 1;
  check(Object.keys(tags).length > 0 && s.source_register.every((x) => x.tag), 'V33', `source register tags: ${JSON.stringify(tags)}`, 'source without tag');
  const sizes = keys.map((k) => [k, JSON.stringify(s[k]).length]).sort((a, b) => b[1] - a[1]).slice(0, 6);
  warn('V34', `largest sections (chars): ${sizes.map(([k, n]) => `${k}=${n}`).join(', ')}`);
  return finish(quiet);
}

function finish(quiet) {
  const p = results.filter((r) => r.status === 'PASS').length;
  const w = results.filter((r) => r.status === 'WARN').length;
  const f = results.filter((r) => r.status === 'FAIL').length;
  if (!quiet) {
    for (const r of results) console.log(`${r.status.padEnd(5)} ${r.id.padEnd(16)} ${r.msg}`);
    console.log(`\nSUMMARY: ${p} passed, ${w} warnings, ${f} failed`);
  }
  return { passed: p, warnings: w, failed: f, results: [...results] };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const r = run();
  process.exit(r.failed ? 1 : 0);
}
