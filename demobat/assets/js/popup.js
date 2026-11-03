/* BAT — site pop-up (set in /admin > Pop-up). Cancellations, refunds, venue changes or any notice. */
(function () {
  'use strict';
  var BASE = document.documentElement.getAttribute('data-base') || '';
  var d = document;
  if (!window.fetch || !d.createElement('dialog').showModal) return;
  var KINDS = { notice: 'Notice', cancelled: 'Show cancelled', postponed: 'Show postponed', venue: 'Venue change', refund: 'Refund information' };
  var SEEN = 'bat_popup_seen';

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function today() { var t = new Date(); return t.getFullYear() + '-' + pad(t.getMonth() + 1) + '-' + pad(t.getDate()); }
  function el(tag, cls, text) { var n = d.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function seen() { try { return localStorage.getItem(SEEN); } catch (_) { return null; } }
  function remember(v) { try { localStorage.setItem(SEEN, v); } catch (_) {} }

  function build(p) {
    var dlg = el('dialog', 'join popup');
    dlg.setAttribute('aria-labelledby', 'popup-t');
    var card = el('div', 'join__card frame popup__card');
    var x = el('button', 'join__x', '×'); x.type = 'button'; x.setAttribute('aria-label', 'Close');
    card.appendChild(x);
    card.appendChild(el('p', 'kicker', KINDS[p.type] || KINDS.notice));
    var h = el('h2', 'black', p.title || KINDS[p.type] || 'Notice'); h.id = 'popup-t'; card.appendChild(h);
    if (p.message) {
      var box = el('div', 'popup__msg');
      p.message.split(/\n{2,}/).forEach(function (para) {
        var q = el('p'); para.split('\n').forEach(function (line, i) { if (i) q.appendChild(d.createElement('br')); q.appendChild(d.createTextNode(line)); });
        box.appendChild(q);
      });
      card.appendChild(box);
    }
    var row = el('div', 'btn-row');
    if (p.buttonUrl) {
      var a = el('a', 'btn', p.buttonLabel || 'More info'); a.href = p.buttonUrl; a.target = '_blank'; a.rel = 'noopener';
      row.appendChild(a);
    }
    var c = el('button', p.buttonUrl ? 'btn btn--sm' : 'btn', p.buttonUrl ? 'Close' : 'Got it'); c.type = 'button'; c.autofocus = true;
    row.appendChild(c); card.appendChild(row);
    dlg.appendChild(card);
    function close() { if (dlg.open) dlg.close(); d.body.classList.remove('no-scroll'); setTimeout(function () { dlg.remove(); }, 300); }
    x.addEventListener('click', close); c.addEventListener('click', close);
    dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
    dlg.addEventListener('cancel', function () { d.body.classList.remove('no-scroll'); });
    return dlg;
  }

  function show(p) {
    var dlg = build(p); d.body.appendChild(dlg); dlg.showModal(); d.body.classList.add('no-scroll');
  }

  window.BAT_popupPreview = show;
  if (d.body && d.body.hasAttribute('data-no-popup')) return;

  fetch(BASE + '/api/popup', { headers: { accept: 'application/json' }, cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (j) {
      var p = j && j.popup; if (!p || !p.enabled) return;
      var t = today();
      if (p.start && t < p.start) return;
      if (p.end && t > p.end) return;
      var id = p.updated || 'x';
      if (!p.repeat && seen() === id) return;
      setTimeout(function () {
        var j = d.getElementById('join'); if (j && j.open) return;
        show(p); remember(id);
      }, 1100);
    })
    .catch(function () {});
})();
