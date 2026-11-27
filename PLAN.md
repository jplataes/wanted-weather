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
- **Estructura de la app (decidida tras la fase 2):** para que todo tenga coherencia y no sea un scroll infinito, la app se organiza en zonas, como el menú de un juego, con una barra de pestañas (abajo en móvil, arriba en ordenador):
  - **Calle:** el tiempo de un vistazo. Escena, temperatura, estrellas, detalles, minimapa y un resumen de la misión de hoy.
  - **Misiones:** el dossier completo, la llamada del Tío Isobaras y las próximas misiones.
  - **Recreativos:** los minijuegos como máquinas de un salón recreativo (Excusómetro, Esquiva el chaparrón, duelo, apuesta).
  - **Fama** (llega con el póster): póster, logros, respeto y apodo.
  - **La radio** no es una zona: es la autorradio del coche, una barra fija siempre a mano en cualquier zona.
- **Voces de la app (decidido tras la fase 3):**
  - **La radio es la ciudad:** da el tiempo de vez en cuando y, entre medias, cuñas de publicidad inventadas, partes de tráfico absurdos, dedicatorias y consejos de abuela. No habla de tu misión.
  - **El Tío Isobaras es tu juego:** el contacto personal, gamberro y con toque de cuñado ("Hazme caso, que de esto yo sé un rato"). Da la misión, el equipo y su consejo de cuñado, y es el narrador que une los minijuegos: llamará para las alertas de tiempo extremo, el resultado de la apuesta (fase 7), los logros y el apodo (fase 8) y los retos de duelo (fase 6).
- **Los más buscados del planeta:** solo si puede ser dinámico, revisando a diario las ciudades más grandes del mundo y eligiendo las de peor tiempo de ese momento, nunca una lista fija de ganadoras. Se valora en la fase 6; si no se puede hacer bien con el plan gratuito, se descarta.

## Fases

### ✅ Fase 0 — Dirección visual
- **Qué se hace:** una página de muestra con la paleta, la tipografía, los elementos del HUD (estrellas, minimapa, botones, buscador, selector ES/EN), el cartel de tiempo extremo y tres escenas de ejemplo (sol, lluvia y noche) dibujadas en SVG.
- **Ajustes v2 (pedidos por el propietario):** más actitud y efecto wow. Portada de videojuego, personajes en silueta en cada escena, alertas con efecto propio (lluvia, calor, frío, viento, tormenta), escenas con movimiento en capas y una sala de guionistas con 2–3 opciones de texto por elemento en ES y EN.
- **Qué verás:** la página `muestra/index.html`, publicada también como página privada para verla en el móvil.
- **Resultado:** aprobada por el propietario.

### ✅ Fase 1 — HUD con datos reales
- **Qué se hace:** proyecto Vite con módulos separados (`api.js`, `dom.js`, `main.js` y textos ES/EN). Ubicación automática con Madrid como ciudad de respaldo, buscador de ciudades y el HUD completo: ciudad, temperatura, estado, sensación térmica, humedad, viento, salida y puesta de sol, minimapa y nivel de 1 a 5 estrellas. Cartel a pantalla completa con tiempo extremo. Errores con el estilo del juego, carga con estilo y último resultado guardado. Intermediario de Cloudflare Workers y publicación en GitHub Pages.
- **Qué verás:** la app con el tiempo real de tu ciudad en una URL pública, en español o inglés, en móvil y ordenador.

### ✅ Fase 2 — Misión del día y próximas misiones
- **Qué se hace:** previsión de 5 días como "próximas misiones" y la misión del día (objetivo y equipo recomendado). Las 8 escenas completas (despejado, nubes, lluvia, tormenta, nieve, niebla, viento, noche) y una interfaz que cambia con el tiempo y la hora. **Llamada de teléfono de la misión:** un contacto ficticio te llama y te cuenta la misión con voz sintetizada. **Pantalla viva:** gotas que resbalan por el cristal, calima, escarcha en los bordes y relámpagos que iluminan la interfaz.
- **Qué verás:** una pantalla distinta cada día, con textos de humor en los dos idiomas para revisar.

### ✅ Fase 3 — Estructura por zonas, autorradio y Excusómetro
- **Qué se hace:** la navegación por zonas (Calle, Misiones, Recreativos) con un resumen de la misión en Calle que rellena el hueco de ordenador. Una **autorradio** siempre a mano con emisoras inventadas según el tiempo, música generada en el navegador y locutores que leen la previsión real con humor; apagada al entrar, con volumen y silencio siempre visibles. Y el **Excusómetro**: una tragaperras que te da una excusa natural y gamberra, con datos reales de hoy, para escaquearte de un plan, lista para compartir.
- **Qué verás:** una app ordenada que se entiende de un vistazo, con banda sonora y el primer minijuego.

### ⬜ Fase 4 — Checkpoint a mitad de camino
- **Qué se hace:** revisión con dos miradas. Un desarrollador experto revisa código, rendimiento, accesibilidad y errores. Un usuario normal comprueba si entiende el tiempo en 3 segundos y si se lo pasa bien.
- **Qué verás:** un informe corto con lo que está bien y lo que hay que corregir. El propietario decide qué se arregla antes de seguir.

### ⬜ Fase 5 — Póster de película y zona Fama
- **Qué se hace:** un cartel ilustrado del día ("MADRID: 38° DE FURIA") con un género de cine para cada tipo de tiempo. Estrena la zona Fama.
- **Qué verás:** un póster que se descarga y se comparte como imagen, también en formato vertical para stories (9:16).

