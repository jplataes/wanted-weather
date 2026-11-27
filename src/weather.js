// weather.js — pure game logic on top of the API data (no DOM, no network).
// It decides the weather kind, the scene, the 1–5 star "wanted level" and formats values.

/**
 * Weather kind from an OpenWeatherMap condition code.
 * https://openweathermap.org/weather-conditions
 */
export function kindFromCode(id) {
  if (id >= 200 && id < 300) return 'storm';
  if (id >= 300 && id < 600) return 'rain';
  if (id >= 600 && id < 700) return 'snow';
  if (id === 771 || id === 781) return 'wind'; // squalls, tornado
  if (id >= 700 && id < 800) return 'fog';
  if (id === 800) return 'clear';
  return 'clouds';
}

/** True when the reading was taken before sunrise or after sunset. */
export function isNight(data) {
  const { sunrise, sunset } = data.sys || {};
  if (!sunrise || !sunset) return false;
  return data.dt < sunrise || data.dt > sunset;
}

/**
 * Which illustrated scene to show. Bad weather wins; then strong wind; then night; then clouds or sun.
 * @returns {'sun'|'clouds'|'rain'|'storm'|'snow'|'fog'|'wind'|'night'}
 */
export function sceneFor(kind, night, windKmh = 0) {
  if (kind === 'storm' || kind === 'rain' || kind === 'snow' || kind === 'fog' || kind === 'wind') return kind;
  if (windKmh >= 40) return 'wind';
  if (night) return 'night';
  return kind === 'clouds' ? 'clouds' : 'sun';
}

/**
 * Screen effect over the whole interface, from the real conditions.
 * @returns {'storm'|'rain'|'snow'|'fog'|'wind'|'heat'|'cold'|'none'}
 */
export function screenFxFor(kind, feels, windKmh) {
  if (kind === 'storm' || kind === 'rain' || kind === 'snow' || kind === 'fog') return kind;
  if (feels >= 30) return 'heat';
  if (feels <= 3) return 'cold';
  if (kind === 'wind' || windKmh >= 30) return 'wind';
  return 'none';
}

/** Place name in the app language, from a geocoding result, with fallbacks. */
export function localName(place, lang, fallback = '') {
  if (!place) return fallback;
  const names = place.local_names || {};
  return names[lang] || place.name || fallback;
}

const RAIN_LEVEL = { 300: 2, 301: 2, 302: 2, 310: 2, 311: 2, 312: 2, 313: 2, 314: 3, 321: 2,
  500: 2, 501: 3, 502: 4, 503: 5, 504: 5, 511: 4, 520: 2, 521: 3, 522: 4, 531: 3 };
const SNOW_LEVEL = { 600: 2, 601: 3, 602: 4, 611: 3, 612: 3, 613: 3, 615: 3, 616: 3, 620: 3, 621: 3, 622: 4 };
const STORM_LEVEL = { 200: 4, 201: 4, 202: 5, 210: 3, 211: 4, 212: 5, 221: 5, 230: 4, 231: 4, 232: 5 };

function stepUp(value, steps) {
  // steps: [[threshold, level], ...] ordered from highest level to lowest
  for (const [threshold, level] of steps) if (value >= threshold) return level;
  return 1;
}

/**
 * How rough the day is, from 1 to 5 stars, and which factor is to blame.
 * @returns {{level: number, factors: Record<string, number>, extreme: null|'rain'|'heat'|'cold'|'wind'|'storm'}}
 */
export function wantedLevel(data) {
  const id = data.weather?.[0]?.id ?? 800;
  const feels = data.main?.feels_like ?? data.main?.temp ?? 15;
  const windKmh = Math.max(data.wind?.speed ?? 0, (data.wind?.gust ?? 0) * 0.8) * 3.6;

  const factors = {
    storm: STORM_LEVEL[id] ?? (id === 781 ? 5 : id === 771 ? 4 : 1),
    rain: Math.max(RAIN_LEVEL[id] ?? 1, SNOW_LEVEL[id] ?? 1),
    heat: stepUp(feels, [[40, 5], [35, 4], [30, 3], [27, 2]]),
    cold: stepUp(-feels, [[10, 5], [5, 4], [0, 3], [-5, 2]]),
    wind: stepUp(windKmh, [[75, 5], [60, 4], [45, 3], [30, 2]]),
    fog: id >= 700 && id < 771 ? 2 : 1,
  };
  // Snow counts as cold for the alert banner
  if (SNOW_LEVEL[id]) {
    factors.cold = Math.max(factors.cold, SNOW_LEVEL[id]);
    factors.rain = 1;
  }

  const level = Math.max(1, ...Object.values(factors));
  let extreme = null;
  if (level >= 4) {
    // Ties go to the most dramatic factor
    extreme = ['storm', 'rain', 'wind', 'heat', 'cold'].find((k) => factors[k] === level) ?? null;
  }
  return { level, factors, extreme };
}

/** Local time at the city, using the offset (in seconds) that the API sends. */
export function cityTime(unixSeconds, tzOffsetSeconds, lang) {
  const date = new Date((unixSeconds + tzOffsetSeconds) * 1000);
  return date.toLocaleTimeString(lang === 'en' ? 'en-GB' : 'es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
}

/** Compass sector (0–7: N, NE, E, SE, S, SW, W, NW) for a wind direction in degrees. */
export function compassIndex(deg) {
  return Math.round((((deg % 360) + 360) % 360) / 45) % 8;
}

/** A short code for "today at the city", used to rotate the copy once a day. */
export function cityDay(data) {
  const d = new Date((data.dt + (data.timezone ?? 0)) * 1000);
  return d.toISOString().slice(0, 10);
}

/** Everything the interface needs, already computed. */
export function buildView(data, lang, place = null) {
  const weather = data.weather?.[0] ?? { id: 800, description: '' };
  const kind = kindFromCode(weather.id);
  const night = isNight(data);
  const wanted = wantedLevel(data);
  const tz = data.timezone ?? 0;
  const description = weather.description || '';
  return {
    id: data.id,
    city: localName(place, lang, data.name),
    country: data.sys?.country ?? '',
    lat: data.coord?.lat ?? 0,
    lon: data.coord?.lon ?? 0,
    temp: Math.round(data.main?.temp ?? 0),
    feels: Math.round(data.main?.feels_like ?? 0),
    humidity: Math.round(data.main?.humidity ?? 0),
    windKmh: Math.round((data.wind?.speed ?? 0) * 3.6),
    gustKmh: Math.round((data.wind?.gust ?? 0) * 3.6),
    windDeg: data.wind?.deg ?? 0,
    windCompass: compassIndex(data.wind?.deg ?? 0),
    sunriseUnix: data.sys?.sunrise ?? 0,
    sunsetUnix: data.sys?.sunset ?? 0,
    sunrise: data.sys?.sunrise ? cityTime(data.sys.sunrise, tz, lang) : '–',
    sunset: data.sys?.sunset ? cityTime(data.sys.sunset, tz, lang) : '–',
    localTime: cityTime(Math.floor(Date.now() / 1000), tz, lang),
    description: description.charAt(0).toUpperCase() + description.slice(1),
    kind,
    night,
    scene: sceneFor(kind, night, Math.max(data.wind?.speed ?? 0, (data.wind?.gust ?? 0) * 0.8) * 3.6),
    fx: screenFxFor(kind, data.main?.feels_like ?? 15, Math.max(data.wind?.speed ?? 0, (data.wind?.gust ?? 0) * 0.8) * 3.6),
    level: wanted.level,
    extreme: wanted.extreme,
    seed: `${data.id}-${cityDay(data)}`,
  };
}
