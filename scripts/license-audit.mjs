#!/usr/bin/env node
// Licence / provenance audit (AC27, AC39). Fails the build on:
//  - runtime dependencies in package.json
//  - IndexedDB / Workbox / remote origins in shipped source
//  - audio, font or image files in dist that are not listed in content/assets.manifest.json
//  - manifest entries without an allowed licence, creator or source
//  - content marked human_reviewed without a named reviewer and date
// `--manifest <file>` and `--dist <dir>` allow the negative test fixtures to be audited.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (name, dflt) => { const i = process.argv.indexOf(name); return i > -1 ? process.argv[i + 1] : dflt; };
const manifestPath = arg('--manifest', join(root, 'content/assets.manifest.json'));
const distDir = arg('--dist', join(root, 'dist'));
const srcDir = arg('--src', join(root, 'src'));

export const ALLOWED_LICENSES = ['CC0-1.0', 'CC-BY-4.0', 'MIT', 'OFL-1.1', 'owner-produced', 'generated-original'];
const MEDIA = new Set(['.mp3', '.ogg', '.wav', '.m4a', '.aac', '.flac', '.opus', '.webm', '.woff', '.woff2', '.ttf', '.otf', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.mp4']);
const problems = [];
const fail = (m) => problems.push(m);

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const n of readdirSync(dir)) { const p = join(dir, n); statSync(p).isDirectory() ? walk(p, out) : out.push(p); }
  return out;
}

// 1. zero runtime dependencies
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
if (pkg.dependencies && Object.keys(pkg.dependencies).length) fail(`runtime dependencies are not allowed: ${Object.keys(pkg.dependencies).join(', ')}`);

// 2. forbidden patterns in shipped source. The only allowed URL is a user-clicked link to the official JLPT site (no request is made by the app).
const FORBIDDEN = [[/indexeddb/i, 'IndexedDB'], [/workbox/i, 'Workbox'], [/https?:\/\/(?!www\.w3\.org|localhost|www\.jlpt\.jp\/e\/)[^\s'"`)]+/i, 'remote URL']];
for (const f of walk(srcDir).filter((p) => /\.(js|css|html)$/.test(p))) {
  const text = readFileSync(f, 'utf8');
  for (const [re, label] of FORBIDDEN) {
    const m = text.match(re);
    if (m) fail(`${relative(root, f)} contains ${label}: ${m[0].slice(0, 60)}`);
  }
}

// 3. asset manifest
let manifest = [];
try { manifest = JSON.parse(readFileSync(manifestPath, 'utf8')); } catch (e) { fail(`cannot read asset manifest ${manifestPath}: ${e.message}`); }
if (!Array.isArray(manifest)) { fail('asset manifest must be an array'); manifest = []; }
for (const a of manifest) {
  const label = a.name || a.path || '(unnamed)';
  for (const k of ['name', 'path', 'origin', 'license', 'creator']) if (!a[k]) fail(`manifest entry ${label} lacks ${k}`);
  if (a.license && !ALLOWED_LICENSES.includes(a.license)) fail(`manifest entry ${label} has a licence that is not allowed: ${a.license}`);
}
const listed = new Set(manifest.map((a) => a.path));
for (const f of walk(distDir)) {
  const rel = relative(distDir, f).split('\\').join('/');
  if (MEDIA.has(extname(f).toLowerCase()) && !rel.startsWith('icons/') && !listed.has(rel)) fail(`dist/${rel} is a media file with no manifest entry`);
}

// 4. no human_reviewed without a named reviewer and date
const statusPath = join(root, 'content/status.json');
if (existsSync(statusPath)) {
  const st = JSON.parse(readFileSync(statusPath, 'utf8'));
  const entries = Array.isArray(st) ? st : Object.entries(st.items || st).map(([id, v]) => ({ id, ...(typeof v === 'object' ? v : { status: v }) }));
  for (const e of entries) if (e.status === 'human_reviewed' && !(e.reviewer && e.reviewed_on)) fail(`${e.id} is human_reviewed without a named reviewer and date`);
}

if (problems.length) {
  console.error(`LICENSE AUDIT FAILED (${problems.length}):`);
  for (const p of problems) console.error(` - ${p}`);
  process.exit(1);
}
console.log(`license audit OK: ${manifest.length} manifest entries, 0 runtime dependencies, no IndexedDB/Workbox/remote origins in src, no unlisted media in dist`);
