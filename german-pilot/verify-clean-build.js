const fs = require('fs');

const testPages = [
  'dist/delonghi/magnifica-s/bruehgruppe/index.html',
  'dist/delonghi/magnifica-s/thermoblock/index.html',
  'dist/delonghi/magnifica-s/mahlwerk/index.html',
  'dist/delonghi/magnifica-s/drainageventil/index.html',
  'dist/siemens/eq6-plus-s700/mahlwerk/index.html',
  'dist/jura/e8/drainageventil/index.html'
];

console.log('Verifying links and images on sample pages:');

for (const p of testPages) {
  const html = fs.readFileSync(p, 'utf8');
  const ctaMatch = html.match(/class="cta"[^>]*href="([^"]+)"/);
  const link = ctaMatch ? ctaMatch[1] : 'NONE';
  const imgMatch = [...html.matchAll(/class="gallery-main-img"[^>]*src="([^"]+)"/g)].map(m => m[1]);

  console.log(`\nPage: ${p}`);
  console.log(`  CTA Link: ${link}`);
  console.log(`  Main Image: ${imgMatch[0] || 'NONE'}`);
  console.log(`  Contains dead ASIN B0H6MDHX5S?: ${link.includes('B0H6MDHX5S')}`);
}
