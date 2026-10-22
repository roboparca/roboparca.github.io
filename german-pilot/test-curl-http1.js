const { spawnSync } = require('child_process');
const cheerio = require('cheerio');

function testCurl(query) {
  const url = `https://www.amazon.de/s?k=${encodeURIComponent(query).replace(/%20/g, '+')}`;
  const res = spawnSync('curl.exe', [
    '-s', '-L', '--http1.1', '--compressed', '--retry', '3', '--max-time', '15',
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
    console.log(`  Results count: ${count}`);
    const isCaptcha = res.stdout.includes('Geben Sie die Zeichen unten ein');
    console.log(`  Captcha: ${isCaptcha}`);
  }
}

testCurl('DeLonghi Bruehgruppe ECAM');
testCurl('Siemens EQ6 Brueheinheit 11014117');
testCurl('Jura Claris Smart Filterpatrone');
testCurl('Philips CA6903 AquaClean Filter');
