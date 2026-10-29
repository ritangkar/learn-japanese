// Original layered flat-vector destination scenes (viewBox 320x180), generated from shared shapes and a small palette.
// Each scene is a few hundred bytes; none depicts a third-party logo or character. Tokyo reveals layers as units are completed.
import { s } from '../ui/dom.js';

const SKY = { day: ['#BFDDF2', '#F7E7B4'], dusk: ['#F2C6A8', '#8E86B8'], night: ['#27355A', '#566A9C'], snow: ['#DCE6F0', '#F4F7FA'], green: ['#CFE6C3', '#F2EEC8'], sea: ['#BBD8EA', '#E7F2F5'] };
const rect = (x, y, w, h, c, extra = {}) => s('rect', { x, y, width: w, height: h, fill: c, ...extra });
const poly = (pts, c, extra = {}) => s('polygon', { points: pts.map((p) => p.join(',')).join(' '), fill: c, ...extra });
const circ = (cx, cy, r, c, extra = {}) => s('circle', { cx, cy, r, fill: c, ...extra });

export const MOTIFS = {
  sun: () => circ(256, 40, 20, '#E7A93B'), moon: () => circ(256, 38, 16, '#F4EFD5'),
  mountains: () => [poly([[0, 150], [70, 70], [140, 150]], '#8499B8'), poly([[90, 150], [170, 56], [260, 150]], '#6F86A8'), poly([[170, 56], [150, 84], [190, 84]], '#F4F7FA')],
  fuji: () => [poly([[40, 150], [160, 50], [280, 150]], '#5E7FB0'), poly([[160, 50], [132, 82], [188, 82]], '#F6F8FB'), circ(60, 40, 14, '#E7A93B', { opacity: 0.9 })],
  skyline: () => [rect(20, 100, 36, 50, '#6C7C96'), rect(62, 80, 30, 70, '#566684'), rect(98, 108, 40, 42, '#7B8AA3'), rect(190, 90, 34, 60, '#566684'), rect(230, 110, 40, 40, '#6C7C96')],
  tower: () => [poly([[158, 150], [162, 56], [166, 150]], '#C8412B'), poly([[150, 150], [162, 30], [174, 150]], 'none', { stroke: '#C8412B', 'stroke-width': 3 }), rect(150, 84, 24, 6, '#F4EFD5')],
  station: () => [rect(70, 96, 180, 54, '#B9A98A'), rect(70, 88, 180, 10, '#7E6B50'), rect(145, 112, 30, 38, '#4A3F30'), rect(86, 108, 18, 18, '#BFE0F0'), rect(216, 108, 18, 18, '#BFE0F0')],
  konbini: () => [rect(70, 92, 180, 58, '#EDEBE4'), rect(70, 84, 180, 10, '#2E4A7D'), rect(100, 104, 50, 46, '#BFE0F0'), rect(176, 112, 50, 38, '#D8D2C4')],
  houses: () => [poly([[40, 150], [40, 112], [80, 88], [120, 112], [120, 150]], '#C9A78A'), poly([[150, 150], [150, 118], [185, 96], [220, 118], [220, 150]], '#B98F78'), rect(236, 112, 50, 38, '#CFBFA6')],
  torii: () => [rect(116, 70, 88, 10, '#C8412B'), rect(124, 88, 72, 6, '#C8412B'), rect(130, 78, 10, 72, '#C8412B'), rect(180, 78, 10, 72, '#C8412B')],
  pagoda: () => [rect(146, 118, 28, 32, '#7E5B3C'), poly([[128, 118], [160, 100], [192, 118]], '#9C3B2A'), rect(150, 88, 20, 14, '#7E5B3C'), poly([[134, 90], [160, 74], [186, 90]], '#9C3B2A'), rect(153, 62, 14, 10, '#7E5B3C'), poly([[140, 64], [160, 50], [180, 64]], '#9C3B2A')],
  castle: () => [rect(100, 112, 120, 38, '#F1ECE0'), poly([[90, 112], [160, 92], [230, 112]], '#4F5D75'), rect(120, 84, 80, 22, '#F1ECE0'), poly([[112, 84], [160, 64], [208, 84]], '#4F5D75'), rect(138, 56, 44, 14, '#F1ECE0'), poly([[130, 56], [160, 40], [190, 56]], '#4F5D75')],
  waves: () => [rect(0, 128, 320, 52, '#5F95BE'), s('path', { d: 'M0 130 Q20 118 40 130 T80 130 T120 130 T160 130 T200 130 T240 130 T280 130 T320 130', fill: 'none', stroke: '#E9F3F8', 'stroke-width': 3 })],
  trees: () => [rect(60, 120, 8, 30, '#6B4F36'), circ(64, 108, 22, '#5E8B4A'), rect(250, 116, 8, 34, '#6B4F36'), circ(254, 100, 26, '#4F7A3E'), rect(220, 124, 6, 26, '#6B4F36'), circ(223, 114, 16, '#6A9A52')],
  cherry: () => [rect(60, 112, 8, 38, '#6B4F36'), circ(64, 100, 24, '#F2B8C6'), circ(250, 108, 22, '#F2B8C6'), rect(246, 118, 8, 32, '#6B4F36'), circ(150, 130, 3, '#F2B8C6'), circ(180, 138, 3, '#F2B8C6'), circ(110, 140, 3, '#F2B8C6')],
  snow: () => Array.from({ length: 16 }, (_, i) => circ((i * 47 + 20) % 310 + 5, (i * 31 + 12) % 150 + 10, 2.4, '#FFFFFF')),
  bridge: () => [s('path', { d: 'M40 140 Q160 70 280 140', fill: 'none', stroke: '#9C3B2A', 'stroke-width': 8 }), rect(36, 140, 250, 6, '#7E5B3C'), rect(100, 120, 4, 24, '#7E5B3C'), rect(216, 120, 4, 24, '#7E5B3C')],
  lanterns: () => [rect(70, 80, 16, 24, '#C8412B'), rect(150, 70, 16, 24, '#C8412B'), rect(230, 80, 16, 24, '#C8412B'), rect(76, 74, 4, 6, '#3A3A3A'), rect(156, 64, 4, 6, '#3A3A3A'), rect(236, 74, 4, 6, '#3A3A3A')],
  shop: () => [rect(40, 100, 240, 50, '#C9A78A'), poly([[34, 100], [160, 80], [286, 100]], '#2E4A7D'), rect(60, 112, 40, 38, '#F4EFD5'), rect(130, 112, 40, 38, '#F4EFD5'), rect(200, 112, 40, 38, '#F4EFD5')],
  deer: () => [rect(120, 120, 40, 18, '#B98F6A'), rect(122, 136, 5, 14, '#B98F6A'), rect(152, 136, 5, 14, '#B98F6A'), circ(166, 114, 8, '#B98F6A'), rect(168, 98, 2, 12, '#7E5B3C'), rect(162, 98, 2, 12, '#7E5B3C')],
  palm: () => [rect(80, 100, 6, 50, '#7E5B3C'), s('path', { d: 'M83 100 Q60 90 50 104 M83 100 Q108 88 118 104 M83 100 Q70 80 62 78 M83 100 Q98 78 106 76', fill: 'none', stroke: '#4F7A3E', 'stroke-width': 5, 'stroke-linecap': 'round' })],
  rain: () => Array.from({ length: 22 }, (_, i) => s('line', { x1: (i * 29) % 315, y1: (i * 41) % 130, x2: ((i * 29) % 315) - 6, y2: ((i * 41) % 130) + 14, stroke: '#5C7EA5', 'stroke-width': 2 })),
  ground: (c = '#CFC7A8') => rect(0, 148, 320, 32, c),
};

