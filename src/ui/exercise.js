// Exercise renderers. 23 exercise types are served by seven renderers (choice, typed, tiles, matching, self-graded, conversation, drill shells).
import { h } from './dom.js';
import { checkAnswer, SELF_GRADED } from '../engine/check.js';
import { shuffle } from '../engine/prng.js';
import { jaNode, romajiHint } from './format.js';
import { typedToKana } from '../content/romaji.js';
import { RATE_PRESETS } from '../audio/tts.js';

export const CHOICE_TYPES = new Set(['mcq', 'kana_recog', 'fill_blank', 'translate', 'error_correction', 'reading_comp', 'listening_comp', 'dialogue_complete', 'context_vocab', 'exam_style', 'information_retrieval', 'timed_quiz']);
const GRADES = [[1, 'Again', 'I got it wrong'], [2, 'Hard', 'I got it with effort'], [3, 'Good', 'I got it'], [4, 'Easy', 'I got it instantly']];

function audioControls(q, env, text) {
  const st = env.audio.status();
  const box = h('div', { class: 'audio-box card tint' });
  if (!st.supported || !st.hasJapaneseVoice) {
    box.append(h('p', { class: 'banner info', role: 'note' }, 'No Japanese voice was found on this device, so audio is replaced by the transcript. (Audio is optional; nothing is lost.)'), h('div', null, h('strong', null, 'Transcript (no audio on this device): '), jaNode(text, { cls: 'ja-lg' })));
    box.dataset.mode = 'transcript';
    return box;
  }
  let rateKey = 'normal';
  const rates = [['normal', 'Normal'], ['slow', 'Slow'], ['very_slow', 'Very slow']];
  const play = () => env.audio.speak(text, { rate: RATE_PRESETS[rateKey] });
  const btn = h('button', { class: 'btn', type: 'button', 'aria-label': 'Play audio', onclick: play }, '▶ Play');
  const sel = h('div', { class: 'row', role: 'group', 'aria-label': 'Speed' }, rates.map(([k, label]) => h('button', { class: 'btn small', type: 'button', 'aria-pressed': k === rateKey ? 'true' : 'false', onclick: (e) => { rateKey = k; for (const b of sel.children) b.setAttribute('aria-pressed', 'false'); e.currentTarget.setAttribute('aria-pressed', 'true'); play(); } }, label)));
  box.append(h('div', { class: 'row' }, btn, sel), h('p', { class: 'small muted' }, 'Synthetic voice from your device; quality varies. Not native-speaker audio.'));
  box.dataset.mode = 'audio';
  return box;
}

function contextBlock(q, env) {
  const id = q.stem.context_id; if (!id) return null;
  const c = env.content;
  const passage = c.passageById.get(id) || env.extra?.passages?.get?.(id);
  if (passage) {
    return h('div', { class: 'card tint context' }, h('h3', null, passage.title), passage.paragraphs.map((p) => h('p', null, jaNode(p, { ruby: passage.ruby, known: env.known, cls: 'ja-lg' }), romajiHint(p, env))),
      h('details', null, h('summary', null, 'Show English'), h('p', null, passage.translation_en)));
  }
  const sentence = c.sentenceById.get(id);
  if (sentence) return h('div', { class: 'card tint context' }, jaNode(sentence.text_ja, { ruby: sentence.ruby, known: env.known, cls: 'ja-lg' }), romajiHint(sentence.text_ja, env));
  const dlg = c.dialogueById.get(id);
  if (dlg) return h('div', { class: 'card tint context' }, h('h3', null, dlg.title), dlg.turns.map((t) => { const s = c.sentenceById.get(t.sentence_id); return h('p', null, h('strong', null, `${t.speaker}: `), s ? jaNode(s.text_ja, { ruby: s.ruby, known: env.known, cls: 'ja-lg' }) : null); }));
  return null; // listening items have no visible text before answering
}

