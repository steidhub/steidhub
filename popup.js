/* Steid Hub — pop-up de asesoría y diagnóstico gratis.
   Módulo único para la home y las landings de Google Ads y Meta Ads.

   Cuándo aparece:
   - A visitantes nuevos, o a quien no lo vio en los últimos 7 días.
   - En escritorio y en móvil (antes sólo salía en escritorio).
   - Se marca como visto al mostrarse, así no vuelve a salir al pasar de una
     página a otra en la misma visita.
   - Cada oferta lleva su propia cuenta, con data-popup-key en el marcado.
   - Para probarlo sin esperar 7 días: añade ?popup=1 a la URL. */
(() => {
  'use strict';
  const popup = document.getElementById('popup');
  if (!popup) return;

  // una clave por oferta: el pop-up de Ads y el del descuento se cuentan
  // por separado, para que ver uno no oculte el otro durante 7 días
  const CLAVE = 'steidhub_popup_' + (popup.dataset.popupKey || 'general');
  const DIAS = 7;
  const DEMORA = matchMedia('(max-width:767px)').matches ? 6000 : 3000;

  // el almacenamiento puede estar bloqueado (Safari privado, webviews de apps):
  // si falla, el pop-up sigue funcionando en vez de romperse
  const leer = () => { try { return Number(localStorage.getItem(CLAVE)) || 0; } catch (e) { return 0; } };
  const marcar = () => { try { localStorage.setItem(CLAVE, String(Date.now())); } catch (e) { /* sin almacenamiento */ } };
  const forzado = /[?&]popup=1(&|$)/.test(location.search);
  const yaVisto = () => !forzado && Date.now() - leer() < DIAS * 864e5;

  const closeBtn = popup.querySelector('.popup__close');
  const link = popup.querySelector('.popup__link');
  let lastFocus = null;

  const close = () => {
    popup.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { popup.hidden = true; }, 400);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };
  const open = () => {
    if (yaVisto() || popup.classList.contains('is-open')) return;
    // no interrumpir a quien está escribiendo en el formulario
    const activo = document.activeElement;
    if (activo && activo.closest && activo.closest('form')) return;
    marcar();
    lastFocus = activo;
    popup.hidden = false;
    // reflow forzado en vez de rAF: si la pestaña está en segundo plano rAF no
    // corre y el overlay quedaría invisible pero bloqueando los clics
    void popup.offsetWidth;
    popup.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  };

  popup.querySelectorAll('[data-popup-close]').forEach((el) => el.addEventListener('click', close));
  if (link) link.addEventListener('click', () => setTimeout(close, 60));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && popup.classList.contains('is-open')) close(); });

  if (!yaVisto()) setTimeout(open, DEMORA);
})();