export const SCENES = {
  tokyo: { sky: 'day', motifs: ['sun', 'skyline', 'tower', 'station'], layered: true },
  tokyo_station: { sky: 'dusk', motifs: ['sun', 'station'] }, konbini: { sky: 'night', motifs: ['moon', 'konbini'] }, tokyo_tower: { sky: 'dusk', motifs: ['sun', 'skyline', 'tower'] },
  residential_street: { sky: 'green', motifs: ['sun', 'houses', 'trees'] }, asakusa: { sky: 'day', motifs: ['sun', 'lanterns', 'shop'] }, shibuya: { sky: 'night', motifs: ['moon', 'skyline'] }, shinjuku: { sky: 'dusk', motifs: ['skyline', 'station'] },
  hakone: { sky: 'sea', motifs: ['mountains', 'trees'] }, mount_fuji: { sky: 'day', motifs: ['fuji', 'trees'] }, kamakura: { sky: 'sea', motifs: ['sun', 'waves', 'pagoda'] }, nikko: { sky: 'green', motifs: ['torii', 'trees'] },
  nagoya: { sky: 'day', motifs: ['castle'] }, kyoto: { sky: 'dusk', motifs: ['pagoda', 'cherry'] }, nara: { sky: 'green', motifs: ['deer', 'trees', 'pagoda'] }, osaka: { sky: 'night', motifs: ['moon', 'skyline', 'lanterns'] },
  himeji: { sky: 'day', motifs: ['castle', 'cherry'] }, kanazawa: { sky: 'green', motifs: ['bridge', 'trees'] }, takayama: { sky: 'snow', motifs: ['houses', 'snow'] }, miyajima: { sky: 'sea', motifs: ['sun', 'waves', 'torii'] },
  hiroshima: { sky: 'day', motifs: ['skyline', 'bridge'] }, sendai: { sky: 'dusk', motifs: ['trees', 'skyline'] }, matsuyama: { sky: 'day', motifs: ['castle', 'trees'] }, fukuoka: { sky: 'sea', motifs: ['skyline', 'waves'] },
  sapporo: { sky: 'snow', motifs: ['skyline', 'snow'] }, yakushima: { sky: 'green', motifs: ['rain', 'trees', 'mountains'] }, naha: { sky: 'sea', motifs: ['sun', 'waves', 'palm'] },
};
const TOKYO_LAYERS = [['skyline', 'n5_u01'], ['sun', 'n5_u02'], ['station', 'n5_u03'], ['tower', 'n5_u05']];

/** Build the scene SVG. `done` = set of completed unit ids (used by the layered Tokyo scene). */
export function sceneSvg(destId, { name = '', done = new Set() } = {}) {
  const def = SCENES[destId] || { sky: 'day', motifs: ['mountains'] };
  const [top, bottom] = SKY[def.sky];
  const gid = `sky-${destId}`;
  const svg = s('svg', { viewBox: '0 0 320 180', role: 'img', class: 'scene', 'aria-label': `${name}: a stylised flat illustration (${def.motifs.filter((m) => m !== 'sun' && m !== 'moon').join(', ')})` });
  svg.append(s('defs', null, s('linearGradient', { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 }, s('stop', { offset: '0', 'stop-color': top }), s('stop', { offset: '1', 'stop-color': bottom }))), rect(0, 0, 320, 180, `url(#${gid})`), MOTIFS.ground());
  const shown = def.layered ? def.motifs.filter((m) => { const l = TOKYO_LAYERS.find(([k]) => k === m); return !l || done.has(l[1]); }) : def.motifs;
  for (const m of shown) { const el = MOTIFS[m](); svg.append(...(Array.isArray(el) ? el : [el])); }
  return svg;
}
export const tokyoLayersRevealed = (done) => TOKYO_LAYERS.filter(([, u]) => done.has(u)).length;
