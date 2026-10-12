/* #integral · línea de tiempo animada (solo home). Sin dependencias. */
(() => {
  'use strict';
  const sec = document.getElementById('integral');
  if (!sec) return;
  const steps = Array.from(sec.querySelectorAll('.flow__step'));
  if (!steps.length) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce) {
    steps.forEach((s) => { s.classList.add('is-active'); s.style.setProperty('--sp', 1); });
    return;
  }

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  let raf = 0;
  const wide = window.matchMedia('(min-width: 900px)');

  const update = () => {
    raf = 0;
    const vh = window.innerHeight;
    const mid = vh * 0.55;                       // altura de la pantalla donde "avanza" la línea
    const centers = steps.map((s) => { const r = s.getBoundingClientRect(); return r.top + r.height / 2; });
    steps.forEach((s, i) => {
      // progreso del conector entre esta etapa y la siguiente
      if (i < steps.length - 1) {
        const a = centers[i], b = centers[i + 1];
        s.style.setProperty('--sp', clamp((mid - a) / (b - a), 0, 1).toFixed(4));
        // en escritorio el nodo está al centro de cada etapa: el conector mide justo hasta el siguiente
        if (wide.matches) s.style.setProperty('--len', (b - a).toFixed(1) + 'px'); else s.style.removeProperty('--len');
      }
      // nodo activo cuando la línea ya llegó a su centro
      s.classList.toggle('is-active', centers[i] < mid);
      // paralaje suave de la imagen (±14 px)
      const d = clamp((centers[i] - vh / 2) / vh, -1, 1);
      s.style.setProperty('--py', (d * -14).toFixed(1) + 'px');
    });
  };

  const queue = () => { if (!raf) raf = requestAnimationFrame(update); };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  window.addEventListener('load', queue);
  update();
})();
