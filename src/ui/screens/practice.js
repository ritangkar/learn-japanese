import { h } from '../dom.js';
import { runSession, summaryCard } from '../session.js';
import { makeEnv, today } from '../env.js';
import { currentPlan, nextBlock, blockHref, finishBlock, elapsedMinutes, flowState } from '../flow.js';
import { errorCard, back } from '../common.js';
import { reviewSet } from '../../engine/sets.js';
import { generate } from '../../engine/generators.js';
import { shuffle } from '../../engine/prng.js';
import { recordQuestResult, awardReward } from '../../engine/progress.js';
import { earned } from '../../engine/achievements.js';
import { pctText } from '../format.js';
import { decode } from '../../engine/srs.js';

const afterBlock = (ctx, content, flow) => {
  if (!flow) return [h('a', { class: 'btn primary', href: '#/learn' }, 'Back to today')];
  const { next } = nextBlock(ctx, content);
  return next ? [h('a', { class: 'btn primary', href: blockHref(next) }, `Next: ${next.title}`), h('a', { class: 'btn', href: '#/learn' }, 'Stop here')] : [h('a', { class: 'btn primary', href: '#/summary' }, 'Finish today')];
};
function awardAch(ctx, content) {
  let journal = ctx.store.state.journal; const out = [];
  for (const id of earned(ctx.store.state, content, today())) { const a = content.core.achievements.find((x) => x.id === id); const r = awardReward(journal, `ach:${id}`, 'achievement', { id }, { day: today(), summary: a?.name }); journal = r.journal; if (r.awarded) out.push(a?.name); }
  if (out.length) ctx.store.setDomain('journal', journal);
  return out;
}

/** Apply the plan's deferrals (E01 / welcome-back) once, when a review session starts. */
export function applyDeferrals(ctx, plan) {
  if (!plan.deferrals.length) return;
  const recs = plan.deferrals.map((d) => { const r = ctx.store.state.srs[d.key]; if (!r) return null; const c = [...r]; c[1] = d.due; return c; }).filter(Boolean);
  if (recs.length) ctx.store.putFacets(recs);
}

export async function reviewScreen({ ctx, query }) {
  let content;
  try { content = await ctx.getContent(); } catch (e) { return errorCard(e); }
  const flow = query.flow === '1'; const started = Date.now();
  const p = currentPlan(ctx, content);
  const block = p.blocks.find((b) => b.type === 'review');
  if (!block) return h('div', { class: 'stack' }, h('h2', null, 'Reviews'), h('div', { class: 'card' }, h('p', null, 'Nothing is due right now. Nice and tidy.'), afterBlock(ctx, content, flow)));
  applyDeferrals(ctx, p);
  const env = makeEnv(ctx, content, { seed: `${today()}|review` });
  const qs = reviewSet(block.items, content, env.seed, today());
  const isComeback = p.mode === 'comeback' || p.mode === 'welcome_back';
  const sess = runSession(ctx, env, { title: isComeback ? 'Comeback review' : 'Reviews', questions: qs, retryWrong: true,
    header: isComeback ? h('div', { class: 'banner info' }, p.notes.join(' ')) : null,
    onFinish: (summary, stage) => {
      let extra = [];
      if (isComeback) { const j = ctx.store.state.journal; ctx.store.setDomain('journal', { ...j, comebackDone: [...new Set([...j.comebackDone, today()])] }); extra = awardAch(ctx, content); }
      finishBlock(ctx, 'review', elapsedMinutes(started));
      stage.replaceChildren(summaryCard({ title: 'Review done', summary, actions: afterBlock(ctx, content, flow) }), ...extra.map((n) => h('p', { class: 'banner ok' }, `Achievement: ${n}`)));
      ctx.audio.sfx('fb_lesson_complete');
    } });
  return h('div', { class: 'stack' }, back('#/learn', 'Learn'), sess);
}

