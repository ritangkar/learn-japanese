#!/usr/bin/env node
// Generates the original app icons (a simple torii-style glyph on indigo) as PNGs with no dependencies.
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const INDIGO = [0x2e, 0x4a, 0x7d];
const VERMILION = [0xc8, 0x41, 0x2b];
const PAPER = [0xfa, 0xf6, 0xee];

// shapes in a 100x100 box: [x, y, w, h, color]
const GLYPH = [
  [14, 24, 72, 8, VERMILION], // kasagi (top beam)
  [20, 38, 60, 6, VERMILION], // nuki (lower beam)
  [27, 32, 8, 50, VERMILION], // left pillar
  [65, 32, 8, 50, VERMILION], // right pillar
  [44, 12, 12, 12, PAPER], // sun
];

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
        let col = INDIGO;
        for (const [gx, gy, gw, gh, c] of GLYPH) if (u * 100 >= gx && u * 100 < gx + gw && v * 100 >= gy && v * 100 < gy + gh) col = c;
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
