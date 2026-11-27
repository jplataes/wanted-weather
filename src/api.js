// api.js — the only module that talks to the network.
// In production every request goes to our Cloudflare Worker, which adds the API key on the server.
// In local development (npm run dev) it can call OpenWeatherMap directly with the key from .env.

const PROXY_URL = (import.meta.env.VITE_PROXY_URL || '').replace(/\/$/, '');
const OWM = 'https://api.openweathermap.org';
const TIMEOUT_MS = 10000;

// Our endpoint name -> OpenWeatherMap path
const PATHS = {
  weather: '/data/2.5/weather', // current weather
  forecast: '/data/2.5/forecast', // 5 days, every 3 hours
  geocode: '/geo/1.0/direct', // city name -> coordinates and local names
  reverse: '/geo/1.0/reverse', // coordinates -> place name and local names
};

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

/** Build the full URL for one of our endpoints. */
function buildUrl(endpoint, params) {
  if (PROXY_URL) {
    return `${PROXY_URL}/api/${endpoint}?${params}`;
  }
  if (import.meta.env.DEV) {
    // Development only: this branch is removed from the production build.
    const key = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!key) throw new ApiError('config');
    if (endpoint === 'weather' || endpoint === 'forecast') params.set('units', 'metric');
    else params.set('limit', endpoint === 'geocode' ? '5' : '1');
    params.set('appid', key);
    return `${OWM}${PATHS[endpoint]}?${params}`;
  }
  throw new ApiError('config');
}

/** GET a JSON resource with a timeout and translate every failure into an ApiError. */
async function request(endpoint, params) {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new ApiError('offline');
  }
  const url = buildUrl(endpoint, params);
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

const coordParams = ({ lat, lon }, lang) => {
  const p = new URLSearchParams({ lat: String(lat), lon: String(lon) });
  if (lang) p.set('lang', lang);
  return p;
};

/** Current weather at some coordinates. */
export function getCurrentWeather(coords, lang) {
  return request('weather', coordParams(coords, lang));
}

/** 5-day forecast in 3-hour steps at some coordinates. */
export function getForecast(coords, lang) {
  return request('forecast', coordParams(coords, lang));
}

/** Find cities by name: up to 5 matches, best first. Throws "notFound" if there are none. */
export async function findCities(name) {
  const results = await request('geocode', new URLSearchParams({ q: name.trim() }));
  if (!Array.isArray(results) || results.length === 0) throw new ApiError('notFound', 404);
  return results;
}

/** Name of the place at some coordinates (null if unknown). */
export async function findPlaceName(coords) {
  const results = await request('reverse', coordParams(coords));
  return Array.isArray(results) && results.length ? results[0] : null;
}
