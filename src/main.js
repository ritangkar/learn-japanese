import './ui/styles.css';
import { Store } from './core/store.js';
import { startApp } from './app.js';

const store = Store.create();
startApp({ store, root: document.getElementById('app') });
