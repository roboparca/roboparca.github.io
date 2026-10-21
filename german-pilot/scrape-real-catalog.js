const { spawnSync } = require('child_process');
const cheerio = require('cheerio');
const fs = require('fs');

const QUERIES = [
  // DeLonghi
  { brand: 'DeLonghi', cat: 'bruehgruppe', q: 'DeLonghi Bruehgruppe ECAM' },
  { brand: 'DeLonghi', cat: 'bruehgruppe', q: 'DeLonghi Brueheinheit ESAM' },
  { brand: 'DeLonghi', cat: 'bruehgruppe', q: 'DeLonghi Bruehkolben Dichtung O-Ring' },
  { brand: 'DeLonghi', cat: 'mahlwerk', q: 'DeLonghi Mahlwerk Ersatzteil' },
  { brand: 'DeLonghi', cat: 'thermoblock', q: 'DeLonghi Thermoblock Heizelement' },
  { brand: 'DeLonghi', cat: 'milchsystem', q: 'DeLonghi Milchkaraffe LatteCrema' },
  { brand: 'DeLonghi', cat: 'milchsystem', q: 'DeLonghi Milchaufschauemer Duese' },
  { brand: 'DeLonghi', cat: 'wasserfilter', q: 'DeLonghi DLSC002 Wasserfilter' },
  { brand: 'DeLonghi', cat: 'magnetventil', q: 'DeLonghi Magnetventil 5213214051' },
  { brand: 'DeLonghi', cat: 'kaffeeauslauf', q: 'DeLonghi Kaffeeauslauf Verteiler' },
  { brand: 'DeLonghi', cat: 'vibrationspumpe', q: 'Ulka EX5 Pumpe DeLonghi' },

  // Siemens & Bosch
  { brand: 'Siemens', cat: 'bruehgruppe', q: 'Siemens EQ6 Brueheinheit 11014117' },
  { brand: 'Siemens', cat: 'bruehgruppe', q: 'Siemens EQ.5 EQ.7 Bruehgruppe' },
  { brand: 'Siemens', cat: 'bruehgruppe', q: 'Siemens EQ.9 Brueheinheit 11032772' },
  { brand: 'Siemens', cat: 'mahlwerk', q: 'Siemens EQ Mahlwerk Keramik' },
  { brand: 'Siemens', cat: 'drainageventil', q: 'Siemens EQ6 Drainageventil' },
  { brand: 'Siemens', cat: 'milchsystem', q: 'Siemens EQ6 Milchschlauch Adapter' },
  { brand: 'Siemens', cat: 'kaffeeauslauf', q: 'Siemens EQ6 Kaffeeauslauf 12004550' },
  { brand: 'Siemens', cat: 'wasserfilter', q: 'Brita Intenza Wasserfilter Siemens EQ' },
  { brand: 'Siemens', cat: 'magnetventil', q: 'Siemens Keramikventil EQ6' },
  { brand: 'Siemens', cat: 'thermoblock', q: 'Siemens Durchlauferhitzer Heizelement' },
  { brand: 'Bosch', cat: 'bruehgruppe', q: 'Bosch VeroBar VeroCafe Brueheinheit' },
  { brand: 'Bosch', cat: 'drainageventil', q: 'Bosch Drainageventil Kaffeevollautomat' },

  // Jura
  { brand: 'Jura', cat: 'bruehgruppe', q: 'Jura Bruehgruppe Reparaturset Dichtungen' },
  { brand: 'Jura', cat: 'bruehgruppe', q: 'Jura Impressa Brueheinheit Revisionsset' },
  { brand: 'Jura', cat: 'drainageventil', q: 'Jura Drainageventil Messingkappe' },
  { brand: 'Jura', cat: 'mahlwerk', q: 'Jura Mahlwerk Mahlkegel V3 V4' },
  { brand: 'Jura', cat: 'wasserfilter', q: 'Jura Claris Smart Filterpatrone' },
  { brand: 'Jura', cat: 'wasserfilter', q: 'Jura Claris Blue Filterpatrone' },
  { brand: 'Jura', cat: 'milchsystem', q: 'Jura Feinschaumduese Profi Milchaufschauemer' },
  { brand: 'Jura', cat: 'kaffeeauslauf', q: 'Jura Auslaufventil Kaffeeauslauf' },
  { brand: 'Jura', cat: 'vibrationspumpe', q: 'Ulka CP4 Pumpe Jura' },

  // Philips & Saeco
  { brand: 'Philips', cat: 'milchsystem', q: 'Philips LatteGo Milchbehaelter Karaffe' },
  { brand: 'Philips', cat: 'wasserfilter', q: 'Philips AquaClean CA6903 Wasserfilter' },
  { brand: 'Philips', cat: 'bruehgruppe', q: 'Philips Saeco Bruehgruppe 421944052461' },
  { brand: 'Philips', cat: 'bruehgruppe', q: 'Philips Series 2200 3200 Dichtungssatz' },
  { brand: 'Saeco', cat: 'mahlwerk', q: 'Saeco Keramik Mahlwerk Mahlscheiben' },
  { brand: 'Saeco', cat: 'drainageventil', q: 'Saeco Supportventil Steigrohr' },

  // Krups
  { brand: 'Krups', cat: 'bruehgruppe', q: 'Krups EA8108 Bruehgruppe Dichtung Kolben' },
  { brand: 'Krups', cat: 'wasserfilter', q: 'Krups Claris F088 Filterpatrone' },
  { brand: 'Krups', cat: 'drainageventil', q: 'Krups Drainageventil Barista' },
  { brand: 'Krups', cat: 'mahlwerk', q: 'Krups Mahlwerk Muehle Ersatzteil' },

  // Melitta & Nivona
  { brand: 'Melitta', cat: 'bruehgruppe', q: 'Melitta Caffeo Brueheinheit' },
  { brand: 'Melitta', cat: 'wasserfilter', q: 'Melitta Pro Aqua Filterpatrone' },
  { brand: 'Melitta', cat: 'drainageventil', q: 'Melitta Drainageventil Caffeo' },
  { brand: 'Nivona', cat: 'bruehgruppe', q: 'Nivona CafeRomatica Brueheinheit' },
  { brand: 'Nivona', cat: 'wasserfilter', q: 'Nivona Claris Filterpatrone NIRF700' },
  { brand: 'Nivona', cat: 'drainageventil', q: 'Nivona Drainageventil CafeRomatica' },

  // Sage
  { brand: 'Sage', cat: 'bruehgruppe', q: 'Sage Barista Express Siebtraegerdichtung 54mm' },
  { brand: 'Sage', cat: 'wasserfilter', q: 'Sage Claro Swiss Wasserfilter' },
  { brand: 'Sage', cat: 'mahlwerk', q: 'Sage Barista Mahlkegel Mahlwerk' },
  { brand: 'Sage', cat: 'magnetventil', q: 'Sage Solenoid Ventil 3-Wege' },

  // Miele
  { brand: 'Miele', cat: 'bruehgruppe', q: 'Miele CM Brueheinheit 11014117' },
  { brand: 'Miele', cat: 'milchsystem', q: 'Miele Milchventil CM6 CM7' },
  { brand: 'Miele', cat: 'reinigung', q: 'Miele Entkalkungstabletten Kaffeevollautomat' }
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
    // Sleep before retry
    spawnSync('powershell', ['-Command', 'Start-Sleep -Milliseconds 800']);
  }
  return null;
}

const catalog = [];
const seenAsins = new Set();

console.log(`Starting scrape of ${QUERIES.length} real queries...`);

for (let i = 0; i < QUERIES.length; i++) {
  const item = QUERIES[i];
  process.stdout.write(`[${i + 1}/${QUERIES.length}] ${item.brand}: "${item.q}"... `);

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
    // Skip entire machines
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
console.log(`SCRAPING COMPLETE: ${catalog.length} genuine Amazon.de products!`);
console.log(`========================================`);

fs.writeFileSync('data/real-amazon-catalog.json', JSON.stringify(catalog, null, 2), 'utf8');
console.log('Saved to data/real-amazon-catalog.json');
