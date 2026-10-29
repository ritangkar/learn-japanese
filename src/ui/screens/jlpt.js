import { h } from '../dom.js';
import { icon } from '../icons.js';
import { progress as progressBar } from '../components.js';
import { attemptCard } from '../attempt-card.js';
import { errorCard, back, levelChip } from '../common.js';
import { LEVEL_LABEL, NOT_JLPT, MOCK_DISCLAIMER } from '../labels.js';
import { levelCriteria, levelState } from '../../engine/progress.js';
import { PARAMS } from '../../engine/params.js';
import { readiness, examPlanner, NO_DATA } from '../../engine/readiness.js';
import { practicePool, stratified } from '../../engine/sets.js';
import { skillGroup, sectionPracticeMinutes } from '../../engine/exam.js';
import { beginExam } from './exam.js';
import { today } from '../env.js';
import { pctText } from '../format.js';

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
const GROUP_LABEL = { vocabulary: 'Vocabulary', grammar: 'Grammar', reading: 'Reading', listening: 'Listening' };
const STATE_TEXT = { locked: 'Locked', unlocked: 'Open', in_progress: 'In progress', curriculum_complete: 'Curriculum complete', readiness_passed: 'Readiness check passed', milestone_practice_done: 'All unlock criteria met' };
const SECTION_FOR_GROUP = (levelDef, g) => { const ids = levelDef.test_sections.map((s) => s.id); if (ids.includes('lk_reading') && g !== 'listening') return 'lk_reading'; return { vocabulary: 'vocab', grammar: 'grammar_reading', reading: 'grammar_reading', listening: 'listening' }[g]; };
const tz = () => new Date().getTimezoneOffset();

/** Official facts card: values come straight from the spec data, with source and verification date (AC34). */
export function officialFacts(levelDef) {
  const total = levelDef.test_sections.reduce((a, s) => a + s.minutes, 0);
  return h('div', { class: 'card', 'data-official': levelDef.level },
    h('h3', null, `${levelDef.level}: official test structure (jlpt.jp)`),
    h('table', null, h('thead', null, h('tr', null, ['Section', 'Minutes'].map((x) => h('th', { scope: 'col' }, x)))), h('tbody', null, levelDef.test_sections.map((s) => h('tr', null, h('td', null, s.official_name), h('td', null, String(s.minutes)))), h('tr', null, h('th', { scope: 'row' }, 'Total (without breaks)'), h('td', null, String(total))))),
    h('p', null, `Scoring sections: ${levelDef.scoring_sections.map((x) => `${x.id.replace(/_/g, ' ')} (0 to ${x.range[1]}, sectional pass mark ${x.sectional_pass_mark})`).join('; ')}. Overall pass mark ${levelDef.overall_pass_mark} on the official 180-point scale. Passing needs the overall mark AND every sectional mark.`),
    h('details', null, h('summary', null, 'Question types by skill'), h('ul', null, Object.entries(levelDef.item_types).map(([k, v]) => h('li', null, h('strong', null, `${k}: `), v.join('; '))))),
    h('p', { class: 'small muted' }, `Source: jlpt.jp pages (S01 to S06), last verified ${levelDef.last_verified}. Figures can change; check `, h('a', { href: 'https://www.jlpt.jp/e/', target: '_blank', rel: 'noopener noreferrer' }, 'jlpt.jp'), ' (needs internet). The JLPT does not directly measure speaking or writing, and there are no official word, kanji or grammar lists.'));
}

function criteriaList(c) {
  const row = (ok, text) => h('li', { 'data-met': ok ? '1' : '0' }, h('span', { class: `chip ${ok ? 'ok' : ''}` }, ok ? '✔ met' : 'not yet'), ` ${text}`);
  return h('ul', { class: 'criteria' },
    row(c.curriculum.met, `Complete ${c.curriculum.min} % of the released ${c.level} units: now ${Math.round(c.curriculum.value)} % (${c.completedUnits} of ${c.releasedUnits} released). Thresholds apply to released units only; ${c.totalUnits - c.releasedUnits} of ${c.totalUnits} units are not released yet.`),
    row(c.mastery.met, `Internal mastery average at least ${c.mastery.min}: now ${c.mastery.value.toFixed(2)}${c.mastery.concepts ? ` over ${c.mastery.concepts} learned items` : ' (nothing learned yet)'}.`),
    row(c.readiness.met, `Pass the readiness check (${PARAMS.level_unlock.readiness_questions} mixed questions, at least ${pctText(PARAMS.level_unlock.readiness_pass)} overall and every skill group at ${pctText(PARAMS.level_unlock.readiness_group_min)} or more)${c.readiness.value !== null ? `: best ${pctText(c.readiness.value)}` : ''}.`),
    row(c.milestone.met, `Reach ${pctText(c.milestone.min)} in a milestone practice (a heuristic of ours, not an official threshold)${c.milestone.value !== null ? `: best ${pctText(c.milestone.value)}` : ''}.`));
}
const howSheet = () => h('details', { class: 'how' }, h('summary', null, 'How this works'), h('p', null, 'The next level opens only when ALL four conditions are met. There is no skip and no manual override, so the order of learning stays honest. Where only part of a level has been written, the percentages are computed on the released units, and this screen says so.'), h('p', null, `Everything here is internal practice progress. ${NOT_JLPT}. It does not certify, predict or verify any official JLPT result.`));

