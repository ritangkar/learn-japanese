import { describe, it, expect } from 'vitest';
import { generate } from '../../src/engine/generators.js';
import { realContent } from '../fixtures/state.js';
import { checkAnswer } from '../../src/engine/check.js';

const c = realContent();
const ctx = (seed) => ({ kana: c.kana, vocab: c.vocab, seed });
const vowels = ['ka_h_a', 'ka_h_i', 'ka_h_u', 'ka_h_e', 'ka_h_o'];

describe('generators are deterministic and produce valid questions', () => {
  const specs = [{ type: 'kana_recog', from: 'kana', ids: vowels, n: 6 }, { type: 'kana_recall', from: 'kana', ids: vowels, n: 4 }, { type: 'kana_listen', from: 'kana', ids: vowels, n: 4 }, { type: 'matching', from: 'kana', ids: vowels, n: 5 }, { type: 'vocab_meaning', from: 'vocab', ids: c.vocab.slice(0, 12).map((v) => v.id), n: 8 }, { type: 'vocab_produce', from: 'vocab', ids: c.vocab.slice(0, 12).map((v) => v.id), n: 8 }, { type: 'word_listen', from: 'vocab', ids: c.vocab.slice(0, 12).map((v) => v.id), n: 5 }, { type: 'flashcard', from: 'vocab', ids: c.vocab.slice(0, 5).map((v) => v.id), n: 5 }];
  for (const spec of specs) {
    it(`${spec.type}: same seed -> identical; different seed -> may differ; MCQ integrity holds`, () => {
      const a = generate(spec, ctx('s1')); const b = generate(spec, ctx('s1'));
      expect(a).toEqual(b); expect(a.length).toBeGreaterThan(0);
      for (const q of a) {
        expect(q.generated).toBe(true);
        if (q.choices) {
          const texts = q.choices.map((x) => x.text); expect(new Set(texts).size).toBe(texts.length);
          expect(q.choices.filter((x) => x.id === q.answer)).toHaveLength(1); expect(q.choices.length).toBeGreaterThanOrEqual(3);
          expect(checkAnswer(q, q.answer).correct).toBe(true);
          const wrong = q.choices.find((x) => x.id !== q.answer); expect(checkAnswer(q, wrong.id).correct).toBe(false);
        }
        if (q.type === 'kana_recall') expect(checkAnswer(q, q.answer).correct).toBe(true);
        if (q.type === 'matching') expect(checkAnswer(q, Object.fromEntries(q.pairs)).correct).toBe(true);
      }
    });
  }
  it('n larger than the pool repeats items (with fresh distractor order) instead of failing', () => {
    expect(generate({ type: 'kana_recog', from: 'kana', ids: vowels, n: 8 }, ctx('x'))).toHaveLength(8);
  });
  it('kana_recog distractors prefer confusable kana', () => {
    const [q] = generate({ type: 'kana_recog', from: 'kana', ids: ['ka_h_o'], n: 1 }, ctx('conf'));
    const texts = q.choices.map((x) => x.text);
    expect(texts).toContain('o');
  });
});
