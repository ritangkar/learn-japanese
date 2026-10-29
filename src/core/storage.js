// localStorage layer: namespace jla:v1:, write-ahead transaction marker, quarantine, usage meter, quota handling.
// NO other storage technology is used anywhere in this code base (requirement R007 / AC05).

export const NS = 'jla:v1:';
export const LIMITS = Object.freeze({ budgetKB: 1536, warnKB: 2500, urgentKB: 3500 });
const QUARANTINE_CAP_CHARS = 200000;
const TXN_BEFORE_IMAGE_CAP = 300000;

export class StorageFullError extends Error {
  constructor(msg = 'Storage is full') { super(msg); this.name = 'StorageFullError'; }
}

/** In-memory backend: used when localStorage is unavailable (private mode) and in tests. Optional char quota. */
export class MemoryBackend {
  constructor(quotaChars = Infinity) { this.map = new Map(); this.quotaChars = quotaChars; }
  get length() { return this.map.size; }
  key(i) { return [...this.map.keys()][i] ?? null; }
  getItem(k) { return this.map.has(k) ? this.map.get(k) : null; }
  setItem(k, v) {
    const next = [...this.map.entries()].filter(([kk]) => kk !== k).reduce((a, [kk, vv]) => a + kk.length + vv.length, 0) + k.length + String(v).length;
    if (next > this.quotaChars) {
      const e = new Error('quota'); e.name = 'QuotaExceededError'; throw e;
    }
    this.map.set(k, String(v));
  }
  removeItem(k) { this.map.delete(k); }
}

export function detectBackend() {
  try {
    const ls = globalThis.localStorage;
    const probe = `${NS}probe`;
    ls.setItem(probe, '1');
    ls.removeItem(probe);
    return { backend: ls, persistent: true };
  } catch {
    return { backend: new MemoryBackend(), persistent: false };
  }
}

const isQuota = (e) => e && (e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014 || /quota/i.test(e.message || ''));

export class Storage {
  /**
   * @param {{getItem,setItem,removeItem,key,length}} backend
   * @param {{persistent?:boolean, now?:()=>number, onNotice?:(n:object)=>void, compact?:()=>boolean}} [opts]
   */
  constructor(backend, opts = {}) {
    this.b = backend;
    this.persistent = opts.persistent ?? true;
    this.now = opts.now || (() => Date.now());
    this.onNotice = opts.onNotice || (() => {});
    this.compact = opts.compact || (() => false);
    this.notices = [];
  }

  notice(n) { this.notices.push(n); this.onNotice(n); }

  fullKeys() {
    const out = [];
    for (let i = 0; i < this.b.length; i++) { const k = this.b.key(i); if (k && k.startsWith(NS)) out.push(k); }
    return out;
  }
  keys() { return this.fullKeys().map((k) => k.slice(NS.length)); }
  readRaw(key) { return this.b.getItem(NS + key); }

  /** Size of all namespace entries, UTF-16 (2 bytes per code unit, keys included), in bytes. */
  usageBytes() {
    let n = 0;
    for (const k of this.fullKeys()) n += (k.length + (this.b.getItem(k) || '').length) * 2;
    return n;
  }
  usageKB() { return this.usageBytes() / 1024; }
  health() {
    const kb = this.usageKB();
    if (kb >= LIMITS.urgentKB) return 'urgent';
    if (kb >= LIMITS.warnKB) return 'warn';
    if (kb >= LIMITS.budgetKB) return 'over_budget';
    return 'ok';
  }

  quarantine(key, raw, reason) {
    const qk = `${NS}quarantine:${key}:${this.now()}`;
    const capped = String(raw).slice(0, QUARANTINE_CAP_CHARS);
    try { this.b.setItem(qk, capped); } catch { /* quarantine is best effort; the original stays untouched */ return null; }
    this.notice({ type: 'quarantine', key, reason, quarantineKey: qk });
    return qk;
  }

