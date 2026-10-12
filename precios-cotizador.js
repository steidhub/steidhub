/* Cotizador · contenido inmobiliario (Lima Metropolitana, precio final + IGV, sin precios por ítem) */
(function(){
  var root=document.getElementById('cotizador');if(!root)return;
  var state={drone:false,cam:false,int:false,ext:false,edit:false,qty:1};
  var PACKS={'drone-ed':{drone:1,cam:0,int:0,ext:0,edit:1},'combo-ed':{drone:1,cam:1,int:0,ext:0,edit:1},'todo':{drone:1,cam:1,int:1,ext:1,edit:1}};
  var $=function(s){return root.querySelector(s)},$$=function(s){return root.querySelectorAll(s)};
  var fmt=function(n){n=Math.round(n*100)/100;return 'S/ '+(n%1?n.toFixed(2):n)};
  function disc(q){return q>=4?.2:q===3?.15:q===2?.1:0}
  function price(){
    var hv=state.drone||state.cam,v=0,f=0,e=0;
    if(state.drone&&state.cam)v=350;else if(state.cam)v=350;else if(state.drone)v=250;
    if(state.int&&state.ext)f=hv?100:500;else if(state.int||state.ext)f=250;
    if(state.edit)e=hv?100:150;
    return v+f+e;
  }
  function names(){
    var L=[];
    if(state.drone&&state.cam)L.push('Grabación con cámara + drone');else if(state.drone)L.push('Grabación con drone');else if(state.cam)L.push('Grabación con cámara');
    if(state.int&&state.ext)L.push('Fotografía de interiores y exteriores · 15 fotos editadas');else if(state.int)L.push('Fotografía de interiores');else if(state.ext)L.push('Fotografía de exteriores');
    if(state.edit)L.push((state.drone||state.cam)?'Edición avanzada: IA, Premiere, After Effects y color grading':'Solo edición: IA, Premiere, After Effects y color grading');
    return L;
  }
  function same(p){return ['drone','cam','int','ext','edit'].every(function(k){return !!p[k]===!!state[k]})}
  function render(){
    var L=names(),unit=price(),d=disc(state.qty),total=unit*state.qty*(1-d);
    $$('[data-k]').forEach(function(b){var on=!!state[b.dataset.k];b.setAttribute('aria-checked',on);b.classList.toggle('is-on',on)});
    $$('[data-pack]').forEach(function(b){b.classList.toggle('is-on',same(PACKS[b.dataset.pack]))});
    $('.cot__lines').innerHTML=L.length?L.map(function(n){return '<li><span>'+n+'</span></li>'}).join('')+(state.qty>1?'<li class="cot__props"><span>'+state.qty+' propiedades</span></li>':''):'<li class="cot__empty">Marca lo que necesitas para ver tu precio.</li>';
    $('.cot__discrow').style.display=d?'':'none';
    $('.cot__dsc').textContent=d?'−'+Math.round(d*100)+'% por '+state.qty+' propiedades':'—';
    var tot=$('.cot__total');tot.textContent=L.length?fmt(total):'S/ 0';
    tot.classList.remove('is-bump');void tot.offsetWidth;tot.classList.add('is-bump');
    $('.cot__qty-n').textContent=state.qty;
    var tier=state.qty>=4?4:state.qty;
    $$('.cot__disc li').forEach(function(li){li.classList.toggle('is-on',+li.dataset.q===tier)});
    var msg='Hola Steid Hub, quiero cotizar contenido inmobiliario:\n'+L.map(function(n){return '• '+n}).join('\n')+'\nPropiedades: '+state.qty+(d?' (descuento '+Math.round(d*100)+'%)':'')+'\nTotal: '+fmt(total)+' + IGV';
    var a=$('.cot__cta');a.href='https://wa.me/51983595390?text='+encodeURIComponent(L.length?msg:'Hola Steid Hub, quiero cotizar contenido inmobiliario');
    a.setAttribute('aria-disabled',L.length?'false':'true');
  }
  root.addEventListener('click',function(e){
    var pk=e.target.closest('[data-pack]');
    if(pk){var p=PACKS[pk.dataset.pack];Object.keys(state).forEach(function(k){if(k!=='qty')state[k]=!!p[k]});render();return}
    var o=e.target.closest('[data-k]');
    if(o){state[o.dataset.k]=!state[o.dataset.k];render();return}
    var s=e.target.closest('[data-step]');
    if(s){state.qty=Math.max(1,Math.min(20,state.qty+(+s.dataset.step)));render();return}
    var q=e.target.closest('.cot__disc li');
    if(q){state.qty=+q.dataset.q;render()}
  });
  Object.keys(PACKS.todo).forEach(function(k){state[k]=true});
  render();
})();
