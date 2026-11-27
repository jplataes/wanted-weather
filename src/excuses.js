import { fixDegrees } from './copy.js';

// excuses.js — the Excuse-o-matic: natural, cheeky excuses to bail on plans, based on today's real weather.
// Written separately in each language. Placeholders are filled with real data.

export const EXCUSES = {
  rain: {
    es: [
      'Tío, están cayendo chuzos de punta y me acabo de alisar el pelo. Si voy, voy en modo caniche. Mejor otro día.',
      'Me encantaría ir, de verdad, pero hay un {pop}% de probabilidad de lluvia y mis zapatillas son de tela. No pienso perder a un soldado.',
      'No llego. He bajado al portal, he visto el charco de la esquina y he tenido un flashback de la última vez.',
      'Con {temp} grados y lloviendo, el sofá me ha mirado a los ojos y me ha dicho «quédate». Y yo al sofá le tengo mucho respeto.',
      'Paso. El paraguas lo tiene mi hermana desde marzo y no voy a mojarme para ir a recuperarlo.',
      'Si salgo con esta lluvia llego con los calcetines como dos esponjas, y eso no hay amistad que lo aguante.',
    ],
    en: [
      "Mate, it's absolutely chucking it down and I've just straightened my hair. If I come, I come as a poodle. Rain check. Literally.",
      "I'd love to, honestly, but there's a {pop}% chance of rain and my trainers are canvas. I'm not losing a soldier today.",
      "Can't make it. I went down to the front door, saw the puddle on the corner and had a flashback to last time.",
      "It's {temp} degrees and raining. The sofa looked me dead in the eye and said 'stay'. I respect the sofa.",
      "I'll pass. My sister's had my umbrella since March and I'm not getting soaked to go and get it back.",
      'If I go out in this, I turn up with two sponges for socks. No friendship survives that.',
    ],
  },
  storm: {
    es: [
      'Hay tormenta eléctrica y yo soy básicamente un pararrayos con patas. No es miedo, es física.',
      'Ha caído un trueno tan gordo que el perro del vecino se ha mudado a mi casa. Tengo visita, no puedo salir.',
      'Con este cielo no bajo ni a por el pan. Si mañana sigo vivo, los cafés corren de mi cuenta.',
      'El cielo está montando un concierto de rock y no tengo entrada. Lo escucho desde casa, que se oye igual.',
      'He visto un relámpago, he contado hasta tres y he decidido que hoy no es mi día.',
    ],
    en: [
      "There's a thunderstorm and I'm basically a lightning rod with legs. It's not fear, it's physics.",
      'That thunderclap was so loud my neighbour\'s dog has moved in with me. I have a guest now, can\'t leave.',
      "I'm not even popping out for bread in this. If I'm still alive tomorrow, coffee's on me.",
      "The sky's putting on a rock concert and I haven't got a ticket. I'll listen from home, sounds the same.",
      'Saw a flash, counted to three and decided today is not my day.',
    ],
  },
  snow: {
    es: [
      'Está nevando y mis zapatos tienen el agarre de una pastilla de jabón. Si voy, llego rodando.',
      'No puedo, estoy ayudando a un muñeco de nieve a encontrarse a sí mismo. Es un momento delicado.',
      'Con {temp} grados y nieve, salir a la calle es deporte olímpico y yo no he entrenado.',
      'He mirado por la ventana, lo he visto todo blanco y he entendido que el universo me quiere en pijama.',
      'El coche está enterrado y la pala la tiene el vecino. El vecino no contesta. Imagina el drama.',
    ],
    en: [
      "It's snowing and my shoes have the grip of a bar of soap. If I come, I'll arrive rolling.",
      "Can't. I'm helping a snowman find himself. It's a sensitive time.",
      "It's {temp} degrees and snowing. Going outside is an Olympic sport and I haven't trained.",
      'Looked out of the window, saw nothing but white and understood the universe wants me in pyjamas.',
      "The car's buried and the neighbour has the shovel. The neighbour isn't answering. Picture the drama.",
    ],
  },
  fog: {
    es: [
      'Hay tanta niebla que no encuentro ni la puerta de casa. Sin puerta no hay salida. Lógica pura.',
      'Con esta niebla esto parece una peli de miedo, y en las pelis de miedo yo soy el primero que cae.',
      'No me veo ni la mano. Imagínate encontrarte a ti en mitad de la calle.',
      'Me he asomado y la ciudad ha desaparecido. Hasta que no vuelva, yo de aquí no me muevo.',
    ],
    en: [
      "The fog's so thick I can't even find my front door. No door, no leaving. Pure logic.",
      "It looks like a horror film out there, and in horror films I'm always the first to go.",
      "I can't see my own hand. Imagine trying to find you in the middle of the street.",
      "I looked outside and the city's gone. Until it comes back, I'm not moving.",
    ],
  },
  wind: {
    es: [
      'Hay rachas de {wind} kilómetros por hora y yo peso lo que peso. Si salgo, aparezco en otro código postal.',
      'Me he tirado veinte minutos peinándome y el viento me lo ha deshecho en dos segundos. Me niego a perder otra batalla.',
      'El viento se ha llevado mi gorra favorita y estoy de luto. Dame unos días.',
      'Salir con este viento es hacer parapente sin licencia. No me la juego.',
    ],
    en: [
      'Gusts of {wind} km/h and I weigh what I weigh. If I step outside, I land in another postcode.',
      'Spent twenty minutes on my hair and the wind undid it in two seconds. I refuse to lose another battle.',
      "The wind stole my favourite cap and I'm in mourning. Give me a few days.",
      "Going out in this wind is paragliding without a licence. I'm not risking it.",
    ],
  },
  heat: {
    es: [
      'Hace {temp} grados. Yo no salgo, yo me evaporo. Y evaporado no le sirvo a nadie.',
      'He tocado la manilla del coche y ahora tengo una marca de por vida. Hoy no conduzco.',
      'Con este calor el asfalto está más blando que mis principios. No pienso pisarlo.',
      'Estoy en modo ahorro de energía: ventilador, persiana bajada y cero movimientos innecesarios. Ir es un movimiento innecesario.',
      'Si salgo con este sol vuelvo convertido en gamba. Y las gambas no tienen vida social.',
    ],
    en: [
      "It's {temp} degrees. I don't go out, I evaporate. And evaporated, I'm no use to anyone.",
      "I touched the car door handle and now I've got a scar for life. Not driving today.",
      "The tarmac's softer than my principles right now. I'm not stepping on it.",
      "I'm in power-saving mode: fan on, blinds down, zero unnecessary moves. Going out is an unnecessary move.",
      "If I go out in this sun I'll come back a prawn. And prawns have no social life.",
    ],
  },
  cold: {
    es: [
      'Hace {temp} grados. He sacado un pie de la manta y lo he tenido que volver a meter por protocolo.',
      'Estoy en una relación muy seria con mi radiador y no quiero que se piense cosas raras si me voy.',
      'Con este frío se me han congelado hasta las ganas. Y sin ganas no se puede ir a ningún sitio.',
      'He intentado salir, pero el portal estaba tan frío que me ha dado los buenos días en otro idioma.',
      'Mi abrigo está en la tintorería y sin abrigo hoy soy un polo de hielo con patas.',
    ],
    en: [
      "It's {temp} degrees. I stuck one foot out from under the blanket and had to pull it back in, as per protocol.",
      "I'm in a very serious relationship with my radiator and I don't want it getting the wrong idea if I leave.",
      "It's so cold even my motivation froze. And without motivation, I can't go anywhere.",
      'I tried, but the front door was so cold it said good morning in another language.',
      "My coat's at the dry cleaner's, and without it I'm basically an ice lolly with legs.",
    ],
  },
  clouds: {
    es: [
      'El cielo está gris y yo, cuando el cielo está gris, entro en modo poeta. Hoy toca escribir, no salir.',
      'No llueve, pero amenaza. Y yo con amenazas no negocio.',
      'Hay un {humidity}% de humedad. Mi pelo y yo lo hemos hablado y nos quedamos en casa.',
      'El día está tan gris que pensaba que era domingo. Y ahora no me lo puedo quitar de la cabeza.',
    ],
    en: [
      "The sky's grey, and when the sky's grey I go into poet mode. Today's for writing, not going out.",
      "It's not raining, but it's threatening to. And I don't negotiate with threats.",
      "Humidity's at {humidity}%. My hair and I had a talk and we're staying in.",
      "The day's so grey I thought it was Sunday. Now I can't shake it.",
    ],
  },
  clear: {
    es: [
      'Hace un día tan bueno que me da pena gastarlo contigo en un sitio cerrado. Es por tu bien.',
      'Estoy haciendo la fotosíntesis en el balcón y si me muevo se corta el proceso.',
      'He salido a tender y el sol me ha atrapado. Ahora le pertenezco.',
      'Es un día perfecto. Demasiado perfecto. El cielo trama algo y no pienso caer en la trampa.',
    ],
    en: [
      "It's such a gorgeous day it'd be a crime to waste it with you somewhere indoors. It's for your own good.",
      "I'm photosynthesising on the balcony and if I move, the whole process stops.",
      'I went out to hang the washing and the sun caught me. I belong to it now.',
      "It's a perfect day. Too perfect. The sky's up to something and I'm not falling for it.",
    ],
  },
  night: {
    es: [
      'Son las {time} y ya es de noche. Mi cuerpo entiende «noche» como «pijama» y no hay quien lo convenza.',
      'Ha salido la luna y, cuando sale la luna, yo me pongo intenso. Mejor no arriesgarnos.',
      'Ya ha anochecido y las farolas de mi calle tienen una pinta muy sospechosa. Me quedo.',
    ],
    en: [
      "It's {time} and already dark. My body reads 'dark' as 'pyjamas' and there's no talking it round.",
      "The moon's out, and when the moon's out I get a bit intense. Let's not risk it.",
      "It's dark already and the street lights on my road look very suspicious. I'm staying put.",
    ],
  },
};

