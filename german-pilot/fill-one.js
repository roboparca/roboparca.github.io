const fs = require('fs');
const https = require('https');
const path = require('path');

const cache = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'amazon-de-asins.json'), 'utf8'));

function search(q) {
  return new Promise((resolve) => {
    const url = 'https://www.amazon.de/s?k=' + encodeURIComponent(q);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Accept-Language': 'de-DE,de;q=0.9' } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const regex = /data-asin="(B[0-9A-Z]{9})".*?src="(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/gs;
        let match;
        const results = [];
        while ((match = regex.exec(data)) !== null && results.length < 5) {
          results.push({ asin: match[1], img: match[2].replace(/\._AC_[^.]+_/, '._AC_SL1500_') });
        }
        resolve(results);
      });
    });
  });
}

search('DeLonghi Magnetventil Solenoidventil 230V').then(res => {
  if (res.length > 0) {
    cache['delonghi-eletta-magnetventil'] = res;
    fs.writeFileSync(path.join(__dirname, 'data', 'amazon-de-asins.json'), JSON.stringify(cache, null, 2), 'utf8');
    console.log('Saved delonghi-eletta-magnetventil:', res.length, 'images!');
  }
});
