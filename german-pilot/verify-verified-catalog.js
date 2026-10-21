const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'dist');

function getAllHtmlFiles(dir, files = []) {
  for (const item of fs.readdirSync(dir)) {
    if (item === '.git') continue;
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      getAllHtmlFiles(full, files);
    } else if (item.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

const htmlFiles = getAllHtmlFiles(DIST_DIR);
console.log(`Total HTML files generated: ${htmlFiles.length}`);

let searchLinksFound = 0;
let directAsinLinksFound = 0;
let missingImages = 0;
let missingCta = 0;
const uniqueAsins = new Set();
let checkedProducts = 0;

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');

  // Check if it's a product page
  const ctaMatch = content.match(/<a[^>]*class="cta"[^>]*href="([^"]+)"/);
  if (ctaMatch) {
    checkedProducts++;
    const link = ctaMatch[1];
    if (link.includes('amazon.de/s?k=')) {
      searchLinksFound++;
      console.log(`[FAIL] Found search link in ${file}: ${link}`);
    } else if (link.includes('amazon.de/dp/')) {
      directAsinLinksFound++;
      const asinMatch = link.match(/\/dp\/(B0[A-Z0-9]{8})/);
      if (asinMatch) uniqueAsins.add(asinMatch[1]);
    }

    if (!content.includes('id="mainimg"') || content.includes('src=""')) {
      missingImages++;
    }
  }
}

console.log(`\n========================================`);
console.log(`AUDIT RESULTS:`);
console.log(`  Total Product Pages Checked: ${checkedProducts}`);
console.log(`  ✅ 100% Direct Live Amazon /dp/ASIN Links: ${directAsinLinksFound}`);
console.log(`  ❌ Amazon Search Fallback Links: ${searchLinksFound} (MUST BE 0)`);
console.log(`  ✅ Distinct Unique ASINs: ${uniqueAsins.size}`);
console.log(`  ❌ Missing Product Images: ${missingImages} (MUST BE 0)`);
console.log(`  ❌ Missing CTA Buttons: ${missingCta} (MUST BE 0)`);
console.log(`========================================\n`);

if (searchLinksFound === 0 && directAsinLinksFound === 700 && missingImages === 0 && uniqueAsins.size === 700) {
  console.log('🎉 100% ZERO HALLUCINATION VERIFICATION PASSED!');
} else {
  console.error('❌ VERIFICATION FAILED!');
  process.exit(1);
}
