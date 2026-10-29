import { h } from '../dom.js';
import { levelChip, statusBadge } from '../common.js';
import { LEVEL_LABEL } from '../labels.js';
import { weeklyRing, streak } from '../../engine/gamification.js';
import { today } from '../env.js';
import { exportReminder } from '../../core/backup.js';

export function meScreen({ ctx }) {
  const { store } = ctx; const j = store.state.journal; const t = today();
  const ring = weeklyRing(j, t, store.state.settings.weeklyGoalDays); const st = streak(j, t);
  const light = store.state.settings.gamification !== 'full';
  const rem = exportReminder(store, Date.now());
  const item = (href, title, desc) => h('li', null, h('a', { class: 'menu-item', href }, h('strong', null, title), h('span', { class: 'small muted' }, desc)));
  return h('div', { class: 'stack' }, h('h2', null, 'Me'),
    store.state.settings.gamification === 'off' ? null : h('div', { class: 'stat-row' },
      h('div', { class: 'card stat' }, h('b', null, `${ring.effectiveDays}/${ring.goal}`), 'days this week'), light ? null : h('div', { class: 'card stat' }, h('b', null, String(j.xp.total)), 'XP'), light ? null : h('div', { class: 'card stat' }, h('b', null, String(st.days)), 'day streak')),
    rem ? h('div', { class: 'banner info' }, rem === 'never' ? 'No backup yet. ' : 'Time for a fresh backup. ', h('a', { href: '#/backup' }, 'Back up now')) : null,
    h('ul', { class: 'menu' },
      item('#/journal', 'Travel journal', 'Stamps, postcards, milestones'), item('#/achievements', 'Achievements', 'Earned through practice evidence'),
      item('#/settings', 'Settings', 'Daily goal, romaji, display, exam date'), item('#/audio', 'Sound and voice', 'Volume, speech speed, ambience'),
      item('#/backup', 'Backup and restore', 'Export or import your progress as a file'), item('#/storage', 'Storage health', 'How full this device storage is'),
      item('#/status', 'Offline status', 'Is everything saved for offline use?'), item('#/content', 'Content status and coverage', 'What is released, and how it was checked'),
      item('#/library', 'Library', 'Words, grammar and kanji'), item('#/about', 'About and limitations', 'What this app is and is not'),
      item('#/privacy', 'Privacy', 'Your data stays on this device'), item('#/credits', 'Credits and licences', 'Generated from the asset manifest'), item('#/tour', 'Show the intro again', 'The four-step tour')),
    h('p', { class: 'small muted' }, `${LEVEL_LABEL}: level tags are our own teaching groups, not an official JLPT list. `, levelChip('N5')));
}
export { statusBadge };
