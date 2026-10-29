// Deterministic adaptive planner (spec learning_engine rules E01-E12, missed_days). Pure: (state, content, now) -> plan.
// No unseeded randomness and no wall-clock reads: time arrives as `nowMs`.
import { PARAMS } from './params.js';
import { decode, retrievability, State } from './srs.js';
import { conceptMastery } from './mastery.js';
import { localDay, weekStart } from '../core/clock.js';
import { hashString } from './prng.js';
import { destinationStates, nextLesson } from './progress.js';
import { lessonConcepts } from '../content/runtime.js';

const CAP = PARAMS.review_cards_per_core_session_cap;
const conceptOf = (key) => key.split(':')[0];

/** All due facets, lowest retrievability first (ties: more overdue first, then key). Parked facets are excluded. */
export function dueFacets(state, today) {
  const out = [];
  for (const rec of Object.values(state.srs)) {
    const c = decode(rec);
    if (c.due > today) continue;
    const parked = state.concepts.parked?.[rec[0]];
    if (parked && parked > today) continue;
    out.push({ key: rec[0], concept: conceptOf(rec[0]), r: retrievability(rec, today), overdue: today - c.due, lapses: c.lapses, state: c.state });
  }
  out.sort((a, b) => a.r - b.r || b.overdue - a.overdue || (a.key < b.key ? -1 : 1));
  return out;
}

/** E04 helper: reorder so that facets of the same concept are not adjacent when avoidable (stable and deterministic). */
export function burySiblings(list) {
  const out = []; const rest = list.slice();
  while (rest.length) {
    const last = out.length ? out[out.length - 1].concept : null;
    const i = rest.findIndex((x) => x.concept !== last);
    out.push(rest.splice(i === -1 ? 0 : i, 1)[0]);
  }
  return out;
}

export function recentAccuracy(attempts, n = 30) {
  const ring = attempts.ring.slice(-n);
  if (ring.length < 5) return { value: null, n: ring.length };
  return { value: ring.reduce((a, r) => a + r[3], 0) / ring.length, n: ring.length };
}
const acc = (rows) => (rows.length ? rows.reduce((a, r) => a + r[3], 0) / rows.length : null);

export function modalityGap(attempts) {
  const listen = attempts.ring.filter((r) => r[2] === 'l');
  const text = attempts.ring.filter((r) => r[2] !== 'l');
  const P = PARAMS.modality_gap_trigger;
  if (listen.length < P.min_attempts || text.length < P.min_attempts) return null;
  const gap = acc(text) - acc(listen);
  return gap >= P.accuracy_gap ? { gap, items: [...new Set(listen.filter((r) => r[3] === 0).map((r) => r[1]))].slice(0, 6) } : null;
}
export function constructionGap(attempts) {
  const P = PARAMS.construction_gap_trigger;
  const rec = attempts.ring.filter((r) => r[2] === 'r' || r[2] === 'm');
  const con = attempts.ring.filter((r) => r[2] === 'c');
  if (rec.length < P.min_attempts || con.length < P.min_attempts) return null;
  const a = acc(rec); const b = acc(con);
  return a >= P.recognition_acc_min && b <= P.construction_acc_max ? { recognition: a, construction: b } : null;
}
export function activeConfusions(concepts, today) {
  const P = PARAMS.confusion_trigger;
  return Object.entries(concepts.confusions)
    .filter(([, v]) => (v.streak || 0) < 3 && v.events.filter((d) => today - d <= P.window_days).length >= P.errors_between_pair)
    .map(([pair]) => pair).sort();
}
export function leeches(state, today) {
  return Object.keys(state.concepts.leech).filter((k) => { const p = state.concepts.parked?.[k]; return !(p && p > today); }).sort();
}

export function weeksToExam(settings, today) {
  if (!settings.targetExamDate) return null;
  const t = Date.parse(`${settings.targetExamDate}T00:00:00Z`);
  if (Number.isNaN(t)) return null;
  return (Math.floor(t / 86400000) - today) / 7;
}
export function examShare(weeks) {
  if (weeks === null || weeks > 8 || weeks < 0) return 0;
  if (weeks <= 2) return PARAMS.exam_proximity_share.weeks_2_or_less;
  if (weeks <= 4) return PARAMS.exam_proximity_share.weeks_4;
  return PARAMS.exam_proximity_share.weeks_8;
}

/** Spread overdue facets over the next days with a per-day cap (E01 / welcome-back). Returns [{key, due}]. */
export function deferrals(rest, today, perDay = CAP, days = PARAMS.comeback.spread_days) {
  return rest.map((f, i) => ({ key: f.key, due: today + 1 + Math.min(days - 1, Math.floor(i / perDay)) }));
}

