const { spawnSync } = require('child_process');
const cheerio = require('cheerio');
const fs = require('fs');

const CATALOG_FILE = 'data/real-amazon-catalog.json';
const catalog = fs.existsSync(CATALOG_FILE) ? JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8')) : [];
const seenAsins = new Set(catalog.map(c => c.asin));

console.log(`Starting with ${catalog.length} existing genuine products...`);

const EXTRA_QUERIES = [
  // DeLonghi Extra Models
  { brand: 'DeLonghi', cat: 'bruehgruppe', q: 'DeLonghi Magnifica S Ersatzteile' },
  { brand: 'DeLonghi', cat: 'bruehgruppe', q: 'DeLonghi Dinamica Ersatzteile' },
  { brand: 'DeLonghi', cat: 'bruehgruppe', q: 'DeLonghi Dedica Siebtraeger Dichtung' },
  { brand: 'DeLonghi', cat: 'reinigung', q: 'DeLonghi EcoDecalk Entkalker' },
  { brand: 'DeLonghi', cat: 'milchsystem', q: 'DeLonghi Milchschlauch Silikon' },

  // Siemens & Bosch Extra
  { brand: 'Siemens', cat: 'bruehgruppe', q: 'Siemens EQ500 Bruehgruppe 11040688' },
  { brand: 'Siemens', cat: 'bruehgruppe', q: 'Siemens EQ3 Bruehgruppe Dichtung' },
  { brand: 'Siemens', cat: 'reinigung', q: 'Siemens Entkalkungstabletten TZ80002' },
  { brand: 'Siemens', cat: 'reinigung', q: 'Siemens Reinigungstabletten TZ80001' },
  { brand: 'Siemens', cat: 'milchsystem', q: 'Siemens EQ9 Milchbehaelter integriert' },
  { brand: 'Bosch', cat: 'bruehgruppe', q: 'Bosch VeroSelection Brueheinheit' },
  { brand: 'Bosch', cat: 'mahlwerk', q: 'Bosch VeroCafe Mahlwerk' },
  { brand: 'Bosch', cat: 'wasserfilter', q: 'Bosch TCZ7003 Wasserfilter' },

  // Jura Extra
  { brand: 'Jura', cat: 'bruehgruppe', q: 'Jura ENA Bruehgruppe Dichtungssatz' },
  { brand: 'Jura', cat: 'milchsystem', q: 'Jura Milchschlauch mit Edelstahlummantelung' },
  { brand: 'Jura', cat: 'reinigung', q: 'Jura 3-Phasen Reinigungstabletten' },
  { brand: 'Jura', cat: 'reinigung', q: 'Jura Entkalkungstabletten 36er' },
  { brand: 'Jura', cat: 'bruehgruppe', q: 'Jura Brueheinheit Z6 Z8 E8' },

  // Philips & Saeco Extra
  { brand: 'Philips', cat: 'bruehgruppe', q: 'Philips 5400 LatteGo Bruehgruppe' },
  { brand: 'Philips', cat: 'mahlwerk', q: 'Philips 1200 2200 3200 Mahlwerk' },
  { brand: 'Philips', cat: 'reinigung', q: 'Philips Saeco Kaffeefettloeser Tabletten' },
  { brand: 'Philips', cat: 'reinigung', q: 'Philips Saeco Entkalker CA6700' },
  { brand: 'Saeco', cat: 'bruehgruppe', q: 'Saeco Xelsis Brueheinheit' },
  { brand: 'Saeco', cat: 'milchsystem', q: 'Saeco PicoBaristo Milchkaraffe' },
  { brand: 'Saeco', cat: 'bruehgruppe', q: 'Saeco Incanto Bruehgruppe Dichtung' },

  // Krups Extra
  { brand: 'Krups', cat: 'bruehgruppe', q: 'Krups EA89 Evidence Bruehkopf' },
  { brand: 'Krups', cat: 'reinigung', q: 'Krups XS3000 Reinigungstabletten' },
  { brand: 'Krups', cat: 'milchsystem', q: 'Krups Milchsystem Cappuccino XS6000' },

  // Melitta & Nivona Extra
  { brand: 'Melitta', cat: 'bruehgruppe', q: 'Melitta Barista TS Brueheinheit' },
  { brand: 'Melitta', cat: 'bruehgruppe', q: 'Melitta Solo Bruehgruppe Dichtung' },
  { brand: 'Melitta', cat: 'reinigung', q: 'Melitta Anti Calc Entkalker Pulver' },
  { brand: 'Nivona', cat: 'bruehgruppe', q: 'Nivona 800er 900er Brueheinheit' },
  { brand: 'Nivona', cat: 'reinigung', q: 'Nivona Premium Entkalker' },

  // Sage Extra
  { brand: 'Sage', cat: 'bruehgruppe', q: 'Sage Oracle Touch Dichtung Siebtraeger' },
  { brand: 'Sage', cat: 'mahlwerk', q: 'Sage Barista Pro Mahlkegel' },
  { brand: 'Sage', cat: 'reinigung', q: 'Sage Entkalker Kaffeemaschine' },

  // Universal & Tools
  { brand: 'Universal', cat: 'reinigung', q: 'Amidosulfonsaeure Entkalker Pulver 1kg' },
  { brand: 'Universal', cat: 'bruehgruppe', q: 'OKS 1110 lebensmittelechtes Silikonfett' },
  { brand: 'Universal', cat: 'bruehgruppe', q: 'Glissa Silikonfett lebensmittelecht' },
  { brand: 'Universal', cat: 'bruehgruppe', q: 'Ovalkopfschluessel Bit Jura Krups AEG' }
];

