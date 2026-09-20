"""Genera el blog: python3 scripts/build_blog.py

Lee scripts/blog_posts.py y escribe:
  blog/index.html          -> /blog/
  blog/<slug>.html         -> /blog/<slug>   (Cloudflare Pages sirve la URL sin .html)
y añade las URLs del blog a sitemap.xml.
"""
import html, json, math, re, unicodedata
from datetime import date
from pathlib import Path
from urllib.parse import quote

import blog_posts as B

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://steidhub.com"
OUT = ROOT / "blog"
V = "20260920-blog18"
POSTS = {p["slug"]: p for p in B.POSTS}
COVER_UPDATED = "2026-09-20"
# Créditos editoriales de la portada. No se adjudica un distrito/proyecto si
# el archivo de origen no permite confirmarlo.
COVER_CREDITS = {
    "marketing-inmobiliario-lima-2026": "Vista aérea de Miraflores, Lima — Steid Hub",
    "marketing-proyecto-inmobiliario-preventa-lima": "Toma aérea del proyecto Praderas del Sur — Steid Hub",
    "landing-page-inmobiliaria": "Sesión fotográfica de un ambiente interior — Steid Hub",
    "google-ai-mode-ai-max-inmobiliarias": "Vista aérea de Lima — Steid Hub",
    "seo-inmobiliario-peru": "Panorámica aérea de un entorno residencial — Steid Hub",
    "como-vender-departamento-lima": "Sesión fotográfica de la cocina de The Grand, San Isidro, Lima — Steid Hub",
    "vender-departamentos-40-60-m2-lima": "Sesión fotográfica de un departamento en San Borja, Lima — Steid Hub",
    "captar-inversionistas-inmobiliarios-lima": "Sesión fotográfica del comedor de The Grand, San Isidro, Lima — Steid Hub",
    "maquina-digital-para-vender-propiedades": "Toma aérea de un proyecto inmobiliario — Steid Hub",
    "google-meta-tiktok-vender-propiedades": "Toma aérea de un condominio de playa en Chincha — Steid Hub",
    "mejores-leads-inmobiliarios": "Sesión fotográfica del comedor de The Grand, San Isidro, Lima — Steid Hub",
    "contenido-inmobiliario-que-vende": "Sesión fotográfica de un ambiente interior — Steid Hub",
    "como-vender-una-propiedad-en-redes-sociales": "Toma aérea de viviendas de playa — Steid Hub",
    "campana-vender-propiedades-facebook-instagram-tiktok": "Sesión fotográfica de un dormitorio — Steid Hub",
    "por-que-nadie-pregunta-por-mi-propiedad": "Toma aérea de una vivienda de campo — Steid Hub",
    "como-vender-terrenos-y-lotes-por-internet": "Toma aérea de lotes y accesos de un proyecto residencial — Steid Hub",
    "whatsapp-inmobiliario-convertir-consultas-en-ventas": "Toma aérea del Condominio Playa del Carmen, Chincha — Steid Hub",
    "marca-personal-agente-inmobiliario": "Identidad visual de Haut Bâtiment — Steid Hub",
    "como-captar-clientes-inmobiliarios": "Toma aérea de un edificio residencial en Lima — Steid Hub",
}
MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto",
         "septiembre", "octubre", "noviembre", "diciembre"]


def esc(s):
    return html.escape(s, quote=True)


def slugify(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def fecha_larga(iso):
    d = date.fromisoformat(iso)
    return f"{d.day} de {MESES[d.month - 1]} de {d.year}"


def wa(text):
    return "https://wa.me/51983595390?text=" + quote(text, safe="")


# ---------------------------------------------------------------- marcado ---
def inline(text):
    t = esc(text)
    t = re.sub(r"\[\[([^|\]]+)\|([^\]]+)\]\]",
               lambda m: f'<a class="cite" href="{m[2]}" target="_blank" rel="noopener">'
                         f'<span class="sr-only">Fuente: </span>{m[1]}</a>', t)
    def link(m):
        label, url = m[1], m[2]
        ext = url.startswith("http")
        return f'<a href="{url}"' + (' target="_blank" rel="noopener"' if ext else "") + f">{label}</a>"
    t = re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", link, t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<![\w*])\*([^*]+)\*(?!\w)", r"<em>\1</em>", t)
    return t


def related_card(slug, label="Lee también"):
    p = POSTS[slug]
    src, w, h, alt = p["cover"]
    return (f'<aside class="post-read" aria-label="{label}">'
            f'<a href="/blog/{slug}">'
            f'<img src="{src}" alt="" width="{w}" height="{h}" loading="lazy">'
            f'<span><small>{label}</small><strong>{esc(p["title"])}</strong></span></a></aside>')


