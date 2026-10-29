// Tiny view helpers. No framework, no innerHTML with data (XSS-safe by construction).
/** CSP forbids inline style attributes (style-src 'self'); the CSSOM is allowed, so a style string is applied property by property. */
export function applyStyle(el, text) {
  for (const decl of String(text).split(';')) {
    const i = decl.indexOf(':'); if (i < 1) continue;
    el.style.setProperty(decl.slice(0, i).trim(), decl.slice(i + 1).trim());
  }
}
export function h(tag, props, ...children) {
  const el = document.createElement(tag);
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (v === null || v === undefined || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'dataset') Object.assign(el.dataset, v);
      else if (k === 'style') applyStyle(el, v);
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'text') el.textContent = v;
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, String(v));
    }
  }
  append(el, children);
  return el;
}
export function append(el, children) {
  for (const c of children.flat(Infinity)) {
    if (c === null || c === undefined || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}
export const svgNS = 'http://www.w3.org/2000/svg';
export function s(tag, props, ...children) {
  const el = document.createElementNS(svgNS, tag);
  if (props) for (const [k, v] of Object.entries(props)) {
    if (v === null || v === undefined || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'style') applyStyle(el, v);
    else el.setAttribute(k === 'class' ? 'class' : k, String(v));
  }
  append(el, children);
  return el;
}
export function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }
export function mount(el, ...children) { clear(el); append(el, children); return el; }
/** Japanese text wrapper with lang="ja". */
export const ja = (text, props = {}) => h('span', { lang: 'ja', class: 'ja', ...props }, text);
/** Furigana via <ruby>. segs: [[base, reading|null], ...] */
export function ruby(segs) {
  return h('span', { lang: 'ja', class: 'ja' }, segs.map(([b, r]) => (r ? h('ruby', null, b, h('rt', null, r)) : b)));
}

// Null-safe append/prepend: optional children (null/undefined/false) are skipped instead of rendering the text "null".
for (const name of ['append', 'prepend', 'replaceChildren']) {
  const orig = Element.prototype[name];
  Element.prototype[name] = function safe(...nodes) { return orig.apply(this, nodes.filter((n) => n !== null && n !== undefined && n !== false)); };
}
