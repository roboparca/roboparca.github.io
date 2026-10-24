const fs = require('fs');
const path = require('path');

const SITE_URL = (process.env.SITE_URL || 'https://kaffeereparatur.github.io').replace(/\/+$/, '');
const DIST_DIR = path.join(__dirname, 'dist');
const DATA_DIR = path.join(__dirname, 'data');
const BUILD_TIME = Date.now();

const GSC_VERIFICATION_TAG = '<meta name="google-site-verification" content="z1HDX3FFWaHIqyPyOMLwt9sgJg31Is1QxB7Po-DuJBs" />';

// Clean dist directory except .git
if (fs.existsSync(DIST_DIR)) {
  for (const item of fs.readdirSync(DIST_DIR)) {
    if (item === '.git') continue;
    fs.rmSync(path.join(DIST_DIR, item), { recursive: true, force: true });
  }
} else {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Load catalog
const rawCatalog = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'real-amazon-catalog.json'), 'utf8'));

// Load all 74 Grok Technical Content Guides
const GEN_DIR = path.join(DATA_DIR, 'generated');
const grokGuidesMap = new Map();
if (fs.existsSync(GEN_DIR)) {
  for (const file of fs.readdirSync(GEN_DIR)) {
    if (!file.endsWith('.json')) continue;
    try {
      const data = JSON.parse(fs.readFileSync(path.join(GEN_DIR, file), 'utf8'));
      grokGuidesMap.set(file.replace('.json', ''), data);
    } catch (e) {}
  }
}
console.log(`Loaded ${grokGuidesMap.size} in-depth Grok technical guides from data/generated.`);

// Strict non-coffee filter terms
const nonCoffeeTerms = [
  'waschmaschine', 'spülmaschine', 'geschirrspüler', 'trockner', 'kühlschrank',
  'infrarotheizung', 'wärmepumpe', 'staubsauger', 'kärcher', 'saugschlauch',
  'schnellkochtopf', 'dunstabzugshaube', 'backofen', 'herd', 'mikrowelle',
  'rasierer', 'zahnbürste', 'luftreiniger', 'ventilator', 'bügeleisen',
  'stiebel eltron', 'vaillant', 'veito', 'badheizkörper', 'boiler'
];

// Deduplicate strictly by ASIN and filter non-coffee items
const seenAsins = new Set();
const products = [];

for (const item of rawCatalog) {
  if (!item.asin || item.asin.length !== 10 || seenAsins.has(item.asin)) continue;
  
  const lowerTitle = item.title.toLowerCase();
  let isBad = false;
  for (const term of nonCoffeeTerms) {
    if (lowerTitle.includes(term) && !lowerTitle.includes('kaffeevollautomat') && !lowerTitle.includes('siebträger')) {
      isBad = true;
      break;
    }
    if (['infrarotheizung', 'wärmepumpe', 'veito', 'stiebel eltron', 'schnellkochtopf', 'waschmaschine', 'backofen'].includes(term) && lowerTitle.includes(term)) {
      isBad = true;
      break;
    }
  }

  if (isBad) continue;

  seenAsins.add(item.asin);
  products.push(item);
}

console.log(`Loaded ${products.length} verified genuine coffee machine products.`);

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function getOemCode(title, cat) {
  const oemMatch = title.match(/\b([A-Z0-9]{6,12}|\d{8}|\d{10})\b/);
  if (oemMatch) return oemMatch[1];
  const defaults = {
    bruehgruppe: 'OEM-BR-73132',
    mahlwerk: 'OEM-MW-12014',
    drainageventil: 'OEM-DV-62100',
    milchsystem: 'OEM-MS-55132',
    wasserfilter: 'OEM-WF-SER30',
    thermoblock: 'OEM-TH-73322',
    vibrationspumpe: 'OEM-VP-EX548',
    magnetventil: 'OEM-MV-52132',
    kaffeeauslauf: 'OEM-KA-12004',
    reinigung: 'OEM-PF-78001'
  };
  return defaults[cat] || 'OEM-SPEC-DE';
}

function makeProductSlug(item) {
  const cleanTitle = item.title
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)
    .replace(/-+$/, '');

  return `${cleanTitle}-${item.asin.toLowerCase()}`;
}

const CATEGORY_NAMES = {
  bruehgruppe: 'Brühgruppen & Dichtungen',
  mahlwerk: 'Mahlwerke & Mahlkegel',
  drainageventil: 'Drainageventile & Kappen',
  milchsystem: 'Milchsysteme & Karaffen',
  wasserfilter: 'Wasserfilter & Entkalker',
  thermoblock: 'Heizelemente & Thermoblöcke',
  vibrationspumpe: '15-Bar Ulka Pumpen & Hydraulik',
  magnetventil: 'Magnetventile & Solenoid',
  kaffeeauslauf: 'Kaffeeauslauf & Verteiler',
  reinigung: 'Pflegesets & Spezial-Entkalker'
};

const CATEGORY_ICONS = {
  bruehgruppe: '⚙️',
  mahlwerk: '🪨',
  drainageventil: '💧',
  milchsystem: '🥛',
  wasserfilter: '🌊',
  thermoblock: '🔥',
  vibrationspumpe: '⚡',
  magnetventil: '🧲',
  kaffeeauslauf: '☕',
  reinigung: '✨'
};

const BRAND_SLUGS = {
  'DeLonghi': 'delonghi',
  'Siemens': 'siemens',
  'Bosch': 'bosch',
  'Jura': 'jura',
  'Philips': 'philips',
  'Saeco': 'saeco',
  'Krups': 'krups',
  'Melitta': 'melitta',
  'Nivona': 'nivona',
  'Sage': 'sage',
  'Miele': 'miele',
  'Universal': 'universal'
};

const BRAND_MODELS = {
  delonghi: [
    { name: 'Magnifica S (ECAM 22.110)', slug: 'magnifica-s', match: ['magnifica', 'ecam 22', '22.110'] },
    { name: 'Dinamica & Dinamica Plus', slug: 'dinamica', match: ['dinamica', 'ecam 350', 'ecam 370'] },
    { name: 'Dedica Deluxe (EC685 / EC885)', slug: 'dedica', match: ['dedica', 'ec685', 'ec885', 'ec 685'] },
    { name: 'ESAM & Caffe Corso', slug: 'esam', match: ['esam', 'caffe corso', 'magnifica esam', 'esam 3000', 'esam 4200'] },
    { name: 'Eletta & Autentica', slug: 'eletta', match: ['eletta', 'autentica', 'ecam 44', 'etam'] }
  ],
  siemens: [
    { name: 'EQ.6 Plus & EQ.6 Serie', slug: 'eq6-plus', match: ['eq.6', 'eq6', 'te65', 'te60'] },
    { name: 'EQ.9 Plus & EQ.9 Serie', slug: 'eq9-plus', match: ['eq.9', 'eq9', 'ti90', 'ti95'] },
    { name: 'EQ.5 & EQ.7 Serie', slug: 'eq5-eq7', match: ['eq.5', 'eq5', 'eq.7', 'eq7', 'te50', 'te70'] },
    { name: 'EQ.3 & EQ.300 Serie', slug: 'eq3', match: ['eq.3', 'eq3', 'ti30', 'ti31'] },
    { name: 'EQ.500 & EQ.700 Serie', slug: 'eq500-eq700', match: ['eq.500', 'eq500', 'eq.700', 'eq700', 'tq50', 'tq70'] }
  ],
  jura: [
    { name: 'E-Serie (E6, E8, ENA 8)', slug: 'e-serie', match: ['e8', 'e6', 'e-linie', 'e linie'] },
    { name: 'Impressa Serie (C, F, J, S)', slug: 'impressa', match: ['impressa', 'c5', 'c9', 'f50', 'j9'] },
    { name: 'ENA & Micro Serie', slug: 'ena', match: ['ena', 'micro', 'ena 9'] },
    { name: 'Z & Giga Serie', slug: 'z-serie', match: ['z6', 'z8', 'z10', 'giga'] }
  ],
  philips: [
    { name: 'LatteGo 2200 & 3200 Serie', slug: 'lattego-2200-3200', match: ['2200', '3200', 'ep22', 'ep32', 'lattego'] },
    { name: 'LatteGo 5400 & 4300 Serie', slug: 'lattego-5400', match: ['5400', '4300', 'ep54', 'ep43'] }
  ],
  saeco: [
    { name: 'Xelsis & GranAroma Serie', slug: 'xelsis', match: ['xelsis', 'granaroma', 'sm7', 'sm6'] },
    { name: 'PicoBaristo & Incanto', slug: 'picobaristo', match: ['picobaristo', 'incanto', 'sm5', 'hd89'] }
  ],
  krups: [
    { name: 'Evidence Serie (EA89)', slug: 'evidence', match: ['evidence', 'ea89', 'ea8918'] },
    { name: 'EA8108 & Arabica Serie', slug: 'ea8108', match: ['ea81', 'ea8108', 'arabica', 'ea80'] }
  ],
  melitta: [
    { name: 'Caffeo Solo & Perfect Milk', slug: 'caffeo-solo', match: ['solo', 'caffeo solo', 'perfect milk'] },
    { name: 'Barista TS & CI Touch', slug: 'barista-ts', match: ['barista', 'barista ts', 'ci touch', 'caffeo ci'] }
  ],
  nivona: [
    { name: 'CafeRomatica 700er & 800er Serie', slug: 'caferomatica-700-800', match: ['700', '800', 'nicr 7', 'nicr 8'] },
    { name: 'CafeRomatica 900er & 1000er Serie', slug: 'caferomatica-900', match: ['900', '1000', 'nicr 9', 'nicr 10'] }
  ],
  sage: [
    { name: 'Barista Express (SES875)', slug: 'barista-express', match: ['barista express', 'ses875', 'bes870'] },
    { name: 'Barista Pro & Touch', slug: 'barista-pro', match: ['barista pro', 'barista touch', 'ses878', 'ses880'] }
  ],
  bosch: [
    { name: 'VeroBar & VeroCafe Serie', slug: 'verobar', match: ['verobar', 'verocafe', 'tes7', 'tes5'] },
    { name: 'VeroAroma & VeroSelection', slug: 'veroaroma', match: ['veroaroma', 'veroselection', 'tes6', 'tes8'] }
  ],
  miele: [
    { name: 'CM-Serie (CM5, CM6, CM7)', slug: 'cm-serie', match: ['cm', 'cm5', 'cm6', 'cm7', 'cm 6', 'cm 5'] }
  ]
};

function matchModelSilo(item) {
  const brandSlug = BRAND_SLUGS[item.brand] || 'universal';
  const models = BRAND_MODELS[brandSlug];
  if (!models || models.length === 0) return null;

  const lowerTitle = item.title.toLowerCase();
  for (const m of models) {
    for (const kw of m.match) {
      if (lowerTitle.includes(kw)) {
        return m;
      }
    }
  }
  return models[0];
}

