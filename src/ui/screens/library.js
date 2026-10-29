import { h } from '../dom.js';
import { jaNode, romajiHint } from '../format.js';
import { makeEnv } from '../env.js';
import { errorCard, statusBadge, back, heroTitle } from '../common.js';
import { conceptMastery, MASTERY_LABEL } from '../../engine/mastery.js';
import { today } from '../env.js';
import { LEVEL_LABEL } from '../labels.js';

export async function libraryScreen({ ctx, query }) {
  let content;
  try { content = await ctx.getContent(); } catch (e) { return errorCard(e); }
  const tab = query.tab || 'vocab'; const q = (query.q || '').toLowerCase();
  const env = makeEnv(ctx, content);
  const list = h('div', { class: 'stack' });
  const known = new Set(Object.values(ctx.store.state.progress.introduced).flat());
  const t = today();
  const render = () => {
    list.replaceChildren();
    if (tab === 'vocab') {
      const items = content.vocab.filter((v) => !q || `${v.surface} ${v.reading_kana} ${v.romaji} ${v.meanings_en.join(' ')}`.toLowerCase().includes(q));
      list.append(h('p', { class: 'small muted' }, `${items.length} word(s). Only words from released units appear. Words you have not met in a lesson are shown but marked "not yet learned".`));
      items.forEach((v) => { const m = conceptMastery(ctx.store.state.srs, v.id, t); const seen = known.has(v.id);
        list.append(h('div', { class: 'card' }, h('div', { class: 'row between' }, h('span', null, jaNode(v.surface, { cls: 'ja-lg' }), ' ', romajiHint(v.reading_kana, env, 'romaji muted small inline')), statusBadge(v.content_status)),
          h('div', null, v.meanings_en.join('; '), h('span', { class: 'muted small' }, ` · ${v.pos}`)), v.note ? h('p', { class: 'small muted' }, v.note) : null,
          h('div', { class: 'row' }, h('span', { class: 'chip' }, seen ? MASTERY_LABEL[m.state] : 'not yet learned'), h('span', { class: 'chip' }, v.unit_id), h('button', { class: 'btn small', type: 'button', 'aria-label': `Hear ${v.reading_kana}`, onclick: () => ctx.audio.speak(v.reading_kana) }, '▶')))); });
    } else if (tab === 'grammar') {
      const items = content.grammar.filter((g) => !q || `${g.title} ${g.pattern} ${g.meaning_en}`.toLowerCase().includes(q));
      if (!items.length) list.append(h('div', { class: 'card' }, h('p', null, 'No grammar points are released yet. Grammar starts in unit n5_u03 (still being written); see Content status.')));
      items.forEach((g) => list.append(h('div', { class: 'card' }, h('h3', null, g.title), h('p', null, g.pattern), h('p', null, g.meaning_en), statusBadge(g.content_status))));
    } else {
      const items = content.kanji;
      if (!items.length) list.append(h('div', { class: 'card' }, h('p', null, 'No kanji are released yet (the first kanji arrive in unit n5_u04, still being written). Kana come first.')));
      items.forEach((k) => list.append(h('a', { class: 'card', href: `#/kanji/${k.id}` }, jaNode(k.char, { cls: 'ja-xl' }), ' ', k.meanings_en.join(', '))));
    }
  };
  const tabs = h('div', { class: 'row', role: 'tablist', 'aria-label': 'Library sections' }, [['vocab', 'Vocabulary'], ['grammar', 'Grammar'], ['kanji', 'Kanji']].map(([id, label]) => h('a', { class: 'btn small', role: 'tab', 'aria-selected': tab === id ? 'true' : 'false', href: `#/library?tab=${id}${q ? `&q=${encodeURIComponent(q)}` : ''}` }, label)));
  const search = h('div', null, h('label', { for: 'lib-q' }, 'Search'), h('input', { type: 'text', id: 'lib-q', value: query.q || '', oninput: (e) => { clearTimeout(search._t); search._t = setTimeout(() => { location.hash = `#/library?tab=${tab}&q=${encodeURIComponent(e.target.value)}`; }, 250); } }));
  render();
  return h('div', { class: 'stack' }, heroTitle('Library', 'Learn'), h('p', { class: 'small muted' }, LEVEL_LABEL), tabs, search, list);
}

export async function kanjiScreen({ ctx, params }) {
  let content;
  try { content = await ctx.getContent(); } catch (e) { return errorCard(e); }
  const k = content.kanjiById.get(params.id);
  if (!k) return h('div', null, h('p', null, 'This kanji is not available yet.'), back('#/library?tab=kanji', 'Library'));
  return h('div', { class: 'stack' }, back('#/library?tab=kanji', 'Library'), h('div', { class: 'card' }, jaNode(k.char, { cls: 'ja-xl' }), h('p', null, k.meanings_en.join(', ')), h('p', null, 'On: ', k.on_readings.join('、 ') || '—', ' · Kun: ', k.kun_readings.join('、 ') || '—'), k.reading_notes ? h('p', { class: 'small' }, k.reading_notes) : null,
    h('p', { class: 'banner info', id: 'stroke-na' }, 'Stroke order is not available yet for kanji.')));
}
