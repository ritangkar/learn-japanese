import { h } from '../dom.js';
export function homeScreen() {
  return h('div', { class: 'stack' }, h('h2', null, 'Welcome'), h('p', null, 'Core shell loaded. Learning screens arrive in later phases.'));
}
