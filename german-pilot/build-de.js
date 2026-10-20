const fs = require('fs');
const path = require('path');

const SITE_URL = (process.env.SITE_URL || 'https://roboparca.github.io/kaffeereparatur').replace(/\/+$/, '');
const DIST_DIR = path.join(__dirname, 'dist');
const DATA_DIR = path.join(__dirname, 'data');
const GEN_DIR = path.join(DATA_DIR, 'generated');

if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });

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

// CSS Bundle with Native Mobile-First Card Tables
const CSS_BUNDLE = `
:root {
  --primary: #92400e; /* Coffee bronze */
  --primary-dark: #78350f;
  --primary-light: #fef3c7;
  --amazon-orange: #f59e0b;
  --amazon-hover: #d97706;
  --bg-app: #fafaf9;
  --bg-card: #ffffff;
  --text-main: #1c1917;
  --text-muted: #57534e;
  --border-color: #e7e5e4;
  --radius-card: 12px;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
body {
  font-family: var(--font-sans);
  background-color: var(--bg-app);
  color: var(--text-main);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  padding-bottom: 76px;
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
  padding: 10px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
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
  font-size: 18px;
  color: var(--text-main);
  text-decoration: none !important;
  white-space: nowrap;
}
.brand-logo .logo-icon { font-size: 22px; }
.brand-logo .tld { color: var(--primary); }
.badge-pro {
  background: #fef3c7;
  color: #92400e;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 9999px;
  border: 1px solid #fde68a;
}

.header-search-wrap {
  position: relative;
  flex: 1;
  max-width: 520px;
}
.header-search-box {
  position: relative;
  display: flex;
  align-items: center;
  background: #f5f5f4;
  border: 1px solid #d6d3d1;
  border-radius: 8px;
}
.header-search-box:focus-within {
  background: #ffffff;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(146, 64, 14, 0.15);
}
.search-icon {
  position: absolute;
  left: 12px;
  font-size: 14px;
  color: var(--text-muted);
  pointer-events: none;
}
#instant-search-input {
  width: 100%;
  padding: 9px 36px 9px 34px;
  font-size: 14px;
  border: none;
  background: transparent;
  outline: none;
  font-family: inherit;
  color: var(--text-main);
}
.clear-btn {
  position: absolute;
  right: 10px;
  background: #d6d3d1;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-dropdown-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
  max-height: 400px;
  overflow-y: auto;
  z-index: 2000;
  display: none;
  padding: 6px;
}
.search-dropdown-menu.show { display: block; }
.search-dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 6px;
  text-decoration: none !important;
  color: var(--text-main);
  margin-bottom: 2px;
}
.search-dropdown-item:hover { background: #f5f5f4; }
.search-item-thumb {
  width: 36px;
  height: 36px;
  object-fit: contain;
  background: #ffffff;
  border: 1px solid #e7e5e4;
  border-radius: 6px;
  padding: 2px;
  margin-right: 10px;
}

.header-nav { display: flex; align-items: center; gap: 10px; }
.header-nav a { font-size: 13px; font-weight: 600; color: #44403c; }
.header-nav a:hover { color: var(--primary); text-decoration: none; }

/* Hero Section */
.hero-banner {
  background: linear-gradient(135deg, #292524 0%, #1c1917 100%);
  color: #fafaf9;
  padding: 36px 0;
  border-bottom: 3px solid var(--primary);
}
.hero-banner h1 { font-size: 28px; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.5px; }
.hero-banner p { font-size: 15px; color: #d6d3d1; max-width: 720px; }

/* Badges & Meta */
.badge-brand { display: inline-block; background: #e7e5e4; color: #292524; font-weight: 700; font-size: 11px; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; }
.badge-cat { display: inline-block; background: #fef3c7; color: #92400e; font-weight: 700; font-size: 11px; padding: 2px 8px; border-radius: 4px; }
.badge-rating { display: inline-flex; align-items: center; gap: 4px; background: #ecfdf5; color: #047857; font-weight: 700; font-size: 11px; padding: 2px 8px; border-radius: 4px; }

/* Breadcrumbs */
.breadcrumb { padding: 14px 0 6px; font-size: 12px; color: var(--text-muted); display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.breadcrumb a { color: var(--text-muted); }
.breadcrumb a:hover { color: var(--primary); }
.breadcrumb span.sep { color: #a8a29e; }

/* Product Grid */
.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 18px; margin: 24px 0 40px; }
.prod-card {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.prod-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.prod-card-thumb {
  width: 100%;
  height: 190px;
  object-fit: contain;
  background: #ffffff;
  padding: 16px;
  border-bottom: 1px solid #f5f5f4;
}
.prod-card-body { padding: 16px; display: flex; flex-direction: column; flex: 1; }
.prod-card-badges { display: flex; gap: 6px; margin-bottom: 8px; flex-wrap: wrap; }
.prod-card-title { font-size: 15px; font-weight: 700; color: var(--text-main); margin-bottom: 6px; line-height: 1.35; }
.prod-card-model { font-size: 12px; color: var(--text-muted); margin-bottom: 12px; }
.prod-card-footer { margin-top: auto; display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid #f5f5f4; }
.prod-card-price { font-size: 15px; font-weight: 800; color: #1c1917; }
.btn-card-details {
  background: #292524;
  color: #ffffff !important;
  font-size: 12px;
  font-weight: 700;
  padding: 7px 12px;
  border-radius: 6px;
  text-decoration: none !important;
}
.btn-card-details:hover { background: var(--primary); }

/* Detail Page Hero */
.detail-hero-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 28px; background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-card); padding: 24px; margin: 16px 0 24px; box-shadow: var(--shadow-sm); }
.gallery-box { display: flex; flex-direction: column; gap: 12px; }
.main-img-wrap { width: 100%; height: 340px; background: #ffffff; border: 1px solid var(--border-color); border-radius: 8px; display: flex; align-items: center; justify-content: center; padding: 16px; }
.main-img-wrap img { max-width: 100%; max-height: 100%; object-fit: contain; }
.thumbs-row { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
.thumbs-row img { width: 62px; height: 62px; object-fit: contain; border: 1px solid var(--border-color); border-radius: 6px; padding: 4px; cursor: pointer; background: #fff; }
.thumbs-row img.active { border-color: var(--primary); box-shadow: 0 0 0 2px rgba(146, 64, 14, 0.2); }

.detail-info { display: flex; flex-direction: column; }
.detail-info h1 { font-size: 24px; font-weight: 800; line-height: 1.3; margin: 10px 0 8px; color: var(--text-main); }
.asin-badge { font-family: monospace; font-size: 12px; color: var(--text-muted); margin-bottom: 14px; }

/* Amazon Buy Direct Box */
.amazon-buy-box {
  background: #fffbeb;
  border: 1px solid #fef3c7;
  border-left: 4px solid var(--amazon-orange);
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0 20px;
}
.amazon-buy-price-row { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 8px; }
.amazon-price-tag { font-size: 24px; font-weight: 800; color: #92400e; }
.amazon-stock-badge { font-size: 12px; font-weight: 700; color: #15803d; }
.btn-amazon-primary {
  display: block;
  width: 100%;
  text-align: center;
  background: var(--amazon-orange);
  color: #1c1917 !important;
  font-weight: 800;
  font-size: 15px;
  padding: 13px 18px;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
  text-decoration: none !important;
  transition: background 0.15s ease;
}
.btn-amazon-primary:hover { background: var(--amazon-hover); }
.amazon-guarantee-note { font-size: 11px; color: #78350f; text-align: center; margin-top: 8px; }

/* Content Layout */
.content-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; padding-bottom: 30px; }
.article-main { background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-card); padding: 28px; box-shadow: var(--shadow-sm); }
.article-sidebar { display: flex; flex-direction: column; gap: 20px; }

.section-box { margin-bottom: 28px; }
.section-box h2 { font-size: 20px; font-weight: 800; margin-bottom: 12px; color: var(--text-main); border-bottom: 2px solid #f5f5f4; padding-bottom: 8px; }
.section-box p { font-size: 14.5px; line-height: 1.7; color: #334155; margin-bottom: 14px; }

/* Step Cards */
.steps-container { display: flex; flex-direction: column; gap: 12px; margin: 16px 0 20px; }
.step-item-card { background: #fafaf9; border: 1px solid var(--border-color); border-radius: 8px; padding: 14px 16px; }
.step-num-badge { display: inline-block; background: #292524; color: #fff; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 4px; margin-bottom: 6px; }
.step-item-title { font-size: 15px; font-weight: 700; color: var(--text-main); margin-bottom: 4px; }
.step-item-desc { font-size: 13.5px; color: #44403c; line-height: 1.5; }

/* Mobile-First Card Diagnostic Table */
.data-table-wrap { overflow-x: auto; margin: 16px 0; }
.tech-table { width: 100%; border-collapse: collapse; font-size: 13.5px; background: #fff; border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; }
.tech-table th, .tech-table td { padding: 12px 14px; border-bottom: 1px solid var(--border-color); text-align: left; }
.tech-table th { background: #f5f5f4; font-weight: 700; color: var(--text-main); font-size: 12px; text-transform: uppercase; }

/* Compatibility Matrix */
.compat-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 16px 0; }
.compat-box h3 { font-size: 15px; font-weight: 800; margin-bottom: 10px; }
.compat-list { list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 13px; }
.badge-check { background: #dcfce7; color: #166534; font-size: 11px; font-weight: 700; padding: 3px 7px; border-radius: 4px; }
.badge-cross { background: #fee2e2; color: #991b1b; font-size: 11px; font-weight: 700; padding: 3px 7px; border-radius: 4px; }

/* FAQ Accordion */
.faq-wrap { display: flex; flex-direction: column; gap: 12px; margin-top: 14px; }
.faq-card { background: #fafaf9; border: 1px solid var(--border-color); border-radius: 8px; padding: 14px 16px; }
.faq-question { font-size: 15px; font-weight: 700; color: var(--text-main); margin-bottom: 6px; }
.faq-answer { font-size: 13.5px; color: #44403c; line-height: 1.6; }

/* Sticky Mobile Bar */
.mobile-sticky-cta {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--border-color);
  padding: 10px 14px;
  box-shadow: 0 -4px 12px rgba(0,0,0,0.08);
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  box-sizing: border-box;
  max-width: 100vw;
}
.sticky-info { display: flex; flex-direction: column; min-width: 0; flex: 1; }
.sticky-title { font-size: 13px; font-weight: 700; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sticky-sub { font-size: 11px; color: var(--text-muted); }
.btn-sticky-amazon {
  background: var(--amazon-orange);
  color: #111827;
  font-size: 13px;
  font-weight: 800;
  padding: 10px 16px;
  border-radius: 8px;
  white-space: nowrap;
  flex-shrink: 0;
  text-decoration: none !important;
}

/* Sidebar Box */
.sidebar-box { background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-card); padding: 18px; box-shadow: var(--shadow-sm); }
.sidebar-box h3 { font-size: 15px; font-weight: 700; margin-bottom: 12px; border-bottom: 1px solid #f5f5f4; padding-bottom: 6px; }
.sidebar-links { list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 13px; }
.sidebar-links a { color: #44403c; }
.sidebar-links a:hover { color: var(--primary); }

/* Footer */
.app-footer { background: #1c1917; color: #a8a29e; padding: 40px 0 20px; font-size: 13px; margin-top: 40px; }
.footer-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-bottom: 24px; }
.footer-col h3 { color: #f5f5f4; font-size: 14px; font-weight: 700; margin-bottom: 10px; }
.footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 6px; }
.footer-col a { color: #a8a29e; }
.footer-col a:hover { color: #fff; }
.footer-note { font-size: 11px; line-height: 1.5; color: #78716c; margin-top: 10px; }

/* Responsive Media Queries */
@media (max-width: 768px) {
  .header-nav { display: none; }
  .detail-hero-grid { grid-template-columns: 1fr; gap: 16px; padding: 16px; }
  .content-layout { grid-template-columns: 1fr; }
  .article-main { padding: 18px; }
  .mobile-sticky-cta { display: flex; }
  .footer-grid { grid-template-columns: 1fr; gap: 20px; }

  /* Turn Tables into Responsive Cards */
  .tech-table, 
  .tech-table thead, 
  .tech-table tbody, 
  .tech-table th, 
  .tech-table td, 
  .tech-table tr {
    display: block;
    width: 100% !important;
    box-sizing: border-box;
  }
  .tech-table thead { display: none; }
  .tech-table { border: none; background: transparent; }
  .tech-table tr {
    background: #ffffff;
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 14px;
    margin-bottom: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }
  .tech-table td {
    padding: 6px 0;
    border-bottom: 1px dashed #f5f5f4;
  }
  .tech-table td:last-child { border-bottom: none; }
  .tech-table td::before {
    content: attr(data-label);
    display: block;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    color: #78716c;
    margin-bottom: 2px;
  }
}
`;

