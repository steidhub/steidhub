/* BAT — public tour dates (reads /api/tour, hides past shows automatically) */
(function () {
  'use strict';
  var BASE = document.documentElement.getAttribute('data-base') || '';
  var box = document.getElementById('tour-list');
  if (!box) return;
  var limit = parseInt(box.getAttribute('data-limit'), 10) || 0;
  var countEl = document.getElementById('tour-count');
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var SOCIAL = {
    ig: 'https://www.instagram.com/bewareofbat/',
    fb: 'https://www.facebook.com/bewareofthebat'
  };

  function L() { return document.documentElement.lang || 'en'; }
  function fmt(d, o, fb) { if (L() === 'en') return fb; try { return new Intl.DateTimeFormat(L(), o).format(d).replace(/\.$/, ''); } catch (_) { return fb; } }
  function mon(d) { return fmt(d, { month: 'short' }, MON[d.getMonth()]); }
  function day(d) { return fmt(d, { weekday: 'short' }, DAY[d.getDay()]); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function today() { var t = new Date(); return t.getFullYear() + '-' + pad(t.getMonth() + 1) + '-' + pad(t.getDate()); }
  function parse(s) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

  function row(s, i) {
    var dt = parse(s.date), li = el('li', 'show');
    li.setAttribute('data-reveal', ''); li.style.setProperty('--i', i);
    var gone = s.status === 'cancelled' || s.status === 'postponed';
    if (s.soldOut || gone) li.classList.add('is-sold');
    if (gone) li.classList.add('is-gone');
    var time = el('time', 'show__date');
    time.setAttribute('datetime', s.date);
    time.appendChild(el('span', 'd', (dt.getDate() < 10 ? '0' : '') + dt.getDate()));
    var m = el('span', 'm', mon(dt));
    m.appendChild(el('small', null, day(dt) + ' · ' + dt.getFullYear()));
    time.appendChild(m);
    li.appendChild(time);
    var what = el('span', 'show__what');
    what.appendChild(el('span', 'show__city', s.city));
    var v = el('span', 'show__venue', s.venue || '');
    if (s.note) v.appendChild(el('em', null, s.note));
    what.appendChild(v);
    if (s.update) what.appendChild(el('span', 'show__upd', s.update));
    li.appendChild(what);
    var t = el('span', 'show__tix');
    if (s.status === 'cancelled') t.appendChild(el('span', 'soldout', 'Cancelled'));
    else if (s.status === 'postponed') t.appendChild(el('span', 'soldout', 'Postponed'));
    else if (s.soldOut) t.appendChild(el('span', 'soldout', 'Sold out'));
    else if (s.tickets) {
      var a = el('a', 'tix btn btn--sm', 'Tickets');
      a.href = s.tickets; a.target = '_blank'; a.rel = 'noopener nofollow';
      a.setAttribute('aria-label', 'Tickets for ' + s.city + ', ' + mon(dt) + ' ' + dt.getDate());
      t.appendChild(a);
    }
    li.appendChild(t);
    return li;
  }

  function social(label) {
    var wrap = el('div', 'btn-row');
    wrap.style.justifyContent = 'center';
    [['Instagram', SOCIAL.ig], ['Facebook', SOCIAL.fb]].forEach(function (x) {
      var a = el('a', 'btn btn--sm', x[0]); a.href = x[1]; a.target = '_blank'; a.rel = 'noopener'; wrap.appendChild(a);
    });
    return wrap;
  }

  function message(title, text) {
    var e = el('div', 'empty frame frame--thin');
    e.appendChild(el('p', 'black', title));
    e.appendChild(el('p', null, text));
    e.appendChild(social());
    return e;
  }

  function jsonld(shows) {
    var old = document.getElementById('tour-jsonld'); if (old) old.remove();
    if (!shows.length) return;
    var s = el('script'); s.type = 'application/ld+json'; s.id = 'tour-jsonld';
    s.textContent = JSON.stringify(shows.map(function (x) {
      return {
        '@context': 'https://schema.org', '@type': 'MusicEvent', name: 'BAT live in ' + x.city, startDate: x.date,
        location: { '@type': 'Place', name: x.venue || x.city, address: x.city },
        performer: { '@type': 'MusicGroup', name: 'BAT' },
        offers: x.tickets ? { '@type': 'Offer', url: x.tickets, availability: x.soldOut ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock' } : undefined,
        eventStatus: x.status === 'cancelled' ? 'https://schema.org/EventCancelled' : x.status === 'postponed' ? 'https://schema.org/EventPostponed' : 'https://schema.org/EventScheduled'
      };
    }));
    document.head.appendChild(s);
  }

  function render(all) {
    var t = today();
    var up = all.filter(function (s) { return parse(s.date) && s.date >= t && s.city; })
      .sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
    box.textContent = '';
    if (countEl) countEl.textContent = '';
    if (!up.length) {
      box.appendChild(message('No dates scheduled', 'There are no shows on the books right now. Follow BAT on Instagram and Facebook to hear first when new dates are announced.'));
      jsonld([]);
      return;
    }
    var list = limit ? up.slice(0, limit) : up;
    var ul = el('ul', 'shows');
    list.forEach(function (s, i) { ul.appendChild(row(s, i)); });
    box.appendChild(ul);
    if (countEl) {
      countEl.textContent = up.length > list.length ? 'More dates on the tour page' : '';
    }
    jsonld(up);
    if (window.BAT_observe) window.BAT_observe(ul.children);
  }

  fetch(BASE + '/api/tour', { headers: { accept: 'application/json' }, cache: 'no-store' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (d) { render(d && d.shows || []); })
    .catch(function () {
      box.textContent = '';
      box.appendChild(message('Dates unavailable', 'Tour dates could not be loaded right now. Please check back soon or follow BAT for announcements.'));
    });
})();
