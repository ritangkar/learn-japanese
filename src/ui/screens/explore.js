// Explore Japan: an illustrated map where every stop is tappable and shows its details right away (bottom sheet), a list alternative,
// the Tokyo area sub-map, and the full destination page. Selecting a stop also changes the page backdrop to that place.
import { h, s } from '../dom.js';
import { icon } from '../icons.js';
import { errorCard, statusBadge } from '../common.js';
import { renderMap, renderTokyoMap, LEGEND, STATE_LABEL, pinGlyph } from '../../map/render.js';
import { pinXY, VIEW } from '../../map/geo.js';
import { sceneSvg, SCENES } from '../../map/scenes.js';
import { stampSvg } from '../../map/stamps.js';
import { destinationStates, unitProgress } from '../../engine/progress.js';
import { progress, emptyState } from '../components.js';
import { dayToDate } from '../../core/clock.js';

const DONE = new Set(['completed', 'revisit_available']);
const stateChip = (st) => h('span', { class: `chip ${DONE.has(st) ? 'ok' : st === 'visible_locked' ? '' : 'info'}`, 'data-state-chip': st }, STATE_LABEL[st]);

/** Quests of N4+ destinations live in their level bundle; load the bundles of every level the learner has opened (offline failures are ignored: the stop then shows its normal "not available" text). */
async function loadUnlockedLevels(ctx, content) {
  for (const [level, state] of Object.entries(ctx.store.state.progress.levels || {})) {
    if (level === 'N5' || !state || state === 'locked') continue;
    try { await content.ensureLevel(level); } catch { /* bundle not cached offline */ }
  }
}

/** Units a stop needs, with learner progress: used by the sheet, the destination page and the lock explanation. */
export function requirements(d, content, st) {
  const ids = [...new Set([...d.unlock.all_units_completed, ...d.completion.units_completed])];
  return ids.map((u) => { const unit = content.unitById.get(u); const p = unitProgress(st.progress, content, u); return { id: u, title: unit?.title || u, released: !!unit?.released, done: p.complete, lessons: `${p.done} of ${p.total}`, needsToUnlock: d.unlock.all_units_completed.includes(u) }; });
}

function stopSheet(d, info, content, ctx, { compact = false } = {}) {
  const st = ctx.store.state;
  const region = content.regionById.get(d.region_id);
  const reqs = requirements(d, content, st);
  const quests = content.questsOf(d.id).filter((q) => !q.tier);
  const stamp = st.journal.stamps[d.rewards.stamp_id];
  const locked = info.state === 'visible_locked' || info.state === 'discoverable' || info.state === 'hidden';
  const total = reqs.length || 1; const doneN = reqs.filter((r) => r.done).length;
  const primary = locked ? null : DONE.has(info.state) ? { label: 'Revisit this stop', href: `#/dest/${d.id}` } : info.state === 'in_progress' ? { label: 'Continue this stop', href: `#/dest/${d.id}` } : { label: 'Explore this stop', href: `#/dest/${d.id}` };
  return h('section', { class: 'sheet', id: 'sheet-card', 'data-dest-card': d.id, 'aria-labelledby': 'sheet-title' },
    h('div', { class: 'sheet-art' }, sceneSvg(d.id, { name: d.name_en, done: new Set(Object.keys(st.progress.units)), cover: true })),
    h('div', { class: 'sheet-body' },
      h('div', { class: 'sheet-top' }, h('div', null, h('p', { class: 'eyebrow' }, `${region?.name_en || ''} · ${d.first_visit_level} stop`), h('h2', { id: 'sheet-title', style: 'margin:0' }, `${d.name_en} `, h('span', { class: 'ja', lang: 'ja' }, d.name_ja))), stateChip(info.state)),
      h('p', { style: 'margin:0' }, d.language_objectives.join(' · ')),
      locked && info.reason ? h('div', { class: 'lock-note', role: 'note' }, icon('lock', { size: 18 }), h('div', null, h('strong', null, 'Locked.'), ' ', info.reason.startsWith('Complete') ? 'Finish these units to open it:' : info.reason, reqs.length ? h('ul', { class: 'req-list' }, reqs.filter((r) => r.needsToUnlock || !compact).map((r) => h('li', null, `${r.title}: `, !r.released ? 'not released yet' : r.done ? 'done' : `${r.lessons} lessons`))) : null)) : null,
      !locked ? h('div', null, h('div', { class: 'row between small' }, h('span', null, 'Progress'), h('span', null, `${doneN} of ${total} units${quests.length ? ' · quest ' + (DONE.has(info.state) ? 'passed' : 'to do') : ''}`)), progress((100 * doneN) / total, { thin: true, label: `${d.name_en} progress` })) : null,
      h('div', { class: 'row', style: 'align-items:center' }, stamp ? h('div', { class: 'stamp-mini', style: 'width:64px' }, stampSvg(d, { day: stamp.day, motifs: SCENES[d.id]?.motifs })) : h('div', { class: 'stamp-mini', style: 'width:64px' }, stampSvg(d, { ghost: true })), h('span', { class: 'small muted', style: 'flex:1' }, stamp ? `Stamp collected ${dayToDate(stamp.day)}.` : 'Stamp reward: finish this stop\'s units and quest.')),
      h('div', { class: 'row' }, primary ? h('a', { class: 'btn primary', id: 'sheet-open', href: primary.href }, icon('forward', { size: 18 }), primary.label) : h('a', { class: 'btn', id: 'sheet-open', href: `#/dest/${d.id}` }, 'See details'), d.id === 'tokyo' ? h('a', { class: 'btn', href: '#/tokyo' }, 'Tokyo area map') : null))
  );
}

