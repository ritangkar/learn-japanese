// Kana <-> romaji (modified Hepburn, macron-less: long vowels are written by repeating the vowel / "ou", "ei").
// Used by validator A04, typed-answer normalisation and the romaji-fade display.

const BASE = {
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o', か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko', さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
  た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to', な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no', は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo', や: 'ya', ゆ: 'yu', よ: 'yo', ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro', わ: 'wa', を: 'o', ん: 'n',
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go', ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo', だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do',
  ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo', ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po', ゔ: 'vu',
  ぁ: 'a', ぃ: 'i', ぅ: 'u', ぇ: 'e', ぉ: 'o',
};
const YOUON_SMALL = { ゃ: 'ya', ゅ: 'yu', ょ: 'yo' };
const YOUON_BASE = { き: 'ky', ぎ: 'gy', し: 'sh', じ: 'j', ち: 'ch', に: 'ny', ひ: 'hy', び: 'by', ぴ: 'py', み: 'my', り: 'ry', ぢ: 'j' };
const YOUON_VOWEL = { ゃ: 'a', ゅ: 'u', ょ: 'o' };
// extended digraphs used by katakana loanwords (ティ, ファ, ...)
const EXT = { てぃ: 'ti', でぃ: 'di', とぅ: 'tu', どぅ: 'du', ふぁ: 'fa', ふぃ: 'fi', ふぇ: 'fe', ふぉ: 'fo', うぃ: 'wi', うぇ: 'we', うぉ: 'wo', しぇ: 'she', じぇ: 'je', ちぇ: 'che', ゔぁ: 'va', ゔぃ: 'vi', ゔぇ: 've', ゔぉ: 'vo', つぁ: 'tsa' };

export function toHiragana(str) {
  return [...str].map((ch) => {
    const c = ch.codePointAt(0);
    return c >= 0x30a1 && c <= 0x30f6 ? String.fromCodePoint(c - 0x60) : ch;
  }).join('');
}
export function toKatakana(str) {
  return [...str].map((ch) => {
    const c = ch.codePointAt(0);
    return c >= 0x3041 && c <= 0x3096 ? String.fromCodePoint(c + 0x60) : ch;
  }).join('');
}
export const isKana = (s) => /^(?:[\u3041-\u3096\u30a1-\u30fa\u30fc\u30fb\u309d\u309e\u30fd\u30fe]|\u3099|\u309a)+$/.test(s);
export const isHiragana = (s) => /^[ぁ-ゖー]+$/.test(s);
export const hasKanji = (s) => /[㐀-䶿一-鿿豈-﫿々〆]/.test(s);
export const kanjiOf = (s) => [...s].filter((c) => /[㐀-䶿一-鿿豈-﫿]/.test(c));

/** Kana (hiragana or katakana) -> canonical romaji. Unknown characters are passed through. */
export function kanaToRomaji(input) {
  const s = [...toHiragana(input)];
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === 'っ') {
      // sokuon: double the next consonant (tch for ch)
      const rest = kanaToRomaji(s.slice(i + 1, i + 3).join('')).replace(/^(.).*/, '$1');
      const nxt = kanaToRomaji(s.slice(i + 1, i + 3).join(''));
      if (nxt.startsWith('ch')) out += 't'; else if (/^[bcdfghjklmnpqrstvwxyz]/.test(nxt)) out += rest;
      continue;
    }
    if (c === 'ー') { const m = /[aiueo](?=[^aiueo]*$)/.exec(out); out += m ? m[0] : ''; continue; }
    const two = c + (s[i + 1] || '');
    if (EXT[two]) { out += EXT[two]; i++; continue; }
    if (s[i + 1] && YOUON_SMALL[s[i + 1]] && YOUON_BASE[c]) {
      const b = YOUON_BASE[c]; const v = YOUON_VOWEL[s[i + 1]];
      out += (b === 'sh' || b === 'ch' || b === 'j') ? b + v : b + (v === 'a' ? 'a' : v === 'u' ? 'u' : 'o'); i++; continue;
    }
    if (c === 'ん') {
      const nx = s[i + 1] ? BASE[s[i + 1]] || '' : '';
      out += /^[aiueoy]/.test(nx) ? "n'" : 'n';
      continue;
    }
    if (YOUON_SMALL[c]) { out += YOUON_SMALL[c]; continue; }
    out += BASE[c] ?? c;
  }
  // vowel-extension for long vowels written with う/い is already literal (ou, ei); nothing to collapse.
  return out;
}

