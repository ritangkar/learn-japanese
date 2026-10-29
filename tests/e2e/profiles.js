// Deterministic synthetic learner profiles for end-to-end tests. They are injected into a fresh, isolated browser profile through the
// app's own store (never touching real learner data) and are shaped exactly like data the engine writes.
const U1 = ['n5_u01_l1', 'n5_u01_l2', 'n5_u01_l3', 'n5_u01_l4', 'n5_u01_l5', 'n5_u01_l6', 'n5_u01_l7'];
const U2 = ['n5_u02_l1', 'n5_u02_l2', 'n5_u02_l3', 'n5_u02_l4', 'n5_u02_l5', 'n5_u02_l6', 'n5_u02_l7'];

/** name -> in-page seeding function (serialisable; receives {U1, U2}). */
export const PROFILE_NAMES = ['new', 'partial', 'stamped', 'locked', 'streak'];

export async function seedProfile(page, name) {
  await page.evaluate(({ name, U1, U2 }) => {
    const st = window.__tabi.store;
    const day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
    const lessons = (ids) => Object.fromEntries(ids.map((l) => [l, { doneAt: day, score: 1, count: 1 }]));
    if (name === 'new' || name === 'locked') return; // brand-new learner: nothing completed, N4+ locked, Tokyo available
    if (name === 'partial') st.update('progress', (p) => ({ ...p, lessons: { ...p.lessons, ...lessons(U1.slice(0, 3)) } }));
    if (name === 'stamped') {
      st.update('progress', (p) => ({ ...p, lessons: { ...p.lessons, ...lessons([...U1, ...U2]) }, units: { ...p.units, n5_u01: { completedAt: day }, n5_u02: { completedAt: day } }, destinations: { ...p.destinations, tokyo: { startedAt: day, completedAt: day, quests: { q_tokyo_1: { best: 0.95, attempts: 1 } } } } }));
      st.update('journal', (j) => ({ ...j, stamps: { ...j.stamps, stamp_tokyo: { destination: 'tokyo', tier: null, day, accuracy: 0.95, items: 10 } }, postcards: { ...j.postcards, postcard_tokyo: { destination: 'tokyo', day } }, rewards: { ...j.rewards, 'stamp:stamp_tokyo': { kind: 'stamp', at: day, evidence: { day, accuracy: 0.95, items: 10 } } }, xp: { ...j.xp, total: 220 }, studyDays: [day - 2, day - 1, day] }));
    }
    if (name === 'streak') st.update('journal', (j) => ({ ...j, studyDays: [day - 4, day - 3, day - 2, day - 1, day], xp: { ...j.xp, total: 135 }, achievements: { ...j.achievements, ach_first_row: { day, evidence: 'fixture' } } }));
  }, { name, U1, U2 });
}
