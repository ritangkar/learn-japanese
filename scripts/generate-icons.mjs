#!/usr/bin/env node
// Generates the original app icons (a simple torii-style glyph on indigo) as PNGs with no dependencies.
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const INDIGO = [0x23, 0x3e, 0x78];
const VERMILION = [0xc8, 0x41, 0x2b];
const PAPER = [0xfa, 0xf4, 0xe8];

const DEEP = [0x16, 0x2b, 0x57];
const SAKURA = [0xf4, 0xbf, 0xcc];
const GOLD = [0xd9, 0xa6, 0x3b];
const DARKRED = [0x9e, 0x2e, 0x1c];
const mix = (a, b, t) => a.map((x, i) => Math.round(x + (b[i] - x) * Math.max(0, Math.min(1, t))));

/** Colour at (u, v) in a 0..100 box: indigo night gradient, a sakura sun, a torii with an upturned top beam, and a few petals. */
function colorAt(u, v) {
  let col = mix(DEEP, INDIGO, (v + 10) / 110);
  if ((u - 50) ** 2 + (v - 44) ** 2 < 25 ** 2) col = SAKURA; // sun
  if ((u - 50) ** 2 + (v - 44) ** 2 < 25 ** 2 && v > 44) col = mix(SAKURA, [0xe9, 0x9a, 0xb0], (v - 44) / 25);
  if (v > 82) col = mix(DEEP, INDIGO, 0.2); // ground
  const t = Math.abs(u - 50) / 42; const top = 24 - 8 * t * t; // kasagi curves up at both ends
  if (u > 8 && u < 92 && v >= top && v < top + 9) col = VERMILION;
  if (u > 14 && u < 86 && v >= top + 9 && v < top + 13) col = DARKRED; // shimaki
  if (u > 22 && u < 78 && v >= 41 && v < 47) col = VERMILION; // nuki
  if (((u > 27 && u < 35) || (u > 65 && u < 73)) && v >= top + 9 && v < 84) col = VERMILION; // pillars
  if (((u > 26 && u < 36) || (u > 64 && u < 74)) && v >= 80 && v < 84) col = DARKRED; // bases
  if ([[18, 70, 2], [82, 62, 2.4], [90, 76, 1.8], [12, 50, 1.6]].some(([x, y, r]) => (u - x) ** 2 + (v - y) ** 2 < r * r)) col = PAPER; // petals
  if ((u - 50) ** 2 + (v - 15) ** 2 < 2.2 ** 2) col = GOLD; // finial
  return col;
}

function crc32(buf) {
  let c; let crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(size, scale) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  const S = 3; // supersampling
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      let r = 0; let g = 0; let b = 0;
      for (let sy = 0; sy < S; sy++) for (let sx = 0; sx < S; sx++) {
        const u = ((x + (sx + 0.5) / S) / size - 0.5) / scale + 0.5; // 0..1 inside glyph box
        const v = ((y + (sy + 0.5) / S) / size - 0.5) / scale + 0.5;
        const col = colorAt(u * 100, v * 100);
        r += col[0]; g += col[1]; b += col[2];
      }
      const o = y * (size * 4 + 1) + 1 + x * 4;
      raw[o] = Math.round(r / (S * S)); raw[o + 1] = Math.round(g / (S * S)); raw[o + 2] = Math.round(b / (S * S)); raw[o + 3] = 255;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

mkdirSync(join(root, 'public/icons'), { recursive: true });
const out = [['icon-192.png', 192, 0.85], ['icon-512.png', 512, 0.85], ['icon-maskable-512.png', 512, 0.6], ['apple-touch-icon.png', 180, 0.85]];
for (const [name, size, scale] of out) {
  const buf = png(size, scale);
  writeFileSync(join(root, 'public/icons', name), buf);
  console.log(`wrote public/icons/${name} (${size}x${size}, ${buf.length} bytes)`);
}
