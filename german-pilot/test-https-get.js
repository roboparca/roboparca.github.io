const https = require('https');

function testHttpsGet(query) {
  return new Promise((resolve) => {
    const url = 'https://www.amazon.de/s?k=' + encodeURIComponent(query);
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache'
      }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        console.log(`Query: ${query} -> HTTP ${res.statusCode}, length: ${data.length}`);
        const count = (data.match(/data-asin="B0[A-Z0-9]{8}"/g) || []).length;
        console.log(`  ASIN matches: ${count}`);
        resolve({ status: res.statusCode, length: data.length, count });
      });
    });
    req.on('error', err => {
      console.log(`Query: ${query} -> Error: ${err.message}`);
      resolve({ error: err.message });
    });
  });
}

(async () => {
  await testHttpsGet('DeLonghi Bruehgruppe ECAM');
  await new Promise(r => setTimeout(r, 1000));
  await testHttpsGet('Siemens EQ6 Mahlwerk');
  await new Promise(r => setTimeout(r, 1000));
  await testHttpsGet('Jura Claris Smart Filter');
})();
