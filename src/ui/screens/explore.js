import { h, s } from '../dom.js';
import { errorCard, back, statusBadge } from '../common.js';
import { renderMap, renderTokyoMap, LEGEND, STATE_LABEL, pinGlyph } from '../../map/render.js';
import { sceneSvg, tokyoLayersRevealed } from '../../map/scenes.js';
import { stampSvg } from '../../map/stamps.js';
import { destinationStates, unitProgress } from '../../engine/progress.js';
import { weeklyRing, streak } from '../../engine/gamification.js';
import { nextBlock, blockHref } from '../flow.js';
import { today } from '../env.js';
import { dayToDate } from '../../core/clock.js';

const stateChip = (st) => h('span', { class: `chip ${st === 'completed' ? 'ok' : st === 'visible_locked' ? '' : 'info'}`, 'data-state-chip': st }, STATE_LABEL[st]);

function destCard(d, info, content, ctx, { compact = false } = {}) {
  const region = content.regionById.get(d.region_id);
  return h('div', { class: 'card sheet-card', 'data-dest-card': d.id },
    h('div', { class: 'row between' }, h('strong', null, `${d.name_en} `, h('span', { class: 'ja', lang: 'ja' }, d.name_ja)), stateChip(info.state)),
    h('div', { class: 'small muted' }, `${region?.name_en || ''} · ${d.first_visit_level} stop (instructional level, unofficial)`),
    info.reason ? h('p', { class: 'small' }, info.reason) : null,
    compact ? null : h('p', null, d.language_objectives.join(' · ')),
    h('div', { class: 'row' }, h('a', { class: 'btn primary', href: d.id === 'tokyo' && !compact ? `#/dest/${d.id}` : `#/dest/${d.id}` }, 'Open'), d.id === 'tokyo' ? h('a', { class: 'btn', href: '#/tokyo' }, 'Tokyo area map') : null));
}

function listView(content, states) {
  const wrap = h('div', { class: 'stack', id: 'dest-list' });
  for (const r of content.regions) {
    const items = content.destinations.filter((d) => d.region_id === r.id && states[d.id].state !== 'hidden');
    if (!items.length) continue;
    wrap.append(h('h3', null, `${r.name_en} `, h('span', { class: 'ja', lang: 'ja' }, r.name), ''), h('ul', { class: 'menu' }, items.map((d) => h('li', null, h('a', { class: 'menu-item', href: `#/dest/${d.id}` }, h('span', null, h('strong', null, d.name_en), ' ', h('span', { class: 'ja', lang: 'ja' }, d.name_ja), ' ', stateChip(states[d.id].state)), h('span', { class: 'small muted' }, states[d.id].reason || d.language_objectives[0]))))));
  }
  return wrap;
}

