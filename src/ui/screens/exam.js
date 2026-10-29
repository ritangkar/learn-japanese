import { h } from '../dom.js';
import { renderQuestion } from '../exercise.js';
import { makeEnv, today } from '../env.js';
import { errorCard } from '../common.js';
import * as ex from '../../engine/exam.js';
import { checkAnswer } from '../../engine/check.js';
import { recordLevelEvidence, tryUnlockNext } from '../../engine/progress.js';
import { PARAMS } from '../../engine/params.js';
import { earned } from '../../engine/achievements.js';
import { awardReward, awardXp } from '../../engine/progress.js';
import { MOCK_DISCLAIMER, RESULT_LABEL } from '../labels.js';
import { pctText } from '../format.js';

const mmss = (ms) => { const s = Math.ceil(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const FACET = { vocabulary: 'm', grammar: 'c', reading: 'r', listening: 'l' };

/** Create the attempt (persisted as `examlive`) and go to the runner. */
export function beginExam(ctx, { kind, level, mock, questionIds, mockId = null, group = null, minutes = null, title }) {
  const sections = mock ? mock.sections : [{ id: 'practice', official_section_name: title, minutes, question_ids: questionIds }];
  const id = `${kind}_${level}_${Date.now().toString(36)}`;
  const base = ex.createAttempt({ id, mock: { id: mockId || id, level, sections }, now: Date.now(), kind, practiceMode: kind !== 'mock', extendedTime: !!ctx.store.state.settings.extendedTime && kind !== 'mock' ? true : (!!ctx.store.state.settings.extendedTime) });
  const a = { ...base, src: { kind, level, mockId, group, title } };
  ctx.store.setDomain('examlive', a);
  ctx.store.flush();
  location.hash = '#/exam';
}

export async function examScreen({ ctx }) {
  let content;
  try { content = await ctx.getContent(); } catch (e) { return errorCard(e); }
  let a = ctx.store.state.examlive;
  if (!a) return h('div', { class: 'card' }, h('p', null, 'There is no exam in progress.'), h('a', { class: 'btn', href: '#/jlpt' }, 'JLPT area'));
  const level = a.src.level; const levelDef = content.jlpt.levels.find((l) => l.level === level);
  try { await content.ensureLevel(level); } catch (e) { return errorCard(e); }
  let mockFile = null;
  if (a.src.mockId) { try { mockFile = await content.loadMock(a.src.mockId); } catch (e) { return errorCard(e); } }
  const questions = new Map([...content.questions, ...(mockFile?.questions || [])].map((q) => [q.id, q]));
  const passages = new Map([...content.passages, ...(mockFile?.passages || [])].map((p) => [p.id, p]));
  const env = makeEnv(ctx, content, { seed: a.id, exam: true, extra: { passages } });
  env.canPlay = (key) => ex.canPlay(a, key);
  env.recordPlay = (key) => { a = ex.recordPlay(a, key); persist(); };
  const host = h('div', { class: 'stack exam', id: 'exam' });
  const top = h('div', { class: 'card exam-top' });
  const body = h('div', { class: 'stack' });
  host.append(top, body);
  let timerEl; let interval = null; let qIndex = 0; let results = null;
  const persist = () => ctx.store.setDomain('examlive', a);
  const sec = () => a.sections[a.current];

  function tickLoop() {
    clearInterval(interval);
    interval = setInterval(() => {
      const now = Date.now(); const s = sec();
      if (s.state !== 'active') return;
      const before = a;
      a = ex.tick(a, now);
      if (a !== before && sec().state === 'submitted') { ctx.announce('Time is up. The section was submitted.'); afterSection(); return; }
      const w = ex.warnings(s, now);
      if (w.five && !s._w5) { s._w5 = true; ctx.announce('Five minutes remaining.'); }
      if (w.one && !s._w1) { s._w1 = true; ctx.announce('One minute remaining.'); }
      if (timerEl) { timerEl.textContent = mmss(ex.remainingMs(s, now)); timerEl.classList.toggle('low', ex.remainingMs(s, now) <= 60000); }
      if (ex.autosaveDue(a, now)) { a = { ...a, savedAt: now }; persist(); ctx.store.flush(); }
    }, 1000);
  }

  function header() {
    const s = sec();
    timerEl = h('span', { class: 'timer chip info', role: 'timer', 'aria-label': 'Time left in this section', id: 'exam-timer' }, mmss(ex.remainingMs(s, Date.now())));
    top.replaceChildren(h('div', { class: 'row between' }, h('strong', null, `${a.src.title || a.level} · ${s.name}`), s.state === 'active' ? timerEl : null),
      h('p', { class: 'small muted' }, a.kind === 'mock' ? MOCK_DISCLAIMER : 'Practice set. Practice estimate only.'),
      a.extendedTime ? h('p', { class: 'small' }, 'Extra time (x1.5) is on for this practice (Settings).') : null);
  }

  function showResume() {
    const info = ex.resumeInfo(a, Date.now());
    body.replaceChildren(h('div', { class: 'card' }, h('h2', null, 'Unfinished attempt'), h('p', null, `${a.src.title || a.level} · ${info.section}. ${info.expired ? 'The time for this section ran out while you were away, so it will be submitted as it stands.' : `${mmss(info.remainingMs)} remaining. The timer kept running while you were away.`}`),
      h('div', { class: 'row' }, h('button', { class: 'btn primary', id: 'exam-resume', type: 'button', onclick: () => { start(); } }, 'Resume'), h('button', { class: 'btn danger', type: 'button', onclick: () => { ctx.store.setDomain('examlive', null); ctx.store.flush(); location.hash = '#/jlpt'; } }, 'Discard this attempt'))));
    top.replaceChildren(h('strong', null, 'Exam'));
  }

  function start() {
    if (a.finished) return showResults();
    const s = sec();
    if (s.state === 'pending') return showIntro();
    if (s.state === 'submitted') return afterSection();
    a = ex.tick(a, Date.now());
    if (sec().state === 'submitted') return afterSection();
    tickLoop(); header(); showQuestion();
  }
  function showIntro() {
    const s = sec(); header();
    const hasListening = s.questionIds.some((id) => questions.get(id)?.stem.audio_text);
    const status = hasListening ? ctx.audio.status() : null;
    body.replaceChildren(h('div', { class: 'card' }, h('h2', null, s.name), h('p', null, `${s.questionIds.length} question(s) · ${s.minutes} minute(s)${a.extendedTime ? ' (x1.5 with extra time)' : ''}`),
      a.kind === 'mock' ? h('p', { class: 'small' }, 'Once you submit a section it is locked, like a separate paper section. You can move freely within a section and flag questions to come back to. The attempt is saved every 30 seconds; the clock keeps running if you leave.') : null,
      hasListening ? h('div', { class: `banner ${status.hasJapaneseVoice ? 'info' : 'warn'}` }, status.hasJapaneseVoice ? 'Listening uses your device\'s synthetic voice, not native-speaker exam audio. Each item can be played once in mock mode.' : 'No Japanese voice was found on this device, so listening items show a transcript instead and are not a real listening test.') : null,
      a.current > 0 ? h('div', null, h('label', { for: 'break-min' }, 'Break before this section (optional, 0 to 15 minutes)'), h('input', { type: 'number', id: 'break-min', min: 0, max: 15, value: 0 })) : null,
      h('button', { class: 'btn primary', id: 'start-section', type: 'button', onclick: () => { const bm = Number(document.getElementById('break-min')?.value || 0); if (bm > 0) return breakTimer(bm); begin(); } }, 'Start section')));
  }
  function breakTimer(min) {
    let left = min * 60; const out = h('p', { class: 'big', role: 'timer' }, mmss(left * 1000));
    const t = setInterval(() => { left--; out.textContent = mmss(left * 1000); if (left <= 0) { clearInterval(t); begin(); } }, 1000);
    body.replaceChildren(h('div', { class: 'card' }, h('h2', null, 'Break'), out, h('button', { class: 'btn', type: 'button', onclick: () => { clearInterval(t); begin(); } }, 'End break now')));
  }
  function begin() { a = ex.startSection(a, Date.now(), a.current); persist(); qIndex = 0; tickLoop(); header(); showQuestion(); }

  function grid() {
    const s = sec();
    return h('div', { class: 'qgrid', role: 'group', 'aria-label': 'Question navigator' }, ex.grid(s).map((g, i) => h('button', { class: `btn small qg ${g.state}${i === qIndex ? ' cur' : ''}`, type: 'button', 'data-q': String(g.n), 'data-state': g.state, 'aria-label': `Question ${g.n}, ${g.state}`, 'aria-current': i === qIndex ? 'true' : null, onclick: () => { qIndex = i; showQuestion(); } }, `${g.n}${g.state === 'answered' ? ' ✔' : g.state === 'flagged' ? ' ⚑' : ''}`)));
  }
  function showQuestion() {
    const s = sec(); const qid = s.questionIds[qIndex]; const q = questions.get(qid);
    if (!q) { body.replaceChildren(h('p', null, `Question ${qid} is missing from the content on this device.`)); return; }
    ctx.audio.setListeningMode(sec().questionIds.some((id) => questions.get(id)?.stem.audio_text) && true);
    const view = renderQuestion(q, env, { initial: s.answers[qid], onChange: (resp) => { a = ex.answer(a, qid, resp, Date.now()); persist(); refreshGrid(); }, onChecked: () => {}, onContinue: () => {} });
    const flagged = !!s.flags[qid];
    const nav = h('div', { class: 'row' },
      h('button', { class: 'btn', type: 'button', id: 'q-prev', disabled: qIndex === 0, onclick: () => { qIndex--; showQuestion(); } }, 'Previous'),
      h('button', { class: 'btn', type: 'button', id: 'q-next', disabled: qIndex === s.questionIds.length - 1, onclick: () => { qIndex++; showQuestion(); } }, 'Next'),
      h('button', { class: 'btn', type: 'button', id: 'q-flag', 'aria-pressed': String(flagged), onclick: () => { a = ex.toggleFlag(a, qid); persist(); showQuestion(); } }, flagged ? '⚑ Flagged' : '⚐ Flag for review'),
      h('button', { class: 'btn primary', type: 'button', id: 'q-submit', onclick: () => reviewPrompt() }, 'Review and submit'));
    body.replaceChildren(h('p', { class: 'small muted' }, `Question ${qIndex + 1} of ${s.questionIds.length}`), grid(), view, nav);
  }
  function refreshGrid() { const old = body.querySelector('.qgrid'); if (old) old.replaceWith(grid()); }
  function reviewPrompt() {
    const s = sec(); const un = ex.unanswered(s); const fl = s.questionIds.filter((id) => s.flags[id]);
    body.replaceChildren(h('div', { class: 'card', id: 'submit-prompt' }, h('h2', null, 'Submit this section?'), h('p', null, un.length ? `${un.length} question(s) are still unanswered.` : 'Every question has an answer.'), fl.length ? h('p', null, `${fl.length} question(s) are flagged for review.`) : null,
      h('p', { class: 'small muted' }, a.kind === 'mock' ? 'After you submit, this section is locked.' : 'Practice sets lock after submit too, so the result is honest.'),
      h('div', { class: 'row' }, h('button', { class: 'btn', type: 'button', onclick: () => { qIndex = Math.max(0, s.questionIds.indexOf(un[0] || fl[0] || s.questionIds[0])); showQuestion(); } }, 'Go back to questions'), h('button', { class: 'btn primary', id: 'confirm-submit', type: 'button', onclick: () => { a = ex.submitSection(a, Date.now()); persist(); afterSection(); } }, 'Submit section'))));
  }
  function afterSection() {
    clearInterval(interval); ctx.audio.setListeningMode(false);
    if (a.sections.every((x) => x.state === 'submitted')) { a = { ...a, finished: true }; persist(); return showResults(); }
    a = ex.nextSection(a, Date.now()); persist(); showIntro();
  }

  function showResults() {
    clearInterval(interval);
    const all = a.sections.flatMap((s) => s.questionIds).map((id) => questions.get(id)).filter(Boolean);
    results = ex.score(a, all, levelDef, checkAnswer);
    const day = today();
    // persist once: summary, attempts rows, evidence, unlock check
    const summary = ex.summarize(a, results, day);
    const already = ctx.store.state.exams.attempts.some((x) => x.id === a.id);
    let message = null;
    if (!already) {
      ctx.store.update('exams', (e) => ({ attempts: [...e.attempts, summary].slice(-200) }));
      const rows = []; const minute = Math.floor(Date.now() / 60000);
      for (const p of results.perQuestion) { const q = questions.get(p.id); if (!q) continue; const grp = ex.skillGroup(q); for (const t of (q.targets || []).filter((x) => /^(ka_|v_|kj_|g_)/.test(x)).slice(0, 1)) rows.push([minute, t, FACET[grp] || 'r', p.correct ? 1 : 0, 0, q.type, 0]); }
      if (rows.length) ctx.store.pushAttempts(rows);
      const overall = ex.overallPercent(results);
      let progress = ctx.store.state.progress; let journal = ctx.store.state.journal;
      const kindOf = a.src.kind;
      if (kindOf === 'readiness') {
        const groups = results.groups.filter((g) => g.total > 0);
        const bySkill = {}; for (const p of results.perQuestion) { const q = questions.get(p.id); const g = ex.skillGroup(q); (bySkill[g] ||= []).push(p.correct ? 1 : 0); }
        const skillOk = Object.values(bySkill).every((v) => v.reduce((x, y) => x + y, 0) / v.length >= PARAMS.level_unlock.readiness_group_min);
        const passed = overall / 100 >= PARAMS.level_unlock.readiness_pass && skillOk && groups.length > 0;
        progress = recordLevelEvidence(progress, level, { readinessScore: overall / 100, ...(passed ? { readinessPassedAt: day } : {}) });
        message = passed ? `Readiness check passed (${pctText(overall / 100)}, every skill group at 50 % or more).` : `Readiness check not passed yet (${pctText(overall / 100)}). You need ${pctText(PARAMS.level_unlock.readiness_pass)} overall and every skill group at ${pctText(PARAMS.level_unlock.readiness_group_min)} or more. Review and try again.`;
      }
      if (kindOf === 'milestone' || kindOf === 'mock') { progress = recordLevelEvidence(progress, level, { milestoneBest: overall / 100 }); if (kindOf === 'milestone') message = overall / 100 >= PARAMS.level_unlock.milestone_pass ? `Milestone practice reached ${pctText(overall / 100)} (goal ${pctText(PARAMS.level_unlock.milestone_pass)}, a heuristic, not an official threshold).` : `Milestone practice: ${pctText(overall / 100)}. The goal is ${pctText(PARAMS.level_unlock.milestone_pass)} (a heuristic, not an official threshold).`; }
      const x = awardXp(journal, { type: kindOf === 'mock' ? 'mock_section' : 'practice', key: `exam:${a.id}`, accuracy: overall / 100, day }); journal = x.journal;
      ctx.store.setDomain('progress', progress); ctx.store.setDomain('journal', journal);
      const st = { ...ctx.store.state };
      for (const aid of earned(st, content, day)) { const r = awardReward(ctx.store.state.journal, `ach:${aid}`, 'achievement', { id: aid }, { day, summary: aid }); ctx.store.setDomain('journal', r.journal); }
      const un = tryUnlockNext(ctx.store.state, content, level, day, day);
      if (un.unlocked) { ctx.store.setDomain('progress', un.state.progress); message = `${message ? `${message} ` : ''}${un.criteria.next} is now unlocked. This is internal progress, not JLPT certification.`; ctx.audio.sfx('fb_destination_unlock'); }
      ctx.store.setDomain('examlive', null); ctx.store.flush();
    }
    top.replaceChildren(h('strong', null, `${a.src.title || a.level}: results`));
    const g = results.groups;
    body.replaceChildren(h('div', { class: 'card', id: 'exam-results' }, h('h2', null, RESULT_LABEL), h('p', { class: 'small' }, a.kind === 'mock' ? MOCK_DISCLAIMER : 'Practice set, original content.'),
      h('table', null, h('thead', null, h('tr', null, ['Scoring group', 'Correct', 'Practice %'].map((x) => h('th', { scope: 'col' }, x)))), h('tbody', null, g.map((x) => h('tr', null, h('th', { scope: 'row' }, x.label), h('td', null, `${x.correct} of ${x.total}`), h('td', null, x.percent === null ? '—' : `${x.percent} %`))))),
      results.band ? h('p', null, h('strong', null, results.bandLabel), '. These bands are our own rule of thumb (70 % or more in every group is "on track"); they are not a JLPT result and make no pass or fail claim.') : null,
      results.balanceText ? h('p', { class: 'banner warn' }, results.balanceText) : null, message ? h('p', { class: 'banner info', id: 'exam-message' }, message) : null,
      h('p', { class: 'small' }, `Unanswered: ${results.unanswered}. Time used: ${results.timePerSection.map((t) => `${Math.round(t.usedMs / 60000)} of ${Math.round(t.allottedMs / 60000)} min`).join(', ')}.`),
      Object.keys(results.byType).length ? h('details', null, h('summary', null, 'By question type'), h('ul', null, Object.entries(results.byType).map(([k, v]) => h('li', null, `${k}: ${v.correct} of ${v.total}`)))) : null,
      h('p', { class: 'small muted' }, 'Official JLPT scores are scaled and equated and cannot be reproduced from practice results.')),
      h('div', { class: 'card' }, h('h3', null, 'Review your answers'), results.perQuestion.map((p, i) => { const q = questions.get(p.id); return h('details', { class: 'review-q' }, h('summary', null, `${i + 1}. ${p.correct ? '✔ correct' : p.answered ? '✘ wrong' : '— unanswered'}${p.flagged ? ' ⚑' : ''}`), h('p', null, q.stem.prompt), q.stem.ja ? h('p', { class: 'ja ja-lg', lang: 'ja' }, q.stem.ja) : null, q.explanation_correct ? h('p', { class: 'small' }, q.explanation_correct) : null); })),
      h('div', { class: 'row' }, h('a', { class: 'btn primary', href: `#/jlpt/${level}` }, `Back to ${level}`), h('a', { class: 'btn', href: '#/readiness' }, 'Readiness dashboard')));
    ctx.audio.setListeningMode(false);
  }
  ctx.cleanup = () => { clearInterval(interval); };
  showResume();
  return host;
}
