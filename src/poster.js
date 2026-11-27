// poster.js — the movie poster of the day. It is drawn as one self-contained SVG (today's scene,
// title, tagline, credits) with the fonts embedded, shown as an image, and turned into a PNG to
// download or share. Two formats: poster (2:3) and stories (9:16).
import antonUrl from '@fontsource/anton/files/anton-latin-400-normal.woff2?url';
import barlowUrl from '@fontsource/barlow/files/barlow-latin-700-normal.woff2?url';
import bangersUrl from '@fontsource/bangers/files/bangers-latin-400-normal.woff2?url';
import { sceneBody } from './scenes.js';
import { PRESENTS, TODAY } from './poster-copy.js';

export const FORMATS = { poster: { w: 1080, h: 1620 }, story: { w: 1080, h: 1920 } };
const STAR = 'M12 2L14.9 8.6L22 9.3L16.6 14L18.2 21L12 17.3L5.8 21L7.4 14L2 9.3L9.1 8.6Z';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** Split text into lines of at most `max` characters, by words. */
export function wrap(text, max) {
  const lines = [];
  let line = '';
  for (const word of String(text).split(/\s+/)) {
    if (!line) line = word;
    else if ((line + ' ' + word).length <= max) line += ' ' + word;
    else { lines.push(line); line = word; }
  }
  if (line) lines.push(line);
  return lines;
}

// Fonts embedded once as data URLs, so the downloaded image looks exactly like the preview
let fontCss = null;
async function embeddedFonts() {
  if (fontCss) return fontCss;
  const toData = async (url) => {
    const buf = await (await fetch(url)).arrayBuffer();
    let bin = '';
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return `data:font/woff2;base64,${btoa(bin)}`;
  };
  try {
    const [anton, barlow, bangers] = await Promise.all([toData(antonUrl), toData(barlowUrl), toData(bangersUrl)]);
    fontCss = `@font-face{font-family:'Anton';src:url(${anton}) format('woff2');}`
      + `@font-face{font-family:'Barlow';font-weight:700;src:url(${barlow}) format('woff2');}`
      + `@font-face{font-family:'Bangers';src:url(${bangers}) format('woff2');}`;
  } catch {
    fontCss = ''; // fall back to system fonts rather than failing
  }
  return fontCss;
}

/**
 * Build the poster SVG.
 * @param {object} p {text (from posterText), scene, night, level, dateLabel, url, lang}
 * @param {'poster'|'story'} format
 */
