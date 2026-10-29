import { describe, it, expect, beforeEach } from 'vitest';
import { Storage, MemoryBackend } from '../../src/core/storage.js';
import { Store } from '../../src/core/store.js';
import { createBackup, parseBackup, applyBackup, canonical, sha256Hex, orphanReport, exportReminder, currentSummary } from '../../src/core/backup.js';
import { clock } from '../../src/core/clock.js';
import { newRecord } from '../../src/engine/srs.js';

const mk = () => { const s = new Store(new Storage(new MemoryBackend())); s.load(); return s; };
const populate = (s) => {
  s.update('progress', (p) => ({ ...p, lessons: { n5_u01_l1: { doneAt: 5, score: 0.9, count: 1 }, n5_u01_l2: { doneAt: 6, score: 1, count: 1 } }, units: { n5_u01: { completedAt: 6 } } }));
  s.update('journal', (j) => ({ ...j, stamps: { stamp_tokyo: { destination: 'tokyo', day: 6 } }, postcards: { postcard_tokyo: { destination: 'tokyo', day: 6 } }, xp: { total: 140, byDay: {} }, studyDays: [4, 5, 6] }));
  s.update('settings', (x) => ({ ...x, romajiMode: 'never' }));
  s.putFacets([newRecord('v_neko:meaning', 6), newRecord('ka_h_a:read', 6)]);
  s.pushAttempts([[1, 'v_neko', 'm', 1, 900, 'mcq', 0]]);
  s.flush();
};
beforeEach(() => clock.setSource(() => 1_760_000_000_000));

