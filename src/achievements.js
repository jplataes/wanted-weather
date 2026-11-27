// achievements.js — achievements and the player's nickname (pure logic + copy, saved on the device by the UI).
// Every achievement comes from something real: the weather you looked up, or what you did in the app.

export const ACHIEVEMENTS = [
  // The weather out there
  { id: 'newcomer', icon: ['gear', 'cap'], reward: 10, name: { es: 'Recién llegado', en: 'New in town' }, hint: { es: 'Abre la app por primera vez.', en: 'Open the app for the first time.' } },
  { id: 'rain', icon: ['weather', 'rain'], reward: 25, name: { es: 'Bautizo de lluvia', en: 'Baptism of rain' }, hint: { es: 'Mira una ciudad donde esté lloviendo.', en: "Look up a city where it's raining." } },
  { id: 'storm', icon: ['weather', 'storm'], reward: 40, name: { es: 'Cazatormentas', en: 'Storm chaser' }, hint: { es: 'Mira una ciudad con tormenta.', en: 'Look up a city with a thunderstorm.' } },
  { id: 'snow', icon: ['weather', 'snow'], reward: 40, name: { es: 'Muñeco de nieve', en: 'Snowman' }, hint: { es: 'Mira una ciudad donde esté nevando.', en: "Look up a city where it's snowing." } },
  { id: 'fog', icon: ['weather', 'fog'], reward: 30, name: { es: 'Sin rastro', en: 'Lost in the fog' }, hint: { es: 'Mira una ciudad con niebla.', en: 'Look up a foggy city.' } },
  { id: 'oven', icon: ['gear', 'water'], reward: 40, name: { es: 'Modo horno', en: 'Oven mode' }, hint: { es: 'Mira una ciudad con sensación de 35° o más.', en: 'Look up a city that feels like 35° or more.' } },
  { id: 'polar', icon: ['gear', 'scarf'], reward: 40, name: { es: 'Polo norte', en: 'North Pole' }, hint: { es: 'Mira una ciudad con sensación de -10° o menos.', en: 'Look up a city that feels like -10° or less.' } },
  { id: 'gale', icon: ['weather', 'wind'], reward: 30, name: { es: 'Despeinado', en: 'Bad hair day' }, hint: { es: 'Mira una ciudad con rachas de 60 km/h o más.', en: 'Look up a city with gusts of 60 km/h or more.' } },
  { id: 'wanted', icon: ['star', ''], reward: 60, name: { es: 'Busca y captura', en: 'Most wanted' }, hint: { es: 'Encuentra un día de 5 estrellas.', en: 'Find a 5-star day.' } },
  { id: 'globetrotter', icon: ['weather', 'clear'], reward: 50, name: { es: 'Trotamundos', en: 'Globetrotter' }, hint: { es: 'Consulta 10 ciudades distintas.', en: 'Look up 10 different cities.' } },
  // Things you do
  { id: 'phone', icon: ['phone', ''], reward: 15, name: { es: 'Contesta, que es el Tío', en: 'Pick up, it\'s Uncle' }, hint: { es: 'Contesta una llamada del Tío Isobaras.', en: 'Answer a call from Uncle Isobar.' } },
  { id: 'radio', icon: ['radio', ''], reward: 15, name: { es: 'Melómano', en: 'Music lover' }, hint: { es: 'Enciende la autorradio.', en: 'Turn on the car radio.' } },
  { id: 'excuses', icon: ['gear', 'sofa'], reward: 30, name: { es: 'Maestro de la excusa', en: 'Master of excuses' }, hint: { es: 'Tira 10 veces de la palanca del Excusómetro.', en: 'Pull the Excuse-o-matic lever 10 times.' } },
  { id: 'movieStar', icon: ['star', ''], reward: 25, name: { es: 'Estrella de cine', en: 'Movie star' }, hint: { es: 'Descarga o comparte tu póster del día.', en: 'Download or share your poster of the day.' } },
  { id: 'firstDuel', icon: ['gear', 'umbrella'], reward: 15, name: { es: 'Primer asalto', en: 'First round' }, hint: { es: 'Juega un duelo de ciudades.', en: 'Play a city duel.' } },
  { id: 'duelWin', icon: ['star', ''], reward: 30, name: { es: 'Campeón del barrio', en: 'Neighbourhood champ' }, hint: { es: 'Gana un duelo de ciudades.', en: 'Win a city duel.' } },
  { id: 'whitewash', icon: ['star', ''], reward: 80, name: { es: 'Paliza', en: 'Whitewash' }, hint: { es: 'Gana un duelo 5-0.', en: 'Win a duel 5-0.' } },
  { id: 'bullseye', icon: ['gear', 'sunglasses'], reward: 50, name: { es: 'Clavada', en: 'Bullseye' }, hint: { es: 'Acierta exacta la máxima en La apuesta.', en: 'Get the exact high right in The Bet.' } },
  { id: 'streak3', icon: ['weather', 'clouds'], reward: 40, name: { es: 'En racha', en: 'On a roll' }, hint: { es: 'Acierta La apuesta 3 días seguidos.', en: 'Win The Bet 3 days in a row.' } },
  { id: 'streak7', icon: ['weather', 'storm'], reward: 120, name: { es: 'Imparable', en: 'Unstoppable' }, hint: { es: 'Acierta La apuesta 7 días seguidos.', en: 'Win The Bet 7 days in a row.' } },
  { id: 'survivor', icon: ['gear', 'umbrella'], reward: 25, name: { es: 'Superviviente', en: 'Survivor' }, hint: { es: 'Sobrevive a Esquiva el chaparrón.', en: 'Survive Dodge the Downpour.' } },
  { id: 'untouchable', icon: ['gear', 'boots'], reward: 60, name: { es: 'Intocable', en: 'Untouchable' }, hint: { es: 'Sobrevive a Esquiva el chaparrón sin perder ninguna estrella.', en: 'Survive Dodge the Downpour without losing a star.' } },
  { id: 'respected', icon: ['star', ''], reward: 0, name: { es: 'Respetado', en: 'Respected' }, hint: { es: 'Llega a 500 de respeto.', en: 'Reach 500 respect.' } },
];

