/* Tres vueltas permiten deslizar a ambos lados sin alcanzar un extremo. */
(() => {
  const mobile = matchMedia('(max-width:767px)');
  document.querySelectorAll('.team,.mkt,.video-sales__grid').forEach(root => {
    const originals = [...root.children];
    const clone = item => {
      const copy = item.cloneNode(true);
      copy.dataset.loopCopy = '';
      copy.removeAttribute('id');
      copy.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      return copy;
    };
    const before = originals.map(clone), after = originals.map(clone);
    root.prepend(...before);
    root.append(...after);
    const cycle = () => originals[0].offsetLeft - before[0].offsetLeft;
    let adjusting = false;
    // Desplazamiento que deja una tarjeta centrada en la tira.
    // Con rectángulos, no con offsetLeft: el offsetParent de las tarjetas no es la
    // tira, así que offsetLeft arrastraba un desfase constante al centrar.
    const centerOf = item => {
      const rootRect = root.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      return root.scrollLeft + (itemRect.left + itemRect.width / 2)
                             - (rootRect.left + rootRect.width / 2);
    };
    const position = () => {
      if (!mobile.matches) { root.scrollLeft = 0; return; }
      // Centrada, no pegada al borde: si no, la primera tarjeta arranca descuadrada
      // y iOS no vuelve a asentar tras un scrollLeft asignado por código.
      root.scrollLeft = centerOf(originals[0]);
    };
    const wrap = () => {
      if (!mobile.matches || adjusting) return;
      const width = cycle();
      if (!width) return;
      const x = root.scrollLeft;
      if (x < width * .5 || x >= width * 2.5) {
        adjusting = true;
        root.style.scrollSnapType = 'none';
        root.scrollLeft = x < width * .5 ? x + width : x - width;
        // rAF no corre con la pestaña en segundo plano: sin el respaldo, el anclaje
        // se quedaría desactivado y adjusting bloqueado para siempre.
        const restaurar = () => { root.style.scrollSnapType = ''; adjusting = false; };
        requestAnimationFrame(restaurar);
        setTimeout(restaurar, 100);
      }
    };
    root.addEventListener('scroll', wrap, { passive: true });

    // Al terminar el desplazamiento, la tarjeta más cercana al centro se lleva al
    // centro exacto. El anclaje nativo no siempre asienta en iOS y el vídeo se
    // quedaba a un lado justo al ir a reproducirlo.
    if (root.classList.contains('video-sales__grid')) {
      let settleTimer;
      const settle = () => {
        if (!mobile.matches || adjusting) return;
        const rootRect = root.getBoundingClientRect();
        const mid = rootRect.left + rootRect.width / 2;
        let best = null, bd = Infinity;
        for (const item of root.children) {
          const r = item.getBoundingClientRect();
          const d = Math.abs(r.left + r.width / 2 - mid);
          if (d < bd) { bd = d; best = item; }
        }
        if (!best || bd < 2) return;              // ya está centrada
        root.scrollTo({ left: centerOf(best), behavior: 'smooth' });
      };
      root.addEventListener('scroll', () => {
        clearTimeout(settleTimer);
        settleTimer = setTimeout(settle, 130);
      }, { passive: true });
    }

    mobile.addEventListener('change', position);
    requestAnimationFrame(position);
    setTimeout(position, 100);            // respaldo si rAF no llega a ejecutarse
  });
})();