def render_body(src):
    out, toc, first_p = [], [], True
    for block in [b.strip("\n") for b in re.split(r"\n\s*\n", src.strip())]:
        lines = [l.rstrip() for l in block.split("\n") if l.strip()]
        head = lines[0]
        if head.startswith("## "):
            title = head[3:].strip()
            hid = slugify(title)
            toc.append((hid, re.sub(r"^\d+\.\s*", "", title)))
            out.append(f'<h2 id="{hid}">{inline(title)}</h2>')
        elif head.startswith("### "):
            out.append(f"<h3>{inline(head[4:].strip())}</h3>")
        elif head.startswith("!leer "):
            out.append(related_card(head[6:].strip()))
        elif all(l.startswith("- ") for l in lines):
            out.append("<ul>" + "".join(f"<li>{inline(l[2:])}</li>" for l in lines) + "</ul>")
        elif all(re.match(r"\d+\. ", l) for l in lines):
            out.append("<ol>" + "".join(f"<li>{inline(l.split(' ', 1)[1])}</li>" for l in lines) + "</ol>")
        elif all(l.startswith("+ ") for l in lines):
            rows = []
            for l in lines:
                body = l[2:]
                if ":" in body:
                    dt, dd = body.split(":", 1)
                    rows.append(f"<div><dt>{inline(dt.strip())}</dt><dd>{inline(dd.strip())}</dd></div>")
                else:
                    rows.append(f'<div class="is-solo"><dt>{inline(body.strip().rstrip("."))}</dt></div>')
            out.append('<dl class="ficha">' + "".join(rows) + "</dl>")
        elif all(l.startswith("~ ") for l in lines):
            term, *txt = [l[2:] for l in lines]
            out.append('<aside class="termino"><p class="termino__label">Término explicado</p>'
                       f'<p class="termino__t">{inline(term)}</p>' + "".join(f"<p>{inline(t)}</p>" for t in txt) + "</aside>")
        elif all(l.startswith("> ") for l in lines):
            out.append('<blockquote class="ejemplo">' + "".join(f"<p>{inline(l[2:])}</p>" for l in lines) + "</blockquote>")
        elif all(l.startswith("|") for l in lines):
            rows = [[c.strip() for c in l.strip("|").split("|")] for l in lines]
            thead = "<tr>" + "".join(f'<th scope="col">{inline(c)}</th>' for c in rows[0]) + "</tr>"
            tbody = "".join("<tr>" + f'<th scope="row">{inline(r[0])}</th>' +
                            "".join(f'<td data-label="{esc(rows[0][i + 1])}">{inline(c)}</td>'
                                    for i, c in enumerate(r[1:])) + "</tr>" for r in rows[1:])
            out.append(f'<div class="tabla tabla--cols-{len(rows[0])}"><table><thead>{thead}</thead><tbody>{tbody}</tbody></table></div>')
        else:
            text = ' '.join(lines)
            # la frase que presenta una lista o un ejemplo ("Debe incluir:") queda pegada a lo que presenta
            cls = ' class="post__intro"' if first_p else (' class="lead-in"' if text.rstrip("*").endswith(":") else "")
            first_p = False
            out.append(f"<p{cls}>{inline(' '.join(lines))}</p>")
    html_body = "\n".join(out)
    words = len(re.sub(r"<[^>]+>", " ", html_body).split())
    sources = list(dict.fromkeys(re.findall(r"\[\[[^|\]]+\|([^\]]+)\]\]", src)))
    return html_body, toc, words, sources


# ------------------------------------------------------------ fragmentos ---
ICON_ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
WA_HELLO = "https://wa.me/51983595390?text=Hola%2C%20Steid%20Hub%2C%20deseo%20m%C3%A1s%20informaci%C3%B3n"
GTM_NOSCRIPT = '''<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KGVBFL2M"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->'''


