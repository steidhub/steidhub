// POST /api/wa-ref — registra un clic a WhatsApp (sin datos personales del formulario)
const ok = () => new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
export async function onRequestPost({ request, env }) {
  try {
    const origin = request.headers.get('Origin');
    if (origin && origin !== new URL(request.url).origin) return new Response('forbidden', { status: 403 });
    const body = await request.text();
    if (body.length > 4000) return new Response('too long', { status: 413 });
    const d = JSON.parse(body);
    if (!/^SH-[A-Z0-9]{5}$/.test(d.ref || '')) return new Response('bad ref', { status: 400 });
    const s = (v, n) => (typeof v === 'string' ? v.slice(0, n) : null) || null;
    await env.DB.prepare('INSERT OR IGNORE INTO wa_refs (ref, created_at, fbc, fbp, ip, ua, url, msg) VALUES (?,?,?,?,?,?,?,?)')
      .bind(d.ref, new Date().toISOString(), s(d.fbc, 300), s(d.fbp, 120),
        request.headers.get('CF-Connecting-IP'), s(request.headers.get('User-Agent'), 400), s(d.url, 500), s(d.msg, 300)).run();
    return ok();
  } catch (e) { return ok(); }
}
