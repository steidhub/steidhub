"""Maintain practical, page-specific guidance on the compact service/sector pages."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
GUIDANCE = {
    "servicios/": (
        "Cómo elegir el servicio adecuado",
        "Si el proyecto todavía no comunica con claridad su ubicación, atributos y público, empezamos por estrategia, identidad y material visual. Si ya recibe consultas pero pocas visitas, revisamos la página de destino, la calidad del lead y el seguimiento comercial antes de invertir más. Cuando la oferta y el proceso están claros, Google Ads capta demanda activa y Meta o TikTok pueden ampliar descubrimiento con piezas adaptadas.",
        "No existe un canal único para todos los proyectos. La elección depende de etapa de obra, inventario, zona, presupuesto, plazo comercial y capacidad de respuesta del equipo. La medición debe conectar anuncios y contenido con consultas calificadas y visitas, no quedarse en impresiones."
    ),
    "sectores/": (
        "Especialización en proyectos inmobiliarios",
        "La venta inmobiliaria exige explicar una decisión de alto valor. Un comprador necesita entender ubicación, distribución, disponibilidad, precio y respaldo del proyecto; una imagen atractiva por sí sola no responde esas preguntas. En Steid Hub conectamos contenido visual, publicidad y seguimiento para que la información llegue de forma coherente desde el primer anuncio hasta la visita.",
        "Adaptamos el mensaje a preventa, obra, entrega inmediata o unidades finales. Para evaluar el trabajo revisamos consultas útiles, visitas y aprendizaje del equipo comercial; no prometemos plazos de venta ni porcentajes sin una línea base medible."
    ),
    "servicios/performance-marketing/": (
        "Qué medir antes de aumentar la inversión",
        "Una campaña no debería evaluarse solo por clics o formularios. Acordamos con ventas qué cuenta como consulta válida, visita agendada y oportunidad real; después revisamos el costo de cada etapa y el tiempo de respuesta. Si aumenta el volumen pero cae la proporción de visitas, el problema puede estar en la oferta, la calificación o el seguimiento, no necesariamente en la pauta.",
        "Para comparar canales usamos el mismo periodo, la misma definición de lead y una atribución documentada. Los resultados se interpretan junto con inventario, ubicación, precio y etapa comercial del proyecto."
    ),
    "servicios/google-ads/": (
        "De la búsqueda a una consulta útil",
        "Agrupamos búsquedas por intención: quien investiga una zona no necesita el mismo mensaje que quien pregunta por precio y disponibilidad. Revisamos términos reales, concordancias y exclusiones para evitar pagar por tráfico que no corresponde al proyecto. El anuncio debe llevar a una página donde ubicación, tipo de inmueble y siguiente paso sean claros.",
        "La conversión relevante no termina en el clic a WhatsApp. Conviene distinguir contacto iniciado, conversación respondida, lead calificado y visita. Esa lectura permite ajustar anuncios sin confundir volumen con intención de compra."
    ),
    "servicios/meta-ads/": (
        "Creatividades y calidad del contacto",
        "En Facebook e Instagram la persona suele descubrir el proyecto antes de buscarlo activamente. Por eso la pieza debe mostrar el inmueble, la zona y una razón concreta para considerar la oferta desde los primeros segundos. Probamos mensajes diferentes para preventa, entrega inmediata y unidades finales, y revisamos la frecuencia para renovar piezas cuando pierden respuesta.",
        "Al comparar formularios, WhatsApp y landing pages, medimos cuántas consultas cumplen el perfil buscado y reciben seguimiento. Un formulario barato que no produce visitas no es automáticamente la mejor campaña."
    ),
    "servicios/tiktok-ads/": (
        "Video vertical con contexto inmobiliario",
        "Una toma atractiva necesita contexto: ubicación, tipo de proyecto, metraje o beneficio verificable. Preparamos cortes verticales que expliquen una idea por pieza y llevan a una acción simple. El inicio debe responder por qué el inmueble merece atención; después mostramos distribución, entorno o avance de obra según la etapa de compra.",
        "Comparamos retención, consultas y calidad de esas consultas, no solo reproducciones. Antes de escalar una pieza confirmamos que el equipo pueda responder con información actualizada de precio y disponibilidad."
    ),
    "servicios/generacion-de-leads/": (
        "Del registro a la visita",
        "Antes de activar campañas definimos qué datos necesita el asesor para atender bien: proyecto de interés, presupuesto aproximado, plazo de compra y canal preferido, siempre sin pedir más información de la necesaria. Una respuesta rápida y contextual suele ser más útil que enviar el mismo mensaje automático a todos.",
        "El tablero debe separar registros duplicados, contactos no localizados, consultas calificadas y visitas realizadas. Así se detecta dónde se pierde la oportunidad y qué parte del recorrido requiere una mejora."
    ),
    "servicios/landing-pages/": (
        "Una página para decidir, no solo para hacer clic",
        "La landing debe responder lo que el anuncio promete: ubicación, atributos, evidencia visual, precio o rango cuando esté disponible, y una forma clara de consultar. En móvil revisamos legibilidad, peso de imágenes y formularios cortos; las piezas pesadas o un mensaje ambiguo pueden interrumpir el recorrido.",
        "Medimos visitas, interacción con la información clave y consultas posteriores. Si el tráfico llega pero no pregunta, analizamos primero coherencia entre búsqueda, anuncio y contenido antes de cambiar únicamente el botón."
    ),
    "servicios/crm-automatizacion/": (
        "Seguimiento sin perder el contexto",
        "Cada consulta debe llegar al equipo con su fuente, campaña y proyecto de interés. Definimos etapas simples —nuevo, contactado, calificado, visita, negociación y cierre— para que el CRM refleje trabajo comercial real y no solo acumule nombres.",
        "Las automatizaciones pueden confirmar recepción, asignar responsables y recordar seguimientos; no deberían reemplazar respuestas humanas a preguntas de precio, financiamiento o disponibilidad. Revisamos tiempos de primera respuesta y motivos de pérdida para mejorar el proceso."
    ),
    "servicios/produccion-audiovisual/": (
        "Material que responde preguntas de compra",
        "Planificamos cada toma según su uso: una ficha necesita mostrar distribución y acabados; una campaña breve requiere un inicio claro; una presentación comercial puede necesitar accesos, entorno y áreas comunes. La iluminación y el encuadre deben representar el espacio fielmente, sin ocultar limitaciones importantes.",
        "De una sesión se pueden preparar variantes verticales, horizontales y cuadradas, pero cada formato exige revisar composición y texto. Entregamos archivos identificables por proyecto y canal para facilitar su publicación y medición."
    ),
    "servicios/branding-inmobiliario/": (
        "Identidad útil en cada punto de contacto",
        "La marca del proyecto debe hacer reconocibles su propuesta y su segmento, pero también funcionar en una fachada, una ficha de portal, un video vertical y un anuncio pequeño. Partimos de atributos comprobables —ubicación, tipología, estilo o comunidad— y evitamos promesas que el producto no puede sostener.",
        "Definimos un sistema de mensajes y piezas que el equipo comercial pueda usar con consistencia. Revisamos cómo se entiende la propuesta en móvil y si la información esencial sigue siendo clara sin depender de un diseño elaborado."
    ),
    "sectores/marketing-inmobiliario/": (
        "Una estrategia según la etapa del proyecto",
        "No se comunica igual un desarrollo en planos que una unidad lista para visitar. En preventa hacen falta ubicación, respaldo del promotor y una explicación comprensible del producto; en stock final importan disponibilidad, acabados y condiciones vigentes. Organizamos contenido, campañas y atención comercial alrededor de esas preguntas.",
        "La medición útil conecta alcance con consultas calificadas, visitas y cierres, sin atribuir toda una venta al último anuncio. El aprendizaje de asesores y compradores alimenta nuevas piezas y respuestas para el sitio."
    ),
}

def apply_editorial():
    changed = 0
    for route, (title, first, second) in GUIDANCE.items():
        path = ROOT / route / "index.html"
        html = path.read_text()
        section = (f'<section class="seo-section" id="guia-practica" aria-labelledby="guia-practica-title">'
                   f'<h2 id="guia-practica-title">{title}</h2><p>{first}</p><p>{second}</p></section>')
        if 'id="guia-practica"' in html:
            updated = re.sub(r'<section class="seo-section" id="guia-practica".*?</section>', section, html, count=1, flags=re.S)
        else:
            updated = html.replace('</article>', section + '\n</article>', 1)
        if updated != html:
            path.write_text(updated)
            changed += 1
    return changed

if __name__ == "__main__":
    print(f"Updated {apply_editorial()} editorial pages.")
