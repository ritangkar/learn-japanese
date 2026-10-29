// Install card (home, first launch) and install help dialog (settings). Platform logic lives in src/pwa/install.js.
import { h } from './dom.js';
import { icon } from './icons.js';
import { openModal } from './components.js';

export function iosSteps(mode) {
  if (mode === 'ios-other-browser') return h('div', null, h('p', null, 'On iPhone and iPad, only Safari can add a web app to the Home Screen. This browser cannot.'), h('ol', { class: 'ios-steps' }, h('li', null, 'Open this page in Safari (copy the address, or use this browser\'s menu: "Open in Safari").'), h('li', null, 'Then follow the Add to Home Screen steps shown there.')));
  return h('ol', { class: 'ios-steps' },
    h('li', null, h('span', null, 'Tap the ', h('strong', null, 'Share'), ' button ', icon('share', { size: 18 }), ' in Safari\'s toolbar.')),
    h('li', null, h('span', null, 'Scroll and choose ', h('strong', null, 'Add to Home Screen'), ' ', icon('addHome', { size: 18 }), '.')),
    h('li', null, h('span', null, 'Tap ', h('strong', null, 'Add'), '. Open Tabi Nihongo from your Home Screen.')));
}

export function showInstallHelp(ctx) {
  const mode = ctx.install.mode();
  if (mode === 'installed') return openModal({ title: 'Already installed', body: h('p', null, 'You are using the installed app. Nothing more to do.'), actions: [{ label: 'Close', value: true, kind: 'primary' }] });
  if (mode === 'prompt') return ctx.install.prompt();
  const ios = mode === 'ios' || mode === 'ios-other-browser';
  const body = ios
    ? h('div', null, iosSteps(mode), h('p', { class: 'small muted' }, 'Safari may clear a website\'s saved data after 7 days without use; an app on your Home Screen is not affected by that rule. The app only counts as installed once you open it from the Home Screen.'))
    : h('div', null, h('p', null, 'This browser does not offer a one-tap install for this app. In Chrome, Edge or Samsung Internet, open the browser menu and look for "Install app" or "Add to Home screen". The app also works fine in a normal tab and offline once loaded.'));
  return openModal({ title: ios ? 'Install on iPhone or iPad' : 'Install this app', id: 'install-help', body, actions: [{ label: 'Got it', value: true, kind: 'primary' }] });
}

/** The proactive card. Returns null when nothing should be offered (installed, snoozed, or no install path on this platform). */
export function installCard(ctx, { onChange } = {}) {
  const inst = ctx.install;
  if (!inst.shouldOffer()) return null;
  const mode = inst.mode();
  const label = mode === 'prompt' ? 'Install app' : mode === 'ios' ? 'Install on iPhone' : 'How to install';
  const card = h('div', { class: 'install-card', id: 'install-card', role: 'region', 'aria-label': 'Install the app' },
    h('div', { class: 'ico-wrap' }, icon('download', { size: 24 })),
    h('div', { class: 'grow' }, h('strong', null, 'Install Tabi Nihongo'), h('span', { class: 'small' }, mode === 'prompt' ? 'Open it from your home screen, full screen, and keep learning offline.' : mode === 'ios' ? 'Add it to your Home Screen: it opens full screen and works offline.' : 'Open it in Safari to add it to your Home Screen.')),
    h('div', { class: 'actions' },
      h('button', { class: 'btn primary small', type: 'button', id: 'install-btn', onclick: async () => { const r = await showInstallHelp(ctx); if (r === 'accepted') onChange?.(); } }, label),
      h('button', { class: 'btn ghost small', type: 'button', id: 'install-dismiss', 'aria-label': 'Hide the install suggestion for now', onclick: () => { inst.dismiss(); card.remove(); onChange?.(); } }, 'Not now')));
  return card;
}
