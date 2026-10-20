const fs = require('fs');
const path = require('path');

function extractMainContent(html) {
  // Extract content between <article class="main-content prose"> and </article>
  // plus the product-info hero box
  const articleMatch = html.match(/<article[\s\S]*?<\/article>/i);
  const heroMatch = html.match(/<div class="product-info"[\s\S]*?<\/table>/i);
  let text = '';
  if (heroMatch) text += heroMatch[0] + ' ';
  if (articleMatch) text += articleMatch[0];
  if (!text) {
    const mainMatch = html.match(/<main[\s\S]*?<\/main>/i);
    text = mainMatch ? mainMatch[0] : html;
  }
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function extractFullPageText(html) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function getTokens(str) {
  return str.split(/[\s,.;:!?"'()\[\]{}<>\/\\~`@#$%^&*+=|_-]+/).filter(w => w.length > 2);
}

function getShingles(tokens, n = 3) {
  const shingles = new Set();
  for (let i = 0; i <= tokens.length - n; i++) {
    shingles.add(tokens.slice(i, i + n).join(' '));
  }
  return shingles;
}

function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : (intersection / union);
}

function getAllProductPages(dir) {
  let pages = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'kategori' && entry.name !== 'marka') {
        pages = pages.concat(getAllProductPages(fullPath));
      }
    } else if (entry.name === 'index.html') {
      const parts = fullPath.split(path.sep);
      const distIdx = parts.lastIndexOf('dist');
      if (parts.length - 1 - distIdx === 4) {
        pages.push(fullPath);
      }
    }
  }
  return pages;
}

const allPages = getAllProductPages(path.join(__dirname, 'dist'));
console.log('Total 1,200 product pages verified:', allPages.length);

// Let's test a sample of 120 pages (1 per model, covering all brands and parts)
// to get a thorough pairwise matrix of 7,140 comparisons:
// 1. Same model across different parts
// 2. Same part across different models
// 3. Different brand & different part
const sample = [];
const step = Math.floor(allPages.length / 120);
for (let i = 0; i < allPages.length; i += step) {
  sample.push(allPages[i]);
  if (sample.length >= 120) break;
}

console.log('Sampled ' + sample.length + ' pages for pairwise matrix (' + ((sample.length * (sample.length - 1)) / 2) + ' total pairwise comparisons)...');

const analyzed = sample.map(p => {
  const html = fs.readFileSync(p, 'utf8');
  const mainText = extractMainContent(html);
  const fullText = extractFullPageText(html);
  const mainTokens = getTokens(mainText);
  const mainShingles = getShingles(mainTokens, 3);
  const mainTokenSet = new Set(mainTokens);
  
  const fullTokens = getTokens(fullText);
  const fullShingles = getShingles(fullTokens, 3);
  const fullTokenSet = new Set(fullTokens);

  return {
    path: p,
    mainShingles,
    mainTokenSet,
    fullShingles,
    fullTokenSet,
    mainWordCount: mainTokens.length,
    fullWordCount: fullTokens.length
  };
});

let mainHighMatchesShingles = 0;
let mainHighMatchesTokens = 0;
let fullHighMatchesShingles = 0;
let fullHighMatchesTokens = 0;

let maxMainShingle = 0;
let maxMainToken = 0;
let maxFullShingle = 0;
let maxFullToken = 0;

let worstMainPair = null;
let worstFullPair = null;

let totalPairs = 0;
let sumMainShingle = 0;
let sumMainToken = 0;
let sumFullShingle = 0;
let sumFullToken = 0;

