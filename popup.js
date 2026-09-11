/* Steid Hub — pop-ups de captación.
   Módulo único para la home, las landings y el blog.

   Se configura desde el marcado, sin tocar este archivo:
   - .popup                     cada pop-up de la página
   - data-popup-step="1|2"      orden: al cerrar el 1 se abre el 2
   - data-popup-key="ads"       cuenta propia por oferta (7 días)
   - data-popup-gate="dia"      en su lugar, una sola vez al día y compartido
                                entre todas las páginas que usen esa misma
                                puerta (el blog: si ya lo vio hoy en un post,
                                no vuelve a salir hasta el día siguiente)
   - data-popup-trigger         "tiempo:3000" (por defecto) o "ancla:#autor",
                                que espera a que esa parte entre en pantalla

   Encadenado: el segundo sólo sale si el visitante cierra el primero. Si hace
   clic en el botón se va a WhatsApp y no se le interrumpe con otro pop-up.
   Para probarlo sin esperar: añade ?popup=1 a la URL. */
(() => {
  'use strict';
  const popups = [...document.querySelectorAll('.popup')]
    .sort((a, b) => (+a.dataset.popupStep || 1) - (+b.dataset.popupStep || 1));
  if (!popups.length) return;

  const primero = popups[0];
  const DIAS = 7;
  const forzado = /[?&]popup=1(&|$)/.test(location.search);
  const porDia = primero.dataset.popupGate === 'dia';
  const CLAVE = porDia ? 'steidhub_popup_dia' : 'steidhub_popup_' + (primero.dataset.popupKey || 'general');

  // el almacenamiento puede estar bloqueado (Safari privado, webviews de apps):
  // si falla, los pop-ups siguen funcionando en vez de romperse
  const leer = () => { try { return localStorage.getItem(CLAVE) || ''; } catch (e) { return ''; } };
  const marcar = () => {
    try { localStorage.setItem(CLAVE, porDia ? new Date().toDateString() : String(Date.now())); } catch (e) { /* sin almacenamiento */ }
  };
  const yaVisto = () => {
    if (forzado) return false;
    const v = leer();
    if (!v) return false;
    return porDia ? v === new Date().toDateString() : Date.now() - Number(v) < DIAS * 864e5;
  };

  let abierto = null;
  let lastFocus = null;

  const cerrar = (el, encadenar) => {
    el.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { el.hidden = true; }, 400);
    abierto = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    if (!encadenar) return;
    const siguiente = popups[popups.indexOf(el) + 1];
    if (siguiente) setTimeout(() => abrir(siguiente), 420);
  };

  const abrir = (el) => {
    if (abierto) return;
    // no interrumpir a quien está escribiendo en el formulario
    const activo = document.activeElement;
    if (activo && activo.closest && activo.closest('form')) return;
    lastFocus = activo;
    abierto = el;
    el.hidden = false;
    // reflow forzado en vez de rAF: si la pestaña está en segundo plano rAF no
    // corre y el overlay quedaría invisible pero bloqueando los clics
    void el.offsetWidth;
    el.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    const btn = el.querySelector('.popup__close');
    if (btn) btn.focus();
  };

  popups.forEach((el) => {
    el.querySelectorAll('[data-popup-close]').forEach((b) => b.addEventListener('click', () => cerrar(el, true)));
    const link = el.querySelector('.popup__link');
    if (link) link.addEventListener('click', () => setTimeout(() => cerrar(el, false), 60));
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && abierto) cerrar(abierto, true); });

  if (yaVisto()) return;

  const arrancar = () => { if (yaVisto()) return; marcar(); abrir(primero); };
  const trigger = primero.dataset.popupTrigger || 'tiempo:3000';

  if (trigger.startsWith('ancla:')) {
    const ancla = document.querySelector(trigger.slice(6));
    if (!ancla) return;
    let hecho = false;
    const aLaVista = () => {
      const r = ancla.getBoundingClientRect();
      return r.top < innerHeight * 0.9 && r.bottom > 0;
    };
    const revisar = () => {
      if (hecho || !aLaVista()) return;
      hecho = true;
      removeEventListener('scroll', revisar);
      arrancar();
    };
    // observer con respaldo por scroll: en algunos webviews el observer no dispara
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.disconnect(); revisar(); } }), { threshold: 0.2 });
      io.observe(ancla);
    }
    addEventListener('scroll', revisar, { passive: true });
    setTimeout(revisar, 1200);
  } else {
    const ms = Number(trigger.split(':')[1]) || 3000;
    setTimeout(arrancar, matchMedia('(max-width:767px)').matches ? ms + 3000 : ms);
  }
})();
