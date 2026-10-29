// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { loadSpec } from '../../scripts/lib/load-content.mjs';
import { project, pinXY, BOUNDS, VIEW, islandPath, ISLANDS, OKINAWA_INSET, tokyoXY, TOKYO_BOUNDS } from '../../src/map/geo.js';
import { renderMap, renderTokyoMap, pinGlyph, STATE_LABEL } from '../../src/map/render.js';
import { sceneSvg, SCENES } from '../../src/map/scenes.js';
import { stampSvg } from '../../src/map/stamps.js';
import { destinationStates } from '../../src/engine/progress.js';
import { emptyState, realContent } from '../fixtures/state.js';

const spec = loadSpec();
const content = realContent();

describe('map geometry follows the spec (D-011)', () => {
  it('projection formula and bounds equal the spec', () => {
    const p = spec.japan_exploration.map.projection;
    expect(BOUNDS).toEqual(p.bounds); expect(VIEW).toEqual({ w: 1000, h: 1100 });
    const [x, y] = project(139.767, 35.681);
    expect(x).toBeCloseTo(((139.767 - 122) / (146.5 - 122)) * 1000, 0); expect(y).toBeCloseTo(((45.8 - 35.681) / (45.8 - 24)) * 1100, 0);
  });
  it('every geographic destination projects inside the viewBox; Naha is drawn in the dashed Okinawa inset', () => {
    for (const d of spec.destinations.filter((x) => x.is_geographic)) { const [px, py] = pinXY(d); expect(px, d.id).toBeGreaterThan(0); expect(px, d.id).toBeLessThan(1000); expect(py, d.id).toBeGreaterThan(0); expect(py, d.id).toBeLessThan(1100); }
    const [nx, ny] = pinXY(spec.destinations.find((d) => d.id === 'naha'));
    expect(nx).toBeGreaterThan(OKINAWA_INSET.x); expect(nx).toBeLessThan(OKINAWA_INSET.x + OKINAWA_INSET.w); expect(ny).toBeGreaterThan(OKINAWA_INSET.y); expect(ny).toBeLessThan(OKINAWA_INSET.y + OKINAWA_INSET.h);
  });
  it('no two national pins are closer than 30 units after manual offsets (hit areas do not overlap)', () => {
    const pts = spec.destinations.filter((d) => d.is_geographic && d.parent_id !== 'tokyo').map((d) => [d.id, ...pinXY(d)]);
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) expect(Math.hypot(pts[i][1] - pts[j][1], pts[i][2] - pts[j][2]), `${pts[i][0]} vs ${pts[j][0]}`).toBeGreaterThan(30);
  });
  it('Tokyo sub-map places the central stops inside its frame', () => {
    for (const id of ['tokyo_tower', 'asakusa', 'shibuya', 'shinjuku', 'tokyo_station']) { const [x, y] = tokyoXY(spec.destinations.find((d) => d.id === id)); expect(x, id).toBeGreaterThan(0); expect(x, id).toBeLessThan(TOKYO_BOUNDS.w); expect(y, id).toBeGreaterThan(0); expect(y, id).toBeLessThan(TOKYO_BOUNDS.h); }
  });
  it('islands are closed smooth paths', () => { for (const k of Object.keys(ISLANDS)) expect(islandPath(k)).toMatch(/^M.*Z$/); });
});

describe('destination data (AC14): 27 destinations, 9 regions, valid prerequisites, acyclic route', () => {
  const units = new Set(Object.values(spec.curriculum.levels).flatMap((l) => l.units.map((u) => u.id)));
  it('counts and references', () => {
    expect(spec.destinations).toHaveLength(27); expect(spec.regions).toHaveLength(9);
    for (const d of spec.destinations) { for (const u of [...d.unlock.all_units_completed, ...d.completion.units_completed]) expect(units.has(u), `${d.id}:${u}`).toBe(true); expect(spec.regions.some((r) => r.id === d.region_id)).toBe(true); }
  });
  it('route has no repeats (so no cycles) and visits every destination once', () => { const r = spec.japan_exploration.route.order; expect(new Set(r).size).toBe(r.length); expect(r.length).toBe(27); });
  it('parents form a forest of depth one (Tokyo area)', () => { for (const d of spec.destinations.filter((x) => x.parent_id)) expect(spec.destinations.find((p) => p.id === d.parent_id).parent_id).toBeNull(); });
});

