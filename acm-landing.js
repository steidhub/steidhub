/* Landing ACM: precio desde la configuración y eventos de clic para GTM. */
(() => {
  'use strict';
  const mon = n => 'S/ ' + Number(n).toLocaleString('es-PE');
  fetch('/api/public/acm-config').then(r => r.json()).then(c => {
    if (!c || !c.oferta) return;
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('acm-p0', mon(c.precio)); set('acm-p1', mon(c.oferta)); set('acm-p2', mon(c.oferta));
    if (c.precio <= c.oferta) { const s = document.getElementById('acm-p0'); if (s) s.style.display = 'none'; }
  }).catch(() => {});
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-acm-cta]');
    if (!a) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'acm_cta_click', acm_cta: a.getAttribute('data-acm-cta'), acm_href: a.getAttribute('href') });
  });
})();