function feedbackPanel(q, result, env, opts) {
  const ok = result.correct;
  const kind = result.skipped ? 'info' : ok ? 'ok' : result.unverified ? 'warn' : 'bad';
  const head = result.skipped ? 'Skipped' : ok ? 'Correct' : result.unverified ? 'Not in our list' : 'Not quite';
  const icon = result.skipped ? '⏭' : ok ? '✔' : result.unverified ? '?' : '✘';
  const panel = h('div', { class: `banner ${kind} feedback`, role: 'status', 'aria-live': 'polite', dataset: { result: result.skipped ? 'skipped' : ok ? 'correct' : 'wrong' } },
    h('div', null, h('strong', null, `${icon} ${head}`),
      !ok && !result.skipped && !result.unverified ? h('div', null, 'Correct answer: ', answerNode(q, env)) : null,
      result.distractorNote ? h('p', { class: 'small' }, result.distractorNote) : null,
      result.message ? h('p', { class: 'small' }, result.message) : null,
      q.explanation_correct ? h('p', { class: 'small' }, q.explanation_correct) : null));
  if (result.unverified && opts.onSelfOverride) panel.append(h('button', { class: 'btn small', type: 'button', onclick: opts.onSelfOverride }, 'Mark my answer as correct'));
  return panel;
}
function answerNode(q, env) {
  if (q.choices) { const c = q.choices.find((x) => x.id === q.answer); return c ? (c.ja ? jaNode(c.text, { known: env.known }) : c.text) : ''; }
  if (Array.isArray(q.answer)) return jaNode(q.answer.join(' '), { known: env.known });
  return jaNode(String(q.answer), { known: env.known });
}

/**
 * Render a question.
 * @param {object} q question
 * @param {object} env {content, store, audio, settings, known, today(), seed, exam?:boolean}
 * @param {{onChecked:(res:{response:any,result:object,latencyMs:number})=>void, onContinue:()=>void, onChange?:(response:any)=>void, initial?:any}} cb
 */
export function renderQuestion(q, env, cb) {
  const started = performance.now();
  const root = h('section', { class: 'exercise', 'aria-label': 'Question', dataset: { qtype: q.type, qid: q.id } });
  root.q = q; // test hook (read-only reference to the question object)
  const body = h('div', { class: 'ex-body' });
  const footer = h('div', { class: 'ex-footer' });
  root.append(body, footer);
  let response; let checked = false;
  const check = h('button', { class: 'btn primary block', type: 'button', disabled: true, onclick: () => doCheck() }, 'Check');
  const setResponse = (r, ready) => { response = r; check.disabled = !ready; if (cb.onChange) cb.onChange(r); };
  const showFeedback = (res, extra = {}) => {
    checked = true;
    root.classList.add('checked');
    const panel = feedbackPanel(q, res, env, { onSelfOverride: extra.onSelfOverride });
    footer.replaceChildren(panel);
    const cont = h('button', { class: 'btn primary block', type: 'button', onclick: () => cb.onContinue() }, 'Continue');
    footer.append(cont);
    cont.focus({ preventScroll: true });
    cb.onChecked({ response, result: res, latencyMs: Math.round(performance.now() - started) });
  };
  function doCheck() {
    if (checked) return;
    const res = checkAnswer(q, response);
    showFeedback(res, { onSelfOverride: res.unverified ? () => { const r2 = { ...res, correct: true, score: 1, unverified: false, overridden: true, message: null }; showFeedback(r2); } : null });
  }
  if (!env.exam) footer.append(check);

  // ---- header: prompt and context ----
  body.append(h('p', { class: 'prompt' }, q.stem.prompt), contextBlock(q, env));
  if (q.stem.ja) body.append(h('div', { class: 'stem-ja' }, jaNode(q.stem.ja, { ruby: q.stem.ruby, known: env.known, cls: 'ja-xl' }), q.type === 'kana_recog' || q.type === 'mcq' ? romajiHint(q.stem.ja, env) : null));
  const audioText = q.stem.audio_text;
  if (audioText) body.append(audioControls(q, env, audioText));
  const transcriptOnly = audioText && body.querySelector('.audio-box')?.dataset.mode === 'transcript';

  // ---- dictation needs real audio: disabled with explanation ----
  if (q.type === 'dictation' && transcriptOnly) {
    body.append(h('p', { class: 'banner warn' }, 'Dictation needs audio, and this device has no Japanese voice. This exercise is skipped without penalty.'));
    check.remove();
    footer.append(h('button', { class: 'btn block', type: 'button', onclick: () => { response = null; showFeedback({ correct: true, score: 0, skipped: true, expected: q.answer }); } }, 'Skip (no penalty)'));
    return root;
  }

  if (SELF_GRADED.has(q.type)) { renderSelfGraded(q, env, body, footer, (grade) => { response = grade; showFeedback({ ...checkAnswer(q, grade), correct: grade >= 2 }); }); check.remove(); return root; }
  if (q.type === 'conversation_sim') { renderConversation(q, env, body, footer, (res, resp) => { response = resp; showFeedback(res); }); check.remove(); return root; }
  if (q.type === 'matching') { renderMatching(q, env, body, setResponse); return root; }
  if (q.type === 'sentence_order' || (q.tiles && q.tiles.length && !q.choices)) { renderTiles(q, env, body, setResponse); return root; }
  if (q.choices && q.choices.length) { renderChoices(q, env, body, setResponse, check, cb.initial); return root; }
  renderTyped(q, env, body, setResponse, () => doCheck());
  return root;
}

