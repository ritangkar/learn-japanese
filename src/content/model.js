// Pure content model shared by build-time validators and the runtime loader (no DOM, no fetch, no Node APIs).
import { kanjiOf } from './romaji.js';

export const COLLECTIONS = ['kana', 'kanji', 'vocab', 'grammar', 'sentences', 'dialogues', 'passages', 'listening', 'questions', 'lessons', 'quests', 'mocks'];
export const STATUS_ORDER = { to_be_authored: -1, draft: 0, auto_checked: 1, human_reviewed: 2 };

export function emptyRaw() {
  const r = { curriculum: { units: [], unlock_next: {} }, status: {}, provenance: {}, blueprint: null, assets: [] };
  for (const c of COLLECTIONS) r[c] = [];
  return r;
}

/** Resolve a provenance reference (profile id string or object) to an object. */
export function resolveProvenance(p, profiles) {
  return typeof p === 'string' ? (profiles[p] ? { ...profiles[p], profile: p } : null) : p;
}

export function statusOf(raw, id) { return raw.status[id]?.status || 'draft'; }
export function isVisibleStatus(s) { return STATUS_ORDER[s] >= STATUS_ORDER.auto_checked; }

/** Build lookup indexes over a raw content set. */
export function buildIndex(raw) {
  const idx = { byId: new Map(), kind: new Map(), unitOrder: new Map(), unitLevel: new Map(), units: new Map() };
  for (const u of raw.curriculum.units) { idx.unitOrder.set(u.id, u.order); idx.unitLevel.set(u.id, u.level); idx.units.set(u.id, u); }
  for (const c of COLLECTIONS) for (const it of raw[c]) { if (!idx.byId.has(it.id)) { idx.byId.set(it.id, it); idx.kind.set(it.id, c); } }
  idx.get = (id) => idx.byId.get(id);
  idx.order = (unitId) => idx.unitOrder.get(unitId);
  /** Kanji characters introduced up to and including unit `unitId`. */
  const cache = new Map();
  idx.introducedKanji = (unitId) => {
    if (cache.has(unitId)) return cache.get(unitId);
    const ord = idx.order(unitId);
    const set = new Set(raw.kanji.filter((k) => idx.order(k.unit_id) <= ord).map((k) => k.char));
    cache.set(unitId, set);
    return set;
  };
  return idx;
}

/** Substrings of `text` covered by the ruby map (character positions). */
export function rubyCovered(text, ruby) {
  const covered = new Array(text.length).fill(false);
  for (const key of Object.keys(ruby || {})) {
    let from = 0;
    for (;;) { const i = text.indexOf(key, from); if (i < 0) break; for (let j = i; j < i + key.length; j++) covered[j] = true; from = i + 1; }
  }
  return covered;
}

/** Kanji in `text` that are neither introduced nor covered by ruby. */
export function ungatedKanji(text, ruby, introduced) {
  const covered = rubyCovered(text, ruby);
  const bad = [];
  [...text].forEach((ch, i) => { if (kanjiOf(ch).length && !introduced.has(ch) && !covered[i]) bad.push(ch); });
  return bad;
}

/**
 * Split text into [base, reading|null] segments using the ruby map, honouring longest matches.
 * `known` = set of kanji the learner has already been introduced to: ruby is hidden when every kanji in the key is known.
 */
export function rubySegments(text, ruby, known = new Set(), showAll = false) {
  const keys = Object.keys(ruby || {}).sort((a, b) => b.length - a.length);
  const segs = [];
  let buf = '';
  for (let i = 0; i < text.length;) {
    const key = keys.find((k) => text.startsWith(k, i));
    if (key) {
      if (buf) { segs.push([buf, null]); buf = ''; }
      const allKnown = kanjiOf(key).every((c) => known.has(c));
      segs.push([key, showAll || !allKnown ? ruby[key] : null]);
      i += key.length;
    } else { buf += text[i]; i++; }
  }
  if (buf) segs.push([buf, null]);
  return segs;
}

/** Number of morae in a kana string (small ゃゅょ combine with the previous kana; っ and ん and ー count one each). */
export function moraCount(kana) { return [...kana].filter((c) => !/[ゃゅょャュョぁぃぅぇぉァィゥェォ]/.test(c) && /[ぁ-ゖァ-ヺー]/.test(c)).length; }

/** Estimated seconds for TTS of a reading at a rate (7.5 morae/s at rate 1.0 is a planning assumption). */
export function estimateSeconds(kana, rate = 0.5) { return moraCount(kana) / (7.5 * rate); }
export const MAX_CHUNK_SECONDS = 12;

/** Resolve the effective status of every item and the min status of a unit. */
export function unitStatus(raw, idx, unitId) {
  const u = idx.units.get(unitId);
  if (!u || u.content_status === 'to_be_authored') return 'to_be_authored';
  let min = STATUS_ORDER.human_reviewed;
  let any = false;
  for (const c of COLLECTIONS) {
    if (c === 'mocks' || c === 'kana' && false) continue;
    for (const it of raw[c]) if (it.unit_id === unitId) { any = true; min = Math.min(min, STATUS_ORDER[statusOf(raw, it.id)]); }
  }
  if (!any) return 'to_be_authored';
  return Object.keys(STATUS_ORDER).find((k) => STATUS_ORDER[k] === min);
}