### ⬜ Fase 6 — Duelo de ciudades (y los más buscados, si puede ser dinámico)
- **Qué se hace:** tu ciudad contra otra, como un marcador de partido con guasa, en Recreativos. El Tío Isobaras te llama para retarte. Si es viable con el plan gratuito, "Los más buscados del planeta": las ciudades grandes con peor tiempo en ese momento, calculadas cada pocas horas.
- **Qué verás:** un resultado que se puede compartir, también como tarjeta vertical para stories.

### ⬜ Fase 7 — La apuesta y "Esquiva el chaparrón"
- **Qué se hace:** adivinar la temperatura de mañana, comprobarla al día siguiente y ganar puntos de "respeto" y rachas, guardados en el dispositivo. Y el minijuego arcade "Esquiva el chaparrón": 20 segundos esquivando lo que cae según el tiempo real, que también da respeto. El Tío Isobaras te llama al día siguiente con el resultado de la apuesta.
- **Qué verás:** un motivo para volver cada día, y un apodo de jugador que cambia con tus rachas (por ejemplo "Rey del Chubasco").

### ⬜ Fase 8 — Logros
- **Qué se hace:** logros que se desbloquean con el uso (primera tormenta, racha de 7 días, duelo ganado...). El Tío Isobaras llama para darte la noticia.
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
  - Publicada en https://jplataes.github.io/wanted-weather/ con el intermediario en Cloudflare. Comprobado en vivo: datos reales, key protegida y web ajena bloqueada.
  - **Limitación conocida:** el nombre de la ciudad sale como lo da la API; por ejemplo, con ubicación puede salir "Seville" en vez de "Sevilla". Se puede resolver en la fase 2 con la búsqueda de nombres locales de OpenWeatherMap.
- **Fase 2:** previsión a 5 días convertida en misiones. Incluye:
  - **Misión del día** con aspecto de dossier "Confidencial": título, objetivo, información real (temperaturas, lluvia, viento, puesta de sol) y equipo recomendado con iconos propios.
  - **Próximas misiones:** una tarjeta por día con icono, máxima y mínima, estrellas y nombre en clave.
  - **Las 8 escenas**, cada una con su personaje (paseo del perro, paraguas dado la vuelta, muñeco de nieve con gafas, tipo de gabardina en la niebla, persecución de la gorra). Velo nocturno en todas cuando es de noche.
  - **Llamada del Tío Isobaras:** el teléfono vibra en pantalla una vez al día y la voz solo suena al contestar. Lleva subtítulos y se puede repetir con un botón.
  - **Pantalla viva:** gotas en el cristal, nieve, niebla, ráfagas, relámpagos, calima o escarcha según el tiempo real.
  - **Sexta caja:** cuenta atrás de luz restante (o de amanecer) con barra de progreso.
  - **Arreglos:**
    - Nombre de la ciudad en el idioma de la app ("Sevilla", "Tokio").
    - La frase de nivel 1 que hablaba de nubes cambia a "Nadie te busca hoy".
    - Los días de previsión incompletos ya no se muestran.
  - Intermediario con dos rutas nuevas, `/api/geocode` y `/api/reverse`.
  - 26 pruebas automáticas y prueba completa en navegador.
- **Ajustes tras la fase 2 (pedidos por el propietario):** el logo vuelve al inicio, y la tarjeta del HUD ya no tapa la calle donde están los personajes.
- **Fase 3:** la app se ordena en zonas con pestañas (abajo en móvil, arriba en ordenador). Incluye:
  - **Calle:** escena, temperatura, detalles y un resumen de la misión, que rellena el hueco de ordenador.
  - **Misiones:** el dossier, la llamada y los próximos días. La pestaña muestra un punto si hay una llamada perdida.
  - **Recreativos:** el **Excusómetro**, una tragaperras de tres rodillos que da excusas naturales y gamberras con datos reales de hoy (unas 45 por idioma, escritas aparte en cada uno), con copiar y compartir. Las próximas máquinas salen "fuera de servicio".
  - **Autorradio** fija en todas las zonas: cuatro emisoras inventadas (Neón Nocturno, Sol de Justicia FM, Lo-Fi Chaparrón y Radio Tormenta), cada una con su música generada en el navegador y su locutor. Los locutores leen frases con los datos reales de hoy.
    - La emisora recomendada cambia con el tiempo.
    - Está apagada al entrar; el volumen y el silencio están siempre visibles.
    - Cuando entra la llamada del Tío Isobaras, la radio baja sola.
  - **Ajustes pedidos por el propietario:**
    - La palanca del Excusómetro es una palanca de verdad: se arrastra hacia abajo, se pulsa o se usa con el teclado.
    - La radio se esconde en una burbuja: deslizándola en el móvil o con su botón, y vuelve con un toque. Empieza escondida en el móvil y visible en ordenador, y se recuerda la elección. Si suena, el silencio sigue a mano en la burbuja.
  - 32 pruebas automáticas y prueba completa en navegador, en móvil y en ordenador.
- **Voces (tras la fase 3):**
  - La radio deja de repetir la misión: el tiempo cada tres turnos, y entre medias 16 piezas por idioma de publicidad inventada, tráfico, dedicatorias y consejos de abuela.
  - El Tío Isobaras gana su toque de cuñado: un consejo según el tiempo en cada llamada, que también sale escrito en el dossier.
  - Corregido "1 grados" → "1 grado".
