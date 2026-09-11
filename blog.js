/* Steid Hub — blog: progreso de lectura, índice activo y copiar enlace */
(() => {
  'use strict';
  const body = document.querySelector('.post__body');

  /* ---------- Barra de progreso ---------- */
  const bar = document.querySelector('.post-progress');
  if (bar && body) {
    let ultimo = 0;
    const pintar = () => {
      const r = body.getBoundingClientRect();
      const total = r.height - innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, -r.top / (total > 0 ? total : 1)));
      bar.style.setProperty('--p', p.toFixed(3));
    };
    addEventListener('scroll', () => {
      const ahora = Date.now();
      if (ahora - ultimo < 40) return;
      ultimo = ahora; pintar();
    }, { passive: true });
    addEventListener('resize', pintar);
    pintar();
  } else if (bar) bar.remove();

  /* ---------- Índice: en móvil empieza cerrado; resalta la sección actual ---------- */
  const toc = document.querySelector('.post-toc details');
  if (toc && matchMedia('(max-width:1099px)').matches) toc.open = false;
  const links = [...document.querySelectorAll('.post-toc a')];
  if (links.length && 'IntersectionObserver' in window) {
    const porId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.remove('is-active'));
      const a = porId.get(e.target.id);
      if (a) a.classList.add('is-active');
    }), { rootMargin: '-15% 0px -75% 0px' });
    porId.forEach((_, id) => { const h = document.getElementById(id); if (h) io.observe(h); });
  }
  links.forEach((a) => a.addEventListener('click', () => {
    if (toc && matchMedia('(max-width:1099px)').matches) toc.open = false;
  }));

  /* ---------- Copiar enlace ---------- */
  document.querySelectorAll('[data-copy]').forEach((btn) => btn.addEventListener('click', async () => {
    const txt = btn.textContent;
    try { await navigator.clipboard.writeText(btn.dataset.copy); btn.textContent = 'Enlace copiado'; }
    catch { btn.textContent = btn.dataset.copy; }
    setTimeout(() => { btn.textContent = txt; }, 2200);
  }));
})();
