// main.js — starts the app and connects user actions, data and rendering.
import '@fontsource/anton/400.css';
import '@fontsource/bangers/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/700.css';
import './styles/main.css';

import { getCurrentWeather, getForecast, findCities, findPlaceName, ApiError } from './api.js';
import { getPosition } from './geo.js';
import { saveLastResult, loadLastResult, session } from './storage.js';
import { t, getLang, setLang } from './i18n.js';
import { buildView, otherMatches } from './weather.js';
import { summarizeForecast } from './forecast.js';
import { buildMission, upcomingCard } from './missions.js';
import { setScreenFx } from './fx.js';
import { showCall, isCallOpen, hangUp } from './call.js';
import { initRadio, updateRadio, refreshRadioTexts } from './radio.js';
import { initExcusometer, updateExcusometer } from './excusometer.js';
import { initFama, updateFama, onFamaShown } from './fama.js';
import {
  applyStaticTexts, renderWeather, setUpdated, showLoading, hideLoading, setBusy,
  showError, clearError, toast, showAlert, closeAlert, isAlertOpen,
  startDaylight, renderMission, renderUpcoming, setMissedCall, showZone, bindStarsExplanation, renderAlternatives,
} from './dom.js';

const FALLBACK_CITY = 'Madrid';
const REFRESH_AFTER_MS = 10 * 60 * 1000;
const SCENES = ['sun', 'clouds', 'rain', 'storm', 'snow', 'fog', 'wind', 'night'];
const FX = ['rain', 'storm', 'snow', 'fog', 'wind', 'heat', 'cold', 'none'];
const ALERTS = ['rain', 'heat', 'cold', 'wind', 'storm'];
const ZONES = ['calle', 'misiones', 'recreativos', 'fama'];

/** Zone from the address (#calle, #misiones, #recreativos), Street by default. */
const zoneFromHash = () => {
  const zone = window.location.hash.slice(1);
  return ZONES.includes(zone) ? zone : 'calle';
};

const state = {
  bundle: null, // { weather, forecast, geo } — last good data
  place: null, // {city} or {lat, lon}, plus source: 'geo' | 'search' | 'fallback'
  savedAt: 0,
  fromCache: false,
  requestId: 0,
  mission: null,
};

// Test helpers for the owner: ?alerta=storm, ?escena=snow, ?efecto=rain, ?llamada=1
const params = new URLSearchParams(window.location.search);
const pickParam = (name, list) => (list.includes(params.get(name)) ? params.get(name) : null);
const forced = {
  alert: pickParam('alerta', ALERTS),
  scene: pickParam('escena', SCENES),
  fx: pickParam('efecto', FX),
  call: params.get('llamada') === '1',
};

/** Keep only what we need from a geocoding result. */
function slimGeo(geo) {
  if (!geo) return null;
  const names = geo.local_names || {};
  return { name: geo.name, local_names: { es: names.es, en: names.en }, state: geo.state, country: geo.country, lat: geo.lat, lon: geo.lon };
}

/**
 * Everything for one place, in parallel where possible:
 * a city search first finds the coordinates; then weather, forecast and the local place name.
 * The forecast and the name are extras: if they fail, the HUD still works.
 */
async function fetchBundle(place, lang) {
  let coords;
  let geo = place.geo ?? null; // a city picked from the "Not this one?" list already has its name
  let alternatives = [];
  if (place.city) {
    const results = await findCities(place.city);
    geo = results[0];
    alternatives = otherMatches(results).map(slimGeo);
    coords = { lat: geo.lat, lon: geo.lon };
  } else {
    coords = { lat: place.lat, lon: place.lon };
  }
  const [weather, forecast, name] = await Promise.all([
    getCurrentWeather(coords, lang),
    getForecast(coords, lang).catch(() => null),
    geo ? Promise.resolve(geo) : findPlaceName(coords).catch(() => null),
  ]);
  return { weather, forecast, geo: slimGeo(name), alternatives };
}

/** The user picked another city with the same name. */
function pickAlternative(geo) {
  load({ lat: geo.lat, lon: geo.lon, geo, source: 'search' });
}

function render() {
  document.body.classList.remove('waiting', 'no-data');
  const lang = getLang();
  const { weather, forecast, geo } = state.bundle;
  const view = buildView(weather, lang, geo);
  if (forced.scene) view.scene = forced.scene;
  if (forced.fx) view.fx = forced.fx;

  renderWeather(view);
  setUpdated(state.savedAt, state.fromCache);
  startDaylight(view);
  setScreenFx(view.fx);

  // Mission: today if there are still forecast hours left today, otherwise tomorrow
  const summary = forecast ? summarizeForecast(forecast) : null;
  const useToday = !summary || (summary.today && summary.today.slots >= 2);
  const day = summary ? (useToday ? summary.today : summary.days[0]) : null;
  state.mission = buildMission({ day: day ?? null, when: useToday ? 'today' : 'tomorrow', view, lang });
  renderMission(state.mission);
  renderUpcoming(summary ? summary.days.map((d) => upcomingCard(d, lang, view.seed)) : null);
  setMissedCall(false);
  updateRadio(view, state.mission);
  updateExcusometer(view, state.mission, day ? day.pop : null);
  updateFama(view, summary ? summary.today : null);
  return view;
}

