/* Steid Hub — landing Google Ads (reveal, cifras, colaboradores y formulario) */
(() => {
  'use strict';
  window.__adsReady = true; // desarma el watchdog del <head>
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Reveal al hacer scroll ---------- */
  const items = [...document.querySelectorAll('.reveal')];
  const showAll = () => items.forEach((el) => el.classList.add('is-in'));

  if (reduce.matches || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach((el) => io.observe(el));

    /* Red de seguridad: lo que ya está en pantalla debe verse aunque el
       observer no dispare (pasa en algunos webviews y navegadores embebidos).
       Si a los 2 s no se reveló nada, damos el observer por muerto y
       mostramos la página completa. */
    const showIfOnScreen = () => items.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in');
    });
    addEventListener('load', showIfOnScreen);
    setTimeout(() => {
      if (!items.some((el) => el.classList.contains('is-in'))) showAll();
      else showIfOnScreen();
    }, 2000);
  }

  /* ---------- Contador de cifras ---------- */
  const nums = document.querySelectorAll('[data-count]');
  const fmt = (n) => n.toLocaleString('es-PE');
  const runCount = (el) => {
    const target = Number(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    if (reduce.matches) { el.textContent = prefix + fmt(target); return; }
    el.textContent = prefix + '0';
    const DUR = 1400;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / DUR, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + fmt(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + fmt(target);
    };
    requestAnimationFrame(tick);
  };
  if (!('IntersectionObserver' in window)) {
    nums.forEach(runCount);
  } else {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { runCount(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    nums.forEach((el) => cio.observe(el));
  }

  /* ---------- Marquee de colaboradores ---------- */
  const PARTNERS = [
    ['century-21', 'Century 21'], ['remax', 'RE/MAX'], ['domicis', 'Domicis'],
    ['grupo-santa-maria', 'Grupo Santa María'], ['pietro-estate', 'Pietro Estate'],
    ['ponte-di-pietro', 'Ponte di Pietro'], ['riga-house', 'Riga House'],
    ['kassa-nuevo', 'Kassa.PE'], ['meztai', 'Meztai'], ['hzn-inmobiliaria', 'HZN Inmobiliaria'],
    ['sc-inmobiliaria', 'SC Inmobiliaria'], ['canoli-bienes-raices', 'Canoli Bienes Raíces'],
    ['clausen-house', 'Clausen House'], ['dream-house-pro', 'Dream House Pro'],
    ['bay-drive-sac', 'Bay Drive'], ['its-time-peru', "It's Time Perú"],
    ['karina-matheus', 'Karina Matheus'], ['paola-benites', 'Paola Benites'],
    ['arvia-', 'Arvia'], ['hb-logo', 'HB'], ['mye', 'M&E'], ['marca', 'Marca']
  ];
  const track = document.getElementById('marqueeTrack');
  if (track) {
    const build = () => PARTNERS.map(([f, n]) =>
      `<span class="marquee__item"><img src="assets/partners/${f}.png" alt="${n}" loading="lazy"></span>`).join('');
    track.innerHTML = build() + build(); // duplicado para loop continuo
    const strip = track.parentElement;
    const mobilePartners = matchMedia('(max-width:767px)');
    let touching = false, resumeAt = 0, previousFrame = 0;
    strip.addEventListener('touchstart', () => { touching = true; }, { passive: true });
    const release = () => { touching = false; resumeAt = performance.now() + 3000; };
    strip.addEventListener('touchend', release, { passive: true });
    strip.addEventListener('touchcancel', release, { passive: true });
    strip.addEventListener('scroll', () => {
      if (!mobilePartners.matches) return;
      const cycle = track.children[PARTNERS.length].offsetLeft - track.children[0].offsetLeft;
      if (!cycle) return;
      if (strip.scrollLeft >= cycle) strip.scrollLeft -= cycle;
      else if (strip.scrollLeft <= 0) strip.scrollLeft = cycle - 1;
    }, { passive: true });
    const movePartners = (now) => {
      const elapsed = previousFrame ? Math.min(now - previousFrame, 50) : 0;
      previousFrame = now;
      if (mobilePartners.matches && !reduce.matches && !touching && now > resumeAt && !document.hidden) {
        const bounds = strip.getBoundingClientRect();
        if (bounds.bottom > 0 && bounds.top < innerHeight) {
          const cycle = track.children[PARTNERS.length].offsetLeft - track.children[0].offsetLeft;
          strip.scrollLeft += cycle * elapsed / 52000;
          if (cycle && strip.scrollLeft >= cycle) strip.scrollLeft -= cycle;
        }
      }
      requestAnimationFrame(movePartners);
    };
    requestAnimationFrame(movePartners);
  }

})();
