const { execSync } = require('child_process');
const cheerio = require('cheerio');

function inspectAsin(asin) {
  try {
    const cmd = `curl.exe -s -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36" -H "Accept-Language: de-DE,de;q=0.9" "https://www.amazon.de/dp/${asin}"`;
    const html = execSync(cmd, { encoding: 'utf8', maxBuffer: 15 * 1024 * 1024 });

    const $ = cheerio.load(html);
    const title = $('#productTitle').text().trim() || $('title').text().trim();
    const isDog = html.includes('MEOW') || html.includes('Tut uns Leid') || html.includes("couldn't find that page");
    const isCaptcha = html.includes('Geben Sie die Zeichen unten ein');

    console.log(`ASIN: ${asin}`);
    console.log(`  Live Product?: ${!isDog && !isCaptcha && title.length > 5}`);
    console.log(`  Dog/404?: ${isDog}`);
    console.log(`  Captcha?: ${isCaptcha}`);
    console.log(`  Title: ${title.slice(0, 70)}`);
  } catch (e) {
    console.log(`ASIN: ${asin} -> Error: ${e.message.slice(0, 60)}`);
  }
}

inspectAsin('B07VYK3J24');
inspectAsin('B09N9DXG3D');
inspectAsin('B08LNCXZNQ');
inspectAsin('B0H6MDHX5S');
