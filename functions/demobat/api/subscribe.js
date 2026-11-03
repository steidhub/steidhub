/**
 * BAT — community sign-ups  (Cloudflare Pages Function)
 *
 *   POST /api/subscribe              public: { name, email, country, countryName, birthday, consent, company }
 *   GET  /api/subscribe              admin (Bearer ADMIN_PASSWORD): JSON { subscribers: [...], count }
 *   GET  /api/subscribe?format=csv   admin: downloads subscribers.csv
 *
 * Uses the same KV binding (BAT_KV) and secret (ADMIN_PASSWORD) as /api/tour.
 * `company` is a hidden honeypot field: real people leave it empty.
 */

const KEY = 'subscribers';
const MAX = 50000;

const json = (data, status = 200, extra = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra } });

const str = (v, max) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max) : '');

function validDate(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return false;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3];
}

function ageOn(birthday, now = new Date()) {
  const [y, m, d] = birthday.split('-').map(Number);
  let age = now.getUTCFullYear() - y;
  if (now.getUTCMonth() + 1 < m || (now.getUTCMonth() + 1 === m && now.getUTCDate() < d)) age--;
  return age;
}

async function sameSecret(a, b) {
  const enc = new TextEncoder();
  const [x, y] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(a)), crypto.subtle.digest('SHA-256', enc.encode(b))]);
  const p = new Uint8Array(x), q = new Uint8Array(y);
  let diff = 0;
  for (let i = 0; i < p.length; i++) diff |= p[i] ^ q[i];
  return diff === 0;
}

async function authorized(request, env) {
  if (!env.ADMIN_PASSWORD) return { ok: false, res: json({ error: 'ADMIN_PASSWORD is not configured on the server.' }, 500) };
  const header = request.headers.get('authorization') || '';
  const given = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (given && (await sameSecret(given, env.ADMIN_PASSWORD))) return { ok: true };
  await new Promise((r) => setTimeout(r, 500));
  return { ok: false, res: json({ error: 'Wrong password.' }, 401) };
}

async function read(env) {
  const raw = await env.BAT_KV.get(KEY);
  if (!raw) return [];
  try { const v = JSON.parse(raw); return Array.isArray(v) ? v : []; } catch { return []; }
}

const csvCell = (v) => {
  let s = String(v == null ? '' : v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // stop spreadsheet formula injection
  return '"' + s.replace(/"/g, '""') + '"';
};

export async function onRequest({ request, env }) {
  const method = request.method.toUpperCase();
  const url = new URL(request.url);
  if (method === 'OPTIONS') return new Response(null, { status: 204, headers: { allow: 'GET, POST, OPTIONS' } });
  if (!env.BAT_KV) return json({ error: 'The sign-up list is not set up yet.' }, 500);

  if (method === 'POST') {
    let b;
    try { b = await request.json(); } catch { return json({ error: 'Invalid request.' }, 400); }
    if (b && b.company) return json({ ok: true }); // honeypot: pretend it worked
    const name = str(b && b.name, 80);
    const email = str(b && b.email, 120).toLowerCase();
    const country = str(b && b.country, 2).toUpperCase();
    const countryName = str(b && b.countryName, 80);
    const birthday = str(b && b.birthday, 10);
    if (name.length < 2) return json({ error: 'Please enter your name.' }, 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json({ error: 'That email does not look right.' }, 400);
    if (!/^[A-Z]{2}$/.test(country)) return json({ error: 'Please choose your country.' }, 400);
    if (!validDate(birthday) || birthday < '1900-01-01' || birthday > new Date().toISOString().slice(0, 10)) return json({ error: 'Please enter a valid birthday.' }, 400);
    if (ageOn(birthday) < 13) return json({ error: 'You need to be at least 13 to join.' }, 400);
    if (!(b && b.consent === true)) return json({ error: 'Please tick the box to join.' }, 400);

    const list = await read(env);
    if (list.length >= MAX) return json({ error: 'The list is full.' }, 507);
    const now = new Date().toISOString();
    const i = list.findIndex((x) => x.email === email);
    const row = { name, email, country, countryName, birthday, joined: i >= 0 ? list[i].joined : now, updated: now };
    if (i >= 0) list[i] = row; else list.push(row);
    await env.BAT_KV.put(KEY, JSON.stringify(list));
    return json({ ok: true });
  }

  if (method === 'GET') {
    const a = await authorized(request, env);
    if (!a.ok) return a.res;
    const list = await read(env);
    if (url.searchParams.get('format') === 'csv') {
      const head = ['Name', 'Email', 'Country', 'Country code', 'Birthday', 'Joined'];
      const rows = list.map((x) => [x.name, x.email, x.countryName, x.country, x.birthday, x.joined].map(csvCell).join(','));
      return new Response('﻿' + [head.map(csvCell).join(','), ...rows].join('\r\n'), {
        status: 200,
        headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="bat-community.csv"', 'cache-control': 'no-store' },
      });
    }
    return json({ count: list.length, subscribers: list });
  }

  return json({ error: 'Method not allowed.' }, 405, { allow: 'GET, POST, OPTIONS' });
}
