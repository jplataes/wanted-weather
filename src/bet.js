// bet.js — The Bet: guess tomorrow's high, checked the next day (pure logic + copy).
import { fixDegrees, pickBySeed } from './copy.js';

/** Points by how close the guess was. A "hit" (2 degrees or closer) keeps the streak alive. */
export function scoreBet(guess, actual) {
  const diff = Math.abs(Math.round(guess) - Math.round(actual));
  const grade = diff === 0 ? 'exact' : diff === 1 ? 'close' : diff === 2 ? 'decent' : diff === 3 ? 'meh' : 'miss';
  const points = { exact: 100, close: 60, decent: 30, meh: 10, miss: 0 }[grade];
  return { diff, grade, points, hit: diff <= 2 };
}

/**
 * Today's high for checking a bet: the highest of the current reading and today's forecast hours.
 * @param {number} currentTemp
 * @param {object|null} today day summary from forecast.js (or null)
 */
export function todaysHigh(currentTemp, today) {
  const values = [Math.round(currentTemp)];
  if (today && Number.isFinite(today.max)) values.push(today.max);
  return Math.max(...values);
}

/**
 * Which pending bets can be settled now.
 * @param {object[]} pending bets { date, tz, ... }
 * @param {(tz:number)=>string} dateFor local date of a city now
 * @returns {{due: object[], expired: object[], waiting: object[]}}
 */
export function sortBets(pending, dateFor) {
  const due = [];
  const expired = [];
  const waiting = [];
  for (const bet of pending) {
    const today = dateFor(bet.tz);
    if (today < bet.date) waiting.push(bet);
    else if (today === bet.date) due.push(bet);
    else expired.push(bet);
  }
  return { due, expired, waiting };
}

const COMMENT = {
  exact: { es: 'Clavada. Ni yo lo habría hecho mejor, y mira que de esto sé un rato.', en: "Spot on. Even I couldn't have done better, and I know a thing or two about this." },
  close: { es: 'A un grado. Casi me quitas el puesto, chaval.', en: 'One degree off. You nearly took my job there, kid.' },
  decent: { es: 'A dos grados. No está mal, pero yo lo vi venir antes.', en: 'Two degrees off. Not bad, but I saw it coming first.' },
  meh: { es: 'A tres grados. Se nota que no miras la rodilla como yo.', en: "Three degrees off. Clearly you don't read your knee like I do." },
  miss: { es: 'Ni de lejos. Tranquilo, mañana te enseño un par de truquillos.', en: "Not even close. Don't worry, I'll teach you a few tricks tomorrow." },
};

const OPEN = {
  es: ['Eh, que tengo el resultado de tu apuesta.', 'Oye, lo de la apuesta de ayer: ya está aquí el veredicto.'],
  en: ["Hey, I've got your bet result.", "Listen, about yesterday's bet: the verdict's in."],
};

/** Uncle Isobar's phone script for a settled bet. */
export function betCallText(bet, actual, result, lang) {
  const facts = lang === 'en'
    ? `You said ${bet.guess} degrees for today in ${bet.city} and today's high is ${actual}.`
    : `Dijiste ${bet.guess} grados para hoy en ${bet.city} y la máxima del día es de ${actual}.`;
  const reward = result.points > 0
    ? (lang === 'en' ? `You get ${result.points} respect points.` : `Te llevas ${result.points} puntos de respeto.`)
    : (lang === 'en' ? 'No respect for you today.' : 'Hoy no hay respeto para ti.');
  return fixDegrees(`${pickBySeed(OPEN[lang], bet.date)} ${facts} ${COMMENT[result.grade][lang]} ${reward}`);
}

/** Short line for the bet history list. */
export function betHistoryLine(entry, lang) {
  const tail = entry.expired
    ? (lang === 'en' ? 'expired' : 'caducada')
    : `${entry.actual}° · +${entry.points}`;
  return fixDegrees(`${entry.city} · ${entry.date.slice(8, 10)}/${entry.date.slice(5, 7)} · ${lang === 'en' ? 'you said' : 'dijiste'} ${entry.guess}° → ${tail}`);
}
