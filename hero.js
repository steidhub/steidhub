/* Hero v2 · la tablet se inclina suavemente con el puntero y los avisos flotan en paralaje. */
(() => {
  'use strict';
  const hero = document.getElementById('hero');
  const dev = document.getElementById('heroDevice');
  if (!hero || !dev) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduce || !fine) return;
  const stage = dev.parentElement;
  let raf = 0, tx = 0, ty = 0;
  const apply = () => {
    raf = 0;
    dev.style.setProperty('--ry', (-7 + tx * 9).toFixed(2) + 'deg');
    dev.style.setProperty('--rx', (3 - ty * 7).toFixed(2) + 'deg');
    stage.style.setProperty('--mx', (tx * 14).toFixed(1) + 'px');
    stage.style.setProperty('--my', (ty * 10).toFixed(1) + 'px');
  };
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    if (!raf) raf = requestAnimationFrame(apply);
  });
  hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(apply); });
})();
