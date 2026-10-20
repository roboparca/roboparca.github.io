const https = require('https');
const fs = require('fs');

function searchAmazon(query) {
  return new Promise((resolve) => {
    const url = 'https://www.amazon.com.tr/s?k=' + encodeURIComponent(query);
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'tr-TR,tr;q=0.9'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const regex = /data-asin="(B[0-9A-Z]{9})".*?src="(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/gs;
        let match;
        const results = [];
        while ((match = regex.exec(data)) !== null && results.length < 4) {
          const asin = match[1];
          let img = match[2];
          img = img.replace(/\._AC_[^.]+_/, '._AC_SL1500_');
          results.push({ asin, img });
        }
        resolve({ query, results });
      });
    });
    req.on('error', () => resolve({ query, results: [] }));
  });
}

async function run() {
  const queries = [
    'roborock s8 hepa filtre',
    'roborock s7 hepa filtre',
    'roborock q revo paspas mop',
    'roborock s8 duoroller ana firca',
    'roborock s7 silikon ana firca',
    'roborock yan firca 5 kollu',
    'roborock toz torbasi',
    'xiaomi mop 1c hepa filtre',
    'xiaomi mop 2 pro ana firca',
    'xiaomi mop bezi paspas',
    'dreame l10s ultra hepa filtre',
    'dreame l20 ultra mop bezi',
    'dreame bot z10 pro toz torbasi',
    'dyson v15 filtre hepa',
    'dyson v11 filtre',
    'dyson v8 filtre',
    'ecovacs deebot t20 omni mop',
    'ecovacs deebot n8 hepa filtre',
    'tefal explorer filtre',
    'philips homerun aqua filtre',
    'robot supurge temizlik solusyonu'
  ];

  const catalog = {};
  for (const q of queries) {
    console.log('Fetching:', q);
    const res = await searchAmazon(q);
    catalog[q] = res.results;
    await new Promise(r => setTimeout(r, 600));
  }
  fs.writeFileSync('amazon-asins.json', JSON.stringify(catalog, null, 2), 'utf8');
  console.log('Saved amazon-asins.json!');
}

run();