function renderChoices(q, env, body, setResponse, check, initial) {
  const order = shuffle(q.choices, `${env.seed || 's'}|${q.id}`);
  const group = h('div', { class: 'choices', role: 'radiogroup', 'aria-label': 'Answers' });
  const buttons = order.map((c, i) => {
    const b = h('button', { class: 'choice btn block', type: 'button', role: 'radio', 'aria-checked': 'false', dataset: { choice: c.id }, onclick: () => select(c.id) },
      h('span', { class: 'num', 'aria-hidden': 'true' }, `${i + 1}`), c.ja ? jaNode(c.text, { known: env.known, cls: 'ja-lg' }) : h('span', null, c.text), c.ja ? romajiHint(c.text, env, 'romaji muted small inline') : null);
    return b;
  });
  group.append(...buttons);
  function select(id) {
    if (body.closest('.exercise')?.classList.contains('checked')) return;
    buttons.forEach((b) => b.setAttribute('aria-checked', b.dataset.choice === id ? 'true' : 'false'));
    setResponse(id, true);
  }
  body.append(group);
  body.addEventListener('keydown', (e) => { const n = Number(e.key); if (n >= 1 && n <= buttons.length && e.target.tagName !== 'INPUT') { select(order[n - 1].id); } else if (e.key === 'Enter' && !check.disabled && document.activeElement?.getAttribute('role') !== 'radio') check.click(); });
  if (initial) select(initial);
}

function kanaPalette(env, onPick) {
  const intro = new Set(env.store.state.progress.introduced.kana || []);
  const list = env.content.kana.filter((k) => k.script === 'hiragana' && (intro.size ? intro.has(k.id) : true) && [...k.char].length === 1);
  const box = h('div', { class: 'kana-palette', role: 'group', 'aria-label': 'Kana keyboard' }, list.map((k) => h('button', { class: 'btn small kana-key', type: 'button', lang: 'ja', 'aria-label': `${k.char} (${k.romaji})`, onclick: () => onPick(k.char) }, k.char)));
  return box;
}

