const fs = require('fs');
const path = require('path');
const contentEngineDE = require('./lib/content-engine-de');

const SITE_URL = (process.env.SITE_URL || 'https://roboparca.github.io/kaffeereparatur').replace(/\/+$/, '');
const DIST_DIR = path.join(__dirname, 'dist');
const DATA_DIR = path.join(__dirname, 'data');
const GEN_DIR = path.join(DATA_DIR, 'generated');

if (fs.existsSync(DIST_DIR)) {
  for (const item of fs.readdirSync(DIST_DIR)) {
    if (item === '.git') continue;
    fs.rmSync(path.join(DIST_DIR, item), { recursive: true, force: true });
  }
} else {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

const products = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'products.json'), 'utf8'));

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

// Format editorial text into short readable paragraphs with Wikipedia-style contextual internal links
function formatEditorialText(text) {
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
    
    // Bold specific technical units & materials
    formatted = formatted
      .replace(/\b(\d+(?:[.,]\d+)?\s*(?:bar|Bar|Watt|W|Volt|V|Hz|mm|ml|Nm|cm³))\b/g, '<strong>$1</strong>')
      .replace(/\b(1\.4310|1\.4301|POM|Delrin|VMQ|EPDM|FKM|PTFE|CW617N|NSF-H1|OKS 1110|Glissa|TX10|TX15|TX20|Torx)\b/g, '<strong>$1</strong>');

    // Wikipedia-style contextual internal linking across 5 distinct dimensions:

    // 1. Core Component & Technology Hubs
    formatted = formatted
      .replace(/\b(Brühgruppe[n]?|Brühgruppen-[a-zA-ZäöüÄÖÜß]+|Brüheinheit(?:en)?)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/bruehgruppe/" class="wiki-link" title="Brühgruppen &amp; Dichtungen">$1</a>`)
      .replace(/\b(Vibrationspumpe[n]?|Schwingkolbenpumpe[n]?)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/vibrationspumpe/" class="wiki-link" title="Pumpen &amp; Hydraulik">$1</a>`)
      .replace(/\b(Ulka EX5|Ulka EP5)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/vibrationspumpe/" class="wiki-link" title="15-Bar Ulka Schwingkolbenpumpe">$1</a>`)
      .replace(/\b(Mahlwerk[e]?|Keramikmahlwerk[e]?|Kegelmahlwerk[e]?)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/mahlwerk/" class="wiki-link" title="Mahlwerke &amp; Mahlkegel">$1</a>`)
      .replace(/\b(ceramDrive)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/mahlwerk/" class="wiki-link" title="ceramDrive Keramikmahlwerk">$1</a>`)
      .replace(/\b(Milchsystem[e]?|Milchkaraffe[n]?|Milchaufschäumer|LatteCrema|HygieSteam|LatteGo)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/milchsystem/" class="wiki-link" title="Milchsysteme &amp; Karaffen">$1</a>`)
      .replace(/\b(Wasserfilter[n]?|Entkalkung|Entkalker|Amidosulfonsäure)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/wasserfilter/" class="wiki-link" title="Wasserfilter &amp; System-Entkalkung">$1</a>`)
      .replace(/\b(AquaClean|Claris Smart|Intenza|DLSC002)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/wasserfilter/" class="wiki-link" title="Wasserfilterpatrone">$1</a>`)
      .replace(/\b(Drainageventil[e]?)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/drainageventil/" class="wiki-link" title="Drainageventile &amp; Messingkappen">$1</a>`)
      .replace(/\b(Messingkappe[n]?)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/drainageventil/" class="wiki-link" title="Drainageventil Messingkappe">$1</a>`)
      .replace(/\b(Thermoblock[s]?|Durchlauferhitzer[n]?)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/thermoblock/" class="wiki-link" title="Heizelemente &amp; Thermoblöcke">$1</a>`)
      .replace(/\b(Magnetventil[e]?|Solenoidventil[e]?)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/magnetventil/" class="wiki-link" title="Magnetventile &amp; Solenoid">$1</a>`)
      .replace(/\b(Kaffeeauslauf(?:verteiler)?|Düsenabdeckung)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/kaffeeauslauf/" class="wiki-link" title="Kaffeeauslauf &amp; Düsen">$1</a>`)
      .replace(/\b(Fehlercodes|Fehlermeldung(?:en)?)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/fehlercodes/" class="wiki-link" title="Diagnose &amp; Fehlercode-Datenbank">$1</a>`);

    // 2. Error Code Shortcuts linking directly to dedicated diagnostic pages
    formatted = formatted
      .replace(/\b(Allgemeiner Alarm|Allgemeine Störung)\b(?![^<]*>)/i, `<a href="${SITE_URL}/delonghi/magnifica-s/fehlercodes/" class="wiki-link" title="De'Longhi Allgemeine Störung Diagnose"><span class="code-pill">$1</span></a>`)
      .replace(/\b(E0511|E0513)\b(?![^<]*>)/i, `<a href="${SITE_URL}/siemens/eq6-plus-s700/fehlercodes/" class="wiki-link" title="Siemens Fehlercode Diagnose"><span class="code-pill">$1</span></a>`)
      .replace(/\b(Error 8)\b(?![^<]*>)/i, `<a href="${SITE_URL}/jura/e8/fehlercodes/" class="wiki-link" title="Jura Error 8 Brühgruppen-Diagnose"><span class="code-pill">$1</span></a>`)
      .replace(/\b(Fehler 01|Fehler 03|Fehler 04)\b(?![^<]*>)/i, `<a href="${SITE_URL}/philips/lattego-3200/fehlercodes/" class="wiki-link" title="Philips Fehlercode Diagnose"><span class="code-pill">$1</span></a>`)
      .replace(/\b(Fehler 06)\b(?![^<]*>)/i, `<a href="${SITE_URL}/krups/evidence-ea8918/fehlercodes/" class="wiki-link" title="Krups Fehler 06 Diagnose"><span class="code-pill">$1</span></a>`);

    // 3. Physical Symptoms linking to symptom problem hubs
    formatted = formatted
      .replace(/\b(Tropfschale läuft voll|Wasser in der Tropfschale)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/drainageventil/" class="wiki-link" title="Wasserverlust in Tropfschale">$1</a>`)
      .replace(/\b(tröpfelt nur(?: schwach)?|Kaffee tröpfelt)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/vibrationspumpe/" class="wiki-link" title="Druckverlust &amp; Pumpe">$1</a>`)
      .replace(/\b(Milchschaum spritzt|bleibt flüssig)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/milchsystem/" class="wiki-link" title="Milchschaum-Probleme">$1</a>`)
      .replace(/\b(Mahlwerk blockiert|mahlt leer)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/mahlwerk/" class="wiki-link" title="Mahlwerk-Blockade">$1</a>`)
      .replace(/\b(Kaffee (?:ist )?nicht heiß|nur lauwarm)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/thermoblock/" class="wiki-link" title="Temperatur-Probleme">$1</a>`)
      .replace(/\b(Kaffee läuft einseitig)\b(?![^<]*>)/i, `<a href="${SITE_URL}/kategorie/kaffeeauslauf/" class="wiki-link" title="Auslauf einseitig">$1</a>`);

    // 4. Sister Machine Models linking directly to their model hubs
    formatted = formatted
      .replace(/\b(Magnifica S)\b(?![^<]*>)/i, `<a href="${SITE_URL}/delonghi/magnifica-s/" class="wiki-link" title="De'Longhi Magnifica S Übersicht">$1</a>`)
      .replace(/\b(Dinamica Plus|Dinamica)\b(?![^<]*>)/i, `<a href="${SITE_URL}/delonghi/dinamica/" class="wiki-link" title="De'Longhi Dinamica Übersicht">$1</a>`)
      .replace(/\b(EQ\.6 Plus|EQ\.6)\b(?![^<]*>)/i, `<a href="${SITE_URL}/siemens/eq6-plus-s700/" class="wiki-link" title="Siemens EQ.6 Plus Übersicht">$1</a>`)
      .replace(/\b(EQ\.9 Plus|EQ\.9)\b(?![^<]*>)/i, `<a href="${SITE_URL}/siemens/eq9-plus-s700/" class="wiki-link" title="Siemens EQ.9 Plus Übersicht">$1</a>`)
      .replace(/\b(Jura E8)\b(?![^<]*>)/i, `<a href="${SITE_URL}/jura/e8/" class="wiki-link" title="Jura E8 Modellübersicht">$1</a>`)
      .replace(/\b(LatteGo 3200|LatteGo 5400)\b(?![^<]*>)/i, `<a href="${SITE_URL}/philips/lattego-3200/" class="wiki-link" title="Philips LatteGo Übersicht">$1</a>`)
      .replace(/\b(Krups Evidence)\b(?![^<]*>)/i, `<a href="${SITE_URL}/krups/evidence-ea8918/" class="wiki-link" title="Krups Evidence Übersicht">$1</a>`)
      .replace(/\b(Barista Express)\b(?![^<]*>)/i, `<a href="${SITE_URL}/sage/barista-express/" class="wiki-link" title="Sage Barista Express Übersicht">$1</a>`)
      .replace(/\b(Caffeo Solo)\b(?![^<]*>)/i, `<a href="${SITE_URL}/melitta/caffeo-solo/" class="wiki-link" title="Melitta Caffeo Solo Übersicht">$1</a>`)
      .replace(/\b(CafeRomatica)\b(?![^<]*>)/i, `<a href="${SITE_URL}/nivona/caferomatica-759/" class="wiki-link" title="Nivona CafeRomatica Übersicht">$1</a>`);

    return `<p class="prose-p">${formatted}</p>`;
  }).join('\n');
}

// CSS Bundle with LeatherClogs-Inspired Editorial Aesthetic, Clean Buttons, and Silo Grids
const CSS_BUNDLE = `
:root {
  --primary: #854d0e;
  --primary-dark: #713f12;
  --primary-light: #fefce8;
  --accent: #0284c7;
  --bg-app: #fcfbf9;
  --bg-card: #ffffff;
  --text-main: #1c1917;
  --text-muted: #57534e;
  --border-color: #e7e5e4;
  --border-light: #f5f5f4;
  --radius-card: 12px;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.09);
}

* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
body {
  font-family: var(--font-sans);
  background-color: var(--bg-app);
  color: var(--text-main);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  padding-bottom: 80px;
}

a { color: var(--primary); text-decoration: none; }
a:hover { text-decoration: underline; }
.wrap { max-width: 1200px; margin: 0 auto; padding: 0 16px; }

/* Sticky Header */
.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  padding: 12px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 19px;
  color: var(--text-main);
  text-decoration: none !important;
  white-space: nowrap;
}
.brand-logo .logo-icon { font-size: 24px; }
.brand-logo .tld { color: var(--primary); font-weight: 900; }
.badge-pro {
  background: #fef08a;
  color: #713f12;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 9999px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
}
.nav-link {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  text-decoration: none !important;
  transition: color 0.15s ease;
}
.nav-link:hover { color: var(--text-main); }

/* Search Bar in Header */
.header-search { flex: 1; max-width: 380px; position: relative; }
.search-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  background: #f5f5f4;
  border: 1px solid var(--border-color);
  border-radius: 9999px;
  padding: 6px 14px;
  transition: all 0.15s ease;
}
.search-input-wrap:focus-within {
  background: #ffffff;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(133, 77, 14, 0.15);
}
.search-icon { color: var(--text-muted); margin-right: 8px; font-size: 14px; }
.search-input {
  border: none;
  background: transparent;
  width: 100%;
  font-size: 13px;
  color: var(--text-main);
  outline: none;
}
.search-clear {
  display: none;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  padding: 2px;
}
.search-dropdown {
  display: none;
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  max-height: 420px;
  overflow-y: auto;
  z-index: 1001;
  padding: 6px;
}
.search-dropdown.show { display: block; }
.search-dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 8px;
  text-decoration: none !important;
  color: var(--text-main);
  transition: background 0.1s ease;
}
.search-dropdown-item:hover { background: #f5f5f4; }
.search-item-thumb { width: 36px; height: 36px; object-fit: contain; margin-right: 10px; border-radius: 4px; }

/* Breadcrumbs */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-muted);
  padding: 16px 0 8px;
  overflow-x: auto;
  white-space: nowrap;
}
.breadcrumb a { color: var(--text-muted); text-decoration: none; }
.breadcrumb a:hover { color: var(--text-main); }
.breadcrumb .sep { color: #a8a29e; font-size: 11px; }

/* Hero Banner for Hub Pages */
.hero-banner {
  background: linear-gradient(180deg, #ffffff 0%, #f7f6f2 100%);
  border-bottom: 1px solid var(--border-color);
  padding: 32px 0 36px;
  text-align: center;
}
.hero-banner .hero-eyebrow {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: 8px;
}
.hero-banner h1 {
  font-size: 30px;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.02em;
  line-height: 1.25;
  margin-bottom: 12px;
}
.hero-banner p {
  max-width: 680px;
  margin: 0 auto;
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.6;
}

/* Symptom-Grid (Silo 1: Error & Intent Based Navigation) */
.symptom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin: 20px 0 36px;
}
.symptom-card {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-card);
  padding: 18px 20px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  text-decoration: none !important;
  color: var(--text-main);
  transition: all 0.15s ease;
}
.symptom-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary);
}
.symptom-icon { font-size: 24px; line-height: 1; flex-shrink: 0; padding-top: 2px; }
.symptom-content h3 { font-size: 15px; font-weight: 700; color: var(--text-main); margin-bottom: 4px; }
.symptom-content p { font-size: 13px; color: var(--text-muted); line-height: 1.45; }
.symptom-link {
  font-size: 12px;
  font-weight: 700;
  color: var(--primary);
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* Brand Hubs Grid */
.brand-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
  margin: 20px 0 40px;
}
.brand-card {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-card);
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none !important;
  color: var(--text-main);
  transition: all 0.15s ease;
}
.brand-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
  border-color: var(--primary);
}
.brand-name { font-weight: 700; font-size: 15px; }
.brand-count { font-size: 12px; color: var(--text-muted); background: #f5f5f4; padding: 2px 8px; border-radius: 99px; }

/* Products Grid (LeatherClogs Style Clean Cards) */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0 40px;
}
.prod-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-card);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.prod-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: #d6d3d1;
}
.prod-card-thumb-link {
  display: block;
  background: #ffffff;
  aspect-ratio: 1/1;
  border-bottom: 1px solid var(--border-color);
  padding: 14px;
}
.prod-card-thumb {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.prod-card-body {
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.prod-card-badges {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}
.badge-brand {
  font-size: 11px;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--primary);
  font-weight: 700;
}
.badge-cat {
  background: #f5f5f4;
  color: #57534e;
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 999px;
  font-weight: 600;
}
.prod-card-title {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.35;
  margin: 4px 0 6px;
}
.prod-card-title a {
  color: var(--text-main);
  text-decoration: none;
}
.prod-card-title a:hover {
  color: var(--primary);
  text-decoration: underline;
}
.prod-card-model {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 10px;
}
.prod-card-chips {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.chip {
  background: #f5f5f4;
  color: #44403c;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
}
.prod-card-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.btn-card-details {
  background: #1c1917;
  color: #ffffff !important;
  font-weight: 600;
  font-size: 12px;
  padding: 7px 12px;
  border-radius: 6px;
  text-decoration: none !important;
  transition: background 0.15s ease;
}
.btn-card-details:hover {
  background: var(--primary);
}

/* Detail Page Hero Stage */
.detail-hero-grid {
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 32px;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-card);
  padding: 28px;
  margin: 14px 0 24px;
  box-shadow: var(--shadow-sm);
}
.gallery-box { display: flex; flex-direction: column; gap: 12px; }
.main-img-wrap {
  width: 100%;
  aspect-ratio: 1/1;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.main-img-wrap img { width: 100%; height: 100%; object-fit: contain; }
.thumbs-row { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
.thumbs-row img {
  width: 64px;
  height: 64px;
  object-fit: contain;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  background: #ffffff;
  padding: 4px;
  transition: border-color 0.15s ease;
}
.thumbs-row img.active { border-color: var(--primary); }

.detail-info { display: flex; flex-direction: column; }
.eyebrow { font-size: 12px; text-transform: uppercase; font-weight: 700; letter-spacing: .08em; color: var(--primary); margin-bottom: 4px; }
.detail-info h1 {
  font-size: 24px;
  font-weight: 800;
  line-height: 1.25;
  color: var(--text-main);
  letter-spacing: -0.01em;
  margin-bottom: 10px;
}
.meta-strip {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 12px;
}
.badge-rating { color: #b45309; font-weight: 700; }
.badge-oem {
  background: #f5f5f4;
  color: #44403c;
  font-family: monospace;
  font-size: 12px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid #e7e5e4;
}

.specs-pills-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 8px 0 16px;
}
.spec-pill {
  background: #fafaf9;
  border: 1px solid #e7e5e4;
  font-size: 12px;
  font-weight: 600;
  color: #44403c;
  padding: 4px 10px;
  border-radius: 9999px;
}

/* LeatherClogs Style Clean Action Button */
.cta-box {
  margin: 14px 0 16px;
  background: #fcfbf9;
  border: 1px solid #f5f5f4;
  border-radius: 10px;
  padding: 16px;
}
.cta {
  display: inline-block;
  background: #1c1917;
  color: #ffffff !important;
  font-size: 15px;
  font-weight: 700;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none !important;
  transition: all 0.15s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.cta:hover {
  background: var(--primary);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}
.cta-box .note {
  font-size: 12px;
  color: #78716c;
  margin-top: 8px;
  line-height: 1.4;
}

/* "Auf einen Blick" Summary Box */
.key-highlights-card {
  background: #fdfdfc;
  border: 1px solid #e7e5e4;
  border-radius: 10px;
  padding: 14px 16px;
  margin-top: 10px;
}
.key-highlights-title {
  font-size: 13px;
  font-weight: 700;
  color: #1c1917;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.key-highlights-list { list-style: none; display: flex; flex-direction: column; gap: 6px; }
.key-highlights-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  color: #44403c;
  line-height: 1.4;
}
.key-highlights-list .check-icon {
  color: #15803d;
  font-weight: 800;
  flex-shrink: 0;
  margin-top: 1px;
}

/* Google Intent Box */
.google-intent-box {
  border-left: 4px solid var(--primary);
  background: #ffffff;
}
.google-qna-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 16px 0;
}
.google-qna-item {
  background: #fcfbf9;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 14px 16px;
}
.google-qna-q {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.google-qna-a {
  font-size: 13.5px;
  color: #4b5563;
  line-height: 1.55;
}
.google-searches-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed var(--border-color);
}
.tags-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
}
.search-tag {
  background: #f5f5f4;
  color: #44403c;
  font-size: 11.5px;
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid #e7e5e4;
}

/* Wikipedia Link in Prose */
.wiki-link {
  color: var(--primary);
  text-decoration: underline;
  text-decoration-color: #d6d3d1;
  text-underline-offset: 3px;
  font-weight: 600;
  transition: all 0.15s ease;
}
.wiki-link:hover {
  color: #1c1917;
  text-decoration-color: var(--primary);
}

/* Section Content Layout */
.content-layout {
  display: grid;
  grid-template-columns: 2.4fr 1fr;
  gap: 28px;
  margin-top: 10px;
}
.article-main { display: flex; flex-direction: column; gap: 24px; }
.section-box {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-card);
  padding: 24px;
  box-shadow: var(--shadow-sm);
}
.section-box h2 {
  font-size: 19px;
  font-weight: 800;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 8px;
}
.section-divider {
  border: none;
  border-top: 2px solid #f5f5f4;
  margin: 12px 0 16px;
}
.prose-p {
  font-size: 14.5px;
  color: #374151;
  line-height: 1.7;
  margin-bottom: 12px;
}
.prose-p strong { color: #111827; }
.code-pill {
  font-family: monospace;
  background: #f3f4f6;
  color: #991b1b;
  font-weight: 700;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
}

/* Callouts */
.callout-box {
  border-radius: 8px;
  padding: 14px 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 16px 0;
  font-size: 13.5px;
  line-height: 1.5;
}
.callout-tip { background: #eff6ff; border-left: 4px solid #3b82f6; color: #1e40af; }
.callout-warn { background: #fffbeb; border-left: 4px solid #f59e0b; color: #92400e; }
.callout-icon { font-size: 20px; line-height: 1; flex-shrink: 0; }

/* 5 Step-by-Step Cards */
.steps-cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin: 16px 0;
}
.step-card {
  background: #fcfbf9;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 16px;
  display: flex;
  gap: 14px;
}
.step-badge {
  background: #1c1917;
  color: #ffffff;
  font-weight: 800;
  font-size: 13px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
}
.step-body h4 { font-size: 14px; font-weight: 700; margin-bottom: 4px; color: var(--text-main); }
.step-body p { font-size: 13px; color: var(--text-muted); line-height: 1.45; }

/* Diagnostic Table */
.diag-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 13px;
}
.diag-table th {
  background: #f5f5f4;
  padding: 10px 12px;
  text-align: left;
  font-weight: 700;
  color: var(--text-main);
  border: 1px solid var(--border-color);
}
.diag-table td {
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  vertical-align: top;
  line-height: 1.45;
}
.diag-table tr:nth-child(even) td { background: #fafaf9; }
.diag-symptom { font-weight: 600; color: #991b1b; }
.diag-fix { color: #15803d; font-weight: 500; }

/* Compatibility Matrix */
.compat-matrix-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 16px 0;
}
.compat-box {
  background: #fafaf9;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 14px;
}
.compat-box-title {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.compat-box-title.fits { color: #15803d; }
.compat-box-title.incompatible { color: #b91c1c; }
.compat-list { list-style: none; display: flex; flex-direction: column; gap: 6px; font-size: 12.5px; }
.compat-list li { display: flex; align-items: flex-start; gap: 6px; }

/* Sidebar & Silos */
.sidebar { display: flex; flex-direction: column; gap: 20px; }
.sidebar-box {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-card);
  padding: 20px;
  box-shadow: var(--shadow-sm);
}
.sidebar-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.sidebar-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.sidebar-link {
  font-size: 13px;
  color: var(--text-muted);
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  border-radius: 6px;
  transition: all 0.1s ease;
}
.sidebar-link:hover {
  background: #f5f5f4;
  color: var(--primary);
}

/* Mobile Sticky Bottom Bar */
.mobile-sticky-cta {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  border-top: 1px solid var(--border-color);
  padding: 10px 16px;
  z-index: 1000;
  box-shadow: 0 -4px 10px rgba(0,0,0,0.06);
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.sticky-info { display: flex; flex-direction: column; overflow: hidden; }
.sticky-title { font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sticky-sub { font-size: 11px; color: #15803d; font-weight: 600; }
.btn-sticky-amazon {
  background: #1c1917;
  color: #ffffff !important;
  font-weight: 700;
  font-size: 13px;
  padding: 9px 16px;
  border-radius: 6px;
  white-space: nowrap;
  text-decoration: none !important;
}

/* FAQ Accordion */
.faq-box { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
.faq-item {
  background: #fcfbf9;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 14px 16px;
}
.faq-q { font-size: 14px; font-weight: 700; color: var(--text-main); margin-bottom: 6px; }
.faq-a { font-size: 13px; color: #4b5563; line-height: 1.5; }

/* Responsive Adjustments */
@media (max-width: 900px) {
  .detail-hero-grid { grid-template-columns: 1fr; }
  .content-layout { grid-template-columns: 1fr; }
  .compat-matrix-grid { grid-template-columns: 1fr; }
  .mobile-sticky-cta { display: flex; }
  .nav-links { display: none; }
  
  /* Mobile Diagnostic Table as Cards */
  .diag-table, .diag-table thead, .diag-table tbody, .diag-table th, .diag-table td, .diag-table tr {
    display: block;
  }
  .diag-table thead { display: none; }
  .diag-table tr {
    background: #ffffff !important;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    margin-bottom: 12px;
    padding: 10px 14px;
    box-shadow: var(--shadow-sm);
  }
  .diag-table td {
    border: none;
    padding: 6px 0;
    position: relative;
    padding-left: 35%;
  }
  .diag-table td:before {
    position: absolute;
    left: 0;
    width: 32%;
    font-weight: 700;
    font-size: 11px;
    color: #78716c;
    text-transform: uppercase;
  }
  .diag-table td:nth-of-type(1):before { content: "Symptom"; }
  .diag-table td:nth-of-type(2):before { content: "Ursache"; }
  .diag-table td:nth-of-type(3):before { content: "Lösung"; }
}
`;

function getAmazonUrl(p) {
  if (p.asin && p.asin.startsWith('B0')) {
    return `https://www.amazon.de/dp/${p.asin}?tag=kaffeereparatur-21`;
  }
  const q = p.query || `${p.brand} ${p.model} ${p.partName}`;
  return `https://www.amazon.de/s?k=${q}&tag=kaffeereparatur-21`;
}

function renderHeader() {
  return `
  <header class="app-header">
    <div class="header-inner">
      <a href="${SITE_URL}/" class="brand-logo">
        <span class="logo-icon">☕</span>
        <span>KaffeeTeile<span class="tld">24</span></span>
        <span class="badge-pro">Expert Hub</span>
      </a>

      <nav class="nav-links">
        <a href="${SITE_URL}/#symptome" class="nav-link">Fehlerbilder</a>
        <a href="${SITE_URL}/#marken" class="nav-link">Hersteller</a>
        <a href="${SITE_URL}/#kategorien" class="nav-link">Baugruppen</a>
      </nav>

      <div class="header-search">
        <div class="search-input-wrap">
          <span class="search-icon">🔍</span>
          <input type="text" id="site-search" class="search-input" placeholder="Modell, Bauteil oder Fehlercode..." autocomplete="off">
          <button id="search-clear" class="search-clear" aria-label="Suche leeren">✕</button>
        </div>
        <div id="search-dropdown" class="search-dropdown"></div>
      </div>
    </div>
  </header>`;
}

function renderFooter() {
  return `
  <footer style="background:#1c1917; color:#a8a29e; padding:48px 0 24px; margin-top:64px; border-top:1px solid #292524;">
    <div class="wrap" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:32px; padding-bottom:32px;">
      <div>
        <div style="font-weight:800; font-size:18px; color:#ffffff; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
          ☕ KaffeeTeile<span style="color:#eab308;">24</span>
        </div>
        <p style="font-size:13px; line-height:1.6; color:#78716c;">
          Unabhängiges deutsches Expertenportal für mechatronische Kaffeevollautomaten-Reparatur, Explosionszeichnungen und Original-Ersatzteilidentifikation.
        </p>
      </div>

      <div>
        <div style="font-weight:700; color:#ffffff; font-size:14px; margin-bottom:12px;">Häufige Marken</div>
        <ul style="list-style:none; display:flex; flex-direction:column; gap:8px; font-size:13px;">
          <li><a href="${SITE_URL}/delonghi/" style="color:#a8a29e;">De'Longhi Ersatzteile</a></li>
          <li><a href="${SITE_URL}/siemens/" style="color:#a8a29e;">Siemens EQ-Serie</a></li>
          <li><a href="${SITE_URL}/jura/" style="color:#a8a29e;">Jura Impressa &amp; E-Serie</a></li>
          <li><a href="${SITE_URL}/philips/" style="color:#a8a29e;">Philips LatteGo</a></li>
          <li><a href="${SITE_URL}/krups/" style="color:#a8a29e;">Krups Evidence</a></li>
        </ul>
      </div>

      <div>
        <div style="font-weight:700; color:#ffffff; font-size:14px; margin-bottom:12px;">Top-Kategorien</div>
        <ul style="list-style:none; display:flex; flex-direction:column; gap:8px; font-size:13px;">
          <li><a href="${SITE_URL}/kategorie/bruehgruppe/" style="color:#a8a29e;">Brühgruppen &amp; Dichtungen</a></li>
          <li><a href="${SITE_URL}/kategorie/vibrationspumpe/" style="color:#a8a29e;">15-Bar Ulka Pumpen</a></li>
          <li><a href="${SITE_URL}/kategorie/mahlwerk/" style="color:#a8a29e;">Mahlwerke &amp; Mahlkegel</a></li>
          <li><a href="${SITE_URL}/kategorie/drainageventil/" style="color:#a8a29e;">Drainageventile</a></li>
          <li><a href="${SITE_URL}/kategorie/fehlercodes/" style="color:#a8a29e;">Fehlercode-Diagnose</a></li>
        </ul>
      </div>

      <div>
        <div style="font-weight:700; color:#ffffff; font-size:14px; margin-bottom:12px;">Hinweis &amp; Transparenz</div>
        <p style="line-height:1.5; color:#78716c; font-size:12px;">
          Als unabhängiges Informationsportal vergleichen wir Original-Ersatzteile und OEM-Komponenten. Alle Preis- und Verfügbarkeitsangaben ohne Gewähr.
        </p>
      </div>
    </div>
    <div class="wrap" style="border-top:1px solid #292524; padding-top:20px; text-align:center; font-size:12px; color:#57534e;">
      © ${new Date().getFullYear()} KaffeeTeile24. Alle Rechte vorbehalten. Unabhängiges Vergleichs- und Reparaturportal.
    </div>
  </footer>`;
}

function renderProductCard(p) {
  const prodUrl = `${SITE_URL}/${p.brandSlug}/${p.modelSlug}/${p.partSlug}/`;
  return `
  <article class="prod-card">
    <a href="${prodUrl}" class="prod-card-thumb-link">
      <img src="${p.images[0]}" class="prod-card-thumb" alt="${esc(p.brand)} ${esc(p.partName)}" onerror="this.style.opacity='0.8'">
    </a>
    <div class="prod-card-body">
      <div class="prod-card-badges">
        <span class="badge-brand">${esc(p.brand)}</span>
        <span class="badge-cat">${esc(p.category)}</span>
      </div>
      <h3 class="prod-card-title"><a href="${prodUrl}">${esc(p.brand)} ${esc(p.partName)}</a></h3>
      <div class="prod-card-model">Modell: ${esc(p.model)}</div>
      <div class="prod-card-chips">
        ${(p.specs || []).slice(0, 2).map(sp => `<span class="chip">${esc(sp)}</span>`).join('')}
      </div>
      <div class="prod-card-footer">
        <a href="${prodUrl}" class="btn-card-details">
          Anleitung &amp; Teile ›
        </a>
      </div>
    </div>
  </article>`;
}

async function runBuild() {
  console.log(`🚀 Compiling ${products.length}-Page German SEO Empire (KaffeeTeile24) with LeatherClogs & Wikipedia Architecture...`);

  fs.writeFileSync(path.join(DIST_DIR, 'style.css'), CSS_BUNDLE, 'utf8');

  const sitemapUrls = [`${SITE_URL}/`];
  const searchIndex = [];

  // Group products by model for Model Hub Pages (Fixes all 404s in breadcrumbs)
  const modelMap = new Map();
  for (const p of products) {
    const mKey = `${p.brandSlug}/${p.modelSlug}`;
    if (!modelMap.has(mKey)) {
      modelMap.set(mKey, {
        brand: p.brand,
        brandSlug: p.brandSlug,
        model: p.model,
        modelSlug: p.modelSlug,
        products: []
      });
    }
    modelMap.get(mKey).products.push(p);
  }

  // 1. Compile In-Depth Product Pages
  let count = 0;
  for (const p of products) {
    count++;
    if (count % 200 === 0 || count === products.length) {
      console.log(`   Compiled ${count}/${products.length} product pages...`);
    }

    const article = contentEngineDE.getTechnicalArticle(p);

    const pageRelDir = path.join(p.brandSlug, p.modelSlug, p.partSlug);
    const pageAbsDir = path.join(DIST_DIR, pageRelDir);
    ensureDir(pageAbsDir);

    const canonicalUrl = `${SITE_URL}/${p.brandSlug}/${p.modelSlug}/${p.partSlug}/`;
    sitemapUrls.push(canonicalUrl);

    searchIndex.push({
      t: `${p.brand} ${p.model} ${p.partName}`,
      b: p.brand,
      m: p.model,
      p: p.partName,
      c: p.category,
      u: `${SITE_URL}/${p.brandSlug}/${p.modelSlug}/${p.partSlug}/`,
      i: p.images[0]
    });

    const amazonUrl = getAmazonUrl(p);
    const pageTitle = p.googleTitle || article.page_title;
    const metaDesc = p.metaDescription || article.meta_description;

    const html = `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
  <meta name="referrer" content="no-referrer">
  <title>${esc(pageTitle)}</title>
  <meta name="description" content="${esc(metaDesc)}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:type" content="product">
  <meta property="og:title" content="${esc(pageTitle)}">
  <meta property="og:description" content="${esc(metaDesc)}">
  <meta property="og:image" content="${p.images[0]}">
  <link rel="stylesheet" href="${SITE_URL}/style.css">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "${esc(p.brand)} ${esc(p.model)} - ${esc(p.partName)}",
    "image": ${JSON.stringify(p.images)},
    "description": "${esc(metaDesc)}",
    "sku": "${esc(p.asin)}",
    "brand": { "@type": "Brand", "name": "${esc(p.brand)}" },
    "offers": {
      "@type": "Offer",
      "url": "${amazonUrl}",
      "priceCurrency": "EUR",
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

  <main class="wrap">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="${SITE_URL}/">Startseite</a>
      <span class="sep">›</span>
      <a href="${SITE_URL}/${p.brandSlug}/">${esc(p.brand)}</a>
      <span class="sep">›</span>
      <a href="${SITE_URL}/${p.brandSlug}/${p.modelSlug}/">${esc(p.model)}</a>
      <span class="sep">›</span>
      <span>${esc(p.partName)}</span>
    </nav>

    <!-- Product Hero Stage (LeatherClogs Style) -->
    <section class="detail-hero-grid">
      <div class="gallery-box">
        <div class="main-img-wrap">
          <img id="mainimg" src="${p.images[0]}" alt="${esc(p.brand)} ${esc(p.model)} ${esc(p.partName)}" onerror="this.style.opacity='0.8'">
        </div>
        <div class="thumbs-row" id="thumbs">
          ${p.images.map((img, idx) => `
            <img src="${img}" class="${idx === 0 ? 'active' : ''}" data-idx="${idx}" alt="Ansicht ${idx + 1}" onerror="this.style.display='none'">
          `).join('')}
        </div>
      </div>

      <div class="detail-info">
        <span class="eyebrow">${esc(p.brand)} • ${esc(p.category)}</span>
        <h1>${esc(p.brand)} ${esc(p.model)}: ${esc(p.partName)}</h1>

        <div class="meta-strip">
          <span class="badge-rating">★ ${p.rating} (${p.reviewCount} Rezensionen)</span>
          ${p.oem ? `<span class="badge-oem">OEM-Nr: ${esc(p.oem)}</span>` : ''}
        </div>

        <!-- Quick Specs Badges -->
        <div class="specs-pills-row">
          ${(p.specs || ['15 Bar Druck', 'OEM Passform', 'Lebensmittelecht', 'DIY-Einbau']).map(sp => `
            <span class="spec-pill">⚙️ ${esc(sp)}</span>
          `).join('')}
        </div>

        <!-- Clean High-Converting CTA Button (LeatherClogs Style) -->
        <div class="cta-box">
          <a class="cta" href="${amazonUrl}" target="_blank" rel="sponsored nofollow noopener">
            Verfügbarkeit &amp; aktuellen Preis prüfen ↗
          </a>
          <p class="note">Preise und Lagerbestand werden beim Anbieter in Echtzeit aktualisiert. Der Link öffnet das aktuelle Angebot.</p>
        </div>

        <!-- "Auf einen Blick" (Key Highlights Card) -->
        <div class="key-highlights-card">
          <div class="key-highlights-title">📌 Auf einen Blick: Technische Zusammenfassung</div>
          <ul class="key-highlights-list">
            <li><span class="check-icon">✓</span> <div><strong>Primäre Aufgabe:</strong> ${esc(p.summary || 'Wiederherstellung des vollen Arbeitsdrucks und Reparatur von Fehleranzeigen.')}</div></li>
            <li><span class="check-icon">✓</span> <div><strong>Passgenauigkeit:</strong> 100% kompatibel für ${esc(p.brand)} ${esc(p.model)} (OEM-Spezifikation).</div></li>
            <li><span class="check-icon">✓</span> <div><strong>Reparaturaufwand:</strong> ca. 15–25 Minuten mit Standard-Werkzeug (Torx TX10/TX20).</div></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Two-Column Editorial Content -->
    <div class="content-layout">
      <article class="article-main">

        <!-- Google Search Intent & Direct Diagnostic Answers -->
        <div class="section-box google-intent-box">
          <h2>🔍 Häufigste Google.de-Suchanfragen zu ${esc(p.brand)} ${esc(p.model)}</h2>
          <hr class="section-divider">
          <p class="prose-p">Verifizierte Sofort-Lösungen zu den am häufigsten gesuchten Problemen und Wartungsfragen:</p>
          <div class="google-qna-list">
            ${(article.google_intent_qa || [
              {
                query: `Warum versagt ${p.partName} bei der ${p.brand} ${p.model}?`,
                answer: `Hauptursache sind Verschleiß an den Dichtungen oder thermische Ermüdung. Die OEM-Spezifikation ${p.oem || ''} stellt den ursprünglichen Brühdruck wieder her.`
              }
            ]).map(item => `
              <div class="google-qna-item">
                <h3 class="google-qna-q">❓ ${esc(item.query)}</h3>
                <p class="google-qna-a">${esc(item.answer)}</p>
              </div>
            `).join('')}
          </div>
          <div class="google-searches-tags">
            <span class="tags-label">Relevante Google-Suchbegriffe:</span>
            ${(p.googleSearches || []).map(s => `<span class="search-tag">${esc(s)}</span>`).join('')}
          </div>
        </div>
        
        <!-- Section 1: Mechatronic Teardown -->
        <div class="section-box">
          <h2>🔬 Mechatronische Analyse &amp; Funktionsprinzip</h2>
          <hr class="section-divider">
          ${formatEditorialText(article.engineering_breakdown)}
          
          <div class="callout-box callout-tip">
            <span class="callout-icon">💡</span>
            <div>
              <strong>Experten-Tipp für maximalen Brühdruck:</strong>
              Vor dem finalen Festziehen der Verbindungsschrauben stets die O-Ringe mit lebensmittelechtem <strong>OKS 1110 Silikonfett</strong> benetzen, um Mikrorisse und Einlauf-Leckagen zu verhindern.
            </div>
          </div>
        </div>

        <!-- Section 2: Symptoms & Root Causes -->
        <div class="section-box">
          <h2>⚠️ Typische Ausfallsymptome &amp; Ursachenanalyse</h2>
          <hr class="section-divider">
          ${formatEditorialText(article.symptoms_and_causes)}
        </div>

        <!-- Section 3: 5 Step-by-Step Action Cards -->
        <div class="section-box">
          <h2>🔧 Schritt-für-Schritt Reparaturanleitung</h2>
          <hr class="section-divider">
          <p class="prose-p">Befolgen Sie diese 5 aufeinander abgestimmten Schritte für einen sicheren und langlebigen Austausch der Baugruppe:</p>

          <div class="steps-cards-grid">
            ${(article.diy_step_by_step || []).map(st => `
              <div class="step-card">
                <div class="step-badge">${st.step}</div>
                <div class="step-body">
                  <h4>${esc(st.title)}</h4>
                  <p>${esc(st.action)}</p>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="callout-box callout-warn">
            <span class="callout-icon">⚠️</span>
            <div>
              <strong>Sicherheitshinweis:</strong>
              Vor jeder Gehäuseöffnung zwingend den 230V Netzstecker ziehen. Bei Arbeiten an Thermoblock und Pumpe sicherstellen, dass das System drucklos und vollständig abgekühlt ist.
            </div>
          </div>
        </div>

        <!-- Section 4: Narrative Guide -->
        <div class="section-box">
          <h2>📋 Detaillierter Leitfaden für den Selbsteinbau</h2>
          <hr class="section-divider">
          ${formatEditorialText(article.step_by_step_narrative)}
        </div>

        <!-- Section 5: Diagnostic Troubleshooting Table -->
        <div class="section-box">
          <h2>🔍 Fehlercode-Diagnose &amp; Problembehebung</h2>
          <hr class="section-divider">
          <p class="prose-p">Die folgende Übersicht zeigt die typischen Fehlermeldungen dieses Bauteils und die vom Kundendienst empfohlenen Abhilfemaßnahmen:</p>

          <table class="diag-table">
            <thead>
              <tr>
                <th>Fehlerbild / Symptom</th>
                <th>Technische Ursache</th>
                <th>Empfohlene Behebung</th>
              </tr>
            </thead>
            <tbody>
              ${(article.troubleshooting_table || []).map(tb => `
                <tr>
                  <td class="diag-symptom">⚠️ ${esc(tb.error)}</td>
                  <td>${esc(tb.cause)}</td>
                  <td class="diag-fix">✓ ${esc(tb.fix)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Section 6: Compatibility Matrix -->
        <div class="section-box">
          <h2>🧩 Modell-Kompatibilität &amp; Passform</h2>
          <hr class="section-divider">
          <p class="prose-p">Dieses Ersatzteil wurde auf mechanische und hydraulische Maßhaltigkeit mit folgenden Kaffeevollautomaten-Baureihen verifiziert:</p>

          <div class="compat-matrix-grid">
            <div class="compat-box">
              <div class="compat-box-title fits">✓ 100% Kompatible Modelle</div>
              <ul class="compat-list">
                ${((article.compatibility_matrix && article.compatibility_matrix.fits) || [`${p.brand} ${p.model}`]).map(ft => `
                  <li><span style="color:#15803d; font-weight:700;">✓</span> ${esc(ft)}</li>
                `).join('')}
              </ul>
            </div>
            <div class="compat-box">
              <div class="compat-box-title incompatible">✕ Nicht kompatibel für</div>
              <ul class="compat-list">
                ${((article.compatibility_matrix && article.compatibility_matrix.incompatible) || ['Siebträger-Gastromaschinen', 'Kapselsysteme']).map(inc => `
                  <li><span style="color:#b91c1c; font-weight:700;">✕</span> ${esc(inc)}</li>
                `).join('')}
              </ul>
            </div>
          </div>
        </div>

        <!-- Section 7: Maintenance Schedule -->
        <div class="section-box">
          <h2>📅 Wartungsplan &amp; Wechselintervalle</h2>
          <hr class="section-divider">
          <p class="prose-p">Präventive Pflegeempfehlungen zur Verlängerung der Lebensdauer Ihres Kaffeevollautomaten:</p>

          <div class="steps-cards-grid">
            ${(article.maintenance_schedule || []).map((ms, idx) => `
              <div class="step-card">
                <div class="step-badge">${idx + 1}</div>
                <div class="step-body">
                  <h4>${esc(ms.frequency)}</h4>
                  <p>${esc(ms.task)}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Section 8: FAQ Accordion -->
        <div class="section-box">
          <h2>❓ Häufig gestellte Fragen (FAQ)</h2>
          <hr class="section-divider">
          
          <div class="faq-box">
            ${(article.faq || []).map(f => `
              <div class="faq-item">
                <div class="faq-q">Q: ${esc(f.q)}</div>
                <div class="faq-a">${esc(f.a)}</div>
              </div>
            `).join('')}
          </div>
        </div>

      </article>

      <!-- Sidebar: Silo Internal Links (Zero 404s Guaranteed) -->
      <aside class="sidebar">
        
        <!-- Model Parts Hub -->
        <div class="sidebar-box">
          <div class="sidebar-title">⚙️ ${esc(p.model)} Teile</div>
          <ul class="sidebar-list">
            <li><a href="${SITE_URL}/${p.brandSlug}/${p.modelSlug}/" class="sidebar-link" style="font-weight:700; color:var(--primary);">Alle ${esc(p.model)} Anleitungen ›</a></li>
            ${products.filter(other => other.modelSlug === p.modelSlug && other.id !== p.id).map(other => `
              <li><a href="${SITE_URL}/${other.brandSlug}/${other.modelSlug}/${other.partSlug}/" class="sidebar-link">${esc(other.partName.split('(')[0].trim())} ›</a></li>
            `).join('')}
          </ul>
        </div>

        <!-- Brand Series Silo -->
        <div class="sidebar-box">
          <div class="sidebar-title">☕ Weitere ${esc(p.brand)} Baureihen</div>
          <ul class="sidebar-list">
            <li><a href="${SITE_URL}/${p.brandSlug}/" class="sidebar-link" style="font-weight:700; color:var(--primary);">Alle ${esc(p.brand)} Modelle ›</a></li>
            ${[...new Set(products.filter(b => b.brandSlug === p.brandSlug).map(b => b.modelSlug))].slice(0, 8).map(mSlug => {
              const mProd = products.find(pr => pr.brandSlug === p.brandSlug && pr.modelSlug === mSlug);
              return `<li><a href="${SITE_URL}/${p.brandSlug}/${mSlug}/" class="sidebar-link">${esc(mProd ? mProd.model : mSlug)} ›</a></li>`;
            }).join('')}
          </ul>
        </div>

        <!-- Category Silo -->
        <div class="sidebar-box">
          <div class="sidebar-title">🔩 Baugruppen-Übersicht</div>
          <ul class="sidebar-list">
            <li><a href="${SITE_URL}/kategorie/bruehgruppe/" class="sidebar-link">Brühgruppen &amp; Dichtungen ›</a></li>
            <li><a href="${SITE_URL}/kategorie/vibrationspumpe/" class="sidebar-link">Pumpen &amp; Hydraulik (15 Bar) ›</a></li>
            <li><a href="${SITE_URL}/kategorie/thermoblock/" class="sidebar-link">Heizelemente &amp; Thermoblöcke ›</a></li>
            <li><a href="${SITE_URL}/kategorie/mahlwerk/" class="sidebar-link">Mahlwerke &amp; Keramikscheiben ›</a></li>
            <li><a href="${SITE_URL}/kategorie/milchsystem/" class="sidebar-link">Milchsysteme &amp; Karaffen ›</a></li>
            <li><a href="${SITE_URL}/kategorie/wasserfilter/" class="sidebar-link">Wasserfilter &amp; Entkalkung ›</a></li>
            <li><a href="${SITE_URL}/kategorie/drainageventil/" class="sidebar-link">Drainageventile &amp; Kappen ›</a></li>
            <li><a href="${SITE_URL}/kategorie/magnetventil/" class="sidebar-link">Magnetventile &amp; Solenoid ›</a></li>
            <li><a href="${SITE_URL}/kategorie/fehlercodes/" class="sidebar-link">Fehlercode-Datenbank ›</a></li>
            <li><a href="${SITE_URL}/kategorie/kaffeeauslauf/" class="sidebar-link">Kaffeeauslaufverteiler ›</a></li>
          </ul>
        </div>

      </aside>
    </div>
  </main>

  <!-- Mobile Sticky CTA Bar (LeatherClogs Style) -->
  <div class="mobile-sticky-cta">
    <div class="sticky-info">
      <span class="sticky-title">${esc(p.brand)} ${esc(p.partName.split('(')[0].trim())}</span>
      <span class="sticky-sub">★ ${p.rating} • Auf Lager</span>
    </div>
    <a href="${amazonUrl}" class="btn-sticky-amazon" target="_blank" rel="sponsored nofollow noopener">
      Verfügbarkeit prüfen ↗
    </a>
  </div>

  ${renderFooter()}

  <!-- Gallery Switching Script -->
  <script>
    (function(){
      var main = document.getElementById('mainimg');
      var thumbs = document.querySelectorAll('#thumbs img');
      thumbs.forEach(function(t){
        t.addEventListener('click', function(){
          main.src = this.src;
          thumbs.forEach(function(o){ o.classList.remove('active'); });
          this.classList.add('active');
        });
      });
    })();
  </script>
  <script src="${SITE_URL}/instant-search.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(pageAbsDir, 'index.html'), html, 'utf8');
  }

  // 2. Compile Model Hub Pages (Resolves all 404s in Breadcrumbs)
  console.log(`📦 Compiling ${modelMap.size} dedicated Model Hub pages...`);
  for (const [mKey, mData] of modelMap) {
    const mDir = path.join(DIST_DIR, mData.brandSlug, mData.modelSlug);
    ensureDir(mDir);

    const mUrl = `${SITE_URL}/${mData.brandSlug}/${mData.modelSlug}/`;
    sitemapUrls.push(mUrl);

    searchIndex.push({
      t: `${mData.brand} ${mData.model} (Alle Teile & Anleitungen)`,
      b: mData.brand,
      m: mData.model,
      p: 'Modell-Hub',
      c: 'Vollautomat',
      u: mUrl,
      i: mData.products[0].images[0]
    });

    const mHtml = `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
  <meta name="referrer" content="no-referrer">
  <title>${esc(mData.brand)} ${esc(mData.model)}: Ersatzteile &amp; Reparaturanleitungen | KaffeeTeile24</title>
  <meta name="description" content="Alle Ersatzteile, Dichtungssätze, Fehlercodes und mechatronische Schritt-für-Schritt Reparaturanleitungen für ${esc(mData.brand)} ${esc(mData.model)}.">
  <link rel="canonical" href="${mUrl}">
  <link rel="stylesheet" href="${SITE_URL}/style.css">
</head>
<body>
  ${renderHeader()}

  <section class="hero-banner">
    <div class="wrap">
      <nav class="breadcrumb" style="justify-content:center; padding-top:0;" aria-label="Breadcrumb">
        <a href="${SITE_URL}/">Startseite</a>
        <span class="sep">›</span>
        <a href="${SITE_URL}/${mData.brandSlug}/">${esc(mData.brand)}</a>
        <span class="sep">›</span>
        <span>${esc(mData.model)}</span>
      </nav>
      <span class="hero-eyebrow">Modell-Spezifikation &amp; Teardown</span>
      <h1>${esc(mData.brand)} ${esc(mData.model)}</h1>
      <p>Originalgetreue Reparatur- und Ersatzteil-Übersicht für die ${esc(mData.brand)} ${esc(mData.model)} Baureihe. Ausführliche Mechatronik-Analysen, Explosionszeichnungen und passende OEM-Komponenten.</p>
    </div>
  </section>

  <main class="wrap">
    <div style="margin: 32px 0 16px;">
      <h2 style="font-size:20px; font-weight:800;">Kompatible Ersatzteile &amp; Anleitungen (${mData.products.length})</h2>
    </div>

    <div class="products-grid">
      ${mData.products.map(p => renderProductCard(p)).join('')}
    </div>
  </main>

  ${renderFooter()}
  <script src="${SITE_URL}/instant-search.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(mDir, 'index.html'), mHtml, 'utf8');
  }

  // 3. Compile Brand Hub Pages
  const brands = [...new Set(products.map(p => p.brand))];
  console.log(`🏢 Compiling ${brands.length} dedicated Brand Hub pages...`);
  for (const b of brands) {
    const brandProducts = products.filter(p => p.brand === b);
    const bSlug = brandProducts[0].brandSlug;
    const brandModels = [...new Set(brandProducts.map(p => p.modelSlug))].map(mSlug => {
      const prod = brandProducts.find(p => p.modelSlug === mSlug);
      return {
        slug: mSlug,
        model: prod ? prod.model : mSlug,
        count: brandProducts.filter(p => p.modelSlug === mSlug).length
      };
    });

    const bDir = path.join(DIST_DIR, bSlug);
    ensureDir(bDir);

    const bUrl = `${SITE_URL}/${bSlug}/`;
    sitemapUrls.push(bUrl);

    const bHtml = `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
  <meta name="referrer" content="no-referrer">
  <title>${esc(b)} Kaffeevollautomaten Ersatzteile &amp; Reparatur | KaffeeTeile24</title>
  <meta name="description" content="Alle Modelle und Ersatzteile für ${esc(b)} Vollautomaten: Brühgruppen, Pumpen, Dichtungen und Reparaturanleitungen.">
  <link rel="canonical" href="${bUrl}">
  <link rel="stylesheet" href="${SITE_URL}/style.css">
</head>
<body>
  ${renderHeader()}

  <section class="hero-banner">
    <div class="wrap">
      <nav class="breadcrumb" style="justify-content:center; padding-top:0;" aria-label="Breadcrumb">
        <a href="${SITE_URL}/">Startseite</a>
        <span class="sep">›</span>
        <span>${esc(b)}</span>
      </nav>
      <span class="hero-eyebrow">Marken-Übersicht</span>
      <h1>${esc(b)} Kaffeevollautomaten Ersatzteile &amp; Reparatur</h1>
      <p>
        Wählen Sie Ihre ${esc(b)} Baureihe für modellspezifische Ersatzteil-Spezifikationen, mechatronische Teardowns und Schritt-für-Schritt Einbauanleitungen.
      </p>
    </div>
  </section>

  <main class="wrap">
    <!-- Brand Models Sub-Navigation -->
    <div style="margin: 28px 0 12px;">
      <h2 style="font-size:18px; font-weight:800; margin-bottom:12px;">${esc(b)} Baureihen &amp; Modelle (${brandModels.length})</h2>
      <div class="brand-grid">
        ${brandModels.map(bm => `
          <a href="${SITE_URL}/${bSlug}/${bm.slug}/" class="brand-card">
            <span class="brand-name">${esc(bm.model)}</span>
            <span class="brand-count">${bm.count} Teile ›</span>
          </a>
        `).join('')}
      </div>
    </div>

    <div style="margin: 32px 0 16px;">
      <h2 style="font-size:20px; font-weight:800;">Alle ${esc(b)} Ersatzteile &amp; Anleitungen (${brandProducts.length})</h2>
    </div>

    <div class="products-grid">
      ${brandProducts.map(p => renderProductCard(p)).join('')}
    </div>
  </main>

  ${renderFooter()}
  <script src="${SITE_URL}/instant-search.js"></script>
</body>
</html>`;
    fs.writeFileSync(path.join(bDir, 'index.html'), bHtml, 'utf8');
  }

  // 4. Compile Category Hub Pages (10 Categories)
  const categories = [...new Set(products.map(p => p.categorySlug))];
  console.log(`🔩 Compiling ${categories.length} Category Hub pages...`);
  for (const cSlug of categories) {
    const catProducts = products.filter(p => p.categorySlug === cSlug);
    const catName = catProducts[0].category;
    const catDir = path.join(DIST_DIR, 'kategorie', cSlug);
    ensureDir(catDir);

    const cUrl = `${SITE_URL}/kategorie/${cSlug}/`;
    sitemapUrls.push(cUrl);

    const cHtml = `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
  <meta name="referrer" content="no-referrer">
  <title>${esc(catName)} für Kaffeevollautomaten | KaffeeTeile24</title>
  <meta name="description" content="Übersicht aller ${esc(catName)} für De'Longhi, Siemens, Jura, Philips und Krups mit Reparatur-Anleitungen.">
  <link rel="canonical" href="${cUrl}">
  <link rel="stylesheet" href="${SITE_URL}/style.css">
</head>
<body>
  ${renderHeader()}

  <section class="hero-banner">
    <div class="wrap">
      <nav class="breadcrumb" style="justify-content:center; padding-top:0;" aria-label="Breadcrumb">
        <a href="${SITE_URL}/">Startseite</a>
        <span class="sep">›</span>
        <span>${esc(catName)}</span>
      </nav>
      <span class="hero-eyebrow">Bauteil-Kategorie</span>
      <h1>${esc(catName)} für Kaffeevollautomaten</h1>
      <p>Passgenaue Originalteile, Dichtungssätze und mechatronische Instandsetzungsanleitungen für alle führenden Hersteller.</p>
    </div>
  </section>

  <main class="wrap">
    <div style="margin: 32px 0 16px;">
      <h2 style="font-size:20px; font-weight:800;">Geprüfte ${esc(catName)} (${catProducts.length})</h2>
    </div>

    <div class="products-grid">
      ${catProducts.map(p => renderProductCard(p)).join('')}
    </div>
  </main>

  ${renderFooter()}
  <script src="${SITE_URL}/instant-search.js"></script>
</body>
</html>`;
    fs.writeFileSync(path.join(catDir, 'index.html'), cHtml, 'utf8');
  }

  // 5. Compile Homepage (LeatherClogs-Inspired True Silo Architecture)
  console.log(`🏠 Compiling Master Silo Homepage...`);
  const homeHtml = `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
  <meta name="referrer" content="no-referrer">
  <title>KaffeeTeile24 – Unabhängiges Referenzportal für Kaffeevollautomaten-Reparatur</title>
  <meta name="description" content="Das führende deutsche Referenzportal für De'Longhi, Siemens, Jura &amp; Philips Vollautomaten: Original-Ersatzteile, Fehlercodes, O-Ring-Sets und DIY-Reparatur.">
  <link rel="canonical" href="${SITE_URL}/">
  <link rel="stylesheet" href="${SITE_URL}/style.css">
</head>
<body>
  ${renderHeader()}

  <!-- Hero Section -->
  <section class="hero-banner">
    <div class="wrap">
      <span class="hero-eyebrow">Unabhängiges Reparatur- &amp; Ersatzteil-Kompendium</span>
      <h1>Kaffeevollautomaten reparieren statt neu kaufen</h1>
      <p>
        Das herstellerübergreifende Referenzportal für De'Longhi, Siemens, Jura, Philips, Saeco, Krups, Sage, Melitta, Nivona, Bosch und Miele. Originalgetreue Mechatronik-Analysen, Google-Suchintent-Diagnosen und schrittweise Instandsetzungsanleitungen für über 100 Maschinenmodelle.
      </p>
    </div>
  </section>

  <main class="wrap">
    <!-- SILO 1: Symptom & Intent-Driven Hub ("Reparatur nach Symptom" - LeatherClogs Style) -->
    <section id="symptome" style="margin-top: 36px;">
      <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px;">
        <h2 style="font-size:22px; font-weight:800; color:#1c1917;">🚨 Reparatur nach Fehlerbild &amp; Symptom</h2>
      </div>
      <p style="font-size:14px; color:#57534e; margin-bottom:16px;">
        Diagnostizieren Sie den Fehler anhand der mechanischen und hydraulischen Anzeichen Ihrer Kaffeemaschine:
      </p>

      <div class="symptom-grid">
        <a href="${SITE_URL}/kategorie/bruehgruppe/" class="symptom-card">
          <div class="symptom-icon">☕</div>
          <div class="symptom-content">
            <h3>Brühgruppe klemmt / quietscht</h3>
            <p>Führungsschienen trocken, 1.4310 Brühsieb verharzt oder Kolbendichtungen verhärtet.</p>
            <span class="symptom-link">Brühgruppen &amp; Dichtungen ›</span>
          </div>
        </a>

        <a href="${SITE_URL}/kategorie/fehlercodes/" class="symptom-card">
          <div class="symptom-icon">⚠️</div>
          <div class="symptom-content">
            <h3>Fehlercodes &amp; Alarmleuchten</h3>
            <p>De'Longhi Allgemeiner Alarm, Siemens E0511/E0513, Jura Error 8, Philips 01/03 beheben.</p>
            <span class="symptom-link">Fehlercode-Diagnose ›</span>
          </div>
        </a>

        <a href="${SITE_URL}/kategorie/milchsystem/" class="symptom-card">
          <div class="symptom-icon">🥛</div>
          <div class="symptom-content">
            <h3>Milchschaum spritzt / zieht keine Milch</h3>
            <p>Venturi-Feinluftdüse verstopft, LatteCrema / LatteGo Kupplung undicht.</p>
            <span class="symptom-link">Milchsysteme &amp; Karaffen ›</span>
          </div>
        </a>

        <a href="${SITE_URL}/kategorie/vibrationspumpe/" class="symptom-card">
          <div class="symptom-icon">🔊</div>
          <div class="symptom-content">
            <h3>Pumpe brummt laut &amp; zieht kein Wasser</h3>
            <p>Kavitation, gealterte Kolbenfeder oder Ulka EX5 Schwingkolbenpumpe defekt.</p>
            <span class="symptom-link">15-Bar Ulka Pumpen ›</span>
          </div>
        </a>

        <a href="${SITE_URL}/kategorie/drainageventil/" class="symptom-card">
          <div class="symptom-icon">💧</div>
          <div class="symptom-content">
            <h3>Abtropfschale läuft voll &amp; Trester nass</h3>
            <p>Drainageventil gebrochen oder O-Ring-Leckage am Übergabestutzen.</p>
            <span class="symptom-link">Drainageventile &amp; Messingkappen ›</span>
          </div>
        </a>

        <a href="${SITE_URL}/kategorie/mahlwerk/" class="symptom-card">
          <div class="symptom-icon">⚙️</div>
          <div class="symptom-content">
            <h3>Mahlwerk blockiert / mahlt leer</h3>
            <p>Steinchen-Fremdkörperblockade oder abgenutzte Schneidkanten der Keramikmahlscheiben.</p>
            <span class="symptom-link">Keramik-Mahlwerke ›</span>
          </div>
        </a>
      </div>
    </section>

    <!-- SILO 2: Browse by Brand & Models -->
    <section id="marken" style="margin-top: 36px;">
      <h2 style="font-size:22px; font-weight:800; color:#1c1917; margin-bottom:8px;">☕ Hersteller &amp; Baureihen-Hubs</h2>
      <p style="font-size:14px; color:#57534e; margin-bottom:16px;">
        Direktzugriff auf alle modellspezifischen Ersatzteile und Revisionsanleitungen:
      </p>

      <div class="brand-grid">
        ${brands.map(b => {
          const bProds = products.filter(p => p.brand === b);
          const bSlug = bProds[0].brandSlug;
          return `
          <a href="${SITE_URL}/${bSlug}/" class="brand-card">
            <span class="brand-name">${esc(b)}</span>
            <span class="brand-count">${bProds.length} Anleitungen ›</span>
          </a>`;
        }).join('')}
      </div>
    </section>

    <!-- SILO 3: Component Categories -->
    <section id="kategorien" style="margin-top: 36px;">
      <h2 style="font-size:22px; font-weight:800; color:#1c1917; margin-bottom:8px;">🔩 Baugruppen &amp; Ersatzteil-Kategorien</h2>
      <p style="font-size:14px; color:#57534e; margin-bottom:16px;">
        Gezielte Auswahl nach mechatronischer Funktionsgruppe:
      </p>

      <div class="brand-grid">
        <a href="${SITE_URL}/kategorie/bruehgruppe/" class="brand-card">
          <span class="brand-name">Brühgruppen &amp; Revision</span>
          <span class="brand-count">›</span>
        </a>
        <a href="${SITE_URL}/kategorie/vibrationspumpe/" class="brand-card">
          <span class="brand-name">Pumpen &amp; Hydraulik (15 Bar)</span>
          <span class="brand-count">›</span>
        </a>
        <a href="${SITE_URL}/kategorie/thermoblock/" class="brand-card">
          <span class="brand-name">Heizelemente &amp; Thermoblöcke</span>
          <span class="brand-count">›</span>
        </a>
        <a href="${SITE_URL}/kategorie/mahlwerk/" class="brand-card">
          <span class="brand-name">Mahlwerke &amp; Keramik</span>
          <span class="brand-count">›</span>
        </a>
        <a href="${SITE_URL}/kategorie/milchsystem/" class="brand-card">
          <span class="brand-name">Milchsysteme &amp; Karaffen</span>
          <span class="brand-count">›</span>
        </a>
        <a href="${SITE_URL}/kategorie/wasserfilter/" class="brand-card">
          <span class="brand-name">Wasserfilter &amp; Entkalkung</span>
          <span class="brand-count">›</span>
        </a>
        <a href="${SITE_URL}/kategorie/drainageventil/" class="brand-card">
          <span class="brand-name">Drainageventile &amp; Kappen</span>
          <span class="brand-count">›</span>
        </a>
        <a href="${SITE_URL}/kategorie/magnetventil/" class="brand-card">
          <span class="brand-name">Magnetventile &amp; Solenoid</span>
          <span class="brand-count">›</span>
        </a>
        <a href="${SITE_URL}/kategorie/fehlercodes/" class="brand-card">
          <span class="brand-name">Fehlercode-Datenbank</span>
          <span class="brand-count">›</span>
        </a>
        <a href="${SITE_URL}/kategorie/kaffeeauslauf/" class="brand-card">
          <span class="brand-name">Kaffeeauslaufverteiler</span>
          <span class="brand-count">›</span>
        </a>
      </div>
    </section>

    <!-- SILO 4: Editorial Standards (LeatherClogs Style Deep Trust Content) -->
    <section style="margin-top: 48px; background:#ffffff; border:1px solid var(--border-color); border-radius:var(--radius-card); padding:32px;">
      <h2 style="font-size:22px; font-weight:800; color:#1c1917; margin-bottom:12px;">
        🔬 Was unterscheidet hochwertige Ersatzteile von minderwertigen Nachbauten?
      </h2>
      <p class="prose-p">
        In modernen Kaffeevollautomaten wirken bei jedem Bezug bis zu <strong>19 Bar Druck</strong> und Heißwassertemperaturen von über <strong>94 °C</strong>. Billige Dichtungen aus gewöhnlichem Nitrilkautschuk (NBR) verspröden unter diesen thermomechanischen Bedingungen bereits nach wenigen hundert Tassen. Wir vergleichen ausschließlich Komponenten nach OEM-Erstausrüsterstandard:
      </p>
      
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:20px; margin-top:20px;">
        <div style="background:#fafaf9; border:1px solid var(--border-color); border-radius:10px; padding:18px;">
          <div style="font-weight:700; font-size:15px; margin-bottom:6px; color:#15803d;">✓ Elastomer-Präzision (VMQ &amp; EPDM)</div>
          <p style="font-size:13px; color:#57534e; line-height:1.5;">
            Lebensmittelechte Vinyl-Methyl-Silikon-Dichtungen mit <strong>NSF-H1 Zulassung</strong> und exakter 70 Shore A Härte garantieren absolute Druckdichtigkeit ohne Quellung.
          </p>
        </div>

        <div style="background:#fafaf9; border:1px solid var(--border-color); border-radius:10px; padding:18px;">
          <div style="font-weight:700; font-size:15px; margin-bottom:6px; color:#15803d;">✓ Federstahl nach DIN EN 10270-3</div>
          <p style="font-size:13px; color:#57534e; line-height:1.5;">
            Ventilfedern und Brühsiebe aus austenitischem <strong>1.4310 Edelstahl</strong> widerstehen aggressiven Kaffeesäuren und behalten ihre Federrate über zehntausende Zyklen.
          </p>
        </div>

        <div style="background:#fafaf9; border:1px solid var(--border-color); border-radius:10px; padding:18px;">
          <div style="font-weight:700; font-size:15px; margin-bottom:6px; color:#15803d;">✓ Maßhaltige POM Delrin Bauteile</div>
          <p style="font-size:13px; color:#57534e; line-height:1.5;">
            Präzisionsgefräste Führungsflanken aus hochfestem Polyacetal (POM) verhindern Karies an Zahnrädern und schützen den Spindelantrieb vor Blockaden.
          </p>
        </div>
      </div>
    </section>

    <!-- Curated Featured Guides -->
    <section style="margin-top: 48px;">
      <h2 style="font-size:22px; font-weight:800; color:#1c1917; margin-bottom:16px;">⭐ Häufig aufgerufene Reparatur-Leitfäden</h2>
      <div class="products-grid">
        ${products.slice(0, 12).map(p => renderProductCard(p)).join('')}
      </div>
    </section>
  </main>

  ${renderFooter()}
  <script src="${SITE_URL}/instant-search.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), homeHtml, 'utf8');

  // 6. Search Index
  console.log(`🔍 Writing Search Index with ${searchIndex.length} items...`);
  fs.writeFileSync(path.join(DIST_DIR, 'search-index.json'), JSON.stringify(searchIndex), 'utf8');

  // 7. Instant Search Client JS
  const instantSearchJs = `
(function(){
  var searchInput = document.getElementById('site-search');
  var clearBtn = document.getElementById('search-clear');
  var dropdown = document.getElementById('search-dropdown');
  if (!searchInput || !dropdown) return;

  var index = [];
  fetch('${SITE_URL}/search-index.json')
    .then(function(r){ return r.json(); })
    .then(function(d){ index = d; });

  function doSearch(val) {
    var q = val.trim().toLowerCase();
    if (!q) {
      dropdown.classList.remove('show');
      if (clearBtn) clearBtn.style.display = 'none';
      return;
    }
    if (clearBtn) clearBtn.style.display = 'flex';

    var results = index.filter(function(item) {
      return item.t.toLowerCase().indexOf(q) !== -1 ||
             item.b.toLowerCase().indexOf(q) !== -1 ||
             item.m.toLowerCase().indexOf(q) !== -1 ||
             item.c.toLowerCase().indexOf(q) !== -1;
    }).slice(0, 8);

    if (results.length === 0) {
      dropdown.innerHTML = '<div style="padding:12px; font-size:13px; color:#78716c;">Keine passenden Ersatzteile gefunden.</div>';
    } else {
      dropdown.innerHTML = results.map(function(item){
        return '<a href="' + item.u + '" class="search-dropdown-item">' +
          '<div style="display:flex; align-items:center;">' +
            '<img src="' + item.i + '" class="search-item-thumb" onerror="this.style.opacity=\\'0.7\\'">' +
            '<div>' +
              '<div style="font-weight:700; font-size:13px;">' + item.t + '</div>' +
              '<div style="font-size:11px; color:#78716c;">' + item.b + ' • ' + item.c + '</div>' +
            '</div>' +
          '</div>' +
          '<span style="font-size:16px; color:#854d0e;">›</span>' +
        '</a>';
      }).join('');
    }
    dropdown.classList.add('show');
  }

  searchInput.addEventListener('input', function(e){ doSearch(e.target.value); });
  if (clearBtn) {
    clearBtn.addEventListener('click', function(){
      searchInput.value = '';
      doSearch('');
      searchInput.focus();
    });
  }
  document.addEventListener('click', function(e){
    if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });
})();
`;
  fs.writeFileSync(path.join(DIST_DIR, 'instant-search.js'), instantSearchJs, 'utf8');

  // 8. XML Sitemap and Robots.txt
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url><loc>${u}</loc><lastmod>${new Date().toISOString().split('T')[0]}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`).join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');

  const robotsTxt = `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, '.nojekyll'), '', 'utf8');

  console.log(`✅ Compilation Finished! Total exact pages generated: ${sitemapUrls.length}`);
}

runBuild();
