/* BAT — release switcher + track player (Music) and cut-out products (Merch) from BAT_CATALOG */
(function () {
  'use strict';
  var C = window.BAT_CATALOG, d = document;
  if (!C) return;
  function el(t, c, txt) { var n = d.createElement(t); if (c) n.className = c; if (txt != null) n.textContent = txt; return n; }

  /* ---- Music ---- */
  var art = d.querySelector('[data-cover="bandcamp"]');
  var rels = d.getElementById('rels'), title = d.getElementById('rel-title'), buy = d.getElementById('buy-link');
  var list = d.getElementById('tracks'), embed = d.getElementById('embed'), meta = d.getElementById('rel-meta');
  if (art && rels && C.releases && C.releases.length) {
    var cover = el('img', 'cover'); cover.alt = '';
    cover.onload = function () { [].forEach.call(art.querySelectorAll('.mark,.ph'), function (n) { n.remove(); }); if (!cover.parentNode) art.appendChild(cover); };
    var cur = 0;
    function embedSrc(r, trackId) {
      return 'https://bandcamp.com/EmbeddedPlayer/album=' + r.album + '/size=small/bgcol=0a0a0a/linkcol=e8e5df/artwork=none/' + (trackId ? 'track=' + trackId + '/' : '') + 'transparent=true/';
    }
    function playTrack(r, i) {
      var t = r.tracks[i];
      [].forEach.call(list.children, function (li, k) { if (k === i) li.setAttribute('aria-current', 'true'); else li.removeAttribute('aria-current'); });
      embed.textContent = '';
      var f = el('iframe'); f.title = 'Bandcamp player — ' + t[0]; f.loading = 'lazy'; f.src = embedSrc(r, r.tracks.length > 1 ? t[2] : null);
      f.setAttribute('allow', 'autoplay'); f.setAttribute('scrolling', 'no');
      embed.appendChild(f);
      embed.classList.add('is-on');
    }
    function showTracks(r) {
      list.textContent = '';
      embed.textContent = ''; embed.classList.remove('is-on');
      list.classList.toggle('is-one', r.tracks.length === 1);
      r.tracks.forEach(function (t, i) {
        var li = el('li');
        var b = el('button'); b.type = 'button'; b.setAttribute('aria-label', 'Load ' + t[0] + ' in the player');
        b.appendChild(el('i', 'n', (i + 1 < 10 ? '0' : '') + (i + 1)));
        b.appendChild(el('span', 't', t[0]));
        b.appendChild(el('span', 'd', t[1]));
        b.addEventListener('click', function () { playTrack(r, i); });
        li.appendChild(b); list.appendChild(li);
      });
      /* preload the first track in the slim player so there is always a play button */
      var f = el('iframe'); f.title = 'Bandcamp player — ' + r.title; f.loading = 'lazy'; f.src = embedSrc(r, null); f.setAttribute('scrolling', 'no');
      embed.appendChild(f); embed.classList.add('is-on');
    }
    var show = function (i) {
      cur = i; var r = C.releases[i];
      cover.alt = r.title + ' — cover art';
      cover.src = r.img;
      title.textContent = r.title;
      if (meta) meta.textContent = r.year + ' · ' + r.kind + ' · ' + r.tracks.length + (r.tracks.length === 1 ? ' track' : ' tracks');
      buy.href = C.bandcamp + '/album/' + r.slug;
      [].forEach.call(rels.children, function (b, k) { if (k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
      if (list && embed) showTracks(r);
      var act = rels.children[i];
      if (act && rels.scrollWidth > rels.clientWidth + 4) rels.scrollTo({ left: act.offsetLeft - (rels.clientWidth - act.offsetWidth) / 2, behavior: 'smooth' });
    };
    C.releases.forEach(function (r, i) {
      var b = el('button', 'rel'); b.type = 'button'; b.setAttribute('aria-label', r.title + ', ' + r.year);
      var im = new Image(); im.alt = ''; im.loading = 'lazy'; im.src = r.img;
      b.appendChild(im);
      b.addEventListener('click', function () { show(i); });
      rels.appendChild(b);
    });
    show(0);
    var tmr;
    rels.addEventListener('scroll', function () {
      if (rels.scrollWidth <= rels.clientWidth + 4 || !window.matchMedia('(max-width:820px)').matches) return;
      clearTimeout(tmr);
      tmr = setTimeout(function () {
        var mid = rels.scrollLeft + rels.clientWidth / 2, best = 0, bd = 1e9;
        [].forEach.call(rels.children, function (b, k) { var dd = Math.abs(b.offsetLeft + b.offsetWidth / 2 - mid); if (dd < bd) { bd = dd; best = k; } });
        if (best !== cur) show(best);
      }, 140);
    }, { passive: true });
  }

  /* ---- Merch: cut-out products fanned out, each one links to its store ---- */
  function fan(key, items, href) {
    var box = d.querySelector('[data-fan="' + key + '"]');
    if (!box || !items || !items.length) return;
    items.forEach(function (it, i) {
      var a = el('a', 'prod'); a.href = it.url || href; a.target = '_blank'; a.rel = 'noopener'; a.title = it.title;
      a.style.setProperty('--k', i);
      var im = new Image(); im.alt = it.title; im.loading = 'lazy'; im.src = it.img;
      a.appendChild(im); box.appendChild(a);
    });
  }
  fan('bandcamp', C.bandcampMerch, C.bandcamp + '/merch');
  fan('vision', C.visionMerch, 'https://www.visionmerch.com/bat');
})();
