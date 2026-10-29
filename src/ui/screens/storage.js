import { h } from '../dom.js';
import { heroTitle } from '../common.js';
import { LIMITS } from '../../core/storage.js';

export function storageScreen({ ctx }) {
  const { store } = ctx;
  const kb = store.storage.usageKB();
  const health = store.storage.health();
  const pct = Math.min(100, (kb / LIMITS.urgentKB) * 100);
  const label = { ok: 'Healthy', over_budget: 'Above the 1.5 MB design budget', warn: 'Getting full', urgent: 'Nearly full: export a backup now' }[health];
  const q = store.storage.keys().filter((k) => k.startsWith('quarantine:'));
  const bar = h('div', { class: 'bar', role: 'img', 'aria-label': `Storage use ${kb.toFixed(0)} kilobytes of about ${LIMITS.urgentKB}` }, h('i'));
  bar.firstChild.style.width = `${pct}%`;
  return h('div', { class: 'stack' },
    heroTitle('Storage health', 'Profile'),
    h('div', { class: 'card' }, h('p', null, h('strong', null, `${kb.toFixed(0)} KB`), ` used (UTF-16 counted). Status: `, h('span', { class: `chip ${health === 'ok' ? 'ok' : health === 'urgent' ? 'bad' : 'warn'}` }, label)), bar,
      h('p', { class: 'small muted' }, `Design budget ${LIMITS.budgetKB} KB · warning at ${LIMITS.warnKB} KB · urgent at ${LIMITS.urgentKB} KB. Browsers typically allow about 5 MB per site, but this is not guaranteed.`)),
    h('div', { class: 'card' }, h('p', null, store.persistent ? 'Progress is saved in this browser (localStorage) on this device only.' : 'Local storage is blocked here, so progress is held in memory only.'),
      h('p', { class: 'small muted' }, 'iPhone: Safari may clear site data after 7 days without use unless the app is added to the Home Screen. Export a backup regularly.'),
      h('a', { class: 'btn', href: '#/backup' }, 'Backup and restore')),
    q.length ? h('div', { class: 'card' }, h('h3', null, 'Set-aside (quarantined) items'), h('ul', null, q.map((k) => h('li', null, k))), h('p', { class: 'small muted' }, 'These were damaged and set aside, not deleted. Export a backup before clearing anything.')) : null);
}
