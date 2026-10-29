// SVG map renderer: sea and land, region tints, route lines, destination pins (state shown by SHAPE + text, never colour alone),
// Okinawa inset and the Tokyo sub-map. No external requests; the whole map is generated from the data in geo.js.
import { s } from '../ui/dom.js';
import { islandPath, insetIslandPath, OKINAWA_INSET, VIEW, pinXY, tokyoXY, TOKYO_BOUNDS, project } from './geo.js';

export const STATE_LABEL = { hidden: 'hidden', visible_locked: 'locked', discoverable: 'almost reachable', available: 'available', in_progress: 'in progress', completed: 'completed', revisit_available: 'revisit available' };
export const LEGEND = [
  ['visible_locked', 'Locked: finish the units shown on the stop'], ['discoverable', 'Almost there: over 60 % of its units done'], ['available', 'Available: ready to visit'],
  ['in_progress', 'In progress (ring shows unit progress)'], ['completed', 'Completed: stamp earned'], ['revisit_available', 'Revisit: a higher-level tier is open'],
];

/** Draw the glyph for a state at (0,0). */
export function pinGlyph(state, pct = 0, size = 15) {
  // the glyph artwork is drawn for radius 15; `size` scales it so pins stay readable on a phone-sized map
  const r = 15;
  const g = s('g', { class: `pin-glyph ${state}` });
  const star = () => s('path', { d: 'M0 -7 L2 -2 L7 -2 L3 1.5 L4.5 7 L0 3.8 L-4.5 7 L-3 1.5 L-7 -2 L-2 -2 Z', class: 'pin-ink' });
  if (state === 'visible_locked') g.append(s('polygon', { points: `0,${-r - 2} ${r + 2},0 0,${r + 2} ${-r - 2},0`, class: 'pin-base' }), s('rect', { x: -5, y: -2, width: 10, height: 8, class: 'pin-ink' }), s('path', { d: 'M-3 -2 V-5 A3 3 0 0 1 3 -5 V-2', class: 'pin-ink-stroke', fill: 'none' }));
  else if (state === 'discoverable') g.append(s('circle', { r, class: 'pin-base dashed' }), s('text', { class: 'pin-q', y: 5, 'text-anchor': 'middle' }, '?'));
  else if (state === 'available') g.append(s('circle', { r: r + 6, class: 'pin-pulse' }), s('circle', { r, class: 'pin-base' }), star());
  else if (state === 'in_progress') {
    const c = 2 * Math.PI * (r + 4);
    g.append(s('circle', { r, class: 'pin-base' }), s('circle', { r: r + 4, class: 'pin-ring-bg', fill: 'none' }), s('circle', { r: r + 4, class: 'pin-ring', fill: 'none', 'stroke-dasharray': `${(c * Math.max(0.05, pct)).toFixed(1)} ${c.toFixed(1)}`, transform: 'rotate(-90)' }), s('path', { d: 'M-4 -5 L-4 5 L5 0 Z', class: 'pin-ink' }));
  } else {
    g.append(s('circle', { r, class: 'pin-base' }), s('path', { d: 'M-6 0 L-2 5 L7 -5', class: 'pin-ink-stroke', fill: 'none' }));
    if (state === 'revisit_available') g.append(s('rect', { x: 6, y: -r - 4, width: 12, height: 12, rx: 2, class: 'pin-badge' }), s('path', { d: `M12 ${-r - 1} l-4 5 h8 z`, class: 'pin-ink' }));
  }
  g.setAttribute('transform', `scale(${size / 15})`);
  return g;
}

/**
 * @param {{destinations:object[], states:object, route:string[], onSelect:(id:string)=>void, selected?:string, zoom?:number}} o
 */
