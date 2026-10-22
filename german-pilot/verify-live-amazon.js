const { execSync } = require('child_process');
const fs = require('fs');

const prods = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));

console.log('Testing first 10 products for REAL live status on Amazon.de:');

for (let i = 0; i < 10; i++) {
  const p = prods[i];
  const url = `https://www.amazon.de/dp/${p.asin}`;
  try {
    const cmd = `curl.exe -s -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36" -H "Accept-Language: de-DE,de;q=0.9" "${url}"`;
    const html = execSync(cmd, { encoding: 'utf8', maxBuffer: 15 * 1024 * 1024 });

    const hasProductTitle = html.match(/<span id="productTitle"[^>]*>([\s\S]*?)<\/span>/);
    const hasDogs = html.includes('Dogs of Amazon') || html.includes('MEOW') || html.includes('alt="Hunde von Amazon"');
    const isCaptcha = html.includes('/errors_page/validateCaptcha');

    if (hasProductTitle) {
      console.log(`[${i + 1}] ✅ REAL PRODUCT: ${p.asin} -> "${hasProductTitle[1].trim().slice(0, 50)}"`);
    } else if (hasDogs) {
      console.log(`[${i + 1}] ❌ DEAD 404 ASIN (Dogs of Amazon): ${p.asin} on ${p.id}`);
    } else if (isCaptcha) {
      console.log(`[${i + 1}] ⚠️ CAPTCHA BLOCKED: ${p.asin}`);
    } else {
      console.log(`[${i + 1}] ❓ UNKNOWN RESPONSE: ${p.asin}`);
    }
  } catch (e) {
    console.log(`[${i + 1}] 💥 CURL FAILED: ${p.asin} -> ${e.message.slice(0, 40)}`);
  }
}
