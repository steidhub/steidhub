/* BAT — navigation, reveal animations, artwork swap-in */
(function () {
  'use strict';
  var d = document, w = window;
  var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* year */
  [].forEach.call(d.querySelectorAll('[data-year]'), function (n) { n.textContent = new Date().getFullYear(); });

  /* logo images that may not be on disk yet (e.g. Nuclear Blast): fall back to a text label */
  [].forEach.call(d.querySelectorAll('img[data-fallback]'), function (img) {
    function swap() {
      var s = d.createElement('span'); s.className = 'label__fb'; s.textContent = img.getAttribute('data-fallback');
      if (img.parentNode) img.parentNode.replaceChild(s, img);
    }
    if (img.complete && img.naturalWidth === 0) swap(); else img.addEventListener('error', swap, { once: true });
  });

  /* artwork placeholders -> real images when configured */
  var covers = (w.BAT_CONFIG && w.BAT_CONFIG.covers) || {};
  [].forEach.call(d.querySelectorAll('[data-cover]'), function (box) {
    var src = covers[box.getAttribute('data-cover')];
    if (!src) return;
    var img = new Image();
    img.className = 'cover'; img.alt = ''; img.decoding = 'async';
    img.onload = function () {
      [].forEach.call(box.querySelectorAll('.mark,.ph'), function (n) { n.remove(); });
      box.appendChild(img);
    };
    img.src = src;
  });

  /* navigation */
  var nav = d.getElementById('nav');
  var burger = d.getElementById('burger');
  var isSub = d.body.classList.contains('page');
  function onScroll() {
    if (!nav || isSub) return;
    nav.classList.toggle('is-solid', w.scrollY > w.innerHeight * 0.55);
  }
  if (nav && !isSub) { onScroll(); w.addEventListener('scroll', onScroll, { passive: true }); }
  function closeMenu() { if (nav) { nav.removeAttribute('data-open'); } if (burger) { burger.setAttribute('aria-expanded', 'false'); } d.documentElement.style.overflow = ''; }
  if (burger) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') !== 'true';
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) { nav.setAttribute('data-open', 'true'); d.documentElement.style.overflow = 'hidden'; } else { closeMenu(); }
    });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    [].forEach.call(d.querySelectorAll('#menu a, #menu .nav__join'), function (a) { a.addEventListener('click', closeMenu); });
  }

  /* active link on the one-page layout */
  var links = [].slice.call(d.querySelectorAll('#menu a[href^="#"]'));
  if (links.length && 'IntersectionObserver' in w) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.removeAttribute('aria-current'); });
          var a = map[en.target.id]; if (a) a.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = d.getElementById(id); if (s) io.observe(s); });
  }

  /* reveal on view (also starts the animated bits automatically) */
  var seen = null;
  function reveal(el) {
    el.classList.add('in');
    if (el.hasAttribute('data-vinyl')) {
      var v = el.querySelector('.vinyl');
      if (v) { v.classList.add('in'); if (!reduce) setTimeout(function () { v.classList.add('spin'); }, 1700); }
    }
  }
  function observe(nodes) {
    [].forEach.call(nodes, function (n) {
      if (!seen) { reveal(n); return; }
      seen.observe(n);
    });
  }
  if ('IntersectionObserver' in w && !reduce) {
    seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { reveal(en.target); seen.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
  }
  w.BAT_observe = observe;
  observe(d.querySelectorAll('[data-reveal],.rule,.wing'));
})();
