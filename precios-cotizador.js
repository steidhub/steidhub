/* Cotizador de precios · contenido inmobiliario */
(function(){
  var root=document.getElementById('cotizador');if(!root)return;
  var IGV=.18,state={video:'drone',photo:false,qty:1};
  var video={
    drone:{n:'Grabación con drone',p:250,igv:false,from:true},
    ia:{n:'Drone + edición IA, tracking, After Effects y Premiere',p:350,igv:true},
    full:{n:'Cámara + drone + edición',p:450,igv:true}
  };
  var photo={n:'Fotografía de interiores · 15 fotos editadas',p:550,igv:false};
  var $=function(s){return root.querySelector(s)};
  var fmt=function(n){return 'S/ '+n.toLocaleString('es-PE',{minimumFractionDigits:0,maximumFractionDigits:2})};
  function lines(){
    var out=[];
    if(state.video&&video[state.video]){var v=video[state.video];out.push({n:v.n,u:v.p,igv:v.igv,from:v.from})}
    if(state.photo)out.push({n:photo.n,u:photo.p,igv:photo.igv});
    return out;
  }
  function render(){
    var L=lines(),sub=0,igv=0,anyFrom=false;
    L.forEach(function(l){var t=l.u*state.qty;sub+=t;if(l.igv)igv+=t*IGV;if(l.from)anyFrom=true});
    var total=sub+igv,box=$('.cot__lines');
    box.innerHTML=L.length?L.map(function(l){
      return '<li><span>'+l.n+(state.qty>1?' <em>× '+state.qty+'</em>':'')+'<small>'+(l.from?'desde ':'')+fmt(l.u)+(l.igv?' + IGV':'')+' por propiedad</small></span><b>'+fmt(l.u*state.qty)+'</b></li>';
    }).join(''):'<li class="cot__empty">Elige un servicio para ver tu cotización.</li>';
    $('.cot__sub').textContent=fmt(sub);
    $('.cot__igv').textContent=igv?fmt(Math.round(igv*100)/100):'—';
    var tot=$('.cot__total');tot.textContent=(anyFrom?'desde ':'')+fmt(Math.round(total*100)/100);
    tot.classList.remove('is-bump');void tot.offsetWidth;tot.classList.add('is-bump');
    $('.cot__qty-n').textContent=state.qty;
    var msg='Hola Steid Hub, quiero cotizar contenido inmobiliario:\n'+L.map(function(l){return '• '+l.n}).join('\n')+'\nPropiedades: '+state.qty+'\nTotal referencial: '+(anyFrom?'desde ':'')+fmt(Math.round(total*100)/100)+(igv?' (incluye IGV)':'');
    var a=$('.cot__cta');a.href='https://wa.me/51983595390?text='+encodeURIComponent(L.length?msg:'Hola Steid Hub, quiero cotizar contenido inmobiliario');
    a.setAttribute('aria-disabled',L.length?'false':'true');
  }
  root.addEventListener('click',function(e){
    var o=e.target.closest('[data-video]');
    if(o){state.video=state.video===o.dataset.video?'':o.dataset.video;
      root.querySelectorAll('[data-video]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.video===state.video)});render();return}
    var p=e.target.closest('[data-photo]');
    if(p){state.photo=!state.photo;p.setAttribute('aria-pressed',state.photo);render();return}
    var s=e.target.closest('[data-step]');
    if(s){state.qty=Math.max(1,Math.min(20,state.qty+(+s.dataset.step)));render()}
  });
  render();
})();