function listView(content, states) {
  const wrap = h('div', { class: 'dest-list', id: 'dest-list' });
  for (const r of content.regions) {
    const items = content.destinations.filter((d) => d.region_id === r.id && states[d.id].state !== 'hidden');
    if (!items.length) continue;
    wrap.append(h('h3', { style: 'margin:10px 0 2px' }, `${r.name_en} `, h('span', { class: 'ja', lang: 'ja' }, r.name_ja || r.name)), ...items.map((d) => {
      const locked = states[d.id].state === 'visible_locked' || states[d.id].state === 'discoverable';
      return h('a', { class: `dest-item${locked ? ' locked' : ''}`, href: `#/dest/${d.id}` }, h('span', { class: 'thumb' }, sceneSvg(d.id, { name: d.name_en, cover: true, decorative: true })), h('span', { class: 'grow' }, h('strong', null, `${d.name_en} `, h('span', { class: 'ja', lang: 'ja' }, d.name_ja)), h('span', { class: 'small muted' }, locked ? states[d.id].reason || 'Locked' : d.language_objectives[0])), stateChip(states[d.id].state));
    }));
  }
  return wrap;
}

export async function exploreScreen({ ctx, query }) {
  let content;
  try { content = await ctx.getContent(); await loadUnlockedLevels(ctx, content); } catch (e) { return errorCard(e); }
  const st = ctx.store.state;
  const states = destinationStates(st.progress, content);
  const cur = content.destById.get(st.progress.currentDestination) || content.destinations[0];
  const view = query.view === 'list' ? 'list' : 'map';
  let selected = query.stop && content.destById.has(query.stop) && states[query.stop].state !== 'hidden' ? query.stop : null;
  const startZoom = (typeof window !== 'undefined' && window.innerWidth < 640) ? 1.8 : 1; // phones start closer so pins are comfortably tappable
  let zoom = startZoom;
  ctx.setScene(selected || cur.id);
  const sheetHost = h('div', { id: 'sheet', 'aria-live': 'polite' });
  const mapHost = h('div', { class: 'map-wrap', id: 'map-wrap', tabindex: 0, role: 'region', 'aria-label': 'Map of Japan. Scroll or drag to move; use the magnifier buttons to zoom.' });

  const showSheet = () => {
    if (!selected) { sheetHost.replaceChildren(h('p', { class: 'small muted', style: 'text-align:center' }, 'Tap a stop on the map to see what is there.')); return; }
    const d = content.destById.get(selected);
    sheetHost.replaceChildren(stopSheet(d, states[selected], content, ctx));
  };
  const select = (id) => {
    selected = id; ctx.setScene(id); showSheet(); draw();
    try { history.replaceState(null, '', `#/explore?view=map&stop=${id}`); } catch { /* ignore */ }
    const card = document.getElementById('sheet-card'); if (card && card.scrollIntoView) card.scrollIntoView({ block: 'nearest', behavior: ctx.store.state.settings.reducedMotion === 'on' ? 'auto' : 'smooth' });
  };
  const applyZoom = (keepCenter = true) => {
    const svg = mapHost.firstChild; if (!svg) return;
    const cx = (mapHost.scrollLeft + mapHost.clientWidth / 2) / (svg.getBoundingClientRect().width || 1); const cy = (mapHost.scrollTop + mapHost.clientHeight / 2) / (svg.getBoundingClientRect().height || 1);
    svg.style.width = `${zoom * 100}%`; svg.classList.toggle('labels-all', zoom >= 2);
    if (keepCenter) { const r = svg.getBoundingClientRect(); mapHost.scrollLeft = cx * r.width - mapHost.clientWidth / 2; mapHost.scrollTop = cy * r.height - mapHost.clientHeight / 2; }
    zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
    zin.disabled = zoom >= 4; zout.disabled = zoom <= 1.01;
  };
  const centerOn = (id) => {
    const d = content.destById.get(id === 'tokyo_station' || id === 'konbini' || id === 'tokyo_tower' || id === 'residential_street' || id === 'asakusa' || id === 'shibuya' || id === 'shinjuku' ? 'tokyo' : id); if (!d) return;
    const svg = mapHost.firstChild; if (!svg) return; const r = svg.getBoundingClientRect(); const [x, y] = pinXY(d);
    mapHost.scrollLeft = (x / VIEW.w) * r.width - mapHost.clientWidth / 2; mapHost.scrollTop = (y / VIEW.h) * r.height - mapHost.clientHeight / 2;
  };
  function draw(first = false) {
    const keep = [mapHost.scrollLeft, mapHost.scrollTop];
    mapHost.replaceChildren(renderMap({ destinations: content.destinations, states, route: content.route, selected, onSelect: select }));
    applyZoom(false);
    if (first) centerOn(selected || cur.id); else { mapHost.scrollLeft = keep[0]; mapHost.scrollTop = keep[1]; }
  }
  const zin = h('button', { class: 'icon-btn', type: 'button', id: 'zoom-in', 'aria-label': 'Zoom in (magnifier plus)', onclick: () => { zoom = Math.min(4, zoom * 1.5); applyZoom(); } }, icon('zoomIn'));
  const zout = h('button', { class: 'icon-btn', type: 'button', id: 'zoom-out', 'aria-label': 'Zoom out (magnifier minus)', onclick: () => { zoom = Math.max(1, zoom / 1.5); applyZoom(); } }, icon('zoomOut'));
  const zreset = h('button', { class: 'icon-btn', type: 'button', id: 'zoom-reset', 'aria-label': 'Reset map view', onclick: () => { zoom = startZoom; applyZoom(false); centerOn(selected || cur.id); } }, icon('reset'));
  const zoomLabel = h('div', { class: 'tool-lbl', 'aria-hidden': 'true' }, '100%');

  const host = h('div', { class: 'stack explore' },
    h('div', { class: 'page-hero', style: 'min-height:120px' },
      h('p', { class: 'eyebrow' }, 'Your journey'), h('h1', null, 'Explore Japan'),
      h('p', { class: 'lead', style: 'margin:0' }, selected ? `${content.destById.get(selected).name_en} selected.` : `You are in ${cur.name_en}. Tap any stop for details.`)),
    h('div', { class: 'explore-top' },
      h('div', { class: 'seg', role: 'group', 'aria-label': 'Show stops as' },
        h('a', { href: '#/explore?view=map', id: 'view-map', 'aria-current': view === 'map' ? 'true' : null }, icon('map', { size: 18 }), 'Map'),
        h('a', { href: '#/explore?view=list', id: 'view-list', 'aria-current': view === 'list' ? 'true' : null }, icon('list', { size: 18 }), 'List')),
      h('span', { class: 'chip' }, `${Object.values(states).filter((x) => DONE.has(x.state)).length} of ${content.destinations.length} visited`)));
  if (view === 'map') {
    showSheet();
    host.append(
      h('div', { class: 'map-stage' }, mapHost, h('div', { class: 'map-tools', role: 'group', 'aria-label': 'Map zoom' }, zin, zout, zreset, zoomLabel), selected ? null : h('div', { class: 'map-hint' }, 'Tap a stop')),
      sheetHost,
      h('div', { class: 'map-legend-row', role: 'list', 'aria-label': 'Map key' }, [['available', 'Ready'], ['in_progress', 'In progress'], ['completed', 'Visited'], ['visible_locked', 'Locked']].map(([k, text]) => { const svg = s('svg', { viewBox: '-22 -22 44 44', width: 18, height: 18, 'aria-hidden': 'true', class: 'pin-icon' }); svg.append(pinGlyph(k, 0.5, 14)); return h('span', { role: 'listitem' }, svg, text); })),
      h('details', { class: 'card flat' }, h('summary', null, 'What the pins mean'), h('ul', { class: 'legend' }, LEGEND.map(([k, text]) => { const svg = s('svg', { viewBox: '-26 -26 52 52', 'aria-hidden': 'true' }); svg.append(pinGlyph(k, 0.5, 14)); return h('li', null, svg, h('span', null, text)); }), h('li', null, h('span', { class: 'small muted' }, 'Dashed route lines are upcoming; solid lines connect completed stops. The map is stylised and not for navigation.')))));
  } else host.append(listView(content, states));
  if (view === 'map') requestAnimationFrame(() => draw(true));
  host.append(h('p', { class: 'small muted' }, 'Learning unlocks stops; geography never does: a stop opens when you have finished the units it needs.'));
  return host;
}

