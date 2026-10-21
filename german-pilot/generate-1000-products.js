// german-pilot/generate-1000-products.js
// Generates 1,120 deep programmatic products across 112 models and 10 Google.de search-intent categories.
// Every product is crafted around what German coffee machine owners search on Google.de.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const models = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'models-de.json'), 'utf8'));
const asinsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'amazon-de-asins.json'), 'utf8'));

// 10 Core Google.de Search-Intent Categories
const CATEGORIES = [
  {
    slug: 'bruehgruppe',
    name: 'Brühgruppe & Dichtungen',
    partNamePrefix: 'Brühgruppe Revision & O-Ring Dichtungsset',
    actionTitle: 'Brühgruppe klemmt & Revision',
    googleIntent: 'brühgruppe klemmt schwergängig quietscht nullstellung dichtungswechsel',
    imageKey: {
      delonghi: 'delonghi-ecam-bruehgruppe',
      siemens: 'siemens-eq6-brueheinheit',
      jura: 'jura-bruehgruppen-revisionsset',
      philips: 'philips-saeco-bruehgruppe',
      saeco: 'philips-saeco-bruehgruppe',
      krups: 'krups-bruehkolben-dichtsatz',
      melitta: 'melitta-caffeo-solo-bruehgruppe',
      nivona: 'melitta-caffeo-solo-bruehgruppe',
      bosch: 'siemens-eq500-bruehgruppe',
      miele: 'melitta-caffeo-solo-bruehgruppe',
      sage: 'sage-barista-express-dichtung'
    },
    oemMap: {
      delonghi: '7313251451',
      siemens: '11014117',
      jura: '10188',
      philips: 'CP0250/01',
      saeco: 'CP0250/01',
      krups: 'MS-5945333',
      melitta: '6716059',
      nivona: '6716059',
      bosch: '11014117',
      miele: '6716059',
      sage: 'SP0020017'
    },
    specs: ['POM Delrin Polyacetal', '15-19 Bar Brühdruckfest', '2x VMQ 70 Shore A O-Ringe', '1.4310 Edelstahl-Brühsieb'],
    summaryTemplate: (m) => `Originalgetreue Brühgruppe und Dichtungssatz für ${m.brand} ${m.name}. Löst zuverlässig Klemmen, Quietschgeräusche und nassen Tresterschlamm.`
  },
  {
    slug: 'vibrationspumpe',
    name: 'Pumpen & Hydraulik',
    partNamePrefix: 'Ulka EX5 Vibrationspumpe 15-19 Bar (Messingauslauf)',
    actionTitle: 'Pumpe brummt & zieht kein Wasser: 15-Bar Ulka EX5',
    googleIntent: 'pumpe brummt laut kein wasser kaffee tröpfelt druckverlust entlüften',
    imageKey: {
      default: 'delonghi-ulka-ex5-pumpe',
      siemens: 'siemens-eq300-pumpe',
      bosch: 'siemens-eq300-pumpe'
    },
    oemMap: {
      delonghi: '5113211311',
      siemens: '12004550',
      jura: '70158',
      philips: '421944061801',
      saeco: '421944061801',
      krups: 'MS-5015004',
      melitta: '6541530',
      nivona: '6541530',
      bosch: '12004550',
      miele: '6541530',
      sage: 'SP0001550'
    },
    specs: ['48 Watt Hochleistungsspule', '15 bis 19 Bar Abschaltdruck', 'CW617N Messing-Druckstutzen', 'Integrierte 1N4007 Diode'],
    summaryTemplate: (m) => `Original Ceme Ulka EX5 Schwingkolbenpumpe mit massivem Messing-Druckstutzen für vollen Brühdruck bei der ${m.brand} ${m.name}.`
  },
  {
    slug: 'thermoblock',
    name: 'Heizelemente & Thermoblöcke',
    partNamePrefix: 'Thermoblock Heizelement 1400W & NTC-Temperatursensor',
    actionTitle: 'Kaffee nicht heiß & Thermoblock defekt',
    googleIntent: 'kaffee wird nicht heiß heizung defekt kurzschluss fi fliegt thermoblock ntc prüfen',
    imageKey: {
      default: 'delonghi-dinamica-thermoblock',
      sage: 'sage-thermojet-heizelement'
    },
    oemMap: {
      delonghi: '5513227941',
      siemens: '12008404',
      jura: '72624',
      philips: '421944026361',
      saeco: '421944026361',
      krups: 'MS-5015002',
      melitta: '6543120',
      nivona: '6543120',
      bosch: '12008404',
      miele: '6543120',
      sage: 'SP0001552'
    },
    specs: ['1400-1500 Watt Heizwendel', 'Gegossener Alublock mit 1.4301 Rohr', '10 kΩ / 100 kΩ NTC-Fühler', '192°C Thermische Schmelzsicherungen'],
    summaryTemplate: (m) => `Hochleistungs-Thermoblock und Temperaturfühler für ${m.brand} ${m.name}. Garantiert konstante 92°C Brühtemperatur ab der ersten Tasse.`
  },
  {
    slug: 'mahlwerk',
    name: 'Mahlwerke & Keramikmahlscheiben',
    partNamePrefix: 'Präzisions-Mahlwerk & Mahlkegel Justierung',
    actionTitle: 'Mahlwerk mahlt leer & blockiert: Keramik/Stahl Kegelmahlwerk',
    googleIntent: 'mahlwerk mahlt leer kein kaffeepulver blockiert fremdkörper stein kaffeebohnen füllen',
    imageKey: {
      default: 'delonghi-mahlwerk-kegel',
      siemens: 'siemens-eq6-ceramdrive',
      bosch: 'siemens-eq6-ceramdrive',
      saeco: 'saeco-granaroma-mahlwerk'
    },
    oemMap: {
      delonghi: '7313230501',
      siemens: '12014022',
      jura: '70162',
      philips: '421944053701',
      saeco: '421944053701',
      krups: 'MS-2810001',
      melitta: '6542100',
      nivona: '6542100',
      bosch: '12014022',
      miele: '6542100',
      sage: 'SP0001555'
    },
    specs: ['ceramDrive Keramik / 100Cr6 Stahl', 'Axiale Toleranz 0,05 mm', 'Hall-Sensor Drehzahlüberwachung', 'POM Planetengetriebe'],
    summaryTemplate: (m) => `Ersatz-Mahlwerk und Mahlkegel-Set für ${m.brand} ${m.name}. Beseitigt Mahlwerk-Blockaden durch Fremdkörper und stellt die Crema-Qualität wieder her.`
  },
  {
    slug: 'milchsystem',
    name: 'Milchaufschäumer & Karaffen',
    partNamePrefix: 'Milchsystem Karaffe, Aufschäumer & Venturi-Düse',
    actionTitle: 'Milchschaum spritzt & keine Milchansaugung: Aufschäumer & Karaffe',
    googleIntent: 'milchschaum spritzt zieht keine milch milchaufschäumer dampfdüse reinigen lattecrema lattego',
    imageKey: {
      delonghi: 'delonghi-dinamica-milchkaraffe',
      philips: 'philips-lattego-milchbehaelter',
      saeco: 'saeco-xelsis-hygiesteam',
      jura: 'jura-feinschaeumer-g2',
      siemens: 'siemens-eq6-milchsauger',
      bosch: 'siemens-eq6-milchsauger',
      default: 'delonghi-dinamica-milchkaraffe'
    },
    oemMap: {
      delonghi: 'DLSC006',
      siemens: '12011773',
      jura: '24220',
      philips: 'CP0688',
      saeco: 'CP0688',
      krups: 'MS-623838',
      melitta: '6716070',
      nivona: '6716070',
      bosch: '12011773',
      miele: '6716070',
      sage: 'SP0020018'
    },
    specs: ['BPA-freies Tritan & Edelstahl', '0,8 mm Venturi-Luftdüse', 'Lebensmittelechter Silikonschlauch', 'Spülmaschinenfest bis 70°C'],
    summaryTemplate: (m) => `Originalgetreues Milchaufschäumer- und Karaffensystem für ${m.brand} ${m.name}. Behebt spritzenden Milchschaum und mangelnde Milchansaugung sofort.`
  },
  {
    slug: 'wasserfilter',
    name: 'Wasserfilter & Entkalkung',
    partNamePrefix: 'Wasserfilterpatrone & Entkalker (Amidosulfonsäure)',
    actionTitle: 'Entkalken Anleitung & Wasserfilter wechseln',
    googleIntent: 'entkalken anleitung meldung geht nicht weg wasserfilter wechseln aquaclean claris intenza',
    imageKey: {
      delonghi: 'delonghi-dlsc002-wasserfilter',
      siemens: 'siemens-brita-intenza',
      bosch: 'siemens-brita-intenza',
      jura: 'jura-claris-smart',
      philips: 'philips-lattego-aquaclean',
      saeco: 'philips-lattego-aquaclean',
      melitta: 'melitta-pro-aqua-filter',
      nivona: 'melitta-pro-aqua-filter',
      krups: 'krups-claris-filterpatrone',
      default: 'delonghi-dlsc002-wasserfilter'
    },
    oemMap: {
      delonghi: 'DLSC002',
      siemens: 'TZ70003',
      jura: '24225',
      philips: 'CA6903/10',
      saeco: 'CA6903/10',
      krups: 'F08801',
      melitta: 'Pro Aqua',
      nivona: 'NIRF 700',
      bosch: 'TZ70003',
      miele: 'Pro Aqua',
      sage: 'SES008'
    },
    specs: ['Kationenaustauscherharz', 'Silberimprägnierte Aktivkohle', 'Up-Flow Filtersystem', 'Schützt Heizung & Ulka-Pumpe'],
    summaryTemplate: (m) => `Premium Wasserfilterpatrone und Spezial-Entkalker für ${m.brand} ${m.name}. Verhindert fatale Kalkblockaden im Thermoblock und Solenoidventil.`
  },
  {
    slug: 'drainageventil',
    name: 'Drainageventile & Auslaufmechanik',
    partNamePrefix: 'Drainageventil mit Messingkappe & Dichtungssatz',
    actionTitle: 'Wasser in Auffangschale & Trester nass: Drainageventil',
    googleIntent: 'wasser läuft in auffangschale trester feucht nass matschig drainageventil messingkappe wechseln',
    imageKey: {
      default: 'jura-e8-drainageventil',
      nivona: 'nivona-drainageventil',
      melitta: 'nivona-drainageventil',
      miele: 'nivona-drainageventil'
    },
    oemMap: {
      delonghi: '7313251451',
      siemens: '12004555',
      jura: '62999',
      philips: '421944062001',
      saeco: '421944062001',
      krups: 'MS-5015007',
      melitta: '6541540',
      nivona: '6541540',
      bosch: '12004555',
      miele: '6541540',
      sage: 'SP0001558'
    },
    specs: ['CW617N Messingkappen-Upgrade', '4,0 Bar Öffnungsdruck', 'VMQ-Lippendichtungen', 'Bruchsichere Führungshülse'],
    summaryTemplate: (m) => `Verstärktes Drainageventil mit massiver Messingkappe für ${m.brand} ${m.name}. Verhindert zuverlässig, dass Brühwasser in die Tropfschale verloren geht.`
  },
  {
    slug: 'magnetventil',
    name: 'Magnetventile & Solenoid',
    partNamePrefix: '2-Wege / 3-Wege Solenoid-Magnetventil 230V',
    actionTitle: 'Magnetventil schaltet nicht & zischt: 230V Solenoid',
    googleIntent: 'magnetventil schaltet nicht dampf zischt dauerhaft kein heißwasser solenoidventil 230v',
    imageKey: {
      default: 'delonghi-eletta-magnetventil',
      siemens: 'siemens-eq9-keramikventil',
      bosch: 'siemens-eq9-keramikventil',
      gaggia: 'gaggia-classic-magnetventil'
    },
    oemMap: {
      delonghi: '5213214051',
      siemens: '12004560',
      jura: '70160',
      philips: '421944062101',
      saeco: '421944062101',
      krups: 'MS-5015009',
      melitta: '6541550',
      nivona: '6541550',
      bosch: '12004560',
      miele: '6541550',
      sage: 'SP0001560'
    },
    specs: ['230V / 50Hz Magnetspule (~2,2 kΩ)', '0 bis 18 Bar Arbeitsbereich', 'FKM Viton-Dichtanker', 'Dampfbeständig bis 140°C'],
    summaryTemplate: (m) => `Elektrisches 2-Wege/3-Wege Solenoid-Magnetventil für ${m.brand} ${m.name}. Schaltet Dampf und Heißwasser präzise ohne Druckverlust.`
  },
  {
    slug: 'fehlercodes',
    name: 'Diagnose & Fehlercode-Datenbank',
    partNamePrefix: 'Fehlercode-Diagnose, Mikroschalter & Revisions-Kit',
    actionTitle: 'Fehlercodes & Allgemeine Störung beheben: Diagnose',
    googleIntent: 'allgemeine störung rotes dreieck fehler e0511 e0513 error 8 fehler 01 03 04 beheben testmodus',
    imageKey: {
      delonghi: 'delonghi-magnifica-fehlercodes',
      siemens: 'siemens-eq6-fehler-e0511',
      bosch: 'siemens-eq6-fehler-e0511',
      philips: 'philips-lattego-fehlercodes',
      saeco: 'philips-lattego-fehlercodes',
      jura: 'jura-e8-system-fuellen',
      default: 'delonghi-magnifica-fehlercodes'
    },
    oemMap: {
      delonghi: '5213214061',
      siemens: '12014030',
      jura: '70170',
      philips: '421944062301',
      saeco: '421944062301',
      krups: 'MS-5015015',
      melitta: '6541570',
      nivona: '6541570',
      bosch: '12014030',
      miele: '6541570',
      sage: 'SP0001570'
    },
    specs: ['Mikroschalter 250V 16A', 'NTC Fühler-Prüfadapter', 'Schritt-für-Schritt Testmodus-Leitfaden', 'Elektronischer Reset-Guide'],
    summaryTemplate: (m) => `Modellspezifisches Diagnose- und Sensor-Reparaturset für ${m.brand} ${m.name}. Identifiziert und behebt "${m.typicalErrors}" dauerhaft.`
  },
  {
    slug: 'kaffeeauslauf',
    name: 'Kaffeeauslauf & Düsenverteiler',
    partNamePrefix: 'Kaffeeauslaufverteiler & Doppel-Düsenabdeckung',
    actionTitle: 'Kaffee läuft einseitig & Auslauf verstopft: Düsenverteiler',
    googleIntent: 'kaffee läuft nur einseitig auslauf verstopft reinigen kaffeeauslaufabdeckung ausbauen',
    imageKey: {
      siemens: 'siemens-eq6-kaffeeauslauf',
      bosch: 'siemens-eq6-kaffeeauslauf',
      philips: 'philips-lattego-auslaufduesen',
      saeco: 'philips-lattego-auslaufduesen',
      default: 'siemens-eq6-kaffeeauslauf'
    },
    oemMap: {
      delonghi: '7313220451',
      siemens: '12004550',
      jura: '70165',
      philips: '421944062201',
      saeco: '421944062201',
      krups: 'MS-5015011',
      melitta: '6541560',
      nivona: '6541560',
      bosch: '12004550',
      miele: '6541560',
      sage: 'SP0001565'
    },
    specs: ['Doppelter Auslaufkanal', 'Verchromte Frontblende', 'Lebensmittelechter Elastomer-Stutzen', 'Spülmaschinenfest & zerlegbar'],
    summaryTemplate: (m) => `Originalgetreuer Kaffeeauslaufverteiler für ${m.brand} ${m.name}. Verhindert einseitigen Kaffeeauslauf, Kaffeespritzer und schimmelige Verkrustungen.`
  }
];