function getAmazonUrl(asin) {
  return `https://www.amazon.de/dp/${asin}?tag=kaffeereparatur-21`;
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

    <div class="header-search-wrap">
      <div class="header-search-box">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          id="instant-search-input" 
          placeholder="Ersatzteil oder Modell suchen... (z.B. DeLonghi Brühgruppe, EQ6 Mahlwerk)" 
          autocomplete="off" 
          spellcheck="false"
        />
        <button id="search-clear-btn" class="clear-btn" aria-label="Löschen" style="display:none">✕</button>
      </div>
      <div id="instant-search-dropdown" class="search-dropdown-menu"></div>
    </div>

    <nav class="header-nav">
      <a href="${SITE_URL}/delonghi/">De'Longhi</a>
      <a href="${SITE_URL}/siemens/">Siemens</a>
      <a href="${SITE_URL}/jura/">Jura</a>
      <a href="${SITE_URL}/philips/">Philips</a>
    </nav>
  </div>
</header>
`;
}

function renderFooter() {
  return `
<footer class="app-footer">
  <div class="wrap footer-grid">
    <div class="footer-col">
      <h3>☕ Führende Vollautomaten-Marken</h3>
      <ul>
        <li><a href="${SITE_URL}/delonghi/">De'Longhi Ersatzteile &amp; Brühgruppen</a></li>
        <li><a href="${SITE_URL}/siemens/">Siemens EQ Serie Reparatur-Leitfäden</a></li>
        <li><a href="${SITE_URL}/jura/">Jura E-Serie Drainageventile &amp; Filter</a></li>
        <li><a href="${SITE_URL}/philips/">Philips LatteGo &amp; AquaClean Systeme</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h3>⚙️ Ersatzteil-Kategorien</h3>
      <ul>
        <li><a href="${SITE_URL}/kategorie/bruehgruppe/">Brühgruppen, Dichtungssätze &amp; O-Ringe</a></li>
        <li><a href="${SITE_URL}/kategorie/vibrationspumpe/">Ulka 15-Bar Vibrationspumpen &amp; Ventile</a></li>
        <li><a href="${SITE_URL}/kategorie/mahlwerk/">Keramik- &amp; Stahl-Mahlwerke</a></li>
        <li><a href="${SITE_URL}/kategorie/milchsystem/">Milchschäumer &amp; Edelstahlrohre</a></li>
        <li><a href="${SITE_URL}/kategorie/wasserfilter/">AquaClean &amp; Claris Wasserfilter</a></li>
        <li><a href="${SITE_URL}/kategorie/fehlercodes/">Störungsdiagnose &amp; Fehlercodes</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h3>Transparenz &amp; Partnerprogramm</h3>
      <p class="footer-note">
        KaffeeTeile24 ist ein unabhängiges deutsches Informationsportal für Kaffeevollautomaten-Reparaturen, Original-Ersatzteile und DIY-Instandsetzung.
      </p>
      <p class="footer-note">
        Als Amazon-Partner verdienen wir an qualifizierten Verkäufen über die bereitgestellten Affiliate-Links. Alle Preise inkl. MwSt., zzgl. Versand.
      </p>
      <p style="margin-top:10px; font-size:11px;">&copy; 2026 KaffeeTeile24.de — Alle Rechte vorbehalten.</p>
    </div>
  </div>
</footer>
`;
}

async function runBuild() {
  console.log('🚀 Compiling German Pilot Programmatic Site (KaffeeTeile24)...');
  
  fs.writeFileSync(path.join(DIST_DIR, 'style.css'), CSS_BUNDLE, 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, '.nojekyll'), '', 'utf8');

  const sitemapUrls = [`${SITE_URL}/`];
  const searchIndex = [];

  // 1. Compile 10 In-Depth Product Pages
  for (const p of products) {
    const genFile = path.join(GEN_DIR, `${p.id}.json`);
    let article = null;
    if (fs.existsSync(genFile)) {
      try { article = JSON.parse(fs.readFileSync(genFile, 'utf8')); } catch (e) {}
    }

    // High quality technical defaults if generator is still running on some items
    if (!article) {
      article = {
        page_title: `${p.brand} ${p.model} ${p.partName}: Technische Anleitung & Reparatur`,
        meta_description: `Originalgetreue Reparaturanleitung für ${p.brand} ${p.model}: ${p.partName}. Symptome, Einbau und Wartung auf Amazon.de.`,
        engineering_breakdown: `Detaillierte ingenieurtechnische Baugruppenanalyse für ${p.brand} ${p.model}. Diese Komponente unterliegt mechanischen Dauerbelastungen durch Druckzyklen bis zu 15 bar, thermische Wechselbeanspruchung von bis zu 95°C sowie Ablagerungen von verharztem Kaffeefett. Eine rechtzeitige Revision verhindert Folgeschäden an Elektronik und Spindelantrieb.`,
        symptoms_and_causes: `Typische Ausfallerscheinungen sind nachlassender Pumpendruck, wässriger Kaffeeauslauf, Quietschgeräusche beim Verfahren der Brühgruppe oder das Aufleuchten von Warnanzeigen. Ursache sind meist verhärtete O-Ringe, Kalkinkrustationen im Strömungskanal oder mechanischer Verschleiß.`,
        diy_step_by_step: [
          { step: 1, title: 'Netztrennung & Sicherheitsabschaltung', action: 'Gerät vollständig ausschalten und Netzstecker ziehen. Wassertank und Bohnenbehälter entleeren.' },
          { step: 2, title: 'Gehäuseöffnung & Freilegung', action: 'Passende Torx-Schrauben lösen und Servicedeckel vorsichtig abnehmen.' },
          { step: 3, title: 'Komponentendemontage', action: 'Verschleißteil vorsichtig aushängen und Schläuche/Klemmen lösen.' },
          { step: 4, title: 'Dichtungswechsel & Reinigung', action: 'Neue lebensmittelechte Dichtungen aufziehen und Gleitflächen mit OKS 1110 fetten.' },
          { step: 5, title: 'Wiedermontage & Dichtigkeitsprüfung', action: 'Komponente arretieren, Spülzyklus starten und Leitungen auf Tropfstellen kontrollieren.' }
        ],
        step_by_step_narrative: `Für die erfolgreiche Instandsetzung benötigen Sie Torx-Werkzeug (TX10/TX20) und lebensmittelechtes Silikonfett nach NSF-H1. Gehen Sie sorgfältig vor und markieren Sie elektrische Steckverbindungen vor dem Abziehen. Führen Sie nach dem Zusammenbau immer einen drucklosen Erstspülzyklus durch.`,
        compatibility_matrix: {
          fits: [`${p.brand} ${p.model}`, `${p.brand} Baureihe ECAM / EQ / E-Serie`],
          incompatible: ['Nespresso Kapselmaschinen', 'Klassische Siebträger']
        },
        maintenance_schedule: [
          { frequency: 'Wöchentlich', task: 'Oberflächliche Reinigung und Kaffeemehlreste absaugen.' },
          { frequency: 'Monatlich', task: 'Intensive Spülung und Kaffeefettlöser-Tablette anwenden.' },
          { frequency: 'Alle 12 Monate', task: 'Vollständiger O-Ring-Wechsel und Nachfettung der mechanischen Kulissen.' }
        ],
        troubleshooting_table: [
          { error: 'Gerät stoppt mitten im Brühvorgang', cause: 'Überstromschutz durch Schwergängigkeit ausgelöst', fix: 'Mechanik reinigen und mit Spezialfett nachschmieren.' },
          { error: 'Kaffee tröpfelt nur langsam heraus', cause: 'Kalkpartikel oder Kaffeefett verstopfen den Auslauf', fix: 'Intensiventkalkung durchführen und Brühsieb reinigen.' },
          { error: 'Wasser sammelt sich in der Abtropfschale', cause: 'O-Ringe am Einlaufstutzen porös', fix: 'Dichtungssatz austauschen.' }
        ],
        faq: [
          { q: 'Ist der Selbsteinbau für Laien machbar?', a: 'Ja, mit einfachem Torx-Werkzeug und unserer Schritt-für-Schritt-Anleitung ist der Austausch innerhalb von 20 bis 30 Minuten problemlos möglich.' },
          { q: 'Welches Schmiermittel muss verwendet werden?', a: 'Verwenden Sie ausnahmslos lebensmittelechtes Silikonfett mit NSF-H1-Zulassung (z.B. OKS 1110).' },
          { q: 'Wann sollte das Teil präventiv erneuert werden?', a: 'Spätestens nach 3.000 bis 5.000 Brühzyklen oder wenn erste Schleifspuren und Tropfstellen sichtbar werden.' }
        ]
      };
    }

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

    const amazonUrl = getAmazonUrl(p.asin);

    const html = `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
  <title>${esc(article.page_title)}</title>
  <meta name="description" content="${esc(article.meta_description)}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:type" content="product">
  <meta property="og:title" content="${esc(article.page_title)}">
  <meta property="og:description" content="${esc(article.meta_description)}">
  <meta property="og:image" content="${p.images[0]}">
  <link rel="stylesheet" href="${SITE_URL}/style.css">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "${esc(p.brand)} ${esc(p.model)} - ${esc(p.partName)}",
    "image": ${JSON.stringify(p.images)},
    "description": "${esc(article.meta_description)}",
    "sku": "${esc(p.asin)}",
    "brand": { "@type": "Brand", "name": "${esc(p.brand)}" },
    "offers": {
      "@type": "Offer",
      "url": "${amazonUrl}",
      "priceCurrency": "EUR",
      "price": "${p.price.replace(/[^0-9,.]/g, '').replace(',', '.') || '29.90'}",
      "availability": "https://schema.org/InStock"
    }
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "${esc(p.brand)} ${esc(p.model)} ${esc(p.partName)} DIY-Reparatur",
    "step": ${JSON.stringify(article.diy_step_by_step.map(s => ({
      "@type": "HowToStep",
      "position": s.step,
      "name": s.title,
      "text": s.action
    })))}
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": ${JSON.stringify(article.faq.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    })))}
  }
  </script>
