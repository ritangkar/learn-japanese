// Runtime content model built from core.json + level bundles (+ mock files). Pure: used by the app and by unit tests.
export const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
const mapBy = (arr) => new Map(arr.map((x) => [x.id, x]));

export function makeContent({ core, bundles = {}, mocks = {} }) {
  const all = (key) => Object.values(bundles).flatMap((b) => b[key] || []);
  const c = {
    core, bundles, loadedLevels: Object.keys(bundles),
    units: core.units, unitById: mapBy(core.units),
    kana: core.kana, kanaById: mapBy(core.kana), kanaByChar: {}, kanaIdByChar: {},
    vocab: all('vocab'), kanji: all('kanji'), grammar: all('grammar'), sentences: all('sentences'), dialogues: all('dialogues'), passages: all('passages'), listening: all('listening'), questions: all('questions'), lessons: all('lessons'), quests: all('quests'),
    destinations: core.destinations, regions: core.regions, route: core.route, jlpt: core.jlpt, mockIndex: [], mocks,
  };
  for (const k of c.kana) { if ([...k.char].length === 1 && k.script === 'hiragana') c.kanaIdByChar[k.char] = k.id; c.kanaByChar[`${k.script}:${k.char}`] = k; }
  c.vocabById = mapBy(c.vocab); c.kanjiById = mapBy(c.kanji); c.grammarById = mapBy(c.grammar); c.sentenceById = mapBy(c.sentences); c.dialogueById = mapBy(c.dialogues);
  c.passageById = mapBy(c.passages); c.listeningById = mapBy(c.listening); c.questionById = mapBy(c.questions); c.lessonById = mapBy(c.lessons);
  c.destById = mapBy(c.destinations); c.regionById = mapBy(c.regions);
  c.unitLevel = (id) => c.unitById.get(id)?.level;
  c.releasedUnits = (level) => c.units.filter((u) => u.level === level && u.released);
  c.lessonsOfUnit = (unitId) => (c.unitById.get(unitId)?.lessons || []).map((id) => c.lessonById.get(id)).filter(Boolean);
  c.questsOf = (destId) => c.quests.filter((q) => q.destination_id === destId);
  c.conceptItem = (id) => c.kanaById.get(id) || c.vocabById.get(id) || c.kanjiById.get(id) || c.grammarById.get(id) || null;
  c.question = (id) => c.questionById.get(id) || null;
  return c;
}

/** Concept ids introduced by a lesson (kana, vocab, kanji, grammar). */
export const lessonConcepts = (l) => [...(l.introduces?.kana || []), ...(l.introduces?.vocab || []), ...(l.introduces?.kanji || []), ...(l.introduces?.grammar || [])];
