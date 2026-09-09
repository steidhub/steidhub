/* Capa de títulos independiente: no modifica el movimiento ni el zoom del carrusel. */
(() => {
  document.querySelectorAll('[data-showcase]').forEach((root) => {
    const images = [...root.querySelectorAll('.showcase__track img')];
    const titles = new Map(images.map((img) => [img.src, img.dataset.caption]));
    const labels = images.map((img) => {
      const label = document.createElement('div');
      label.className = 'showcase__caption';
      label.setAttribute('aria-hidden', 'true');
      root.appendChild(label);
      return label;
    });
    let visible = true;
    let frame = 0;
    const paint = () => {
      if (!visible) { frame = 0; return; }
      const bounds = root.getBoundingClientRect();
      // Primero leemos las medidas de todas las fotos; después colocamos los textos.
      const positions = images.map((img) => img.getBoundingClientRect());
      const enlarged = images.find((img) => img.classList.contains('is-zoomed'));
      images.forEach((img, i) => {
        const r = positions[i];
        const label = labels[i];
        const title = titles.get(img.src) || img.dataset.caption;
        const show = (!enlarged || img === enlarged) &&
          r.right > 0 && r.left < innerWidth && r.bottom > 0 && r.top < innerHeight;
        label.hidden = !show;
        if (!show) return;
        if (label.textContent !== title) label.textContent = title;
        label.style.left = `${r.left - bounds.left}px`;
        label.style.top = `${r.bottom - bounds.top}px`;
        label.style.width = `${r.width}px`;
        label.style.zIndex = img.classList.contains('is-zoomed') ? '8' : '2';
      });
      frame = requestAnimationFrame(paint);
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !frame) paint();
      }, { rootMargin: '300px' }).observe(root);
    }
    paint();
  });
})();
