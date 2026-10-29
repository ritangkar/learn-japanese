// Reusable UI components for the redesign: progress ring, progress bar, empty state, confirm dialog, modal, toast, confetti.
import { h, s } from './dom.js';
import { icon } from './icons.js';

export function ring({ value = 0, max = 1, label = '', sub = '', size = 84, gold = false } = {}) {
  const r = 34; const c = 2 * Math.PI * r; const frac = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  const svg = s('svg', { viewBox: '0 0 84 84', 'aria-hidden': 'true' }, s('circle', { cx: 42, cy: 42, r, fill: 'none', 'stroke-width': 9, class: 'track' }), s('circle', { cx: 42, cy: 42, r, fill: 'none', 'stroke-width': 9, class: 'val', 'stroke-dasharray': c.toFixed(1), 'stroke-dashoffset': (c * (1 - frac)).toFixed(1) }));
  const el = h('div', { class: `ring${gold ? ' gold' : ''}`, role: 'img', 'aria-label': `${label || 'Progress'}: ${value} of ${max}${sub ? `, ${sub}` : ''}`, style: `width:${size}px;height:${size}px` }, svg, h('div', { class: 'center' }, h('span', null, label || `${value}/${max}`, sub ? h('small', null, sub) : null)));
  return el;
}

export function progress(pct, { thin = false, gold = false, label = 'Progress' } = {}) {
  const v = Math.max(0, Math.min(100, Math.round(pct)));
  return h('div', { class: `progress${thin ? ' thin' : ''}${gold ? ' gold' : ''}`, role: 'progressbar', 'aria-label': label, 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(v) }, h('i', { style: `width:${v}%` }));
}

export function emptyState({ icon: ic = 'compass', title, text, action = null }) {
  return h('div', { class: 'empty', role: 'status' }, icon(ic, { size: 40 }), h('h3', null, title), text ? h('p', null, text) : null, action);
}

export function installingSpinner() { return h('span', { class: 'skeleton', style: 'display:inline-block;width:80px;height:18px', 'aria-hidden': 'true' }); }

function dlg(content, { labelledBy }) {
  const d = h('dialog', { 'aria-labelledby': labelledBy }, content);
  document.body.append(d);
  return d;
}

/** Modal dialog (native <dialog>: focus is trapped, Escape closes, focus returns to the opener). Resolves when closed. */
export function openModal({ title, body, actions = [], id = 'modal' }) {
  return new Promise((resolve) => {
    const prev = document.activeElement;
    const tid = `${id}-title`;
    const close = (v) => { d.close(); d.remove(); if (prev && prev.focus) prev.focus(); resolve(v); };
    const acts = h('div', { class: 'dlg-actions' }, actions.map((a) => h('button', { class: `btn ${a.kind || ''}`, type: 'button', id: a.id || null, onclick: () => close(a.value) }, a.label)));
    const d = dlg(h('div', { class: 'dlg-body' }, h('h2', { id: tid, style: 'margin:0' }, title), body, acts), { labelledBy: tid });
    d.addEventListener('cancel', (e) => { e.preventDefault(); close(actions.find((a) => a.cancel)?.value ?? null); });
    d.showModal();
    const first = d.querySelector('[data-autofocus]') || d.querySelector('.btn.primary, .btn');
    if (first) first.focus();
  });
}

/** confirm({title, text, confirmLabel, cancelLabel, danger}) -> Promise<boolean> */
export function confirmDialog({ title, text, confirmLabel = 'Yes', cancelLabel = 'Cancel', danger = false }) {
  return openModal({ title, id: 'confirm', body: h('p', { style: 'margin:0' }, text), actions: [{ label: cancelLabel, value: false, cancel: true, id: 'confirm-cancel' }, { label: confirmLabel, value: true, kind: danger ? 'danger' : 'primary', id: 'confirm-ok' }] });
}

export function toast(ctx, message, { kind = 'info', ms = 3500 } = {}) {
  const el = h('div', { class: `toast banner ${kind}`, role: 'status' }, message);
  document.body.append(el);
  setTimeout(() => el.remove(), ms);
  return el;
}

export function reducedMotion(ctx) {
  const m = ctx?.store?.state?.settings?.reducedMotion;
  if (m === 'on') return true;
  if (m === 'off') return false;
  return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

/** A short burst of paper confetti. Skipped entirely when reduced motion is requested. */
export function confetti(ctx, n = 28) {
  if (reducedMotion(ctx)) return;
  const colors = ['#F4BFCC', '#D9A63B', '#233E78', '#B4301E', '#3C6A2C'];
  const box = h('div', { class: 'confetti', 'aria-hidden': 'true' });
  for (let i = 0; i < n; i++) box.append(h('i', { style: `left:${Math.round((i * 37) % 100)}%;background:${colors[i % colors.length]};animation-delay:${(i % 7) * 70}ms;transform:rotate(${i * 23}deg)` }));
  document.body.append(box);
  setTimeout(() => box.remove(), 2200);
}
