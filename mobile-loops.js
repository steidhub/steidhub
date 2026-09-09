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
    const position = () => {
      if (!mobile.matches) { root.scrollLeft = 0; return; }
      root.scrollLeft = cycle();
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
        requestAnimationFrame(() => { root.style.scrollSnapType = ''; adjusting = false; });
      }
    };
    root.addEventListener('scroll', wrap, { passive: true });
    mobile.addEventListener('change', position);
    requestAnimationFrame(position);
  });
})();
