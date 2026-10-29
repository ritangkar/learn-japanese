import { h } from '../dom.js';
import { jaNode, romajiHint, pctText } from '../format.js';
import { runSession, summaryCard } from '../session.js';
import { makeEnv, today } from '../env.js';
import { buildPart } from '../../engine/sets.js';
import { completeLesson, unitProgress } from '../../engine/progress.js';
import { earned } from '../../engine/achievements.js';
import { awardReward } from '../../engine/progress.js';
import { back, errorCard, loading, levelChip } from '../common.js';
import { nextBlock, finishBlock, blockHref, elapsedMinutes } from '../flow.js';
import { showRomajiForKana } from '../../engine/mastery.js';
import { kanaStrokeNote } from './kana-data.js';

function kanaCells(lesson, content, env) {
  const ids = lesson.introduces.kana || [];
  if (!ids.length) return null;
  return h('div', null, h('h3', null, 'New kana'), h('div', { class: 'kana-grid', role: 'list' }, ids.map((id) => {
    const k = content.kanaById.get(id);
    const showR = showRomajiForKana(env.settings.romajiMode, env.store.state.srs, id, env.today());
    return h('button', { class: 'btn kana-cell', type: 'button', role: 'listitem', lang: 'ja', 'aria-label': `${k.char}, sounds like ${k.romaji}. Tap to hear.`, onclick: () => env.audio.speak(k.char) }, k.char, showR ? h('small', { 'aria-hidden': 'true' }, k.romaji) : null);
  })), h('p', { class: 'small muted' }, 'Tap a kana to hear it (synthetic device voice). ', kanaStrokeNote));
}
function wordList(lesson, content, env) {
  const ids = lesson.introduces.vocab || [];
  if (!ids.length) return null;
  return h('div', null, h('h3', null, 'New words'), h('ul', { class: 'wordlist' }, ids.map((id) => {
    const v = content.vocabById.get(id);
    return h('li', { class: 'row between' }, h('span', null, jaNode(v.surface, { known: env.known, cls: 'ja-lg' }), ' ', romajiHint(v.reading_kana, env, 'romaji muted small inline'), h('span', { class: 'muted' }, ` — ${v.meanings_en.join('; ')}`), v.note ? h('div', { class: 'small muted' }, v.note) : null), h('button', { class: 'btn small', type: 'button', 'aria-label': `Hear ${v.reading_kana}`, onclick: () => env.audio.speak(v.reading_kana) }, '▶'));
  })));
}

