// Examination engine: official section minutes, timers, flagging, locking after submit, autosave/resume, practice percent only.
// It never produces a scaled /180 score, a pass/fail verdict or a CEFR claim (R016, AC23).
export const DISCLAIMER = 'Original practice exam. Not an official JLPT paper.';
export const RESULT_LABEL = 'Practice estimate — not a JLPT score';
export const WARN_MS = Object.freeze([5 * 60000, 60000]);

/** Skill group of a question for readiness/scoring when `section` is not set (lesson questions). */
export function skillGroup(q) {
  if (q.section) return q.section;
  if (['reading_comp', 'information_retrieval'].includes(q.type)) return 'reading';
  if (['listening_comp', 'dictation', 'shadowing'].includes(q.type)) return 'listening';
  if (['fill_blank', 'sentence_order', 'construct', 'error_correction'].includes(q.type)) return 'grammar';
  return 'vocabulary';
}

/** Scoring groups for a level from the official scoring sections. N5/N4: LK+Reading and Listening; N3-N1: three groups. */
export function scoringGroups(levelDef) {
  const two = levelDef.scoring_sections.length === 2;
  return two
    ? [{ id: 'language_knowledge_and_reading', label: 'Language knowledge and reading', sections: ['vocabulary', 'grammar', 'reading'] }, { id: 'listening', label: 'Listening', sections: ['listening'] }]
    : [{ id: 'language_knowledge_vocab_grammar', label: 'Language knowledge (vocabulary, grammar)', sections: ['vocabulary', 'grammar'] }, { id: 'reading', label: 'Reading', sections: ['reading'] }, { id: 'listening', label: 'Listening', sections: ['listening'] }];
}

export function createAttempt({ id, mock, now, kind = 'mock', practiceMode = false, extendedTime = false, minutesOverride = null }) {
  const sections = mock.sections.map((s, i) => ({
    id: s.id, name: s.official_section_name, minutes: minutesOverride?.[s.id] ?? s.minutes, questionIds: s.question_ids.slice(), passages: s.shared_passages || [], listening: s.listening_ids || [],
    state: 'pending', startedAt: null, endsAt: null, submittedAt: null, answers: {}, flags: {}, timeMs: 0, order: i,
  }));
  return { id, mockId: mock.id, level: mock.level, kind, startedAt: now, savedAt: now, practiceMode, extendedTime, current: 0, sections, finished: false, plays: {} };
}

const factor = (a) => (a.extendedTime ? 1.5 : 1);
export function startSection(a, now, index = a.current) {
  const s = a.sections[index];
  if (s.state !== 'pending') return a;
  const sections = a.sections.map((x, i) => (i === index ? { ...x, state: 'active', startedAt: now, endsAt: now + Math.round(x.minutes * 60000 * factor(a)) } : x));
  return { ...a, sections, current: index, savedAt: now };
}
export const remainingMs = (s, now) => (s.state === 'active' ? Math.max(0, s.endsAt - now) : s.state === 'submitted' ? 0 : s.minutes * 60000);
export function warnings(s, now) { const r = remainingMs(s, now); return { five: s.state === 'active' && r <= WARN_MS[0] && r > WARN_MS[1], one: s.state === 'active' && r <= WARN_MS[1] && r > 0, expired: s.state === 'active' && r === 0 }; }

function mapSection(a, index, fn) { return { ...a, sections: a.sections.map((s, i) => (i === index ? fn(s) : s)) }; }
export function answer(a, qid, response, now) {
  const s = a.sections[a.current];
  if (s.state !== 'active' || !s.questionIds.includes(qid)) return a; // locked / inactive / foreign question: ignored
  if (s.endsAt && now > s.endsAt + 1000) return a;
  return { ...mapSection(a, a.current, (x) => ({ ...x, answers: { ...x.answers, [qid]: response } })), savedAt: now };
}
export function clearAnswer(a, qid) { return mapSection(a, a.current, (x) => { const answers = { ...x.answers }; delete answers[qid]; return { ...x, answers }; }); }
export function toggleFlag(a, qid) { return mapSection(a, a.current, (x) => (x.state !== 'active' ? x : { ...x, flags: { ...x.flags, [qid]: !x.flags[qid] } })); }
export function grid(s) { return s.questionIds.map((id, i) => ({ n: i + 1, id, state: s.flags[id] ? 'flagged' : s.answers[id] !== undefined ? 'answered' : 'unanswered' })); }
export const unanswered = (s) => s.questionIds.filter((q) => s.answers[q] === undefined);

