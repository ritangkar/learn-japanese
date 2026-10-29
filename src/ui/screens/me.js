import { h } from '../dom.js';
export function meScreen() {
  return h('div', { class: 'stack' }, h('h2', null, 'Me'), h('ul', null, h('li', null, h('a', { href: '#/storage' }, 'Storage health')), h('li', null, h('a', { href: '#/status' }, 'Offline status'))));
}
