/* Cotizador de precios · contenido inmobiliario (Lima Metropolitana, precios sin IGV) */
(function(){
  var root=document.getElementById('cotizador');if(!root)return;
  var IGV=.18,state={video:'',photo:'',edit:false,qty:1};
  var VIDEO={drone:{n:'Grabación con drone',p:250,from:true},cam:{n:'Grabación con cámara',p:350,from:true},combo:{n:'Grabación con cámara + drone',p:350,from:true}};
  var PHOTO={int:{n:'Fotografía de interiores',p:250},ext:{n:'Fotografía de exteriores (incluye edición)',p:250},both:{n:'Fotografía interior + exterior · 15 fotos editadas',p:500,pv:100}};
  var PACKS={'drone-ed':{video:'drone',photo:'',edit:true},'combo-ed':{video:'combo',photo:'',edit:true},'todo':{video:'combo',photo:'both',edit:true}};
  var $=function(s){return root.querySelector(s)},$$=function(s){return root.querySelectorAll(s)};
  var fmt=function(n){n=Math.round(n*100)/100;return 'S/ '+(n%1?n.toFixed(2):n)};
  function disc(q){return q>=4?.2:q===3?.15:q===2?.1:0}
  function lines(){
    var L=[],hv=!!state.video;
    if(hv){var v=VIDEO[state.video];L.push({n:v.n,u:v.p,from:v.from})}
    if(state.photo){var f=PHOTO[state.photo];var u=(f.pv&&hv)?f.pv:f.p;L.push({n:f.n+(''),u:u})}
    if(state.edit){L.push({n:hv?'Edición avanzada: IA, Premiere, After Effects y color grading':'Solo edición: IA, Premiere, After Effects y color grading',u:hv?100:150})}
    return L;
  }
  function render(){
    var L=lines(),sub=0,from=false;
    L.forEach(function(l){sub+=l.u*state.qty;if(l.from&&!state.edit)from=true});
    var d=disc(state.qty),dv=sub*d,total=sub-dv;
    $$('[data-g]').forEach(function(b){var g=b.dataset.g;b.setAttribute('aria-pressed',g==='edit'?state.edit:state[g]===b.dataset.v)});
    $$('[data-pack]').forEach(function(b){var p=PACKS[b.dataset.pack];b.classList.toggle('is-on',p.video===state.video&&p.photo===state.photo&&p.edit===state.edit)});
    var ec=$('[data-g="edit"] .cot__price');if(ec)ec.textContent=state.video?'+ S/ 100':'S/ 150';
    $('.cot__lines').innerHTML=L.length?L.map(function(l){return '<li><span>'+l.n+'</span></li>'}).join('')+(state.qty>1?'<li class="cot__props"><span>'+state.qty+' propiedades</span></li>':''):'<li class="cot__empty">Elige un pack o un servicio para ver tu cotización.</li>';
    $('.cot__discrow').style.display=d?'':'none';
    $('.cot__dsc').textContent=d?'−'+Math.round(d*100)+'%':'—';
    var tot=$('.cot__total');tot.textContent=L.length?(from?'desde ':'')+fmt(total):'S/ 0';
    tot.classList.remove('is-bump');void tot.offsetWidth;tot.classList.add('is-bump');
    $('.cot__qty-n').textContent=state.qty;
    var tier=state.qty>=4?4:state.qty;
    $$('.cot__disc li').forEach(function(li){li.classList.toggle('is-on',+li.dataset.q===tier)});
    var msg='Hola Steid Hub, quiero cotizar contenido inmobiliario:\n'+L.map(function(l){return '• '+l.n}).join('\n')+'\nPropiedades: '+state.qty+(d?' (descuento '+Math.round(d*100)+'%)':'')+'\nTotal referencial + IGV: '+(from?'desde ':'')+fmt(total);
    var a=$('.cot__cta');a.href='https://wa.me/51983595390?text='+encodeURIComponent(L.length?msg:'Hola Steid Hub, quiero cotizar contenido inmobiliario');
    a.setAttribute('aria-disabled',L.length?'false':'true');
  }
  root.addEventListener('click',function(e){
    var pk=e.target.closest('[data-pack]');
    if(pk){var p=PACKS[pk.dataset.pack];state.video=p.video;state.photo=p.photo;state.edit=p.edit;render();return}
    var o=e.target.closest('[data-g]');
    if(o){var g=o.dataset.g;
      if(g==='edit')state.edit=!state.edit;else state[g]=state[g]===o.dataset.v?'':o.dataset.v;
      render();return}
    var s=e.target.closest('[data-step]');
    if(s){state.qty=Math.max(1,Math.min(20,state.qty+(+s.dataset.step)));render();return}
    var q=e.target.closest('.cot__disc li');
    if(q){state.qty=Math.max(+q.dataset.q,state.qty>=4&&+q.dataset.q===4?state.qty:+q.dataset.q);render()}
  });
  state.video='combo';state.photo='both';state.edit=true;
  render();
})();