def head(title, description, canonical, image, image_alt, og_type="article", extra_meta="", jsonld=None, preload=None):
    img_abs = ORIGIN + image[0]
    image = (image[0], 1200, 630) if image[0].startswith("/assets/og/") else image
    return f"""<!doctype html>
<html lang="es-PE">
<head>
<meta charset="utf-8">
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){{w[l]=w[l]||[];w[l].push({{'gtm.start':
new Date().getTime(),event:'gtm.js'}});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
}})(window,document,'script','dataLayer','GTM-KGVBFL2M');</script>
<!-- End Google Tag Manager -->
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(description)}">
<link rel="canonical" href="{canonical}">
<link rel="alternate" hreflang="es-PE" href="{canonical}">
<link rel="alternate" hreflang="x-default" href="{canonical}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<meta name="author" content="{B.AUTHOR['name']}">
<meta name="theme-color" content="#111111">
<meta property="og:type" content="{og_type}">
<meta property="og:locale" content="es_PE">
<meta property="og:site_name" content="Steid Hub">
<meta property="og:url" content="{canonical}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(description)}">
<meta property="og:image" content="{img_abs}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="{image[1]}">
<meta property="og:image:height" content="{image[2]}">
<meta property="og:image:alt" content="{esc(image_alt)}">
{extra_meta}<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{esc(title)}">
<meta name="twitter:description" content="{esc(description)}">
<meta name="twitter:image" content="{img_abs}">
<meta name="twitter:image:alt" content="{esc(image_alt)}">
<link rel="icon" href="/assets/logos/steidhub-mark-white.png">
<link rel="alternate" type="application/rss+xml" title="Blog de Steid Hub" href="/blog/feed.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap">
{f'<link rel="preload" as="image" href="{preload}" fetchpriority="high">' if preload else ''}
<script>/* Oculta las animaciones sólo mientras landing.js siga vivo. Si ese archivo
   no carga (bloqueado, 404, error), soltamos la clase y la pagina se ve entera. */
(function(d){{d.classList.add("has-js");setTimeout(function(){{
  if(!window.__lpReady)d.classList.remove("has-js");}},3000);}})(document.documentElement)</script>
<link rel="stylesheet" href="/styles.css?v=20260910-seo1">
<link rel="stylesheet" href="/landing.css?v={V}">
<link rel="stylesheet" href="/blog.css?v={V}">
<link rel="stylesheet" href="/lead-modal.css?v=20260919-1">
<script src="/lead-modal.js?v=20260919-1" defer></script>
<script type="application/ld+json">
{json.dumps(jsonld, ensure_ascii=False)}
</script>
</head>"""


def nav(current_blog=True):
    return f"""<a class="skip" href="#main">Saltar al contenido</a>
<div class="post-progress" aria-hidden="true"><i></i></div>

<header class="lp-nav">
  <div class="wrap lp-nav__inner">
    <a class="lp-nav__logo" href="/" aria-label="Steid Hub — inicio">
      <img src="/assets/logos/steidhub-lockup-white.png" alt="Steid Hub, marketing for spaces" width="900" height="240">
    </a>
    <nav class="lp-nav__links" aria-label="Servicios para inmobiliarias">
      <a href="/google-ads">Google Ads</a>
      <a href="/meta-ads-inmobiliarias">Meta y TikTok Ads</a>
      <a href="/contenido-inmobiliario">Contenido</a>
      <a href="/servicio-drone-inmobiliario">Drone</a>
      <a href="/blog/"{' aria-current="page"' if current_blog else ''}>Blog</a>
    </nav>
    <a class="btn btn--primary lp-nav__cta" href="{wa('Hola, Steid Hub. Leí su blog y deseo un diagnóstico gratuito para mi proyecto inmobiliario.')}" rel="noopener">Diagnóstico gratis</a>
  </div>
</header>"""


GALLERY = [
    ("/assets/img/thegrand-cocina.webp", 1800, 1200, "Cocina con isla de mármol fotografiada con luz natural para la venta de un departamento", "Interiores"),
    ("/assets/img/hero-drone.webp", 1800, 1350, "Toma aérea con drone de un proyecto inmobiliario y su entorno", "Drone"),
    ("/assets/img/sala-sanborja.webp", 1536, 1024, "Sala de departamento en San Borja con ventanales de piso a techo", "Ambientes"),
    ("/assets/img/playa-carmen.webp", 1800, 1350, "Toma aérea de condominio de playa con trazado de lotes y áreas comunes", "Playa"),
    ("/assets/img/thegrand-comedor.webp", 1800, 1200, "Comedor de departamento premium con acabados de madera y vista a la ciudad", "Acabados"),
    ("/assets/img/golf-pano.webp", 1800, 1016, "Toma aérea panorámica de zona residencial junto a campo de golf", "Aéreas"),
    ("/assets/img/praderas.webp", 1800, 1330, "Casas de campo con piscina en proyecto residencial de provincia", "Campo"),
    ("/assets/img/miraflores.webp", 1800, 1350, "Vista de Miraflores para campaña de proyecto inmobiliario en Lima", "Ciudad"),
]


