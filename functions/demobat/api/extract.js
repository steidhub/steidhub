/**
 * BAT — read a ticket page and pull out the show details  (Cloudflare Pages Function)
 *
 *   POST /api/extract   body { url }   (admin password)
 *   -> { ok, source, title, description, image, venue, city, startDate }
 *
 * It looks for the page's structured event data (schema.org JSON-LD) and the usual
 * share tags (og:title, og:description, og:image). Some ticket sites block automatic
 * reading; then the admin just fills the details in by hand.
 */
import { json, authorized } from './tour.js';
import { fetchLimited } from './net-util.js';

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', hellip: '…' };
function decode(s) {
  return String(s || '').replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') { const n = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); try { return String.fromCodePoint(n); } catch { return ' '; } }
    return ENT[e.toLowerCase()] !== undefined ? ENT[e.toLowerCase()] : m;
  });
}
const clean = (s, max) => decode(String(s || '').replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n\n').replace(/<[^>]+>/g, ' ')).replace(/[ \t ]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim().slice(0, max);

function metas(html) {
  const out = {};
  for (const m of html.matchAll(/<meta\s+[^>]*>/gi)) {
    const tag = m[0]; const attrs = {};
    for (const a of tag.matchAll(/([a-zA-Z:-]+)\s*=\s*("([^"]*)"|'([^']*)')/g)) attrs[a[1].toLowerCase()] = a[3] !== undefined ? a[3] : a[4];
    const k = (attrs.property || attrs.name || '').toLowerCase();
    if (k && attrs.content !== undefined && out[k] === undefined) out[k] = decode(attrs.content);
  }
  return out;
}

function ldEvents(html) {
  const found = [];
  const walk = (n) => {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) return n.forEach(walk);
    const t = [].concat(n['@type'] || []).join(' ');
    if (/Event\b/.test(t)) found.push(n);
    if (n['@graph']) walk(n['@graph']);
  };
  for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { walk(JSON.parse(m[1].trim())); } catch (e) { /* ignore broken blocks */ }
  }
  return found;
}

const first = (v) => (Array.isArray(v) ? v[0] : v);
function imageOf(v) { v = first(v); return v && typeof v === 'object' ? v.url || v.contentUrl || '' : typeof v === 'string' ? v : ''; }

export async function onRequest({ request, env }) {
  if (request.method.toUpperCase() !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  const a = await authorized(request, env);
  if (!a.ok) return a.res;
  let body; try { body = await request.json(); } catch { return json({ error: 'Invalid request.' }, 400); }
  const link = typeof body.url === 'string' ? body.url.trim() : '';
  if (!link) return json({ error: 'Paste the ticket link first.' }, 400);
  let got;
  try { got = await fetchLimited(/^https?:\/\//i.test(link) ? link : 'https://' + link, env, { accept: 'text/html,application/xhtml+xml', maxBytes: 1800000 }); }
  catch (e) { return json({ ok: false, error: e.message || 'Could not read that page.' }, 422); }
  const html = new TextDecoder('utf-8').decode(got.bytes);
  const base = got.url;
  const abs = (u) => { try { return u ? new URL(decode(u), base).toString() : ''; } catch { return ''; } };
  const m = metas(html);
  const ev = ldEvents(html)[0] || {};
  const loc = first(ev.location) || {};
  const addr = loc.address && typeof loc.address === 'object' ? loc.address : {};
  const city = [addr.addressLocality, addr.addressRegion].filter((x) => typeof x === 'string' && x).join(', ');
  const titleTag = (/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html) || [])[1];
  const out = {
    ok: true,
    source: new URL(base).hostname.replace(/^www\./, ''),
    title: clean(ev.name || m['og:title'] || m['twitter:title'] || titleTag, 160),
    description: clean(ev.description || m['og:description'] || m['description'] || m['twitter:description'], 1500),
    image: abs(imageOf(ev.image) || m['og:image'] || m['og:image:url'] || m['twitter:image']),
    venue: clean(loc.name, 120),
    city: clean(city, 90),
    startDate: typeof ev.startDate === 'string' ? ev.startDate.slice(0, 25) : '',
  };
  if (!out.title && !out.description && !out.image) return json({ ok: false, error: 'No show details found on that page. Fill them in by hand.' }, 422);
  return json(out);
}
