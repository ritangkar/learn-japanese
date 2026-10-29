import { LATEST_SCHEMA } from './migrations.js';

export const SRS_SHARD_SIZE = 500;
export const ATTEMPT_RING = 3000;
export const EXAM_HISTORY_MAX = 200;

export function defaultMeta(now = Date.now()) {
  return { schemaVersion: LATEST_SCHEMA, createdAt: now, lastExportAt: null, installId: null, contentVersionSeen: null, studyDaysSinceExport: 0, tourDone: false };
}

export function defaultSettings() {
  return {
    dailyCoreMinutes: 30, maxSessionMinutes: 60, targetLevel: 'N5', targetExamDate: null, romajiMode: 'fade', gamification: 'full',
    retentionTarget: 0.9, newWordsPerSession: 6, weeklyGoalDays: 4, extendedTime: false, reducedMotion: 'system', theme: 'system', textScale: 1,
    confidenceCapture: false,
    audio: { master: 0.8, masterMuted: false, ambience: { enabled: false, volume: 0.25 }, learning: { volume: 1, rate: 0.9, voiceURI: null, showText: true }, effects: { enabled: true, volume: 0.5 }, silentStudy: false, autoplay: 'off', resumeAmbienceId: null },
  };
}

export function defaultProgress() {
  return {
    lessons: {}, // lessonId -> {doneAt, score}
    units: {}, // unitId -> {completedAt}
    levels: { N5: 'unlocked', N4: 'locked', N3: 'locked', N2: 'locked', N1: 'locked' },
    levelEvidence: {}, // level -> {readinessPassedAt, readinessScore, milestoneBest}
    destinations: {}, // destId -> {state, quests:{questId:{best,doneAt}}, tiers:{tierId:{best,doneAt}}, startedAt}
    currentDestination: 'tokyo',
    introduced: { kana: [], vocab: [], kanji: [], grammar: [] },
    selfReported: [], // {examDate, level, result, notes}
  };
}

export function defaultConcepts() { return { confusions: {}, leech: {}, parked: {}, lastSeen: {} }; }
export function defaultAttempts() { return { ring: [], counters: { total: 0, correct: 0 } }; }
export function defaultExams() { return { attempts: [] }; }
export function defaultJournal() {
  return { stamps: {}, postcards: {}, achievements: {}, rewards: {}, xp: { total: 0, byDay: {} }, studyDays: [], activeMinutes: {}, milestones: {}, cultural: {}, graceUsed: [], comebackDone: [] };
}

export function defaultSnapshot(now = Date.now()) {
  return { meta: defaultMeta(now), settings: defaultSettings(), progress: defaultProgress(), srs: {}, concepts: defaultConcepts(), attempts: defaultAttempts(), exams: defaultExams(), examlive: null, journal: defaultJournal() };
}

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
export const validators = {
  meta: (v) => isObj(v) && Number.isInteger(v.schemaVersion),
  settings: (v) => isObj(v) && isObj(v.audio),
  progress: (v) => isObj(v) && isObj(v.lessons) && isObj(v.levels) && isObj(v.destinations),
  concepts: (v) => isObj(v),
  attempts: (v) => isObj(v) && Array.isArray(v.ring),
  exams: (v) => isObj(v) && Array.isArray(v.attempts),
  journal: (v) => isObj(v) && isObj(v.stamps) && isObj(v.xp),
  srsShard: (v) => Array.isArray(v) && v.every((r) => Array.isArray(r) && r.length === 8 && typeof r[0] === 'string'),
};

/** Merge a loaded domain onto defaults so older/partial records gain new fields without losing data. */
export function mergeDefaults(def, v) {
  if (Array.isArray(def) || !isObj(def) || !isObj(v)) return v === undefined ? def : v;
  const out = { ...v };
  for (const k of Object.keys(def)) out[k] = k in v ? mergeDefaults(def[k], v[k]) : structuredClone(def[k]);
  return out;
}
