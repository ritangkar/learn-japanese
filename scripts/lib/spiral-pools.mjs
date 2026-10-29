// Vocabulary of released N5 units, used as spiral-review material by later units. Authoring modules are plain data, so importing them is side-effect free.
import u01 from '../../content/authoring/n5_u01.mjs';
import u02 from '../../content/authoring/n5_u02.mjs';
import u03 from '../../content/authoring/n5_u03.mjs';
import u04 from '../../content/authoring/n5_u04.mjs';
import u05 from '../../content/authoring/n5_u05.mjs';
import u06 from '../../content/authoring/n5_u06.mjs';
import u07 from '../../content/authoring/n5_u07.mjs';
import u08 from '../../content/authoring/n5_u08.mjs';
import u09 from '../../content/authoring/n5_u09.mjs';
import u10 from '../../content/authoring/n5_u10.mjs';
import u11 from '../../content/authoring/n5_u11.mjs';
import u12 from '../../content/authoring/n5_u12.mjs';
import { SPIRAL_EXCLUDE } from './author-helpers.mjs';

export const N5_UNITS = [u01, u02, u03, u04, u05, u06, u07, u08, u09, u10, u11, u12];
/** N5 words usable as spiral items: no irregular time / price / calendar words, no expressions, no kanji-only numerals. */
export const N5_SPIRAL_VOCAB = N5_UNITS.flatMap((u) => u.vocab).filter((w) => !SPIRAL_EXCLUDE.test(w.id) && !/^v_(wd_|mo_|dy_|ct_)/.test(w.id) && w.pos !== 'expression');