/** Nickname tiers by respect. */
export const NICKNAMES = [
  { min: 0, es: 'Turista del tiempo', en: 'Weather tourist' },
  { min: 100, es: 'Mirón de nubes', en: 'Cloud watcher' },
  { min: 250, es: 'Veterano del charco', en: 'Puddle veteran' },
  { min: 500, es: 'Cazatormentas de barrio', en: 'Neighbourhood storm chaser' },
  { min: 1000, es: 'Leyenda del Chubasco', en: 'Downpour Legend' },
  { min: 2000, es: 'Mando supremo del clima', en: 'Supreme Weather Boss' },
];

/** Tier index for some respect. */
export function tierFor(respect) {
  let tier = 0;
  NICKNAMES.forEach((n, i) => { if (respect >= n.min) tier = i; });
  return tier;
}

/** Nickname, plus "on a streak" when the bet streak is 3 or more. */
export function nickname(respect, streak, lang) {
  const base = NICKNAMES[tierFor(respect)][lang];
  if (streak >= 3) return lang === 'en' ? `${base} · on a ${streak}-day streak` : `${base} · en racha de ${streak} días`;
  return base;
}

/** Respect needed for the next tier (null at the top). */
export function nextTier(respect) {
  const i = tierFor(respect);
  return i < NICKNAMES.length - 1 ? NICKNAMES[i + 1] : null;
}

/**
 * Which achievements an event unlocks.
 * @param {{type: string}} event e.g. {type:'weather', view}, {type:'duel', result, score}, {type:'dodge', survived, lives}
 * @param {object} store {unlocked:{}, cities:[], pulls}
 * @param {object} progress {respect, streak}
 * @returns {string[]} ids newly unlocked (the caller saves them)
 */
export function evaluate(event, store, progress) {
  const got = new Set(Object.keys(store.unlocked || {}));
  const out = [];
  const unlock = (id, cond) => { if (cond && !got.has(id) && !out.includes(id)) out.push(id); };

  switch (event.type) {
    case 'weather': {
      const v = event.view;
      unlock('newcomer', true);
      unlock('rain', v.kind === 'rain');
      unlock('storm', v.kind === 'storm');
      unlock('snow', v.kind === 'snow');
      unlock('fog', v.kind === 'fog');
      unlock('oven', v.feels >= 35);
      unlock('polar', v.feels <= -10);
      unlock('gale', v.gustShowKmh >= 60);
      unlock('wanted', v.level >= 5);
      unlock('globetrotter', (store.cities || []).length >= 10);
      break;
    }
    case 'call': unlock('phone', true); break;
    case 'radio': unlock('radio', true); break;
    case 'excuse': unlock('excuses', (store.pulls || 0) >= 10); break;
    case 'poster': unlock('movieStar', true); break;
    case 'duel':
      unlock('firstDuel', true);
      unlock('duelWin', event.result === 'win');
      unlock('whitewash', event.result === 'win' && event.score?.rival === 0 && event.score?.you === 5);
      break;
    case 'bet': unlock('bullseye', event.grade === 'exact'); break;
    case 'dodge':
      unlock('survivor', event.survived);
      unlock('untouchable', event.survived && event.lives === 3);
      break;
    default: break;
  }
  // Progress-based ones are checked on every event
  unlock('streak3', progress.streak >= 3);
  unlock('streak7', progress.streak >= 7);
  unlock('respected', progress.respect >= 500);
  return out;
}

/** Uncle Isobar's call when your nickname goes up. */
export function promotionCall(nick, lang) {
  return lang === 'en'
    ? `Hey, word's going round that you're now known as "${nick}". I always said it, didn't I? I said it at the family dinner. Nobody listened, but I said it. Keep it up and don't let it go to your head.`
    : `Oye, que me han dicho que ahora te llaman «${nick}». Yo siempre lo dije, ¿eh? Lo dije en la comida familiar. Nadie me hizo caso, pero lo dije. Sigue así y que no se te suba a la cabeza.`;
}
