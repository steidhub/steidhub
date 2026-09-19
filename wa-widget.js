/* Steid Hub — botón flotante de WhatsApp.
   Módulo único usado por la home, las landings y las páginas de /servicios.
   El marcado y el CSS viven en el HTML y en styles.css; aquí sólo el comportamiento. */
(() => {
  'use strict';
  const wa = document.querySelector('.wa');
  if (!wa) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const btn = wa.querySelector('.wa__btn');
  const panel = wa.querySelector('.wa__panel');
  if (!btn || !panel) return;

  panel.id = 'whatsapp-panel';
  btn.setAttribute('aria-controls', panel.id);
  btn.setAttribute('aria-expanded', 'false');

  const cerrar = () => {
    wa.classList.remove('is-panel-open');
    btn.setAttribute('aria-expanded', 'false');
  };

  /* En escritorio la burbuja sale al pasar el cursor (CSS). En móvil, el botón
     dirige directamente a WhatsApp mediante el href. */
  btn.addEventListener('click', (e) => {
    if (!matchMedia('(max-width:767px)').matches) return;
    /* En móvil: permitir que el link se siga directamente a WhatsApp */
  });
  document.addEventListener('click', (e) => { if (!wa.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });

  /* Sólo la home tiene la franja de cifras sobre la que el botón debe elevarse.
     Donde no existe, el botón se queda en su posición normal. */
  const cifras = document.querySelector('.hero__stats');
  if (cifras) {
    const actualizar = () => {
      const sobreHero = window.scrollY < innerHeight * 0.7;
      wa.classList.toggle('is-over-hero', sobreHero);
      if (sobreHero) {
        const top = cifras.getBoundingClientRect().top;
        wa.style.setProperty('--wa-lift', `${Math.max(24, Math.round(innerHeight - top + 24))}px`);
      }
    };
    actualizar();
    addEventListener('scroll', actualizar, { passive: true });
    addEventListener('resize', actualizar);
  }

  if (reduce.matches) wa.classList.add('is-ready');
  else requestAnimationFrame(() => wa.classList.add('is-ready'));
})();