export async function activityScreen({ ctx, params, query }) {
  let content;
  try { content = await ctx.getContent(); } catch (e) { return errorCard(e); }
  const flow = query.flow === '1'; const started = Date.now();
  const item = params.kind === 'listening' ? content.listeningById.get(params.id) : content.passageById.get(params.id);
  if (!item) return h('p', null, 'This activity is not available.');
  const env = makeEnv(ctx, content, { seed: `${today()}|${params.id}` });
  const qs = item.question_ids.map((id) => content.questionById.get(id)).filter(Boolean);
  const sess = runSession(ctx, env, { title: item.title || (params.kind === 'listening' ? 'Listening' : 'Reading'), questions: qs, retryWrong: false,
    onFinish: (summary, stage) => { finishBlock(ctx, 'lr', elapsedMinutes(started)); stage.replaceChildren(summaryCard({ title: 'Done', summary, actions: afterBlock(ctx, content, flow) })); } });
  return h('div', { class: 'stack' }, back('#/learn', 'Learn'), sess);
}

export async function questScreen({ ctx, params, query }) {
  let content;
  try { content = await ctx.getContent(); } catch (e) { return errorCard(e); }
  const flow = query.flow === '1'; const started = Date.now();
  const quest = content.quests.find((q) => q.id === params.id);
  if (!quest) return h('div', null, h('p', null, 'This quest is not available (its content is not released yet).'), back('#/', 'Map'));
  const dest = content.destById.get(quest.destination_id);
  const qType = content.core.quest_types.find((t) => t.id === quest.type);
  const attempt = (ctx.questAttempts?.[quest.id] || 0);
  const env = makeEnv(ctx, content, { seed: `${today()}|${quest.id}|${attempt}` });
  const qs = shuffle(quest.question_ids.map((id) => content.questionById.get(id)).filter(Boolean), env.seed);
  ctx.store.setDomain('progress', { ...ctx.store.state.progress, destinations: { ...ctx.store.state.progress.destinations, [dest.id]: { ...(ctx.store.state.progress.destinations[dest.id] || {}), startedAt: ctx.store.state.progress.destinations[dest.id]?.startedAt ?? today() } } });
  const sess = runSession(ctx, env, { title: `${dest.name_en}: ${qType?.name || 'Quest'}`, questions: qs, retryWrong: false,
    header: h('p', { class: 'small muted' }, `${qType?.objective_template || ''} Reach ${pctText(quest.min_accuracy)} to earn the stamp. Each item can be retried at most twice.`),
    onFinish: (summary, stage) => {
      const res = recordQuestResult(ctx.store.state, content, quest.id, { accuracy: summary.accuracy, items: summary.total, day: today() });
      ctx.store.setDomain('progress', res.state.progress); ctx.store.setDomain('journal', res.state.journal);
      const ach = awardAch(ctx, content);
      ctx.store.flush();
      finishBlock(ctx, 'quest', elapsedMinutes(started));
      const stamp = res.events.find((e) => e.type === 'stamp');
      if (stamp) ctx.audio.sfx('fb_stamp');
      ctx.questAttempts = { ...(ctx.questAttempts || {}), [quest.id]: attempt + 1 };
      stage.replaceChildren(summaryCard({ title: 'Quest result', summary, passMark: quest.min_accuracy, actions: [...(summary.accuracy < quest.min_accuracy ? [h('a', { class: 'btn', href: `#/quest/${quest.id}${flow ? '?flow=1' : ''}`, onclick: () => setTimeout(() => ctx.rerender(), 0) }, 'Try again')] : []), ...afterBlock(ctx, content, flow)] }),
        stamp ? h('div', { class: 'banner ok', role: 'status' }, `🎫 Stamp earned: ${dest.name_en}! A postcard was added to your journal.`) : null,
        res.state.progress.destinations[dest.id]?.completedAt ? null : (summary.accuracy >= quest.min_accuracy ? h('p', { class: 'banner info' }, 'Quest passed. The stamp arrives once all units for this stop are complete.') : null),
        ...ach.map((n) => h('p', { class: 'banner ok' }, `Achievement: ${n}`)));
    } });
  return h('div', { class: 'stack' }, back(`#/dest/${dest.id}`, dest.name_en), sess);
}

