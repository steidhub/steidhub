/** GET /api/geo  ->  { country: "PE" }  — the visitor's country from the connection (Cloudflare adds it). Used to pre-fill the sign-up form in the review demo. */
export async function onRequestGet({ request }) {
  const c = (request.cf && request.cf.country) || request.headers.get('cf-ipcountry') || '';
  return new Response(JSON.stringify({ country: /^[A-Z]{2}$/.test(c) ? c : '' }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}
