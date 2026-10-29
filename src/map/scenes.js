// Original layered flat-vector destination scenes (viewBox 320x180), generated from shared shapes and small palettes.
// Layers, back to front: sky gradient, sun/moon glow, clouds, far ridge, mid landmarks, near ground/water, seasonal details.
// Every scene is a few KB; none depicts a third-party logo, character or photograph. Tokyo reveals layers as units are completed.
import { s } from '../ui/dom.js';

const SKY = {
  day: ['#8EC5EA', '#CBE6F5', '#FBEED0'], dusk: ['#56679F', '#E39E9C', '#F8D8A6'], night: ['#121C3D', '#2B3C70', '#6779AE'],
  snow: ['#B9CEE4', '#E1EBF4', '#F7FAFD'], green: ['#9DD0BA', '#D6EAC6', '#F5EFC8'], sea: ['#7FBEDC', '#C6E3EC', '#F1F0DA'], blossom: ['#F4BFCB', '#FADDE0', '#FFF2E2'],
};
const GROUND = { day: '#CBC3A2', dusk: '#B9A98A', night: '#2C3350', snow: '#EEF3F8', green: '#9DBD7C', sea: '#D9CFA6', blossom: '#CDBE9C' };
const rect = (x, y, w, h, c, extra = {}) => s('rect', { x, y, width: w, height: h, fill: c, ...extra });
const poly = (pts, c, extra = {}) => s('polygon', { points: pts.map((p) => p.join(',')).join(' '), fill: c, ...extra });
const circ = (cx, cy, r, c, extra = {}) => s('circle', { cx, cy, r, fill: c, ...extra });
const path = (d, c, extra = {}) => s('path', { d, fill: c, ...extra });
const wins = (x0, y0, cols, rows, dx, dy, c = '#FFE9A8', w = 3, h = 4) => { const out = []; for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) if ((i * 7 + j * 3) % 4 !== 0) out.push(rect(x0 + i * dx, y0 + j * dy, w, h, c, { opacity: 0.9 })); return out; };
const ridge = (y, amp, c, seed = 0) => { let d = `M0 ${y}`; for (let x = 0; x <= 320; x += 40) d += ` Q${x + 20} ${y - amp * (((x / 40 + seed) % 3) + 1) / 2} ${x + 40} ${y}`; return path(`${d} V180 H0Z`, c); };

