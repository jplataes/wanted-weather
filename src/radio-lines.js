// radio-lines.js — fictional stations and what their hosts say. Every number comes from the real weather.
// Hosts speak through Speech Synthesis, so numbers and units are written the way they should be read.

export const STATIONS = {
  neon: {
    freq: '88.3',
    name: { es: 'Neón Nocturno', en: 'Neon Nights' },
    genre: 'Synthwave',
    host: { es: 'DJ Farola', en: 'DJ Streetlight' },
    slogan: { es: 'Luces de neón y cero prisas.', en: 'Neon lights, zero rush.' },
    lines: {
      es: [
        'Aquí DJ Farola en Neón Nocturno. Son las {time} en {city}, {temp} grados y {desc}. Sube el volumen y baja las expectativas.',
        'Si me escuchas desde {city}, que sepas que fuera hay {temp} grados y una sensación de {feels}. Abrígate el alma, que el cuerpo ya sabe lo que tiene que hacer.',
        'Neón Nocturno, {freq}. El viento sopla a {wind} kilómetros por hora. Ni tan fuerte como para despeinarte ni tan flojo como para no echarle la culpa de algo.',
        'La misión de hoy se llama {mission}. Yo que tú la cumplía con esta canción de fondo.',
        'Humedad del {humidity} por ciento en {city}. Noche ideal para pelos con personalidad.',
      ],
      en: [
        "DJ Streetlight here on Neon Nights. It's {time} in {city}, {temp} degrees and {desc}. Turn the volume up and the expectations down.",
        "If you're listening from {city}, it's {temp} degrees out there and feels like {feels}. Wrap up your soul. Your body already knows the drill.",
        "Neon Nights, {freq}. Wind's at {wind} kilometres an hour. Not strong enough to wreck your hair, not weak enough to stop you blaming it for stuff.",
        "Today's mission is called {mission}. If I were you, I'd pull it off with this track playing.",
        "Humidity's at {humidity} percent in {city}. A perfect night for hair with a personality.",
      ],
    },
  },
  sol: {
    freq: '101.4',
    name: { es: 'Sol de Justicia FM', en: 'Blazing Sun FM' },
    genre: 'Funk',
    host: { es: 'La Chancla', en: 'Sandy Sandal' },
    slogan: { es: 'Funk caliente para días que queman.', en: 'Hot funk for scorching days.' },
    lines: {
      es: [
        '¡Arriba esas palmas, {city}! Aquí La Chancla en Sol de Justicia FM. {temp} grados y {desc}. Si tienes crema solar, este es su momento.',
        'Sensación térmica de {feels} grados, familia. Agua y funk, en ese orden. El resto, ya veremos.',
        'Son las {time}. El sol se pira a las {sunset}, así que exprime la luz como si fuera un limón.',
        'La misión de hoy: {mission}. Con este ritmo la cumples hasta bailando.',
        'Viento a {wind} kilómetros por hora. Brisita para disimular, pero no te fíes ni un pelo.',
      ],
      en: [
        "Hands up, {city}! Sandy Sandal here on Blazing Sun FM. {temp} degrees and {desc}. If you own sunscreen, this is its moment.",
        'Feels like {feels} degrees, people. Water and funk, in that order. Everything else can wait.',
        "It's {time}. The sun clocks out at {sunset}, so squeeze that daylight like a lemon.",
        "Today's mission: {mission}. With this groove you'll pull it off mid-dance.",
        "Wind at {wind} kilometres an hour. A little breeze for show, but don't trust it one bit.",
      ],
    },
  },
  chaparron: {
    freq: '93.1',
    name: { es: 'Lo-Fi Chaparrón', en: 'Lo-Fi Downpour' },
    genre: 'Lo-fi',
    host: { es: 'Doña Nube', en: 'Auntie Cloud' },
    slogan: { es: 'Ritmos tranquilos para ver llover.', en: 'Chill beats to watch the rain to.' },
    lines: {
      es: [
        'Esto es Lo-Fi Chaparrón y yo soy Doña Nube. En {city}, {temp} grados y {desc}. Taza caliente y ventana, que el plan es este.',
        'Humedad del {humidity} por ciento. Si tu pelo hoy tiene vida propia, no le culpes: es el ambiente.',
        'Son las {time}. Fuera, {desc}. Dentro, este ritmo. Tú decides dónde quieres estar.',
        'Misión del día: {mission}. Sin prisas, como la lluvia resbalando por el cristal.',
        'Sensación de {feels} grados. Ponte esa sudadera que te queda grande, que hoy es su día.',
      ],
      en: [
        "This is Lo-Fi Downpour and I'm Auntie Cloud. In {city}, {temp} degrees and {desc}. Hot mug and a window seat. That's the plan.",
        "Humidity at {humidity} percent. If your hair has a mind of its own today, don't blame it. It's the atmosphere.",
        "It's {time}. Outside, {desc}. Inside, this beat. Your call where you'd rather be.",
        "Today's mission: {mission}. No rush, like rain sliding down the glass.",
        "Feels like {feels} degrees. Put on that oversized hoodie. Today's its day.",
      ],
    },
  },
  tormenta: {
    freq: '106.6',
    name: { es: 'Radio Tormenta', en: 'Storm Radio' },
    genre: 'Darksynth',
    host: { es: 'El Trueno', en: 'Big Thunder' },
    slogan: { es: 'Graves que retumban como el cielo.', en: 'Bass that rumbles like the sky.' },
    lines: {
      es: [
        '¡Radio Tormenta, {freq}! Aquí El Trueno. En {city} hay {desc} y {temp} grados. Agárrate a algo que pese.',
        'Viento a {wind} kilómetros por hora. Si ves pasar un paraguas volando, no es tuyo. Ya no.',
        'Son las {time} y el cielo tiene el día movidito. Tú quédate cerca de la base y sube los graves.',
        'La misión de hoy: {mission}. Si sales, que sea con cabeza. Y con capucha.',
        'Sensación de {feels} grados. El cielo no ha venido a jugar, y nosotros tampoco.',
      ],
      en: [
        'Storm Radio, {freq}! Big Thunder here. {city} has {desc} and {temp} degrees. Hold on to something heavy.',
        "Wind at {wind} kilometres an hour. If you see an umbrella fly past, it's not yours. Not anymore.",
        "It's {time} and the sky's having a busy day. Stay close to base and crank the bass.",
        "Today's mission: {mission}. If you head out, use your head. And your hood.",
        "Feels like {feels} degrees. The sky didn't come to play, and neither did we.",
      ],
    },
  },
};

export const STATION_IDS = Object.keys(STATIONS);

/** Station that fits today's weather best. */
export function stationFor(view) {
  if (view.kind === 'storm' || view.scene === 'wind') return 'tormenta';
  if (['rain', 'fog', 'snow', 'clouds'].includes(view.kind)) return 'chaparron';
  if (view.night) return 'neon';
  return 'sol';
}

/** A host line with real facts filled in. */
export function djLine(stationId, index, facts, lang) {
  const lines = STATIONS[stationId].lines[lang];
  const text = lines[((index % lines.length) + lines.length) % lines.length];
  return text.replace(/\{(\w+)\}/g, (_, k) => (k === 'freq' ? STATIONS[stationId].freq : facts[k] ?? ''));
}
