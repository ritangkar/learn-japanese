// Rendering helpers for Japanese text: lang="ja", ruby (furigana) for kanji the learner has not been introduced to, romaji hints.
import { h } from './dom.js';
import { rubySegments } from '../content/model.js';
import { kanaToRomaji } from '../content/romaji.js';
import { showRomajiForWord } from '../engine/mastery.js';

/** Set of kanji chars the learner has been introduced to (via completed lessons). */
export function knownKanji(content, progress) {
  const ids = new Set(progress.introduced?.kanji || []);
  return new Set(content.kanji.filter((k) => ids.has(k.id)).map((k) => k.char));
}

export function jaNode(text, { ruby = {}, known = new Set(), cls = '' } = {}) {
  const segs = rubySegments(text, ruby, known);
  return h('span', { lang: 'ja', class: `ja ${cls}`.trim() }, segs.map(([b, r]) => (r ? h('ruby', null, b, h('rp', null, '('), h('rt', null, r), h('rp', null, ')')) : b)));
}

/** Romaji hint under a Japanese word, following the learner's romaji mode and mastery (fade rule). */
export function romajiHint(text, env, cls = 'romaji muted small') {
  const kana = text.replace(/\s+/g, '');
  const mode = env.settings.romajiMode;
  if (!/^[ぁ-ゖァ-ヺー]+$/.test(kana)) return null;
  const show = showRomajiForWord(mode, env.store.state.srs, kana, env.content.kanaIdByChar, env.today());
  if (!show) return null;
  return h('div', { class: cls, 'aria-label': `romaji ${kanaToRomaji(kana)}` }, kanaToRomaji(text.replace(/\s+/g, ' ')));
}

export const pctText = (x) => `${Math.round(x * 100)} %`;
export const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
