// Single store. Engines are pure functions over snapshots; persistence happens here at the edge.
import { Storage, detectBackend } from './storage.js';
import { defaultSnapshot, defaultMeta, defaultSettings, defaultProgress, defaultConcepts, defaultAttempts, defaultExams, defaultJournal, validators, mergeDefaults, SRS_SHARD_SIZE, ATTEMPT_RING } from './defaults.js';
import { migrate, LATEST_SCHEMA } from './migrations.js';
import { clock } from './clock.js';

const DOMAINS = ['meta', 'settings', 'progress', 'concepts', 'attempts', 'exams', 'journal'];
const DEFAULTS = { meta: defaultMeta, settings: defaultSettings, progress: defaultProgress, concepts: defaultConcepts, attempts: defaultAttempts, exams: defaultExams, journal: defaultJournal };

function randomId() {
  const a = new Uint8Array(8);
  (globalThis.crypto || { getRandomValues: (x) => x.fill(7) }).getRandomValues(a);
  return [...a].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export class Store {
  /** @param {Storage} storage */
  constructor(storage) {
    this.storage = storage;
    this.state = defaultSnapshot(clock.now());
    this.listeners = new Set();
    this.dirty = new Set();
    this.dirtyShards = new Set();
    this.shardOf = {}; // facetKey -> shard index
    this.shardCount = 0;
    this.timer = null;
    this.notices = [];
    this.readOnlyRecovery = null;
    this.storage.compact = () => this.compact();
  }

  static create(opts = {}) {
    const { backend, persistent } = opts.backend ? { backend: opts.backend, persistent: opts.persistent ?? true } : detectBackend();
    const storage = new Storage(backend, { persistent, now: () => clock.now() });
    const store = new Store(storage);
    store.persistent = persistent;
    store.load();
    return store;
  }

  subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  emit() { for (const f of this.listeners) f(this.state); }
  get() { return this.state; }

  load() {
    const st = this.storage;
    const rec = st.recover();
    const snap = defaultSnapshot(clock.now());
    for (const d of DOMAINS) {
      const v = st.read(d, { validate: validators[d] });
      if (v) snap[d] = d === 'meta' ? v : mergeDefaults(DEFAULTS[d](), v);
    }
    // schema check before touching anything else
    if (st.readRaw('meta') !== null) {
      const mig = migrate({ meta: snap.meta });
      if (!mig.ok) {
        this.readOnlyRecovery = mig;
        this.notices.push({ type: 'migration_failed', detail: mig });
      } else if (mig.from !== mig.to) {
        this.preMigrateSnapshot(mig.from);
        snap.meta = mig.snapshot.meta;
        this.dirty.add('meta');
      }
    }
    // srs shards
    for (let i = 0; ; i++) {
      const raw = st.readRaw(`srs:${i}`);
      if (raw === null) break;
      const shard = st.read(`srs:${i}`, { validate: validators.srsShard, fallback: [] });
      this.shardCount = i + 1;
      for (const rec2 of shard) { snap.srs[rec2[0]] = rec2; this.shardOf[rec2[0]] = i; }
    }
    snap.examlive = st.read('examlive', { fallback: null });
    if (!snap.meta.installId) { snap.meta.installId = randomId(); this.dirty.add('meta'); }
    this.state = snap;
    this.notices.push(...st.notices);
    if (rec.recovered) this.notices.push({ type: 'recovered', ...rec });
    return this;
  }

  preMigrateSnapshot(fromVersion) {
    const dump = {};
    for (const k of this.storage.keys()) if (!k.startsWith('quarantine:') && !k.startsWith('premigrate:')) dump[k] = this.storage.readRaw(k);
    try { this.storage.write(`premigrate:v${fromVersion}`, dump); } catch { /* space: migration still proceeds; data is only changed in memory until flush */ }
  }

  /** Replace a domain (immutable update pattern). */
  setDomain(name, value) {
    this.state = { ...this.state, [name]: value };
    if (name === 'examlive') this.dirty.add('examlive'); else this.dirty.add(name);
    this.emit();
    this.schedule();
  }
  update(name, fn) { this.setDomain(name, fn(this.state[name])); }

  /** Upsert SRS facet records (arrays of 8). */
  putFacets(records) {
    const srs = { ...this.state.srs };
    for (const r of records) {
      srs[r[0]] = r;
      let sh = this.shardOf[r[0]];
      if (sh === undefined) {
        sh = Math.max(0, this.shardCount - 1);
        const used = Object.values(this.shardOf).filter((x) => x === sh).length;
        if (this.shardCount === 0 || used >= SRS_SHARD_SIZE) { sh = this.shardCount; this.shardCount++; }
        this.shardOf[r[0]] = sh;
      }
      this.dirtyShards.add(sh);
    }
    this.state = { ...this.state, srs };
    this.emit();
    this.schedule();
  }

  pushAttempts(list) {
    const a = this.state.attempts;
    const ring = a.ring.concat(list);
    const trimmed = ring.length > ATTEMPT_RING ? ring.slice(ring.length - ATTEMPT_RING) : ring;
    const counters = { total: a.counters.total + list.length, correct: a.counters.correct + list.filter((x) => x[3] === 1).length };
    this.setDomain('attempts', { ring: trimmed, counters });
  }

  schedule() {
    if (this.timer || typeof setTimeout === 'undefined') return;
    this.timer = setTimeout(() => { this.timer = null; this.flush(); }, 500);
  }

  buildShard(i) {
    return Object.keys(this.shardOf).filter((k) => this.shardOf[k] === i).sort().map((k) => this.state.srs[k]).filter(Boolean);
  }

  /** Persist all dirty domains/shards through a transaction. Throws StorageFullError after one compaction attempt. */
  flush() {
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    if (this.readOnlyRecovery) return false;
    const entries = {};
    for (const d of this.dirty) entries[d] = this.state[d];
    for (const i of this.dirtyShards) entries[`srs:${i}`] = this.buildShard(i);
    if (!Object.keys(entries).length) return true;
    this.storage.writeMany(entries);
    this.dirty.clear();
    this.dirtyShards.clear();
    return true;
  }

  /** Quota compaction: trim attempt ring and old exam summaries. Returns true if anything was freed. */
  compact() {
    const a = this.state.attempts;
    let freed = false;
    if (a.ring.length > 500) {
      this.state = { ...this.state, attempts: { ...a, ring: a.ring.slice(-500) } };
      this.dirty.add('attempts');
      freed = true;
      try { this.storage.write('attempts', this.state.attempts); } catch { /* still full */ }
    }
    return freed;
  }

  /** Complete in-memory snapshot as plain data for export. */
  snapshot() {
    const s = this.state;
    return { meta: s.meta, settings: s.settings, progress: s.progress, srs: Object.values(s.srs), concepts: s.concepts, attempts: s.attempts, exams: s.exams, journal: s.journal };
  }

  /** Replace everything from a validated snapshot (used by import). */
  replaceAll(snap) {
    const next = defaultSnapshot(clock.now());
    for (const d of DOMAINS) next[d] = mergeDefaults(DEFAULTS[d](), snap[d]);
    next.meta.schemaVersion = LATEST_SCHEMA;
    next.meta.installId = this.state.meta.installId || next.meta.installId;
    next.srs = {};
    const facets = (snap.srs || []).slice().sort((a, b) => (a[0] < b[0] ? -1 : 1));
    const oldShards = this.shardCount;
    this.shardOf = {};
    this.shardCount = 0;
    this.state = next;
    this.putFacets(facets);
    for (let i = this.shardCount; i < oldShards; i++) this.dirtyShards.add(i);
    for (const d of DOMAINS) this.dirty.add(d);
    this.dirty.add('examlive');
    this.state.examlive = null;
    this.flush();
    this.emit();
  }

  usage() { return { kb: this.storage.usageKB(), health: this.storage.health() }; }
}
export { DOMAINS };
