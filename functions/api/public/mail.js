export async function onRequest({ request }) {
  const origin = request.headers.get('Origin') || '';
  if (request.method === 'OPTIONS' || request.method === 'POST') {
    const r = await fetch('https://app.steidhub.com/api/public/mail', {
      method: request.method,
      headers: { 'content-type': 'application/json', origin, 'cf-connecting-ip': request.headers.get('cf-connecting-ip') || '' },
      body: request.method === 'POST' ? await request.text() : undefined
    });
    return new Response(r.body, { status: r.status, headers: r.headers });
  }
  return new Response('Método no permitido', { status: 405, headers: { Allow: 'POST' } });
}
