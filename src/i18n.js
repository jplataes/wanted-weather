// i18n.js — interface texts in Spanish (default) and English, and the chosen language.
import { local } from './storage.js';

const STRINGS = {
  es: {
    skip: 'Saltar al contenido',
    langGroup: 'Idioma',
    searchLabel: 'Buscar ciudad',
    searchPlaceholder: '¿A qué ciudad vamos, jefe?',
    go: '¡Dale!',
    locate: 'Localízame',
    emptySearch: 'Escribe una ciudad primero, jefe.',
    localTime: 'Hora local {time}',
    feelsLike: 'Sensación',
    humidity: 'Humedad',
    wind: 'Viento',
    sunrise: 'Amanecer',
    sunset: 'Atardecer',
    details: 'Detalles del día',
    starsAria: 'Nivel de peligro: {n} de 5 estrellas',
    windFrom: 'Viento del {dir}',
    compass: ['norte', 'nordeste', 'este', 'sudeste', 'sur', 'suroeste', 'oeste', 'noroeste'],
    minimapAria: 'Minimapa ilustrado de {city}. La flecha turquesa marca hacia dónde sopla el viento.',
    sceneAria: {
      sun: 'Atardecer en la ciudad: sol rayado, palmeras y un tipo con gafas de sol apoyado en su coche',
      rain: 'Ciudad bajo la lluvia: un coche con los faros puestos y alguien que corre tapándose con un periódico',
      night: 'Noche en la ciudad: alguien sale del local 24H con un café humeante',
    },
    updatedNow: 'Actualizado ahora mismo',
    updatedMin: 'Actualizado hace {n} min',
    showingSaved: 'Mostrando los últimos datos guardados',
    loading: 'Cargando el mapa…',
    loadingCity: 'Buscando {city}…',
    geoDenied: 'Sin permiso de ubicación: te soltamos en {city}.',
    geoFailed: 'No hemos podido localizarte: te soltamos en {city}.',
    geoDeniedShort: 'Sin permiso de ubicación. Seguimos donde estabas.',
    geoFailedShort: 'No hemos podido localizarte. Seguimos donde estabas.',
    retry: 'Reintentar',
    backHome: 'Volver a {city}',
    closeAlert: 'Recibido, jefe',
    footerMade: 'Hecho con IA para el programa AI Maker.',
    footerData: 'Datos del tiempo',
    errors: {
      notFound: { title: '¡Fuera del mapa!', body: 'No encontramos «{city}». Revisa cómo se escribe o prueba con otra ciudad.' },
      badKey: { title: '¡Pase rechazado!', body: 'El servicio del tiempo no acepta nuestra clave. No es culpa tuya: el equipo tiene que revisarlo.' },
      limit: { title: '¡Cupo quemado!', body: 'Hemos hecho demasiadas consultas seguidas. Espera un minuto y vuelve a intentarlo.' },
      offline: { title: '¡Sin cobertura!', body: 'No hay conexión a internet. Comprueba tu red y vuelve a intentarlo.' },
      timeout: { title: '¡El satélite no contesta!', body: 'El servicio del tiempo tarda demasiado. Prueba otra vez en un momento.' },
      down: { title: '¡Satélite caído!', body: 'El servicio del tiempo no responde ahora mismo. Vuelve a intentarlo en unos minutos.' },
      config: { title: '¡Falta una pieza!', body: 'La app no está bien configurada para pedir el tiempo. El equipo tiene que revisarla.' },
      unknown: { title: '¡Algo ha petado!', body: 'Ha pasado algo raro al pedir el tiempo. Vuelve a intentarlo.' },
    },
  },
  en: {
    skip: 'Skip to content',
    langGroup: 'Language',
    searchLabel: 'Search city',
    searchPlaceholder: 'Where to, boss?',
    go: 'Hit it',
    locate: 'Find me',
    emptySearch: 'Type a city first, boss.',
    localTime: 'Local time {time}',
    feelsLike: 'Feels like',
    humidity: 'Humidity',
    wind: 'Wind',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    details: "Today's details",
    starsAria: 'Danger level: {n} out of 5 stars',
    windFrom: 'Wind from the {dir}',
    compass: ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'],
    minimapAria: 'Illustrated minimap of {city}. The teal arrow shows where the wind is blowing.',
    sceneAria: {
      sun: 'Sunset in the city: a striped sun, palm trees and a guy in shades leaning on his car',
      rain: 'City in the rain: a car with its headlights on and someone running with a newspaper over their head',
      night: 'Night in the city: someone walks out of the 24H store with a steaming coffee',
    },
    updatedNow: 'Updated just now',
    updatedMin: 'Updated {n} min ago',
    showingSaved: 'Showing the last saved data',
    loading: 'Loading the map…',
    loadingCity: 'Looking for {city}…',
    geoDenied: 'No location access: we dropped you in {city}.',
    geoFailed: "We couldn't find you: we dropped you in {city}.",
    geoDeniedShort: 'No location access. Staying where you were.',
    geoFailedShort: "We couldn't find you. Staying where you were.",
    retry: 'Try again',
    backHome: 'Back to {city}',
    closeAlert: 'Copy that',
    footerMade: 'Built with AI for the AI Maker programme.',
    footerData: 'Weather data',
    errors: {
      notFound: { title: 'Off the map!', body: 'We couldn\'t find "{city}". Check the spelling or try another city.' },
      badKey: { title: 'Pass rejected!', body: 'The weather service rejected our key. Not your fault: the crew needs to fix it.' },
      limit: { title: 'Quota burned!', body: 'Too many requests in a row. Wait a minute and try again.' },
      offline: { title: 'No signal!', body: "You're offline. Check your connection and try again." },
      timeout: { title: "Satellite's not answering!", body: 'The weather service is taking too long. Try again in a moment.' },
      down: { title: 'Satellite down!', body: "The weather service isn't responding right now. Try again in a few minutes." },
      config: { title: 'Missing piece!', body: "The app isn't set up to fetch the weather. The crew needs to check it." },
      unknown: { title: 'Something blew up!', body: 'Something odd happened while fetching the weather. Try again.' },
    },
  },
};

const LANG_KEY = 'ww.lang';
let current = local.get(LANG_KEY) === 'en' ? 'en' : 'es';

export const getLang = () => current;

export function setLang(lang) {
  current = lang === 'en' ? 'en' : 'es';
  local.set(LANG_KEY, current);
  document.documentElement.lang = current;
}

/**
 * Text for a key such as "errors.notFound.title", with {placeholders} filled in.
 * Returns arrays and objects as they are.
 */
export function t(key, vars = {}) {
  const value = key.split('.').reduce((node, part) => (node == null ? node : node[part]), STRINGS[current]);
  if (typeof value !== 'string') return value ?? key;
  return value.replace(/\{(\w+)\}/g, (_, name) => (name in vars ? vars[name] : `{${name}}`));
}
