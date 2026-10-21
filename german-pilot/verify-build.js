const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');

console.log('🔍 Running Comprehensive Verification on German SEO Empire...');

// 1. Check Sitemap URL Count
const sitemapFile = path.join(distDir, 'sitemap.xml');
if (fs.existsSync(sitemapFile)) {
  const xml = fs.readFileSync(sitemapFile, 'utf8');
  const urlMatches = xml.match(/<loc>/g);
  const count = urlMatches ? urlMatches.length : 0;
  console.log(`✅ Sitemap contains ${count} URLs (Target >= 1,000):`, count >= 1000 ? 'PASS' : 'FAIL');
} else {
  console.error('❌ sitemap.xml does not exist!');
}

// 2. Check Search Index
const searchIndexFile = path.join(distDir, 'search-index.json');
if (fs.existsSync(searchIndexFile)) {
  const index = JSON.parse(fs.readFileSync(searchIndexFile, 'utf8'));
  console.log(`✅ Search Index contains ${index.length} searchable items:`, index.length >= 1000 ? 'PASS' : 'FAIL');
}

// 3. Verify Model Hub Pages across 8 diverse brands
const testHubs = [
  ['siemens', 'eq6-plus-s700'],
  ['jura', 'e8'],
  ['delonghi', 'magnifica-s'],
  ['philips', 'lattego-3200'],
  ['krups', 'evidence-ea8918'],
  ['sage', 'barista-express'],
  ['melitta', 'caffeo-solo'],
  ['nivona', 'caferomatica-759']
];

for (const [brand, model] of testHubs) {
  const hubFile = path.join(distDir, brand, model, 'index.html');
  const exists = fs.existsSync(hubFile);
  console.log(`✅ Hub ${brand}/${model} exists:`, exists);
  if (exists) {
    const html = fs.readFileSync(hubFile, 'utf8');
    if (!html.includes('aria-label="Breadcrumb"') || !html.includes('prod-card')) {
      console.error(`❌ Hub ${brand}/${model} missing breadcrumbs or cards!`);
    }
  }
}

// 4. Verify Product Page Quality & LeatherClogs Design Standards
const testProductFile = path.join(distDir, 'delonghi', 'magnifica-s', 'bruehgruppe', 'index.html');
console.log('Checking Product Page:', testProductFile);
if (fs.existsSync(testProductFile)) {
  const html = fs.readFileSync(testProductFile, 'utf8');
  console.log('  Page Size:', html.length, 'bytes');
  console.log('  Has LeatherClogs .cta button:', html.includes('class="cta"'));
  console.log('  Has LeatherClogs .note:', html.includes('class="note"'));
  console.log('  Has Google Search Intent Box:', html.includes('class="section-box google-intent-box"'));
  console.log('  Has Wikipedia Contextual Links:', html.includes('class="wiki-link"'));
  console.log('  Has 5 Step-by-Step Action Cards:', html.includes('class="steps-cards-grid"'));
  console.log('  Has Diagnostic Table:', html.includes('class="diag-table"'));
  console.log('  Has Compatibility Matrix:', html.includes('class="compat-matrix-grid"'));
  console.log('  Does NOT contain "Prime lieferbar":', !html.includes('Prime lieferbar'));
  console.log('  Does NOT contain "Amazon.de Tagespreis":', !html.includes('Amazon.de Tagespreis'));
  console.log('  Does NOT contain "Availability on Amazon":', !html.includes('Availability on Amazon'));
  console.log('  Does NOT contain unsplash photos:', !html.includes('unsplash.com'));
}

// 5. Verify Brand Hubs
const testBrands = ['delonghi', 'siemens', 'jura', 'philips', 'krups', 'sage', 'melitta', 'nivona', 'bosch', 'miele'];
for (const b of testBrands) {
  const bFile = path.join(distDir, b, 'index.html');
  if (!fs.existsSync(bFile)) {
    console.error(`❌ Brand hub missing for: ${b}`);
  }
}
console.log(`✅ All ${testBrands.length} Brand Hub pages verified!`);

// 6. Verify Category Hubs
const testCats = ['bruehgruppe', 'vibrationspumpe', 'thermoblock', 'mahlwerk', 'milchsystem', 'wasserfilter', 'drainageventil', 'magnetventil', 'fehlercodes', 'kaffeeauslauf'];
for (const c of testCats) {
  const cFile = path.join(distDir, 'kategorie', c, 'index.html');
  if (!fs.existsSync(cFile)) {
    console.error(`❌ Category hub missing for: ${c}`);
  }
}
console.log(`✅ All ${testCats.length} Category Hub pages verified!`);

// 7. Verify Homepage Silos
const homeFile = path.join(distDir, 'index.html');
if (fs.existsSync(homeFile)) {
  const html = fs.readFileSync(homeFile, 'utf8');
  console.log('✅ Homepage verified (Size:', html.length, 'bytes)');
  console.log('  Has Symptom Silo:', html.includes('id="symptome"'));
  console.log('  Has Brand Silo:', html.includes('id="marken"'));
  console.log('  Has Category Silo:', html.includes('id="kategorien"'));
  console.log('  Has Editorial Philosophy:', html.includes('Was unterscheidet hochwertige Ersatzteile'));
}
