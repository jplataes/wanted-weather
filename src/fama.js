// fama.js — the Fame zone: the poster of the day with format choice, another title, download and share.
import { t, getLang } from './i18n.js';
import { posterTheme, posterText } from './poster-copy.js';
import { posterSvg, posterPng, posterPreviewUrl } from './poster.js';
import { toast } from './dom.js';

let data = null; // { view, today }
let format = 'poster';
let variant = 0;
let dirty = true;
let svg = '';
let text = null;
let previewUrl = null;
let renderId = 0;
const $ = (id) => document.getElementById(id);
const visible = () => !$('zone-fama').hidden;

function facts(view, today, lang) {
  return {
    CITY: view.city.toLocaleUpperCase(lang),
    TEMP: view.temp,
    MAX: today ? Math.max(today.max, view.temp) : null,
    MIN: today ? Math.min(today.min, view.temp) : null,
    FEELS: view.feels,
    GUST: view.gustShowKmh,
    POP: today ? today.pop : null,
    HUM: view.humidity,
    DESC: view.description.toLowerCase(),
    WIND: view.windKmh,
  };
}

async function render() {
  if (!data) return;
  dirty = false;
  const id = ++renderId;
  const { view, today } = data;
  const lang = getLang();
  const theme = posterTheme(view);
  text = posterText(theme, facts(view, today, lang), lang, variant);
  $('posterWhy').textContent = t('fama.why', { genre: text.genre, city: view.city, reason: t(`fama.reason.${theme}`) });
  const dateLabel = new Date(`${view.dateKey}T12:00:00Z`).toLocaleDateString(lang === 'en' ? 'en-GB' : 'es-ES', { day: 'numeric', month: 'short', timeZone: 'UTC' }).replace('.', '');
  const url = `${window.location.host}${window.location.pathname}`.replace(/\/$/, '');
  $('posterFrame').classList.add('developing');
  $('posterFrame').dataset.format = format;
  try {
    const next = await posterSvg({ text, scene: view.scene, night: view.night, level: view.level, dateLabel, url, lang }, format);
    if (id !== renderId) return;
    svg = next;
    const old = previewUrl;
    previewUrl = posterPreviewUrl(svg);
    const img = $('posterImg');
    img.onload = () => { if (old) URL.revokeObjectURL(old); $('posterFrame').classList.remove('developing'); };
    img.alt = `${t('fama.posterAlt')}: ${text.title}. ${text.genre}. ${text.tagline}`;
    img.src = previewUrl;
  } catch {
    $('posterFrame').classList.remove('developing');
    toast(t('fama.error'));
  }
}

const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const fileName = () => `wanted-weather-${slug(data.view.city)}-${format === 'story' ? 'stories' : 'poster'}.png`;

function download(blob) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fileName();
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

async function onDownload() {
  if (!svg) return;
  try {
    download(await posterPng(svg, format));
    toast(t('fama.downloaded'));
    document.dispatchEvent(new CustomEvent('ww:track', { detail: { type: 'poster' } }));
  } catch {
    toast(t('fama.error'));
  }
}

async function onShare() {
  if (!svg) return;
  try {
    const blob = await posterPng(svg, format);
    const file = new File([blob], fileName(), { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: text.title, text: t('fama.shareText') });
        document.dispatchEvent(new CustomEvent('ww:track', { detail: { type: 'poster' } }));
      } catch {
        /* closed the share sheet */
      }
    } else {
      download(blob);
      toast(t('fama.shareFallback'));
    }
  } catch {
    toast(t('fama.error'));
  }
}

/** Wire up the controls. Call once. */
export function initFama() {
  document.querySelectorAll('[data-format]').forEach((b) => b.addEventListener('click', () => {
    format = b.dataset.format;
    document.querySelectorAll('[data-format]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    render();
  }));
  $('posterReroll').addEventListener('click', () => { variant += 1; render(); });
  $('posterDownload').addEventListener('click', onDownload);
  $('posterShare').addEventListener('click', onShare);
}

/** New weather: rebuild the poster now if it's on screen, or when the zone is opened. */
export function updateFama(view, today) {
  data = { view, today };
  variant = 0;
  dirty = true;
  if (visible()) render();
}

/** The Fame zone was opened. */
export function onFamaShown() {
  if (dirty) render();
}