export async function tokyoScreen({ ctx }) {
  let content;
  try { content = await ctx.getContent(); await loadUnlockedLevels(ctx, content); } catch (e) { return errorCard(e); }
  ctx.setScene('tokyo');
  const states = destinationStates(ctx.store.state.progress, content);
  const sheet = h('div', { id: 'sheet', 'aria-live': 'polite' });
  const kids = content.destinations.filter((d) => d.id === 'tokyo' || d.parent_id === 'tokyo');
  const show = (id) => { ctx.setScene(id); sheet.replaceChildren(stopSheet(content.destById.get(id), states[id], content, ctx, { compact: true })); };
  const map = renderTokyoMap({ destinations: content.destinations, states, onSelect: show });
  const scen = kids.filter((d) => !d.is_geographic && states[d.id].state !== 'hidden');
  return h('div', { class: 'stack' }, h('div', { class: 'page-hero', style: 'min-height:110px' }, h('p', { class: 'eyebrow' }, 'Kanto'), h('h1', null, 'Tokyo area')),
    h('div', { class: 'map-stage' }, h('div', { class: 'map-wrap' }, map)), sheet,
    scen.length ? h('div', null, h('h3', null, 'Everyday places (not on the map)'), h('div', { class: 'dest-list' }, scen.map((d) => h('a', { class: 'dest-item', href: `#/dest/${d.id}` }, h('span', { class: 'thumb' }, sceneSvg(d.id, { name: d.name_en, cover: true, decorative: true })), h('span', { class: 'grow' }, h('strong', null, d.name_en), h('span', { class: 'small muted' }, d.language_objectives[0])), stateChip(states[d.id].state))))) : null,
    h('p', { class: 'small muted' }, 'Stylised map, not for navigation. Convenience stores and residential streets are generic scenarios, not specific places.'));
}

