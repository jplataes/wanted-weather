// duel.js — City Duel: your city's weather against a rival's, as a five-round match (pure logic + copy).
// Every number in the commentary comes from the real data of both cities.
import { kindFromCode } from './weather.js';
import { pickBySeed, fixDegrees } from './copy.js';

/** Sky quality: higher is better. */
export function skyScore(id) {
  const kind = kindFromCode(id);
  if (kind === 'clear') return 5;
  if (id === 801 || id === 802) return 4;
  if (kind === 'clouds') return 3;
  if (kind === 'fog' || kind === 'wind') return 2;
  if (kind === 'rain' || kind === 'snow') return 1;
  return 0; // storm
}

const effWind = (d) => Math.round(Math.max(d.wind?.speed ?? 0, (d.wind?.gust ?? 0) * 0.8) * 3.6);
const dayMinutes = (d) => (d.sys && d.sys.sunset > d.sys.sunrise ? Math.round((d.sys.sunset - d.sys.sunrise) / 60) : 0); // 0 = polar night
const hm = (min) => `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')} min`;

/**
 * Five rounds. Each round compares a "badness" number for you and the rival (lower wins)
 * and keeps the real values to show.
 */
const ROUNDS = [
  { id: 'temp', bad: (d) => Math.abs((d.main?.feels_like ?? 0) - 22), show: (d) => `${Math.round(d.main?.feels_like ?? 0)}°`, tie: 0.5 },
  { id: 'sky', bad: (d) => -skyScore(d.weather?.[0]?.id ?? 800), show: (d) => d.weather?.[0]?.description ?? '', tie: 0 },
  { id: 'wind', bad: effWind, show: (d) => `${effWind(d)} km/h`, tie: 2 },
  { id: 'humidity', bad: (d) => Math.abs((d.main?.humidity ?? 0) - 45), show: (d) => `${Math.round(d.main?.humidity ?? 0)}%`, tie: 3 },
  { id: 'light', bad: (d) => -dayMinutes(d), show: (d) => hm(dayMinutes(d)), tie: 10 },
];

/**
 * Play the duel.
 * @returns {{rounds: {id, you, rival, winner: 'you'|'rival'|'tie'}[], score: {you, rival}, result: 'win'|'lose'|'draw'}}
 */
export function playDuel(mine, theirs) {
  const rounds = ROUNDS.map((r) => {
    const a = r.bad(mine);
    const b = r.bad(theirs);
    const winner = Math.abs(a - b) <= r.tie ? 'tie' : a < b ? 'you' : 'rival';
    return { id: r.id, you: r.show(mine), rival: r.show(theirs), winner };
  });
  const score = { you: rounds.filter((r) => r.winner === 'you').length, rival: rounds.filter((r) => r.winner === 'rival').length };
  const result = score.you > score.rival ? 'win' : score.you < score.rival ? 'lose' : 'draw';
  return { rounds, score, result };
}

export const ROUND_NAMES = {
  temp: { es: 'Temperatura ideal', en: 'Ideal temperature' },
  sky: { es: 'Cielo', en: 'Sky' },
  wind: { es: 'Viento', en: 'Wind' },
  humidity: { es: 'Humedad', en: 'Humidity' },
  light: { es: 'Horas de luz', en: 'Daylight' },
};

// Commentator lines per round and winner. {W} winner city, {L} loser city, {wv}/{lv} their values.
const ROUND_LINES = {
  temp: {
    es: { win: '{W} gana el asalto del termómetro: {wv} de sensación contra {lv}.', tie: 'Empate técnico en el termómetro: {wv} contra {lv}.' },
    en: { win: '{W} takes the thermometer round: feels like {wv} against {lv}.', tie: 'Dead heat on the thermometer: {wv} against {lv}.' },
  },
  sky: {
    es: { win: 'Cielo para {W} ({wv}). {L} se queda con {lv}.', tie: 'Mismo cielo en los dos rincones: {wv}.' },
    en: { win: 'Sky goes to {W} ({wv}). {L} is stuck with {lv}.', tie: 'Same sky in both corners: {wv}.' },
  },
  wind: {
    es: { win: '{W} aguanta el peinado: {wv} frente a {lv}.', tie: 'El viento no se moja: {wv} y {lv}.' },
    en: { win: '{W} keeps its hairdo: {wv} against {lv}.', tie: 'The wind sits on the fence: {wv} and {lv}.' },
  },
  humidity: {
    es: { win: '{W} gana en humedad: {wv} contra {lv}. El pelo lo agradece.', tie: 'Humedad igualada: {wv} y {lv}.' },
    en: { win: '{W} wins on humidity: {wv} against {lv}. Your hair says thanks.', tie: 'Humidity all square: {wv} and {lv}.' },
  },
  light: {
    es: { win: '{W} tiene más luz: {wv} de día frente a {lv}.', tie: 'Las dos ciudades tienen la misma luz: {wv}.' },
    en: { win: '{W} gets more light: {wv} of daytime against {lv}.', tie: 'Both cities get the same light: {wv}.' },
  },
};