export async function jlptHubScreen({ ctx }) {
  let content;
  try { content = await ctx.getContent(); } catch (e) { return errorCard(e); }
  const st = ctx.store.state; const t = today();
  const cards = LEVELS.map((L) => {
    const units = content.units.filter((u) => u.level === L); const rel = units.filter((u) => u.released);
    const state = levelState(L, st, content, t); const locked = state === 'locked';
    const mocks = content.mockIndex.filter((m) => m.level === L).length;
    const prev = LEVELS[LEVELS.indexOf(L) - 1];
    const crit = levelCriteria(L, st, content, t);
    const badge = rel.length === 0 ? 'No units released yet' : rel.length < units.length ? 'Foundation slice (partial)' : 'All planned units released';
    const doneUnits = rel.filter((u) => st.progress.units[u.id]).length;
    return h('div', { class: 'card level-card', 'data-level': L, 'data-state': state },
      h('div', { class: 'row', style: 'flex-wrap:nowrap' }, h('div', { class: 'level-badge', 'aria-hidden': 'true' }, locked ? icon('lock', { size: 22 }) : L),
        h('div', { style: 'flex:1;min-width:0' }, h('div', { class: 'row between' }, h('h3', { style: 'margin:0' }, L), h('span', { class: `chip ${locked ? '' : 'info'}` }, STATE_TEXT[state])), levelChip(L))),
      h('p', { style: 'margin:8px 0 0' }, `Units released: ${rel.length} of ${units.length} · `, h('span', { class: 'chip warn', 'data-testid': 'coverage-badge' }, badge)),
      rel.length ? h('div', { style: 'margin:6px 0' }, h('div', { class: 'row between small' }, h('span', null, 'Your progress'), h('span', null, `${doneUnits} of ${rel.length} released units complete`)), progressBar(rel.length ? (100 * doneUnits) / rel.length : 0, { thin: true, label: `${L} units complete` })) : null,
      h('p', { id: `mock-count-${L}`, 'data-mocks': String(mocks) }, `Mock exams released: ${mocks} of 20`, h('span', { class: 'small muted' }, ' (the long-term goal is 20 per level; not reached in this release)')),
      locked ? h('div', { class: 'lock-note' }, icon('lock', { size: 18 }), h('span', null, `Locked. It opens after the ${prev} criteria are all met (see ${prev} below). You can still preview what it contains.`)) : null,
      !locked && L !== 'N1' ? h('details', null, h('summary', null, `What you need to open ${crit.next}`), criteriaList(crit)) : null,
      h('div', { class: 'row', style: 'margin-top:8px' }, h('a', { class: `btn ${locked ? '' : 'primary'}`, href: `#/jlpt/${L}`, 'aria-disabled': locked ? 'true' : null }, locked ? `Preview ${L}` : `Open ${L}`, icon('forward', { size: 18 }))));
  });
  const host = h('div', { class: 'stack' },
    h('div', { class: 'page-hero', style: 'min-height:130px' }, h('p', { class: 'eyebrow' }, 'JLPT practice'), h('h1', null, 'JLPT area'), h('p', { class: 'lead', style: 'margin:0' }, 'Choose a level, practise a section or take an original mock exam.')),
    st.examlive ? attemptCard(ctx, st.examlive) : null,
    h('div', { class: 'banner info' }, 'Original practice material. Results are practice estimates, not JLPT scores, and nothing here predicts passing. This app is not affiliated with the JLPT.'),
    h('nav', { class: 'quick-grid', 'aria-label': 'What do you want to do?' },
      h('a', { href: '#/learn' }, icon('book'), h('strong', null, 'Learn a topic'), h('span', { class: 'small muted' }, 'Lessons and review')),
      h('a', { href: `#/jlpt/${st.settings.targetLevel || 'N5'}` }, icon('target'), h('strong', null, 'Practise a section'), h('span', { class: 'small muted' }, 'Vocabulary, grammar, reading, listening')),
      h('a', { href: `#/jlpt/${st.settings.targetLevel || 'N5'}` }, icon('exam'), h('strong', null, 'Take a mock exam'), h('span', { class: 'small muted' }, 'Original paper, official timings')),
      h('a', { href: '#/readiness' }, icon('trophy'), h('strong', null, 'Review progress'), h('span', { class: 'small muted' }, 'Readiness estimates'))),
    howSheet(), ...cards,
    h('div', { class: 'row' }, h('a', { class: 'btn', href: '#/readiness' }, 'Readiness dashboard'), h('a', { class: 'btn', href: '#/planner' }, 'Exam-date planner')),
    h('p', { class: 'small muted' }, LEVEL_LABEL));
  return host;
}