def gallery():
    figs = "\n".join(
        f"""        <figure>
          <img src="{s}" alt="{esc(a)}" loading="lazy" width="{w}" height="{h}">
          <figcaption>{c}</figcaption>
        </figure>""" for s, w, h, a, c in GALLERY)
    return f"""  <section class="lp-section" id="trabajos">
    <div class="wrap">
      <div class="lp-head reveal">
        <p class="eyebrow">Nuestro trabajo</p>
        <h2 class="h2">Así se ven los proyectos que producimos</h2>
        <p class="lead">Fotografía, video y drone para departamentos, casas de playa, lotes de campo y proyectos en Lima y provincias.</p>
      </div>
      <div class="lp-carousel reveal" data-lp-carousel>
        <button class="lp-carousel__nav lp-carousel__nav--prev" type="button" data-lp-prev aria-label="Imagen anterior"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg></button>
        <button class="lp-carousel__nav lp-carousel__nav--next" type="button" data-lp-next aria-label="Imagen siguiente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
        <div class="lp-gallery">
{figs}
        </div>
        <div class="lp-carousel__bar" aria-hidden="true"><i></i></div>
      </div>
    </div>
  </section>"""


def cta(title, text, wa_text):
    return f"""  <section class="lp-section" id="diagnostico">
    <div class="wrap">
      <div class="lp-cta reveal">
        <div class="lp-head">
          <p class="eyebrow eyebrow--plain">Diagnóstico gratis</p>
          <h2 class="h2">{esc(title)}</h2>
          <p class="lead">{esc(text)}</p>
        </div>
        <a class="btn btn--primary btn--lg" href="{wa(wa_text)}" rel="noopener">
          Solicitar diagnóstico gratuito
          {ICON_ARROW}
        </a>
      </div>
    </div>
  </section>"""


# Formulario y bloque de contacto: copia exacta del de las landings.
CONTACT = (ROOT / "meta-ads-inmobiliarias.html").read_text()
CONTACT = CONTACT[CONTACT.index('  <section class="lp-section section--photo" id="contacto">'):CONTACT.index('  <section class="lp-section" id="servicios">')]
CONTACT = CONTACT.replace('src="assets/', 'src="/assets/').rstrip() + "\n"
FOOTER_WA = (ROOT / "meta-ads-inmobiliarias.html").read_text()
FOOTER_START = FOOTER_WA.index('<footer class="footer">')
FOOTER_WA = FOOTER_WA[FOOTER_START:FOOTER_WA.index("<script src=", FOOTER_START)]
FOOTER_WA = (FOOTER_WA.replace('src="assets/', 'src="/assets/')
             .replace('href="google-ads.html"', 'href="/google-ads"')
             .replace('href="contenido-inmobiliario.html"', 'href="/contenido-inmobiliario"')
             .replace('href="servicio-drone-inmobiliario.html"', 'href="/servicio-drone-inmobiliario"')
             .replace('href="index.html#', 'href="/#')
             .replace('<li><a href="/#portafolio">Portafolio</a></li>',
                      '<li><a href="/#portafolio">Portafolio</a></li>\n          <li><a href="/blog/">Blog de marketing inmobiliario</a></li>'))
FOOTER_WA = FOOTER_WA.replace("<h4>", '<h2 class="footer__heading">').replace("</h4>", "</h2>")
FOOTER_WA = FOOTER_WA.split('<div class="popup"', 1)[0]
assert 'href="/blog/"' in FOOTER_WA and "index.html" not in FOOTER_WA
BLOG_POPUPS = """<div class="popup" data-popup-step="1" data-popup-key="ads" data-popup-gate="dia" data-popup-trigger="ancla:#autor" hidden>
  <div class="popup__scrim" data-popup-close></div>
  <div class="popup__box" role="dialog" aria-modal="true" aria-label="Asesoría y diagnóstico gratis">
    <a class="popup__link" href="https://wa.me/51983595390?text=Hola%2C%20Steid%20Hub.%20Quiero%20agendar%20mi%20asesor%C3%ADa%20y%20diagn%C3%B3stico%20gratis%20para%20mis%20campa%C3%B1as." rel="noopener">
      <img src="/assets/img/popup-diagnostico.webp" alt="¿Inviertes en ads pero no vendes? Obtén una asesoría y diagnóstico gratis para TikTok Ads, Meta Ads y Google Ads. Agenda tu reunión ahora." width="800" height="1000" loading="lazy" decoding="async">
    </a>
    <button class="popup__close" type="button" data-popup-close aria-label="Cerrar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
  </div>
</div>
<div class="popup" data-popup-step="2" data-popup-key="descuento" hidden>
  <div class="popup__scrim" data-popup-close></div>
  <div class="popup__box" role="dialog" aria-modal="true" aria-label="20% de descuento en tu primera producción audiovisual">
    <a class="popup__link" href="https://wa.me/51983595390?text=Hola%2C%20Steid%20Hub.%20Quiero%20agendar%20mi%20primera%20producci%C3%B3n%20audiovisual%20con%20el%2020%25%20de%20descuento." rel="noopener">
      <img src="/assets/img/popup-descuento-audiovisual.webp" alt="20% de descuento en tu primera producción audiovisual con Steid Hub. Agenda ahora." width="800" height="1000" loading="lazy" decoding="async">
    </a>
    <button class="popup__close" type="button" data-popup-close aria-label="Cerrar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
  </div>
</div>
"""
SCRIPTS = f"""<script src="/popup.js?v=20260911-pop3" defer></script>
<script src="/wa-widget.js?v=20260910-lp1" defer></script>
<script src="/landing.js?v=20260910-ux13" defer></script>
<script src="/blog.js?v={V}" defer></script>
</body>
</html>
"""


