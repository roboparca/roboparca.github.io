const fs = require('fs');

const html = fs.readFileSync('amazon_sample.html', 'utf8');

// 1. Look for 'colorImages': { 'initial': [...] }
let images = [];
const colorImagesMatch = html.match(/'colorImages':\s*\{\s*'initial':\s*(\[[^\]]+\])/);
if (colorImagesMatch) {
  try {
    const rawJson = colorImagesMatch[1];
    const parsed = JSON.parse(rawJson);
    for (const item of parsed) {
      if (item.hiRes) images.push(item.hiRes);
      else if (item.large) images.push(item.large);
    }
    console.log('Method 1 (colorImages initial): Found', images.length, 'images!');
  } catch (e) {
    console.log('Method 1 parse failed:', e.message);
  }
}

// 2. If not found, look for "hiRes":"https://..."
if (images.length === 0) {
  const reHi = /"hiRes"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/g;
  let m;
  while ((m = reHi.exec(html)) !== null) {
    if (!images.includes(m[1])) images.push(m[1]);
  }
  console.log('Method 2 (hiRes regex): Found', images.length, 'images!');
}

// 3. If still empty, look for "large":"https://..."
if (images.length === 0) {
  const reLarge = /"large"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/g;
  let m;
  while ((m = reLarge.exec(html)) !== null) {
    if (!images.includes(m[1])) images.push(m[1]);
  }
  console.log('Method 3 (large regex): Found', images.length, 'images!');
}

// 4. Look for data-a-dynamic-image
if (images.length === 0) {
  const dynMatches = [...html.matchAll(/data-a-dynamic-image="([^"]+)"/g)];
  for (const dm of dynMatches) {
    try {
      const obj = JSON.parse(dm[1].replace(/&quot;/g, '"'));
      for (const k of Object.keys(obj)) {
        if (!images.includes(k) && !k.includes('transparent') && !k.includes('pixel')) {
          images.push(k);
        }
      }
    } catch (e) {}
  }
  console.log('Method 4 (data-a-dynamic-image): Found', images.length, 'images!');
}

console.log('Final product images:');
images.forEach((img, i) => console.log(`  [${i + 1}] ${img}`));
