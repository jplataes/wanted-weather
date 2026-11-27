// missions.js — the mission of the day, recommended gear and the phone-call script.
// Humorous lines are ours; every number in "intel" comes straight from the forecast.
import { pickBySeed } from './copy.js';

export const THEMES = {
  clear: {
    title: { es: ['Operación Vitamina D', 'El sol paga la ronda', 'Día de lucirse'], en: ['Operation Vitamin D', "The sun's buying", 'Showtime'] },
    objective: {
      es: ['Sal a la calle y exprime el día antes de que el sol se largue. Terraza, paseo o lo que se te ponga por delante.', 'La ciudad está de buenas. Tu misión: no desperdiciarlo encerrado entre cuatro paredes.'],
      en: ['Hit the streets and squeeze the day before the sun clocks out. Patio, stroll, whatever comes your way.', "The city's in a good mood. Your mission: don't waste it stuck indoors."],
    },
  },
  clouds: {
    title: { es: ['Operación Gris Perla', 'Cielo en modo sigilo', 'Ni frío ni calor, colega'], en: ['Operation Pearl Grey', 'Sky in stealth mode', 'Not hot, not cold, pal'] },
    objective: {
      es: ['El cielo se ha puesto el abrigo, pero no hay drama. Haz tus recados sin prisas y vigila el horizonte.', 'Día perfecto para pasar desapercibido. Cumple tus planes y no te fíes de ninguna nube con mala cara.'],
      en: ["The sky put its coat on, but there's no drama. Run your errands and keep an eye on the horizon.", "Perfect day to keep a low profile. Stick to the plan and don't trust any cloud giving you looks."],
    },
  },
  rain: {
    title: { es: ['Operación Charco', 'Misión: llegar seco', 'El cielo tiene fugas'], en: ['Operation Puddle', 'Mission: stay dry', 'The sky sprang a leak'] },
    objective: {
      es: ['Cruza la ciudad sin calarte. Los charcos son minas: esquívalos con estilo.', 'Llega a tu destino con los calcetines secos. Parece fácil. No lo es.'],
      en: ['Cross town without getting soaked. Puddles are landmines: dodge them in style.', "Reach your destination with dry socks. Sounds easy. It isn't."],
    },
  },
  storm: {
    title: { es: ['Operación Trueno', 'El cielo va a por todas', 'Alerta en el barrio'], en: ['Operation Thunder', "The sky's going all in", 'Neighbourhood on alert'] },
    objective: {
      es: ['Hoy el jefe es el cielo. Haz solo lo imprescindible y vuelve a la base cuanto antes.', 'Evita las zonas abiertas y no juegues a ser pararrayos. Plan de hoy: refugio y paciencia.'],
      en: ["The sky's the boss today. Do the bare minimum and get back to base fast.", "Stay out of open spaces and don't play lightning rod. Today's plan: shelter and patience."],
    },
  },
  snow: {
    title: { es: ['Operación Cubito', 'Ciudad congelada', 'Misión bajo cero'], en: ['Operation Ice Cube', 'Frozen city', 'Mission: sub-zero'] },
    objective: {
      es: ['El suelo resbala más que una excusa mala. Camina despacio y no presumas.', 'Abrígate por capas y muévete con calma: hoy gana el que no se cae.'],
      en: ["The ground's slipperier than a bad excuse. Walk slow and don't show off.", "Dress in layers and take it easy: today the winner is whoever stays on their feet."],
    },
  },
  fog: {
    title: { es: ['Operación Niebla', 'Visibilidad: cero excusas', 'Ciudad en modo misterio'], en: ['Operation Fog', 'Visibility: zero excuses', 'City in mystery mode'] },
    objective: {
      es: ['No ves ni tu sombra. Muévete con cuidado y deja que los faros hagan su trabajo.', 'Día de cine negro. Cumple tus planes sin perder de vista a nadie.'],
      en: ["You can't even see your shadow. Move carefully and let the headlights do the work.", 'Film noir weather. Stick to the plan and keep everyone in sight.'],
    },
  },
  wind: {
    title: { es: ['Operación Despeinado', 'Ráfagas con carácter', 'Sujeta lo que quieras conservar'], en: ['Operation Bad Hair Day', 'Gusts with attitude', 'Hold on to what you love'] },
    objective: {
      es: ['El viento quiere tu gorra, tu paraguas y tu dignidad. No le des nada.', 'Cruza la ciudad sin perder nada por el camino. Sombreros, ni de broma.'],
      en: ['The wind wants your cap, your umbrella and your dignity. Give it nothing.', 'Cross town without losing anything on the way. Hats are a no-go.'],
    },
  },
  heat: {
    title: { es: ['Operación Sombra', 'Asfalto a la plancha', 'Modo horno activado'], en: ['Operation Shade', 'Grilled asphalt', 'Oven mode on'] },
    objective: {
      es: ['Muévete de sombra en sombra como un profesional. Bebe agua y evita las horas centrales.', 'Sobrevive al calor sin derretirte. Agua, sombra y cero heroicidades a mediodía.'],
      en: ['Move from shade to shade like a pro. Drink water and skip the midday hours.', 'Survive the heat without melting. Water, shade and zero heroics at noon.'],
    },
  },
  cold: {
    title: { es: ['Operación Bufanda', 'Frío de los que muerden', 'Misión: no tiritar'], en: ['Operation Scarf', 'Cold with teeth', 'Mission: no shivering'] },
    objective: {
      es: ['Sal abrigado como si fueras de expedición. El frío no perdona a los valientes en manga corta.', 'Cumple tus recados sin congelarte. Capas, capas y más capas.'],
      en: ["Gear up like you're off on an expedition. The cold shows no mercy to heroes in short sleeves.", 'Run your errands without freezing. Layers, layers and more layers.'],
    },
  },
};