export async function homeScreen({ ctx, query }) {
  let content;
  try { content = await ctx.getContent(); } catch (e) { return errorCard(e); }
  const st = ctx.store.state; const t = today();
  const states = destinationStates(st.progress, content);
  const ring = weeklyRing(st.journal, t, st.settings.weeklyGoalDays); const stk = streak(st.journal, t);
  const cur = content.destById.get(st.progress.currentDestination) || content.destinations[0];
  const { next } = nextBlock(ctx, content);
  const view = query.view === 'list' ? 'list' : 'map';
  const sheet = h('div', { id: 'sheet', 'aria-live': 'polite' });
  let selected = null; let zoom = 1;
  const mapHost = h('div', { class: 'map-wrap', id: 'map-wrap', tabindex: 0, 'aria-label': 'Map of Japan, scrollable' });
  const draw = () => {
    mapHost.replaceChildren(renderMap({ destinations: content.destinations, states, route: content.route, selected, onSelect: (id) => { selected = id; const d = content.destById.get(id); sheet.replaceChildren(destCard(d, states[id], content, ctx, { compact: true })); draw(); } }));
    mapHost.firstChild.style.width = `${zoom * 100}%`; mapHost.firstChild.classList.toggle('labels-all', zoom >= 2);
  };
  const zoomBy = (f) => { zoom = Math.min(4, Math.max(1, zoom * f)); mapHost.firstChild.style.width = `${zoom * 100}%`; mapHost.firstChild.classList.toggle('labels-all', zoom >= 2); };
  const legend = h('details', { class: 'card' }, h('summary', null, 'Map legend'), h('ul', { class: 'legend' }, LEGEND.map(([k, text]) => { const svg = s('svg', { viewBox: '-26 -26 52 52', 'aria-hidden': 'true' }); svg.append(pinGlyph(k, 0.5, 14)); return h('li', null, svg, h('span', null, text)); }), h('li', null, h('span', { class: 'small muted' }, 'Dashed route lines are upcoming; solid lines connect completed stops. Stylised map, not for navigation.'))));
  const host = h('div', { class: 'stack' },
    h('div', { class: 'card tint' }, h('div', { class: 'small muted' }, 'You are in'), h('h2', { id: 'current-stop' }, `${cur.name_en} `, h('span', { class: 'ja', lang: 'ja' }, cur.name_ja)),
      h('div', { class: 'row' }, h('span', { class: 'chip' }, content.regionById.get(cur.region_id)?.name_en), stateChip(states[cur.id].state)),
      h('div', { class: 'row' }, h('a', { class: 'btn primary', id: 'start-today', href: next ? blockHref(next) : '#/learn' }, 'Start today'), h('a', { class: 'btn', href: `#/dest/${cur.id}` }, 'This stop')),
      st.settings.gamification === 'off' ? null : h('p', { class: 'small', id: 'ring' }, `This week: ${ring.effectiveDays} of ${ring.goal} study days${ring.graceApplied ? ' (grace day applied)' : ''}`, st.settings.gamification === 'full' && stk.days > 1 ? ` · ${stk.days}-day streak` : '')),
    h('div', { class: 'row', role: 'group', 'aria-label': 'Map or list' }, h('a', { class: 'btn small', 'aria-pressed': view === 'map' ? 'true' : 'false', href: '#/?view=map' }, 'Map'), h('a', { class: 'btn small', 'aria-pressed': view === 'list' ? 'true' : 'false', href: '#/?view=list' }, 'List'),
      view === 'map' ? h('span', { class: 'zoom-row' }, h('button', { class: 'btn small', type: 'button', 'aria-label': 'Zoom in', onclick: () => zoomBy(1.5) }, '+'), h('button', { class: 'btn small', type: 'button', 'aria-label': 'Zoom out', onclick: () => zoomBy(1 / 1.5) }, '−')) : null));
  if (view === 'map') { draw(); host.append(mapHost, sheet, legend); } else host.append(listView(content, states));
  host.append(h('p', { class: 'small muted' }, 'Education unlocks stops; geography never does: a stop opens when you have finished the units it needs.'));
  return host;
}

export async function tokyoScreen({ ctx }) {
  let content;
  try { content = await ctx.getContent(); } catch (e) { return errorCard(e); }
  const states = destinationStates(ctx.store.state.progress, content);
  const sheet = h('div', { id: 'sheet', 'aria-live': 'polite' });
  const kids = content.destinations.filter((d) => d.id === 'tokyo' || d.parent_id === 'tokyo');
  const map = renderTokyoMap({ destinations: content.destinations, states, onSelect: (id) => sheet.replaceChildren(destCard(content.destById.get(id), states[id], content, ctx, { compact: true })) });
  const scen = kids.filter((d) => !d.is_geographic && states[d.id].state !== 'hidden');
  return h('div', { class: 'stack' }, back('#/', 'Map'), h('h2', null, 'Tokyo area'), h('div', { class: 'map-wrap' }, map), sheet,
    scen.length ? h('div', null, h('h3', null, 'Everyday places (not on the map)'), h('div', { class: 'grid2' }, scen.map((d) => destCard(d, states[d.id], content, ctx, { compact: true })))) : null,
    h('p', { class: 'small muted' }, 'Stylised map, not for navigation. Convenience stores and residential streets are generic scenarios, not specific places.'));
}

