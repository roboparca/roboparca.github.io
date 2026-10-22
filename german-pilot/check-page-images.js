const fs = require('fs');

const html = fs.readFileSync('dist/delonghi/magnifica-s/bruehgruppe/index.html', 'utf8');
const imgs = [...html.matchAll(/src="(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/g)].map(m => m[1]);
console.log('Images in DeLonghi Magnifica S Bruehgruppe page:');
const uniqueImgs = [...new Set(imgs)];
uniqueImgs.forEach((img, i) => console.log('  [' + (i + 1) + '] ' + img));
