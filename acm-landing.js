/* Landing ACM v7 */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = n => Math.round(n).toLocaleString('en-US');
  const mon = n => 'S/ ' + fmt(n);
  const AVG = 5342.08;
  let PRICE = { precio: 50, oferta: 25 };
  function gtm(ev, o) { (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: ev }, o || {})); }

  function setPrices() {
    const was = mon(PRICE.precio), now = mon(PRICE.oferta), off = PRICE.precio > 0 ? Math.round((1 - PRICE.oferta / PRICE.precio) * 100) : 0;
    $$('.acm-was,#acm-p0').forEach(e => e.textContent = was);
    $$('.acm-now,#acm-p1,#acm-p2').forEach(e => e.textContent = now);
    const o = $('#acm-off'); if (o) o.textContent = '−' + off + ' %';
    $$('.acm-offt').forEach(e => e.textContent = 'Ahorras ' + mon(PRICE.precio - PRICE.oferta) + ' · −' + off + ' %');
    calcLoss();
  }
  fetch('/api/public/acm-config').then(r => r.json()).then(c => {
    if (c && +c.oferta) { PRICE = { precio: +c.precio || 50, oferta: +c.oferta }; setPrices(); }
  }).catch(() => {});

  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 }) : null;
  $$('.rv').forEach(e => io ? io.observe(e) : e.classList.add('in'));

  const cio = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = +el.dataset.count, pre = el.dataset.pre || '', t0 = performance.now();
    const step = t => { const k = Math.min(1, (t - t0) / 1200); el.textContent = pre + Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .5 }) : null;
  $$('[data-count]').forEach(e => cio ? cio.observe(e) : (e.textContent = (e.dataset.pre || '') + e.dataset.count));

  $$('.tabs button').forEach(b => b.addEventListener('click', () => {
    $$('.tabs button').forEach(x => x.classList.toggle('on', x === b));
    $$('.pane').forEach(p => p.classList.toggle('on', p.id === b.dataset.tab));
    gtm('acm_tab', { tab: b.dataset.tab });
  }));

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

  const lv = $('#lv'), ls = $('#ls'), lr = $('#lr'), lp = $('#lp');
  function calcLoss() {
    if (!lv || !ls || !lr) return;
    const v = +lv.value.replace(/[^\d]/g, ''), p = +ls.value;
    lp.textContent = (p > 0 ? '+' : p < 0 ? '−' : '') + Math.abs(p) + ' %';
    if (v > 0 && p < 0) {
      const loss = v * (-p / 100);
      lr.className = 'loss__r warn';
      lr.innerHTML = '<strong>Dejarías ' + mon(loss) + ' sobre la mesa</strong>Tu ACM cuesta ' + mon(PRICE.oferta) + ' (antes ' + mon(PRICE.precio) + '): ese error costaría ' + fmt(loss / PRICE.oferta) + ' veces más.';
    } else if (v > 0 && p > 0) {
      lr.className = 'loss__r';
      lr.innerHTML = '<strong>Riesgo de no vender</strong>Con un precio ' + p + ' % sobre el mercado, tu propiedad puede pasar meses publicada. Con tu ACM publicas con criterio.';
    } else {
      lr.className = 'loss__r';
      lr.innerHTML = '<strong>Precio alineado</strong>Con tu ACM confirmas que estás en el rango correcto.';
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

  const lb = $('#lb');
  if (lb) {
    const img = $('img', lb);
    $$('.zoom').forEach(b => b.addEventListener('click', () => { img.src = b.dataset.src; lb.hidden = false; document.body.style.overflow = 'hidden'; }));
    const close = () => { lb.hidden = true; img.removeAttribute('src'); document.body.style.overflow = ''; };
    lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('.lb__x')) close(); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) close(); });
  }

  const st = $('#sticky'), hero = $('.hero');
  if (st && hero) {
    const upd = () => st.classList.toggle('show', scrollY > hero.offsetHeight * .8);
    addEventListener('scroll', upd, { passive: true }); upd();
  }

  document.addEventListener('click', e => {
    const a = e.target.closest('[data-acm-cta]'); if (a) gtm('acm_cta_click', { cta: a.dataset.acmCta });
  });
})();
