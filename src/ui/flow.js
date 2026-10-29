// "Start today" flow: runs the plan's core blocks in order. Block completion lives in memory for the current day (the plan itself
// is recomputed from saved state, so finished reviews/lessons disappear naturally).
import { plan } from '../engine/planner.js';
import { recordSession } from '../engine/progress.js';
import { today } from './env.js';

export function currentPlan(ctx, content, opts = {}) {
  return plan(ctx.store.state, content, Date.now(), { tzOffsetMinutes: new Date().getTimezoneOffset(), ...opts });
}
export function flowState(ctx) {
  const d = today();
  if (!ctx.flow || ctx.flow.day !== d) ctx.flow = { day: d, done: new Set(), started: null, minutes: 0 };
  return ctx.flow;
}
export function blockHref(b, flow = true) {
  const f = flow ? '?flow=1' : '';
  switch (b.type) {
    case 'lesson': return `#/lesson/${b.lessonId}${f}`;
    case 'review': return `#/review${f}`;
    case 'listening': case 'reading': return `#/activity/${b.type}/${b.itemId}${f}`;
    case 'quest': return `#/quest/${b.questId}${f}`;
    case 'contrast': case 'leech': case 'listening_drill': case 'construction_drill': case 'mixed_practice': return `#/drill/${b.type}${f}`;
    case 'exam_practice': return `#/jlpt/${b.level}`;
    case 'revisit': return `#/dest/${b.destinationId}`;
    default: return '#/learn';
  }
}
export function nextBlock(ctx, content) {
  const fl = flowState(ctx);
  const p = currentPlan(ctx, content);
  return { plan: p, next: p.blocks.find((b) => b.core && !fl.done.has(b.id)) || null };
}
/** Called when a block finishes: tracks minutes and marks it done. */
export function finishBlock(ctx, blockId, minutes) {
  const fl = flowState(ctx);
  if (blockId) fl.done.add(blockId);
  fl.minutes += minutes;
  const day = today();
  const j = recordSession(ctx.store.state.journal, { day, minutes, coreCompleted: false });
  ctx.store.setDomain('journal', j);
}
export function completeCore(ctx) {
  const fl = flowState(ctx); const day = today();
  ctx.store.setDomain('journal', recordSession(ctx.store.state.journal, { day, minutes: 0, coreCompleted: true }));
  fl.coreDone = true;
}
export function elapsedMinutes(startMs) { return Math.max(0.1, Math.round(((Date.now() - startMs) / 60000) * 10) / 10); }
