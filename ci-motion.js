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
  function count(el){var to=+el.dataset.moCount,t0=null,dur=1400;function f(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)}
    rm?el.textContent=to:requestAnimationFrame(f)}
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
})();
