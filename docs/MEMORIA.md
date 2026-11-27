# Wanted Weather — Memoria del proyecto

**Proyecto 2 del programa AI Maker.** App del tiempo bilingüe (español e inglés) con datos reales, presentada como un videojuego gamberro de mundo abierto.

**Web publicada:** https://jplataes.github.io/wanted-weather/

Este documento cuenta qué es la app, cómo se ha construido y qué cuidado hay detrás de cada parte. También relaciona lo que se ve en el módulo con lo que hace la aplicación. No hace falta leer código para entenderlo.

---

## 1. Qué es

Wanted Weather es una app del tiempo de verdad: cada número que enseña sale de OpenWeatherMap en ese momento. La diferencia está en cómo lo cuenta. Tu ciudad es el mapa del juego, el tiempo de hoy es tu misión, y la app reacciona al cielo real:

- **Nivel de búsqueda de 1 a 5 estrellas.** Mide lo duro que viene el día (lluvia, calor, frío, viento, tormenta). Al tocarlas, te explica el motivo ("Por el viento: rachas de 43 km/h").
- **Cartel a pantalla completa con tiempo extremo** ("¡EMPAPADO!", "¡ASADO!"), cada uno con su propio efecto visual.
- **Ocho escenas ilustradas** con sus personajes: despejado, nubes, lluvia, tormenta, nieve, niebla, viento y noche. Además hay una "pantalla viva": gotas que resbalan por el cristal, escarcha, calima y relámpagos.
- **La misión del día:** objetivo, datos reales y equipo recomendado (qué ponerte o llevar). Los próximos días salen como "próximas misiones".
- **El Tío Isobaras,** un contacto ficticio con toque de cuñado. Te llama para darte la misión, retarte o contarte resultados. Su voz solo suena si contestas.
- **La radio del coche:** cuatro emisoras inventadas con música generada en el propio navegador. Los locutores dan el tiempo real entre anuncios absurdos, partes de tráfico y dedicatorias. Está apagada por defecto.
- **Recreativos:** cuatro minijuegos que salen del tiempo de hoy:
  - el Excusómetro (una tragaperras de excusas);
  - el Duelo de ciudades;
  - La apuesta (adivinar la máxima de mañana);
  - Esquiva el chaparrón (lo que cae y el viento que lo empuja son los reales).
- **Fama:** el póster de película del día ("MADRID: 38° DE FURIA"), descargable y compartible. También hay 23 logros, un apodo y una escalera de rangos para ver cuánto queda hasta la cima.

Todo está dibujado con código (SVG y CSS). No hay ni una imagen descargada ni ninguna librería pesada.

---

## 2. Cómo se ha hecho: un proceso, no un prompt

La app no salió de una sola petición. Se construyó como un proyecto real, con un reparto claro de papeles:

- **El propietario dirige.** Define el producto, aprueba cada plan, prueba cada entrega en su móvil y pide cambios. No escribe código.
- **La IA (Claude Code) programa.** Antes de cada cambio explica qué va a hacer y por qué, en lenguaje sencillo, y espera la aprobación si el cambio es grande.

### Las reglas del juego desde el primer día
- Un documento de instrucciones del proyecto con el objetivo, los requisitos del módulo, el tono de los textos y los estándares de calidad.
- Un documento de contenido con los datos del producto, que es la única fuente de verdad. La IA no podía inventar datos, solo los textos de humor, que el propietario revisaba.
- Un **plan por fases** (PLAN.md) aprobado antes de empezar y actualizado al cerrar cada fase con lo que se hizo y lo que se decidió.
- **Una rama y una propuesta de cambios (pull request) por fase.** Cada una explica qué cambia, cómo probarlo y qué conceptos del curso aplica.