export async function jlptLevelScreen({ ctx, params }) {
  let content;
  try { content = await ctx.getContent(); } catch (e) { return errorCard(e); }
  const L = params.level.toUpperCase(); const def = content.jlpt.levels.find((l) => l.level === L);
  if (!def) return h('p', null, 'Unknown level.');
  try { await content.ensureLevel(L); } catch (e) { return errorCard(e); }
  const st = ctx.store.state; const t = today();
  const state = levelState(L, st, content, t); const locked = state === 'locked';
  const crit = levelCriteria(L, st, content, t);
  const units = content.units.filter((u) => u.level === L);
  const mocks = content.mockIndex.filter((m) => m.level === L);
  const groups = ['vocabulary', 'grammar', 'reading', 'listening'];
  const poolBy = Object.fromEntries(groups.map((g) => [g, practicePool(content, L, skillGroup, g)]));
  const readyPool = practicePool(content, L, skillGroup);
  const startPractice = (g, n) => {
    const pool = stratified(poolBy[g], () => g, n, `${t}|${L}|${g}|${st.exams.attempts.length}`);
    const sid = SECTION_FOR_GROUP(def, g); const minutes = sectionPracticeMinutes(def, sid, content.core.mock_blueprint, pool.length);
    beginExam(ctx, { kind: 'section', level: L, group: g, questionIds: pool.map((q) => q.id), minutes, title: `${L} ${GROUP_LABEL[g]} practice` });
  };
  const startSpecial = (kind, n, title, perQ) => {
    const pool = stratified(readyPool, skillGroup, n, `${t}|${L}|${kind}|${st.exams.attempts.length}`);
    beginExam(ctx, { kind, level: L, questionIds: pool.map((q) => q.id), minutes: Math.max(5, Math.ceil(pool.length * perQ)), title });
  };
  back('#/jlpt', 'JLPT');
  const host = h('div', { class: 'stack' }, h('div', { class: 'page-hero', style: 'min-height:110px' }, h('p', { class: 'eyebrow' }, 'JLPT practice'), h('h1', null, L), levelChip(L)), st.examlive ? attemptCard(ctx, st.examlive) : null, h('p', { class: 'banner info' }, `${NOT_JLPT}. Practice only.`));
  if (locked) host.append(h('div', { class: 'banner warn' }, `${L} is locked until the previous level's criteria are all met. You can read its official structure below.`));
  if (!locked) {
    host.append(h('div', { class: 'card' }, h('h3', null, 'Section practice'), h('p', { class: 'small muted' }, 'Timed sets from the practice bank. They are practice, not mock exams.'),
      h('div', { class: 'action-grid' }, groups.map((g) => { const n = poolBy[g].length; return h('button', { class: 'btn block', type: 'button', id: `practice-${g}`, disabled: n < 3, onclick: () => startPractice(g, Math.min(10, n)) }, icon({ vocabulary: 'book', grammar: 'pen', reading: 'exam', listening: 'headphones' }[g], { size: 18 }), `${GROUP_LABEL[g]} (${n < 3 ? 'not enough questions yet' : `${Math.min(10, n)} questions`})`); }))));
    host.append(h('div', { class: 'card' }, h('h3', null, 'Mock exams'), h('p', { id: 'mock-counter' }, `Released: ${mocks.length} of 20 (long-term goal; not reached in this release).`), mocks.length ? h('ul', null, mocks.map((m) => h('li', null, `${m.title} · ${m.questions} questions `, h('a', { class: 'btn small', href: `#/mock/${m.id}` }, 'Start')))) : h('p', { class: 'muted' }, 'No mock exam is released at this level yet. Mocks are original papers written for this app; none is copied, shuffled or relabelled to fill the count.'), h('p', { class: 'small' }, MOCK_DISCLAIMER)));
    if (L !== 'N1') host.append(h('div', { class: 'card' }, h('h3', null, `Open ${crit.next}`), criteriaList(crit), howSheet(),
      h('div', { class: 'row' }, h('button', { class: 'btn', type: 'button', id: 'start-readiness', disabled: readyPool.length < 8, onclick: () => startSpecial('readiness', PARAMS.level_unlock.readiness_questions, `${L} readiness check`, 1.2) }, `Readiness check (${Math.min(PARAMS.level_unlock.readiness_questions, readyPool.length)} questions)`), h('button', { class: 'btn', type: 'button', id: 'start-milestone', disabled: readyPool.length < 8, onclick: () => startSpecial('milestone', 20, `${L} milestone practice`, 1.2) }, 'Milestone practice (20 questions)')),
      readyPool.length < PARAMS.level_unlock.readiness_questions ? h('p', { class: 'small muted' }, `The ${L} practice bank currently has ${readyPool.length} choice questions, fewer than the ${PARAMS.level_unlock.readiness_questions} planned for a full readiness check, so the check uses what exists.`) : null));
    host.append(selfReport(ctx, L));
  }
  host.append(h('details', { class: 'card' }, h('summary', null, `${L}: official test structure (jlpt.jp)`), officialFacts(def)), h('div', { class: 'card' }, h('h3', null, 'Units'), h('ul', null, units.map((u) => h('li', null, `${u.title} `, h('span', { class: `chip ${u.released ? 'info' : 'warn'}` }, u.released ? 'released' : 'not released yet'))))));
  return host;
}

