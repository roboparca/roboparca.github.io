const { execSync } = require('child_process');

function getExactAsinImages(asin) {
  try {
    const cmd = `curl.exe -s -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36" -H "Accept-Language: de-DE,de;q=0.9" "https://www.amazon.de/dp/${asin}"`;
    const html = execSync(cmd, { encoding: 'utf8', maxBuffer: 15 * 1024 * 1024 });

    const images = [];
    // 1. hiRes regex
    const reHi = /"hiRes"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/g;
    let m;
    while ((m = reHi.exec(html)) !== null) {
      if (!images.includes(m[1]) && !m[1].includes('transparent') && !m[1].includes('pixel')) {
        images.push(m[1]);
      }
    }

    // 2. large regex fallback
    if (images.length === 0) {
      const reLarge = /"large"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/g;
      while ((m = reLarge.exec(html)) !== null) {
        if (!images.includes(m[1]) && !m[1].includes('transparent') && !m[1].includes('pixel')) {
          images.push(m[1]);
        }
      }
    }

    // 3. main image from landingImage or dynamic image
    if (images.length === 0) {
      const mLanding = html.match(/"landingImage"[^>]*src="(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/);
      if (mLanding) images.push(mLanding[1]);
    }

    return images;
  } catch (e) {
    console.error('Error fetching ASIN ' + asin + ':', e.message);
    return [];
  }
}

for (const asin of ['B08LNCXZNQ', 'B0H6MDHX5S', 'B0BQWBG1NG']) {
  console.log(`\n--- Fetching ASIN ${asin} ---`);
  const imgs = getExactAsinImages(asin);
  console.log(`Found ${imgs.length} exact images:`);
  imgs.forEach((img, i) => console.log(`  [${i + 1}] ${img}`));
}