### Las fases
| Fase | Qué se hizo |
|---|---|
| 0 | Dirección visual: página de muestra con paleta, letras, HUD, carteles y escenas. **Rehecha una vez** porque al propietario "le faltaba actitud gamberra y efecto wow". |
| 1 | HUD con datos reales, ubicación, buscador, errores con estilo, intermediario para la key y publicación. |
| 2 | Misión del día, próximas misiones, las 8 escenas, la llamada y la pantalla viva. |
| 3 | La radio con música generada y locutores. |
| 4 | **Checkpoint a mitad de proyecto** (ver abajo) y fase 4b de arreglos. |
| 5 | Zona Fama y el póster de película. |
| 6 | Duelo de ciudades y el reto del Tío Isobaras. |
| 7 | La apuesta y Esquiva el chaparrón. |
| 8 | Logros, apodo y pistas sutiles de que todo sigue al tiempo real. |
| 9 | Escalera de rangos, pulido, auditorías finales, pruebas en navegador, README y esta memoria. |

En total se integraron **14 pull requests**, contando el de esta fase final. Cada fase se publicó en la web y el propietario la probó en real antes de pasar a la siguiente.

### Decisiones y cambios que pidió el propietario por el camino
Algunos ejemplos de cómo la dirección humana fue dando forma a la app:

- **Más actitud.** Tras ver la primera muestra, se reescribieron todos los textos y se añadieron personajes, portada de videojuego y efectos por tipo de alerta.
- **Coherencia antes que acumular.** Tras la fase 2, la app dejó de ser un scroll infinito y se organizó en cuatro zonas, como el menú de un juego: Calle, Misiones, Recreativos y Fama.
- **Cada voz con su papel.** El propietario vio que la radio y el Tío Isobaras decían lo mismo:
  - la radio pasó a ser "la ciudad" (anuncios, tráfico, dedicatorias);
  - el Tío Isobaras pasó a ser tu contacto personal y narrador de los juegos, con un punto de cuñado que fue idea del propietario.
- **Detalles de uso real, detectados probando en el móvil:**
  - el texto de la radio salía cortado;
  - las pausas entre frases eran largas (se fijaron entre 2 y 3 segundos);
  - la emisora debía seguir al tiempo de la ciudad;
  - la radio debía pausarse durante las llamadas;
  - el Excusómetro necesitaba una palanca de verdad;
  - la radio tenía que poder plegarse;
  - en los pósters, el texto largo se montaba con los créditos.
- **Ideas descartadas con criterio.** "Los más buscados del planeta" solo tenía sentido si era dinámico. La consulta necesaria no está en el plan gratuito de la API, así que se descartó, como se había acordado, en vez de hacerlo con una lista fija.
- **Pistas sutiles.** El propietario pidió que el usuario notara "sin darse cuenta" que la dificultad y los gráficos salen del tiempo real. Por ejemplo, el juego muestra el parte del día y su "dificultad de hoy" ("Paseo"… "Infierno").
- **La escalera de rangos** (esta fase). El propietario quería ver dónde estás entre todos los apodos, cuántos quedan y la meta de llegar arriba y mantenerse.

### El checkpoint a mitad de proyecto
En la fase 4 se paró a revisar la app con dos miradas distintas:
- un **revisor técnico**, que miró la calidad del código y la medición de rendimiento y accesibilidad;
- un **usuario casual** que la usaba por primera vez.

Encontraron cosas reales:
- la llamada tapaba el tiempo;
- el viento cruzaba por encima de los textos;
- no se entendía qué eran las estrellas;
- al buscar "Santiago" salía Costa Rica.

Todo se corrigió en una fase de arreglos antes de seguir añadiendo funciones. El informe completo está en `docs/CHECKPOINT.md`.

---

## 3. Los detalles que marcan la diferencia

Cosas pequeñas que no se ven a primera vista, pero que hacen que la app parezca hecha con cuidado:

- **Nada empieza a sonar solo.** La radio y las llamadas esperan a que el usuario pulse. Si estás jugando, el Tío Isobaras espera a que termine la partida para llamar.
- **Los textos están escritos de forma nativa en cada idioma,** no traducidos. Incluso se corrige la gramática según el número ("1 grado", no "1 grados").
- **Las frases rotan con sentido.** Cada ciudad y cada día tienen su propia combinación de textos: sorprende en cada visita, pero no cambia cada segundo.
- **Ciudades con el mismo nombre.** Al buscar, la app ofrece "¿No era esta?" con las otras ciudades que se llaman igual (al buscar "Santiago", por ejemplo, Santiago de Chile).
- **Ningún error rompe la pantalla.** Ciudad no encontrada, key no válida, límite gratuito agotado, sin conexión y servicio caído tienen cada uno su mensaje con el estilo del juego. La app también recuerda el último resultado para abrir al instante.
- **La apuesta se comprueba con honestidad.** El plan gratuito no da historial, así que se compara con la máxima real del día según el dato más fiable disponible. Las apuestas sin visita caducan, en vez de inventarse un resultado.
- **Los juegos salen del tiempo real.** En Esquiva el chaparrón caen gotas, copos, rayos u hojas según el día, y el viento real los empuja. La dificultad sube con las estrellas.
- **El póster explica su género** ("Comedia, porque en Madrid luce el sol") y se maqueta de abajo arriba para que ningún título largo se monte con los créditos.
- **Accesible de verdad:**
  - se puede usar entera con el teclado, con el foco siempre visible;
  - los lectores de pantalla oyen los resultados y los errores;
  - las animaciones se paran si el sistema pide menos movimiento.
- **Pensada para el móvil primero.** Se reservó el hueco de cada bloque mientras carga para que la pantalla no salte, y se precargan las letras del primer vistazo.

---

## 4. El módulo aplicado a la app

Cada concepto del temario, explicado con lo que hace en Wanted Weather:

**Qué es JavaScript.** Es el lenguaje que da vida a la página. Decide qué escena dibujar, cuántas estrellas poner, qué dice el Tío Isobaras, cómo se mueve el juego y cuándo suena la radio. Sin JavaScript la página solo enseñaría un aviso pidiendo activarlo.

**Tipos de datos, objetos y arrays.**
- Cada respuesta del tiempo se convierte en un objeto con sus partes: temperatura, viento, humedad, salida del sol…
- La previsión de 5 días es un array de 40 lecturas (una cada 3 horas) que se agrupa por días para sacar las próximas misiones.
- Los textos son colecciones de frases por idioma. Hay, por ejemplo, 45 excusas en cada idioma, 30 ciudades rivales y 23 logros.
- Se trabaja con números (grados, km/h), textos, fechas y verdadero/falso (si un logro está conseguido).

**DOM y BOM (incluida la geolocalización).**
- El **DOM** es la página que se ve: la app la va rellenando y cambiando (la ciudad, las estrellas, el marcador del duelo, la escalera de rangos).
- El **BOM** es todo lo del navegador que no es la página:
  - la **geolocalización**, que pide permiso para saber dónde estás (si dices que no, va a Madrid);
  - el almacenamiento local, que guarda tu respeto, rachas y logros;
  - la dirección de la página, que cambia con cada zona;
  - el portapapeles y el menú de compartir del móvil;
  - la voz sintetizada y el audio del navegador para la radio.

**Asincronía, fetch y async/await.** Pedir el tiempo tarda un momento, y la app no se congela mientras espera:
- enseña una pantalla de carga con estilo;
- pide el tiempo actual y la previsión a la vez;
- dibuja todo cuando llegan las dos respuestas.

La misma idea sirve para esperar a la ubicación, cargar el póster o encadenar las frases de la radio.

**Métodos HTTP y query params frente a body.**
- Todas las peticiones son de tipo **GET**, porque solo se leen datos y nunca se envía nada para guardar.
- Lo que se pide va en los **parámetros de la dirección**: la ciudad, las coordenadas, el idioma y las unidades.
- Una petición GET no lleva cuerpo (body). El cuerpo se usaría para enviar datos, por ejemplo con POST al crear algo.
- El intermediario rechaza cualquier método que no sea GET.

**Diseño de endpoints REST.** Para proteger la key se diseñó un pequeño servicio propio con cuatro direcciones claras, una por recurso:
- el tiempo actual;
- la previsión;
- buscar ciudades por nombre;
- saber qué ciudad hay en unas coordenadas.

Cada una tiene un nombre que dice lo que devuelve y recibe sus datos como parámetros.

**JSON y códigos de estado.**
- Las respuestas llegan en **JSON** y se convierten en objetos.
- El **código de estado** dice qué ha pasado, y la app lo traduce a lenguaje de juego:
  - 200 es que todo fue bien;
  - 404 es que la ciudad no existe ("Esa ciudad no sale en el mapa");
  - 401 es que la key no vale;
  - 429 es que se agotó el límite gratuito;
  - los 500 son que el servicio está caído.

