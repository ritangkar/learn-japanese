// Profile and settings hub. The install row is always here (even after "Not now") so installation guidance can be reopened any time.
import { h } from '../dom.js';
import { icon } from '../icons.js';
import { levelChip, statusBadge } from '../common.js';
import { LEVEL_LABEL } from '../labels.js';
import { weeklyRing, streak } from '../../engine/gamification.js';
import { today } from '../env.js';
import { exportReminder } from '../../core/backup.js';
import { showInstallHelp } from '../install-ui.js';

export function meScreen({ ctx }) {
  const { store } = ctx; const j = store.state.journal; const t = today();
  const ring = weeklyRing(j, t, store.state.settings.weeklyGoalDays); const st = streak(j, t);
  const light = store.state.settings.gamification !== 'full';
  const rem = exportReminder(store, Date.now());
  const row = (href, ic, title, desc) => h('li', null, h('a', { class: 'menu-item', href }, h('span', { class: 'ico-wrap', style: 'width:40px;height:40px;border-radius:12px;background:var(--mist);display:grid;place-items:center;color:var(--indigo);flex:none' }, icon(ic)), h('span', null, h('strong', null, title), h('span', { class: 'small muted' }, desc)), icon('forward', { size: 18 })));
  const mode = ctx.install.mode();
  const installDesc = { installed: 'You are using the installed app', prompt: 'Add it to your home screen', ios: 'Add to Home Screen from Safari', 'ios-other-browser': 'Open in Safari to install', manual: 'How to install in this browser' }[mode];
  const installRow = h('li', null, h('button', { class: 'menu-item', id: 'install-row', type: 'button', style: 'width:100%;text-align:left;font:inherit;cursor:pointer', onclick: async () => { await showInstallHelp(ctx); ctx.rerender(); } }, h('span', { style: 'width:40px;height:40px;border-radius:12px;background:var(--sakura-bg);display:grid;place-items:center;color:var(--sakura-ink);flex:none' }, icon('download')), h('span', null, h('strong', null, mode === 'installed' ? 'App installed' : 'Install the app'), h('span', { class: 'small muted' }, installDesc)), icon('forward', { size: 18 })));
  return h('div', { class: 'stack' },
    h('div', { class: 'page-hero', style: 'min-height:110px' }, h('p', { class: 'eyebrow' }, 'Profile'), h('h1', null, 'Me'), h('p', { class: 'lead', style: 'margin:0' }, 'Goals, sound, backup and everything else.')),
    store.state.settings.gamification === 'off' ? null : h('div', { class: 'stat-row' },
      h('div', { class: 'card stat' }, icon('target'), h('b', null, `${ring.effectiveDays}/${ring.goal}`), h('span', { class: 'lbl' }, 'days this week')), light ? null : h('div', { class: 'card stat gold' }, icon('star', { fill: true }), h('b', null, String(j.xp.total)), h('span', { class: 'lbl' }, 'XP')), light ? null : h('div', { class: 'card stat flame' }, icon('flame', { fill: true }), h('b', null, String(st.days)), h('span', { class: 'lbl' }, 'day streak'))),
    rem ? h('div', { class: 'banner info' }, rem === 'never' ? 'No backup yet. ' : 'Time for a fresh backup. ', h('a', { href: '#/backup' }, 'Back up now')) : null,
    h('ul', { class: 'menu' },
      installRow,
      row('#/journal', 'stamp', 'Stamp book', 'Stamps, postcards, milestones'), row('#/achievements', 'trophy', 'Achievements', 'Earned through practice evidence'),
      row('#/settings', 'settings', 'Settings', 'Daily goal, romaji, display, exam date'), row('#/audio', 'volume', 'Sound and voice', 'Volume, speech speed, ambience'),
      row('#/backup', 'download', 'Backup and restore', 'Export or import your progress as a file'), row('#/storage', 'info', 'Storage health', 'How full this device storage is'),
      row('#/status', 'refresh', 'Offline status', 'Is everything saved for offline use?'), row('#/content', 'exam', 'Content status and coverage', 'What is released, and how it was checked'),
      row('#/library', 'book', 'Library', 'Words, grammar and kanji'), row('#/about', 'info', 'About and limitations', 'What this app is and is not'),
      row('#/privacy', 'lock', 'Privacy', 'Your data stays on this device'), row('#/credits', 'sparkle', 'Credits and licences', 'Generated from the asset manifest'), row('#/tour', 'compass', 'Show the intro again', 'The four-step tour')),
    h('p', { class: 'small muted' }, `${LEVEL_LABEL}: level tags are our own teaching groups, not an official JLPT list. `, levelChip('N5')));
}
export { statusBadge };
