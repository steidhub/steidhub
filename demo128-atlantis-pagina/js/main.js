var WA='51936988660';
function waLink(msg){return 'https://wa.me/'+WA+'?text='+encodeURIComponent(msg)}
var BASE='https://admin.atlantisinmobiliaria.com/wp-content/uploads/';
var PROJECTS=[
{slug:'maia',name:'Maia',dist:'Surquillo',dorms:[3,4],label:'3 y 4 dormitorios',price:629000,status:'build',img:'2025/08/Imagen-Maia.png',hov:'2025/08/TERRAZA-01-1.jpg',href:'maia/'},
{slug:'atenas',name:'Atenas',dist:'Surco',dorms:[2,3],label:'2 y 3 dormitorios',price:690000,status:'build',img:'2024/07/render_card_atenas.webp',hov:'2024/07/hover_terraza.jpg',href:'https://atlantisinmobiliaria.com/surco/atenas'},
{slug:'monaco',name:'Monaco',dist:'Surquillo',dorms:[],label:'Consulta tipologías',price:0,status:'build',img:'2024/07/monaco_card.png',hov:'2024/07/monaco_hover.png',href:'https://atlantisinmobiliaria.com/surquillo/monaco'},
{slug:'mauren',name:'Mauren',dist:'Surquillo',dorms:[2,3],label:'2 y 3 dormitorios',price:0,status:'last',img:'2024/07/mauren_card.png',hov:'2024/07/interior-mauren.png',href:'https://atlantisinmobiliaria.com/surquillo/mauren'},
{slug:'milan',name:'Milan',dist:'Surquillo',dorms:[1,2,3],label:'1, 2 y 3 dormitorios',price:0,status:'sold',img:'2024/07/milan_card.png',hov:'2024/07/milan_hover.png',href:'https://atlantisinmobiliaria.com/surquillo/milan'},
{slug:'montecarlo',name:'Montecarlo',dist:'Surquillo',dorms:[1,2,3],label:'1, 2 y 3 dormitorios',price:0,status:'sold',img:'2024/07/montecarlo.png',hov:'2024/07/montecarlo.png',href:'https://atlantisinmobiliaria.com/surquillo/montecarlo'}];
function fmt(n){return 'S/ '+n.toLocaleString('en-US')}
function card(p){
 var tag=p.status==='build'?'<span class="tag">En construcción</span>':p.status==='sold'?'<span class="tag sold">100% vendido</span>':'<span class="tag last">Último dúplex</span>';
 var price=p.price?'Desde '+fmt(p.price):(p.status==='sold'?'Vendido':'Consultar precio');
 return '<article class="pn'+(p.status==='sold'?' off':'')+'" tabindex="0" aria-label="'+p.name+'"><img class="m" loading="lazy" src="'+BASE+p.img+'" alt="Render del proyecto '+p.name+' en '+p.dist+'"><img class="h" loading="lazy" src="'+BASE+p.hov+'" alt="" aria-hidden="true">'+tag+'<span class="vt">'+p.name+' · '+p.dist+'</span><div class="info"><span class="dist">'+p.dist+', Lima</span><h3>'+p.name+'</h3><p class="meta">'+p.label+'</p><div class="ft"><span class="pr">'+price+'</span><a class="btn pk sm" href="'+p.href+'">Ver proyecto</a></div></div><i class="bar"></i></article>';
}
var accT=null;
function accInit(el){
 var ps=[].slice.call(el.querySelectorAll('.pn'));if(!ps.length)return;
 var cur=0,hold=false;
 function set(i){cur=i;ps.forEach(function(p,k){p.classList.toggle('on',k===i);var b=p.querySelector('.bar');if(b){b.style.animation='none';void b.offsetWidth;b.style.animation=''}})}
 ps.forEach(function(p,k){p.addEventListener('mouseenter',function(){hold=true;set(k)});p.addEventListener('click',function(e){if(!p.classList.contains('on')){e.preventDefault();set(k)}});p.addEventListener('focus',function(){hold=true;set(k)})});
 el.addEventListener('mouseleave',function(){hold=false});
 set(0);clearInterval(accT);
 if(!(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches))accT=setInterval(function(){if(!hold)set((cur+1)%ps.length)},4500);
}
function render(){
 var el=document.getElementById('lista');if(!el)return;
 var d=document.getElementById('f-dist').value,b=document.getElementById('f-dorm').value;
 var list=PROJECTS.filter(function(p){return (d==='all'||p.dist===d)&&(b==='all'||p.dorms.indexOf(+b)>-1)});
 list.sort(function(a,c){return (a.status==='sold')-(c.status==='sold')});
 el.innerHTML=list.length?list.map(card).join(''):'<p class="empty">No hay proyectos con ese filtro. Escríbenos y te avisamos de nuevos lanzamientos.</p>';
 accInit(el);reveal();
}
function reveal(){
 var els=document.querySelectorAll('.rv:not(.in)');
 if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return}
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
 els.forEach(function(e){io.observe(e)});
}
var qNow=0;function tweenQ(to){var el=document.getElementById('c-q'),from=qNow,t0=null;qNow=to;function f(t){if(!t0)t0=t;var p=Math.min((t-t0)/600,1);el.textContent=fmt(Math.round(from+(to-from)*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
function calc(){
 var p=+document.getElementById('c-p').value||0,i=+document.getElementById('c-i').value||0,y=+document.getElementById('c-y').value||20,r=+document.getElementById('c-r').value||0;
 var ini=p*i/100,loan=p-ini,n=y*12,m=r/1200;
 var q=m?loan*m/(1-Math.pow(1+m,-n)):loan/n;
 function set(id,v){var e=document.getElementById(id);if(e)e.textContent=v}
 set('c-ini',fmt(Math.round(ini)));set('c-loan',fmt(Math.round(loan)));set('o-p',fmt(p));set('o-i',i+'%');set('o-y',y+' años');set('o-r',r.toFixed(1)+'%');
 var dn=document.getElementById('dn');if(dn)dn.style.strokeDasharray=(i/100*314.16)+' 314.16';
 tweenQ(Math.round(q));
}
function sendForm(e){
 e.preventDefault();var f=e.target;
 var msg='Hola, soy '+f.nombre.value+' ('+f.celular.value+'). Me interesa '+f.proyecto.value+'.';
 window.open(waLink(msg),'_blank','noopener');
}
function openLb(src){var l=document.getElementById('lb');if(!l)return;l.querySelector('img').src=src;l.classList.add('on')}
function closeLb(){var l=document.getElementById('lb');if(l)l.classList.remove('on')}
function tab(n){[1,2].forEach(function(i){document.getElementById('g'+i).hidden=i!==n;document.getElementById('t'+i).setAttribute('aria-selected',i===n)});reveal()}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeLb()});
document.addEventListener('click',function(e){var f=e.target.closest('[data-zoom] img');if(f)openLb(f.src)});
document.addEventListener('DOMContentLoaded',function(){
 var s=document.getElementById('buscar');
 if(s){s.addEventListener('submit',function(e){e.preventDefault();document.getElementById('f-dist').value=document.getElementById('h-dist').value;document.getElementById('f-dorm').value=document.getElementById('h-dorm').value;render();document.getElementById('proyectos').scrollIntoView()})}
 ['f-dist','f-dorm'].forEach(function(id){var e=document.getElementById(id);if(e)e.addEventListener('change',render)});
 ['c-p','c-i','c-y','c-r'].forEach(function(id){var e=document.getElementById(id);if(e)e.addEventListener('input',calc)});
 if(document.getElementById('c-p'))calc();
 render();reveal();
});

(function(){
 var rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
 function countUp(el){var to=+el.dataset.count,sep=el.hasAttribute('data-sep'),t0=null;
  function f(t){if(!t0)t0=t;var p=Math.min((t-t0)/1400,1),e=1-Math.pow(1-p,3),v=Math.round(to*e);el.textContent=sep?v.toLocaleString('en-US'):v;if(p<1)requestAnimationFrame(f)}
  el.textContent=sep?'0':'0';requestAnimationFrame(f)}
 window.addEventListener('DOMContentLoaded',function(){
  var bar=document.createElement('div');bar.className='prog';document.body.appendChild(bar);
  function sc(){var h=document.documentElement.scrollHeight-innerHeight;bar.style.transform='scaleX('+(h>0?Math.min(scrollY/h,1):0)+')'}
  addEventListener('scroll',sc,{passive:true});sc();
  if(rm)return;
  var cs=document.querySelectorAll('[data-count]');
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){countUp(e.target);io.unobserve(e.target)}})},{threshold:.6});cs.forEach(function(e){io.observe(e)})}
 });
})();

