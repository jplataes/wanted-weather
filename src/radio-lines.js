import { fixDegrees } from './copy.js';
// radio-lines.js — fictional stations and what their hosts say.
// The radio is the city: now and then the host gives the weather (real numbers), and in between come
// made-up ads, absurd traffic reports, dedications and grandma's advice. The mission is Uncle Isobar's job, not the radio's.
// Hosts speak through Speech Synthesis, so numbers and units are written the way they should be read.

/** Station-independent radio bits. Brands and people are made up. */
export const BITS = {
  es: [
    'Publicidad. Paraguas Don Varillas: aguantan rachas de ochenta kilómetros por hora o te devolvemos la dignidad. Don Varillas, porque mojarse es de aficionados.',
    'Información de tráfico: retenciones en la rotonda de siempre porque alguien ha parado a hacerle una foto al cielo. Paciencia.',
    'Dedicatoria de Mari para su vecino del quinto: el tendedero no es tuyo. Esta canción va por ti.',
    'Consejo de la abuela: si las nubes van deprisa, tú no. Que las prisas son malas consejeras.',
    '¿Se te encrespa el pelo con la humedad? Laca Huracán, la única que sobrevive a un día de playa y a una boda en el mismo fin de semana.',
    'Atención, conductores: un paraguas fuera de control circula en dirección contraria por la avenida principal. Si es tuyo, ve a por él.',
    'Nos escribe un oyente que ha salido en pantalón corto y se arrepiente. Ánimo, campeón, esta suena para ti.',
    'Como decía mi abuela: abrígate, que luego vienen los lamentos. Y tenía razón. La abuela siempre tiene razón.',
    'Ventiladores Brisa Total. Si no te vuela el flequillo, no es un ventilador, es un adorno.',
    'Tráfico fluido en toda la ciudad, salvo en el aparcamiento del súper, donde el caos es eterno.',
    'Para todos los que hoy han dicho «bueno, ya no llueve» justo antes de que volviera a llover. Sois muchos y os queremos.',
    'La abuela recomienda: calcetines secos y la cabeza fría. O al revés, ya no me acuerdo.',
    'Mantas Abrazo de Oso. Tan calentitas que vas a cancelar planes sin necesidad de excusa.',
    'Se recomienda precaución: varios peatones caminan mirando el móvil en lugar de mirar el cielo. Ni lo uno ni lo otro, por favor.',
    'Un saludo a Paco, que dice que él no necesita abrigo. Paco, todos sabemos que tienes frío.',
    'Chubasqueros Gota Fría: impermeables por fuera, con estilo por dentro. Bueno, casi.',
  ],
  en: [
    'Ad break. Don Spokes Umbrellas: they survive eighty-kilometre gusts or we give you your dignity back. Don Spokes, because getting soaked is for amateurs.',
    'Traffic update: tailbacks at the usual roundabout because someone stopped to take a photo of the sky. Patience.',
    "A dedication from Mary to her neighbour on the fifth floor: the washing line isn't yours. This one's for you.",
    "Grandma's advice: if the clouds are in a hurry, you shouldn't be. Rushing never helped anyone.",
    'Humidity turning your hair into a hedge? Hurricane Hairspray: the only one that survives a beach day and a wedding in the same weekend.',
    "Drivers, heads up: a runaway umbrella is heading the wrong way down the high street. If it's yours, go and get it.",
    "A listener tells us he went out in shorts and regrets it. Hang in there, champ, this one's for you.",
    "As my gran used to say: wrap up now or moan later. She was right. Gran's always right.",
    "Total Breeze fans. If it doesn't lift your fringe, it's not a fan, it's an ornament.",
    'Traffic flowing smoothly across town, except the supermarket car park, where chaos is eternal.',
    "To everyone who said 'right, it's stopped raining' just before it started again. There are a lot of you and we love you.",
    'Gran recommends: dry socks and a cool head. Or the other way round, I forget.',
    "Bear Hug Blankets. So cosy you'll cancel plans without even needing an excuse.",
    'Take care out there: several pedestrians are walking while staring at their phones instead of the sky. Neither, please.',
    "Shout-out to Pete, who says he doesn't need a coat. Pete, we all know you're freezing.",
    'Cold Snap Raincoats: waterproof on the outside, stylish on the inside. Well, almost.',
  ],
};

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
        'Neón Nocturno, {freq}. Fuera hay una sensación de {feels} grados y el viento sopla a {wind} kilómetros por hora. Ni tan fuerte como para despeinarte ni tan flojo como para no echarle la culpa de algo.',
        'Humedad del {humidity} por ciento en {city}. Noche ideal para pelos con personalidad.',
      ],
      en: [
        "DJ Streetlight here on Neon Nights. It's {time} in {city}, {temp} degrees and {desc}. Turn the volume up and the expectations down.",
        "Neon Nights, {freq}. Out there it feels like {feels} degrees and the wind's at {wind} kilometres an hour. Not strong enough to wreck your hair, not weak enough to stop you blaming it for stuff.",
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
        'Son las {time} y la sensación térmica es de {feels} grados, familia. El sol se pira a las {sunset}, así que exprime la luz como si fuera un limón.',
        'Viento a {wind} kilómetros por hora en {city}. Brisita para disimular, pero no te fíes ni un pelo.',
      ],
      en: [
        "Hands up, {city}! Sandy Sandal here on Blazing Sun FM. {temp} degrees and {desc}. If you own sunscreen, this is its moment.",
        "It's {time} and it feels like {feels} degrees, people. The sun clocks out at {sunset}, so squeeze that daylight like a lemon.",
        "Wind at {wind} kilometres an hour in {city}. A little breeze for show, but don't trust it one bit.",
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
        'Son las {time}. Fuera, {desc} y sensación de {feels} grados. Dentro, este ritmo. Tú decides dónde quieres estar.',
      ],
      en: [
        "This is Lo-Fi Downpour and I'm Auntie Cloud. In {city}, {temp} degrees and {desc}. Hot mug and a window seat. That's the plan.",
        "Humidity at {humidity} percent. If your hair has a mind of its own today, don't blame it. It's the atmosphere.",
        "It's {time}. Outside, {desc} and it feels like {feels} degrees. Inside, this beat. Your call where you'd rather be.",
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
        'Son las {time} y hay una sensación de {feels} grados. El cielo no ha venido a jugar, y nosotros tampoco.',
      ],
      en: [
        'Storm Radio, {freq}! Big Thunder here. {city} has {desc} and {temp} degrees. Hold on to something heavy.',
        "Wind at {wind} kilometres an hour. If you see an umbrella fly past, it's not yours. Not anymore.",
        "It's {time} and it feels like {feels} degrees. The sky didn't come to play, and neither did we.",
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

/**
 * What the host says on turn number `index`: the weather (with real facts) every third turn,
 * and radio bits (ads, traffic, dedications, grandma's advice) in between.
 */
export function djLine(stationId, index, facts, lang) {
  const i = Math.max(0, index);
  if (i % 3 === 0) {
    const lines = STATIONS[stationId].lines[lang];
    const text = lines[(i / 3) % lines.length];
    return fixDegrees(text.replace(/\{(\w+)\}/g, (_, k) => (k === 'freq' ? STATIONS[stationId].freq : facts[k] ?? '')));
  }
  const bits = BITS[lang];
  return bits[(i - Math.ceil(i / 3)) % bits.length];
}
