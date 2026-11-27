// Replaces the weather proxy with saved real responses (tests/e2e/fixtures).
// Times are shifted to "now" so the forecast is always in the future and day/night stay consistent.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dir = fileURLToPath(new URL('./fixtures/', import.meta.url));
const load = (name) => JSON.parse(readFileSync(dir + name, 'utf8'));

const PLACES = [
  { lat: 40.42, lon: -3.7, weather: 'weather-madrid.json', forecast: 'forecast-madrid.json' },
  { lat: -33.45, lon: -70.65, weather: 'weather-santiago-cl.json', forecast: 'forecast-santiago-cl.json' },
  { lat: 64.15, lon: -21.94, weather: 'weather-reykjavik.json', forecast: 'forecast-madrid.json' },
];
const GEOCODE = { madrid: 'geocode-madrid.json', santiago: 'geocode-santiago.json', reykjavik: 'geocode-reykjavik.json', reikiavik: 'geocode-reykjavik.json' };

function nearest(lat, lon) {
  return PLACES.reduce((best, p) => (Math.hypot(p.lat - lat, p.lon - lon) < Math.hypot(best.lat - lat, best.lon - lon) ? p : best));
}

/** Shift every timestamp so the reading is "now". */
function shiftWeather(w) {
  const delta = Math.floor(Date.now() / 1000) - w.dt;
  return { ...w, dt: w.dt + delta, sys: { ...w.sys, sunrise: w.sys.sunrise + delta, sunset: w.sys.sunset + delta } };
}
function shiftForecast(f) {
  const delta = Math.floor(Date.now() / 1000) - f.list[0].dt + 1800;
  return { ...f, list: f.list.map((s) => ({ ...s, dt: s.dt + delta })) };
}

/**
 * Install the fake proxy on a page.
 * @param {import('@playwright/test').Page} page
 * @param {{status?: Record<string, number>}} [options] force an HTTP status per endpoint, e.g. {weather: 429}
 */
export async function mockApi(page, options = {}) {
  await page.route('**/proxy.test/api/**', async (route) => {
    const url = new URL(route.request().url());
    const endpoint = url.pathname.split('/').pop();
    const forced = options.status?.[endpoint];
    if (forced) return route.fulfill({ status: forced, contentType: 'application/json', body: JSON.stringify({ cod: forced }) });
    const json = (body) => route.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(body) });
    const lat = Number(url.searchParams.get('lat'));
    const lon = Number(url.searchParams.get('lon'));
    if (endpoint === 'geocode') {
      const file = GEOCODE[(url.searchParams.get('q') || '').toLowerCase()];
      return json(file ? load(file) : []);
    }
    if (endpoint === 'reverse') return json(load('reverse-madrid.json'));
    const place = nearest(lat, lon);
    if (endpoint === 'weather') return json(shiftWeather(load(place.weather)));
    if (endpoint === 'forecast') return json(shiftForecast(load(place.forecast)));
    return route.fulfill({ status: 404, body: '{}' });
  });
}