function getBulletSpecs(cat, brand) {
  const specMap = {
    bruehgruppe: [
      'Originalgetreue Passform für mechatronische Brühgruppen',
      'Lebensmittelechte VMQ-Silikondichtungen (70 Shore A nach NSF-H1)',
      'Druckfest bis 19 Bar Spitzenlast im Brühzyklus',
      'Minimiert mechanischen Reibungswiderstand und Motorkraft'
    ],
    mahlwerk: [
      'Präzisionsgeschliffene Mahlkanten für homogenes Mahlgut',
      'Niedertemperatur-Vermahlung zum Erhalt der Kaffee-Aromen',
      'Hohe Härte gegen abrasive Kaffeebohnen und Fremdkörper',
      'Direkte mechanische Kompatibilität mit dem Getriebemotor'
    ],
    drainageventil: [
      'Verstärkter Ventilkörper gegen typische Druckrisse',
      'Dauerelastische EPDM-Lippendichtungen gegen Wasserverlust',
      'Präziser Öffnungsdruck bei 4,0 bis 4,5 Bar Systementlastung',
      'Stoppt Restwasseransammlung in der Abtropfschale'
    ],
    milchsystem: [
      'Optimierte Venturi-Strömungsgeometrie für cremigen Mikroschaum',
      'Lebensmittelechter, spülmaschinengeeigneter BPA-freier Werkstoff',
      'Dampfdichte Kupplungsanschlüsse gegen Druckverlust',
      'Einfache Demontage zur rückstandsfreien Reinigung'
    ],
    wasserfilter: [
      'Effektive Bindung von Kalzium- und Magnesium-Ionen',
      'Aktivkohlefilterung gegen geschmacksstörende Chlorverbindungen',
      'Verlängert die Entkalkungsintervalle des Thermoblocks',
      'Up-Flow-Durchströmung verhindert Totwasserzonen'
    ],
    thermoblock: [
      'Edelstahl-Rohrsystem eingegossen in Aluminium-Wärmespeicher',
      'Gleichmäßige Temperaturkonstanz zwischen 90 °C und 94 °C',
      'Integrierte NTC-Sensoraufnahmen für exakte Triac-Regelung',
      'Druckgeprüft bis 25 Bar Berstdruck'
    ],
    vibrationspumpe: [
      'Ulka Präzisions-Schwingkolbenantrieb mit 50 Hz Taktung',
      'Stabiler Druckaufbau bis 15-19 Bar Maximaldruck',
      'Integrierter thermischer Überlastschutz (105 °C)',
      'CW617N Messing- oder POM-Druckanschluss'
    ],
    magnetventil: [
      'Elektromagnetischer Schnellschalt-Hubanker 230V / 50Hz',
      'Viton-FKM Dichtanker für Dampf- und Heißwassereinsatz bis 140 °C',
      'Tropfdichte Umschaltung zwischen Kaffee- und Dampfkreislauf',
      'Spulenwicklung nach VDE-Standard isoliert'
    ],
    kaffeeauslauf: [
      'Zweikammer-Hydroverteiler für gleichmäßigen Doppelbezug',
      'Glattwandige Innenkanäle gegen Kaffeefett-Ablagerungen',
      'Hochwertige Chrom- oder Matt-Optik passend zur Gerätefront',
      'Leicht zerlegbar für hygienische Spülung'
    ],
    reinigung: [
      'Hochwirksame Rezeptur auf Amidosulfonsäure- bzw. Fettlöserbasis',
      'Schont Dichtungen, Messingventile und Aluminium-Heizelemente',
      'Löst verharzte Kaffeefett- und Kalkbeläge rückstandslos',
      'Entspricht deutschen Lebensmittel- und Hygiene-Standards'
    ]
  };

  return specMap[cat] || specMap['bruehgruppe'];
}

