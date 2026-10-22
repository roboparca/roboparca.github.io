const { spawnSync } = require('child_process');
const cheerio = require('cheerio');

function testQuery(query) {
  const url = `https://www.amazon.de/s?k=${encodeURIComponent(query).replace(/%20/g, '+')}`;
  const res = spawnSync('curl.exe', [
    '-s', '-L', '--max-time', '15',
    '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    '-H', 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    '-H', 'Accept-Language: de-DE,de;q=0.9',
    url
  ], { encoding: 'utf8', maxBuffer: 25 * 1024 * 1024 });

  console.log(`Query: ${query}`);
  console.log(`  Exit code: ${res.status}`);
  console.log(`  Output len: ${res.stdout ? res.stdout.length : 0}`);
  if (res.stdout) {
    const $ = cheerio.load(res.stdout);
    const count = $('[data-component-type="s-search-result"]').length;
    console.log(`  Search results: ${count}`);
    const isCaptcha = res.stdout.includes('Geben Sie die Zeichen unten ein') || res.stdout.includes('validateCaptcha');
    console.log(`  Captcha: ${isCaptcha}`);
  }
}

testQuery('DeLonghi Bruehgruppe ECAM');
testQuery('Siemens EQ6 Brueheinheit 11014117');
testQuery('Jura Claris Smart Filterpatrone');