export function renderMap({ destinations, states, route, onSelect, selected = null }) {
  const svg = s('svg', { viewBox: `0 0 ${VIEW.w} ${VIEW.h}`, class: 'map-svg', role: 'group', 'aria-label': 'Stylised map of Japan with destinations. Not for navigation. A list of the same destinations is available.' });
  svg.append(s('defs', null, s('linearGradient', { id: 'seaGrad', x1: 0, y1: 0, x2: 0, y2: 1 }, s('stop', { offset: 0, class: 'sea-a' }), s('stop', { offset: 1, class: 'sea-b' })), s('filter', { id: 'landShadow', x: '-5%', y: '-5%', width: '110%', height: '110%' }, s('feDropShadow', { dx: 0, dy: 6, stdDeviation: 7, 'flood-opacity': 0.22 }))), s('rect', { x: 0, y: 0, width: VIEW.w, height: VIEW.h, class: 'map-sea', fill: 'url(#seaGrad)' }), s('g', { class: 'map-waves', 'aria-hidden': 'true' }, ...Array.from({ length: 14 }, (_, i) => s('path', { d: `M${(i * 173) % 900 + 20} ${(i * 211) % 1000 + 40} q 18 -14 36 0 t 36 0`, fill: 'none', class: 'wave' }))));
  for (const name of ['hokkaido', 'honshu', 'kyushu', 'shikoku', 'awaji', 'sado']) svg.append(s('path', { d: islandPath(name), class: 'map-land', filter: 'url(#landShadow)' }));
  svg.append(s('g', { class: 'map-inset' }, s('rect', { x: OKINAWA_INSET.x, y: OKINAWA_INSET.y, width: OKINAWA_INSET.w, height: OKINAWA_INSET.h, rx: 12, class: 'inset-frame' }), s('path', { d: insetIslandPath(), class: 'map-land' }), s('text', { x: OKINAWA_INSET.x + 10, y: OKINAWA_INSET.y + 22, class: 'map-label' }, 'Okinawa (inset)')));
  // nodes: sub-stops of Tokyo are represented by the Tokyo node
  const nodeOf = (d) => (d.parent_id === 'tokyo' ? 'tokyo' : d.id);
  const byId = Object.fromEntries(destinations.map((d) => [d.id, d]));
  const seq = []; for (const id of route) { const n = nodeOf(byId[id]); if (!seq.length || seq[seq.length - 1] !== n) seq.push(n); }
  const lines = s('g', { class: 'map-routes', 'aria-hidden': 'true' });
  for (let i = 0; i < seq.length - 1; i++) {
    const a = byId[seq[i]]; const b = byId[seq[i + 1]];
    if (states[a.id].state === 'hidden' || states[b.id].state === 'hidden') continue;
    const [x1, y1] = pinXY(a); const [x2, y2] = pinXY(b);
    const done = ['completed', 'revisit_available'].includes(states[a.id].state) && ['completed', 'revisit_available'].includes(states[b.id].state);
    lines.append(s('line', { x1, y1, x2, y2, class: done ? 'route done' : 'route' }));
  }
  svg.append(lines);
  const pins = s('g', { class: 'map-pins' });
  const kids = (id) => destinations.filter((d) => d.parent_id === id);
  for (const id of seq) {
    const d = byId[id]; const st = states[id];
    if (st.state === 'hidden') continue;
    const [x, y] = pinXY(d);
    const sub = id === 'tokyo' ? kids('tokyo') : [];
    const label = `${d.name_en}${sub.length ? `, area with ${sub.length} more stops` : ''}, ${STATE_LABEL[st.state]}`;
    const g = s('g', { class: `pin ${selected === id ? 'sel' : ''}`, transform: `translate(${x} ${y})`, role: 'button', tabindex: 0, 'aria-label': label, 'data-dest': id, 'data-state': st.state });
    g.append(s('circle', { r: 42, class: 'pin-hit', fill: 'transparent' }), pinGlyph(st.state, st.pct, 27), s('text', { class: 'pin-name', y: 58, 'text-anchor': 'middle' }, d.name_en));
    if (sub.length) g.append(s('g', { class: 'pin-more', 'aria-hidden': 'true' }, s('circle', { cx: 22, cy: -16, r: 4 }), s('circle', { cx: 32, cy: -16, r: 4 }), s('circle', { cx: 42, cy: -16, r: 4 })));
    const act = () => onSelect(id);
    g.addEventListener('click', act);
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
    pins.append(g);
  }
  svg.append(pins, s('text', { x: VIEW.w - 12, y: VIEW.h - 12, class: 'map-credit', 'text-anchor': 'end' }, 'Stylised map, not for navigation'));
  return svg;
}

export function renderTokyoMap({ destinations, states, onSelect, selected = null }) {
  const b = TOKYO_BOUNDS;
  const svg = s('svg', { viewBox: `0 0 ${b.w} ${b.h}`, class: 'map-svg tokyo-map', role: 'group', 'aria-label': 'Stylised map of central Tokyo with stops. Not for navigation. Scenario stops are listed as cards below.' });
  svg.append(s('rect', { x: 0, y: 0, width: b.w, height: b.h, class: 'map-land' }), s('path', { d: `M${b.w * 0.55} ${b.h} C ${b.w * 0.6} ${b.h * 0.8} ${b.w * 0.75} ${b.h * 0.78} ${b.w} ${b.h * 0.7} V ${b.h} Z`, class: 'map-sea' }), s('path', { d: `M0 ${b.h * 0.42} C ${b.w * 0.3} ${b.h * 0.4} ${b.w * 0.5} ${b.h * 0.55} ${b.w} ${b.h * 0.5}`, class: 'map-river', fill: 'none' }));
  for (const d of destinations.filter((x) => x.is_geographic && (x.id === 'tokyo' || x.parent_id === 'tokyo'))) {
    const st = states[d.id]; if (st.state === 'hidden') continue;
    let [x, y] = tokyoXY(d);
    if (d.id === 'tokyo') { x -= 34; y -= 24; }
    const g = s('g', { class: `pin ${selected === d.id ? 'sel' : ''}`, transform: `translate(${x} ${y})`, role: 'button', tabindex: 0, 'aria-label': `${d.name_en}, ${STATE_LABEL[st.state]}`, 'data-dest': d.id, 'data-state': st.state });
    g.append(s('circle', { r: 46, class: 'pin-hit', fill: 'transparent' }), pinGlyph(st.state, st.pct, 28), s('text', { class: 'pin-name', y: 60, 'text-anchor': 'middle' }, d.name_en));
    g.addEventListener('click', () => onSelect(d.id));
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(d.id); } });
    svg.append(g);
  }
  return svg;
}
export { project };