export const MOTIFS = {
  sun: () => [circ(256, 42, 34, 'url(#glow)'), circ(256, 42, 17, '#F2B84B')],
  moon: () => [circ(256, 40, 28, 'url(#glow)', { opacity: 0.5 }), circ(256, 40, 14, '#F7F1D6'), circ(251, 37, 3, '#E5DEBE'), ...[[30, 20], [80, 34], [140, 14], [190, 30], [300, 18], [60, 60], [220, 70]].map(([x, y]) => circ(x, y, 1.3, '#FFFFFF', { opacity: 0.85 }))],
  clouds: () => [[50, 36, 1], [170, 26, 0.8], [270, 70, 0.6]].map(([x, y, k]) => s('g', { opacity: 0.75 }, circ(x, y, 12 * k, '#fff'), circ(x + 14 * k, y + 3, 14 * k, '#fff'), circ(x + 30 * k, y + 4, 10 * k, '#fff'), rect(x - 8 * k, y + 4, 44 * k, 10 * k, '#fff', { rx: 5 * k }))),
  mountains: () => [ridge(120, 36, '#8FA6C4', 0), ridge(138, 30, '#6F88AA', 1)],
  fuji: () => [poly([[30, 150], [160, 52], [290, 150]], '#4F72A8'), poly([[160, 52], [128, 84], [140, 80], [152, 90], [160, 82], [170, 92], [182, 80], [192, 84]], '#F6F8FB'), poly([[160, 52], [200, 150], [290, 150]], '#3F5F92', { opacity: 0.35 }), ridge(142, 20, '#6C8F6F', 2)],
  skyline: () => [rect(14, 100, 36, 60, '#5C6C8C'), rect(54, 78, 30, 82, '#4A5878'), rect(88, 108, 40, 52, '#6C7B98'), rect(188, 88, 34, 72, '#4A5878'), rect(226, 106, 44, 54, '#5C6C8C'), rect(274, 94, 30, 66, '#4A5878'), ...wins(18, 106, 5, 6, 7, 9), ...wins(58, 84, 4, 7, 7, 10), ...wins(192, 94, 4, 6, 7, 10), ...wins(230, 112, 5, 5, 7, 9), ...wins(278, 100, 3, 6, 7, 9)],
  tower: () => [poly([[148, 158], [160, 32], [172, 158]], '#D2452D'), poly([[154, 158], [160, 60], [166, 158]], '#FFF1D8', { opacity: 0.9 }), rect(146, 92, 28, 7, '#F6E8CC'), rect(150, 62, 20, 5, '#F6E8CC'), s('line', { x1: 160, y1: 32, x2: 160, y2: 14, stroke: '#D2452D', 'stroke-width': 2 }), s('line', { x1: 150, y1: 140, x2: 170, y2: 100, stroke: '#9E2E1C', 'stroke-width': 1.5 }), s('line', { x1: 170, y1: 140, x2: 150, y2: 100, stroke: '#9E2E1C', 'stroke-width': 1.5 })],
  station: () => [rect(60, 100, 200, 50, '#C7B591'), path('M54 100 L160 78 L266 100Z', '#7E6B50'), rect(145, 116, 30, 34, '#4A3F30'), rect(78, 112, 20, 20, '#BFE0F0'), rect(222, 112, 20, 20, '#BFE0F0'), rect(124, 84, 72, 12, '#F6EFDD'), s('text', { x: 160, y: 94, 'text-anchor': 'middle', 'font-size': 8, fill: '#233E78', 'font-weight': 700 }, 'STATION'), rect(40, 148, 240, 4, '#6F7686'), rect(40, 152, 240, 2, '#9AA1AE')],
  konbini: () => [rect(64, 96, 192, 54, '#F0EDE6'), rect(64, 86, 192, 12, '#2E5A9C'), rect(64, 98, 192, 4, '#3FA66B'), rect(96, 108, 56, 42, '#BFE0F0'), rect(172, 114, 64, 36, '#D8D2C4'), s('text', { x: 160, y: 95, 'text-anchor': 'middle', 'font-size': 8, fill: '#fff', 'font-weight': 700 }, 'OPEN 24H'), rect(104, 118, 40, 14, '#fff', { opacity: 0.45 })],
  houses: () => [poly([[30, 152], [30, 114], [76, 88], [122, 114], [122, 152]], '#D2B08E'), poly([[24, 116], [76, 84], [128, 116]], '#7B5B49'), poly([[150, 152], [150, 122], [188, 98], [226, 122], [226, 152]], '#C79A82'), poly([[144, 124], [188, 94], [232, 124]], '#8A4F3E'), rect(244, 114, 56, 38, '#D8C7A8'), rect(236, 108, 72, 10, '#6B7A8C'), rect(56, 124, 14, 28, '#6C5240'), rect(176, 132, 12, 20, '#6C5240')],
  torii: () => [rect(104, 66, 112, 9, '#C8412B', { rx: 3 }), rect(112, 84, 96, 6, '#C8412B'), rect(124, 75, 10, 78, '#C8412B'), rect(186, 75, 10, 78, '#C8412B'), rect(98, 62, 124, 5, '#2A2A33'), rect(155, 75, 10, 9, '#2A2A33'), circ(160, 150, 10, '#000', { opacity: 0.08 })],
  torii_row: () => [0, 1, 2, 3].map((i) => { const k = 1 - i * 0.2; const cx = 160; const w = 92 * k; const y = 150 - 78 * k - i * 4; return s('g', { opacity: 1 - i * 0.12 }, rect(cx - w / 2, y, w, 7 * k + 2, '#C8412B'), rect(cx - w / 2 + 6 * k, y + 14 * k, w - 12 * k, 4 * k + 1, '#C8412B'), rect(cx - w / 2 + 8 * k, y + 8 * k, 7 * k + 1, 72 * k, '#C8412B'), rect(cx + w / 2 - 15 * k - 1, y + 8 * k, 7 * k + 1, 72 * k, '#C8412B')); }),
  pagoda: () => [rect(140, 120, 40, 30, '#7E5B3C'), path('M118 122 L160 104 L202 122Z', '#9C3B2A'), rect(146, 92, 28, 14, '#7E5B3C'), path('M124 94 L160 78 L196 94Z', '#9C3B2A'), rect(150, 68, 20, 10, '#7E5B3C'), path('M132 70 L160 54 L188 70Z', '#9C3B2A'), rect(158, 36, 4, 18, '#B58B3C'), circ(160, 34, 3, '#D9A63B')],
  castle: () => [rect(86, 116, 148, 36, '#F4EFE3'), rect(80, 150, 160, 6, '#8C8A84'), path('M76 118 L160 98 L244 118Z', '#46546E'), rect(110, 86, 100, 24, '#F4EFE3'), path('M102 88 L160 68 L218 88Z', '#46546E'), rect(134, 58, 52, 14, '#F4EFE3'), path('M126 60 L160 40 L194 60Z', '#46546E'), circ(160, 38, 3, '#D9A63B'), ...[0, 1, 2].map((i) => rect(100 + i * 44, 126, 12, 12, '#586783'))],
  waves: () => [rect(0, 128, 320, 52, '#4F8DB8'), rect(0, 128, 320, 6, '#8EC1DC'), s('path', { d: 'M0 140 Q20 130 40 140 T80 140 T120 140 T160 140 T200 140 T240 140 T280 140 T320 140', fill: 'none', stroke: '#E9F3F8', 'stroke-width': 2.5 }), s('path', { d: 'M0 156 Q25 148 50 156 T100 156 T150 156 T200 156 T250 156 T300 156 T350 156', fill: 'none', stroke: '#BFE0F0', 'stroke-width': 2, opacity: 0.8 })],
  lake: () => [rect(0, 134, 320, 46, '#6FA6C8'), s('path', { d: 'M0 150 Q30 143 60 150 T120 150 T180 150 T240 150 T300 150', fill: 'none', stroke: '#E6F2F8', 'stroke-width': 2, opacity: 0.8 })],
  trees: () => [rect(56, 122, 8, 32, '#6B4F36'), circ(60, 108, 24, '#4F8B4A'), circ(72, 116, 14, '#5E9C58'), rect(252, 118, 8, 36, '#6B4F36'), circ(256, 100, 28, '#3F7A3E'), circ(244, 112, 14, '#5E9C58'), rect(218, 128, 6, 26, '#6B4F36'), circ(221, 118, 16, '#6A9A52')],
  bamboo: () => [30, 52, 74, 246, 268, 292].map((x, i) => s('g', null, rect(x, 20 + (i % 3) * 8, 6, 140, '#5E9C58'), ...[0, 1, 2, 3, 4].map((k) => rect(x - 1, 44 + k * 26, 8, 2.5, '#3F7A3E')), path(`M${x + 6} ${50 + (i % 2) * 20} q16 -6 24 4`, 'none', { stroke: '#7EBE68', 'stroke-width': 3 }))),
  cherry: () => [rect(56, 108, 8, 44, '#6B4F36'), circ(60, 92, 28, '#F2B8C6'), circ(78, 100, 18, '#F7CDD6'), circ(44, 102, 16, '#F7CDD6'), rect(250, 112, 8, 40, '#6B4F36'), circ(254, 96, 26, '#F2B8C6'), circ(238, 106, 14, '#F7CDD6'), ...[[110, 60], [140, 90], [180, 74], [200, 120], [96, 128], [168, 140], [230, 140]].map(([x, y]) => path(`M${x} ${y} q3 -4 6 0 q-3 4 -6 0Z`, '#F7BBC9', { opacity: 0.9 }))],
  petals: () => [[40, 30], [90, 80], [140, 40], [200, 100], [250, 60], [290, 120], [120, 120]].map(([x, y]) => path(`M${x} ${y} q3 -4 6 0 q-3 4 -6 0Z`, '#FFFFFF', { opacity: 0.8 })),
  snow: () => Array.from({ length: 22 }, (_, i) => circ((i * 47 + 20) % 310 + 5, (i * 31 + 12) % 150 + 10, 1.4 + (i % 3) * 0.6, '#FFFFFF', { opacity: 0.9 })),
  snowfield: () => [path('M0 140 Q80 120 160 138 T320 128 V180 H0Z', '#F7FAFD'), path('M0 156 Q100 140 200 156 T320 150 V180 H0Z', '#E7EEF6')],
  lavender: () => [path('M0 138 Q90 124 170 136 T320 126 V180 H0Z', '#8E7AB5'), ...Array.from({ length: 34 }, (_, i) => rect(6 + i * 9.2, 140 + (i % 4) * 8, 2, 14, i % 2 ? '#B39ADD' : '#9A82CC', { opacity: 0.9 }))],
  bridge: () => [path('M30 142 Q160 66 290 142', 'none', { stroke: '#9C3B2A', 'stroke-width': 9 }), rect(26, 142, 270, 6, '#7E5B3C'), rect(92, 112, 4, 32, '#7E5B3C'), rect(224, 112, 4, 32, '#7E5B3C'), rect(158, 92, 4, 52, '#7E5B3C')],
  lanterns: () => [[64, 70], [140, 56], [216, 70], [276, 60]].map(([x, y]) => s('g', null, s('line', { x1: x + 8, y1: 0, x2: x + 8, y2: y, stroke: '#4A3F30', 'stroke-width': 1 }), rect(x, y, 16, 26, '#D2452D', { rx: 6 }), rect(x + 3, y - 3, 10, 4, '#2A2A33'), rect(x + 3, y + 25, 10, 4, '#2A2A33'), circ(x + 8, y + 13, 3, '#FFE9A8', { opacity: 0.9 }))),
  shop: () => [rect(32, 104, 256, 46, '#CBA784'), path('M26 106 L160 84 L294 106Z', '#2E4A7D'), ...[0, 1, 2].map((i) => rect(52 + i * 78, 114, 50, 36, '#F4EFD5')), ...[0, 1, 2].map((i) => rect(52 + i * 78, 114, 50, 6, '#C8412B'))],
  deer: () => [rect(120, 124, 44, 20, '#B98F6A'), rect(124, 140, 5, 16, '#A57D58'), rect(154, 140, 5, 16, '#A57D58'), path('M164 126 q14 -2 12 -16 q-2 -8 -8 -8 q-4 6 -8 12Z', '#B98F6A'), circ(172, 106, 8, '#B98F6A'), s('line', { x1: 170, y1: 100, x2: 166, y2: 86, stroke: '#7E5B3C', 'stroke-width': 2 }), s('line', { x1: 175, y1: 100, x2: 180, y2: 86, stroke: '#7E5B3C', 'stroke-width': 2 }), circ(170, 106, 1.2, '#2A2A33'), circ(132, 132, 1.5, '#F4EFE3'), circ(142, 130, 1.5, '#F4EFE3')],
  palm: () => [rect(64, 96, 7, 58, '#7E5B3C'), s('path', { d: 'M67 96 Q40 84 28 102 M67 96 Q96 82 108 102 M67 96 Q52 72 42 70 M67 96 Q84 72 94 68 M67 96 Q67 76 70 66', fill: 'none', stroke: '#3F8A4A', 'stroke-width': 6, 'stroke-linecap': 'round' }), rect(230, 112, 6, 42, '#7E5B3C'), s('path', { d: 'M233 112 Q214 104 206 118 M233 112 Q252 102 260 118 M233 112 Q226 94 220 92', fill: 'none', stroke: '#4F9A55', 'stroke-width': 5, 'stroke-linecap': 'round' })],
  roofs: () => [path('M110 124 L160 104 L210 124Z', '#B8402A'), rect(120, 124, 80, 28, '#F0E6D0'), rect(150, 134, 20, 18, '#6C5240'), circ(100, 132, 6, '#E6B450')],
  rain: () => Array.from({ length: 24 }, (_, i) => s('line', { x1: (i * 29) % 315, y1: (i * 41) % 130, x2: ((i * 29) % 315) - 6, y2: ((i * 41) % 130) + 14, stroke: '#5C7EA5', 'stroke-width': 1.6, opacity: 0.8 })),
  cedar: () => [[40, 40], [92, 56], [236, 50], [284, 66]].map(([x, h]) => s('g', null, rect(x - 4, h + 70, 8, 120 - h, '#5B4331'), poly([[x - 22, h + 90], [x, h], [x + 22, h + 90]], '#2F6B45'), poly([[x - 26, h + 120], [x, h + 40], [x + 26, h + 120]], '#3A7A52'))),
  canal: () => [rect(0, 140, 320, 40, '#4E6E94'), s('path', { d: 'M0 150 Q30 146 60 150 T120 150 T180 150 T240 150 T300 150', fill: 'none', stroke: '#9EB8D6', 'stroke-width': 2, opacity: 0.9 }), ...[30, 100, 170, 240].map((x) => rect(x, 143, 14, 5, '#FFD27A', { opacity: 0.8 }))],
  neon: () => [rect(40, 96, 60, 14, '#FF6F9C', { rx: 3 }), rect(120, 80, 70, 14, '#6FE0FF', { rx: 3 }), rect(210, 100, 56, 14, '#FFE066', { rx: 3 }), s('text', { x: 70, y: 107, 'text-anchor': 'middle', 'font-size': 9, fill: '#fff', 'font-weight': 700 }, 'ラーメン'), s('text', { x: 155, y: 91, 'text-anchor': 'middle', 'font-size': 9, fill: '#133', 'font-weight': 700 }, 'ゲーム')],
  crossing: () => [rect(0, 150, 320, 30, '#2A2F42'), ...Array.from({ length: 14 }, (_, i) => rect(10 + i * 23, 152, 14, 26, '#E8E8F0', { opacity: 0.9 }))],
  ground: (c = '#CFC7A8') => [rect(0, 148, 320, 32, c), rect(0, 148, 320, 3, '#000', { opacity: 0.06 })],
};