export async function destinationScreen({ ctx, params }) {
  let content;
  try { content = await ctx.getContent(); } catch (e) { return errorCard(e); }
  const d = content.destById.get(params.id);
  if (!d) return h('p', null, 'Unknown destination. ', h('a', { href: '#/' }, 'Back to the map'));
  const { store } = ctx; const st = store.state;
  const states = destinationStates(st.progress, content); const info = states[d.id];
  const done = new Set(Object.keys(st.progress.units));
  const units = [...new Set([...d.unlock.all_units_completed, ...d.completion.units_completed])];
  const quests = content.questsOf(d.id).filter((q) => !q.tier);
  const prog = st.progress.destinations[d.id] || {};
  const stamp = st.journal.stamps[d.rewards.stamp_id];
  const host = h('div', { class: 'stack' }, back('#/', 'Map'), h('h2', { id: 'dest-title' }, `${d.name_en} `, h('span', { class: 'ja', lang: 'ja' }, d.name_ja)), h('div', { class: 'row' }, h('span', { class: 'chip' }, content.regionById.get(d.region_id)?.name_en), stateChip(info.state), h('span', { class: 'chip', title: 'Our own teaching groups; not an official JLPT list' }, `${d.first_visit_level} · instructional level (unofficial)`)),
    d.id === 'tokyo' ? h('div', null, h('div', { class: 'scene-wrap' }, sceneSvg(d.id, { name: d.name_en, done })), h('p', { class: 'small muted' }, `More of this scene appears as you finish units (${tokyoLayersRevealed(done)} of 4 layers so far).`)) : sceneSvg(d.id, { name: d.name_en, done }),
    info.state === 'hidden' ? h('p', { class: 'banner info' }, 'This stop is still hidden. Keep going and it will appear on the map.') : null,
    info.reason ? h('p', { class: 'banner info' }, info.reason) : null);
  host.append(h('div', { class: 'card' }, h('h3', null, 'What you will practise'), h('ul', null, d.language_objectives.map((o) => h('li', null, o)))));
  host.append(h('div', { class: 'card' }, h('h3', null, 'To open and complete this stop'), h('ul', null, units.map((u) => { const unit = content.unitById.get(u); const up = unitProgress(st.progress, content, u); return h('li', null, `${u} · ${unit?.title || ''}: `, !unit?.released ? h('span', { class: 'chip warn' }, 'not released yet') : up.complete ? h('span', { class: 'chip ok' }, '✔ complete') : h('span', { class: 'chip' }, `${up.done} of ${up.total} lessons`)); })),
    h('p', { class: 'small muted' }, `Completion also needs the main quest at ${Math.round(d.completion.min_quest_accuracy * 100)} % or more.`)));
  if (['available', 'in_progress', 'completed', 'revisit_available'].includes(info.state)) {
    host.append(h('div', { class: 'card' }, h('h3', null, 'Quests'), quests.length ? quests.map((q) => { const best = prog.quests?.[q.id]?.best; const qt = content.core.quest_types.find((t) => t.id === q.type); return h('div', { class: 'block-card' }, h('strong', null, qt?.name || q.type), h('p', { class: 'small' }, qt?.objective_template), best !== undefined ? h('p', { class: 'small' }, `Best so far: ${Math.round(best * 100)} %`) : null, h('a', { class: 'btn primary', id: `quest-${q.id}`, href: `#/quest/${q.id}` }, best === undefined ? 'Start quest' : 'Try again')); }) : h('p', { class: 'muted' }, 'The quest for this stop has not been written yet, so it cannot be completed in this release.')));
    if (info.state !== 'completed' && st.progress.currentDestination !== d.id) host.append(h('button', { class: 'btn', type: 'button', onclick: () => { store.update('progress', (p) => ({ ...p, currentDestination: d.id })); ctx.rerender(); } }, 'Make this my current stop'));
  }
  if (stamp) host.append(h('div', { class: 'card stamp' }, h('h3', null, 'Your stamp'), stampSvg(d, { day: stamp.day })));
  if (d.revisit_tiers?.length) host.append(h('div', { class: 'card' }, h('h3', null, 'Revisit tiers'), h('ul', null, info.tiers.map((t) => h('li', null, `${t.level}: ${t.description || t.tier_id} `, t.done ? h('span', { class: 'chip ok' }, '✔ done') : !t.content ? h('span', { class: 'chip warn' }, 'not released yet') : t.unlocked ? h('span', { class: 'chip info' }, 'open') : h('span', { class: 'chip' }, 'locked until that level opens'))))));
  host.append(h('div', { class: 'card' }, h('h3', null, 'About this place'), h('p', null, d.cultural_note.text), h('p', { class: 'row' }, h('span', { class: 'chip warn' }, 'Unverified'), h('span', { class: 'small muted' }, 'This note has not been fact-checked by a person.'))),
    h('div', { class: 'card' }, h('h3', null, 'Ambience'), h('p', { class: 'small muted' }, 'Optional background sound for this place (generated on your device, off by default).'), h('button', { class: 'btn', type: 'button', id: 'amb-toggle', 'aria-pressed': 'false', onclick: (e) => { const on = e.currentTarget.getAttribute('aria-pressed') !== 'true'; e.currentTarget.setAttribute('aria-pressed', String(on)); e.currentTarget.textContent = on ? 'Stop ambience' : 'Play ambience'; if (on) ctx.audio.ambience.start(d.soundscape_ids.find((x) => x.startsWith('amb_')) || null, true); else ctx.audio.ambience.stop(); } }, 'Play ambience')));
  return host;
}

