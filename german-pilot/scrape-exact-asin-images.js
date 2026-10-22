const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const CACHE_FILE = path.join(DATA_DIR, 'exact-asin-images.json');

let cache = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  } catch (e) {
    cache = {};
  }
}

const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));

function fetchExactImagesForAsin(asin) {
  if (!asin || !asin.startsWith('B0')) return null;

  if (cache[asin] && Array.isArray(cache[asin]) && cache[asin].length > 0) {
    return cache[asin];
  }

  try {
    const url = `https://www.amazon.de/dp/${asin}`;
    const cmd = `curl.exe -s -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36" -H "Accept-Language: de-DE,de;q=0.9" "${url}"`;
    const html = execSync(cmd, { encoding: 'utf8', maxBuffer: 15 * 1024 * 1024 });

    const images = [];

    // 1. hiRes regex from product detail page
    const reHi = /"hiRes"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/g;
    let m;
    while ((m = reHi.exec(html)) !== null) {
      const img = m[1].replace(/\._AC_[^.]+_/, '._AC_SL1500_');
      if (!images.includes(img) && !img.includes('transparent') && !img.includes('pixel')) {
        images.push(img);
      }
    }

    // 2. large regex fallback
    if (images.length === 0) {
      const reLarge = /"large"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/g;
      while ((m = reLarge.exec(html)) !== null) {
        const img = m[1].replace(/\._AC_[^.]+_/, '._AC_SL1500_');
        if (!images.includes(img) && !img.includes('transparent') && !img.includes('pixel')) {
          images.push(img);
        }
      }
    }

    // 3. main image from landingImage or dynamic image
    if (images.length === 0) {
      const mLanding = html.match(/"landingImage"[^>]*src="(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/);
      if (mLanding) {
        const img = mLanding[1].replace(/\._AC_[^.]+_/, '._AC_SL1500_');
        images.push(img);
      }
    }

    if (images.length > 0) {
      cache[asin] = images;
      fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
      return images;
    }
  } catch (err) {
    // console.error(`Error fetching ASIN ${asin}:`, err.message);
  }

  return null;
}

async function run(batchLimit = Infinity) {
  console.log(`🔍 Scraping EXACT Amazon product detail page images for ${products.length} products (limit: ${batchLimit})...`);
  let updatedCount = 0;

  for (let i = 0; i < products.length && updatedCount < batchLimit; i++) {
    const p = products[i];
    if (!p.asin || !p.asin.startsWith('B0')) continue;

    // Check if cache already has it
    if (cache[p.asin] && Array.isArray(cache[p.asin]) && cache[p.asin].length > 0) {
      // Ensure product uses exact cached images
      p.images = cache[p.asin];
      continue;
    }

    console.log(`[${i + 1}/${products.length}] Fetching exact gallery for ASIN: ${p.asin} (${p.brand} ${p.model} - ${p.partSlug})...`);
    const exactImages = fetchExactImagesForAsin(p.asin);

    if (exactImages && exactImages.length > 0) {
      p.images = exactImages;
      updatedCount++;
      console.log(`   ✅ Found ${exactImages.length} exact gallery images for ASIN ${p.asin}!`);
      // Save updated products.json
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
    } else {
      console.log(`   ⚠️ Could not fetch detail page for ASIN ${p.asin}, keeping current primary.`);
      if (p.images && p.images.length > 1) {
        // Keep ONLY the first image so no extra mismatched images are shown
        p.images = [p.images[0]];
      }
    }

    // Polite pause between detail page fetches
    await new Promise(r => setTimeout(r, 600));
  }

  // Final sync of products.json
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
  console.log(`🎉 Finished! Updated ${updatedCount} products with 100% exact Amazon product page galleries.`);
}

const limitArg = process.argv[2] === 'all' || !process.argv[2] ? Infinity : parseInt(process.argv[2], 10);
run(limitArg);
