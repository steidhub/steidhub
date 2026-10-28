/* Steid Hub — registro anónimo de clics a WhatsApp para atribución en Meta (CAPI).
   No modifica el mensaje: guarda fbc/fbp, página y el texto prellenado. El servidor empareja
   el primer mensaje real con el clic más reciente (mismo texto, pocos minutos antes). */
(() => {
  'use strict';
  const WA_RE = /^(https:\/\/(api\.)?wa\.me\/|https:\/\/api\.whatsapp\.com\/send|whatsapp:\/\/send)/i;
  const ck = (n) => (document.cookie.match('(?:^|; )' + n + '=([^;]*)') || [])[1] || '';
  const ss = (k, v) => { try { if (v === undefined) return sessionStorage.getItem(k) || ''; sessionStorage.setItem(k, v); } catch (e) { return ''; } };
  try {
    const fbclid = new URLSearchParams(location.search).get('fbclid');
    if (fbclid) ss('sh_fbc', 'fb.1.' + Date.now() + '.' + fbclid);
  } catch (e) {}
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const newRef = () => { let r = ''; const a = new Uint8Array(5); crypto.getRandomValues(a); a.forEach((b) => { r += chars[b % chars.length]; }); return 'SH-' + r; };
  let last = 0;
  const record = (url) => {
    if (!url || !WA_RE.test(url)) return url;
    const now = Date.now(); if (now - last < 1500) return url; last = now;
    let msg = ''; try { msg = new URL(url).searchParams.get('text') || ''; } catch (e) {}
    const data = JSON.stringify({ ref: newRef(), msg: msg.slice(0, 300), fbc: ck('_fbc') || ss('sh_fbc'), fbp: ck('_fbp'), url: location.href.split('#')[0] });
    try {
      if (!(navigator.sendBeacon && navigator.sendBeacon('/api/wa-ref', new Blob([data], { type: 'application/json' }))))
        fetch('/api/wa-ref', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data, keepalive: true });
    } catch (e) {}
    return url;
  };
  window.SH_waRef = record;
  window.addEventListener('click', (e) => {
    const a = e.target && e.target.closest && e.target.closest('a[href]');
    if (a) record(a.href);
  }, true);
  const wo = window.open;
  window.open = function (url, ...rest) { if (typeof url === 'string') record(url); return wo.call(this, url, ...rest); };
  const la = Location.prototype.assign;
  try { Location.prototype.assign = function (url) { record(String(url)); return la.call(this, url); }; } catch (e) {}
})();
