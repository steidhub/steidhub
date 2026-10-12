/* Steid Hub · comportamiento común de las landings (venta de landings + diagnóstico) */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lp = document.body.dataset.lp || 'landing';
  const gtm = (event, extra) => { (window.dataLayer = window.dataLayer || []).push(Object.assign({ event, lp }, extra || {})); };

  /* Aparición al hacer scroll */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 }) : null;
  $$('.l-rv').forEach((el, i) => { el.style.transitionDelay = ((i % 4) * 70) + 'ms'; io ? io.observe(el) : el.classList.add('in'); });

  /* Contadores */
  const fmt = n => Math.round(n).toLocaleString('en-US');
  const cio = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = +el.dataset.count, pre = el.dataset.pre || '', t0 = performance.now();
    if (reduce) { el.textContent = pre + fmt(to); return; }
    const step = t => { const k = Math.min(1, (t - t0) / 1300); el.textContent = pre + fmt(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .5 }) : null;
  $$('[data-count]').forEach(el => cio ? cio.observe(el) : (el.textContent = (el.dataset.pre || '') + fmt(+el.dataset.count)));

  /* Progreso, barra fija y botón flotante */
  const hero = $('.l-hero'), sticky = $('#sticky'), fab = $('#fab'), prog = $('#prog'), fin = $('.l-final');
  const onScroll = () => {
    const y = scrollY;
    if (prog) { const h = document.documentElement.scrollHeight - innerHeight; prog.style.width = (h > 0 ? y / h * 100 : 0) + '%'; }
    if (sticky && hero) {
      const nearEnd = fin && fin.getBoundingClientRect().top < innerHeight * .75;
      const on = y > hero.offsetHeight * .75 && !nearEnd;
      sticky.classList.toggle('show', on);
      if (fab) fab.classList.toggle('low', !on);
    }
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Pestañas */
  $$('[data-tabs]').forEach(box => {
    const btns = $$('[data-tab]', box), panes = $$('.l-pane', box.parentElement);
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
      panes.forEach(p => p.classList.toggle('on', p.id === b.dataset.tab));
      gtm('lp_tab', { tab: b.dataset.tab });
    }));
  });

  /* Teléfono con secciones en bucle (como el bosquejo del ACM) */
  $$('[data-cycle]').forEach(box => {
    const panes = $$('.ph__pane', box), legs = $$('.l-leg li', box), n = panes.length;
    let cur = 1, hold = false, rel;
    const show = k => { cur = k; panes.forEach(p => p.classList.toggle('on', +p.dataset.k === k)); legs.forEach(l => l.classList.toggle('on', +l.dataset.k === k)); };
    show(1);
    if (!reduce) setInterval(() => { if (!hold) show(cur % n + 1); }, 2800);
    box.addEventListener('mouseenter', () => { clearTimeout(rel); hold = true; });
    box.addEventListener('mouseleave', () => { rel = setTimeout(() => { hold = false; }, 1800); });
    legs.forEach(l => {
      const go = () => { show(+l.dataset.k); hold = true; clearTimeout(rel); rel = setTimeout(() => { hold = false; }, 5000); };
      l.addEventListener('mouseenter', () => { if (matchMedia('(hover:hover)').matches) show(+l.dataset.k); });
      l.addEventListener('click', go);
    });
  });

  /* Chat de WhatsApp animado */
  $$('[data-chat]').forEach(box => {
    const msgs = $$('.msg', box), typing = $('.typing', box);
    if (reduce || !('IntersectionObserver' in window)) { msgs.forEach(m => m.classList.add('show')); return; }
    let running = false;
    const wait = ms => new Promise(r => setTimeout(r, ms));
    async function play() {
      running = true;
      while (true) {
        msgs.forEach(m => m.classList.remove('show'));
        await wait(600);
        for (const m of msgs) {
          if (m.classList.contains('sh')) { typing.classList.add('show'); await wait(900); typing.classList.remove('show'); } else { await wait(650); }
          m.classList.add('show'); await wait(1200);
        }
        await wait(3800);
      }
    }
    new IntersectionObserver((es, o) => { if (es[0].isIntersecting && !running) { play(); o.disconnect(); } }, { threshold: .3 }).observe(box);
  });

  /* Ampliar capturas */
  const lb = $('#lb');
  if (lb) {
    const img = $('img', lb); let from = null;
    $$('.l-zoom').forEach(b => b.addEventListener('click', () => { from = b; img.src = b.dataset.src; img.alt = b.dataset.alt || 'Captura ampliada'; lb.hidden = false; document.body.style.overflow = 'hidden'; $('.l-lb__x', lb).focus(); gtm('lp_zoom', { shot: b.dataset.shot || '' }); }));
    const close = () => { lb.hidden = true; img.removeAttribute('src'); document.body.style.overflow = ''; from && from.focus(); };
    lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('.l-lb__x')) close(); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) close(); });
  }

  /* Seguimiento (sin datos personales) */
  document.addEventListener('click', e => { const a = e.target.closest('[data-cta]'); if (a) gtm('lp_cta_click', { cta: a.dataset.cta }); });
  $$('.l-faq details').forEach(d => d.addEventListener('toggle', () => { if (d.open) gtm('lp_faq_open', { q: (d.querySelector('summary') || {}).textContent || '' }); }));
})();