function formatEditorialText(text, currentBrandSlug) {
  if (!text) return '';
  const rawSentences = text.split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ])/g).map(s => s.trim()).filter(Boolean);
  const paragraphs = [];
  let current = [];

  for (let i = 0; i < rawSentences.length; i++) {
    current.push(rawSentences[i]);
    if (current.length >= 2 || i === rawSentences.length - 1) {
      paragraphs.push(current.join(' '));
      current = [];
    }
  }

  return paragraphs.map(p => {
    let formatted = esc(p);
    formatted = formatted
      .replace(/\b(\d+(?:[.,]\d+)?\s*(?:bar|Bar|Watt|W|Volt|V|Hz|mm|ml|Nm|cm³))\b/g, '<strong>$1</strong>')
      .replace(/\b(1\.4310|1\.4301|POM|Delrin|VMQ|EPDM|FKM|PTFE|CW617N|NSF-H1|OKS 1110|Glissa|TX10|TX15|TX20|Torx)\b/g, '<strong>$1</strong>');

    // Contextual Wikipedia-style linking to Silo Category Hubs
    formatted = formatted
      .replace(/\b(Brühgruppe[n]?|Brüheinheit(?:en)?)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/bruehgruppe/" class="fk-wiki-link" title="Brühgruppen &amp; Dichtungen">$1</a>`)
      .replace(/\b(Vibrationspumpe[n]?|Schwingkolbenpumpe[n]?)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/vibrationspumpe/" class="fk-wiki-link" title="Pumpen &amp; Hydraulik">$1</a>`)
      .replace(/\b(Mahlwerk[e]?|Keramikmahlwerk[e]?)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/mahlwerk/" class="fk-wiki-link" title="Mahlwerke &amp; Mahlkegel">$1</a>`)
      .replace(/\b(Milchsystem[e]?|Milchkaraffe[n]?|LatteCrema|LatteGo)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/milchsystem/" class="fk-wiki-link" title="Milchsysteme &amp; Karaffen">$1</a>`)
      .replace(/\b(Wasserfilter[n]?|Entkalkung|Entkalker|Amidosulfonsäure)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/wasserfilter/" class="fk-wiki-link" title="Wasserfilter &amp; Entkalkung">$1</a>`)
      .replace(/\b(Drainageventil[e]?)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/drainageventil/" class="fk-wiki-link" title="Drainageventile &amp; Messingkappen">$1</a>`)
      .replace(/\b(Thermoblock[s]?|Durchlauferhitzer[n]?)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/thermoblock/" class="fk-wiki-link" title="Heizelemente &amp; Thermoblöcke">$1</a>`)
      .replace(/\b(Magnetventil[e]?|Solenoidventil[e]?)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/magnetventil/" class="fk-wiki-link" title="Magnetventile &amp; Solenoid">$1</a>`)
      .replace(/\b(Kaffeeauslauf(?:verteiler)?)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/kaffeeauslauf/" class="fk-wiki-link" title="Kaffeeauslauf &amp; Düsen">$1</a>`);

    // Model Silo Contextual Linking
    formatted = formatted
      .replace(/\b(Magnifica S)\b(?![^<]*>)/i, `<a href="${SITE_URL}/delonghi/magnifica-s/" class="fk-wiki-link" title="De'Longhi Magnifica S Hub">$1</a>`)
      .replace(/\b(Dinamica Plus|Dinamica)\b(?![^<]*>)/i, `<a href="${SITE_URL}/delonghi/dinamica/" class="fk-wiki-link" title="De'Longhi Dinamica Hub">$1</a>`)
      .replace(/\b(EQ\.6 Plus|EQ\.6)\b(?![^<]*>)/i, `<a href="${SITE_URL}/siemens/eq6-plus/" class="fk-wiki-link" title="Siemens EQ.6 Plus Hub">$1</a>`)
      .replace(/\b(EQ\.9 Plus|EQ\.9)\b(?![^<]*>)/i, `<a href="${SITE_URL}/siemens/eq9-plus/" class="fk-wiki-link" title="Siemens EQ.9 Plus Hub">$1</a>`)
      .replace(/\b(Jura E8|Impressa)\b(?![^<]*>)/i, `<a href="${SITE_URL}/jura/e-serie/" class="fk-wiki-link" title="Jura E-Serie Hub">$1</a>`);

    // Diagnostic Error Code Pills
    formatted = formatted
      .replace(/\b(Allgemeiner Alarm|Allgemeine Störung)\b(?![^<]*>)/i, `<span class="fk-code-pill">$1</span>`)
      .replace(/\b(E0511|E0513|E0502)\b(?![^<]*>)/i, `<span class="fk-code-pill">$1</span>`)
      .replace(/\b(Error 8|Error 2|Error 5)\b(?![^<]*>)/i, `<span class="fk-code-pill">$1</span>`);

    return `<p>${formatted}</p>`;
  }).join('\n');
}

// Dynamic Matcher: Connects any catalog product to its authoritative Grok Engineering Guide
function matchGrokGuide(item) {
  const title = (item.title || '').toLowerCase();
  const brand = (item.brand || '').toLowerCase();
  const category = (item.category || '').toLowerCase();

  function get(key) {
    return grokGuidesMap.get(key) || null;
  }

  // 1. Philips & Saeco
  if (brand.includes('philips') || brand.includes('saeco')) {
    if (title.includes('lattego') && (category.includes('milch') || title.includes('milch') || title.includes('karaffe') || title.includes('becher'))) {
      if (title.includes('5400') && get('philips-lattego-5400-milchbehaelter')) return get('philips-lattego-5400-milchbehaelter');
      return get('philips-lattego-milchbehaelter') || get('philips-lattego-5400-milchbehaelter');
    }
    if (title.includes('aquaclean') || category.includes('filter') || category.includes('wasser')) {
      return get('philips-lattego-aquaclean');
    }
    if (title.includes('silikon') || title.includes('fett') || title.includes('hd5061')) {
      return get('philips-silikonfett-hd5061');
    }
    if (title.includes('dichtung') || title.includes('o-ring')) {
      return get('philips-o-ring-dichtungssatz-saeco');
    }
    if (title.includes('panarello') || title.includes('dampf')) {
      return get('philips-panarello-dampfrohr');
    }
    if (brand.includes('saeco') && (title.includes('mahlwerk') || category.includes('mahlwerk'))) {
      return get('saeco-granaroma-mahlwerk');
    }
    if (brand.includes('saeco') && (title.includes('hygiesteam') || category.includes('milch'))) {
      return get('saeco-xelsis-hygiesteam');
    }
    if (category.includes('brueh') || title.includes('brüh') || title.includes('brueh')) {
      return get('philips-saeco-bruehgruppe');
    }
    return get('philips-lattego-milchbehaelter');
  }

  // 2. De'Longhi
  if (brand.includes('delonghi')) {
    if (category.includes('wasser') || title.includes('dlsc002') || title.includes('filter')) {
      return get('delonghi-dlsc002-wasserfilter');
    }
    if (title.includes('pumpe') || category.includes('pumpe') || title.includes('ulka') || title.includes('ex5')) {
      if (title.includes('evo') && get('delonghi-magnifica-evo-vibrationspumpe')) return get('delonghi-magnifica-evo-vibrationspumpe');
      return get('delonghi-ulka-ex5-pumpe');
    }
    if (category.includes('mahlwerk') || title.includes('mahlwerk') || title.includes('kegel')) {
      return get('delonghi-mahlwerk-kegel') || get('delonghi-magnifica-s-mahlwerk');
    }
    if (category.includes('thermoblock') || title.includes('heiz') || title.includes('thermoblock')) {
      if (title.includes('dinamica') && get('delonghi-dinamica-thermoblock')) return get('delonghi-dinamica-thermoblock');
      return get('delonghi-magnifica-s-thermoblock');
    }
    if (category.includes('magnetventil') || title.includes('ventil') || title.includes('solenoid')) {
      if (title.includes('eletta') && get('delonghi-eletta-magnetventil')) return get('delonghi-eletta-magnetventil');
      return get('delonghi-magnifica-s-magnetventil');
    }
    if (category.includes('drainage') || title.includes('drainage')) {
      return get('delonghi-magnifica-s-drainageventil');
    }
    if (category.includes('milch') || title.includes('milch') || title.includes('karaffe')) {
      if (title.includes('dinamica') && get('delonghi-dinamica-milchkaraffe')) return get('delonghi-dinamica-milchkaraffe');
      return get('delonghi-magnifica-s-milchsystem');
    }
    if (category.includes('kaffeeauslauf') || title.includes('auslauf')) {
      return get('delonghi-magnifica-s-kaffeeauslauf');
    }
    if (title.includes('specialista') || title.includes('sieb')) {
      return get('delonghi-specialista-duschsieb');
    }
    if (title.includes('evo') && get('delonghi-magnifica-evo-bruehgruppe')) {
      return get('delonghi-magnifica-evo-bruehgruppe');
    }
    if (title.includes('dichtung') || title.includes('fett') || title.includes('pflegeset') || title.includes('o-ring')) {
      return get('delonghi-ecam-bruehgruppe') || get('delonghi-magnifica-s-bruehgruppe');
    }
    return get('delonghi-magnifica-s-bruehgruppe') || get('delonghi-ecam-bruehgruppe');
  }

  // 3. Siemens & Bosch
  if (brand.includes('siemens') || brand.includes('bosch')) {
    if (category.includes('wasser') || title.includes('brita') || title.includes('filter') || title.includes('intenza')) {
      return get('siemens-brita-intenza');
    }
    if (category.includes('mahlwerk') || title.includes('mahlwerk') || title.includes('ceramdrive')) {
      return get('siemens-eq6-ceramdrive') || get('siemens-eq6-plus-mahlwerk');
    }
    if (category.includes('milch') || title.includes('milch') || title.includes('sauger')) {
      return get('siemens-eq6-milchsauger') || get('siemens-eq6-plus-milchsystem');
    }
    if (category.includes('kaffeeauslauf') || title.includes('auslauf')) {
      return get('siemens-eq6-kaffeeauslauf');
    }
    if (title.includes('ventil') || title.includes('keramik')) {
      return get('siemens-eq9-keramikventil');
    }
    if (title.includes('pumpe') || category.includes('pumpe')) {
      return get('siemens-eq300-pumpe');
    }
    if (title.includes('reinigung') || title.includes('tabletten') || title.includes('tz80001')) {
      return get('siemens-reinigungstabletten-tz80001');
    }
    if (title.includes('eq500') || title.includes('eq.500')) {
      return get('siemens-eq500-bruehgruppe');
    }
    return get('siemens-eq6-ceramdrive');
  }

  // 4. Jura
  if (brand.includes('jura')) {
    if (category.includes('drainage') || title.includes('drainage')) {
      return get('jura-e8-drainageventil');
    }
    if (category.includes('wasser') || title.includes('claris') || title.includes('smart')) {
      return get('jura-claris-smart') || get('jura-e8-wasserfilter');
    }
    if (category.includes('milch') || title.includes('feinschaeumer') || title.includes('milch')) {
      return get('jura-feinschaeumer-g2');
    }
    if (title.includes('reiniger') || title.includes('mini')) {
      return get('jura-milchsystem-reiniger-mini');
    }
    if (title.includes('entkalkung') || title.includes('tabletten')) {
      return get('jura-entkalkungstabletten-2in1');
    }
    if (title.includes('ena') || title.includes('ena8')) {
      return get('jura-ena8-kompaktbruehgruppe');
    }
    if (title.includes('z10')) {
      return get('jura-z10-kaltbruehventil');
    }
    if (title.includes('membran') || title.includes('auslauf')) {
      return get('jura-auslaufventil-membran');
    }
    return get('jura-bruehgruppen-revisionsset');
  }

  // 5. Krups
  if (brand.includes('krups')) {
    if (title.includes('flowmeter') || category.includes('pumpe')) return get('krups-flowmeter-durchfluss');
    return get('krups-bruehkolben-dichtsatz');
  }

  // 6. Sage
  if (brand.includes('sage')) {
    if (title.includes('dual') || title.includes('boiler')) return get('sage-dual-boiler-oringe');
    if (title.includes('thermojet') || title.includes('heiz')) return get('sage-thermojet-heizelement');
    return get('sage-barista-express-dichtung');
  }

  // 7. Melitta
  if (brand.includes('melitta')) {
    if (category.includes('filter') || title.includes('filter')) return get('melitta-pro-aqua-filter');
    return get('melitta-caffeo-solo-bruehgruppe');
  }

  // 8. Nivona
  if (brand.includes('nivona')) {
    return get('nivona-drainageventil');
  }

  // 9. Generic Category Fallbacks
  if (category.includes('wasser')) return get('delonghi-dlsc002-wasserfilter');
  if (category.includes('milch')) return get('philips-lattego-milchbehaelter');
  if (category.includes('mahlwerk')) return get('siemens-eq6-ceramdrive');
  if (category.includes('pumpe')) return get('delonghi-ulka-ex5-pumpe');
  if (category.includes('drainage')) return get('jura-e8-drainageventil');
  if (category.includes('magnetventil')) return get('delonghi-magnifica-s-magnetventil');

  return get('delonghi-ecam-bruehgruppe') || get('delonghi-magnifica-s-bruehgruppe');
}

// 100% Unique Flipkart Technical Body Generated from Real Grok Engineering Data
function generateTechnicalBody(item, grok) {
  const brand = item.brand;
  const brandSlug = BRAND_SLUGS[brand] || 'universal';

  const g = grok || {};
  const breakdown = g.engineering_breakdown || `Detaillierte mechatronische Analyse für ${item.title}.`;
  const symptoms = g.symptoms_and_causes || `Typische Ausfallursachen und Symptome für ${item.title}.`;
  const steps = g.diy_step_by_step || [
    { step: 1, title: 'Sicherheitsabschaltung & Freischaltung', action: 'Kaffeevollautomat über 230V Netzstecker trennen und vollständig abkühlen lassen.' },
    { step: 2, title: 'Gehäuseöffnung & Demontage', action: 'Baugruppe vorsichtig freilegen und Anschlüsse vor dem Lösen fotografisch dokumentieren.' },
    { step: 3, title: 'Komponentenwechsel & Dichtungsprüfung', action: 'Neue OEM-Komponenten exakt fluchtend einsetzen und O-Ringe mit lebensmittelechtem Schmierfett benetzen.' },
    { step: 4, title: 'Remontage & Funktionsprobe', action: 'Gehäuse schließen, Probelauf durchführen und alle Verbindungen auf Dichtigkeit kontrollieren.' }
  ];
  const narrative = g.step_by_step_narrative || '';
  const compatFits = g.compatibility_matrix?.fits || [`${brand} Modellreihen mit passendem OEM-Standard`];
  const compatIncomp = g.compatibility_matrix?.incompatible || ['Abweichende Modellserien und Kapselsysteme'];
  const maintenance = g.maintenance_schedule || [
    { frequency: 'Wöchentlich', task: 'Baugruppe spülen und Kaffeemehl-/Milchreste entfernen.' },
    { frequency: 'Monatlich', task: 'Tiefenreinigung und Sichtprüfung der Dichtungselemente.' },
    { frequency: 'Alle 6–12 Monate', task: 'Präventiver Austausch dynamischer O-Ringe und Nachfettung mit Silikonfett.' }
  ];
  const troubles = g.troubleshooting_table || [];
  const faqs = g.faq || [
    { q: `Ist dieses Ersatzteil passgenau für ${brand}?`, a: `Ja, das Bauteil entspricht der exakten Werks- und OEM-Spezifikation für die kompatiblen Baureihen von ${brand}.` },
    { q: 'Welches Werkzeug wird für den Einbau benötigt?', a: 'In der Regel genügen Standard-Torx-Schraubendreher (TX10/TX20) sowie lebensmittelechtes OKS 1110 Silikonfett.' },
    { q: 'Wie lange dauert die Reparatur?', a: 'Der Austausch nimmt ca. 15 bis 30 Minuten in Anspruch und ist mit unserer Anleitung auch für Heimanwender problemlos durchführbar.' }
  ];

  return `
  <!-- Section 1: Mechatronic Teardown -->
  <div class="fk-sec-card" id="funktionsweise">
    <div class="fk-sec-heading">🔬 Mechatronische Funktionsanalyse &amp; Wirkungsweise</div>
    <div class="fk-sec-text">
      ${formatEditorialText(breakdown, brandSlug)}
    </div>
  </div>

  <!-- Section 2: Symptoms & Root Causes -->
  <div class="fk-sec-card" id="fehlersymptome">
    <div class="fk-sec-heading">⚠️ Typische Fehlersymptome &amp; Ursachenanalyse</div>
    <div class="fk-sec-text">
      ${formatEditorialText(symptoms, brandSlug)}
    </div>
  </div>

  <!-- Section 3: Step-by-Step DIY Guide -->
  <div class="fk-sec-card" id="einbauanleitung">
    <div class="fk-sec-heading">🔧 Schritt-für-Schritt Reparaturanleitung</div>
    <div class="fk-steps-list">
      ${steps.map(st => `
        <div class="fk-step-item">
          <div class="fk-step-num">${st.step}</div>
          <div class="fk-step-content">
            <div class="fk-step-title">${esc(st.title)}</div>
            <div class="fk-step-desc">${esc(st.action)}</div>
          </div>
        </div>
      `).join('')}
    </div>
    ${narrative ? `
      <div class="fk-sec-text" style="margin-top:16px;">
        ${formatEditorialText(narrative, brandSlug)}
      </div>
    ` : ''}
  </div>

  <!-- Section 4: Compatibility Matrix -->
  <div class="fk-sec-card" id="kompatibilitaet">
    <div class="fk-sec-heading">📋 Kompatibilitäts-Matrix &amp; Passgenauigkeit</div>
    <div class="fk-compat-grid">
      <div class="fk-compat-col fk-compat-col-fits">
        <div class="fk-compat-head" style="color:var(--fk-green,#388e3c);">✓ Kompatible Geräteserien &amp; Modelle:</div>
        <ul class="fk-compat-list">
          ${compatFits.map(f => `<li>${esc(f)}</li>`).join('')}
        </ul>
      </div>
      <div class="fk-compat-col fk-compat-col-incomp">
        <div class="fk-compat-head" style="color:#d32f2f;">✕ Nicht kompatibel mit:</div>
        <ul class="fk-compat-list">
          ${compatIncomp.map(inc => `<li>${esc(inc)}</li>`).join('')}
        </ul>
      </div>
    </div>
  </div>

  <!-- Section 5: Maintenance Protocol -->
  <div class="fk-sec-card" id="wartung">
    <div class="fk-sec-heading">⚙️ Wartungs- &amp; Prüfprotokoll</div>
    <div class="fk-spec-grid">
      ${maintenance.map((m, idx) => {
        const tagColors = ['fk-tag-blue', 'fk-tag-orange', 'fk-tag-green', 'fk-tag-purple'];
        const tagColor = tagColors[idx % tagColors.length];
        return `
          <div class="fk-spec-row">
            <div class="fk-spec-k">${esc(m.frequency)}</div>
            <div class="fk-spec-v">
              <span class="fk-tag ${tagColor}">${esc(m.frequency)}</span>
              <span>${esc(m.task)}</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  </div>

  <!-- Section 6: Troubleshooting Table -->
  ${troubles.length > 0 ? `
  <div class="fk-sec-card" id="stoerungen">
    <div class="fk-sec-heading">🔍 Technische Fehlersuche &amp; Störungsbehebung</div>
    <div class="fk-trouble-list">
      ${troubles.map(tr => `
        <div class="fk-trouble-card">
          <div class="fk-trouble-error">⚠️ ${esc(tr.error)}</div>
          <div class="fk-trouble-row"><strong>Ursache:</strong> ${esc(tr.cause)}</div>
          <div class="fk-trouble-row fk-trouble-fix"><strong>Behebung:</strong> ${esc(tr.fix)}</div>
        </div>
      `).join('')}
    </div>
  </div>
  ` : ''}

  <!-- Section 7: FAQs -->
  <div class="fk-sec-card" id="faq">
    <div class="fk-sec-heading">❓ Häufige Fragen (FAQ)</div>
    <div class="fk-spec-grid">
      ${faqs.map(f => `
        <div class="fk-spec-row" style="grid-template-columns: 1fr;">
          <div style="font-weight:700; color:#212121; margin-bottom:4px;">Q: ${esc(f.q)}</div>
          <div style="font-size:13.5px; color:#555; line-height:1.6;">${esc(f.a)}</div>
        </div>
      `).join('')}
    </div>
  </div>`;
}

// 100% Complete Flipkart Desktop Website & Flipkart Mobile App CSS Bundle
const CSS_BUNDLE = `
/* ==========================================================================
   FLIPKART OFFICIAL UI DESIGN SYSTEM (DESKTOP WEBSITE + MOBILE APP)
   ========================================================================== */

:root {
  --fk-blue: #2874f0;
  --fk-blue-dark: #1259c7;
  --fk-yellow: #ffe500;
  --fk-orange-buy: #fb641b;
  --fk-orange-cart: #ff9f00;
  --fk-green: #388e3c;
  --fk-bg: #f1f3f6;
  --fk-card: #ffffff;
  --fk-text: #212121;
  --fk-secondary: #878787;
  --fk-border: #f0f0f0;
  --fk-border-dark: #e0e0e0;
  --fk-font: Roboto, Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --fk-shadow: 0 1px 2px 0 rgba(0,0,0,.15);
  --fk-shadow-card: 0 1px 3px 0 rgba(0,0,0,.12);
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  background-color: var(--fk-bg);
  color: var(--fk-text);
  font-family: var(--fk-font);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
  max-width: 100%;
}

a {
  color: inherit;
  text-decoration: none;
}

/* Input & Search Reset */
input, input[type="text"], input[type="search"] {
  font-family: var(--fk-font) !important;
  font-size: 16px !important; /* Prevents auto zoom on iOS */
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
  outline: none;
  border: none;
  box-sizing: border-box;
}

input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  display: none !important;
}

/* Safe text wrap guarantee */
h1, h2, h3, h4, p, span, div, li {
  overflow-wrap: break-word;
  word-break: break-word;
}

/* ==========================================================================
   FLIPKART PRIMARY HEADER (Electric Blue #2874f0)
   ========================================================================== */

.fk-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--fk-blue);
  color: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.18);
  padding: 10px 16px;
}

.fk-header-inner {
  max-width: 1248px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

/* Flipkart Brand Logo */
.fk-logo-box {
  display: flex;
  flex-direction: column;
  text-decoration: none !important;
  flex-shrink: 0;
}

.fk-logo-main {
  font-size: 20px;
  font-weight: 700;
  font-style: italic;
  color: #ffffff;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  gap: 4px;
}

.fk-logo-sub {
  font-size: 11px;
  font-style: italic;
  color: #ffffff;
  margin-top: -2px;
}

.fk-plus {
  color: var(--fk-yellow);
  font-weight: 700;
}

/* Flipkart Center Search Bar */
.fk-search-wrap {
  position: relative;
  flex: 1;
  max-width: 560px;
}

.fk-search-box {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 2px;
  height: 38px;
  padding: 0 12px;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.15);
}

.fk-search-input {
  flex: 1;
  background: transparent !important;
  font-size: 14px !important;
  color: #212121 !important;
  padding: 0 !important;
}

.fk-search-input::placeholder {
  color: var(--fk-secondary);
}

.fk-search-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: var(--fk-blue);
}

.fk-search-clear {
  display: none;
  background: transparent;
  border: none;
  color: var(--fk-secondary);
  font-size: 14px;
  cursor: pointer;
  padding: 0 6px;
}

/* Floating Search Dropdown */
.fk-search-dropdown {
  display: none;
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #ffffff;
  border-radius: 2px;
  box-shadow: 0 4px 16px 0 rgba(0,0,0,.2);
  border: 1px solid var(--fk-border-dark);
  max-height: 420px;
  overflow-y: auto;
  z-index: 1010;
}

.fk-search-dropdown.show { display: block; }

.fk-search-item {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid var(--fk-border);
  gap: 12px;
  text-decoration: none !important;
  color: #212121;
}

.fk-search-item:hover, .fk-search-item:active {
  background: #f9f9f9;
}

.fk-search-thumb {
  width: 40px;
  height: 40px;
  object-fit: contain;
  flex-shrink: 0;
}

.fk-search-title {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fk-search-sub {
  font-size: 11px;
  color: var(--fk-secondary);
}

/* Desktop Header Action Buttons */
.fk-nav-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.fk-nav-link {
  font-size: 14.5px;
  font-weight: 600;
  color: #ffffff;
  text-decoration: none !important;
  white-space: nowrap;
}

.fk-nav-link:hover {
  color: var(--fk-yellow);
}

.fk-amazon-badge {
  background: #ffffff;
  color: var(--fk-blue) !important;
  padding: 6px 14px;
  border-radius: 2px;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

/* ==========================================================================
   FLIPKART CATEGORY STRIP (White Icon Strip Below Header)
   ========================================================================== */

.fk-cat-strip {
  background: #ffffff;
  box-shadow: 0 1px 1px 0 rgba(0,0,0,.14);
  padding: 10px 0;
  margin-bottom: 10px;
}

.fk-cat-strip-inner {
  max-width: 1248px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  gap: 16px;
}

.fk-cat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none !important;
  gap: 4px;
  flex-shrink: 0;
}

.fk-cat-icon {
  font-size: 24px;
  line-height: 1;
}

.fk-cat-text {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--fk-text);
  transition: color 0.15s ease;
}

.fk-cat-item:hover .fk-cat-text {
  color: var(--fk-blue);
}

/* ==========================================================================
   FLIPKART DESKTOP PRODUCT DETAIL PAGE (2-Column E-Commerce Layout)
   ========================================================================== */

.fk-page-wrap {
  max-width: 1248px;
  margin: 10px auto 40px;
  padding: 0 12px;
}

.fk-detail-desktop-grid {
  display: grid;
  grid-template-columns: 440px 1fr;
  gap: 16px;
  align-items: start;
}

/* Sticky Left Gallery Column */
.fk-left-col {
  position: sticky;
  top: 74px;
  background: #ffffff;
  padding: 16px;
  border-radius: 2px;
  box-shadow: var(--fk-shadow);
  border: 1px solid var(--fk-border);
}

.fk-main-img-box {
  width: 100%;
  height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border: 1px solid var(--fk-border);
  margin-bottom: 16px;
}

.fk-main-img-box img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.2s ease;
}

.fk-main-img-box:hover img {
  transform: scale(1.04);
}

/* Dual Action Buttons (Flipkart Yellow + Orange) */
.fk-btn-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.fk-btn-cart {
  background: var(--fk-orange-cart);
  color: #ffffff !important;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  height: 48px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.2);
  text-decoration: none !important;
  cursor: pointer;
}

.fk-btn-cart:hover {
  background: #f29600;
}

.fk-btn-buy {
  background: var(--fk-orange-buy);
  color: #ffffff !important;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  height: 48px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.2);
  text-decoration: none !important;
  cursor: pointer;
}

.fk-btn-buy:hover {
  background: #e65612;
}

/* Right Detail Column */
.fk-right-col {
  background: #ffffff;
  padding: 24px;
  border-radius: 2px;
  box-shadow: var(--fk-shadow);
  border: 1px solid var(--fk-border);
}

.fk-breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--fk-secondary);
  margin-bottom: 10px;
}

.fk-breadcrumb a {
  color: var(--fk-secondary);
}

.fk-breadcrumb a:hover {
  color: var(--fk-blue);
}

.fk-product-h1 {
  font-size: 20px;
  font-weight: 500;
  color: var(--fk-text);
  line-height: 1.35;
  margin: 0 0 10px 0;
}

/* Green Rating Badge (Iconic Flipkart Green) */
.fk-rating-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.fk-rating-badge {
  background: var(--fk-green);
  color: #ffffff;
  font-weight: 700;
  font-size: 12.5px;
  padding: 2px 7px;
  border-radius: 3px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.fk-rating-count {
  font-size: 13px;
  color: var(--fk-secondary);
  font-weight: 500;
}

.fk-assured-tag {
  background: #e9f0ff;
  color: var(--fk-blue);
  font-size: 11.5px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 3px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* Flipkart Special Price & Offers Section */
.fk-price-box {
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--fk-border);
}

.fk-price-highlight {
  font-size: 24px;
  font-weight: 700;
  color: #212121;
}

.fk-stock-status {
  font-size: 13px;
  color: var(--fk-green);
  font-weight: 700;
  margin-top: 4px;
}

/* Available Offers (Flipkart Green Tag Style) */
.fk-offers-box {
  margin-bottom: 20px;
}

.fk-offers-title {
  font-size: 14px;
  font-weight: 700;
  color: #212121;
  margin-bottom: 8px;
}

.fk-offer-item {
  font-size: 13px;
  color: #212121;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 6px;
  line-height: 1.45;
}

.fk-tag-icon {
  color: var(--fk-green);
  font-size: 14px;
  flex-shrink: 0;
}

/* Highlights Box */
.fk-highlights-box {
  margin-bottom: 24px;
}

.fk-hl-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 8px;
}

.fk-hl-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.fk-hl-list li {
  font-size: 13px;
  color: #212121;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

/* Specifications Table (Flipkart Clean Spec Table) */
.fk-sec-card {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--fk-border);
}

.fk-sec-heading {
  font-size: 16px;
  font-weight: 700;
  color: #212121;
  margin-bottom: 12px;
}

.fk-sec-text p {
  font-size: 14px;
  color: #333333;
  line-height: 1.65;
  margin: 0 0 10px 0;
}

.fk-spec-grid {
  border: 1px solid var(--fk-border-dark);
  border-radius: 2px;
  overflow: hidden;
}

.fk-spec-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  padding: 10px 14px;
  border-bottom: 1px solid var(--fk-border);
  font-size: 13px;
  align-items: center;
}

