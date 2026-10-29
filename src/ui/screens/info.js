import { h } from '../dom.js';
import { installCard } from '../install-ui.js';
import { progress as progressBar } from '../components.js';
import { errorCard, statusBadge, heroTitle } from '../common.js';
import { LEVEL_LABEL, MOCK_DISCLAIMER } from '../labels.js';
import { dayToDate } from '../../core/clock.js';

const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = () => (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;

export function tourScreen({ ctx }) {
  let step = 0;
  const host = h('div', { class: 'stack' });
  const steps = [
    ['A journey across Japan', [h('p', null, 'Learn Japanese by travelling: each stop on the map, from Tokyo to Okinawa, opens when you have learned the language it needs. You earn stamps and postcards for real practice, never for just opening the app.'), h('p', { class: 'muted' }, 'This is original practice material. It is not made by, endorsed by, or an official part of the JLPT.')]],
    ['Short daily sessions', [h('p', null, 'Press "Start today" for a session of about 30 minutes: reviews of what you are about to forget, one new lesson, some listening or reading, and a quest step for your current stop. You can stop whenever you like. If you miss days, nothing is lost: you simply get a gentle warm-up.')]],
    ['Sound is optional', [h('p', null, 'Spoken Japanese uses your device\'s text-to-speech voice (synthetic, quality varies). If your device has no Japanese voice, exercises show a transcript instead. Background ambience is off until you turn it on.'), h('a', { class: 'btn', href: '#/audio' }, 'Sound settings')]],
    ['Your data stays on this device', [h('p', null, 'There are no accounts and nothing is uploaded. Progress is saved in this browser. Back it up to a file now and then (Me → Backup), especially before switching phones.'),
      isIOS() && !isStandalone() ? h('div', { class: 'banner warn' }, h('strong', null, 'iPhone tip: '), 'Safari may clear a website\'s saved data after 7 days without use. Tap Share, then "Add to Home Screen", then open the app from there. Installed apps are not affected by that rule. Backups are still a good idea.') : h('p', { class: 'small muted' }, isStandalone() ? 'This app is installed. ' : 'Android (Chrome): the menu has "Install app"; it also works offline once installed. iPhone (Safari): Share → Add to Home Screen.')]],
  ];
  const render = () => {
    const [title, body] = steps[step];
    const inst = step === 0 || step === steps.length - 1 ? installCard(ctx, { onChange: render }) : null;
    host.replaceChildren(h('div', { class: 'page-hero', style: 'min-height:120px' }, h('p', { class: 'eyebrow' }, `Welcome · step ${step + 1} of ${steps.length}`), h('h1', null, `${title}`)), progressBar((100 * (step + 1)) / steps.length, { thin: true, label: 'Tour progress' }), h('div', { class: 'card' }, body), inst,
      h('div', { class: 'row' }, step > 0 ? h('button', { class: 'btn', type: 'button', onclick: () => { step--; render(); } }, 'Back') : null,
        step < steps.length - 1 ? h('button', { class: 'btn primary', type: 'button', onclick: () => { step++; render(); } }, 'Next') : h('button', { class: 'btn primary', type: 'button', id: 'tour-done', onclick: () => { ctx.store.update('meta', (m) => ({ ...m, tourDone: true })); ctx.store.flush(); ctx.tourSkipped = true; location.hash = '#/'; } }, 'Start exploring'),
        h('button', { class: 'btn small', type: 'button', onclick: () => { ctx.store.update('meta', (m) => ({ ...m, tourDone: true })); ctx.tourSkipped = true; location.hash = '#/'; } }, 'Skip')));
  };
  render();
  const unsub = ctx.install.subscribe(render); ctx.cleanup = () => unsub();
  return host;
}

export async function contentStatusScreen({ ctx }) {
  let content;
  try { content = await ctx.getContent(); } catch (e) { return errorCard(e); }
  const targets = content.core.coverage_targets; const mt = content.core.mock_targets;
  const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
  const rows = levels.map((L) => {
    const units = content.units.filter((u) => u.level === L); const rel = units.filter((u) => u.released);
    const b = content.index.levels[L]; void b;
    const mocks = content.mockIndex.filter((m) => m.level === L).length;
    const t = targets[L];
    const cnt = (k) => content.bundles[L] ? content.bundles[L][k].length : null;
    return { L, units: units.length, rel: rel.length, vocab: cnt('vocab'), kanji: cnt('kanji'), grammar: cnt('grammar'), dialogues: cnt('dialogues'), passages: cnt('passages'), t, mocks, target: mt.release_1_target[L] };
  });
  const cell = (n, t) => (n === null ? '–' : `${n} / ${t}`);
  return h('div', { class: 'stack' }, heroTitle('Content status and coverage', 'About'),
    h('div', { class: 'banner info' }, 'Everything shown to learners passed automated checks only ("Auto-checked"). No native speaker has reviewed any content yet, so mistakes are possible. The share of human-reviewed content is 0 %. Readings are not dictionary-verified.'),
    h('div', { class: 'card', style: null }, h('table', null, h('thead', null, h('tr', null, ['Level', 'Units released', 'Vocabulary', 'Kanji', 'Grammar', 'Dialogues', 'Passages', 'Mocks released'].map((x) => h('th', { scope: 'col' }, x)))),
      h('tbody', null, rows.map((r) => h('tr', null, h('th', { scope: 'row' }, r.L), h('td', null, `${r.rel} of ${r.units}`), h('td', null, cell(r.vocab, r.t.vocab)), h('td', null, cell(r.kanji, r.t.kanji)), h('td', null, cell(r.grammar, r.t.grammar_points)), h('td', null, cell(r.dialogues, r.t.dialogues)), h('td', null, cell(r.passages, r.t.reading_passages)), h('td', null, `${r.mocks} of 20`)))))),
    h('p', { class: 'small muted' }, 'The second number is the release-1 planning target, not a claim about the real size of a JLPT level. "–" means that level\'s content has not been loaded on this device. Mock exams: the long-term goal is 20 per level (100 total); the first release does not reach it (limitation L-01), and mocks are never copied, shuffled or relabelled to pad the count.'),
    h('div', { class: 'card' }, h('h3', null, 'Units'), h('ul', null, content.units.map((u) => h('li', null, `${u.id} · ${u.title} `, statusBadge(u.content_status))))),
    h('p', { class: 'small' }, `${LEVEL_LABEL}: there are no official JLPT lists for words, kanji or grammar, so our level tags are our own. Cultural notes are always shown as unverified. Content version ${content.contentVersion}.`));
}

export function privacyScreen() {
  return h('div', { class: 'stack' }, heroTitle('Privacy', 'About'),
    h('div', { class: 'card' }, h('ul', null,
      h('li', null, 'Everything stays on your device. There are no accounts, no analytics, no ads, no cookies and no tracking.'),
      h('li', null, 'Your progress is stored in your browser\'s local storage. Clearing site data erases it, so use Backup.'),
      h('li', null, 'The app makes no requests to other websites. It only loads its own files, and works offline after the first full load.'),
      h('li', null, 'Speaking practice (optional): the microphone is used only after you tap Record. Recordings stay in memory on your device, are never uploaded, and disappear when you leave the screen unless you save them yourself.'),
      h('li', null, 'Backup files are created and read on your device only.'))));
}

export function aboutScreen({ ctx }) {
  const lim = [['L-01', 'The goal of 20 distinct mock exams per level (100 in total) is not met in this release. The number of mocks released per level is shown on the JLPT screen and in Content status.'], ['L-02', 'Listening audio is synthetic (your device\'s text-to-speech voice). It is not native-speaker exam audio, and natural-speed multi-speaker listening at N2/N1 cannot be faithfully reproduced.'], ['L-03', 'There is no pronunciation scoring. Recording is optional and for self-comparison only.'], ['L-04', 'There is no handwriting recognition. Writing practice is self-assessed.'], ['L-05', 'Content coverage is partial at every level. Coverage badges show what is actually released; no level is complete.'], ['L-06', 'Results are practice estimates, not JLPT scores. Official scores are scaled and cannot be reproduced from practice results.'], ['L-07', 'On iPhone, Safari may clear saved data after 7 days without use unless the app is added to the Home Screen. There is no automatic install prompt on iOS.'], ['L-08', 'Ambience is stylised and generated on your device; it does not sound like a specific real place.'], ['L-09', 'Research on learners\' experience was limited; claims about what motivates learners are low-confidence.'], ['L-10', 'No native-speaker review exists for this project, so no content is marked "human reviewed".']];
  return h('div', { class: 'stack' }, heroTitle('About and limitations', 'About'),
    h('div', { class: 'card' }, h('p', null, 'Tabi Nihongo (working title) is a free, offline-first Japanese-learning app organised as a journey across Japan. It is original practice material and is not affiliated with, endorsed by, or an official part of the JLPT. Results are shown as "Practice estimate — not a JLPT score".'),
      h('p', null, MOCK_DISCLAIMER)),
    h('div', { class: 'card' }, h('h3', null, 'Known limitations'), h('ul', { id: 'limitations' }, lim.map(([id, t]) => h('li', null, h('strong', null, `${id}: `), t)))),
    h('div', { class: 'card' }, h('h3', null, 'Official JLPT facts'), h('p', null, 'Timing, sections and pass marks in this app come from the JLPT website (jlpt.jp) as checked on 2026-10-29 and may change. Check jlpt.jp before relying on them.'), h('p', { class: 'small muted' }, 'This app does not copy or reproduce official sample questions or workbook text.')),
    h('p', { class: 'small muted' }, `App version 0.1.0 · ${ctx.store.state.meta.schemaVersion ? 'data version 1' : ''}`));
}

export async function creditsScreen({ ctx }) {
  let content = null;
  try { content = await ctx.getContent(); } catch { /* shown without manifest */ }
  const assets = content ? content.core.assets : [];
  return h('div', { class: 'stack' }, h('div', { class: 'page-hero', style: 'min-height:100px' }, h('p', { class: 'eyebrow' }, 'About'), h('h1', null, 'Credits and licences')),
    h('div', { class: 'card' }, h('h3', null, 'This app'), h('ul', null,
      h('li', null, 'Code: MIT licence.'), h('li', null, 'Original lessons, questions, passages and illustrations: CC BY 4.0 (the project owner may change this).'),
      h('li', null, 'Spaced-repetition scheduling follows the FSRS-4.5 equations and default weights published by the open-spaced-repetition project (ts-fsrs 3.5.7, MIT licence). The reference implementation is not included in this app.'),
      h('li', null, 'Kana stroke guides: original and simplified, drawn for this project (not derived from KanjiVG).'),
      h('li', null, 'Sound effects and ambience: generated on your device by original code. No audio recordings are included.'),
      h('li', null, 'Spoken Japanese: your device\'s text-to-speech voice.'))),
    h('div', { class: 'card' }, h('h3', null, 'Asset manifest'), assets.length ? h('table', null, h('thead', null, h('tr', null, ['Asset', 'Origin', 'Licence', 'Creator'].map((x) => h('th', { scope: 'col' }, x)))), h('tbody', null, assets.map((a) => h('tr', null, h('td', null, a.name), h('td', null, a.origin), h('td', null, a.license), h('td', null, a.creator || '—'))))) : h('p', null, 'No third-party assets are included. Everything in this app is original or generated.'), assets.length ? h('p', { class: 'small muted' }, 'Fonts are stored in this app (Latin letters only; Japanese text uses your device fonts) under the SIL Open Font License 1.1, with the licence texts in /fonts/. Nothing is fetched from a font service.') : null),
    h('p', { class: 'small muted' }, 'Nothing is loaded from third-party servers: fonts, scripts, images and data are all stored in this app. Level tags are instructional and unofficial.'));
}
export { dayToDate };
