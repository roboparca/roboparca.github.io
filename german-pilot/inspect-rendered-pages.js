const fs = require('fs');

function inspectPage(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const mainMatch = html.match(/id="mainimg"[^>]*src="([^"]+)"/);
  const thumbs = [...html.matchAll(/class="thumbs-row"[^>]*>([\s\S]*?)<\/div>/g)][0];
  const thumbUrls = thumbs ? [...thumbs[1].matchAll(/src="([^"]+)"/g)].map(m => m[1]) : [];
  const ctaMatch = html.match(/class="cta"[^>]*href="([^"]+)"/);

  console.log(`\n=== Inspection of ${filePath} ===`);
  console.log(`Main Image: ${mainMatch ? mainMatch[1] : 'NONE'}`);
  console.log(`Thumbnails count: ${thumbUrls.length}`);
  thumbUrls.forEach((u, i) => console.log(`  [${i + 1}] ${u}`));
  console.log(`CTA Link: ${ctaMatch ? ctaMatch[1] : 'NONE'}`);
}

inspectPage('dist/delonghi/magnifica-s/bruehgruppe/index.html');
inspectPage('dist/delonghi/magnifica-s/thermoblock/index.html');
inspectPage('dist/delonghi/magnifica-s/mahlwerk/index.html');
inspectPage('dist/delonghi/magnifica-s/drainageventil/index.html');
