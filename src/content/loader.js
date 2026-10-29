// Fetches the built content files (same-origin, relative URLs) and builds the runtime model. N5 is precached; other levels load on demand.
import { makeContent, LEVELS } from './runtime.js';

const base = () => new URL('./content/', document.baseURI).href;
async function getJson(name) {
  const res = await fetch(new URL(name, base()), { cache: 'no-cache' });
  if (!res.ok) throw new Error(`content ${name}: HTTP ${res.status}`);
  return res.json();
}

export async function loadContent() {
  const [core, index, n5] = await Promise.all([getJson('core.json'), getJson('index.json'), getJson('N5.json')]);
  const content = makeContent({ core, bundles: { N5: n5 } });
  content.index = index;
  content.contentVersion = index.contentVersion;
  content.mockIndex = index.mocks;
  content.ensureLevel = async (L) => {
    if (content.bundles[L]) return content;
    try { content.bundles[L] = await getJson(`${L}.json`); } catch (e) { content.offlineMissing = L; throw e; }
    Object.assign(content, makeContent({ core, bundles: content.bundles, mocks: content.mocks }), { index, contentVersion: index.contentVersion, mockIndex: index.mocks, ensureLevel: content.ensureLevel, loadMock: content.loadMock });
    return content;
  };
  content.loadMock = async (id) => {
    if (content.mocks[id]) return content.mocks[id];
    const entry = index.mocks.find((m) => m.id === id);
    if (!entry) throw new Error(`unknown mock ${id}`);
    content.mocks[id] = await getJson(entry.file);
    return content.mocks[id];
  };
  return content;
}
export { LEVELS };
