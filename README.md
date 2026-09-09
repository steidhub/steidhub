# Steid Hub — Sitio web

Landing page en HTML/CSS/JS sin dependencias ni build. Para verla:

```bash
python3 -m http.server 5178 --directory "/Users/michaelphilipps/Desktop/Web - Steid Hub/site"
```

Luego abre http://localhost:5178

## Estructura

```
site/
├── index.html      Contenido y marcado
├── styles.css      Sistema de diseño y layout
├── main.js         Nav, reveals, marquee, validación del formulario
└── assets/
    ├── img/        24 imágenes optimizadas (máx. 1800px)
    ├── video/      hero.mp4 (22 s, 1.2 MB)
    ├── logos/      Logotipo Steid Hub (lockup, wordmark, isotipo)
    ├── team/       7 fotos del equipo
    └── partners/   22 logos de colaboradores
```

## Secciones

1. **Hero** — video drone, texto centrado en el encuadre y las cifras (contador animado, 1,4 s) al pie
2. **01 · Producción** — carrusel infinito de 5 servicios + galería tipo mosaico
3. **02 · Solución integral** — 6 etapas con imagen, entregables destacados, programas y equipamiento
4. **03 · Marketing** — 4 frentes con sus entregables
5. **04 · Portafolio** — 3 casos (uno destacado) + colaboradores
6. **05 · Equipo** — 6 perfiles en dos filas de 3
7. **Contacto** — formulario dentro de un panel destacado

### Carrusel de producción
Bucle realmente infinito: se clona el set completo de diapositivas y, al terminar la
transición sobre un clon, el índice vuelve al original sin animación. Un temporizador de
respaldo hace ese salto aunque `transitionend` no llegue (pestaña oculta, transición cortada),
de modo que el índice nunca se sale del rango. La diapositiva activa se pega al borde izquierdo
(sólo deja sitio a la flecha), no va centrada. El primer avance ocurre 0,45 s después de entrar
en pantalla y luego cada 3,2 s.

**No se pausa al pasar el cursor** — y es intencional: la diapositiva ocupa casi toda la
pantalla, así que al desplazarse el puntero queda siempre encima y el carrusel no llegaba a
arrancar nunca. La pausa sigue disponible en el botón y al recibir foco de teclado, y se
detiene solo cuando sale de pantalla.

### Pop-up de diagnóstico
Aparece 3 s después de cargar, con fondo atenuado y desenfocado. Al pulsar la imagen abre
WhatsApp con «Deseo agendar mi reunión gratuita de diagnóstico». Se cierra con la X, con
Escape o al pulsar fuera, y **no vuelve a salir en la misma visita** (`sessionStorage`).
La apertura fuerza un reflow en vez de usar `requestAnimationFrame`: si la pestaña está en
segundo plano rAF no corre y el overlay quedaría invisible pero bloqueando los clics.

**Cuidado con `.popup[hidden]`**: la regla `.popup{display:grid}` es de autor y gana sobre el
`[hidden]{display:none}` del navegador, así que sin la regla explícita `.popup[hidden]{display:none}`
el overlay permanece sobre toda la página aunque no se vea, y anula todos los clics y hovers del
sitio (botón de WhatsApp, ampliación del portafolio, enlaces del formulario…).

### Interacciones destacadas
- Diapositivas de producción: al pasar el cursor se oscurecen y muestran «Agendar reunión».
- Imágenes del portafolio: al pasar el cursor la tira se detiene y la imagen **se amplía y se
  desplaza al centro de la pantalla**, con la escala calculada para que quepa entera
  (`min(92vw/ancho, 85vh/alto, 1.35)`). Se centra en los dos ejes: la tira queda baja en
  pantalla y, centrando sólo en horizontal, la imagen se salía por abajo. Necesita
  `overflow-x:clip` + `overflow-y:visible` en la tira para que no la recorte.
  Sólo se activa con ratón (`hover:hover` y `pointer:fine`): en táctil el `pointerover` se
  dispara al tocar y no llega el `pointerleave`, así que la imagen se quedaría ampliada.
