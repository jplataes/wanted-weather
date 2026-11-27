// Tests for The Bet and the arcade game logic.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scoreBet, todaysHigh, sortBets, betCallText, betHistoryLine } from '../src/bet.js';
import { dayAfter, localDate } from '../src/progress.js';

test('points by distance; a hit is within 2 degrees', () => {
  assert.deepEqual(scoreBet(18, 18), { diff: 0, grade: 'exact', points: 100, hit: true });
  assert.equal(scoreBet(18, 19.4).points, 60);
  assert.equal(scoreBet(18, 20).grade, 'decent');
  assert.equal(scoreBet(18, 21).hit, false);
  assert.equal(scoreBet(10, 30).points, 0);
});

test("today's high uses the current reading and the forecast", () => {
  assert.equal(todaysHigh(12.6, { max: 17 }), 17);
  assert.equal(todaysHigh(19.2, { max: 17 }), 19);
  assert.equal(todaysHigh(12.4, null), 12);
});

test('pending bets: waiting, due today, or expired', () => {
  const bets = [{ date: '2026-11-28', tz: 0 }, { date: '2026-11-27', tz: 0 }, { date: '2026-11-25', tz: 0 }];
  const r = sortBets(bets, () => '2026-11-27');
  assert.equal(r.waiting.length, 1);
  assert.equal(r.due.length, 1);
  assert.equal(r.expired.length, 1);
});

test('dates', () => {
  assert.equal(dayAfter('2026-12-31'), '2027-01-01');
  assert.equal(localDate(3600, Date.UTC(2026, 10, 27, 23, 30)), '2026-11-28');
});

test("Uncle Isobar's result call", () => {
  const bet = { guess: 17, city: 'Madrid', date: '2026-11-28' };
  const es = betCallText(bet, 18, scoreBet(17, 18), 'es');
  assert.ok(es.includes('17 grados') && es.includes('18') && es.includes('60 puntos'));
  const en = betCallText(bet, 30, scoreBet(17, 30), 'en');
  assert.ok(en.includes('No respect for you today.'));
  assert.ok(betCallText({ ...bet, guess: 1 }, 1, scoreBet(1, 1), 'es').includes('1 grado '));
  assert.match(betHistoryLine({ city: 'Madrid', date: '2026-11-28', guess: 17, actual: 18, points: 60 }, 'es'), /28\/11.*17°.*18° · \+60/);
});