export const GEAR = {
  umbrella: { es: 'Paraguas', en: 'Umbrella' },
  boots: { es: 'Botas impermeables', en: 'Waterproof boots' },
  coat: { es: 'Abrigo', en: 'Coat' },
  scarf: { es: 'Bufanda y guantes', en: 'Scarf and gloves' },
  hoodie: { es: 'Sudadera', en: 'Hoodie' },
  windbreaker: { es: 'Cortavientos', en: 'Windbreaker' },
  sunglasses: { es: 'Gafas de sol', en: 'Sunglasses' },
  sunscreen: { es: 'Crema solar', en: 'Sunscreen' },
  cap: { es: 'Gorra', en: 'Cap' },
  water: { es: 'Agua', en: 'Water bottle' },
  tshirt: { es: 'Ropa ligera', en: 'Light clothes' },
};

const CALL = {
  greet: {
    es: ['Eh, soy el Tío Isobaras. Atento, que no lo repito.', 'Tío Isobaras al aparato. Tengo trabajo para ti.'],
    en: ["Hey, it's Uncle Isobar. Listen up, I'm not saying this twice.", 'Uncle Isobar here. Got a job for you.'],
  },
  where: { es: { today: 'Misión de hoy en {city}', tomorrow: 'Misión de mañana en {city}' }, en: { today: "Today's job in {city}", tomorrow: "Tomorrow's job in {city}" } },
  bring: { es: 'Llévate: {list}.', en: 'Bring: {list}.' },
  bye: {
    es: ['Y ya sabes: si te mojas, no me llames.', 'Cambio y corto.', 'Suerte ahí fuera. La vas a necesitar.'],
    en: ["And remember: if you get wet, don't call me.", 'Over and out.', "Good luck out there. You'll need it."],
  },
};

const INTEL = {
  es: { range: 'Máxima de {max}° y mínima de {min}°', rain: 'Probabilidad de lluvia del {pop}%', rainFrom: 'Probabilidad de lluvia del {pop}% desde las {time}', wind: 'Viento de hasta {wind} km/h', sunset: 'El sol se pone a las {sunset}', now: 'Ahora mismo {temp}° y sensación de {feels}°' },
  en: { range: 'High of {max}° and low of {min}°', rain: '{pop}% chance of rain', rainFrom: '{pop}% chance of rain from {time}', wind: 'Wind up to {wind} km/h', sunset: 'Sunset at {sunset}', now: 'Right now {temp}°, feels like {feels}°' },
};

const fill = (text, vars) => text.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : ''));

