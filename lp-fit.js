/* Móvil: ajusta cada sección para que su contenido quepa exacto en una pantalla (zoom proporcional, mínimo .58). */
(function(){
  var crm=document.body.dataset.landing==='crm',mqm=matchMedia('(max-width:767px)'),mq={get matches(){return crm||mqm.matches}};
  var secs=[].slice.call(document.querySelectorAll('section.lp-section'));
  if(!secs.length) return;
  function fit(sec){
    var w=sec.querySelector(':scope>.wrap'); if(!w) return;
    w.style.zoom='';w.style.width='';
    if(!mq.matches) return;
    var cs=getComputedStyle(sec);
    var avail=window.innerHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
    var nat=w.getBoundingClientRect().height;
    if(nat>avail+1){ var z=Math.max(crm&&!mqm.matches?.7:.58,avail/nat), ow=w.getBoundingClientRect().width; w.style.width=(ow/z).toFixed(1)+'px'; w.style.zoom=z.toFixed(3);
      for(var k=0;k<4;k++){ var hh=w.getBoundingClientRect().height; if(hh<=avail+.5||z<=.5) break; z=Math.max(.5,z*avail/hh-.002); w.style.width=(ow/z).toFixed(1)+'px'; w.style.zoom=z.toFixed(3); } }
  }
  var raf=0;
  function all(){ cancelAnimationFrame(raf); raf=requestAnimationFrame(function(){ secs.forEach(fit); }); }
  window.addEventListener('resize',all); window.addEventListener('orientationchange',all); window.addEventListener('load',all);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(all);
  all();
})();
