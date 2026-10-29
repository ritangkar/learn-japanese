#!/usr/bin/env node
// Runs content validators A01-A16 and X01-X11. Exit code 1 on any failure. A07 is reported "not run" when no dictionary exists.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadContent, loadSpec, ROOT } from './lib/load-content.mjs';
import { runAll } from './lib/checks.mjs';

export function validate({ quiet = false, write = true } = {}) {
  const raw = loadContent();
  const spec = loadSpec();
  const schema = JSON.parse(readFileSync(join(ROOT, 'content/schemas/content.schema.json'), 'utf8'));
  const results = runAll(raw, { spec, schema, root: ROOT, dictionaryPath: join(ROOT, 'content/dictionary/build-dictionary.json') });
  const failed = results.filter((r) => r.status === 'fail');
  const notRun = results.filter((r) => r.status === 'not_run');
  if (!quiet) {
    for (const r of results) {
      const tag = r.status === 'pass' ? 'PASS   ' : r.status === 'fail' ? 'FAIL   ' : 'NOT RUN';
      console.log(`${tag} ${r.id.padEnd(4)} ${r.name}${r.note ? `\n        ${r.note}` : ''}`);
      for (const e of r.errors.slice(0, 25)) console.log(`        - [${e.item}] ${e.msg}`);
      if (r.errors.length > 25) console.log(`        ... ${r.errors.length - 25} more`);
    }
    console.log(`\nSUMMARY: ${results.filter((r) => r.status === 'pass').length} passed, ${failed.length} failed, ${notRun.length} not run (of ${results.length} checks)`);
  }
  if (write) {
    const cov = results.find((r) => r.id === 'A16')?.coverage;
    writeFileSync(join(ROOT, 'content/content-report.json'), `${JSON.stringify({ results: results.map((r) => ({ id: r.id, name: r.name, status: r.status, errors: r.errors.length, note: r.note || null })), coverage: cov }, null, 1)}\n`);
  }
  return { results, failed, notRun, raw };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { failed } = validate();
  process.exit(failed.length ? 1 : 0);
}
