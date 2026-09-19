import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../functions/api/leads.js', import.meta.url), 'utf8');
const { onRequest } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
let writes = 0;
const env = { DB: { prepare: () => ({ bind: () => ({ run: async () => { writes++; return { success: true }; } }) }) } };
const payload = {
  nombre: 'Ana Pérez', email: 'ana@example.com', whatsapp: '',
  necesidad: 'Consulta desde formulario flotante', etapa: '', empresa: '', proyecto: 'Origen: /google-ads',
  consentimiento_contacto: true, consentimiento_privacidad: true, lead_flow: 'whatsapp_modal'
};
const send = async (data) => onRequest({
  request: new Request('https://steidhub.com/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://steidhub.com' }, body: JSON.stringify(data) }), env
});
assert.equal((await send(payload)).status, 201, 'Optional phone in modal');
assert.equal((await send({ ...payload, lead_flow: 'embedded' })).status, 400, 'Phone still required in full form');
assert.equal((await send({ ...payload, consentimiento_privacidad: false })).status, 400, 'Privacy consent required');
assert.equal((await send({ ...payload, whatsapp: '123' })).status, 400, 'Short optional phone rejected');
assert.equal(writes, 1, 'Only valid leads are saved');
console.log('PASS: modal lead API, optional phone and consent validation.');