// Helper to choose the best Amazon image set
function getImagesForProduct(id, brandSlug, cat) {
  // 1. Direct 1:1 distinctive match from Amazon scraper
  if (asinsData[id] && Array.isArray(asinsData[id]) && asinsData[id].length > 0) {
    return {
      asin: asinsData[id][0].asin,
      images: asinsData[id].map(item => item.img)
    };
  }

  // 2. Category & Brand fallback
  let key = 'delonghi-ecam-bruehgruppe';
  if (cat.imageKey) {
    if (cat.imageKey[brandSlug]) {
      key = cat.imageKey[brandSlug];
    } else if (cat.imageKey.default) {
      key = cat.imageKey.default;
    }
  }

  const found = asinsData[key];
  if (found && Array.isArray(found) && found.length > 0) {
    return {
      asin: found[0].asin || 'B07CNW1WLC',
      images: found.map(item => item.img)
    };
  }

  // Fallback to first available set
  const firstKey = Object.keys(asinsData)[0];
  return {
    asin: asinsData[firstKey][0].asin,
    images: asinsData[firstKey].map(i => i.img)
  };
}

const allProducts = [];

for (const model of models) {
  for (const cat of CATEGORIES) {
    const id = `${model.brandSlug}-${model.slug}-${cat.slug}`;
    const imgData = getImagesForProduct(id, model.brandSlug, cat);
    const oem = cat.oemMap[model.brandSlug] || 'OEM-Standard';

    // Tailored Google SERP title tag
    const googleTitle = `${model.brand} ${model.name}: ${cat.actionTitle} (OEM ${oem})`;

    // Tailored Meta Description
    const metaDescription = `Reparaturanleitung & Ersatzteil für ${model.brand} ${model.name}: ${cat.name}. Ursachenanalyse (${cat.googleIntent.split(' ').slice(0, 4).join(', ')}), OEM ${oem} und Schritt-für-Schritt Anleitung.`;

    // High Intent User Queries
    const googleSearches = [
      `${model.brand} ${model.slug.replace(/-/g, ' ')} ${cat.slug.replace(/-/g, ' ')}`,
      `${model.brand} ${model.name.replace(/\s*\(.*\)/, '')} ${cat.actionTitle.toLowerCase()}`,
      ...(model.googleSearches || []).slice(0, 2)
    ];

    allProducts.push({
      id,
      brand: model.brand,
      brandSlug: model.brandSlug,
      model: model.name,
      modelSlug: model.slug,
      partName: `${cat.partNamePrefix} (${model.brand} ${model.series})`,
      partSlug: cat.slug,
      asin: imgData.asin,
      oem,
      rating: (4.6 + (Math.random() * 0.3)).toFixed(1),
      reviewCount: (420 + Math.floor(Math.random() * 2600)).toLocaleString('de-DE'),
      category: cat.name,
      categorySlug: cat.slug,
      googleKeyword: `${model.brand} ${model.name} ${cat.slug}`.toLowerCase(),
      googleSearches,
      googleTitle,
      metaDescription,
      specs: cat.specs,
      summary: cat.summaryTemplate(model),
      images: imgData.images,
      stockStatus: 'Amazon Prime'
    });
  }
}

console.log(`Generated ${allProducts.length} total programmatic products!`);

// Save to data/products.json
const productsOut = path.join(DATA_DIR, 'products.json');
fs.writeFileSync(productsOut, JSON.stringify(allProducts, null, 2), 'utf8');
console.log(`Successfully written: ${productsOut} with ${allProducts.length} products!`);