function renderTyped(q, env, body, setResponse, onEnter) {
  const input = h('input', { type: 'text', id: `in-${q.id}`, lang: 'ja', inputmode: 'text', autocapitalize: 'none', autocomplete: 'off', autocorrect: 'off', spellcheck: 'false', 'aria-describedby': `hint-${q.id}`, enterkeyhint: 'done' });
  const preview = h('div', { class: 'small muted', id: `hint-${q.id}`, 'aria-live': 'polite' }, 'You can type kana, or romaji (it is converted to kana for you).');
  const upd = () => { const v = input.value; const kana = typedToKana(v); preview.textContent = v && kana !== v && /^[a-z'-]+$/i.test(v.trim()) ? `Reads as: ${kana}` : 'You can type kana, or romaji (it is converted to kana for you).'; setResponse(v, v.trim().length > 0); };
  input.addEventListener('input', upd);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && input.value.trim()) { e.preventDefault(); onEnter(); } });
  const pal = kanaPalette(env, (ch) => { input.value += ch; upd(); input.focus(); });
  pal.hidden = true;
  const toggle = h('button', { class: 'btn small', type: 'button', 'aria-expanded': 'false', onclick: () => { pal.hidden = !pal.hidden; toggle.setAttribute('aria-expanded', String(!pal.hidden)); } }, 'Kana keyboard');
  const back = h('button', { class: 'btn small', type: 'button', onclick: () => { input.value = [...input.value].slice(0, -1).join(''); upd(); } }, '⌫');
  body.append(h('label', { for: `in-${q.id}` }, 'Your answer'), input, preview, h('div', { class: 'row' }, toggle, back), pal);
  if (q.type === 'construct' && q.tiles && q.tiles.length) body.append(h('p', { class: 'small muted' }, 'Tip: no Japanese keyboard? Use the kana keyboard above.'));
}

function renderTiles(q, env, body, setResponse) {
  const bank = shuffle(q.tiles || [], `${env.seed || 's'}|${q.id}|tiles`).map((t, i) => ({ t, i, used: false }));
  const answer = [];
  const bankEl = h('div', { class: 'tiles bank', 'aria-label': 'Word bank' });
  const ansEl = h('div', { class: 'tiles answer', 'aria-label': 'Your sentence', 'aria-live': 'polite' }, h('span', { class: 'muted small' }, 'Tap words in order'));
  const render = () => {
    bankEl.replaceChildren(...bank.map((b) => h('button', { class: 'btn tile', type: 'button', lang: 'ja', disabled: b.used, onclick: () => { b.used = true; answer.push(b); render(); } }, b.t)));
    ansEl.replaceChildren(...(answer.length ? answer.map((b, k) => h('button', { class: 'btn tile chosen', type: 'button', lang: 'ja', 'aria-label': `${b.t}, position ${k + 1}. Tap to remove`, onclick: () => { b.used = false; answer.splice(k, 1); render(); } }, b.t)) : [h('span', { class: 'muted small' }, 'Tap words in order')]));
    setResponse(answer.map((b) => b.t), answer.length === bank.length);
  };
  const reset = h('button', { class: 'btn small', type: 'button', onclick: () => { answer.length = 0; bank.forEach((b) => { b.used = false; }); render(); } }, 'Reset');
  body.append(ansEl, bankEl, reset);
  render();
}

function renderMatching(q, env, body, setResponse) {
  const lefts = q.pairs.map((p) => p[0]); const rights = shuffle(q.pairs.map((p) => p[1]), `${env.seed || 's'}|${q.id}|m`);
  const paired = {}; let sel = null;
  const grid = h('div', { class: 'match-grid' });
  const info = h('p', { class: 'small muted', 'aria-live': 'polite' }, 'Choose a kana, then its sound.');
  const render = () => {
    const usedR = new Set(Object.values(paired));
    const label = (l) => Object.keys(paired).indexOf(l) + 1;
    const col1 = h('div', { class: 'col' }, lefts.map((l) => h('button', { class: 'btn match', type: 'button', lang: 'ja', 'aria-pressed': sel === l ? 'true' : 'false', disabled: l in paired, onclick: () => { sel = l; render(); } }, l, l in paired ? h('span', { class: 'pairno' }, ` ①②③④⑤⑥⑦⑧`[label(l)] || '·') : null)));
    const col2 = h('div', { class: 'col' }, rights.map((r) => { const l = Object.keys(paired).find((k) => paired[k] === r); return h('button', { class: 'btn match', type: 'button', disabled: usedR.has(r) || !sel, onclick: () => { paired[sel] = r; sel = null; render(); } }, r, l ? h('span', { class: 'pairno' }, ` ①②③④⑤⑥⑦⑧`[label(l)] || '·') : null); }));
    grid.replaceChildren(col1, col2);
    info.textContent = sel ? `Now choose the sound for ${sel}.` : Object.keys(paired).length === lefts.length ? 'All paired. Press Check.' : 'Choose a kana, then its sound.';
    setResponse({ ...paired }, Object.keys(paired).length === lefts.length);
  };
  const undo = h('button', { class: 'btn small', type: 'button', onclick: () => { for (const k of Object.keys(paired)) delete paired[k]; sel = null; render(); } }, 'Start over');
  body.append(grid, info, undo);
  render();
}

