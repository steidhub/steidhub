(function(){
  var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  function vis(el,cb,once){
    if(!('IntersectionObserver' in window)){cb(true);return}
    var io=new IntersectionObserver(function(es){es.forEach(function(e){cb(e.isIntersecting);if(e.isIntersecting&&once)io.unobserve(el)})},{threshold:.12});io.observe(el);
  }
  /* revelado + contadores */
  $$('.sx-rv,.sx-kpis').forEach(function(el){vis(el,function(on){if(on){el.classList.add('sx-on');$$('[data-sx-count]',el).forEach(count)}},true)});
  function count(n){
    if(n._d)return;n._d=1;var to=+n.dataset.sxCount,p=n.dataset.prefix||'',s=n.dataset.suffix||'';
    if(RM){n.textContent=p+to+s;return}
    var t0=performance.now();(function f(t){var k=Math.min(1,(t-t0)/1400),e=1-Math.pow(1-k,3);n.textContent=p+Math.round(to*e)+s;if(k<1)requestAnimationFrame(f)})(t0);
  }
  /* versus */
  $$('.sx-vs').forEach(function(box){
    var dots=$('.sx-vs__dots',box),N=30,els=[],mode='a',auto=true,tm;
    for(var i=0;i<N;i++){var d=document.createElement('i');if(i===13)d.className='is-me';dots.appendChild(d);els.push(d)}
    function layout(){
      var W=dots.clientWidth,H=dots.clientHeight,cols=W<420?6:8,rows=Math.ceil(N/cols),sz=els[0].offsetWidth,gx=(W-sz)/(cols-1),gy=(H-sz)/(rows-1),cx=W/2-sz/2,cy=H/2-sz/2;
      var me=els.filter(function(e){return e.classList.contains('is-me')});
      els.forEach(function(d,i){
        var x,y,o=1;
        if(mode==='a'){x=(i%cols)*gx;y=Math.floor(i/cols)*gy}
        else{
          var isMe=i%3===0,k=Math.floor(i/3),ang=k/10*Math.PI*2,r=Math.min(W,H)*(.2+.18*((k%3)/2));
          if(isMe){x=cx+Math.cos(ang)*r;y=cy+Math.sin(ang)*r;d.style.background='#C46B3C'}
          else{var a2=i*2.4,rr=Math.max(W,H)*.75;x=cx+Math.cos(a2)*rr;y=cy+Math.sin(a2)*rr;o=0}
        }
        if(mode==='a')d.style.background='';
        d.style.transform='translate3d('+Math.round(x)+'px,'+Math.round(y)+'px,0)';d.style.opacity=o;d.style.transitionDelay=(i*12)+'ms';
      });
    }
    function set(m){mode=m;box.dataset.mode=m;$$('.sx-seg button',box).forEach(function(b){b.setAttribute('aria-pressed',b.dataset.mode===m)});$$('[data-for]',box).forEach(function(p){p.hidden=p.dataset.for!==m});layout()}
    $$('.sx-seg button',box).forEach(function(b){b.addEventListener('click',function(){auto=false;set(b.dataset.mode)})});
    var run=false,started=false;vis(box,function(on){run=on;if(on&&!started){started=true;setTimeout(function(){if(auto)set('b')},900)}});
    setTimeout(function(){layout()},50);window.addEventListener('resize',layout);
    if(!RM)tm=setInterval(function(){if(auto&&run&&started)set(mode==='a'?'b':'a')},4800);
    set('a');
  });
  /* tabs */
  $$('.sx-tabs').forEach(function(box){
    var btns=$$('.sx-tabs__btn',box),sc=$$('.sx-scene',box),cur=-1,tm,hold=0,run=false,T=6000;
    box.style.setProperty('--sx-t',T+'ms');
    function go(i){
      if(i===cur)return;cur=i;
      btns.forEach(function(b,k){b.setAttribute('aria-selected',k===i);b.style.animation='none';void b.offsetWidth;b.style.animation=''});
      sc.forEach(function(s,k){s.classList.remove('is-on');if(k===i){void s.offsetWidth;s.classList.add('is-on')}});
      var d=$('[data-donut]',sc[i]);if(d&&d._reset){d._reset();clearTimeout(d._t);d._t=setTimeout(d._on,1600)}
      var b=btns[i];if(b&&b.parentNode.scrollWidth>b.parentNode.clientWidth)b.parentNode.scrollTo({left:b.offsetLeft-16,behavior:'smooth'});
    }
    btns.forEach(function(b,i){b.addEventListener('click',function(){hold=Date.now()+25000;go(i)})});
    vis(box,function(on){run=on;if(on&&cur<0)go(0)});
    if(!RM)tm=setInterval(function(){if(run&&Date.now()>hold)go((cur+1)%btns.length)},T);
  });
  /* dona */
  $$('[data-donut]').forEach(function(w){
    var C=251.33,circles=$$('circle[data-s]',w),before=w.dataset.before.split(',').map(Number),after=w.dataset.after.split(',').map(Number),sw=$('.sx-switch',w),ems=$$('li em',w),state=false;
    function draw(v){var off=0,sum=v.reduce(function(a,b){return a+b},0);circles.forEach(function(c,i){var l=v[i]/sum*C;c.style.strokeDasharray=l+' '+(C-l);c.style.strokeDashoffset=-off;off+=l});ems.forEach(function(e,i){e.textContent=v[i]+'%'})}
    function reset(){state=false;sw.setAttribute('aria-pressed','false');draw(before)}
    w._reset=reset;w._on=function(){state=true;sw.setAttribute('aria-pressed','true');draw(after)};sw.addEventListener('click',function(){state=!state;sw.setAttribute('aria-pressed',state);draw(state?after:before)});reset();
  });
  /* pasos */
  $$('.sx-steps').forEach(function(box){
    var btns=$$('.sx-st',box),data=$$('.sx-stdata li',box),cur=-1,hold=0,run=false,fill=$('.fill',box),nav=$('.sx-steps__nav',box);
    nav.style.setProperty('--n',btns.length);
    function go(i){
      cur=i;btns.forEach(function(b,k){b.setAttribute('aria-selected',k===i)});
      var d=data[i];$('.sx-stp__n',box).textContent=('0'+(i+1)).slice(-2);$('.sx-stp h3',box).textContent=d.dataset.t;$('.sx-stp p',box).textContent=d.dataset.p;
      var ch=$('.sx-stp__chips',box);ch.innerHTML='';d.dataset.c.split('|').forEach(function(c){var s=document.createElement('span');s.className='sx-tag';s.textContent=c;ch.appendChild(s)});
      if(fill)fill.style.width=(i/(btns.length-1)*90)+'%';
    }
    btns.forEach(function(b,i){b.addEventListener('click',function(){hold=Date.now()+20000;go(i)})});
    vis(box,function(on){run=on});go(0);
    if(!RM)setInterval(function(){if(run&&Date.now()>hold)go((cur+1)%btns.length)},3800);
  });
  /* galería que se expande */
  $$('.sx-fan').forEach(function(box){
    var f=$$('figure',box),cur=0,hold=0,run=false;
    f.forEach(function(el,i){el.dataset.n=i+1;el.addEventListener('mouseenter',function(){if(matchMedia('(hover:hover)').matches){hold=Date.now()+10000;go(i)}});el.addEventListener('click',function(){hold=Date.now()+10000;go(i)})});
    function go(i){cur=i;f.forEach(function(el,k){el.classList.toggle('is-on',k===i)})}
    go(0);vis(box,function(on){run=on});
    if(!RM)setInterval(function(){if(run&&Date.now()>hold)go((cur+1)%f.length)},3200);
  });
  /* lente */
  $$('.sx-gear').forEach(function(box){
    var lbl=$('.sx-gear__lbl',box);
    $$('.sx-seg button',box).forEach(function(b){b.addEventListener('click',function(){box.dataset.lens=b.dataset.lens;lbl.textContent=b.dataset.lbl;$$('.sx-seg button',box).forEach(function(x){x.setAttribute('aria-pressed',x===b)})})});
  });
})();
