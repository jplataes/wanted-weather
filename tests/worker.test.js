// Tests for the Cloudflare Worker proxy, run with Node's built-in test runner (npm test).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker, { cleanParams } from '../worker/src/index.js';

const env = { OPENWEATHER_API_KEY: 'test-key', ALLOWED_ORIGINS: 'https://jplataes.github.io,http://localhost:5173' };
const ctx = { waitUntil() {} };
const ORIGIN = 'https://jplataes.github.io';

function call(path, { origin = ORIGIN, method = 'GET' } = {}) {
  const headers = origin ? { Origin: origin } : {};
  return worker.fetch(new Request(`https://proxy.example${path}`, { method, headers }), env, ctx);
}

function mockUpstream(status, body) {
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(String(url));
    return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
  };
  return calls;
}

test('cleanParams keeps only allowed parameters', () => {
  const p = cleanParams(new URLSearchParams('q=Madrid&lang=en&appid=hack&units=imperial'));
  assert.equal(p.get('q'), 'Madrid');
  assert.equal(p.get('lang'), 'en');
  assert.equal(p.get('units'), 'metric');
  assert.equal(p.get('appid'), null);
});

test('cleanParams rounds coordinates and rejects bad ones', () => {
  assert.equal(cleanParams(new URLSearchParams('lat=40.41678&lon=-3.70379')).get('lat'), '40.42');
  assert.equal(cleanParams(new URLSearchParams('lat=200&lon=0')), null);
  assert.equal(cleanParams(new URLSearchParams('')), null);
});

test('rejects unknown origins', async () => {
  const res = await call('/api/weather?q=Madrid', { origin: 'https://evil.example' });
  assert.equal(res.status, 403);
});

test('answers the CORS preflight', async () => {
  const res = await call('/api/weather?q=Madrid', { method: 'OPTIONS' });
  assert.equal(res.status, 204);
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), ORIGIN);
});

test('only GET is allowed', async () => {
  const res = await call('/api/weather?q=Madrid', { method: 'POST' });
  assert.equal(res.status, 405);
});

test('unknown endpoint is 404 and missing place is 400', async () => {
  assert.equal((await call('/api/other?q=Madrid')).status, 404);
  assert.equal((await call('/api/weather')).status, 400);
});

test('adds the key upstream and never returns it', async () => {
  const calls = mockUpstream(200, { name: 'Madrid' });
  const res = await call('/api/weather?q=Madrid&lang=es');
  assert.equal(res.status, 200);
  assert.match(calls[0], /appid=test-key/);
  assert.match(calls[0], /\/weather\?/);
  const text = await res.text();
  assert.ok(!text.includes('test-key'));
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), ORIGIN);
});

test('passes upstream error status codes through', async () => {
  for (const status of [401, 404, 429, 503]) {
    mockUpstream(status, { cod: status });
    const res = await call('/api/forecast?q=Nowhere');
    assert.equal(res.status, status);
  }
});
