// duel-ui.js — the City Duel machine in the Arcade zone: pick a rival, play five rounds, share the result.
import { t, getLang } from './i18n.js';
import { findCities, getCurrentWeather, ApiError } from './api.js';
import { localName } from './weather.js';
import { playDuel, ROUND_NAMES, roundLine, verdict, randomRival } from './duel.js';
import { embeddedFonts, svgToPng } from './poster.js';
import { local } from './storage.js';
import { toast, reducedMotion } from './dom.js';

let mine = null; // { weather, name }
let last = null; // { duel, you, rival, verdict }
let busy = false;
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** Keep a small record of duels (for achievements later). */
function remember(result, rival) {
  const stats = local.get('ww.duels', { win: 0, lose: 0, draw: 0, history: [] });
  stats[result] = (stats[result] ?? 0) + 1;
  stats.history = [{ rival, result, at: Date.now() }, ...(stats.history ?? [])].slice(0, 20);
  local.set('ww.duels', stats);
}

function status(text) {
  $('duelStatus').textContent = text;
}

/** Fight a rival city by name. */
async function fight(query, shownName) {
  if (busy || !mine) return;
  const q = String(query).trim();
  if (!q) {
    status(t('duel.empty'));
    $('duelRival').focus();
    return;
  }
  busy = true;
  $('duelMachine').classList.add('spinning');
  status(t('duel.searching', { city: shownName || q }));
  try {
    const lang = getLang();
    const [geo] = await findCities(q);
    const theirs = await getCurrentWeather({ lat: geo.lat, lon: geo.lon }, lang);
    if (theirs.id === mine.weather.id) {
      status(t('duel.sameCity'));
      return;
    }
    const rivalName = shownName || localName(geo, lang, theirs.name);
    const duel = playDuel(mine.weather, theirs);
    last = { duel, you: mine.name, rival: rivalName, verdict: verdict(duel, mine.name, rivalName, lang, `${mine.weather.id}-${theirs.id}`) };
    remember(duel.result, rivalName);
    status('');
    show(last);
  } catch (error) {
    const kind = error instanceof ApiError ? error.kind : 'unknown';
    status(kind === 'notFound' ? t('duel.notFound', { city: q }) : t(`errors.${kind}.body`));
  } finally {
    busy = false;
    $('duelMachine').classList.remove('spinning');
  }
}

/** Paint the scoreboard, revealing the rounds one by one. */
function show({ duel, you, rival, verdict: line }) {
  const lang = getLang();
  $('sbYou').textContent = you;
  $('sbRival').textContent = rival;
  $('sbVerdict').textContent = '';
  $('duelBoard').hidden = false;
  $('duelBoard').dataset.result = duel.result;
  const list = $('sbRounds');
  list.replaceChildren();
  let you2 = 0;
  let rival2 = 0;
  $('sbScore').textContent = '0 – 0';
  const step = reducedMotion() ? 0 : 420;
  duel.rounds.forEach((r, i) => {
    setTimeout(() => {
      const li = document.createElement('li');
      li.className = `sb-round win-${r.winner}`;
      li.innerHTML = '<span class="sb-name"></span><span class="sb-val you"></span><span class="sb-val rival"></span><span class="sb-line"></span>';
      li.querySelector('.sb-name').textContent = ROUND_NAMES[r.id][lang];
      li.querySelector('.you').textContent = r.you;
      li.querySelector('.rival').textContent = r.rival;
      li.querySelector('.sb-line').textContent = roundLine(r, you, rival, lang);
      list.appendChild(li);
      if (r.winner === 'you') you2++;
      if (r.winner === 'rival') rival2++;
      $('sbScore').textContent = `${you2} – ${rival2}`;
      if (i === duel.rounds.length - 1) $('sbVerdict').textContent = line;
    }, step * (i + 1));
  });
  $('duelBoard').scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
}