/** Which excuse pools fit today's weather (most specific first). */
export function excuseThemes(view) {
  const themes = [];
  if (view.kind === 'storm') themes.push('storm');
  else if (view.kind === 'rain') themes.push('rain');
  else if (view.kind === 'snow') themes.push('snow');
  else if (view.kind === 'fog') themes.push('fog');
  if (view.feels >= 30) themes.push('heat');
  if (view.feels <= 5) themes.push('cold');
  if (view.windKmh >= 30 || view.kind === 'wind') themes.push('wind');
  if (!themes.length) themes.push(view.kind === 'clear' && !view.night ? 'clear' : 'clouds');
  if (view.night) themes.push('night');
  return themes;
}

/** Every excuse available today, with real numbers filled in. Lines that need a number we don't have are skipped. */
export function excusePool(view, lang, facts) {
  const known = (line) => [...line.matchAll(/\{(\w+)\}/g)].every(([, k]) => facts[k] !== null && facts[k] !== undefined);
  const fill = (line) => fixDegrees(line.replace(/\{(\w+)\}/g, (_, k) => facts[k]));
  return excuseThemes(view).flatMap((theme) => EXCUSES[theme][lang].filter(known).map(fill));
}

/** Shuffle-bag picker: never repeats an excuse until all of today's have come out. */
export function makePicker(random = Math.random) {
  let bag = [];
  let last = null;
  return (pool) => {
    if (!bag.length || bag.some((x) => !pool.includes(x))) {
      bag = [...pool].sort(() => random() - 0.5);
      if (bag.length > 1 && bag[bag.length - 1] === last) bag.unshift(bag.pop());
    }
    last = bag.pop();
    return last;
  };
}
