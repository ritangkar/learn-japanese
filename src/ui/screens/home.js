// Home: where am I, what is my next step, how is my journey going. Every number comes from saved state; nothing is invented.
// A brand-new learner sees a welcome and one clear first action, not empty statistics.
import { h } from '../dom.js';
import { icon } from '../icons.js';
import { errorCard } from '../common.js';
import { ring, progress } from '../components.js';
import { installCard } from '../install-ui.js';
import { attemptCard } from '../attempt-card.js';
import { destinationStates } from '../../engine/progress.js';
import { weeklyRing, streak } from '../../engine/gamification.js';
import { nextBlock, blockHref, flowState } from '../flow.js';
import { today } from '../env.js';
import { stampSvg } from '../../map/stamps.js';
import { SCENES } from '../../map/scenes.js';
import { dayToDate, weekStart } from '../../core/clock.js';

const TYPE_LABEL = { review: 'Review', lesson: 'New lesson', contrast: 'Tell apart', leech: 'Stubborn items', listening_drill: 'Listening drill', construction_drill: 'Build sentences', mixed_practice: 'Mixed practice', listening: 'Listening', reading: 'Reading', quest: 'Quest', exam_practice: 'Exam-style practice', revisit: 'Revisit', extension: 'Extra' };
const DONE = new Set(['completed', 'revisit_available']);

export function weekDots(journal, day, goal) {
  const set = new Set(journal.studyDays);
  const start = weekStart(day);
  const names = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return h('div', { class: 'week-dots', role: 'img', 'aria-label': `Study days this week: ${[0, 1, 2, 3, 4, 5, 6].filter((i) => set.has(start + i)).length} of ${goal} goal` }, names.map((n, i) => h('i', { class: `${set.has(start + i) ? 'on' : ''}${start + i === day ? ' today' : ''}`, 'aria-hidden': 'true' }, set.has(start + i) ? icon('check', { size: 12 }) : n)));
}

