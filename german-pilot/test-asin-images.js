const https = require('https');

const asin = 'B08LNCXZNQ';
const url = 'https://www.amazon.de/dp/' + asin;

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'de-DE,de;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
  }
}, res => {
  console.log('Status code:', res.statusCode);
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('HTML Length:', d.length);

    // Look for hiRes in the page
    const hiRes = [];
    const reHi = /"hiRes"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/g;
    let m;
    while ((m = reHi.exec(d)) !== null) {
      if (!hiRes.includes(m[1])) hiRes.push(m[1]);
    }

    const large = [];
    const reLarge = /"large"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/g;
    while ((m = reLarge.exec(d)) !== null) {
      if (!large.includes(m[1])) large.push(m[1]);
    }

    console.log('Unique hiRes count:', hiRes.length);
    if (hiRes.length > 0) {
      console.log('hiRes images:');
      hiRes.slice(0, 5).forEach((img, i) => console.log(' ', i + 1, img));
    }

    console.log('Unique large count:', large.length);
    if (large.length > 0) {
      console.log('large images:');
      large.slice(0, 5).forEach((img, i) => console.log(' ', i + 1, img));
    }

    // Also check data-a-dynamic-image
    const dynMatch = d.match(/data-a-dynamic-image="([^"]+)"/);
    if (dynMatch) {
      console.log('Found data-a-dynamic-image!');
      try {
        const parsed = JSON.parse(dynMatch[1].replace(/&quot;/g, '"'));
        console.log('Dynamic image URLs:', Object.keys(parsed));
      } catch (e) {
        console.log('Could not parse dynamic images');
      }
    }
  });
});
