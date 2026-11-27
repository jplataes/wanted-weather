# Wanted Weather — project brief for Claude Code

## Goal
A bilingual weather web app (Spanish by default, ES/EN toggle) built for the AI Maker programme (Project 2).
It is a real weather app (real data from a public API) presented as an irreverent open-world video game: your city is the map and today's weather is the mission.
It must make people say "I've never seen a weather app like this" and want to share it. Later it may become an installable mobile app (PWA), so build it mobile first.

## Who directs the work
The owner directs the project and does not write code. You write all the code.
- Before acting, explain in plain Spanish what you will do and why, in a few sentences, without code lessons.
- Work in small iterations. Propose a plan and wait for approval before any big change.
- One branch and one pull request per phase. Each PR description says, in plain language, what changed and "how to test it".
- Update PLAN.md at the end of every phase.
- Never invent facts. Product facts and requirements come from CONTENIDO.md. Humorous copy (missions, radio lines, poster titles) is yours to write, in both languages, following the tone below; the owner reviews it.

## Mandatory requirements (course syllabus)
1. Vite project with ES modules, one responsibility each (at least `api.js`, `dom.js`, `main.js`).
2. Real requests to the OpenWeatherMap API with `fetch` and `async/await` (current weather and 5-day forecast).
3. City search plus automatic location with the browser Geolocation API, with a fallback city if the user refuses.
4. Correct use of HTTP methods, endpoints, query parameters and JSON responses.
5. Useful error handling: city not found, invalid API key, no connection, API down, free-tier limit reached. Errors are shown in the game's style, never as a broken screen.
6. API key as an environment variable (`VITE_OPENWEATHER_API_KEY`), never in the code or in any commit.
7. Code on GitHub, published at a public URL.

## Features
1. HUD (main screen): city, big temperature, condition, details (feels like, humidity, wind, sunrise/sunset), a stylised minimap of the area and a 1 to 5 star "wanted level" that rates how rough the day is (rain, heat, cold, wind, storm). Extreme weather triggers a full-screen game-style banner (for example "¡EMPAPADO!" / "SOAKED!").
2. Mission of the day: a funny briefing with the objective and the recommended gear (what to wear or carry), based on the real forecast.
3. Radio: fictional stations that change with the weather. Music generated in the browser with the Web Audio API (synthwave, funk, lo-fi...), presenters read humorous forecast lines with the browser's Speech Synthesis API. Off by default, turned on with a button; volume and mute always available.
4. Movie poster of the day: an illustrated poster with the city, the weather and a film-style title (for example "MADRID: 38° OF FURY"), each weather type mapped to a film genre. Downloadable and shareable as an image.
5. City duel (mini-game): compare your city's weather with another city as a cheeky match scoreboard; shareable result.
6. The bet (mini-game): guess tomorrow's temperature, check the result the next day, earn "respect" points and streaks. Stored locally on the device.
7. Achievements that unlock with use (first storm, 7-day streak, duel won...).
8. Forecast for the next days presented as "upcoming missions".

## Visual direction
- Style of the irreverent open-world crime game genre: bold comic-book illustration, thick outlines, halftone dots, saturated sunset palettes (orange, magenta, purple, teal), skyline silhouettes, palm trees, cars, game HUD elements, satirical tone.
- Inspired by the genre, never a copy: do NOT use Rockstar or GTA names, logos, characters, fonts, artwork or HUD layouts. Use a free, openly licensed bold condensed display font and our own original drawings.
- All illustrations are drawn in code (SVG and CSS), animated where it adds value, light and consistent. Each weather type (clear, clouds, rain, storm, snow, fog, wind, night) has its own scene and palette.
- The whole interface reacts to the real weather and time of day.

## Tone of the texts
Cheeky, funny, street-smart, never offensive: no insults to groups, no real brands or real people, nothing about drugs or real crime. Bilingual, written natively in each language (not literal translations).

## Quality standards
- Semantic HTML and accessibility: contrast, keyboard navigation, visible focus, labels, alt texts, `aria-live` for results and errors. Sound never starts by itself.
- Respect `prefers-reduced-motion`.
- Fast on mobile: no heavy libraries without a reason, few requests, cache the last result, loading states in the game's style.
- No console errors. Validate with the W3C validator and PageSpeed before the final phase.

## Privacy and secrets
- This repository is public. Never include personal data, company data or real credentials.
- `.env` is in `.gitignore`; provide `.env.example` with empty variable names.
- Any key used in the browser is visible to visitors. Before publishing, explain the options in plain Spanish (for example a GitHub secret at build time vs. a small free proxy so the key never reaches the browser) and recommend one. Do not implement it until approved.

## Definition of done
All mandatory requirements and features working, live URL working on mobile and desktop, clear README (what it is, screenshots, live link, technologies, "built with AI"), PLAN.md complete.