for (let i = 0; i < analyzed.length; i++) {
  for (let j = i + 1; j < analyzed.length; j++) {
    totalPairs++;
    
    // Main Content
    const ms = jaccardSimilarity(analyzed[i].mainShingles, analyzed[j].mainShingles);
    const mt = jaccardSimilarity(analyzed[i].mainTokenSet, analyzed[j].mainTokenSet);
    sumMainShingle += ms;
    sumMainToken += mt;
    if (ms > maxMainShingle) { maxMainShingle = ms; worstMainPair = [analyzed[i].path, analyzed[j].path, ms, mt]; }
    if (mt > maxMainToken) { maxMainToken = mt; }
    if (ms >= 0.50) mainHighMatchesShingles++;
    if (mt >= 0.50) mainHighMatchesTokens++;

    // Full Page
    const fsSim = jaccardSimilarity(analyzed[i].fullShingles, analyzed[j].fullShingles);
    const ftSim = jaccardSimilarity(analyzed[i].fullTokenSet, analyzed[j].fullTokenSet);
    sumFullShingle += fsSim;
    sumFullToken += ftSim;
    if (fsSim > maxFullShingle) { maxFullShingle = fsSim; worstFullPair = [analyzed[i].path, analyzed[j].path, fsSim, ftSim]; }
    if (ftSim > maxFullToken) { maxFullToken = ftSim; }
    if (fsSim >= 0.50) fullHighMatchesShingles++;
    if (ftSim >= 0.50) fullHighMatchesTokens++;
  }
}

const avgMainShingle = (sumMainShingle / totalPairs) * 100;
const avgMainToken = (sumMainToken / totalPairs) * 100;
const avgFullShingle = (sumFullShingle / totalPairs) * 100;
const avgFullToken = (sumFullToken / totalPairs) * 100;

console.log('\n======================================================');
console.log('📊 DUPLICATE CONTENT & SIMILARITY AUDIT REPORT');
console.log('======================================================');
console.log('Total Comparisons Evaluated:', totalPairs);
console.log('Average Words per Page (Main Editorial):', Math.round(analyzed.reduce((a,b)=>a+b.mainWordCount,0)/analyzed.length));
console.log('Average Words per Page (Full HTML Text):', Math.round(analyzed.reduce((a,b)=>a+b.fullWordCount,0)/analyzed.length));

console.log('\n--- 1. MAIN EDITORIAL / ARTICLE BODY (Googlebot Core Content) ---');
console.log('Average 3-Gram Phrase Overlap (Copyscape Metric): ' + avgMainShingle.toFixed(2) + '%');
console.log('Average Word Vocabulary Overlap (Jaccard): ' + avgMainToken.toFixed(2) + '%');
console.log('Max 3-Gram Phrase Match: ' + (maxMainShingle * 100).toFixed(2) + '%');
console.log('Max Word Vocabulary Match: ' + (maxMainToken * 100).toFixed(2) + '%');
console.log('Pairs with >= 50% 3-Gram Phrase Match: ' + mainHighMatchesShingles + ' / ' + totalPairs + ' (' + ((mainHighMatchesShingles / totalPairs) * 100).toFixed(2) + '%)');
console.log('Pairs with >= 50% Word Overlap: ' + mainHighMatchesTokens + ' / ' + totalPairs + ' (' + ((mainHighMatchesTokens / totalPairs) * 100).toFixed(2) + '%)');
if (worstMainPair) {
  console.log('Highest Matching Main Content Pair:');
  console.log('  Page A:', path.relative(__dirname, worstMainPair[0]));
  console.log('  Page B:', path.relative(__dirname, worstMainPair[1]));
  console.log('  3-Gram Match: ' + (worstMainPair[2] * 100).toFixed(2) + '% | Token Match: ' + (worstMainPair[3] * 100).toFixed(2) + '%');
}

console.log('\n--- 2. FULL RAW PAGE (Including Header, Navigation, Footer, ASIN CTAs) ---');
console.log('Average 3-Gram Phrase Overlap: ' + avgFullShingle.toFixed(2) + '%');
console.log('Average Word Vocabulary Overlap: ' + avgFullToken.toFixed(2) + '%');
console.log('Max 3-Gram Phrase Match: ' + (maxFullShingle * 100).toFixed(2) + '%');
console.log('Max Word Vocabulary Match: ' + (maxFullToken * 100).toFixed(2) + '%');
console.log('Pairs with >= 50% 3-Gram Phrase Match: ' + fullHighMatchesShingles + ' / ' + totalPairs + ' (' + ((fullHighMatchesShingles / totalPairs) * 100).toFixed(2) + '%)');
console.log('Pairs with >= 50% Word Overlap: ' + fullHighMatchesTokens + ' / ' + totalPairs + ' (' + ((fullHighMatchesTokens / totalPairs) * 100).toFixed(2) + '%)');
console.log('======================================================\n');
