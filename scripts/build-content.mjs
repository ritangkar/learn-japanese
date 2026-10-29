#!/usr/bin/env node
// Builds public/content/*.json (served as ./content/*.json): only items at auto_checked or higher are included.
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { loadContent, loadSpec, ROOT } from './lib/load-content.mjs';
import { statusOf, STATUS_ORDER, buildIndex } from '../src/content/model.js';

const raw = loadContent();
const spec = loadSpec();
const idx = buildIndex(raw);
const out = join(ROOT, 'public/content');
rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'mocks'), { recursive: true });
const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
const visible = (id) => STATUS_ORDER[statusOf(raw, id)] >= STATUS_ORDER.auto_checked;
const stamp = (it) => ({ ...it, content_status: statusOf(raw, it.id), ...(raw.status[it.id]?.review ? { review: raw.status[it.id].review } : {}) });
const levelOfItem = (it) => it.instructional_level || idx.unitLevel.get(it.unit_id);
const hash = (s) => createHash('sha256').update(s).digest('hex');
const files = {};
const write = (name, obj) => { const text = JSON.stringify(obj); files[name] = hash(text); writeFileSync(join(out, name), text); return text.length; };

const unitStatus = (u) => {
  if (u.content_status === 'to_be_authored') return 'to_be_authored';
  return u.content_status;
};
const releasedUnit = (u) => ['auto_checked', 'human_reviewed'].includes(unitStatus(u));

// per-level bundles
const sizes = {};
for (const L of levels) {
  const keep = (arr) => arr.filter((x) => levelOfItem(x) === L && visible(x.id) && releasedUnit(idx.units.get(x.unit_id))).map(stamp);
  const bundle = { level: L, vocab: keep(raw.vocab), kanji: keep(raw.kanji), grammar: keep(raw.grammar), sentences: keep(raw.sentences), dialogues: keep(raw.dialogues), passages: keep(raw.passages), listening: keep(raw.listening), questions: keep(raw.questions), lessons: keep(raw.lessons), quests: raw.quests.filter((q) => idx.unitLevel.get(q.unit_id) === L && visible(q.id) && releasedUnit(idx.units.get(q.unit_id))).map(stamp) };
  sizes[L] = write(`${L}.json`, bundle);
}
// mocks (self-contained)
const mocks = [];
for (const m of raw.mocks) {
  if (!visible(m.id)) continue;
  const qs = []; const ps = []; const ls = [];
  for (const s of m.sections) { for (const q of s.question_ids) qs.push(stamp(idx.get(q))); for (const p of s.shared_passages || []) ps.push(stamp(idx.get(p))); for (const l of s.listening_ids || []) ls.push(stamp(idx.get(l))); }
  const file = `mocks/${m.id}.json`;
  write(file, { mock: stamp(m), questions: qs, passages: ps, listening: ls });
  mocks.push({ id: m.id, level: m.level, title: m.title, file, questions: qs.length, status: statusOf(raw, m.id) });
}
// core data derived from the spec (single source of truth) + curriculum + kana
const dests = spec.destinations.map((d) => ({ id: d.id, order: d.order, name_en: d.name_en, name_ja: d.name_ja, reading_kana: d.reading_kana, region_id: d.region_id, type: d.type, is_geographic: d.is_geographic, parent_id: d.parent_id, latitude: d.latitude, longitude: d.longitude, map_offset: d.map_offset || null, map_xy: d.map_xy || null, first_visit_level: d.first_visit_level, unlock: d.unlock, completion: d.completion, language_objectives: d.language_objectives, quests: d.quests, soundscape_ids: d.soundscape_ids, cultural_note: d.cultural_note, rewards: d.rewards, illustration: d.illustration, revisit_tiers: d.revisit_tiers }));
const core = {
  units: raw.curriculum.units.map((u) => ({ ...u, content_status: unitStatus(u), released: releasedUnit(u) })),
  kana: raw.kana.filter((k) => visible(k.id)).map(stamp),
  provenance: raw.provenance,
  destinations: dests, regions: spec.regions, route: spec.japan_exploration.route.order, map: { projection: spec.japan_exploration.map.projection, pin_states: spec.japan_exploration.map.pin_states, tokyo_cluster: spec.japan_exploration.map.tokyo_cluster },
  quest_types: spec.destination_quests.types, quest_defaults: spec.destination_quests.default_measurement,
  jlpt: { levels: spec.jlpt.levels.map((l) => ({ level: l.level, test_sections: l.test_sections, scoring_sections: l.scoring_sections, overall_pass_mark: l.overall_pass_mark, item_types: l.item_types, total_minutes_excluding_breaks: l.total_minutes_excluding_breaks, sources: l.sources, last_verified: l.last_verified, official_descriptor_paraphrase: l.official_descriptor_paraphrase })), official_facts_not_to_misstate: spec.jlpt.official_facts_not_to_misstate, sample_questions_url: spec.jlpt.official_practice_materials.sample_questions_url },
  mock_targets: spec.mock_examinations.targets, mock_blueprint: raw.blueprint,
  exercise_types: spec.exercise_types.map((e) => ({ id: e.id, name: e.name, skill: e.skill, scoring: e.scoring, browser_capability: e.browser_capability, fallback: e.fallback })),
  achievements: spec.gamification.achievements, sounds: spec.audio_system.sound_library.map((s) => ({ id: s.id, kind: s.kind, recipe: s.recipe, loop_seconds: s.loop_seconds || null, duration_ms: s.duration_ms || null })),
  limitations: spec.limitations.items, open_questions: spec.open_questions, sources: spec.source_register.map((s) => ({ id: s.id, tag: s.tag, url: s.url || s.source || null, title: s.title || s.name || null })),
  assets: raw.assets, coverage_targets: spec.content_coverage_plan.dimensions.curriculum_coverage.release_1_targets_new_items_per_level,
};
sizes.core = write('core.json', core);
const contentVersion = hash(Object.keys(files).sort().map((k) => `${k}:${files[k]}`).join('|')).slice(0, 10);
const index = { contentVersion, levels: Object.fromEntries(levels.map((L) => [L, { bundle: `${L}.json`, units_total: raw.curriculum.units.filter((u) => u.level === L).length, units_released: raw.curriculum.units.filter((u) => u.level === L && releasedUnit(u)).length }])), mocks, files };
write('index.json', index);
console.log(`content bundles: version ${contentVersion}; ${Object.entries(sizes).map(([k, v]) => `${k} ${(v / 1024).toFixed(1)} KB`).join(', ')}; mocks released ${mocks.length}`);
