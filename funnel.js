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

  // ---- más interacción: pasar el cursor, botón "siguiente" y simulación de un cliente ----
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let ht = 0;
  if (fine) {
    tabs.concat(polys).forEach((el) => {
      const k = +el.dataset.i;
      el.addEventListener('pointerenter', () => { clearTimeout(ht); ht = setTimeout(() => { if (!running) show(k, true); }, 90); });
      el.addEventListener('pointerleave', () => clearTimeout(ht));
    });
  }
  panels.forEach((p, k) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'fun__next';
    b.textContent = k === panels.length - 1 ? 'Volver a empezar \u21BA' : 'Siguiente etapa \u2192';
    b.addEventListener('click', () => show(k + 1, true));
    p.appendChild(b);
  });

  const svg = root.querySelector('.fun__svg');
  const sim = root.querySelector('.fun__sim');
  const simTxt = sim ? sim.querySelector('span') : null;
  const NS = 'http://www.w3.org/2000/svg';
  const ys = [54, 170, 286, 402];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  let running = false;

  const burst = (x, y) => {
    for (let n = 0; n < 16; n++) {
      const d = document.createElementNS(NS, 'circle');
      d.setAttribute('r', (3 + Math.random() * 3).toFixed(1));
      d.setAttribute('cx', x); d.setAttribute('cy', y);
      d.setAttribute('fill', n % 2 ? '#B85A2B' : '#161411');
      svg.appendChild(d);
      const a = (n / 16) * Math.PI * 2, r = 70 + Math.random() * 60;
      d.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(a) * r}px,${Math.sin(a) * r}px) scale(.3)`, opacity: 0 }],
        { duration: 1000 + Math.random() * 400, easing: 'cubic-bezier(.2,.8,.3,1)' }).finished.then(() => d.remove(), () => d.remove());
    }
  };

  const run = async () => {
    if (running) return;
    running = true;
    sim.disabled = true;
    root.classList.remove('is-won');
    root.classList.add('is-sim');
    hold = true;
    const me = document.createElementNS(NS, 'circle');
    me.setAttribute('r', 11);
    me.setAttribute('class', 'fun__me');
    me.style.transform = 'translate(300px,-24px)';
    svg.appendChild(me);
    let px = 300, py = -24;
    const go = (x, y, ms) => {
      const a = me.animate([{ transform: `translate(${px}px,${py}px)` }, { transform: `translate(${x}px,${y}px)` }],
        { duration: reduce ? 1 : ms, easing: 'ease-in-out', fill: 'forwards' });
      px = x; py = y;
      return a.finished.catch(() => {});
    };
    for (let i = 0; i < 4; i++) {
      await go(300 + (Math.random() * 40 - 20), ys[i], 800);
      show(i, true);
      me.classList.add('pulse');
      await wait(reduce ? 400 : 1600);
      me.classList.remove('pulse');
    }
    await go(300, 483, 600);
    await go(300, 538, 500);
    root.classList.add('is-won');
    if (!reduce) burst(300, 538);
    if (simTxt) simTxt.textContent = '¡Venta cerrada! Repetir';
    await wait(reduce ? 0 : 500);
    me.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' }).finished.then(() => me.remove(), () => me.remove());
    userUntil = Date.now() + 8000;
    hold = false;
    running = false;
    sim.disabled = false;
    root.classList.remove('is-sim');
  };
  if (sim) sim.addEventListener('click', run);

  show(0, false);
})();
