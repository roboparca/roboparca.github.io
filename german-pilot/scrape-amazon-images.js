const https = require('https');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const products = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'products.json'), 'utf8'));
const OUT_FILE = path.join(DATA_DIR, 'amazon-de-asins.json');

let cache = {};
if (fs.existsSync(OUT_FILE)) {
  try {
    cache = JSON.parse(fs.readFileSync(OUT_FILE, 'utf8'));
  } catch (e) {
    cache = {};
  }
}

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15'
];

function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function searchAmazonDe(query) {
  return new Promise((resolve) => {
    const clean = query.replace(/['"]/g, '').trim();
    const url = 'https://www.amazon.de/s?k=' + clean.split(/\s+/).map(encodeURIComponent).join('+');
    
    const req = https.get(url, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const regex = /data-asin="(B[0-9A-Z]{9})".*?src="(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/gs;
        let match;
        const results = [];
        const seenAsins = new Set();
        while ((match = regex.exec(data)) !== null && results.length < 5) {
          const asin = match[1];
          let img = match[2].replace(/\._AC_[^.]+_/, '._AC_SL1500_');
          if (img.includes('transparent') || img.includes('pixel') || seenAsins.has(asin)) continue;
          seenAsins.add(asin);
          results.push({ asin, img });
        }
        resolve(results);
      });
    });
    req.on('error', (e) => {
      console.log('Error fetching ' + query + ':', e.message);
      resolve([]);
    });
  });
}

function getOptimizedSearchQuery(p) {
  const cleanModel = p.model.replace(/\s*\(.*\)/, '').trim();
  const categoryTerms = {
    bruehgruppe: 'Brühgruppe Dichtungssatz',
    vibrationspumpe: 'Ulka EX5 Pumpe 15 bar',
    thermoblock: 'Thermoblock Heizelement',
    mahlwerk: 'Mahlwerk Keramik Mahlkegel',
    milchsystem: 'Milchaufschäumer Karaffe',
    wasserfilter: 'Wasserfilter Entkalker',
    drainageventil: 'Drainageventil Messingkappe',
    magnetventil: 'Magnetventil Solenoid 230V',
    fehlercodes: 'Ersatzteile Reparatursatz',
    kaffeeauslauf: 'Kaffeeauslauf Verteiler'
  };

  const term = categoryTerms[p.partSlug] || p.category;
  return {
    primary: `${p.brand} ${cleanModel} ${term}`,
    secondary: `${p.brand} ${term}`
  };
}

async function scrapeBatch(limit = Infinity) {
  console.log(`🔍 Scraping Amazon.de images & ASINs for products (target limit: ${limit === Infinity ? 'ALL' : limit})...`);
  let updated = 0;

  for (let i = 0; i < products.length && updated < limit; i++) {
    const p = products[i];
    const key = p.id;

    if (cache[key] && Array.isArray(cache[key]) && cache[key].length > 0) {
      continue;
    }

    const { primary, secondary } = getOptimizedSearchQuery(p);
    console.log(`[${i+1}/${products.length}] 🔎 Searching Amazon.de: "${primary}"...`);

    let results = await searchAmazonDe(primary);
    
    // Secondary search fallback if primary had 0 results
    if (!results || results.length === 0) {
      console.log(`   🔄 Primary empty, trying secondary fallback: "${secondary}"...`);
      await new Promise(r => setTimeout(r, 600));
      results = await searchAmazonDe(secondary);
    }

    if (results && results.length > 0) {
      cache[key] = results;
      console.log(`   ✅ Found ${results.length} Amazon images! Top ASIN: ${results[0].asin}`);
      updated++;
      fs.writeFileSync(OUT_FILE, JSON.stringify(cache, null, 2), 'utf8');
    } else {
      console.log(`   ⚠️ No images found for "${primary}"`);
    }

    await new Promise(r => setTimeout(r, 650));
  }

  console.log(`🎉 Batch finished! Updated ${updated} items. Total cached: ${Object.keys(cache).length}/${products.length}`);
}

const rawArg = process.argv[2];
const argLimit = rawArg === 'all' || !rawArg ? Infinity : parseInt(rawArg, 10);
scrapeBatch(argLimit);
