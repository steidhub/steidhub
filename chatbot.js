(function(){
  var chat=document.getElementById('cb-chat');if(!chat)return;
  var body=document.getElementById('cb-body'),opts=document.getElementById('cb-opts'),lead=document.getElementById('cb-lead');
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,started=false,run=0,wait=reduce?0:750;
  var steps=[
    {q:'¡Hola! Soy el asistente de Inmobiliaria Sol. ¿Qué buscas hoy?',k:'op',o:['Comprar','Alquilar','Vender mi propiedad']},
    {q:'Perfecto. ¿En qué zona?',k:'zona',o:['Miraflores','San Isidro','Surco','Otra zona']},
    {q:'¿Cuántos dormitorios necesitas?',k:'dorm',o:['1','2','3 o más']},
    {q:'¿Cuál es tu presupuesto aproximado?',k:'pres',o:['Hasta US$ 120 mil','US$ 120 a 200 mil','Más de US$ 200 mil']},
    {q:'¿Cuándo te gustaría visitar?',k:'vis',o:['Esta semana','Este mes','Solo estoy mirando']}
  ];
  function el(c,t){var d=document.createElement('div');d.className=c;if(t)d.textContent=t;body.appendChild(d);body.scrollTop=body.scrollHeight;return d}
  function setLead(k,v){var d=lead.querySelector('[data-k="'+k+'"]');if(d){d.textContent=v;d.classList.add('on')}}
  function resetLead(){lead.querySelectorAll('dd').forEach(function(d){d.classList.remove('on');d.textContent=d.dataset.k==='ase'?'Sin asignar':'Pendiente'})}
  function bot(t,cb,id){
    var ty=el('cb-b cb-b--t');ty.innerHTML='<i></i><i></i><i></i>';
    setTimeout(function(){if(id!==run)return;ty.remove();el('cb-b cb-b--b',t);cb&&cb()},wait);
  }
  function ask(i,id){
    var s=steps[i];
    bot(s.q,function(){
      opts.innerHTML='';
      s.o.forEach(function(t){
        var b=document.createElement('button');b.type='button';b.className='cb-o';b.textContent=t;
        b.onclick=function(){opts.innerHTML='';el('cb-b cb-b--u',t);setLead(s.k,t);
          if(i+1<steps.length)ask(i+1,id);else end(id)};
        opts.appendChild(b);
      });
    },id);
  }
  function end(id){
    bot('Listo. Te conecto con Ana R., tu asesora. Ya registré tu consulta.',function(){
      setLead('ase','Ana R.');
      var t=el('cb-tag','Lead en el CRM · asignado a Ana R.');
      var r=document.createElement('button');r.type='button';r.className='cb-o cb-o--r';r.textContent='Volver a probar';r.onclick=start;
      opts.innerHTML='';opts.appendChild(r);body.scrollTop=body.scrollHeight;
    },id);
  }
  function start(){run++;body.innerHTML='';opts.innerHTML='';resetLead();ask(0,run)}
  var sec=document.getElementById('demo');
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting&&!started){started=true;start();o.disconnect()}})},{threshold:.35}).observe(sec);
  }else{started=true;start()}
})();