function selfReport(ctx, L) {
  const list = ctx.store.state.progress.selfReported;
  const date = h('input', { type: 'date', id: 'sr-date' }); const result = h('select', { id: 'sr-result' }, ['unknown', 'passed', 'failed'].map((v) => h('option', { value: v }, v))); const notes = h('input', { type: 'text', id: 'sr-notes', maxlength: 200 });
  return h('div', { class: 'card' }, h('h3', null, 'Your own exam record (self-reported)'), h('p', { class: 'banner info' }, 'Self-reported. Not verified. The app never confirms an official result and never sets one.'),
    list.length ? h('ul', null, list.map((r) => h('li', null, `${r.examDate} · ${r.level} · ${r.result}${r.notes ? ` · ${r.notes}` : ''} (self-reported)`))) : null,
    h('label', { for: 'sr-date' }, 'Exam date'), date, h('label', { for: 'sr-result' }, `Result for ${L}`), result, h('label', { for: 'sr-notes' }, 'Notes (optional)'), notes,
    h('button', { class: 'btn', type: 'button', onclick: () => { if (!date.value) return; ctx.store.update('progress', (p) => ({ ...p, selfReported: [...p.selfReported, { examDate: date.value, level: L, result: result.value, notes: notes.value }] })); ctx.rerender(); } }, 'Save'));
}

export async function mockStartScreen({ ctx, params }) {
  let content;
  try { content = await ctx.getContent(); } catch (e) { return errorCard(e); }
  const entry = content.mockIndex.find((m) => m.id === params.id);
  if (!entry) return h('p', null, 'This mock is not released.');
  let file;
  try { file = await content.loadMock(entry.id); } catch (e) { return errorCard(e); }
  const def = content.jlpt.levels.find((l) => l.level === entry.level);
  const mock = file.mock;
  back(`#/jlpt/${entry.level}`, entry.level);
  return h('div', { class: 'stack' }, h('div', { class: 'page-hero', style: 'min-height:110px' }, h('p', { class: 'eyebrow' }, 'Mock exam'), h('h1', null, mock.title)), h('p', { class: 'banner info' }, MOCK_DISCLAIMER),
    h('div', { class: 'card' }, h('p', null, `${entry.questions} questions across ${mock.sections.length} sections, with the official section times: ${def.test_sections.map((s) => `${s.minutes} min`).join(' + ')}. This original paper has fewer questions than a real exam, so it is not a full-length rehearsal. (Content status: ${entry.status}.)`),
      h('ul', null, ['Check your sound and a quiet place before the listening section.', 'A section cannot be paused or re-opened once submitted.', 'The attempt is saved every 30 seconds so you can resume, but the clock keeps running.'].map((x) => h('li', null, x))),
      h('button', { class: 'btn primary', id: 'begin-mock', type: 'button', onclick: () => beginExam(ctx, { kind: 'mock', level: entry.level, mock, mockId: mock.id, title: mock.title }) }, 'Begin the exam')));
}

