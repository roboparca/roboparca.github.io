const fs = require('fs');

const prods = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));

for (let i = 0; i < 10; i++) {
  const p = prods[i];
  console.log(`\nProduct [${i + 1}] ID: ${p.id}`);
  console.log(`  Name: ${p.partName}`);
  console.log(`  ASIN: ${p.asin}`);
  console.log(`  Images count: ${(p.images || []).length}`);
  (p.images || []).forEach((img, idx) => console.log(`    [${idx + 1}] ${img}`));
}
