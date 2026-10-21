const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const products = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'products.json'), 'utf8'));
const amazonData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'amazon-de-asins.json'), 'utf8'));

let updatedCount = 0;
for (const p of products) {
  const amz = amazonData[p.id];
  if (amz && amz.length > 0) {
    p.asin = amz[0].asin;
    p.images = amz.map(item => item.img);
    // Remove static price completely to strictly follow Amazon Associate Operating Agreement & user instruction
    delete p.price;
    p.stockStatus = 'Amazon Prime';
    updatedCount++;
  }
}

fs.writeFileSync(path.join(DATA_DIR, 'products.json'), JSON.stringify(products, null, 2), 'utf8');
console.log(`✅ Updated ${updatedCount}/${products.length} products with genuine Amazon images & ASINs! Static prices eliminated.`);
