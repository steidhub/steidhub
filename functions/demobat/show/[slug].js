/**
 * BAT — one short landing page per show, built for ads  (Cloudflare Pages Function)
 *
 *   GET /show/<slug>
 *
 * Switch it on per show in /admin ("Show page for ads"). The page is not linked from the website
 * (the tour list sends people straight to the ticket link), it is hidden from search engines, and it
 * has proper share tags so ads and social posts get a clean preview.
 */
import { read } from '../api/tour.js';
import { JOIN } from '../_lib/join-html.js';
import { foot } from '../_lib/foot-html.js';

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function parts(date) {
  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return { y, m: MON[m - 1], d, day: DAY[dt.getUTCDay()] };
}
function paras(t) {
  return String(t || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean).map((p) => '<p>' + esc(p).replace(/\n/g, '<br>') + '</p>').join('');
}
const STATUS = {
  cancelled: { stamp: 'Cancelled', head: 'This show has been cancelled' },
  postponed: { stamp: 'Postponed', head: 'This show has been postponed' },
  moved: { stamp: '', head: 'Venue change' },
};

function page({ show, origin, B }) {
  const p = parts(show.date);
  const when = p.day + ', ' + p.m + ' ' + p.d + ', ' + p.y;
  const title = 'BAT live in ' + show.city + ' — ' + p.m.slice(0, 3) + ' ' + p.d + ', ' + p.y;
  const flyer = show.flyerV ? B + '/api/flyer?id=' + encodeURIComponent(show.id) + '&v=' + encodeURIComponent(show.flyerV) : '';
  const desc = (show.desc || '').replace(/\s+/g, ' ').slice(0, 200) || 'BAT, heavy metal from Richmond, Virginia, live at ' + (show.venue || show.city) + ' on ' + when + '.';
  const ogImg = origin + (flyer || B + '/assets/img/og.jpg');
  const todayUtc = new Date().toISOString().slice(0, 10);
  const past = show.date < todayUtc;
  const st = STATUS[show.status] || null;

  let banner = '';
  if (st || show.update) {
    banner = '<div class="sp__note' + (show.status === 'cancelled' ? ' is-bad' : '') + '" role="status"><b>' + esc(st ? st.head : 'Update') + '</b>' +
      (show.update ? '<span>' + esc(show.update) + '</span>' : '') + '</div>';
  }

  let cta;
  if (past) cta = '<p class="sp__over">This show has already taken place.</p><a class="btn" href="' + B + '/">BAT official site</a>';
  else if (show.status === 'cancelled') cta = '<span class="soldout sp__stamp">Cancelled</span>';
  else if (show.soldOut) cta = '<span class="soldout sp__stamp">Sold out</span>';
  else if (show.status === 'postponed') {
    cta = '<span class="soldout sp__stamp">Postponed</span>' + (show.tickets ? '<a class="btn btn--sm" href="' + esc(show.tickets) + '" target="_blank" rel="noopener nofollow">Ticket info</a>' : '');
  } else if (show.tickets) cta = '<a class="btn sp__buy" href="' + esc(show.tickets) + '" target="_blank" rel="noopener nofollow" data-track="tickets">Get tickets</a>';
  else cta = '<p class="sp__over">Tickets will be announced soon.</p>';

  const media = flyer
    ? '<figure class="sp__flyer"><img src="' + esc(flyer) + '" alt="' + esc('Flyer: BAT live in ' + show.city + ', ' + when) + '" fetchpriority="high"></figure>'
    : '<figure class="sp__flyer sp__flyer--logo"><img src="' + B + '/assets/img/logo-wing.webp" width="1700" height="1234" alt="BAT"></figure>';

  const ld = {
    '@context': 'https://schema.org', '@type': 'MusicEvent', name: title, startDate: show.date,
    eventStatus: show.status === 'cancelled' ? 'https://schema.org/EventCancelled' : show.status === 'postponed' ? 'https://schema.org/EventPostponed' : 'https://schema.org/EventScheduled',
    location: { '@type': 'Place', name: show.venue || show.city, address: show.city },
    performer: { '@type': 'MusicGroup', name: 'BAT' }, image: ogImg,
    offers: show.tickets ? { '@type': 'Offer', url: show.tickets, availability: show.soldOut ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock' } : undefined,
  };

  return '<!doctype html>\n<html lang="en"' + (B ? ' data-base="' + esc(B) + '"' : '') + '>\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' +
    '<title>' + esc(title) + '</title>\n<meta name="description" content="' + esc(desc) + '">\n<meta name="robots" content="noindex, nofollow, noarchive">\n<meta name="theme-color" content="#050505">\n' +
    '<meta property="og:type" content="website"><meta property="og:site_name" content="BAT"><meta property="og:title" content="' + esc(title) + '"><meta property="og:description" content="' + esc(desc) + '"><meta property="og:image" content="' + esc(ogImg) + '"><meta property="og:url" content="' + esc(origin + B + '/show/' + show.slug) + '">\n' +
    '<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="' + esc(title) + '"><meta name="twitter:description" content="' + esc(desc) + '"><meta name="twitter:image" content="' + esc(ogImg) + '">\n' +
    '<link rel="icon" type="image/png" href="' + B + '/assets/img/favicon.png">\n<link rel="apple-touch-icon" href="' + B + '/assets/img/apple-touch-icon.png">\n' +
    '<link rel="stylesheet" href="' + B + '/assets/css/torn.css"><link rel="stylesheet" href="' + B + '/assets/css/site.css"><link rel="stylesheet" href="' + B + '/assets/css/v2.css">\n' +
    '<script>document.documentElement.classList.add("js")</script>\n<script type="application/ld+json">' + JSON.stringify(ld).replace(/</g, '\\u003c') + '</script>\n</head>\n' +
    '<body class="page show-page">\n' +
    '<header class="sp-head"><a class="sp-head__brand" href="' + B + '/" aria-label="BAT official website"><img src="' + B + '/assets/img/logo-type.webp" alt="BAT" width="1200" height="858"></a><button class="nav__join" type="button" data-join>Join the community</button></header>\n' +
    '<main class="sp"' + (flyer ? ' style="--sp-bg:url(\'' + esc(flyer) + '\')"' : '') + '>\n  <div class="sp__bg" aria-hidden="true"></div>\n  <div class="sp__in">\n    ' + media + '\n    <section class="sp__info" aria-labelledby="sp-t">\n' +
    '      <p class="kicker">BAT live</p>\n      <h1 class="black sp__city" id="sp-t">' + esc(show.city) + '</h1>\n' +
    '      <p class="sp__date"><time datetime="' + esc(show.date) + '">' + esc(when) + '</time></p>\n' +
    '      <p class="sp__venue">' + esc(show.venue || '') + (show.venue && show.time ? ' <i aria-hidden="true">·</i> ' : '') + esc(show.time || '') + '</p>\n' +
    '      ' + banner + '\n' + (show.desc ? '      <div class="sp__desc">' + paras(show.desc) + '</div>\n' : '') +
    '      <div class="sp__cta">' + cta + '</div>\n' +
    '      <p class="sp__fine">Tickets are sold by the venue. Dates and venues can change, so check the ticket page before you go.</p>\n' +
    '    </section>\n  </div>\n</main>\n' + foot(B) + '\n' + JOIN + '\n' +
    '<script src="' + B + '/assets/js/i18n.js"></script><script src="' + B + '/assets/js/main.js" defer></script><script src="' + B + '/assets/js/join.js" defer></script><script src="' + B + '/assets/js/popup.js" defer></script>\n</body>\n</html>\n';
}

function notFound(B) {
  const html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found — BAT</title><link rel="stylesheet" href="' + B + '/assets/css/torn.css"><link rel="stylesheet" href="' + B + '/assets/css/site.css"><link rel="stylesheet" href="' + B + '/assets/css/v2.css"></head><body class="page show-page"><main class="sp"><div class="sp__in sp__in--solo"><section class="sp__info"><h1 class="black sp__city">Not found</h1><p class="sp__venue">This show page does not exist or is switched off.</p><div class="sp__cta"><a class="btn" href="' + B + '/">BAT official site</a></div></section></div></main></body></html>';
  return new Response(html, { status: 404, headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex, nofollow', 'cache-control': 'no-store' } });
}

export async function onRequest({ request, env, params }) {
  const B = new URL(request.url).pathname.replace(/\/show\/.*$/, '');
  const slug = String((params && params.slug) || '').toLowerCase();
  if (!/^[a-z0-9-]{3,80}$/.test(slug)) return notFound(B);
  const data = await read(env);
  const show = (data.shows || []).find((s) => s.landing && s.slug === slug);
  if (!show) return notFound(B);
  const origin = new URL(request.url).origin;
  return new Response(page({ show, origin, B }), {
    headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex, nofollow, noarchive', 'cache-control': 'public, max-age=60, s-maxage=60' },
  });
}
