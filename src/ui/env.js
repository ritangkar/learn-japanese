import { localDay } from '../core/clock.js';
import { knownKanji } from './format.js';

/** Environment passed to exercise renderers. `seed` makes shuffles deterministic per session. */
export function makeEnv(ctx, content, { seed = 'seed', exam = false, extra = null } = {}) {
  const { store } = ctx;
  return {
    content, store, audio: ctx.audio, settings: store.state.settings, known: knownKanji(content, store.state.progress),
    today: () => localDay(Date.now(), new Date().getTimezoneOffset()), seed, exam, extra,
  };
}
export const today = () => localDay(Date.now(), new Date().getTimezoneOffset());
export const nowMinutes = () => Math.floor(Date.now() / 60000);
