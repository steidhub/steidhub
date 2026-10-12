/* Steid Hub · landing de diagnóstico: formulario → /api/leads (D1) */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const form = $('#form'), err = $('#dx-err');
  if (!form) return;
  const btn = $('.dx-btn', form);
  const push = (event, extra) => { (window.dataLayer = window.dataLayer || []).push(Object.assign({ event, lp: 'diagnostico', form_id: 'diagnostico_redes_web', page_path: location.pathname }, extra || {})); };
  let started = false;
  form.addEventListener('focusin', () => { if (!started) { started = true; push('lp_form_start'); } });

  /* Anillo de puntaje del ejemplo */
  const ring = $('#ring'), rn = $('#ringn'), paper = $('#paper');
  if (ring && 'IntersectionObserver' in window) {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    new IntersectionObserver((es, o) => {
      if (!es[0].isIntersecting) return; o.disconnect();
      const to = 72, t0 = performance.now();
      const step = t => { const k = reduce ? 1 : Math.min(1, (t - t0) / 1600), v = Math.round(to * (1 - Math.pow(1 - k, 3))); ring.style.setProperty('--p', v); rn.textContent = v; if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }, { threshold: .4 }).observe(paper);
  } else if (ring) { ring.style.setProperty('--p', 72); rn.textContent = 72; }

  const looksLikeLink = v => { v = v.trim(); return v.length >= 4 && (/\./.test(v) || /^@/.test(v) || /^(https?:)?\/\//i.test(v)) && !/\s/.test(v); };
  const digits = v => (v.match(/\d/g) || []).length;
  const fail = (msg, el) => { err.textContent = msg; if (el) el.focus(); return false; };

  form.addEventListener('submit', async e => {
    e.preventDefault(); err.textContent = '';
    const f = new FormData(form), g = k => String(f.get(k) || '').trim();
    const link1 = g('link1'), link2 = g('link2'), nombre = g('nombre'), tipo = g('tipo'), email = g('email'), wa = g('whatsapp');
    if (!looksLikeLink(link1)) return fail('Escribe el enlace de tu web o de tu red social (por ejemplo, instagram.com/tuusuario).', form.link1);
    if (link2 && !looksLikeLink(link2)) return fail('Revisa el segundo enlace o déjalo vacío.', form.link2);
    if (nombre.length < 2) return fail('Escribe tu nombre.', form.nombre);
    if (!tipo) return fail('Elige qué eres: agente, inmobiliaria, constructora u otro.', form.tipo);
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) return fail('Revisa tu correo: ahí te enviaremos la hoja.', form.email);
    if (digits(wa) < 9) return fail('Escribe tu WhatsApp con al menos 9 dígitos.', form.whatsapp);
    if (!form.c1.checked || !form.c2.checked) return fail('Marca las dos autorizaciones para continuar.', form.c1.checked ? form.c2 : form.c1);

    btn.disabled = true; const txt = btn.textContent; btn.textContent = 'Enviando…';
    const payload = {
      nombre, empresa: '', email, whatsapp: wa,
      necesidad: 'Diagnóstico de redes y web', etapa: tipo,
      proyecto: 'Enlace principal: ' + link1 + (link2 ? '\nOtro enlace: ' + link2 : '') + '\nOrigen: ' + location.pathname,
      consentimiento_contacto: true, consentimiento_privacidad: true,
      origen: location.pathname, lead_flow: 'diagnostico'
    };
    try {
      const r = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.success) throw new Error(j.error || 'No pudimos enviar tu solicitud.');
      push('generate_lead', { lead_type: 'diagnostico_redes_web' });
      form.classList.add('sent'); form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (ex) {
      err.textContent = ex.message || 'No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.';
      btn.disabled = false; btn.textContent = txt;
    }
  });
})();
