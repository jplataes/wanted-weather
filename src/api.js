// api.js — the only module that talks to the network.
// In production every request goes to our Cloudflare Worker, which adds the API key on the server.
// In local development (npm run dev) it can call OpenWeatherMap directly with the key from .env.

const PROXY_URL = (import.meta.env.VITE_PROXY_URL || '').replace(/\/$/, '');
const OWM_BASE = 'https://api.openweathermap.org/data/2.5';
const TIMEOUT_MS = 10000;

/** An error with a "kind" the interface knows how to explain. */
export class ApiError extends Error {
  /**
   * @param {'notFound'|'badKey'|'limit'|'offline'|'timeout'|'down'|'config'|'unknown'} kind
   * @param {number} [status] HTTP status code, when there was a response
   */
  constructor(kind, status) {
    super(kind);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

/** Turn an HTTP status code into an error kind. */
export function kindFromStatus(status) {
  if (status === 404 || status === 400) return 'notFound'; // 400 = "nothing to geocode" (bad city text)
  if (status === 401) return 'badKey';
  if (status === 429) return 'limit';
  if (status >= 500) return 'down';
  return 'unknown';
}

/**
 * Build the query parameters for a place: a city name or coordinates.
 * @param {{city?: string, lat?: number, lon?: number}} place
 * @param {'es'|'en'} lang
 */
function placeParams(place, lang) {
  const params = new URLSearchParams();
  if (place.city) {
    params.set('q', place.city.trim());
  } else {
    params.set('lat', String(place.lat));
    params.set('lon', String(place.lon));
  }
  params.set('lang', lang);
  return params;
}

/** Build the full URL for an endpoint ("weather" or "forecast"). */
function buildUrl(endpoint, params) {
  if (PROXY_URL) {
    return `${PROXY_URL}/api/${endpoint}?${params}`;
  }
  if (import.meta.env.DEV) {
    // Development only: this branch is removed from the production build.
    const key = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!key) throw new ApiError('config');
    params.set('units', 'metric');
    params.set('appid', key);
    return `${OWM_BASE}/${endpoint}?${params}`;
  }
  throw new ApiError('config');
}

/** GET a JSON resource with a timeout and translate every failure into an ApiError. */
async function request(endpoint, place, lang) {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new ApiError('offline');
  }
  const url = buildUrl(endpoint, placeParams(place, lang));
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, { method: 'GET', signal: controller.signal, headers: { Accept: 'application/json' } });
  } catch (error) {
    throw new ApiError(error.name === 'AbortError' ? 'timeout' : 'offline');
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    throw new ApiError(kindFromStatus(response.status), response.status);
  }
  try {
    return await response.json();
  } catch {
    throw new ApiError('down', response.status);
  }
}

/** Current weather for a city or coordinates. */
export function getCurrentWeather(place, lang) {
  return request('weather', place, lang);
}

/** 5-day forecast in 3-hour steps for a city or coordinates. */
export function getForecast(place, lang) {
  return request('forecast', place, lang);
}
