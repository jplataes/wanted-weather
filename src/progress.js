// progress.js — the player's progress, saved on this device: respect points, bet streaks and arcade records.
import { local } from './storage.js';

const KEY = 'ww.progress';
const EMPTY = { respect: 0, streak: 0, bestStreak: 0, lastHitDate: null, bestDodge: 0, games: 0 };

export function getProgress() {
  return { ...EMPTY, ...(local.get(KEY, {}) || {}) };
}

function save(p) {
  local.set(KEY, p);
  document.dispatchEvent(new CustomEvent('ww:progress', { detail: p }));
  return p;
}

/** Add respect points (never below zero). */
export function addRespect(points) {
  const p = getProgress();
  p.respect = Math.max(0, p.respect + Math.round(points));
  return save(p);
}

/** Record a resolved bet: a hit on consecutive days grows the streak, a miss resets it. */
export function recordBet(date, hit, points) {
  const p = getProgress();
  p.respect = Math.max(0, p.respect + points);
  if (hit) {
    p.streak = p.lastHitDate && dayAfter(p.lastHitDate) === date ? p.streak + 1 : 1;
    p.lastHitDate = date;
    p.bestStreak = Math.max(p.bestStreak, p.streak);
  } else {
    p.streak = 0;
  }
  return save(p);
}

/** Record an arcade game. Returns { progress, record } where record is true for a new best score. */
export function recordDodge(score, respect) {
  const p = getProgress();
  const record = score > p.bestDodge;
  p.bestDodge = Math.max(p.bestDodge, score);
  p.games += 1;
  p.respect += respect;
  return { progress: save(p), record };
}

/** "2026-11-27" -> "2026-11-28" */
export function dayAfter(date) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

/** Local calendar date for a city (timezone offset in seconds) at a given moment. */
export function localDate(tzSeconds, nowMs = Date.now()) {
  return new Date(nowMs + tzSeconds * 1000).toISOString().slice(0, 10);
}
