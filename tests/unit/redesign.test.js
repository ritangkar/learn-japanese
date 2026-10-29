// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { loadSpec } from '../../scripts/lib/load-content.mjs';
import { icon, ICON_NAMES } from '../../src/ui/icons.js';
import { stampSvg } from '../../src/map/stamps.js';
import { sceneSvg, SCENES } from '../../src/map/scenes.js';
import { pinGlyph } from '../../src/map/render.js';
import { parentOf } from '../../src/app.js';
import { h } from '../../src/ui/dom.js';
import { ring, progress } from '../../src/ui/components.js';
import { weekDots } from '../../src/ui/screens/home.js';
import { requirements } from '../../src/ui/screens/explore.js';
import { routes } from '../../src/ui/routes.js';
import { realContent, emptyState } from '../fixtures/state.js';

const spec = loadSpec(); const content = realContent();
const xml = (el) => new XMLSerializer().serializeToString(el);

describe('icon set', () => {
  it('every icon renders an svg with paths; decorative by default, named when a label is given', () => {
    expect(ICON_NAMES.length).toBeGreaterThan(40);
    for (const n of ICON_NAMES) { const el = icon(n); expect(el.tagName).toBe('svg'); expect(el.querySelectorAll('path').length, n).toBeGreaterThan(0); expect(el.getAttribute('aria-hidden')).toBe('true'); }
    const labelled = icon('home', { label: 'Home' }); expect(labelled.getAttribute('role')).toBe('img'); expect(labelled.getAttribute('aria-label')).toBe('Home'); expect(labelled.getAttribute('aria-hidden')).toBeNull();
  });
  it('the navigation, map and install icons used by the shell exist', () => {
    for (const n of ['home', 'map', 'book', 'exam', 'stamp', 'user', 'zoomIn', 'zoomOut', 'reset', 'list', 'back', 'close', 'download', 'share', 'addHome', 'lock', 'flame', 'star', 'trophy']) expect(ICON_NAMES).toContain(n);
  });
});

describe('inline style strings are applied through the CSSOM (the CSP forbids style attributes)', () => {
  it('h() sets style without writing a style attribute the CSP would block, including custom properties', () => {
    const el = h('div', { style: 'width:40%; --x: 3; margin:0' });
    expect(el.style.width).toBe('40%'); expect(el.style.getPropertyValue('--x')).toBe('3');
  });
});

describe('stamps', () => {
  const dests = spec.destinations;
  it('each destination gets a stamp with its Japanese name, a framed shape from the three frames, an ink colour per level and an accessible name', () => {
    const frames = new Set();
    for (const d of dests) {
      const el = stampSvg(d, { day: 20000, motifs: SCENES[d.id]?.motifs });
      expect(el.textContent).toContain(d.name_ja); expect(el.getAttribute('aria-label')).toBe(`Stamp: ${d.name_en}, earned 2024-10-04`);
      frames.add(['circle', 'rect', 'ellipse'].find((t) => el.querySelector(`g[fill="none"] > ${t}`)));
      expect(xml(el).length).toBeLessThan(6000);
    }
    expect([...frames].filter(Boolean).length).toBe(3);
  });
  it('an unearned stamp is a dashed silhouette with no date and says so', () => {
    const d = dests[0]; const g = stampSvg(d, { ghost: true });
    expect(g.getAttribute('aria-label')).toBe(`Stamp not yet earned: ${d.name_en}`); expect(g.getAttribute('class')).toContain('ghost'); expect(g.textContent).not.toContain(d.name_ja);
    expect(xml(g)).toContain('stroke-dasharray');
  });
  it('level changes the ink; the pressed class drives the awarding animation', () => {
    const d = dests.find((x) => x.first_visit_level === 'N4'); const a = stampSvg(d, { day: 1 }); const b = stampSvg(dests.find((x) => x.first_visit_level === 'N5'), { day: 1, pressed: true });
    expect(a.getAttribute('style')).toContain('#2A4A8C'); expect(b.getAttribute('style')).toContain('#B5271C'); expect(b.getAttribute('class')).toContain('pressed');
  });
  it('different destinations use different frames (a varied collection, not one template)', () => {
    const framesOf = (d) => ['circle', 'rect', 'ellipse'].find((t) => stampSvg(d, { day: 1 }).querySelector(`g[fill="none"] > ${t}`));
    expect(new Set(dests.map(framesOf)).size).toBe(3);
  });
});