export async function drillScreen({ ctx, params, query }) {
  let content;
  try { content = await ctx.getContent(); } catch (e) { return errorCard(e); }
  const flow = query.flow === '1'; const started = Date.now();
  const p = currentPlan(ctx, content);
  const block = p.blocks.find((b) => b.type === params.type);
  const env = makeEnv(ctx, content, { seed: `${today()}|drill|${params.type}` });
  let qs = [];
  const gctx = { kana: content.kana, vocab: content.vocab, seed: env.seed };
  if (params.type === 'contrast' && block) {
    for (const pair of block.pairs.slice(0, 2)) {
      for (const id of pair.split('|')) {
        const t = id.startsWith('ka_') ? 'kana_recog' : 'vocab_meaning';
        qs.push(...generate({ type: t, from: id.startsWith('ka_') ? 'kana' : 'vocab', ids: [id], n: 2 }, gctx).map((q) => ({ ...q, type: q.type })));
      }
    }
  } else if (params.type === 'leech' && block) {
    qs = block.items.flatMap((k) => { const id = k.split(':')[0]; return id.startsWith('ka_') ? generate({ type: 'kana_recog', from: 'kana', ids: [id], n: 2 }, gctx) : generate({ type: 'flashcard', from: 'vocab', ids: [id], n: 1 }, gctx); });
  } else if (params.type === 'listening_drill' && block) {
    qs = block.items.flatMap((k) => { const id = k.split(':')[0]; return id.startsWith('ka_') ? generate({ type: 'kana_listen', from: 'kana', ids: [id], n: 1 }, gctx) : generate({ type: 'word_listen', from: 'vocab', ids: [id], n: 1 }, gctx); });
  } else if (params.type === 'construction_drill') {
    qs = content.questions.filter((q) => ['sentence_order', 'fill_blank', 'construct'].includes(q.type)).slice(0, 8);
  } else {
    // mixed practice: items from lessons already completed (spiral), reviewed facets first
    const done = content.lessons.filter((l) => ctx.store.state.progress.lessons[l.id]);
    const vocabIds = [...new Set(done.flatMap((l) => l.introduces.vocab || []))];
    const kanaIds = [...new Set(done.flatMap((l) => l.introduces.kana || []))];
    qs = [...(kanaIds.length ? generate({ type: 'kana_recog', from: 'kana', ids: kanaIds, n: 4 }, gctx) : []), ...(vocabIds.length ? generate({ type: 'vocab_meaning', from: 'vocab', ids: vocabIds, n: 4 }, gctx) : []), ...(vocabIds.length ? generate({ type: 'word_listen', from: 'vocab', ids: vocabIds, n: 2 }, gctx) : [])];
    qs = shuffle(qs, env.seed);
  }
  if (!qs.length) return h('div', { class: 'stack' }, h('h2', null, 'Practice'), h('div', { class: 'card' }, h('p', null, 'There is nothing to practise here yet.'), afterBlock(ctx, content, flow)));
  const titles = { contrast: 'Tell them apart', leech: 'Stubborn items', listening_drill: 'Listening drill', construction_drill: 'Build sentences', mixed_practice: 'Mixed practice' };
  const sess = runSession(ctx, env, { title: titles[params.type] || 'Practice', questions: qs, retryWrong: true,
    onFinish: (summary, stage) => {
      if (params.type === 'leech' && block) { /* items stay available; the learner can park them from the library */ }
      finishBlock(ctx, block?.id || params.type, elapsedMinutes(started));
      stage.replaceChildren(summaryCard({ title: 'Practice done', summary, actions: afterBlock(ctx, content, flow) }));
    } });
  const park = params.type === 'leech' && block ? h('div', { class: 'card' }, h('p', null, 'These items keep slipping. You can leave them for a week; they will come back with no penalty.'), h('button', { class: 'btn', type: 'button', onclick: (e) => { const parked = { ...ctx.store.state.concepts.parked }; for (const k of block.items) parked[k] = today() + 7; ctx.store.setDomain('concepts', { ...ctx.store.state.concepts, parked }); e.currentTarget.textContent = 'Parked for 7 days'; e.currentTarget.disabled = true; } }, 'Park these for 7 days')) : null;
  return h('div', { class: 'stack' }, back('#/learn', 'Learn'), park, sess);
}

export { decode, flowState };
