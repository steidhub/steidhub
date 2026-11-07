(function(){
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,wait=reduce?0:750;
  function mk(body,c,t){var d=document.createElement('div');d.className=c;if(t)d.textContent=t;body.appendChild(d);body.scrollTop=body.scrollHeight;return d}
  /* Hero: conversación automática en bucle */
  var auto=document.getElementById('cb-auto');
  if(auto){
    var seq=[['u','Hola, busco depa en Miraflores'],['b','¡Hola! Soy el asistente de Inmobiliaria Sol. ¿Cuántos dormitorios?'],['u','2 dormitorios'],['b','¿Cuál es tu presupuesto aproximado?'],['u','Hasta US$ 180 mil'],['b','Listo. Te conecto con Ana R., tu asesora.'],['t','Lead calificado · en tu CRM']],run=0;
    (function play(){
      var id=++run,i=0;auto.innerHTML='';
      (function next(){
        if(id!==run)return;
        if(i>=seq.length){setTimeout(play,3800);return}
        var s=seq[i++],delay=s[0]==='b'?wait+350:900;
        if(s[0]==='b'){var ty=mk(auto,'cb-b cb-b--t');ty.innerHTML='<i></i><i></i><i></i>';
          setTimeout(function(){ty.remove();mk(auto,'cb-b cb-b--b',s[1]);setTimeout(next,700)},wait+300)}
        else{setTimeout(function(){mk(auto,s[0]==='u'?'cb-b cb-b--u':'cb-tag',s[1]);setTimeout(next,s[0]==='t'?0:400)},s[0]==='u'?700:200)}
      })();
    })();
  }
  /* Demo interactivo */
  var chat=document.getElementById('cb-chat');
  if(chat){
    var body=document.getElementById('cb-body'),opts=document.getElementById('cb-opts'),lead=document.getElementById('cb-lead'),pg=document.getElementById('cb-pg'),stp=document.querySelectorAll('#cb-steps li'),started=false,run=0;
    var steps=[
      {q:'¡Hola! Soy el asistente de Inmobiliaria Sol. ¿Qué buscas hoy?',k:'op',o:['Comprar','Alquilar','Vender mi propiedad']},
      {q:'Perfecto. ¿En qué zona?',k:'zona',o:['Miraflores','San Isidro','Surco','Otra zona']},
      {q:'¿Cuántos dormitorios necesitas?',k:'dorm',o:['1','2','3 o más']},
      {q:'¿Cuál es tu presupuesto aproximado?',k:'pres',o:['Hasta US$ 120 mil','US$ 120 a 200 mil','Más de US$ 200 mil']},
      {q:'¿Cuándo te gustaría visitar?',k:'vis',o:['Esta semana','Este mes','Solo estoy mirando']}
    ],vals={};
    function setLead(k,v){var d=lead.querySelector('[data-k="'+k+'"]');if(d){d.textContent=v;d.classList.add('on')}}
    function prog(n){pg.style.width=(n/steps.length*100)+'%';stp.forEach(function(li,i){li.classList.toggle('on',i<n)})}
    function bot(t,cb,id){var ty=mk(body,'cb-b cb-b--t');ty.innerHTML='<i></i><i></i><i></i>';setTimeout(function(){if(id!==run)return;ty.remove();mk(body,'cb-b cb-b--b',t);cb&&cb()},wait)}
    function ask(i,id){var s=steps[i];bot(s.q,function(){opts.innerHTML='';s.o.forEach(function(t){var b=document.createElement('button');b.type='button';b.className='cb-o';b.textContent=t;b.onclick=function(){opts.innerHTML='';mk(body,'cb-b cb-b--u',t);vals[s.k]=t;setLead(s.k,t);prog(i+1);if(i+1<steps.length)ask(i+1,id);else end(id)};opts.appendChild(b)})},id)}
    function end(id){bot('Listo. Te conecto con Ana R., tu asesora. Ya registré tu consulta.',function(){
      setLead('ase','Ana R.');mk(body,'cb-tag','Lead en el CRM · asignado a Ana R.');
      var n=mk(body,'cb-notif');n.innerHTML='<b>Aviso a Ana R. por WhatsApp</b>Nuevo lead calificado: '+vals.op+' en '+vals.zona+', '+vals.dorm+' dorm., '+vals.pres+'. Visita: '+vals.vis.toLowerCase()+'.';
      var r=document.createElement('button');r.type='button';r.className='cb-o cb-o--r';r.textContent='Volver a probar';r.onclick=start;opts.innerHTML='';opts.appendChild(r);body.scrollTop=body.scrollHeight},id)}
    function start(){run++;body.innerHTML='';opts.innerHTML='';vals={};prog(0);lead.querySelectorAll('dd').forEach(function(d){d.classList.remove('on');d.textContent=d.dataset.k==='ase'?'Sin asignar':'Pendiente'});ask(0,run)}
    var sec=document.getElementById('demo');
    if('IntersectionObserver' in window)new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting&&!started){started=true;start();o.disconnect()}})},{threshold:.35}).observe(sec);else{started=true;start()}
  }
  /* KPIs: tocar para ver cómo se mide */
  document.querySelectorAll('.cb-kpi').forEach(function(b){b.addEventListener('click',function(){b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')==='true'?'false':'true')})});
  /* Antes / después */
  var rows=document.getElementById('cb-rows');
  if(rows){
    var seg=document.querySelectorAll('.cb-seg button'),auto2=true;
    function mode(m,manual){if(manual)auto2=false;rows.dataset.m=m;seg.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.m===m?'true':'false')})}
    seg.forEach(function(b){b.addEventListener('click',function(){mode(b.dataset.m,true)})});
    mode('sin');
    var sr=document.getElementById('resultados');
    if('IntersectionObserver' in window)new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){o.disconnect();setTimeout(function(){if(auto2)mode('con')},1800)}})},{threshold:.4}).observe(sr);else mode('con');
  }
})();
