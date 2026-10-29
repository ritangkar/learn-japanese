import { describe, it, expect } from 'vitest';
import { kanaToRomaji, romajiToKana, typedToKana, normalizeJa, toHiragana, toKatakana, hasKanji } from '../../src/content/romaji.js';

describe('kana -> romaji', () => {
  const cases = [['ねこ', 'neko'], ['さかな', 'sakana'], ['しお', 'shio'], ['つき', 'tsuki'], ['ちかい', 'chikai'], ['せんせい', 'sensei'], ['ほんや', "hon'ya"], ['きょう', 'kyou'], ['しゃしん', 'shashin'], ['ちゃ', 'cha'], ['じしょ', 'jisho'], ['がっこう', 'gakkou'], ['まっちゃ', 'matcha'], ['ざっし', 'zasshi'], ['おおきい', 'ookii'], ['コーヒー', 'koohii'], ['ティー', 'tii'], ['りょこう', 'ryokou'], ['にほん', 'nihon'], ['でんわ', 'denwa'], ['を', 'o']];
  for (const [k, r] of cases) it(`${k} -> ${r}`, () => expect(kanaToRomaji(k)).toBe(r));
});
describe('romaji -> kana (typing variants)', () => {
  const cases = [['neko', 'ねこ'], ['sakana', 'さかな'], ['shio', 'しお'], ['si', 'し'], ['tsuki', 'つき'], ['tuki', 'つき'], ['kyou', 'きょう'], ['kyo', 'きょ'], ['gakkou', 'がっこう'], ['matcha', 'まっちゃ'], ['sensei', 'せんせい'], ['konnichiha', 'こんにちは'], ['nn', 'ん'], ['hon\'ya', 'ほんや'], ['wo', 'を'], ['zya', 'じゃ'], ['fa', 'ふぁ']];
  for (const [r, k] of cases) it(`${r} -> ${k}`, () => expect(romajiToKana(r)).toEqual({ kana: k, rest: '' }));
  it('reports untranslatable tail', () => expect(romajiToKana('nekoq').rest).toBe('q'));
});
describe('round trip over all basic kana', () => {
  const rows = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわんがぎぐげござじずぜぞだでどばびぶべぼぱぴぷぺぽ';
  it('every single kana round-trips through romaji', () => {
    for (const k of rows) { const r = kanaToRomaji(k); expect(romajiToKana(r).kana, `${k}->${r}`).toBe(k); }
  });
});
describe('normalisation', () => {
  it('katakana <-> hiragana', () => { expect(toHiragana('ネコ')).toBe('ねこ'); expect(toKatakana('ねこ')).toBe('ネコ'); });
  it('NFKC half-width katakana and punctuation', () => { expect(normalizeJa('ﾈｺ。')).toBe('ねこ'); });
  it('typed answer can be romaji or kana', () => { expect(typedToKana('Neko')).toBe('ねこ'); expect(typedToKana('ネコ')).toBe('ねこ'); expect(typedToKana('ねこ')).toBe('ねこ'); });
  it('kanji detection', () => { expect(hasKanji('猫')).toBe(true); expect(hasKanji('ねこ')).toBe(false); });
});
