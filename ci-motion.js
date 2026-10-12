(function(){
  var rm=matchMedia('(prefers-reduced-motion:reduce)').matches,fine=matchMedia('(pointer:fine)').matches;
  /* progreso de lectura */
  var bar=document.querySelector('.mo-progress i');
  function prog(){var h=document.documentElement.scrollHeight-innerHeight;if(bar)bar.style.transform='scaleX('+(h>0?scrollY/h:0)+')';
    var t=document.querySelector('.lp-timeline--interactive');
    if(t){var r=t.getBoundingClientRect(),p=Math.max(0,Math.min(1,(innerHeight*.75-r.top)/(r.height+innerHeight*.2)));t.style.setProperty('--mo-p',p.toFixed(3));
      t.querySelectorAll('li').forEach(function(li,i,a){li.classList.toggle('mo-lit',p>(i+.4)/a.length)})}}
  addEventListener('scroll',prog,{passive:true});prog();
  /* titulares por palabras */
  document.querySelectorAll('.lp-hero h1, .lp-head .h2').forEach(function(h){
    if(h.dataset.mo)return;h.dataset.mo=1;var d=0;
    (function walk(n){[].slice.call(n.childNodes).forEach(function(c){
      if(c.nodeType===3){var f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(function(w){
        if(!w.trim()){f.appendChild(document.createTextNode(w));return}
        var o=document.createElement('span');o.className='mo-word';var i=document.createElement('span');i.textContent=w;i.style.transitionDelay=(d++*70)+'ms';o.appendChild(i);f.appendChild(o)});
        n.replaceChild(f,c)}else if(c.nodeType===1)walk(c)})})(h);
  });
  var hero=document.querySelector('.lp-hero');if(hero)setTimeout(function(){hero.classList.add('mo-split-on')},150);
  /* contadores */
  function count(el){var to=+el.dataset.moCount,t0=null,dur=1400;function f(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur);el.textContent=Math.round(to*(1-Math.pow(1-p,3))).toLocaleString('en-US');if(p<1)requestAnimationFrame(f)}
    rm?el.textContent=to.toLocaleString('en-US'):requestAnimationFrame(f)}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;e.target.classList.add('is-in');
    e.target.querySelectorAll('[data-mo-count]').forEach(count);io.unobserve(e.target)})},{threshold:.25});
  document.querySelectorAll('.mo-card,.lp-head,.lp-hero').forEach(function(e){io.observe(e)});
  /* inclinación 3D y botones magnéticos (solo mouse) */
  if(fine&&!rm){
    document.querySelectorAll('.mo-card').forEach(function(c){
      c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform='perspective(800px) rotateY('+x*7+'deg) rotateX('+-y*7+'deg) translateY(-4px)'});
      c.addEventListener('pointerleave',function(){c.style.transform=''})});
    document.querySelectorAll('.lp-hero .btn,.mo-card--f a').forEach(function(b){
      b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+(e.clientX-r.left-r.width/2)*.18+'px,'+(e.clientY-r.top-r.height/2)*.25+'px)'});
      b.addEventListener('pointerleave',function(){b.style.transform=''})});
    if(hero){var chips=hero.querySelectorAll('.mo-chip');hero.addEventListener('pointermove',function(e){var x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;chips.forEach(function(c,i){c.style.translate=(x*(16+i*8))+'px '+(y*(12+i*6))+'px'})})}
  }

  /* v2: carruseles automáticos y tarjetas táctiles */
  function loop(items,ms,on,bar){var i=0,t,start;function go(n){i=(n+items.length)%items.length;on(i);run()}
    function run(){clearTimeout(t);start=performance.now();if(bar){bar.style.transition='none';bar.style.transform='scaleX(0)';void bar.offsetWidth;bar.style.transition='transform '+ms+'ms linear';bar.style.transform='scaleX(1)'}
      if(!rm)t=setTimeout(function(){go(i+1)},ms)}
    return {go:go,run:run,pause:function(){clearTimeout(t)}}}
  /* hero panel */
  var hl=document.querySelectorAll('.mo-hpanel__list li');
  if(hl.length&&!rm){var hi=0;setInterval(function(){hl[hi].classList.remove('is-on');hi=(hi+1)%hl.length;hl[hi].classList.add('is-on')},2600)}
  /* qué producimos */
  var tabs=document.querySelectorAll('.mo-tab'),fr=document.querySelectorAll('.mo-stage__f'),tb=document.querySelector('.mo-tabs__bar b');
  if(tabs.length){var L1=loop(tabs,4500,function(i){tabs.forEach(function(x,k){x.classList.toggle('is-on',k===i);fr[k].classList.toggle('is-on',k===i)})},tb);
    tabs.forEach(function(b,k){b.addEventListener('click',function(){L1.go(k)});b.addEventListener('mouseenter',function(){if(fine)L1.go(k)})});
    var sp=document.querySelector('#servicios-contenido');if(sp)new IntersectionObserver(function(e){e[0].isIntersecting?L1.run():L1.pause()}).observe(sp)}
  /* proceso */
  var nodes=document.querySelectorAll('.mo-node'),ps=document.querySelectorAll('.mo-pstep'),tl=document.querySelector('.mo-tl');
  if(nodes.length){var L2=loop(nodes,3800,function(i){nodes.forEach(function(x,k){x.classList.toggle('is-on',k===i);x.classList.toggle('is-done',k<i);ps[k].classList.toggle('is-on',k===i)});
      tl.style.setProperty('--p',(i/(nodes.length-1)).toFixed(3));var st=tl.querySelector('.mo-tl__stage');st.style.setProperty('--t',0);requestAnimationFrame(function(){st.style.transition='none'})},null);
    nodes.forEach(function(b,k){b.addEventListener('click',function(){L2.go(k)})});
    new IntersectionObserver(function(e){e[0].isIntersecting?L2.go(0):L2.pause()},{threshold:.3}).observe(tl)}
  /* tarjetas problema (táctil) */
  document.querySelectorAll('.mo-pcard').forEach(function(c){c.addEventListener('click',function(){var o=c.classList.contains('is-open');document.querySelectorAll('.mo-pcard.is-open').forEach(function(x){x.classList.remove('is-open')});if(!o)c.classList.add('is-open')})});
  document.querySelectorAll('.mo-metrics,.mo-resgrid,.mo-kpis,.lp-content-channels').forEach(function(e){io.observe(e)});

  /* material unificado */
  var mt=document.querySelectorAll('.mo-mtab'),mp=document.querySelectorAll('.mo-mpanel'),mi=document.querySelector('.mo-mtabs');
  function vids(panel,on){panel.querySelectorAll('video').forEach(function(v){
    if(on){v.querySelectorAll('source[data-src]').forEach(function(s){if(!s.src){s.src=s.dataset.src;v.load()}});var pr=v.play();if(pr&&pr.catch)pr.catch(function(){})}else v.pause()})}
  function showTab(i){mt.forEach(function(x,k){x.classList.toggle('is-on',k===i);mp[k].classList.toggle('is-on',k===i);vids(mp[k],k===i)});if(mi)mi.style.setProperty('--i',i)}
  mt.forEach(function(b,k){b.addEventListener('click',function(){showTab(k)})});
})();

