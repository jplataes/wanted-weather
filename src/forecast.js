// forecast.js — turns the 5-day / 3-hour forecast into one summary per day (pure logic, no DOM).
import { kindFromCode, wantedLevel } from './weather.js';

const SEVERITY = { storm: 6, snow: 5, rain: 4, wind: 3, fog: 2, clouds: 1, clear: 0 };

/** Local calendar date (YYYY-MM-DD) and hour at the city for a unix time. */
function local(dt, tz) {
  const d = new Date((dt + tz) * 1000);
  return { key: d.toISOString().slice(0, 10), hour: d.getUTCHours() };
}

const pad = (n) => String(n).padStart(2, '0');

/** Summary of one day from its 3-hour slots. */
export function summarizeDay(key, slots, tz) {
  let min = Infinity, max = -Infinity, minFeels = Infinity, maxFeels = -Infinity;
  let pop = 0, rainMm = 0, windKmh = 0, level = 1, extreme = null;
  let worst = null, worstScore = -1;
  let rainStart = null;

  for (const s of slots) {
    const temp = s.main?.temp ?? 0;
    min = Math.min(min, s.main?.temp_min ?? temp);
    max = Math.max(max, s.main?.temp_max ?? temp);
    minFeels = Math.min(minFeels, s.main?.feels_like ?? temp);
    maxFeels = Math.max(maxFeels, s.main?.feels_like ?? temp);
    pop = Math.max(pop, s.pop ?? 0);
    rainMm += (s.rain?.['3h'] ?? 0) + (s.snow?.['3h'] ?? 0);
    windKmh = Math.max(windKmh, Math.max(s.wind?.speed ?? 0, (s.wind?.gust ?? 0) * 0.8) * 3.6);

    const w = wantedLevel(s);
    if (w.level > level) { level = w.level; extreme = w.extreme; }

    const id = s.weather?.[0]?.id ?? 800;
    const kind = kindFromCode(id);
    const hour = local(s.dt, tz).hour;
    // Rank slots: worst weather first; on ties prefer daytime around 13:00
    const score = SEVERITY[kind] * 100 + w.level * 10 - Math.abs(hour - 13) / 10;
    if (score > worstScore) { worstScore = score; worst = s; }
    if (rainStart === null && (kind === 'rain' || kind === 'storm' || kind === 'snow' || (s.pop ?? 0) >= 0.5)) {
      rainStart = `${pad(hour)}:00`;
    }
  }

  const rep = worst ?? slots[0];
  const repId = rep?.weather?.[0]?.id ?? 800;
  return {
    key,
    min: Math.round(min),
    max: Math.round(max),
    minFeels: Math.round(minFeels),
    maxFeels: Math.round(maxFeels),
    pop: Math.round(pop * 100),
    rainMm: Math.round(rainMm * 10) / 10,
    windKmh: Math.round(windKmh),
    level,
    extreme,
    kind: kindFromCode(repId),
    description: rep?.weather?.[0]?.description ?? '',
    rainStart,
    slots: slots.length,
    hasMidday: slots.some((s) => { const h = local(s.dt, tz).hour; return h >= 11 && h <= 16; }),
  };
}

/**
 * @param {object} forecast OpenWeatherMap /forecast response
 * @param {number} nowSec current unix time in seconds
 * @returns {{today: object|null, days: object[]}} today's remaining hours, and the next days
 */
export function summarizeForecast(forecast, nowSec = Math.floor(Date.now() / 1000)) {
  const tz = forecast?.city?.timezone ?? 0;
  const groups = new Map();
  for (const slot of forecast?.list ?? []) {
    if (slot.dt + 3 * 3600 <= nowSec) continue; // already over
    const { key } = local(slot.dt, tz);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(slot);
  }
  const todayKey = local(nowSec, tz).key;
  const days = [...groups.entries()].map(([key, slots]) => summarizeDay(key, slots, tz));
  const today = days.find((d) => d.key === todayKey) ?? null;
  // Only full-enough days: a day cut off at dawn would show misleading highs and lows
  const upcoming = days.filter((d) => d.key !== todayKey && d.hasMidday).slice(0, 5);
  return { today, days: upcoming };
}
