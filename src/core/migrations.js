// Pure migrations vN -> vN+1 over a plain snapshot {meta, settings, progress, ...}. The registry is injectable for tests.
export const LATEST_SCHEMA = 1;

/** steps[n] migrates a snapshot from schema n to n+1. Release 1.0 is the first schema version, so the list is empty. */
export const MIGRATIONS = [];

/**
 * Migrate a snapshot. Never mutates `snapshot`; on failure returns {ok:false} and the input is untouched.
 * @returns {{ok:true, snapshot:object, from:number, to:number} | {ok:false, error:string, from:number, failedAt:number}}
 */
export function migrate(snapshot, { steps = MIGRATIONS, latest = LATEST_SCHEMA } = {}) {
  const from = Number(snapshot?.meta?.schemaVersion);
  if (!Number.isInteger(from) || from < 1) return { ok: false, error: 'missing_or_invalid_schema_version', from, failedAt: from };
  if (from > latest) return { ok: false, error: 'newer_schema_than_app', from, failedAt: from };
  let cur = structuredClone(snapshot);
  for (let v = from; v < latest; v++) {
    const step = steps[v];
    if (typeof step !== 'function') return { ok: false, error: `no_migration_from_${v}`, from, failedAt: v };
    try {
      const next = step(structuredClone(cur));
      next.meta = { ...next.meta, schemaVersion: v + 1 };
      cur = next;
    } catch (e) {
      return { ok: false, error: `migration_${v}_failed: ${e.message}`, from, failedAt: v };
    }
  }
  return { ok: true, snapshot: cur, from, to: latest };
}