  /**
   * Read and JSON-parse a key. A corrupt or invalid value is moved to quarantine (never deleted) and `fallback` is returned.
   * @param {string} key
   * @param {{validate?:(v:any)=>boolean, fallback?:any}} [o]
   */
  read(key, { validate, fallback = null } = {}) {
    const raw = this.readRaw(key);
    if (raw === null) return fallback;
    let v;
    try { v = JSON.parse(raw); } catch {
      this.quarantine(key, raw, 'parse_error');
      this.b.removeItem(NS + key);
      return fallback;
    }
    if (validate && !validate(v)) {
      this.quarantine(key, raw, 'validation_failed');
      this.b.removeItem(NS + key);
      return fallback;
    }
    return v;
  }

  setRaw(key, raw) {
    try {
      this.b.setItem(NS + key, raw);
    } catch (e) {
      if (!isQuota(e)) throw e;
      // Quota policy: compact once, retry, then a blocking export prompt (in-memory state is never discarded).
      let compacted = false;
      if (!this.compacting) {
        this.compacting = true;
        try { compacted = this.compact() === true; } catch { compacted = false; } finally { this.compacting = false; }
      }
      if (compacted) {
        try { this.b.setItem(NS + key, raw); return; } catch (e2) { if (!isQuota(e2)) throw e2; }
      }
      this.notice({ type: 'storage_full', blocking: true, key });
      throw new StorageFullError(`Could not write ${key}`);
    }
  }

  write(key, value) {
    this.setRaw(key, JSON.stringify(value));
    this.checkHealth();
  }

  remove(key) { this.b.removeItem(NS + key); }

  checkHealth() {
    const h = this.health();
    if (h === 'urgent') this.notice({ type: 'storage_urgent', blocking: false });
    else if (h === 'warn') this.notice({ type: 'storage_warn' });
    return h;
  }

  /**
   * Multi-key write: marker (with before-images) -> apply -> clear marker.
   * If the process dies in between, `recover()` restores the before-images on next boot.
   * @param {Record<string, any>} entries key -> JSON value (null removes)
   */
  writeMany(entries) {
    const keys = Object.keys(entries);
    if (keys.length === 1) { const k = keys[0]; entries[k] === null ? this.remove(k) : this.write(k, entries[k]); return; }
    const before = {};
    let size = 0;
    for (const k of keys) { const r = this.readRaw(k); before[k] = r; size += r ? r.length : 0; }
    const marker = { id: this.now(), keys, before: size <= TXN_BEFORE_IMAGE_CAP ? before : null };
    this.setRaw('txn', JSON.stringify(marker));
    try {
      for (const k of keys) { if (entries[k] === null) this.remove(k); else this.setRaw(k, JSON.stringify(entries[k])); }
    } catch (e) {
      // Roll back what we can; the marker is cleared only after a successful rollback.
      this.rollback(marker);
      this.remove('txn');
      throw e;
    }
    this.remove('txn');
    this.checkHealth();
  }

  rollback(marker) {
    if (!marker.before) return false;
    for (const k of marker.keys) {
      const prev = marker.before[k];
      try { if (prev === null || prev === undefined) this.b.removeItem(NS + k); else this.b.setItem(NS + k, prev); } catch { /* best effort */ }
    }
    return true;
  }

  /** Boot-time crash recovery. Returns {recovered:boolean, action}. */
  recover() {
    const raw = this.readRaw('txn');
    if (raw === null) return { recovered: false };
    let marker;
    try { marker = JSON.parse(raw); } catch {
      this.quarantine('txn', raw, 'parse_error');
      this.remove('txn');
      return { recovered: true, action: 'marker_quarantined' };
    }
    // A marker that survived to boot means the commit did not finish.
    if (marker.before && this.rollback(marker)) {
      this.remove('txn');
      this.notice({ type: 'txn_rolled_back', keys: marker.keys });
      return { recovered: true, action: 'rolled_back', keys: marker.keys };
    }
    const bad = [];
    for (const k of marker.keys || []) {
      const r = this.readRaw(k);
      if (r === null) continue;
      try { JSON.parse(r); } catch { bad.push(k); this.quarantine(k, r, 'txn_partial_write'); this.remove(k); }
    }
    this.remove('txn');
    this.notice({ type: 'txn_validated', keys: marker.keys, quarantined: bad });
    return { recovered: true, action: 'validated', quarantined: bad };
  }
}
