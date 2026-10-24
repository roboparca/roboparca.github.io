const fs = require('fs');

const home = fs.readFileSync('dist/index.html', 'utf8');
console.log('GSC in Homepage:', home.includes('google-site-verification'));
console.log('Canonical in Homepage:', home.match(/<link rel="canonical" href="([^"]+)"/)?.[1]);

const prodDirs = fs.readdirSync('dist/delonghi').filter(d => d.includes('-b0'));
const prod = fs.readFileSync('dist/delonghi/' + prodDirs[0] + '/index.html', 'utf8');
console.log('GSC in Product:', prod.includes('google-site-verification'));
console.log('Canonical in Product:', prod.match(/<link rel="canonical" href="([^"]+)"/)?.[1]);
console.log('Amazon CTA in Product:', prod.match(/<a class="cta" href="([^"]+)"/)?.[1]);

const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');
console.log('Sitemap first 3 URLs:');
console.log(sitemap.match(/<loc>[^<]+<\/loc>/g).slice(0, 3));