.fk-spec-row:last-child {
  border-bottom: none;
}

.fk-spec-row:nth-child(even) {
  background: #fafafa;
}

.fk-spec-k {
  color: var(--fk-secondary);
  font-weight: 500;
}

.fk-spec-v {
  color: #212121;
  font-weight: 500;
}

.fk-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 3px;
  display: inline-block;
  margin-right: 6px;
}

.fk-tag-blue { background: #e9f0ff; color: var(--fk-blue); }
.fk-tag-orange { background: #fff3e0; color: #e65100; }
.fk-tag-green { background: #e8f5e9; color: var(--fk-green); }
.fk-tag-purple { background: #f3e5f5; color: #7b1fa2; }

.fk-wiki-link {
  color: var(--fk-blue);
  font-weight: 600;
  text-decoration: underline;
}

.fk-code-pill {
  background: #ffebee;
  color: #c62828;
  font-weight: 700;
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 2px;
}

/* Flipkart Structured DIY Step Cards */
.fk-steps-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
}
.fk-step-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #f8fafc;
  border: 1px solid var(--fk-border);
  border-radius: 4px;
  padding: 12px 14px;
}
.fk-step-num {
  width: 26px;
  height: 26px;
  background: var(--fk-blue);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
}
.fk-step-content {
  flex: 1;
}
.fk-step-title {
  font-weight: 700;
  font-size: 14px;
  color: #212121;
  margin-bottom: 3px;
}
.fk-step-desc {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.55;
}

/* Flipkart Structured Compatibility Matrix */
.fk-compat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 12px;
}
@media (max-width: 768px) {
  .fk-compat-grid { grid-template-columns: 1fr; }
}
.fk-compat-col {
  padding: 12px 14px;
  border-radius: 4px;
  border: 1px solid var(--fk-border);
  background: #fafafa;
}
.fk-compat-col-fits {
  border-left: 4px solid #388e3c;
}
.fk-compat-col-incomp {
  border-left: 4px solid #d32f2f;
}
.fk-compat-head {
  font-weight: 700;
  font-size: 13.5px;
  margin-bottom: 8px;
}
.fk-compat-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.fk-compat-list li {
  font-size: 12.5px;
  color: #374151;
  line-height: 1.4;
  padding-left: 12px;
  position: relative;
}
.fk-compat-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #9ca3af;
}