export const SCENES = {
  tokyo: { sky: 'day', motifs: ['sun', 'clouds', 'skyline', 'tower', 'station'], layered: true },
  tokyo_station: { sky: 'dusk', motifs: ['sun', 'clouds', 'station'] }, konbini: { sky: 'night', motifs: ['moon', 'konbini'] }, tokyo_tower: { sky: 'dusk', motifs: ['sun', 'skyline', 'tower'] },
  residential_street: { sky: 'green', motifs: ['sun', 'clouds', 'houses', 'trees'] }, asakusa: { sky: 'day', motifs: ['sun', 'clouds', 'lanterns', 'shop'] }, shibuya: { sky: 'night', motifs: ['moon', 'skyline', 'neon', 'crossing'] }, shinjuku: { sky: 'dusk', motifs: ['clouds', 'skyline', 'neon'] },
  hakone: { sky: 'sea', motifs: ['clouds', 'mountains', 'lake', 'trees'] }, mount_fuji: { sky: 'day', motifs: ['sun', 'clouds', 'fuji', 'lake', 'trees'] }, kamakura: { sky: 'sea', motifs: ['sun', 'clouds', 'pagoda', 'waves'] }, nikko: { sky: 'green', motifs: ['cedar', 'torii', 'clouds'] },
  nagoya: { sky: 'day', motifs: ['sun', 'clouds', 'castle'] }, kyoto: { sky: 'blossom', motifs: ['clouds', 'pagoda', 'cherry', 'petals'] }, nara: { sky: 'green', motifs: ['sun', 'pagoda', 'trees', 'deer'] }, osaka: { sky: 'night', motifs: ['moon', 'skyline', 'canal', 'lanterns'] },
  himeji: { sky: 'blossom', motifs: ['clouds', 'castle', 'cherry', 'petals'] }, kanazawa: { sky: 'green', motifs: ['clouds', 'bridge', 'trees'] }, takayama: { sky: 'snow', motifs: ['houses', 'snowfield', 'snow'] }, miyajima: { sky: 'sea', motifs: ['sun', 'clouds', 'waves', 'torii'] },
  hiroshima: { sky: 'day', motifs: ['sun', 'clouds', 'skyline', 'bridge'] }, sendai: { sky: 'dusk', motifs: ['clouds', 'trees', 'skyline'] }, matsuyama: { sky: 'day', motifs: ['sun', 'clouds', 'castle', 'trees'] }, fukuoka: { sky: 'sea', motifs: ['sun', 'skyline', 'waves'] },
  sapporo: { sky: 'snow', motifs: ['clouds', 'skyline', 'snowfield', 'snow'] }, yakushima: { sky: 'green', motifs: ['rain', 'cedar', 'mountains'] }, naha: { sky: 'sea', motifs: ['sun', 'clouds', 'roofs', 'waves', 'palm'] },
};
const TOKYO_LAYERS = [['skyline', 'n5_u01'], ['sun', 'n5_u02'], ['station', 'n5_u03'], ['tower', 'n5_u05']];
const WATER = new Set(['waves', 'lake', 'canal']);
const FULL_GROUND = new Set(['snowfield', 'lavender', 'crossing']);

