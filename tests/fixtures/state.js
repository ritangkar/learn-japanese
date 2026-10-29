// FIXTURE — not shipped, not counted. Synthetic learner states and content used only by unit tests.
import { defaultSnapshot } from '../../src/core/defaults.js';
import { makeContent } from '../../src/content/runtime.js';
import { newRecord, reviewRecord } from '../../src/engine/srs.js';
import { readFileSync } from 'node:fs';

export const FIXTURE_MARK = 'FIXTURE — not shipped, not counted';
export const DAY = 20000; // an arbitrary "today" (day number)
export const NOW = DAY * 86400000 + 12 * 3600000; // noon UTC of DAY
export const emptyState = () => defaultSnapshot(NOW);

/** Real built content (public/content/*.json) as a runtime model. */
export function realContent() {
  const rd = (f) => JSON.parse(readFileSync(new URL(`../../public/content/${f}`, import.meta.url), 'utf8'));
  return makeContent({ core: rd('core.json'), bundles: { N5: rd('N5.json') } });
}

/** Tiny synthetic curriculum + destinations to exercise the state machine without depending on authored content. */
export function fxContent({ unreleased = [] } = {}) {
  const unit = (id, level, order, lessons) => ({ id, level, order, title: id, lessons, content_status: unreleased.includes(id) ? 'to_be_authored' : 'auto_checked', released: !unreleased.includes(id) });
  const units = [unit('fx_u1', 'N5', 0, ['fx_l1', 'fx_l2']), unit('fx_u2', 'N5', 1, ['fx_l3']), unit('fx_u3', 'N4', 2, ['fx_l4'])];
  const lessons = ['fx_l1', 'fx_l2', 'fx_l3', 'fx_l4'].map((id) => ({ id, unit_id: id === 'fx_l3' ? 'fx_u2' : id === 'fx_l4' ? 'fx_u3' : 'fx_u1', title: id, introduces: { vocab: id === 'fx_l1' ? ['v_fx1', 'v_fx2'] : [] }, practice: {}, exit_check: {} }));
  const dest = (id, order, level, prereq, completion, tiers = []) => ({ id, order, name_en: id, first_visit_level: level, unlock: { level_unlocked: level, all_units_completed: prereq }, completion: { units_completed: completion, primary_quest_required: true, min_quest_accuracy: 0.8 }, quests: [{ id: `q_${id}`, type: 'QT_GREET', primary: true }], rewards: { stamp_id: `stamp_${id}`, postcard_id: `postcard_${id}`, xp: 100 }, revisit_tiers: tiers, parent_id: null });
  const destinations = [dest('fx_d1', 1, 'N5', [], ['fx_u1'], [{ level: 'N4', tier_id: 'fx_d1_n4', completion: {}, reward: {} }]), dest('fx_d2', 2, 'N5', ['fx_u1'], ['fx_u2']), dest('fx_d3', 3, 'N4', [], ['fx_u3'])];
  const quests = [{ id: 'fx_q1', destination_id: 'fx_d1', type: 'QT_GREET', question_ids: ['a'], min_accuracy: 0.8, unit_id: 'fx_u1' }, { id: 'fx_q2', destination_id: 'fx_d2', type: 'QT_GREET', question_ids: ['a'], min_accuracy: 0.8, unit_id: 'fx_u2' }, { id: 'fx_q3', destination_id: 'fx_d3', type: 'QT_GREET', question_ids: ['a'], min_accuracy: 0.8, unit_id: 'fx_u3' }];
  const core = { units, kana: [], destinations, regions: [], route: ['fx_d1', 'fx_d2', 'fx_d3'], jlpt: { levels: [] }, quest_types: [{ id: 'QT_GREET', name: 'Greetings' }] };
  const vocab = [{ id: 'v_fx1', surface: 'あ', reading_kana: 'あ', romaji: 'a', meanings_en: ['one'], unit_id: 'fx_u1', instructional_level: 'N5', destination_tags: [] }, { id: 'v_fx2', surface: 'い', reading_kana: 'い', romaji: 'i', meanings_en: ['two'], unit_id: 'fx_u1', instructional_level: 'N5', destination_tags: [] }];
  return makeContent({ core, bundles: { N5: { vocab, lessons: lessons.filter((l) => l.unit_id !== 'fx_u3'), quests: quests.filter((q) => q.unit_id !== 'fx_u3') }, N4: { lessons: lessons.filter((l) => l.unit_id === 'fx_u3'), quests: quests.filter((q) => q.unit_id === 'fx_u3') } } });
}

/** Add reviewed facets: n facets, all due `dueOffset` days from DAY. */
export function withDueFacets(state, n, dueOffset = 0, prefix = 'v_t') {
  const srs = { ...state.srs };
  for (let i = 0; i < n; i++) {
    const key = `${prefix}${String(i).padStart(3, '0')}:meaning`;
    let r = newRecord(key, DAY - 10);
    r = reviewRecord(r, 3, DAY - 10).record; // learning
    r = reviewRecord(r, 3, DAY - 9).record; // review
    const rec = [...r]; rec[1] = DAY + dueOffset; rec[6] = DAY - 5 - (i % 5);
    srs[key] = rec;
  }
  return { ...state, srs };
}
export const withStudyDays = (state, days) => ({ ...state, journal: { ...state.journal, studyDays: days } });