/* Mini chat de WhatsApp */
(function(){
 var GL='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
 document.addEventListener('DOMContentLoaded',function(){
  var f=document.getElementById('waf');if(!f)return;
  var maia=/\/maia\/?$/.test(location.pathname);
  var def=maia?'Hola, quiero información de Maia.':'Hola, quiero información de sus proyectos.';
  var chips=maia?['Tipologías y precios','Agendar visita','Financiamiento']:['Maia, Surquillo','Atenas, Surco','Agendar visita','Financiamiento'];
  var msgs={'Maia, Surquillo':'Hola, quiero información de Maia.','Atenas, Surco':'Hola, quiero información de Atenas.','Agendar visita':'Hola, quiero agendar una visita.','Financiamiento':'Hola, quiero información de financiamiento.','Tipologías y precios':'Hola, quiero las tipologías y precios de Maia.'};
  var c=document.createElement('div');c.className='wa-chat';c.setAttribute('role','dialog');c.setAttribute('aria-label','Chat con Atlantis');
  c.innerHTML='<div class="wc-h"><span class="av">'+GL+'</span><div><b>Atlantis Inmobiliaria</b><small>Asesor en línea</small></div><button type="button" aria-label="Cerrar">×</button></div><div class="wc-b"></div><div class="wc-f"><div class="wc-q"></div><textarea aria-label="Tu mensaje"></textarea><a class="btn pk" target="_blank" rel="noopener" href="#">'+GL+'Continuar en WhatsApp</a></div>';
  document.body.appendChild(c);
  var body=c.querySelector('.wc-b'),ta=c.querySelector('textarea'),go=c.querySelector('.wc-f .btn'),q=c.querySelector('.wc-q'),shown=false;
  ta.value=def;
  function sync(){go.href=waLink(ta.value||def)}
  ta.addEventListener('input',sync);sync();
  chips.forEach(function(t){var b=document.createElement('button');b.type='button';b.textContent=t;b.onclick=function(){ta.value=msgs[t];sync();ta.focus()};q.appendChild(b)});
  function say(t,d){setTimeout(function(){var ty=document.createElement('div');ty.className='typing';ty.innerHTML='<i></i><i></i><i></i>';body.appendChild(ty);setTimeout(function(){ty.remove();var m=document.createElement('div');m.className='bub';m.textContent=t;body.appendChild(m)},800)},d)}
  function toggle(on){c.classList.toggle('on',on);f.setAttribute('aria-expanded',on);if(on&&!shown){shown=true;say('Hola, bienvenido a Atlantis.',100);say('¿Qué te gustaría saber? Elige una opción o escribe tu mensaje y un asesor te responde por WhatsApp.',1100)}}
  f.addEventListener('click',function(e){e.preventDefault();toggle(!c.classList.contains('on'))});
  c.querySelector('.wc-h button').onclick=function(){toggle(false)};
  go.addEventListener('click',function(){setTimeout(function(){toggle(false)},300)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')toggle(false)});
 });
})();
/* v14 maia */
(function(){
function tw(el,to,dec){var from=parseFloat(el.dataset.v||0),t0=null;el.dataset.v=to;(function f(t){if(!t0)t0=t;var p=Math.min((t-t0)/600,1),e=1-Math.pow(1-p,3),v=from+(to-from)*e;el.textContent=dec?v.toFixed(2):Math.round(v);if(p<1)requestAnimationFrame(f)})(performance.now())}
var tp=document.querySelector('.tp');
if(tp){
 var bs=[].slice.call(tp.querySelectorAll('.tpb')),im=[].slice.call(tp.querySelectorAll('.tpimg img')),cur=0,tm,paused=false,vis=false;
 function go(i){cur=i;bs.forEach(function(b,k){b.classList.toggle('on',k===i);if(k===i){b.classList.remove('on');void b.offsetWidth;b.classList.add('on')}});im.forEach(function(m,k){m.classList.toggle('on',k===i)});
  var b=bs[i];document.getElementById('tpn').textContent=b.dataset.l;
  tw(document.getElementById('s-d'),+b.dataset.d);tw(document.getElementById('s-b'),+b.dataset.b);tw(document.getElementById('s-a'),+b.dataset.a,1);
  document.getElementById('s-p').textContent='S/ '+b.dataset.p;
  document.getElementById('tpcta').href=waLink('Hola, quiero información de Maia '+b.dataset.n);
  clearTimeout(tm);if(vis&&!paused)tm=setTimeout(function(){go((cur+1)%bs.length)},5500)}
 bs.forEach(function(b,k){b.addEventListener('click',function(){paused=true;tp.classList.add('paused');go(k)})});
 new IntersectionObserver(function(e){vis=e[0].isIntersecting;if(vis&&!paused)go(cur);else clearTimeout(tm)},{threshold:.4}).observe(tp);
}
var gl=document.getElementById('galeria');
if(gl){
 var S=[].slice.call(gl.querySelectorAll('.gls img')),T=[].slice.call(gl.querySelectorAll('.gth button')),tabs=[].slice.call(gl.querySelectorAll('.tabs button')),grp='Interiores',gi=0,gt,gv=false,gpaused=false;
 function idxs(){return S.map(function(_,i){return i}).filter(function(i){return S[i].dataset.g===grp})}
 function show(i){gi=i;S.forEach(function(m,k){m.classList.remove('on');if(k===i){void m.offsetWidth;m.classList.add('on')}});T.forEach(function(b,k){b.classList.toggle('on',k===i);b.hidden=S[k].dataset.g!==grp});
  var l=idxs();document.getElementById('gn').textContent=('0'+(l.indexOf(i)+1)).slice(-2);document.getElementById('gt').textContent=('0'+l.length).slice(-2);
  var t=document.getElementById('gtt');t.textContent=S[i].dataset.t;t.style.animation='none';void t.offsetWidth;t.style.animation='';
  clearTimeout(gt);if(gv&&!gpaused)gt=setTimeout(function(){step(1)},5000)}
 function step(d){var l=idxs(),p=l.indexOf(gi);show(l[(p+d+l.length)%l.length])}
 tabs.forEach(function(b){b.addEventListener('click',function(){grp=b.dataset.f;tabs.forEach(function(x){x.setAttribute('aria-selected',x===b)});show(idxs()[0])})});
 T.forEach(function(b,k){b.addEventListener('click',function(){gpaused=true;show(k)})});
 document.getElementById('gp').onclick=function(){gpaused=true;step(-1)};document.getElementById('gx').onclick=function(){gpaused=true;step(1)};
 document.getElementById('gz').onclick=function(){openLb(S[gi].src)};
 gl.addEventListener('mousemove',function(e){var r=gl.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;gl.querySelector('.gls').style.transform='translate('+(-x*14)+'px,'+(-y*10)+'px)'});
 new IntersectionObserver(function(e){gv=e[0].isIntersecting;if(gv&&!gpaused)show(gi);else clearTimeout(gt)},{threshold:.4}).observe(gl);
 show(0);
}
var vd=document.getElementById('vdays');
if(vd){
 var st={tipo:'Tipo 10',dia:'',hora:'10:00'},d=new Date(),n=0,mn=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'],dn=['dom','lun','mar','mié','jue','vie','sáb'];
 d.setDate(d.getDate()+1);
 while(n<6){if(d.getDay()!==0){var b=document.createElement('button');b.type='button';b.dataset.v=dn[d.getDay()]+' '+d.getDate()+' '+mn[d.getMonth()];b.innerHTML='<small>'+dn[d.getDay()]+'</small><b>'+d.getDate()+'</b>';if(!n){b.className='on';st.dia=b.dataset.v}vd.appendChild(b);n++}d.setDate(d.getDate()+1)}
 function sync(){document.getElementById('v-tipo').textContent=st.tipo;document.getElementById('v-dia').textContent=st.dia;document.getElementById('v-hora').textContent=st.hora;['v-tipo','v-dia','v-hora'].forEach(function(id){var e=document.getElementById(id);e.style.animation='none';void e.offsetWidth;e.style.animation=''})}
 document.querySelectorAll('.vch').forEach(function(g){g.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;g.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x===b)});st[g.dataset.k]=b.dataset.v;sync()})});
 sync();
 window.sendVisit=function(e){e.preventDefault();var f=e.target;window.open(waLink('Hola, soy '+f.nombre.value+' ('+f.celular.value+'). Quiero agendar una visita a Maia para ver el '+st.tipo+' el '+st.dia+' a las '+st.hora+'.'),'_blank','noopener')}
}
})();
/* v16 */
(function(){
var p=document.querySelector('.ph4');
if(p){var st=[].slice.call(p.querySelectorAll('.st')),dots=[].slice.call(document.querySelectorAll('.track i')),k=-1,t;
 function nx(){k=(k+1)%st.length;st.forEach(function(e,i){e.classList.toggle('act',i===k)});dots.forEach(function(e,i){e.classList.toggle('on',i===k)})}
 new IntersectionObserver(function(e){clearInterval(t);if(e[0].isIntersecting){p.classList.add('run');nx();t=setInterval(nx,2400)}else{p.classList.remove('run')}},{threshold:.5}).observe(p);
 st.forEach(function(e,i){e.addEventListener('mouseenter',function(){k=i-1;nx();clearInterval(t)})});}
var gl=document.getElementById('galeria');
if(gl){var bar=document.createElement('i');bar.className='glp';gl.appendChild(bar);
 var go=function(){bar.classList.remove('run');void bar.offsetWidth;bar.classList.add('run')};
 var obs=new MutationObserver(go);gl.querySelectorAll('.gls img').forEach(function(i){obs.observe(i,{attributes:true,attributeFilter:['class']})});
 document.addEventListener('keydown',function(e){var r=gl.getBoundingClientRect();if(r.top<innerHeight*.5&&r.bottom>innerHeight*.5){if(e.key==='ArrowRight')document.getElementById('gx').click();if(e.key==='ArrowLeft')document.getElementById('gp').click()}});
 var x0=null;gl.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
 gl.addEventListener('touchend',function(e){if(x0===null)return;var d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>40)document.getElementById(d<0?'gx':'gp').click();x0=null});}
})();
