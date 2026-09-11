/* Steid Hub — landing Google Ads (reveal, cifras, colaboradores y formulario) */
(() => {
  'use strict';
  window.__lpReady = true; // desarma el watchdog del <head>
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

    /* Segundo respaldo: si el observer se queda mudo pero algo ya se reveló,
       el failsafe de arriba no salta y el resto quedaría oculto al bajar. El
       scroll lo cubre; se desengancha solo cuando ya no queda nada por mostrar. */
    let ultimo = 0;
    const alScroll = () => {
      // límite por tiempo, no por frame: requestAnimationFrame no corre en
      // contextos donde el pintado está suspendido, y ahí perderíamos el rescate
      const ahora = Date.now();
      if (ahora - ultimo < 120) return;
      ultimo = ahora;
      showIfOnScreen();
      if (items.every((el) => el.classList.contains('is-in'))) {
        removeEventListener('scroll', alScroll);
      }
    };
    addEventListener('scroll', alScroll, { passive: true });
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
    let listo = false;
    const cerrar = () => { listo = true; el.textContent = prefix + fmt(target); };
    const tick = (now) => {
      if (listo) return;
      const p = Math.min((now - t0) / DUR, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + fmt(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
      else cerrar();
    };
    requestAnimationFrame(tick);
    /* Si requestAnimationFrame se detiene (pestaña en segundo plano, ahorro de
       energía, pintado suspendido) la cifra quedaría congelada a medias y
       mostraría un dato falso: "−4" en lugar de "−40". Este seguro la cierra. */
    setTimeout(() => { if (!listo) cerrar(); }, DUR + 900);
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

  /* ---------- Parallax suave en fondos de sección ---------- */
  const layers = [...document.querySelectorAll('.lp-parallax')];
  if (layers.length && !reduce.matches) {
    let ticking = false;
    const move = () => {
      layers.forEach((el) => {
        const host = el.closest('section') || el.parentElement;
        const r = host.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) return;
        // desplazamiento corto: el fondo se mueve un 12% de lo que avanza la sección
        const avance = (innerHeight - r.top) / (innerHeight + r.height);
        el.style.transform = `translate3d(0,${((avance - 0.5) * 12).toFixed(2)}%,0)`;
      });
      ticking = false;
    };
    const pedir = () => { if (!ticking) { ticking = true; requestAnimationFrame(move); } };
    move();
    addEventListener('scroll', pedir, { passive: true });
    addEventListener('resize', pedir);
  }

  /* ---------- Video de fondo ----------
     La fuente va en data-src: así el mp4 sólo se descarga cuando la sección
     se acerca, y no compite con el LCP del hero. */
  const film = document.querySelector('.lp-film__video');
  if (film && !reduce.matches) {
    let cargado = false;
    const cargar = () => {
      if (cargado) return;
      cargado = true;
      film.querySelectorAll('source[data-src]').forEach((f) => { f.src = f.dataset.src; });
      film.load();
    };
    const reproducir = (si) => { if (si) { cargar(); film.play().catch(() => {}); } else film.pause(); };
    const seccion = film.closest('section');
    const aLaVista = () => {
      const r = seccion.getBoundingClientRect();
      return r.top < innerHeight + 200 && r.bottom > -200;
    };
    /* Respaldo por si el observer no llega a disparar (pasa en algunos
       webviews): se comprueba la posición real al cargar y al hacer scroll. */
    const revisar = () => { if (aLaVista()) reproducir(true); };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => es.forEach((e) => reproducir(e.isIntersecting)),
        { rootMargin: '200px 0px', threshold: 0.01 }).observe(seccion);
    }
    addEventListener('load', revisar);
    addEventListener('scroll', revisar, { passive: true });
    setTimeout(revisar, 1200);
    document.addEventListener('visibilitychange', () => { if (document.hidden) film.pause(); });
  }

  /* ---------- Carrusel de galería ----------
     Sobre el scroll nativo, que ya da inercia y scroll-snap: las flechas
     sólo desplazan una lámina, y el avance automático se detiene en cuanto
     el usuario interviene. */
  document.querySelectorAll('[data-lp-carousel]').forEach((root) => {
    const pista = root.querySelector('.lp-gallery');
    const prev = root.querySelector('[data-lp-prev]');
    const next = root.querySelector('[data-lp-next]');
    const barra = root.querySelector('.lp-carousel__bar i');
    if (!pista || !pista.children.length) return;

    const paso = () => {
      const a = pista.children[0], b = pista.children[1];
      return b ? b.offsetLeft - a.offsetLeft : a.getBoundingClientRect().width;
    };
    const maxScroll = () => pista.scrollWidth - pista.clientWidth;

    const pintar = () => {
      const max = maxScroll();
      const p = max > 0 ? pista.scrollLeft / max : 0;
      if (barra) {
        const visible = pista.clientWidth / pista.scrollWidth;   // qué porción se ve
        barra.style.width = `${(visible * 100).toFixed(2)}%`;
        barra.style.marginLeft = `${(p * (1 - visible) * 100).toFixed(2)}%`;
      }
      if (prev) prev.disabled = false;
      if (next) next.disabled = false;
    };

    /* Safari por debajo de 15.4 ignora behavior:'smooth' en contenedores.
       Si a los 300 ms no se movió nada, se salta de golpe. */
    const mover = (dir) => {
      const desde = pista.scrollLeft;
      const slides = [...pista.children];
      const actual = slides.reduce((best, el, i) =>
        Math.abs(el.offsetLeft - desde) < Math.abs(slides[best].offsetLeft - desde) ? i : best, 0);
      const alInicio = desde < 4;
      const alFinal = desde > maxScroll() - 4;
      const destinoIndex = dir > 0 && alFinal
        ? 0
        : dir < 0 && alInicio
          ? slides.length - 1
          : Math.max(0, Math.min(slides.length - 1, actual + dir));
      const destino = dir > 0 && alFinal
        ? 0
        : dir < 0 && alInicio
          ? maxScroll()
          : Math.max(0, Math.min(maxScroll(), slides[destinoIndex].offsetLeft));
      if (reduce.matches) { pista.scrollLeft = destino; pintar(); return; }
      pista.scrollTo({ left: destino, behavior: 'smooth' });
      // no dependemos del evento scroll para refrescar flechas y barra
      setTimeout(() => {
        if (pista.scrollLeft === desde && desde !== destino) pista.scrollLeft = destino;
        pintar();
      }, 300);
      setTimeout(pintar, 700);
    };
    prev && prev.addEventListener('click', () => { detener(); mover(-1); });
    next && next.addEventListener('click', () => { detener(); mover(1); });
    pista.addEventListener('scroll', pintar, { passive: true });

    /* Avance automático: sólo mientras el carrusel está a la vista, la pestaña
       activa y el usuario no ha tocado nada. */
    let timer = null, detenido = false;
    const avanzar = () => {
      if (detenido || document.hidden) return;
      if (pista.scrollLeft >= maxScroll() - 4) {
        const desde = pista.scrollLeft;
        pista.scrollTo({ left: 0, behavior: 'smooth' });
        setTimeout(() => { if (pista.scrollLeft === desde) pista.scrollLeft = 0; }, 300);
      }
      else mover(1);
    };
    const arrancar = () => { if (!detenido && !timer && !reduce.matches) timer = setInterval(avanzar, 4500); };
    const detener = () => { detenido = true; clearInterval(timer); timer = null; };
    ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach((ev) =>
      pista.addEventListener(ev, detener, { passive: true, once: true }));
    root.addEventListener('mouseenter', () => { clearInterval(timer); timer = null; });
    root.addEventListener('mouseleave', arrancar);
    root.addEventListener('focusin', detener);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting ? arrancar() : (clearInterval(timer), timer = null)),
        { threshold: 0.35 }).observe(root);
    } else arrancar();

    pintar();
    addEventListener('resize', pintar);
  });

  /* ---------- Formulario (sólo en las páginas que lo llevan) ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    const summary = document.getElementById('formSummary');
    const summaryList = document.getElementById('formSummaryList');
    const status = document.getElementById('formStatus');
    const statusText = document.getElementById('formStatusText');
    const btn = document.getElementById('submitBtn');

    const LABELS = {
      nombre: 'Nombre y apellido', email: 'Email', telefono: 'WhatsApp',
      servicio: '¿Qué necesitas?', consent: 'Autorización de contacto',
      datos: 'Tratamiento de datos personales'
    };

    const validate = (el) => {
      const v = (el.value || '').trim();
      if (el.type === 'checkbox') return el.checked;
      if (!el.required && !v) return true;
      if (!v) return false;
      if (el.type === 'email') return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v);
      if (el.type === 'tel') return (v.match(/\d/g) || []).length >= 9;
      return v.length >= 2;
    };

    const mark = (el, ok) => {
      const field = el.closest('.field') || el.closest('.form__consent');
      if (field) field.classList.toggle('is-invalid', !ok);
      el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    };

    form.querySelectorAll('input,select,textarea').forEach((el) => {
      el.addEventListener('blur', () => { if (el.required || el.value.trim()) mark(el, validate(el)); });
      el.addEventListener('input', () => {
        const f = el.closest('.field');
        if (f && f.classList.contains('is-invalid') && validate(el)) mark(el, true);
      });
      if (el.type === 'checkbox') el.addEventListener('change', () => mark(el, validate(el)));
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (btn.disabled) return;
      const required = [...form.querySelectorAll('[required]')];
      const invalid = required.filter((el) => { const ok = validate(el); mark(el, ok); return !ok; });

      if (invalid.length) {
        summaryList.innerHTML = invalid.map((el) =>
          `<li><a href="#${el.id}">${LABELS[el.name] || el.name}</a></li>`).join('');
        summary.classList.add('is-visible');
        status.classList.remove('is-visible');
        summary.focus();
        summaryList.querySelectorAll('a').forEach((a) => a.addEventListener('click', (ev) => {
          ev.preventDefault();
          const t = document.getElementById(a.getAttribute('href').slice(1));
          t.focus(); t.scrollIntoView({ block: 'center', behavior: reduce.matches ? 'auto' : 'smooth' });
        }));
        return;
      }

      summary.classList.remove('is-visible');
      btn.setAttribute('aria-busy', 'true');
      btn.querySelector('.btn__label').textContent = 'Enviando…';
      btn.disabled = true;
      status.classList.remove('is-visible');

      const fields = new FormData(form);
      const payload = {
        nombre: fields.get('nombre'), empresa: fields.get('empresa'),
        email: fields.get('email'), whatsapp: fields.get('telefono'),
        necesidad: fields.get('servicio'), etapa: fields.get('etapa'),
        proyecto: fields.get('mensaje'),
        // de qué landing vino el lead, para atribuir en el CRM
        origen: document.body.dataset.landing || 'landing',
        consentimiento_contacto: fields.has('consent'),
        consentimiento_privacidad: fields.has('datos')
      };
      try {
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (!response.ok || result.success !== true) throw new Error('Submission failed');
        statusText.textContent = '¡Gracias! Recibimos tu solicitud. Te escribimos dentro de las próximas 24 horas hábiles.';
        status.querySelector('svg').style.display = '';
        form.reset();
        form.querySelectorAll('.is-invalid').forEach((f) => f.classList.remove('is-invalid'));
        form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
        if (typeof window.gtag === 'function') {
          try { window.gtag('event', 'generate_lead'); } catch { /* El lead ya está guardado. */ }
        }
      } catch {
        statusText.textContent = 'No pudimos confirmar el envío. Tus datos siguen aquí; vuelve a intentarlo en unos minutos o contáctanos por WhatsApp.';
        status.querySelector('svg').style.display = 'none';
      } finally {
        btn.disabled = false;
        btn.removeAttribute('aria-busy');
        btn.querySelector('.btn__label').textContent = 'Enviar solicitud';
        status.classList.add('is-visible');
        status.scrollIntoView({ block: 'center', behavior: reduce.matches ? 'auto' : 'smooth' });
      }
    });
  }

})();
