// minimap.js — a stylised, made-up map of the area. It is not a real map:
// the layout is generated from the city's coordinates, so each city always gets its own map.
// The teal arrow shows the real wind direction.
import { hash } from './copy.js';

/** Small seeded random number generator (mulberry32). */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n) => Math.round(n * 10) / 10;

/**
 * @param {{lat: number, lon: number, windDeg: number, label: string}} opts
 * @returns {string} SVG markup
 */
export function minimapSvg({ lat, lon, windDeg, label }) {
  const rand = rng(hash(`${lat.toFixed(2)},${lon.toFixed(2)}`));
  const between = (a, b) => a + rand() * (b - a);

  // Streets: two vertical, two horizontal, one diagonal, at positions that depend on the city
  const vx = [between(40, 80), between(120, 160)];
  const hy = [between(40, 80), between(110, 150)];
  const diagUp = rand() > 0.5;
  const hasRiver = rand() > 0.3;
  const riverY = between(120, 170);
  const park = { x: between(70, 110), y: between(70, 100), w: between(30, 50), h: between(24, 36) };
  const mission = { x: between(40, 160), y: between(30, 70) };

  // Blocks: the spaces between streets, slightly inset
  const xs = [0, vx[0], vx[1], 200];
  const ys = [0, hy[0], hy[1], 200];
  let blocks = '';
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const x = xs[i] + 8, y = ys[j] + 8, w = xs[i + 1] - xs[i] - 16, h = ys[j + 1] - ys[j] - 16;
      if (w > 8 && h > 8) blocks += `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="4"/>`;
    }
  }

  const river = hasRiver
    ? `<path d="M-10 ${r1(riverY)}C40 ${r1(riverY - 20)} 80 ${r1(riverY + 18)} 120 ${r1(riverY)}S180 ${r1(riverY - 16)} 210 ${r1(riverY + 4)}" fill="none" stroke="#16c7b7" stroke-width="15"/>`
    : '';
  const diag = diagUp ? 'M-5 210L210 -5' : 'M-5 -5L210 210';
  // Wind "deg" is where it comes FROM; the arrow points where it blows TO.
  const windTo = (windDeg + 180) % 360;
  const safe = String(label).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  return `<svg class="minimap" viewBox="0 0 200 200" role="img" aria-label="${safe}">
    <defs><clipPath id="mapClip"><circle cx="100" cy="100" r="90"/></clipPath></defs>
    <circle cx="100" cy="100" r="96" fill="var(--map-ring, #ff7a1a)" stroke="#140a24" stroke-width="5"/>
    <g clip-path="url(#mapClip)">
      <rect width="200" height="200" fill="#2a1250"/>
      <g fill="#3f1e78">${blocks}</g>
      <rect x="${r1(park.x)}" y="${r1(park.y)}" width="${r1(park.w)}" height="${r1(park.h)}" rx="6" fill="#19a97b" stroke="#140a24" stroke-width="2"/>
      ${river}
      <g fill="none" stroke="#fff3dc" stroke-width="6" stroke-linecap="round">
        <path d="M${r1(vx[0])} -5V210"/><path d="M${r1(vx[1])} -5V210"/>
        <path d="M-5 ${r1(hy[0])}H210"/><path d="M-5 ${r1(hy[1])}H210"/>
        <path d="${diag}" stroke-width="5" opacity=".8"/>
      </g>
      <g transform="translate(${r1(mission.x)} ${r1(mission.y)})">
        <circle r="11" fill="#ffc93c" stroke="#140a24" stroke-width="3"/>
        <use href="#star5" transform="translate(-6 -6) scale(.5)" fill="#140a24"/>
      </g>
      <g transform="translate(100 100) rotate(${Math.round(windTo)})">
        <path d="M0 -62 L9 -46 H3 V-30 H-3 V-46 H-9 Z" fill="#16c7b7" stroke="#140a24" stroke-width="2.5" stroke-linejoin="round" class="wind-arrow"/>
      </g>
      <circle cx="100" cy="100" r="14" fill="#ff2e8a" class="pulse" opacity=".6"/>
      <path d="M100 86L111 112L100 106L89 112Z" fill="#ff2e8a" stroke="#140a24" stroke-width="3" stroke-linejoin="round"/>
    </g>
    <circle cx="100" cy="11" r="11" fill="#140a24"/>
    <text x="100" y="16" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="14" fill="#fff3dc">N</text>
  </svg>`;
}
