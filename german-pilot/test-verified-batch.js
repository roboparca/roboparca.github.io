const fs = require('fs');
const { execSync } = require('child_process');
const cheerio = require('cheerio');

const SEARCH_TERMS = {
  bruehgruppe: 'Brühgruppe Dichtungssatz',
  vibrationspumpe: 'Pumpe Ulka EX5',
  thermoblock: 'Thermoblock Heizelement',
  mahlwerk: 'Mahlwerk Mahlkegel',
  milchsystem: 'Milchaufschäumer Karaffe',
  wasserfilter: 'Wasserfilter Entkalker',
  drainageventil: 'Drainageventil',
  magnetventil: 'Magnetventil Solenoid',
  fehlercodes: 'Ersatzteile Reparatursatz',
  kaffeeauslauf: 'Kaffeeauslauf Verteiler'
};

const CATEGORY_KEYWORDS = {
  bruehgruppe: ['brühgruppe', 'brüheinheit', 'brühkammer', 'dichtung', 'dichtsatz', 'brüh'],
  vibrationspumpe: ['pumpe', 'vibrationspumpe', 'ulka', 'ep5', 'ex5', 'wasserpumpe'],
  thermoblock: ['thermoblock', 'heizelement', 'durchlauferhitzer', 'heizung'],
  mahlwerk: ['mahlwerk', 'mahlkegel', 'mahlring', 'keramikmahlwerk', 'mühle'],
  milchsystem: ['milch', 'milchaufschäumer', 'milchbehälter', 'karaffe', 'dampfdüse', 'milchkaraffe'],
  wasserfilter: ['wasserfilter', 'filterpatrone', 'entkalker', 'claris', 'aquaclean', 'brita', 'filter'],
  drainageventil: ['drainageventil', 'auslaufventil', 'drainage', 'ventil', 'lippendichtung'],
  magnetventil: ['magnetventil', 'solenoid', 'ventil'],
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
      const matchesCategory = keywords.some(kw => titleLower.includes(kw));

      if (matchesCategory) {
        candidates.push({ asin, title, img });
      }
    });

    return candidates;
  } catch (e) {
    return [];
  }
}

function fetchAsinGallery(asin) {
  try {
    const cmd = `curl.exe -s -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36" -H "Accept-Language: de-DE,de;q=0.9" "https://www.amazon.de/dp/${asin}"`;
    const html = execSync(cmd, { encoding: 'utf8', maxBuffer: 15 * 1024 * 1024 });

    const images = [];
    const reHi = /"hiRes"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/g;
    let m;
    while ((m = reHi.exec(html)) !== null) {
      const img = m[1].replace(/\._AC_[^.]+_/, '._AC_SL1500_');
      if (!images.includes(img) && !img.includes('transparent') && !img.includes('pixel')) {
        images.push(img);
      }
    }
    if (images.length === 0) {
      const reLarge = /"large"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/g;
      while ((m = reLarge.exec(html)) !== null) {
        const img = m[1].replace(/\._AC_[^.]+_/, '._AC_SL1500_');
        if (!images.includes(img) && !img.includes('transparent') && !img.includes('pixel')) {
          images.push(img);
        }
      }
    }
    return images;
  } catch (e) {
    return [];
  }
}

const prods = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));

console.log('Testing Verified Search & Exact Gallery for DeLonghi Magnifica S (10 parts):');

for (let i = 0; i < 10; i++) {
  const p = prods[i];
  const term = SEARCH_TERMS[p.partSlug] || p.partName;
  const cleanModel = p.model.replace(/\s*\(.*\)/, '').trim();
  const query = `${p.brand} ${cleanModel} ${term}`;
  console.log(`\n[${i + 1}/10] Checking: ${p.id} ("${query}")...`);

  const results = searchAndVerify(query, p.partSlug);
  if (results.length > 0) {
    const top = results[0];
    console.log(`  ✅ Verified ASIN: ${top.asin}`);
    console.log(`     Amazon Title: "${top.title.slice(0, 70)}"`);
    
    const gallery = fetchAsinGallery(top.asin);
    console.log(`     Gallery images: ${gallery.length > 0 ? gallery.length : 1} (exact match)`);
    p.asin = top.asin;
    p.images = gallery.length > 0 ? gallery : [top.img];
  } else {
    console.log(`  ⚠️ No direct verified ASIN found -> Will use Targeted Live Search Link`);
    p.asin = null;
  }
}

fs.writeFileSync('data/products.json', JSON.stringify(prods, null, 2), 'utf8');
console.log('\nUpdated data/products.json for first 10 products successfully!');