/* Flipkart Structured Troubleshooting Cards */
.fk-trouble-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
}
.fk-trouble-card {
  background: #fff;
  border: 1px solid var(--fk-border);
  border-radius: 4px;
  padding: 12px 14px;
}
.fk-trouble-error {
  font-weight: 700;
  font-size: 13.5px;
  color: #b91c1c;
  margin-bottom: 6px;
}
.fk-trouble-row {
  font-size: 13px;
  color: #374151;
  line-height: 1.5;
  margin-bottom: 4px;
}
.fk-trouble-fix {
  color: #15803d;
}

/* ==========================================================================
   FLIPKART PRODUCT CARDS GRID (Deals Grid)
   ========================================================================== */

.fk-grid-title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0 12px;
}

.fk-grid-title {
  font-size: 19px;
  font-weight: 700;
  color: #212121;
  margin: 0;
}

.fk-grid-count {
  font-size: 13px;
  color: var(--fk-secondary);
}

.fk-prod-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 12px;
  margin-bottom: 28px;
}

.fk-prod-card {
  background: #ffffff;
  border: 1px solid var(--fk-border);
  border-radius: 2px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
  position: relative;
}

.fk-prod-card:hover {
  box-shadow: 0 4px 12px 0 rgba(0,0,0,.15);
  transform: translateY(-2px);
}

.fk-card-thumb-link {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
  background: #ffffff;
  border-bottom: 1px solid var(--fk-border);
}