export async function lessonScreen({ ctx, params, query }) {
  let content;
  try { content = await ctx.getContent(); } catch (e) { return errorCard(e); }
  const lesson = content.lessonById.get(params.id);
  if (!lesson) return h('div', null, h('p', null, 'This lesson is not available (it may not be released yet).'), back('#/learn', 'Learn'));
  const flow = query.flow === '1';
  let attempt = ctx.lessonAttempts?.[lesson.id] || 0;
  let seed = `${today()}|${attempt}`;
  const env = makeEnv(ctx, content, { seed });
  const started = Date.now();
  const host = h('div', { class: 'stack' });
  const unit = content.unitById.get(lesson.unit_id);

  const head = h('div', { class: 'lesson-head' }, back(flow ? '#/learn' : `#/learn`, 'Learn'), h('h2', null, lesson.title), levelChip(lesson.instructional_level));
  host.append(head, h('div', { class: 'card tint' }, h('strong', null, 'Why this matters: '), lesson.goal));

  let stage = 0; const stages = ['explain', 'practice', 'context', 'exit_check'].filter((s) => s === 'explain' || (lesson[s] && ((lesson[s].question_ids || []).length || (lesson[s].gen || []).length)));
  const area = h('div', { class: 'stack' });
  host.append(area);

  function showExplain(i = 0) {
    const b = lesson.explain[i];
    area.replaceChildren(
      i === 0 ? kanaCells(lesson, content, env) : null,
      i === 0 ? wordList(lesson, content, env) : null,
      h('div', { class: 'card' }, h('h3', null, b.heading), b.body.map((p) => h('p', null, p)), (b.examples || []).map((e) => h('div', { class: 'example' }, jaNode(e.ja, { known: env.known, cls: 'ja-lg' }), e.reading ? h('div', { class: 'small muted' }, e.reading) : null, h('div', null, e.en)))),
      h('div', { class: 'row' }, i > 0 ? h('button', { class: 'btn', type: 'button', onclick: () => showExplain(i - 1) }, 'Previous') : null,
        i < lesson.explain.length - 1 ? h('button', { class: 'btn primary', type: 'button', onclick: () => showExplain(i + 1) }, 'Next') : h('button', { class: 'btn primary', type: 'button', onclick: () => next() }, 'Start practice')));
    ctx.announce(`${b.heading}`);
  }
  function next() { stage++; run(); }
  function run() {
    const part = stages[stage];
    if (part === 'explain') return showExplain();
    const qs = buildPart(lesson, part, content, seed);
    const label = { practice: 'Guided practice', context: 'Using it in context', exit_check: 'Exit check' }[part];
    const passMark = part === 'exit_check' ? (lesson.exit_check.pass ?? 0.7) : null;
    const sess = runSession(ctx, env, { title: label, questions: qs, retryWrong: part !== 'exit_check', header: part === 'exit_check' ? h('p', { class: 'small muted' }, `Reach ${pctText(passMark)} to complete the lesson.`) : null,
      onFinish: (summary, stageEl) => {
        const isLast = stage === stages.length - 1;
        if (part === 'exit_check') return finishLesson(summary, stageEl, passMark);
        stageEl.replaceChildren(summaryCard({ title: `${label} done`, summary, actions: [h('button', { class: 'btn primary', type: 'button', onclick: () => next() }, isLast ? 'Finish' : 'Continue')] }));
      } });
    area.replaceChildren(sess);
  }
  function finishLesson(summary, stageEl, passMark) {
    if (summary.accuracy < passMark) {
      attempt += 1; seed = `${today()}|${attempt}`; env.seed = seed;
      ctx.lessonAttempts = { ...(ctx.lessonAttempts || {}), [lesson.id]: attempt };
      stageEl.replaceChildren(summaryCard({ title: 'Exit check', summary, passMark, actions: [h('button', { class: 'btn primary', type: 'button', onclick: () => { stage = stages.indexOf('exit_check'); run(); } }, 'Try again'), h('button', { class: 'btn', type: 'button', onclick: () => { stage = 0; run(); } }, 'Read the explanation again')] }));
      return;
    }
    const st = ctx.store.state;
    const res = completeLesson(st, content, lesson.id, { score: summary.accuracy, day: today() });
    ctx.store.setDomain('progress', res.state.progress);
    let journal = res.state.journal;
    if (res.newRecords.length) ctx.store.putFacets(res.newRecords);
    const merged = { ...ctx.store.state, progress: res.state.progress, journal };
    for (const id of earned(merged, content, today())) { const a = content.core.achievements.find((x) => x.id === id); const r = awardReward(journal, `ach:${id}`, 'achievement', { id }, { day: today(), summary: a?.name }); journal = r.journal; if (r.awarded) res.events.push({ type: 'achievement', id, name: a?.name }); }
    ctx.store.setDomain('journal', journal);
    ctx.store.flush();
    ctx.audio.sfx('fb_lesson_complete');
    finishBlock(ctx, 'new_lesson', elapsedMinutes(started));
    const up = unitProgress(ctx.store.state.progress, content, unit.id);
    const evs = res.events;
    stageEl.replaceChildren(h('div', { class: 'card summary', role: 'status' },
      h('h2', null, '🎉 Lesson complete'), h('p', { class: 'big' }, `${summary.correct} of ${summary.total} correct (${pctText(summary.accuracy)})`),
      evs.filter((e) => e.type === 'xp').map((e) => h('p', null, `+${e.amount} XP`)),
      h('p', null, `${unit.title}: ${up.done} of ${up.total} lessons done.`),
      evs.filter((e) => e.type === 'unit_completed').map(() => h('p', { class: 'banner ok' }, `Unit complete: ${unit.title}`)),
      evs.filter((e) => e.type === 'stamp').map((e) => h('p', { class: 'banner ok' }, `New stamp: ${content.destById.get(e.destination)?.name_en}!`)),
      evs.filter((e) => e.type === 'achievement').map((e) => h('p', { class: 'banner ok' }, `Achievement: ${e.name}`)),
      h('p', { class: 'small muted' }, 'The words and kana you just learned are now scheduled for review.'),
      h('div', { class: 'row' }, nextAction(ctx, content, flow))));
    ctx.announce('Lesson complete.');
  }
  run();
  return host;
}

function nextAction(ctx, content, flow) {
  if (!flow) return [h('a', { class: 'btn primary', href: '#/learn' }, 'Back to today')];
  const { next } = nextBlock(ctx, content);
  return next ? [h('a', { class: 'btn primary', href: blockHref(next) }, `Next: ${next.title}`), h('a', { class: 'btn', href: '#/learn' }, 'Stop here')] : [h('a', { class: 'btn primary', href: '#/summary' }, 'Finish today')];
}
export { nextAction, loading };