export async function posterSvg(p, format = 'poster') {
  const { w: W, h: H } = FORMATS[format];
  const story = format === 'story';
  const fonts = await embeddedFonts();
  const defs = document.querySelector('svg.defs defs')?.innerHTML ?? '';
  const sceneH = story ? 1240 : 1040;

  // Title: as big as fits, on up to 3 lines
  const titleLines = wrap(p.text.title, 12).slice(0, 3);
  const longest = Math.max(...titleLines.map((l) => l.length));
  const size = Math.min(170, Math.floor(1000 / (longest * 0.5)));
  const titleTop = (story ? 1210 : 1000) - (titleLines.length - 1) * size * 0.45;
  const titleSvg = titleLines.map((line, i) => {
    const y = titleTop + i * size * 0.92;
    const t = esc(line);
    return `<text x="${W / 2 + 9}" y="${y + 9}" class="title" font-size="${size}" fill="#ff2e8a">${t}</text>`
      + `<text x="${W / 2}" y="${y}" class="title" font-size="${size}" fill="#ffc93c" stroke="#140a24" stroke-width="${Math.round(size * 0.06)}" paint-order="stroke fill">${t}</text>`;
  }).join('');
  const afterTitle = titleTop + (titleLines.length - 1) * size * 0.92;

  const taglineLines = wrap(p.text.tagline, 38);
  const taglineSvg = taglineLines.map((line, i) => `<text x="${W / 2}" y="${afterTitle + 92 + i * 56}" class="tagline">${esc(line)}</text>`).join('');

  const creditTop = H - (story ? 330 : 300);
  const creditLines = wrap(p.text.credits.toLocaleUpperCase(p.lang === 'en' ? 'en' : 'es'), 58).slice(0, 3);
  const creditsSvg = creditLines.map((line, i) => `<text x="${W / 2}" y="${creditTop + i * 40}" class="credits">${esc(line)}</text>`).join('');

  const stars = Array.from({ length: 5 }, (_, i) => `<path d="${STAR}" transform="translate(${W / 2 - 150 + i * 62} 128) scale(2.2)" fill="${i < p.level ? '#ffc93c' : 'none'}" stroke="${i < p.level ? '#140a24' : '#c9b8e8'}" stroke-width="1.4" stroke-linejoin="round"/>`).join('');

  const genre = esc(p.text.genre.toLocaleUpperCase(p.lang));
  const genreW = 70 + genre.length * 30;
  const genreY = titleTop - size * 0.9 - 40;
  const rating = esc(p.text.rating.toLocaleUpperCase(p.lang));
  const ratingLines = wrap(rating, 30).slice(0, 2);
  const ratingY = H - 150;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <style>${fonts}
      .title{font-family:Anton,Impact,sans-serif;text-anchor:middle;letter-spacing:1px}
      .tagline{font-family:Barlow,'Segoe UI',sans-serif;font-weight:700;font-size:44px;fill:#fff3dc;text-anchor:middle}
      .credits{font-family:Anton,Impact,sans-serif;font-size:30px;letter-spacing:3px;fill:#c9b8e8;text-anchor:middle}
      .small{font-family:Anton,Impact,sans-serif;letter-spacing:6px;fill:#fff3dc;text-anchor:middle}
    </style>
    ${defs}
    <linearGradient id="pFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#140a24" stop-opacity="0"/><stop offset="1" stop-color="#140a24"/></linearGradient>
    <linearGradient id="pTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#140a24" stop-opacity=".85"/><stop offset="1" stop-color="#140a24" stop-opacity="0"/></linearGradient>
    <pattern id="pDots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="2.6" fill="#140a24"/></pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="#140a24"/>
  <svg x="0" y="0" width="${W}" height="${sceneH}" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice">${sceneBody(p.scene, p.night)}</svg>
  <rect width="${W}" height="${sceneH}" fill="url(#pDots)" opacity=".1"/>
  <rect width="${W}" height="260" fill="url(#pTop)"/>
  <rect y="${sceneH - 460}" width="${W}" height="460" fill="url(#pFade)"/>
  <text x="${W / 2}" y="92" class="small" font-size="38">${esc(PRESENTS[p.lang].toLocaleUpperCase(p.lang))}</text>
  ${stars}
  <g transform="rotate(-3 ${W / 2} ${genreY})">
    <rect x="${W / 2 - genreW / 2}" y="${genreY - 50}" width="${genreW}" height="68" fill="#ff2e8a" stroke="#140a24" stroke-width="5"/>
    <text x="${W / 2}" y="${genreY}" font-family="Bangers,Impact,sans-serif" font-size="56" letter-spacing="3" fill="#140a24" text-anchor="middle">${genre}</text>
  </g>
  ${titleSvg}
  ${taglineSvg}
  <rect x="80" y="${creditTop - 56}" width="${W - 160}" height="3" fill="#c9b8e8" opacity=".4"/>
  ${creditsSvg}
  <g transform="translate(80 ${ratingY})">
    <rect width="${ratingLines.length > 1 ? 560 : 40 + ratingLines[0].length * 17}" height="${ratingLines.length * 32 + 24}" fill="none" stroke="#fff3dc" stroke-width="3"/>
    ${ratingLines.map((l, i) => `<text x="18" y="${38 + i * 32}" font-family="Barlow,sans-serif" font-weight="700" font-size="24" letter-spacing="1" fill="#fff3dc">${l}</text>`).join('')}
  </g>
  <text x="${W - 80}" y="${ratingY + 36}" font-family="Anton,Impact,sans-serif" font-size="44" fill="#ffc93c" text-anchor="end">${esc(`${TODAY[p.lang]} · ${p.dateLabel}`.toLocaleUpperCase(p.lang))}</text>
  <text x="${W / 2}" y="${H - 34}" font-family="Barlow,sans-serif" font-weight="700" font-size="26" fill="#c9b8e8" text-anchor="middle" opacity=".8">${esc(p.url)}</text>
</svg>`;
}

/** Load an SVG string as an <img>. */
function loadImage(svg) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('poster image failed')); };
    img.src = url;
  });
}

/** Rasterise the SVG to a PNG blob at full size. */
export async function posterPng(svg, format) {
  const { w, h } = FORMATS[format];
  const { img, url } = await loadImage(svg);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(img, 0, 0, w, h);
  URL.revokeObjectURL(url);
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('png failed'))), 'image/png'));
}

/** Object URL to show the poster on the page (the caller revokes the previous one). */
export function posterPreviewUrl(svg) {
  return URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
}
