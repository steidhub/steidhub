/* BAT — "Join the community" pop-up (name, email, country, birthday) -> POST /api/subscribe */
(function () {
  'use strict';
  var BASE = document.documentElement.getAttribute('data-base') || '';
  var d = document, dlg = d.getElementById('join');
  if (!dlg) return;
  var form = d.getElementById('join-form'), msg = d.getElementById('join-msg'), done = d.getElementById('join-done'), go = d.getElementById('join-go');
  var KEY = 'bat_join';

  /* countries (ISO codes, names come from the browser) */
  var codes = 'AF AX AL DZ AS AD AO AI AQ AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BA BW BR IO VG BN BG BF BI KH CM CA CV BQ KY CF TD CL CN CX CC CO KM CG CD CK CR CI HR CU CW CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FK FO FJ FI FR GF PF GA GM GE DE GH GI GR GL GD GP GU GT GG GN GW GY HT HN HK HU IS IN ID IR IQ IE IM IL IT JM JP JE JO KZ KE KI XK KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG NU KP MK MP NO OM PK PW PS PA PG PY PE PH PN PL PT PR QA RE RO RU RW WS SM ST SA SN RS SC SL SG SX SK SI SB SO ZA KR SS ES LK BL SH KN LC MF PM VC SD SR SJ SE CH SY TW TJ TZ TH TL TG TK TO TT TN TR TM TC TV UG UA AE GB US UY VI UZ VU VA VE VN WF EH YE ZM ZW'.split(' ');
  var sel = d.getElementById('j-country');
  var names = [];
  try {
    var dn = new Intl.DisplayNames([document.documentElement.lang || 'en'], { type: 'region' });
    codes.forEach(function (c) { var n; try { n = dn.of(c); } catch (_) {} if (n && n !== c) names.push([n, c]); });
  } catch (_) { names = [['United States', 'US'], ['United Kingdom', 'GB'], ['Germany', 'DE'], ['Mexico', 'MX'], ['Peru', 'PE'], ['Other', 'ZZ']]; }
  names.sort(function (a, b) { return a[0].localeCompare(b[0], document.documentElement.lang || 'en'); });
  names.forEach(function (p) { var o = d.createElement('option'); o.value = p[1]; o.textContent = p[0]; o.setAttribute('data-name', p[0]); sel.appendChild(o); });

  /* birthday: no future dates */
  var bd = d.getElementById('j-bday'); var t = new Date();
  bd.max = t.getFullYear() + '-' + ('0' + (t.getMonth() + 1)).slice(-2) + '-' + ('0' + t.getDate()).slice(-2);

  /* review demo only: pre-fill the form with a random name/email and the country detected from the visitor's connection */
  function demoFill() {
    var N = ['Alex Morgan', 'Sam Carter', 'Jamie Cole', 'Riley Hayes', 'Casey Brooks', 'Morgan Reyes', 'Jordan Blake', 'Taylor Quinn'];
    var nm = N[Math.floor(Math.random() * N.length)];
    var nameEl = d.getElementById('j-name'), mailEl = d.getElementById('j-email');
    if (nameEl && !nameEl.value) nameEl.value = nm;
    if (mailEl && !mailEl.value) mailEl.value = nm.toLowerCase().replace(/[^a-z]+/g, '.') + Math.floor(100 + Math.random() * 900) + '@example.com';
    function pick(c) { if (c && sel.querySelector('option[value="' + c + '"]') && !sel.value) sel.value = c; }
    fetch(BASE + '/api/geo', { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : {}; }).then(function (j) {
      if (j && j.country) pick(j.country);
      else { var m = /[-_]([A-Za-z]{2})$/.exec(navigator.language || ''); if (m) pick(m[1].toUpperCase()); }
    }).catch(function () { var m = /[-_]([A-Za-z]{2})$/.exec(navigator.language || ''); if (m) pick(m[1].toUpperCase()); });
  }
  function lock(on) { d.body.classList.toggle('no-scroll', on); }
  function open() {
    form.hidden = false; done.hidden = true; msg.textContent = ''; msg.className = 'join__msg';
    if (d.documentElement.hasAttribute('data-demo')) demoFill();
    if (typeof dlg.showModal === 'function') { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute('open', '');
    lock(true);
    setTimeout(function () { var f = d.getElementById('j-name'); if (f) f.focus(); }, 60);
  }
  function close(remember) {
    if (dlg.open) { if (typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open'); }
    lock(false);
    if (remember) try { localStorage.setItem(KEY, String(Date.now())); } catch (_) {}
  }
  [].forEach.call(d.querySelectorAll('[data-join]'), function (b) { b.addEventListener('click', open); });
  [].forEach.call(dlg.querySelectorAll('[data-close]'), function (b) { b.addEventListener('click', function () { close(true); }); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) close(true); });
  dlg.addEventListener('cancel', function () { lock(false); try { localStorage.setItem(KEY, String(Date.now())); } catch (_) {} });

  function bad(el, on) { if (on) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid'); }
  function say(text, err) { msg.textContent = text; msg.className = 'join__msg' + (err ? ' err' : ''); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements, ok = true, first = null;
    var name = f.name.value.trim(), email = f.email.value.trim();
    var checks = [
      [f.name, name.length >= 2], [f.email, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)],
      [f.country, !!f.country.value], [f.birthday, !!f.birthday.value && f.birthday.value <= bd.max && f.birthday.value >= '1900-01-01']
    ];
    checks.forEach(function (c) { var good = c[1]; bad(c[0], !good); if (!good) { ok = false; if (!first) first = c[0]; } });
    if (!ok) { say('Please fill in every field correctly.', true); if (first) first.focus(); return; }
    if (!f.consent.checked) { say('Please tick the box to join.', true); f.consent.focus(); return; }
    go.disabled = true; say('Sending');
    var opt = f.country.options[f.country.selectedIndex];
    fetch(BASE + '/api/subscribe', {
      method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ name: name, email: email, country: f.country.value, countryName: opt ? opt.getAttribute('data-name') : '', birthday: f.birthday.value, consent: true, company: f.company.value })
    }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) throw new Error(j.error || 'Something went wrong.'); return j; }); })
      .then(function () {
        form.hidden = true; done.hidden = false; say('');
        try { localStorage.setItem(KEY, 'done'); } catch (_) {}
        form.reset();
      })
      .catch(function (err) { say(err && err.message && err.message.length < 140 ? err.message : "Can't reach the server. Try again in a moment.", true); })
      .then(function () { go.disabled = false; });
  });
  [].forEach.call(form.querySelectorAll('input,select'), function (i) { i.addEventListener('input', function () { bad(i, false); }); });

  /* gentle auto-open once per visitor (home page only): after ~25 s, never again for 30 days once seen */
  var DEMO = d.documentElement.hasAttribute('data-demo');
  if (/[?&]preview=join\b/.test(location.search)) setTimeout(open, 500);
  else if (DEMO && d.getElementById('home')) { /* review demo: the sign-up pop-up opens on every load, after ~1.5 s or at the first scroll */
    var fired = false, go2 = function () { if (fired) return; fired = true; if (!dlg.open) open(); };
    setTimeout(go2, 1500);
    ['scroll', 'wheel', 'touchmove', 'keydown'].forEach(function (ev) { window.addEventListener(ev, function () { setTimeout(go2, 250); }, { once: true, passive: true }); d.addEventListener(ev, function () { setTimeout(go2, 250); }, { once: true, passive: true, capture: true }); });
  }
  else if (d.getElementById('home')) {
    var seen = null; try { seen = localStorage.getItem(KEY); } catch (_) {}
    var recent = seen === 'done' || (seen && Date.now() - Number(seen) < 30 * 864e5);
    if (!recent) setTimeout(function () { if (!dlg.open && !d.querySelector('.nav[data-open="true"]')) open(); }, 25000);
  }
})();