- Diapositivas: la descripción reserva 3 líneas (`min-height`) para que todos los títulos
  queden a la misma altura, sin importar cuánto texto tenga cada una.
- Panel del formulario: borde con degradado cónico animado (`@property --angle`) y halo que
  respira. En navegadores sin `@property` el borde queda estático, pero sigue visible.

### Carrusel «Nuestro trabajo»
Tira continua de 12 imágenes grandes (hasta 1060 px de ancho), sin difuminado en las uniones.
El desplazamiento lo controla JavaScript (`requestAnimationFrame`, 34 px/s) en vez de una
animación CSS, porque hacen falta flechas y puntos que salten a una imagen concreta y para eso
hay que conocer y fijar el desplazamiento en cada momento.

Tiene flechas en los extremos, barra de puntos y botón de pausa. Se detiene al pasar el cursor
(necesario para la ampliación), al salir de pantalla y con `prefers-reduced-motion`.

Las flechas y los puntos llevan la imagen elegida directamente al centro de la ventana.
El indicador sigue esa selección, y los clics consecutivos parten del destino pendiente.
Durante el desplazamiento se ignora la ampliación por hover para evitar que una imagen
que cruza bajo el cursor cambie de posición a mitad del movimiento.

**Con una imagen ampliada**, las flechas y los puntos sustituyen únicamente la fotografía
manteniendo el mismo elemento, tamaño, posición y controles. La siguiente foto se carga y
decodifica antes del cambio; los clics rápidos respetan la última selección. Al salir de la
vista ampliada se restaura la imagen original de la tira y se centra la última seleccionada.

Además, **las flechas se recolocan sobre los bordes laterales de la imagen ampliada**
(`placeArrows`, 18 px hacia dentro, centradas en vertical). Si se quedan en los extremos de la
tira, para alcanzarlas el cursor tiene que cruzar otras imágenes y el zoom va saltando de una a
otra antes de poder hacer clic. La caja se calcula, no se mide, porque al colocarlas la
transición de 0,35 s aún no ha terminado. Al salir del carrusel se restauran solas.

Dos detalles del bucle que costaron encontrar y conviene no romper:

- La ampliación al llegar al destino se aplica **después** de escribir el `transform` y de
  `wrap()`. Si se hace antes, se mide con la posición del fotograma anterior y, cuando `wrap()`
  salta un juego completo, la imagen ampliada aparece desplazada a un lado en vez de centrada.
- El ancho de un juego es `children[n].offsetLeft - children[0].offsetLeft`, no
  `scrollWidth / 2`: el segundo no incluye el hueco final del flex y se queda corto medio
  `gap` (10 px), lo que desalineaba el bucle en cada vuelta.

## Marca

| Token | Valor | Uso |
|---|---|---|
| `--ink` | `#111111` | Fondo |
| `--bone` | `#F7F7F5` | Texto principal |
| `--sand` | `#EDE5DC` | Texto secundario destacado |
| `--terra` | `#C46B3C` | Acento y CTA |
| `--sage` | `#7A8B7A` | Confirmaciones |
| `--navy` | `#16324F` | Reserva |

Tipografía: **Poppins** (300/400/500/600/700) desde Google Fonts.

Todos los enlaces de WhatsApp (botón flotante, contacto y pie) abren la conversación con el
mensaje precargado «Hola, Steid Hub, deseo más información».

El botón flotante está visible desde el hero, lleva un punto rojo de notificación y, al pasar
el cursor o al recibir foco, despliega una burbuja tipo chat de WhatsApp con el botón «Enviar
mensaje». En móvil la burbuja no aparece (no hay hover): el botón lleva directo a la conversación.

Mientras se ve el hero, el botón se eleva por encima de la franja de cifras. La elevación se
calcula en cada scroll con la posición real de la franja en pantalla (`innerHeight - top + 24`),
porque su altura cambia entre 5 y 2 columnas y el alto del hero no siempre iguala a
`innerHeight`. La transición se activa un frame después del primer cálculo para que el botón
no se deslice al cargar.

Redes: Instagram **@steidhub** y TikTok **@steidhub.pe**.