export async function homeScreen({ ctx }) {
  let content;
  try { content = await ctx.getContent(); for (const L of Object.keys(ctx.store.state.progress.levels || {})) { if (L !== 'N5' && ctx.store.state.progress.levels[L] !== 'locked') { try { await content.ensureLevel(L); } catch { /* offline */ } } } } catch (e) { return errorCard(e); }
  const st = ctx.store.state; const t = today();
  const states = destinationStates(st.progress, content);
  const cur = content.destById.get(st.progress.currentDestination) || content.destinations[0];
  const region = content.regionById.get(cur.region_id);
  const { plan, next } = nextBlock(ctx, content);
  const fl = flowState(ctx);
  const ringData = weeklyRing(st.journal, t, st.settings.weeklyGoalDays); const stk = streak(st.journal, t);
  const lessonsDone = Object.keys(st.progress.lessons).length; const stampsN = Object.keys(st.journal.stamps).length;
  const fresh = lessonsDone === 0 && stampsN === 0 && st.journal.studyDays.length === 0;
  const gam = st.settings.gamification;
  const level = cur.first_visit_level;
  const stops = content.route.map((id) => content.destById.get(id)).filter((d) => d && d.first_visit_level === level && d.is_geographic !== false);
  const stopsDone = stops.filter((d) => DONE.has(states[d.id].state)).length;
  const routeIdx = content.route.indexOf(cur.id) + 1;

  const host = h('div', { class: 'stack home' });
  // hero over the destination backdrop
  host.append(h('section', { class: 'home-hero', 'aria-labelledby': 'home-title' },
    h('span', { class: 'station-plate' }, h('span', { class: 'num', 'aria-hidden': 'true' }, String(Math.max(1, routeIdx))), `${region?.name_en || 'Japan'} · ${level} stop`),
    h('h1', { id: 'home-title' }, fresh ? 'Welcome aboard' : `You are in ${cur.name_en}`),
    h('div', { class: 'ja-sub ja', lang: 'ja' }, `${cur.name_ja} · ${cur.reading_kana || ''}`.replace(/ · $/, '')),
    h('p', { class: 'lead', style: 'margin:6px 0 0' }, fresh ? 'Travel from Tokyo to Okinawa, one stop at a time. Each place teaches you the Japanese you need there.' : cur.language_objectives[0])));

  // unfinished exam attempt comes first: it has a clock
  if (st.examlive) host.append(attemptCard(ctx, st.examlive));

  // the one clear next step
  if (next) {
    host.append(h('section', { class: 'next-card', 'aria-labelledby': 'next-title' },
      h('p', { class: 'eyebrow' }, fresh ? 'Your first step' : 'Continue your journey'),
      h('h2', { id: 'next-title' }, next.title),
      h('p', null, `${TYPE_LABEL[next.type] || next.type} · about ${next.minutes} min${plan.totalCoreMinutes && plan.blocks.filter((b) => b.core).length > 1 ? ` · today's plan: ${plan.blocks.filter((b) => b.core).length} steps, ~${plan.totalCoreMinutes} min` : ''}`),
      h('div', { class: 'row' }, h('a', { class: 'btn primary', id: 'start-today', href: blockHref(next) }, icon('play', { size: 18 }), fresh ? 'Start your first lesson' : 'Continue'), h('a', { class: 'btn ghost', href: '#/learn' }, 'See today\'s plan'))));
  } else {
    host.append(h('section', { class: 'next-card' }, h('p', { class: 'eyebrow' }, 'Today'), h('h2', null, plan.blocks.some((b) => b.core) ? 'Today\'s plan is done' : 'Nothing is due right now'), h('p', null, 'You can stop here, practise kana, explore a stop, or keep going with optional extras.'), h('div', { class: 'row' }, h('a', { class: 'btn primary', id: 'start-today', href: '#/learn' }, 'See options'), h('a', { class: 'btn ghost', href: '#/explore' }, 'Explore Japan'))));
  }

  // install suggestion (never when installed or snoozed)
  // The browser may offer installation after the page has rendered, so the slot refreshes itself when availability changes.
  const slot = h('div', { id: 'install-slot' });
  const fill = () => { const c = installCard(ctx, { onChange: fill }); slot.replaceChildren(...(c ? [c] : [])); };
  fill();
  const unsub = ctx.install.subscribe(fill); ctx.cleanup = unsub;
  host.append(slot);

  // daily rhythm
  if (gam !== 'off' && !fresh) {
    host.append(h('section', { class: 'card goal-card', 'aria-label': 'Study rhythm' },
      ring({ value: ringData.effectiveDays, max: ringData.goal, label: `${ringData.effectiveDays}/${ringData.goal}`, sub: 'days' }),
      h('div', { class: 'txt' }, h('strong', null, ringData.met ? 'Weekly goal reached' : 'This week'), h('span', { class: 'small muted' }, `${ringData.effectiveDays} of ${ringData.goal} study days${ringData.graceApplied ? ' (grace day applied)' : ''}${fl.minutes ? ` · ${Math.round(fl.minutes)} min today` : ''}`), weekDots(st.journal, t, ringData.goal))));
    if (gam === 'full') host.append(h('div', { class: 'stat-row' },
      h('div', { class: 'card stat flame' }, icon('flame', { fill: true }), h('b', null, String(stk.days)), h('span', { class: 'lbl' }, stk.days === 1 ? 'day streak' : 'day streak')),
      h('div', { class: 'card stat gold' }, icon('star', { fill: true }), h('b', null, String(st.journal.xp.total)), h('span', { class: 'lbl' }, 'XP')),
      h('div', { class: 'card stat' }, icon('book'), h('b', null, String(lessonsDone)), h('span', { class: 'lbl' }, lessonsDone === 1 ? 'lesson done' : 'lessons done'))));
  }

  // journey progress
  if (fresh) {
    host.append(h('section', { class: 'card' }, h('h3', null, 'How it works'), h('ol', { class: 'ios-steps' },
      h('li', null, h('span', null, h('strong', null, 'Learn'), ' short lessons about 10 minutes each.')),
      h('li', null, h('span', null, h('strong', null, 'Finish a stop\'s units and quest'), ' to open the next place on the map.')),
      h('li', null, h('span', null, h('strong', null, 'Collect a stamp'), ' for every stop in your travel journal.')))));
  } else {
    host.append(h('section', { class: 'card', 'aria-labelledby': 'journey-title' },
      h('div', { class: 'row between' }, h('h3', { id: 'journey-title', style: 'margin:0' }, `${level} journey`), h('span', { class: 'chip' }, `${stopsDone} of ${stops.length} stops`)),
      progress(stops.length ? (100 * stopsDone) / stops.length : 0, { thin: true, label: `${level} stops visited` }),
      h('div', { class: 'journey-line', role: 'list', 'aria-label': `${level} route` }, stops.flatMap((d, i) => {
        const sDone = DONE.has(states[d.id].state); const isCur = d.id === cur.id;
        const nodes = [h('a', { class: `stop ${sDone ? 'done' : isCur ? 'cur' : states[d.id].state === 'available' || states[d.id].state === 'in_progress' ? 'next' : ''}`, role: 'listitem', href: `#/dest/${d.id}`, 'aria-label': `${d.name_en}, ${sDone ? 'visited' : isCur ? 'current stop' : states[d.id].state === 'visible_locked' ? 'locked' : 'not yet visited'}` }, h('span', { class: 'dot' }, sDone ? icon('check', { size: 14 }) : states[d.id].state === 'visible_locked' || states[d.id].state === 'hidden' ? icon('lock', { size: 12 }) : null), h('span', null, d.name_en))];
        if (i < stops.length - 1) nodes.push(h('span', { class: `seg-line ${sDone ? 'done' : ''}`, 'aria-hidden': 'true' }));
        return nodes;
      })),
      h('a', { class: 'btn small', href: '#/explore' }, icon('map', { size: 18 }), 'Open the map')));
  }

  // stamp book preview
  const stamps = Object.entries(st.journal.stamps).map(([id, x]) => ({ id, ...x })).sort((a, b) => b.day - a.day).slice(0, 5);
  host.append(h('section', { class: 'card', 'aria-labelledby': 'stamps-title' },
    h('div', { class: 'row between' }, h('h3', { id: 'stamps-title', style: 'margin:0' }, 'Stamp book'), h('span', { class: 'chip sakura' }, `${stampsN} collected`)),
    stamps.length ? h('div', { class: 'stamp-strip' }, stamps.map((x) => { const d = content.destById.get(x.destination); return h('a', { class: 'stamp-mini', href: '#/journal', 'aria-label': `${d.name_en} stamp` }, stampSvg(d, { day: x.day, tier: x.tier, motifs: SCENES[d.id]?.motifs })); }))
      : h('p', { class: 'muted', style: 'margin:6px 0' }, 'No stamps yet. Finish a stop\'s units and quest to earn the first one, as in a real station stamp book.'),
    h('a', { class: 'btn small', href: '#/journal' }, icon('stamp', { size: 18 }), stamps.length ? 'Open stamp book' : 'See the empty book'),
    stamps.length ? h('p', { class: 'small muted', style: 'margin:8px 0 0' }, `Latest: ${content.destById.get(stamps[0].destination).name_en}, ${dayToDate(stamps[0].day)}`) : null));

  // quick links
  host.append(h('nav', { class: 'quick-grid', 'aria-label': 'Quick links' },
    h('a', { href: '#/explore' }, icon('map'), h('strong', null, 'Explore Japan'), h('span', { class: 'small muted' }, 'Map of stops')),
    h('a', { href: '#/jlpt' }, icon('exam'), h('strong', null, 'JLPT practice'), h('span', { class: 'small muted' }, 'Levels and mock exams')),
    h('a', { href: '#/kana' }, icon('pen'), h('strong', null, 'Kana trainer'), h('span', { class: 'small muted' }, 'Hiragana and katakana')),
    h('a', { href: '#/me' }, icon('user'), h('strong', null, 'Profile & settings'), h('span', { class: 'small muted' }, 'Goal, sound, backup'))));
  return host;
}
