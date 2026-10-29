import { describe, it, expect, beforeEach } from 'vitest';
import { Storage, MemoryBackend, NS, LIMITS, StorageFullError } from '../../src/core/storage.js';
import { Store } from '../../src/core/store.js';
import { migrate } from '../../src/core/migrations.js';
import { clock } from '../../src/core/clock.js';

const mkStore = (backend = new MemoryBackend()) => { const s = new Store(new Storage(backend)); s.load(); return s; };

beforeEach(() => clock.setSource(() => 1_760_000_000_000));

describe('AC05 persistence in localStorage-compatible backend', () => {
  it('settings and progress survive a reload (new Store on same backend)', () => {
    const b = new MemoryBackend();
    const s1 = mkStore(b);
    s1.update('settings', (x) => ({ ...x, romajiMode: 'never', dailyCoreMinutes: 45 }));
    s1.update('progress', (x) => ({ ...x, lessons: { ...x.lessons, n5_u01_l1: { doneAt: 1, score: 0.9 } } }));
    s1.flush();
    const s2 = mkStore(b);
    expect(s2.get().settings.romajiMode).toBe('never');
    expect(s2.get().settings.dailyCoreMinutes).toBe(45);
    expect(s2.get().progress.lessons.n5_u01_l1.score).toBe(0.9);
    expect(s2.get().meta.installId).toBe(s1.get().meta.installId);
  });
  it('all keys are namespaced jla:v1:', () => {
    const b = new MemoryBackend();
    const s = mkStore(b); s.update('settings', (x) => ({ ...x })); s.flush();
    for (let i = 0; i < b.length; i++) expect(b.key(i).startsWith(NS)).toBe(true);
  });
});

describe('AC06 storage budget', () => {
  it('5000 facets + 3000 attempts <= 1 MB (UTF-16 counted)', () => {
    const b = new MemoryBackend();
    const s = mkStore(b);
    const facets = [];
    for (let i = 0; i < 5000; i++) facets.push([`v:n5_${String(i).padStart(4, '0')}:${['read', 'meaning', 'produce'][i % 3]}`, 20100 + (i % 90), 123456 % 9999, 543, 5 + (i % 7), i % 3, 20090 + (i % 40), 2]);
    s.putFacets(facets);
    const attempts = [];
    for (let i = 0; i < 3000; i++) attempts.push([29_400_000 + i, `n5u01_q${String(i % 400).padStart(3, '0')}`, 'r', i % 2, 2300 + i % 900]);
    s.pushAttempts(attempts);
    s.flush();
    const bytes = s.storage.usageBytes();
    expect(bytes).toBeLessThanOrEqual(1024 * 1024);
    expect(s.storage.health()).toBe('ok');
    // reload gives identical counts
    const s2 = mkStore(b);
    expect(Object.keys(s2.get().srs).length).toBe(5000);
    expect(s2.get().attempts.ring.length).toBe(3000);
    // shards of <= 500
    const shardKeys = b.map.size && [...b.map.keys()].filter((k) => /srs:\d+$/.test(k));
    expect(shardKeys.length).toBe(10);
    for (const k of shardKeys) expect(JSON.parse(b.getItem(k)).length).toBeLessThanOrEqual(500);
  });
  it('thresholds: warn 2500 KB, urgent 3500 KB', () => {
    expect(LIMITS.warnKB).toBe(2500); expect(LIMITS.urgentKB).toBe(3500); expect(LIMITS.budgetKB).toBe(1536);
    const b = new MemoryBackend();
    const st = new Storage(b);
    st.setRaw('big', 'x'.repeat(1_300_000)); // ~2539 KB UTF-16
    expect(st.health()).toBe('warn');
    st.setRaw('big2', 'x'.repeat(600_000));
    expect(st.health()).toBe('urgent');
  });
});

describe('AC07 corruption is quarantined, not deleted', () => {
  it('moves a corrupt value to quarantine, loads defaults, raises a notice', () => {
    const b = new MemoryBackend();
    b.setItem(`${NS}settings`, '{"audio": {broken');
    const s = mkStore(b);
    expect(s.get().settings.dailyCoreMinutes).toBe(30);
    const q = [...b.map.keys()].filter((k) => k.startsWith(`${NS}quarantine:settings:`));
    expect(q.length).toBe(1);
    expect(b.getItem(q[0])).toBe('{"audio": {broken');
    expect(s.notices.some((n) => n.type === 'quarantine' && n.key === 'settings')).toBe(true);
  });
  it('schema-invalid values are quarantined too', () => {
    const b = new MemoryBackend();
    b.setItem(`${NS}progress`, JSON.stringify({ nonsense: 1 }));
    const s = mkStore(b);
    expect(s.get().progress.currentDestination).toBe('tokyo');
    expect([...b.map.keys()].some((k) => k.startsWith(`${NS}quarantine:progress:`))).toBe(true);
  });
  it('corrupt SRS shard does not discard other shards', () => {
    const b = new MemoryBackend();
    b.setItem(`${NS}srs:0`, JSON.stringify([['a:x:read', 1, 2, 3, 4, 0, 1, 2]]));
    b.setItem(`${NS}srs:1`, 'not json');
    const s = mkStore(b);
    expect(s.get().srs['a:x:read']).toBeTruthy();
    expect([...b.map.keys()].some((k) => k.startsWith(`${NS}quarantine:srs:1:`))).toBe(true);
  });
});

