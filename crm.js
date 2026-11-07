(function(){
  document.querySelectorAll('.cr-bc').forEach(function(b){
    b.addEventListener('click',function(){var o=b.classList.toggle('is-open');b.setAttribute('aria-pressed',o?'true':'false');});
  });
  var rng=document.getElementById('cr-rng');if(!rng)return;
  var opts=[].slice.call(document.querySelectorAll('.cr-opt')),segs=[].slice.call(document.querySelectorAll('.cr-seg button'));
  var $=function(i){return document.getElementById(i)},fmt=function(n){return 'S/ '+Math.round(n).toLocaleString('es-PE')};
  var cur=0,tw;
  function tween(el,to){var from=cur,t0=performance.now();cancelAnimationFrame(tw);(function f(t){var k=Math.min(1,(t-t0)/600),e=1-Math.pow(1-k,3);el.textContent=fmt(from+(to-from)*e);if(k<1)tw=requestAnimationFrame(f);else cur=to})(t0)}
  function upd(){
    var o=document.querySelector('.cr-opt.is-on'),m=+document.querySelector('.cr-seg .is-on').dataset.m,u=+rng.value;
    var p=+o.dataset.p,min=+o.dataset.min,bill=Math.max(u,min),mo=p*bill,tot=mo*m;
    $('cr-nv').textContent=u;$('cr-ologo').innerHTML=o.dataset.logo;$('cr-operiod').textContent=o.dataset.n+' · '+m+' meses';
    $('cr-omo').textContent=fmt(mo)+' al mes'+(min>u?' (mínimo '+min+' usuarios)':'');
    $('cr-obar').style.width='100%';$('cr-sbar').style.width='3%';
    tween($('cr-ototal'),tot);
  }
  opts.forEach(function(b){b.addEventListener('click',function(){opts.forEach(function(x){x.classList.remove('is-on')});b.classList.add('is-on');upd()})});
  segs.forEach(function(b){b.addEventListener('click',function(){segs.forEach(function(x){x.classList.remove('is-on')});b.classList.add('is-on');upd()})});
  rng.addEventListener('input',upd);
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){cur=0;upd();io.disconnect()}})},{threshold:.3});io.observe(document.getElementById('costos'));
  upd();
})();
