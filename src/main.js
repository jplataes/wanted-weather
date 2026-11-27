// main.js — starts the app and connects user actions, data and rendering.
import '@fontsource/anton/400.css';
import '@fontsource/bangers/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/700.css';
import './styles/main.css';

import { getCurrentWeather, ApiError } from './api.js';
import { getPosition } from './geo.js';
import { saveLastResult, loadLastResult, session } from './storage.js';
import { t, getLang, setLang } from './i18n.js';
import { buildView } from './weather.js';
import {
  applyStaticTexts, renderWeather, setUpdated, showLoading, hideLoading, setBusy,
  showError, clearError, toast, showAlert, closeAlert, isAlertOpen,
} from './dom.js';

const FALLBACK_CITY = 'Madrid';
const REFRESH_AFTER_MS = 10 * 60 * 1000;

const state = {
  data: null, // last good API response
  place: null, // {city} or {lat, lon}, plus source: 'geo' | 'search' | 'fallback'
  savedAt: 0,
  fromCache: false,
  requestId: 0,
};

// Test helpers for the owner: ?alerta=storm shows a banner, ?escena=rain forces a scene.
const params = new URLSearchParams(window.location.search);
const forcedAlert = ['rain', 'heat', 'cold', 'wind', 'storm'].includes(params.get('alerta')) ? params.get('alerta') : null;
const forcedScene = ['sun', 'rain', 'night'].includes(params.get('escena')) ? params.get('escena') : null;

function render() {
  const view = buildView(state.data, getLang());
  if (forcedScene) view.scene = forcedScene;
  renderWeather(view);
  setUpdated(state.savedAt, state.fromCache);
  return view;
}

/** Show the extreme-weather banner once per city, day and type. */
function maybeAlert(view) {
  const type = forcedAlert || view.extreme;
  if (!type) return;
  const key = `ww.alert.${view.seed}.${type}`;
  if (!forcedAlert && session.get(key)) return;
  session.set(key, true);
  showAlert(type, view.seed);
}

/** Fetch the weather for a place and paint it. Older requests are ignored if a newer one started. */
async function load(place) {
  const id = ++state.requestId;
  clearError();
  if (state.data) setBusy(true);
  else showLoading(place.city ? t('loadingCity', { city: place.city }) : t('loading'));

  try {
    const data = await getCurrentWeather(place, getLang());
    if (id !== state.requestId) return;
    Object.assign(state, { data, place, savedAt: Date.now(), fromCache: false });
    saveLastResult(data, place);
    const view = render();
    maybeAlert(view);
  } catch (error) {
    if (id !== state.requestId) return;
    handleError(error, place);
  } finally {
    if (id === state.requestId) {
      hideLoading();
      setBusy(false);
    }
  }
}

function handleError(error, place) {
  const kind = error instanceof ApiError ? error.kind : 'unknown';
  if (!(error instanceof ApiError)) console.warn(error);
  const actions = [];
  if (kind === 'notFound') {
    actions.push({ label: t('searchLabel'), primary: true, onClick: () => { clearError(); document.getElementById('city').focus(); } });
    if (!state.data) actions.push({ label: t('backHome', { city: FALLBACK_CITY }), onClick: () => load({ city: FALLBACK_CITY, source: 'fallback' }) });
  } else if (kind !== 'badKey' && kind !== 'config') {
    actions.push({ label: t('retry'), primary: true, onClick: () => load(place) });
  }
  showError(kind, { city: place.city || '', actions });
}

/** Use the browser's location; if it's refused or fails, fall back. */
async function locate({ automatic }) {
  if (!state.data) showLoading(t('loading'));
  else setBusy(true);
  try {
    const { lat, lon } = await getPosition();
    await load({ lat, lon, source: 'geo' });
  } catch (error) {
    const denied = error && error.code === 1;
    const message = t(denied ? 'geoDenied' : 'geoFailed', { city: FALLBACK_CITY });
    if (automatic || !state.data) {
      toast(message);
      await load({ city: FALLBACK_CITY, source: 'fallback' });
    } else {
      setBusy(false);
      toast(t(denied ? 'geoDeniedShort' : 'geoFailedShort'));
    }
  }
}

function bindEvents() {
  document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('city');
    const city = input.value.trim();
    if (!city) {
      toast(t('emptySearch'));
      input.focus();
      return;
    }
    load({ city, source: 'search' });
  });

  document.getElementById('locate').addEventListener('click', () => locate({ automatic: false }));

  document.querySelectorAll('[data-lang]').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.lang === getLang()) return;
      setLang(button.dataset.lang);
      applyStaticTexts();
      if (state.data) {
        render(); // instant switch of our own texts
        load(state.place); // fetch descriptions in the new language
      }
    });
  });

  document.getElementById('alertClose').addEventListener('click', closeAlert);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isAlertOpen()) closeAlert();
  });

  // Keep "updated X min ago" honest, and refresh when coming back after a while
  setInterval(() => { if (state.data) setUpdated(state.savedAt, state.fromCache); }, 60000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && state.place && Date.now() - state.savedAt > REFRESH_AFTER_MS) load(state.place);
  });
}

function start() {
  setLang(getLang());
  applyStaticTexts();
  bindEvents();

  const last = loadLastResult();
  if (last) {
    Object.assign(state, { data: last.data, place: last.place, savedAt: last.savedAt, fromCache: true });
    render();
  }

  if (last && last.place.source === 'search') {
    load(last.place);
  } else {
    locate({ automatic: true });
  }
}

start();
