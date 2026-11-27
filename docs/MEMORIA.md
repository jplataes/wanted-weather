# Wanted Weather — Memoria del proyecto

**Proyecto 2 · AI Maker**
**Web:** https://jplataes.github.io/wanted-weather/

## La idea

Quería hacer una app del tiempo que no se pareciera a ninguna otra. Se me ocurrió presentarla como un videojuego gamberro de mundo abierto. Tu ciudad es el mapa y el tiempo de hoy es tu misión. Pero los datos tenían que ser reales, porque al final es una app del tiempo de verdad.

Lo que hace:

- Te enseña el tiempo de tu ciudad con un **nivel de "se busca" de 1 a 5 estrellas** según lo duro que venga el día. Si hace un tiempo extremo, sale un cartel a pantalla completa tipo "¡EMPAPADO!".
- Cada tipo de tiempo tiene **su propia escena dibujada**: sol, nubes, lluvia, tormenta, nieve, niebla, viento y noche. También tiene efectos en la pantalla, como gotas en el cristal o relámpagos.
- Te da la **misión del día**, con qué ponerte o qué llevar, y los próximos días como "próximas misiones".
- Un personaje, **el Tío Isobaras**, te llama por teléfono para contarte la misión. Es un poco cuñado y siempre sabe más que nadie.
- Tiene una **radio** con emisoras inventadas, música hecha por la propia web y locutores que dan el tiempo entre anuncios absurdos.
- Hay **minijuegos**, todos basados en el tiempo de ese día:
  - una tragaperras de excusas para no salir;
  - un duelo entre ciudades;
  - una apuesta para adivinar la temperatura de mañana;
  - un juego de esquivar lo que cae del cielo.
- Puedes sacar el **póster de película del día** (por ejemplo, "MADRID: 38° DE FURIA") y compartirlo. Además vas ganando logros y subiendo de apodo hasta llegar a lo más alto.

Funciona en español y en inglés, y está pensada sobre todo para el móvil.

## Cómo la he hecho

Yo no sé programar, así que mi papel ha sido **dirigir el proyecto**. El código lo ha escrito la IA (Claude Code). Yo decidía qué quería, revisaba cada entrega en el móvil y pedía cambios hasta que me convencía.

Para que no fuera un caos, empecé preparando dos documentos:

- uno con las **instrucciones del proyecto**: objetivo, requisitos del módulo, tono de los textos y nivel de calidad;
- otro con el **contenido**, para que la IA no se inventara nada.

Con eso le pedí un **plan por fases**. Lo revisé, le hice cambios y lo aprobé antes de empezar. Cada fase iba por separado. La IA me explicaba qué iba a hacer, lo hacía, yo lo probaba en la web publicada y, si estaba bien, pasábamos a la siguiente. Al final han sido **10 fases y 14 entregas**.

### Lo que fui cambiando por el camino

- **La primera muestra visual no me convenció.** Le faltaba actitud y efecto "wow", así que pedí rehacerla con más personajes, más efectos y textos más gamberros.
- **Tras las primeras fases vi que aquello era un scroll infinito.** Pedí organizarlo como el menú de un juego, en cuatro zonas: Calle, Misiones, Recreativos y Fama.
- **La radio y el Tío Isobaras decían lo mismo.** Decidí separarlos:
  - la radio es "la ciudad" (anuncios, tráfico, dedicatorias);
  - el Tío Isobaras es tu contacto personal. Lo de que fuera un poco cuñado fue idea mía.
- **Muchos detalles los vi usándola en el móvil:**
  - el texto de la radio salía cortado y las pausas eran muy largas;
  - la radio tenía que pararse cuando te llaman;
  - la emisora debía ir según el tiempo;
  - la tragaperras necesitaba una palanca de verdad;
  - en los pósters, los títulos largos se montaban con el texto de abajo.
- **Una idea que tuve que descartar.** Quería un ranking de las ciudades con peor tiempo del mundo, pero solo si era en directo. La versión gratuita del servicio del tiempo no lo permite, así que preferí quitarlo antes que hacerlo con una lista fija.
- **Quería que se notara, sin decirlo, que todo sale del tiempo real.** Por ejemplo, el juego te dice la "dificultad de hoy" según el tiempo, y el póster explica por qué le ha tocado ese género de película.
- **Al final pedí ver todos los apodos en forma de escalera,** para saber dónde estás, cuántos te quedan y cuál es la meta.

### La revisión a mitad de proyecto

A mitad del proyecto paramos para revisar la app con dos miradas: la de alguien técnico y la de un usuario normal que la abría por primera vez. Salieron cosas que no había visto:

- la llamada tapaba el tiempo;
- no se entendía qué eran las estrellas;
- al buscar "Santiago" salía uno de Costa Rica.

Lo arreglamos todo antes de seguir añadiendo cosas.

