const fs = require('fs');
const html1 = fs.readFileSync('dist/delonghi/dinamica/thermoblock/index.html', 'utf8');
const html2 = fs.readFileSync('dist/delonghi/magnifica-s/thermoblock/index.html', 'utf8');
const html3 = fs.readFileSync('dist/siemens/eq6-plus-s700/mahlwerk/index.html', 'utf8');

function getLink(html) {
  const m = html.match(/class="cta"[^>]*href="([^"]+)"/);
  return m ? m[1] : 'NOT FOUND';
}

console.log('Dinamica Thermoblock CTA:   ', getLink(html1));
console.log('Magnifica S Thermoblock CTA:', getLink(html2));
console.log('Siemens EQ.6 Mahlwerk CTA:  ', getLink(html3));
console.log('All 3 unique?:', new Set([getLink(html1), getLink(html2), getLink(html3)]).size === 3);
