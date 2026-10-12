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

  /* Chat flotante: conversación animada antes de ir a WhatsApp */
  if (fab) {
    const isDx = document.body.dataset.lp === 'diagnostico';
    const cfg = isDx
      ? { first: 'Hola, Steid Hub. Quiero mi diagnóstico de redes y web.', hi: '¡Hola! 👋 Somos Steid Hub. ¿Qué quieres que revisemos primero?', opts: ['Mi página web', 'Mis redes sociales', 'Ambas'], bye: 'Perfecto. Sigue en WhatsApp y te ayudamos con tu diagnóstico gratis.' }
      : { first: 'Hola, Steid Hub. Quiero una landing para mi inmobiliaria.', hi: '¡Hola! 👋 Somos Steid Hub. ¿Qué quieres promocionar con tu landing?', opts: ['Un edificio o proyecto', 'Propiedades de mi cartera', 'Aún no lo sé'], bye: 'Perfecto. Desde S/ 700 + IGV. Sigue en WhatsApp y te enviamos tu cotización.' };
    const base = new URL(fab.href); const baseTxt = base.searchParams.get('text') || cfg.first;
    const panel = document.createElement('div');
    panel.className = 'l-fc'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Chat con Steid Hub'); panel.id = 'fc';
    panel.innerHTML = '<div class="l-fc__bar"><span class="l-fc__av"><img src="/assets/logos/steidhub-mark-black.png" alt="" width="20" height="20"></span><div>Steid Hub<small>En línea · responde rápido</small></div><button type="button" aria-label="Cerrar chat">✕</button></div><div class="l-fc__body" aria-live="polite"></div>';
    document.body.appendChild(panel);
    const body = $('.l-fc__body', panel); let timers = [], started = false;
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    const add = (txt, who) => { const m = document.createElement('div'); m.className = 'msg ' + who; m.textContent = txt; body.appendChild(m); body.scrollTop = body.scrollHeight; return m; };
    const typingEl = () => { const t = document.createElement('div'); t.className = 'typing show'; t.innerHTML = '<i></i><i></i><i></i>'; body.appendChild(t); body.scrollTop = body.scrollHeight; return t; };
    const reply = (txt, ms, cb) => { const t = typingEl(); later(() => { t.remove(); add(txt, 'sh'); cb && cb(); }, ms); };
    const go = (choice) => {
      const u = new URL(base.origin + base.pathname); u.searchParams.set('text', baseTxt + (choice ? ' ' + choice + '.' : ''));
      const a = document.createElement('a'); a.className = 'l-fc__go'; a.href = u.href; a.target = '_blank'; a.rel = 'noopener'; a.dataset.cta = 'fab_chat_go';
      a.innerHTML = '<svg aria-hidden="true"><use href="#i-wa"/></svg>Continuar en WhatsApp'; body.appendChild(a); body.scrollTop = body.scrollHeight;
    };
    const start = () => {
      started = true; body.innerHTML = '';
      later(() => add(cfg.first, 'me'), 400);
      later(() => reply(cfg.hi, 1000, () => {
        const q = document.createElement('div'); q.className = 'l-fc__q';
        cfg.opts.forEach(o => { const b = document.createElement('button'); b.type = 'button'; b.textContent = o; b.addEventListener('click', () => { q.remove(); add(o, 'me'); gtm('lp_chat_choice', { choice: o }); reply(cfg.bye, 900, () => go(o)); }); q.appendChild(b); });
        body.appendChild(q); body.scrollTop = body.scrollHeight;
      }), 1300);
    };
    const place = () => { panel.style.bottom = (innerHeight - fab.getBoundingClientRect().top + 10) + 'px'; };
    const open = () => { place(); if (!started) start(); panel.classList.add('open'); fab.setAttribute('aria-expanded', 'true'); gtm('lp_chat_open', {}); $('button', panel).focus(); };
    const close = () => { panel.classList.remove('open'); fab.setAttribute('aria-expanded', 'false'); fab.focus(); };
    fab.setAttribute('aria-controls', 'fc'); fab.setAttribute('aria-expanded', 'false');
    fab.addEventListener('click', e => { e.preventDefault(); panel.classList.contains('open') ? close() : open(); });
    $('.l-fc__bar button', panel).addEventListener('click', close);
    addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) close(); });
    addEventListener('resize', () => panel.classList.contains('open') && place());
  }

  /* Pop de descuento: aparece al acercarse al final de la página (una vez por sesión) */
  const pop = $('#pop');
  if (pop && fin) {
    let shown = false, last = null;
    try { shown = sessionStorage.getItem('pop15') === '1'; } catch (e) {}
    const show = () => { if (shown) return; shown = true; try { sessionStorage.setItem('pop15', '1'); } catch (e) {} last = document.activeElement; pop.hidden = false; requestAnimationFrame(() => pop.classList.add('open')); gtm('lp_popup_open', { popup: 'descuento_15' }); $('.l-pop__x', pop).focus(); };
    const hide = () => { pop.classList.remove('open'); setTimeout(() => { pop.hidden = true; }, 300); last && last.focus && last.focus(); };
    const chk = () => { if (!shown && fin.getBoundingClientRect().top < innerHeight * 1.1 && scrollY > 600) { removeEventListener('scroll', chk); setTimeout(show, 500); } };
    addEventListener('scroll', chk, { passive: true });
    pop.addEventListener('click', e => { if (e.target === pop || e.target.closest('.l-pop__x')) hide(); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && !pop.hidden) hide(); });
  }

  /* Seguimiento (sin datos personales) */
  /* Conversión: clic a WhatsApp → evento `whatsapp_click` (GTM: GA4 "contact" + Meta "Contact") */
  const waEvent = (src) => { const id = 'wa_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); (window.dataLayer = window.dataLayer || []).push({ event: 'whatsapp_click', event_id: id, contact_method: 'whatsapp', cta_source: src || '', lp, page_path: location.pathname, content_name: document.title }); };
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]'); if (!a) return;
    const isWa = /^https:\/\/wa\.me\//.test(a.href);
    if (isWa && a.id !== 'fab') waEvent(a.dataset.cta || 'whatsapp');
    else if (a.dataset.cta && !isWa) gtm('lp_cta_click', { cta: a.dataset.cta, page_path: location.pathname });
  });
  /* Vista de contenido (Meta ViewContent) una vez por carga */
  (window.dataLayer = window.dataLayer || []).push({ event: 'view_item', lp, page_path: location.pathname, content_name: document.title, content_type: 'landing' });
  $$('.l-faq details').forEach(d => d.addEventListener('toggle', () => { if (d.open) gtm('lp_faq_open', { q: (d.querySelector('summary') || {}).textContent || '' }); }));
})();
