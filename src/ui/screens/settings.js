import { h } from '../dom.js';
import { applyDisplaySettings } from '../../app.js';
import { RATE_PRESETS, RATE_MIN, RATE_MAX } from '../../audio/tts.js';

const set = (ctx, patch) => ctx.store.update('settings', (s) => ({ ...s, ...patch }));
const setAudio = (ctx, patch) => ctx.store.update('settings', (s) => ({ ...s, audio: { ...s.audio, ...patch } }));
const setNested = (ctx, key, patch) => ctx.store.update('settings', (s) => ({ ...s, audio: { ...s.audio, [key]: { ...s.audio[key], ...patch } } }));
function select(id, label, value, options, onchange) {
  return h('div', null, h('label', { for: id }, label), h('select', { id, onchange: (e) => onchange(e.target.value) }, options.map(([v, t]) => h('option', { value: String(v), selected: String(v) === String(value) ? true : null }, t))));
}

export function settingsScreen({ ctx }) {
  const s = ctx.store.state.settings;
  return h('div', { class: 'stack' }, h('h2', null, 'Settings'),
    h('div', { class: 'card' }, h('h3', null, 'Daily goal'),
      select('s-min', 'Core session length', s.dailyCoreMinutes, [15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((m) => [m, `${m} minutes`]), (v) => set(ctx, { dailyCoreMinutes: Number(v) })),
      select('s-wk', 'Weekly goal', s.weeklyGoalDays, [2, 3, 4, 5, 6, 7].map((d) => [d, `${d} days a week`]), (v) => set(ctx, { weeklyGoalDays: Number(v) })),
      select('s-gam', 'Progress display', s.gamification, [['full', 'Full (XP, streak, ring)'], ['light', 'Light (weekly ring only)'], ['off', 'Off (stamps and journal only)']], (v) => set(ctx, { gamification: v })),
      h('p', { class: 'small muted' }, 'The app never changes your goal on its own: it only suggests.')),
    h('div', { class: 'card' }, h('h3', null, 'Reading help'),
      select('s-rom', 'Romaji (Latin spelling) under kana', s.romajiMode, [['fade', 'Fade out as I learn each kana (default)'], ['always', 'Always show'], ['never', 'Never show']], (v) => set(ctx, { romajiMode: v })),
      select('s-ret', 'Target retention for reviews', s.retentionTarget, [[0.8, '80 % (fewer reviews)'], [0.85, '85 %'], [0.9, '90 % (default)'], [0.95, '95 % (more reviews)']], (v) => set(ctx, { retentionTarget: Number(v) }))),
    h('div', { class: 'card' }, h('h3', null, 'Display'),
      select('s-theme', 'Theme', s.theme, [['system', 'Match my device'], ['light', 'Light'], ['dark', 'Dark']], (v) => { set(ctx, { theme: v }); applyDisplaySettings(ctx.store.state.settings); }),
      select('s-motion', 'Reduce motion', s.reducedMotion, [['system', 'Follow my device'], ['on', 'On: no animation'], ['off', 'Off']], (v) => { set(ctx, { reducedMotion: v }); applyDisplaySettings(ctx.store.state.settings); }),
      select('s-text', 'Text size', s.textScale, [[1, '100 %'], [1.25, '125 %'], [1.5, '150 %'], [2, '200 %']], (v) => { set(ctx, { textScale: Number(v) }); applyDisplaySettings(ctx.store.state.settings); })),
    h('div', { class: 'card' }, h('h3', null, 'Timed practice'),
      h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: s.extendedTime ? true : null, onchange: (e) => set(ctx, { extendedTime: e.target.checked }) }), 'Extra time (x1.5) for timed practice. Mock exams use official-length timing unless you turn this on.')),
    h('div', { class: 'card' }, h('h3', null, 'Exam date (optional)'),
      select('s-lvl', 'Target level', s.targetLevel, ['N5', 'N4', 'N3', 'N2', 'N1'].map((l) => [l, l]), (v) => set(ctx, { targetLevel: v })),
      h('label', { for: 's-date' }, 'Target exam date'), h('input', { type: 'date', id: 's-date', value: s.targetExamDate || '', onchange: (e) => set(ctx, { targetExamDate: e.target.value || null }) }),
      h('p', { class: 'small muted' }, 'Dates are only what you enter. JLPT sessions are held twice a year and official dates change; check jlpt.jp. With a date set, the plan gives some time to exam-style practice (practice only, not a prediction).')),
    h('p', null, h('a', { href: '#/audio' }, 'Sound and voice settings')));
}

