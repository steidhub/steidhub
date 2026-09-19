"""Static regression checks: python3 scripts/check_seo.py."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,posixpath,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
ORIGIN='https://steidhub.com'
class Document(HTMLParser):
 def __init__(self,text):
  super().__init__();self.tags=[];self.json=[];self.capture=False;self.buffer='';self.feed(text)
 def handle_starttag(self,t,a):
  a=dict(a);self.tags.append((t,a))
  if t=='script' and a.get('type')=='application/ld+json':self.capture=True;self.buffer=''
 def handle_data(self,d):
  if self.capture:self.buffer+=d
 def handle_endtag(self,t):
  if t=='script' and self.capture:self.json.append(json.loads(self.buffer));self.capture=False
 def select(self,tag,**attrs):return [a for t,a in self.tags if t==tag and all(a.get(k)==v for k,v in attrs.items())]
urls=[x.text for x in ET.parse(ROOT/'sitemap.xml').findall('.//{*}loc')]
assert len(urls)==len(set(urls))
docs={}
for url in urls:
 assert url.startswith(ORIGIN+'/')
 path=urlsplit(url).path
 if path=='/':file=ROOT/'index.html'
 elif path.endswith('/'):file=ROOT/path.strip('/')/'index.html'
 else:
  flat=ROOT/(path.strip('/')+'.html')
  file=flat if flat.exists() else ROOT/path.strip('/')/'index.html'
 assert file.exists(),file
 docs[path]=Document(file.read_text())
 raw=file.read_text()
 assert raw.count('googletagmanager.com/gtm.js')==1,(path,'GTM script')
 assert raw.count('googletagmanager.com/ns.html?id=GTM-KGVBFL2M')==1,(path,'GTM noscript')
 assert raw.count('/lead-modal.js')==1 and raw.count('/lead-modal.css')==1,(path,'floating lead form assets')
 if path.startswith('/servicios/') or path.startswith('/sectores/'):
  assert raw.count('id="guia-practica"')==1,(path,'editorial guidance')
for path,doc in docs.items():
 assert len(doc.select('h1'))==1,(path,'H1')
 assert len(doc.select('main'))==1
 assert doc.select('html')[0]['lang']=='es-PE'
 assert doc.select('link',rel='canonical')==[{'rel':'canonical','href':ORIGIN+path}]
 assert len(doc.select('title'))==1
 for name in ['description','twitter:card','twitter:title','twitter:description','twitter:image','twitter:image:alt']:
  assert len(doc.select('meta',name=name))==1,(path,name)
 for prop in ['og:title','og:description','og:url','og:image','og:image:alt']:
  assert len(doc.select('meta',property=prop))==1,(path,prop)
 assert doc.select('meta',property='og:url')[0]['content']==ORIGIN+path
 assert doc.json and len(doc.json)==1
 graph=doc.json[0]['@graph'];assert any(x['@type']=='Organization' for x in graph)
 assert all('www.steidhub.com' not in json.dumps(x) for x in graph)
 ids=[a['id'] for t,a in doc.tags if 'id' in a];assert len(ids)==len(set(ids)),(path,'duplicate id')
 last=0
 for tag,a in doc.tags:
  if tag in ['h1','h2','h3','h4','h5','h6']:
   level=int(tag[1]);assert level<=last+1,(path,'heading jump',last,level);last=level
  if tag=='img':assert all(x in a for x in ['alt','width','height']),(path,a)
  values=[]
  if tag=='a':values.append(a.get('href',''))
  if tag in ['img','script','source']:values.append(a.get('src',a.get('data-src','')))
  if tag=='link':values.append(a.get('href',''))
  if tag=='video':values.append(a.get('poster',''))
  for value in values:
   if not value:continue
   u=urlsplit(value)
   if u.scheme or u.netloc:continue
   base=path if path.endswith('/') else posixpath.dirname(path)+'/'
   target=posixpath.normpath(posixpath.join(base,u.path)) if u.path and not u.path.startswith('/') else (u.path or path)
   if not target.startswith('/'):target='/'+target
   target=unquote(target)
   local=ROOT/target.lstrip('/')
   if not local.exists() and not target.endswith('/'):
    html=ROOT/(target.lstrip('/')+'.html')
    if html.exists():local=html
   assert local.exists(),(path,value,'missing target')
   if u.fragment:
    dest=docs.get(target)
    assert dest and any(a.get('id')==u.fragment for t,a in dest.tags),(path,value,'missing fragment')
   if tag=='a' and local.is_dir():assert target in docs,(path,target,'not in sitemap')
# Every indexable page can be reached by following real home links.
visited=set();pending=['/']
while pending:
 path=pending.pop()
 if path in visited:continue
 visited.add(path)
 for a in docs[path].select('a'):
  link=urlsplit(a.get('href','')).path
  if link in docs and link not in visited:pending.append(link)
assert visited==set(docs),('orphan routes',set(docs)-visited)
keywords=json.loads((ROOT/'seo/keyword-map.json').read_text())
assert 100<=len(keywords)<=200
assert len({x['keyword'].casefold() for x in keywords})==len(keywords)
assert all(x['url'] in docs for x in keywords)
assert 'noindex' in (ROOT/'404.html').read_text()
assert 'Sitemap: '+ORIGIN+'/sitemap.xml' in (ROOT/'robots.txt').read_text()
assert (ROOT/'llms.txt').exists() and (ROOT/'llms-full.txt').exists()
robots=(ROOT/'robots.txt').read_text()
assert all(f'User-agent: {agent}' in robots for agent in ['OAI-SearchBot','ChatGPT-User','ClaudeBot'])
print(f'PASS: {len(docs)} routes, {len(keywords)} unique keyword candidates, metadata, schema, headings, images, links, anchors and reachability.')
