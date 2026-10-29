// Generated stamp artwork: ring, destination name in Japanese, date and tier mark. Original SVG; no third-party marks.
import { s } from '../ui/dom.js';
import { dayToDate } from '../core/clock.js';

export function stampSvg(dest, { day = null, tier = null } = {}) {
  const svg = s('svg', { viewBox: '0 0 120 120', class: 'stamp-art', role: 'img', 'aria-label': `Stamp: ${dest.name_en}${tier ? `, tier ${tier}` : ''}${day !== null ? `, earned ${dayToDate(day)}` : ''}` });
  svg.append(s('circle', { cx: 60, cy: 60, r: 54, fill: 'none', stroke: '#B23A25', 'stroke-width': 4 }), s('circle', { cx: 60, cy: 60, r: 46, fill: 'none', stroke: '#B23A25', 'stroke-width': 1.5, 'stroke-dasharray': '3 3' }),
    s('text', { x: 60, y: 66, 'text-anchor': 'middle', 'font-size': dest.name_ja.length > 3 ? 20 : 26, 'font-weight': 700, fill: '#B23A25', 'font-family': 'serif' }, dest.name_ja),
    s('text', { x: 60, y: 34, 'text-anchor': 'middle', 'font-size': 9, fill: '#B23A25', 'letter-spacing': 1 }, dest.name_en.toUpperCase()),
    day !== null ? s('text', { x: 60, y: 90, 'text-anchor': 'middle', 'font-size': 9, fill: '#B23A25' }, dayToDate(day)) : null,
    tier ? s('text', { x: 60, y: 102, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700, fill: '#B23A25' }, tier) : null);
  return svg;
}