/** Build the scene SVG. `done` = set of completed unit ids (used by the layered Tokyo scene). `cover` fills a box (page backdrops); `decorative` hides it from assistive tech. */
export function sceneSvg(destId, { name = '', done = new Set(), cover = false, decorative = false } = {}) {
  const def = SCENES[destId] || { sky: 'day', motifs: ['mountains'] };
  const [top, mid, bottom] = SKY[def.sky];
  const gid = `sky-${destId}${decorative ? '-bg' : ''}`;
  const svg = s('svg', { viewBox: '0 0 320 180', class: 'scene', preserveAspectRatio: cover ? 'xMidYMid slice' : 'xMidYMid meet', 'data-scene': destId });
  if (decorative) svg.setAttribute('aria-hidden', 'true'); else { svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', `${name}: a stylised flat illustration (${def.motifs.filter((m) => !['sun', 'moon', 'clouds', 'petals', 'snow', 'rain'].includes(m)).join(', ')})`); }
  svg.append(s('defs', null,
    s('linearGradient', { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 }, s('stop', { offset: '0', 'stop-color': top }), s('stop', { offset: '0.55', 'stop-color': mid }), s('stop', { offset: '1', 'stop-color': bottom })),
    s('radialGradient', { id: 'glow' }, s('stop', { offset: '0', 'stop-color': '#FFF3C4', 'stop-opacity': 0.9 }), s('stop', { offset: '1', 'stop-color': '#FFF3C4', 'stop-opacity': 0 }))),
    rect(0, 0, 320, 180, `url(#${gid})`));
  const shown = def.layered ? def.motifs.filter((m) => { const l = TOKYO_LAYERS.find(([k]) => k === m); return !l || done.has(l[1]); }) : def.motifs;
  const wet = shown.some((m) => WATER.has(m)); const full = shown.some((m) => FULL_GROUND.has(m));
  const order = ['moon', 'sun', 'clouds', 'mountains', 'fuji', 'cedar', 'skyline', 'lake', 'waves', 'canal', 'castle', 'houses', 'station', 'tower', 'pagoda', 'torii', 'torii_row', 'bridge', 'konbini', 'shop', 'neon', 'roofs', 'deer', 'snowfield', 'lavender', 'bamboo', 'trees', 'palm', 'cherry', 'lanterns', 'crossing', 'petals', 'snow', 'rain'];
  const sorted = [...shown].sort((a, b) => order.indexOf(a) - order.indexOf(b));
  const groundAt = sorted.findIndex((m) => ['station', 'konbini', 'shop', 'houses', 'castle', 'pagoda', 'deer', 'torii', 'bridge', 'tower', 'skyline', 'roofs'].includes(m));
  const shore = wet && sorted.some((m) => m === 'pagoda' || m === 'roofs'); // a sandy shore under a landmark that stands beside the sea
  for (const [i, m] of sorted.entries()) {
    if (i === groundAt && !full && (!wet || shore)) svg.append(...(shore ? [path('M30 180 Q60 144 160 144 T290 180Z', GROUND[def.sky])] : MOTIFS.ground(GROUND[def.sky])));
    const el = MOTIFS[m](); svg.append(...(Array.isArray(el) ? el : [el]));
  }
  if (groundAt === -1 && !wet && !full) svg.append(...MOTIFS.ground(GROUND[def.sky]));
  return svg;
}
export const tokyoLayersRevealed = (done) => TOKYO_LAYERS.filter(([, u]) => done.has(u)).length;
