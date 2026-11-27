// poster-copy.js — film genres, titles, taglines and credits for the poster of the day.
// Every weather type has its own genre. Titles are made up (no real film titles).
// Placeholders: {CITY} {TEMP} {MAX} {MIN} {FEELS} {GUST} {POP} {HUM} {DESC} {WIND}
import { fixDegrees } from './copy.js';

export const POSTER_THEMES = {
  heat: {
    genre: { es: 'Acción', en: 'Action' },
    titles: { es: ['{CITY}: {TEMP}° DE FURIA', '{CITY} EN LLAMAS', 'SOL DE JUSTICIA'], en: ['{CITY}: {TEMP}° OF FURY', '{CITY} ON FIRE', 'BLAZING {CITY}'] },
    taglines: {
      es: ['Máxima de {MAX}°. Sin sombra. Sin piedad.', 'Sensación de {FEELS}°. Esta vez, el asfalto va en serio.', 'Hoy nadie sale sin agua.'],
      en: ['High of {MAX}°. No shade. No mercy.', 'Feels like {FEELS}°. This time the tarmac means business.', 'Today, nobody leaves without water.'],
    },
    rating: { es: 'No recomendada sin crema solar', en: 'Not suitable without sunscreen' },
  },
  clear: {
    genre: { es: 'Comedia', en: 'Comedy' },
    titles: { es: ['EL DÍA QUE {CITY} BRILLÓ', '{CITY} SIN UNA NUBE', 'SOL, {TEMP}° Y NADA MÁS'], en: ['THE DAY {CITY} SHONE', '{CITY}, NOT A CLOUD', 'SUN, {TEMP}° AND NOTHING ELSE'] },
    taglines: {
      es: ['{TEMP}° y ni una nube. Demasiado bonito para ser verdad.', 'Una historia de sol, terrazas y cero excusas.'],
      en: ['{TEMP}° and not a cloud. Too good to be true.', 'A story of sunshine, patios and zero excuses.'],
    },
    rating: { es: 'Apta para todos los públicos con gafas de sol', en: 'All audiences (sunglasses required)' },
  },
  clouds: {
    genre: { es: 'Drama', en: 'Drama' },
    titles: { es: ['{CITY} EN GRIS', 'CIELO CUBIERTO', 'LAS NUBES DE {CITY}'], en: ['{CITY} IN GREY', 'OVERCAST', 'CLOUDS OVER {CITY}'] },
    taglines: {
      es: ['{TEMP}° y ni un rayo de sol. Prepara los pañuelos.', 'Nadie esperaba tanto gris. Nadie.'],
      en: ['{TEMP}° and not a single ray of sun. Bring tissues.', 'Nobody expected this much grey. Nobody.'],
    },
    rating: { es: 'No recomendada para días de playa', en: 'Not suitable for beach days' },
  },
  rain: {
    genre: { es: 'Thriller', en: 'Thriller' },
    titles: { es: ['CHAPARRÓN EN {CITY}', '{CITY} BAJO LA LLUVIA', 'CALADOS'], en: ['DOWNPOUR IN {CITY}', '{CITY} IN THE RAIN', 'SOAKED'] },
    taglines: {
      es: ['{POP}% de probabilidad de lluvia. Ningún paraguas está a salvo.', 'Nadie sale seco de esta.'],
      en: ['{POP}% chance of rain. No umbrella is safe.', 'Nobody walks away dry.'],
    },
    rating: { es: 'No recomendada para paraguas débiles', en: 'Not suitable for weak umbrellas' },
  },
  storm: {
    genre: { es: 'Catástrofe', en: 'Disaster' },
    titles: { es: ['{CITY}: EL TRUENO', 'ALERTA EN {CITY}', 'TORMENTA SOBRE {CITY}'], en: ['{CITY}: THUNDER', '{CITY} ON ALERT', 'STORM OVER {CITY}'] },
    taglines: {
      es: ['Cuando el cielo ruge, la ciudad tiembla.', 'Rachas de {GUST} km/h. Agárrate a la butaca.'],
      en: ['When the sky roars, the city shakes.', 'Gusts of {GUST} km/h. Hold on to your seat.'],
    },
    rating: { es: 'No recomendada para pararrayos sensibles', en: 'Not suitable for sensitive lightning rods' },
  },
  snow: {
    genre: { es: 'Aventura', en: 'Adventure' },
    titles: { es: ['CONGELADOS EN {CITY}', 'LA GRAN NEVADA', '{CITY} EN BLANCO'], en: ['SNOWED IN: {CITY}', 'WHITEOUT IN {CITY}', '{CITY} GOES WHITE'] },
    taglines: {
      es: ['{TEMP}°. Ni un paso sin bufanda.', 'Una aventura épica entre el portal y la panadería.'],
      en: ['{TEMP}°. Not one step without a scarf.', 'An epic adventure between your front door and the bakery.'],
    },
    rating: { es: 'No recomendada para suelas lisas', en: 'Not suitable for smooth soles' },
  },
  fog: {
    genre: { es: 'Misterio', en: 'Mystery' },
    titles: { es: ['{CITY} SIN RASTRO', 'LO QUE ESCONDE LA NIEBLA', 'VISIBILIDAD CERO'], en: ['{CITY} VANISHES', 'WHAT THE FOG HIDES', 'ZERO VISIBILITY'] },
    taglines: {
      es: ['Nadie vio nada. Literalmente.', 'La ciudad estaba ahí ayer. Lo juramos.'],
      en: ['Nobody saw a thing. Literally.', 'The city was there yesterday. We swear.'],
    },
    rating: { es: 'No recomendada sin luces antiniebla', en: 'Not suitable without fog lights' },
  },
  wind: {
    genre: { es: 'Western', en: 'Western' },
    titles: { es: ['RÁFAGAS SALVAJES', 'EL VIENTO DE {CITY}', 'SOMBREROS AL AIRE'], en: ['WILD GUSTS', 'THE WIND OF {CITY}', 'HATS IN THE AIR'] },
    taglines: {
      es: ['Rachas de {GUST} km/h. Solo uno conservará el sombrero.', 'En esta ciudad no hay sitio para dos peinados.'],
      en: ['Gusts of {GUST} km/h. Only one keeps their hat.', "This town ain't big enough for two hairdos."],
    },
    rating: { es: 'No recomendada para tupés', en: 'Not suitable for quiffs' },
  },
  night: {
    genre: { es: 'Cine negro', en: 'Neo-noir' },
    titles: { es: ['NOCHES DE {CITY}', 'NEÓN SOBRE {CITY}', '{CITY} A OSCURAS'], en: ['{CITY} NIGHTS', 'NEON OVER {CITY}', '{CITY} IN THE DARK'] },
    taglines: {
      es: ['{TEMP}° bajo las farolas. La ciudad no duerme.', 'Algunos salen de noche. Otros, solo a por un café.'],
      en: ['{TEMP}° under the street lights. The city never sleeps.', 'Some come out at night. Others just want a coffee.'],
    },
    rating: { es: 'No recomendada para los que madrugan', en: 'Not suitable for early birds' },
  },
  cold: {
    genre: { es: 'Supervivencia', en: 'Survival' },
    titles: { es: ['{CITY} TIRITA', 'EL FRÍO DE {CITY}', 'TIRITANDO'], en: ['{CITY} SHIVERS', 'THE COLD OF {CITY}', 'SHIVER'] },
    taglines: {
      es: ['Sensación de {FEELS}°. Solo sobrevivirán los abrigados.', 'Una historia de mantas, radiadores y valor.'],
      en: ['Feels like {FEELS}°. Only the well-wrapped survive.', 'A tale of blankets, radiators and courage.'],
    },
    rating: { es: 'No recomendada sin bufanda', en: 'Not suitable without a scarf' },
  },
};

