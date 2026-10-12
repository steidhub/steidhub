/* "Nuestro trabajo" · visor de cámara sobre el carrusel continuo (solo decorativo).
   Muestra REC, timecode, 4K/24 fps y el nº de imagen; atenúa las que no están en el centro. */
(() => {
  'use strict';
  const sc = document.querySelector('[data-showcase]');
  if (!sc) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const hud = document.createElement('div');
  hud.className = 'sc-hud';
  hud.setAttribute('aria-hidden', 'true');
  hud.innerHTML =
    '<i class="sc-hud__c sc-hud__c--tl"></i><i class="sc-hud__c sc-hud__c--tr"></i>' +
    '<i class="sc-hud__c sc-hud__c--bl"></i><i class="sc-hud__c sc-hud__c--br"></i>' +
    '<span class="sc-hud__rec"><b></b>REC <em class="sc-hud__tc">00:00:00:00</em></span>' +
    '<span class="sc-hud__fmt">4K · 24 FPS</span>' +
    '<span class="sc-hud__idx"><em class="sc-hud__i">01</em><u></u><span class="sc-hud__n">12</span></span>' +
    '<span class="sc-hud__focus"><i></i></span>' +
    '<span class="sc-hud__scan"></span>';
  sc.appendChild(hud);

  const tc = hud.querySelector('.sc-hud__tc');
  const idx = hud.querySelector('.sc-hud__i');
  const total = hud.querySelector('.sc-hud__n');
  const track = sc.querySelector('.showcase__track');
  const pad2 = (v) => String(v).padStart(2, '0');
  let visible = false, raf = 0, lastIdx = -1, n = 0, hudFor = -1;

  const tick = (t) => {
    raf = 0;
    if (!visible) return;
    const f = Math.floor(t / 41.67);                 // 24 fotogramas por segundo
    tc.textContent = `${pad2(Math.floor(f / 86400) % 100)}:${pad2(Math.floor(f / 1440) % 60)}:${pad2(Math.floor(f / 24) % 60)}:${pad2(f % 24)}`;

    const imgs = track ? track.children : [];
    if (imgs.length) {
      if (!n) { n = Math.round(imgs.length / 3) || imgs.length; total.textContent = pad2(n); }
      const mid = window.innerWidth / 2;
      let best = 0, bd = 1e9;
      for (let i = 0; i < imgs.length; i++) {
        const r = imgs[i].getBoundingClientRect();
        if (r.right < -200 || r.left > window.innerWidth + 200) continue;
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < bd) { bd = d; best = i; }
        if (!reduce) {
          const k = Math.min(1, d / (r.width * 0.9));
          const q = Math.round(k * 10) / 10;
          if (imgs[i]._q !== q) { imgs[i]._q = q; imgs[i].style.setProperty('--k', q); }
        }
      }
      // el visor se pega a la imagen más cercana al centro y la sigue mientras se desplaza
      const br = imgs[best].getBoundingClientRect(), sr = sc.getBoundingClientRect();
      if (best !== hudFor) {
        hudFor = best;
        hud.style.width = br.width + 'px'; hud.style.height = br.height + 'px';
        hud.classList.remove('is-snap'); void hud.offsetWidth; hud.classList.add('is-snap');
      }
      hud.style.transform = `translate3d(${(br.left - sr.left).toFixed(1)}px,${(br.top - sr.top).toFixed(1)}px,0)`;
      hud.classList.add('is-on');
      const cur = best % n;
      if (cur !== lastIdx) { lastIdx = cur; idx.textContent = pad2(cur + 1); hud.classList.remove('is-flash'); void hud.offsetWidth; hud.classList.add('is-flash'); }
    }
    raf = requestAnimationFrame(tick);
  };

  const start = () => { if (!raf) raf = requestAnimationFrame(tick); };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((es) => es.forEach((e) => { visible = e.isIntersecting; if (visible) start(); }), { threshold: 0.05 }).observe(sc);
  } else { visible = true; start(); }
})();
