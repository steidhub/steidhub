# Mantenimiento SEO y diagnóstico de tráfico — 19 sep 2026

## Lectura de la caída

La captura de GA4 compara todos los canales, no solo búsqueda orgánica. En la propiedad Steid Hub, del 8 al 11 de septiembre predominó `Direct`; `Organic Search` registró 1 usuario el 10, 1 el 17 y 1 el 18. El 10 hubo 324 `page_view` y 35 `session_start`; el 11, 190 y 16; el 12, 10 y 8. Esa variación de páginas vistas por sesión sugiere revisar tráfico interno/de pruebas y configuración de medición antes de atribuir la caída al posicionamiento. No demuestra, por sí sola, pérdida de rankings.

El contenedor GTM público contiene `G-20RB0Z82XP` y GA4 sigue recibiendo `page_view`. Sin embargo, `generate_lead` solo aparece una vez en el período consultado (8 de septiembre) y `whatsapp_click` aparece una vez (17 de septiembre). Hay que comprobar disparadores, definición de eventos clave y pruebas de conversión en GTM Preview/GA4 DebugView. No duplicar la etiqueta de GA4 para intentar corregir la caída.

## Auditoría técnica

- 29/29 URLs del sitemap: HTTP 200, canónico propio, título, descripción, H1, indexabilidad y GTM correctos al consultar el sitio público.
- La auditoría local confirma enlaces, imágenes, encabezados, datos estructurados y alcance desde la portada.
- Las páginas principales y los artículos tienen contenido sustancial; 12 páginas de servicios/sector generadas eran breves. Se añadió orientación práctica específica sobre intención, creatividad, medición, CRM, contenido y etapa comercial. No se inventaron porcentajes ni resultados.
- `scripts/build_seo.py` ya no sobrescribe `robots.txt` al regenerar páginas.
- `scripts/audit_live_seo.py` permite repetir la revisión HTTP. Su tiempo de respuesta incluye red/TLS/CDN y **no** equivale a Core Web Vitals.

## Pendiente de datos externos

1. En GA4: comparar 8–11 vs. 12–18 por `session source/medium`, excluir visitas del equipo y comprobar cambios de consentimiento o filtros.
2. En Google Search Console: comparar clics, impresiones, CTR y posición de *Búsqueda web* por consulta y URL; revisar Cobertura/Indexación y Core Web Vitals. Sin esos datos no puede afirmarse una caída SEO.
3. En GTM Preview y GA4 DebugView: probar `page_view`, clic a WhatsApp y envío de formulario desde móvil y escritorio; marcar solo eventos comerciales válidos como eventos clave.
4. Priorizar contenido original del mercado peruano: casos con metodología y fechas, preguntas reales de compradores, comparativas de canales por etapa del proyecto y actualización de datos con fuente primaria. Evitar crear páginas repetitivas para variaciones de palabras clave o afirmar resultados no medidos.

Referencias: [Google Search Central — contenido útil](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [guía de IA en Búsqueda](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [canónicas](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