export function audioSettingsScreen({ ctx }) {
  const s = ctx.store.state.settings.audio; const st = ctx.audio.status();
  const slider = (id, label, value, min, max, step, onchange) => h('div', null, h('label', { for: id }, label), h('input', { type: 'range', id, min, max, step, value, oninput: (e) => onchange(Number(e.target.value)) }));
  const rate = s.learning.rate;
  const out = h('output', { id: 'rate-out', 'aria-live': 'polite' }, `${rate.toFixed(2)}x`);
  return h('div', { class: 'stack' }, h('h2', null, 'Sound and voice'),
    h('div', { class: 'card' }, h('h3', null, 'Japanese voice on this device'),
      st.supported ? (st.hasJapaneseVoice ? h('p', { class: 'banner ok', id: 'voice-status' }, `A Japanese voice was found: ${st.voiceName}${st.local ? ' (works offline)' : ' (may need the internet)'}. It is a synthetic voice and quality varies; it is not native-speaker audio.`) : h('p', { class: 'banner warn', id: 'voice-status' }, 'No Japanese voice found on this device. Audio exercises switch to the transcript, with a notice, and nothing else is lost. You can usually add a voice in your device settings (text-to-speech).')) : h('p', { class: 'banner warn', id: 'voice-status' }, 'This browser has no speech synthesis. Audio exercises use transcripts.'),
      st.voices.length > 1 ? h('div', null, h('label', { for: 'voice-pick' }, 'Voice'), h('select', { id: 'voice-pick', onchange: (e) => setNested(ctx, 'learning', { voiceURI: e.target.value || null }) }, st.voices.map((v) => h('option', { value: v.voiceURI, selected: v.voiceURI === (s.learning.voiceURI || st.voiceURI) ? true : null }, `${v.name}${v.local ? '' : ' (online)'}`)))) : null,
      h('div', { class: 'row', role: 'group', 'aria-label': 'Speed presets' }, Object.entries({ normal: 'Normal', slow: 'Slow', very_slow: 'Very slow' }).map(([k, label]) => h('button', { class: 'btn small', type: 'button', onclick: () => { setNested(ctx, 'learning', { rate: RATE_PRESETS[k] }); document.getElementById('rate-in').value = RATE_PRESETS[k]; out.textContent = `${RATE_PRESETS[k].toFixed(2)}x`; } }, `${label} (${RATE_PRESETS[k]})`))),
      h('div', null, h('label', { for: 'rate-in' }, `Speech speed (${RATE_MIN} to ${RATE_MAX})`), h('input', { type: 'range', id: 'rate-in', min: RATE_MIN, max: RATE_MAX, step: 0.05, value: rate, oninput: (e) => { setNested(ctx, 'learning', { rate: Number(e.target.value) }); out.textContent = `${Number(e.target.value).toFixed(2)}x`; } }), out),
      h('button', { class: 'btn', type: 'button', onclick: () => ctx.audio.speak('こんにちは。ねこ。') }, '▶ Test voice')),
    h('div', { class: 'card' }, h('h3', null, 'Volume'),
      h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: s.masterMuted ? true : null, onchange: (e) => setAudio(ctx, { masterMuted: e.target.checked }) }), 'Mute all sound'),
      slider('v-master', 'Master volume', s.master, 0, 1, 0.05, (v) => setAudio(ctx, { master: v })),
      slider('v-learn', 'Learning voice volume', s.learning.volume, 0, 1, 0.05, (v) => setNested(ctx, 'learning', { volume: v })),
      slider('v-fx', 'Effects volume', s.effects.volume, 0, 1, 0.05, (v) => setNested(ctx, 'effects', { volume: v })),
      slider('v-amb', 'Ambience volume', s.ambience.volume, 0, 1, 0.05, (v) => setNested(ctx, 'ambience', { volume: v }))),
    h('div', { class: 'card' }, h('h3', null, 'Ambience and effects'),
      h('label', { class: 'check' }, h('input', { type: 'checkbox', id: 'amb-en', checked: s.ambience.enabled ? true : null, onchange: (e) => { setNested(ctx, 'ambience', { enabled: e.target.checked }); if (e.target.checked) ctx.audio.ambience.start(null, true); else ctx.audio.ambience.stop(); } }), 'Play background ambience (off by default; starts only after you tap)'),
      h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: s.effects.enabled ? true : null, onchange: (e) => setNested(ctx, 'effects', { enabled: e.target.checked }) }), 'Feedback sounds'),
      h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: s.silentStudy ? true : null, onchange: (e) => setAudio(ctx, { silentStudy: e.target.checked }) }), 'Study in silence (turns off ambience and effects; the learning voice still works)'),
      h('p', { class: 'small muted' }, 'Ambience is generated on your device and is stylised: it does not sound like a particular real place.')));
}
