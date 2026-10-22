const { spawnSync } = require('child_process');
const cheerio = require('cheerio');

function searchAmazon(query) {
  try {
    const url = `https://www.amazon.de/s?k=${encodeURIComponent(query).replace(/%20/g, '+')}`;
    const res = spawnSync('curl.exe', [
      '-s', '-L', '--max-time', '15',
      '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      '-H', 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      '-H', 'Accept-Language: de-DE,de;q=0.9',
      url
    ], { encoding: 'utf8', maxBuffer: 25 * 1024 * 1024 });

    if (res.error || res.status !== 0) {
      console.log(`Query "${query}": curl error ${res.status}`);
      return [];
    }

    const html = res.stdout;
    const isCaptcha = html.includes('Geben Sie die Zeichen unten ein') || html.includes('validateCaptcha');
    if (isCaptcha) {
      console.log(`Query "${query}": CAPTCHA encountered`);
      return [];
    }

    const $ = cheerio.load(html);
    const results = [];

    $('[data-component-type="s-search-result"]').each((i, el) => {
      const asin = $(el).attr('data-asin');
      if (!asin || asin.length !== 10) return;
      const title = $(el).find('h2 span').text().trim() || $(el).find('h2').text().trim();
      let img = $(el).find('img.s-image').attr('src');
      if (asin && title && img) {
        const highResImg = img.replace(/\._AC_[^.]+_/, '._AC_SL1500_');
        const rating = $(el).find('.a-icon-alt').text().split(' ')[0] || '4.6';
        const reviews = $(el).find('.a-size-base.s-underline-text').text().replace(/\D/g, '') || '120';
        results.push({ asin, title, img: highResImg, thumb: img, rating, reviews });
      }
    });

    console.log(`Query "${query}": Found ${results.length} real products`);
    results.slice(0, 3).forEach((r, idx) => {
      console.log(`   [${idx + 1}] ASIN: ${r.asin}`);
      console.log(`       Title: ${r.title.slice(0, 80)}`);
      console.log(`       Img: ${r.img}`);
    });
    return results;
  } catch (e) {
    console.log(`Error searching "${query}": ${e.message}`);
    return [];
  }
}

searchAmazon('Siemens EQ6 Mahlwerk');
searchAmazon('Jura Bruehgruppe Reparaturset');
searchAmazon('Philips LatteGo Milchsystem');
searchAmazon('DeLonghi Magnifica Pumpe');
searchAmazon('Miele CM6350 Brueheinheit');
