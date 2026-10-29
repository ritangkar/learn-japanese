import { h } from '../dom.js';
import { errorCard } from '../common.js';
import { currentPlan, nextBlock, blockHref } from '../flow.js';
import { weeklyRing } from '../../engine/gamification.js';
import { today } from '../env.js';
import { destinationStates } from '../../engine/progress.js';

export async function homeScreen({ ctx }) {
  let content;
  try { content = await ctx.getContent(); } catch (e) { return errorCard(e); }
  const st = ctx.store.state; const t = today();
  const ring = weeklyRing(st.journal, t, st.settings.weeklyGoalDays);
  const states = destinationStates(st.progress, content);
  const cur = content.destById.get(st.progress.currentDestination) || content.destinations[0];
  const { next } = nextBlock(ctx, content);
  void currentPlan;
  return h('div', { class: 'stack' },
    h('div', { class: 'card tint' }, h('div', { class: 'small muted' }, 'You are in'), h('h2', null, `${cur.name_en} `, h('span', { class: 'ja', lang: 'ja' }, cur.name_ja)), h('div', { class: 'chip' }, content.regionById.get(cur.region_id)?.name_en), ' ', h('span', { class: 'chip info' }, states[cur.id].state.replace('_', ' ')),
      h('div', { class: 'row' }, h('a', { class: 'btn primary', id: 'start-today', href: next ? blockHref(next) : '#/learn' }, 'Start today'), h('a', { class: 'btn', href: `#/dest/${cur.id}` }, 'This stop'))),
    st.settings.gamification === 'off' ? null : h('div', { class: 'card' }, `This week: ${ring.effectiveDays} of ${ring.goal} study days`));
}