describe('AC08 migrations', () => {
  const v1 = () => ({ meta: { schemaVersion: 1, createdAt: 5 }, settings: { a: 1 }, progress: { lessons: { l1: 1 } }, srs: [['k', 1, 2, 3, 4, 5, 6, 7]], journal: { stamps: { s: { d: 1 } } } });
  it('fixture v1 -> latest preserves all records', () => {
    const r = migrate(v1());
    expect(r.ok).toBe(true);
    expect(r.snapshot.progress.lessons.l1).toBe(1);
    expect(r.snapshot.srs).toHaveLength(1);
    expect(r.snapshot.journal.stamps.s.d).toBe(1);
  });
  it('multi-step chain with injected steps preserves records and bumps version', () => {
    const steps = [null, (s) => ({ ...s, settings: { ...s.settings, b: 2 } }), (s) => ({ ...s, extra: true })];
    const r = migrate(v1(), { steps, latest: 3 });
    expect(r.ok).toBe(true);
    expect(r.snapshot.meta.schemaVersion).toBe(3);
    expect(r.snapshot.settings).toEqual({ a: 1, b: 2 });
    expect(r.snapshot.progress.lessons.l1).toBe(1);
  });
  it('failed migration leaves input untouched and reports failure', () => {
    const input = v1();
    const copy = structuredClone(input);
    const steps = [null, (s) => { s.settings.a = 999; throw new Error('boom'); }];
    const r = migrate(input, { steps, latest: 2 });
    expect(r.ok).toBe(false);
    expect(input).toEqual(copy);
  });
  it('newer schema than the app is refused', () => {
    const r = migrate({ meta: { schemaVersion: 99 } });
    expect(r.ok).toBe(false); expect(r.error).toBe('newer_schema_than_app');
  });
  it('store with a newer stored schema stays read-only and keeps data', () => {
    const b = new MemoryBackend();
    b.setItem(`${NS}meta`, JSON.stringify({ schemaVersion: 99, createdAt: 1 }));
    b.setItem(`${NS}settings`, JSON.stringify({ audio: {}, marker: 'keep' }));
    const s = mkStore(b);
    expect(s.readOnlyRecovery.ok).toBe(false);
    s.update('settings', (x) => ({ ...x, changed: true }));
    s.flush();
    expect(JSON.parse(b.getItem(`${NS}settings`)).marker).toBe('keep');
    expect(JSON.parse(b.getItem(`${NS}settings`)).changed).toBeUndefined();
  });
});

describe('transaction marker and quota policy', () => {
  it('interrupted multi-key write is rolled back on boot', () => {
    const b = new MemoryBackend();
    const st = new Storage(b);
    st.write('a', { v: 1 }); st.write('b', { v: 1 });
    // simulate crash: marker with before-images written, one key applied, then process dies
    b.setItem(`${NS}txn`, JSON.stringify({ id: 1, keys: ['a', 'b'], before: { a: '{"v":1}', b: '{"v":1}' } }));
    b.setItem(`${NS}a`, '{"v":2}');
    const st2 = new Storage(b);
    const r = st2.recover();
    expect(r.action).toBe('rolled_back');
    expect(JSON.parse(b.getItem(`${NS}a`)).v).toBe(1);
    expect(b.getItem(`${NS}txn`)).toBeNull();
  });
  it('torn value without before-image is quarantined', () => {
    const b = new MemoryBackend();
    b.setItem(`${NS}txn`, JSON.stringify({ id: 1, keys: ['a'], before: null }));
    b.setItem(`${NS}a`, '{"v":');
    const st = new Storage(b);
    const r = st.recover();
    expect(r.quarantined).toEqual(['a']);
    expect([...b.map.keys()].some((k) => k.startsWith(`${NS}quarantine:a:`))).toBe(true);
  });
  it('QuotaExceeded: compact once, retry, then blocking prompt and in-memory state kept', () => {
    const b = new MemoryBackend(30000);
    const s = mkStore(b);
    s.pushAttempts(Array.from({ length: 900 }, (_, i) => [i, 'q', 'r', 1, 100]));
    let compactCalls = 0;
    const orig = s.compact.bind(s);
    s.storage.compact = () => { compactCalls++; return orig(); };
    s.update('journal', (j) => ({ ...j, xp: { ...j.xp, total: 5 } }));
    // fill backend so the next flush cannot fit even after compaction
    b.quotaChars = 100;
    expect(() => s.flush()).toThrow(StorageFullError);
    expect(compactCalls).toBe(1);
    expect(s.storage.notices.some((n) => n.type === 'storage_full' && n.blocking)).toBe(true);
    expect(s.get().journal.xp.total).toBe(5); // in-memory state not discarded
  });
  it('failed multi-key write rolls back to the before-images', () => {
    const b = new MemoryBackend();
    const st = new Storage(b);
    st.write('a', { v: 1 }); st.write('b', { v: 1 });
    const orig = b.setItem.bind(b);
    let n = 0;
    b.setItem = (k, v) => { if (k === `${NS}b` && n++ === 0) { const e = new Error('q'); e.name = 'QuotaExceededError'; throw e; } return orig(k, v); };
    expect(() => st.writeMany({ a: { v: 2 }, b: { v: 2 } })).toThrow();
    expect(JSON.parse(b.getItem(`${NS}a`)).v).toBe(1);
    expect(JSON.parse(b.getItem(`${NS}b`)).v).toBe(1);
    expect(b.getItem(`${NS}txn`)).toBeNull();
  });
});
