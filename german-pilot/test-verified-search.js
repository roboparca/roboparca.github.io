const { execSync } = require('child_process');
const cheerio = require('cheerio');

const CATEGORY_KEYWORDS = {
  bruehgruppe: ['brühgruppe', 'brüheinheit', 'brühkammer', 'dichtsatz brüh', 'dichtung brüh', 'brühkolben'],
  vibrationspumpe: ['pumpe', 'vibrationspumpe', 'ulka', 'ep5', 'ex5', 'wasserpumpe'],
  thermoblock: ['thermoblock', 'heizelement', 'durchlauferhitzer', 'heizung'],
  mahlwerk: ['mahlwerk', 'mahlkegel', 'mahlring', 'keramikmahlwerk', 'mühle'],
  milchsystem: ['milch', 'milchaufschäumer', 'milchbehälter', 'karaffe', 'dampfdüse', 'milchkaraffe'],
  wasserfilter: ['wasserfilter', 'filterpatrone', 'entkalker', 'claris', 'aquaclean', 'brita'],
  drainageventil: ['drainageventil', 'auslaufventil', 'drainage'],
  magnetventil: ['magnetventil', 'solenoid', 'magnet ventil'],
  fehlercodes: ['reparatursatz', 'wartungsset', 'dichtsatz', 'pflege-set', 'mikroschalter', 'revisionsset'],
  kaffeeauslauf: ['kaffeeauslauf', 'auslaufverteiler', 'auslauf', 'verteiler']
};

function searchAndVerify(query, catSlug) {
  const clean = query.replace(/['"]/g, '').trim().split(/\s+/).map(encodeURIComponent).join('+');
  const url = `https://www.amazon.de/s?k=${clean}`;
  try {
    const cmd = `curl.exe -s -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36" -H "Accept-Language: de-DE,de;q=0.9" "${url}"`;
    const html = execSync(cmd, { encoding: 'utf8', maxBuffer: 15 * 1024 * 1024 });

    const $ = cheerio.load(html);
    const keywords = CATEGORY_KEYWORDS[catSlug] || [];

    const candidates = [];
    $('[data-asin]').each((i, el) => {
      const asin = $(el).attr('data-asin');
      if (!asin || !asin.startsWith('B0')) return;

      const title = $(el).find('h2 span').text().trim() || $(el).find('h2 a').text().trim();
      const img = $(el).find('img.s-image').attr('src');

      if (!title || !img) return;

      const titleLower = title.toLowerCase();
      // Verify title contains at least one required category keyword
      const matchesCategory = keywords.some(kw => titleLower.includes(kw));

      if (matchesCategory) {
        candidates.push({ asin, title, img });
      }
    });

    return candidates;
  } catch (e) {
    console.error('Error in searchAndVerify:', e.message);
    return [];
  }
}

// Test for De'Longhi Magnifica S Thermoblock and Mahlwerk
console.log('Testing Thermoblock Search:');
const thermoResults = searchAndVerify("De'Longhi Magnifica S Thermoblock Heizelement", 'thermoblock');
console.log(`Found ${thermoResults.length} verified Thermoblock products:`);
thermoResults.slice(0, 3).forEach((r, i) => {
  console.log(`  [${i + 1}] ASIN: ${r.asin} -> "${r.title.slice(0, 70)}"`);
});

console.log('\nTesting Mahlwerk Search:');
const mahlResults = searchAndVerify("De'Longhi Magnifica S Mahlwerk Mahlkegel", 'mahlwerk');
console.log(`Found ${mahlResults.length} verified Mahlwerk products:`);
mahlResults.slice(0, 3).forEach((r, i) => {
  console.log(`  [${i + 1}] ASIN: ${r.asin} -> "${r.title.slice(0, 70)}"`);
});
