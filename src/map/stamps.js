// Original station-stamp artwork, inspired by the spirit of Japanese eki stamps (a framed mark with the place name, a small local
// motif, and a date), but drawn from scratch for this project: no real station stamp or third-party artwork is reproduced.
// Frame shape and ink colour come from the destination, so the book looks like a varied collection. Text stays crisp and legible;
// only the frame gets a slight ink-roughness filter.
import { s } from '../ui/dom.js';
import { dayToDate } from '../core/clock.js';

const INK = { N5: '#B5271C', N4: '#2A4A8C', N3: '#2F6B3A', N2: '#6A3D8F', N1: '#2B2B33' };
const FRAMES = ['circle', 'square', 'oval'];
const hash = (str) => [...str].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
let uid = 0;

/** Tiny landmark glyphs (about 36x36 around 0,0), keyed by the scene motif of the destination. */
const GLYPH = {
  tower: (c) => [s('path', { d: 'M0 -17 L9 15 H-9Z', class: 'ink-line', 'stroke-width': 2.2, stroke: c }), s('path', { d: 'M-5 3 H5 M-3 -6 H3', class: 'ink-line', 'stroke-width': 1.6, stroke: c })],
  torii: (c) => [s('path', { d: 'M-15 -9 Q0 -5 15 -9 M-12 -2 H12 M-9 -8 V15 M9 -8 V15', class: 'ink-line', 'stroke-width': 2.4, stroke: c, 'stroke-linecap': 'round' })],
  pagoda: (c) => [s('path', { d: 'M-12 15 H12 M-9 6 H9 M-6 -2 H6 M-3 -10 H3 M0 -17 V-10 M-14 15 L-9 6 L-6 -2 L-3 -10 L0 -17 L3 -10 L6 -2 L9 6 L14 15', class: 'ink-line', 'stroke-width': 1.9, stroke: c, 'stroke-linejoin': 'round' })],
  fuji: (c) => [s('path', { d: 'M-17 14 L-4 -12 L4 -12 L17 14Z', class: 'ink-line', 'stroke-width': 2.2, stroke: c, 'stroke-linejoin': 'round' }), s('path', { d: 'M-7 -5 L-3 -1 L0 -5 L3 -1 L7 -5', class: 'ink-line', 'stroke-width': 1.6, stroke: c })],
  castle: (c) => [s('path', { d: 'M-15 15 V4 H15 V15Z M-10 4 V-4 H10 V4 M-5 -4 V-11 H5 V-4 M-13 -2 Q0 -9 13 -2 M-8 -11 Q0 -17 8 -11', class: 'ink-line', 'stroke-width': 1.9, stroke: c, 'stroke-linejoin': 'round' })],
  waves: (c) => [s('path', { d: 'M-17 -3 q4 -6 8 0 t8 0 t8 0 t8 0 M-17 6 q4 -6 8 0 t8 0 t8 0 t8 0', class: 'ink-line', 'stroke-width': 2.2, stroke: c, 'stroke-linecap': 'round' })],
  deer: (c) => [s('path', { d: 'M-8 14 V4 Q-8 -2 0 -2 Q8 -2 8 4 V14 M-3 -2 Q-8 -8 -10 -14 M3 -2 Q8 -8 10 -14 M-10 -14 L-6 -10 M10 -14 L6 -10', class: 'ink-line', 'stroke-width': 2, stroke: c, 'stroke-linecap': 'round' })],
  palm: (c) => [s('path', { d: 'M0 15 V-4 M0 -4 Q-9 -14 -16 -6 M0 -4 Q9 -14 16 -6 M0 -4 Q-3 -15 -8 -17 M0 -4 Q3 -15 8 -17', class: 'ink-line', 'stroke-width': 2.2, stroke: c, 'stroke-linecap': 'round' })],
  snow: (c) => [s('path', { d: 'M0 -15 V15 M-13 -7 L13 7 M-13 7 L13 -7', class: 'ink-line', 'stroke-width': 2, stroke: c, 'stroke-linecap': 'round' })],
  skyline: (c) => [s('path', { d: 'M-16 15 V2 H-9 V-6 H-2 V15 M2 15 V-12 H10 V15 M-16 15 H16', class: 'ink-line', 'stroke-width': 2, stroke: c, 'stroke-linejoin': 'round' })],
  train: (c) => [s('path', { d: 'M-11 -13 H11 V8 H-11Z M-11 -3 H11 M-6 8 L-9 15 M6 8 L9 15', class: 'ink-line', 'stroke-width': 2, stroke: c, 'stroke-linejoin': 'round' }), s('circle', { cx: -5, cy: 3, r: 1.4, fill: c }), s('circle', { cx: 5, cy: 3, r: 1.4, fill: c })],
  lantern: (c) => [s('path', { d: 'M-8 -10 H8 Q11 0 8 10 H-8 Q-11 0 -8 -10Z M-5 -14 H5 M-5 14 H5 M-9 -3 H9 M-9 3 H9', class: 'ink-line', 'stroke-width': 1.9, stroke: c, 'stroke-linejoin': 'round' })],
  bridge: (c) => [s('path', { d: 'M-17 8 Q0 -14 17 8 M-17 8 H17 M-8 -1 V8 M0 -4 V8 M8 -1 V8', class: 'ink-line', 'stroke-width': 2, stroke: c, 'stroke-linecap': 'round' })],
  cherry: (c) => [s('path', { d: 'M0 -4 Q-8 -14 -14 -6 Q-12 4 0 -4 M0 -4 Q8 -14 14 -6 Q12 4 0 -4 M0 -4 Q-8 6 -4 14 Q2 12 0 -4 M0 -4 Q8 6 4 14 Q-2 12 0 -4', class: 'ink-line', 'stroke-width': 1.8, stroke: c, 'stroke-linejoin': 'round' })],
};
const MOTIF_FOR = (destId, sceneMotifs = []) => {
  const pick = ['tower', 'torii', 'pagoda', 'fuji', 'castle', 'waves', 'deer', 'palm', 'snow', 'lanterns', 'bridge', 'cherry', 'station', 'skyline'].find((m) => sceneMotifs.includes(m));
  return { lanterns: 'lantern', station: 'train' }[pick] || pick || 'skyline';
};

