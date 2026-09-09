/* Steid Hub — interacciones */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Nav sticky ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 24);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menú móvil ---------- */
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobile-menu');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.hidden = false;
    menu.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 320);
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); }
  });

  /* ---------- Reveal al hacer scroll ---------- */
  const items = document.querySelectorAll('.reveal');
  if (reduce.matches || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach((el) => io.observe(el));
  }

  /* ---------- Contador de cifras (1-2 s) ---------- */
  const nums = document.querySelectorAll('[data-count]');
  const fmt = (n) => n.toLocaleString('es-PE');
  const runCount = (el) => {
    const target = Number(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    if (reduce.matches) { el.textContent = prefix + fmt(target); return; }
    el.textContent = prefix + '0';          // el HTML trae el valor final como fallback
    const DUR = 1400;                       // llega al número en 1,4 s
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / DUR, 1);
      const eased = 1 - Math.pow(1 - p, 3); // desaceleración al llegar
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
  }

  /* ---------- Pausar el video del hero fuera de pantalla ---------- */
  const video = document.getElementById('heroVideo');
  const lightHero = matchMedia('(max-width: 767px)').matches || navigator.connection?.saveData;
  if (video && !lightHero && !reduce.matches) {
    const source = video.querySelector('source[data-src]');
    source.src = source.dataset.src;
    video.load();
  }
  if (video) {
    if (reduce.matches || lightHero) { video.pause(); video.removeAttribute('autoplay'); }
    else if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => es.forEach((e) => {
        e.isIntersecting ? video.play().catch(() => {}) : video.pause();
      }), { threshold: 0.05 }).observe(video);
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) video.pause();
      else if (!reduce.matches && !lightHero) video.play().catch(() => {});
    });
  }

  /* ---------- WhatsApp flotante: visible al pasar el hero ---------- */
  const wa = document.querySelector('.wa');
  if (wa) {
    const heroStats = document.querySelector('.hero__stats');
    // Mientras se ve el hero, el botón se eleva justo por encima de la franja de cifras.
    // Se recalcula con la posición real en pantalla: la franja cambia de alto según el
    // ancho (5 columnas / 2 columnas) y el alto del hero no siempre iguala a innerHeight.
    const update = () => {
      const overHero = window.scrollY < innerHeight * 0.7;
      wa.classList.toggle('is-over-hero', overHero);
      if (overHero && heroStats) {
        const top = heroStats.getBoundingClientRect().top;
        wa.style.setProperty('--wa-lift', `${Math.max(24, Math.round(innerHeight - top + 24))}px`);
      }
    };
    update();
    requestAnimationFrame(() => wa.classList.add('is-ready'));
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Carrusel de servicios: bucle infinito ---------- */
  // Bloqueo de eje: el gesto vertical sigue desplazando la página.
  const touchDrag = (surface, handlers) => {
    let gesture = null;
    surface.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1 || e.target.closest('button,a,input,select,textarea')) return;
      const t = e.touches[0];
      gesture = { x: t.clientX, y: t.clientY, dx: 0, horizontal: false };
      handlers.start();
    }, { passive: true });
    surface.addEventListener('touchmove', (e) => {
      if (!gesture) return;
      const t = e.touches[0];
      const dx = t.clientX - gesture.x, dy = t.clientY - gesture.y;
      if (!gesture.horizontal) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
        if (Math.abs(dy) >= Math.abs(dx)) { handlers.end(0); gesture = null; return; }
        gesture.horizontal = true;
      }
      if (e.cancelable) e.preventDefault();
      gesture.dx = dx;
      handlers.move(dx);
    }, { passive: false });
    const end = (cancelled) => {
      if (!gesture) return;
      handlers.end(cancelled ? 0 : gesture.dx);
      gesture = null;
    };
    surface.addEventListener('touchend', () => end(false), { passive: true });
    surface.addEventListener('touchcancel', () => end(true), { passive: true });
  };

  document.querySelectorAll('[data-carousel]').forEach((root) => {
    const track = root.querySelector('.carousel__track');
    const dots = root.querySelector('[data-dots]');
    const prev = root.querySelector('[data-prev]');
    const next = root.querySelector('[data-next]');
    const pauseBtn = root.querySelector('[data-pause]');
    if (!track || !track.children.length) return;

    const real = [...track.children];
    const n = real.length;

    // clonamos el set completo: al pasar de la última, sigue con la primera
    real.forEach((sl) => {
      const c = sl.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      c.querySelectorAll('a,button').forEach((el) => el.setAttribute('tabindex', '-1'));
      track.appendChild(c);
    });

    // envolvemos la pista para poder recortarla
    const viewport = document.createElement('div');
    viewport.className = 'carousel__viewport';
    track.parentNode.insertBefore(viewport, track);
    viewport.appendChild(track);

    const DELAY = Number(root.dataset.autoplay) || 3200;
    let index = 0;
    let timer = null;
    let userPaused = false;

    real.forEach((sl, i) => {
      sl.setAttribute('role', 'group');
      sl.setAttribute('aria-roledescription', 'diapositiva');
      sl.setAttribute('aria-label', `${i + 1} de ${n}`);
      const title = sl.querySelector('h3');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'carousel__dot';
      b.setAttribute('aria-label', title ? `Ir a ${title.textContent}` : `Ir a la diapositiva ${i + 1}`);
      b.addEventListener('click', () => { goTo(i); restart(); });
      dots.appendChild(b);
    });
    const dotEls = [...dots.children];

    const DUR = 500;                                  // igual que la transición del CSS

    // margen mínimo: sólo el sitio que ocupa la flecha, para que no quede hueco negro
    const gutter = () => (viewport.clientWidth >= 768 ? 104 : Math.max(0, (viewport.clientWidth - real[0].getBoundingClientRect().width) / 2));
    // la diapositiva activa arranca en el margen izquierdo (no centrada)
    const offsetFor = (i) => {
      const sl = track.children[i];
      if (!sl) return 0;
      return -(sl.offsetLeft - gutter());
    };
    const paint = (animate) => {
      track.classList.toggle('is-animating', animate && !reduce.matches);
      track.style.transform = `translateX(${offsetFor(index)}px)`;
      dotEls.forEach((d, i) => d.setAttribute('aria-current', String(i === ((index % n) + n) % n)));
    };

    // tras animar hasta el clon, volvemos al original sin animación
    let snapTimer = null;
    const snapBack = () => {
      clearTimeout(snapTimer);
      snapTimer = null;
      if (index >= n) { index -= n; paint(false); }
    };
    const armSnap = () => {
      clearTimeout(snapTimer);
      // el transitionend puede no llegar (pestaña oculta, transición cortada):
      // este temporizador garantiza que el índice nunca se salga del rango
      snapTimer = setTimeout(snapBack, DUR + 80);
    };
    track.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'transform') snapBack();
    });

    const goTo = (i) => { index = ((i % n) + n) % n; paint(true); };   // destino absoluto (puntos)
    const forward = () => {
      if (index >= n) snapBack();                 // por si quedó pendiente
      index += 1;                                  // puede llegar a n (el primer clon)
      paint(true);
      if (index >= n) armSnap();
    };
    const backward = () => {
      if (index >= n) snapBack();
      if (index === 0) {                           // saltamos al clon y retrocedemos desde ahí
        index = n;
        paint(false);
        void track.offsetWidth;                    // fuerza el reflow antes de animar
      }
      index -= 1;
      paint(true);
    };

    const stop = () => { clearInterval(timer); clearTimeout(timer); timer = null; };
    let firstRun = true;
    const start = () => {
      stop();
      if (reduce.matches || userPaused) return;
      // el primer avance llega pronto para que se note al entrar en la sección
      const wait = firstRun ? 450 : DELAY;
      timer = setTimeout(() => {
        firstRun = false;
        forward();
        timer = setInterval(forward, DELAY);
      }, wait);
    };
    const restart = () => { if (!userPaused) start(); };

    let dragOrigin = 0;
    touchDrag(viewport, {
      start() { stop(); snapBack(); dragOrigin = offsetFor(index); track.classList.remove('is-animating'); },
      move(dx) { track.style.transform = `translateX(${dragOrigin + dx}px)`; },
      end(dx) {
        if (Math.abs(dx) > 35) { dx < 0 ? forward() : backward(); }
        else paint(true);
        restart();
      }
    });

    prev && prev.addEventListener('click', () => { backward(); restart(); });
    next && next.addEventListener('click', () => { forward(); restart(); });

    if (pauseBtn) {
      if (reduce.matches) pauseBtn.hidden = true;
      pauseBtn.addEventListener('click', () => {
        userPaused = !userPaused;
        pauseBtn.setAttribute('aria-pressed', String(userPaused));
        pauseBtn.setAttribute('aria-label', userPaused ? 'Reanudar el carrusel' : 'Pausar el carrusel');
        userPaused ? stop() : start();
      });
    }

    // Nada de pausar al pasar el cursor: la diapositiva ocupa casi toda la pantalla,
    // así que el puntero queda encima al desplazarse y el carrusel no arrancaba nunca.
    // El control de pausa sigue disponible en el botón y al recibir foco.
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget)) restart(); });

    addEventListener('resize', () => paint(false));
    paint(false);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting) {
          paint(false);        // ya hay medidas reales: recolocamos
          firstRun = true;     // el primer avance vuelve a ser inmediato
          restart();
        } else stop();
      }), { threshold: 0, rootMargin: '0px 0px -10% 0px' }).observe(root);
    } else start();
  });

  /* ---------- Carrusel continuo de trabajo ---------- */
  document.querySelectorAll('[data-showcase]').forEach((sc) => {
    const track = sc.querySelector('.showcase__track');
    if (!track) return;

    const photos = [...track.children].map((img) => ({ src: img.getAttribute('src'), alt: img.alt }));
    const n = track.children.length;                 // imágenes originales
    const originalSlides = track.innerHTML;
    track.innerHTML = originalSlides.repeat(3);       // copia a ambos lados del juego central
    track.querySelectorAll('img').forEach((im, i, all) => {
      if (i >= n) im.setAttribute('aria-hidden', 'true');
    });

    // Preparar las fotos antes de que el carrusel entre en pantalla.
    const readyPhotos = new Map();
    const preparePhoto = (index) => {
      const src = photos[(index + n) % n].src;
      if (!readyPhotos.has(src)) {
        const image = new Image();
        image.src = src;
        const ready = image.decode().then(() => image).catch((error) => {
          readyPhotos.delete(src);
          throw error;
        });
        readyPhotos.set(src, ready);
      }
      return readyPhotos.get(src);
    };
    const warmImages = () => {
      if (matchMedia('(max-width:767px)').matches) {
        [n - 1, 0, 1].forEach((i) => { preparePhoto(i).catch(() => {}); });
      } else {
        track.querySelectorAll('img').forEach((image) => { image.loading = 'eager'; });
        photos.forEach((_, i) => { preparePhoto(i).catch(() => {}); });
      }
    };
    if ('IntersectionObserver' in window) {
      const preloadObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { warmImages(); preloadObserver.disconnect(); }
      }, { rootMargin: '900px' });
      preloadObserver.observe(sc);
    } else warmImages();

    const prev = sc.querySelector('[data-sc-prev]');
    const next = sc.querySelector('[data-sc-next]');
    const ctrl = sc.parentElement.querySelector('[data-sc-dots]');
    const pauseBtn = sc.parentElement.querySelector('[data-sc-pause]');

    const SPEED = 34;               // px por segundo del desplazamiento continuo
    let offset = track.children[n].offsetLeft - track.children[0].offsetLeft;
    let dragging = false;
    let target = null;              // destino al usar flechas o puntos
    let targetIndex = null;         // conserva la selección durante clics consecutivos
    let userPaused = false;
    let hovering = false;
    let onScreen = true;
    let last = 0;

    // Distancia real entre una imagen y su copia: scrollWidth/2 se queda corto porque
    // no incluye el hueco final del flex, y ese desfase de medio gap desalineaba el
    // bucle y dejaba la imagen ampliada descentrada al dar la vuelta.
    const setW = () => track.children[n].offsetLeft - track.children[0].offsetLeft;
    const stepW = () => setW() / n;                  // ancho de una imagen + hueco

    // puntos
    const dots = [];
    if (ctrl) {
      for (let i = 0; i < n; i++) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'carousel__dot';
        b.setAttribute('aria-label', `Ir a la imagen ${i + 1} de ${n}`);
        b.addEventListener('click', () => goTo(i));
        ctrl.appendChild(b);
        dots.push(b);
      }
    }
    let shown = -1;
    const syncDots = () => {
      const centered = offset + innerWidth / 2 - sc.getBoundingClientRect().left
        - track.children[0].offsetLeft - track.children[0].offsetWidth / 2;
      const i = targetIndex ?? ((Math.round(centered / stepW()) % n) + n) % n;
      if (i === shown) return;
      shown = i;
      dots.forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
    };

    const wrap = () => {
      const w = setW();
      if (!w) return;
      if (offset >= 2 * w) { offset -= w; if (target !== null) target -= w; }
      else if (offset < w) { offset += w; if (target !== null) target += w; }
    };

    // estado inicial pintado ya, sin esperar al primer frame
    track.style.transform = `translateX(${-offset}px)`;
    syncDots();

    const frame = (t) => {
      const dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
      last = t;

      if (!onScreen && !zoomed && target === null) { requestAnimationFrame(frame); return; }
      // Comprobar también cada fotograma: el scroll puede ocurrir en un contenedor.
      if (zoomed && !canZoomShowcase()) { zoomFollow = false; reset(); }
      let llegada = false;
      if (dragging) { /* La posición la controla el dedo. */ }
      else if (target !== null) {
        // acercamiento suave al destino elegido con flechas o puntos
        const d = target - offset;
        if (reduce.matches || Math.abs(d) < 0.6) { offset = target; target = null; targetIndex = null; llegada = true; }
        else offset += d * Math.min(1, dt * 7);
      } else if (!userPaused && !hovering && !zoomed && onScreen && !reduce.matches) {
        offset += SPEED * dt;
      }

      if (!dragging) wrap();
      track.style.transform = `translateX(${-offset.toFixed(2)}px)`;
      syncDots();

      // La ampliación va DESPUÉS de escribir el transform y de wrap(): si se hace antes,
      // se mide con la posición anterior y, si además wrap() salta un juego completo,
      // la imagen ampliada queda desplazada a un lado en vez de centrada.
      if (llegada && zoomFollow) {
        zoomFollow = false;
        void track.offsetWidth;               // fuerza el reflow antes de medir
        const im = centerImage();
        if (im) zoom(im);
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);

    // Se parte del índice redondeado (el mismo que marcan los puntos) para que la flecha
    // siempre cambie de imagen: con floor/ceil, si la tira había avanzado unos píxeles,
    // «anterior» volvía a la misma imagen en vez de retroceder una.
    // elige la vuelta más cercana al desplazamiento actual
    const nearest = (t) => {
      const W = setW();
      const base = target !== null ? target : offset;
      while (t - base > W / 2) t -= W;
      while (base - t > W / 2) t += W;
      return t;
    };
    // desplazamiento que deja centrada en pantalla la imagen i del primer juego
    const centerOffsetFor = (i) => {
      const el = track.children[i];
      const scLeft = sc.getBoundingClientRect().left;
      return el.offsetLeft + el.offsetWidth / 2 - (innerWidth / 2 - scLeft);
    };

    const go = (dir) => {
      const current = targetIndex ?? (zoomed ? zoomedIdx : shown);
      goTo(((current + dir) % n + n) % n);
    };
    // Flechas y puntos usan siempre el centro, incluso sin una imagen ampliada.
    const goTo = async (i) => {
      if (zoomed) {
        if (photoAnimation?.playState === 'running') return;
        // Conservamos el mismo elemento ampliado y las flechas en su posición.
        // La nueva foto se decodifica antes de sustituir la anterior.
        const currentImage = zoomed;
        const version = ++photoVersion;
        photoAnimation?.cancel();
        targetIndex = i;
        syncDots();
        try { await Promise.all([preparePhoto(i), preparePhoto((i + 1) % n), preparePhoto((i + n - 1) % n)]); } catch {
          if (version === photoVersion) { targetIndex = zoomedIdx; syncDots(); }
          return;
        }
        if (version !== photoVersion || zoomed !== currentImage) return;
        // La foto anterior cubre la nueva durante el fundido: nunca se ve el fondo.
        clearPhotoFade();
        if (!reduce.matches) {
          const r = currentImage.getBoundingClientRect();
          const sr = sc.getBoundingClientRect();
          photoOverlay = document.createElement('img');
          photoOverlay.src = currentImage.src;
          photoOverlay.alt = '';
          photoOverlay.setAttribute('aria-hidden', 'true');
          photoOverlay.style.cssText = `position:absolute;pointer-events:none;z-index:7;
            left:${r.left - sr.left}px;top:${r.top - sr.top}px;
            width:${r.width}px;height:${r.height}px;object-fit:cover;
            border-radius:${getComputedStyle(currentImage).borderRadius};`;
          sc.appendChild(photoOverlay);
        }
        zoomOriginal ||= { src: zoomed.getAttribute('src'), alt: zoomed.alt };
        // Fijar ambas dimensiones evita saltos por la proporción de cada archivo.
        currentImage.style.width = currentImage.offsetWidth + 'px';
        currentImage.style.height = currentImage.offsetHeight + 'px';
        zoomed.src = photos[i].src;
        zoomed.alt = photos[i].alt;
        zoomedIdx = i;
        // El marco ampliado permanece fijo; la tira muestra sus vecinos actuales.
        const anchor = [...track.children].indexOf(zoomed);
        [...track.children].forEach((image, position) => {
          if (image === zoomed) return;
          const photo = photos[((i + position - anchor) % n + n) % n];
          image.src = photo.src;
          image.alt = photo.alt;
        });
        if (photoOverlay) {
          const overlay = photoOverlay;
          photoAnimation = overlay.animate([{ opacity: 1 }, { opacity: 0 }],
            { duration: 240, easing: 'ease-in-out', fill: 'forwards' });
          photoAnimation.finished.then(() => {
            overlay.remove();
            if (photoOverlay === overlay) { photoOverlay = null; photoAnimation = null; }
          }).catch(() => overlay.remove());
        }
        return;
      }
      const follow = !!zoomed || zoomFollow;
      reset();
      target = nearest(centerOffsetFor(i));
      targetIndex = i;
      zoomFollow = follow;
      syncDots();
    };
    let dragOffset = 0, dragIndex = 0;
    touchDrag(sc, {
      start() { dragging = true; target = null; targetIndex = null; dragOffset = offset; dragIndex = shown; },
      move(dx) { offset = dragOffset - dx; },
      end(dx) {
        dragging = false;
        const direction = Math.abs(dx) > 35 ? (dx < 0 ? 1 : -1) : 0;
        goTo((dragIndex + direction + n) % n);
      }
    });
    prev && prev.addEventListener('click', () => go(-1));
    next && next.addEventListener('click', () => go(1));

    if (pauseBtn) {
      if (reduce.matches) pauseBtn.hidden = true;
      pauseBtn.addEventListener('click', () => {
        userPaused = !userPaused;
        pauseBtn.setAttribute('aria-pressed', String(userPaused));
        pauseBtn.setAttribute('aria-label', userPaused ? 'Reanudar el carrusel' : 'Pausar el carrusel');
      });
    }

    // Al pasar el cursor, la imagen se amplía Y se desplaza al centro de la pantalla,
    // con una escala calculada para que quepa entera. Se detiene el avance: si no,
    // la imagen ampliada se seguiría moviendo y habría que esperar a verla.
    let zoomed = null;
    let zoomOriginal = null;
    let photoVersion = 0;
    let photoAnimation = null;
    let photoOverlay = null;
    const clearPhotoFade = () => {
      photoAnimation?.cancel();
      photoAnimation = null;
      photoOverlay?.remove();
      photoOverlay = null;
    };
    let zoomedIdx = 0;
    let zoomFollow = false;
    // imagen (de cualquiera de los dos juegos) cuyo centro está más cerca del de la ventana
    const centerImage = () => {
      let best = null, bd = Infinity;
      for (const im of track.children) {
        const r = im.getBoundingClientRect();
        if (!r.width) continue;
        const d = Math.abs((r.left + r.right) / 2 - innerWidth / 2);
        if (d < bd) { bd = d; best = im; }
      }
      return best;
    };
    // Con la imagen ampliada las flechas se mueven a sus bordes laterales: si se quedan
    // en los extremos de la tira, para alcanzarlas el cursor cruza otras imágenes y el
    // zoom va saltando de una a otra.
    const placeArrows = (zLeft, zRight) => {
      if (!prev || !next) return;
      const sr = sc.getBoundingClientRect();
      const inset = 18;
      const top = Math.round(innerHeight / 2 - sr.top);
      prev.style.top = next.style.top = top + 'px';
      prev.style.left = Math.round(zLeft - sr.left + inset) + 'px';
      prev.style.right = 'auto';
      prev.style.transform = 'translateY(-50%)';
      next.style.left = Math.round(zRight - sr.left - inset) + 'px';
      next.style.right = 'auto';
      next.style.transform = 'translate(-100%,-50%)';
      sc.classList.add('is-zooming');
    };
    const restoreArrows = () => {
      [prev, next].forEach((b) => { if (b) b.style.cssText = ''; });
      sc.classList.remove('is-zooming');
    };

    const reset = () => {
      photoVersion++;
      clearPhotoFade();
      if (zoomOriginal && zoomed) {
        [...track.children].forEach((image, position) => {
          image.src = photos[position % n].src;
          image.alt = photos[position % n].alt;
        });
        zoomOriginal = null;
        offset = nearest(centerOffsetFor(zoomedIdx));
        target = null;
        wrap();
        track.style.transform = `translateX(${-offset}px)`;
      }
      if (zoomed) targetIndex = null;
      restoreArrows();
      if (!zoomed) return;
      // Cerrar inmediatamente evita que la transición de salida tape los videos.
      zoomed.style.transition = 'none';
      zoomed.style.transform = '';
      zoomed.style.width = '';
      zoomed.style.height = '';
      zoomed.classList.remove('is-zoomed');
      void zoomed.offsetWidth;
      zoomed.style.transition = '';
      zoomed = null;
    };
    let lastShowcaseScroll = -Infinity;
    const canZoomShowcase = () => {
      // Medimos la tira original, no la foto que puede sobresalir al ampliarse.
      const videos = document.querySelector('.video-sales');
      if (videos && videos.getBoundingClientRect().top < innerHeight) return false;
      const r = sc.getBoundingClientRect();
      const middle = innerHeight / 2;
      const visibleHeight = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
      return r.top <= middle && r.bottom >= middle &&
        visibleHeight >= Math.min(r.height, innerHeight) * 0.6 &&
        performance.now() - lastShowcaseScroll > 180;
    };
    const zoom = (img) => {
      if (reduce.matches || img === zoomed || !canZoomShowcase()) return;
      reset();
      // Medidas sin la transformación anterior, que aún puede estar animándose.
      const tr = track.getBoundingClientRect();
      const r = { left: tr.left + img.offsetLeft, top: tr.top + img.offsetTop,
        width: img.offsetWidth, height: img.offsetHeight };
      if (!r.width) return;
      const scale = Math.min(innerWidth * 0.92 / r.width,
                             innerHeight * 0.85 / r.height,
                             1.35);
      if (scale <= 1.02) return;
      // se centra en los dos ejes: la tira queda baja en pantalla y, centrando sólo
      // en horizontal, la imagen se salía por abajo aunque la escala cupiese
      const dx = innerWidth / 2 - (r.left + r.width / 2);
      const dy = innerHeight / 2 - (r.top + r.height / 2);
      img.style.transform =
        `translate(${Math.round(dx)}px, ${Math.round(dy)}px) scale(${scale.toFixed(3)})`;
      img.classList.add('is-zoomed');
      zoomed = img;
      zoomedIdx = [...track.children].indexOf(img) % n;
      // caja final calculada (no medida): la transición aún no ha terminado
      const zw = r.width * scale;
      placeArrows(innerWidth / 2 - zw / 2, innerWidth / 2 + zw / 2);
    };

    // sólo con ratón: en táctil el pointerover se dispara al tocar y no llega el
    // pointerleave, así que la imagen se quedaría ampliada y tapando la sección
    const finePointer = matchMedia('(hover:hover) and (pointer:fine)');
    track.addEventListener('pointerover', (e) => {
      if (e.pointerType === 'touch' || !finePointer.matches || target !== null) return;
      const img = e.target.closest('img');
      if (img && track.contains(img) && !zoomed) zoom(img);
    });
    sc.addEventListener('pointerenter', () => { hovering = true; });
    sc.addEventListener('pointerleave', () => { hovering = false; zoomFollow = false; reset(); });
    addEventListener('scroll', () => {
      lastShowcaseScroll = performance.now();
      zoomFollow = false;
      reset();
    }, { passive: true });
    addEventListener('resize', reset);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => es.forEach((e) => {
        onScreen = e.isIntersecting;
        if (!onScreen) reset();
      }), { threshold: 0 }).observe(sc);
    }
  });

  /* ---------- Pop-up de diagnóstico ---------- */
  const popup = document.getElementById('popup');
  if (popup) {
    let lastFocus = null;
    const closeBtn = popup.querySelector('.popup__close');
    const link = popup.querySelector('.popup__link');

    const close = () => {
      popup.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(() => { popup.hidden = true; }, 400);
      if (lastFocus) lastFocus.focus();
    };
    const open = () => {
      if (sessionStorage.getItem('popupVisto') === '1') return;
      lastFocus = document.activeElement;
      popup.hidden = false;
      // reflow forzado en vez de rAF: si la pestaña está en segundo plano rAF no corre
      // y el overlay se quedaría invisible pero bloqueando los clics.
      void popup.offsetWidth;
      popup.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    };

    popup.querySelectorAll('[data-popup-close]').forEach((el) =>
      el.addEventListener('click', () => { try { sessionStorage.setItem('popupVisto', '1'); } catch (e) {} close(); }));
    // al ir a WhatsApp también se cierra y no vuelve a salir en esta visita
    link && link.addEventListener('click', () => { try { sessionStorage.setItem('popupVisto', '1'); } catch (e) {} close(); });

    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && popup.classList.contains('is-open')) {
        try { sessionStorage.setItem('popupVisto', '1'); } catch (e2) {}
        close();
      }
    });

    setTimeout(open, 3000);
  }

  /* ---------- Formulario ---------- */
  const form = document.getElementById('contactForm');
  if (!form) return;

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

  // Validación en blur (no en cada tecla)
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
})();
