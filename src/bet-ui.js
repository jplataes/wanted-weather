// bet-ui.js — The Bet machine: pick tomorrow's high, save it, settle it the next day.
import { t, getLang } from './i18n.js';
import { getCurrentWeather, getForecast } from './api.js';
import { summarizeForecast } from './forecast.js';
import { scoreBet, todaysHigh, sortBets, betCallText, betHistoryLine } from './bet.js';
import { getProgress, recordBet, dayAfter, localDate } from './progress.js';
import { local } from './storage.js';
import { fixDegrees } from './copy.js';

const KEY = 'ww.bets';
let current = null; // { view, weather }
const $ = (id) => document.getElementById(id);

const loadStore = () => ({ pending: [], history: [], ...(local.get(KEY, {}) || {}) });
const saveStore = (s) => local.set(KEY, s);

function myPending() {
  if (!current) return null;
  const target = dayAfter(current.view.dateKey);
  return loadStore().pending.find((b) => b.cityId === current.weather.id && b.date === target) ?? null;
}

function setValue(v) {
  const value = Math.max(-30, Math.min(50, Math.round(v)));
  $('betRange').value = String(value);
  $('betValue').textContent = fixDegrees(`${value}°`);
}

/** Repaint the machine from the saved data. */
export function renderBet() {
  if (!current) return;
  const lang = getLang();
  const p = getProgress();
  const store = loadStore();
  const mine = myPending();
  $('betCity').textContent = current.view.city;
  $('betStatus').textContent = mine
    ? fixDegrees(t('bet.placed', { guess: mine.guess, city: current.view.city }))
    : t('bet.prompt', { city: current.view.city });
  $('betPlace').textContent = t(mine ? 'bet.change' : 'bet.place');
  $('betMachine').dataset.placed = String(!!mine);
  $('betRespect').textContent = p.respect;
  $('betStreak').textContent = p.streak;
  $('betBest').textContent = p.bestStreak;
  const others = store.pending.filter((b) => b !== mine && !(mine && b.cityId === mine.cityId && b.date === mine.date));
  const lines = [
    ...others.map((b) => fixDegrees(`${t('bet.pending')}: ${b.city} · ${b.guess}° · ${b.date.slice(8, 10)}/${b.date.slice(5, 7)}`)),
    ...store.history.slice(0, 3).map((h) => betHistoryLine(h, lang)),
  ];
  $('betHistory').replaceChildren(...lines.map((l) => { const li = document.createElement('li'); li.textContent = l; return li; }));
  $('betHistoryWrap').hidden = lines.length === 0;
}

function place() {
  if (!current) return;
  const guess = Number($('betRange').value);
  const { view, weather } = current;
  const bet = {
    cityId: weather.id,
    city: view.city,
    lat: weather.coord?.lat,
    lon: weather.coord?.lon,
    tz: weather.timezone ?? 0,
    date: dayAfter(view.dateKey),
    guess,
    placedAt: Date.now(),
  };
  const store = loadStore();
  store.pending = [...store.pending.filter((b) => !(b.cityId === bet.cityId && b.date === bet.date)), bet];
  saveStore(store);
  $('betMachine').classList.add('stamped');
  setTimeout(() => $('betMachine').classList.remove('stamped'), 700);
  renderBet();
}

/** Wire up the machine. Call once. */
export function initBet() {
  $('betRange').addEventListener('input', () => setValue(Number($('betRange').value)));
  $('betMinus').addEventListener('click', () => setValue(Number($('betRange').value) - 1));
  $('betPlus').addEventListener('click', () => setValue(Number($('betRange').value) + 1));
  $('betPlace').addEventListener('click', place);
  document.addEventListener('ww:progress', renderBet);
}

/** New weather for the current city. */
export function updateBet(view, weather) {
  const changed = !current || current.weather.id !== weather.id;
  current = { view, weather };
  if (changed) {
    const mine = myPending();
    setValue(mine ? mine.guess : view.temp);
  }
  renderBet();
}

/**
 * Settle the bets whose day has come. Returns Uncle Isobar's call script, or null.
 * Bets for other cities fetch that city's weather; a bet whose day has passed without a visit expires.
 */
let settling = false;
export async function settleBets(bundle, lang) {
  if (settling) return null; // one settlement at a time
  const store = loadStore();
  if (!store.pending.length) return null;
  settling = true;
  try {
    return await settle(store, bundle, lang);
  } finally {
    settling = false;
  }
}

async function settle(store, bundle, lang) {
  const { due, expired, waiting } = sortBets(store.pending, (tz) => localDate(tz));
  const settled = [];
  const texts = [];

  for (const bet of expired) settled.push({ ...bet, expired: true, points: 0, hit: false });
  for (const bet of due) {
    let weather = null;
    let forecast = null;
    if (bundle && bundle.weather.id === bet.cityId) {
      ({ weather, forecast } = bundle);
    } else {
      try {
        [weather, forecast] = await Promise.all([
          getCurrentWeather({ lat: bet.lat, lon: bet.lon }, lang),
          getForecast({ lat: bet.lat, lon: bet.lon }, lang).catch(() => null),
        ]);
      } catch {
        waiting.push(bet); // try again next time
        continue;
      }
    }
    const today = forecast ? summarizeForecast(forecast).today : null;
    const actual = todaysHigh(weather.main?.temp ?? 0, today);
    const result = scoreBet(bet.guess, actual);
    settled.push({ ...bet, actual, points: result.points, grade: result.grade, hit: result.hit });
    texts.push(betCallText(bet, actual, result, lang));
  }

  // Oldest first, so the streak is counted in order
  settled.sort((a, b) => a.date.localeCompare(b.date)).forEach((s) => recordBet(s.date, s.hit, s.points));
  store.pending = waiting;
  store.history = [...settled.reverse(), ...store.history].slice(0, 10);
  saveStore(store);
  renderBet();
  return texts.length ? texts.join(' ') : null;
}