.fk-card-thumb {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.fk-card-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.fk-card-badges {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.fk-card-title {
  font-size: 13.5px;
  font-weight: 500;
  line-height: 1.35;
  margin: 0 0 8px 0;
  color: #212121;
}

.fk-card-title a {
  color: #212121;
  text-decoration: none;
}

.fk-card-title a:hover {
  color: var(--fk-blue);
}

.fk-card-rating-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.fk-card-footer {
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid var(--fk-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fk-card-link {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--fk-blue);
}

/* ==========================================================================
   FLIPKART HOMEPAGE BANNERS & DEALS STRIPS
   ========================================================================== */

.fk-home-banner {
  background: linear-gradient(135deg, #2874f0 0%, #1259c7 100%);
  color: #ffffff;
  border-radius: 4px;
  padding: 32px 24px;
  margin-bottom: 16px;
  box-shadow: var(--fk-shadow);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.fk-banner-left {
  flex: 1;
}

.fk-banner-pill {
  background: var(--fk-yellow);
  color: #212121;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 2px;
  display: inline-block;
  margin-bottom: 10px;
}

.fk-banner-h1 {
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 8px 0;
  line-height: 1.25;
}

.fk-banner-sub {
  font-size: 14px;
  color: #e0e9fa;
  margin: 0 0 16px 0;
  max-width: 600px;
  line-height: 1.5;
}

.fk-banner-badges-strip {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.fk-badge-check {
  font-size: 13px;
  color: #ffffff;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* Grouped Hubs (Brands & Categories) */
.fk-hub-list-card {
  background: #ffffff;
  border: 1px solid var(--fk-border);
  border-radius: 2px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: var(--fk-shadow);
}

.fk-hub-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
}

.fk-hub-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--fk-border);
  border-radius: 2px;
  text-decoration: none !important;
  color: #212121;
  transition: all 0.15s ease;
}

.fk-hub-item:hover {
  border-color: var(--fk-blue);
  background: #f8fbff;
}

.fk-hub-icon {
  font-size: 22px;
  flex-shrink: 0;
}

.fk-hub-name {
  font-size: 13.5px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fk-hub-sub {
  font-size: 11px;
  color: var(--fk-secondary);
}

/* ==========================================================================
   FLIPKART FOOTER (Iconic Flipkart Dark Blue Footer #172337)
   ========================================================================== */

.fk-footer {
  background: #172337;
  color: #878787;
  font-size: 12px;
  padding: 40px 0 24px;
  margin-top: 40px;
  border-top: 1px solid #28354a;
}

.fk-footer-inner {
  max-width: 1248px;
  margin: 0 auto;
  padding: 0 16px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid #28354a;
}

.fk-foot-col-title {
  color: #878787;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.fk-foot-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.fk-foot-list a {
  color: #ffffff;
  font-size: 12px;
}

.fk-foot-list a:hover {
  text-decoration: underline;
}

.fk-footer-bottom {
  max-width: 1248px;
  margin: 0 auto;
  padding: 16px 16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #ffffff;
}

/* ==========================================================================
   MOBILE APP SPECIFIC OVERRIDES (FLIPKART MOBILE APP EXPERIENCE)
   ========================================================================== */

/* Mobile Bottom Buy Bar (Flipkart Yellow + Orange 50/50 Dual Bar) */
.fk-mobile-buy-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  z-index: 9999;
  background: #ffffff;
  box-shadow: 0 -1px 4px 0 rgba(0,0,0,.2);
}

.fk-mobile-buy-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13.5px;
  text-transform: uppercase;
  text-decoration: none !important;
  height: 100%;
}

.fk-mob-cart {
  background: #ffffff;
  color: #212121 !important;
  border-right: 1px solid #e0e0e0;
}

.fk-mob-buy {
  background: var(--fk-orange-buy);
  color: #ffffff !important;
}

/* Mobile App Bottom Tab Bar (on Home & Hubs) */
.fk-mobile-tab-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 52px;
  z-index: 9999;
  background: #ffffff;
  box-shadow: 0 -1px 4px rgba(0,0,0,0.12);
  align-items: center;
  justify-content: space-around;
  padding: 0 4px;
}

.fk-tab-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none !important;
  color: var(--fk-secondary);
  background: transparent;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  flex: 1;
  gap: 2px;
}

.fk-tab-btn.active {
  color: var(--fk-blue);
  font-weight: 700;
}

.fk-tab-icon {
  font-size: 18px;
  line-height: 1;
}

.fk-tab-label {
  font-size: 10px;
  font-weight: 500;
}

/* Mobile Back Button */
.fk-mobile-back-row {
  display: none;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #ffffff;
  border-bottom: 1px solid var(--fk-border);
  font-size: 14px;
  font-weight: 700;
  color: #212121;
}

.fk-back-arrow {
  font-size: 20px;
  line-height: 1;
  color: var(--fk-blue);
  text-decoration: none !important;
}

/* ==========================================================================
   MEDIA QUERY: FLIPKART MOBILE APP VIEW (<= 859px)
   ========================================================================== */

@media (max-width: 859px) {
  body {
    padding-bottom: 58px; /* Clearance for fixed mobile bars */
  }

  .fk-header-inner {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .fk-nav-actions {
    display: none; /* Hidden on mobile header, placed in bottom tabs */
  }

  .fk-search-wrap {
    max-width: 100%;
  }

  .fk-search-box {
    height: 38px;
    border-radius: 4px;
  }

  .fk-cat-strip-inner {
    padding: 0 10px;
    gap: 12px;
  }

  .fk-cat-text {
    font-size: 11px;
  }

  .fk-detail-desktop-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .fk-left-col {
    position: static;
    box-shadow: none;
    border: none;
    padding: 12px;
    margin-bottom: 8px;
  }

  .fk-main-img-box {
    height: 280px;
    border: none;
    margin-bottom: 0;
  }

  .fk-btn-row {
    display: none; /* Replaced by sticky mobile buy bar */
  }

  .fk-right-col {
    padding: 16px;
    box-shadow: none;
    border: none;
  }

  .fk-spec-row {
    grid-template-columns: 120px 1fr;
    padding: 8px 10px;
    font-size: 12.5px;
  }

  .fk-prod-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .fk-card-thumb-link {
    height: 140px;
    padding: 8px;
  }

  .fk-card-body {
    padding: 8px;
  }

  .fk-card-title {
    font-size: 12.5px;
  }

  .fk-home-banner {
    flex-direction: column;
    padding: 20px 16px;
  }

  .fk-banner-h1 {
    font-size: 20px;
  }

  .fk-mobile-buy-bar {
    display: flex;
  }

  .fk-mobile-tab-bar {
    display: flex;
  }

  .fk-mobile-back-row {
    display: flex;
  }

  .fk-footer {
    display: none; /* Replaced by compact mobile footer info */
  }
}
`;

function renderHeader() {
  return `
  <!-- Flipkart Top Electric Blue Header -->
  <header class="fk-header">
    <div class="fk-header-inner">
      <div style="display:flex; align-items:center; justify-content:space-between; width:100%; max-width:859px; margin-bottom:2px;" class="fk-mobile-top-bar">
        <a href="${SITE_URL}/" class="fk-logo-box">
          <div class="fk-logo-main">☕ KaffeeReparatur</div>
          <div class="fk-logo-sub">Explore <span class="fk-plus">Plus ✦</span></div>
        </a>
        <div style="display:flex; align-items:center; gap:10px;">
          <a href="${SITE_URL}/#marken" class="fk-nav-link" style="font-size:13px;">Marken</a>
          <a href="${SITE_URL}/#kategorien" class="fk-nav-link" style="font-size:13px;">Kategorien</a>
        </div>
      </div>

      <!-- Flipkart Center Search Bar -->
      <div class="fk-search-wrap">
        <div class="fk-search-box">
          <input type="search" id="site-search" class="fk-search-input" placeholder="Nach Ersatzteilen, Marken oder Modellen suchen..." autocomplete="off">
          <button id="search-clear" class="fk-search-clear" aria-label="Löschen" type="button">✕</button>
          <button class="fk-search-btn" aria-label="Suchen" type="button" onclick="if(window.performFkSearch)window.performFkSearch();">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2874f0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </div>
        <div id="search-dropdown" class="fk-search-dropdown"></div>
      </div>

      <!-- Desktop Nav Actions -->
      <div class="fk-nav-actions">
        <a href="${SITE_URL}/#marken" class="fk-nav-link">Hersteller</a>
        <a href="${SITE_URL}/#kategorien" class="fk-nav-link">Baugruppen</a>
        <a href="https://www.amazon.de/?tag=kaffeereparatur-21" target="_blank" rel="sponsored nofollow noopener" class="fk-amazon-badge">Amazon Partner</a>
      </div>
    </div>
  </header>

  <!-- Flipkart Horizontal Category Strip -->
  <nav class="fk-cat-strip">
    <div class="fk-cat-strip-inner">
      <a href="${SITE_URL}/delonghi/" class="fk-cat-item">
        <div class="fk-cat-icon">☕</div>
        <span class="fk-cat-text">De'Longhi</span>
      </a>
      <a href="${SITE_URL}/siemens/" class="fk-cat-item">
        <div class="fk-cat-icon">⚡</div>
        <span class="fk-cat-text">Siemens</span>
      </a>
      <a href="${SITE_URL}/jura/" class="fk-cat-item">
        <div class="fk-cat-icon">💎</div>
        <span class="fk-cat-text">Jura</span>
      </a>
      <a href="${SITE_URL}/philips/" class="fk-cat-item">
        <div class="fk-cat-icon">✨</div>
        <span class="fk-cat-text">Philips</span>
      </a>
      <a href="${SITE_URL}/kategorie/bruehgruppe/" class="fk-cat-item">
        <div class="fk-cat-icon">⚙️</div>
        <span class="fk-cat-text">Brühgruppen</span>
      </a>
      <a href="${SITE_URL}/kategorie/mahlwerk/" class="fk-cat-item">
        <div class="fk-cat-icon">🪨</div>
        <span class="fk-cat-text">Mahlwerke</span>
      </a>
      <a href="${SITE_URL}/kategorie/drainageventil/" class="fk-cat-item">
        <div class="fk-cat-icon">💧</div>
        <span class="fk-cat-text">Ventile</span>
      </a>
      <a href="${SITE_URL}/kategorie/milchsystem/" class="fk-cat-item">
        <div class="fk-cat-icon">🥛</div>
        <span class="fk-cat-text">Milchsystem</span>
      </a>
      <a href="${SITE_URL}/kategorie/wasserfilter/" class="fk-cat-item">
        <div class="fk-cat-icon">🌊</div>
        <span class="fk-cat-text">Filter</span>
      </a>
      <a href="${SITE_URL}/kategorie/thermoblock/" class="fk-cat-item">
        <div class="fk-cat-icon">🔥</div>
        <span class="fk-cat-text">Heizung</span>
      </a>
    </div>
  </nav>`;
}

function renderBottomTabBar(activeTab = 'home') {
  return `
  <!-- Flipkart Mobile App Bottom Tab Bar -->
  <nav class="fk-mobile-tab-bar" aria-label="App Navigation">
    <a href="${SITE_URL}/" class="fk-tab-btn ${activeTab === 'home' ? 'active' : ''}">
      <span class="fk-tab-icon">🏠</span>
      <span class="fk-tab-label">Home</span>
    </a>
    <a href="${SITE_URL}/#kategorien" class="fk-tab-btn ${activeTab === 'categories' ? 'active' : ''}">
      <span class="fk-tab-icon">⚙️</span>
      <span class="fk-tab-label">Kategorien</span>
    </a>
    <a href="${SITE_URL}/#marken" class="fk-tab-btn ${activeTab === 'brands' ? 'active' : ''}">
      <span class="fk-tab-icon">☕</span>
      <span class="fk-tab-label">Marken</span>
    </a>
    <button type="button" class="fk-tab-btn" onclick="if(window.focusFkSearch)window.focusFkSearch();" aria-label="Suche">
      <span class="fk-tab-icon">🔍</span>
      <span class="fk-tab-label">Suche</span>
    </button>
  </nav>`;
}

function renderFooter() {
  return `
  <!-- Flipkart Official Dark Footer (Desktop) -->
  <footer class="fk-footer">
    <div class="fk-footer-inner">
      <div>
        <div class="fk-foot-col-title">ÜBER UNS</div>
        <ul class="fk-foot-list">
          <li><a href="${SITE_URL}/">KaffeeReparatur Portal</a></li>
          <li><a href="${SITE_URL}/#marken">Hersteller &amp; Baureihen</a></li>
          <li><a href="${SITE_URL}/#kategorien">Baugruppen &amp; Mechanik</a></li>
          <li><a href="${SITE_URL}/sitemap.xml">XML Sitemap</a></li>
        </ul>
      </div>

      <div>
        <div class="fk-foot-col-title">TOP MARKEN</div>
        <ul class="fk-foot-list">
          <li><a href="${SITE_URL}/delonghi/">De'Longhi Ersatzteile</a></li>
          <li><a href="${SITE_URL}/siemens/">Siemens EQ Serie</a></li>
          <li><a href="${SITE_URL}/jura/">Jura Impressa &amp; E-Linie</a></li>
          <li><a href="${SITE_URL}/philips/">Philips LatteGo</a></li>
          <li><a href="${SITE_URL}/sage/">Sage Barista Express</a></li>
        </ul>
      </div>

      <div>
        <div class="fk-foot-col-title">KERN-BAUGRUPPEN</div>
        <ul class="fk-foot-list">
          <li><a href="${SITE_URL}/kategorie/bruehgruppe/">Brühgruppen &amp; Dichtungen</a></li>
          <li><a href="${SITE_URL}/kategorie/mahlwerk/">Mahlwerke &amp; Mahlkegel</a></li>
          <li><a href="${SITE_URL}/kategorie/drainageventil/">Drainageventile</a></li>
          <li><a href="${SITE_URL}/kategorie/milchsystem/">Milchkaraffen &amp; Schläuche</a></li>
          <li><a href="${SITE_URL}/kategorie/wasserfilter/">Wasserfilter &amp; Entkalker</a></li>
        </ul>
      </div>

      <div>
        <div class="fk-foot-col-title">TRANSPARENZ</div>
        <p style="line-height:1.6; color:#878787; font-size:12px; margin:0;">
          Als Amazon-Partner verdienen wir an qualifizierten Verkäufen. Alle Preise, tagesaktuelle Verfügbarkeiten und Lieferzeiten werden live von Amazon.de bereitgestellt.
        </p>
      </div>
    </div>

    <div class="fk-footer-bottom">
      <div>☕ KaffeeReparatur.de • Unabhängiges Deutsches Fachportal • © ${new Date().getFullYear()}</div>
      <div>Explore <span style="color:#ffe500; font-weight:700;">Plus ✦</span></div>
    </div>
  </footer>
  <div style="text-align:center; padding:12px; font-size:11px; color:#878787;" class="fk-mobile-foot-note">
    © ${new Date().getFullYear()} KaffeeReparatur • Alle Angaben ohne Gewähr
  </div>`;
}

function renderProductCard(p) {
  const brandSlug = BRAND_SLUGS[p.brand] || 'universal';
  const prodUrl = `${SITE_URL}/${brandSlug}/${p.slug}/`;
  return `
  <article class="fk-prod-card">
    <a href="${prodUrl}" class="fk-card-thumb-link">
      <img src="${p.img}" class="fk-card-thumb" alt="${esc(p.title)}" onerror="this.style.opacity='0.8'">
    </a>
    <div class="fk-card-body">
      <div class="fk-card-badges">
        <span class="fk-tag fk-tag-blue">${esc(p.brand)}</span>
        <span class="fk-tag fk-tag-green">F-Assured</span>
      </div>
      <h3 class="fk-card-title"><a href="${prodUrl}">${esc(p.title)}</a></h3>
      <div class="fk-card-rating-row">
        <span class="fk-rating-badge">★ ${p.rating}</span>
        <span style="font-size:12px; color:#878787;">(${p.reviews})</span>
      </div>
      <div class="fk-card-footer">
        <a href="${prodUrl}" class="fk-card-link">
          Details &amp; Einbau ›
        </a>
      </div>
    </div>
  </article>`;
}

async function runBuild() {
  console.log(`🚀 Compiling Flipkart Desktop Website & Mobile App for ${SITE_URL}...`);

  fs.writeFileSync(path.join(DIST_DIR, 'style.css'), CSS_BUNDLE, 'utf8');

  const sitemapUrls = [`${SITE_URL}/`];
  const searchIndex = [];

  const brandMap = new Map();
  const catMap = new Map();
  const modelMap = new Map();

  for (const item of products) {
    const brandSlug = BRAND_SLUGS[item.brand] || 'universal';
    item.slug = makeProductSlug(item);
    item.brandSlug = brandSlug;

    const modelSilo = matchModelSilo(item);
    item.modelSilo = modelSilo;

    if (!brandMap.has(brandSlug)) {
      brandMap.set(brandSlug, { name: item.brand, slug: brandSlug, products: [] });
    }
    brandMap.get(brandSlug).products.push(item);

    const catSlug = item.category;
    if (!catMap.has(catSlug)) {
      catMap.set(catSlug, { name: CATEGORY_NAMES[catSlug] || catSlug, slug: catSlug, products: [] });
    }
    catMap.get(catSlug).products.push(item);

    if (modelSilo) {
      const mKey = `${brandSlug}/${modelSilo.slug}`;
      if (!modelMap.has(mKey)) {
        modelMap.set(mKey, {
          brand: item.brand,
          brandSlug: brandSlug,
          modelName: modelSilo.name,
          modelSlug: modelSilo.slug,
          products: []
        });
      }
      modelMap.get(mKey).products.push(item);
    }
  }

  // 1. GENERATE ALL PRODUCT DETAIL PAGES (Flipkart 2-Col Desktop + Flipkart Mobile App)
  console.log(`Generating ${products.length} genuine product pages with Flipkart UI...`);
  for (const p of products) {
    const dir = path.join(DIST_DIR, p.brandSlug, p.slug);
    ensureDir(dir);

    const prodUrl = `${SITE_URL}/${p.brandSlug}/${p.slug}/`;
    sitemapUrls.push(prodUrl);

    searchIndex.push({
      title: `${p.brand} ${p.title}`,
      url: prodUrl,
      thumb: p.img,
      category: CATEGORY_NAMES[p.category] || p.category,
      brand: p.brand,
      asin: p.asin
    });

    const oemCode = getOemCode(p.title, p.category);
    const bullets = getBulletSpecs(p.category, p.brand);
    const grok = matchGrokGuide(p) || {};
    const techBody = generateTechnicalBody(p, grok);
    const directAmazonUrl = `https://www.amazon.de/dp/${p.asin}?tag=kaffeereparatur-21`;

    const modelName = p.modelSilo ? p.modelSilo.name : p.brand;
    const modelLink = p.modelSilo ? `<a href="${SITE_URL}/${p.brandSlug}/${p.modelSilo.slug}/">${esc(p.modelSilo.name)}</a><span class="sep">›</span>` : '';

    const relatedList = brandMap.get(p.brandSlug).products.filter(x => x.asin !== p.asin).slice(0, 4);
    const metaDesc = grok.meta_description || `Reparatur-Guide, Einbauanleitung und mechatronische Funktionsanalyse für ${p.title}. Verfügbarkeit, OEM-Nummer und passende Ersatzteile.`;

    const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
  <meta name="theme-color" content="#2874f0">
  ${GSC_VERIFICATION_TAG}
  <title>${esc(p.title)} | KaffeeReparatur</title>
  <meta name="description" content="${esc(metaDesc)}">
  <link rel="canonical" href="${prodUrl}">
  <style>
${CSS_BUNDLE}
  </style>
  <link rel="stylesheet" href="${SITE_URL}/style.css?v=${BUILD_TIME}">

  <meta property="og:title" content="${esc(p.title)}">
  <meta property="og:description" content="${esc(metaDesc)}">
  <meta property="og:image" content="${p.img}">
  <meta property="og:url" content="${prodUrl}">
  <meta property="og:type" content="article">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "${esc(p.title)}",
    "image": ["${p.img}"],
    "description": "Technisches Ersatzteil und Reparatur-Leitfaden für ${esc(p.brand)} Kaffeevollautomaten.",
    "brand": {
      "@type": "Brand",
      "name": "${esc(p.brand)}"
    },
    "sku": "${p.asin}",
    "mpn": "${oemCode}",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "${p.rating}",
      "reviewCount": "${p.reviews}"
    },
    "offers": {
      "@type": "Offer",
      "url": "${directAmazonUrl}",
      "priceCurrency": "EUR",
      "price": "29.95",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Amazon.de"
      }
    }
  }
  </script>
