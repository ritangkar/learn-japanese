// Evidence-based achievements (spec gamification.achievements). Pure: returns the ids newly earned; callers award them idempotently.
import { facetMastery } from './mastery.js';
import { levelCriteria } from './progress.js';

const rank = (s) => ['unseen', 'new_introduced', 'practising', 'developing', 'proficient', 'stable_retention'].indexOf(s);

/** attempts rows: [minute, target, facet, correct, latency, type, sched]. Day of an attempt = floor(minute / 1440). */
const dayOf = (r) => Math.floor(r[0] / 1440);

export function earned(state, content, today) {
  const ring = state.attempts.ring; const j = state.journal; const out = new Set();
  // ach_first_row: recognise the first 5 hiragana at >= 90 % on 2 separate days
  const vowels = new Set(['ka_h_a', 'ka_h_i', 'ka_h_u', 'ka_h_e', 'ka_h_o']);
  const byDay = {};
  for (const r of ring) if (vowels.has(r[1]) && r[2] === 'r') { (byDay[dayOf(r)] ||= []).push(r[3]); }
  if (Object.values(byDay).filter((v) => v.length >= 5 && v.reduce((a, b) => a + b, 0) / v.length >= 0.9).length >= 2) out.add('ach_first_row');
  // script completion: every basic kana read facet at developing or higher
  const done = (script) => { const basics = content.kana.filter((k) => k.script === script && k.group === 'basic'); return basics.length > 0 && basics.length >= 46 && basics.every((k) => rank(facetMastery(state.srs[`${k.id}:read`], today).state) >= rank('developing')); };
  if (done('hiragana')) out.add('ach_hiragana_done');
  if (done('katakana')) out.add('ach_katakana_done');
  const stamps = Object.values(j.stamps).filter((s) => !s.tier).length;
  if (stamps >= 1) out.add('ach_first_stamp');
  if (stamps >= 10) out.add('ach_ten_stamps');
  // listening: 20 items at >= 80 % across >= 5 days
  const listen = ring.filter((r) => r[5] === 'listening_comp' || r[5] === 'dictation');
  const ldays = new Set(listen.map(dayOf));
  if (listen.length >= 20 && ldays.size >= 5 && listen.reduce((a, r) => a + r[3], 0) / listen.length >= 0.8) out.add('ach_listening_20');
  if (ring.filter((r) => r[6] >= 30 && r[3] === 1).length >= 20) out.add('ach_retention_30');
  if (j.comebackDone.length) out.add('ach_comeback');
  if (state.exams.attempts.some((a) => a.kind === 'mock')) out.add('ach_first_mock');
  if (Object.values(j.stamps).some((s) => s.tier)) out.add('ach_revisit');
  const typing = ring.filter((r) => r[5] === 'typing_ja');
  if (typing.length >= 50 && typing.reduce((a, r) => a + r[3], 0) / typing.length >= 0.85) out.add('ach_typing');
  if (levelCriteria('N5', state, content, today).allMet) out.add('ach_n5_milestone');
  return [...out].filter((id) => !j.achievements[id]);
}
