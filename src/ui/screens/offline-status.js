import { h } from '../dom.js';
import { heroTitle } from '../common.js';
import { checkOffline, STATUS } from '../../pwa/offline.js';

const LABEL = {
  [STATUS.READY]: ['Ready offline', 'ok'], [STATUS.DOWNLOADING]: ['Downloading for offline use…', 'info'], [STATUS.PARTIAL]: ['Partially ready', 'warn'],
  [STATUS.UPDATE]: ['Update available', 'info'], [STATUS.NOT_READY]: ['Offline not ready', 'bad'], [STATUS.UNSUPPORTED]: ['Offline not supported in this browser', 'bad'],
};

export async function statusScreen({ ctx }) {
  const r = await checkOffline();
  ctx.sw.offline = r;
  const [text, kind] = LABEL[r.status];
  return h('div', { class: 'stack' }, heroTitle('Offline status', 'Profile'),
    h('div', { class: 'card' }, h('p', null, h('span', { id: 'offline-indicator', class: `chip ${kind}` }, text)),
      h('p', { class: 'small muted' }, 'This indicator says "Ready offline" only when every file in the build\'s precache list is actually present in the browser\'s Cache Storage.'),
      r.total ? h('p', { class: 'small' }, `${r.present} of ${r.total} core files cached.`) : null,
      r.missing && r.missing.length ? h('details', null, h('summary', null, `Missing (${r.missing.length})`), h('ul', null, r.missing.slice(0, 40).map((m) => h('li', { class: 'small' }, m)))) : null,
      h('button', { class: 'btn', onclick: () => ctx.rerender() }, 'Check again')));
}
