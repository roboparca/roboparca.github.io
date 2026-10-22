const fs = require('fs');
const { spawnSync } = require('child_process');

const catalog = JSON.parse(fs.readFileSync('data/real-amazon-catalog.json', 'utf8'));
console.log(`Checking sample of 40 ASINs from catalog (${catalog.length} total)...`);

const sample = catalog.slice(0, 40);
let brokenCount = 0;
let liveCount = 0;

for (let i = 0; i < sample.length; i++) {
  const item = sample[i];
  const url = `https://www.amazon.de/dp/${item.asin}`;
  
  const res = spawnSync('curl.exe', [
    '-s', '-L', '--max-time', '10',
    '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    '-H', 'Accept-Language: de-DE,de;q=0.9',
    url
  ], { encoding: 'utf8', maxBuffer: 15 * 1024 * 1024 });

  const html = res.stdout || '';
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  const isDog = html.includes('images/G/01/error/') || title.includes('Seite nicht gefunden') || title.includes('404');
  const hasProduct = html.includes('id="productTitle"') || html.includes('id="title"');

  if (isDog || !hasProduct) {
    brokenCount++;
    console.log(`❌ BROKEN: [${item.asin}] ${item.title.slice(0, 50)}...`);
    console.log(`   Title: "${title.slice(0, 60)}" | IsDog: ${isDog} | HasProduct: ${hasProduct}`);
  } else {
    liveCount++;
    console.log(`✅ LIVE: [${item.asin}] ${title.slice(0, 60)}`);
  }
}

console.log(`\nSample check finished: ${liveCount} LIVE, ${brokenCount} BROKEN`);
