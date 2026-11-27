// Cloudflare Worker: a tiny proxy between the app and OpenWeatherMap.
// The API key lives only here, as a secret (OPENWEATHER_API_KEY). The browser never sees it.
//
// Endpoints (GET only):
//   /api/weather?lat=40.4&lon=-3.7&lang=es    current weather (or ?q=Madrid)
//   /api/forecast?lat=40.4&lon=-3.7&lang=en   5-day forecast, 3-hour steps (or ?q=Madrid)
//   /api/geocode?q=Sevilla                    city name -> coordinates and local names
//   /api/reverse?lat=37.39&lon=-5.98          coordinates -> place name and local names

const UPSTREAM = 'https://api.openweathermap.org';
const ROUTES = {
  '/api/weather': { path: '/data/2.5/weather', kind: 'weather' },
  '/api/forecast': { path: '/data/2.5/forecast', kind: 'weather' },
  '/api/geocode': { path: '/geo/1.0/direct', kind: 'geocode' },
  '/api/reverse': { path: '/geo/1.0/reverse', kind: 'reverse' },
};
const CACHE_SECONDS = 600; // same answer for 10 minutes: protects the free-tier quota

function json(body, status, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...extraHeaders },
  });
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Accept',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function coords(searchParams, out) {
  const lat = Number(searchParams.get('lat'));
  const lon = Number(searchParams.get('lon'));
  if (!searchParams.has('lat') || !searchParams.has('lon') || !Number.isFinite(lat) || !Number.isFinite(lon)) return false;
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return false;
  // Round to ~1 km: better cache hits and a less precise location sent upstream
  out.set('lat', lat.toFixed(2));
  out.set('lon', lon.toFixed(2));
  return true;
}

/**
 * Keep only the parameters we allow, validated. Returns null if the request is invalid.
 * @param {URLSearchParams} searchParams
 * @param {'weather'|'geocode'|'reverse'} kind
 */
export function cleanParams(searchParams, kind = 'weather') {
  const out = new URLSearchParams();
  const q = (searchParams.get('q') || '').trim();
  if (q.length > 100) return null;

  if (kind === 'geocode') {
    if (!q) return null;
    out.set('q', q);
    out.set('limit', '1');
    return out;
  }
  if (kind === 'reverse') {
    if (!coords(searchParams, out)) return null;
    out.set('limit', '1');
    return out;
  }
  if (q) out.set('q', q);
  else if (!coords(searchParams, out)) return null;
  out.set('lang', searchParams.get('lang') === 'en' ? 'en' : 'es');
  out.set('units', 'metric');
  return out;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);

    // Only our own website may use this proxy
    if (!allowed.includes(origin)) {
      return json({ error: 'origin_not_allowed' }, 403);
    }
    const cors = corsHeaders(origin);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'GET') return json({ error: 'method_not_allowed' }, 405, { ...cors, Allow: 'GET, OPTIONS' });

    const route = ROUTES[url.pathname];
    if (!route) return json({ error: 'not_found' }, 404, cors);

    const params = cleanParams(url.searchParams, route.kind);
    if (!params) return json({ error: 'bad_request', message: 'Missing or invalid place parameters.' }, 400, cors);

    if (!env.OPENWEATHER_API_KEY) return json({ error: 'server_misconfigured' }, 500, cors);

    // Cache by route + cleaned parameters (never by the key)
    const cacheKey = new Request(`https://cache.wanted-weather${route.path}?${params}`);
    const cache = typeof caches !== 'undefined' ? caches.default : null;
    if (cache) {
      const hit = await cache.match(cacheKey);
      if (hit) {
        const body = await hit.text();
        return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Cache': 'HIT', ...cors } });
      }
    }

    const upstreamParams = new URLSearchParams(params);
    upstreamParams.set('appid', env.OPENWEATHER_API_KEY);
    let upstream;
    try {
      upstream = await fetch(`${UPSTREAM}${route.path}?${upstreamParams}`, { headers: { Accept: 'application/json' } });
    } catch {
      return json({ error: 'upstream_unreachable' }, 502, cors);
    }

    const body = await upstream.text();
    const headers = { 'Content-Type': 'application/json; charset=utf-8', 'X-Cache': 'MISS', ...cors };
    if (upstream.ok) {
      headers['Cache-Control'] = `public, max-age=${CACHE_SECONDS}`;
      if (cache) {
        ctx.waitUntil(cache.put(cacheKey, new Response(body, { headers: { 'Content-Type': 'application/json', 'Cache-Control': `public, max-age=${CACHE_SECONDS}` } })));
      }
    }
    // Pass the real status code through (404 city not found, 401 bad key, 429 limit...)
    return new Response(body, { status: upstream.status, headers });
  },
};
