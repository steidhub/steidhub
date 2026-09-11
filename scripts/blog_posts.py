"""Contenido de los artículos del blog. Lo lee scripts/build_blog.py.

Marcado ligero del cuerpo (una línea por bloque, bloques separados por línea en blanco):
  ## Título            -> h2 (entra en el índice "En este artículo")
  ### Título           -> h3
  - texto             -> lista con viñetas
  1. texto            -> lista numerada
  + Etiqueta: texto   -> ficha (lista de definiciones)
  > texto             -> cita / ejemplo destacado
  | a | b | c |       -> tabla (la primera fila es la cabecera)
  !leer slug          -> tarjeta "Lee también" hacia otro artículo del blog
Dentro del texto:
  **negrita**, [texto](url) enlace, [[Fuente|url]] cita a una fuente externa
"""

AUTHOR = {
    "name": "Michael Philipps",
    "role": "Socio y fundador de Steid Hub",
    "credentials": "BBA, MBA",
    "specialty": "Especialista en Marketing Digital y Agente Inmobiliario",
    "linkedin": "https://www.linkedin.com/in/michael-philipps-08704a19a/",
    # Recuadro "Conoce más al autor" (sólo en los artículos, no en el índice del blog).
    "bio": [
        "Michael Philipps es **Administrador por la Universidad del Pacífico, MBA y especialista en marketing digital**. Su interés por la comunicación visual lo llevó a especializarse en **producción audiovisual inmobiliaria**, convertirse en **piloto de drone** y **certificarse ante la Dirección General de Aeronáutica Civil (DGAC)**, adscrita al Ministerio de Transportes y Comunicaciones del Perú.",
        "Además, es **agente inmobiliario registrado ante el Ministerio de Vivienda, Construcción y Saneamiento** bajo el código **23267-PN-MVCS**, y **fundador de Haut Bâtiment**, inmobiliaria enfocada en propiedades de **Lima Top y Lima Moderna**.",
        "Su experiencia combina logística en **Nexa Resources**, control de gestión en **SmartBrands Perú**, finanzas en **PwC**, y marketing digital y asesoría comercial en la **Universidad del Pacífico**. También ha trabajado en proyectos de marketing para **USIL, La Carbonera e Inmobiliaria MyE**, así como en la promoción de proyectos como **The Grand Pezet, Portillo y el Condominio Playa del Carmen** en Chincha.",
        "Desde Steid Hub, comparte recomendaciones prácticas para ayudar a inmobiliarias, agentes y propietarios a vender mejor mediante **estrategia, contenido, pauta digital y gestión comercial**.",
    ],
    "avatar": "/assets/team/michael-philipps-avatar.webp",
    "photo": "/assets/team/michael-philipps.webp",
}

PUBLISHED = "2026-09-10"

# Landings y servicios internos a los que apunta cada artículo.
SERVICES = {
    "google": ("/google-ads", "Google Ads", "Google Ads para inmobiliarias",
               "Captamos búsquedas con intención de compra y las llevamos a una landing que responde la misma promesa."),
    "meta": ("/meta-ads-inmobiliarias", "Meta Ads", "Meta Ads y TikTok Ads para inmobiliarias",
             "Campañas en Facebook, Instagram y TikTok para generar leads calificados y convertirlos en visitas."),
    "tiktok": ("/servicios/tiktok-ads/", "TikTok Ads", "Agencia de TikTok Ads en Perú",
               "Video corto y anuncios nativos para ganar atención, recordación y volumen de interesados."),
    "contenido": ("/contenido-inmobiliario", "Contenido", "Producción de contenido inmobiliario",
                  "Fotografía, video y tomas aéreas pensados como herramienta comercial, no como decoración."),
    "drone": ("/servicio-drone-inmobiliario", "Producción aérea", "Drone inmobiliario desde S/300 + IGV",
              "Video 4K, fotografía aérea y mapa 360 para mostrar ubicación, entorno y magnitud real del proyecto."),
    "leads": ("/servicios/generacion-de-leads/", "Leads", "Generación de leads inmobiliarios",
              "Formularios, WhatsApp y CRM conectados para que cada lead llegue calificado y con su origen."),
}

