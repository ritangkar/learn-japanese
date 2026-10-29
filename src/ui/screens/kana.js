import { h, s } from '../dom.js';
import { runSession, summaryCard } from '../session.js';
import { makeEnv, today } from '../env.js';
import { errorCard, back, heroTitle } from '../common.js';
import { generate } from '../../engine/generators.js';
import { showRomajiForKana } from '../../engine/mastery.js';
import { STROKES, hasStrokes, strokePath } from '../../content/strokes.js';

export function strokeDiagram(char, { step = null } = {}) {
  const strokes = STROKES[char];
  const n = strokes.length;
  const shown = step === null ? n : step;
  const svg = s('svg', { viewBox: '0 0 100 100', width: '160', height: '160', role: 'img', 'aria-label': `Stroke order guide for ${char}: ${n} stroke${n === 1 ? '' : 's'}${step !== null ? `, showing stroke ${shown}` : ''}`, class: 'stroke-svg' });
  svg.append(s('rect', { x: 1, y: 1, width: 98, height: 98, class: 'sg-frame', fill: 'none' }), s('line', { x1: 50, y1: 2, x2: 50, y2: 98, class: 'sg-grid' }), s('line', { x1: 2, y1: 50, x2: 98, y2: 50, class: 'sg-grid' }));
  strokes.forEach((pts, i) => {
    if (i >= shown) return;
    svg.append(s('path', { d: strokePath(pts), class: i === shown - 1 && step !== null ? 'sg-stroke current' : 'sg-stroke', fill: 'none' }));
    svg.append(s('circle', { cx: pts[0][0], cy: pts[0][1], r: 5, class: 'sg-dot' }), s('text', { x: pts[0][0], y: pts[0][1] + 2.2, class: 'sg-num', 'text-anchor': 'middle' }, String(i + 1)));
  });
  return svg;
}

function detailCard(k, ctx, content, env) {
  const srs = ctx.store.state.srs; void srs;
  let step = null;
  const box = h('div', { class: 'card detail', id: 'kana-detail', role: 'region', 'aria-label': `Details for ${k.char}` });
  const render = () => {
    const sim = (k.similar_to || []).map((c) => content.kanaByChar[`${k.script}:${c}`]).filter(Boolean);
    const stroke = hasStrokes(k.char) ? h('div', null, h('h3', null, 'Stroke order'), strokeDiagram(k.char, { step }),
      h('div', { class: 'row' }, h('button', { class: 'btn small', type: 'button', onclick: () => { step = step === null ? 1 : Math.min(STROKES[k.char].length, step + 1); render(); } }, step === null ? 'Step through' : 'Next stroke'), h('button', { class: 'btn small', type: 'button', onclick: () => { step = null; render(); } }, 'Show all')),
      h('p', { class: 'small muted' }, 'Simplified guide drawn for this app: the order and number of strokes are what matters; the shapes are approximate. Writing practice is self-assessed: the app cannot check handwriting.')) : h('p', { class: 'banner info' }, 'No stroke guide for this character yet.');
    box.replaceChildren(h('div', { class: 'row between' }, h('span', { class: 'ja ja-xl', lang: 'ja' }, k.char), h('div', null, h('div', { class: 'big' }, k.romaji), h('button', { class: 'btn small', type: 'button', onclick: () => env.audio.speak(k.char) }, '▶ Hear it'))),
      sim.length ? h('p', null, 'Looks similar to: ', sim.map((x) => h('span', { class: 'ja ja-lg', lang: 'ja' }, `${x.char} (${x.romaji}) `))) : null, stroke);
  };
  render();
  return box;
}

