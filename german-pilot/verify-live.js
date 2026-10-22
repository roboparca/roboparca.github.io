const { execSync } = require('child_process');

const urls = [
  'https://roboparca.github.io/kaffeereparatur/',
  'https://roboparca.github.io/kaffeereparatur/delonghi/',
  'https://roboparca.github.io/kaffeereparatur/siemens/',
  'https://roboparca.github.io/kaffeereparatur/jura/',
  'https://roboparca.github.io/kaffeereparatur/philips/',
  'https://roboparca.github.io/kaffeereparatur/kategorie/bruehgruppe/',
  'https://roboparca.github.io/kaffeereparatur/kategorie/mahlwerk/',
  'https://roboparca.github.io/kaffeereparatur/delonghi/3-stueck-dichtung-o-ring-kompatibel-mit-delonghi-e-b0h5jkzmy4/',
  'https://roboparca.github.io/kaffeereparatur/sitemap.xml'
];

console.log('Testing live GitHub Pages endpoints:');
let allOk = true;

for (const u of urls) {
  try {
    const res = execSync(`curl.exe -s -o NUL -w "%{http_code}" "${u}"`, { encoding: 'utf8' }).trim();
    console.log(`[HTTP ${res}] ${u}`);
    if (res !== '200') allOk = false;
  } catch (e) {
    console.log(`[ERR] ${u}: ${e.message}`);
    allOk = false;
  }
}

if (allOk) {
  console.log('\n✅ ALL LIVE ENDPOINTS RETURNED HTTP 200 OK!');
} else {
  console.log('\n⚠️ Some endpoints failed.');
}