export async function readinessScreen({ ctx }) {
  let content;
  try { content = await ctx.getContent(); } catch (e) { return errorCard(e); }
  const L = ctx.store.state.settings.targetLevel || 'N5';
  const ind = readiness(ctx.store.state, content, L, Date.now(), { tzOffsetMinutes: tz() });
  const order = ['internal_readiness', 'vocab_progress', 'grammar_progress', 'kanji_progress', 'listening_performance', 'reading_performance', 'timed_performance', 'retention', 'weak_areas', 'review_backlog', 'mock_history'];
  back('#/jlpt', 'JLPT');
  return h('div', { class: 'stack' }, h('div', { class: 'page-hero', style: 'min-height:110px' }, h('p', { class: 'eyebrow' }, 'Progress'), h('h1', null, `Readiness (${L})`)),
    h('div', { class: 'banner info' }, `All figures are internal practice estimates. ${NOT_JLPT}.`),
    ...order.map((id) => { const x = ind[id]; return h('div', { class: 'card', 'data-indicator': id }, h('div', { class: 'row between' }, h('strong', null, x.label), h('span', { class: `chip ${x.display === NO_DATA ? 'warn' : 'info'}`, 'data-display': x.display }, x.display)),
      id === 'internal_readiness' ? h('p', { class: 'small' }, NOT_JLPT) : null,
      id === 'weak_areas' && x.value.length ? h('ul', null, x.value.map((w) => h('li', null, `${w.kind} ${w.id}: ${Math.round(w.acc * 100)} % over ${w.n} attempts`))) : null,
      id === 'mock_history' && x.value.length ? h('ul', null, x.value.map((m) => h('li', null, `${m.day}: ${Object.entries(m.groups).map(([k, v]) => `${k.replace(/_/g, ' ')} ${v ?? '—'} %`).join(', ')}`))) : null,
      id === 'listening_performance' ? h('p', { class: 'small muted' }, 'Listening uses synthetic device speech, so this is not exam-realistic.') : null,
      h('details', null, h('summary', null, 'How is this calculated?'), h('p', { class: 'small' }, x.how))); }),
    h('a', { class: 'btn', href: '#/planner' }, 'Exam-date planner'));
}

export async function plannerScreen({ ctx }) {
  let content;
  try { content = await ctx.getContent(); } catch (e) { return errorCard(e); }
  const s = ctx.store.state.settings; const out = h('div', { id: 'planner-out', 'aria-live': 'polite' });
  const level = h('select', { id: 'pl-level' }, LEVELS.map((l) => h('option', { value: l, selected: l === s.targetLevel ? true : null }, l)));
  const date = h('input', { type: 'date', id: 'pl-date', value: s.targetExamDate || '' });
  const run = async () => {
    try { await content.ensureLevel(level.value); } catch { /* released-unit counts do not need the bundle */ }
    const r = examPlanner(ctx.store.state, content, Date.now(), { level: level.value, targetDate: date.value }, { tzOffsetMinutes: tz() });
    out.replaceChildren(r.error ? h('p', { class: 'banner warn' }, r.error) : h('div', { class: 'card' }, h('p', { class: 'big', id: 'planner-message' }, r.message),
      h('ul', null, h('li', null, `Weeks left: ${r.weeksLeft.toFixed(1)}`), h('li', null, `Released ${r.level} units still to complete: ${r.remaining}`), h('li', null, `Required pace: ${r.required.toFixed(2)} units a week`), h('li', null, `Your recent pace: ${r.current.toFixed(2)} units a week`), r.ratio !== null ? h('li', null, `Pace ratio: ${Number.isFinite(r.ratio) ? r.ratio.toFixed(2) : 'at least 1'}`) : null),
      h('ul', { class: 'small muted' }, r.caveats.map((c) => h('li', null, c)))));
    if (date.value !== s.targetExamDate || level.value !== s.targetLevel) ctx.store.update('settings', (x) => ({ ...x, targetExamDate: date.value || null, targetLevel: level.value }));
  };
  back('#/jlpt', 'JLPT');
  return h('div', { class: 'stack' }, h('div', { class: 'page-hero', style: 'min-height:110px' }, h('p', { class: 'eyebrow' }, 'Planning'), h('h1', null, 'Exam-date planner')), h('p', { class: 'banner info' }, 'A pace estimate only. It never promises that you will pass.'),
    h('div', { class: 'card' }, h('label', { for: 'pl-level' }, 'Target level'), level, h('label', { for: 'pl-date' }, 'Exam date (you enter it; official dates change each year)'), date, h('button', { class: 'btn primary', type: 'button', id: 'pl-run', onclick: run }, 'Estimate')), out);
}