/**
 * stampSvg(dest, {day, tier, motifs, level, ghost, pressed})
 * `motifs` is the scene motif list of the destination (from SCENES); `ghost` draws the empty slot silhouette for a stamp not yet earned.
 */
export function stampSvg(dest, { day = null, tier = null, motifs = [], level = null, ghost = false, pressed = false } = {}) {
  const id = `st${++uid}`;
  const ink = ghost ? '#8A8F9C' : (INK[level || dest.first_visit_level] || INK.N5);
  const frame = FRAMES[hash(dest.id) % FRAMES.length];
  const label = ghost ? `Stamp not yet earned: ${dest.name_en}` : `Stamp: ${dest.name_en}${tier ? `, tier ${tier}` : ''}${day !== null ? `, earned ${dayToDate(day)}` : ''}`;
  const svg = s('svg', { viewBox: '0 0 120 120', class: `stamp-art${ghost ? ' ghost' : ''}${pressed ? ' pressed' : ''}`, role: 'img', 'aria-label': label, style: `--stamp-ink:${ink}` });
  svg.append(s('defs', null, s('filter', { id: `rough-${id}`, x: '-5%', y: '-5%', width: '110%', height: '110%' }, s('feTurbulence', { type: 'fractalNoise', baseFrequency: 0.9, numOctaves: 1, seed: hash(dest.id) % 20, result: 'n' }), s('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: 1.6 }))));
  const f = s('g', { filter: ghost ? null : `url(#rough-${id})`, fill: 'none', stroke: ink, 'stroke-dasharray': ghost ? '5 4' : null });
  if (frame === 'circle') f.append(s('circle', { cx: 60, cy: 60, r: 55, 'stroke-width': 4 }), s('circle', { cx: 60, cy: 60, r: 47, 'stroke-width': 1.4 }));
  else if (frame === 'square') f.append(s('rect', { x: 7, y: 7, width: 106, height: 106, rx: 16, 'stroke-width': 4 }), s('rect', { x: 14, y: 14, width: 92, height: 92, rx: 11, 'stroke-width': 1.4 }));
  else f.append(s('ellipse', { cx: 60, cy: 60, rx: 56, ry: 48, 'stroke-width': 4 }), s('ellipse', { cx: 60, cy: 60, rx: 48, ry: 40, 'stroke-width': 1.4 }));
  svg.append(f);
  const g = s('g', { fill: ink, 'font-family': 'var(--font-display)', 'text-anchor': 'middle' });
  const nameJa = dest.name_ja; const fs = nameJa.length > 4 ? 14 : nameJa.length > 3 ? 17 : nameJa.length > 2 ? 21 : 26;
  g.append(s('text', { x: 60, y: frame === 'oval' ? 30 : 29, 'font-size': 7.6, 'font-weight': 700, 'letter-spacing': 1.2, 'font-family': 'var(--font-body)' }, dest.name_en.toUpperCase().slice(0, 18)));
  if (ghost) g.append(s('text', { x: 60, y: 70, 'font-size': 30, 'font-weight': 700, opacity: 0.55 }, '?'));
  else {
    const glyph = s('g', { transform: 'translate(60 47) scale(.66)', fill: 'none' }, ...(GLYPH[MOTIF_FOR(dest.id, motifs)] || GLYPH.skyline)(ink));
    g.append(glyph, s('text', { x: 60, y: 82, 'font-size': fs, 'font-weight': 700 }, nameJa));
    g.append(day !== null ? s('text', { x: 60, y: 97, 'font-size': 7.4, 'font-family': 'var(--font-body)', 'font-weight': 700, 'letter-spacing': 0.6 }, dayToDate(day).replace(/-/g, '.')) : null);
    if (tier) g.append(s('text', { x: 60, y: 107, 'font-size': 8, 'font-weight': 700, 'font-family': 'var(--font-body)' }, tier));
  }
  svg.append(g);
  return svg;
}