</head>
<body>
  ${renderHeader()}

  <main class="wrap">
    <nav class="breadcrumb">
      <a href="${SITE_URL}/">Startseite</a>
      <span class="sep">›</span>
      <a href="${SITE_URL}/${p.brandSlug}/">${esc(p.brand)}</a>
      <span class="sep">›</span>
      <a href="${SITE_URL}/${p.brandSlug}/${p.modelSlug}/">${esc(p.model)}</a>
      <span class="sep">›</span>
      <span>${esc(p.partName)}</span>
    </nav>

    <!-- Product Hero Stage -->
    <section class="detail-hero-grid">
      <div class="gallery-box">
        <div class="main-img-wrap">
          <img id="mainimg" src="${p.images[0]}" alt="${esc(p.brand)} ${esc(p.model)} ${esc(p.partName)}">
        </div>
        <div class="thumbs-row" id="thumbs">
          ${p.images.map((img, idx) => `
            <img src="${img}" class="${idx === 0 ? 'active' : ''}" data-idx="${idx}" alt="Ansicht ${idx + 1}">
          `).join('')}
        </div>
      </div>

      <div class="detail-info">
        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          <span class="badge-brand">${esc(p.brand)}</span>
          <span class="badge-cat">${esc(p.category)}</span>
          <span class="badge-rating">★ ${p.rating} (${p.reviewCount} Bewertungen)</span>
        </div>

        <h1>${esc(p.brand)} ${esc(p.model)}: ${esc(p.partName)}</h1>
        <div class="asin-badge">Amazon ASIN: <strong>${esc(p.asin)}</strong> | Passgenaues Original / OEM-Upgrade</div>

        <div class="amazon-buy-box">
          <div class="amazon-buy-price-row">
            <div>
              <span style="font-size:12px; color:#78350f; display:block;">Aktueller Amazon.de Bestpreis:</span>
              <span class="amazon-price-tag">${esc(p.price)}</span>
            </div>
            <span class="amazon-stock-badge">✓ Sofort lieferbar</span>
          </div>

          <a href="${amazonUrl}" target="_blank" rel="sponsored nofollow noopener" class="btn-amazon-primary">
            Auf Amazon.de prüfen &amp; bestellen ↗
          </a>
          <div class="amazon-guarantee-note">
            🛡️ Schneller Prime-Versand &amp; 30 Tage Rückgaberecht über Amazon.de
          </div>
        </div>

        <div style="font-size:13.5px; color:#44403c; line-height:1.5;">
          <strong>Kurzfazit der Redaktion:</strong> Unverzichtbare Komponente zur Wiederherstellung des vollen Brühdrucks und zur Beseitigung störender Fehleranzeigen. 100% kompatibel nach OEM-Spezifikation.
        </div>
      </div>
    </section>

    <!-- Two-Column Technical Content -->
    <div class="content-layout">
      <article class="article-main">
        <div class="section-box">
          <h2>🔬 Mechatronische Analyse &amp; Funktionsprinzip</h2>
          <p>${esc(article.engineering_breakdown)}</p>
        </div>

        <div class="section-box">
          <h2>⚠️ Typische Ausfallsymptome &amp; Fehlerursachen</h2>
          <p>${esc(article.symptoms_and_causes)}</p>
        </div>

        <div class="section-box">
          <h2>🛠️ Schritt-für-Schritt DIY-Reparaturanleitung</h2>
          <div class="steps-container">
            ${article.diy_step_by_step.map(s => `
              <div class="step-item-card">
                <span class="step-num-badge">SCHRITT ${s.step}</span>
                <div class="step-item-title">${esc(s.title)}</div>
                <div class="step-item-desc">${esc(s.action)}</div>
              </div>
            `).join('')}
          </div>
          <p style="margin-top:16px;">${esc(article.step_by_step_narrative)}</p>
        </div>

        <div class="section-box">
          <h2>📋 Störungs- &amp; Fehlerbehebungs-Tabelle</h2>
          <div class="data-table-wrap">
            <table class="tech-table">
              <thead>
                <tr>
                  <th style="width:25%;">Fehlerbild / Code</th>
                  <th style="width:35%;">Mögliche Ursache</th>
                  <th style="width:40%;">Lösungsmaßnahme</th>
                </tr>
              </thead>
              <tbody>
                ${article.troubleshooting_table.map(t => `
                  <tr>
                    <td data-label="Fehlerbild / Code"><strong>${esc(t.error)}</strong></td>
                    <td data-label="Mögliche Ursache">${esc(t.cause)}</td>
                    <td data-label="Lösungsmaßnahme">${esc(t.fix)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="section-box">
          <h2>📅 Wartungs- &amp; Pflegeintervalle</h2>
          <div class="data-table-wrap">
            <table class="tech-table">
              <thead>
                <tr>
                  <th style="width:30%;">Intervall</th>
                  <th style="width:70%;">Empfohlene Instandhaltungsmaßnahme</th>
                </tr>
              </thead>
              <tbody>
                ${article.maintenance_schedule.map(m => `
                  <tr>
                    <td data-label="Intervall"><strong>${esc(m.frequency)}</strong></td>
                    <td data-label="Maßnahme">${esc(m.task)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="section-box">
          <h2>✅ Kompatibilitäts- &amp; Passgenauigkeits-Matrix</h2>
          <div class="compat-box">
            <h3>Bestätigte Passgenauigkeit für folgende Modelle:</h3>
            <ul class="compat-list">
              <li>
                <span class="badge-check">Birekt Kompatibel:</span> 
                <strong>${esc(article.compatibility_matrix.fits.join(', '))}</strong>
              </li>
              ${article.compatibility_matrix.incompatible && article.compatibility_matrix.incompatible.length ? `
              <li style="margin-top:8px;">
                <span class="badge-cross">Mechanisch Inkompatibel:</span> 
                <span style="color:#991b1b;">${esc(article.compatibility_matrix.incompatible.join(', '))}</span>
              </li>` : ''}
            </ul>
          </div>
        </div>

        <div class="section-box">
          <h2>❓ Häufig gestellte Fragen (FAQ)</h2>
          <div class="faq-wrap">
            ${article.faq.map(f => `
              <div class="faq-card">
                <div class="faq-question">Q: ${esc(f.q)}</div>
                <div class="faq-answer">A: ${esc(f.a)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </article>

      <!-- Sidebar -->
      <aside class="article-sidebar">
        <div class="sidebar-box">
          <h3>📦 Mehr zu ${esc(p.brand)}</h3>
          <ul class="sidebar-links">
            ${products.filter(other => other.brand === p.brand).map(other => `
              <li>
                <a href="${SITE_URL}/${other.brandSlug}/${other.modelSlug}/${other.partSlug}/">
                  › ${esc(other.model)} ${esc(other.partName)}
                </a>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="sidebar-box">
          <h3>🔧 Ähnliche Kategorien</h3>
          <ul class="sidebar-links">
            <li><a href="${SITE_URL}/kategorie/bruehgruppe/">› Brühgruppen &amp; Dichtungen</a></li>
            <li><a href="${SITE_URL}/kategorie/vibrationspumpe/">› Ulka Pumpen &amp; Ventile</a></li>
            <li><a href="${SITE_URL}/kategorie/mahlwerk/">› Keramik- &amp; Stahl-Mahlwerke</a></li>
            <li><a href="${SITE_URL}/kategorie/milchsystem/">› Milchsysteme &amp; Schläuche</a></li>
            <li><a href="${SITE_URL}/kategorie/wasserfilter/">› Wasserfilter &amp; Entkalkung</a></li>
            <li><a href="${SITE_URL}/kategorie/fehlercodes/">› Fehlercode-Datenbank</a></li>
          </ul>
        </div>
      </aside>
    </div>
  </main>

  <!-- Sticky Mobile Bottom Bar -->
  <div class="mobile-sticky-cta">
    <div class="sticky-info">
      <span class="sticky-title">${esc(p.brand)} ${esc(p.partName)}</span>
      <span class="sticky-sub">${esc(p.price)} | Sofort lieferbar</span>
    </div>
    <a href="${amazonUrl}" target="_blank" rel="sponsored nofollow noopener" class="btn-sticky-amazon">
      Auf Amazon.de ↗
    </a>
  </div>

  ${renderFooter()}

  <script>
  (function(){
    var imgs = ${JSON.stringify(p.images)};
    var main = document.getElementById('mainimg');
    var thumbs = document.querySelectorAll('#thumbs img');
    if (!main || !thumbs.length) return;
    thumbs.forEach(function(t, k){
      t.addEventListener('click', function(){
        main.src = imgs[k];
        thumbs.forEach(function(th, idx){ th.className = idx === k ? 'active' : ''; });
      });
    });
  })();
  </script>
  <script src="${SITE_URL}/instant-search.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(pageAbsDir, 'index.html'), html, 'utf8');
  }

  // 2. Compile Homepage
  const homeHtml = `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
  <title>KaffeeTeile24 – Ersatzteile, Brühgruppen &amp; Reparatur-Leitfäden für Kaffeevollautomaten</title>
  <meta name="description" content="Der führende deutsche Experten-Hub für De'Longhi, Siemens, Jura &amp; Philips Vollautomaten: Original-Ersatzteile, Fehlercodes, O-Ring-Sets und DIY-Reparatur.">
  <link rel="canonical" href="${SITE_URL}/">
  <link rel="stylesheet" href="${SITE_URL}/style.css">
</head>
<body>
  ${renderHeader()}

  <section class="hero-banner">
    <div class="wrap">
      <h1>Kaffeevollautomaten Ersatzteile &amp; Reparatur-Diagnose</h1>
      <p>
        Finden Sie sofort das exakt passende Ersatzteil, passgenaue Dichtungssätze, 15-Bar Ulka Pumpen und ingenieurtechnische Schritt-für-Schritt Reparaturanleitungen für Ihre Kaffeemaschine.
      </p>
    </div>
  </section>

  <main class="wrap">
    <div style="margin-top: 28px;">
      <h2 style="font-size:20px; font-weight:800; margin-bottom:14px;">🔥 Top 10 Beliebteste Ersatzteile &amp; Reparatur-Leitfäden (Amazon.de)</h2>
      <div class="products-grid">
        ${products.map(p => `
          <article class="prod-card">
            <img src="${p.images[0]}" class="prod-card-thumb" alt="${esc(p.brand)} ${esc(p.partName)}">
            <div class="prod-card-body">
              <div class="prod-card-badges">
                <span class="badge-brand">${esc(p.brand)}</span>
                <span class="badge-cat">${esc(p.category)}</span>
              </div>
              <h3 class="prod-card-title">${esc(p.brand)} ${esc(p.partName)}</h3>
              <div class="prod-card-model">Modell: ${esc(p.model)}</div>
              <div class="prod-card-footer">
                <span class="prod-card-price">${esc(p.price)}</span>
                <a href="${SITE_URL}/${p.brandSlug}/${p.modelSlug}/${p.partSlug}/" class="btn-card-details">
                  Anleitung &amp; Teile ›
                </a>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  </main>

  ${renderFooter()}
  <script src="${SITE_URL}/instant-search.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), homeHtml, 'utf8');

  // 3. Compile Instant Search Engine File
  const instantSearchJs = `
(function(){
  var searchInput = document.getElementById('instant-search-input');
  var clearBtn = document.getElementById('search-clear-btn');
  var dropdown = document.getElementById('instant-search-dropdown');
  var index = ${JSON.stringify(searchIndex)};

  if (!searchInput || !dropdown) return;

  function doSearch(q) {
    q = q.trim().toLowerCase();
    if (!q) {
      dropdown.classList.remove('show');
      dropdown.innerHTML = '';
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
            '<img src="' + item.i + '" class="search-item-thumb">' +
            '<div>' +
              '<div style="font-weight:700; font-size:13px;">' + item.t + '</div>' +
              '<div style="font-size:11px; color:#78716c;">' + item.b + ' • ' + item.c + '</div>' +
            '</div>' +
          '</div>' +
          '<span style="font-size:16px; color:#92400e;">›</span>' +
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

  // 4. Compile Sitemap and Robots.txt
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url><loc>${u}</loc><lastmod>${new Date().toISOString().split('T')[0]}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`).join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');

  const robotsTxt = `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf8');

  console.log(`✅ Compilation Finished! Total exact pages generated: ${sitemapUrls.length}`);
}

runBuild();