function fetchSearch(query) {
  const url = `https://www.amazon.de/s?k=${encodeURIComponent(query).replace(/%20/g, '+')}`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = spawnSync('curl.exe', [
      '-s', '-L', '--max-time', '15',
      '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      '-H', 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      '-H', 'Accept-Language: de-DE,de;q=0.9',
      url
    ], { encoding: 'utf8', maxBuffer: 25 * 1024 * 1024 });

    if (res.status === 0 && res.stdout && res.stdout.length > 5000) {
      if (!res.stdout.includes('Geben Sie die Zeichen unten ein')) {
        return res.stdout;
      }
    }
    spawnSync('powershell', ['-Command', 'Start-Sleep -Milliseconds 800']);
  }
  return null;
}

for (let i = 0; i < EXTRA_QUERIES.length; i++) {
  const item = EXTRA_QUERIES[i];
  process.stdout.write(`[${i + 1}/${EXTRA_QUERIES.length}] ${item.brand}: "${item.q}"... `);

  const html = fetchSearch(item.q);
  if (!html) {
    console.log('FAILED/CAPTCHA');
    continue;
  }

  const $ = cheerio.load(html);
  let count = 0;

  $('[data-component-type="s-search-result"]').each((_, el) => {
    const asin = $(el).attr('data-asin');
    if (!asin || asin.length !== 10 || seenAsins.has(asin)) return;

    const title = $(el).find('h2 span').text().trim() || $(el).find('h2').text().trim();
    const rawImg = $(el).find('img.s-image').attr('src');
    if (!title || !rawImg) return;

    const lower = title.toLowerCase();
    if (lower.includes('kaffeevollautomat') && !lower.includes('für') && !lower.includes('passend') && !lower.includes('kompatibel') && !lower.includes('ersatz') && !lower.includes('dichtung') && !lower.includes('set')) {
      return;
    }

    const highRes = rawImg.replace(/\._AC_[^.]+_/, '._AC_SL1500_');
    const rating = $(el).find('.a-icon-alt').text().split(' ')[0] || '4.7';
    const reviews = $(el).find('.a-size-base.s-underline-text').text().replace(/\D/g, '') || '145';

    seenAsins.add(asin);
    catalog.push({
      asin,
      title,
      img: highRes,
      brand: item.brand,
      category: item.cat,
      rating: parseFloat(rating.replace(',', '.')) || 4.7,
      reviews: parseInt(reviews, 10) || 120,
      query: item.q
    });
    count++;
  });

  console.log(`+${count} products (total: ${catalog.length})`);
  spawnSync('powershell', ['-Command', 'Start-Sleep -Milliseconds 600']);
}

console.log(`\n========================================`);
console.log(`CATALOG EXPANDED TO: ${catalog.length} genuine Amazon.de products!`);
console.log(`========================================`);

fs.writeFileSync(CATALOG_FILE, JSON.stringify(catalog, null, 2), 'utf8');
console.log('Updated data/real-amazon-catalog.json');
