const https = require('https');
const fs = require('fs');

function searchAmazonDe(query) {
  return new Promise((resolve) => {
    const url = 'https://www.amazon.de/s?k=' + encodeURIComponent(query);
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Status for', query, ':', res.statusCode, 'Data length:', data.length);
        const regex = /data-asin="(B[0-9A-Z]{9})".*?src="(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/gs;
        let match;
        const results = [];
        while ((match = regex.exec(data)) !== null && results.length < 5) {
          const asin = match[1];
          let img = match[2].replace(/\._AC_[^.]+_/, '._AC_SL1500_');
          results.push({ asin, img });
        }
        resolve(results);
      });
    });
    req.on('error', (e) => {
      console.log('Error:', e.message);
      resolve([]);
    });
  });
}

async function test() {
  const res = await searchAmazonDe('DeLonghi Bruehgruppe ECAM 7313251451');
  console.log('Found:', JSON.stringify(res, null, 2));
}

test();