describe('map rendering (AC13)', () => {
  const states = destinationStates(emptyState().progress, content);
  const svg = renderMap({ destinations: content.destinations, states, route: content.route, onSelect: () => {} });
  it('is a single SVG well under 120 KB with no external references', () => {
    const xml = new XMLSerializer().serializeToString(svg);
    expect(xml.length).toBeLessThan(120 * 1024);
    const bare = xml.replace('xmlns="http://www.w3.org/2000/svg"', '');
    expect(bare).not.toMatch(/https?:\/\//); expect(bare).not.toMatch(/href=|src=|url\(/);
  });
  it('has an accessible name, a focusable button per visible pin with its state in the label, and a legend-worthy shape per state', () => {
    expect(svg.getAttribute('aria-label')).toMatch(/Not for navigation/);
    const pins = [...svg.querySelectorAll('.pin')];
    expect(pins.length).toBeGreaterThan(3);
    for (const p of pins) { expect(p.getAttribute('role')).toBe('button'); expect(p.getAttribute('tabindex')).toBe('0'); expect(p.getAttribute('aria-label')).toMatch(/available|locked|almost reachable|in progress|completed|revisit/); }
    expect(svg.querySelector('.inset-frame')).toBeTruthy();
  });
  it('state is conveyed by SHAPE and text, not colour alone: every state has a structurally different glyph', () => {
    const sig = (st) => [...pinGlyph(st, 0.5).querySelectorAll('*')].map((e) => e.tagName + (e.getAttribute('points') ? 'poly' : '')).join('|');
    const states2 = ['visible_locked', 'discoverable', 'available', 'in_progress', 'completed', 'revisit_available'];
    expect(new Set(states2.map(sig)).size).toBe(states2.length);
    expect(Object.keys(STATE_LABEL)).toEqual(expect.arrayContaining(states2));
  });
  it('hidden destinations are not drawn; initial map shows Tokyo area and the next-level stops only', () => {
    const ids = [...svg.querySelectorAll('.pin')].map((p) => p.dataset.dest);
    expect(ids).toContain('tokyo'); expect(ids).not.toContain('sapporo'); expect(ids).not.toContain('naha');
  });
  it('Tokyo sub-map renders the geographic stops of the area', () => {
    const t = renderTokyoMap({ destinations: content.destinations, states, onSelect: () => {} });
    expect(t.querySelectorAll('.pin').length).toBeGreaterThan(0);
  });
});

describe('scenes and stamps', () => {
  it('every one of the 27 destinations has an original scene under 15 KB with alt text', () => {
    for (const d of spec.destinations) { expect(SCENES[d.id], d.id).toBeTruthy(); const el = sceneSvg(d.id, { name: d.name_en }); const xml = new XMLSerializer().serializeToString(el); expect(xml.length, d.id).toBeLessThan(15 * 1024); expect(el.getAttribute('aria-label')).toContain(d.name_en); expect(xml).not.toMatch(/https?:\/\/(?!www\.w3\.org)/); }
  });
  it('Tokyo scene reveals more layers as units complete', () => {
    const size = (done) => new XMLSerializer().serializeToString(sceneSvg('tokyo', { name: 'Tokyo', done: new Set(done) })).length;
    expect(size([])).toBeLessThan(size(['n5_u01'])); expect(size(['n5_u01'])).toBeLessThan(size(['n5_u01', 'n5_u03', 'n5_u05']));
  });
  it('stamp art names the destination in Japanese and carries an accessible label with date', () => {
    const d = spec.destinations.find((x) => x.id === 'tokyo'); const el = stampSvg(d, { day: 20000 });
    expect(el.textContent).toContain('東京'); expect(el.getAttribute('aria-label')).toMatch(/Stamp: Tokyo, earned 2024-10-04/);
  });
});
