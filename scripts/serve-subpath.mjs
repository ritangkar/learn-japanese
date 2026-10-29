#!/usr/bin/env node
// Serves dist/ under /<REPO>/ like GitHub Pages: anything outside the sub-path is a 404 (exposes absolute-path bugs).
import http from 'node:http';
import { createReadStream, statSync, existsSync } from 'node:fs';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const REPO = process.env.REPO_NAME || 'learn-japanese';
const PORT = Number(process.env.PORT || 4173);
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml' };
const base = `/${REPO}/`;

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === `/${REPO}`) { res.writeHead(301, { Location: base }); return res.end(); }
  if (!url.pathname.startsWith(base)) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('404 (outside sub-path)'); }
  let rel = normalize(decodeURIComponent(url.pathname.slice(base.length))).replace(/^(\.\.[/\\])+/, '');
  let file = join(root, rel);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('404'); }
  const type = MIME[extname(file)] || 'application/octet-stream';
  const noCache = file.endsWith('sw.js') || file.endsWith('precache-manifest.json') || file.endsWith('index.html');
  res.writeHead(200, { 'Content-Type': type, 'Cache-Control': noCache ? 'no-cache' : 'max-age=600' });
  createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`serving dist at http://localhost:${PORT}${base}`));
