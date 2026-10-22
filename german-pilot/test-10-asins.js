const { spawnSync } = require('child_process');

function checkAsin(asin) {
  const url = `https://www.amazon.de/dp/${asin}`;
  const res = spawnSync('curl.exe', [
    '-s', '-L', '--max-time', '10',
    '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    '-H', 'Accept: text/html,application/xhtml+xml',
    '-H', 'Accept-Language: de-DE,de;q=0.9',
    url
  ], { encoding: 'utf8', maxBuffer: 15 * 1024 * 1024 });

  const html = res.stdout || '';
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  const isDog = html.includes('images/G/01/error/') || title.includes('Seite nicht gefunden') || title.includes('404');
  const hasProduct = html.includes('id="productTitle"') || html.includes('id="title"');

  console.log(`[${asin}] -> Live: ${!isDog && hasProduct} | Title: ${title.slice(0, 50)}`);
  return !isDog && hasProduct;
}

checkAsin('B07CNW1WLC');
checkAsin('B08Q4FNPW5');
checkAsin('B0H6MDHX5S');
checkAsin('B00DC4QI66');
checkAsin('B08LNCXZNQ');
