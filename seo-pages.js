(() => {
  const intro = document.querySelector('.seo-intro');
  const sections = [...document.querySelectorAll('.seo-section[id]')].filter(s => s.querySelector('h2'));
  if (!intro) return;

  const visualSources = {
    'recursos': ['/assets/img/grafico-1.webp', 'Estrategia y datos para marketing inmobiliario'],
    'meta-ads': ['/assets/img/meta-ads-lima-hero.webp', 'Campaña de Meta Ads para proyecto inmobiliario en Lima'],
    'google-ads': ['/assets/img/google-ads-lima-hero.webp', 'Google Ads para proyecto inmobiliario en Lima'],
    'tiktok-ads': ['/assets/img/meta-hero-brasil.webp', 'Contenido vertical para publicidad inmobiliaria'],
    'produccion-audiovisual': ['/assets/img/hero-drone.jpg', 'Producción audiovisual y drone inmobiliario'],
    'branding-inmobiliario': ['/assets/img/branding-hb.webp', 'Branding para proyecto inmobiliario'],
    'landing-pages': ['/assets/img/google-landing-conversion-lima.webp', 'Landing page para proyecto inmobiliario'],
    'costo-por-lead': ['/assets/img/meta-lead-qualification.webp', 'Calificación de leads inmobiliarios'],
    'retargeting-inmobiliario': ['/assets/img/meta-remarketing-journey.webp', 'Retargeting para inmobiliarias'],
    'roi-por-canal': ['/assets/img/grafico-1.webp', 'Análisis de rendimiento de marketing'],
    'reporte-ejecutivo': ['/assets/img/meta-attribution-dashboard.webp', 'Dashboard de atribución y rendimiento'],
    'absorcion-inmobiliaria': ['/assets/img/miraflores.webp', 'Mercado inmobiliario en Lima'],
    'benchmarking-inmobiliario': ['/assets/img/golf-pano.webp', 'Benchmarking de proyectos inmobiliarios'],
    'estudio-de-demanda': ['/assets/img/landscape.webp', 'Estudio de demanda inmobiliaria']
  };
  const key = location.pathname.split('/').filter(Boolean).pop() || '';
  if (!document.querySelector('.seo-visual') && visualSources[key]) {
    const visual = document.createElement('figure');
    visual.className = 'seo-visual';
    visual.innerHTML = `<img src="${visualSources[key][0]}" alt="${visualSources[key][1]}" loading="eager" decoding="async">`;
    intro.after(visual);
  }

  if (!document.querySelector('.seo-related-block') && location.pathname !== '/servicios/' && location.pathname !== '/sectores/') {
    const related = document.createElement('section');
    related.className = 'seo-section seo-related-block';
    related.innerHTML = '<h2>Continúa explorando</h2><div class="seo-grid"><section class="seo-card"><h3><a href="/blog/">Blog de marketing inmobiliario</a></h3><p>Guías prácticas sobre campañas, contenido, leads y ventas de propiedades.</p></section><section class="seo-card"><h3><a href="/servicios/">Servicios relacionados</a></h3><p>Conecta esta decisión con pauta, contenido, landing pages y seguimiento comercial.</p></section><section class="seo-card"><h3><a href="/sectores/marketing-inmobiliario/">Marketing inmobiliario</a></h3><p>Conoce cómo integramos estrategia, producción y comercialización en Lima.</p></section></div>';
    const contact = document.querySelector('[aria-labelledby="contact-title"]');
    if (contact) contact.before(related); else document.querySelector('article').append(related);
  }

  if (sections.length < 2) sections.push(...document.querySelectorAll('.seo-section[aria-labelledby="contact-title"]'));
  const explorer = document.createElement('nav');
  explorer.className = 'seo-explorer';
  explorer.setAttribute('aria-label', 'Explorar esta página');
  explorer.innerHTML = '<span class="seo-explorer__label">Explora el servicio</span>' +
    sections.map((section, index) => `<a href="#${section.id}"${index === 0 ? ' aria-current="true"' : ''}>${section.querySelector('h2').textContent}</a>`).join('');
  intro.after(explorer);

  const links = [...explorer.querySelectorAll('a')];
  const update = id => links.forEach(link => link.setAttribute('aria-current', link.hash === `#${id}` ? 'true' : 'false'));
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); update(entry.target.id); }
  }), { rootMargin: '-18% 0px -64% 0px' });
  sections.forEach(section => observer.observe(section));

  if (!document.querySelector('.wa')) {
    const wa = document.createElement('div');
    wa.className = 'wa';
    wa.innerHTML = '<div class="wa__panel" role="note"><div class="wa__head"><span class="wa__who"><strong>Steid Hub</strong><small>Normalmente responde en minutos</small></span></div><div class="wa__body"><p class="wa__msg">¡Hola! ¿De qué proyecto desearías conversar?</p></div><a class="wa__send" href="https://wa.me/51983595390?text=Hola%2C%20Steid%20Hub%2C%20deseo%20m%C3%A1s%20informaci%C3%B3n" rel="noopener">Enviar mensaje</a></div><a class="wa__btn" href="https://wa.me/51983595390?text=Hola%2C%20Steid%20Hub%2C%20deseo%20m%C3%A1s%20informaci%C3%B3n" aria-label="Contactar por WhatsApp"><span class="wa__dot" aria-hidden="true"></span><span class="wa__ic" aria-hidden="true"></span><span class="wa__label">Contáctanos ahora</span></a>';
    document.body.append(wa);
  }
})();