/* Resultados interactivos: un panel, tres botones */
(function(){
  var box=document.getElementById('mo-rs');if(!box)return;
  var D=[
    {t:'Más clics en tu anuncio',d:'Una primera imagen que detiene el scroll.',n:'Más gente toca tu anuncio y llega a tu propiedad.',v:40,u:'clics'},
    {t:'Más tiempo mirando tu propiedad',d:'Más ambientes vistos antes de decidir.',n:'Los interesados se quedan viendo la propiedad.',v:60,u:'segundos mirando'},
    {t:'Más personas te escriben',d:'Ubicación y acabados claros.',n:'Más mensajes de gente que sí quiere visitar.',v:35,u:'mensajes'}
  ];
  var tabs=box.querySelectorAll('[data-r]'),panel=box.querySelector('.mo-rs__panel'),dots=box.querySelector('.mo-rs__dots b');
  var cur=0,timer=null,user=false,raf=0;
  function q(s){return box.querySelector(s)}
  function show(i){
    cur=i;var x=D[i];
    tabs.forEach(function(b,k){var on=k===i;b.classList.toggle('is-on',on);b.setAttribute('aria-selected',on)});
    q('.mo-rs__t').textContent=x.t;q('.mo-rs__d').textContent=x.d;q('.mo-rs__n').textContent=x.n;
    q('.mo-rs__e').textContent='hasta '+(100+x.v)+' '+x.u;q('.mo-rs__h0').textContent='100 '+x.u;
    box.style.setProperty('--hi',(100+x.v)/100);
    panel.classList.remove('go');void panel.offsetWidth;panel.classList.add('go');
    var v=q('.mo-rs__v'),t0=null;cancelAnimationFrame(raf);
    if(window.matchMedia('(prefers-reduced-motion:reduce)').matches){v.textContent='+'+x.v;return}
    (function f(ts){if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/900);v.textContent='+'+Math.round(x.v*(1-Math.pow(1-p,3)));if(p<1)raf=requestAnimationFrame(f)})(performance.now());
    if(dots){dots.style.animation='none';void dots.offsetWidth;dots.style.animation=''}
  }
  function auto(){clearInterval(timer);if(user)return;timer=setInterval(function(){show((cur+1)%3)},5200)}
  tabs.forEach(function(b,k){b.addEventListener('click',function(){user=true;clearInterval(timer);if(dots)dots.parentNode.style.display='none';show(k)})});
  var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){show(cur);auto()}else clearInterval(timer)})},{threshold:.35});
  io.observe(box);
})();

/* barra superior: desaparece tras la primera sección */
(function(){
  var nav=document.querySelector('.lp-nav'),hero=document.querySelector('.lp-hero');if(!nav||!hero)return;
  function f(){nav.classList.toggle('is-gone',window.scrollY>hero.offsetHeight-60)}
  window.addEventListener('scroll',f,{passive:true});f();
  var rs=document.getElementById('mo-rs');if(rs)rs.querySelectorAll('[data-r]').forEach(function(b){b.addEventListener('click',function(){rs.classList.add('is-user')})});
})();