const CREDITS = {
  es: ['Protagonizada por {CITY}', 'con {TEMP}° y {DESC}', 'viento a {WIND} km/h', 'guion de la humedad ({HUM}%)', 'dirigida por el Tío Isobaras', 'una producción Wanted Weather'],
  en: ['Starring {CITY}', 'with {TEMP}° and {DESC}', 'wind at {WIND} km/h', 'screenplay by {HUM}% humidity', 'directed by Uncle Isobar', 'a Wanted Weather production'],
};

export const PRESENTS = { es: 'Wanted Weather presenta', en: 'Wanted Weather presents' };
export const TODAY = { es: 'Hoy', en: 'Today' };

/** Film genre for today's weather. */
export function posterTheme(view) {
  if (['storm', 'rain', 'snow', 'fog'].includes(view.kind)) return view.kind;
  if (view.feels >= 30) return 'heat';
  if (view.feels <= 3) return 'cold';
  if (view.scene === 'wind' || view.kind === 'wind') return 'wind';
  if (view.night) return 'night';
  return view.kind === 'clear' ? 'clear' : 'clouds';
}

const fill = (text, facts) => fixDegrees(text.replace(/\{(\w+)\}/g, (_, k) => facts[k]));
const usable = (text, facts) => [...text.matchAll(/\{(\w+)\}/g)].every(([, k]) => facts[k] !== null && facts[k] !== undefined);

/**
 * Text for the poster. `variant` picks the title (it cycles with the "another title" button).
 * @returns {{theme, genre, title, tagline, credits, rating}}
 */
export function posterText(theme, facts, lang, variant = 0) {
  const t = POSTER_THEMES[theme];
  const titles = t.titles[lang].filter((x) => usable(x, facts));
  const taglines = t.taglines[lang].filter((x) => usable(x, facts));
  return {
    theme,
    genre: t.genre[lang],
    title: fill(titles[variant % titles.length], facts),
    tagline: fill(taglines[variant % taglines.length], facts),
    credits: CREDITS[lang].filter((x) => usable(x, facts)).map((x) => fill(x, facts)).join(' · '),
    rating: t.rating[lang],
    variants: titles.length,
  };
}
