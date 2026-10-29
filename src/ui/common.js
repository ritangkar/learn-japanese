import { h } from './dom.js';
import { STATUS_LABEL } from './labels.js';

export const back = (href, text = 'Back') => h('a', { class: 'btn small', href }, `← ${text}`);
export function statusBadge(status, { cultural = false } = {}) {
  if (cultural) return h('span', { class: 'chip warn', title: 'Not fact-checked by a person' }, 'Unverified');
  const s = STATUS_LABEL[status] || STATUS_LABEL.draft;
  return h('span', { class: `chip ${s.kind}`, title: s.long }, s.short);
}
export const levelChip = (L) => h('span', { class: 'chip', title: 'There is no official word, kanji or grammar list for the JLPT levels. Level tags in this app are our own teaching groups.' }, `${L} · Instructional level (unofficial)`);
export function loading(msg = 'Loading…') { return h('p', { role: 'status', class: 'muted' }, msg); }
export function errorCard(e, hint = 'Your data is safe.') {
  const offline = /content|Failed to fetch|NetworkError|Load failed/i.test(String(e && e.message));
  return h('div', { class: 'banner bad', role: 'alert' }, offline ? 'This content is not available offline yet. Connect once and open it again so it can be saved on this device. ' : `Something went wrong. ${hint} `, h('a', { href: '#/' }, 'Back to start'));
}