/** Main theme of a day, worst conditions first. */
export function themeFor(day) {
  if (day.kind === 'storm') return 'storm';
  if (day.kind === 'snow') return 'snow';
  if (day.kind === 'rain' || day.pop >= 50) return 'rain';
  if (day.maxFeels >= 30) return 'heat';
  if (day.minFeels <= 3) return 'cold';
  if (day.kind === 'wind' || day.windKmh >= 30) return 'wind';
  if (day.kind === 'fog') return 'fog';
  if (day.kind === 'clear') return 'clear';
  return 'clouds';
}

/** Up to 4 items to wear or carry, from the day's real numbers. */
export function gearFor(day) {
  const out = [];
  const add = (id, when) => { if (when && !out.includes(id)) out.push(id); };
  const wet = day.kind === 'rain' || day.kind === 'storm';
  add('umbrella', (wet || day.pop >= 40) && day.windKmh < 50);
  add('windbreaker', day.windKmh >= 30 || ((wet || day.pop >= 40) && day.windKmh >= 50));
  add('boots', day.kind === 'snow' || day.rainMm >= 5);
  add('scarf', day.minFeels <= 3);
  add('coat', day.minFeels < 8);
  add('hoodie', day.minFeels >= 8 && day.minFeels < 16);
  add('sunglasses', day.kind === 'clear');
  add('sunscreen', day.kind === 'clear' && day.max >= 24);
  add('water', day.maxFeels >= 28);
  add('cap', day.kind === 'clear' && day.max >= 27);
  add('tshirt', day.max >= 24 && day.minFeels >= 16);
  if (!out.length) out.push(day.max < 20 ? 'hoodie' : 'tshirt');
  return out.slice(0, 4);
}

/** A day summary built from the current reading, when the forecast is not available. */
export function dayFromView(view) {
  return { min: view.temp, max: view.temp, minFeels: view.feels, maxFeels: view.feels, pop: 0, rainMm: 0, windKmh: Math.max(view.windKmh, view.gustKmh * 0.8), kind: view.kind, rainStart: null, level: view.level };
}

/**
 * Mission of the day.
 * @param {{day: object|null, when: 'today'|'tomorrow', view: object, lang: 'es'|'en'}} input
 */
export function buildMission({ day, when, view, lang }) {
  const d = day ?? dayFromView(view);
  const theme = themeFor(d);
  const seed = `${view.seed}-${when}`;
  const title = pickBySeed(THEMES[theme].title[lang], `${seed}-title`);
  const objective = pickBySeed(THEMES[theme].objective[lang], `${seed}-objective`);

  const t = INTEL[lang];
  const intel = [];
  if (when === 'today') intel.push(fill(t.now, { temp: view.temp, feels: view.feels }));
  if (day) intel.push(fill(t.range, { max: Math.max(d.max, when === 'today' ? view.temp : -99), min: Math.min(d.min, when === 'today' ? view.temp : 99) }));
  if (day && d.pop >= 20) intel.push(fill(d.rainStart ? t.rainFrom : t.rain, { pop: d.pop, time: d.rainStart }));
  if (d.windKmh >= 20) intel.push(fill(t.wind, { wind: Math.round(d.windKmh) }));
  if (when === 'today' && view.sunset && view.sunset !== '–') intel.push(fill(t.sunset, { sunset: view.sunset }));

  const gear = gearFor(d).map((id) => ({ id, label: GEAR[id][lang] }));

  const script = [
    pickBySeed(CALL.greet[lang], `${seed}-greet`),
    `${fill(CALL.where[lang][when], { city: view.city })}: ${title}.`,
    objective,
    intel.length ? `${intel.join('. ')}.` : '',
    fill(CALL.bring[lang], { list: gear.map((g) => g.label.toLowerCase()).join(', ') }),
    pickBySeed(CALL.bye[lang], `${seed}-bye`),
  ].filter(Boolean).join(' ');

  return { when, theme, title, objective, intel, gear, script };
}

/** Short card data for an upcoming day. */
export function upcomingCard(day, lang, seed) {
  const theme = themeFor(day);
  const weekday = new Date(`${day.key}T12:00:00Z`).toLocaleDateString(lang === 'en' ? 'en-GB' : 'es-ES', { weekday: 'long', timeZone: 'UTC' });
  return {
    key: day.key,
    weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
    theme,
    kind: day.kind,
    max: day.max,
    min: day.min,
    pop: day.pop,
    level: day.level,
    codename: pickBySeed(THEMES[theme].title[lang], `${seed}-${day.key}`),
    description: day.description,
  };
}