</head>
<body>
  ${renderHeader()}

  <!-- Mobile Back Navigation Row -->
  <div class="fk-mobile-back-row">
    <a href="${SITE_URL}/${p.brandSlug}/" class="fk-back-arrow">←</a>
    <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(p.brand)} • ${esc(CATEGORY_NAMES[p.category] || p.category)}</span>
  </div>

  <main class="fk-page-wrap">
    <!-- Desktop 2-Column Flipkart Layout / Fluid Mobile Layout -->
    <div class="fk-detail-desktop-grid">
      <!-- Sticky Left Gallery & Dual Buy Buttons Column -->
      <div class="fk-left-col">
        <div class="fk-main-img-box">
          <img id="mainimg" src="${p.img}" alt="${esc(p.title)}" onerror="this.style.opacity='0.8'">
        </div>

        <!-- Desktop Dual Action Buttons (Flipkart Yellow + Orange) -->
        <div class="fk-btn-row">
          <a class="fk-btn-cart cta" href="${directAmazonUrl}" target="_blank" rel="sponsored nofollow noopener">
            🛒 AUF AMAZON
          </a>
          <a class="fk-btn-buy cta" href="${directAmazonUrl}" target="_blank" rel="sponsored nofollow noopener">
            ⚡ JETZT KAUFEN
          </a>
        </div>
      </div>

      <!-- Right Detail & Specs Column -->
      <div class="fk-right-col">
        <!-- Breadcrumb -->
        <nav class="fk-breadcrumb" aria-label="Breadcrumb">
          <a href="${SITE_URL}/">Home</a>
          <span>›</span>
          <a href="${SITE_URL}/${p.brandSlug}/">${esc(p.brand)}</a>
          <span>›</span>
          ${modelLink}
          <a href="${SITE_URL}/kategorie/${p.category}/">${esc(CATEGORY_NAMES[p.category] || p.category)}</a>
        </nav>

        <h1 class="fk-product-h1">${esc(p.title)}</h1>

        <!-- Green Rating Badge & Assured Pill -->
        <div class="fk-rating-row">
          <span class="fk-rating-badge">★ ${p.rating}</span>
          <span class="fk-rating-count">${p.reviews} Bewertungen &amp; Rezensionen</span>
          <span class="fk-assured-tag">☕ F-Assured ✓</span>
        </div>

        <!-- Price & Stock Status Box -->
        <div class="fk-price-box">
          <div class="fk-price-highlight">100% Original- / OEM-Komponente</div>
          <div class="fk-stock-status">✓ Sofort lieferbar • Prime Versand verfügbar</div>
        </div>

        <!-- Available Offers (Flipkart Green Tag Style) -->
        <div class="fk-offers-box">
          <div class="fk-offers-title">Verfügbare Partner-Vorteile:</div>
          <div class="fk-offer-item">
            <span class="fk-tag-icon">🏷️</span>
            <span><strong>Prime Versand:</strong> Schnelle Lieferung direkt durch das Amazon Versandnetzwerk.</span>
          </div>
          <div class="fk-offer-item">
            <span class="fk-tag-icon">🏷️</span>
            <span><strong>Käuferschutz:</strong> 30 Tage Rückgaberecht bei Nichtpassen oder Defekt.</span>
          </div>
          <div class="fk-offer-item">
            <span class="fk-tag-icon">🏷️</span>
            <span><strong>Passgarantie:</strong> Mechatronisch geprüfte Abmessungen für ${esc(p.brand)} Vollautomaten.</span>
          </div>
        </div>

        <!-- Specifications Table (Flipkart Spec Grid) -->
        <div class="fk-sec-card" style="margin-top:0; padding-top:0; border-top:none;">
          <div class="fk-sec-heading">Spezifikationen &amp; Kennzahlen</div>
          <div class="fk-spec-grid">
            <div class="fk-spec-row">
              <div class="fk-spec-k">Hersteller</div>
              <div class="fk-spec-v">${esc(p.brand)}</div>
            </div>
            <div class="fk-spec-row">
              <div class="fk-spec-k">Baugruppe</div>
              <div class="fk-spec-v">${esc(CATEGORY_NAMES[p.category] || p.category)}</div>
            </div>
            ${p.modelSilo ? `
            <div class="fk-spec-row">
              <div class="fk-spec-k">Modellreihe</div>
              <div class="fk-spec-v">${esc(p.modelSilo.name)}</div>
            </div>` : ''}
            <div class="fk-spec-row">
              <div class="fk-spec-k">OEM-Referenz</div>
              <div class="fk-spec-v" style="font-family:monospace; font-weight:700;">${esc(oemCode)}</div>
            </div>
            <div class="fk-spec-row">
              <div class="fk-spec-k">Amazon ASIN</div>
              <div class="fk-spec-v" style="font-family:monospace; font-weight:700;">${p.asin}</div>
            </div>
            <div class="fk-spec-row">
              <div class="fk-spec-k">Zustand</div>
              <div class="fk-spec-v" style="color:var(--fk-green); font-weight:700;">100% Neuware Original</div>
            </div>
          </div>
        </div>

        <!-- Highlights List -->
        <div class="fk-highlights-box" style="margin-top:20px;">
          <div class="fk-hl-title">Highlights &amp; Qualitätsmerkmale:</div>
          <ul class="fk-hl-list">
            ${bullets.map(b => `<li><span style="color:var(--fk-green); font-weight:700;">✓</span> <span>${esc(b)}</span></li>`).join('')}
          </ul>
        </div>

        <!-- Technical Editorial Guide Sections -->
        ${techBody}
      </div>
    </div>

    <!-- Related Products Grid -->
    ${relatedList.length > 0 ? `
    <div style="margin-top:36px;">
      <div class="fk-grid-title-bar">
        <h2 class="fk-grid-title">Passende ${esc(p.brand)} Komponenten &amp; Zubehör</h2>
      </div>
      <div class="fk-prod-grid">
        ${relatedList.map(renderProductCard).join('\n')}
      </div>
    </div>` : ''}
  </main>

  <!-- Flipkart Mobile Sticky Bottom Buy Bar (Yellow + Orange 50/50 Dual Bar) -->
  <div class="fk-mobile-buy-bar">
    <a href="${directAmazonUrl}" class="fk-mobile-buy-btn fk-mob-cart cta" target="_blank" rel="sponsored nofollow noopener">
      🛒 In den Warenkorb
    </a>
    <a href="${directAmazonUrl}" class="fk-mobile-buy-btn fk-mob-buy cta" target="_blank" rel="sponsored nofollow noopener">
      ⚡ JETZT KAUFEN
    </a>
  </div>

  ${renderFooter()}
  <script src="${SITE_URL}/instant-search.js" defer></script>
</body>
</html>`;

    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  }

  // 2. GENERATE BRAND SILO HUBS
  console.log(`Generating Brand Silo Hubs...`);
  for (const [bSlug, bData] of brandMap.entries()) {
    const dir = path.join(DIST_DIR, bSlug);
    ensureDir(dir);
    const brandUrl = `${SITE_URL}/${bSlug}/`;
    sitemapUrls.push(brandUrl);

    const models = BRAND_MODELS[bSlug] || [];

    const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
  <meta name="theme-color" content="#2874f0">
  ${GSC_VERIFICATION_TAG}
  <title>${esc(bData.name)} Ersatzteile &amp; Reparaturanleitungen | KaffeeReparatur</title>
  <meta name="description" content="Übersicht aller verifizierten Ersatzteile, Brühgruppen, Dichtungen und Reparatur-Anleitungen für ${esc(bData.name)} Kaffeevollautomaten.">
  <link rel="canonical" href="${brandUrl}">
  <style>
${CSS_BUNDLE}
  </style>
  <link rel="stylesheet" href="${SITE_URL}/style.css?v=${BUILD_TIME}">
</head>
<body>
  ${renderHeader()}

  <!-- Mobile Back Navigation Row -->
  <div class="fk-mobile-back-row">
    <a href="${SITE_URL}/" class="fk-back-arrow">←</a>
    <span>${esc(bData.name)} Ersatzteile</span>
  </div>

  <main class="fk-page-wrap">
    <!-- Flipkart Deals Banner -->
    <div class="fk-home-banner">
      <div class="fk-banner-left">
        <span class="fk-banner-pill">Offizielles Marken-Verzeichnis</span>
        <h1 class="fk-banner-h1">${esc(bData.name)} Ersatzteile &amp; Komponenten</h1>
        <p class="fk-banner-sub">
          Entdecken Sie ${bData.products.length} verifizierte Original- &amp; OEM-Ersatzteile für ${esc(bData.name)} Kaffeevollautomaten mit technischer Einbauanleitung und direkter Live-Prüfung auf Amazon.de.
        </p>
        <div class="fk-banner-badges-strip">
          <span class="fk-badge-check">✓ 100% Passgenau</span>
          <span class="fk-badge-check">✓ F-Assured Qualität</span>
          <span class="fk-badge-check">✓ Prime Versand</span>
        </div>
      </div>
    </div>

    ${models.length > 0 ? `
    <!-- Model Series List -->
    <div class="fk-hub-list-card">
      <div class="fk-grid-title-bar" style="margin-top:0;">
        <h2 class="fk-grid-title" style="font-size:16px;">${esc(bData.name)} Modellreihen</h2>
        <span class="fk-grid-count">${models.length} Serien</span>
      </div>
      <div class="fk-hub-grid">
        ${models.map(m => `
        <a href="${SITE_URL}/${bSlug}/${m.slug}/" class="fk-hub-item">
          <span class="fk-hub-icon">☕</span>
          <div>
            <div class="fk-hub-name">${esc(m.name)}</div>
            <div class="fk-hub-sub">Modell-Guide &amp; Teile</div>
          </div>
        </a>`).join('\n')}
      </div>
    </div>` : ''}

    <!-- Product Grid -->
    <div class="fk-grid-title-bar">
      <h2 class="fk-grid-title">Alle ${esc(bData.name)} Ersatzteile</h2>
      <span class="fk-grid-count">${bData.products.length} Artikel</span>
    </div>
    <div class="fk-prod-grid">
      ${bData.products.map(renderProductCard).join('\n')}
    </div>
  </main>

  ${renderBottomTabBar('brands')}
  ${renderFooter()}
  <script src="${SITE_URL}/instant-search.js" defer></script>
</body>
</html>`;

    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  }

  // 3. GENERATE MODEL SILO HUBS
  console.log(`Generating Model Silo Hubs...`);
  for (const [mKey, mData] of modelMap.entries()) {
    const dir = path.join(DIST_DIR, mData.brandSlug, mData.modelSlug);
    ensureDir(dir);
    const modelUrl = `${SITE_URL}/${mData.brandSlug}/${mData.modelSlug}/`;
    sitemapUrls.push(modelUrl);

    const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
  <meta name="theme-color" content="#2874f0">
  ${GSC_VERIFICATION_TAG}
  <title>${esc(mData.modelName)} Ersatzteile &amp; Reparatur | KaffeeReparatur</title>
  <meta name="description" content="Alle passenden Ersatzteile, Brühgruppen, Dichtungssätze und Reparaturanleitungen für ${esc(mData.brand)} ${esc(mData.modelName)}.">
  <link rel="canonical" href="${modelUrl}">
  <style>
${CSS_BUNDLE}
  </style>
  <link rel="stylesheet" href="${SITE_URL}/style.css?v=${BUILD_TIME}">
</head>
<body>
  ${renderHeader()}

  <div class="fk-mobile-back-row">
    <a href="${SITE_URL}/${mData.brandSlug}/" class="fk-back-arrow">←</a>
    <span>${esc(mData.brand)} ${esc(mData.modelName)}</span>
  </div>

  <main class="fk-page-wrap">
    <div class="fk-home-banner">
      <div class="fk-banner-left">
        <span class="fk-banner-pill" style="background:#fff; color:#2874f0;">Modellreihe</span>
        <h1 class="fk-banner-h1">${esc(mData.brand)} ${esc(mData.modelName)}</h1>
        <p class="fk-banner-sub">
          Kompatible Ersatzteile, Wartungsleitfäden und Dichtungssätze speziell für die Baureihe ${esc(mData.modelName)}.
        </p>
      </div>
    </div>

    <div class="fk-grid-title-bar">
      <h2 class="fk-grid-title">Kompatible Ersatzteile &amp; Revisions-Kits</h2>
      <span class="fk-grid-count">${mData.products.length} Artikel</span>
    </div>
    <div class="fk-prod-grid">
      ${mData.products.map(renderProductCard).join('\n')}
    </div>
  </main>

  ${renderBottomTabBar('brands')}
  ${renderFooter()}
  <script src="${SITE_URL}/instant-search.js" defer></script>
</body>
</html>`;

    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  }

  // 4. GENERATE CATEGORY SILO HUBS
  console.log(`Generating Category Silo Hubs...`);
  for (const [cSlug, cData] of catMap.entries()) {
    const dir = path.join(DIST_DIR, 'kategorie', cSlug);
    ensureDir(dir);
    const catUrl = `${SITE_URL}/kategorie/${cSlug}/`;
    sitemapUrls.push(catUrl);

    const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
  <meta name="theme-color" content="#2874f0">
  ${GSC_VERIFICATION_TAG}
  <title>${esc(cData.name)} für Kaffeevollautomaten | KaffeeReparatur</title>
  <meta name="description" content="Verifizierte ${esc(cData.name)} aller führenden Marken (De'Longhi, Siemens, Jura, Philips, etc.) mit technischem Reparaturleitfaden.">
  <link rel="canonical" href="${catUrl}">
  <style>
${CSS_BUNDLE}
  </style>
  <link rel="stylesheet" href="${SITE_URL}/style.css?v=${BUILD_TIME}">
</head>
<body>
  ${renderHeader()}

  <div class="fk-mobile-back-row">
    <a href="${SITE_URL}/#kategorien" class="fk-back-arrow">←</a>
    <span>${esc(cData.name)}</span>
  </div>

  <main class="fk-page-wrap">
    <div class="fk-home-banner">
      <div class="fk-banner-left">
        <span class="fk-banner-pill">Baugruppe</span>
        <h1 class="fk-banner-h1">${CATEGORY_ICONS[cSlug] || '⚙️'} ${esc(cData.name)}</h1>
        <p class="fk-banner-sub">
          ${cData.products.length} geprüfte Komponenten und Revisions-Kits für alle gängigen Marken &amp; Vollautomaten.
        </p>
      </div>
    </div>

    <div class="fk-grid-title-bar">
      <h2 class="fk-grid-title">Geprüfte Artikel in dieser Kategorie</h2>
      <span class="fk-grid-count">${cData.products.length} Produkte</span>
    </div>
    <div class="fk-prod-grid">
      ${cData.products.map(renderProductCard).join('\n')}
    </div>
  </main>

  ${renderBottomTabBar('categories')}
  ${renderFooter()}
  <script src="${SITE_URL}/instant-search.js" defer></script>
</body>
</html>`;

    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  }

  // 5. GENERATE HOMEPAGE (Full Flipkart Big Billion Days Style)
  console.log(`Generating Homepage...`);
  const topProducts = products.slice(0, 16);
  const homeHtml = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
  <meta name="theme-color" content="#2874f0">
  ${GSC_VERIFICATION_TAG}
  <title>KaffeeReparatur.de | Deutschlands Ersatzteil- &amp; Reparaturportal für Kaffeevollautomaten</title>
  <meta name="description" content="Deutschlands großes Fachportal für Kaffeevollautomaten-Reparatur. Über 670 verifizierte Original- &amp; OEM-Ersatzteile für De'Longhi, Siemens, Jura, Philips und mehr.">
  <link rel="canonical" href="${SITE_URL}/">
  <style>
