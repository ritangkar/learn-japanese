import { h } from './dom.js';
import { storageScreen } from './screens/storage.js';
import { statusScreen } from './screens/offline-status.js';
import { homeScreen } from './screens/home.js';
import { meScreen } from './screens/me.js';

export const routes = [
  { pattern: '/', title: 'Explore', render: homeScreen },
  { pattern: '/me', title: 'Me', render: meScreen },
  { pattern: '/storage', title: 'Storage health', render: storageScreen },
  { pattern: '/status', title: 'Offline status', render: statusScreen },
  { pattern: '/__notfound__', title: 'Not found', render: () => h('p', null, 'Page not found. ', h('a', { href: '#/' }, 'Back to start')) },
];
