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
  ~ Término           -> recuadro "Término explicado" (1.ª línea: término; siguientes "~ ": explicación)
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

# ===========================================================================
# Segunda tanda: 5 artículos más del ecosistema
# ===========================================================================
POSTS += [
# ---------------------------------------------------------------------------
{
"slug": "por-que-nadie-pregunta-por-mi-propiedad",
"title": "¿Por qué nadie pregunta por mi propiedad? 7 errores que espantan compradores antes del primer WhatsApp",
"seo_title": "Por qué no se vende mi propiedad: 7 errores",
"description": "Por qué no se vende tu propiedad: 7 errores de fotos, anuncios, video, ubicación, WhatsApp y medición que espantan compradores y cómo corregirlos.",
"excerpt": "Buena ubicación, buen metraje, precio razonable… y ninguna consulta. Siete errores de presentación y atención que alejan compradores antes del primer mensaje.",
"intent": "Propiedad sin consultas",
"keyword": "por qué no se vende mi propiedad",
"keywords": ["vender propiedad rápido", "errores al vender una propiedad", "publicidad inmobiliaria", "fotos inmobiliarias", "anuncios inmobiliarios", "marketing inmobiliario"],
"cover": ("/assets/img/foto-sala.webp", 1536, 1024, "Sala de departamento fotografiada con luz natural y perspectiva corregida"),
"services": ["contenido", "meta", "google"],
"related": ["contenido-inmobiliario-que-vende", "whatsapp-inmobiliario-convertir-consultas-en-ventas", "como-vender-una-propiedad-en-redes-sociales"],
"cta_title": "¿Tu propiedad no recibe consultas?",
"cta": "En Steid Hub ayudamos a propietarios, agentes e inmobiliarias a mejorar la presentación de sus propiedades con fotografía, video, drone, pauta digital y estrategia comercial.",
"body": """
Una propiedad puede estar bien ubicada, tener buen metraje y un precio razonable, pero aun así no recibir consultas. En el mercado inmobiliario, esto suele generar una conclusión apresurada: “el precio está mal”. A veces sí. Pero muchas veces el problema no está en la propiedad, sino en cómo se presenta, dónde se publica y cómo se atiende al interesado.

Hoy el comprador inmobiliario no espera llegar a una visita para decidir si una propiedad le interesa. Decide mucho antes: cuando ve la primera foto, lee el título, revisa el video, compara con otras opciones y evalúa si vale la pena escribir por WhatsApp.

La National Association of Realtors encontró que, entre compradores que usaron internet, las fotos fueron consideradas una de las funciones más útiles durante la búsqueda de vivienda. Esto confirma algo clave: **antes de vender metros cuadrados, vendes confianza visual.** [[NAR|https://www.nar.realtor/sites/default/files/2025-03/2025-home-buyers-and-sellers-generational-trends-report-04-01-2025.pdf]]

## 1. Fotos oscuras, torcidas o poco profesionales

El primer error es publicar imágenes que no hacen justicia a la propiedad. Una foto oscura puede hacer que un departamento parezca más pequeño. Una foto tomada con mal ángulo puede deformar los espacios. Una imagen sin orden puede transmitir descuido.

En inmobiliaria, la [fotografía](/contenido-inmobiliario) no es solo estética. Es información. Ayuda al comprador a entender amplitud, distribución, iluminación, acabados y estado del inmueble.

~ Valor percibido
~ El valor percibido es la impresión de valor que una persona construye antes de conocer todos los detalles técnicos. Una propiedad puede valer lo mismo, pero si se presenta mejor, se percibe más atractiva, más seria y más confiable.

!leer contenido-inmobiliario-que-vende

## 2. Publicar sin una propuesta clara

Muchos anuncios dicen: “Vendo departamento en excelente ubicación”. Pero casi todos dicen lo mismo. El usuario necesita entender rápidamente por qué esa propiedad merece atención.

Un buen anuncio debe responder:

- ¿Qué tiene de especial?
- ¿Para quién es ideal?
- ¿Qué problema resuelve?
- ¿Qué diferencia tiene frente a otras propiedades similares?

No es lo mismo decir “Departamento en San Miguel” que decir: “Departamento ideal para primera vivienda, cerca de avenidas principales, con distribución funcional y bajo mantenimiento”.

## 3. Usar textos genéricos que no generan confianza

Palabras como “ocasión”, “remate”, “urgente” o “precio de locura” pueden funcionar en ciertos contextos, pero usadas en exceso dañan la percepción de valor. En ventas inmobiliarias, la urgencia debe estar respaldada por información concreta.

Mejor que decir “ocasión única” es explicar:

- Precio por debajo del promedio de la zona.
- Documentación lista.
- Entrega inmediata.
- Buena rentabilidad para alquiler.
- Ubicación estratégica.
- Alta demanda del distrito.

## 4. No tener video recorrido

La foto atrae. El video aclara. Un video recorrido permite que el usuario entienda cómo se conectan los espacios, cómo entra la luz, qué tan amplio se siente el inmueble y qué experiencia tendría al visitarlo.

Wyzowl reportó que el video ayuda a generar leads, incrementar ventas y aumentar el tiempo que los usuarios permanecen en una web. También encontró que la calidad del video influye en la confianza hacia una marca. [[Wyzowl|https://wyzowl.com/video-marketing-statistics/]]

En inmobiliaria, esto es decisivo. Una propiedad no solo debe verse bonita; debe sentirse real.

## 5. No explicar bien la ubicación

La ubicación no se comunica solo poniendo el distrito. Un comprador quiere saber qué hay cerca, qué avenidas conectan, cómo es la zona, qué servicios tiene alrededor y por qué esa ubicación mejora la vida o la inversión.

+ Departamentos: conviene mencionar cercanía a parques, avenidas, supermercados, colegios, universidades o centros empresariales.
+ Terrenos: se debe explicar acceso, zonificación, vías principales, crecimiento de la zona y potencial de desarrollo.
+ Locales comerciales: es clave mostrar flujo peatonal, exposición, estacionamientos y negocios cercanos.

!leer como-vender-terrenos-y-lotes-por-internet

## 6. Responder tarde por WhatsApp

Una campaña puede traer buenos leads, pero si la respuesta llega horas después, el comprador ya pudo contactar a otra inmobiliaria.

El anuncio abre la puerta, pero la conversación define la oportunidad. Meta ha reforzado sus soluciones de generación de leads precisamente para conectar anuncios con formularios, llamadas o conversaciones directas, incluyendo WhatsApp e integración con CRM. [[Meta|https://about.fb.com/ltam/news/2023/11/ayudando-a-las-empresas-a-crecer-con-nuevas-herramientas-de-generacion-de-leads-funciones-de-ia-y-alianzas-de-crm/]]

~ CRM
~ Un CRM es una herramienta para ordenar contactos, registrar conversaciones, programar seguimientos y medir en qué etapa está cada cliente. No sirve solo para empresas grandes; también ayuda a agentes e inmobiliarias pequeñas a no perder oportunidades.

!leer whatsapp-inmobiliario-convertir-consultas-en-ventas

## 7. Publicar sin medir resultados

El último error es publicar en todas partes sin saber qué funciona. Una propiedad puede recibir vistas en TikTok, consultas por Facebook, búsquedas por [Google](/google-ads) y referencias por WhatsApp. Si no se mide, no se aprende.

Los indicadores mínimos deberían ser:

- Consultas recibidas.
- Consultas calificadas.
- Visitas agendadas.
- Visitas realizadas.
- Ofertas recibidas.
- Tiempo promedio de respuesta.
- Costo por oportunidad.

## Conclusión

Cuando nadie pregunta por una propiedad, el problema no siempre es el inmueble. Muchas veces es la presentación, el contenido, el canal, el mensaje o la atención comercial.

Vender una propiedad exige más que publicar. Exige construir una primera impresión confiable, explicar el valor con claridad y facilitar el siguiente paso.
""",
},
# ---------------------------------------------------------------------------
{
"slug": "como-vender-terrenos-y-lotes-por-internet",
"title": "Cómo vender terrenos y lotes por internet: la estrategia que combina drone, ubicación y pauta digital",
"seo_title": "Cómo vender terrenos y lotes por internet",
"description": "Cómo vender terrenos y lotes por internet: drone para mostrar escala y accesos, anuncios con datos, redes sociales, Google Ads y seguimiento por WhatsApp.",
"excerpt": "Un terreno no se vende por sus acabados, sino por su potencial. Cómo mostrar contexto, accesos y escala con drone, y convertir ese interés en compradores.",
"intent": "Vender terrenos",
"keyword": "cómo vender terrenos por internet",
"keywords": ["vender lotes", "publicidad para terrenos", "drone inmobiliario", "video drone inmobiliario", "fotografía aérea inmobiliaria", "terrenos en venta Lima", "marketing inmobiliario"],
"cover": ("/assets/img/golf-drone.webp", 1800, 1016, "Toma aérea con drone de lotes y accesos en un proyecto residencial"),
"services": ["drone", "contenido", "google"],
"related": ["contenido-inmobiliario-que-vende", "google-meta-tiktok-vender-propiedades", "por-que-nadie-pregunta-por-mi-propiedad"],
"cta_title": "Muestra tu terreno desde el aire",
"cta": "En Steid Hub producimos videos con drone desde S/300 + IGV para terrenos, propiedades y proyectos inmobiliarios, integrando contenido visual con campañas digitales orientadas a leads reales.",
"body": """
Vender un terreno no es igual que vender un departamento. Un departamento se entiende por sus ambientes, acabados y distribución. Un terreno, en cambio, exige explicar algo más abstracto: **potencial.**

El comprador necesita imaginar qué se puede construir, cómo se accede, qué hay alrededor, cuál es el crecimiento de la zona y por qué ese espacio puede convertirse en una buena inversión.

Por eso, los terrenos y lotes necesitan una estrategia distinta: contenido visual, contexto territorial, pauta segmentada y seguimiento comercial.

## El terreno se vende desde el contexto

Una foto tomada desde la calle puede mostrar el lote, pero rara vez explica su verdadero valor. En terrenos, el contexto vale tanto como el metraje.

Un comprador necesita entender:

- Dónde está.
- Cómo se llega.
- Qué avenidas conectan.
- Qué desarrollos existen alrededor.
- Qué comercios, viviendas o industrias hay cerca.
- Qué potencial tiene la zona.

Ahí el [drone](/servicio-drone-inmobiliario) cumple un rol comercial importante. No solo muestra una vista bonita; permite comprender escala, entorno y ubicación.

La encuesta tecnológica 2025 de la National Association of Realtors reportó que el 52% de los agentes inmobiliarios encuestados usa fotografía o video con drone, mientras que el 75% usa redes sociales como herramienta de trabajo. Esto muestra que el contenido visual aéreo ya forma parte del estándar competitivo del sector. [[NAR|https://www.nar.realtor/research-and-statistics/research-reports/realtor-technology-survey]]

## Por qué el drone ayuda a vender terrenos

El drone resuelve tres problemas.

1. **Muestra dimensión.** Un terreno grande puede perder impacto en fotos horizontales tradicionales. Desde el aire, el comprador entiende proporciones.
1. **Muestra accesos.** Para terrenos urbanos, industriales o de playa, los accesos son un argumento de venta.
1. **Muestra entorno.** La cercanía a avenidas, playas, parques, zonas industriales o proyectos vecinos puede elevar el interés.

~ Plusvalía
~ La plusvalía es el aumento de valor de un inmueble o terreno con el tiempo. Puede depender de infraestructura, desarrollo urbano, demanda, ubicación, accesos y crecimiento económico de la zona.

!leer contenido-inmobiliario-que-vende

## Cómo estructurar un anuncio para vender terrenos

Un buen anuncio de terreno debe tener menos adjetivos y más datos.

Debe incluir:

- Área total.
- Frente y fondo.
- Ubicación referencial.
- Zonificación, si aplica.
- Accesos principales.
- Servicios disponibles.
- Documentación.
- Precio.
- Usos posibles.
- Video o toma aérea.
- CTA directo a WhatsApp.

Un mal anuncio dice:

> “Vendo terreno excelente oportunidad”.

Un buen anuncio dice:

> “Terreno de 1,000 m² con acceso rápido desde avenida principal, ideal para desarrollo residencial o inversión de mediano plazo”.

## Qué contenido usar para redes sociales

Para [Facebook e Instagram](/meta-ads-inmobiliarias), funcionan bien carruseles con mapas, fotos aéreas, beneficios y CTA a WhatsApp.

Para [TikTok](/servicios/tiktok-ads/), funcionan mejor videos cortos con gancho directo:

> “¿Invertirías en un terreno en esta zona?”
> “Así se ve este lote desde el aire”.
> “3 razones por las que este terreno puede ser una buena inversión”.
> “Lo que debes revisar antes de comprar un lote”.

TikTok recomienda que las campañas inmobiliarias trabajen con objetivos claros, videos cortos, segmentación local y medición por leads, citas o cierres, no solo por vistas. [[TikTok For Business|https://ads.tiktok.com/business/en/guides/real-estate-advertising-guide]]

## Google Ads para terrenos: cuando el comprador ya está buscando

[Google Ads](/google-ads) es útil cuando existe demanda activa. Es decir, cuando las personas ya buscan términos como “terrenos en venta”, “lotes en Lima”, “terrenos industriales”, “terrenos en playa” o búsquedas similares.

La ventaja es que el usuario no está simplemente navegando. Está investigando.

La campaña debe enviar a una landing específica del terreno o proyecto, no a una página general. Esa landing debe incluir ubicación, fotos, video, plano, beneficios, preguntas frecuentes y botón visible de WhatsApp.

!leer google-meta-tiktok-vender-propiedades

## Meta y TikTok Ads: cuando hay que crear deseo

No todos los compradores buscan terrenos todos los días. Muchas veces la inversión se activa cuando una persona ve una oportunidad bien presentada.

Ahí Meta y TikTok cumplen un rol importante. Permiten mostrar el terreno a públicos interesados en inversión, vivienda, playa, desarrollo, negocios o zonas específicas.

En Perú, DataReportal reportó 28.3 millones de identidades activas en redes sociales en octubre de 2025. Esto muestra que Facebook, Instagram y TikTok son canales relevantes para llegar a compradores potenciales, siempre que la campaña esté bien segmentada y el contenido sea claro. [[DataReportal|https://datareportal.com/reports/digital-2026-peru]]

## Conclusión

Vender terrenos por internet exige mostrar más que el terreno. Hay que mostrar contexto, accesos, escala, potencial y confianza.

La combinación más efectiva suele ser: drone para explicar visualmente, redes sociales para generar interés, Google Ads para captar búsquedas activas y WhatsApp para calificar compradores.
""",
},
# ---------------------------------------------------------------------------
{
"slug": "whatsapp-inmobiliario-convertir-consultas-en-ventas",
"title": "WhatsApp inmobiliario: cómo convertir consultas en visitas y visitas en ventas",
"seo_title": "WhatsApp inmobiliario: de consultas a ventas",
"description": "WhatsApp inmobiliario: qué responder en el primer mensaje, qué preguntas califican al lead, cómo hacer seguimiento sin incomodar y qué métricas medir.",
"excerpt": "Muchas campañas no fracasan en el anuncio, sino después. Mensajes, preguntas de calificación, seguimiento y métricas para que WhatsApp venda.",
"intent": "WhatsApp comercial",
"keyword": "WhatsApp inmobiliario",
"keywords": ["cómo responder leads inmobiliarios", "mensajes para vender propiedades", "seguimiento de clientes inmobiliarios", "atención comercial inmobiliaria", "generación de leads inmobiliarios"],
"cover": ("/assets/img/google-landing-conversion-lima.webp", 1672, 941, "Landing inmobiliaria conectada a WhatsApp para agendar visitas"),
"services": ["meta", "leads", "google"],
"related": ["mejores-leads-inmobiliarios", "campana-vender-propiedades-facebook-instagram-tiktok", "como-captar-clientes-inmobiliarios"],
"cta_title": "¿Tus consultas no llegan a visita?",
"cta": "En Steid Hub no solo generamos leads. Ayudamos a ordenar el proceso comercial para que las consultas se conviertan en visitas y las visitas en oportunidades reales de venta.",
"body": """
Muchas campañas inmobiliarias no fracasan por los anuncios. Fracasan después del anuncio.

El usuario escribe, pregunta por precio, pide información o manda una captura. Pero si la respuesta es lenta, genérica o desordenada, la oportunidad se enfría.

WhatsApp es uno de los puntos más importantes del embudo inmobiliario. No es solo un canal de atención. Es el espacio donde se califica, se persuade, se resuelven objeciones y se agenda la visita.

Meta ha desarrollado herramientas de generación de leads que permiten conectar anuncios con formularios, llamadas y conversaciones directas, además de integraciones con CRM. En campañas con optimización hacia leads de calidad, Meta reportó reducciones promedio en el costo por lead calificado y mejoras en la conversión de lead a lead calificado. [[Meta|https://about.fb.com/ltam/news/2023/11/ayudando-a-las-empresas-a-crecer-con-nuevas-herramientas-de-generacion-de-leads-funciones-de-ia-y-alianzas-de-crm/]]

## El primer mensaje define el tono de la venta

Un error común es responder únicamente: “Hola, sí está disponible”. Esa respuesta no vende, no califica y no guía.

Una mejor respuesta sería:

> “Hola, gracias por tu interés. Te comparto la información completa de la propiedad: ubicación referencial, metraje, distribución, precio y video. Para orientarte mejor, ¿Estás buscando para vivir, invertir o alquilar?”

Ese mensaje hace tres cosas. Primero, responde. Segundo, ordena. Tercero, abre una pregunta de calificación.

## Qué preguntas debe hacer un asesor inmobiliario

No se trata de interrogar al cliente. Se trata de entender si la propiedad encaja con su necesidad.

Preguntas útiles:

- ¿Qué tipo de propiedad estás buscando?
- ¿En qué zona te gustaría comprar o alquilar?
- ¿Es para vivir, invertir o negocio?
- ¿Tienes un presupuesto aproximado?
- ¿Buscas compra al contado o con financiamiento?
- ¿Cuándo te gustaría visitar?

~ Lead calificado
~ Un lead calificado es un contacto que cumple condiciones mínimas para avanzar comercialmente. Por ejemplo: tiene presupuesto, interés real, zona definida y disposición para visitar.

!leer mejores-leads-inmobiliarios

## Cómo evitar perder tiempo con curiosos

No todos los mensajes serán compradores reales. Eso es normal. El problema aparece cuando el equipo comercial invierte el mismo tiempo en todos los contactos.

Por eso, el flujo debe filtrar sin sonar frío.

Ejemplo:

> “Perfecto. Para enviarte opciones que realmente encajen contigo, ¿Me confirmas tu presupuesto aproximado y si buscas para vivir o invertir?”

Si la persona no responde, se puede hacer seguimiento. Si responde con información clara, se puede avanzar.

## Cuándo enviar ficha, video, ubicación y precio

El orden importa.

1. Responde con información base.
1. Pregunta la necesidad.
1. Envía la ficha o el video.
1. Invita a una visita.
1. Registra el seguimiento.

Una ficha bien hecha debe incluir:

- Fotos.
- Video.
- Metraje.
- Distribución.
- Precio.
- Mantenimiento, si aplica.
- Ubicación referencial.
- Beneficios principales.
- Condiciones.
- Botón o mensaje de visita.

!leer contenido-inmobiliario-que-vende

## Cómo hacer seguimiento sin incomodar

El seguimiento comercial no debe sonar desesperado. Debe sonar útil.

**Ejemplo 1:**

> “Hola, quería saber si pudiste revisar el video de la propiedad. Si te interesa, puedo ayudarte a coordinar una visita esta semana”.

**Ejemplo 2:**

> “Te escribo para comentarte que la propiedad sigue disponible. Por ubicación y características, podría encajar bien con lo que estabas buscando”.

**Ejemplo 3:**

> “Si esta opción no es exactamente lo que buscas, puedo enviarte alternativas similares en la misma zona”.

## Métricas que debe medir WhatsApp

Un equipo serio no solo mide cuántos mensajes llegaron.

Debe medir:

- Tiempo promedio de primera respuesta.
- Porcentaje de leads respondidos.
- Porcentaje de leads calificados.
- Porcentaje de visitas agendadas.
- Porcentaje de visitas realizadas.
- Motivos de descarte.
- Costo por visita.
- Costo por venta.

~ Tasa de conversión
~ La tasa de conversión mide qué porcentaje de personas avanza de una etapa a otra. Por ejemplo, de consulta a visita, o de visita a oferta.

!leer campana-vender-propiedades-facebook-instagram-tiktok

## Conclusión

WhatsApp puede ser el mejor aliado de una inmobiliaria o su mayor fuga de ventas. Todo depende del proceso.

**Un buen anuncio atrae. Una buena conversación convierte. Un buen seguimiento cierra.**
""",
},
# ---------------------------------------------------------------------------
{
"slug": "marca-personal-agente-inmobiliario",
"title": "No vendas solo propiedades: conviértete en el agente inmobiliario que todos quieren contactar",
"seo_title": "Marca personal inmobiliaria para agentes",
"description": "Marca personal inmobiliaria: cómo un agente construye autoridad con especialización, contenido educativo, video profesional, testimonios y redes sociales.",
"excerpt": "El cliente evalúa al asesor antes de escribirle. Los cinco pilares de una marca personal inmobiliaria y qué publicar cada semana para generar confianza.",
"intent": "Marca personal",
"keyword": "marca personal inmobiliaria",
"keywords": ["agente inmobiliario", "marketing para agentes inmobiliarios", "redes sociales para agentes inmobiliarios", "cómo conseguir clientes inmobiliarios", "contenido inmobiliario"],
"cover": ("/assets/img/branding-hb.webp", 1672, 942, "Piezas de marca de una inmobiliaria para redes sociales"),
"services": ["contenido", "meta", "tiktok"],
"related": ["como-captar-clientes-inmobiliarios", "contenido-inmobiliario-que-vende", "como-vender-una-propiedad-en-redes-sociales"],
"cta_title": "Construye una marca que te recomienden",
"cta": "En Steid Hub ayudamos a agentes inmobiliarios a construir marca personal, contenido profesional y campañas digitales que convierten visibilidad en oportunidades reales.",
"body": """
Durante mucho tiempo, el agente inmobiliario dependió de tres cosas: referidos, letreros y portales. Hoy eso ya no basta.

El cliente no solo evalúa la propiedad. También evalúa al asesor. Antes de escribir, revisa el perfil, mira publicaciones, observa cómo se comunica y decide si transmite confianza.

Por eso, la marca personal dejó de ser un tema de imagen para convertirse en una herramienta comercial.

Un agente inmobiliario con buena marca personal no solo publica propiedades. Construye autoridad, especialización y recordación.

## Qué es una marca personal inmobiliaria

La marca personal es la percepción que el mercado tiene de ti antes de hablar contigo.

No es solo un logo. No es solo una foto profesional. No es solo tener Instagram.

Es la suma de:

- Cómo comunicas.
- Qué propiedades muestras.
- Qué zonas conoces.
- Qué tan claro explicas.
- Qué tan confiable pareces.
- Qué valor entregas incluso antes de vender.

En el sector inmobiliario, la confianza es un activo. El cliente está tomando una decisión económica importante, por lo que necesita sentir que está hablando con alguien serio.

## Por qué publicar propiedades no es suficiente

Muchos agentes solo publican inmuebles. Foto, precio, ubicación y número de contacto.

Eso puede informar, pero no necesariamente diferencia.

La pregunta es: **¿Por qué deberían contactar a ese agente y no a otro?**

La diferencia puede estar en el contenido educativo, en el análisis de zonas, en la claridad al explicar procesos, en la calidad audiovisual o en la constancia.

Semrush recomienda trabajar con keywords long-tail (de cola larga) en SEO inmobiliario porque suelen estar conectadas a búsquedas más específicas y motivadas dentro de mercados locales. Este mismo principio aplica al contenido de marca personal: mientras más específico el posicionamiento, más fácil es atraer al cliente correcto. [[Semrush|https://www.semrush.com/blog/real-estate-seo/]]

!leer como-captar-clientes-inmobiliarios

## Los cinco pilares de una marca personal inmobiliaria sólida

### 1. Especialización

Un agente que vende “de todo en todos lados” puede parecer menos experto que uno especializado.

Ejemplos:

- Especialista en departamentos de Lima Moderna.
- Especialista en terrenos industriales.
- Especialista en alquiler corporativo.
- Especialista en propiedades familiares en San Borja.
- Especialista en inversión inmobiliaria.

La especialización facilita que el cliente recuerde por qué contactarte.

### 2. Contenido educativo

El agente debe enseñar, no solo vender.

Temas útiles:

- Errores al comprar una propiedad.
- Cómo evaluar un precio inmobiliario.
- Qué revisar antes de separar un departamento.
- Diferencias entre compra para vivir e inversión.
- Qué documentos pedir antes de comprar.
- Cómo preparar una propiedad para venderla.

### 3. Contenido visual profesional

La imagen del agente se construye también con la imagen de sus propiedades. Si las fotos son descuidadas, la percepción de profesionalismo baja. Por eso conviene invertir en [fotografía, video](/contenido-inmobiliario) y tomas con [drone](/servicio-drone-inmobiliario).

La encuesta tecnológica de NAR muestra que las redes sociales y el drone forman parte del trabajo habitual de muchos agentes inmobiliarios modernos. [[NAR|https://www.nar.realtor/news/economists-outlook/tech-with-a-human-touch-how-realtors-are-using-tech-tools-in-todays-real-estate-market]]

### 4. Testimonios y casos reales

Los testimonios reducen incertidumbre. No tienen que ser exagerados. Basta con mostrar procesos reales: propiedad vendida, visita realizada, cliente asesorado, operación cerrada, entrega documentaria.

### 5. Seguimiento profesional

La marca personal no termina en redes. También se nota en cómo respondes, cómo agendas, cómo envías información y cómo haces seguimiento.

!leer whatsapp-inmobiliario-convertir-consultas-en-ventas

## Qué debería publicar un agente inmobiliario cada semana

Una estructura básica podría ser:

- 2 videos educativos.
- 2 publicaciones de propiedades.
- 1 análisis de zona.
- 1 historia de proceso o detrás de cámaras.
- 1 testimonio o caso real.
- Stories diarias mostrando actividad comercial.

No se trata de publicar por publicar. Se trata de repetir señales de confianza.

## Cómo usar cada red social

+ Instagram: ideal para estética, confianza, propiedades, testimonios y cercanía.
+ TikTok: ideal para alcance, educación rápida, recorridos, mitos y errores.
+ LinkedIn: ideal para clientes corporativos, inversionistas, networking y autoridad profesional.
+ Facebook: útil para públicos locales, comunidades, grupos y campañas de mensajes.

!leer como-vender-una-propiedad-en-redes-sociales

## Conclusión

El agente inmobiliario que gana no es necesariamente el que tiene más propiedades. Es el que logra ser recordado como especialista, genera confianza antes del primer contacto y convierte su presencia digital en una ventaja comercial.
""",
},
# ---------------------------------------------------------------------------
{
"slug": "como-captar-clientes-inmobiliarios",
"title": "Cómo conseguir más clientes inmobiliarios sin depender solo de referidos ni portales",
"seo_title": "Cómo captar clientes inmobiliarios sin portales",
"description": "Cómo captar clientes inmobiliarios de forma constante: compradores y propietarios, contenido, Google Ads, Meta Ads, TikTok, WhatsApp, CRM y métricas.",
"excerpt": "Meses con movimiento y meses en silencio. Cómo pasar de depender de referidos y portales a un sistema que capta compradores y propietarios todo el año.",
"intent": "Captar clientes",
"keyword": "cómo captar clientes inmobiliarios",
"keywords": ["cómo conseguir clientes inmobiliarios", "captar clientes inmobiliarios", "clientes para inmobiliaria", "generación de leads inmobiliarios", "marketing inmobiliario", "publicidad inmobiliaria"],
"cover": ("/assets/img/meta-audience-lima.webp", 1672, 941, "Segmentación de audiencias para captar clientes inmobiliarios en Lima"),
"services": ["google", "meta", "tiktok"],
"related": ["marca-personal-agente-inmobiliario", "mejores-leads-inmobiliarios", "maquina-digital-para-vender-propiedades"],
"cta_title": "Deja de perseguir clientes",
"cta": "En Steid Hub ayudamos a agentes e inmobiliarias a captar clientes con estrategia digital, contenido profesional, campañas en Google, Meta y TikTok, y procesos comerciales diseñados para convertir consultas en oportunidades reales.",
"body": """
Todo agente o inmobiliaria conoce el mismo problema: hay meses con movimiento y meses en silencio. Un referido aparece, una publicación funciona, un portal trae consultas. Luego, nada.

Ese ciclo de abundancia y escasez es uno de los grandes dolores comerciales del sector inmobiliario.

TikTok For Business describe justamente este problema: sin una estrategia constante de generación de leads, los profesionales inmobiliarios pueden caer en ciclos impredecibles de muchos contactos en un momento y pocos en otro. [[TikTok For Business|https://ads.tiktok.com/business/en/guides/real-estate-lead-generation]]

**Captar clientes inmobiliarios no debería depender de la suerte. Debe ser un sistema.**

## Primero: define qué tipo de cliente quieres captar

Un agente inmobiliario necesita captar dos tipos de clientes:

- Compradores o arrendatarios que buscan una propiedad.
- Propietarios que quieren vender o alquilar su inmueble.

Ambos son clientes, pero no se atraen igual.

+ El comprador: quiere opciones, precio, ubicación y confianza.
+ El propietario: quiere saber si puedes vender mejor, más rápido y con menos riesgo.

Por eso, una estrategia seria debe crear mensajes distintos para cada público.

## Cómo captar compradores inmobiliarios

Para compradores, la estrategia debe combinar búsqueda, contenido y conversación.

[Google Ads](/google-ads) permite aparecer cuando alguien busca activamente una propiedad. [Meta Ads](/meta-ads-inmobiliarias) ayuda a generar interés y remarketing. [TikTok](/servicios/tiktok-ads/) permite captar atención con videos cortos de propiedades, zonas y consejos.

En Perú, la escala digital justifica esta mezcla: DataReportal reportó 28.3 millones de identidades activas en redes sociales y un alcance publicitario relevante en plataformas como Facebook, Instagram y TikTok. [[DataReportal|https://datareportal.com/reports/digital-2026-peru]]

Ejemplos de contenido para captar compradores:

> “3 departamentos ideales para primera vivienda”.
> “Errores al comprar tu primer depa”.
> “Así se ve este departamento en San Miguel”.
> “¿Comprarías un terreno en esta zona?”
> “Lo que debes revisar antes de firmar una minuta”.

!leer google-meta-tiktok-vender-propiedades

## Cómo captar propietarios que quieren vender

Este público es distinto. El propietario no busca cualquier agente. Busca a alguien que le dé confianza.

Para atraer propietarios, funcionan contenidos como:

> “Por qué tu propiedad no recibe consultas”.
> “Cómo saber si tu inmueble está bien valorizado”.
> “Errores que bajan el valor percibido de una propiedad”.
> “Qué debe tener una estrategia digital para vender tu departamento”.
> “Cómo preparamos una propiedad antes de publicarla”.

Aquí el objetivo no es mostrar inventario. Es demostrar criterio.

!leer por-que-nadie-pregunta-por-mi-propiedad

## Por qué no deberías depender solo de portales

Los portales inmobiliarios pueden ser útiles, pero tienen una limitación: normalmente alquilas visibilidad. Cuando dejas de pagar, desapareces de los primeros lugares.

Una estrategia propia construye activos:

- Base de datos.
- Audiencias de remarketing.
- Marca personal.
- Posicionamiento SEO.
- Contenido reutilizable.
- Seguidores.
- Casos de éxito.
- Reputación.

No se trata de abandonar portales. Se trata de no depender únicamente de ellos.

## El sistema ideal para captar clientes inmobiliarios

Un sistema completo debería verse así:

> Contenido profesional → anuncios → landing o WhatsApp → calificación → visita → seguimiento → cierre.

Cada parte cumple una función:

+ El contenido: genera confianza.
+ Los anuncios: distribuyen.
+ La landing: ordena la información.
+ WhatsApp: convierte.
+ El CRM: evita perder oportunidades.
+ El seguimiento: aumenta los cierres.

Google recomienda crear contenido útil, confiable y pensado primero para personas, no solo para buscadores. Esto es importante para el SEO inmobiliario, porque los artículos deben responder dudas reales del cliente, no solo repetir keywords. [[Google Search Central|https://developers.google.com/search/docs/fundamentals/creating-helpful-content]]

!leer marca-personal-agente-inmobiliario

## Métricas que debe revisar un agente o inmobiliaria

No basta con preguntar “¿Cuántos leads llegaron?”.

Hay que medir:

- Costo por lead.
- Costo por lead calificado.
- Tasa de respuesta.
- Tasa de visita.
- Costo por visita.
- Tasa de cierre.
- Tiempo promedio hasta la venta.
- Fuente de cada oportunidad.

~ Costo por lead calificado
~ Es cuánto cuesta conseguir un contacto que realmente cumple con el perfil comercial mínimo. Es más útil que el CPL general porque filtra curiosos o contactos sin presupuesto.

## Conclusión

Captar clientes inmobiliarios no debe depender solo de referidos, portales o publicaciones ocasionales. La captación moderna combina contenido, pauta digital, SEO, redes sociales, WhatsApp y seguimiento comercial.

El agente o inmobiliaria que logra construir ese sistema deja de perseguir oportunidades y empieza a generarlas de manera constante.
""",
},
]
