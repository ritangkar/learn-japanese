// Injectable clock. Engines never read Date directly; they receive `now` (ms since epoch) or use this module.
let source = () => Date.now();

export const clock = {
  now: () => source(),
  /** @param {() => number} fn */
  setSource(fn) { source = fn; },
  reset() { source = () => Date.now(); },
};

const MS_DAY = 86400000;

/** Local calendar day number (days since 1970-01-01 in the viewer's timezone). */
export function localDay(ms, tzOffsetMinutes = new Date(ms).getTimezoneOffset()) {
  return Math.floor((ms - tzOffsetMinutes * 60000) / MS_DAY);
}

/** 'YYYY-MM-DD' for a day number. */
export function dayToDate(day) {
  return new Date(day * MS_DAY).toISOString().slice(0, 10);
}

export function dateToDay(str) {
  const t = Date.parse(`${str}T00:00:00Z`);
  return Number.isNaN(t) ? null : Math.floor(t / MS_DAY);
}

/** Monday-based week index: the day number of the Monday that starts the week containing `day`. */
export function weekStart(day) {
  const dow = (day + 3) % 7; // 1970-01-01 was a Thursday; 0 = Monday
  return day - dow;
}
