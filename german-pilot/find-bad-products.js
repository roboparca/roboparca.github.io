const fs = require('fs');

const catalog = JSON.parse(fs.readFileSync('data/real-amazon-catalog.json', 'utf8'));
console.log(`Auditing all ${catalog.length} items in catalog for non-coffee products...`);

const nonCoffeeTerms = [
  'waschmaschine', 'spülmaschine', 'geschirrspüler', 'trockner', 'kühlschrank',
  'infrarotheizung', 'wärmepumpe', 'staubsauger', 'kärcher', 'saugschlauch',
  'schnellkochtopf', 'dunstabzugshaube', 'backofen', 'herd', 'mikrowelle',
  'rasierer', 'zahnbürste', 'luftreiniger', 'ventilator', 'bügeleisen',
  'stiebel eltron', 'vaillant', 'veito', 'badheizkörper', 'boiler'
];

const badItems = [];
const cleanItems = [];

for (const item of catalog) {
  const lowerTitle = item.title.toLowerCase();
  const lowerQuery = (item.query || '').toLowerCase();
  
  let isBad = false;
  for (const term of nonCoffeeTerms) {
    if (lowerTitle.includes(term)) {
      isBad = true;
      badItems.push({ item, reason: term });
      break;
    }
  }
  
  if (!isBad) {
    cleanItems.push(item);
  }
}

console.log(`Found ${badItems.length} BAD (non-coffee) products:`);
for (const b of badItems) {
  console.log(`  ❌ [${b.item.asin}] (${b.item.brand}) ${b.item.title.slice(0, 70)} [Reason: ${b.reason}]`);
}

console.log(`\nClean coffee products remaining: ${cleanItems.length}`);