/** Submit the current section; it is then locked (design decision modelled on separate paper sections). */
export function submitSection(a, now) {
  const s = a.sections[a.current];
  if (s.state !== 'active') return a;
  const used = Math.min(now, s.endsAt) - s.startedAt;
  let next = mapSection(a, a.current, (x) => ({ ...x, state: 'submitted', submittedAt: now, timeMs: used }));
  const done = next.sections.every((x) => x.state === 'submitted');
  if (done) next = { ...next, finished: true };
  return { ...next, savedAt: now };
}
/** Auto-submit at zero. Returns the attempt (unchanged when time remains). */
export function tick(a, now) {
  const s = a.sections[a.current];
  if (s && s.state === 'active' && now >= s.endsAt) return submitSection(a, s.endsAt);
  return a;
}
export function nextSection(a, now) {
  const idx = a.sections.findIndex((s) => s.state === 'pending');
  return idx === -1 ? a : { ...a, current: idx, savedAt: now };
}
/** Listening plays once per item by default; practice mode allows replay. */
export function canPlay(a, key) { return a.practiceMode || !(a.plays[key] >= 1); }
export function recordPlay(a, key) { return { ...a, plays: { ...a.plays, [key]: (a.plays[key] || 0) + 1 } }; }

/** Grade one response (choice id or tiles/typed handled by the caller) — here: choice-based and typed exact via checkFn. */
export function score(a, questions, levelDef, checkFn) {
  const qById = new Map(questions.map((q) => [q.id, q]));
  const groups = scoringGroups(levelDef).map((g) => ({ ...g, correct: 0, total: 0 }));
  const byType = {}; const byTag = {}; const perQuestion = [];
  for (const s of a.sections) for (const qid of s.questionIds) {
    const q = qById.get(qid); if (!q) continue;
    const resp = s.answers[qid];
    const ok = resp !== undefined && checkFn(q, resp).correct;
    const sec = skillGroup(q);
    const g = groups.find((x) => x.sections.includes(sec)) || groups[0];
    g.total++; if (ok) g.correct++;
    const t = q.jlpt_item_type || q.type; byType[t] ||= { correct: 0, total: 0 }; byType[t].total++; if (ok) byType[t].correct++;
    for (const tg of q.tags || []) { byTag[tg] ||= { correct: 0, total: 0 }; byTag[tg].total++; if (ok) byTag[tg].correct++; }
    perQuestion.push({ id: qid, section: s.id, answered: resp !== undefined, correct: ok, flagged: !!s.flags[qid] });
  }
  for (const g of groups) g.percent = g.total ? Math.round((100 * g.correct) / g.total) : null;
  const scored = groups.filter((g) => g.percent !== null);
  const pcts = scored.map((g) => g.percent);
  let band = null;
  if (pcts.length) band = pcts.every((p) => p >= 70) ? 'on_track' : pcts.some((p) => p < 55) ? 'needs_work' : 'borderline';
  const BAND_LABEL = { on_track: 'On track (heuristic)', borderline: 'Borderline (heuristic)', needs_work: 'Needs work (heuristic)' };
  const balanceWarning = pcts.length > 1 && Math.max(...pcts) - Math.min(...pcts) >= 25;
  const timePerSection = a.sections.map((s) => ({ id: s.id, usedMs: s.timeMs, allottedMs: s.minutes * 60000 }));
  return { groups, byType, byTag, perQuestion, band, bandLabel: band ? BAND_LABEL[band] : null, balanceWarning, balanceText: balanceWarning ? 'One group is 25 or more points below your best group. The real exam requires every scoring section to reach its own pass mark, so balance matters.' : null, timePerSection, unanswered: perQuestion.filter((p) => !p.answered).length, label: RESULT_LABEL, disclaimer: DISCLAIMER };
}

/** Compact record for exams.attempts (<= 200 kept). */
export function summarize(a, result, day) {
  return { id: a.id, mockId: a.mockId, level: a.level, kind: a.kind, day, groups: Object.fromEntries(result.groups.map((g) => [g.id, g.percent])), totals: Object.fromEntries(result.groups.map((g) => [g.id, [g.correct, g.total]])), durationMs: a.sections.reduce((t, s) => t + s.timeMs, 0), allottedMs: a.sections.reduce((t, s) => t + s.minutes * 60000, 0), unanswered: result.unanswered, band: result.band, byType: result.byType };
}
export const overallPercent = (result) => { const t = result.groups.reduce((x, g) => x + g.total, 0); return t ? (100 * result.groups.reduce((x, g) => x + g.correct, 0)) / t : null; };

/** Section practice: a single timed section built from the pool; time per question derives from the (approximate) blueprint. */
export function sectionPracticeMinutes(levelDef, sectionId, blueprint, nQuestions) {
  const sec = levelDef.test_sections.find((s) => s.id === sectionId);
  const planned = blueprint?.levels?.[levelDef.level]?.[sectionId] || null;
  if (!sec || !planned) return Math.max(1, Math.ceil(nQuestions * 1.2));
  return Math.max(1, Math.ceil((nQuestions * sec.minutes) / planned));
}

export function autosaveDue(a, now, everyMs = 30000) { return now - a.savedAt >= everyMs; }
export const serialize = (a) => JSON.parse(JSON.stringify(a));
export function resumeInfo(a, now) { const s = a.sections[a.current]; return { mockId: a.mockId, level: a.level, section: s.name, remainingMs: remainingMs(s, now), expired: s.state === 'active' && now >= s.endsAt }; }
