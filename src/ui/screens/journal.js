// Travel journal: the stamp book (earned stamps and silhouettes of the ones still to find), milestones, postcards, discoveries, and an
// honest explanation of how XP, streaks and unlocking work. Everything shown is read from saved state.
import { h } from '../dom.js';
import { icon } from '../icons.js';
import { errorCard } from '../common.js';
import { progress, openModal, emptyState } from '../components.js';
import { stampSvg } from '../../map/stamps.js';
import { sceneSvg, SCENES } from '../../map/scenes.js';
import { destinationStates } from '../../engine/progress.js';
import { XP_BASE, XP_DAY_CAP } from '../../engine/progress.js';
import { weeklyRing, streak } from '../../engine/gamification.js';
import { today } from '../env.js';
import { dayToDate } from '../../core/clock.js';

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

async function loadOpened(ctx, content) {
  for (const [L, state] of Object.entries(ctx.store.state.progress.levels || {})) if (L !== 'N5' && state && state !== 'locked') { try { await content.ensureLevel(L); } catch { /* offline */ } }
}

function stampDetail(ctx, content, d, x) {
  const body = h('div', { class: 'award' }, h('div', { class: 'paper-page' }, stampSvg(d, { day: x.day, tier: x.tier, motifs: SCENES[d.id]?.motifs })),
    h('p', { style: 'margin:0' }, `Collected on ${dayToDate(x.day)}${x.accuracy !== undefined && x.accuracy !== null ? ` with a quest score of ${Math.round(x.accuracy * 100)} %` : ''}.`),
    h('a', { class: 'btn', href: `#/dest/${d.id}` }, 'Open this stop'));
  return openModal({ title: `${d.name_en} stamp`, id: 'stamp-detail', body, actions: [{ label: 'Close', value: true, kind: 'primary', cancel: true }] });
}

