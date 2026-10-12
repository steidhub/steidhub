/* #marketing · embudo interactivo. Sin dependencias. */
(() => {
  'use strict';
  const root = document.querySelector('[data-funnel]');
  if (!root) return;
  const tabs = Array.from(root.querySelectorAll('.fun__tab'));
  const panels = Array.from(root.querySelectorAll('.fun__panel'));
  const polys = Array.from(root.querySelectorAll('.fun__poly'));
  const bar = root.querySelector('.fun__bar');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DUR = 6000;
  let cur = 0, timer = 0, hold = false, visible = false, userUntil = 0;

  root.classList.add('is-js');

  const restartBar = () => {
    if (!bar || reduce) return;
    bar.classList.remove('run');
    void bar.offsetWidth;                 // reinicia la animación
    bar.style.setProperty('--dur', DUR + 'ms');
    bar.classList.add('run');
  };

  const show = (i, fromUser) => {
    cur = (i + tabs.length) % tabs.length;
    tabs.forEach((t, k) => {
      const on = k === cur;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p, k) => p.classList.toggle('is-on', k === cur));
    polys.forEach((p, k) => p.classList.toggle('is-on', k === cur));
    if (fromUser) userUntil = Date.now() + 12000;   // pausa el avance automático tras tocar
    restartBar();
  };

  tabs.forEach((t, k) => {
    t.addEventListener('click', () => show(k, true));
    t.addEventListener('keydown', (e) => {
      const map = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (e.key in map) { e.preventDefault(); show(cur + map[e.key], true); tabs[cur].focus(); }
      else if (e.key === 'Home') { e.preventDefault(); show(0, true); tabs[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); show(tabs.length - 1, true); tabs[tabs.length - 1].focus(); }
    });
  });
  // el dibujo también responde al toque directo sobre cada tramo
  polys.forEach((p) => p.addEventListener('click', () => show(+p.dataset.i, true)));

  root.addEventListener('mouseenter', () => { hold = true; });
  root.addEventListener('mouseleave', () => { hold = false; });
  root.addEventListener('focusin', () => { hold = true; });
  root.addEventListener('focusout', () => { hold = false; });

  // personas que caen por el embudo (solo decorativo)
  const dots = root.querySelector('.fun__dots');
  if (dots && !reduce) {
    const NS = 'http://www.w3.org/2000/svg';
    const N = 26;
    for (let n = 0; n < N; n++) {
      const f = (Math.random() * 1.7 - 0.85);               // posición relativa dentro del embudo
      const x0 = 300 + f * 300, x1 = 300 + f * 84;
      const r = n % 4;                                       // 0 sobrevive; 1-3 se caen en etapa 1/2/3
      const kind = r === 0 ? 'S' : r === 1 ? 'A' : r === 2 ? 'B' : 'C';
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('r', (3.8 + Math.random() * 1.6).toFixed(1));
      c.setAttribute('class', 'fun__dot');
      const dur = 6 + Math.random() * 3;
      c.style.cssText = `--x0:${x0.toFixed(1)}px;--x1:${x1.toFixed(1)}px;` +
        `animation-name:funFall${kind};animation-duration:${dur.toFixed(2)}s;` +
        `animation-delay:${(-Math.random() * dur).toFixed(2)}s`;
      dots.appendChild(c);
    }
  }

  timer = window.setInterval(() => {
    if (reduce || !visible || hold || document.hidden || Date.now() < userUntil) return;
    show(cur + 1, false);
  }, DUR);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((es) => es.forEach((e) => {
      visible = e.isIntersecting;
      if (visible) restartBar();
    }), { threshold: 0.35 }).observe(root);
  } else visible = true;

  show(0, false);
})();
