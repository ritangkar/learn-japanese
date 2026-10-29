// Unfinished exam attempt card: shared by Home, the JLPT area and the exam screen. Shows what the attempt is, how far you got, how much
// time is left, and what Resume and Discard will do. Discard always asks first.
import { h } from './dom.js';
import { icon } from './icons.js';
import { progress, confirmDialog } from './components.js';
import { resumeInfo, remainingMs } from '../engine/exam.js';

export const mmss = (ms) => { const t = Math.max(0, Math.round(ms / 1000)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; };

export function attemptSummary(a, now = Date.now()) {
  const info = resumeInfo(a, now);
  const totalQ = a.sections.reduce((n, s) => n + s.questionIds.length, 0);
  const answered = a.sections.reduce((n, s) => n + Object.keys(s.answers || {}).length, 0);
  const cur = a.sections[a.current];
  return { info, totalQ, answered, section: cur.name, sectionIndex: a.current + 1, sections: a.sections.length, state: cur.state, running: cur.state === 'active', expired: info.expired, remaining: cur.state === 'active' ? remainingMs(cur, now) : null, title: a.src?.title || a.level, lastSaved: a.savedAt };
}

/**
 * @param {object} ctx @param {object} a the live attempt (store.state.examlive)
 * @param {{onDiscarded?:()=>void}} opts
 */
export function attemptCard(ctx, a, { onDiscarded } = {}) {
  const sm = attemptSummary(a);
  const pct = sm.totalQ ? (100 * sm.answered) / sm.totalQ : 0;
  const timeLine = sm.state === 'pending' ? 'Not started yet: the clock starts when you press Start section.' : sm.expired ? 'Time for this section ran out while you were away. It will be submitted as it stands when you resume.' : sm.running ? `${mmss(sm.remaining)} left in this section. The clock kept running while you were away.` : 'Between sections.';
  return h('section', { class: 'attempt-card', id: 'attempt-card', 'aria-labelledby': 'attempt-title' },
    h('div', { class: 'row between' }, h('div', null, h('p', { class: 'eyebrow' }, 'Unfinished attempt'), h('h3', { id: 'attempt-title', style: 'margin:0' }, sm.title)), h('span', { class: 'chip warn' }, icon('clock', { size: 14 }), sm.running ? mmss(sm.remaining) : 'paused')),
    h('p', { style: 'margin:0' }, `${sm.section} · section ${sm.sectionIndex} of ${sm.sections}`),
    h('div', { class: 'meta' }, h('div', null, 'Answered', h('b', null, `${sm.answered} of ${sm.totalQ}`)), h('div', null, 'Last saved', h('b', null, sm.lastSaved ? new Date(sm.lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'just now'))),
    progress(pct, { label: 'Questions answered', thin: true }),
    h('p', { class: 'small muted', style: 'margin:0' }, timeLine),
    h('div', { class: 'row' },
      h('a', { class: 'btn primary', href: '#/exam?resume=1', id: 'resume-attempt' }, icon('play', { size: 18 }), 'Resume'),
      h('button', { class: 'btn danger', type: 'button', id: 'discard-attempt', onclick: async () => {
        const ok = await confirmDialog({ title: 'Discard this attempt?', text: `Your ${sm.answered} saved answer${sm.answered === 1 ? '' : 's'} in "${sm.title}" will be deleted and the attempt will not be scored. This cannot be undone. Your learning progress and earlier results are not affected.`, confirmLabel: 'Discard attempt', cancelLabel: 'Keep it', danger: true });
        if (!ok) return;
        ctx.store.setDomain('examlive', null); ctx.store.flush(); onDiscarded ? onDiscarded() : ctx.rerender();
      } }, icon('trash', { size: 18 }), 'Discard')));
}