## Conectar el formulario

El formulario envía JSON a `POST /api/leads`. La función en
`functions/api/leads.js` valida los datos y las dos autorizaciones y guarda el
registro mediante el binding `DB` en la tabla `leads` de `steidhub-leads`.
Solo muestra éxito después de confirmar el guardado; ante errores conserva los datos.
Si Google Analytics está instalado, registra `generate_lead` sin datos personales.

### Despliegue

La raíz del repositorio es esta carpeta `site` (contiene `.git`). Mantener
`functions` en esta raíz. Cloudflare Pages debe publicar los archivos de esta raíz,
con el binding de producción `DB` apuntando a `steidhub-leads`.
La tabla existente debe contener: `id`, `nombre`, `empresa`, `email`, `whatsapp`,
`necesidad`, `etapa`, `proyecto`, `consentimiento_contacto`,
`consentimiento_privacidad`, `ip`, `user_agent`, `created_at`.
`id` es autoincremental y `created_at` usa `DEFAULT CURRENT_TIMESTAMP`.

Publicar los cambios mediante el repositorio conectado a Cloudflare Pages.
Después del despliegue, enviar una solicitud de prueba desde el dominio y confirmar
que aparece en D1. Las comprobaciones locales no prueban el binding de producción.

## Accesibilidad y rendimiento

- Contraste AA verificado en los pares de color usados (terracota sobre `#111` ≈ 4.9:1).
- Foco visible en todos los elementos interactivos; enlace "Saltar al contenido".
- Errores del formulario inline + resumen enlazado que recibe el foco al fallar el envío.
- `prefers-reduced-motion` desactiva reveals, marquee y el video del hero.
- El video del hero se pausa fuera de pantalla y con la pestaña oculta.
- Imágenes con `loading="lazy"` salvo el hero; sin scroll horizontal en 375 / 768 / 1024 / 1440.

## Tratamiento de los logos de colaboradores

Se usan **los archivos originales sin ninguna modificación de color ni de los elementos
gráficos**. Sólo se recorta el margen vacío alrededor del logo (`cropdetect`) para que el
contenido llene la caja, y se reducen si exceden 560×200 (nunca se amplían en el archivo).
En CSS todos comparten la misma altura (64 px) con el ancho automático, de modo que se ven
prácticamente del mismo tamaño. Se usa **flex y no grid** a propósito: dentro de un contenedor
grid el `max-height:100%` porcentual no resuelve y los logos altos se salían de la caja.

## Fotos del equipo

Los originales tenían encuadres distintos (unas personas salían más cerca que otras). Cada
foto se recorta con una caja calculada para que la cabeza ocupe la misma proporción y **la
línea de los ojos quede a la misma altura** en las seis, y se exporta a 560×691. Los recortes
se aplican sobre el original escalado a **1000×1688** (no a 560, para que el recorte no amplíe
y las caras no pierdan nitidez):

| Persona | crop W:H:X:Y |
|---|---|
| Michael Philipps | 402:495:77:69 |
| Valia Suárez | 356:438:111:138 |
| María Arbe | 560:691:0:50 |
| Bryan Cortez | 427:526:43:81 |
| Katherine Pacheco | 415:512:71:123 |
| Darie Macazana | 452:557:48:121 |

Si cambias una foto habrá que recalcular el suyo.

La foto de María Arbe está encuadrada más cerca en origen y su recorte ya ocupa el ancho
completo, así que su cara queda ~5 % más grande que las demás: no se puede alejar más sin
añadir relleno.

## Consentimiento del formulario

Son obligatorias **dos** casillas: la de contacto y la de tratamiento de datos personales,
que enlaza a la política de privacidad alojada en Google Drive.

## Pendientes para producción

- Verificar un envío real y su registro en D1 después del despliegue.
- Confirmar el enlace real de Instagram (`@steidhub`).
- La foto `assets/team/dayana-diaz.jpg` quedó sin usar: la lista de perfiles entregada
  tiene seis personas y no la incluye. Si debe aparecer, indícanos su cargo y descripción.
