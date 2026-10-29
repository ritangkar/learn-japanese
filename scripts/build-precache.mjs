#!/usr/bin/env node
// Post-build: scans dist/, writes dist/precache-manifest.json and dist/sw.js (from src/pwa/sw.template.js).
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
if (!existsSync(dist)) { console.error('dist/ missing: run vite build first'); process.exit(1); }

function walk(d) {
  return readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
}
const SKIP = new Set(['sw.js', 'precache-manifest.json']);
// Lazy (non-core) content is cached on demand instead of at install time.
const isLazy = (rel) => /^content\/(N[1-4]\.json|mocks\/N[1-4]_)/.test(rel);
const entries = [];
let totalBytes = 0;
const all = [];
for (const f of walk(dist)) {
  const rel = relative(dist, f).split(sep).join('/');
  if (SKIP.has(rel)) continue;
  const buf = readFileSync(f);
  const rev = createHash('sha256').update(buf).digest('hex').slice(0, 16);
  all.push({ url: rel, rev, bytes: buf.length });
  if (isLazy(rel)) continue;
  entries.push({ url: rel, rev });
  totalBytes += buf.length;
}
entries.unshift({ url: './', rev: 'shell' });
entries.sort((a, b) => (a.url < b.url ? -1 : 1));
const build = createHash('sha256').update(entries.map((e) => `${e.url}:${e.rev}`).join('\n')).digest('hex').slice(0, 12);
const contentVersion = existsSync(join(dist, 'content/index.json')) ? JSON.parse(readFileSync(join(dist, 'content/index.json'), 'utf8')).contentVersion || '0' : '0';
const manifest = { build, contentVersion, generatedBy: 'scripts/build-precache.mjs', coreBytes: totalBytes, entries, lazy: all.filter((a) => isLazy(a.url)).map((a) => ({ url: a.url, bytes: a.bytes })) };
writeFileSync(join(dist, 'precache-manifest.json'), `${JSON.stringify(manifest, null, 1)}\n`);
const tpl = readFileSync(join(root, 'src/pwa/sw.template.js'), 'utf8');
const sw = tpl.replace('__BUILD__', build).replace('__CONTENT_VERSION__', String(contentVersion)).replace('/*__PRECACHE__*/ []', JSON.stringify(entries));
if (/__[A-Z_]+__/.test(sw)) { console.error('unreplaced template token in sw.js'); process.exit(1); }
writeFileSync(join(dist, 'sw.js'), sw);
console.log(`precache: ${entries.length} entries, ${(totalBytes / 1024).toFixed(1)} KB core, build ${build}; lazy files: ${manifest.lazy.length}`);
if (totalBytes > 8 * 1024 * 1024) { console.error('FAIL: core precache exceeds 8 MB'); process.exit(1); }
