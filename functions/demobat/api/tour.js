/**
 * BAT — tour dates API  (Cloudflare Pages Function)
 *
 *   GET  /api/tour             public, returns { shows: [...], updated }
 *   GET  /api/tour?verify=1    checks the admin password (Authorization: Bearer <password>)
 *   PUT  /api/tour             saves { shows: [...] }      (needs the admin password)
 *   Each show: date, city, venue, tickets, note, soldOut, status ('', cancelled, postponed, moved),
 *   update (comment), landing (bool), slug, time, desc, flyerV.
 *
 * Setup (once, in the Cloudflare dashboard):
 *   1. Workers & Pages > KV > create a namespace, e.g. "bat-tour".
 *   2. Your Pages project > Settings > Bindings > add KV namespace, variable name:  BAT_KV
 *   3. Settings > Variables and Secrets > add secret:  ADMIN_PASSWORD
 *   4. Re-deploy.
 */

import { SEED } from '../_lib/seed.js';
export const KEY = 'tour';
const MAX_SHOWS = 300;

export const json = (data, status = 200, extra = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra },
  });

export const str = (v, max) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : '');

function validDate(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return false;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3];
}

function cleanUrl(v) {
  const s = str(v, 500);
  if (!s) return '';
  try {
    const u = new URL(/^https?:\/\//i.test(s) ? s : 'https://' + s);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.toString() : '';
  } catch { return ''; }
}

const STATUSES = ['', 'cancelled', 'postponed', 'moved'];

function slugify(s) {
  return String(s || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70);
}

export function sanitize(input) {
  if (!Array.isArray(input)) throw new Error('"shows" must be a list.');
  if (input.length > MAX_SHOWS) throw new Error('Too many shows (max ' + MAX_SHOWS + ').');
  const used = new Set();
  const out = input.map((s, i) => {
    const date = str(s && s.date, 10);
    const city = str(s && s.city, 90);
    if (!validDate(date)) throw new Error('Show ' + (i + 1) + ': the date is not valid.');
    if (!city) throw new Error('Show ' + (i + 1) + ': the city is required.');
    const id = str(s.id, 40).replace(/[^A-Za-z0-9_-]/g, '') || crypto.randomUUID();
    const landing = s.landing === true;
    let slug = slugify(s.slug);
    if (landing) {
      if (slug.length < 3) slug = slugify(city + ' ' + date);
      let base = slug, n = 2;
      while (used.has(slug)) slug = base + '-' + n++;
      used.add(slug);
    } else slug = slug && !used.has(slug) ? slug : '';
    if (!landing && slug) used.add(slug);
    return {
      id,
      date,
      city,
      venue: str(s.venue, 120),
      tickets: cleanUrl(s.tickets),
      note: str(s.note, 120),
      soldOut: s.soldOut === true,
      status: STATUSES.includes(s.status) ? s.status : '',
      update: str(s.update, 300),
      landing,
      slug,
      time: str(s.time, 60),
      desc: (typeof s.desc === 'string' ? s.desc.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, ' ').trim().slice(0, 1500) : ''),
      flyerV: str(s.flyerV, 20).replace(/[^A-Za-z0-9]/g, ''),
    };
  });
  out.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  return out;
}

async function sameSecret(a, b) {
  const enc = new TextEncoder();
  const [x, y] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(a)), crypto.subtle.digest('SHA-256', enc.encode(b))]);
  const p = new Uint8Array(x), q = new Uint8Array(y);
  let diff = 0;
  for (let i = 0; i < p.length; i++) diff |= p[i] ^ q[i];
  return diff === 0;
}

export async function authorized(request, env) {
  if (!env.ADMIN_PASSWORD) return { ok: false, res: json({ error: 'ADMIN_PASSWORD is not configured on the server.' }, 500) };
  const header = request.headers.get('authorization') || '';
  const given = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (given && (await sameSecret(given, env.ADMIN_PASSWORD))) return { ok: true };
  await new Promise((r) => setTimeout(r, 500)); // slow down guessing
  return { ok: false, res: json({ error: 'Wrong password.' }, 401) };
}

export async function read(env) {
  if (!env.BAT_KV) return SEED ? SEED.tour : { shows: [], updated: null, warning: 'KV binding BAT_KV is missing.' };
  const raw = await env.BAT_KV.get(KEY);
  if (!raw) return SEED ? SEED.tour : { shows: [], updated: null };
  try { return JSON.parse(raw); } catch { return { shows: [], updated: null }; }
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();

  if (method === 'OPTIONS') return new Response(null, { status: 204, headers: { allow: 'GET, PUT, POST, OPTIONS' } });

  if (method === 'GET') {
    if (url.searchParams.has('verify')) {
      const a = await authorized(request, env);
      return a.ok ? json({ ok: true }) : a.res;
    }
    return json(await read(env));
  }

  if (method === 'PUT' || method === 'POST') {
    const a = await authorized(request, env);
    if (!a.ok) return a.res;
    if (!env.BAT_KV) return json({ error: 'KV binding BAT_KV is missing. See functions/api/tour.js for setup.' }, 500);
    let body;
    try { body = await request.json(); } catch { return json({ error: 'Invalid request.' }, 400); }
    let shows;
    try { shows = sanitize(body && body.shows); } catch (e) { return json({ error: e.message }, 400); }
    const data = { shows, updated: new Date().toISOString() };
    const before = await read(env);
    await env.BAT_KV.put(KEY, JSON.stringify(data));
    // drop flyers of shows that no longer exist
    const keep = new Set(shows.map((x) => x.id));
    for (const old of before.shows || []) {
      if (old && old.id && !keep.has(old.id) && env.BAT_KV.delete) { try { await env.BAT_KV.delete('flyer:' + old.id); } catch (e) {} }
    }
    return json({ ok: true, ...data });
  }

  return json({ error: 'Method not allowed.' }, 405, { allow: 'GET, PUT, POST, OPTIONS' });
}
