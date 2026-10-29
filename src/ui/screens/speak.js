import { h } from '../dom.js';
import { errorCard, back } from '../common.js';
import { jaNode, romajiHint } from '../format.js';
import { makeEnv } from '../env.js';
import { startRecording, recorderSupport } from '../../audio/index.js';

export async function speakScreen({ ctx }) {
  let content;
  try { content = await ctx.getContent(); } catch (e) { return errorCard(e); }
  const env = makeEnv(ctx, content);
  const done = new Set(Object.keys(ctx.store.state.progress.lessons));
  const phrases = content.sentences.filter((s) => s.kind === 'expression' && done.has(content.lessons.find((l) => l.unit_id === s.unit_id && (l.introduces.vocab || []).some((v) => s.vocab_ids.includes(v)))?.id));
  const box = h('div', { class: 'stack' }); let current = null; let url = null; let rec = null;
  const status = h('p', { role: 'status', 'aria-live': 'polite', id: 'rec-status', class: 'small muted' });
  const player = h('div', { id: 'rec-player' });
  const clear = () => { if (url) { URL.revokeObjectURL(url); url = null; } player.replaceChildren(); };
  ctx.cleanup = () => { clear(); if (rec) { try { rec.stop(); } catch { /* ignore */ } } };
  const select = (s) => { current = s; clear(); status.textContent = ''; render(); };
  const supported = recorderSupport(window);
  function render() {
    box.replaceChildren(h('div', { class: 'card' }, h('div', { class: 'big' }, jaNode(current.text_ja, { cls: 'ja-xl' })), romajiHint(current.text_ja, env), h('p', null, current.translation_en),
      h('div', { class: 'row' }, h('button', { class: 'btn', type: 'button', onclick: () => ctx.audio.speak(current.reading_kana) }, '▶ Listen'), h('button', { class: 'btn', type: 'button', onclick: () => ctx.audio.speak(current.reading_kana, { rate: 0.5 }) }, '▶ Slow')),
      h('p', { class: 'banner info' }, 'Self-assessed: there is no pronunciation scoring. Listen, repeat aloud, and compare. The voice is synthetic.'),
      supported ? h('div', null, h('p', { class: 'small' }, 'Optional: record yourself to compare. The microphone is used only after you tap Record; the recording stays on this device, is never uploaded and disappears when you leave this screen.'),
        h('div', { class: 'row' }, h('button', { class: 'btn', type: 'button', id: 'rec-start', onclick: async (e) => { clear(); status.textContent = 'Asking for the microphone…'; const r = await startRecording(window); if (!r.ok) { status.textContent = r.reason === 'denied' ? 'Microphone permission was not given. That is fine: use listen-and-repeat below.' : 'Recording is not available here. Use listen-and-repeat below.'; return; } rec = r; status.textContent = 'Recording… (up to 30 seconds)'; e.currentTarget.disabled = true; document.getElementById('rec-stop').disabled = false; } }, '● Record'),
          h('button', { class: 'btn', type: 'button', id: 'rec-stop', disabled: true, onclick: async () => { const res = await rec.stop(); rec = null; url = res.url; status.textContent = 'Recorded. Play it back and compare.'; player.replaceChildren(h('audio', { controls: true, src: url }), h('button', { class: 'btn small', type: 'button', onclick: () => { clear(); status.textContent = 'Recording deleted.'; } }, 'Delete recording')); document.getElementById('rec-start').disabled = false; document.getElementById('rec-stop').disabled = true; } }, '■ Stop')), player)
        : h('p', { class: 'banner info' }, 'Recording is not available in this browser, so use listen-and-repeat: play the phrase, say it aloud, and tick the checklist.'),
      status,
      h('fieldset', null, h('legend', null, 'Self-check'), ['I said it at an even speed', 'I gave every beat the same length', 'The ends of words did not fade away'].map((t, i) => h('label', { class: 'check', for: `chk${i}` }, h('input', { type: 'checkbox', id: `chk${i}` }), t)))));
  }
  if (!phrases.length) return h('div', { class: 'stack' }, back('#/learn', 'Learn'), h('h2', null, 'Speaking practice'), h('div', { class: 'card' }, h('p', null, 'Finish the greetings lesson first, then phrases you have learned appear here for listen-and-repeat practice.'), h('p', { class: 'small muted' }, 'Speaking practice is optional, never scored, and works without a microphone.')));
  select(phrases[0]);
  return h('div', { class: 'stack' }, back('#/learn', 'Learn'), h('h2', null, 'Speaking practice'),
    h('div', { class: 'row', role: 'group', 'aria-label': 'Phrases' }, phrases.map((p) => h('button', { class: 'btn small', type: 'button', lang: 'ja', onclick: () => select(p) }, p.text_ja))), box);
}