export async function kanaScreen({ ctx, query }) {
  let content;
  try { content = await ctx.getContent(); } catch (e) { return errorCard(e); }
  const script = query.script === 'katakana' ? 'katakana' : 'hiragana';
  const env = makeEnv(ctx, content, { seed: `${today()}|kana` });
  const t = today(); const st = ctx.store.state;
  const intro = new Set(st.progress.introduced.kana || []);
  const all = content.kana.filter((k) => k.script === script);
  const groups = [['basic', 'Basic'], ['dakuten', 'With dakuten (゛)'], ['handakuten', 'With handakuten (゜)'], ['youon', 'Combined (youon)'], ['extended', 'Extended'], ['sokuon', 'Small tsu'], ['long', 'Long vowel mark']];
  const detail = h('div', { id: 'detail-host' });
  const chart = h('div', { class: 'stack' });
  for (const [g, label] of groups) {
    const items = all.filter((k) => k.group === g);
    if (!items.length) continue;
    chart.append(h('h3', null, label), h('div', { class: 'kana-grid', role: 'list' }, items.map((k) => {
      const learned = intro.has(k.id);
      const showR = learned ? showRomajiForKana(st.settings.romajiMode, st.srs, k.id, t) : false;
      return h('button', { class: `btn kana-cell${learned ? '' : ' locked'}`, type: 'button', role: 'listitem', lang: 'ja', 'aria-label': `${k.char}${learned ? `, ${k.romaji}` : ', not learned yet'}`, onclick: () => { detail.replaceChildren(detailCard(k, ctx, content, env)); document.getElementById('kana-detail').scrollIntoView({ block: 'nearest' }); } }, k.char, learned && showR ? h('small', { 'aria-hidden': 'true' }, k.romaji) : null, learned ? null : h('small', { 'aria-hidden': 'true' }, '🔒'));
    })));
  }
  const learnedIds = all.filter((k) => intro.has(k.id)).map((k) => k.id);
  const host = h('div', { class: 'stack' }, heroTitle('Kana trainer', 'Learn'),
    h('div', { class: 'row', role: 'tablist', 'aria-label': 'Script' }, ['hiragana', 'katakana'].map((sc) => h('a', { class: 'btn small', role: 'tab', 'aria-selected': sc === script ? 'true' : 'false', href: `#/kana?script=${sc}` }, sc === 'hiragana' ? 'Hiragana ひらがな' : 'Katakana カタカナ'))));
  const practiceBox = h('div', { class: 'card', id: 'kana-practice' });
  const modes = [['kana_recog', 'Read it', 'See a kana, pick its sound.'], ['kana_recall', 'Write it', 'See a sound, type or pick the kana.'], ['kana_listen', 'Hear it', 'Hear a kana, pick the one you heard.'], ['matching', 'Match', 'Pair kana with sounds.']];
  const run = (mode) => {
    const spec = { type: mode, from: 'kana', ids: learnedIds, n: mode === 'matching' ? 6 : 10 };
    const qs = generate(spec, { kana: content.kana, vocab: content.vocab, seed: `${env.seed}|${mode}|${Date.now() % 1000}` });
    practiceBox.replaceChildren(runSession(ctx, env, { title: modes.find((m) => m[0] === mode)[1], questions: qs, onFinish: (summary, stage) => stage.replaceChildren(summaryCard({ title: 'Practice done', summary, actions: [h('button', { class: 'btn primary', type: 'button', onclick: () => ctx.rerender() }, 'Back to the chart')] })) }));
  };
  practiceBox.append(h('h3', null, 'Practise'), learnedIds.length ? h('div', { class: 'grid2' }, modes.map(([m, label, d]) => h('button', { class: 'btn', type: 'button', onclick: () => run(m) }, h('span', null, label), h('small', { class: 'muted' }, d)))) : h('p', { class: 'muted' }, `Finish your first ${script} lesson to unlock practice. Kana you have not met yet are shown locked (🔒) so you can still look at them.`));
  host.append(practiceBox, detail, chart, h('p', { class: 'small muted' }, 'Handwriting: practice on paper or a screen; the app shows the stroke order but cannot check what you write (self-assessed).'), back('#/learn', 'Learn'));
  return host;
}
