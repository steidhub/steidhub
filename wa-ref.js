/* Steid Hub — referencia de clic a WhatsApp para atribución en Meta (CAPI).
   Al hacer clic en un enlace de WhatsApp agrega "(Ref SH-XXXXX)" al mensaje y guarda
   fbc/fbp de forma anónima. El "Contact" real lo envía el servidor cuando llega el mensaje. */
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
  const tag = (url) => {
    if (!url || !WA_RE.test(url)) return url;
    let u; try { u = new URL(url); } catch (e) { return url; }
    const base = u.searchParams.get('text') || 'Hola, Steid Hub.';
    if (/Ref SH-[A-Z0-9]{5}/.test(base)) return url;
    const ref = newRef();
    u.searchParams.delete('text');
    const rest = u.searchParams.toString();
    const out = u.origin + u.pathname + '?' + (rest ? rest + '&' : '') + 'text=' + encodeURIComponent(base + ' (Ref ' + ref + ')');
    const data = JSON.stringify({ ref, fbc: ck('_fbc') || ss('sh_fbc'), fbp: ck('_fbp'), url: location.href.split('#')[0] });
    try {
      if (!(navigator.sendBeacon && navigator.sendBeacon('/api/wa-ref', new Blob([data], { type: 'application/json' }))))
        fetch('/api/wa-ref', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data, keepalive: true });
    } catch (e) {}
    return out;
  };
  window.SH_waRef = tag;
  window.addEventListener('click', (e) => {
    const a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    const t = tag(a.href);
    if (t !== a.href) a.href = t;
  }, true);
  const wo = window.open;
  window.open = function (url, ...rest) { return wo.call(this, typeof url === 'string' ? tag(url) : url, ...rest); };
})();