## Detalles de los que estoy contento

- **Nada suena sin que tú lo pidas.** Ni la radio ni las llamadas.
- **Los textos en inglés no son una traducción,** están escritos para que suenen naturales.
- **Las frases cambian según la ciudad y el día,** para que cada visita sorprenda un poco.
- **Si buscas una ciudad que tiene el mismo nombre que otras,** te pregunta "¿No era esta?".
- **Si algo falla, la app nunca se rompe.** Te lo cuenta con el estilo del juego. Por ejemplo, si la ciudad no existe: "Esa ciudad no sale en el mapa".
- **Se puede usar solo con el teclado** y la pueden leer personas que usan lectores de pantalla. Si el móvil tiene activado "reducir movimiento", las animaciones se paran.

## Lo que he aplicado del módulo

- **JavaScript.** Es lo que hace que la página "piense": elige la escena, calcula las estrellas, mueve los juegos y decide qué dice el Tío Isobaras.

- **Tipos de datos, objetos y arrays.** La información del tiempo llega agrupada (temperatura, viento, humedad…). La previsión es una lista de muchas lecturas que se agrupan por días. Las excusas, los logros y las ciudades rivales también son listas.

- **DOM y BOM, con geolocalización.** El DOM es la página que ves, que va cambiando con los datos. El BOM es lo que aporta el navegador:
  - pedirte la ubicación (si dices que no, te lleva a Madrid);
  - guardar tus puntos y logros en el móvil;
  - la voz del Tío Isobaras;
  - el sonido de la radio.

- **Asincronía, fetch y async/await.** Pedir el tiempo tarda un poco. Mientras tanto la app no se queda congelada: enseña una pantalla de carga y pinta todo cuando llegan los datos.

- **Métodos HTTP, y parámetros frente a body.** La app solo *pide* datos, nunca envía nada para guardar, así que todo va con GET. Lo que pide (la ciudad, el idioma…) va en la propia dirección, como parámetros.

- **Diseño de endpoints REST.** Para proteger la clave monté un pequeño intermediario con cuatro direcciones, una para cada cosa:
  - el tiempo de ahora;
  - la previsión;
  - buscar ciudades;
  - saber en qué ciudad estás.

- **JSON y códigos de estado.** Las respuestas llegan en JSON. El código de estado dice qué ha pasado (ciudad no encontrada, clave mala, límite agotado, servicio caído) y la app lo traduce a un mensaje del juego.

- **Leer la documentación de una API.** Leyendo la de OpenWeatherMap entendí cosas importantes:
  - la previsión viene cada 3 horas, no por días;
  - cada ciudad tiene su hora;
  - el ranking mundial que yo quería no entraba en la versión gratuita.

- **Autenticación con API key.** El servicio del tiempo pide una clave. Si la pones en una web pública, cualquiera puede verla. Por eso elegimos un intermediario gratuito en Cloudflare: la web le pide el tiempo, él añade la clave y responde. Así la clave nunca llega al navegador.

- **Gestión de errores.** Cada fallo posible tiene su mensaje y su solución: reintentar, buscar otra ciudad o volver a Madrid. Si no hay conexión y ya habías entrado antes, sigues viendo el último tiempo guardado.

- **Módulos con Vite.** El código está dividido en muchas piezas pequeñas, una para cada cosa (pedir datos, dibujar, cada juego, la radio, los textos…). Vite las junta para publicar la web.

- **Terminal, npm, package.json, variables de entorno, .env y .gitignore.**
  - La clave se guarda como variable de entorno, en un archivo `.env` que nunca se sube a GitHub gracias al `.gitignore`.
  - En el repositorio solo hay un `.env.example` vacío de ejemplo.
  - Al publicar, se comprueba que la clave no se ha colado en ningún sitio.

- **Resolver conflictos de merge con IA.** Como trabajábamos una fase cada vez y la cerrábamos antes de empezar la siguiente, no nos ha salido ningún conflicto. Si hubiera salido, el plan era que la IA me explicara cada uno y yo decidiera con qué quedarme.

## Cómo comprobé que funciona

- **PageSpeed de Google:** 96 en rendimiento en el móvil, 100 en ordenador y 100 en accesibilidad.
- **El validador del W3C** no da ningún error.
- **Pruebas automáticas:** la app tiene casi 80, que se pasan solas cada vez que se propone un cambio, antes de publicarlo.
- **Pruebas mías:** además he usado la app en mi móvil en cada fase.

## Para terminar

Lo que más he aprendido es que con la IA no basta con pedir "hazme una app". Hay que tener claro qué quieres, preparar bien las instrucciones, ir por partes, probar cada cosa y saber decir "esto no me convence" cuando hace falta. La IA ha escrito el código, pero las decisiones, el tono y el nivel de exigencia los he puesto yo.
