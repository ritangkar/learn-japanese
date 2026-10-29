// Hash router: '#/path/with/:params?query=1'. No server rewrites needed (GitHub Pages sub-path safe).
export function parseHash(hash) {
  let h = (hash || '').replace(/^#/, '');
  if (!h.startsWith('/')) h = `/${h}`;
  const [path, q = ''] = h.split('?');
  const query = Object.fromEntries(new URLSearchParams(q));
  const segs = path.split('/').filter(Boolean).map(decodeURIComponent);
  return { path: `/${segs.join('/')}`, segs, query };
}

export function matchRoute(routes, segs) {
  for (const r of routes) {
    const pat = r.pattern.split('/').filter(Boolean);
    if (pat.length !== segs.length) continue;
    const params = {};
    let ok = true;
    for (let i = 0; i < pat.length; i++) {
      if (pat[i].startsWith(':')) params[pat[i].slice(1)] = segs[i];
      else if (pat[i] !== segs[i]) { ok = false; break; }
    }
    if (ok) return { route: r, params };
  }
  return null;
}

export class Router {
  constructor(routes, onChange, win = globalThis) {
    this.routes = routes; this.onChange = onChange; this.win = win;
    this.handler = () => this.resolve();
  }
  start() { this.win.addEventListener('hashchange', this.handler); this.resolve(); }
  stop() { this.win.removeEventListener('hashchange', this.handler); }
  resolve() {
    const loc = parseHash(this.win.location.hash);
    const m = matchRoute(this.routes, loc.segs.length ? loc.segs : []) || matchRoute(this.routes, ['__notfound__']);
    this.onChange({ ...loc, route: m?.route, params: m?.params || {} });
  }
}
export const go = (path) => { globalThis.location.hash = `#${path}`; };
