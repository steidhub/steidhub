# Arquitectura SEO de Steid Hub

## Auditoría previa y alcance

Base GitHub: `steidhub/steidhub`, commit `18811c34efb834aebe8e68de6e05d7fe94fb66c3`.
HTML/CSS/JavaScript estáticos, sin framework, package.json, router ni compilación. Cloudflare Pages publica la raíz y ejecuta `functions/api/leads.js` con D1. Antes del cambio solo existía `/`, con anclas `#hero`, `#produccion`, `#integral`, `#marketing`, `#portafolio`, `#equipo`, `#contacto`, más `POST /api/leads`.

Había canonical y Open Graph con www, un Organization mínimo, sitemap con una URL, imágenes mayormente descriptivas y un H1 de eslogan. Faltaban Twitter Cards, rutas comerciales, relaciones entre entidades y páginas, una respuesta 404 explícita y dimensiones en algunas imágenes. Los reveals dependían de JavaScript.

El dominio principal confirmado por el propietario es **https://steidhub.com**. Se mantiene la identidad visual, el eslogan y los archivos de interacción y formulario. Se cambian las etiquetas semánticas del badge y eslogan, y cuatro selectores CSS para conservar su aspecto.

## Rutas finales

- `/`: agencia de marketing digital en Perú.
- `/servicios/`: índice de servicios.
- `/servicios/performance-marketing/`
- `/servicios/google-ads/`
- `/servicios/meta-ads/`
- `/servicios/tiktok-ads/`
- `/servicios/generacion-de-leads/`
- `/servicios/landing-pages/`
- `/servicios/crm-automatizacion/`
- `/servicios/produccion-audiovisual/`
- `/servicios/branding-inmobiliario/`
- `/sectores/`: índice de sectores.
- `/sectores/marketing-inmobiliario/`

Cada ruta tiene HTML completo, title/description, un H1 y jerarquía H2-H3, canonical propio, Open Graph/Twitter y JSON-LD. Organization y WebSite comparten identificadores; las páginas de detalle incluyen Service y BreadcrumbList. No se inventan dirección, certificaciones, reseñas, precios ni resultados. Los índices enlazan a detalles; las etiquetas de servicios y el pie de la home ofrecen enlaces rastreables; los detalles relacionan servicios y sector y llevan al formulario existente.

## Mapa de palabras clave

`keyword-map.json` contiene 132 candidatas únicas, asignadas a una URL por intención. P1 prioriza captación, campañas y sector; P2 desarrolla servicios complementarios. Son prioridades comerciales/editoriales, **no un ranking por volumen, tráfico o dificultad**. Semrush devolvió falta de unidades API el 10 de septiembre de 2026. Sus opciones están en https://www.semrush.com/mcp-access.

El mapa no se vuelca al HTML ni a meta keywords. No se crean páginas casi idénticas por ciudad o por variante. Las variantes se cubren con contenido natural y una página por necesidad.

## Edición y generación

Editar `seo/pages.json` y `seo/templates/page.html`; luego ejecutar desde la raíz:

```sh
python3 scripts/build_seo.py
python3 scripts/check_seo.py
```

Requiere Python 3.9+ y ninguna dependencia adicional. Los HTML generados se versionan. Cloudflare mantiene su despliegue estático sin build obligatorio. La home se edita directamente, salvo metadatos y schema, que se generan desde `build_seo.py`. Las ramas de previsualización deben conservar el `X-Robots-Tag: noindex` de Cloudflare.

La plantilla utiliza `kind=service` o `kind=sector`, títulos, introducción, secciones propias, relacionados y recursos publicados. Añadir un nuevo sector exige contenido distinto y experiencia real; no basta cambiar el nombre. Mantener sincronizado el mapa al cambiar una ruta. Al retirar una página, eliminar su HTML y añadir una redirección solo si hay un destino equivalente.

## Estrategia de imágenes y rendimiento

Se conservan los alt descriptivos existentes: proyecto/espacio/acción visibles. Retratos: nombre real. Fondos y adornos: `alt=""`. No añadir ciudades ni keywords que la imagen no representa. Los atributos width/height usan las dimensiones intrínsecas y las imágenes diferidas tienen decoding async; las reglas CSS siguen definiendo los recortes. Se conserva el preload del poster y los controles de video existentes. No se incorpora una librería de SEO en el navegador. Sin JavaScript, el contenido reveal sigue siendo visible.

## Blogs pendientes (a cargo del propietario)

Redactar artículos originales que respondan preguntas concretas: evaluación de calidad de leads, costo por lead frente a oportunidad comercial, preparación de material para una campaña, elección de una landing y seguimiento en CRM. Incorporar evidencia propia, autor, fecha real y ejemplos verificables. Evitar repetir las páginas comerciales.

Publicar cada artículo con su title, description, H1, canonical y enlaces contextuales al servicio pertinente. Añadir un objeto `{ "path": "/blog/slug/", "title": "Título descriptivo" }` en `resources` de la página de servicio. El generador exige que ese HTML exista antes de enlazarlo; lo incorpora al sitemap. No hay enlaces a artículos aún inexistentes ni páginas de blog vacías. Article/BlogPosting se añade solo con autor y fechas reales.

También quedan por enriquecer las páginas comerciales con casos, metodología específica y resultados autorizados. Validar las prioridades del mapa cuando Semrush tenga unidades API disponibles.

## Publicación y límites de verificación

El cambio se prepara en `seo/on-page-architecture`; no requiere modificar D1 ni el endpoint. La publicación en producción ocurre al integrar la rama en la rama conectada a Cloudflare.

`_redirects` envía www al dominio principal para recursos estáticos. El alias www necesita DNS/TLS válidos; las reglas `_redirects` no se aplican a rutas atendidas por Functions. No se altera el POST de captación. Cloudflare normaliza index.html y sirve rutas inexistentes con `404.html`; no se incorpora un fallback universal que oculte errores.

Tras desplegar: comprobar HTTPS/apex/www, código 404 real, sitemap y canonical en el HTML servido; inspeccionar páginas y enviar sitemap en Search Console; validar schema con herramientas de Google y medir Core Web Vitals con datos reales. La validación local no acredita indexación, ranking, rich results, rendimiento real ni guardado en D1 de producción.

Fuentes técnicas: [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [Cloudflare Serving Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/), [Cloudflare Redirects](https://developers.cloudflare.com/pages/configuration/redirects/).