def explore(keys):
    cards = "\n".join(f"""        <a href="{B.SERVICES[k][0]}">
          <span>{B.SERVICES[k][1]}</span>
          <strong>{B.SERVICES[k][2]}</strong>
          <p>{B.SERVICES[k][3]}</p>
        </a>""" for k in keys)
    return f"""  <section class="lp-section" id="servicios">
    <div class="wrap">
      <div class="lp-head reveal">
        <p class="eyebrow">Sigue explorando</p>
        <h2 class="h2">Servicios relacionados</h2>
        <p class="lead">Cada servicio resuelve una parte del embudo: la pauta trae la demanda, el contenido la convence y la medición indica dónde invertir el siguiente sol.</p>
      </div>
      <div class="lp-cluster reveal" data-d="1">
{cards}
      </div>
      <nav class="post-links reveal" aria-label="Más de Steid Hub">
        <a href="/">Página principal</a>
        <a href="/servicios/">Todos los servicios</a>
        <a href="/#portafolio">Portafolio</a>
        <a href="/blog/">Blog</a>
      </nav>
    </div>
  </section>"""


ORG = {"@type": "Organization", "@id": ORIGIN + "/#organization", "name": "Steid Hub", "url": ORIGIN + "/",
       "logo": {"@type": "ImageObject", "url": ORIGIN + "/assets/logos/steidhub-lockup-white.png"},
       "email": "informes@steidhub.com", "telephone": "+51983595390",
       "sameAs": ["https://instagram.com/steidhub", "https://tiktok.com/@steidhub"]}
WEBSITE = {"@type": "WebSite", "@id": ORIGIN + "/#website", "url": ORIGIN + "/", "name": "Steid Hub",
           "inLanguage": "es-PE", "publisher": {"@id": ORIGIN + "/#organization"}}
PERSON = {"@type": "Person", "@id": ORIGIN + "/#michael-philipps", "name": B.AUTHOR["name"],
          "jobTitle": B.AUTHOR["role"], "honorificSuffix": B.AUTHOR["credentials"],
          "description": B.AUTHOR["role"] + " | " + B.AUTHOR["credentials"] + ", " + B.AUTHOR["specialty"],
          "knowsAbout": ["Marketing digital", "Marketing inmobiliario", "Publicidad inmobiliaria",
                         "Producción audiovisual inmobiliaria", "Fotografía y video con drone", "Bienes raíces"],
          "alumniOf": {"@type": "CollegeOrUniversity", "name": "Universidad del Pacífico"},
          "hasCredential": [
              {"@type": "EducationalOccupationalCredential", "name": "Agente inmobiliario registrado 23267-PN-MVCS",
               "credentialCategory": "Registro profesional",
               "recognizedBy": {"@type": "GovernmentOrganization", "name": "Ministerio de Vivienda, Construcción y Saneamiento"}},
              {"@type": "EducationalOccupationalCredential", "name": "Piloto de drone certificado",
               "credentialCategory": "Certificación",
               "recognizedBy": {"@type": "GovernmentOrganization", "name": "Dirección General de Aeronáutica Civil (DGAC)"}}],
          "image": ORIGIN + B.AUTHOR["photo"], "url": B.AUTHOR["linkedin"], "sameAs": [B.AUTHOR["linkedin"]], "worksFor": {"@id": ORIGIN + "/#organization"}}
BLOG_ID = ORIGIN + "/blog/#blog"


def author_row(p, words):
    mins = max(1, math.ceil(words / 220))
    published = p.get("published", B.PUBLISHED)
    return f"""      <div class="post-byline">
        <img class="post-byline__img" src="{B.AUTHOR['avatar']}" alt="{B.AUTHOR['name']}" width="192" height="192">
        <div class="post-byline__txt">
          <a class="post-byline__name" href="#autor" rel="author">{B.AUTHOR['name']}</a>
          <span>{B.AUTHOR['role']} <span aria-hidden="true">|</span> {B.AUTHOR['credentials']}, {B.AUTHOR['specialty']}</span>
        </div>
        <p class="post-byline__meta"><time datetime="{published}">{fecha_larga(published)}</time><span aria-hidden="true">·</span><span>{mins} min de lectura</span></p>
      </div>"""


