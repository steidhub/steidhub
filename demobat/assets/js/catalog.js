/* BAT — catalog pulled from Bandcamp and Vision Merch (Nov 2026).
   Images are saved locally. `album` / track id are Bandcamp embed ids (used by the player).
   Edit freely: add a release by copying one block. */
window.BAT_CATALOG = {
  bandcamp: 'https://bewareofthebat.bandcamp.com',
  releases: [
    { title: 'Live Like An Angel (Die Like A Devil)', year: '2026', kind: 'Single · Venom tribute', slug: 'live-like-an-angel-die-like-a-devil', album: '244903559', img: 'assets/img/catalog/live-like-an-angel-die-like-a-devil.webp',
      tracks: [['Live Like An Angel (Die Like A Devil)', '3:32', '326262281']] },
    { title: 'Under The Crooked Claw', year: '2024', kind: 'Album', slug: 'under-the-crooked-claw', album: '3576678162', img: 'assets/img/catalog/under-the-crooked-claw.webp',
      tracks: [['Una Torcia Illumina Il Cielo', '0:52', '194059256'], ['Vampyre Lore', '2:58', '1742002687'], ['Rite For Exorcism', '2:43', '704565836'], ['Streetbanger', '2:59', '2531203126'], ['Just Buried', '2:37', '796125545'], ['Warshock', '2:41', '2837853841'], ['Horror Vision', '3:43', '2931624054'], ['Battered', '2:17', '1658558582'], ['Revenge Of The Wolf', '1:42', '1184982464'], ['Marauders Of Doom', '2:38', '2425026620'], ['Electric Warning', '2:25', '3159784688'], ['Bastardized Force', '4:20', '638453992'], ['Final Strike', '3:12', '547515426']] },
    { title: 'Axestasy', year: '2019', kind: 'Album', slug: 'axestasy', album: '741843036', img: 'assets/img/catalog/axestasy.webp',
      tracks: [['Wild Fever', '3:04', '4168992918'], ['Long Live the Lewd', '2:04', '2879216829'], ['ICE', '3:04', '2890353234'], ['Ritual Fool', '2:24', '1322401829'], ['Slash of the Blade', '0:22', '2661204607'], ['Axestasy', '2:25', '3945008291']] },
    { title: 'Wings Of Chains', year: '2016', kind: 'Album', slug: 'wings-of-chains', album: '2026450750', img: 'assets/img/catalog/wings-of-chains.webp',
      tracks: [['Bloodhounds', '2:34', '331212448'], ['Code Rude', '2:44', '3888593075'], ['Master Of The Skies', '1:56', '881535161'], ['Primitive Age', '3:16', '1326140997'], ['Condemner', '2:06', '3965696465'], ['Ritual Fool', '2:29', '3766668293'], ['Wings Of Chains', '2:46', '726959887'], ['Total Wreckage', '1:26', '539878380'], ['Rule Of The Beast', '2:11', '3850431612'], ['You Die', '1:59', '1911230443'], ['Cruel Discipline', '2:09', '4228139654'], ['BAT', '3:40', '838728955']] },
    { title: 'Cruel Discipline', year: '2015', kind: 'EP', slug: 'cruel-discipline', album: '2652540531', img: 'assets/img/catalog/cruel-discipline.webp',
      tracks: [['Cruel Discipline', '2:24', '2274513432'], ['Rule of the Beast', '2:12', '2748392983']] },
    { title: 'Primitive Age (demo)', year: '2013', kind: 'Demo', slug: 'primitive-age-demo', album: '1186669659', img: 'assets/img/catalog/primitive-age-demo.webp',
      tracks: [['BAT', '3:46', '3928164034'], ['Total Wreckage', '1:27', '3764876251'], ['Code Rude', '2:49', '3455642483'], ['Rule of the Beast', '2:14', '3360820750'], ['Primitive Age', '3:21', '1975774996']] }
  ],
  /* merch cut-outs (transparent webp) */
  bandcampMerch: [
    { title: 'BAT Axe T-Shirt', img: 'assets/img/merch/bc-axe-tee.webp', url: 'https://bewareofthebat.bandcamp.com/merch/bat-axe-t-shirt' },
    { title: 'Battered Long Sleeve', img: 'assets/img/merch/bc-battered-ls.webp', url: 'https://bewareofthebat.bandcamp.com/merch/battered-longsleeve' },
    { title: 'Horror Vision T-Shirt', img: 'assets/img/merch/bc-horror-tee.webp', url: 'https://bewareofthebat.bandcamp.com/merch/horror-vision-t-shirt' },
    { title: 'BAT Axe Zip Hoodie', img: 'assets/img/merch/bc-axe-hoodie.webp', url: 'https://bewareofthebat.bandcamp.com/merch/bat-axe-zip-up-hoodie' }
  ],
  visionMerch: [
    { title: 'Horror Vision T-Shirt', img: 'assets/img/merch/vm-horror-tee.webp', url: 'https://www.visionmerch.com/bat/bat-horror-vision-t-shirt/' },
    { title: 'Marauders Long Sleeve', img: 'assets/img/merch/vm-marauders-ls.webp', url: 'https://www.visionmerch.com/bat/bat-marauders-long-sleeve/' },
    { title: 'BAT Logo Hoodie', img: 'assets/img/merch/vm-logo-hoodie.webp', url: 'https://www.visionmerch.com/bat/bat-logo-hoodie/' },
    { title: 'Marauders T-Shirt', img: 'assets/img/merch/vm-marauders-tee.webp', url: 'https://www.visionmerch.com/bat/bat-marauders-t-shirt/' }
  ]
};
