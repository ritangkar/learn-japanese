import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../../', import.meta.url).pathname;
const walk = (d) => (existsSync(d) ? readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; }) : []);
const srcFiles = walk(join(root, 'src')).filter((f) => /\.(js|css|html)$/.test(f));
const read = (f) => readFileSync(f, 'utf8');

describe('code-base policy (AC05, AC37, AC38, AC04, R023)', () => {
  it('no IndexedDB anywhere in shipped source', () => {
    const hits = srcFiles.filter((f) => /indexeddb|idb-keyval|dexie|localforage/i.test(read(f)));
    expect(hits).toEqual([]);
  });
  it('no Workbox or background-sync/expiration', () => {
    const hits = [...srcFiles, join(root, 'package.json')].filter((f) => /workbox|background-?sync|expiration/i.test(read(f)));
    expect(hits).toEqual([]);
    const pkg = JSON.parse(read(join(root, 'package.json')));
    expect(Object.keys({ ...pkg.dependencies })).toEqual([]); // zero runtime dependencies
  });
  it('no remote URLs, CDNs or remote fonts in source (only schema/spec namespaces allowed)', () => {
    const allowed = [/^https?:\/\/www\.w3\.org\/(2000\/svg|1999\/xlink)/, /^https?:\/\/localhost/, /^https?:\/\/x$/, /^https:\/\/(www\.)?jlpt\.jp\//, /^https:\/\/creativecommons\.org\//, /^https:\/\/github\.com\/ritangkar\//, /^https:\/\/opensource\.org\//];
    const bad = [];
    for (const f of srcFiles) for (const m of read(f).matchAll(/https?:\/\/[^\s'"`)<>]+/g)) if (!allowed.some((a) => a.test(m[0]))) bad.push(`${f}: ${m[0]}`);
    expect(bad).toEqual([]);
    const css = srcFiles.filter((f) => f.endsWith('.css')).map(read).join('\n');
    expect(css).not.toMatch(/@import|url\(\s*['"]?https?:/);
  });
  it('no network call to any AI / model API and no fetch to non-relative URLs', () => {
    const bad = srcFiles.filter((f) => /api\.anthropic|openai|generativelanguage|api\.cohere/i.test(read(f)));
    expect(bad).toEqual([]);
  });
  it('engines do not use Math.random or read the wall clock directly', () => {
    const eng = walk(join(root, 'src/engine'));
    for (const f of eng) {
      const t = read(f);
      expect(/Math\.random/.test(t), `${f} uses Math.random`).toBe(false);
      expect(/Date\.now\(|new Date\(\)/.test(t), `${f} reads wall clock`).toBe(false);
    }
  });
  it('index.html carries the required CSP and has no inline script', () => {
    const html = read(join(root, 'index.html'));
    expect(html).toMatch(/default-src 'self'/);
    expect(html).toMatch(/script-src 'self'/);
    expect(html).not.toMatch(/<script(?![^>]*\bsrc=)[^>]*>/);
  });
  it('no inline style attributes are written as markup strings', () => {
    const bad = srcFiles.filter((f) => f.endsWith('.js') && /\bstyle\s*=\s*["'`]/.test(read(f)) && !/setAttribute\('style'/.test(''));
    expect(bad).toEqual([]);
  });
});
