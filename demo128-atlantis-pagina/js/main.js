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
 var cta=p.status==='sold'?'':'<a class="btn wa" style="min-height:40px;padding:0 16px" href="'+waLink('Hola, quiero información de '+p.name)+'">WhatsApp</a>';
 return '<article class="card rv'+(p.status==='sold'?' off':'')+'"><div class="ph"><img class="m" loading="lazy" src="'+BASE+p.img+'" alt="Render del proyecto '+p.name+' en '+p.dist+'"><img class="h" loading="lazy" src="'+BASE+p.hov+'" alt="" aria-hidden="true">'+tag+'</div><div class="bd"><span class="dist">'+p.dist+'</span><h3>'+p.name+'</h3><p class="meta">'+p.label+'</p><div class="ft"><span class="pr">'+price+'</span>'+cta+'<a class="btn gh" style="min-height:40px;padding:0 16px" href="'+p.href+'">Ver proyecto</a></div></div></article>';
}
function render(){
 var el=document.getElementById('lista');if(!el)return;
 var d=document.getElementById('f-dist').value,b=document.getElementById('f-dorm').value;
 var list=PROJECTS.filter(function(p){return (d==='all'||p.dist===d)&&(b==='all'||p.dorms.indexOf(+b)>-1)});
 list.sort(function(a,c){return (a.status==='sold')-(c.status==='sold')});
 el.innerHTML=list.length?list.map(card).join(''):'<p class="empty">No hay proyectos con ese filtro. Escríbenos y te avisamos de nuevos lanzamientos.</p>';
 reveal();
}
function reveal(){
 var els=document.querySelectorAll('.rv:not(.in)');
 if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return}
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
 els.forEach(function(e){io.observe(e)});
}
var qNow=0;function tweenQ(to){var el=document.getElementById('c-q'),from=qNow,t0=null;qNow=to;function f(t){if(!t0)t0=t;var p=Math.min((t-t0)/600,1);el.textContent=fmt(Math.round(from+(to-from)*(1-Math.pow(1-p,3))))+' al mes';if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
function calc(){
 var p=+document.getElementById('c-p').value||0,i=+document.getElementById('c-i').value||0,y=+document.getElementById('c-y').value||20,r=+document.getElementById('c-r').value||0;
 var ini=p*i/100,loan=p-ini,n=y*12,m=r/1200;
 var q=m?loan*m/(1-Math.pow(1+m,-n)):loan/n;
 document.getElementById('c-ini').textContent=fmt(Math.round(ini));
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
  var hero=document.querySelector('.hero');
  if(hero&&matchMedia('(hover:hover)').matches){hero.addEventListener('mousemove',function(e){var r=hero.getBoundingClientRect();hero.style.setProperty('--mx',((e.clientX-r.left)/r.width-.5)*2);hero.style.setProperty('--my',((e.clientY-r.top)/r.height-.5)*2)})}
  if(matchMedia('(hover:hover)').matches){document.addEventListener('mousemove',function(e){var c=e.target.closest&&e.target.closest('.card,.tipo');document.querySelectorAll('.tilt').forEach(function(t){if(t!==c){t.classList.remove('tilt');t.style.transform=''}});if(!c)return;var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.classList.add('tilt');c.style.transform='perspective(900px) rotateX('+(-y*5)+'deg) rotateY('+(x*6)+'deg) translateY(-5px)'})}
 });
})();
