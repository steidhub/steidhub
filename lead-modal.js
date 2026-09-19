/* One shared, consented lead flow across Steid Hub. GTM receives metadata only. */
(() => {
  'use strict';
  const WA_NUMBER = '51983595390';
  const PRIVACY = 'https://drive.google.com/file/d/1i9qlP-c7zxRzGWlqiz-5Qmx7Aqz8kLBv/view?usp=drive_link';
  const track = (event, details = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, form_id: 'steidhub_lead', page_path: location.pathname, ...details });
  };
  const visibleLabel = (el) => (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);
  const sourceFor = (el) => {
    if (el.dataset.ctaSource) return el.dataset.ctaSource;
    if (el.closest('.popup')) return 'promo_popup';
    if (el.closest('.wa')) return 'whatsapp_widget';
    if (el.closest('header,.nav,.lp-nav')) return 'navigation';
    if (el.closest('footer')) return 'footer';
    if (el.closest('.hero,.lp-hero')) return 'hero';
    return 'page_content';
  };
  const isOwnWhatsApp = (url) => /^https:\/\/(?:api\.)?wa\.me\/51983595390(?:\?|$)/.test(url) || /^https:\/\/api\.whatsapp\.com\/send\?/.test(url);
  const fullForm = document.getElementById('contactForm');
  const modal = document.createElement('div');
  modal.className = 'lead-modal';
  modal.hidden = true;
  modal.innerHTML = `<div class="lead-modal__backdrop" data-lead-close></div>
    <div class="lead-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="steid-lead-title">
      <button class="lead-modal__close" type="button" data-lead-close aria-label="Cerrar formulario">×</button>
      <h2 id="steid-lead-title">Conversemos sobre tu proyecto</h2>
      <p class="lead-modal__intro">Déjanos tus datos y continúa por WhatsApp.</p>
      <p class="lead-modal__context" hidden></p>
      <form id="steid-lead-modal-form" novalidate autocomplete="on">
        <label class="lead-modal__field">Nombre <input name="first_name" autocomplete="given-name" maxlength="80" required></label>
        <label class="lead-modal__field">Apellido <input name="last_name" autocomplete="family-name" maxlength="80" required></label>
        <label class="lead-modal__field">Correo electrónico <input name="email" type="email" autocomplete="email" inputmode="email" maxlength="254" required></label>
        <label class="lead-modal__field">Teléfono <span>(opcional)</span><input name="phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="40"></label>
        <label class="lead-modal__consent"><input name="consent" type="checkbox" required><span>Autorizo a Steid Hub a contactarme para atender esta consulta.</span></label>
        <label class="lead-modal__consent"><input name="privacy" type="checkbox" required><span>He leído y acepto las condiciones de uso y tratamiento de mis datos descritas en la <a href="${PRIVACY}" target="_blank" rel="noopener">política de privacidad</a>.</span></label>
        <p class="lead-modal__error" role="alert" aria-live="polite"></p>
        <button class="lead-modal__submit" type="submit">Continuar por WhatsApp</button>
      </form><a class="lead-modal__fallback" href="#" hidden>Ir a WhatsApp sin guardar datos</a>
      <p class="lead-modal__note">No enviaremos tus datos personales a Analytics.</p>
    </div>`;
  document.body.append(modal);
  const form = modal.querySelector('form');
  const error = modal.querySelector('.lead-modal__error');
  const submit = modal.querySelector('.lead-modal__submit');
  const fallback = modal.querySelector('.lead-modal__fallback');
  const contextLabel = modal.querySelector('.lead-modal__context');
  let context = null;
  let previousFocus = null;
  let started = false;

  const close = () => {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('lead-modal-open');
    submit.disabled = false;
    submit.textContent = 'Continuar por WhatsApp';
    error.textContent = '';
    fallback.hidden = true;
    form.reset();
    previousFocus?.focus?.();
  };
  const open = (el, destination) => {
    if (!modal.hidden) return;
    previousFocus = document.activeElement;
    context = { cta_source: sourceFor(el), cta_label: visibleLabel(el), destination };
    contextLabel.textContent = context.cta_label ? `Consulta: ${context.cta_label}` : '';
    contextLabel.hidden = !context.cta_label;
    fallback.href = destination;
    fallback.hidden = true;
    started = false;
    modal.hidden = false;
    document.body.classList.add('lead-modal-open');
    track('lead_form_open', { cta_source: context.cta_source, cta_label: context.cta_label, form_type: 'floating' });
    modal.querySelector('[name="first_name"]').focus();
  };
  document.addEventListener('click', (event) => {
    const el = event.target.closest('a[href],button[data-lead-form]');
    if (!el || modal.contains(el)) return;
    const href = el.href || '';
    const ownWa = isOwnWhatsApp(href);
    const contactCta = href && new URL(href, location.href).hash === '#contacto';
    if (!ownWa && !contactCta && !el.hasAttribute('data-lead-form')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (fullForm) {
      el.closest('.popup')?.querySelector('[data-popup-close]')?.click();
      const target = fullForm.closest('#contacto') || document.getElementById('contacto') || fullForm;
      target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      return;
    }
    const destination = ownWa ? href : `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola, Steid Hub. Deseo conversar sobre mi proyecto.')}`;
    open(el, destination);
  }, true);
  modal.addEventListener('click', (event) => { if (event.target.closest('[data-lead-close]')) close(); });
  fallback.addEventListener('click', (event) => {
    event.preventDefault();
    track('whatsapp_click', { cta_source: context.cta_source, contact_method: 'WhatsApp', form_type: 'floating', lead_saved: false });
    setTimeout(() => location.assign(context.destination), 350);
  });
  document.addEventListener('keydown', (event) => {
    if (modal.hidden) return;
    if (event.key === 'Escape') close();
    if (event.key === 'Tab') {
      const focusables = [...modal.querySelectorAll('button,input,a')].filter((node) => !node.disabled && node.getClientRects().length);
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  form.addEventListener('input', (event) => {
    if (!started && event.target.matches('input') && context) {
      started = true;
      track('lead_form_start', { cta_source: context.cta_source, form_type: 'floating' });
    }
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    if (!form.checkValidity()) { form.reportValidity(); error.textContent = 'Completa los campos obligatorios y las autorizaciones.'; return; }
    const fields = new FormData(form);
    const phone = String(fields.get('phone') || '').trim();
    if (phone && (phone.match(/\d/g) || []).length < 9) { error.textContent = 'Revisa el número de teléfono o déjalo vacío.'; form.elements.phone.focus(); return; }
    track('lead_form_submit', { cta_source: context.cta_source, form_type: 'floating' });
    submit.disabled = true;
    submit.textContent = 'Enviando…';
    error.textContent = '';
    const payload = {
      nombre: `${String(fields.get('first_name')).trim()} ${String(fields.get('last_name')).trim()}`,
      email: String(fields.get('email')).trim(), whatsapp: phone,
      necesidad: 'Consulta desde formulario flotante', etapa: '', empresa: '',
      proyecto: `Origen: ${location.pathname} · ${context.cta_source} · ${context.cta_label}`,
      origen: location.pathname, lead_flow: 'whatsapp_modal',
      consentimiento_contacto: true, consentimiento_privacidad: true
    };
    try {
      const response = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error('save_failed');
      track('generate_lead', { cta_source: context.cta_source, form_type: 'floating', lead_destination: 'whatsapp' });
      track('whatsapp_click', { cta_source: context.cta_source, contact_method: 'WhatsApp', form_type: 'floating', lead_saved: true });
      // Give GTM a brief window to dispatch the outbound event before navigation.
      setTimeout(() => location.assign(context.destination), 350);
    } catch {
      error.textContent = 'No pudimos guardar tu solicitud. Puedes reintentarlo o continuar por WhatsApp sin guardar los datos.';
      fallback.hidden = false;
      submit.disabled = false;
      submit.textContent = 'Continuar por WhatsApp';
    }
  });

  // The existing full contact form remains available and uses the same event funnel.
  if (fullForm) {
    let fullStarted = false, fullSeen = false;
    fullForm.addEventListener('input', () => {
      if (!fullStarted) { fullStarted = true; track('lead_form_start', { cta_source: 'contact_section', form_type: 'embedded' }); }
    });
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (fullSeen || !entries.some((entry) => entry.isIntersecting)) return;
        fullSeen = true;
        track('lead_form_open', { cta_source: 'contact_section', form_type: 'embedded' });
        observer.disconnect();
      }, { threshold: 0.25 });
      observer.observe(fullForm);
    }
  }
})();
