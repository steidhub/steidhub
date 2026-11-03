/**
 * BAT — site pop-up (notice / cancellation / refund / venue change)  (Cloudflare Pages Function)
 *
 *   GET /api/popup             public: { popup: {...} | null }   (only when switched on)
 *   GET /api/popup?admin=1     admin:  { popup: {...} }          (needs the admin password)
 *   PUT /api/popup             saves the pop-up                   (needs the admin password)
 *
 * Uses the same KV binding (BAT_KV) and password (ADMIN_PASSWORD) as /api/tour.
 */
import { json, str, authorized } from './tour.js';

const KEY = 'popup';
const TYPES = ['notice', 'cancelled', 'postponed', 'venue', 'refund'];

function validDay(s) { return /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s + 'T00:00:00Z')); }

function cleanUrl(v) {
  const s = str(v, 500);
  if (!s) return '';
  try {
    const u = new URL(/^https?:\/\//i.test(s) ? s : 'https://' + s);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.toString() : '';
  } catch { return ''; }
}

import { SEED } from '../_lib/seed.js';
export function sanitizePopup(b) {
  b = b || {};
  const message = typeof b.message === 'string' ? b.message.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, ' ').trim().slice(0, 1200) : '';
  const out = {
    enabled: b.enabled === true,
    type: TYPES.includes(b.type) ? b.type : 'notice',
    title: str(b.title, 90),
    message,
    buttonLabel: str(b.buttonLabel, 40),
    buttonUrl: cleanUrl(b.buttonUrl),
    start: validDay(str(b.start, 10)) ? str(b.start, 10) : '',
    end: validDay(str(b.end, 10)) ? str(b.end, 10) : '',
    repeat: b.repeat === true,
  };
  if (out.enabled && !out.title && !out.message) throw new Error('Add a title or a message before switching the pop-up on.');
  if (out.start && out.end && out.end < out.start) throw new Error('The end date is before the start date.');
  if (out.buttonUrl && !out.buttonLabel) out.buttonLabel = 'More info';
  return out;
}

async function read(env) {
  if (!env.BAT_KV) return SEED ? SEED.popup : null;
  const raw = await env.BAT_KV.get(KEY);
  if (!raw) return SEED ? SEED.popup : null;
  try { return JSON.parse(raw); } catch { return null; }
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();
  if (method === 'OPTIONS') return new Response(null, { status: 204, headers: { allow: 'GET, PUT, POST, OPTIONS' } });

  if (method === 'GET') {
    const p = await read(env);
    if (url.searchParams.has('admin')) {
      const a = await authorized(request, env);
      if (!a.ok) return a.res;
      return json({ popup: p || { enabled: false, type: 'notice', title: '', message: '', buttonLabel: '', buttonUrl: '', start: '', end: '', repeat: false } });
    }
    if (!p || !p.enabled) return json({ popup: null });
    return json({ popup: p });
  }

  if (method === 'PUT' || method === 'POST') {
    const a = await authorized(request, env);
    if (!a.ok) return a.res;
    if (!env.BAT_KV) return json({ error: 'KV binding BAT_KV is missing.' }, 500);
    let body;
    try { body = await request.json(); } catch { return json({ error: 'Invalid request.' }, 400); }
    let p;
    try { p = sanitizePopup(body); } catch (e) { return json({ error: e.message }, 400); }
    p.updated = new Date().toISOString();
    await env.BAT_KV.put(KEY, JSON.stringify(p));
    return json({ ok: true, popup: p });
  }
  return json({ error: 'Method not allowed.' }, 405);
}
