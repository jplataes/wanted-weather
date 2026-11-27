# PLAN — Wanted Weather

Plan por fases aprobado por el propietario. Cada fase va en su propia rama y su propio pull request, con una explicación sencilla, una sección "Cómo probarlo" y una sección "Conceptos del curso". Al terminar cada fase se actualiza este archivo.

Leyenda de estado: ⬜ pendiente · 🟨 en curso · ✅ terminada

## Decisiones tomadas
- **Protección de la API key:** opción B, un pequeño intermediario gratuito en Cloudflare Workers. La key se guarda solo en Cloudflare y nunca llega al navegador. La web se publica en GitHub Pages.
- **Key para desarrollo:** el propietario la ha añadido como variable de entorno `VITE_OPENWEATHER_API_KEY` en el entorno de trabajo. Nunca se pega en el chat ni se sube al repositorio.
- **Ramas:** una rama nueva y un PR por fase.

## Fases

### ✅ Fase 0 — Dirección visual (pendiente de aprobación del propietario)
- **Qué se hace:** una página de muestra con la paleta, la tipografía, los elementos del HUD (estrellas, minimapa, botones, buscador, selector ES/EN), el cartel de tiempo extremo y tres escenas de ejemplo (sol, lluvia y noche) dibujadas en SVG.
- **Ajustes v2 (pedidos por el propietario):** más actitud y efecto wow. Portada de videojuego, personajes en silueta en cada escena, alertas con efecto propio (lluvia, calor, frío, viento, tormenta), escenas con movimiento en capas y una sala de guionistas con 2–3 opciones de texto por elemento en ES y EN.
- **Qué verás:** la página `muestra/index.html`, publicada también como página privada para verla en el móvil.
- **Condición:** no se empieza la fase 1 hasta que el propietario apruebe la muestra.

### ⬜ Fase 1 — HUD con datos reales
- **Qué se hace:** proyecto Vite con módulos separados (`api.js`, `dom.js`, `main.js` y textos ES/EN). Ubicación automática con Madrid como ciudad de respaldo, buscador de ciudades y el HUD completo: ciudad, temperatura, estado, sensación térmica, humedad, viento, salida y puesta de sol, minimapa y nivel de 1 a 5 estrellas. Cartel a pantalla completa con tiempo extremo. Errores con el estilo del juego, carga con estilo y último resultado guardado. Intermediario de Cloudflare Workers y publicación en GitHub Pages.
- **Qué verás:** la app con el tiempo real de tu ciudad en una URL pública, en español o inglés, en móvil y ordenador.

### ⬜ Fase 2 — Misión del día y próximas misiones
- **Qué se hace:** previsión de 5 días como "próximas misiones" y la misión del día (objetivo y equipo recomendado). Las 8 escenas completas (despejado, nubes, lluvia, tormenta, nieve, niebla, viento, noche) y una interfaz que cambia con el tiempo y la hora.
- **Qué verás:** una pantalla distinta cada día, con textos de humor en los dos idiomas para revisar.

### ⬜ Fase 3 — La radio
- **Qué se hace:** emisoras inventadas según el tiempo, música generada en el navegador y locutores que leen la previsión. Apagada al entrar, con volumen y silencio siempre a mano.
- **Qué verás:** un botón de radio con banda sonora del día.

### ⬜ Fase 4 — Checkpoint a mitad de camino
- **Qué se hace:** revisión con dos miradas. Un desarrollador experto revisa código, rendimiento, accesibilidad y errores. Un usuario normal comprueba si entiende el tiempo en 3 segundos y si se lo pasa bien.
- **Qué verás:** un informe corto con lo que está bien y lo que hay que corregir. El propietario decide qué se arregla antes de seguir.

### ⬜ Fase 5 — Póster de película
- **Qué se hace:** un cartel ilustrado del día ("MADRID: 38° DE FURIA") con un género de cine para cada tipo de tiempo.
- **Qué verás:** un póster que se descarga y se comparte como imagen.

### ⬜ Fase 6 — Duelo de ciudades
- **Qué se hace:** tu ciudad contra otra, como un marcador de partido con guasa.
- **Qué verás:** un resultado que se puede compartir.

### ⬜ Fase 7 — La apuesta
- **Qué se hace:** adivinar la temperatura de mañana, comprobarla al día siguiente y ganar puntos de "respeto" y rachas, guardados en el dispositivo.
- **Qué verás:** un motivo para volver cada día.

### ⬜ Fase 8 — Logros
- **Qué se hace:** logros que se desbloquean con el uso (primera tormenta, racha de 7 días, duelo ganado...).
- **Qué verás:** avisos de logro conseguido y una vitrina con todos.

### ⬜ Fase 9 — Pulido, validación y publicación
- **Qué se hace:** accesibilidad, modo de "menos movimiento", validador del W3C, PageSpeed, cero errores de consola, README con capturas, enlace y "hecho con IA", y publicación final.
- **Qué verás:** la URL definitiva lista para entregar.

## Registro de fases
- **Fase 0:** página de muestra creada en `muestra/index.html`. Paleta de atardecer, tipografías Anton, Bangers y Barlow (licencia libre OFL), estrellas, minimapa, botones, cartel "¡EMPAPADO!" y escenas de sol, lluvia y noche dibujadas en SVG. Aprobada como base. Versión 2 con más chulería, personajes y efectos, a la espera de que el propietario elija los textos.
