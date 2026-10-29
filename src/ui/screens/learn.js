import { h } from '../dom.js';
import { currentPlan, blockHref, flowState, nextBlock, completeCore } from '../flow.js';
import { errorCard } from '../common.js';
import { dayToDate } from '../../core/clock.js';
import { exportReminder } from '../../core/backup.js';

const ICON = { review: '🔁', lesson: '📖', contrast: '⚖', leech: '🪝', listening_drill: '👂', construction_drill: '🧩', mixed_practice: '🎯', listening: '👂', reading: '📄', quest: '🗺', exam_practice: '📝', revisit: '↩', extension: '➕' };
const TYPE_LABEL = { review: 'Review', lesson: 'New lesson', contrast: 'Tell apart', leech: 'Stubborn items', listening_drill: 'Listening drill', construction_drill: 'Build sentences', mixed_practice: 'Mixed practice', listening: 'Listening', reading: 'Reading', quest: 'Quest step', exam_practice: 'Exam-style practice', revisit: 'Revisit', extension: 'Extra' };

export async function learnScreen({ ctx }) {
  let content;
  try { content = await ctx.getContent(); } catch (e) { return errorCard(e); }
  const { store } = ctx;
  const ext = ctx.showExtension === true;
  const p = currentPlan(ctx, content, { extension: ext });
  const fl = flowState(ctx);
  const core = p.blocks.filter((b) => b.core); const opt = p.blocks.filter((b) => !b.core);
  const { next } = nextBlock(ctx, content);
  const host = h('div', { class: 'stack' }, h('h2', null, "Today's itinerary"));
  if (p.mode !== 'normal') host.append(h('div', { class: 'banner info', role: 'note' }, p.notes.join(' ')));
  else for (const n of p.notes) host.append(h('p', { class: 'muted' }, n));
  const rem = exportReminder(store, Date.now());
  if (rem && !ctx.ui.hideExportNudge) host.append(h('div', { class: 'banner info' }, rem === 'never' ? 'You have progress but no backup yet. ' : 'It has been a while since your last backup. ', h('a', { href: '#/backup' }, 'Back up now'), ' (one tap; the file stays on your device).'));
  if (p.recommendation) host.append(h('div', { class: 'banner info' }, p.recommendation.direction === 'lower' ? `Your recent sessions average about ${Math.round(p.recommendation.avg)} minutes. Would a ${p.recommendation.suggest}-minute daily goal feel better? ` : `You often study about ${Math.round(p.recommendation.avg)} minutes. You could raise your goal to ${p.recommendation.suggest}. `, h('a', { href: '#/settings' }, 'Open settings'), ' (nothing changes automatically).'));
  if (!core.length) host.append(h('div', { class: 'card' }, h('p', null, 'Nothing is due today and there is no new lesson available right now.'), h('p', { class: 'muted small' }, 'See Content status for which units are released. You can practise kana or browse the library any time.'), h('a', { class: 'btn', href: '#/kana' }, 'Kana trainer')));
  else {
    host.append(h('p', { class: 'muted' }, `About ${p.totalCoreMinutes} minutes · ${core.length} step${core.length === 1 ? '' : 's'}`));
    if (next) host.append(h('a', { class: 'btn primary block', id: 'start-today', href: blockHref(next) }, `Start today: ${next.title}`));
    else host.append(h('a', { class: 'btn primary block', href: '#/summary' }, 'Finish today'));
  }
  const card = (b) => h('div', { class: 'card block-card', dataset: { block: b.id, done: fl.done.has(b.id) ? '1' : '0' } },
    h('div', { class: 'row between' }, h('strong', null, `${ICON[b.type] || '•'} ${b.title}`), h('span', { class: 'chip' }, `${b.minutes} min`)),
    h('span', { class: 'chip info' }, TYPE_LABEL[b.type] || b.type), fl.done.has(b.id) ? h('span', { class: 'chip ok' }, '✔ done today') : null,
    h('details', null, h('summary', null, 'Why this?'), h('p', { class: 'why' }, b.reason_text, ` (rule ${b.reason_code})`)),
    h('a', { class: 'btn', href: blockHref(b) }, fl.done.has(b.id) ? 'Do again' : 'Start'));
  core.forEach((b) => host.append(card(b)));
  if (core.length || opt.length) host.append(h('div', { class: 'divider', role: 'separator' }, 'Optional: you are free to stop above this line'));
  opt.forEach((b) => host.append(card(b)));
  if (core.length && !ext) host.append(h('button', { class: 'btn block', type: 'button', onclick: () => { ctx.showExtension = true; ctx.rerender(); } }, 'Keep going: show optional extras'));
  host.append(h('div', { class: 'card' }, h('h3', null, 'More practice'), h('div', { class: 'grid2' }, h('a', { class: 'btn', href: '#/kana' }, 'Kana trainer'), h('a', { class: 'btn', href: '#/library' }, 'Library'), h('a', { class: 'btn', href: '#/speak' }, 'Speaking practice'), h('a', { class: 'btn', href: '#/jlpt' }, 'JLPT area'))));
  host.append(h('p', { class: 'small muted' }, `Plan for ${dayToDate(p.day)}. The plan is computed on your device from your own progress; the same progress always gives the same plan.`));
  return host;
}

export async function summaryScreen({ ctx }) {
  let content;
  try { content = await ctx.getContent(); } catch (e) { return errorCard(e); }
  const { store } = ctx; const fl = flowState(ctx);
  completeCore(ctx);
  const p = currentPlan(ctx, content);
  const j = store.state.journal;
  return h('div', { class: 'stack' }, h('h2', null, '🎉 Today is done'),
    h('div', { class: 'stat-row' }, h('div', { class: 'card stat' }, h('b', null, String(j.xp.total)), 'XP'), h('div', { class: 'card stat' }, h('b', null, String(Math.round(fl.minutes))), 'minutes today'), h('div', { class: 'card stat' }, h('b', null, String(Object.keys(j.stamps).length)), 'stamps')),
    h('div', { class: 'card' }, h('h3', null, 'Next time'), p.blocks.filter((b) => b.core).slice(0, 2).map((b) => h('p', null, `${TYPE_LABEL[b.type] || b.type}: ${b.title}`)), h('p', { class: 'small muted' }, 'You can stop here. Anything below is optional.')),
    h('button', { class: 'btn block', type: 'button', onclick: () => { ctx.showExtension = true; location.hash = '#/learn'; } }, 'Keep going (optional extras)'), h('a', { class: 'btn primary block', href: '#/' }, 'Back to the map'));
}