def author_box():
    paras = "\n".join(f"          <p>{inline(t)}</p>" for t in B.AUTHOR["bio"])
    return f"""      <aside class="author-box" id="autor" aria-labelledby="autor-titulo">
        <div class="author-box__head">
          <img src="{B.AUTHOR['avatar']}" alt="{B.AUTHOR['name']}" width="192" height="192" loading="lazy">
          <div>
            <h2 id="autor-titulo">Conoce más al autor</h2>
            <p class="author-box__name">{B.AUTHOR['name']}</p>
            <p class="author-box__role">{B.AUTHOR['role']} <span aria-hidden="true">|</span> {B.AUTHOR['credentials']}, {B.AUTHOR['specialty']}</p>
          </div>
          <a class="author-box__in" href="{B.AUTHOR['linkedin']}" target="_blank" rel="noopener me" aria-label="Perfil de LinkedIn de {B.AUTHOR['name']}">
            <img src="/assets/logos/linkedin.webp" alt="" width="96" height="96" loading="lazy">
          </a>
        </div>
        <div class="author-box__bio">
{paras}
        </div>
      </aside>"""


def share(url, title):
    t = quote(title, safe="")
    u = quote(url, safe="")
    return f"""      <div class="post-share" aria-label="Compartir este artículo">
        <span>Compartir</span>
        <a href="https://wa.me/?text={t}%20{u}" target="_blank" rel="noopener">WhatsApp</a>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url={u}" target="_blank" rel="noopener">LinkedIn</a>
        <a href="https://www.facebook.com/sharer/sharer.php?u={u}" target="_blank" rel="noopener">Facebook</a>
        <button type="button" data-copy="{url}">Copiar enlace</button>
      </div>"""


