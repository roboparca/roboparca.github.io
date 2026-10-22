const cheerio = require('cheerio');

async function testFetch(query) {
  try {
    const url = `https://www.amazon.de/s?k=${encodeURIComponent(query).replace(/%20/g, '+')}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache'
      }
    });

    console.log(`Query: ${query} -> HTTP ${res.status}`);
    const text = await res.text();
    console.log(`  Length: ${text.length}`);
    const $ = cheerio.load(text);
    const count = $('[data-component-type="s-search-result"]').length;
    console.log(`  Results count: ${count}`);
    const isCaptcha = text.includes('Geben Sie die Zeichen unten ein');
    console.log(`  Captcha: ${isCaptcha}`);
  } catch (e) {
    console.log(`Query: ${query} -> Fetch Error: ${e.message}`);
  }
}

(async () => {
  await testFetch('DeLonghi Bruehgruppe ECAM');
  await new Promise(r => setTimeout(r, 1000));
  await testFetch('Siemens EQ6 Brueheinheit 11014117');
  await new Promise(r => setTimeout(r, 1000));
  await testFetch('Jura Claris Smart Filterpatrone');
})();
