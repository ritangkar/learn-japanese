// JSON backup/restore (spec backup_restore): jla-backup format with SHA-256 checksum, validation, preview, confirmation, rollback.
import { validators, defaultSnapshot, mergeDefaults, defaultSettings, defaultProgress, defaultConcepts, defaultAttempts, defaultExams, defaultJournal } from './defaults.js';
import { migrate, LATEST_SCHEMA } from './migrations.js';
import { clock, dayToDate } from './clock.js';

export const FORMAT = 'jla-backup';
export const FORMAT_VERSION = 1;
export const MAX_IMPORT_BYTES = 5 * 1024 * 1024;
export const APP_VERSION = '0.1.0';

/** Canonical JSON: keys sorted recursively so the checksum does not depend on property order. */
export function canonical(v) {
  if (Array.isArray(v)) return `[${v.map(canonical).join(',')}]`;
  if (v && typeof v === 'object') return `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${canonical(v[k])}`).join(',')}}`;
  return JSON.stringify(v);
}
export async function sha256Hex(text) {
  const buf = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function createBackup(store, { contentVersion = null } = {}) {
  const snap = store.snapshot();
  const meta = { ...snap.meta }; delete meta.installId; // the random install id is not exported
  const data = { meta, settings: snap.settings, progress: snap.progress, srs: snap.srs, concepts: snap.concepts, attempts: { ...snap.attempts, ring: snap.attempts.ring.slice(-3000) }, exams: snap.exams, journal: snap.journal };
  const exportedAt = new Date(clock.now()).toISOString();
  const checksumSha256 = await sha256Hex(canonical(data));
  const doc = { format: FORMAT, formatVersion: FORMAT_VERSION, appVersion: APP_VERSION, contentVersion, exportedAt, checksumSha256, data };
  const d = new Date(clock.now());
  const p2 = (n) => String(n).padStart(2, '0');
  const filename = `japan-journey-backup-${d.getFullYear()}${p2(d.getMonth() + 1)}${p2(d.getDate())}-${p2(d.getHours())}${p2(d.getMinutes())}.json`;
  return { filename, text: JSON.stringify(doc), doc };
}

const fail = (code, message) => ({ ok: false, code, message });

/** Parse and validate a backup file's text. Never touches the store. */
export async function parseBackup(text, { sizeBytes = text.length } = {}) {
  if (sizeBytes > MAX_IMPORT_BYTES) return fail('too_large', 'This file is larger than 5 MB, so it is not one of our backups.');
  let doc;
  try { doc = JSON.parse(text); } catch { return fail('not_json', 'This file is not valid JSON, so it cannot be a backup. Nothing was changed.'); }
  if (!doc || doc.format !== FORMAT) return fail('wrong_format', 'This is not a backup file from this app (format marker missing). Nothing was changed.');
  if (!Number.isInteger(doc.formatVersion)) return fail('bad_version', 'The backup has no valid format version. Nothing was changed.');
  if (doc.formatVersion > FORMAT_VERSION) return fail('newer_version', 'This backup was made by a newer version of the app. Update the app first. Nothing was changed.');
  if (!doc.data || typeof doc.data !== 'object') return fail('no_data', 'The backup has no data section. Nothing was changed.');
  const sum = await sha256Hex(canonical(doc.data));
  if (sum !== doc.checksumSha256) return fail('checksum', 'The checksum does not match: the file is damaged or was edited. Nothing was changed.');
  const d = doc.data;
  for (const k of ['settings', 'progress', 'concepts', 'attempts', 'exams', 'journal']) if (!validators[k](d[k])) return fail('invalid_domain', `The "${k}" section of the backup is not valid. Nothing was changed.`);
  if (!Array.isArray(d.srs) || !validators.srsShard(d.srs)) return fail('invalid_srs', 'The review (spaced repetition) data in the backup is not valid. Nothing was changed.');
  const meta = { ...(d.meta || {}), schemaVersion: d.meta?.schemaVersion ?? 1 };
  const mig = migrate({ meta, settings: d.settings, progress: d.progress });
  if (!mig.ok) return fail('migration', `The backup uses a data version this app cannot read (${mig.error}). Nothing was changed.`);
  return { ok: true, doc, preview: previewOf(doc) };
}

export function summarizeData(d) {
  const lastDays = [...(d.journal.studyDays || [])];
  return {
    unitsCompleted: Object.keys(d.progress.units || {}).length, lessonsCompleted: Object.keys(d.progress.lessons || {}).length,
    facets: Array.isArray(d.srs) ? d.srs.length : Object.keys(d.srs || {}).length, stamps: Object.keys(d.journal.stamps || {}).length, postcards: Object.keys(d.journal.postcards || {}).length,
    mockAttempts: (d.exams.attempts || []).filter((a) => a.kind === 'mock').length, xp: d.journal.xp?.total || 0, lastActivityDay: lastDays.length ? lastDays[lastDays.length - 1] : null,
  };
}
export function previewOf(doc) {
  const s = summarizeData(doc.data);
  return { exportedAt: doc.exportedAt, appVersion: doc.appVersion, contentVersion: doc.contentVersion, ...s, lastActivity: s.lastActivityDay === null ? null : dayToDate(s.lastActivityDay) };
}
export function currentSummary(store) { const s = store.snapshot(); return summarizeData(s); }

/** Ids in the backup that the current content does not know: kept and flagged, never deleted. */
export function orphanReport(doc, knownIds) {
  const ids = new Set();
  for (const r of doc.data.srs) ids.add(r[0].split(':')[0]);
  for (const l of Object.keys(doc.data.progress.lessons || {})) ids.add(l);
  const orphans = [...ids].filter((id) => !knownIds.has(id));
  return { count: orphans.length, sample: orphans.slice(0, 10) };
}

/**
 * Apply a validated backup. Snapshots current state first; on any failure restores it. Returns {ok, error?}.
 * `confirmed` must be true (the UI requires an explicit checkbox).
 */
export function applyBackup(store, doc, { confirmed }) {
  if (confirmed !== true) return { ok: false, error: 'Confirmation required before overwriting your progress.' };
  const before = structuredClone(store.snapshot());
  const data = doc.data;
  try {
    try { store.storage.write('preimport', before); } catch { /* no room for the safety copy: the in-memory copy is still used for rollback */ }
    const snap = {
      meta: mergeDefaults(defaultSnapshot(clock.now()).meta, { ...data.meta, schemaVersion: LATEST_SCHEMA, lastExportAt: doc.exportedAt ? Date.parse(doc.exportedAt) : null }),
      settings: mergeDefaults(defaultSettings(), data.settings), progress: mergeDefaults(defaultProgress(), data.progress), srs: data.srs, concepts: mergeDefaults(defaultConcepts(), data.concepts),
      attempts: mergeDefaults(defaultAttempts(), data.attempts), exams: mergeDefaults(defaultExams(), data.exams), journal: mergeDefaults(defaultJournal(), data.journal),
    };
    store.replaceAll(snap);
    // verify by reading back what was persisted
    const check = summarizeData({ ...store.snapshot() });
    const want = summarizeData(data);
    for (const k of ['lessonsCompleted', 'facets', 'stamps', 'xp']) if (check[k] !== want[k]) throw new Error(`verification failed for ${k}`);
    return { ok: true };
  } catch (e) {
    try { store.replaceAll(before); } catch { /* last resort: memory still holds `before` below */ }
    return { ok: false, error: `Restore failed and your previous progress was put back. (${e.message})` };
  }
}

export function markExported(store) { store.update('meta', (m) => ({ ...m, lastExportAt: clock.now(), studyDaysSinceExport: 0 })); store.flush(); }

/** Reminder rule: last export > 14 days ago, or 7+ study days since the last export. */
export function exportReminder(store, now) {
  const m = store.state.meta; const hasProgress = Object.keys(store.state.progress.lessons).length > 0;
  if (!hasProgress) return null;
  if (!m.lastExportAt) return 'never';
  if (now - m.lastExportAt > 14 * 86400000) return 'old';
  const days = store.state.journal.studyDays.filter((d) => d * 86400000 > m.lastExportAt).length;
  return days >= 7 ? 'many_days' : null;
}
