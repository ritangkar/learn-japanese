import { describe, it, expect } from 'vitest';
import { loadSpec } from '../../scripts/lib/load-content.mjs';
import { PARAMS } from '../../src/engine/params.js';
import { LATEST_SCHEMA } from '../../src/core/migrations.js';
import { LIMITS } from '../../src/core/storage.js';

const spec = loadSpec();
describe('engine parameters equal the JSON spec (source of truth)', () => {
  const p = spec.learning_engine.parameters;
  it('learning_engine.parameters', () => {
    expect(PARAMS.review_cards_per_core_session_cap).toBe(p.review_cards_per_core_session_cap);
    expect(PARAMS.avg_seconds_per_review_card).toBe(p.avg_seconds_per_review_card);
    expect(PARAMS.new_words_per_session_default).toBe(p.new_words_per_session_default);
    expect(PARAMS.new_grammar_per_session_default).toBe(p.new_grammar_per_session_default);
    expect(PARAMS.backlog_mode_threshold_ratio).toBe(p.backlog_mode_threshold_ratio);
    expect(PARAMS.new_material_gate).toEqual(p.new_material_gate);
    expect(PARAMS.confusion_trigger).toEqual(p.confusion_trigger);
    expect(PARAMS.modality_gap_trigger).toEqual(p.modality_gap_trigger);
    expect(PARAMS.construction_gap_trigger).toEqual(p.construction_gap_trigger);
    expect(PARAMS.leech_lapses).toBe(p.leech_lapses);
    expect(PARAMS.exam_proximity_share).toEqual(p.exam_proximity_share);
  });
  it('time budget, daily minutes bounds, retention, session cap', () => {
    const tb = spec.learning_engine.time_budget_30_min_default;
    expect(PARAMS.time_budget_30).toEqual({ review: tb.review, new_material: tb.new_material, guided_practice: tb.guided_practice, listening_or_reading: tb.listening_or_reading, destination_quest: tb.destination_quest });
    expect([...PARAMS.daily_minutes_bounds]).toEqual(spec.learning_engine.daily_minutes_recommendation.bounds);
    expect(PARAMS.target_retention.default).toBe(spec.spaced_repetition.target_retention.default);
    expect(PARAMS.review_cards_max_session).toBe(spec.spaced_repetition.daily_caps.reviews_max_session);
  });
  it('mastery thresholds and speech presets', () => {
    expect(PARAMS.speech_rates).toEqual({ normal: spec.audio_system.learning_audio.rates.normal, slow: spec.audio_system.learning_audio.rates.slow, very_slow: spec.audio_system.learning_audio.rates.very_slow });
  });
  it('storage thresholds follow the owner decision (and the JSON local_storage.thresholds)', () => {
    expect(LIMITS.warnKB).toBe(spec.local_storage.thresholds.warn_kb);
    expect(LIMITS.urgentKB).toBe(spec.local_storage.thresholds.urgent_kb);
    expect(LIMITS.budgetKB).toBe(1536);
    expect(PARAMS.storage.budget_kb).toBe(1536);
    expect(LATEST_SCHEMA).toBe(1);
  });
  it('level unlock thresholds follow the owner reconciliation decision', () => {
    const c = spec.jlpt.level_unlock_model.criteria_per_level;
    expect(PARAMS.level_unlock.released_units_completed_pct).toBe(c.curriculum_released_units_completed_pct);
    expect(PARAMS.level_unlock.mastery_avg_min).toBe(c.internal_mastery_avg_min);
    expect(PARAMS.level_unlock.readiness_questions).toBe(40);
    expect(PARAMS.level_unlock.readiness_pass).toBe(0.7);
    expect(PARAMS.level_unlock.readiness_group_min).toBe(0.5);
    expect(PARAMS.level_unlock.milestone_pass).toBe(0.65);
  });
  it('extension blocks sum to the 60-minute session', () => {
    expect(PARAMS.extension_blocks.map(([, m]) => m)).toEqual([10, 5, 10, 5]);
  });
});
