// Shared helpers for fetching a public web page/image from the server (used by /api/extract and /api/flyer).
// Not a route: it exports no onRequest.

const PRIVATE_V4 = [/^0\./, /^10\./, /^127\./, /^169\.254\./, /^172\.(1[6-9]|2\d|3[01])\./, /^192\.168\./, /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, /^22[4-9]\./, /^2[3-5]\d\./];

export function assertPublicUrl(raw, env) {
  let u;
  try { u = new URL(raw); } catch { throw new Error('That link does not look right.'); }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('Only web links (http or https) are allowed.');
  if (env && env.ALLOW_PRIVATE_FETCH) return u;          // local testing only
  const h = u.hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (!h || h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.local') || h.endsWith('.internal') || !h.includes('.') && !h.includes(':'))
    throw new Error('That address is not public.');
  if (/^\d+\.\d+\.\d+\.\d+$/.test(h) && PRIVATE_V4.some((r) => r.test(h))) throw new Error('That address is not public.');
  if (h.includes(':') && (h === '::1' || h === '::' || /^f[cd]/.test(h) || /^fe[89ab]/.test(h) || h.startsWith('::ffff:'))) throw new Error('That address is not public.');
  return u;
}

export async function fetchLimited(raw, env, { accept = '*/*', maxBytes = 1500000, timeout = 9000 } = {}) {
  let url = assertPublicUrl(raw, env).toString();
  for (let hop = 0; hop < 4; hop++) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), timeout);
    let res;
    try {
      res = await fetch(url, {
        redirect: 'manual', signal: ctl.signal,
        headers: { 'user-agent': 'Mozilla/5.0 (compatible; BATSiteBot/1.0; +official-band-website)', accept, 'accept-language': 'en-US,en;q=0.8' },
      });
    } catch (e) { clearTimeout(timer); throw new Error('The page did not answer in time.'); }
    if ([301, 302, 303, 307, 308].includes(res.status)) {
      clearTimeout(timer);
      const loc = res.headers.get('location');
      if (!loc) throw new Error('The page redirected nowhere.');
      url = assertPublicUrl(new URL(loc, url).toString(), env).toString();
      continue;
    }
    if (!res.ok) { clearTimeout(timer); throw new Error('The site answered with an error (' + res.status + '). Many ticket sites block automatic reading.'); }
    const reader = res.body.getReader();
    const chunks = []; let total = 0;
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.length;
        if (total > maxBytes) { try { await reader.cancel(); } catch (e) {} throw new Error('The file is too large.'); }
        chunks.push(value);
      }
    } finally { clearTimeout(timer); }
    const bytes = new Uint8Array(total); let o = 0;
    for (const c of chunks) { bytes.set(c, o); o += c.length; }
    return { res, bytes, url };
  }
  throw new Error('Too many redirects.');
}
