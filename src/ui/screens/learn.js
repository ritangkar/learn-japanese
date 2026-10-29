import { h } from '../dom.js';
import { icon } from '../icons.js';
import { weekDots } from './home.js';
import { weeklyRing } from '../../engine/gamification.js';
import { today } from '../env.js';
import { emptyState } from '../components.js';
import { currentPlan, blockHref, flowState, nextBlock, completeCore } from '../flow.js';
import { errorCard } from '../common.js';
import { dayToDate } from '../../core/clock.js';
import { exportReminder } from '../../core/backup.js';

const ICON = { review: 'refresh', lesson: 'book', contrast: 'target', leech: 'target', listening_drill: 'headphones', construction_drill: 'pen', mixed_practice: 'sparkle', listening: 'headphones', reading: 'exam', quest: 'map', exam_practice: 'exam', revisit: 'back', extension: 'plus' };
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
  const ring0 = weeklyRing(store.state.journal, today(), store.state.settings.weeklyGoalDays);
  const host = h('div', { class: 'stack' }, h('div', { class: 'page-hero', style: 'min-height:150px' }, h('p', { class: 'eyebrow' }, 'Learn'), h('h1', null, "Today's itinerary"), h('p', { class: 'lead', style: 'margin:0' }, core.length ? `About ${p.totalCoreMinutes} minutes · ${core.length} step${core.length === 1 ? '' : 's'}` : 'Nothing is due today.')),
    store.state.settings.gamification === 'off' ? null : h('div', { class: 'card flat tint row between' }, h('span', { class: 'small' }, `${ring0.effectiveDays} of ${ring0.goal} study days this week`), weekDots(store.state.journal, today(), ring0.goal)));
  if (p.mode !== 'normal') host.append(h('div', { class: 'banner info', role: 'note' }, p.notes.join(' ')));
  else for (const n of p.notes) host.append(h('p', { class: 'muted' }, n));
  const rem = exportReminder(store, Date.now());
  if (rem && !ctx.ui.hideExportNudge) host.append(h('div', { class: 'banner info' }, rem === 'never' ? 'You have progress but no backup yet. ' : 'It has been a while since your last backup. ', h('a', { href: '#/backup' }, 'Back up now'), ' (one tap; the file stays on your device).'));
  if (p.recommendation) host.append(h('div', { class: 'banner info' }, p.recommendation.direction === 'lower' ? `Your recent sessions average about ${Math.round(p.recommendation.avg)} minutes. Would a ${p.recommendation.suggest}-minute daily goal feel better? ` : `You often study about ${Math.round(p.recommendation.avg)} minutes. You could raise your goal to ${p.recommendation.suggest}. `, h('a', { href: '#/settings' }, 'Open settings'), ' (nothing changes automatically).'));
  if (!core.length) host.append(emptyState({ icon: 'compass', title: 'All caught up', text: 'Nothing is due today and there is no new lesson available right now. You can practise kana, browse the library or explore the map any time.', action: h('div', { class: 'row' }, h('a', { class: 'btn primary', href: '#/kana' }, 'Kana trainer'), h('a', { class: 'btn', href: '#/explore' }, 'Explore Japan')) }));
  else {
    if (next) host.append(h('a', { class: 'btn primary block', id: 'start-today', href: blockHref(next) }, icon('play', { size: 18 }), `Start today: ${next.title}`));
    else host.append(h('a', { class: 'btn primary block', href: '#/summary' }, 'Finish today'));
  }
  const card = (b) => h('div', { class: 'card block-card step-card', dataset: { block: b.id, done: fl.done.has(b.id) ? '1' : '0' } },
    h('span', { class: 'step-ico' }, icon(fl.done.has(b.id) ? 'check' : (ICON[b.type] || 'star'), { size: 22 })),
    h('div', { class: 'row between' }, h('strong', null, b.title), h('span', { class: 'chip' }, icon('clock', { size: 12 }), `${b.minutes} min`)),
    h('div', { class: 'row' }, h('span', { class: 'chip info' }, TYPE_LABEL[b.type] || b.type), fl.done.has(b.id) ? h('span', { class: 'chip ok' }, 'Done today') : null),
    h('details', null, h('summary', null, 'Why this?'), h('p', { class: 'why' }, b.reason_text, ` (rule ${b.reason_code})`)),
    h('a', { class: 'btn', href: blockHref(b) }, fl.done.has(b.id) ? 'Do again' : 'Start'));
  core.forEach((b) => host.append(card(b)));
  if (core.length || opt.length) host.append(h('div', { class: 'divider', role: 'separator' }, 'Optional: you are free to stop above this line'));
  opt.forEach((b) => host.append(card(b)));
  if (core.length && !ext) host.append(h('button', { class: 'btn block', type: 'button', onclick: () => { ctx.showExtension = true; ctx.rerender(); } }, 'Keep going: show optional extras'));
  host.append(h('section', { 'aria-labelledby': 'more-title' }, h('h3', { id: 'more-title' }, 'More ways to practise'), h('nav', { class: 'quick-grid', 'aria-label': 'More practice' }, h('a', { href: '#/kana' }, icon('pen'), h('strong', null, 'Kana trainer'), h('span', { class: 'small muted' }, 'Hiragana, katakana')), h('a', { href: '#/library' }, icon('book'), h('strong', null, 'Library'), h('span', { class: 'small muted' }, 'Words, grammar, kanji')), h('a', { href: '#/speak' }, icon('volume'), h('strong', null, 'Speaking'), h('span', { class: 'small muted' }, 'Repeat after the voice')), h('a', { href: '#/jlpt' }, icon('exam'), h('strong', null, 'JLPT area'), h('span', { class: 'small muted' }, 'Levels and mock exams')))));
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
  return h('div', { class: 'stack' }, h('div', { class: 'completion' }, h('div', { class: 'badge' }, icon('trophy', { size: 40 })), h('h2', { style: 'margin:0' }, 'Today is done')),
    h('div', { class: 'stat-row' }, h('div', { class: 'card stat gold' }, icon('star', { fill: true }), h('b', null, String(j.xp.total)), h('span', { class: 'lbl' }, 'XP')), h('div', { class: 'card stat' }, icon('clock'), h('b', null, String(Math.round(fl.minutes))), h('span', { class: 'lbl' }, 'minutes today')), h('div', { class: 'card stat' }, icon('stamp'), h('b', null, String(Object.keys(j.stamps).length)), h('span', { class: 'lbl' }, 'stamps'))),
    h('div', { class: 'card' }, h('h3', null, 'Next time'), p.blocks.filter((b) => b.core).slice(0, 2).map((b) => h('p', null, `${TYPE_LABEL[b.type] || b.type}: ${b.title}`)), h('p', { class: 'small muted' }, 'You can stop here. Anything below is optional.')),
    h('button', { class: 'btn block', type: 'button', onclick: () => { ctx.showExtension = true; location.hash = '#/learn'; } }, 'Keep going (optional extras)'), h('a', { class: 'btn primary block', href: '#/' }, 'Back to Home'));
}