const VERDICTS = {
  win: {
    es: ['¡{you} se lleva el duelo {score}! {rival} vuelve a casa con el paraguas entre las piernas.', '¡Victoria para {you}, {score}! Que vayan haciendo sitio en la vitrina.', '{you} gana {score}. Hoy, en {rival}, no hay nada que celebrar.'],
    en: ['{you} wins the duel {score}! {rival} goes home with its umbrella between its legs.', 'Victory for {you}, {score}! Make room in the trophy cabinet.', "{you} wins {score}. Nothing to celebrate in {rival} today."],
  },
  lose: {
    es: ['{rival} gana {score}. Toca aceptarlo: hoy su cielo es mejor. Mañana, revancha.', 'Derrota {score}. {rival} te ha pintado la cara, y sin despeinarse.', '{rival} se lleva el duelo {score}. Que no se entere el Tío Isobaras.'],
    en: ['{rival} wins {score}. Time to accept it: their sky is better today. Rematch tomorrow.', "Beaten {score}. {rival} ran rings around you without breaking a sweat.", "{rival} takes the duel {score}. Don't let Uncle Isobar find out."],
  },
  draw: {
    es: ['Empate {score}. El cielo no se decide, y nosotros tampoco.', '{score} y a casa. Ni {you} ni {rival}: hoy gana el sofá.'],
    en: ["It's a {score} draw. The sky can't decide, and neither can we.", '{score} and home time. Neither {you} nor {rival}: today the sofa wins.'],
  },
};

const fill = (text, vars) => fixDegrees(text.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? ''));

/** Commentary for one round. */
export function roundLine(round, youName, rivalName, lang) {
  const lines = ROUND_LINES[round.id][lang];
  if (round.winner === 'tie') return fill(lines.tie, { wv: round.you, lv: round.rival });
  const youWin = round.winner === 'you';
  return fill(lines.win, {
    W: youWin ? youName : rivalName,
    L: youWin ? rivalName : youName,
    wv: youWin ? round.you : round.rival,
    lv: youWin ? round.rival : round.you,
  });
}

/** Final verdict line. */
export function verdict(duel, youName, rivalName, lang, seed = '') {
  // Winner's goals first, like a sports headline
  const score = duel.result === 'lose' ? `${duel.score.rival}-${duel.score.you}` : `${duel.score.you}-${duel.score.rival}`;
  return fill(pickBySeed(VERDICTS[duel.result][lang], `${seed}-${score}`), { you: youName, rival: rivalName, score });
}

// Famous cities to suggest a random rival (only suggestions: any city can be searched).
// "q" is what we search for; "es"/"en" is how the name is shown and said.
export const RIVALS = [
  { q: 'Reykjavik', es: 'Reikiavik', en: 'Reykjavik' }, { q: 'Dubai', es: 'Dubái', en: 'Dubai' }, { q: 'Singapore', es: 'Singapur', en: 'Singapore' },
  { q: 'London', es: 'Londres', en: 'London' }, { q: 'New York', es: 'Nueva York', en: 'New York' }, { q: 'Tokyo', es: 'Tokio', en: 'Tokyo' },
  { q: 'Buenos Aires', es: 'Buenos Aires', en: 'Buenos Aires' }, { q: 'Moscow', es: 'Moscú', en: 'Moscow' }, { q: 'Cairo', es: 'El Cairo', en: 'Cairo' },
  { q: 'Sydney', es: 'Sídney', en: 'Sydney' }, { q: 'Mexico City', es: 'Ciudad de México', en: 'Mexico City' }, { q: 'Mumbai', es: 'Bombay', en: 'Mumbai' },
  { q: 'Cape Town', es: 'Ciudad del Cabo', en: 'Cape Town' }, { q: 'Lima', es: 'Lima', en: 'Lima' }, { q: 'Bangkok', es: 'Bangkok', en: 'Bangkok' },
  { q: 'Oslo', es: 'Oslo', en: 'Oslo' }, { q: 'Lisbon', es: 'Lisboa', en: 'Lisbon' }, { q: 'Rome', es: 'Roma', en: 'Rome' },
  { q: 'Paris', es: 'París', en: 'Paris' }, { q: 'Berlin', es: 'Berlín', en: 'Berlin' }, { q: 'Toronto', es: 'Toronto', en: 'Toronto' },
  { q: 'Rio de Janeiro', es: 'Río de Janeiro', en: 'Rio de Janeiro' }, { q: 'Nairobi', es: 'Nairobi', en: 'Nairobi' }, { q: 'Seoul', es: 'Seúl', en: 'Seoul' },
  { q: 'Havana', es: 'La Habana', en: 'Havana' }, { q: 'Anchorage', es: 'Anchorage', en: 'Anchorage' }, { q: 'Ushuaia', es: 'Ushuaia', en: 'Ushuaia' },
  { q: 'Marrakesh', es: 'Marrakech', en: 'Marrakesh' }, { q: 'Honolulu', es: 'Honolulu', en: 'Honolulu' }, { q: 'Helsinki', es: 'Helsinki', en: 'Helsinki' },
];

/** A random rival that isn't the given city. */
export function randomRival(exclude = '', random = Math.random) {
  const ex = String(exclude).toLowerCase();
  const pool = RIVALS.filter((c) => ![c.q, c.es, c.en].some((n) => n.toLowerCase() === ex));
  return pool[Math.floor(random() * pool.length)];
}

// Uncle Isobar's challenge call (brother-in-law style)
export const CHALLENGE = {
  es: [
    'Oye, que me han dicho en {rival} que su tiempo le da mil vueltas al tuyo. ¿Vas a consentirlo? Acepta el duelo y cállales la boca.',
    'Te llamo rápido: los de {rival} van diciendo por ahí que su cielo es mejor que el tuyo. Yo de ti no lo dejaba pasar. Hazme caso.',
  ],
  en: [
    "Listen, word from {rival} is their weather runs rings around yours. Are you going to take that? Accept the duel and shut them up.",
    "Quick call: the lot in {rival} are going around saying their sky beats yours. I wouldn't let that slide. Trust me.",
  ],
};

/** The challenge text for a rival. */
export function challengeText(rivalName, lang, seed = '') {
  return pickBySeed(CHALLENGE[lang], seed).replace('{rival}', rivalName);
}
