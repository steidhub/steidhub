export async function onRequestPost({ request, params }) {
  const a = params.action;
  if (a !== 'login' && a !== 'data' && a !== 'pdf') return new Response('No encontrado', { status: 404 });
  const r = await fetch('https://app.steidhub.com/api/public/acm-ver/' + a, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-t': request.headers.get('x-t') || '', 'x-fwd-ip': request.headers.get('cf-connecting-ip') || '' },
    body: await request.text()
  });
  const h = { 'content-type': r.headers.get('content-type') || 'application/json', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' };
  const cd = r.headers.get('content-disposition'); if (cd) h['content-disposition'] = cd;
  return new Response(r.body, { status: r.status, headers: h });
}
export async function onRequest() { return new Response('Método no permitido', { status: 405, headers: { Allow: 'POST' } }); }