/** Result card as an image (1080 × 1350, good for feeds and chats). */
async function cardSvg() {
  const { duel, you, rival, verdict: line } = last;
  const lang = getLang();
  const fonts = await embeddedFonts();
  const W = 1080;
  const H = 1350;
  const color = { win: '#3ddc84', lose: '#ff2e8a', draw: '#ffc93c' }[duel.result];
  const label = t(`duel.result.${duel.result}`).toLocaleUpperCase(lang);
  const rows = duel.rounds.map((r, i) => {
    const y = 640 + i * 96;
    const mark = (side) => (r.winner === side ? '#ffc93c' : r.winner === 'tie' ? '#c9b8e8' : '#5a4a7a');
    return `<rect x="60" y="${y - 58}" width="${W - 120}" height="80" rx="10" fill="#1d0d3a" stroke="#140a24" stroke-width="3"/>
      <text x="${W / 2}" y="${y - 6}" font-family="Anton,sans-serif" font-size="34" fill="#c9b8e8" text-anchor="middle" letter-spacing="2">${esc(ROUND_NAMES[r.id][lang].toLocaleUpperCase(lang))}</text>
      <text x="90" y="${y - 6}" font-family="Anton,sans-serif" font-size="36" fill="${mark('you')}">${esc(r.you.slice(0, 18))}</text>
      <text x="${W - 90}" y="${y - 6}" font-family="Anton,sans-serif" font-size="36" fill="${mark('rival')}" text-anchor="end">${esc(r.rival.slice(0, 18))}</text>`;
  }).join('');
  const words = line.split(' ');
  const lines = [];
  for (const w of words) {
    const cur = lines[lines.length - 1];
    if (!cur || (cur + ' ' + w).length > 40) lines.push(w); else lines[lines.length - 1] = cur + ' ' + w;
  }
  const nameSize = (n) => Math.min(76, Math.floor(820 / Math.max(6, n.length)));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs><style>${fonts}</style>
    <pattern id="d" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="2.4" fill="#ff2e8a" opacity=".18"/></pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="#140a24"/><rect width="${W}" height="${H}" fill="url(#d)"/>
  <rect y="60" width="${W}" height="120" fill="#ff2e8a" transform="rotate(-2 540 120)"/>
  <text x="${W / 2}" y="152" font-family="Bangers,sans-serif" font-size="96" fill="#ffc93c" stroke="#140a24" stroke-width="6" paint-order="stroke fill" text-anchor="middle" letter-spacing="3" transform="rotate(-2 540 120)">${esc(t('duel.title').toLocaleUpperCase(lang))}</text>
  <text x="270" y="300" font-family="Anton,sans-serif" font-size="${nameSize(you)}" fill="#fff3dc" text-anchor="middle">${esc(you.toLocaleUpperCase(lang))}</text>
  <text x="810" y="300" font-family="Anton,sans-serif" font-size="${nameSize(rival)}" fill="#fff3dc" text-anchor="middle">${esc(rival.toLocaleUpperCase(lang))}</text>
  <text x="${W / 2}" y="500" font-family="Anton,sans-serif" font-size="230" fill="#ffc93c" stroke="#140a24" stroke-width="10" paint-order="stroke fill" text-anchor="middle">${duel.score.you} – ${duel.score.rival}</text>
  <text x="${W / 2}" y="560" font-family="Bangers,sans-serif" font-size="56" fill="${color}" text-anchor="middle" letter-spacing="4">${esc(label)}</text>
  ${rows}
  ${lines.slice(0, 3).map((l, i) => `<text x="${W / 2}" y="${1180 + i * 50}" font-family="Barlow,sans-serif" font-weight="700" font-size="40" fill="#fff3dc" text-anchor="middle">${esc(l)}</text>`).join('')}
  <text x="${W / 2}" y="${H - 30}" font-family="Barlow,sans-serif" font-weight="700" font-size="26" fill="#c9b8e8" text-anchor="middle">${esc(`${window.location.host}${window.location.pathname}`.replace(/\/$/, ''))}</text>
</svg>`;
}

async function share() {
  if (!last) return;
  const url = `${window.location.origin}${window.location.pathname}`;
  const text = `${last.verdict} — ${t('duel.shareSig')}`;
  try {
    const blob = await svgToPng(await cardSvg(), 1080, 1350);
    const file = new File([blob], 'wanted-weather-duelo.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], text, url }); } catch { /* closed */ }
      return;
    }
    if (navigator.share) {
      try { await navigator.share({ text, url }); } catch { /* closed */ }
      return;
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'wanted-weather-duelo.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast(t('duel.downloaded'));
  } catch {
    toast(t('fama.error'));
  }
}

/** Wire up the machine. Call once. */
export function initDuel() {
  $('duelForm').addEventListener('submit', (e) => {
    e.preventDefault();
    fight($('duelRival').value);
  });
  $('duelRandom').addEventListener('click', () => {
    const r = randomRival(mine?.name);
    const name = r[getLang()];
    $('duelRival').value = name;
    fight(r.q, name);
  });
  $('duelAgain').addEventListener('click', () => {
    $('duelBoard').hidden = true;
    $('duelRival').value = '';
    $('duelRival').focus();
  });
  $('duelShare').addEventListener('click', share);
}

/** Your city changed (new data). */
export function updateDuel(view, weather) {
  mine = { weather, name: view.city };
  $('duelYou').textContent = view.city;
}

/** Start a duel against a given rival (used by Uncle Isobar's challenge). */
export function duelAgainst(rival) {
  const name = rival[getLang()];
  $('duelRival').value = name;
  fight(rival.q, name);
}
