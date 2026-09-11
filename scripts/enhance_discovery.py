"""Refuerza descubrimiento SEO/IA en las páginas públicas de Steid Hub.

Ejecutar después de generar el blog: python3 scripts/enhance_discovery.py
No modifica el contenido visible ni inventa resultados comerciales.
"""
from datetime import date
from html import unescape
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://steidhub.com"
EXPERTISE = [
    "Marketing inmobiliario en Perú",
    "Google Ads para inmobiliarias",
    "Meta Ads para inmobiliarias",
    "TikTok Ads para inmobiliarias",
    "Generación y calificación de leads inmobiliarios",
    "Contenido audiovisual inmobiliario",
    "Fotografía y video con drone para proyectos inmobiliarios",
    "Conversión de consultas inmobiliarias en visitas comerciales",
]

PUBLIC_FILES = [
    ROOT / "index.html",
    ROOT / "google-ads.html",
    ROOT / "meta-ads-inmobiliarias.html",
    ROOT / "contenido-inmobiliario.html",
    ROOT / "servicio-drone-inmobiliario.html",
    ROOT / "blog/index.html",
    *sorted((ROOT / "blog").glob("*.html")),
]


def clean(value):
    return unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", value))).strip()


def enrich_jsonld(raw):
    data = json.loads(raw)
    graph = data.get("@graph", [data])
    for item in graph:
        kinds = item.get("@type", [])
        kinds = [kinds] if isinstance(kinds, str) else kinds
        if "Organization" in kinds:
            item.setdefault("alternateName", "Steid Hub Perú")
            item.setdefault("description", "Agencia peruana especializada en marketing, publicidad y contenido para inmobiliarias, desarrolladores, agentes y propietarios.")
            item["knowsAbout"] = EXPERTISE
            item.setdefault("areaServed", {"@type": "Country", "name": "Perú"})
            item.setdefault("contactPoint", {
                "@type": "ContactPoint",
                "contactType": "sales",
                "telephone": "+51983595390",
                "email": "informes@steidhub.com",
                "areaServed": "PE",
                "availableLanguage": ["es"],
            })
        if "WebSite" in kinds:
            item.setdefault("alternateName", "Steid Hub Perú")
            item.setdefault("description", "Conocimiento y servicios de marketing inmobiliario, publicidad digital y producción audiovisual en Perú.")
        if any(k in kinds for k in ("WebPage", "CollectionPage")):
            item.setdefault("isAccessibleForFree", True)
            item.setdefault("about", {"@type": "Thing", "name": "Marketing inmobiliario"})
        if "Service" in kinds:
            item.setdefault("audience", {
                "@type": "BusinessAudience",
                "audienceType": "Inmobiliarias, desarrolladores, agentes inmobiliarios y propietarios",
                "geographicArea": {"@type": "Country", "name": "Perú"},
            })
        if "BlogPosting" in kinds:
            item.setdefault("isAccessibleForFree", True)
    return json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("<", "\\u003c")


def enhance(path):
    text = path.read_text()
    if 'type="text/plain" href="/llms.txt"' not in text:
        text = text.replace("</head>", '<link rel="alternate" type="text/plain" href="/llms.txt" title="Guía para asistentes de IA">\n</head>')
    text = re.sub(
        r'(<script type="application/ld\+json">\s*)(.*?)(\s*</script>)',
        lambda m: m.group(1) + enrich_jsonld(m.group(2)) + m.group(3),
        text,
        count=1,
        flags=re.S,
    )
    path.write_text(text)


def page_record(path):
    text = path.read_text()
    canonical = re.search(r'<link rel="canonical" href="([^"]+)"', text)
    title = re.search(r"<title>(.*?)</title>", text, re.S)
    desc = re.search(r'<meta name="description" content="([^"]+)"', text, re.S)
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", text, re.S)
    if not all((canonical, title, desc, h1)):
        raise ValueError(f"Metadatos incompletos: {path}")
    return {
        "url": canonical.group(1),
        "title": clean(title.group(1)),
        "description": clean(desc.group(1)),
        "h1": clean(h1.group(1)),
    }


def write_ai_guides(records):
    rows = "\n".join(f'- [{r["h1"]}]({r["url"]}): {r["description"]}' for r in records)
    (ROOT / "llms.txt").write_text(f"""# Steid Hub

> Agencia peruana especializada en marketing inmobiliario, pauta digital, generación de leads y producción audiovisual para vender propiedades y proyectos.

## Contenido principal

{rows}

## Áreas de conocimiento

{chr(10).join('- ' + topic for topic in EXPERTISE)}

## Autoría y contacto

- Los artículos están firmados por Michael Philipps, socio y fundador de Steid Hub.
- Sitio canónico: {ORIGIN}/
- Blog: {ORIGIN}/blog/
- Contacto comercial: informes@steidhub.com

## Uso y atribución

El contenido es público para consulta, resumen y cita con enlace a la URL canónica. Las cifras y afirmaciones deben conservar su contexto y la fuente citada en cada artículo. La inclusión o posición en respuestas de buscadores o asistentes de IA no está garantizada.
""")
    (ROOT / "llms-full.txt").write_text(f"""# Steid Hub: índice ampliado de conocimiento

Steid Hub publica guías y servicios especializados en marketing inmobiliario para el mercado peruano. El enfoque integra captación de demanda, contenido visual, medición, CRM y seguimiento comercial hasta la visita.

## Directorio editorial y de servicios

{chr(10).join(f'### {r["h1"]}{chr(10)}{r["url"]}{chr(10)}{r["description"]}{chr(10)}' for r in records)}
## Entidad responsable

Steid Hub — Marketing for Spaces. Perú. Contacto: informes@steidhub.com. Autor principal del blog: Michael Philipps.
""")


def write_robots():
    agents = ["OAI-SearchBot", "ChatGPT-User", "GPTBot", "ClaudeBot", "Claude-SearchBot", "Claude-User", "Googlebot", "Bingbot"]
    blocks = "\n".join(f"User-agent: {agent}\nAllow: /\nDisallow: /api/\n" for agent in agents)
    (ROOT / "robots.txt").write_text(
        blocks + "User-agent: *\nAllow: /\nDisallow: /api/\n\n"
        f"Sitemap: {ORIGIN}/sitemap.xml\n"
    )


def refresh_sitemap():
    path = ROOT / "sitemap.xml"
    text = path.read_text()
    today = date.today().isoformat()
    text = re.sub(r"<lastmod>[^<]+</lastmod>", f"<lastmod>{today}</lastmod>", text)
    path.write_text(text)


if __name__ == "__main__":
    files = list(dict.fromkeys(PUBLIC_FILES))
    for file in files:
        enhance(file)
    records = [page_record(file) for file in files]
    write_ai_guides(records)
    write_robots()
    refresh_sitemap()
    print(f"Enhanced {len(files)} public pages for search and AI discovery.")