// ---- romaji -> hiragana (accepts common typing variants) ----
const R2K = [];
for (const [k, r] of Object.entries(BASE)) if (!R2K.some(([x]) => x === r)) R2K.push([r, k]);
const VARIANTS = { si: 'し', ti: 'ち', tu: 'つ', hu: 'ふ', zi: 'じ', tsi: 'つぃ', sya: 'しゃ', syu: 'しゅ', syo: 'しょ', tya: 'ちゃ', tyu: 'ちゅ', tyo: 'ちょ', zya: 'じゃ', zyu: 'じゅ', zyo: 'じょ', ja: 'じゃ', ju: 'じゅ', jo: 'じょ', wo: 'を', di: 'ぢ', du: 'づ', la: 'ぁ', xa: 'ぁ', xtu: 'っ', ltu: 'っ', xya: 'ゃ', xyu: 'ゅ', xyo: 'ょ', lya: 'ゃ', lyu: 'ゅ', lyo: 'ょ', fa: 'ふぁ', fi: 'ふぃ', fe: 'ふぇ', fo: 'ふぉ', vu: 'ゔ' };
const YOUON_R = {};
for (const [k, r] of Object.entries(YOUON_BASE)) for (const [sm, v] of Object.entries(YOUON_VOWEL)) { const key = (r === 'sh' || r === 'ch' || r === 'j') ? r + v : r + (v === 'a' ? 'a' : v === 'u' ? 'u' : 'o'); if (!YOUON_R[key]) YOUON_R[key] = k + sm; }
const TABLE = new Map([...R2K, ...Object.entries(YOUON_R), ...Object.entries(EXT).filter(([k]) => k !== 'とぅ' && k !== 'どぅ').map(([k, v]) => [v, k]), ...Object.entries(VARIANTS)]);
const MAXLEN = Math.max(...[...TABLE.keys()].map((k) => k.length));

/** Romaji -> hiragana. Returns {kana, rest} where rest is any untranslated tail (empty when fully converted). */
export function romajiToKana(input) {
  const s = input.toLowerCase().replace(/\s+/g, '');
  let out = '';
  let i = 0;
  while (i < s.length) {
    // sokuon: doubled consonant (not n)
    if (i + 1 < s.length && s[i] === s[i + 1] && /[bcdfghjkmpqrstvwxyz]/.test(s[i])) { out += 'っ'; i++; continue; }
    if (s[i] === 't' && s[i + 1] === 'c' && s[i + 2] === 'h') { out += 'っ'; i++; continue; }
    if (s[i] === 'n') {
      if (s[i + 1] === "'" ) { out += 'ん'; i += 2; continue; }
      if (s[i + 1] === 'n' && !/^[aiueoy]/.test(s.slice(i + 2, i + 3))) { out += 'ん'; i += 2; continue; }
      if (s[i + 1] === 'n' && /^[aiueoy]/.test(s.slice(i + 2, i + 3))) { out += 'ん'; i += 1; continue; }
      if (i + 1 === s.length || !/[aiueoy]/.test(s[i + 1])) { out += 'ん'; i++; continue; }
    }
    let matched = false;
    for (let len = Math.min(MAXLEN, s.length - i); len >= 1; len--) {
      const k = TABLE.get(s.slice(i, i + len));
      if (k) { out += k; i += len; matched = true; break; }
    }
    if (!matched) return { kana: out, rest: s.slice(i) };
  }
  return { kana: out, rest: '' };
}

/** Normalise typed Japanese for comparison: NFKC, katakana -> hiragana, strip spaces and punctuation. */
export function normalizeJa(str) {
  return toHiragana(String(str).normalize('NFKC')).replace(/[\s\u3000。、．，.,!?！？「」『』・~〜]/g, '');
}
/** Normalise a typed answer that may be romaji or kana into hiragana when fully convertible. */
export function typedToKana(str) {
  const n = normalizeJa(str);
  if (/^[ぁ-ゖー]+$/.test(n)) return n;
  if (/^[a-z'-]+$/i.test(n)) { const r = romajiToKana(n); if (!r.rest) return r.kana; }
  return n;
}
