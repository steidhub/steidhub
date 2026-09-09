const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
});

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') {
    const response = json({ success: false, error: 'Método no permitido.' }, 405);
    response.headers.set('Allow', 'POST');
    return response;
  }
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) {
    return json({ success: false, error: 'Origen no permitido.' }, 403);
  }
  if (!request.headers.get('Content-Type')?.toLowerCase().includes('application/json')) {
    return json({ success: false, error: 'Envía los datos en formato JSON.' }, 415);
  }
  let data;
  try {
    const body = await request.text();
    if (body.length > 20000) return json({ success: false, error: 'La solicitud es demasiado larga.' }, 413);
    data = JSON.parse(body);
  } catch {
    return json({ success: false, error: 'No pudimos leer los datos enviados.' }, 400);
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return json({ success: false, error: 'Datos inválidos.' }, 400);
  }
  const limits = { nombre: 160, empresa: 200, email: 254, whatsapp: 40, necesidad: 160, etapa: 100, proyecto: 5000 };
  const values = {};
  for (const [key, limit] of Object.entries(limits)) {
    if (data[key] != null && typeof data[key] !== 'string') return json({ success: false, error: 'Revisa los campos del formulario.' }, 400);
    values[key] = (data[key] || '').trim();
    if (values[key].length > limit) return json({ success: false, error: 'Uno de los campos supera la longitud permitida.' }, 400);
  }
  if (values.nombre.length < 2 || !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(values.email) ||
      (values.whatsapp.match(/\d/g) || []).length < 9 || values.necesidad.length < 2 ||
      data.consentimiento_contacto !== true || data.consentimiento_privacidad !== true) {
    return json({ success: false, error: 'Completa los campos obligatorios y acepta ambas autorizaciones.' }, 400);
  }
  try {
    if (!env.DB) throw new Error('Missing DB binding');
    const result = await env.DB.prepare(`INSERT INTO leads
      (nombre, empresa, email, whatsapp, necesidad, etapa, proyecto,
       consentimiento_contacto, consentimiento_privacidad, ip, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(values.nombre, values.empresa, values.email, values.whatsapp, values.necesidad,
        values.etapa, values.proyecto, 1, 1, request.headers.get('CF-Connecting-IP') || null,
        (request.headers.get('User-Agent') || '').slice(0, 1000)).run();
    if (!result.success) throw new Error('Insert failed');
    return json({ success: true }, 201);
  } catch {
    return json({ success: false, error: 'No pudimos guardar tu solicitud. Inténtalo nuevamente en unos minutos.' }, 503);
  }
}