def build_post(p):
    url = f"{ORIGIN}/blog/{p['slug']}"
    published = p.get("published", B.PUBLISHED)
    modified = max(published, COVER_UPDATED)
    body, toc, words, sources = render_body(p["body"])
    src, w, h, alt = p["cover"]
    title_tag = f"{p['seo_title']} | Steid Hub"
    og = f"/assets/og/blog-{p['slug']}.jpg"
    graph = [ORG, WEBSITE, PERSON,
             {"@type": "WebPage", "@id": url + "#webpage", "url": url, "name": title_tag,
              "description": p["description"], "inLanguage": "es-PE",
              "isPartOf": {"@id": ORIGIN + "/#website"}, "breadcrumb": {"@id": url + "#breadcrumb"},
              "primaryImageOfPage": {"@type": "ImageObject", "url": ORIGIN + og, "width": 1200, "height": 630}},
             {"@type": "BreadcrumbList", "@id": url + "#breadcrumb", "itemListElement": [
                 {"@type": "ListItem", "position": 1, "name": "Inicio", "item": ORIGIN + "/"},
                 {"@type": "ListItem", "position": 2, "name": "Blog", "item": ORIGIN + "/blog/"},
                 {"@type": "ListItem", "position": 3, "name": p["title"]}]},
             {"@type": "BlogPosting", "@id": url + "#article", "mainEntityOfPage": {"@id": url + "#webpage"},
              "headline": p["title"], "alternativeHeadline": p["seo_title"], "description": p["description"],
              "image": [{"@type": "ImageObject", "url": ORIGIN + og, "width": 1200, "height": 630},
                        {"@type": "ImageObject", "url": ORIGIN + src, "width": w, "height": h,
                         "caption": COVER_CREDITS[p["slug"]]}],
              "datePublished": published + "T09:00:00-05:00", "dateModified": modified + "T09:00:00-05:00",
              "author": {"@id": ORIGIN + "/#michael-philipps"}, "publisher": {"@id": ORIGIN + "/#organization"},
              "isPartOf": {"@id": BLOG_ID}, "inLanguage": "es-PE", "articleSection": "Marketing inmobiliario",
              "keywords": ", ".join([p["keyword"]] + p["keywords"]), "wordCount": words,
              "about": {"@type": "Thing", "name": p["keyword"]},
              "mentions": [{"@type": "WebPage", "url": ORIGIN + B.SERVICES[k][0], "name": B.SERVICES[k][2]} for k in p["services"]],
              "citation": sources}]
    extra = (f'<meta property="article:published_time" content="{published}T09:00:00-05:00">\n'
             f'<meta property="article:modified_time" content="{modified}T09:00:00-05:00">\n'
             f'<meta property="article:author" content="{B.AUTHOR["name"]}">\n'
             f'<meta property="article:section" content="Marketing inmobiliario">\n'
             + "".join(f'<meta property="article:tag" content="{esc(k)}">\n' for k in [p["keyword"]] + p["keywords"][:4]))
    toc_html = "".join(f'<li><a href="#{i}">{esc(t)}</a></li>' for i, t in toc)
    related = "\n".join(f"""        <a class="post-card" href="/blog/{s}">
          <img src="{POSTS[s]['cover'][0]}" alt="" width="{POSTS[s]['cover'][1]}" height="{POSTS[s]['cover'][2]}" loading="lazy">
          <span class="post-card__tag">{esc(POSTS[s]['intent'])}</span>
          <h3>{esc(POSTS[s]['title'])}</h3>
          <p>{esc(POSTS[s]['excerpt'])}</p>
        </a>""" for s in p["related"])
    page = f"""{head(title_tag, p['description'], url, (og,), alt, 'article', extra, {"@context": "https://schema.org", "@graph": graph}, src)}
<body class="lp-page blog-page" data-landing="blog-{p['slug']}">
{GTM_NOSCRIPT}

{nav()}

<main id="main">
  <article class="post">
    <header class="post__head">
      <nav class="post-crumbs" aria-label="Ruta de navegación">
        <ol>
          <li><a href="/">Inicio</a></li>
          <li><a href="/blog/">Blog</a></li>
          <li><span aria-current="page">{esc(p['intent'])}</span></li>
        </ol>
      </nav>
      <p class="post__kicker">Marketing inmobiliario</p>
      <h1>{esc(p['title'])}</h1>
      <p class="post__dek">{esc(p['excerpt'])}</p>
{author_row(p, words)}
    </header>

    <figure class="post__cover">
      <img src="{src}" alt="{esc(alt)}" width="{w}" height="{h}" fetchpriority="high">
      <figcaption>Fuente: {esc(COVER_CREDITS[p['slug']])}.</figcaption>
    </figure>

    <div class="post__layout">
      <aside class="post-toc" aria-label="Contenido del artículo">
        <details open>
          <summary>En este artículo</summary>
          <ol>{toc_html}</ol>
        </details>
      </aside>
      <div class="post__body">
{body}
      </div>
    </div>

    <footer class="post__foot">
{share(url, p['title'])}
{author_box()}
    </footer>
  </article>

  <section class="post-related" aria-labelledby="sigue-leyendo">
    <div class="post-related__inner">
      <div class="post-related__head">
        <h2 id="sigue-leyendo">Sigue leyendo</h2>
        <a href="/blog/">Ver todos los artículos</a>
      </div>
      <div class="post-grid">
{related}
      </div>
    </div>
  </section>

{cta(p['cta_title'], p['cta'], 'Hola, Steid Hub. Leí el artículo "' + p['title'] + '" y deseo un diagnóstico gratuito para mi proyecto inmobiliario.')}

{gallery()}

{CONTACT}
{explore(p['services'])}
</main>

{FOOTER_WA}{BLOG_POPUPS}{SCRIPTS}"""
    (OUT / f"{p['slug']}.html").write_text(page)
    return url