describe('backup export/import (AC09, R008)', () => {
  it('export -> clean profile -> import reproduces progress', async () => {
    const a = mk(); populate(a);
    const { text } = await createBackup(a, { contentVersion: 'abc' });
    const b = mk();
    const parsed = await parseBackup(text);
    expect(parsed.ok).toBe(true);
    expect(parsed.preview).toMatchObject({ lessonsCompleted: 2, unitsCompleted: 1, facets: 2, stamps: 1, xp: 140, contentVersion: 'abc' });
    const r = applyBackup(b, parsed.doc, { confirmed: true });
    expect(r.ok).toBe(true);
    expect(b.get().progress.lessons).toEqual(a.get().progress.lessons);
    expect(b.get().journal.stamps).toEqual(a.get().journal.stamps);
    expect(Object.keys(b.get().srs).sort()).toEqual(Object.keys(a.get().srs).sort());
    expect(b.get().settings.romajiMode).toBe('never');
    expect(b.get().attempts.ring).toEqual(a.get().attempts.ring);
    // and it persisted: a third store loading the same backend sees it
    const c = new Store(b.storage); c.load();
    expect(c.get().progress.lessons.n5_u01_l2.score).toBe(1);
  });
  it('requires explicit confirmation to overwrite', async () => {
    const a = mk(); populate(a); const { text } = await createBackup(a); const b = mk();
    const p = await parseBackup(text);
    expect(applyBackup(b, p.doc, { confirmed: false }).ok).toBe(false);
    expect(applyBackup(b, p.doc, {}).ok).toBe(false);
    expect(Object.keys(b.get().progress.lessons)).toEqual([]);
  });
  it('the random install id is not exported and the existing one is kept on import', async () => {
    const a = mk(); populate(a); const { text, doc } = await createBackup(a);
    expect(doc.data.meta.installId).toBeUndefined(); expect(text).not.toContain(a.get().meta.installId);
    const b = mk(); const id = b.get().meta.installId; applyBackup(b, (await parseBackup(text)).doc, { confirmed: true });
    expect(b.get().meta.installId).toBe(id);
  });
  it('checksum is over the canonical payload (property order does not matter)', async () => {
    expect(canonical({ b: 1, a: [2, { d: 1, c: 2 }] })).toBe('{"a":[2,{"c":2,"d":1}],"b":1}');
    expect(await sha256Hex('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });
  describe('invalid files leave existing data untouched (AC09, journey H)', () => {
    const cases = [
      ['not JSON', () => '{ this is not json', 'not_json'],
      ['wrong format marker', () => JSON.stringify({ format: 'something-else', formatVersion: 1, data: {} }), 'wrong_format'],
      ['newer format version', () => JSON.stringify({ format: 'jla-backup', formatVersion: 99, data: {} }), 'newer_version'],
      ['missing data', () => JSON.stringify({ format: 'jla-backup', formatVersion: 1 }), 'no_data'],
      ['checksum mismatch (edited file)', async (text) => { const d = JSON.parse(text); d.data.journal.xp.total = 999999; return JSON.stringify(d); }, 'checksum'],
      ['truncated file', (text) => text.slice(0, text.length / 2), 'not_json'],
      ['array instead of object', () => '[1,2,3]', 'wrong_format'],
      ['empty file', () => '', 'not_json'],
    ];
    for (const [name, mutate, code] of cases) {
      it(name, async () => {
        const a = mk(); populate(a); const { text } = await createBackup(a);
        const target = mk(); populate(target); const before = JSON.stringify(target.snapshot());
        const bad = await mutate(text);
        const r = await parseBackup(bad);
        expect(r.ok).toBe(false); expect(r.code).toBe(code); expect(r.message).toMatch(/Nothing was changed|not one of our backups|not valid JSON/i);
        expect(JSON.stringify(target.snapshot())).toBe(before);
      });
    }
    it('invalid domain with a valid checksum is refused', async () => {
      const a = mk(); populate(a); const { doc } = await createBackup(a);
      doc.data.progress = { nonsense: true }; doc.checksumSha256 = await sha256Hex(canonical(doc.data));
      const r = await parseBackup(JSON.stringify(doc)); expect(r.ok).toBe(false); expect(r.code).toBe('invalid_domain');
    });
    it('files over 5 MB are refused before parsing', async () => {
      const r = await parseBackup('{}', { sizeBytes: 6 * 1024 * 1024 }); expect(r.code).toBe('too_large');
    });
  });
  it('a failure while applying rolls back to the previous progress', async () => {
    const a = mk(); populate(a); const { text } = await createBackup(a);
    const target = mk(); target.update('progress', (p) => ({ ...p, lessons: { keep_me: { doneAt: 1, score: 1, count: 1 } } })); target.flush();
    const parsed = await parseBackup(text);
    const orig = target.replaceAll.bind(target); let n = 0;
    target.replaceAll = (snap) => { if (n++ === 0) { orig(snap); throw new Error('simulated write failure'); } return orig(snap); };
    const r = applyBackup(target, parsed.doc, { confirmed: true });
    expect(r.ok).toBe(false); expect(r.error).toMatch(/previous progress was put back/);
    expect(Object.keys(target.get().progress.lessons)).toEqual(['keep_me']);
  });
  it('orphan ids are reported, never dropped', async () => {
    const a = mk(); populate(a); const { doc } = await createBackup(a);
    const rep = orphanReport(doc, new Set(['v_neko', 'ka_h_a'])); expect(rep.count).toBe(2); // two lesson ids unknown to this content
    const b = mk(); applyBackup(b, doc, { confirmed: true }); expect(Object.keys(b.get().progress.lessons)).toHaveLength(2);
  });
  it('backup reminders: never exported, > 14 days, or 7+ study days since export', () => {
    const s = mk(); expect(exportReminder(s, clock.now())).toBeNull(); // no progress yet
    populate(s); expect(exportReminder(s, clock.now())).toBe('never');
    s.update('meta', (m) => ({ ...m, lastExportAt: clock.now() - 15 * 86400000 })); expect(exportReminder(s, clock.now())).toBe('old');
    s.update('meta', (m) => ({ ...m, lastExportAt: clock.now() - 2 * 86400000 })); expect(exportReminder(s, clock.now())).toBeNull();
    const today = Math.floor(clock.now() / 86400000);
    s.update('meta', (m) => ({ ...m, lastExportAt: clock.now() - 13 * 86400000 }));
    s.update('journal', (j) => ({ ...j, studyDays: Array.from({ length: 8 }, (_, i) => today - 11 + i) }));
    expect(exportReminder(s, clock.now())).toBe('many_days');
    expect(currentSummary(s).facets).toBe(2);
  });
});
