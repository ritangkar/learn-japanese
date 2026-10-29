// Session runner: runs a list of questions with progress, retry-later queue (max 2 asks per item), answer recording and a summary.
import { h, mount } from './dom.js';
import { renderQuestion } from './exercise.js';
import { applyAnswers } from '../engine/session.js';
import { localDay } from '../core/clock.js';
import { pctText } from './format.js';
import { icon } from './icons.js';
import { ring } from './components.js';

/** Apply one answer to the store (SRS facets, attempts, confusion counters). */
export function recordAnswer(ctx, q, result, latencyMs) {
  if (result.skipped) return;
  const { store } = ctx;
  const now = Date.now();
  const today = localDay(now);
  const res = applyAnswers(store.state, [{ q, result, latencyMs }], { today, nowMinutes: Math.floor(now / 60000), retention: store.state.settings.retentionTarget });
  if (res.records.length) store.putFacets(res.records);
  if (res.attempts.length) store.pushAttempts(res.attempts);
  if (res.concepts !== store.state.concepts) store.setDomain('concepts', res.concepts);
}

/**
 * @param {object} ctx app context; @param {object} env exercise env
 * @param {{title:string, questions:object[], retryWrong?:boolean, record?:boolean, onFinish:(summary)=>void, timedSeconds?:number, header?:Node}} opts
 */
export function runSession(ctx, env, opts) {
  const host = h('div', { class: 'session', dataset: { session: opts.title } });
  const queue = opts.questions.map((q) => ({ q, asks: 0 }));
  const answers = []; // first-ask results, for scoring
  let index = 0; let total = queue.length; let timer = null;
  const bar = h('div', { class: 'bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(total), 'aria-valuenow': '0', 'aria-label': 'Progress' }, h('i'));
  const counter = h('span', { class: 'small muted', 'aria-live': 'off' });
  const stage = h('div', { class: 'stage' });
  host.append(h('div', { class: 'session-head' }, h('div', { class: 'row between' }, h('strong', null, opts.title), counter), bar), opts.header || null, stage);
  let finished = false;
  ctx.leaveGuard = () => !finished && answers.length > 0;

  function setProgress() {
    const done = Math.min(index, total);
    bar.firstChild.style.width = `${total ? (100 * done) / total : 0}%`;
    bar.setAttribute('aria-valuenow', String(done)); bar.setAttribute('aria-valuemax', String(total));
    counter.textContent = `${Math.min(index + 1, total)} of ${total}`;
  }
  function next() {
    clearInterval(timer);
    if (index >= queue.length) return finish();
    setProgress();
    const item = queue[index];
    item.asks++;
    ctx.audio.setListeningMode(!!item.q.stem.audio_text);
    let answeredNow = false;
    const view = renderQuestion(item.q, env, {
      onChecked: ({ response, result, latencyMs }) => {
        answeredNow = true; clearInterval(timer);
        if (opts.record !== false) recordAnswer(ctx, item.q, result, latencyMs);
        if (item.asks === 1 && !result.skipped) answers.push({ q: item.q, response, result, latencyMs });
        else if (item.asks === 1 && result.skipped) total = Math.max(0, total - 1);
        ctx.audio.sfx(result.correct ? 'fb_correct' : 'fb_incorrect');
        if (!result.correct && !result.skipped && opts.retryWrong !== false && item.asks < 2) queue.push({ q: item.q, asks: 1 });
      },
      onContinue: () => { index++; next(); },
    });
    mount(stage, view);
    if (opts.timedSeconds) startTimer(view, () => answeredNow);
    const first = view.querySelector('input, .choice, button');
    if (first) { if (first.isConnected) first.focus({ preventScroll: true }); else setTimeout(() => { if (first.isConnected) first.focus({ preventScroll: true }); }, 0); } // focus now, or right after the first question is attached
    window.scrollTo(0, 0);
  }
  function startTimer(view, isAnswered) {
    const secs = Math.round(opts.timedSeconds * (ctx.store.state.settings.extendedTime ? 1.5 : 1));
    let left = secs;
    const label = h('div', { class: 'timer chip info', role: 'timer', 'aria-label': 'Time left' }, `${left} s`);
    view.prepend(label);
    timer = setInterval(() => {
      left--; label.textContent = `${left} s`;
      if (left === 10 || left === 5) ctx.announce(`${left} seconds left`);
      if (left <= 0 && !isAnswered()) { clearInterval(timer); const skip = view.querySelector('.ex-footer .btn'); void skip; const q = queue[index].q; const result = { correct: false, score: 0, timeout: true, expected: q.answer, explanation: q.explanation_correct }; if (opts.record !== false) recordAnswer(ctx, q, result, secs * 1000); if (queue[index].asks === 1) answers.push({ q, response: null, result, latencyMs: secs * 1000 }); index++; ctx.announce('Time is up for this question.'); next(); }
    }, 1000);
  }
  function finish() {
    finished = true; ctx.leaveGuard = null;
    clearInterval(timer);
    ctx.audio.setListeningMode(false);
    const correct = answers.filter((a) => a.result.correct).length;
    const totalN = answers.length;
    const accuracy = totalN ? correct / totalN : 0;
    const summary = { correct, total: totalN, accuracy, answers };
    index = total; setProgress();
    bar.firstChild.style.width = '100%';
    opts.onFinish(summary, stage);
  }
  next();
  return host;
}

export function summaryCard({ title, summary, passMark = null, actions = [] }) {
  const pass = passMark === null ? null : summary.accuracy >= passMark;
  return h('div', { class: 'card summary completion', role: 'status', 'aria-live': 'polite' },
    h('div', { class: 'badge' }, icon(pass === false ? 'refresh' : 'check', { size: 40 })),
    h('h2', { style: 'margin:0' }, title),
    ring({ value: summary.correct, max: Math.max(1, summary.total), label: pctText(summary.accuracy), sub: 'correct', size: 96, gold: pass !== false }),
    h('p', { class: 'big', style: 'margin:0' }, `${summary.correct} of ${summary.total} correct (${pctText(summary.accuracy)})`),
    pass === null ? null : h('p', { class: `banner ${pass ? 'ok' : 'info'}` }, pass ? `You reached the ${pctText(passMark)} goal.` : `You need ${pctText(passMark)} to continue. Review the explanation and try again: mistakes are how memory is built.`),
    h('div', { class: 'row', style: 'justify-content:center;width:100%' }, actions));
}
