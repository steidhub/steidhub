// Inserta /wa-ref.js en todas las páginas HTML (atribución de clics a WhatsApp)
class Head { element(el) { el.prepend('<script src="/wa-ref.js?v=1"></script>', { html: true }); } }
export async function onRequest({ next }) {
  const res = await next();
  const type = res.headers.get('Content-Type') || '';
  if (!type.includes('text/html')) return res;
  return new HTMLRewriter().on('head', new Head()).transform(res);
}
