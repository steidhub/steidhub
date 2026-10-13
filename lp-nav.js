(function(){
  var nav=document.querySelector('.lp-nav');if(!nav)return;
  var hero=document.querySelector('.lp-hero')||document.querySelector('.post-hero')||document.querySelector('main>section');if(!hero)return;
  function f(){nav.classList.toggle('is-gone',window.scrollY>hero.offsetHeight-60)}
  window.addEventListener('scroll',f,{passive:true});f();
})();