def build_index():
    url = ORIGIN + "/blog/"
    title = "Blog de marketing inmobiliario en Perú | Steid Hub"
    desc = ("Guías de marketing inmobiliario para vender más propiedades en Perú: Google Ads, Meta Ads, "
            "TikTok Ads, generación de leads, contenido y drone.")
    cover = ("/assets/og/blog.jpg", 1200, 630)
    alt = "Vista aérea de edificios residenciales en Lima"
    graph = [ORG, WEBSITE, PERSON,
             {"@type": "CollectionPage", "@id": url + "#webpage", "url": url, "name": title, "description": desc,
              "inLanguage": "es-PE", "isPartOf": {"@id": ORIGIN + "/#website"}, "breadcrumb": {"@id": url + "#breadcrumb"},
              "mainEntity": {"@id": BLOG_ID}},
             {"@type": "BreadcrumbList", "@id": url + "#breadcrumb", "itemListElement": [
                 {"@type": "ListItem", "position": 1, "name": "Inicio", "item": ORIGIN + "/"},
                 {"@type": "ListItem", "position": 2, "name": "Blog"}]},
             {"@type": "Blog", "@id": BLOG_ID, "name": "Blog de marketing inmobiliario de Steid Hub", "url": url,
              "inLanguage": "es-PE", "publisher": {"@id": ORIGIN + "/#organization"},
              "blogPost": [{"@type": "BlogPosting", "@id": f"{ORIGIN}/blog/{p['slug']}#article",
                            "headline": p["title"], "url": f"{ORIGIN}/blog/{p['slug']}",
                            "datePublished": p.get("published", B.PUBLISHED) + "T09:00:00-05:00",
                            "author": {"@id": ORIGIN + "/#michael-philipps"},
                            "image": ORIGIN + p["cover"][0]} for p in B.POSTS]}]
    cards = []
    for i, p in enumerate(B.POSTS):
        words = render_body(p["body"])[2]
        mins = max(1, math.ceil(words / 220))
        s, w, h, a = p["cover"]
        # la primera va destacada; si la última queda sola en su fila, también se destaca
        feature = i == 0 or (i == len(B.POSTS) - 1 and (len(B.POSTS) - 1) % 3 == 1)
        cards.append(f"""        <a class="post-card{' post-card--feature' if feature else ''}" href="/blog/{p['slug']}">
          <img src="{s}" alt="{esc(a)}" width="{w}" height="{h}"{' fetchpriority="high"' if i == 0 else ' loading="lazy"'}>
          <span class="post-card__tag">{esc(p['intent'])}</span>
          <h2>{esc(p['title'])}</h2>
          <p>{esc(p['excerpt'])}</p>
          <span class="post-card__meta"><img src="{B.AUTHOR['avatar']}" alt="" width="192" height="192" loading="lazy">{B.AUTHOR['name']} · {mins} min</span>
        </a>""")
    page = f"""{head(title, desc, url, cover, alt, 'website', '', {"@context": "https://schema.org", "@graph": graph}, None)}
<body class="lp-page blog-page" data-landing="blog">
{GTM_NOSCRIPT}

{nav()}

<main id="main">
  <section class="blog-hero">
    <div class="blog-hero__inner">
      <nav class="post-crumbs" aria-label="Ruta de navegación">
        <ol>
          <li><a href="/">Inicio</a></li>
          <li><span aria-current="page">Blog</span></li>
        </ol>
      </nav>
      <p class="post__kicker">Blog de Steid Hub</p>
      <h1>Marketing inmobiliario para vender más propiedades</h1>
      <p class="post__dek">Guías prácticas sobre publicidad inmobiliaria, generación de leads y contenido para inmobiliarias, constructoras, propietarios y asesores en Perú. Escritas por {B.AUTHOR['name']}, socio y fundador de Steid Hub.</p>
    </div>
  </section>
  <section class="post-related post-related--index" aria-label="Artículos">
    <div class="post-related__inner">
      <div class="post-grid post-grid--index">
{chr(10).join(cards)}
      </div>
    </div>
  </section>

{cta('¿Quieres aplicar estas ideas en tu proyecto?', 'Revisamos tus campañas, tu contenido y tu seguimiento comercial para decirte dónde se está yendo el presupuesto y qué cambiar primero.', 'Hola, Steid Hub. Leí su blog y deseo un diagnóstico gratuito para mi proyecto inmobiliario.')}

{gallery()}

{CONTACT}
{explore(['google', 'meta', 'contenido', 'drone'])}
</main>

{FOOTER_WA}{BLOG_POPUPS}{SCRIPTS}"""
    (OUT / "index.html").write_text(page)
    return url


def build_feed():
    items = "".join(f"""  <item>
    <title>{esc(p['title'])}</title>
    <link>{ORIGIN}/blog/{p['slug']}</link>
    <guid>{ORIGIN}/blog/{p['slug']}</guid>
    <description>{esc(p['description'])}</description>
    <pubDate>{date.fromisoformat(p.get('published', B.PUBLISHED)).strftime('%a, %d %b %Y')} 09:00:00 -0500</pubDate>
  </item>
""" for p in B.POSTS)
    (OUT / "feed.xml").write_text(f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Blog de marketing inmobiliario | Steid Hub</title>
  <link>{ORIGIN}/blog/</link>
  <description>Guías de marketing inmobiliario, publicidad digital y contenido para vender propiedades en Perú.</description>
  <language>es-PE</language>
{items}</channel>
</rss>
""")


def update_sitemap(urls):
    path = ROOT / "sitemap.xml"
    xml = path.read_text()
    xml = re.sub(r"  <url><loc>https://steidhub\.com/blog/[^<]*</loc>.*?</url>\n", "", xml)
    published = {f"{ORIGIN}/blog/{p['slug']}": max(p.get("published", B.PUBLISHED), COVER_UPDATED) for p in B.POSTS}
    rows = "".join(f"  <url><loc>{u}</loc><lastmod>{published.get(u, B.PUBLISHED)}</lastmod><priority>{'0.8' if u.endswith('/blog/') else '0.7'}</priority></url>\n" for u in urls)
    path.write_text(xml.replace("</urlset>", rows + "</urlset>"))


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    urls = [build_index()] + [build_post(p) for p in B.POSTS]
    build_feed()
    update_sitemap(urls)
    print("\n".join(urls))
