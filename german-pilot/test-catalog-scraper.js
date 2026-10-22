const { spawnSync } = require('child_process');
const cheerio = require('cheerio');

// Test scraping real Amazon.de coffee spare parts
const searchQueries = [
  // DeLonghi
  { brand: 'DeLonghi', query: 'DeLonghi Bruehgruppe ECAM' },
  { brand: 'DeLonghi', query: 'DeLonghi Bruehkolben Dichtung' },
  { brand: 'DeLonghi', query: 'DeLonghi DLS C002 Wasserfilter' },
  { brand: 'DeLonghi', query: 'DeLonghi Milchaufschauemer LatteCrema' },
  { brand: 'DeLonghi', query: 'DeLonghi Mahlwerk Ersatzteil' },
  { brand: 'DeLonghi', query: 'DeLonghi Magnetventil 5213214051' },
  { brand: 'DeLonghi', query: 'DeLonghi Thermoblock Heizelement' },
  { brand: 'DeLonghi', query: 'Ulka EX5 Pumpe DeLonghi' },

  // Siemens / Bosch
  { brand: 'Siemens', query: 'Siemens EQ6 Brueheinheit 11014117' },
  { brand: 'Siemens', query: 'Siemens EQ6 Milchschlauch Adapter' },
  { brand: 'Siemens', query: 'Siemens EQ6 Kaffeeauslauf Verteiler 12004550' },
  { brand: 'Siemens', query: 'Siemens EQ6 Mahlwerk' },
  { brand: 'Siemens', query: 'Siemens EQ6 Drainageventil' },
  { brand: 'Siemens', query: 'Brita Intenza Wasserfilter Siemens EQ' },
  { brand: 'Bosch', query: 'Bosch VeroBar Bruehgruppe' },

  // Jura
  { brand: 'Jura', query: 'Jura Bruehgruppe Dichtungssatz' },
  { brand: 'Jura', query: 'Jura Drainageventil Messing' },
  { brand: 'Jura', query: 'Jura Claris Smart Filterpatrone' },
  { brand: 'Jura', query: 'Jura Mahlwerk Mahlkegel' },
  { brand: 'Jura', query: 'Jura Feinschaumduese Milchsystem' },
  { brand: 'Jura', query: 'Jura Auslaufventil' },

  // Philips / Saeco
  { brand: 'Philips', query: 'Philips LatteGo Milchbehaelter' },
  { brand: 'Philips', query: 'Philips AquaClean CA6903 Filter' },
  { brand: 'Philips', query: 'Philips Saeco Bruehgruppe 421944052461' },
  { brand: 'Philips', query: 'Saeco Bruehgruppe Dichtung Silikonfett' },
  { brand: 'Saeco', query: 'Saeco Mahlwerk Keramik' },

  // Krups
  { brand: 'Krups', query: 'Krups EA8108 Bruehgruppe Dichtung' },
  { brand: 'Krups', query: 'Krups Claris F088 Wasserfilter' },
  { brand: 'Krups', query: 'Krups Drainageventil Barista' },

  // Melitta & Nivona
  { brand: 'Melitta', query: 'Melitta Caffeo Brueheinheit' },
  { brand: 'Melitta', query: 'Melitta Pro Aqua Wasserfilter' },
  { brand: 'Nivona', query: 'Nivona CafeRomatica Brueheinheit' },
  { brand: 'Nivona', query: 'Nivona Claris Frischwasserfilter' },

  // Sage
  { brand: 'Sage', query: 'Sage Barista Express Siebtraegerdichtung' },
  { brand: 'Sage', query: 'Sage Barista Express Wasserfilter' },
  { brand: 'Sage', query: 'Sage Barista Mahlwerk Mahlkegel' }
];

function scrapeQuery(qObj) {
  const url = `https://www.amazon.de/s?k=${encodeURIComponent(qObj.query).replace(/%20/g, '+')}`;
  const res = spawnSync('curl.exe', [
    '-s', '-L', '--max-time', '15',
    '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    '-H', 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    '-H', 'Accept-Language: de-DE,de;q=0.9',
    url
  ], { encoding: 'utf8', maxBuffer: 25 * 1024 * 1024 });

  if (res.error || res.status !== 0) return [];
  const html = res.stdout;
  if (html.includes('Geben Sie die Zeichen unten ein')) {
    console.log(`[CAPTCHA] for ${qObj.query}`);
    return [];
  }

  const $ = cheerio.load(html);
  const items = [];

  $('[data-component-type="s-search-result"]').each((i, el) => {
    const asin = $(el).attr('data-asin');
    if (!asin || asin.length !== 10) return;
    const title = $(el).find('h2 span').text().trim() || $(el).find('h2').text().trim();
    const rawImg = $(el).find('img.s-image').attr('src');
    if (!asin || !title || !rawImg) return;

    // Filter out entire machines (we only want spare parts, tools, cleaning, accessories)
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('kaffeevollautomat') && !lowerTitle.includes('für') && !lowerTitle.includes('kompatibel') && !lowerTitle.includes('passend') && !lowerTitle.includes('ersatz')) {
      return;
    }

    const highResImg = rawImg.replace(/\._AC_[^.]+_/, '._AC_SL1500_');
    items.push({
      asin,
      title,
      img: highResImg,
      brand: qObj.brand,
      query: qObj.query
    });
  });

  return items;
}

console.log('Testing scraping first 5 queries...');
let totalFound = 0;
const uniqueAsins = new Map();

for (let i = 0; i < 5; i++) {
  const qObj = searchQueries[i];
  const items = scrapeQuery(qObj);
  console.log(`[${qObj.brand}] "${qObj.query}": found ${items.length} items`);
  for (const item of items) {
    if (!uniqueAsins.has(item.asin)) {
      uniqueAsins.set(item.asin, item);
      totalFound++;
    }
  }
}

console.log(`Total unique verified ASINs from 5 queries: ${uniqueAsins.size}`);
let count = 0;
for (const [asin, item] of uniqueAsins) {
  if (count++ >= 8) break;
  console.log(`- ${asin}: ${item.title.slice(0, 65)}... [${item.img}]`);
}
