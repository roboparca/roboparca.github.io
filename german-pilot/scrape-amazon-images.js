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

function searchAmazonDe(query) {
  return new Promise((resolve) => {
    const url = 'https://www.amazon.de/s?k=' + encodeURIComponent(query.replace(/\+/g, ' '));
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
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
          // Skip tracking pixels or transparent badges
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

async function scrapeAll() {
  console.log(`🔍 Scraping Amazon.de images & ASINs for ${products.length} coffee repair parts...`);
  let updated = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const key = p.id;

    if (cache[key] && cache[key].length > 0) {
      // console.log(`[${i+1}/${products.length}] ⏩ Cached: ${p.id}`);
      continue;
    }

    const searchQuery = p.query || `${p.brand} ${p.model} ${p.partName}`;
    console.log(`[${i+1}/${products.length}] 🔎 Searching Amazon.de: ${searchQuery}...`);

    const results = await searchAmazonDe(searchQuery);
    if (results && results.length > 0) {
      cache[key] = results;
      console.log(`   ✅ Found ${results.length} Amazon images! Top ASIN: ${results[0].asin}`);
      updated++;
    } else {
      console.log(`   ⚠️ No images found for ${p.id}`);
    }

    // Save progressively
    fs.writeFileSync(OUT_FILE, JSON.stringify(cache, null, 2), 'utf8');

    // Politeness pause to avoid rate limits
    await new Promise(r => setTimeout(r, 650));
  }

  console.log(`🎉 Finished scraping! Updated ${updated} items. Total cached: ${Object.keys(cache).length}/${products.length}`);
}

scrapeAll();
