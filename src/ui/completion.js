// Completion screen shared by lessons and quests: accuracy ring, rewards actually earned this time, stamp / achievement lines,
// and the next recommended action. It only reports what the engine awarded (events); it never invents rewards.
import { h } from './dom.js';
import { icon } from './icons.js';
import { ring } from './components.js';
import { stampSvg } from '../map/stamps.js';
import { SCENES } from '../map/scenes.js';
import { pctText } from './format.js';

export function completionView({ ctx, content, title, subtitle = null, summary, events = [], passMark = null, lines = [], actions = [], stampEvents = null }) {
  const xp = events.filter((e) => e.type === 'xp').reduce((n, e) => n + (e.amount || 0), 0);
  const stamps = stampEvents || events.filter((e) => e.type === 'stamp');
  const ach = events.filter((e) => e.type === 'achievement');
  const passed = passMark === null ? true : summary.accuracy >= passMark;
  const tile = (icn, value, label) => h('div', { class: 'reward-tile' }, icon(icn, { size: 20 }), h('b', null, value), h('span', { class: 'small muted' }, label));
  const view = h('section', { class: 'card summary completion', role: 'status', 'aria-live': 'polite' },
    h('div', { class: 'badge' }, icon(passed ? 'trophy' : 'refresh', { size: 40 })),
    h('h2', { style: 'margin:0' }, title),
    subtitle ? h('p', { class: 'muted', style: 'margin:0' }, subtitle) : null,
    ring({ value: summary.correct, max: Math.max(1, summary.total), label: pctText(summary.accuracy), sub: 'correct', size: 96, gold: passed }),
    h('p', { class: 'big', style: 'margin:0' }, `${summary.correct} of ${summary.total} correct (${pctText(summary.accuracy)})`),
    passMark !== null ? h('p', { class: `banner ${passed ? 'ok' : 'info'}` }, passed ? `You reached the ${pctText(passMark)} goal.` : `You need ${pctText(passMark)} to continue. Read the explanations and try again: mistakes are how memory is built.`) : null,
    h('div', { class: 'rewards' }, tile('star', `+${xp} XP`, 'earned'), tile('stamp', String(stamps.length), stamps.length === 1 ? 'stamp' : 'stamps'), tile('trophy', String(ach.length), ach.length === 1 ? 'achievement' : 'achievements')),
    ...stamps.map((e) => { const d = content.destById.get(e.destination); return h('div', { class: 'banner ok', style: 'width:100%' }, h('div', { style: 'width:64px;flex:none' }, stampSvg(d, { day: ctx.store.state.journal.stamps[d.rewards.stamp_id]?.day ?? null, motifs: SCENES[d.id]?.motifs })), h('div', null, h('strong', null, `Stamp earned: ${d.name_en}`), h('div', { class: 'small' }, 'A postcard was added to your journal. ', h('a', { href: '#/journal' }, 'Open the stamp book')))); }),
    ...ach.map((e) => h('p', { class: 'banner ok', style: 'width:100%;margin:0' }, icon('trophy', { size: 18 }), `Achievement: ${e.name}`)),
    ...lines,
    h('div', { class: 'row', style: 'justify-content:center;width:100%' }, actions));
  if (stamps.length) setTimeout(async () => { for (const e of stamps) await ctx.celebrateStamp(content, e.destination); }, 350);
  return view;
}