export function dailyMinutesRecommendation(journal, settings, today) {
  const last7 = Array.from({ length: 7 }, (_, i) => journal.activeMinutes[today - 1 - i] || 0);
  const studied = last7.filter((m) => m > 0);
  if (studied.length < 3) return null;
  const avg = last7.reduce((a, b) => a + b, 0) / studied.length;
  const [lo, hi] = PARAMS.daily_minutes_bounds;
  if (avg < settings.dailyCoreMinutes * 0.6) return { suggest: Math.max(lo, Math.round(avg / 5) * 5 || lo), direction: 'lower', avg };
  if (avg > settings.dailyCoreMinutes * 1.3) return { suggest: Math.min(hi, Math.round(avg / 5) * 5), direction: 'raise', avg };
  return null;
}

const cardsMinutes = (n) => Math.max(1, Math.round((n * PARAMS.avg_seconds_per_review_card) / 60));

/**
 * Build today's plan. Options: {extension: boolean, tzOffsetMinutes}.
 * @returns {{day:number, mode:string, blocks:object[], rules:string[], totalCoreMinutes:number, optionalMinutes:number, deferrals:object[], notes:string[], recommendation:object|null}}
 */
export function plan(state, content, nowMs, opts = {}) {
  const today = localDay(nowMs, opts.tzOffsetMinutes ?? 0);
  const settings = state.settings;
  const scale = settings.dailyCoreMinutes / 30;
  const budget = Object.fromEntries(Object.entries(PARAMS.time_budget_30).map(([k, v]) => [k, Math.max(1, Math.round(v * scale))]));
  const rules = []; const blocks = []; const notes = [];
  const out = { day: today, mode: 'normal', blocks, rules, notes, deferrals: [], totalCoreMinutes: 0, optionalMinutes: 0, recommendation: dailyMinutesRecommendation(state.journal, settings, today) };
  const add = (b) => { blocks.push({ core: true, ...b }); };

  const last = state.journal.studyDays.length ? Math.max(...state.journal.studyDays) : null;
  const gap = last === null ? 0 : today - last;
  const due = dueFacets(state, today).filter((d) => d.state !== State.New || true);
  const comebackDoneToday = state.journal.comebackDone.includes(today);
  const C = PARAMS.comeback;

  // ---- missed days ----
  let reviewCap = CAP;
  let suppressNew = false;
  if (last !== null && gap > C.gap_normal_max && !comebackDoneToday && due.length > 0) {
    if (gap <= C.gap_comeback_max) {
      out.mode = 'comeback'; reviewCap = C.comeback_reviews; suppressNew = true; rules.push('MISSED_3_7');
      notes.push('Welcome back! Here is a short warm-up of the items most likely to have faded. Nothing was lost: your lessons, XP and stamps are all still here.');
    } else {
      out.mode = 'welcome_back'; reviewCap = C.welcome_back_reviews; rules.push('MISSED_GT_7');
      notes.push('Welcome back! We will start with a short review of the items that need it most. The rest of your reviews are spread over the next week so nothing piles up.');
      out.deferrals = deferrals(due.slice(reviewCap), today);
    }
  }
  // ---- E01 backlog safety ----
  if (due.length > PARAMS.backlog_mode_threshold_ratio * CAP && out.mode === 'normal') {
    out.mode = 'backlog'; rules.push('E01'); suppressNew = true;
    out.deferrals = deferrals(due.slice(CAP), today);
    notes.push(`You have ${due.length} reviews waiting. Today is a catch-up day: ${CAP} reviews now, the rest spread over the next 7 days, and no new material until you are caught up.`);
  }

  // ---- E02 leeches ----
  const leechKeys = leeches(state, today);
  // ---- E04 due reviews ----
  const todays = burySiblings(due.slice(0, out.mode === 'comeback' || out.mode === 'welcome_back' ? reviewCap : CAP));
  if (due.length) { rules.push('E04'); }
  if (todays.length) add({ id: 'review', type: 'review', title: out.mode === 'comeback' ? 'Comeback review' : 'Reviews', items: todays.map((d) => d.key), minutes: cardsMinutes(todays.length), reason_code: out.mode === 'comeback' ? 'MISSED_3_7' : out.mode === 'welcome_back' ? 'MISSED_GT_7' : 'E04', reason_text: `${todays.length} item${todays.length === 1 ? '' : 's'} due, those most likely to be forgotten first.` });

  // ---- E05 new material gate ----
  const ratio = due.length / CAP; const ra = recentAccuracy(state.attempts);
  const gateOk = !suppressNew && ratio <= PARAMS.new_material_gate.max_due_to_cap_ratio && (ra.value === null || ra.value >= PARAMS.new_material_gate.min_recent_accuracy);
  const lesson = nextLesson(state.progress, content);
  const newWords = Math.max(1, Math.round(PARAMS.new_words_per_session_default * scale * (ra.value !== null && ra.value < 0.8 ? 0.7 : 1)));
  out.newItemBudget = { words: newWords, grammar: PARAMS.new_grammar_per_session_default };
  const lessonsToday = Object.values(state.progress.lessons).filter((l) => l.doneAt === today).length;
  if (gateOk && lesson && lessonsToday >= 1) {
    rules.push('E05_done_today');
    blocks.push({ id: 'new_lesson_more', type: 'lesson', title: `${lesson.title} (another lesson)`, lessonId: lesson.id, minutes: budget.new_material, core: false, reason_code: 'E05', reason_text: 'You already learned something new today. This is an optional extra, never required.' });
  } else if (gateOk && lesson) {
    rules.push('E05');
    add({ id: 'new_lesson', type: 'lesson', title: lesson.title, lessonId: lesson.id, minutes: budget.new_material, reason_code: 'E05', reason_text: `Next step in ${content.unitById.get(lesson.unit_id)?.title || 'your unit'}. ${ra.value !== null && ra.value < 0.8 ? 'Recent accuracy was a bit low, so the pace is eased.' : 'Reviews are under control, so it is a good moment for something new.'}` });
  } else if (!lesson && !suppressNew) notes.push('You have finished all released lessons. New units are added as content is released (see Content status).');
  else if (suppressNew || !gateOk) rules.push('E05_blocked');

  // ---- guided practice: E02, E03, E06, E07 ----
  const guided = [];
  const confusions = activeConfusions(state.concepts, today);
  if (confusions.length) { rules.push('E03'); guided.push({ id: 'contrast', type: 'contrast', title: 'Tell them apart', pairs: confusions, reason_code: 'E03', reason_text: `You mixed up ${confusions.length === 1 ? 'a pair' : 'some pairs'} of items at least 3 times recently. A side-by-side drill helps.` }); }
  if (leechKeys.length) { rules.push('E02'); guided.push({ id: 'leech', type: 'leech', title: 'Stubborn items', items: leechKeys.slice(0, 3), reason_code: 'E02', reason_text: 'These items have slipped 3 or more times. Try a memory hook or park them for a week; there is no penalty either way.' }); }
  const mg = modalityGap(state.attempts);
  if (mg) { rules.push('E06'); guided.push({ id: 'listen_drill', type: 'listening_drill', title: 'Listening drill', items: mg.items, reason_code: 'E06', reason_text: 'You read these well but find them harder to hear. Extra listening on the same items.' }); }
  const cg = constructionGap(state.attempts);
  if (cg) { rules.push('E07'); guided.push({ id: 'construct_drill', type: 'construction_drill', title: 'Build sentences', reason_code: 'E07', reason_text: 'You recognise these well but building them is harder. Practise ordering and filling in.' }); }
  const gm = Math.max(1, Math.floor(budget.guided_practice / Math.max(1, guided.length || 1)));
  if (!guided.length && Object.keys(state.progress.lessons).length && !suppressNew) guided.push({ id: 'mixed', type: 'mixed_practice', title: 'Mixed practice', reason_code: 'SPIRAL', reason_text: 'A short mix of items from your recent lessons keeps them fresh.' });
  guided.forEach((g) => add({ ...g, minutes: gm }));

  // ---- listening or reading ----
  const introUnits = new Set(content.lessons.filter((l) => state.progress.lessons[l.id]).map((l) => l.unit_id));
  const lr = [...content.listening.filter((l) => introUnits.has(l.unit_id)).map((l) => ({ kind: 'listening', id: l.id })), ...content.passages.filter((p) => introUnits.has(p.unit_id)).map((p) => ({ kind: 'reading', id: p.id }))].sort((a, b) => (a.id < b.id ? -1 : 1));
  if (lr.length && !suppressNew) { const pick = lr[(today + hashString(`${Object.keys(state.progress.lessons).length}`)) % lr.length]; add({ id: 'lr', type: pick.kind === 'listening' ? 'listening' : 'reading', title: pick.kind === 'listening' ? 'Listening' : 'Reading', itemId: pick.id, minutes: budget.listening_or_reading, reason_code: 'SPIRAL', reason_text: 'Listening and reading are practised every day, not only when new lessons are taught.' }); }

  // ---- E08 destination quest step ----
  const states = destinationStates(state.progress, content);
  const live = content.destinations.find((d) => ['available', 'in_progress'].includes(states[d.id].state) && content.questsOf(d.id).some((q) => !q.tier && (state.progress.destinations[d.id]?.quests?.[q.id]?.best ?? 0) < q.min_accuracy));
  if (live && !suppressNew) {
    const q = content.questsOf(live.id).find((x) => !x.tier && (state.progress.destinations[live.id]?.quests?.[x.id]?.best ?? 0) < x.min_accuracy);
    rules.push('E08'); add({ id: 'quest', type: 'quest', title: `${live.name_en}: ${content.core.quest_types.find((t) => t.id === q.type)?.name || 'quest'}`, destinationId: live.id, questId: q.id, minutes: budget.destination_quest, reason_code: 'E08', reason_text: `Your next stop. Reach ${Math.round(q.min_accuracy * 100)} % to earn the stamp.` });
  }

  // ---- E09 exam proximity ----
  const wk = weeksToExam(settings, today);
  const share = examShare(wk);
  if (share > 0) {
    rules.push('E09');
    const total = blocks.reduce((a, b) => a + b.minutes, 0);
    const ex = Math.max(1, Math.round(settings.dailyCoreMinutes * share));
    // keep reviews intact; trim the other blocks proportionally to make room
    const others = blocks.filter((b) => b.type !== 'review');
    const otherMin = others.reduce((a, b) => a + b.minutes, 0) || 1;
    const room = Math.max(0, Math.min(ex, otherMin - others.length));
    for (const b of others) b.minutes = Math.max(1, Math.round(b.minutes - (room * b.minutes) / otherMin));
    add({ id: 'exam', type: 'exam_practice', title: `${settings.targetLevel} exam-style practice`, level: settings.targetLevel, minutes: Math.max(1, room || ex), reason_code: 'E09', reason_text: `${Math.round(share * 100)} % of today's time goes to exam-style practice (${wk < 1 ? 'less than a week' : `about ${Math.round(wk)} weeks`} to your target date). Practice only: not a score prediction.` });
    void total;
  }

  // ---- E11 revisit suggestion (optional) ----
  for (const d of content.destinations) {
    const s = states[d.id];
    if (s.state === 'revisit_available' || (s.state === 'completed' && destRetrievability(state, content, d, today) < 0.8)) {
      rules.push('E11'); blocks.push({ id: `revisit_${d.id}`, type: 'revisit', title: `Revisit ${d.name_en}`, destinationId: d.id, minutes: 4, core: false, reason_code: 'E11', reason_text: s.state === 'revisit_available' ? 'A higher level is unlocked and this stop has an unfinished tier.' : 'Words linked to this stop are fading; a quick visit refreshes them.' });
      break;
    }
  }
  if (opts.extension) {
    rules.push('E12');
    for (const [id, minutes] of PARAMS.extension_blocks) blocks.push({ id: `ext_${id}`, type: 'extension', title: id.replace(/_/g, ' '), minutes, core: false, reason_code: 'E12', reason_text: 'Optional extra: never required.' });
  }
  out.totalCoreMinutes = blocks.filter((b) => b.core).reduce((a, b) => a + b.minutes, 0);
  out.optionalMinutes = blocks.filter((b) => !b.core).reduce((a, b) => a + b.minutes, 0);
  out.weeksToExam = wk;
  out.dueCount = due.length;
  return out;
}

function destRetrievability(state, content, d, today) {
  const ids = content.vocab.filter((v) => (v.destination_tags || []).includes(d.id)).map((v) => v.id);
  const rs = [];
  for (const id of ids) for (const f of ['read', 'meaning']) { const r = state.srs[`${id}:${f}`]; if (r) rs.push(retrievability(r, today)); }
  return rs.length ? rs.reduce((a, b) => a + b, 0) / rs.length : 1;
}

/** E10: concepts at stable_retention are not re-taught and appear at most once per 3 weeks in spiral practice. */
export function eligibleForSpiral(state, conceptId, today, lastSpiralDay = null) {
  const m = conceptMastery(state.srs, conceptId, today);
  if (m.state !== 'stable_retention') return true;
  return lastSpiralDay === null || today - lastSpiralDay >= 21;
}

export { weekStart, lessonConcepts };
