"""Generate checked-in static SEO pages using only the Python standard library.
Run from any directory. Deployment still requires no build or client-side router.
"""
from pathlib import Path
from string import Template
from html import escape
import json,re
ROOT=Path(__file__).resolve().parents[1]
ORIGIN='https://steidhub.com'
PAGES=json.loads((ROOT/'seo/pages.json').read_text())
TEMPLATE=Template((ROOT/'seo/templates/page.html').read_text())
BY_PATH={p['path']:p for p in PAGES}
ORG={'@type':'Organization','@id':ORIGIN+'/#organization','name':'Steid Hub','url':ORIGIN+'/', 'logo':{'@type':'ImageObject','url':ORIGIN+'/assets/logos/steidhub-lockup-white.png'},'email':'informes@steidhub.com','telephone':'+51983595390','areaServed':{'@type':'Country','name':'Perú'}}
def schema(path,title,description,crumbs,kind=None):
 url=ORIGIN+path
 page={'@type':'WebPage','@id':url+'#webpage','url':url,'name':title,'description':description,'inLanguage':'es-PE','isPartOf':{'@id':ORIGIN+'/#website'},'about':{'@id':ORG['@id']}}
 graph=[ORG,{'@type':'WebSite','@id':ORIGIN+'/#website','url':ORIGIN+'/','name':'Steid Hub','inLanguage':'es-PE','publisher':{'@id':ORG['@id']}},page]
 if crumbs:
  page['breadcrumb']={'@id':url+'#breadcrumb'}
  graph.append({'@type':'BreadcrumbList','@id':url+'#breadcrumb','itemListElement':[{'@type':'ListItem','position':i+1,'name':name,'item':ORIGIN+link} for i,(name,link) in enumerate(crumbs)]})
 if kind in ('service','sector'):
  page['mainEntity']={'@id':url+'#service'}
  graph.append({'@type':'Service','@id':url+'#service','name':title.removesuffix(' | Steid Hub'),'url':url,'description':description,'serviceType':BY_PATH[path]['label'],'provider':{'@id':ORG['@id']},'areaServed':{'@type':'Country','name':'Perú'}})
 return json.dumps({'@context':'https://schema.org','@graph':graph},ensure_ascii=False).replace('<','\\u003c')
def metadata(path,title,description,crumbs=(),kind=None):
 url=ORIGIN+path
 tags=[f'<title>{escape(title)}</title>',f'<meta name="description" content="{escape(description,quote=True)}">',f'<link rel="canonical" href="{url}">',f'<link rel="alternate" hreflang="es-PE" href="{url}">',f'<link rel="alternate" hreflang="x-default" href="{url}">','<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">','<meta name="theme-color" content="#111111">']
 for key,val in {'og:title':title,'og:description':description,'og:url':url,'og:type':'website','og:site_name':'Steid Hub','og:locale':'es_PE','og:image':ORIGIN+'/assets/og/home.jpg','og:image:type':'image/jpeg','og:image:width':'1200','og:image:height':'630','og:image:alt':'Vista aérea de un proyecto inmobiliario presentada por Steid Hub'}.items():
  tags.append(f'<meta property="{key}" content="{escape(val,quote=True)}">')
 for key,val in {'twitter:card':'summary_large_image','twitter:title':title,'twitter:description':description,'twitter:image':ORIGIN+'/assets/og/home.jpg','twitter:image:alt':'Vista aérea de un proyecto inmobiliario presentada por Steid Hub'}.items():
  tags.append(f'<meta name="{key}" content="{escape(val,quote=True)}">')
 tags.append('<script type="application/ld+json">\n'+schema(path,title,description,crumbs,kind)+'\n</script>')
 return '\n'.join(tags)
def links(paths):
 return '<ul class="seo-related">'+''.join(f'<li><a href="{p}">{escape(BY_PATH[p]["label"])}</a></li>' for p in paths)+'</ul>'
home=(ROOT/'index.html').read_text()
analytics=re.search(r'<!-- Google tag.*?</script>\s*<script>.*?</script>',home,re.S).group()
def render(path,label,title,description,intro,content,kind,crumbs):
 breadcrumbs=' <span aria-hidden="true">/</span> '.join(f'<a href="{url}">{escape(name)}</a>' if i<len(crumbs)-1 else f'<span aria-current="page">{escape(name)}</span>' for i,(name,url) in enumerate(crumbs))
 html=TEMPLATE.substitute(metadata=metadata(path,title,description,crumbs,kind),analytics=analytics,kind=kind,breadcrumbs=breadcrumbs,eyebrow='Steid Hub · '+('Sectores' if kind=='sector' else 'Servicios'),h1=escape(label),description=escape(description),intro=f'<p>{escape(intro)}</p>' if intro else '',content=content)
 target=ROOT/path.strip('/')/'index.html';target.parent.mkdir(parents=True,exist_ok=True);target.write_text(html)
