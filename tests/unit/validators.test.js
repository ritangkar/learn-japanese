import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { loadContent, loadSpec, ROOT } from '../../scripts/lib/load-content.mjs';
import { runAll } from '../../scripts/lib/checks.mjs';
import * as fx from '../fixtures/bad-content.js';

let raw; let spec; let schema;
beforeAll(() => { raw = loadContent(); spec = loadSpec(); schema = JSON.parse(readFileSync(`${ROOT}/content/schemas/content.schema.json`, 'utf8')); });
const run = (r) => Object.fromEntries(runAll(r, { spec, schema, root: ROOT }).map((x) => [x.id, x]));
const withItems = (coll, ...items) => { const r = structuredClone(raw); r[coll].push(...items); return r; };

describe('real content passes every validator (A07 reported not run)', () => {
  it('no failures', () => {
    const res = run(raw);
    const failed = Object.values(res).filter((x) => x.status === 'fail').map((x) => `${x.id}: ${x.errors.slice(0, 3).map((e) => e.msg)}`);
    expect(failed).toEqual([]);
    expect(res.A07.status).toBe('not_run');
  });
});

describe('validators fail on defective fixtures', () => {
  it('A05 kanji gating: un-introduced kanji without furigana fails; with ruby passes', () => {
    expect(run(withItems('sentences', fx.kanjiSentence)).A05.errors.some((e) => e.item === 'fx_s_kanji')).toBe(true);
    expect(run(withItems('sentences', fx.kanjiSentenceWithRuby)).A05.errors.filter((e) => e.item === 'fx_s_kanji_ruby')).toEqual([]);
  });
  it('A06 vocabulary gating: sentence using later-introduced vocab fails', () => {
    const r = withItems('vocab', fx.futureVocab); r.sentences.push(fx.futureVocabSentence);
    expect(run(r).A06.errors.some((e) => e.item === 'fx_s_future')).toBe(true);
  });
  it('A04 romaji mismatch and non-kana reading fail', () => {
    const r = run(withItems('vocab', fx.badRomajiVocab, fx.romajiInReading));
    expect(r.A04.errors.map((e) => e.item)).toEqual(expect.arrayContaining(['fx_v_romaji', 'fx_v_reading']));
  });
  it('A08 duplicate choice text and missing correct answer fail', () => {
    const r = run(withItems('questions', fx.dupChoiceQ, fx.twoCorrectQ));
    expect(r.A08.errors.map((e) => e.item)).toEqual(expect.arrayContaining(['fx_q_dup', 'fx_q_nocorrect']));
  });
  it('A09 empty normalised answer fails', () => {
    expect(run(withItems('questions', fx.emptyAnswerQ)).A09.errors.some((e) => e.item === 'fx_q_empty')).toBe(true);
  });
  it('A02 duplicate ids and dangling references fail', () => {
    const dup = structuredClone(raw.vocab[0]);
    const r = run(withItems('questions', fx.danglingQ));
    expect(r.A02.errors.some((e) => e.item === 'fx_q_dangling')).toBe(true);
    const r2 = run(withItems('vocab', dup));
    expect(r2.A02.errors.some((e) => /duplicate id/.test(e.msg))).toBe(true);
  });
  it('A01 schema violations fail (bad id pattern, extra property)', () => {
    const bad = { ...structuredClone(raw.vocab[0]), id: 'Bad-Id', surprise: 1 };
    const r = run(withItems('vocab', bad));
    expect(r.A01.status).toBe('fail');
  });
  it('X06 kana used before introduction fails', () => {
    expect(run(withItems('questions', fx.lateKanaQ)).X06.errors.some((e) => e.item === 'fx_q_latekana')).toBe(true);
  });
  it('X02 placeholder text and X08 forbidden claims fail', () => {
    expect(run(withItems('sentences', fx.placeholderSentence)).X02.status).toBe('fail');
    expect(run(withItems('sentences', fx.claimSentence)).X08.status).toBe('fail');
  });
  it('A13 over-long TTS chunk fails', () => {
    expect(run(withItems('listening', fx.longListening)).A13.errors.some((e) => e.item === 'fx_ls_long')).toBe(true);
  });
  it('A10 question shared between two mocks fails; A12 wrong official minutes fail', () => {
    const r = structuredClone(raw); r.mocks.push(...fx.badMocks(raw));
    const res = run(r);
    expect(res.A10.errors.some((e) => /more than one mock/.test(e.msg))).toBe(true);
    expect(res.A12.errors.some((e) => /25 min != official 20/.test(e.msg))).toBe(true);
  });
  it('X01 human_reviewed without reviewer/date fails; with both it passes', () => {
    const r = structuredClone(raw); r.status.v_neko = { status: 'human_reviewed' };
    expect(run(r).X01.status).toBe('fail');
    const r2 = structuredClone(raw); r2.status.v_neko = { status: 'human_reviewed', review: { reviewer: 'Named Reviewer', reviewed_on: '2026-10-29' } };
    expect(run(r2).X01.status).toBe('pass');
  });
  it('X01 refuses a unit hand-marked human_reviewed', () => {
    const r = structuredClone(raw); r.curriculum.units[0].content_status = 'human_reviewed';
    expect(run(r).X01.status).toBe('fail');
  });
  it('X05 fails when an authored unit lacks listening and reading', () => {
    const r = structuredClone(raw);
    r.listening = r.listening.filter((x) => x.unit_id !== 'n5_u01'); r.passages = r.passages.filter((x) => x.unit_id !== 'n5_u01');
    expect(run(r).X05.errors.length).toBeGreaterThan(0);
  });
  it('X12 lesson-level gating: a word introduced before its kana fails', () => {
    const r = structuredClone(raw);
    const l1 = r.lessons.find((l) => l.id === 'n5_u01_l1'); const l2 = r.lessons.find((l) => l.id === 'n5_u01_l2');
    l2.introduces.vocab = l2.introduces.vocab.filter((v) => v !== 'v_kao'); l1.introduces.vocab.push('v_kao');
    expect(run(r).X12.errors.some((e) => /kana 'か'/.test(e.msg))).toBe(true);
  });
  it('A03 grammar prerequisite cycle fails', () => {
    const g = (id, pre) => ({ id, title: 't', pattern: 'p', meaning_en: 'm', explanation: ['e'], examples: ['s_n5u01_01', 's_n5u01_02', 's_n5u01_03'], practice_question_ids: ['q_n5u01_tr01', 'q_n5u01_tr02', 'q_n5u01_tr03', 'q_n5u01_tr04', 'q_n5u01_tr05', 'q_n5u01_tr06'], unit_id: 'n5_u01', instructional_level: 'N5', provenance: 'orig', prerequisites: pre });
    const r = withItems('grammar', g('fx_g_a', ['fx_g_b']), g('fx_g_b', ['fx_g_a']));
    expect(run(r).A03.errors.some((e) => /cycle/.test(e.msg))).toBe(true);
  });
});
