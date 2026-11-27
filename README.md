# Wanted Weather

A weather app that plays like an open-world game: real forecasts, wanted-level stars, extreme-weather alerts and (coming soon) missions, radio and shareable movie posters. Spanish by default, with an ES/EN switch. Built with AI for the AI Maker programme.

> 🚧 Work in progress. See [PLAN.md](PLAN.md) for the phases. Live link and screenshots arrive with the publishing step.

## What works now (phases 1–2)
- Real current weather from OpenWeatherMap for your location, with Madrid as the fallback if location is refused.
- City search, ES/EN switch (remembered), last result saved for an instant next visit.
- HUD: city, temperature, condition, feels like, humidity, wind, sunrise/sunset, an illustrated minimap with the real wind direction and a 1–5 star "wanted level".
- Full-screen game-style alert for extreme weather (rain, heat, cold, wind, storm).
- Errors explained in the game's style: city not found, invalid key, quota reached, no connection, service down.
- Mission of the day (objective, real intel and recommended gear) and the next days as "upcoming missions".
- Eight illustrated scenes with their own characters, a "living screen" layer (rain on the glass, snow, fog, gusts, lightning, heat haze, frost) and a daylight countdown.
- A mission phone call from "Uncle Isobar": the phone rings silently on screen and the voice (Speech Synthesis) only plays when you answer.

## Run it locally
```bash
npm install
cp .env.example .env   # then put your OpenWeatherMap key in VITE_OPENWEATHER_API_KEY
npm run dev
```
Tests: `npm test`.

Test helpers: add `?alerta=storm` (or `rain`, `heat`, `cold`, `wind`) to the URL to see an alert, `?escena=snow` (`sun`, `clouds`, `rain`, `storm`, `snow`, `fog`, `wind`, `night`) to force a scene, `?efecto=rain` (`storm`, `snow`, `fog`, `wind`, `heat`, `cold`, `none`) to force the screen effect and `?llamada=1` to get the phone call again.

## How the API key is protected
The published app never contains the key. It calls a tiny Cloudflare Worker (`worker/`) that adds the key on the server and only answers requests from the app's own website. The key is stored as a secret in Cloudflare and in GitHub Actions, never in the code.

## Structure
- `src/api.js` – requests to the weather service and error handling
- `src/dom.js` – everything drawn on the page
- `src/main.js` – starts the app and connects actions, data and drawing
- `src/weather.js` – game logic: wanted level, scenes, formatting
- `src/forecast.js`, `src/missions.js` – daily forecast summary, mission of the day and gear
- `src/call.js`, `src/fx.js` – the mission phone call and the living-screen effects
- `src/i18n.js`, `src/copy.js` – texts in Spanish and English
- `src/scenes.js`, `src/minimap.js`, `src/icons.js` – illustrations drawn in SVG
- `src/geo.js`, `src/storage.js` – location and saved data
- `worker/` – the Cloudflare Worker proxy
- `muestra/` – the visual style guide (phase 0)

## Technologies
Vite, plain JavaScript (ES modules), SVG and CSS, OpenWeatherMap API, Cloudflare Workers, GitHub Pages. Fonts: Anton, Bangers and Barlow (SIL Open Font License).

## Credits
Weather data: [OpenWeatherMap](https://openweathermap.org/). Made by [Javier Plata](https://www.linkedin.com/in/javierplata/) · [GitHub](https://github.com/jplataes). Built with AI.
