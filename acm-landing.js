/* Landing ACM: interacción, animaciones y eventos GTM. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = n => Math.round(n).toLocaleString('es-PE');
  const mon = n => 'S/ ' + fmt(n);
  let PRICE = { precio: 50, oferta: 25 };

  /* Precio desde la configuración del sistema */
  const setPrices = () => {
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('acm-p0', mon(PRICE.precio)); set('acm-p1', mon(PRICE.oferta));
    ['acm-p2', 'acm-p3', 'acm-p4'].forEach(i => set(i, mon(PRICE.oferta)));
    const s = document.getElementById('acm-p0'); if (s) s.style.display = PRICE.precio <= PRICE.oferta ? 'none' : '';
    calcLoss();
  };
  fetch('/api/public/acm-config').then(r => r.json()).then(c => {
    if (c && c.oferta) { PRICE = { precio: +c.precio, oferta: +c.oferta }; setPrices(); }
  }).catch(() => {});

  /* Palabra rotativa */
  const rot = $('#rot');
  if (rot && !reduce) {
    const w = $$('b', rot); let i = 0;
    setInterval(() => { w[i].classList.remove('on'); i = (i + 1) % w.length; w[i].classList.add('on'); }, 2200);
  }

  /* Barras de ejemplo (precio por m², datos de muestra) */
  const DATA = [5200, 5450, 5100, 5600, 5300, 5750, 5400, 5000];
  const AVG = 5350, MAX = 6000;
  const build = (el, labels) => {
    if (!el) return;
    el.innerHTML = DATA.map((v, k) => '<i style="--h:' + Math.round(v / MAX * 100) + '%;transition-delay:' + (k * 70) + 'ms">' + (labels ? '<em>' + (v / 1000).toFixed(1) + 'k</em>' : '') + '</i>').join('') +
      '<u style="bottom:' + Math.round(AVG / MAX * 100) + '%"></u>';
  };
  build($('#heroBars'), false); build($('#demoBars'), true);

  /* Pines del mapa de ejemplo */
  const pins = $('#pins');
  if (pins) {
    const P = [[70, 50], [118, 70], [212, 48], [250, 96], [200, 140], [120, 138], [60, 112], [186, 84]];
    pins.innerHTML = P.map((p, k) => '<g class="pin" style="animation-delay:' + (k * 120) + 'ms"><path d="M' + p[0] + ' ' + (p[1] + 12) + ' l-7 -13 a8 8 0 1 1 14 0 z" fill="#2A1409"/><circle cx="' + p[0] + '" cy="' + (p[1] - 3) + '" r="3" fill="#fff"/></g>').join('');
  }

  /* Contadores */
  const countUp = el => {
    const to = +el.dataset.count; if (reduce) { el.textContent = fmt(to); return; }
    const t0 = performance.now(), d = 1400;
    const step = t => { const k = Math.min(1, (t - t0) / d); el.textContent = fmt(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };

  /* Revelado al hacer scroll + disparo de animaciones */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
  }), { threshold: .15 });
  $$('.rv').forEach(e => io.observe(e));

  const mock = $('.mock');
  const start = () => {
    if (mock) mock.classList.add('go');
    const hb = $('#heroBars'); if (hb) hb.classList.add('go');
    $$('[data-count]').forEach(countUp);
  };
  requestAnimationFrame(() => setTimeout(start, 250));
  const db = $('#demoBars');
  if (db) new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { db.classList.add('go'); o.disconnect(); } }), { threshold: .3 }).observe(db);

  /* Pestañas del informe de ejemplo */
  $$('.tabs button').forEach(b => b.addEventListener('click', () => {
    $$('.tabs button').forEach(x => x.classList.toggle('on', x === b));
    $$('.pane').forEach(p => p.classList.toggle('on', p.id === b.dataset.tab));
    if (b.dataset.tab === 't1' && db) { db.classList.remove('go'); void db.offsetWidth; db.classList.add('go'); }
    track('tab_' + b.dataset.tab);
  }));

  /* Calculadora de ejemplo */
  const m2 = $('#m2'), m2r = $('#m2r');
  const calc = v => {
    v = Math.max(0, +v || 0); const ref = v * AVG;
    $('#vRef').textContent = mon(ref);
    $('#vRng').textContent = mon(ref * .9) + ' – ' + fmt(ref * 1.1);
  };
  if (m2 && m2r) {
    m2.addEventListener('input', () => { m2r.value = Math.min(400, Math.max(20, m2.value || 20)); calc(m2.value); });
    m2r.addEventListener('input', () => { m2.value = m2r.value; calc(m2r.value); });
    calc(m2.value);
  }

  /* Calculadora del costo del error */
  const lv = $('#lv'), ls = $('#ls'), lp = $('#lp'), lr = $('#lr');
  function calcLoss() {
    if (!lv || !ls || !lr) return;
    const v = Math.max(0, +lv.value || 0), p = +ls.value;
    lp.textContent = (p > 0 ? '+' : p < 0 ? '−' : '') + Math.abs(p) + ' %';
    if (p < 0) {
      const loss = v * (-p / 100);
      lr.className = 'loss__r warn';
      lr.innerHTML = '<strong>Regalarías ' + mon(loss) + '</strong>Es lo que dejarías sobre la mesa. Tu ACM cuesta ' + mon(PRICE.oferta) + ': ' + (PRICE.oferta ? fmt(loss / PRICE.oferta) : '—') + ' veces menos que ese error.';
    } else if (p > 0) {
      lr.className = 'loss__r';
      lr.innerHTML = '<strong>Quedas fuera de mercado</strong>Con ' + p + ' % sobre el precio real, tu aviso compite con precios más altos que los comparables de tu zona: menos consultas y más tiempo publicado.';
    } else {
      lr.className = 'loss__r';
      lr.innerHTML = '<strong>Precio alineado</strong>Publicar en línea con el mercado es lo que te da un ACM: precio real por m² y rango de venta sugerido.';
    }
  }
  if (lv && ls) { lv.addEventListener('input', calcLoss); ls.addEventListener('input', calcLoss); calcLoss(); }

  /* Barra fija en móvil */
  const sticky = $('#sticky'), fin = $('.final'), hero = $('.hero');
  const onScroll = () => {
    if (!sticky) return;
    const y = scrollY, h = hero ? hero.offsetHeight * .8 : 500;
    const finTop = fin ? fin.getBoundingClientRect().top : 1e9;
    sticky.classList.toggle('show', y > h && finTop > innerHeight * .75);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Eventos GTM */
  function track(name, extra) { window.dataLayer = window.dataLayer || []; window.dataLayer.push(Object.assign({ event: name.startsWith('tab_') ? 'acm_demo_tab' : name }, extra || {}, name.startsWith('tab_') ? { acm_tab: name } : {})); }
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-acm-cta]'); if (!a) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'acm_cta_click', acm_cta: a.getAttribute('data-acm-cta'), acm_href: a.getAttribute('href') });
  });
})();
