// dom.js — everything that touches the page: rendering the HUD, loading screen, errors, alerts and toasts.
import { t, getLang } from './i18n.js';
import { sceneSvg } from './scenes.js';
import { minimapSvg } from './minimap.js';
import { STAR_LINES, ALERTS, TAGLINES, LOADING_TIPS, pickBySeed, pickRandom } from './copy.js';

const $ = (id) => document.getElementById(id);
const SVG_NS = 'http://www.w3.org/2000/svg';
export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Fill every element marked with data-i18n* with the text in the current language. */
export function applyStaticTexts() {
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder)));
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
  document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === getLang())));
}

/** Draw 1–5 wanted stars inside an element. */
export function renderStars(el, level) {
  el.replaceChildren();
  const d = $('star5').getAttribute('d');
  for (let i = 1; i <= 5; i++) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', i <= level ? 'on' : 'off');
    svg.appendChild(path);
    el.appendChild(svg);
  }
  el.classList.toggle('max', level === 5);
  el.setAttribute('aria-label', t('starsAria', { n: level }));
}

/** Layers of the scene move at different speeds under the pointer (desktop only). */
function bindParallax(svg) {
  if (reducedMotion()) {
    svg.pauseAnimations?.();
    return;
  }
  const layers = svg.querySelectorAll('.px');
  svg.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = svg.getBoundingClientRect();
    const dx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const dy = ((e.clientY - r.top) / r.height - 0.5) * 2;
    layers.forEach((l) => {
      const depth = Number(l.dataset.depth);
      l.style.transform = `translate(${-dx * depth}px, ${-dy * depth * 0.4}px)`;
    });
  });
  svg.addEventListener('pointerleave', () => layers.forEach((l) => { l.style.transform = ''; }));
}

/** Paint the whole HUD from a view model (see weather.js buildView). */
export function renderWeather(view) {
  const lang = getLang();
  document.body.dataset.scene = view.scene;

  $('scene').innerHTML = sceneSvg(view.scene, t(`sceneAria.${view.scene}`));
  bindParallax($('scene').querySelector('svg'));

  $('cityName').textContent = view.city;
  $('country').textContent = view.country;
  $('localTime').textContent = t('localTime', { time: view.localTime });
  $('temp').textContent = `${view.temp}°`;
  $('condition').textContent = view.description;
  renderStars($('wanted'), view.level);
  $('wantedLabel').textContent = pickBySeed(STAR_LINES[view.level][lang], `${view.seed}-stars`);

  $('feels').textContent = `${view.feels}°`;
  $('humidity').textContent = `${view.humidity}%`;
  $('wind').textContent = `${view.windKmh} km/h`;
  $('sunrise').textContent = view.sunrise;
  $('sunset').textContent = view.sunset;
  const dir = t('compass')[view.windCompass];
  $('windNote').textContent = t('windFrom', { dir });

  $('minimap').innerHTML = minimapSvg({ lat: view.lat, lon: view.lon, windDeg: view.windDeg, label: t('minimapAria', { city: view.city }) });
  if (reducedMotion()) $('minimap').querySelector('svg')?.pauseAnimations?.();

  $('stage').hidden = false;
  $('details').hidden = false;
}

/** "Updated X min ago" under the HUD. */
export function setUpdated(savedAt, fromCache = false) {
  const minutes = Math.floor((Date.now() - savedAt) / 60000);
  const when = minutes < 1 ? t('updatedNow') : t('updatedMin', { n: minutes });
  $('updated').textContent = fromCache ? `${when} · ${t('showingSaved')}` : when;
}

/** Full-screen title card while there is nothing to show yet. */
export function showLoading(message) {
  const lang = getLang();
  $('loadingText').textContent = message;
  $('loadingTagline').textContent = pickRandom(TAGLINES[lang]);
  $('loadingTip').textContent = pickRandom(LOADING_TIPS[lang]);
  $('loading').hidden = false;
  document.body.setAttribute('aria-busy', 'true');
}

export function hideLoading() {
  $('loading').hidden = true;
  document.body.removeAttribute('aria-busy');
}

/** Small spinning star on the HUD while a new city loads over the current one. */
export function setBusy(on) {
  $('stage').classList.toggle('busy', on);
  $('stage').setAttribute('aria-busy', String(on));
}

/**
 * Show an error in the game's style. Actions are buttons: [{label, onClick}].
 */
export function showError(kind, { city = '', actions = [] } = {}) {
  const box = $('error');
  const card = document.createElement('div');
  card.className = 'error-card';
  card.dataset.kind = kind;
  const title = document.createElement('p');
  title.className = 'error-title';
  title.textContent = t(`errors.${kind}.title`);
  const body = document.createElement('p');
  body.className = 'error-body';
  body.textContent = t(`errors.${kind}.body`, { city });
  card.append(title, body);
  if (actions.length) {
    const row = document.createElement('div');
    row.className = 'buttons';
    actions.forEach(({ label, onClick, primary }) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `btn ${primary ? 'btn-primary' : 'btn-ghost'}`;
      b.textContent = label;
      b.addEventListener('click', onClick);
      row.appendChild(b);
    });
    card.appendChild(row);
  }
  box.replaceChildren(card);
  box.hidden = false;
}

export function clearError() {
  $('error').replaceChildren();
  $('error').hidden = true;
}

let toastTimer;
/** Short message at the bottom of the screen. */
export function toast(message) {
  const el = $('toast');
  el.textContent = message;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 5000);
}

let alertOpener = null;
/** Full-screen extreme-weather banner. */
export function showAlert(type, seed) {
  const lang = getLang();
  const overlay = $('alert');
  overlay.dataset.type = type;
  $('alertWord').textContent = pickBySeed(ALERTS[type][lang], `${seed}-alert`);
  $('alertSub').textContent = ALERTS[type].sub[lang];
  alertOpener = document.activeElement;
  overlay.hidden = false;
  const banner = overlay.querySelector('.banner');
  banner.style.animation = 'none';
  void banner.offsetWidth; // restart the entrance animation
  banner.style.animation = '';
  $('alertClose').focus();
}

export function closeAlert() {
  $('alert').hidden = true;
  if (alertOpener && typeof alertOpener.focus === 'function') alertOpener.focus();
}

export const isAlertOpen = () => !$('alert').hidden;
