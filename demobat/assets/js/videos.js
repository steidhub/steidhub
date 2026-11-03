/* BAT — video section: featured player + queue. Click-to-load (no autoplay, no tracking until played). */
(function () {
  'use strict';
  var player = document.getElementById('player');
  var now = document.getElementById('now');
  var queue = document.getElementById('queue');
  var cfg = (window.BAT_CONFIG && window.BAT_CONFIG.videos) || [];
  if (!player || !queue || !cfg.length) return;

  var vids = cfg.filter(function (v) { return v && v.id; }).map(function (v, i) {
    return { id: v.id, title: v.title || '', fallback: 'Music video ' + (i + 1) };
  });
  var cur = 0;
  function el(tag, cls) { var n = document.createElement(tag); if (cls) n.className = cls; return n; }
  function name(v) { return v.title || v.fallback; }
  function thumb(id, q) { return 'https://i.ytimg.com/vi/' + id + '/' + q + '.jpg'; }

  function facade(v) {
    var b = el('button', 'facade');
    b.type = 'button';
    b.setAttribute('aria-label', 'Play video: ' + name(v));
    var img = new Image();
    img.alt = ''; img.decoding = 'async';
    img.onerror = function () { img.onerror = null; img.src = thumb(v.id, 'hqdefault'); img.style.transform = 'scale(1.34)'; };
    img.onload = function () { if (img.naturalWidth <= 120) img.onerror && img.onerror(); };
    img.src = thumb(v.id, 'maxresdefault');
    b.appendChild(img);
    var p = el('span', 'play');
    p.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.5v17l15-8.5z"/></svg>';
    b.appendChild(p);
    b.addEventListener('click', function () { embed(v); });
    return b;
  }

  function embed(v) {
    var f = el('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.id) + '?autoplay=1&rel=0&playsinline=1';
    f.title = name(v);
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    player.textContent = '';
    player.appendChild(f);
  }

  function select(i, play) {
    cur = i;
    var v = vids[i];
    player.textContent = '';
    if (play) embed(v); else player.appendChild(facade(v));
    now.textContent = '';
    var b = el('b'); b.textContent = name(v);
    now.appendChild(document.createTextNode('Now showing  ')); now.appendChild(b);
    [].forEach.call(queue.children, function (c, k) { if (k === i) c.setAttribute('aria-current', 'true'); else c.removeAttribute('aria-current'); });
    markDots(); var cnt = document.getElementById('vcount'); if (cnt) cnt.textContent = (i + 1) + ' / ' + vids.length;
    var act = queue.children[i];
    if (act && queue.scrollWidth > queue.clientWidth + 4 && queue.scrollHeight <= queue.clientHeight + 40) queue.scrollTo({ left: act.offsetLeft - (queue.clientWidth - act.offsetWidth) / 2, behavior: 'smooth' });
  }
  var dots = document.getElementById('vdots');
  function go(d) { select((cur + d + vids.length) % vids.length, true); }
  function buildDots() {
    if (!dots) return; dots.textContent = '';
    vids.forEach(function (v, i) {
      var b = el('button', 'vdot'); b.type = 'button'; b.setAttribute('aria-label', 'Video ' + (i + 1));
      b.addEventListener('click', function () { select(i, true); });
      dots.appendChild(b);
    });
  }
  function markDots() { if (dots) [].forEach.call(dots.children, function (d, k) { if (k === cur) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); }); }
  /* swipe on the stage (on top of the player frame only when not playing) */
  var stage = document.querySelector('.stage'), sx = null, sy = 0;
  if (stage) {
    stage.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (sx === null) return; var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
    }, { passive: true });
  }
  document.addEventListener('keydown', function (e) {
    var r = document.getElementById('videos').getBoundingClientRect();
    if (r.top > innerHeight * .5 || r.bottom < innerHeight * .5 || /input|textarea|select/i.test((e.target.tagName || ''))) return;
    if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1);
  });
  buildDots();

  function buildQueue() {
    queue.textContent = '';
    vids.forEach(function (v, i) {
      var b = el('button', 'vid'); b.type = 'button';
      var img = new Image(); img.alt = ''; img.loading = 'lazy'; img.src = thumb(v.id, 'mqdefault');
      var s = el('span'); s.textContent = name(v);
      b.appendChild(img); b.appendChild(s);
      b.addEventListener('click', function () { select(i, true); });
      queue.appendChild(b);
    });
  }

  buildQueue();
  select(0, false);

  /* read real titles from YouTube when none were typed in config.js */
  vids.forEach(function (v, i) {
    if (v.title) return;
    fetch('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + v.id))
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) {
        if (!j || !j.title) return;
        v.title = j.title;
        var btn = queue.children[i];
        if (btn) btn.querySelector('span').textContent = v.title;
        if (i === cur) { var f = player.querySelector('button.facade'); if (f) f.setAttribute('aria-label', 'Play video: ' + v.title); now.querySelector('b').textContent = v.title; }
      }).catch(function () {});
  });
})();