describe('scenes (location backdrops)', () => {
  it('all 27 have art; backdrops are decorative and fill their box; page art has a text alternative', () => {
    for (const d of spec.destinations) {
      const bg = sceneSvg(d.id, { cover: true, decorative: true }); expect(bg.getAttribute('aria-hidden')).toBe('true'); expect(bg.getAttribute('preserveAspectRatio')).toBe('xMidYMid slice'); expect(bg.getAttribute('data-scene')).toBe(d.id);
      const art = sceneSvg(d.id, { name: d.name_en }); expect(art.getAttribute('role')).toBe('img'); expect(art.getAttribute('aria-label')).toContain(d.name_en);
    }
  });
  it('two backdrops with different ids use different gradient ids (crossfading layers never share a definition)', () => {
    expect(sceneSvg('tokyo', { cover: true, decorative: true }).querySelector('linearGradient').id).not.toBe(sceneSvg('kyoto', { cover: true, decorative: true }).querySelector('linearGradient').id);
  });
});

describe('map pins scale for touch', () => {
  it('a glyph is scaled by size/15 so the pin keeps its drawing but gets bigger', () => {
    expect(pinGlyph('available', 0, 27).getAttribute('transform')).toBe('scale(1.8)');
    expect(pinGlyph('visible_locked', 0, 15).getAttribute('transform')).toBe('scale(1)');
  });
});

describe('navigation: parentOf and routes', () => {
  it('top-level screens have no back button; detail screens go to a fixed parent', () => {
    for (const p of ['/', '/explore', '/learn', '/jlpt', '/journal']) expect(parentOf(p), p).toBeNull();
    expect(parentOf('/dest/tokyo').href).toBe('#/explore'); expect(parentOf('/lesson/n5_u01_l1').href).toBe('#/learn'); expect(parentOf('/jlpt/N5').href).toBe('#/jlpt'); expect(parentOf('/mock/mock_n5_01').href).toBe('#/jlpt');
    expect(parentOf('/achievements').href).toBe('#/journal'); expect(parentOf('/settings').href).toBe('#/me'); expect(parentOf('/me').href).toBe('#/'); expect(parentOf('/kanji/k_san').href).toBe('#/library');
  });
  it('every route pattern has a title and primary routes are unique (no duplicate screens under different names)', () => {
    const pats = routes.map((r) => r.pattern); expect(new Set(pats).size).toBe(pats.length);
    for (const r of routes) expect(r.title, r.pattern).toBeTruthy();
    expect(routes.find((r) => r.pattern === '/').scene).toBe('current'); expect(routes.find((r) => r.pattern === '/explore').scene).toBe('explicit');
  });
});

describe('components', () => {
  it('ring and progress expose values to assistive tech and clamp out-of-range input', () => {
    const r = ring({ value: 3, max: 4, label: '3/4', sub: 'days' }); expect(r.getAttribute('aria-label')).toBe('3/4: 3 of 4, days');
    expect(ring({ value: 9, max: 4 }).querySelector('.val').getAttribute('stroke-dashoffset')).toBe('0.0'); expect(ring({ value: -2, max: 4 }).querySelector('.val').getAttribute('stroke-dashoffset')).toBe((2 * Math.PI * 34).toFixed(1));
    const p = progress(140); expect(p.getAttribute('aria-valuenow')).toBe('100'); expect(progress(-5).getAttribute('aria-valuenow')).toBe('0'); expect(progress(33.4).getAttribute('role')).toBe('progressbar');
  });
  it('week dots mark exactly the study days of the Monday-based week and the current day', () => {
    const day = 20000; // a Saturday (2024-10-04 is Friday=19999+1)
    const ws = day - ((day + 3) % 7);
    const el = weekDots({ studyDays: [ws, ws + 2] }, day, 4); expect(el.querySelectorAll('i.on').length).toBe(2); expect(el.querySelectorAll('i.today').length).toBe(1);
    expect(el.getAttribute('aria-label')).toBe('Study days this week: 2 of 4 goal');
  });
});

describe('stop requirements (used by the map sheet and the lock explanation)', () => {
  it('lists the units a stop needs with released state and progress, from real content', () => {
    const st = emptyState(); const tokyoStation = content.destById.get('tokyo_station');
    const reqs = requirements(tokyoStation, content, st);
    expect(reqs.length).toBeGreaterThan(0); for (const r of reqs) { expect(typeof r.title).toBe('string'); expect(r.done).toBe(false); expect(r.lessons).toMatch(/^\d+ of \d+$/); }
    expect(reqs.some((r) => r.needsToUnlock)).toBe(true);
  });
});