POSTS = [
# ---------------------------------------------------------------------------
{
"slug": "maquina-digital-para-vender-propiedades",
"title": "Deja de esperar leads: así se construye una máquina digital para vender propiedades",
"seo_title": "Marketing inmobiliario: tu máquina digital de ventas",
"description": "Guía de marketing inmobiliario para vender más propiedades en Perú: cómo combinar Google Ads, Meta Ads, TikTok Ads, WhatsApp y contenido en un sistema medible.",
"excerpt": "Publicar en portales y esperar mensajes ya no alcanza. Así se diseña un sistema que atrae, califica y acompaña al comprador hasta la visita.",
"intent": "Vender más propiedades",
"keyword": "marketing inmobiliario",
"keywords": ["publicidad inmobiliaria", "Google Ads inmobiliarias", "Meta Ads inmobiliarias", "TikTok Ads inmobiliarias", "generación de leads inmobiliarios", "campañas inmobiliarias", "vender propiedades por internet"],
"cover": ("/assets/img/hero-drone.webp", 1800, 1350, "Toma aérea de un proyecto inmobiliario en Perú"),
"services": ["google", "meta", "contenido", "drone"],
"related": ["google-meta-tiktok-vender-propiedades", "mejores-leads-inmobiliarios", "contenido-inmobiliario-que-vende"],
"cta_title": "¿Dónde se está perdiendo tu presupuesto?",
"cta": "En Steid Hub diseñamos campañas inmobiliarias integrando Google Ads, Meta Ads, TikTok Ads, contenido profesional y seguimiento comercial. Solicita un diagnóstico gratuito y descubre dónde se está perdiendo tu presupuesto.",
"body": """
Durante años, muchas inmobiliarias entendieron el marketing digital como una tarea operativa: publicar en portales, subir fotos a redes sociales, responder mensajes y esperar que aparezca un comprador. Ese modelo ya no es suficiente.

Hoy, vender una propiedad exige algo más sofisticado: una arquitectura de captación, seguimiento y conversión. No basta con tener exposición; se necesita construir una máquina digital de ventas capaz de atraer compradores, medir su intención, calificarlos, responderles a tiempo y acompañarlos hasta la visita o la separación.

El mercado peruano atraviesa un momento donde la construcción y la vivienda vuelven a mostrar dinamismo. CAPECO reportó que el PBI del sector construcción creció 11.8% en el primer semestre de 2026 y que el mercado de vivienda fue uno de los motores del sector, con cerca de 47 mil créditos hipotecarios colocados entre junio de 2025 y mayo de 2026 por aproximadamente S/17,500 millones. [[CAPECO|https://capeco.org/construccion-registra-un-crecimiento-de-11-8-en-el-primer-semestre-y-con-expectativas-favorables-sobre-el-nuevo-gobierno/]]

La pregunta para una inmobiliaria ya no es si debe invertir en digital. La pregunta correcta es: **¿Qué tan bien está diseñado su sistema digital para convertir interés en oportunidades comerciales reales?**

## El comprador inmobiliario ya no avanza en línea recta

Antes, el comprador veía un aviso, llamaba, visitaba y decidía. Hoy el recorrido es fragmentado. Un usuario puede descubrir un proyecto en TikTok, guardar un reel en Instagram, buscar la ubicación en Google, comparar precios en un portal, revisar la reputación de la inmobiliaria y escribir por WhatsApp tres días después.

Google denomina a esta etapa el *messy middle*, o “medio desordenado” del proceso de compra: ese espacio entre el primer estímulo y la decisión final, donde el usuario explora, compara, se distrae, vuelve, pregunta y reevalúa. En investigaciones de Google sobre comportamiento de compra, se observó que pequeños cambios en presencia, mensaje y autoridad pueden modificar la decisión del consumidor dentro de ese proceso complejo. [[Google|https://business.google.com/uk/think/consumer-insights/navigating-purchase-behavior-and-decision-making/]]

En inmobiliaria, esto es aún más fuerte. No se está vendiendo un producto impulsivo; se está vendiendo una decisión financiera, familiar y emocional. Por eso, un anuncio aislado rara vez basta. Lo que funciona es un sistema.

## Los tres motores de una máquina digital inmobiliaria

Una estrategia moderna debe combinar tres motores: intención, descubrimiento y confianza.

### Google Ads captura intención

Cuando alguien busca “departamentos en Miraflores”, “terrenos en Lurín” o “proyectos inmobiliarios en Lima”, ya existe una intención activa. [Google Ads](/google-ads) permite aparecer en ese momento exacto. Performance Max, además, permite acceder desde una sola campaña al inventario de Google, incluyendo Search, YouTube, Display, Discover, Gmail y Maps. [[Google Ads Help|https://support.google.com/google-ads/answer/10724817?hl=en]]

### Meta Ads construye demanda y conversación

[Facebook e Instagram](/meta-ads-inmobiliarias) siguen siendo canales muy fuertes para descubrimiento, remarketing y generación de leads. Meta informó que cada día se producen más de 600 millones de conversaciones entre personas y empresas en sus plataformas, y que sus soluciones de generación de leads permiten completar formularios, iniciar chats o solicitar llamadas. [[Meta|https://about.fb.com/ltam/news/2023/11/ayudando-a-las-empresas-a-crecer-con-nuevas-herramientas-de-generacion-de-leads-funciones-de-ia-y-alianzas-de-crm/]]

### TikTok Ads acelera atención y recordación

[TikTok](/servicios/tiktok-ads/) dejó de ser únicamente entretenimiento. En real estate, funciona especialmente bien cuando se muestran recorridos, transformaciones, vistas, lifestyle, ubicación y beneficios concretos en formato video. En Perú, su alcance publicitario adulto estimado llegó a 28.3 millones de usuarios a finales de 2025, según DataReportal. [[DataReportal|https://datareportal.com/reports/digital-2026-peru]]

!leer google-meta-tiktok-vender-propiedades

## ¿Por qué muchas campañas inmobiliarias fracasan?

No fallan por falta de presupuesto. Fallan por falta de sistema.

Una inmobiliaria puede invertir S/3,000, S/5,000 o S/10,000 al mes y aun así perder dinero si comete cinco errores:

1. Medir solo leads y no leads calificados.
1. Enviar tráfico a una página poco clara.
1. Usar fotos pobres o videos sin intención comercial.
1. Responder tarde por WhatsApp.
1. No hacer remarketing.

El problema no es “Meta no funciona” o “TikTok no vende”. El problema suele ser que la campaña está optimizada para recibir mensajes, pero no para generar oportunidades comerciales.

## Los indicadores que sí importan

Un sistema serio debe medir más que el costo por lead.

+ CPL: costo por lead. Indica cuánto cuesta conseguir un contacto.
+ CPA: costo por acción. Puede ser una visita agendada, una llamada o una cotización.
+ CAC: costo de adquisición de cliente. Indica cuánto costó conseguir una venta real.
+ Tasa de contacto: porcentaje de leads que sí responden.
+ Tasa de visita: porcentaje de leads que agendan una visita.
+ Tasa de cierre: porcentaje de visitas que terminan en separación o venta.

El CPL puede ser bajo y aun así ser un mal indicador. Una campaña que genera leads a S/6, pero sin capacidad de compra puede ser peor que una campaña con leads a S/30, pero con compradores reales.

Google recomienda alimentar las campañas de generación de leads con datos más profundos del embudo, como “lead calificado”, “cita agendada” o “cliente convertido”, porque las campañas automatizadas aprenden mejor cuando reciben señales cercanas a la venta real. [[Google|https://business.google.com/us/accelerate/resources/articles/performance-max-best-practices-for-lead-generation/]]

!leer mejores-leads-inmobiliarios

## El contenido no es decoración: es infraestructura comercial

En inmobiliaria, el contenido visual reduce la incertidumbre. Una [foto profesional](/contenido-inmobiliario), un video bien narrado o una [toma de drone](/servicio-drone-inmobiliario) no son accesorios estéticos; son activos de venta.

La National Association of Realtors reportó que, entre compradores que usaron internet, las fotos fueron consideradas “muy útiles” por el 83%, la información detallada por el 79%, los planos por el 57%, los tours virtuales por el 41% y los videos por el 29%. [[NAR|https://cms.nar.realtor/sites/default/files/2025-03/2025-home-buyers-and-sellers-generational-trends-report-04-01-2025.pdf]]

Eso significa que una campaña sin buen contenido parte con desventaja. El usuario no solo quiere saber el precio; quiere imaginar cómo se vive, qué tan iluminado es el espacio, cómo se conecta con la ciudad y si vale la pena escribir.

## Conclusión

La inmobiliaria que gana no es necesariamente la que más publica ni la que más invierte. Es la que construye un mejor sistema.

La máquina digital ideal combina Google Ads para capturar intención, Meta Ads para generar conversación, TikTok Ads para ganar atención, WhatsApp para convertir, CRM para ordenar y contenido profesional para elevar la confianza.

En un mercado donde el comprador compara más, pregunta más y decide con más información, vender propiedades exige dejar de improvisar y comenzar a diseñar un proceso medible.
""",
},
# ---------------------------------------------------------------------------
{
"slug": "google-meta-tiktok-vender-propiedades",
"title": "Google, Meta o TikTok: dónde invertir si quieres vender propiedades más rápido",
"seo_title": "Publicidad inmobiliaria: ¿Google, Meta o TikTok?",
"description": "Google Ads, Meta Ads o TikTok Ads para inmobiliarias: qué rol cumple cada canal, cómo repartir el presupuesto y qué medir además del costo por lead.",
"excerpt": "La pregunta no es qué plataforma es mejor, sino qué papel cumple cada una en el proceso de venta. Rol, riesgos y reparto de presupuesto por tipo de proyecto.",
"intent": "Comparar canales",
"keyword": "publicidad inmobiliaria",
"keywords": ["Google Ads inmobiliarias", "Meta Ads inmobiliarias", "TikTok Ads inmobiliarias", "Facebook Ads inmobiliarias", "campañas inmobiliarias", "costo por lead inmobiliario"],
"cover": ("/assets/img/google-search-intent-v2.webp", 1672, 941, "Búsqueda en Google de proyectos inmobiliarios con intención de compra"),
"services": ["google", "meta", "tiktok"],
"related": ["maquina-digital-para-vender-propiedades", "mejores-leads-inmobiliarios", "campana-vender-propiedades-facebook-instagram-tiktok"],
"cta_title": "¿En qué canal debería invertir tu proyecto?",
"cta": "En Steid Hub diseñamos campañas inmobiliarias multicanal para vender propiedades, proyectos, terrenos y locales comerciales con presupuestos eficientes y medición real de resultados.",
"body": """
Una de las preguntas más comunes en el sector inmobiliario es también una de las peor respondidas: “¿Dónde debo invertir mi presupuesto: Google, Meta o TikTok?”

La respuesta profesional no es elegir una plataforma por moda. La respuesta correcta depende del momento de compra del cliente.

Google funciona mejor cuando el usuario ya está buscando. Meta funciona mejor cuando la marca necesita aparecer, insistir y convertir mediante conversación. TikTok funciona mejor cuando la propiedad necesita atención visual rápida y contenido con apariencia nativa.

Por eso, la pregunta no debería ser qué plataforma es mejor. La pregunta debería ser: **¿Qué papel cumple cada plataforma dentro del proceso de venta?**

## Google Ads: cuando el comprador ya tiene intención

[Google Ads](/google-ads) es el canal más directo para capturar demanda activa. Es decir, usuarios que ya están buscando una solución.

Una búsqueda como “departamento estreno San Miguel”, “terrenos industriales Lurín” o “oficinas en alquiler San Isidro” revela intención. No garantiza compra inmediata, pero sí indica que la persona ya está investigando.

Performance Max amplía esta lógica porque permite aparecer en distintos espacios de Google —Search, YouTube, Display, Discover, Gmail y Maps— desde una sola campaña orientada a objetivos. Google explica que este tipo de campaña usa señales de audiencia, objetivos de conversión y activos creativos para optimizar la entrega en diferentes inventarios. [[Google Ads Help|https://support.google.com/google-ads/answer/10724817?hl=en]]

+ Ventaja principal: alta intención.
+ Riesgo principal: costos más altos si la landing, el tracking y las palabras clave están mal configuradas.
+ Mejor uso: búsquedas transaccionales, remarketing, proyectos con demanda existente y propiedades con ubicación muy buscada.

## Meta Ads: cuando necesitas crear demanda y abrir conversación

[Meta Ads](/meta-ads-inmobiliarias) —Facebook e Instagram— es especialmente fuerte para generar descubrimiento, conversación y remarketing.

A diferencia de Google, el usuario no siempre está buscando activamente una propiedad. Puede estar viendo historias, reels o publicaciones. Pero un buen anuncio puede activar una necesidad latente: mudarse, invertir, comprar un primer departamento, separar un lote o visitar un proyecto.

Meta ha reforzado sus herramientas de generación de leads con formularios, clic a WhatsApp, Messenger, Instagram Direct e integraciones con CRM. En una publicación corporativa, Meta señaló que las campañas con configuración orientada a leads de calidad lograron, en promedio, una reducción del 16% en el costo por lead de calidad y un aumento del 21% en la conversión de lead a lead calificado frente a campañas con objetivo estándar de rendimiento de leads. [[Meta|https://about.fb.com/ltam/news/2023/11/ayudando-a-las-empresas-a-crecer-con-nuevas-herramientas-de-generacion-de-leads-funciones-de-ia-y-alianzas-de-crm/]]

+ Ventaja principal: volumen, remarketing y conversación.
+ Riesgo principal: muchos leads curiosos si no se filtra bien.
+ Mejor uso: proyectos residenciales, terrenos, lanzamientos, campañas por WhatsApp, públicos de remarketing y construcción de marca.

## TikTok Ads: cuando necesitas atención, video y escala

[TikTok](/servicios/tiktok-ads/) tiene una ventaja particular: el usuario está dispuesto a descubrir. A diferencia de otras plataformas donde el anuncio se siente más invasivo, TikTok premia la creatividad que se integra al lenguaje del feed.

Para inmobiliarias, esto abre una oportunidad potente: recorridos rápidos, “antes y después”, tours de departamentos, tomas de drone, contenido tipo asesor, mitos sobre compra de vivienda, errores al invertir y videos de ubicación.

DataReportal reporta que TikTok tuvo 28.3 millones de usuarios adultos alcanzables por anuncios en Perú a finales de 2025, con un crecimiento potencial de alcance publicitario del 22.5% entre finales de 2024 y finales de 2025. [[DataReportal|https://datareportal.com/reports/digital-2026-peru]]

Además, TikTok presentó casos inmobiliarios como RentSocial, donde videos de seis segundos alcanzaron más de un millón de vistas promedio al año, con un CTR 27% superior a los estándares de la industria y una reducción del 16% en el CPC. La propia plataforma advierte que los resultados son reportados por la marca y no garantizan resultados futuros, pero el caso demuestra el rol del video corto en real estate. [[TikTok For Business|https://ads.tiktok.com/business/en/inspiration/rent-social-lead-generation-case-study]]

+ Ventaja principal: atención barata y contenido viralizable.
+ Riesgo principal: leads menos maduros si no se combina con remarketing y WhatsApp.
+ Mejor uso: awareness, proyectos visuales, terrenos, recorridos, branding de asesores y campañas con videos nativos.

!leer campana-vender-propiedades-facebook-instagram-tiktok

## Entonces, ¿Dónde invertir?

La mejor distribución depende del producto. Pero para una inmobiliaria promedio, una estructura razonable podría ser:

| Tipo de proyecto | Google Ads | Meta Ads | TikTok Ads |
| Propiedades con demanda activa | 50% | 30% | 20% |
| Proyectos nuevos o lanzamientos | 25% | 45% | 30% |
| Terrenos, lotes o propiedades visuales | 30% | 35% | 35% |
| Marcas nuevas | 20% | 50% | 30% |

La lógica es simple: Google captura demanda, Meta convierte conversación y TikTok genera descubrimiento.

## El gran error: comparar CPL sin mirar calidad

Muchas empresas eligen la plataforma con menor CPL. Ese es un error frecuente.

Un lead de TikTok puede costar menos, pero requerir más nutrición. Un lead de Google puede costar más, pero llegar con intención más clara. Un lead de Meta puede estar en un punto intermedio, especialmente si entra por WhatsApp y responde preguntas de calificación.

Por eso, la comparación debe hacerse con métricas de embudo:

- Costo por lead.
- Porcentaje de leads contactados.
- Porcentaje de leads calificados.
- Costo por cita.
- Costo por visita.
- Costo por separación.
- Costo por venta.

La plataforma ganadora no es la que trae más mensajes. Es la que trae más oportunidades rentables.

!leer mejores-leads-inmobiliarios

## Conclusión

Google, Meta y TikTok no compiten entre sí. Cumplen funciones distintas.

Google aparece cuando el cliente busca. Meta aparece cuando el cliente evalúa, conversa y recuerda. TikTok aparece cuando el cliente descubre, se interesa y guarda.

La estrategia inmobiliaria más inteligente no consiste en elegir una plataforma, sino en diseñar un sistema donde cada canal empuje al siguiente paso comercial.
""",
},
# ---------------------------------------------------------------------------
{
"slug": "mejores-leads-inmobiliarios",
"title": "Tu inmobiliaria no necesita más leads: necesita mejores compradores",
"seo_title": "Generación de leads inmobiliarios que sí compran",
"description": "Por qué tus leads inmobiliarios no convierten: diferencia entre CPL, CPA y CAC, qué es un lead calificado y cinco acciones para atraer compradores reales.",
"excerpt": "Un lead no es un cliente. Qué es un lead calificado, por qué el CPL más barato puede ser el peor negocio y cómo mejorar la calidad de tus contactos.",
"intent": "Leads que no convierten",
"keyword": "generación de leads inmobiliarios",
"keywords": ["costo por lead inmobiliario", "leads calificados inmobiliarios", "CAC inmobiliario", "campañas inmobiliarias", "Meta Ads inmobiliarias", "Google Ads inmobiliarias"],
"cover": ("/assets/img/meta-lead-qualification.webp", 1672, 941, "Anuncio inmobiliario conectado a un formulario de calificación de leads"),
"services": ["google", "meta", "leads"],
"related": ["maquina-digital-para-vender-propiedades", "google-meta-tiktok-vender-propiedades", "campana-vender-propiedades-facebook-instagram-tiktok"],
"cta_title": "¿Tus leads llegan pero no compran?",
"cta": "Steid Hub ayuda a inmobiliarias a reducir desperdicio publicitario, mejorar la calidad de leads y construir campañas conectadas con ventas reales.",
"body": """
En marketing inmobiliario existe una obsesión peligrosa: conseguir más leads.

Más formularios. Más mensajes. Más clics. Más contactos.

Pero una empresa no vive de leads. Vive de compradores, visitas, separaciones y cierres.

Un lead no es un cliente. Es apenas una posibilidad. Y cuando una inmobiliaria mide únicamente la cantidad de leads, corre el riesgo de celebrar una métrica que no necesariamente mejora sus ventas.

El verdadero reto no es generar más contactos. Es generar mejores compradores potenciales.

## El problema del lead barato

Un lead barato puede parecer una victoria. Pero si no responde, no tiene presupuesto, no entiende el producto o solo preguntó por curiosidad, ese lead genera carga comercial, no ingresos.

En campañas inmobiliarias, esto suele ocurrir cuando se optimiza solo hacia formularios o mensajes sin preguntas de calificación. El algoritmo aprende que debe conseguir personas dispuestas a hacer clic, no necesariamente personas dispuestas a comprar.

La diferencia es enorme.

Un lead de S/5 puede ser caro si nadie lo atiende o si no cumple el perfil. Un lead de S/35 puede ser barato si agenda una visita y tiene capacidad real de compra.

## Qué significa realmente “lead calificado”

Un lead calificado es un contacto que cumple ciertas condiciones mínimas para convertirse en una oportunidad comercial.

En inmobiliaria, esas condiciones pueden ser:

- Ubicación de interés.
- Presupuesto aproximado.
- Tipo de propiedad buscada.
- Plazo de compra.
- Modalidad de pago o financiamiento.
- Nivel de urgencia.
- Disponibilidad para visita.
- Datos de contacto válidos.

Esto permite pasar de “me escribieron 200 personas” a “tenemos 35 oportunidades reales”.

## CPL, CPA y CAC: tres métricas que no deben confundirse

+ CPL: significa costo por lead. Indica cuánto cuesta conseguir un contacto.
+ CPA: significa costo por acción. Puede ser una cita, una llamada, una visita agendada o una solicitud de cotización.
+ CAC: significa costo de adquisición de cliente. Indica cuánto invierte la empresa para conseguir una venta real.

El error más común es tomar decisiones mirando solo el CPL. En una campaña seria, el CAC es la métrica final.

Ejemplo:

| Indicador | Campaña A | Campaña B |
| Leads generados | 300 | 100 |
| Costo por lead (CPL) | S/8 | S/25 |
| Inversión | S/2,400 | S/2,500 |
| Visitas | 6 | 18 |
| Ventas | 0 | 2 |

La campaña A tuvo un CPL más barato. La campaña B fue un mejor negocio.

!leer google-meta-tiktok-vender-propiedades

## La calidad del lead depende de la data que recibe la campaña

Google recomienda optimizar campañas de generación de leads hacia objetivos cercanos al negocio, como contacto, formulario enviado, cita reservada, lead calificado o cliente convertido. También indica que, cuando sea posible, conviene alimentar las campañas con señales de etapas más profundas del embudo. [[Google|https://business.google.com/us/accelerate/resources/articles/performance-max-best-practices-for-lead-generation/]]

Esto es clave para inmobiliarias.

Si la campaña solo mide clics en WhatsApp, optimizará hacia clics. Si mide formularios, optimizará hacia formularios. Si mide visitas agendadas o leads calificados, puede aprender a buscar personas más parecidas a quienes avanzan comercialmente.

El algoritmo no adivina el negocio. Aprende de las señales que recibe.

## WhatsApp: el punto donde se ganan o se pierden ventas

En Perú y Latinoamérica, WhatsApp es un canal crítico para inmobiliarias. No porque sea moderno, sino porque es directo, rápido y familiar.

Meta presentó un caso de Lomas de Angelópolis, desarrollador inmobiliario mexicano, donde la combinación de anuncios con clic a WhatsApp y un agente de negocio en WhatsApp logró seis veces más citas mensuales, una reducción del 33% en el ciclo de ventas y un ahorro de 10 a 12 horas semanales del equipo. La fuente advierte que son resultados autorreportados y no garantizan desempeño futuro, pero el caso ilustra la importancia de responder rápido y automatizar la calificación. [[WhatsApp Business|https://whatsappbusiness.com/resources/success-stories/lomas-de-angelopolis/]]

En otras palabras: **el anuncio abre la puerta, pero la conversación vende.**

## Cómo mejorar la calidad de leads inmobiliarios

1. **Usa preguntas de calificación.** No preguntes solo nombre y teléfono. Pregunta presupuesto, zona, tipo de propiedad y plazo de compra.
1. **Crea landings específicas.** No mandes todos los anuncios a una página general. Una campaña para terrenos debe tener una página de terrenos. Una campaña para departamentos debe tener una página de departamentos.
1. **Separa campañas por intención.** No mezcles búsqueda activa con remarketing, ni compradores fríos con personas que ya escribieron.
1. **Mide el avance comercial.** El equipo de ventas debe reportar qué leads fueron útiles, cuáles visitaron y cuáles no calificaron.
1. **Responde rápido.** En inmobiliaria, un lead atendido tarde puede convertirse en una venta de otra empresa.

!leer campana-vender-propiedades-facebook-instagram-tiktok

## Conclusión

El crecimiento no viene de llenar una base de datos con contactos. Viene de construir un sistema que convierta inversión publicitaria en conversaciones útiles, visitas calificadas y ventas reales.

La pregunta correcta no es “¿Cuántos leads generamos?”. La pregunta correcta es: **¿Cuántos compradores reales estamos incorporando al embudo comercial?**
""",
},
# ---------------------------------------------------------------------------
{
"slug": "contenido-inmobiliario-que-vende",
"title": "Las propiedades que mejor se ven, mejor se venden: el poder del contenido inmobiliario",
"seo_title": "Contenido inmobiliario que vende: foto, video y drone",
"description": "Cómo la fotografía inmobiliaria, el video y el drone aumentan la confianza y las consultas. Datos, formatos y cómo producir contenido que vende.",
"excerpt": "Una propiedad se vende mucho antes de la visita: en la primera imagen. Por qué la fotografía, el video y el drone son activos de conversión.",
"intent": "Mejor contenido",
"keyword": "contenido inmobiliario",
"keywords": ["fotografía inmobiliaria Lima", "video inmobiliario", "drone inmobiliario", "producción audiovisual inmobiliaria", "videos para vender propiedades"],
"cover": ("/assets/img/thegrand-comedor.webp", 1800, 1200, "Comedor de departamento fotografiado con luz natural para su venta"),
"services": ["contenido", "drone"],
"related": ["maquina-digital-para-vender-propiedades", "como-vender-una-propiedad-en-redes-sociales", "campana-vender-propiedades-facebook-instagram-tiktok"],
"cta_title": "Contenido diseñado para verse bien y vender mejor",
"cta": "En Steid Hub producimos fotografía, video profesional y drone inmobiliario para propiedades, terrenos y proyectos. Creamos contenido diseñado para verse bien y vender mejor.",
"body": """
Una propiedad no se vende primero en la visita. Se vende mucho antes: en la primera imagen.

Antes de que un cliente pregunte por precio, agenda o ubicación, ya tomó una decisión silenciosa: seguir mirando o pasar al siguiente anuncio.

Por eso, el [contenido inmobiliario](/contenido-inmobiliario) no es un detalle visual. Es uno de los principales filtros de confianza, valor percibido y conversión.

En un mercado saturado de publicaciones similares, la diferencia entre una propiedad ignorada y una propiedad consultada puede estar en la luz de una foto, el ritmo de un video, la calidad de una toma aérea o la claridad de un recorrido.

## El comprador no solo compra metros cuadrados

Una propiedad es un activo financiero, pero también es una promesa emocional. El comprador evalúa ubicación, precio y metraje; pero también imagina su vida en ese espacio.

- ¿Dónde pondría el comedor?
- ¿Cómo entra la luz en la mañana?
- ¿El edificio se ve seguro?
- ¿Qué tan cerca está de avenidas, parques o comercios?
- ¿El terreno parece amplio desde el aire?
- ¿El departamento se siente moderno o antiguo?

La fotografía, el video y el drone ayudan a responder esas preguntas antes de la visita.

## La evidencia: las imágenes son decisivas

La National Association of Realtors encontró que, entre compradores que usaron internet en su proceso, las fotos fueron el recurso más valorado: el 83% las consideró “muy útiles”. También fueron muy valorados la información detallada de la propiedad (79%), los planos (57%), los tours virtuales (41%) y los videos (29%). [[NAR|https://cms.nar.realtor/sites/default/files/2025-03/2025-home-buyers-and-sellers-generational-trends-report-04-01-2025.pdf]]

Esto no significa que el video sea menos importante. Significa que el comprador necesita información visual ordenada. Primero quiere ver bien. Luego quiere entender. Después quiere imaginar.

El contenido profesional cumple justamente esa función.

## Video: menos explicación, más experiencia

El video permite mostrar recorrido, escala y atmósfera. Una foto puede mostrar una sala; un video puede mostrar cómo se conecta esa sala con la cocina, el balcón y la vista.

Wyzowl reportó en su estudio de video marketing 2026 que el 85% de los marketers indicó que el video les ayudó a generar leads, el 83% dijo que incrementó las ventas directamente y el 82% señaló que ayudó a mantener a los visitantes más tiempo en una web. Desde el lado del consumidor, el 85% afirmó haber sido convencido de comprar un producto o servicio después de ver un video, y el 89% dijo que la calidad del video impacta su confianza en una marca. [[Wyzowl|https://wyzowl.com/video-marketing-statistics/]]

En inmobiliaria, esa confianza es decisiva.

Una propiedad mal grabada puede parecer más pequeña, más oscura o menos valiosa. Una propiedad bien producida puede transmitir orden, amplitud, ubicación y oportunidad.

## Drone: contexto, escala y diferenciación

El [drone](/servicio-drone-inmobiliario) vende algo que una cámara interior no puede mostrar: contexto.

Para terrenos, proyectos, locales comerciales, edificios, casas de playa o inmuebles con ubicación estratégica, la toma aérea ayuda a entender accesos, entorno, avenidas, cercanía a servicios y dimensión real.

La encuesta tecnológica de NAR 2025 mostró que el 52% de los agentes inmobiliarios encuestados ya usa fotografía o video con drone, mientras que el 75% usa redes sociales como tecnología de trabajo. [[NAR|https://www.nar.realtor/research-and-statistics/research-reports/realtor-technology-survey]]

Esto demuestra que el contenido visual dejó de ser un lujo. Es parte de la infraestructura comercial del sector.

!leer como-vender-una-propiedad-en-redes-sociales

## El efecto halo: por qué una buena imagen eleva el valor percibido

En psicología, el efecto halo describe la tendencia a evaluar mejor un conjunto cuando una primera característica nos produce una impresión positiva.

Aplicado al sector inmobiliario: si la primera imagen de una propiedad luce profesional, ordenada y atractiva, el usuario tiende a percibir mayor calidad, seriedad y valor.

No significa que el contenido pueda reemplazar una buena propiedad. Significa que una mala presentación puede hacer que una buena propiedad parezca peor de lo que es.

## Cómo debería producirse contenido inmobiliario profesional

Un buen sistema de contenido no empieza grabando. Empieza entendiendo qué se quiere vender.

+ Departamento: distribución, iluminación, acabados y ubicación.
+ Terreno: accesos, zonificación, metraje y entorno.
+ Local comercial: fachada, flujo peatonal, estacionamientos y visibilidad.
+ Proyecto: propuesta de valor, confianza, avance de obra y estilo de vida.

La producción debe incluir:

- Fotografía horizontal para web y portales.
- Reels verticales para Instagram y TikTok.
- Video recorrido para WhatsApp y landing page.
- Tomas de drone para ubicación y escala.
- Clips cortos para anuncios.
- Portadas optimizadas para captar atención.

!leer campana-vender-propiedades-facebook-instagram-tiktok

## Conclusión

El contenido inmobiliario no debe verse como un gasto de producción. Debe verse como un activo de conversión.

Mejores fotos aumentan la confianza. Mejores videos reducen la incertidumbre. Mejores tomas aéreas explican mejor el valor. Y mejores piezas publicitarias permiten que Google, Meta y TikTok trabajen con activos más persuasivos.

En un mercado donde todos publican, **gana quien presenta mejor.**
""",
},
# ---------------------------------------------------------------------------
{
"slug": "como-vender-una-propiedad-en-redes-sociales",
"title": "¿Cómo vender una propiedad en redes sociales sin perder tiempo ni parecer desesperado?",
"seo_title": "Cómo vender una propiedad en redes sociales",
"description": "Cómo vender una propiedad en Facebook, Instagram y TikTok sin parecer desesperado: comprador, historia, contenido, WhatsApp, anuncios y métricas.",
"excerpt": "Publicar una foto con el precio y esperar mensajes no es una estrategia. Siete pasos para convertir una propiedad en contenido que genera interés real.",
"intent": "Vender por redes sociales",
"keyword": "cómo vender una propiedad en redes sociales",
"keywords": ["vender inmueble por Facebook", "vender propiedad por Instagram", "vender casa por TikTok", "redes sociales inmobiliarias", "publicidad para vender propiedades"],
"cover": ("/assets/img/sala-sanborja.webp", 1536, 1024, "Sala de departamento en San Borja lista para promocionarse en redes sociales"),
"services": ["meta", "tiktok", "contenido"],
"related": ["campana-vender-propiedades-facebook-instagram-tiktok", "contenido-inmobiliario-que-vende", "google-meta-tiktok-vender-propiedades"],
"cta_title": "Convierte tu propiedad en una campaña",
"cta": "Steid Hub ayuda a propietarios, asesores e inmobiliarias a transformar propiedades en campañas digitales diseñadas para generar consultas, visitas y oportunidades reales.",
"body": """
Vender una propiedad en redes sociales no significa publicar una foto con el precio y esperar mensajes.

Tampoco significa llenar el feed con frases como “ocasión”, “remato” o “última oportunidad”. En muchos casos, esa urgencia mal utilizada genera el efecto contrario: resta confianza.

Vender en redes sociales exige estrategia, narrativa y método. La propiedad debe presentarse como una oportunidad clara, creíble y visualmente atractiva.

La pregunta no es “¿En qué grupo de Facebook puedo publicar?”. La pregunta correcta es: **¿Cómo convierto una propiedad en contenido capaz de generar interés real?**

## Paso 1: define a quién le estás vendiendo

Antes de publicar, hay que definir al comprador.

No es lo mismo vender un departamento de 60 m² para primera vivienda que una casa de lujo, un terreno industrial o un local comercial.

El contenido cambia según el perfil:

+ Primer comprador: necesita entender precio, financiamiento, seguridad y cercanía.
+ Inversionista: necesita rentabilidad, demanda de alquiler, plusvalía y ticket de entrada.
+ Familia: necesita distribución, colegios, parques y tranquilidad.
+ Empresario: necesita ubicación, flujo, zonificación y accesos.

Sin perfil de comprador, el contenido se vuelve genérico.

## Paso 2: convierte la propiedad en una historia

Las redes sociales premian contenido que retiene atención. Por eso, una propiedad debe contarse, no solo mostrarse.

Ejemplos de enfoques:

> “Un departamento ideal para vivir cerca de todo en Miraflores”.
> “Un terreno para desarrollar en una zona con crecimiento”.
> “Una casa familiar con espacios amplios y luz natural”.
> “Un local comercial listo para una marca que necesita exposición”.

La historia debe responder: qué es, para quién es, por qué importa y qué debe hacer el interesado.

## Paso 3: usa cada red con un propósito distinto

+ Facebook: funciona bien para públicos amplios, segmentación local, grupos, remarketing y campañas de mensajes.
+ Instagram: es ideal para percepción visual, confianza, reels, historias, carruseles y branding del asesor o inmobiliaria.
+ TikTok: permite captar atención con recorridos rápidos, videos tipo “ven conmigo a ver este departamento”, errores al comprar, comparativas de distritos o contenido educativo.

DataReportal muestra que Perú tiene una masa digital suficientemente grande para justificar una estrategia multicanal: 28.3 millones de identidades activas en redes sociales, 24.7 millones de usuarios alcanzables por Facebook Ads, 11.3 millones por Instagram y 28.3 millones de adultos por TikTok Ads. [[DataReportal|https://datareportal.com/reports/digital-2026-peru]]

!leer google-meta-tiktok-vender-propiedades

## Paso 4: publica contenido que responda objeciones

El comprador inmobiliario no decide porque vio una foto bonita. Decide cuando reduce dudas.

Por eso, el contenido debe responder preguntas:

- ¿Cuánto mide?
- ¿Cuánto cuesta?
- ¿Dónde está?
- ¿Qué incluye?
- ¿Tiene cochera?
- ¿Acepta crédito?
- ¿Qué gastos adicionales hay?
- ¿Qué tan cerca está de avenidas principales?
- ¿Por qué vale ese precio?

Una buena publicación no solo atrae. También filtra.

!leer contenido-inmobiliario-que-vende

## Paso 5: lleva la conversación a WhatsApp

Las redes sociales generan interés, pero la conversación comercial suele ocurrir por WhatsApp.

El objetivo no es que el usuario dé like. El objetivo es que escriba, pregunte, mande una captura, pida un video, solicite la ubicación o agende una visita.

Meta ha desarrollado anuncios de clic a WhatsApp precisamente para conectar descubrimiento en [Facebook e Instagram](/meta-ads-inmobiliarias) con conversación directa. Además, sus herramientas permiten integrar formularios, mensajes e incluso CRM para mejorar el seguimiento. [[Meta Blueprint|https://www.facebookblueprint.com/student/path/248735-whatsapp-click-to-ads]]

La clave es responder rápido y con orden.

Un buen mensaje inicial debe incluir:

> “Hola, gracias por tu interés. Te comparto la información completa de la propiedad: ubicación referencial, metraje, precio, distribución y video. Para ayudarte mejor, ¿Estás buscando para vivir, invertir o alquilar?”

Eso convierte una conversación abierta en una calificación comercial.

## Paso 6: invierte en anuncios cuando ya tengas buen contenido

No conviene invertir dinero para promocionar una publicación débil.

Primero se necesita una pieza clara: buen video, buen copy, buen CTA y un destino correcto. Luego se pauta.

Un presupuesto pequeño puede funcionar si la estructura está bien diseñada. Pero si el contenido no comunica valor, el anuncio solo acelera el desperdicio.

!leer campana-vender-propiedades-facebook-instagram-tiktok

## Paso 7: mide lo que importa

En redes sociales, las métricas visibles pueden engañar.

Likes, vistas y seguidores ayudan, pero no son el resultado final.

Para vender una propiedad, debes medir:

- Mensajes recibidos.
- Leads calificados.
- Consultas con presupuesto.
- Visitas agendadas.
- Visitas realizadas.
- Separaciones.
- Ventas cerradas.
- Costo por oportunidad.

Un video con 3,000 vistas y 8 buenos leads puede ser mejor que uno con 50,000 vistas y cero compradores.

## Conclusión

Vender una propiedad en redes sociales no es cuestión de publicar más. Es cuestión de publicar mejor, responder mejor y medir mejor.

Facebook, Instagram y [TikTok](/servicios/tiktok-ads/) pueden convertirse en canales comerciales potentes cuando la propiedad se presenta con una historia clara, contenido profesional, segmentación inteligente y seguimiento por WhatsApp.

La venta inmobiliaria sigue siendo humana. Pero el primer contacto, la primera impresión y la primera comparación ya son digitales.
""",
},
# ---------------------------------------------------------------------------
{
"slug": "campana-vender-propiedades-facebook-instagram-tiktok",
"title": "Cómo hacer una campaña para vender propiedades en Facebook, Instagram y TikTok",
"seo_title": "Campaña inmobiliaria en Facebook, Instagram y TikTok",
"description": "Paso a paso para crear una campaña inmobiliaria en Facebook, Instagram y TikTok: objetivo, contenido, estructura, WhatsApp, presupuesto y optimización.",
"excerpt": "Una campaña inmobiliaria no empieza en el Administrador de Anuncios. Objetivo, contenido, estructura, WhatsApp, presupuesto y optimización en ocho pasos.",
"intent": "Campaña concreta",
"keyword": "campaña para vender propiedades en Facebook Instagram y TikTok",
"keywords": ["Facebook Ads inmobiliarias", "Instagram Ads inmobiliarias", "TikTok Ads inmobiliarias", "Meta Ads inmobiliarias", "campañas inmobiliarias", "anuncios para vender propiedades"],
"cover": ("/assets/img/meta-remarketing-journey.webp", 1672, 941, "Recorrido desde un anuncio en redes sociales hasta una visita agendada"),
"services": ["meta", "tiktok", "contenido"],
"related": ["como-vender-una-propiedad-en-redes-sociales", "google-meta-tiktok-vender-propiedades", "mejores-leads-inmobiliarios"],
"cta_title": "Lanza tu campaña con un equipo que ya lo hizo",
"cta": "En Steid Hub diseñamos campañas para vender propiedades en Facebook, Instagram y TikTok, integrando contenido profesional, pauta digital, WhatsApp y medición de resultados.",
"body": """
Una campaña inmobiliaria en Facebook, Instagram y TikTok no empieza en el Administrador de Anuncios. Empieza mucho antes.

Empieza con una pregunta comercial: **¿Qué propiedad se quiere vender, a quién, en qué plazo y con qué presupuesto?**

Sin esa respuesta, la campaña se convierte en improvisación. Y en digital, improvisar cuesta dinero.

Este artículo explica cómo estructurar una campaña inmobiliaria desde cero: estrategia, contenido, segmentación, formatos, presupuesto, seguimiento y optimización.

## Paso 1: define el objetivo comercial

No todas las campañas buscan lo mismo.

Una campaña puede buscar:

- Mensajes por WhatsApp.
- Formularios de clientes potenciales.
- Visitas a una landing.
- Reproducciones de video.
- Reconocimiento de marca.
- Remarketing a personas que ya interactuaron.
- Citas o visitas agendadas.

Para vender propiedades, lo más recomendable suele ser trabajar con dos capas.

Primero, una campaña de descubrimiento para mostrar la propiedad. Segundo, una campaña de conversión para generar mensajes, formularios o visitas.

## Paso 2: prepara el contenido antes de pautar

Las plataformas no hacen magia. Amplifican lo que les entregas.

Para una campaña inmobiliaria, conviene preparar:

- Video vertical de 15 a 30 segundos.
- Versión corta de 6 a 10 segundos.
- Carrusel de fotos principales.
- Historia con CTA.
- Reel con recorrido.
- Imagen con precio o beneficio.
- Video de ubicación o [drone](/servicio-drone-inmobiliario).
- Copy corto para tráfico frío.
- Copy más directo para remarketing.

Wyzowl reportó que el 71% de las personas considera más efectivos los videos de entre 30 segundos y 2 minutos, y que el 63% prefiere aprender sobre un producto o servicio mediante video corto. [[Wyzowl|https://wyzowl.com/video-marketing-statistics/]]

En inmobiliaria, el video debe ser claro desde los primeros segundos. No empieces con un logo. Empieza con el gancho:

> “Departamento de estreno en San Miguel desde S/…”
> “Terreno amplio a 5 minutos de…”
> “Así se ve este tríplex en San Borja por dentro…”
> “¿Buscas local comercial con exposición?”

!leer contenido-inmobiliario-que-vende

## Paso 3: estructura la campaña en Meta Ads

En [Meta Ads](/meta-ads-inmobiliarias), lo recomendable es separar campañas por objetivo.

### Campaña 1: descubrimiento

+ Objetivo: reproducciones, alcance o interacción.
+ Contenido: video tour, carrusel, reel, ubicación.

### Campaña 2: mensajes o leads

+ Objetivo: WhatsApp, formulario instantáneo o mensajes.
+ Contenido: precio, beneficio, CTA directo.

### Campaña 3: remarketing

+ Objetivo: mensajes o conversiones.
+ Público: personas que vieron videos, interactuaron con Instagram/Facebook, visitaron la web o escribieron.

Meta señala que sus herramientas de generación de leads permiten que una persona complete un formulario, inicie un chat o reciba una llamada para obtener más información. También destaca la integración con CRM y la optimización hacia leads de calidad. [[Meta|https://about.fb.com/ltam/news/2023/11/ayudando-a-las-empresas-a-crecer-con-nuevas-herramientas-de-generacion-de-leads-funciones-de-ia-y-alianzas-de-crm/]]

## Paso 4: estructura la campaña en TikTok Ads

[TikTok](/servicios/tiktok-ads/) requiere otra lógica creativa. No basta con reciclar el mismo video de Instagram.

Una campaña en TikTok debería incluir:

+ Campaña 1 — video views o tráfico: probar creativos y medir retención.
+ Campaña 2 — generación de leads o mensajes: captar interesados.
+ Campaña 3 — remarketing: impactar a quienes vieron el 50%, el 75% o el 100% del video.

TikTok funciona mejor cuando el anuncio parece contenido, no publicidad tradicional. Los videos deben ser rápidos, humanos y concretos.

Ejemplos de hooks:

> “Este departamento parece pequeño, pero mira la distribución”.
> “¿Comprarías un terreno en esta zona de Lima?”
> “3 razones por las que este local puede funcionar para una cafetería”.
> “Lo que nadie te muestra antes de comprar un depa”.

## Paso 5: cuidado con las políticas de vivienda

Las campañas inmobiliarias no son una categoría cualquiera. En algunos mercados, las plataformas restringen segmentación por temas de vivienda, empleo y crédito.

Meta ha implementado restricciones para anuncios de vivienda, incluyendo limitaciones en edad, género y código postal en determinados mercados, como parte de sus esfuerzos contra la discriminación. [[Meta|https://about.fb.com/news/2022/06/expanding-our-work-on-ads-fairness/]]

TikTok también tiene una política HEC —Housing, Employment and Credit— para ciertos mercados, donde los anuncios de vivienda no pueden usar criterios como edad, género, código postal o estado civil y parental. [[TikTok For Business|https://ads.tiktok.com/resources/help/article/housing-employment-credit-hec-ad-policy]]

Aunque estas reglas aplican de forma específica por mercado, una agencia profesional debe diseñar campañas inmobiliarias con criterios responsables: no excluir públicos de manera discriminatoria, no prometer financiamiento engañoso y no usar afirmaciones imposibles de sostener.

## Paso 6: crea un flujo de WhatsApp

La campaña no termina cuando llega el mensaje.

Un flujo básico debería ordenar al lead así:

1. **Primera respuesta:** saludo e información de la propiedad.
1. **Segunda pregunta:** presupuesto, zona o necesidad.
1. **Tercer paso:** envío de video, ficha o brochure.
1. **Cuarto paso:** invitación a una visita.
1. **Quinto paso:** seguimiento si no responde.

Ejemplo de mensaje:

> “Hola, gracias por tu interés. Te comparto la información completa de la propiedad. Para orientarte mejor, ¿Estás buscando para vivir, invertir o alquilar?”

La meta no es conversar por conversar. La meta es calificar y avanzar.

!leer mejores-leads-inmobiliarios

## Paso 7: presupuesto recomendado

Para una campaña pequeña, se puede empezar con una inversión de prueba de 7 a 14 días.

Distribución sugerida:

| Destino de la inversión | Porcentaje |
| Meta Ads | 40% |
| TikTok Ads | 30% |
| Remarketing | 20% |
| Pruebas creativas | 10% |

Para campañas con alta intención o proyectos con búsquedas activas, conviene sumar [Google Ads](/google-ads) en paralelo.

La razón es estratégica: Facebook, Instagram y TikTok generan descubrimiento; Google captura a quien ya está buscando.

!leer google-meta-tiktok-vender-propiedades

## Paso 8: optimización semanal

Una campaña inmobiliaria debe revisarse cada semana.

Indicadores:

+ CPM: cuánto cuesta llegar a mil personas.
+ CTR: porcentaje que hace clic.
+ CPC: costo por clic.
+ CPL: costo por lead.
+ Tasa de respuesta en WhatsApp.
+ Tasa de calificación.
+ Costo por visita agendada.
+ Costo por separación.

No se deben apagar anuncios solo porque tienen pocos likes. Tampoco se deben mantener solo porque tienen muchas vistas.

La pregunta siempre debe ser comercial: **¿Este anuncio está generando oportunidades reales?**

## Conclusión

Una campaña para vender propiedades en Facebook, Instagram y TikTok debe unir tres cosas: buen contenido, pauta inteligente y seguimiento comercial.

El contenido atrae. La pauta distribuye. WhatsApp convierte. El CRM ordena. La optimización mejora.

Cuando esas piezas trabajan juntas, las redes sociales dejan de ser una vitrina y se convierten en un canal real de ventas inmobiliarias.
""",
},
]
