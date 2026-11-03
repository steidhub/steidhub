/* BAT — Tour Manager (talks to /api/tour) */
(function () {
  'use strict';
  var BASE = document.documentElement.getAttribute('data-base') || '';
  var d = document, KEY = 'bat_admin_pw';
  var $ = function (id) { return d.getElementById(id); };
  var login = $('login'), editor = $('editor'), cards = $('cards'), empty = $('empty');
  var status = $('status'), loginStatus = $('login-status');
  var pw = '', shows = [], dirty = false;

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function today() { var t = new Date(); return t.getFullYear() + '-' + pad(t.getMonth() + 1) + '-' + pad(t.getDate()); }
  function uid() { return 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function say(msg, kind) { status.textContent = msg || ''; status.className = 'status' + (kind ? ' ' + kind : ''); }
  function setDirty(v) { dirty = v; if (v) say('Unpublished changes'); }
  function auth() { return { authorization: 'Bearer ' + pw }; }

  function api(method, body, query, path) {
    return fetch((path || BASE + '/api/tour') + (query || ''), {
      method: method, cache: 'no-store',
      headers: Object.assign({ accept: 'application/json' }, body ? { 'content-type': 'application/json' } : {}, auth()),
      body: body ? JSON.stringify(body) : undefined
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) { var e = new Error(j.error || ('Error ' + r.status)); e.status = r.status; throw e; }
        return j;
      });
    });
  }
  function netMsg(e) {
    return e && e.status ? e.message : "Can't reach the server. Open the site through the dev server or from your Cloudflare address (see README).";
  }

  /* ---------- login ---------- */
  function enter() {
    login.hidden = true; editor.hidden = false;
    return fetch(BASE + '/api/tour', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (j) {
      shows = (j.shows || []).map(function (s) { return Object.assign({ id: uid() }, s); });
      render(); say('');
      loadSubs(); loadPopup();
    });
  }

  /* ---------- community list ---------- */
  function loadSubs() {
    api('GET', null, '', BASE + '/api/subscribe').then(function (j) {
      $('subs-count').textContent = j.count === 1 ? '1 person has joined the community.' : j.count + ' people have joined the community.';
    }).catch(function () { $('subs-count').textContent = 'The sign-up list is not available yet.'; });
  }
  $('subs-csv').addEventListener('click', function () {
    var st = $('subs-status'); st.textContent = 'Preparing file';
    fetch(BASE + '/api/subscribe?format=csv', { headers: auth(), cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('Error ' + r.status); return r.blob();
    }).then(function (b) {
      var a = d.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'bat-community.csv'; d.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); st.textContent = '';
    }).catch(function () { st.textContent = 'Could not download the list.'; st.className = 'status err'; });
  });
  $('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    pw = $('pw').value;
    loginStatus.textContent = 'Checking'; loginStatus.className = 'status';
    api('GET', null, '?verify=1').then(function () {
      try { sessionStorage.setItem(KEY, pw); } catch (_) {}
      return enter();
    }).catch(function (err) {
      loginStatus.textContent = netMsg(err); loginStatus.className = 'status err';
    });
  });
  $('logout').addEventListener('click', function () {
    if (dirty && !confirmLeave()) return;
    try { sessionStorage.removeItem(KEY); } catch (_) {}
    dirty = false; location.reload();
  });
  function confirmLeave() { return window.confirm('You have unpublished changes. Leave without publishing?'); }
  window.addEventListener('beforeunload', function (e) { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

  /* ---------- cards ---------- */
  function field(cls, label, type, value, ph) {
    var w = d.createElement('div'); w.className = 'field ' + cls;
    var l = d.createElement('label'); var id = 'f' + Math.random().toString(36).slice(2, 8); l.htmlFor = id; l.textContent = label;
    var i = type === 'textarea' ? d.createElement('textarea') : d.createElement('input');
    if (type !== 'textarea') i.type = type;
    i.id = id; i.value = value || ''; if (ph) i.placeholder = ph;
    w.appendChild(l); w.appendChild(i);
    return { wrap: w, input: i };
  }
  function selectField(cls, label, value, opts) {
    var w = d.createElement('div'); w.className = 'field ' + cls;
    var l = d.createElement('label'); var id = 'f' + Math.random().toString(36).slice(2, 8); l.htmlFor = id; l.textContent = label;
    var i = d.createElement('select'); i.id = id;
    opts.forEach(function (o) { var op = d.createElement('option'); op.value = o[0]; op.textContent = o[1]; i.appendChild(op); });
    i.value = value || ''; w.appendChild(l); w.appendChild(i);
    return { wrap: w, input: i };
  }
  function slugify(t) { return String(t || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70); }
  function uniqueSlug(s) {
    var base = slugify(s.slug) || slugify((s.city || 'show') + ' ' + (s.date || '')); if (base.length < 3) base = 'show-' + Date.now().toString(36);
    var slug = base, n = 2, taken = function (x) { return shows.some(function (o) { return o !== s && o.landing && o.slug === x; }); };
    while (taken(slug)) slug = base + '-' + n++;
    return slug;
  }
  function el(tag, cls, text) { var n = d.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function flyerSrc(s) { return BASE + '/api/flyer?id=' + encodeURIComponent(s.id) + '&v=' + encodeURIComponent(s.flyerV || ''); }

  /* shrink a chosen image to a web-friendly JPEG (max 1400 px on the long side) */
  function shrink(file) {
    return new Promise(function (res, rej) {
      if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return rej(new Error('Use a JPG, PNG or WebP image.'));
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        var r = Math.min(1, 1400 / Math.max(img.naturalWidth, img.naturalHeight)), w = Math.round(img.naturalWidth * r), h = Math.round(img.naturalHeight * r);
        var c = d.createElement('canvas'); c.width = w; c.height = h; var x = c.getContext('2d');
        x.fillStyle = '#000'; x.fillRect(0, 0, w, h); x.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg', 0.86));
      };
      img.onerror = function () { URL.revokeObjectURL(url); rej(new Error('That image could not be opened.')); };
      img.src = url;
    });
  }

  var STATUS_OPTS = [['', 'On sale / as planned'], ['cancelled', 'Cancelled'], ['postponed', 'Postponed'], ['moved', 'Venue changed']];

  function card(s) {
    var c = d.createElement('div'); c.className = 'card frame frame--thin';
    c.dataset.id = s.id;
    var fd = field('f-date', 'Date', 'date', s.date);
    var fc = field('f-city', 'City', 'text', s.city, 'Richmond, VA');
    var fv = field('f-venue', 'Venue', 'text', s.venue, 'Venue name');
    var fu = field('f-url', 'Ticket link (optional)', 'url', s.tickets, 'https://');
    var fn = field('f-note', 'Note (optional)', 'text', s.note, 'with special guests');
    var fs = selectField('f-status', 'Status', s.status, STATUS_OPTS);
    var fx = field('f-upd', 'Update shown under the show (optional)', 'text', s.update, 'New venue: The National. Tickets stay valid.');
    fx.input.maxLength = 300;
    [fd, fc, fv, fu, fn, fs, fx].forEach(function (f) { c.appendChild(f.wrap); });
    fu.input.setAttribute('inputmode', 'url');

    /* ---- show page for ads ---- */
    var det = el('details', 'adpage'); if (s.landing) det.open = true;
    det.appendChild(el('summary', null, 'Show page for ads'));
    var lw = el('label', 'check'); var lcb = el('input'); lcb.type = 'checkbox'; lcb.checked = !!s.landing;
    lw.appendChild(lcb); lw.appendChild(d.createTextNode('Create a page for this show'));
    det.appendChild(lw);
    var body = el('div', 'adpage__body'); det.appendChild(body);
    var linkWrap = el('div', 'field f-link'); var ll = el('label', null, 'Page link (use it in your ads)');
    var lrow = el('div', 'linkbox'); var lin = el('input'); lin.type = 'text'; lin.readOnly = true;
    var copy = el('button', 'btn-del', 'Copy'); copy.type = 'button';
    lrow.appendChild(lin); lrow.appendChild(copy); linkWrap.appendChild(ll); linkWrap.appendChild(lrow);
    linkWrap.appendChild(el('p', 'hint', 'Not linked anywhere on the website, and hidden from search engines. It works after you press Publish.'));
    var ft = field('f-time', 'Doors / show time (optional)', 'text', s.time, 'Doors 7 PM, show 8 PM');
    var fdesc = field('f-desc', 'Description', 'textarea', s.desc, 'A few lines about the show. Blank line = new paragraph.');
    fdesc.input.rows = 5; fdesc.input.maxLength = 1500;
    var rd = el('div', 'readbox');
    var rb = el('button', 'btn btn--ghost btn--sm', 'Read the ticket link'); rb.type = 'button';
    rd.appendChild(rb); rd.appendChild(el('span', 'hint', 'Pulls the description and image from the ticket page, when the site allows it.'));
    var found = el('div', 'found'); found.hidden = true; rd.appendChild(found);
    var fl = el('div', 'field f-flyer'); fl.appendChild(el('label', null, 'Flyer'));
    var fbox = el('div', 'flyerbox'); var thumb = el('img', 'flyerbox__img'); thumb.alt = 'Flyer preview'; thumb.hidden = true;
    var fcol = el('div', 'flyerbox__col'); var file = el('input'); file.type = 'file'; file.accept = 'image/jpeg,image/png,image/webp';
    var rm = el('button', 'btn-del', 'Remove flyer'); rm.type = 'button'; rm.hidden = true;
    fcol.appendChild(file); fcol.appendChild(el('p', 'hint', 'JPG, PNG or WebP. Best: vertical 4:5 (1080 × 1350 px). It is resized automatically.')); fcol.appendChild(rm);
    fbox.appendChild(thumb); fbox.appendChild(fcol); fl.appendChild(fbox);
    var fst = el('p', 'status'); fl.appendChild(fst);
    [linkWrap, ft.wrap, fdesc.wrap, rd, fl].forEach(function (n) { body.appendChild(n); });
    c.appendChild(det);

    var foot = d.createElement('div'); foot.className = 'card__foot';
    var chk = d.createElement('label'); chk.className = 'check';
    var cb = d.createElement('input'); cb.type = 'checkbox'; cb.checked = !!s.soldOut;
    chk.appendChild(cb); chk.appendChild(d.createTextNode('Sold out'));
    var tag = d.createElement('span'); tag.className = 'tag'; tag.textContent = 'Past show'; tag.hidden = true;
    var del = d.createElement('button'); del.type = 'button'; del.className = 'btn-del'; del.textContent = 'Delete';
    var left = d.createElement('div'); left.style.display = 'flex'; left.style.gap = '1rem'; left.style.alignItems = 'center';
    left.appendChild(chk); left.appendChild(tag);
    foot.appendChild(left); foot.appendChild(del);
    c.appendChild(foot);

    function refreshAd() {
      body.hidden = !s.landing;
      if (s.landing) {
        if (!s.slug && s.city && s.date) s.slug = uniqueSlug(s);
        lin.value = s.slug ? location.origin + BASE + '/show/' + s.slug : 'Add the date and city first';
        copy.disabled = !s.slug;
      }
      var has = !!s.flyerV; thumb.hidden = !has; rm.hidden = !has; if (has) thumb.src = flyerSrc(s);
    }
    function sync() {
      s.date = fd.input.value; s.city = fc.input.value.trim(); s.venue = fv.input.value.trim();
      s.tickets = fu.input.value.trim(); s.note = fn.input.value.trim(); s.soldOut = cb.checked;
      s.status = fs.input.value; s.update = fx.input.value.trim();
      s.landing = lcb.checked; s.time = ft.input.value.trim(); s.desc = fdesc.input.value.trim();
      var past = !!s.date && s.date < today();
      c.classList.toggle('is-past', past); tag.hidden = !past;
      var m = c.querySelector('.err-msg'); if (m) m.remove();
      refreshAd(); setDirty(true);
    }
    [fd, fc, fv, fu, fn, fx, ft, fdesc].forEach(function (f) { f.input.addEventListener('input', sync); });
    fs.input.addEventListener('change', sync); lcb.addEventListener('change', sync);
    cb.addEventListener('change', sync);
    var past0 = !!s.date && s.date < today();
    c.classList.toggle('is-past', past0); tag.hidden = !past0;
    refreshAd();

    copy.addEventListener('click', function () {
      lin.select();
      var done = function () { copy.textContent = 'Copied'; setTimeout(function () { copy.textContent = 'Copy'; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(lin.value).then(done, function () { try { d.execCommand('copy'); done(); } catch (_) {} });
      else { try { d.execCommand('copy'); done(); } catch (_) {} }
    });

    function fstat(msg, kind) { fst.textContent = msg || ''; fst.className = 'status' + (kind ? ' ' + kind : ''); }
    function upload(dataUrlOrUrl, isUrl) {
      fstat('Uploading');
      return api('PUT', isUrl ? { id: s.id, fromUrl: dataUrlOrUrl } : { id: s.id, dataUrl: dataUrlOrUrl }, '', BASE + '/api/flyer').then(function (j) {
        s.flyerV = j.v; refreshAd(); setDirty(true); fstat('Flyer saved. Press Publish to put it live.', 'ok');
      }).catch(function (e) { fstat(netMsg(e), 'err'); });
    }
    file.addEventListener('change', function () {
      var f = file.files && file.files[0]; if (!f) return;
      fstat('Preparing image');
      shrink(f).then(function (u) { return upload(u, false); }).catch(function (e) { fstat(e.message, 'err'); }).then(function () { file.value = ''; });
    });
    rm.addEventListener('click', function () {
      api('DELETE', null, '?id=' + encodeURIComponent(s.id), BASE + '/api/flyer').then(function () { s.flyerV = ''; refreshAd(); setDirty(true); fstat('Flyer removed.', 'ok'); })
        .catch(function (e) { fstat(netMsg(e), 'err'); });
    });

    rb.addEventListener('click', function () {
      var link = fu.input.value.trim();
      found.hidden = true; found.textContent = '';
      if (!link) { fstat('Paste the ticket link above first.', 'err'); return; }
      fstat('Reading the page'); rb.disabled = true;
      api('POST', { url: link }, '', BASE + '/api/extract').then(function (j) {
        fstat('');
        found.hidden = false;
        found.appendChild(el('p', 'found__src', 'Found on ' + j.source + (j.title ? ': ' + j.title : '')));
        var row = el('div', 'btn-row');
        function add(label, fn) { var b = el('button', 'btn btn--sm', label); b.type = 'button'; b.addEventListener('click', fn); row.appendChild(b); }
        if (j.description) add('Use description', function () { fdesc.input.value = j.description; sync(); fstat('Description added.', 'ok'); });
        if (j.image) add('Use image as flyer', function () { upload(j.image, true); });
        if (j.venue && !fv.input.value) add('Use venue', function () { fv.input.value = j.venue; sync(); });
        if (j.city && !fc.input.value) add('Use city', function () { fc.input.value = j.city; sync(); });
        if (!row.children.length) found.appendChild(el('p', 'hint', 'Nothing useful to copy. Fill the details in by hand.')); else found.appendChild(row);
        if (j.description) found.appendChild(el('p', 'found__txt', j.description.slice(0, 260) + (j.description.length > 260 ? '…' : '')));
      }).catch(function (e) { fstat(netMsg(e), 'err'); }).then(function () { rb.disabled = false; });
    });

    var t;
    del.addEventListener('click', function () {
      if (del.dataset.armed === 'true') {
        shows = shows.filter(function (x) { return x.id !== s.id; });
        render(); setDirty(true); return;
      }
      del.dataset.armed = 'true'; del.textContent = 'Click again to delete';
      clearTimeout(t); t = setTimeout(function () { del.dataset.armed = 'false'; del.textContent = 'Delete'; }, 3000);
    });
    c._first = fd.input;
    return c;
  }

  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var seg = 'up', edlg = $('edlg'), edBody = $('edlg-body'), editing = null, editingNew = false;
  function isPast(s) { return !!s.date && s.date < today(); }
  var sel = {};
  function statusOf(s) {
    if (s.status === 'cancelled') return ['Cancelled', 'bad'];
    if (s.status === 'postponed') return ['Postponed', 'warn'];
    if (s.status === 'moved') return ['Venue changed', 'warn'];
    if (s.soldOut) return ['Sold out', 'dark'];
    return ['On sale', 'ok'];
  }
  var PENCIL = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
  function nSel() { return Object.keys(sel).filter(function (k) { return sel[k]; }).length; }
  function updBulk() {
    var n = nSel(); $('bulk').hidden = !n;
    $('bulk-n').textContent = n + (n === 1 ? ' date selected' : ' dates selected');
    var all = $('sel-all'); if (all) { var vis = cards.querySelectorAll('.trow input[type=checkbox]'); var on = cards.querySelectorAll('.trow input[type=checkbox]:checked'); all.checked = vis.length > 0 && vis.length === on.length; all.indeterminate = on.length > 0 && on.length < vis.length; }
    var b = $('bulk-del'); b.dataset.armed = 'false'; b.textContent = 'Delete selected';
  }
  function row(s) {
    var r = el('div', 'trow'); r.dataset.id = s.id;
    var cb = el('input'); cb.type = 'checkbox'; cb.checked = !!sel[s.id]; cb.setAttribute('aria-label', 'Select ' + (s.city || 'show'));
    cb.addEventListener('change', function () { sel[s.id] = cb.checked; r.classList.toggle('is-sel', cb.checked); updBulk(); });
    var dt = el('div', 'trow__date');
    if (s.date) { var p = s.date.split('-'); dt.appendChild(el('b', null, String(+p[2]))); dt.appendChild(el('span', null, MON[+p[1] - 1] + ' ' + String(p[0]).slice(2))); }
    else { dt.appendChild(el('b', null, '?')); dt.appendChild(el('span', null, 'No date')); }
    var mn = el('div', 'trow__main');
    mn.appendChild(el('div', 'trow__city', s.city || 'New show (no city yet)'));
    var vn = (s.venue || '') + (s.landing ? (s.venue ? ' · ' : '') + 'Ad page' : '');
    if (vn) mn.appendChild(el('div', 'trow__venue', vn));
    var st = statusOf(s); var sc = el('div', 'trow__status'); sc.appendChild(el('span', 'chip chip--' + st[1], st[0]));
    var ed = el('button', 'pencil'); ed.type = 'button'; ed.innerHTML = PENCIL; ed.setAttribute('aria-label', 'Edit ' + (s.city || 'show')); ed.title = 'Edit';
    ed.addEventListener('click', function () { openEditor(s, false); });
    [cb, dt, mn, sc, ed].forEach(function (n) { r.appendChild(n); });
    r.classList.toggle('is-sel', !!sel[s.id]);
    return r;
  }
  function head() {
    var h = el('div', 'trow trow--head');
    var all = el('input'); all.type = 'checkbox'; all.id = 'sel-all'; all.setAttribute('aria-label', 'Select all');
    all.addEventListener('change', function () { [].forEach.call(cards.querySelectorAll('.trow[data-id]'), function (r) { sel[r.dataset.id] = all.checked; var c = r.querySelector('input'); c.checked = all.checked; r.classList.toggle('is-sel', all.checked); }); updBulk(); });
    h.appendChild(all); h.appendChild(el('div', null, 'Date')); h.appendChild(el('div', null, 'Show')); h.appendChild(el('div', null, 'Status')); h.appendChild(el('div', null, ''));
    return h;
  }
  function render() {
    if (edlg.open && editing && shows.indexOf(editing) < 0) closeDlg();
    var ids = {}; shows.forEach(function (s) { ids[s.id] = 1; }); Object.keys(sel).forEach(function (k) { if (!ids[k]) delete sel[k]; });
    var up = shows.filter(function (s) { return !isPast(s); }).sort(function (a, b) { return !a.date ? -1 : !b.date ? 1 : a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
    var past = shows.filter(isPast).sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
    $('cnt-up').textContent = up.length; $('cnt-past').textContent = past.length;
    var list = seg === 'up' ? up : past;
    cards.textContent = '';
    if (list.length) { cards.appendChild(head()); list.forEach(function (s) { cards.appendChild(row(s)); }); }
    empty.hidden = list.length > 0;
    empty.textContent = seg === 'up' ? 'No upcoming shows yet. Press “Add new date” to create one.' : 'No past shows.';
    $('purge').hidden = !(seg === 'past' && past.length);
    $('seg-up').classList.toggle('is-on', seg === 'up'); $('seg-past').classList.toggle('is-on', seg === 'past');
    updBulk();
  }
  $('bulk-clr').addEventListener('click', function () { sel = {}; render(); });
  $('bulk-del').addEventListener('click', function () {
    var b = this, n = nSel(); if (!n) return;
    if (b.dataset.armed !== 'true') { b.dataset.armed = 'true'; b.textContent = 'Sure? Click again to delete ' + n; clearTimeout(b._t); b._t = setTimeout(function () { b.dataset.armed = 'false'; b.textContent = 'Delete selected'; }, 3500); return; }
    shows = shows.filter(function (s) { return !sel[s.id]; }); sel = {}; render(); setDirty(true);
    say(n + (n === 1 ? ' date deleted. Press Publish to save.' : ' dates deleted. Press Publish to save.'), 'ok');
  });
  [].forEach.call(d.querySelectorAll('.seg__b'), function (b) { b.addEventListener('click', function () { seg = b.getAttribute('data-seg'); render(); }); });

  /* ---------- edit / add form (opens in a window) ---------- */
  function problem(s) {
    if (!s.date) return 'Choose a date.';
    if (!s.city) return 'Add the city.';
    if (s.tickets) { try { new URL(normUrl(s.tickets)); } catch (_) { return 'The ticket link does not look right.'; } }
    if (s.status === 'moved' && !s.update) return 'Venue changed: add the new venue in "Update shown under the show".';
    return '';
  }
  function showErr(c, msg) {
    var old = c.querySelector('.err-msg'); if (old) old.remove();
    if (!msg) return;
    var p = d.createElement('p'); p.className = 'err-msg status err'; p.textContent = msg; c.insertBefore(p, c.querySelector('.card__foot'));
  }
  function isBlank(s) { return !s.date && !s.city && !s.venue && !s.tickets && !s.note && !s.update && !s.desc && !s.flyerV; }
  function openEditor(s, fresh) {
    editing = s; editingNew = !!fresh;
    $('edlg-t').textContent = fresh ? 'New show' : 'Edit show';
    edBody.textContent = ''; var c = card(s); edBody.appendChild(c);
    if (!edlg.open) edlg.showModal();
    d.body.classList.add('no-scroll'); edBody.scrollTop = 0;
    setTimeout(function () { if (fresh && c._first) c._first.focus(); }, 80);
  }
  function closeDlg() {
    if (edlg.open) edlg.close();
    d.body.classList.remove('no-scroll');
    if (editing && editingNew && shows.indexOf(editing) > -1 && isBlank(editing)) shows = shows.filter(function (x) { return x !== editing; });
    editing = null; editingNew = false; render();
  }
  $('edlg-done').addEventListener('click', function () {
    var s = editing; if (!s) { closeDlg(); return; }
    if (isBlank(s)) { closeDlg(); return; }
    var m = problem(s); var c = edBody.firstChild;
    if (m) { showErr(c, m); c.scrollIntoView({ block: 'start' }); return; }
    closeDlg(); if (dirty) say('Unpublished changes. Press Publish to put them live.');
  });
  edlg.addEventListener('cancel', function (e) { e.preventDefault(); closeDlg(); });
  edlg.addEventListener('click', function (e) { if (e.target === edlg) closeDlg(); });

  /* ---------- tabs ---------- */
  function showTab(n) {
    ['dates', 'popup', 'community'].forEach(function (t) { var p = $('tab-' + t); if (p) p.hidden = t !== n; });
    [].forEach.call(d.querySelectorAll('.tabs__b'), function (b) { var on = b.getAttribute('data-tab') === n; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
    try { sessionStorage.setItem('bat_admin_tab', n); } catch (_) {}
  }
  [].forEach.call(d.querySelectorAll('.tabs__b'), function (b) { b.addEventListener('click', function () { showTab(b.getAttribute('data-tab')); window.scrollTo(0, 0); }); });
  try { var t0 = sessionStorage.getItem('bat_admin_tab'); if (t0) showTab(t0); } catch (_) {}

  /* ---------- actions ---------- */
  $('add').addEventListener('click', function () {
    var s = { id: uid(), date: '', city: '', venue: '', tickets: '', note: '', soldOut: false, status: '', update: '', landing: false, slug: '', time: '', desc: '', flyerV: '' };
    shows.unshift(s); seg = 'up'; render(); openEditor(s, true);
  });

  var purgeTimer;
  $('purge').addEventListener('click', function () {
    var b = this;
    if (b.dataset.armed !== 'true') {
      b.dataset.armed = 'true'; b.textContent = 'Click again to confirm';
      clearTimeout(purgeTimer); purgeTimer = setTimeout(function () { b.dataset.armed = 'false'; b.textContent = 'Remove past shows'; }, 3000);
      return;
    }
    b.dataset.armed = 'false'; b.textContent = 'Remove past shows';
    var t = today(), before = shows.length;
    shows = shows.filter(function (s) { return !s.date || s.date >= t; });
    var n = before - shows.length;
    render();
    if (n) { setDirty(true); say(n + (n === 1 ? ' past show removed. Press Publish to save.' : ' past shows removed. Press Publish to save.'), 'ok'); }
    else say('No past shows to remove.');
  });

  function normUrl(u) { return u && !/^https?:\/\//i.test(u) ? 'https://' + u : u; }

  $('publish').addEventListener('click', function () {
    var bad = shows.filter(function (s) { return !(isBlank(s)) && problem(s); })[0];
    shows = shows.filter(function (s) { return !isBlank(s); });
    if (bad) { seg = isPast(bad) ? 'past' : 'up'; render(); openEditor(bad, false); showErr(edBody.firstChild, problem(bad)); say('Fix this show first, then press Publish again.', 'err'); return; }
    shows.forEach(function (s) { s.tickets = normUrl(s.tickets); if (s.landing) s.slug = uniqueSlug(s); });
    shows.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
    var btn = this; btn.disabled = true; say('Publishing');
    api('PUT', { shows: shows }).then(function (j) {
      shows = (j.shows || shows); dirty = false; render();
      say('Published. The website is up to date.', 'ok');
    }).catch(function (e) { say(netMsg(e), 'err'); }).then(function () { btn.disabled = false; });
  });


  /* ---------- pop-up ---------- */
  var TPL = {
    cancelled: { type: 'cancelled', title: 'Show cancelled', message: 'We are sorry to say that the show on [date] in [city] has been cancelled.\n\nIf you bought a ticket, you will be refunded by the ticket seller automatically. Check your email, and contact the seller if you do not hear from them within a few days.' },
    postponed: { type: 'postponed', title: 'Show postponed', message: 'The show in [city] has been postponed. New date: [date].\n\nYour ticket stays valid for the new date. If you cannot make it, ask the ticket seller about a refund.' },
    venue: { type: 'venue', title: 'New venue', message: 'The show on [date] in [city] has moved to [new venue].\n\nYour ticket stays valid. Doors and times do not change.' },
    refund: { type: 'refund', title: 'Refund information', message: 'Refunds are handled by the ticket seller where you bought your ticket. Please contact them directly with your order number.\n\nBAT cannot process refunds for tickets sold by other companies.' },
    notice: { type: 'notice', title: '', message: '' }
  };
  var ppIds = ['on', 'type', 'title', 'msg', 'btn', 'url', 'start', 'end', 'repeat', 'tpl'];
  var pp = {}; ppIds.forEach(function (k) { pp[k] = $('pp-' + k); });
  var ppStatus = $('pp-status');
  function ppSay(m, k) { ppStatus.textContent = m || ''; ppStatus.className = 'status' + (k ? ' ' + k : ''); }
  function ppRead() {
    return { enabled: pp.on.checked, type: pp.type.value, title: pp.title.value.trim(), message: pp.msg.value.trim(), buttonLabel: pp.btn.value.trim(),
      buttonUrl: normUrl(pp.url.value.trim()), start: pp.start.value, end: pp.end.value, repeat: pp.repeat.checked };
  }
  function ppFill(p) {
    pp.on.checked = !!p.enabled; pp.type.value = p.type || 'notice'; pp.title.value = p.title || ''; pp.msg.value = p.message || '';
    pp.btn.value = p.buttonLabel || ''; pp.url.value = p.buttonUrl || ''; pp.start.value = p.start || ''; pp.end.value = p.end || ''; pp.repeat.checked = !!p.repeat;
  }
  function loadPopup() {
    api('GET', null, '?admin=1', BASE + '/api/popup').then(function (j) { ppFill(j.popup || {}); ppSay(''); })
      .catch(function () { ppSay('The pop-up settings could not be loaded.', 'err'); });
  }
  pp.tpl.addEventListener('change', function () {
    var t = TPL[pp.tpl.value]; if (!t) return;
    pp.type.value = t.type; pp.title.value = t.title; pp.msg.value = t.message;
    ppSay('Template added. Replace the [brackets] with the real details.');
    pp.tpl.value = '';
  });
  $('pp-preview').addEventListener('click', function () {
    var p = ppRead();
    if (!p.title && !p.message) { ppSay('Write a title or a message to preview it.', 'err'); return; }
    if (window.BAT_popupPreview) window.BAT_popupPreview(p);
  });
  $('pp-save').addEventListener('click', function () {
    var p = ppRead(), b = this;
    if (/\[[^\]]+\]/.test(p.title + ' ' + p.message) && p.enabled) { ppSay('There are still [brackets] in the text. Replace them with the real details first.', 'err'); return; }
    b.disabled = true; ppSay('Saving');
    api('PUT', p, '', BASE + '/api/popup').then(function (j) {
      ppFill(j.popup); ppSay(j.popup.enabled ? 'Saved. The pop-up is live.' : 'Saved. The pop-up is off.', 'ok');
    }).catch(function (e) { ppSay(netMsg(e), 'err'); }).then(function () { b.disabled = false; });
  });

  /* ---------- resume session ---------- */
  try {
    var saved = sessionStorage.getItem(KEY);
    if (saved) { pw = saved; api('GET', null, '?verify=1').then(enter).catch(function () { pw = ''; }); }
  } catch (_) {}
})();

/* account bar: "Change password" is a placeholder until it is set up */
(function () {
  var b = document.getElementById('chpw'), m = document.getElementById('acct-msg');
  if (b && m) b.addEventListener('click', function () { m.textContent = 'Changing the password from here is not set up yet. It will be available soon.'; m.className = 'status acct__msg'; });
})();
