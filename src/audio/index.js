// Audio service facade. Channels, ambience and effects are added in P6; learning audio (TTS) is available now.
import { createTts } from './tts.js';

export function createAudio({ getSettings, win = globalThis }) {
  const tts = createTts(win, getSettings);
  return { tts, speak: (t, o) => tts.speak(t, o), stop: () => tts.stop(), status: () => tts.status(), sfx: () => {}, ambience: { stop() {}, start() {} }, unlock: () => {} };
}
