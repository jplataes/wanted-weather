// copy.js — the game's humorous lines in Spanish and English, written separately for each language.
// Lines with several options rotate: one is picked per city and per day, so every visit can surprise.

export const STAR_LINES = {
  1: { es: ['Día de chill', 'La calle es tuya', 'Nadie te busca hoy'], en: ['Easy street', 'The streets are yours', "Nobody's after you today"] },
  2: { es: ['Algo se cuece', 'Te tienen fichado', 'Ojito, colega'], en: ["Something's cooking", "You're on their radar", 'Eyes open, pal'] },
  3: { es: ['Se está liando', 'El cielo quiere bronca', 'Modo supervivencia'], en: ['Things are kicking off', 'The sky wants a word', 'Survival mode'] },
  4: { es: ['Esto se pone feo', 'El clima te ha puesto precio', 'Sal solo si es urgente'], en: ["It's getting ugly", 'The weather put a price on your head', 'Out only if you must'] },
  5: { es: ['Sofá o nada', 'Ni lo intentes, campeón', 'Hoy manda el cielo'], en: ['Couch or nothing', "Don't even try, champ", 'The sky runs this town today'] },
};

export const ALERTS = {
  rain: { es: ['¡Empapado!', '¡Calado hasta el alma!', '¡Ducha gratis!'], en: ['Soaked!', 'Drenched to the bone!', 'Free shower!'],
    sub: { es: 'Lluvia fuerte en tu zona', en: 'Heavy rain in your area' } },
  heat: { es: ['¡A la parrilla!', '¡Derretido!', '¡Modo horno!'], en: ['Grilled!', 'Melted!', 'Oven mode!'],
    sub: { es: 'Calor extremo: busca sombra', en: 'Extreme heat: find some shade' } },
  cold: { es: ['¡Congelado!', '¡Cubito humano!', '¡Tiritando!'], en: ['Frozen solid!', 'Human ice cube!', 'Brrr-utal!'],
    sub: { es: 'Frío de los que muerden', en: 'The kind of cold that bites' } },
  wind: { es: ['¡Despeinado!', '¡Sales volando!', '¡Agárrate!'], en: ['Blown away!', 'Up, up and away!', 'Hold on tight!'],
    sub: { es: 'Rachas fuertes: sujeta el sombrero', en: 'Strong gusts: hold onto your hat' } },
  storm: { es: ['¡Fulminado!', '¡El cielo tiene ganas!', '¡Zambombazo!'], en: ['Zapped!', "The sky's got beef!", 'Ka-boom!'],
    sub: { es: 'Tormenta eléctrica encima', en: 'Thunderstorm overhead' } },
};

export const TAGLINES = {
  es: ['El tiempo de hoy viene a por ti', 'Tu ciudad. Tu cielo. Tus reglas.', 'Sal ahí fuera. O no.'],
  en: ["Today's weather is coming for you", 'Your city. Your sky. Your rules.', "Get out there. Or don't."],
};

export const LOADING_TIPS = {
  es: [
    'Consejo: el paraguas no protege del ridículo, pero ayuda.',
    'Consejo: si el cielo se pone morado, no es un filtro.',
    'Consejo: las gafas de sol también disimulan que acabas de despertarte.',
    'Consejo: correr bajo la lluvia no te moja menos. Lo hemos comprobado.',
    'Consejo: un buen abrigo vale más que diez excusas.',
  ],
  en: [
    "Tip: an umbrella won't save your dignity, but it helps.",
    "Tip: if the sky turns purple, that's not a filter.",
    'Tip: shades also hide that you just rolled out of bed.',
    "Tip: running in the rain doesn't keep you drier. We checked.",
    'Tip: a good coat beats ten excuses.',
  ],
};

/** Small string hash so the same seed always gives the same pick. */
export function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Pick one option from a list, stable for a given seed. */
export function pickBySeed(options, seed) {
  return options[hash(String(seed)) % options.length];
}

/** Pick a random option (for things that should change on every load, like loading tips). */
export function pickRandom(options) {
  return options[Math.floor(Math.random() * options.length)];
}

/** "1 grados" -> "1 grado", "1 degrees" -> "1 degree" (and -1). */
export function fixDegrees(text) {
  return text
    .replace(/(^|[^\d.,])(-?1) grados/g, '$1$2 grado')
    .replace(/(^|[^\d.,])(-?1) degrees/g, '$1$2 degree');
}
