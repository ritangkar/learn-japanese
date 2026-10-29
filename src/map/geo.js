// Stylised, simplified outlines of the main islands (original approximations drawn for this project from general geographic
// knowledge; NOT copied from any map dataset and NOT for navigation). Points are [longitude, latitude].
export const BOUNDS = { lon_min: 122, lon_max: 146.5, lat_min: 24, lat_max: 45.8 };
export const VIEW = { w: 1000, h: 1100 };
/** Spec formula: equirectangular fit into 1000x1100. */
export function project(lon, lat) {
  return [Math.round(((lon - BOUNDS.lon_min) / (BOUNDS.lon_max - BOUNDS.lon_min)) * VIEW.w * 10) / 10, Math.round(((BOUNDS.lat_max - lat) / (BOUNDS.lat_max - BOUNDS.lat_min)) * VIEW.h * 10) / 10];
}

export const ISLANDS = {
  hokkaido: [[140.0, 41.5], [140.1, 42.3], [140.3, 43.0], [141.0, 43.2], [141.7, 43.9], [141.6, 44.5], [141.7, 45.1], [141.94, 45.5], [142.6, 44.9], [143.5, 44.3], [144.4, 44.0], [145.3, 43.8], [145.3, 44.35], [144.9, 43.6], [145.8, 43.4], [145.0, 42.95], [144.4, 42.9], [143.3, 41.95], [142.2, 42.4], [141.0, 42.5], [140.7, 42.3], [140.7, 41.8]],
  honshu: [[141.4, 41.45], [140.9, 41.2], [140.35, 41.25], [140.05, 40.6], [139.75, 39.9], [140.0, 39.2], [139.85, 38.9], [139.2, 38.1], [139.0, 37.9], [138.3, 37.2], [137.2, 36.8], [136.9, 37.3], [137.35, 37.5], [136.7, 37.1], [136.2, 36.3], [136.0, 35.65], [135.2, 35.7], [134.2, 35.55], [133.3, 35.5], [132.6, 35.4], [131.7, 34.7], [131.0, 34.35], [130.95, 34.0], [131.5, 34.0], [132.3, 34.3], [133.0, 34.3], [133.9, 34.45], [134.7, 34.75], [135.2, 34.65], [135.4, 34.5], [135.2, 34.2], [135.05, 33.9], [135.78, 33.43], [136.6, 33.8], [136.9, 34.6], [137.0, 34.6], [137.7, 34.65], [138.2, 34.6], [138.5, 35.0], [138.85, 34.6], [139.07, 35.1], [139.4, 35.3], [139.65, 35.15], [139.8, 35.35], [139.9, 35.5], [139.85, 34.9], [140.35, 35.1], [140.85, 35.7], [140.6, 36.4], [140.6, 36.9], [141.0, 37.4], [141.0, 38.25], [141.5, 38.5], [141.9, 39.1], [142.0, 39.6], [141.9, 40.4], [141.5, 40.5]],
  kyushu: [[130.95, 33.95], [131.5, 33.6], [131.65, 33.25], [131.7, 32.6], [131.5, 31.9], [131.35, 31.35], [130.7, 31.0], [130.2, 31.2], [130.2, 31.6], [130.3, 32.0], [130.1, 32.6], [129.75, 32.75], [129.7, 33.2], [130.1, 33.6]],
  shikoku: [[134.6, 34.25], [134.4, 33.8], [134.18, 33.25], [133.5, 33.35], [133.0, 32.72], [132.5, 33.3], [132.0, 33.35], [132.75, 33.85], [133.0, 34.1], [133.8, 34.3], [134.3, 34.2]],
  awaji: [[134.85, 34.6], [135.0, 34.55], [134.9, 34.25], [134.7, 34.3]],
  sado: [[138.2, 38.3], [138.55, 38.3], [138.5, 37.8], [138.25, 37.85]],
};
/** Okinawa is drawn in a dashed inset (bottom-left) rather than at its true position. */
export const OKINAWA_INSET = { x: 30, y: 880, w: 310, h: 190, island: [[40, 40], [90, 30], [130, 60], [170, 70], [215, 105], [190, 120], [150, 100], [110, 120], [70, 95], [45, 70]], naha: [190, 112] };

/** Manual pin offsets (px) so crowded destinations (Kansai, Hiroshima/Miyajima, Tokyo area) do not overlap. */
export const PIN_OFFSETS = { kyoto: [-13, -27], osaka: [-11, 11], nara: [12, 4], nagoya: [13, -13], himeji: [0, -6], mount_fuji: [11, 30], hakone: [-32, -14], kamakura: [8, 17], miyajima: [-7, 4], hiroshima: [23, -2] };

export function pinXY(dest) {
  if (dest.id === 'naha') return [OKINAWA_INSET.x + OKINAWA_INSET.naha[0], OKINAWA_INSET.y + OKINAWA_INSET.naha[1]];
  const [x, y] = project(dest.longitude, dest.latitude);
  const o = PIN_OFFSETS[dest.id] || [0, 0];
  return [x + o[0], y + o[1]];
}

/** Closed smooth path through points (Catmull-Rom to cubic Bezier). */
export function smoothClosed(pts) {
  const n = pts.length; let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]; const p1 = pts[i]; const p2 = pts[(i + 1) % n]; const p3 = pts[(i + 2) % n];
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return `${d}Z`;
}
export const islandPath = (name) => smoothClosed(ISLANDS[name].map(([lon, lat]) => project(lon, lat)));
export const insetIslandPath = () => smoothClosed(OKINAWA_INSET.island.map(([x, y]) => [OKINAWA_INSET.x + x, OKINAWA_INSET.y + y]));

/** Zoomed Tokyo-area sub-map (separate projection). */
export const TOKYO_BOUNDS = { lon_min: 139.66, lon_max: 139.82, lat_min: 35.63, lat_max: 35.74, w: 640, h: 440 };
export function tokyoXY(dest) {
  const b = TOKYO_BOUNDS;
  return [Math.round(((dest.longitude - b.lon_min) / (b.lon_max - b.lon_min)) * b.w), Math.round(((b.lat_max - dest.latitude) / (b.lat_max - b.lat_min)) * b.h)];
}
