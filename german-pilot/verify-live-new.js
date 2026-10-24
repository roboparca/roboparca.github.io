const { execSync } = require('child_process');

const urls = [
  'https://kaffeereparatur.github.io/',
  'https://kaffeereparatur.github.io/sitemap.xml',
  'https://kaffeereparatur.github.io/robots.txt',
  'https://kaffeereparatur.github.io/delonghi/',
  'https://kaffeereparatur.github.io/siemens/',
  'https://kaffeereparatur.github.io/siemens/eq6-plus/',
  'https://kaffeereparatur.github.io/jura/',
  'https://kaffeereparatur.github.io/philips/',
  'https://kaffeereparatur.github.io/kategorie/bruehgruppe/',
  'https://kaffeereparatur.github.io/delonghi/delonghi-brueheinheit-7313251451-brueheinheit-fuer-b07cnw1wlc/'
];

console.log('Testing live endpoints on https://kaffeereparatur.github.io/ :');
let allOk = true;

for (const u of urls) {
  try {
    const res = execSync(`curl.exe -4 -s -o NUL -w "%{http_code}" "${u}"`, { encoding: 'utf8' }).trim();
    console.log(`[HTTP ${res}] ${u}`);
    if (res !== '200') allOk = false;
  } catch (e) {
    console.log(`[ERR] ${u}: ${e.message}`);
    allOk = false;
  }
}

if (allOk) {
  console.log('\n🎉 ALL LIVE ENDPOINTS ON NEW DOMAIN RETURNED HTTP 200 OK!');
} else {
  console.log('\n⚠️ Some endpoints failed.');
}