function renderSelfGraded(q, env, body, footer, onGrade) {
  const label = { flashcard: 'Flashcard', srs_review: 'Review card', handwriting_guided: 'Guided handwriting', shadowing: 'Shadowing' }[q.type];
  const info = { handwriting_guided: 'Self-assessed: this app cannot read or check your handwriting. Write it on paper or a screen, then rate yourself honestly.', shadowing: 'Self-assessed: listen, repeat aloud, and rate yourself. There is no pronunciation scoring.' }[q.type];
  if (info) body.append(h('p', { class: 'banner info', role: 'note' }, info));
  const back = h('div', { class: 'card tint', hidden: true }, h('div', null, h('strong', null, 'Answer: '), answerNode(q, env)), q.explanation_correct ? h('p', { class: 'small' }, q.explanation_correct) : null);
  const show = h('button', { class: 'btn primary block', type: 'button', onclick: () => { back.hidden = false; show.remove(); grades.hidden = false; grades.querySelector('button').focus(); } }, q.type === 'flashcard' || q.type === 'srs_review' ? 'Show answer' : 'I have tried it');
  const grades = h('div', { class: 'grade-row', role: 'group', 'aria-label': 'How did it go?', hidden: true }, GRADES.map(([g, name, d]) => h('button', { class: 'btn', type: 'button', title: d, onclick: () => onGrade(g) }, `${g} · ${name}`)));
  body.append(h('p', { class: 'muted small' }, label), back);
  footer.append(show, grades);
}

function renderConversation(q, env, body, footer, done) {
  const steps = q.steps || [];
  let i = 0; const picks = []; let score = 0;
  const log = h('div', { class: 'convo', 'aria-live': 'polite' });
  const opts = h('div', { class: 'choices' });
  body.append(log, opts);
  const step = () => {
    if (i >= steps.length) { const s = steps.length ? score / steps.length : 0; done({ correct: s >= 0.8, score: s, expected: 'best replies', explanation: q.explanation_correct }, picks); return; }
    const st = steps[i];
    log.append(h('div', { class: 'bubble npc' }, h('strong', null, `${st.speaker || 'Other person'}: `), jaNode(st.ja, { cls: 'ja-lg' }), st.en ? h('div', { class: 'small muted' }, st.en) : null));
    opts.replaceChildren(...st.options.map((o) => h('button', { class: 'choice btn block', type: 'button', onclick: () => { picks.push(o.id); score += o.quality === 'best' ? 1 : o.quality === 'ok' ? 0.5 : 0; log.append(h('div', { class: 'bubble you' }, h('strong', null, 'You: '), jaNode(o.text, { cls: 'ja-lg' }), h('div', { class: 'small' }, `${o.quality === 'best' ? '✔ Natural reply.' : o.quality === 'ok' ? '~ Understandable.' : '✘ Not a good fit.'} ${o.feedback || ''}`))); i++; step(); } }, jaNode(o.text, { cls: 'ja-lg' }), o.en ? h('span', { class: 'small muted' }, ` (${o.en})`) : null)));
  };
  void footer;
  step();
}