export async function journalScreen({ ctx }) {
  let content;
  try { content = await ctx.getContent(); } catch (e) { return errorCard(e); }
  const j = ctx.store.state.journal; const st = ctx.store.state;
  const stamps = Object.entries(j.stamps);
  const sec = (title, body) => h('div', { class: 'card' }, h('h3', null, title), body);
  const visited = content.destinations.filter((d) => st.progress.destinations[d.id]?.completedAt !== undefined);
  return h('div', { class: 'stack' }, back('#/me', 'Me'), h('h2', null, 'Travel journal'),
    sec('Stamps', stamps.length ? h('div', { class: 'stamp-grid' }, stamps.map(([, x]) => { const d = content.destById.get(x.destination); return h('div', { class: 'stamp' }, stampSvg(d, { day: x.day, tier: x.tier }), h('div', { class: 'small' }, d.name_en)); })) : h('p', { class: 'muted' }, 'No stamps yet. Complete a stop (its units and its main quest) to earn one.')),
    sec('Postcards', Object.keys(j.postcards).length ? h('div', { class: 'stack' }, Object.values(j.postcards).map((p) => { const d = content.destById.get(p.destination); return h('div', { class: 'postcard' }, sceneSvg(d.id, { name: d.name_en, done: new Set(Object.keys(st.progress.units)) }), h('p', { class: 'small' }, `Greetings from ${d.name_en} · ${dayToDate(p.day)}`)); })) : h('p', { class: 'muted' }, 'A postcard arrives with your first stamp at each stop.')),
    sec('Milestones', h('ul', null, h('li', null, `${Object.keys(st.progress.lessons).length} lesson(s) completed`), h('li', null, `${Object.keys(st.progress.units).length} unit(s) completed`), ...Object.entries(j.achievements).map(([id]) => h('li', null, content.core.achievements.find((a) => a.id === id)?.name || id)))),
    sec('Cultural discoveries', visited.length ? h('ul', null, visited.map((d) => h('li', null, h('strong', null, `${d.name_en}: `), d.cultural_note.text, ' ', h('span', { class: 'chip warn' }, 'Unverified')))) : h('p', { class: 'muted' }, 'Notes about places appear here after you complete them. They are shown as unverified until fact-checked.')),
    sec('Stats', h('ul', null, h('li', null, `XP: ${j.xp.total}`), h('li', null, `Study days recorded: ${j.studyDays.length}`), h('li', null, `Review items in your schedule: ${Object.keys(st.srs).length}`))));
}

export async function achievementsScreen({ ctx }) {
  let content;
  try { content = await ctx.getContent(); } catch (e) { return errorCard(e); }
  const j = ctx.store.state.journal;
  return h('div', { class: 'stack' }, back('#/me', 'Me'), h('h2', null, 'Achievements'), h('p', { class: 'small muted' }, 'Each one is earned through practice evidence, never for just opening the app. N5 milestone text says internal progress: it is not JLPT certification.'),
    h('ul', { class: 'menu' }, content.core.achievements.map((a) => { const got = j.achievements[a.id]; return h('li', { class: 'card', 'data-ach': a.id, 'data-earned': got ? '1' : '0' }, h('div', { class: 'row between' }, h('strong', null, a.name), got ? h('span', { class: 'chip ok' }, `✔ earned ${dayToDate(got.day)}`) : h('span', { class: 'chip' }, 'not yet')), h('p', { class: 'small' }, `How: ${a.rule}`)); })));
}
export { statusBadge };
