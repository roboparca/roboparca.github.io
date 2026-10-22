const https = require('https');
const cheerio = require('cheerio');

https.get('https://www.amazon.de/s?k=DeLonghi+Bruehgruppe+ECAM', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'de-DE,de;q=0.9'
  }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('HTML length:', d.length);
    const $ = cheerio.load(d);
    console.log('div[data-asin] count:', $('div[data-asin]').length);
    
    $('div[data-asin]').each((i, el) => {
      const asin = $(el).attr('data-asin');
      if (!asin || asin.length !== 10) return;
      const title = $(el).find('h2').text().trim();
      const img = $(el).find('img').attr('src');
      console.log(`[${i}] ASIN: ${asin} | Title: ${title.slice(0, 50)} | Img: ${img ? img.slice(0, 50) : 'none'}`);
    });
  });
});