**Leer la documentación de una API.** Leyendo la documentación de OpenWeatherMap se resolvieron varias cosas:
- la previsión viene en tramos de 3 horas, no por días;
- las horas llegan con la diferencia horaria de cada ciudad;
- la búsqueda de ciudades devuelve varias opciones;
- la consulta en grupo de varias ciudades no entra en el plan gratuito. Por eso se descartó una idea, como se cuenta arriba.

**Autenticación con API key.**
- OpenWeatherMap exige una key en cada petición.
- Una key metida en una web pública la puede ver cualquiera, así que se eligió poner un **intermediario en Cloudflare**: la web le pide el tiempo, él añade la key y responde.
- El intermediario solo atiende a la web del proyecto y guarda cada respuesta 10 minutos, para no gastar el límite gratuito.
- La key nunca llega al navegador. Antes de publicar, se comprueba automáticamente que no aparece en los archivos.

**Gestión de errores en peticiones reales.** Cada fallo posible tiene su mensaje y su salida:
- sin conexión, si ya la habías abierto, sigue enseñando el último tiempo guardado, avisa del fallo y ofrece reintentar;
- con una ciudad que no existe, deja buscar otra;
- con el servicio caído o el límite agotado, lo explica con humor y sin pantallas rotas.

Esto se probó a propósito, forzando cada error en las pruebas.

**Módulos con Vite.** El código está repartido en unos 30 módulos, cada uno con una responsabilidad:
- uno para hablar con la API;
- uno para dibujar la página;
- uno para arrancar y conectar todo;
- uno por cada juego, la radio, el póster, los logros y los textos.

Vite los une y los optimiza para publicar. También añade automáticamente una política de seguridad, que solo deja hablar a la página con su propia web y con el intermediario, y precarga las letras.

**Línea de comandos, npm, package.json, variables de entorno, .env y .gitignore.**
- Todo se instala, se prueba y se construye desde la terminal con npm.
- El package.json apunta las herramientas exactas y las órdenes del proyecto: arrancar, construir y probar.
- La key vive en una **variable de entorno**:
  - en local, en un archivo `.env` que el `.gitignore` impide subir;
  - en publicación, como secreto de GitHub y de Cloudflare.
- El repositorio incluye un `.env.example` con el nombre de la variable vacío, como guía.

**Resolver conflictos de merge con IA.** Al trabajar con una rama por fase e integrar cada una antes de abrir la siguiente, **no hubo conflictos** en todo el proyecto. Si alguna rama se hubiera quedado atrás, el procedimiento previsto era traer los cambios nuevos, que la IA revisara los conflictos explicando cada uno y que el propietario decidiera.

---

## 5. Calidad comprobada

| Comprobación | Resultado |
|---|---|
| Lighthouse en móvil | Rendimiento 96 · Accesibilidad 100 · Buenas prácticas 100 · SEO 100 |
| Lighthouse en ordenador | 100 · 100 · 100 · 100 |
| axe (accesibilidad) | 0 avisos en todas las zonas |
| Validador W3C | 0 errores |
| Pruebas de lógica | 58 superadas |
| Pruebas en navegador (móvil y ordenador) | 20 superadas, con la versión de publicación y respuestas reales guardadas de la API |
| Seguridad | La key nunca está en el código ni en la web publicada. Hay una política de seguridad de contenidos y la comprobación automática antes de publicar |

Las pruebas se ejecutan solas en GitHub cada vez que se propone un cambio. La publicación también es automática: al integrar un cambio, GitHub construye la web, actualiza el intermediario de Cloudflare, comprueba que no se filtra la key y publica.

---

## 6. En resumen

Wanted Weather se ha construido durante diez fases:
- con un plan aprobado;
- una revisión a mitad de camino;
- 14 entregas revisadas y probadas en real;
- decenas de ajustes pedidos por el propietario tras usarla en su móvil.

La IA escribió el código, y las decisiones de producto, el tono y el listón de calidad los marcó una persona. El resultado es una app del tiempo que cumple todos los requisitos del módulo y que, además, da ganas de enseñársela a alguien.