/** Show the extreme-weather banner once per city, day and type. Returns true if shown. */
function maybeAlert(view) {
  const type = forced.alert || view.extreme;
  if (!type) return false;
  const key = `ww.alert.${view.seed}.${type}`;
  if (!forced.alert && session.get(key)) return false;
  session.set(key, true);
  showAlert(type, view.seed);
  return true;
}

let ringTimer;
/** The phone rings once per visit and city with the mission (visual only; voice needs a tap). */
function maybeRing(view) {
  clearTimeout(ringTimer);
  const key = `ww.call.${view.seed}`;
  if (!forced.call && session.get(key)) return;
  ringTimer = setTimeout(() => {
    if (isAlertOpen()) { maybeRing(view); return; } // wait for the alert to be closed
    session.set(key, true);
    showCall({ text: state.mission.script, mode: 'ring', missed: () => setMissedCall(true) });
  }, forced.call ? 800 : 8000); // let people read the weather first
}

/** Fetch everything for a place and paint it. Older requests are ignored if a newer one started. */
async function load(place) {
  const id = ++state.requestId;
  clearError();
  if (state.bundle) setBusy(true);
  else showLoading(place.city ? t('loadingCity', { city: place.city }) : t('loading'));

  try {
    const bundle = await fetchBundle(place, getLang());
    if (id !== state.requestId) return;
    const { alternatives, ...data } = bundle;
    Object.assign(state, { bundle: data, place, savedAt: Date.now(), fromCache: false });
    saveLastResult(data, place);
    const view = render();
    // Only after a search: a fallback or a location never asks "not this one?"
    renderAlternatives(place.source === 'search' ? alternatives : [], pickAlternative);
    maybeAlert(view);
    maybeRing(view);
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
  if (!state.bundle) document.body.classList.add('no-data'); // nothing to show behind the error
  if (!(error instanceof ApiError)) console.warn(error);
  const actions = [];
  if (kind === 'notFound') {
    actions.push({ label: t('searchLabel'), primary: true, onClick: () => { clearError(); document.getElementById('city').focus(); } });
    if (!state.bundle) actions.push({ label: t('backHome', { city: FALLBACK_CITY }), onClick: () => load({ city: FALLBACK_CITY, source: 'fallback' }) });
  } else if (kind !== 'badKey' && kind !== 'config') {
    actions.push({ label: t('retry'), primary: true, onClick: () => load(place) });
  }
  showError(kind, { city: place.city || '', actions });
}

/** Use the browser's location; if it's refused or fails, fall back. */
async function locate({ automatic }) {
  if (!state.bundle) showLoading(t('loading'));
  else setBusy(true);
  try {
    const { lat, lon } = await getPosition();
    await load({ lat, lon, source: 'geo' });
  } catch (error) {
    const denied = error && error.code === 1;
    if (automatic || !state.bundle) {
      toast(t(denied ? 'geoDenied' : 'geoFailed', { city: FALLBACK_CITY }));
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

  document.querySelectorAll('.js-call').forEach((button) => button.addEventListener('click', () => {
    if (!state.mission) return;
    setMissedCall(false);
    showCall({ text: state.mission.script, mode: 'now' });
  }));

  window.addEventListener('hashchange', () => {
    const zone = zoneFromHash();
    showZone(zone, { focus: true });
    if (zone === 'fama') onFamaShown();
  });

  document.querySelectorAll('[data-lang]').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.lang === getLang()) return;
      setLang(button.dataset.lang);
      applyStaticTexts();
      refreshRadioTexts();
      if (isCallOpen()) hangUp();
      if (state.bundle) {
        render(); // instant switch of our own texts
        load(state.place); // fetch descriptions in the new language
      }
    });
  });

  document.getElementById('alertClose').addEventListener('click', closeAlert);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isAlertOpen()) closeAlert();
    else if (e.key === 'Escape' && isCallOpen()) hangUp();
  });

  // Keep "updated X min ago" honest, and refresh when coming back after a while
  setInterval(() => { if (state.bundle) setUpdated(state.savedAt, state.fromCache); }, 60000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && state.place && Date.now() - state.savedAt > REFRESH_AFTER_MS) load(state.place);
  });
}

function start() {
  setLang(getLang());
  applyStaticTexts();
  showZone(zoneFromHash());
  initRadio();
  initExcusometer();
  initFama();
  bindStarsExplanation();
  bindEvents();

  const last = loadLastResult();
  // Phase 1 saved only the current weather; wrap it so old visitors still get an instant screen
  const bundle = last && (last.data.weather && last.data.main ? { weather: last.data, forecast: null, geo: null } : last.data);
  if (last && bundle && bundle.weather) {
    Object.assign(state, { bundle, place: last.place, savedAt: last.savedAt, fromCache: true });
    render();
  }

  if (last && last.place.source === 'search') {
    load(last.place);
  } else {
    locate({ automatic: true });
  }
}

start();
