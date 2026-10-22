const https = require('https');
const cheerio = require('cheerio');

function searchAmazonDe(query) {
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
        if (res.statusCode !== 200) {
          return resolve({ query, status: res.statusCode, items: [] });
        }
        const $ = cheerio.load(data);
        const items = [];

        $('[data-component-type="s-search-result"]').each((i, el) => {
          const asin = $(el).attr('data-asin');
          if (!asin || asin.length !== 10) return;
          const title = $(el).find('h2 span').text().trim() || $(el).find('h2').text().trim();
          let rawImg = $(el).find('img.s-image').attr('src');
          if (!asin || !title || !rawImg) return;

          const highResImg = rawImg.replace(/\._AC_[^.]+_/, '._AC_SL1500_');
          const rating = $(el).find('.a-icon-alt').text().split(' ')[0] || '4.7';
          const reviews = $(el).find('.a-size-base.s-underline-text').text().replace(/\D/g, '') || '180';

          items.push({ asin, title, img: highResImg, rating, reviews });
        });

        resolve({ query, status: res.statusCode, items });
      });
    });
    req.on('error', err => resolve({ query, error: err.message, items: [] }));
  });
}

(async () => {
  const r1 = await searchAmazonDe('DeLonghi Bruehgruppe ECAM');
  console.log(`Query: ${r1.query} -> found ${r1.items.length}`);
  r1.items.slice(0, 4).forEach((item, idx) => {
    console.log(`  [${idx+1}] ASIN: ${item.asin}`);
    console.log(`      Title: ${item.title}`);
    console.log(`      Img: ${item.img}`);
  });

  const r2 = await searchAmazonDe('Siemens EQ6 Mahlwerk');
  console.log(`Query: ${r2.query} -> found ${r2.items.length}`);
  r2.items.slice(0, 4).forEach((item, idx) => {
    console.log(`  [${idx+1}] ASIN: ${item.asin}`);
    console.log(`      Title: ${item.title}`);
    console.log(`      Img: ${item.img}`);
  });
})();