for p in PAGES:
 parent='/sectores/' if p['kind']=='sector' else '/servicios/'
 content='<section class="seo-section" aria-labelledby="scope-title"><h2 id="scope-title">'+('Del proyecto al mercado' if p['kind']=='sector' else 'Cómo trabajamos este servicio')+'</h2><div class="seo-grid">'+''.join('<section class="seo-card"><h3>'+escape(s['title'])+'</h3><p>'+escape(s['body'])+'</p></section>' for s in p['sections'])+'</div></section>'
 content+='<section class="seo-section" aria-labelledby="related-title"><h2 id="related-title">Servicios relacionados</h2>'+links(p['related'])+'</section>'
 if p['kind']=='service':
  content+='<p>Conoce cómo integramos este servicio en nuestra propuesta de <a href="/sectores/marketing-inmobiliario/">marketing inmobiliario</a> y revisa los <a href="/#portafolio">proyectos documentados</a>.</p>'
 # Only published resources: the build rejects links without an actual page.
 if p['resources']:
  for resource in p['resources']:
   assert resource['path'].startswith('/blog/') and (ROOT/resource['path'].strip('/')/'index.html').exists(), 'Publish the blog page before linking it'
  content+='<section class="seo-section"><h2>Recursos relacionados</h2><ul>'+''.join(f'<li><a href="{escape(r["path"],quote=True)}">{escape(r["title"])}</a></li>' for r in p['resources'])+'</ul></section>'
 render(p['path'],p['h1'],p['title'],p['description'],p['intro'],content,p['kind'],[('Inicio','/'),('Sectores' if p['kind']=='sector' else 'Servicios',parent),(p['label'],p['path'])])
for path,kind,label,desc in [('/servicios/','service','Servicios de marketing digital en Perú','Explora nuestros servicios de campañas, captación, producción audiovisual y desarrollo de la presencia digital de tu proyecto.'),('/sectores/','sector','Marketing por sector','Conoce la propuesta de Steid Hub para inmobiliarias y desarrolladores: desde la identidad de proyecto hasta la captación y el seguimiento.')]:
 selected=[p for p in PAGES if p['kind']==kind]
 content='<section class="seo-section"><h2>'+('Servicios para tu proyecto' if kind=='service' else 'Experiencia inmobiliaria')+'</h2><ul class="seo-grid">'+''.join(f'<li class="seo-card"><h3><a href="{p["path"]}">{escape(p["label"])}</a></h3><p>{escape(p["description"])}</p></li>' for p in selected)+'</ul></section>'
 render(path,label,label+' | Steid Hub',desc,'',content,'hub',[('Inicio','/'),('Servicios' if kind=='service' else 'Sectores',path)])
# Update home head only; retain analytics, fonts, preload, and all functional scripts.
home=re.sub(r'<title>.*?</title>\s*','',home,flags=re.S)
home=re.sub(r'<meta (?:name="(?:description|robots|theme-color|twitter:[^"]+)"|property="og:[^"]+")[^>]*>\s*','',home)
home=re.sub(r'<link rel="canonical"[^>]*>\s*','',home)
home=re.sub(r'<script type="application/ld\+json">.*?</script>\s*','',home,flags=re.S)
home=home.replace('</head>',metadata('/','Agencia de marketing digital en Perú | Steid Hub','Marketing digital en Perú: campañas en Google, Meta y TikTok, generación de leads y producción audiovisual para inmobiliarias y desarrolladores.')+'\n</head>')
# index.html se mantiene a mano (datos estructurados y etiquetas propias); no se sobrescribe.
urls=list(dict.fromkeys(['/','/servicios/','/sectores/']+[p['path'] for p in PAGES]+[r['path'] for p in PAGES for r in p['resources']]))
# El sitemap es compartido (landings, blog): sólo se añaden las rutas que falten.
_sm=(ROOT/'sitemap.xml').read_text()
_new=''.join(f'  <url><loc>{ORIGIN}{url}</loc></url>\n' for url in urls if f'<loc>{ORIGIN}{url}</loc>' not in _sm)
(ROOT/'sitemap.xml').write_text(_sm.replace('</urlset>',_new+'</urlset>'))
(ROOT/'robots.txt').write_text(f'User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: {ORIGIN}/sitemap.xml\n')
print(f'Generated {len(urls)} indexable routes; no client-side SEO injection.')