export async function journalScreen({ ctx }) {
  let content;
  try { content = await ctx.getContent(); await loadOpened(ctx, content); } catch (e) { return errorCard(e); }
  ctx.setScene(null);
  const st = ctx.store.state; const j = st.journal; const t = today();
  const states = destinationStates(st.progress, content);
  const stops = content.route.map((id) => content.destById.get(id));
  const got = stops.filter((d) => j.stamps[d.rewards.stamp_id]);
  const host = h('div', { class: 'stack' },
    h('div', { class: 'page-hero', style: 'min-height:110px' }, h('p', { class: 'eyebrow' }, 'Travel journal'), h('h1', null, 'Stamp book'),
      h('p', { class: 'lead', style: 'margin:0' }, got.length ? `${got.length} of ${stops.length} stamps collected.` : 'Your book is empty, for now.')),
    progress((100 * got.length) / stops.length, { label: 'Stamps collected', gold: true }));
  if (!got.length) host.append(h('div', { class: 'card tint' }, h('strong', null, 'How to get your first stamp'), h('p', { style: 'margin:4px 0 0' }, 'Finish all the units a stop needs, then pass its main quest. The stamp is pressed into this book and a postcard arrives.'), h('a', { class: 'btn primary', href: '#/explore', style: 'margin-top:8px' }, icon('map', { size: 18 }), 'Open the map')));
  for (const L of LEVELS) {
    const list = stops.filter((d) => d.first_visit_level === L);
    if (!list.length) continue;
    const n = list.filter((d) => j.stamps[d.rewards.stamp_id]).length;
    host.append(h('section', { 'aria-label': `${L} stamps` }, h('div', { class: 'row between' }, h('h2', { style: 'margin:8px 0' }, `${L} stops`), h('span', { class: 'chip sakura' }, `${n} of ${list.length}`)),
      h('div', { class: 'stamp-book' }, list.map((d) => {
        const x = j.stamps[d.rewards.stamp_id];
        if (x) return h('button', { class: 'stamp stamp-cell', type: 'button', 'data-stamp': d.id, title: 'Open stamp details', onclick: () => stampDetail(ctx, content, d, x) }, stampSvg(d, { day: x.day, tier: x.tier, motifs: SCENES[d.id]?.motifs }), h('span', { class: 'small' }, d.name_en));
        const locked = ['visible_locked', 'discoverable', 'hidden'].includes(states[d.id].state);
        return h('a', { class: 'stamp-cell empty-slot', href: `#/dest/${d.id}`, 'data-slot': d.id }, stampSvg(d, { ghost: true }), h('span', { class: 'small muted' }, locked ? icon('lock', { size: 12 }) : null, locked ? ' ' : null, d.name_en, locked ? h('span', { class: 'sr-only' }, ' (stop locked)') : null));
      }))));
  }
  // postcards
  const cards = Object.values(j.postcards);
  host.append(h('section', { class: 'card', 'aria-labelledby': 'pc-title' }, h('h3', { id: 'pc-title' }, 'Postcards'), cards.length ? h('div', { class: 'stack' }, cards.map((p) => { const d = content.destById.get(p.destination); return h('div', { class: 'postcard' }, sceneSvg(d.id, { name: d.name_en, done: new Set(Object.keys(st.progress.units)) }), h('p', { class: 'small' }, `Greetings from ${d.name_en} · ${dayToDate(p.day)}`)); })) : h('p', { class: 'muted', style: 'margin:0' }, 'A postcard arrives with your first stamp at each stop.')));
  // milestones & achievements
  const ach = content.core.achievements;
  host.append(h('section', { class: 'card', 'aria-labelledby': 'ms-title' }, h('div', { class: 'row between' }, h('h3', { id: 'ms-title', style: 'margin:0' }, 'Milestones'), h('a', { class: 'btn small', href: '#/achievements' }, icon('trophy', { size: 18 }), `Achievements ${Object.keys(j.achievements).length}/${ach.length}`)),
    h('ul', { style: 'margin:8px 0 0' }, h('li', null, `${Object.keys(st.progress.lessons).length} lesson(s) completed`), h('li', null, `${Object.keys(st.progress.units).length} unit(s) completed`), ...Object.keys(j.achievements).map((id) => h('li', null, ach.find((a) => a.id === id)?.name || id)))));
  // cultural discoveries
  const visited = content.destinations.filter((d) => st.progress.destinations[d.id]?.completedAt !== undefined);
  host.append(h('section', { class: 'card', 'aria-labelledby': 'cd-title' }, h('h3', { id: 'cd-title' }, 'Cultural discoveries'), visited.length ? h('ul', null, visited.map((d) => h('li', null, h('strong', null, `${d.name_en}: `), d.cultural_note.text, ' ', h('span', { class: 'chip warn' }, 'Unverified')))) : h('p', { class: 'muted', style: 'margin:0' }, 'Notes about places appear here after you complete them. They are shown as unverified until fact-checked.')));
  // how rewards work (rules, stated honestly)
  const ring = weeklyRing(j, t, st.settings.weeklyGoalDays); const stk = streak(j, t);
  host.append(h('section', { class: 'card', id: 'how-rewards', 'aria-labelledby': 'hr-title' }, h('h3', { id: 'hr-title' }, 'How rewards work'),
    h('dl', { class: 'kv' },
      h('dt', null, 'Your XP'), h('dd', null, String(j.xp.total)),
      h('dt', null, 'Streak'), h('dd', null, `${stk.days} day${stk.days === 1 ? '' : 's'}`),
      h('dt', null, 'This week'), h('dd', null, `${ring.effectiveDays} of ${ring.goal} study days`)),
    h('details', null, h('summary', null, 'What earns XP'), h('p', null, `A lesson gives up to ${XP_BASE.lesson} XP, a review ${XP_BASE.review}, a quest ${XP_BASE.quest}, a practice set ${XP_BASE.practice}, an exam section ${XP_BASE.mock_section}. Better accuracy gives more. Repeating the same activity more than twice gives nothing, and each kind of activity has a daily cap (for example lessons ${XP_DAY_CAP.lesson}), so XP cannot be farmed by repeating one thing.`)),
    h('details', null, h('summary', null, 'How the streak is counted'), h('p', null, 'A study day is a day on which you complete a core session or practise for at least 15 minutes. The streak counts consecutive study days ending today or yesterday. A single missed day is bridged automatically, at most once every 7 days. You can turn streaks off in Settings.')),
    h('details', null, h('summary', null, 'Why a stop is locked'), h('p', null, 'Stops open when you finish the units they need (shown on each stop). A stop is complete, and its stamp awarded once, when its units are done and you pass its main quest at the stated score. Geography never unlocks anything.')),
    h('details', null, h('summary', null, 'Can I earn something twice?'), h('p', null, 'No. Each stamp, postcard and achievement can be earned once. Reloading, replaying a quest or tapping repeatedly does not add a second copy.'))));
  return host;
}

export async function achievementsScreen({ ctx }) {
  let content;
  try { content = await ctx.getContent(); await loadOpened(ctx, content); } catch (e) { return errorCard(e); }
  ctx.setScene(null);
  const j = ctx.store.state.journal; const ach = content.core.achievements;
  const earnedN = Object.keys(j.achievements).length;
  return h('div', { class: 'stack' }, h('div', { class: 'page-hero', style: 'min-height:110px' }, h('p', { class: 'eyebrow' }, 'Travel journal'), h('h1', null, 'Achievements'), h('p', { class: 'lead', style: 'margin:0' }, `${earnedN} of ${ach.length} earned`)),
    progress((100 * earnedN) / ach.length, { gold: true, label: 'Achievements earned' }),
    h('p', { class: 'small muted' }, 'Each one is earned through practice evidence, never for just opening the app. N5 milestone text says internal progress: it is not JLPT certification.'),
    h('ul', { class: 'menu' }, ach.map((a) => { const got = j.achievements[a.id]; return h('li', { class: 'card', 'data-ach': a.id, 'data-earned': got ? '1' : '0' }, h('div', { class: 'row between' }, h('strong', null, a.name), got ? h('span', { class: 'chip ok' }, `✔ earned ${dayToDate(got.day)}`) : h('span', { class: 'chip' }, icon('lock', { size: 12 }), 'not yet')), h('p', { class: 'small', style: 'margin:6px 0 0' }, `How: ${a.rule}`)); })));
}
export { emptyState };