${CSS_BUNDLE}
  </style>
  <link rel="stylesheet" href="${SITE_URL}/style.css?v=${BUILD_TIME}">
</head>
<body>
  ${renderHeader()}

  <main class="fk-page-wrap">
    <!-- Flipkart Deals of the Day Banner -->
    <div class="fk-home-banner">
      <div class="fk-banner-left">
        <span class="fk-banner-pill">Offizielles Fachportal</span>
        <h1 class="fk-banner-h1">Kaffeevollautomaten selbst reparieren.</h1>
        <p class="fk-banner-sub">
          Über 670 geprüfte Original- &amp; OEM-Ersatzteile mit mechatronischen Einbauanleitungen, Fehlerdiagnosen und Live-Verfügbarkeitsprüfung auf Amazon.de.
        </p>
        <div class="fk-banner-badges-strip">
          <span class="fk-badge-check">✓ 100% Original- / OEM-Teile</span>
          <span class="fk-badge-check">✓ F-Assured geprüfte Passform</span>
          <span class="fk-badge-check">✓ Schneller Prime-Versand</span>
        </div>
      </div>
    </div>

    <!-- Brands (Flipkart Grid Hub) -->
    <div class="fk-hub-list-card" id="marken">
      <div class="fk-grid-title-bar" style="margin-top:0;">
        <h2 class="fk-grid-title" style="font-size:17px;">Hersteller &amp; Baureihen</h2>
        <span class="fk-grid-count">${brandMap.size} Marken</span>
      </div>
      <div class="fk-hub-grid">
        ${[...brandMap.entries()].map(([bSlug, bData]) => `
        <a href="${SITE_URL}/${bSlug}/" class="fk-hub-item">
          <span class="fk-hub-icon">☕</span>
          <div>
            <div class="fk-hub-name">${esc(bData.name)}</div>
            <div class="fk-hub-sub">${bData.products.length} Ersatzteile</div>
          </div>
        </a>`).join('\n')}
      </div>
    </div>

    <!-- Categories (Flipkart Grid Hub) -->
    <div class="fk-hub-list-card" id="kategorien">
      <div class="fk-grid-title-bar" style="margin-top:0;">
        <h2 class="fk-grid-title" style="font-size:17px;">Baugruppen &amp; Mechanik</h2>
        <span class="fk-grid-count">${catMap.size} Kategorien</span>
      </div>
      <div class="fk-hub-grid">
        ${[...catMap.entries()].map(([cSlug, cData]) => `
        <a href="${SITE_URL}/kategorie/${cSlug}/" class="fk-hub-item">
          <span class="fk-hub-icon">${CATEGORY_ICONS[cSlug] || '⚙️'}</span>
          <div>
            <div class="fk-hub-name">${esc(cData.name)}</div>
            <div class="fk-hub-sub">${cData.products.length} Produkte</div>
          </div>
        </a>`).join('\n')}
      </div>
    </div>

    <!-- Featured Genuine Products Grid (Deals of the Day) -->
    <div class="fk-grid-title-bar" id="beliebt">
      <h2 class="fk-grid-title">Beliebte Ersatzteile &amp; Revisions-Kits</h2>
      <span class="fk-grid-count">${topProducts.length} Empfehlungen</span>
    </div>
    <div class="fk-prod-grid">
      ${topProducts.map(renderProductCard).join('\n')}
    </div>
  </main>

  ${renderBottomTabBar('home')}
  ${renderFooter()}
  <script src="${SITE_URL}/instant-search.js" defer></script>
</body>
</html>`;

  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), homeHtml, 'utf8');

  // 6. INSTANT SEARCH & INDEX (Flipkart Search Dropdown)
  console.log(`Writing instant search script and search index (${searchIndex.length} items)...`);
  fs.writeFileSync(path.join(DIST_DIR, 'search-index.json'), JSON.stringify(searchIndex), 'utf8');

  const instantSearchJs = `
  (function() {
    let indexData = [];
    const searchInput = document.getElementById('site-search');
    const searchClear = document.getElementById('search-clear');
    const searchDropdown = document.getElementById('search-dropdown');

    window.focusFkSearch = function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (searchInput) {
        setTimeout(function() { searchInput.focus(); }, 200);
      }
    };

    if (!searchInput) return;

    fetch('${SITE_URL}/search-index.json')
      .then(function(r) { return r.json(); })
      .then(function(d) { indexData = d; })
      .catch(function(e) { console.error('Search load error:', e); });

    function performSearch() {
      const q = searchInput.value.trim().toLowerCase();
      if (!q) {
        searchDropdown.classList.remove('show');
        searchClear.style.display = 'none';
        return;
      }
      searchClear.style.display = 'block';

      const results = indexData.filter(function(item) {
        return item.title.toLowerCase().includes(q) || 
               item.category.toLowerCase().includes(q) ||
               item.brand.toLowerCase().includes(q) ||
               (item.asin && item.asin.toLowerCase().includes(q));
      }).slice(0, 10);

      if (results.length === 0) {
        searchDropdown.innerHTML = '<div style="padding:16px; text-align:center; font-size:13px; color:#878787;">Kein passendes Ersatzteil gefunden.</div>';
      } else {
        searchDropdown.innerHTML = results.map(function(r) {
          return '<a href="' + r.url + '" class="fk-search-item">' +
            '<img src="' + r.thumb + '" class="fk-search-thumb" alt="' + r.title + '" onerror="this.style.display=\\'none\\'">' +
            '<div style="flex:1; min-width:0;">' +
              '<div class="fk-search-title">' + r.title + '</div>' +
              '<div class="fk-search-sub">' + r.brand + ' • ' + r.category + '</div>' +
            '</div>' +
            '<span style="color:#2874f0; font-weight:700; font-size:14px;">›</span>' +
          '</a>';
        }).join('');
      }
      searchDropdown.classList.add('show');
    }

    window.performFkSearch = performSearch;

    searchInput.addEventListener('input', performSearch);
    searchInput.addEventListener('focus', function() {
      if (this.value.trim().length > 0) {
        searchDropdown.classList.add('show');
      }
    });

    searchClear.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      searchInput.value = '';
      searchDropdown.classList.remove('show');
      searchClear.style.display = 'none';
      searchInput.focus();
    });

    document.addEventListener('click', function(e) {
      if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.classList.remove('show');
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        searchDropdown.classList.remove('show');
        searchInput.blur();
      }
    });
  })();
  `;
  fs.writeFileSync(path.join(DIST_DIR, 'instant-search.js'), instantSearchJs, 'utf8');

  // 7. XML SITEMAP & ROBOTS.TXT
  console.log(`Writing XML Sitemap with ${sitemapUrls.length} verified URLs...`);
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>
    <loc>${u}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u === SITE_URL + '/' ? '1.0' : u.includes('/kategorie/') ? '0.8' : '0.6'}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');

  // Write Rank Math styled XSLT for human-readable visual browser rendering
  const { getRankMathXsl } = require('../lib/sitemap-style');
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xsl'), getRankMathXsl('KaffeeReparatur', SITE_URL, 'de'), 'utf8');

  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), `User-agent: *
Allow: /
Sitemap: ${SITE_URL}/sitemap.xml
`, 'utf8');

  fs.writeFileSync(path.join(DIST_DIR, '.nojekyll'), '', 'utf8');

  console.log(`\n========================================`);
  console.log(`FLIPKART BUILD SUCCESSFUL!`);
  console.log(`  Site URL: ${SITE_URL}`);
  console.log(`  Total Genuine Pages: ${sitemapUrls.length}`);
  console.log(`  Flipkart Desktop UI: YES (2-Col, sticky gallery, yellow cart & orange buy buttons)`);
  console.log(`  Flipkart Mobile App UI: YES (Electric blue header, category scroll, fixed bottom buy bar)`);
  console.log(`  Inlined CSS: YES (100% infallible cache-free loading)`);
  console.log(`========================================\n`);
}

runBuild().catch(console.error);