export async function destinationScreen({ ctx, params }) {
  let content;
  try { content = await ctx.getContent(); await loadUnlockedLevels(ctx, content); } catch (e) { return errorCard(e); }
  const d = content.destById.get(params.id);
  if (!d) return emptyState({ icon: 'compass', title: 'Unknown stop', text: 'This place is not on the map.', action: h('a', { class: 'btn primary', href: '#/explore' }, 'Back to the map') });
  const { store } = ctx; const st = store.state;
  const states = destinationStates(st.progress, content); const info = states[d.id];
  ctx.setScene(d.id);
  const reqs = requirements(d, content, st);
  const quests = content.questsOf(d.id).filter((q) => !q.tier);
  const prog = st.progress.destinations[d.id] || {};
  const stamp = st.journal.stamps[d.rewards.stamp_id];
  const region = content.regionById.get(d.region_id);
  const locked = ['visible_locked', 'discoverable', 'hidden'].includes(info.state);
  const host = h('div', { class: 'stack' },
    h('section', { class: 'page-hero', 'aria-labelledby': 'dest-title' },
      h('span', { class: 'station-plate' }, h('span', { class: 'num', 'aria-hidden': 'true' }, String(content.route.indexOf(d.id) + 1)), `${region?.name_en || ''} · ${d.first_visit_level} stop`),
      h('h1', { id: 'dest-title' }, `${d.name_en} `, h('span', { class: 'ja display-ja', lang: 'ja' }, d.name_ja)),
      h('div', { class: 'hero-chips' }, stateChip(info.state), h('span', { class: 'chip', title: 'Our own teaching groups; not an official JLPT list' }, `${d.first_visit_level} · instructional level (unofficial)`))));
  if (info.state === 'hidden') host.append(h('p', { class: 'banner info' }, 'This stop is still hidden. Keep going and it will appear on the map.'));
  if (info.reason) host.append(h('div', { class: 'lock-note', role: 'note' }, icon(locked ? 'lock' : 'info', { size: 18 }), h('span', null, info.reason)));
  host.append(h('div', { class: 'card' }, h('h3', null, 'What you will practise'), h('ul', null, d.language_objectives.map((o) => h('li', null, o)))));
  host.append(h('div', { class: 'card' }, h('h3', null, 'To open and complete this stop'),
    h('ul', { class: 'step-list' }, reqs.map((r) => h('li', { class: r.done ? 'done' : '' }, h('span', { class: 'dot' }, r.done ? icon('check', { size: 14 }) : null), h('span', null, `${r.id} · ${r.title}: `, !r.released ? h('span', { class: 'chip warn' }, 'not released yet') : r.done ? h('span', { class: 'chip ok' }, '✔ complete') : h('span', { class: 'chip' }, `${r.lessons} lessons`))))),
    h('p', { class: 'small muted' }, `Completion also needs the main quest at ${Math.round(d.completion.min_quest_accuracy * 100)} % or more.`)));
  if (['available', 'in_progress', 'completed', 'revisit_available'].includes(info.state)) {
    host.append(h('div', { class: 'card' }, h('h3', null, 'Quests'), quests.length ? quests.map((q) => { const best = prog.quests?.[q.id]?.best; const qt = content.core.quest_types.find((t) => t.id === q.type); return h('div', { class: 'card flat tint' }, h('strong', null, qt?.name || q.type), h('p', { class: 'small' }, qt?.objective_template), best !== undefined ? h('p', { class: 'small' }, `Best so far: ${Math.round(best * 100)} %`) : null, h('a', { class: 'btn primary', id: `quest-${q.id}`, href: `#/quest/${q.id}` }, icon('play', { size: 18 }), best === undefined ? 'Start quest' : 'Try again')); }) : emptyState({ icon: 'compass', title: 'Quest not written yet', text: 'The quest for this stop has not been written yet, so it cannot be completed in this release.' })));
    if (info.state !== 'completed' && st.progress.currentDestination !== d.id) host.append(h('button', { class: 'btn', type: 'button', id: 'make-current', onclick: () => { store.update('progress', (p) => ({ ...p, currentDestination: d.id })); ctx.rerender(); } }, icon('flag', { size: 18 }), 'Make this my current stop'));
  }
  host.append(h('div', { class: 'card stamp-card' }, h('h3', null, 'Stamp'), h('div', { class: 'row' }, h('div', { class: 'stamp-mini', style: 'width:96px' }, stamp ? stampSvg(d, { day: stamp.day, motifs: SCENES[d.id]?.motifs }) : stampSvg(d, { ghost: true })), h('p', { class: 'small muted', style: 'flex:1;margin:0' }, stamp ? `Collected ${dayToDate(stamp.day)}.` : 'Not collected yet. Finish all units for this stop and pass its main quest.'))));
  if (d.revisit_tiers?.length) host.append(h('div', { class: 'card' }, h('h3', null, 'Revisit tiers'), h('ul', null, info.tiers.map((t) => h('li', null, `${t.level}: ${t.description || t.tier_id} `, t.done ? h('span', { class: 'chip ok' }, '✔ done') : !t.content ? h('span', { class: 'chip warn' }, 'not released yet') : t.unlocked ? h('span', { class: 'chip info' }, 'open') : h('span', { class: 'chip' }, 'locked until that level opens'))))));
  host.append(h('div', { class: 'card' }, h('h3', null, 'About this place'), h('p', null, d.cultural_note.text), h('p', { class: 'row' }, h('span', { class: 'chip warn' }, 'Unverified'), h('span', { class: 'small muted' }, 'This note has not been fact-checked by a person.'))),
    h('div', { class: 'card' }, h('h3', null, 'Ambience'), h('p', { class: 'small muted' }, 'Optional background sound for this place (generated on your device, off by default).'), h('button', { class: 'btn', type: 'button', id: 'amb-toggle', 'aria-pressed': 'false', onclick: (e) => { const on = e.currentTarget.getAttribute('aria-pressed') !== 'true'; e.currentTarget.setAttribute('aria-pressed', String(on)); e.currentTarget.textContent = on ? 'Stop ambience' : 'Play ambience'; if (on) ctx.audio.ambience.start(d.soundscape_ids.find((x) => x.startsWith('amb_')) || null, true); else ctx.audio.ambience.stop(); } }, 'Play ambience')));
  return host;
}
export { statusBadge };
