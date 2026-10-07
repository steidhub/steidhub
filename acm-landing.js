/* Landing ACM v11 */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = n => Math.round(n).toLocaleString('en-US');
  const mon = n => 'S/ ' + fmt(n);
  const AVG = 5342.08;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let PRICE = { precio: 50, oferta: 25 };
  const gtm = (ev, o) => (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: ev }, o || {}));

  function setPrices() {
    const was = mon(PRICE.precio), now = mon(PRICE.oferta), off = PRICE.precio > 0 ? Math.round((1 - PRICE.oferta / PRICE.precio) * 100) : 0;
    $$('.acm-was,#acm-p0').forEach(e => e.textContent = was);
    $$('.acm-now,#acm-p1,#acm-p2').forEach(e => e.textContent = now);
    const o = $('#acm-off'); if (o) o.textContent = '−' + off + ' %';
    $$('.acm-offt').forEach(e => e.textContent = 'Ahorras ' + mon(PRICE.precio - PRICE.oferta));
    calcLoss();
  }
  fetch('/api/public/acm-config').then(r => r.json()).then(c => {
    if (c && +c.oferta) { PRICE = { precio: +c.precio || 50, oferta: +c.oferta }; setPrices(); }
  }).catch(() => {});

  /* Aparición escalonada */
  $$('.a-grid,.a-steps,.a-faq,.a-stats').forEach(p => [...p.children].forEach((c, i) => { c.style.transitionDelay = (i * 90) + 'ms'; }));
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 }) : null;
  $$('.rv').forEach(e => io ? io.observe(e) : e.classList.add('in'));

  /* Contadores */
  const cio = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = +el.dataset.count, pre = el.dataset.pre || '', t0 = performance.now();
    const step = t => { const k = Math.min(1, (t - t0) / 1200); el.textContent = pre + Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .5 }) : null;
  $$('[data-count]').forEach(e => cio ? cio.observe(e) : (e.textContent = (e.dataset.pre || '') + e.dataset.count));

  /* Bosquejo: resalta cada sección en bucle */
  const blks = $$('.a-blk'), legs = $$('.a-leg li');
  let cur = 0, timer = null, hold = false;
  const show = k => { blks.forEach(b => b.classList.toggle('on', b.dataset.k == k)); legs.forEach(l => l.classList.toggle('on', l.dataset.k == k)); };
  const tick = () => { if (hold) return; cur = cur % 6 + 1; show(cur); };
  if (blks.length) {
    show(1); cur = 1;
    if (!reduce) timer = setInterval(tick, 2200);
    const box = document.querySelector('.a-sk'); let rel = null;
    box.addEventListener('mouseenter', () => { clearTimeout(rel); hold = true; });
    box.addEventListener('mouseleave', () => { rel = setTimeout(() => { hold = false; }, 1800); });
    [...blks, ...legs].forEach(el => {
      el.addEventListener('mouseenter', () => { if (cur != +el.dataset.k) { cur = +el.dataset.k; show(cur); } });
      el.addEventListener('click', () => { cur = +el.dataset.k; show(cur); });
    });
  }

  /* Pestañas */
  $$('.a-tabs button').forEach(b => b.addEventListener('click', () => {
    $$('.a-tabs button').forEach(x => x.classList.toggle('on', x === b));
    $$('.a-pane').forEach(p => p.classList.toggle('on', p.id === b.dataset.tab));
    gtm('acm_tab', { tab: b.dataset.tab });
  }));

  /* Calculadora */
  const m2 = $('#m2'), m2r = $('#m2r');
  function calc(v) {
    v = Math.max(0, +v || 0);
    $('#vRef').textContent = mon(AVG * v);
    $('#vRng').textContent = mon(AVG * v * .9) + ' – ' + fmt(AVG * v * 1.1);
  }
  if (m2 && m2r) {
    m2.addEventListener('input', () => { m2r.value = Math.min(400, Math.max(20, +m2.value || 20)); calc(m2.value); });
    m2r.addEventListener('input', () => { m2.value = m2r.value; calc(m2r.value); });
    calc(m2.value);
  }

  /* Error de precio */
  const lv = $('#lv'), ls = $('#ls'), lr = $('#lr'), lp = $('#lp');
  function calcLoss() {
    if (!lv || !ls || !lr) return;
    const v = +lv.value.replace(/[^\d]/g, ''), p = +ls.value;
    lp.textContent = (p > 0 ? '+' : p < 0 ? '−' : '') + Math.abs(p) + ' %';
    if (v > 0 && p < 0) {
      const loss = v * (-p / 100);
      lr.className = 'a-loss__r warn';
      lr.innerHTML = '<strong>Pierdes ' + mon(loss) + '</strong>Tu ACM cuesta ' + mon(PRICE.oferta) + ' (antes ' + mon(PRICE.precio) + ').';
    } else if (v > 0 && p > 0) {
      lr.className = 'a-loss__r';
      lr.innerHTML = '<strong>Riesgo de no vender</strong>Un precio ' + p + ' % sobre el mercado alarga la venta.';
    } else {
      lr.className = 'a-loss__r';
      lr.innerHTML = '<strong>Precio alineado</strong>Tu ACM lo confirma con datos.';
    }
  }
  if (lv && ls) {
    lv.addEventListener('input', () => {
      const d = lv.value.replace(/[^\d]/g, '').slice(0, 10);
      lv.value = d ? (+d).toLocaleString('en-US') : '';
      calcLoss();
    });
    ls.addEventListener('input', calcLoss);
    calcLoss();
  }

  /* Lightbox */
  const lb = $('#lb');
  if (lb) {
    const img = $('img', lb);
    $$('.a-zoom').forEach(b => b.addEventListener('click', () => { img.src = b.dataset.src; lb.hidden = false; lb.scrollTop = 0; lb.scrollLeft = 0; document.body.style.overflow = 'hidden'; }));
    const close = () => { lb.hidden = true; img.removeAttribute('src'); document.body.style.overflow = ''; };
    lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('.a-lb__x')) close(); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) close(); });
  }

  /* Barra fija, progreso y tilt */
  const st = $('#sticky'), hero = $('.a-hero'), prog = $('#prog');
  const onScroll = () => {
    if (st && hero) st.classList.toggle('show', scrollY > hero.offsetHeight * .8);
    if (prog) { const h = document.documentElement.scrollHeight - innerHeight; prog.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%'; }
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const mk = $('.a-mock');
  if (mk && !reduce && matchMedia('(hover:hover) and (min-width:900px)').matches) {
    const box = mk.parentElement;
    box.addEventListener('mousemove', e => { const r = box.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; mk.style.animation = 'none'; mk.style.transform = 'perspective(900px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 6) + 'deg)'; });
    box.addEventListener('mouseleave', () => { mk.style.transform = ''; mk.style.animation = ''; });
  }

  document.addEventListener('click', e => { const a = e.target.closest('[data-acm-cta]'); if (a) gtm('acm_cta_click', { cta: a.dataset.acmCta }); });
})();
