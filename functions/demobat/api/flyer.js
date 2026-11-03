import { SEED } from '../_lib/seed.js';
/**
 * BAT — show flyers  (Cloudflare Pages Function)
 *
 *   GET    /api/flyer?id=<showId>     public image (JPEG / PNG / WebP)
 *   PUT    /api/flyer                 body { id, dataUrl }  or  { id, fromUrl }   (admin password)
 *   DELETE /api/flyer?id=<showId>     removes the flyer                           (admin password)
 *
 * The admin page shrinks every upload to a web-friendly JPEG before sending it.
 */
import { json, authorized } from './tour.js';
import { fetchLimited } from './net-util.js';

const MAX_BYTES = 4000000;
const okId = (s) => typeof s === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(s);

function sniff(b) {
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
  if (b.length > 12 && b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'image/webp';
  return '';
}
function toB64(bytes) {
  let s = ''; const step = 0x8000;
  for (let i = 0; i < bytes.length; i += step) s += String.fromCharCode.apply(null, bytes.subarray(i, i + step));
  return btoa(s);
}
function fromB64(b64) {
  const bin = atob(b64); const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();
  if (method === 'OPTIONS') return new Response(null, { status: 204, headers: { allow: 'GET, PUT, DELETE, OPTIONS' } });
  const seedFlyer = async (id) => {
    if (!SEED || !SEED.flyers || !SEED.flyers[id] || !env.ASSETS) return null;
    const base = url.pathname.replace(/\/api\/flyer.*$/, '');
    const r = await env.ASSETS.fetch(new URL(base + SEED.flyers[id], url.origin));
    return r.ok ? new Response(r.body, { headers: { 'content-type': 'image/jpeg', 'cache-control': 'public, max-age=3600' } }) : null;
  };
  if (!env.BAT_KV) {
    if (method === 'GET') { const sf = await seedFlyer(url.searchParams.get('id')); if (sf) return sf; return json({ error: 'Not found.' }, 404); }
    return json({ error: 'KV binding BAT_KV is missing.' }, 500);
  }

  if (method === 'GET') {
    const id = url.searchParams.get('id');
    if (!okId(id)) return json({ error: 'Not found.' }, 404);
    const raw = await env.BAT_KV.get('flyer:' + id);
    if (!raw) { const sf = await seedFlyer(id); if (sf) return sf; }
    if (!raw) return json({ error: 'Not found.' }, 404);
    let rec; try { rec = JSON.parse(raw); } catch { return json({ error: 'Not found.' }, 404); }
    return new Response(fromB64(rec.data), { headers: { 'content-type': rec.type, 'cache-control': 'public, max-age=3600', 'x-content-type-options': 'nosniff' } });
  }

  const a = await authorized(request, env);
  if (!a.ok) return a.res;

  if (method === 'DELETE') {
    const id = url.searchParams.get('id');
    if (!okId(id)) return json({ error: 'Invalid id.' }, 400);
    if (env.BAT_KV.delete) await env.BAT_KV.delete('flyer:' + id);
    return json({ ok: true });
  }

  if (method === 'PUT' || method === 'POST') {
    let body; try { body = await request.json(); } catch { return json({ error: 'Invalid request.' }, 400); }
    if (!body || !okId(body.id)) return json({ error: 'Invalid show id.' }, 400);
    let bytes;
    try {
      if (typeof body.dataUrl === 'string') {
        const m = /^data:image\/(?:jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(body.dataUrl);
        if (!m) return json({ error: 'The file must be a JPG, PNG or WebP image.' }, 400);
        bytes = fromB64(m[1]);
      } else if (typeof body.fromUrl === 'string') {
        const got = await fetchLimited(body.fromUrl, env, { accept: 'image/*', maxBytes: MAX_BYTES });
        bytes = got.bytes;
      } else return json({ error: 'Send an image.' }, 400);
    } catch (e) { return json({ error: e.message || 'Could not read the image.' }, 422); }
    if (bytes.length > MAX_BYTES) return json({ error: 'The image is too large (max 4 MB).' }, 413);
    const type = sniff(bytes);
    if (!type) return json({ error: 'The file must be a JPG, PNG or WebP image.' }, 400);
    await env.BAT_KV.put('flyer:' + body.id, JSON.stringify({ type, data: toB64(bytes) }));
    return json({ ok: true, v: Date.now().toString(36), type, bytes: bytes.length });
  }
  return json({ error: 'Method not allowed.' }, 405);
}
