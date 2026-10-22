const { execSync } = require('child_process');
const fs = require('fs');

const prods = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));

// Take the first 20 products
console.log('Checking first 20 product ASINs for actual live existence on Amazon.de...');

for (let i = 0; i < 20; i++) {
  const p = prods[i];
  if (!p.asin) {
    console.log(`[${i + 1}] ${p.id} -> NO ASIN`);
    continue;
  }
  try {
    const cmd = `curl.exe -s -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36" -H "Accept-Language: de-DE,de;q=0.9" "https://www.amazon.de/dp/${p.asin}"`;
    const html = execSync(cmd, { encoding: 'utf8', maxBuffer: 15 * 1024 * 1024 });

    const is404 = html.includes('MEOW') || html.includes('Tut uns leid') || html.includes('couldn\'t find that page') || html.includes('Geben Sie die Zeichen unten ein');
    const hasTitle = html.match(/<span id="productTitle"[^>]*>([\s\S]*?)<\/span>/);
    const title = hasTitle ? hasTitle[1].trim() : (is404 ? '404 NOT FOUND' : 'UNKNOWN/CAPTCHA');

    console.log(`[${i + 1}] ${p.id} (${p.asin}): ${is404 ? '❌ DEAD/404' : '✅ LIVE'} | Title: ${title.slice(0, 60)}`);
  } catch (e) {
    console.log(`[${i + 1}] ${p.id} (${p.asin}): ⚠️ ERROR: ${e.message.slice(0, 50)}`);
  }
}
