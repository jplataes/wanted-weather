# PLAN — Wanted Weather

Plan por fases aprobado por el propietario. Cada fase va en su propia rama y su propio pull request, con una explicación sencilla, una sección "Cómo probarlo" y una sección "Conceptos del curso". Al terminar cada fase se actualiza este archivo.

Leyenda de estado: ⬜ pendiente · 🟨 en curso · ✅ terminada

## Decisiones tomadas
- **Protección de la API key:** opción B, un pequeño intermediario gratuito en Cloudflare Workers. La key se guarda solo en Cloudflare y nunca llega al navegador. La web se publica en GitHub Pages.
- **Key para desarrollo:** el propietario la ha añadido como variable de entorno `VITE_OPENWEATHER_API_KEY` en el entorno de trabajo. Nunca se pega en el chat ni se sube al repositorio.
- **Ramas:** una rama nueva y un PR por fase.
- **Textos (fase 0):** el propietario lo deja en manos de Claude y pide fusionarlo todo. Los niveles de estrellas, las alertas y el lema rotan entre las 3 opciones de cada uno: se elige una por ciudad y día, para que cada visita sorprenda sin cambiar a cada segundo. Los botones llevan un texto fijo para que se entiendan siempre: "¡Dale!", "¿A qué ciudad vamos, jefe?", "Localízame", "Dale caña a la radio" y "Recibido, jefe" (en inglés: "Hit it", "Where to, boss?", "Find me", "Crank the radio", "Copy that").
- **Ideas de enganche aprobadas:** llamada de teléfono de la misión y pantalla viva (fase 2), tarjeta vertical para stories (fases 5 y 6) y apodo de jugador según tus rachas (fases 7 y 8).
- **Estilo:** con la actitud del género de mundo abierto, sin copiar nada propio de GTA (nombres, logos, letras, diseños ni frases).

## Fases

### ✅ Fase 0 — Dirección visual
- **Qué se hace:** una página de muestra con la paleta, la tipografía, los elementos del HUD (estrellas, minimapa, botones, buscador, selector ES/EN), el cartel de tiempo extremo y tres escenas de ejemplo (sol, lluvia y noche) dibujadas en SVG.
- **Ajustes v2 (pedidos por el propietario):** más actitud y efecto wow. Portada de videojuego, personajes en silueta en cada escena, alertas con efecto propio (lluvia, calor, frío, viento, tormenta), escenas con movimiento en capas y una sala de guionistas con 2–3 opciones de texto por elemento en ES y EN.
- **Qué verás:** la página `muestra/index.html`, publicada también como página privada para verla en el móvil.
- **Resultado:** aprobada por el propietario.

### 🟨 Fase 1 — HUD con datos reales (hecha; falta publicarla)
- **Qué se hace:** proyecto Vite con módulos separados (`api.js`, `dom.js`, `main.js` y textos ES/EN). Ubicación automática con Madrid como ciudad de respaldo, buscador de ciudades y el HUD completo: ciudad, temperatura, estado, sensación térmica, humedad, viento, salida y puesta de sol, minimapa y nivel de 1 a 5 estrellas. Cartel a pantalla completa con tiempo extremo. Errores con el estilo del juego, carga con estilo y último resultado guardado. Intermediario de Cloudflare Workers y publicación en GitHub Pages.
- **Qué verás:** la app con el tiempo real de tu ciudad en una URL pública, en español o inglés, en móvil y ordenador.

### ⬜ Fase 2 — Misión del día y próximas misiones
- **Qué se hace:** previsión de 5 días como "próximas misiones" y la misión del día (objetivo y equipo recomendado). Las 8 escenas completas (despejado, nubes, lluvia, tormenta, nieve, niebla, viento, noche) y una interfaz que cambia con el tiempo y la hora. **Llamada de teléfono de la misión:** un contacto ficticio te llama y te cuenta la misión con voz sintetizada. **Pantalla viva:** gotas que resbalan por el cristal, calima, escarcha en los bordes y relámpagos que iluminan la interfaz.
- **Qué verás:** una pantalla distinta cada día, con textos de humor en los dos idiomas para revisar.

### ⬜ Fase 3 — La radio
- **Qué se hace:** emisoras inventadas según el tiempo, música generada en el navegador y locutores que leen la previsión. Apagada al entrar, con volumen y silencio siempre a mano.
- **Qué verás:** un botón de radio con banda sonora del día.

### ⬜ Fase 4 — Checkpoint a mitad de camino
- **Qué se hace:** revisión con dos miradas. Un desarrollador experto revisa código, rendimiento, accesibilidad y errores. Un usuario normal comprueba si entiende el tiempo en 3 segundos y si se lo pasa bien.
- **Qué verás:** un informe corto con lo que está bien y lo que hay que corregir. El propietario decide qué se arregla antes de seguir.

### ⬜ Fase 5 — Póster de película
- **Qué se hace:** un cartel ilustrado del día ("MADRID: 38° DE FURIA") con un género de cine para cada tipo de tiempo.
- **Qué verás:** un póster que se descarga y se comparte como imagen, también en formato vertical para stories (9:16).

### ⬜ Fase 6 — Duelo de ciudades
- **Qué se hace:** tu ciudad contra otra, como un marcador de partido con guasa.
- **Qué verás:** un resultado que se puede compartir, también como tarjeta vertical para stories.

### ⬜ Fase 7 — La apuesta
- **Qué se hace:** adivinar la temperatura de mañana, comprobarla al día siguiente y ganar puntos de "respeto" y rachas, guardados en el dispositivo.
- **Qué verás:** un motivo para volver cada día, y un apodo de jugador que cambia con tus rachas (por ejemplo "Rey del Chubasco").

### ⬜ Fase 8 — Logros
- **Qué se hace:** logros que se desbloquean con el uso (primera tormenta, racha de 7 días, duelo ganado...).
- **Qué verás:** avisos de logro conseguido y una vitrina con todos.

### ⬜ Fase 9 — Pulido, validación y publicación
- **Qué se hace:** accesibilidad, modo de "menos movimiento", validador del W3C, PageSpeed, cero errores de consola, README con capturas, enlace y "hecho con IA", y publicación final.
- **Qué verás:** la URL definitiva lista para entregar.

## Registro de fases
- **Fase 0:** página de muestra creada en `muestra/index.html`. Paleta de atardecer, tipografías Anton, Bangers y Barlow (licencia libre OFL), estrellas, minimapa, botones, cartel "¡EMPAPADO!" y escenas de sol, lluvia y noche dibujadas en SVG. Aprobada. Versión 2 con más chulería, personajes y efectos. Textos fusionados: rotan entre las opciones propuestas. Fase cerrada.
- **Fase 1:** app Vite con módulos separados y datos reales de OpenWeatherMap. Incluye:
  - Ubicación automática con Madrid de respaldo, buscador e idioma ES/EN recordado.
  - HUD completo con escena ilustrada, minimapa propio de cada ciudad con el viento real y nivel de estrellas.
  - Alerta a pantalla completa con tiempo extremo y errores con estilo de juego.
  - Pantalla de carga de portada y último resultado guardado.
  - Intermediario de Cloudflare Workers con la key protegida y publicación automática en GitHub Pages.
  - 15 pruebas automáticas y prueba completa en navegador con la API real.
  - **Pendiente para publicar:** que el propietario añada 3 secretos en GitHub y active GitHub Pages.
  - **Limitación conocida:** el nombre de la ciudad sale como lo da la API; por ejemplo, con ubicación puede salir "Seville" en vez de "Sevilla". Se puede resolver en la fase 2 con la búsqueda de nombres locales de OpenWeatherMap.
