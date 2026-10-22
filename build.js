// build.js - Master Programmatic SEO Generator for Robot Vacuum Niche
// Upgraded with Mobile-First UX, Segmented Mobile Columns, Sticky Bottom CTA & Exact Count

const fs = require('fs');
const path = require('path');
const contentEngine = require('./lib/content-engine');
const diagnosticData = require('./lib/diagnostic-data');

const DIST_DIR = path.join(__dirname, 'dist');
const SITE_URL = (process.env.SITE_URL || 'https://roboparca.github.io').replace(/\/+$/, '');
// Clean dist completely to prevent stale files and ensure 100% exact count
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });

// Load real scraped Amazon TR ASINs and High-Res Images
const rawAmazonData = JSON.parse(fs.readFileSync(path.join(__dirname, 'amazon-asins.json'), 'utf8'));

// Helper: Smart matching to assign genuine ASIN and multi-images per model and part
function getAmazonProduct(model, part) {
  let matchedGroup = null;

  const brandL = model.brand.toLowerCase();
  const partL = part.slug;
  const famL = (model.family || '').toLowerCase();

  if (partL.includes('solusyon')) {
    matchedGroup = rawAmazonData['robot supurge temizlik solusyonu'];
  } else if (brandL === 'dyson') {
    if (model.name.includes('V15')) matchedGroup = rawAmazonData['dyson v15 filtre hepa'];
    else if (model.name.includes('V11')) matchedGroup = rawAmazonData['dyson v11 filtre'];
    else matchedGroup = rawAmazonData['dyson v8 filtre'];
  } else if (brandL === 'ecovacs') {
    if (partL.includes('mop')) matchedGroup = rawAmazonData['ecovacs deebot t20 omni mop'];
    else matchedGroup = rawAmazonData['ecovacs deebot n8 hepa filtre'];
  } else if (brandL === 'tefal') {
    matchedGroup = rawAmazonData['tefal explorer filtre'];
  } else if (brandL === 'philips') {
    matchedGroup = rawAmazonData['philips homerun aqua filtre'];
  } else if (brandL === 'dreame') {
    if (partL.includes('filtre')) matchedGroup = rawAmazonData['dreame l10s ultra hepa filtre'];
    else if (partL.includes('mop')) matchedGroup = rawAmazonData['dreame l20 ultra mop bezi'];
    else if (partL.includes('torba')) matchedGroup = rawAmazonData['dreame bot z10 pro toz torbasi'];
    else matchedGroup = rawAmazonData['dreame l10s ultra hepa filtre'];
  } else if (brandL === 'xiaomi') {
    if (partL.includes('filtre')) matchedGroup = rawAmazonData['xiaomi mop 1c hepa filtre'];
    else if (partL.includes('firca') && !partL.includes('yan')) matchedGroup = rawAmazonData['xiaomi mop 2 pro ana firca'];
    else if (partL.includes('mop')) matchedGroup = rawAmazonData['xiaomi mop bezi paspas'];
    else matchedGroup = rawAmazonData['xiaomi mop 1c hepa filtre'];
  } else {
    // Roborock default
    if (partL.includes('filtre')) {
      if (famL.includes('s8')) matchedGroup = rawAmazonData['roborock s8 hepa filtre'];
      else matchedGroup = rawAmazonData['roborock s7 hepa filtre'];
    } else if (partL.includes('firca') && !partL.includes('yan')) {
      if (famL.includes('s8')) matchedGroup = rawAmazonData['roborock s8 duoroller ana firca'];
      else matchedGroup = rawAmazonData['roborock s7 silikon ana firca'];
    } else if (partL.includes('yan-firca')) {
      matchedGroup = rawAmazonData['roborock yan firca 5 kollu'];
    } else if (partL.includes('mop')) {
      if (famL.includes('qrevo')) matchedGroup = rawAmazonData['roborock q revo paspas mop'];
      else matchedGroup = rawAmazonData['xiaomi mop bezi paspas'];
    } else if (partL.includes('torba')) {
      matchedGroup = rawAmazonData['roborock toz torbasi'];
    } else {
      matchedGroup = rawAmazonData['roborock s7 hepa filtre'];
    }
  }

  if (!matchedGroup || !matchedGroup.length) {
    matchedGroup = rawAmazonData['roborock s7 hepa filtre'];
  }

  const primary = matchedGroup[0];
  const allImages = matchedGroup.map(item => item.img).filter(Boolean);
  if (allImages.length < 2 && matchedGroup.length > 1) {
    allImages.push(matchedGroup[1].img);
  }

  const asin = primary.asin;
  const directUrl = `https://www.amazon.com.tr/dp/${asin}?tag=roboparca-21`;

  return {
    asin: asin,
    images: allImages,
    directUrl: directUrl
  };
}

// Master Brands Database
const BRANDS = [
  { name: 'Roborock', slug: 'roborock', country: 'Çin/Global', desc: 'LDS navigasyon ve VibraRise sonic paspas teknolojisiyle Türkiye pazarının en popüler premium robot süpürge markası.' },
  { name: 'Xiaomi', slug: 'xiaomi', country: 'Çin/Global', desc: 'Fiyat/performans lideri, Mi Home ekosistemiyle entegre çalışan Türkiye genelinde en yüksek kurulu tabana sahip akıllı süpürge serisi.' },
  { name: 'Dreame', slug: 'dreame', country: 'Çin/Global', desc: 'Yüksek emiş gücü (Vormax), sıcak suyla mop yıkama ve yapay zeka engelden kaçma özellikleriyle öne çıkan yeni nesil temizlik robotları.' },
  { name: 'Ecovacs', slug: 'ecovacs', country: 'Çin/Global', desc: 'Deebot serisi, AIVI yapay zeka kameraları ve hepsi bir arada OMNI istasyonlarıyla donatılmış akıllı zemin temizleme robotları.' },
  { name: 'Dyson', slug: 'dyson', country: 'İngiltere/Global', desc: '360 Vis Nav robotu ve V8-V15 kablosuz dikey süpürgeleriyle siklonik emiş gücünde dünya standartlarını belirleyen inovasyon markası.' },
  { name: 'Philips', slug: 'philips', country: 'Hollanda/Global', desc: 'Homerun Aqua ve SpeedPro Max serileriyle ıslak kuru süpürmede güvenilir Avrupa mühendisliği ve geniş servis ağı.' },
  { name: 'Tefal', slug: 'tefal', country: 'Fransa/Global', desc: 'X-Plorer serisiyle kompakt tasarım, evcil hayvan dostu fırçalar ve alerjen filtreleme teknolojisi sunan Fransız ev aletleri devi.' },
  { name: 'Roidmi', slug: 'roidmi', country: 'Çin/Global', desc: 'Eve Plus ve Eva serileriyle kendi kendini sterilize eden otomatik çöp boşaltma istasyonlu ekonomik robot süpürgeler.' },
  { name: 'Viomi', slug: 'viomi', country: 'Çin/Global', desc: 'V ve Alpha serisiyle akıllı su kontrolü ve Y şeklinde çift yönlü silme haritalaması sunan fiyat/performans ürünleri.' },
  { name: 'Anker Eufy', slug: 'anker-eufy', country: 'ABD/Çin', desc: 'RoboVac ve X serisiyle sessiz çalışma (BoostIQ), ince gövde ve çift türbinli Twin-Turbine derin temizlik performansı.' }
];

// Load full 100 models from data/models.json
const MODELS = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'models.json'), 'utf8'));

// The 12 Intent / Part Silo Categories
const PART_CATEGORIES = [
  { slug: 'hepa-filtre', name: 'HEPA Filtre & Filtre Bakımı', shortName: 'HEPA Filtre', icon: '💨', interval: '3 - 6 Ay', urgency: 'Tıkanmış filtre motorun aşırı ısınmasına ve emiş gücünün %40 düşmesine neden olur.' },
  { slug: 'ana-firca', name: 'Kauçuk / Kıllı Rulo Ana Fırça', shortName: 'Ana Fırça', icon: '🔄', interval: '6 - 12 Ay', urgency: 'Rulman arasına dolanan saçlar fırça motor dişlisini sıyırabilir ve Fırça Sıkıştı hatası verir.' },
  { slug: 'yan-firca', name: '3 Kollu / Silikon Yan Fırça', shortName: 'Yan Fırça', icon: '✨', interval: '3 - 6 Ay', urgency: 'Kolları kırılmış yan fırça süpürgenin süpürgelik kenarlarındaki ve köşelerdeki tozu ana fırçaya iletememesine yol açar.' },
  { slug: 'mop-bezi', name: 'Mikrofiber & Titreşimli Mop Paspas Bezi', shortName: 'Mop Bezi', icon: '💧', interval: '2 - 4 Ay', urgency: 'Aşınmış ve lifleri ezilmiş mop bezi zemin üzerinde su lekesi ve dalgalanma bırakır.' },
  { slug: 'toz-torbasi', name: 'Otomatik Boşaltma İstasyonu Toz Torbası', shortName: 'Toz Torbası', icon: '🗑️', interval: '1 - 2 Ay', urgency: 'Dolan torba istasyonun emiş kanalında tıkanmaya ve motorun arızalanmasına neden olur.' },
  { slug: 'batarya-pil', name: 'Orijinal Kapasite Batarya & Pil Değişimi', shortName: 'Batarya & Pil', icon: '🔋', interval: '2 - 3 Yıl', urgency: 'Ömrü tükenen batarya süpürgenin evi bitiremeden yarı yolda kapanmasına ve şarj yuvasını bulamamasına yol açar.' },
  { slug: 'su-haznesi-filtresi', name: 'Su Tankı, Damlatma Fitilleri & Pompa', shortName: 'Su Haznesi & Filtre', icon: '🚰', interval: '6 - 12 Ay', urgency: 'Kireçlenen su kanalları mop bezinin kuru kalmasına ve süpürgenin zemini silememesine neden olur.' },
  { slug: 'tekerlek-bakimi', name: 'Ön Döner Tekerlek & Yan Çekiş Lastiği', shortName: 'Tekerlek Bakımı', icon: '⚙️', interval: '12 - 18 Ay', urgency: 'Mili saçla dolan ön tekerlek dönmeyip parkeyi çizer; aşınan çekiş lastiği ise süpürgenin halıya çıkarken patinaj yapmasına sebep olur.' },
  { slug: 'temizlik-solusyonu', name: 'Köpürmeyen Robot Süpürge Deterjanı', shortName: 'Temizlik Solüsyonu', icon: '🧪', interval: 'Düzenli Tüketim', urgency: 'Normal çamaşır suyu veya standart yüzey temizleyiciler su pompasını aşındırıp contaları eriterek garantiyi bozar.' },
  { slug: 'sensor-bakimi', name: 'LDS Lidar, Düşme Sensörü & Şarj Kontakları', shortName: 'Sensör Bakımı', icon: '👁️', interval: 'Haftalık Temizlik', urgency: 'Tozlanan şarj kontakları cihazın şarj olmamasına; kirli düşme sensörleri ise robotun merdivenden düşmesine neden olur.' },
  { slug: 'reset-ve-wifi', name: 'Fabrika Ayarlarına Sıfırlama & Wi-Fi Kurulumu', shortName: 'Reset & Wi-Fi', icon: '📶', interval: 'Gerektikçe', urgency: 'Cihaz Ağa Bağlanamıyor veya haritayı ters çevirip kayboluyorsa fabrika ayarlarına sıfırlama tek kalıcı çözümdür.' },
  { slug: 'hata-kodlari', name: 'En Sık Görülen Hatalar, Sesli Uyarılar & Çözüm', shortName: 'Hata Kodları', icon: '⚠️', interval: 'Arıza Anında', urgency: 'Hata kodunun doğru tespiti gereksiz yere yüksek servis ve anakart değişim ücreti ödemenizi engeller.' }
];

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Global Sleek Header
function renderHeader() {
  return `
<header class="app-header">
  <div class="header-inner">
    <a href="/" class="brand-logo">
      <span class="logo-icon">🤖</span>
      <span class="brand-title">RoboParça<span class="tld">.com</span></span>
      <span class="badge-instant">Ultra Hızlı</span>
    </a>

    <div class="header-search-wrap">
      <div class="header-search-box">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          id="instant-search-input" 
          placeholder="Model veya parça ara... (Örn: Q7 Max hepa, V8 batarya, S8 rulo)" 
          autocomplete="off" 
          spellcheck="false"
        />
        <button id="search-clear-btn" class="clear-btn" aria-label="Temizle" style="display:none">✕</button>
      </div>
      <div id="instant-search-dropdown" class="search-dropdown-menu"></div>
    </div>

    <nav class="header-nav">
      <a href="/marka/roborock/">Roborock</a>
      <a href="/marka/xiaomi/">Xiaomi</a>
      <a href="/marka/dreame/">Dreame</a>
      <a href="/marka/dyson/">Dyson</a>
      <a href="/marka/ecovacs/">Ecovacs</a>
      <a href="/kategori/hepa-filtre/" class="nav-highlight">Kategoriler</a>
    </nav>
  </div>
</header>
  `;
}

// Global Footer
function renderFooter() {
  return `
<footer class="app-footer">
  <div class="wrap footer-grid">
    <div class="footer-col">
      <h3>🤖 Popüler Markalar</h3>
      <ul>
        ${BRANDS.map(b => `<li><a href="/marka/${b.slug}/">${b.name} Yedek Parçaları</a></li>`).join('')}
      </ul>
    </div>
    <div class="footer-col">
      <h3>⚙️ Parça &amp; Sarf Malzemeleri</h3>
      <ul>
        ${PART_CATEGORIES.slice(0, 6).map(c => `<li><a href="/kategori/${c.slug}/">${c.name}</a></li>`).join('')}
      </ul>
    </div>
    <div class="footer-col">
      <h3>🛠️ Rehber &amp; Sorun Giderme</h3>
      <ul>
        ${PART_CATEGORIES.slice(6).map(c => `<li><a href="/kategori/${c.slug}/">${c.name}</a></li>`).join('')}
      </ul>
    </div>
    <div class="footer-col">
      <h3>Hakkımızda &amp; Güvenilirlik</h3>
      <p class="footer-disclaimer">
        RoboParça.com, Türkiye'deki akıllı robot süpürge sahiplerinin orijinal ve %100 uyumlu yedek parça, filtre ve sarf malzemelerini en uygun fiyatla bulmasını sağlayan bağımsız ürün ve uyumluluk rehberidir.
      </p>
      <p class="footer-amazon-notice">
        Amazon Gelir Ortaklığı Programı katılımcısıyız. Sitemizdeki ürün linkleri sizi doğrudan <strong>Amazon.com.tr</strong> üzerindeki orijinal ürün listesine yönlendirir. Fiyatlar ve stok durumu anlık olarak Amazon Türkiye üzerinde doğrulanır.
      </p>
      <p class="copy">&copy; 2026 RoboParça.com — Tüm hakları saklıdır.</p>
    </div>
  </div>
</footer>
  `;
}

// Mobile-First CSS Stylesheet
const CSS_BUNDLE = `
:root {
  --primary: #0284c7;
  --primary-dark: #0369a1;
  --amazon-orange: #f59e0b;
  --amazon-hover: #d97706;
  --bg-app: #f8fafc;
  --bg-card: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --border-color: #e2e8f0;
  --radius-card: 12px;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
html { touch-action: manipulation; }
body {
  font-family: var(--font-sans);
  background-color: var(--bg-app);
  color: var(--text-main);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  padding-bottom: 70px; /* Room for mobile sticky bar */
}

a { color: var(--primary); text-decoration: none; }
a:hover { text-decoration: underline; }
.wrap { max-width: 1240px; margin: 0 auto; padding: 0 16px; }

/* Sticky Header */
.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  padding: 8px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.header-inner {
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 800;
  font-size: 18px;
  color: var(--text-main);
  text-decoration: none !important;
  white-space: nowrap;
  flex-shrink: 0;
}
.brand-logo .logo-icon { font-size: 20px; }
.brand-logo .tld { color: var(--primary); }
.badge-instant {
  background: #e0f2fe;
  color: #0369a1;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 9999px;
  margin-left: 2px;
}

/* Central Search Wrap & Floating Dropdown */
.header-search-wrap {
  position: relative;
  flex: 1;
  max-width: 520px;
}
.header-search-box {
  position: relative;
  display: flex;
  align-items: center;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  transition: all 0.15s ease;
}
.header-search-box:focus-within {
  background: #ffffff;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
}
.search-icon {
  position: absolute;
  left: 12px;
  font-size: 15px;
  color: #64748b;
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
  background: #cbd5e1;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #334155;
}

/* Floating Instant Search Dropdown */
.search-dropdown-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  max-height: 400px;
  overflow-y: auto;
  z-index: 2000;
  display: none;
  padding: 6px;
}
.search-dropdown-menu.show {
  display: block;
}
.search-dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 6px;
  text-decoration: none !important;
  color: var(--text-main);
  transition: background 0.1s ease;
  margin-bottom: 2px;
}
.search-dropdown-item:hover, .search-dropdown-item:focus {
  background: #f1f5f9;
}
.search-item-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
}
.search-item-thumb {
  width: 36px;
  height: 36px;
  object-fit: contain;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 2px;
  flex-shrink: 0;
}
.search-item-texts {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.search-item-title {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.search-item-sub {
  font-size: 11px;
  color: var(--text-muted);
}
.search-item-arrow {
  color: #94a3b8;
  font-size: 14px;
  margin-left: 8px;
  flex-shrink: 0;
}

/* Quick Nav Links */
.header-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  flex-shrink: 0;
}
.header-nav a {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  text-decoration: none;
  padding: 5px 9px;
  border-radius: 6px;
  transition: all 0.12s ease;
}
.header-nav a:hover {
  background: #f1f5f9;
  color: var(--text-main);
}
.header-nav .nav-highlight {
  background: #e0f2fe;
  color: #0369a1;
}

.quick-tags {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 12px 0 6px;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 2px;
  -webkit-overflow-scrolling: touch;
}
.quick-tags::-webkit-scrollbar { display: none; }
.tag-label { font-size: 11px; font-weight: 600; color: var(--text-muted); }
.pill-btn {
  background: #ffffff;
  border: 1px solid var(--border-color);
  padding: 5px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-main);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.1s ease;
}
.pill-btn:hover { background: #f1f5f9; }
.pill-btn.active { background: var(--text-main); color: #ffffff; border-color: var(--text-main); }

/* Mobile Segmented Tab Switcher (Visible ONLY on Mobile) */
.mobile-tabs-bar {
  display: none;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  background: #e2e8f0;
  padding: 4px;
  border-radius: 10px;
  margin: 12px 0 16px;
}
.mobile-tab-btn {
  background: transparent;
  border: none;
  padding: 8px 4px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  text-align: center;
  transition: all 0.15s ease;
}
.mobile-tab-btn.active {
  background: #ffffff;
  color: var(--text-main);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* 3-Column Results Layout */
.results-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px 0 60px;
}

.column-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
}
.col-header {
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.col-title { font-size: 14px; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 8px; }
.col-count { font-size: 11px; font-weight: 600; background: #e2e8f0; color: #475569; padding: 2px 7px; border-radius: 9999px; }
.items-list {
  max-height: calc(100vh - 280px);
  min-height: 480px;
  overflow-y: auto;
  padding: 6px;
  -webkit-overflow-scrolling: touch;
}

.item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 4px;
  border: 1px solid transparent;
  transition: all 0.12s ease;
  text-decoration: none !important;
  color: var(--text-main);
}
.item-row:hover, .item-row:active { background: #f1f5f9; border-color: #e2e8f0; }
.item-thumb-sm {
  width: 48px;
  height: 48px;
  object-fit: contain;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 2px;
  margin-right: 10px;
  flex-shrink: 0;
}
.item-info { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; padding-right: 8px; }
.item-name { font-weight: 600; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.item-sub { font-size: 11px; color: var(--text-muted); }
.item-badge { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 4px; background: #e0f2fe; color: #0369a1; white-space: nowrap; }
.btn-amazon-pill {
  background: var(--amazon-orange);
  color: #111827;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 6px;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  flex-shrink: 0;
}

/* Product Hero Grid (Mobile & Desktop) */
.crumbs { padding: 12px 0 6px; font-size: 12px; color: var(--text-muted); }
.crumbs ol { list-style: none; display: flex; flex-wrap: wrap; gap: 4px; }
.crumbs li+li:before { content: "›"; margin-right: 4px; color: #94a3b8; }

.product-hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-card);
  padding: 28px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 24px;
}

.gallery-container { display: flex; flex-direction: column; gap: 12px; }
.main-stage {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  max-height: 420px;
  background: #f8fafc;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-card);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.main-stage img { max-width: 90%; max-height: 90%; object-fit: contain; }

.thumbnail-strip { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; -webkit-overflow-scrolling: touch; }
.thumbnail-strip::-webkit-scrollbar { display: none; }
.thumbnail-strip img {
  width: 64px;
  height: 64px;
  object-fit: contain;
  background: #ffffff;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 3px;
  cursor: pointer;
  flex-shrink: 0;
}
.thumbnail-strip img.on { border-color: var(--amazon-orange); box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.25); }

.product-info h1 { font-size: 24px; font-weight: 800; color: var(--text-main); line-height: 1.3; margin-bottom: 10px; }
.product-lead { font-size: 14px; color: #475569; line-height: 1.5; margin-bottom: 16px; }
.asin-badge { display: inline-flex; align-items: center; gap: 6px; background: #f1f5f9; border: 1px solid #cbd5e1; color: #334155; font-family: monospace; font-size: 12px; font-weight: 700; padding: 3px 8px; border-radius: 6px; margin-bottom: 14px; }

.amazon-direct-box {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 2px solid #fde68a;
  border-radius: var(--radius-card);
  padding: 18px;
  margin: 14px 0 20px;
}
.amazon-direct-box .price-note { font-size: 12px; color: #92400e; margin-bottom: 12px; line-height: 1.4; }
.btn-amazon-direct {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: #f59e0b;
  color: #111827;
  font-weight: 800;
  font-size: 15px;
  padding: 14px 20px;
  border-radius: 8px;
  box-shadow: var(--shadow-md);
  text-decoration: none !important;
  transition: all 0.15s ease;
}
.btn-amazon-direct:hover, .btn-amazon-direct:active { background: #d97706; }

/* Sticky Mobile Bottom CTA Bar */
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
.sticky-asin { font-size: 11px; color: var(--text-muted); font-family: monospace; }
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
  box-shadow: var(--shadow-sm);
}

/* Detail Section Layout */
.detail-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; padding-bottom: 40px; }
.main-content { background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-card); padding: 24px; box-shadow: var(--shadow-sm); }
.sidebar-content { display: flex; flex-direction: column; gap: 16px; }

.prose h2 { font-size: 18px; font-weight: 700; margin: 20px 0 8px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; }
.prose p { margin-bottom: 12px; font-size: 14px; color: #334155; }

.truth-table-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: var(--radius-card); padding: 16px; margin: 16px 0; }
.truth-table-box h3 { font-size: 15px; font-weight: 800; margin-bottom: 8px; }
.badge-check { background: #dcfce7; color: #15803d; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px; display: inline-flex; align-items: center; }
.badge-cross { background: #fee2e2; color: #b91c1c; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px; display: inline-flex; align-items: center; }
.truth-list { list-style: none; margin: 8px 0; font-size: 13px; display: flex; flex-direction: column; gap: 6px; }

.hardware-callout { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 14px; border-radius: 6px; margin: 14px 0; font-size: 13px; color: #1e40af; line-height: 1.5; }

.spec-table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 13px; }
.spec-table th, .spec-table td { padding: 8px 10px; border-bottom: 1px solid var(--border-color); }
.spec-table th { width: 35%; text-align: left; background: #f8fafc; font-weight: 600; color: var(--text-muted); }
.spec-table td { font-weight: 500; }

.faq-box { margin-top: 20px; }
.faq-item { background: #f8fafc; border: 1px solid var(--border-color); border-radius: 8px; padding: 12px 14px; margin-bottom: 8px; }
.faq-q { font-weight: 700; color: var(--text-main); margin-bottom: 4px; font-size: 14px; }
.faq-a { font-size: 13px; color: #475569; margin: 0; }

.silo-card { background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-card); padding: 16px; box-shadow: var(--shadow-sm); }
.silo-card h3 { font-size: 15px; font-weight: 700; margin-bottom: 10px; }
.silo-links { list-style: none; display: flex; flex-direction: column; gap: 6px; }
.silo-links a { display: flex; align-items: center; justify-content: space-between; font-size: 12px; font-weight: 500; color: var(--text-main); padding: 6px 8px; border-radius: 6px; }
.silo-links a:hover, .silo-links a:active { background: #f1f5f9; text-decoration: none; color: var(--primary); }

/* Step-by-Step Grid */
.steps-section { margin: 24px 0; }
.step-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 12px; }
.step-card { background: #f8fafc; border: 1px solid var(--border-color); border-radius: 8px; padding: 14px; position: relative; }
.step-badge { display: inline-block; background: #0284c7; color: #fff; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px; margin-bottom: 8px; text-transform: uppercase; }
.step-title { font-size: 14px; font-weight: 700; color: var(--text-main); margin-bottom: 6px; }
.step-desc { font-size: 12px; color: #475569; line-height: 1.5; margin: 0; }

/* Maintenance Table */
.maint-section { margin: 24px 0; }
.maint-table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 10px; background: #fff; border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; }
.maint-table th, .maint-table td { padding: 10px 14px; border-bottom: 1px solid var(--border-color); text-align: left; }
.maint-table th { background: #f1f5f9; font-weight: 700; color: var(--text-main); }
.maint-table td strong { color: #0f766e; }

/* Warning Callout */
.callout-warning { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 14px; border-radius: 6px; font-size: 13px; color: #92400e; margin: 12px 0; line-height: 1.5; }
.troubleshoot-box { margin: 24px 0; }
.tech-deep-dive { margin: 20px 0; }
.tech-deep-dive h3 { font-size: 16px; font-weight: 700; margin: 16px 0 8px; color: var(--text-main); }
.tech-deep-dive p { font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 12px; }

/* Diagnostic Table */
.diagnostic-box { margin: 24px 0; }
.diagnostic-table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 14px; background: #fff; border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; box-shadow: var(--shadow-sm); }
.diagnostic-table th, .diagnostic-table td { padding: 12px 14px; border-bottom: 1px solid var(--border-color); text-align: left; vertical-align: top; }
.diagnostic-table th { background: #f8fafc; font-weight: 700; color: var(--text-main); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
.code-badge { display: inline-block; background: #fee2e2; color: #991b1b; font-weight: 700; font-size: 12px; padding: 4px 8px; border-radius: 6px; font-family: monospace; }
.part-fix-link { display: inline-flex; align-items: center; gap: 4px; background: #fef3c7; color: #92400e; font-weight: 700; font-size: 11px; padding: 4px 8px; border-radius: 6px; text-decoration: none !important; border: 1px solid #fde68a; }
.part-fix-link:hover { background: #fde68a; }

/* Footer */
.app-footer { background: #0f172a; color: #94a3b8; padding: 36px 0 20px; margin-top: 32px; font-size: 13px; }
.footer-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 24px; }
.footer-col h3 { color: #f8fafc; font-size: 14px; font-weight: 700; margin-bottom: 10px; }
.footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 6px; }
.footer-col ul a { color: #94a3b8; font-size: 12px; }
.footer-col ul a:hover { color: #ffffff; }
.footer-disclaimer { font-size: 11px; line-height: 1.5; margin-bottom: 10px; }
.footer-amazon-notice { font-size: 11px; line-height: 1.4; color: #64748b; margin-bottom: 10px; }
.copy { font-size: 11px; color: #475569; }

/* ==========================================================================
   MOBILE MEDIA QUERY (Screens <= 768px)
   ========================================================================== */
@media (max-width: 768px) {
  .wrap { padding: 0 12px; }
  .app-header { padding: 8px 12px; }
  .brand-logo { font-size: 16px; }
  .brand-logo .logo-icon { font-size: 19px; }
  .header-nav { display: none; }
  .header-search-wrap { max-width: 100%; order: 3; width: 100%; margin-top: 4px; }
  .header-inner { flex-wrap: wrap; gap: 6px; }
  #instant-search-input { padding: 8px 34px 8px 32px !important; font-size: 14px !important; }
  .search-icon { left: 10px; font-size: 14px; }
  .clear-btn { right: 8px; }
  
  /* Show Mobile Segmented Tabs */
  .mobile-tabs-bar { display: grid; }

  /* Results Grid: Tab-driven view on mobile */
  .results-grid {
    display: block;
    padding: 0 0 40px;
  }
  .column-card {
    display: none; /* Controlled by tab buttons */
    margin-bottom: 16px;
  }
  .column-card.mobile-active {
    display: flex;
  }
  .items-list {
    max-height: 70vh;
    min-height: auto;
  }

  /* Product Page Hero */
  .product-hero-grid {
    grid-template-columns: 1fr;
    padding: 16px;
    gap: 16px;
  }
  .main-stage {
    max-height: 280px;
    border-radius: 10px;
  }
  .thumbnail-strip img {
    width: 56px;
    height: 56px;
  }
  .product-info h1 {
    font-size: 20px;
    line-height: 1.3;
  }
  .asin-badge {
    font-size: 11px;
    margin-bottom: 10px;
  }
  .amazon-direct-box {
    padding: 14px;
    margin: 12px 0 16px;
  }
  .btn-amazon-direct {
    padding: 12px 16px;
    font-size: 14px;
  }

  /* Mobile Sticky Bottom Bar */
  .mobile-sticky-cta {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    max-width: 100vw;
    padding: 10px 14px;
    left: 0;
    right: 0;
  }
  .btn-sticky-amazon {
    flex-shrink: 0;
    font-size: 13px;
    padding: 10px 14px;
    text-align: center;
  }

  /* Responsive Diagnostic Table -> Cards on Mobile */
  .diagnostic-table, 
  .diagnostic-table thead, 
  .diagnostic-table tbody, 
  .diagnostic-table th, 
  .diagnostic-table td, 
  .diagnostic-table tr {
    display: block;
    width: 100% !important;
    box-sizing: border-box;
  }
  .diagnostic-table thead {
    display: none;
  }
  .diagnostic-table {
    border: none;
    background: transparent;
    box-shadow: none;
  }
  .diagnostic-table tr {
    background: #ffffff;
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 14px;
    margin-bottom: 14px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .diagnostic-table td {
    padding: 8px 0;
    border-bottom: 1px dashed #f1f5f9;
  }
  .diagnostic-table td:last-child {
    border-bottom: none;
    padding-bottom: 0;
    padding-top: 10px;
  }
  .diagnostic-table td::before {
    content: attr(data-label);
    display: block;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #64748b;
    margin-bottom: 4px;
  }
  .diagnostic-table .part-fix-link {
    width: 100%;
    justify-content: center;
    padding: 8px 12px;
    font-size: 12px;
  }

  /* Responsive Maintenance Table -> Cards on Mobile */
  .maint-table, 
  .maint-table thead, 
  .maint-table tbody, 
  .maint-table th, 
  .maint-table td, 
  .maint-table tr {
    display: block;
    width: 100% !important;
    box-sizing: border-box;
  }
  .maint-table thead {
    display: none;
  }
  .maint-table {
    border: none;
    background: transparent;
  }
  .maint-table tr {
    background: #ffffff;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 12px 14px;
    margin-bottom: 10px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  }
  .maint-table td {
    padding: 4px 0;
    border: none;
  }
  .maint-table td::before {
    content: attr(data-label);
    display: block;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #94a3b8;
    margin-bottom: 2px;
  }

  /* Detail Layout */
  .detail-layout {
    grid-template-columns: 1fr;
    gap: 16px;
    padding-bottom: 76px;
  }
  .main-content {
    padding: 16px;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  .truth-table-box {
    word-break: break-word;
    overflow-wrap: break-word;
  }
  .step-grid {
    grid-template-columns: 1fr;
  }

  /* Footer */
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .footer-grid { grid-template-columns: 1fr; }
}
`;

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

// Master Build Runner
async function runBuild() {
  console.log('🚀 Starting Clean Mobile-First Programmatic Build Engine...');
  fs.writeFileSync(path.join(DIST_DIR, 'style.css'), CSS_BUNDLE, 'utf8');

  const sitemapUrls = [];
  const searchIndex = [];

  let partPagesCount = 0;
  for (const model of MODELS) {
    const brandObj = BRANDS.find(b => b.name === model.brand) || { slug: model.brand.toLowerCase() };
    const modelDir = path.join(DIST_DIR, brandObj.slug, model.slug);
    ensureDir(modelDir);

    for (const part of PART_CATEGORIES) {
      const partDir = path.join(modelDir, part.slug);
      ensureDir(partDir);

      const pageUrl = `${SITE_URL}/${brandObj.slug}/${model.slug}/${part.slug}/`;
      sitemapUrls.push({ loc: pageUrl, priority: '0.8', changefreq: 'weekly' });

      // Get real Amazon product data
      const amazonItem = getAmazonProduct(model, part);

      searchIndex.push({
        t: `${model.brand} ${model.name} ${part.shortName}`,
        u: `/${brandObj.slug}/${model.slug}/${part.slug}/`,
        b: model.brand,
        m: model.name,
        c: part.slug,
        icon: part.icon,
        img: amazonItem.images[0],
        asin: amazonItem.asin,
        type: 'part'
      });

      // Internal Silo Links
      const otherPartsForModel = PART_CATEGORIES
        .filter(p => p.slug !== part.slug)
        .map(p => `<li><a href="/${brandObj.slug}/${model.slug}/${p.slug}/"><span>${p.icon} ${p.shortName}</span> <span class="arr">›</span></a></li>`)
        .join('');

      const competingModels = MODELS
        .filter(m => m.slug !== model.slug && (m.brand === model.brand || m.family === model.family))
        .slice(0, 5)
        .map(m => {
          const compBrand = BRANDS.find(b => b.name === m.brand);
          return `<li><a href="/${compBrand.slug}/${m.slug}/${part.slug}/"><span>${m.brand} ${m.name}</span> <span class="arr">›</span></a></li>`;
        })
        .join('');

      // Procedural Deep Technical Content Generation
      const leadText = contentEngine.getProductLead(model, part);
      const hwCallout = contentEngine.getPartHardwareCallout(model, part);
      const deepGuide = contentEngine.getDeepEngineeringGuide(model, part);
      const steps = contentEngine.getStepByStepGuide(model, part);
      const maintSchedule = contentEngine.getMaintenanceSchedule(model, part);
      const tailoredFaqs = contentEngine.getTailoredFaqs(model, part);

      const isDiag = part.slug === 'hata-kodlari';
      const isReset = part.slug === 'reset-ve-wifi';
      const isDyson = model.brand.toLowerCase() === 'dyson';

      let pageTitle = `${esc(model.brand)} ${esc(model.name)} Uyumlu ${esc(part.name)} (${amazonItem.asin})`;
      let pageH1 = `${esc(model.brand)} ${esc(model.name)} Uyumlu ${esc(part.name)}`;
      let metaDesc = `${esc(model.brand)} ${esc(model.name)} için %100 uyumlu ${esc(part.name)}. ${esc(model.filterSize)}. Uyumlu modeller: ${esc(model.fits.join(', '))}. Orijinal Amazon Türkiye ürün sayfası.`;
      let specLabel1 = 'Uyumlu Model';
      let specVal1 = `<strong>${esc(model.name)}</strong>`;
      let specLabel2 = 'Ölçü / Standart';
      let specVal2 = esc(model.filterSize);
      let specLabel3 = 'Değişim Sıklığı';
      let specVal3 = esc(part.interval);
      let specLabel4 = 'Stok Durumu';
      let specVal4 = 'Amazon.com.tr Prime';
      let ctaButtonText = `Amazon.com.tr'de Aç (${amazonItem.asin}) ↗`;
      let priceNoteText = `✓ Doğrudan Amazon Türkiye orijinal ürün sayfasına gider.<br>✓ Prime aynı gün / ertesi gün kargo &amp; iade güvencesi.`;
      let leadParagraph = leadText;

      if (isDiag) {
        if (isDyson) {
          pageTitle = `${esc(model.brand)} ${esc(model.name)} Arıza Teşhis, Yanıp Sönen Işıklar & Sesli Uyarılar Çözüm Kılavuzu`;
          pageH1 = `${esc(model.brand)} ${esc(model.name)} Arıza Teşhis, Işık Uyarıları & Çözüm Rehberi`;
          metaDesc = `${esc(model.brand)} ${esc(model.name)} için motor kesik çalışma (pulsing), 32 kez kırmızı ışık yanıp sönmesi, sarı ışık aşırı ısınma ve evde adım adım tamir adımları.`;
        } else {
          pageTitle = `${esc(model.brand)} ${esc(model.name)} Hata Kodları (Error 1-18), Sesli Uyarılar & Çözüm Rehberi`;
          pageH1 = `${esc(model.brand)} ${esc(model.name)} Arıza Kodları, Sesli Uyarılar & Evde Çözüm Kılavuzu`;
          metaDesc = `${esc(model.brand)} ${esc(model.name)} için tüm hata kodları (Error 1-18), fırça/filtre sıkışması, lidar arızası ve servise gitmeden evde çözüm tablosu.`;
        }
        specLabel2 = 'Kılavuz Tipi';
        specVal2 = 'Donanımsal &amp; Yazılımsal Arıza Çözümü';
        specLabel3 = 'Çözüm Başarısı';
        specVal3 = '%90 Servissiz Evde Çözüm';
        specLabel4 = 'Gerekli Onarım Kiti';
        specVal4 = `Orijinal Uyumlu Filtre &amp; Batarya`;
        ctaButtonText = `Onarım İçin Uyumlu Parçayı Amazon'da Aç ↗`;
        priceNoteText = `✓ Arızayı gidermek için gereken orijinal uyumlu sarf malzemeler.<br>✓ Prime aynı gün / ertesi gün kargo güvencesiyle doğrudan Amazon TR.`;
      } else if (isReset) {
        if (isDyson) {
          pageTitle = `${esc(model.brand)} ${esc(model.name)} Sıfırlama, Tetik Kilidi & Batarya Kalibrasyon Rehberi`;
          pageH1 = `${esc(model.brand)} ${esc(model.name)} Donanımsal Sıfırlama & Batarya Kalibrasyonu`;
          metaDesc = `${esc(model.brand)} ${esc(model.name)} kablosuz dikey süpürgelerde donanımsal sıfırlama, tetik takılma çözümü ve batarya deşarj kalibrasyon adımları.`;
          specLabel2 = 'İşlem Tipi';
          specVal2 = 'Mekanik &amp; Batarya Sıfırlama';
        } else {
          pageTitle = `${esc(model.brand)} ${esc(model.name)} Wi-Fi Sıfırlama, Ağ Kurulumu & Çevrimdışı Çözüm Rehberi`;
          pageH1 = `${esc(model.brand)} ${esc(model.name)} Wi-Fi Kurulumu & Fabrika Ayarlarına Sıfırlama`;
          metaDesc = `${esc(model.brand)} ${esc(model.name)} Wi-Fi ağına bağlanmıyor veya çevrimdışı görünüyorsa tuş kombinasyonları ve 2.4 GHz modem eşleştirme kılavuzu.`;
          specLabel2 = 'Bağlantı Bandı';
          specVal2 = '2.4 GHz 802.11 b/g/n';
        }
        specLabel3 = 'İşlem Süresi';
        specVal3 = '2 - 3 Dakika';
        specLabel4 = 'Durum';
        specVal4 = 'Ücretsiz Teknik Rehber';
      } else if (part.slug === 'temizlik-solusyonu') {
        specLabel2 = 'Formülasyon';
        specVal2 = 'Köpürmeyen pH-Nötr (1:200)';
        specLabel3 = 'Kullanım Alanı';
        specVal3 = 'Tüm Sert Zeminler &amp; Parke';
      } else if (part.slug === 'sensor-bakimi') {
        specLabel2 = 'Sensör Kapsamı';
        specVal2 = 'LDS Lidar, Tampon ToF &amp; Düşme Sensörü';
        specLabel3 = 'Bakım Tipi';
        specVal3 = 'Hassas Optik Hijyen';
      }

      const jsonLdProduct = {
        '@context': 'https://schema.org',
        '@type': isDiag || isReset ? 'HowTo' : 'Product',
        name: pageH1,
        image: amazonItem.images,
        sku: amazonItem.asin,
        description: metaDesc,
        brand: { '@type': 'Brand', name: model.brand }
      };

      const jsonLdFaq = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: tailoredFaqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a }
        }))
      };

      const jsonLdBreadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: model.brand, item: `${SITE_URL}/marka/${brandObj.slug}/` },
          { '@type': 'ListItem', position: 3, name: model.name, item: `${SITE_URL}/${brandObj.slug}/${model.slug}/` },
          { '@type': 'ListItem', position: 4, name: part.name, item: pageUrl }
        ]
      };

      const html = `<!doctype html>
<html lang="tr">
<head>
  <meta name="google-site-verification" content="z1HDX3FFWaHIqyPyOMLwt9sgJg31Is1QxB7Po-DuJBs" />
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
  <title>${pageTitle}</title>
  <meta name="description" content="${metaDesc}">
  <link rel="canonical" href="${pageUrl}">
  <meta property="og:type" content="product">
  <meta property="og:image" content="${amazonItem.images[0]}">
  <link rel="stylesheet" href="/style.css">
  <script type="application/ld+json">${JSON.stringify(jsonLdProduct)}</script>
  <script type="application/ld+json">${JSON.stringify(jsonLdFaq)}</script>
  <script type="application/ld+json">${JSON.stringify(jsonLdBreadcrumb)}</script>
</head>
<body>
  ${renderHeader()}

  <main class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb">
      <ol>
        <li><a href="/">Ana Sayfa</a></li>
        <li><a href="/marka/${brandObj.slug}/">${esc(model.brand)}</a></li>
        <li><a href="/${brandObj.slug}/${model.slug}/">${esc(model.name)}</a></li>
        <li aria-current="page">${esc(part.shortName)}</li>
      </ol>
    </nav>

    <!-- Top Product Hero Grid -->
    <div class="product-hero-grid">
      <div class="gallery-container">
        <div class="main-stage" id="stage">
          <img id="mainimg" src="${amazonItem.images[0]}" alt="${esc(model.brand)} ${esc(model.name)} ${esc(part.name)}" fetchpriority="high">
        </div>
        <div class="thumbnail-strip" id="thumbs">
          ${amazonItem.images.map((imgUrl, i) => `
            <img src="${imgUrl}" class="${i === 0 ? 'on' : ''}" data-i="${i}" alt="${esc(model.name)} görünüm ${i+1}">
          `).join('')}
        </div>
      </div>

      <div class="product-info">
        <span class="badge-instant">${esc(model.brand)} ${esc(model.year)}</span>
        <div class="asin-badge">${isDiag ? '🛠️ Teknik Arıza ve Teşhis Kılavuzu' : isReset ? '🔄 Fabrika Ayarları & Sıfırlama Kılavuzu' : part.slug === 'sensor-bakimi' ? '👁️ Sensör & Lidar Bakım Kılavuzu' : `ASIN: ${amazonItem.asin} (Orijinal Amazon TR)`}</div>
        <h1>${pageH1}</h1>
        <p class="product-lead">
          ${leadParagraph}
        </p>

        <div class="amazon-direct-box">
          <p class="price-note">
            ${priceNoteText}
          </p>
          <a href="${amazonItem.directUrl}" target="_blank" rel="sponsored nofollow noopener" class="btn-amazon-direct">
            ${ctaButtonText}
          </a>
        </div>

        <table class="spec-table" style="margin: 0;">
          <tbody>
            <tr><th>${specLabel1}</th><td>${specVal1}</td></tr>
            <tr><th>${specLabel2}</th><td>${specVal2}</td></tr>
            <tr><th>${specLabel3}</th><td>${specVal3}</td></tr>
            <tr><th>${specLabel4}</th><td>${specVal4}</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Details -->
    <div class="detail-layout">
      <article class="main-content prose">
        <div class="hardware-callout">
          ${hwCallout}
        </div>

        <div class="tech-deep-dive">
          ${deepGuide}
        </div>

        ${isDiag ? `
        <div class="diagnostic-box">
          <h2>📋 ${esc(model.brand)} ${esc(model.name)} Kapsamlı Arıza ve Hata Çözüm Tablosu</h2>
          <div style="overflow-x:auto;">
            <table class="diagnostic-table">
              <thead>
                <tr>
                  <th style="width:24%;">Sinyal / Hata Kodu</th>
                  <th style="width:28%;">Cihaz Belirtisi &amp; Olası Neden</th>
                  <th style="width:32%;">Evde Anında Çözüm Adımları</th>
                  <th style="width:16%;">Çözüm Parçası</th>
                </tr>
              </thead>
              <tbody>
                ${diagnosticData.getDiagnosticMatrix(model).map(item => `
                  <tr>
                    <td data-label="Hata Kodu"><span class="code-badge">${esc(item.code)}</span></td>
                    <td data-label="Belirti &amp; Olası Neden"><strong>${esc(item.symptom)}</strong><br><span style="font-size:12px; color:#64748b;">${esc(item.cause)}</span></td>
                    <td data-label="Evde Çözüm Adımları">${item.fix}</td>
                    <td data-label="Gereken Parça">
                      ${item.partUrl ? `
                        <a href="/${brandObj.slug}/${model.slug}/${item.partUrl}/" class="part-fix-link">
                          ${esc(item.partText)}
                        </a>
                      ` : `<span style="font-size:11px; color:#64748b;">${esc(item.partText)}</span>`}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        ` : `
        <div class="steps-section">
          <h2>🛠️ ${esc(model.name)} ${esc(part.shortName)} ${isReset ? 'Sıfırlama ve Kurulum Kılavuzu' : part.slug === 'temizlik-solusyonu' ? 'Dozaj ve Kullanım Kılavuzu' : part.slug === 'sensor-bakimi' ? 'Temizlik ve Hassasiyet Protokolü' : 'Değişim ve Montaj Protokolü'}</h2>
          <div class="step-grid">
            ${steps.map(step => `
              <div class="step-card">
                <span class="step-badge">${esc(step.s)}</span>
                <div class="step-title">${esc(step.t)}</div>
                <p class="step-desc">${esc(step.d)}</p>
              </div>
            `).join('')}
          </div>
        </div>
        `}

        <div class="maint-section">
          <h2>📅 Periyodik Bakım ve Temizlik Takvimi</h2>
          <table class="maint-table">
            <thead>
              <tr><th>Bakım Sıklığı</th><th>Yapılması Gereken İşlem</th></tr>
            </thead>
            <tbody>
              ${maintSchedule.map(m => `
                <tr><td data-label="Bakım Sıklığı"><strong>${esc(m.f)}</strong></td><td data-label="Yapılması Gereken İşlem">${esc(m.a)}</td></tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="truth-table-box">
          <h3>${isDiag ? `✅ Bu Arıza & Teşhis Kılavuzunun Geçerli Olduğu Modeller` : isReset ? `✅ Bu Sıfırlama Kılavuzunun Geçerli Olduğu Modeller` : `✅ Çapraz Model Uyumluluk Doğrulama Tablosu`}</h3>
          <ul class="truth-list">
            <li>
              <span class="badge-check">${isDiag || isReset ? 'Birebir Geçerli Modeller:' : 'Birebir Uyumlu Modeller:'}</span> 
              <strong>${esc(model.fits.join(', '))}</strong>
            </li>
            ${model.doesNotFit && model.doesNotFit.length ? `
            <li style="margin-top:6px;">
              <span class="badge-cross">${isDiag || isReset ? 'Farklı Hata / Mimariye Sahip Modeller:' : 'Mekanik Olarak Kesinlikle UYMAZ:'}</span> 
              <span style="color:#b91c1c; font-weight:600;">${esc(model.doesNotFit.join(', '))}</span>
            </li>` : ''}
          </ul>
        </div>

        <div class="troubleshoot-box">
          <h2>${isDiag ? `⚠️ Yetkili Servise Başvurmadan Önceki Son Kontrol Listesi` : `⚠️ Arıza Teşhisi, Hata Kodları ve Çözüm Yolları`}</h2>
          <div class="callout-warning">
            <strong>${isDiag ? 'Teşhis Özeti:' : 'Donanım Durumu &amp; Arıza Notu:'}</strong> ${esc(model.errorCode || 'Arıza durumunda sensör ve filtre temizliği ilk adımdır.')}
          </div>
          <p>${esc(contentEngine.getTroubleshootNote(model, part))}</p>
        </div>

        <div class="faq-box">
          <h2>${isDiag ? `❓ ${esc(model.brand)} ${esc(model.name)} Arıza & Hata Kodları Sıkça Sorulan Sorular` : isReset ? `❓ ${esc(model.brand)} ${esc(model.name)} Sıfırlama ve Kurulum SSS` : `❓ ${esc(model.name)} ${esc(part.shortName)} Sıkça Sorulan Sorular`}</h2>
          ${tailoredFaqs.map(f => `
            <div class="faq-item">
              <div class="faq-q">❓ ${esc(f.q)}</div>
              <p class="faq-a">${esc(f.a)}</p>
            </div>
          `).join('')}
        </div>
      </article>

      <aside class="sidebar-content">
        <div class="silo-card">
          <h3>📦 ${esc(model.name)} Diğer Parçaları</h3>
          <ul class="silo-links">
            ${otherPartsForModel}
          </ul>
        </div>

        <div class="silo-card">
          <h3>🔄 Alternatif ${esc(model.brand)} Modelleri</h3>
          <ul class="silo-links">
            ${competingModels}
          </ul>
        </div>
      </aside>
    </div>
  </main>

  <!-- Sticky Mobile Bottom Bar -->
  <div class="mobile-sticky-cta">
    <div class="sticky-info">
      <span class="sticky-title">${esc(model.name)} ${esc(part.shortName)}</span>
      <span class="sticky-asin">${isDiag || isReset ? 'Teknik Onarım Rehberi' : `ASIN: ${amazonItem.asin}`}</span>
    </div>
    <a href="${amazonItem.directUrl}" target="_blank" rel="sponsored nofollow noopener" class="btn-sticky-amazon">
      ${isDiag ? 'Onarım Kiti ↗' : 'Amazon\'da Aç ↗'}
    </a>
  </div>

  ${renderFooter()}

  <script>
  (function(){
    var imgs = ${JSON.stringify(amazonItem.images)};
    var main = document.getElementById('mainimg');
    var thumbs = [].slice.call(document.querySelectorAll('#thumbs img'));
    if (!main || !thumbs.length) return;

    thumbs.forEach(function(t, k){
      t.addEventListener('click', function(){
        main.src = imgs[k];
        thumbs.forEach(function(thumb, idx){
          thumb.className = idx === k ? 'on' : '';
        });
      });
    });
  })();
  </script>
  <script src="/instant-search.js"></script>
</body>
</html>`;

      fs.writeFileSync(path.join(partDir, 'index.html'), html, 'utf8');
      partPagesCount++;
    }

    // Model Hub Page
    const modelUrl = `${SITE_URL}/${brandObj.slug}/${model.slug}/`;
    sitemapUrls.push({ loc: modelUrl, priority: '0.9', changefreq: 'weekly' });

    searchIndex.push({
      t: `${model.brand} ${model.name} Tüm Yedek Parçaları`,
      u: `/${brandObj.slug}/${model.slug}/`,
      b: model.brand,
      m: model.name,
      c: 'model',
      icon: '🤖',
      type: 'model'
    });

    const modelPartsList = PART_CATEGORIES.map(p => {
      const amz = getAmazonProduct(model, p);
      return `
        <a href="/${brandObj.slug}/${model.slug}/${p.slug}/" class="item-row">
          <img src="${amz.images[0]}" class="item-thumb-sm" alt="" loading="lazy">
          <div class="item-info">
            <span class="item-name">${p.icon} ${esc(model.name)} ${esc(p.name)}</span>
            <span class="item-sub">ASIN: ${amz.asin} | Değişim: ${esc(p.interval)}</span>
          </div>
          <span class="btn-amazon-pill">Amazon'da Aç ↗</span>
        </a>
      `;
    }).join('');

    const modelHtml = `<!doctype html>
<html lang="tr">
<head>
  <meta name="google-site-verification" content="z1HDX3FFWaHIqyPyOMLwt9sgJg31Is1QxB7Po-DuJBs" />
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
  <title>${esc(model.brand)} ${esc(model.name)} Yedek Parça &amp; Filtre Uyumluluk Rehberi (${esc(model.year)})</title>
  <meta name="description" content="${esc(model.brand)} ${esc(model.name)} (${esc(model.year)}) için HEPA filtre, ana fırça, mop bezi, toz torbası ve batarya uyumluluk listesi.">
  <link rel="canonical" href="${modelUrl}">
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  ${renderHeader()}
  <main class="wrap">
    <nav class="crumbs">
      <ol>
        <li><a href="/">Ana Sayfa</a></li>
        <li><a href="/marka/${brandObj.slug}/">${esc(model.brand)}</a></li>
        <li aria-current="page">${esc(model.name)}</li>
      </ol>
    </nav>
    <div class="prose" style="background:#fff; padding:20px; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:20px;">
      <h1>🤖 ${esc(model.brand)} ${esc(model.name)} Parça Merkezi</h1>
      <p>
        ${esc(model.brand)} ${esc(model.name)} (${esc(model.suction)} emiş gücü) akıllı robot süpürgenizin orijinal uyumlu sarf malzemeleri listesi.
      </p>
      <div class="hardware-callout" style="margin-top:10px;">
        <strong>Mekanik Özellikler:</strong> ${esc(model.quirks)}
      </div>
      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:10px;">
        <span class="stat-pill">Emiş: ${esc(model.suction)}</span>
        <span class="stat-pill">Fırça: ${esc(model.roller)}</span>
        <span class="stat-pill">Mop: ${esc(model.mop)}</span>
      </div>
    </div>
    <div style="background:#fff; padding:16px; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:40px;">
      <h2 style="font-size:16px; font-weight:700; margin-bottom:12px;">Uyumlu Parça ve Bakım Rehberleri</h2>
      <div style="display:flex; flex-direction:column; gap:4px;">
        ${modelPartsList}
      </div>
    </div>
  </main>
  ${renderFooter()}
  <script src="/instant-search.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(modelDir, 'index.html'), modelHtml, 'utf8');
  }

  // Brand Hub Pages
  const markaDir = path.join(DIST_DIR, 'marka');
  ensureDir(markaDir);
  for (const brand of BRANDS) {
    const brandDir = path.join(markaDir, brand.slug);
    ensureDir(brandDir);

    const brandUrl = `${SITE_URL}/marka/${brand.slug}/`;
    sitemapUrls.push({ loc: brandUrl, priority: '0.9', changefreq: 'weekly' });

    searchIndex.push({
      t: `${brand.name} Robot Süpürgeleri`,
      u: `/marka/${brand.slug}/`,
      b: brand.name,
      m: 'Tümü',
      c: 'brand',
      icon: '🏢',
      type: 'brand'
    });

    const brandModels = MODELS.filter(m => m.brand === brand.name);
    const modelsListHtml = brandModels.map(m => `
      <a href="/${brand.slug}/${m.slug}/" class="item-row">
        <div class="item-info">
          <span class="item-name">🤖 ${esc(m.brand)} ${esc(m.name)} (${esc(m.year)})</span>
          <span class="item-sub">${esc(m.suction)} emiş | ${esc(m.roller)}</span>
        </div>
        <span class="btn-amazon-pill">Modellere Bak ↗</span>
      </a>
    `).join('');

    const brandHtml = `<!doctype html>
<html lang="tr">
<head>
  <meta name="google-site-verification" content="z1HDX3FFWaHIqyPyOMLwt9sgJg31Is1QxB7Po-DuJBs" />
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
  <title>${esc(brand.name)} Robot Süpürge Yedek Parçaları &amp; Modelleri</title>
  <meta name="description" content="${esc(brand.name)} marka robot süpürgeler için HEPA filtre, rulo fırça, mop bezi ve bakım kılavuzları.">
  <link rel="canonical" href="${brandUrl}">
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  ${renderHeader()}
  <main class="wrap">
    <nav class="crumbs">
      <ol>
        <li><a href="/">Ana Sayfa</a></li>
        <li><a href="/marka/">Markalar</a></li>
        <li aria-current="page">${esc(brand.name)}</li>
      </ol>
    </nav>
    <div class="prose" style="background:#fff; padding:20px; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:20px;">
      <h1>🏢 ${esc(brand.name)} Robot Süpürge Merkezi</h1>
      <p>${esc(brand.desc)}</p>
      <span class="badge-instant">${brandModels.length} Model</span>
    </div>
    <div style="background:#fff; padding:16px; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:40px;">
      <h2 style="font-size:16px; font-weight:700; margin-bottom:12px;">Tüm ${esc(brand.name)} Modelleri</h2>
      <div style="display:flex; flex-direction:column; gap:4px;">
        ${modelsListHtml}
      </div>
    </div>
  </main>
  ${renderFooter()}
  <script src="/instant-search.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(brandDir, 'index.html'), brandHtml, 'utf8');
  }

  // Category Silo Hub Pages
  const katDir = path.join(DIST_DIR, 'kategori');
  ensureDir(katDir);
  for (const cat of PART_CATEGORIES) {
    const categoryDir = path.join(katDir, cat.slug);
    ensureDir(categoryDir);

    const catUrl = `${SITE_URL}/kategori/${cat.slug}/`;
    sitemapUrls.push({ loc: catUrl, priority: '0.9', changefreq: 'weekly' });

    const topModelsForCat = MODELS.slice(0, 30).map(m => {
      const bObj = BRANDS.find(b => b.name === m.brand);
      const amz = getAmazonProduct(m, cat);
      return `
        <a href="/${bObj.slug}/${m.slug}/${cat.slug}/" class="item-row">
          <img src="${amz.images[0]}" class="item-thumb-sm" alt="" loading="lazy">
          <div class="item-info">
            <span class="item-name">${cat.icon} ${esc(m.brand)} ${esc(m.name)} ${esc(cat.shortName)}</span>
            <span class="item-sub">ASIN: ${amz.asin} | Değişim: ${esc(cat.interval)}</span>
          </div>
          <span class="btn-amazon-pill">Amazon'da Aç ↗</span>
        </a>
      `;
    }).join('');

    const catHtml = `<!doctype html>
<html lang="tr">
<head>
  <meta name="google-site-verification" content="z1HDX3FFWaHIqyPyOMLwt9sgJg31Is1QxB7Po-DuJBs" />
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
  <title>Tüm Robot Süpürgeler İçin ${esc(cat.name)} Uyumluluk Listesi</title>
  <meta name="description" content="Roborock, Xiaomi, Dreame ve Ecovacs robot süpürgeler için ${esc(cat.name)} fiyatları, değişim sıklığı ve teknik boyutları.">
  <link rel="canonical" href="${catUrl}">
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  ${renderHeader()}
  <main class="wrap">
    <nav class="crumbs">
      <ol>
        <li><a href="/">Ana Sayfa</a></li>
        <li><a href="/kategori/">Kategoriler</a></li>
        <li aria-current="page">${esc(cat.name)}</li>
      </ol>
    </nav>
    <div class="prose" style="background:#fff; padding:20px; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:20px;">
      <h1>${cat.icon} Tüm Modeller İçin ${esc(cat.name)} Rehberi</h1>
      <p>${esc(cat.urgency)} Değişim Sıklığı: <strong>${esc(cat.interval)}</strong>.</p>
    </div>
    <div style="background:#fff; padding:16px; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:40px;">
      <h2 style="font-size:16px; font-weight:700; margin-bottom:12px;">En Çok Aranan Modeller İçin ${esc(cat.shortName)}</h2>
      <div style="display:flex; flex-direction:column; gap:4px;">
        ${topModelsForCat}
      </div>
    </div>
  </main>
  ${renderFooter()}
  <script src="/instant-search.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(categoryDir, 'index.html'), catHtml, 'utf8');
  }

  // Instant Homepage (With Mobile Segmented Tab Switcher!)
  const col1Initial = MODELS.slice(0, 25).map(m => {
    const b = BRANDS.find(br => br.name === m.brand);
    const cat = PART_CATEGORIES[0];
    const amz = getAmazonProduct(m, cat);
    return `
      <a href="/${b.slug}/${m.slug}/hepa-filtre/" class="item-row" data-search="${m.brand.toLowerCase()} ${m.name.toLowerCase()} hepa filtre">
        <img src="${amz.images[0]}" class="item-thumb-sm" alt="" loading="lazy">
        <div class="item-info">
          <span class="item-name">💨 ${esc(m.brand)} ${esc(m.name)} HEPA Filtre</span>
          <span class="item-sub">ASIN: ${amz.asin} | Değişim: 3-6 Ay</span>
        </div>
        <span class="btn-amazon-pill">Fiyatı Gör ↗</span>
      </a>
    `;
  }).join('');

  const col2Initial = MODELS.slice(0, 25).map(m => {
    const b = BRANDS.find(br => br.name === m.brand);
    return `
      <a href="/${b.slug}/${m.slug}/" class="item-row" data-search="${m.brand.toLowerCase()} ${m.name.toLowerCase()}">
        <div class="item-info">
          <span class="item-name">🤖 ${esc(m.brand)} ${esc(m.name)}</span>
          <span class="item-sub">${esc(m.suction)} Emiş | ${esc(m.year)}</span>
        </div>
        <span class="item-badge">12 Parça</span>
      </a>
    `;
  }).join('');

  const col3Initial = MODELS.slice(0, 25).map(m => {
    const b = BRANDS.find(br => br.name === m.brand);
    return `
      <a href="/${b.slug}/${m.slug}/hata-kodlari/" class="item-row" data-search="${m.brand.toLowerCase()} ${m.name.toLowerCase()} hata reset wifi">
        <div class="item-info">
          <span class="item-name">⚠️ ${esc(m.name)} Hata Kodları &amp; Reset</span>
          <span class="item-sub">LDS, Fırça ve Wi-Fi Çözümleri</span>
        </div>
        <span class="item-badge" style="background:#fef3c7; color:#92400e;">Rehber</span>
      </a>
    `;
  }).join('');

  const homeHtml = `<!doctype html>
<html lang="tr">
<head>
  <meta name="google-site-verification" content="z1HDX3FFWaHIqyPyOMLwt9sgJg31Is1QxB7Po-DuJBs" />
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
  <title>RoboParça — Robot Süpürge Yedek Parça &amp; Uyumluluk Motoru (Anlık Arama)</title>
  <meta name="description" content="Türkiye'nin en hızlı robot süpürge uyumluluk ve yedek parça arama motoru. Orijinal Amazon TR ASIN ve yüksek çözünürlüklü fotoğraflarla 1.200+ parça.">
  <link rel="canonical" href="${SITE_URL}/">
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  ${renderHeader()}

  <main class="wrap">
    <div class="quick-tags" style="margin: 16px 0 8px;">
      <span class="tag-label">Hızlı Filtre:</span>
      <button class="pill-btn active" data-filter="all">Tümü</button>
      <button class="pill-btn" data-filter="roborock">Roborock</button>
      <button class="pill-btn" data-filter="xiaomi">Xiaomi</button>
      <button class="pill-btn" data-filter="dreame">Dreame</button>
      <button class="pill-btn" data-filter="dyson">Dyson</button>
      <button class="pill-btn" data-filter="ecovacs">Ecovacs</button>
      <button class="pill-btn" data-filter="hepa">HEPA Filtre</button>
      <button class="pill-btn" data-filter="firca">Fırça</button>
      <button class="pill-btn" data-filter="mop">Mop</button>
      <button class="pill-btn" data-filter="hata">Hata &amp; Reset</button>
    </div>

    <!-- Segmented Mobile Tab Switcher (Visible ONLY on Mobile Screens) -->
    <div class="mobile-tabs-bar">
      <button class="mobile-tab-btn active" data-tab="col-1">💨 Parçalar</button>
      <button class="mobile-tab-btn" data-tab="col-2">🤖 Modeller</button>
      <button class="mobile-tab-btn" data-tab="col-3">🛠️ Rehberler</button>
    </div>

    <div class="results-grid">
      <section class="column-card mobile-active" id="card-col-1">
        <div class="col-header">
          <span class="col-title">💨 Uyumlu Yedek Parçalar</span>
          <span class="col-count" id="count-col-1">1,200 Sonuç</span>
        </div>
        <div class="items-list" id="col-1-list">
          ${col1Initial}
        </div>
      </section>

      <section class="column-card" id="card-col-2">
        <div class="col-header">
          <span class="col-title">🤖 Robot Modelleri &amp; Hub</span>
          <span class="col-count" id="count-col-2">100 Model</span>
        </div>
        <div class="items-list" id="col-2-list">
          ${col2Initial}
        </div>
      </section>

      <section class="column-card" id="card-col-3">
        <div class="col-header">
          <span class="col-title">🛠️ Sorun Giderme &amp; Reset</span>
          <span class="col-count" id="count-col-3">100 Rehber</span>
        </div>
        <div class="items-list" id="col-3-list">
          ${col3Initial}
        </div>
      </section>
    </div>

    <section id="nasil-calisir" class="prose" style="background:#fff; padding:24px; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:30px;">
      <h2>Robot Süpürgeniz İçin Doğru Parça Seçimi Neden Hayatidir?</h2>
      <p>
        Robot süpürgeler (Roborock, Xiaomi, Dreame, Ecovacs vb.) milimetrik toleranslarla çalışan mekanizmalara sahiptir. Yanlış rulo fırçalar motor dişlisini sıyırabilir; standart dışı HEPA filtreler ise mikroskobik partikülleri hava türbinine kaçırarak emiş motorunu yakabilir.
      </p>
    </section>
  </main>

  ${renderFooter()}
  <script src="/instant-search.js"></script>
  <script>
  // Mobile Tab Switcher Logic
  (function(){
    var tabBtns = document.querySelectorAll('.mobile-tab-btn');
    var cards = {
      'col-1': document.getElementById('card-col-1'),
      'col-2': document.getElementById('card-col-2'),
      'col-3': document.getElementById('card-col-3')
    };

    tabBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        tabBtns.forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        var target = btn.getAttribute('data-tab');
        Object.keys(cards).forEach(function(k){
          if (cards[k]) {
            if (k === target) cards[k].classList.add('mobile-active');
            else cards[k].classList.remove('mobile-active');
          }
        });
      });
    });
  })();
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), homeHtml, 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, 'search-index.json'), JSON.stringify(searchIndex), 'utf8');

  // Client-side Instant Search Engine
  const clientJs = `
(function() {
  var input = document.getElementById('instant-search-input');
  var clearBtn = document.getElementById('search-clear-btn');
  var dropdown = document.getElementById('instant-search-dropdown');
  var col1 = document.getElementById('col-1-list');
  var col2 = document.getElementById('col-2-list');
  var col3 = document.getElementById('col-3-list');
  var count1 = document.getElementById('count-col-1');
  var count2 = document.getElementById('count-col-2');
  var count3 = document.getElementById('count-col-3');
  var pillBtns = document.querySelectorAll('.pill-btn');

  var dataset = null;
  var currentFilter = 'all';

  function loadDataset() {
    if (dataset) return Promise.resolve(dataset);
    return fetch('/search-index.json')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        dataset = data;
        return data;
      });
  }

  if (input) {
    input.addEventListener('focus', function() {
      loadDataset().then(function() {
        if (input.value.trim().length > 0) {
          filterData(input.value);
        }
      });
    });
    document.addEventListener('touchstart', function() { loadDataset(); }, { once: true });

    var timer = null;
    input.addEventListener('input', function() {
      var val = input.value;
      if (clearBtn) clearBtn.style.display = val ? 'flex' : 'none';
      clearTimeout(timer);
      timer = setTimeout(function() {
        filterData(val);
      }, 10);
    });

    input.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        input.value = '';
        if (clearBtn) clearBtn.style.display = 'none';
        if (dropdown) dropdown.classList.remove('show');
        filterData('');
        input.blur();
      } else if (e.key === 'Enter') {
        if (dropdown && dropdown.classList.contains('show')) {
          var firstLink = dropdown.querySelector('a');
          if (firstLink) {
            e.preventDefault();
            window.location.href = firstLink.href;
          }
        }
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      if (input) {
        input.value = '';
        input.focus();
      }
      clearBtn.style.display = 'none';
      if (dropdown) dropdown.classList.remove('show');
      filterData('');
    });
  }

  document.addEventListener('click', function(e) {
    if (dropdown && !e.target.closest('.header-search-wrap')) {
      dropdown.classList.remove('show');
    }
  });

  function filterData(query) {
    loadDataset().then(function(items) {
      var q = (query || '').trim().toLowerCase();
      var words = q.split(/\\s+/).filter(Boolean);

      var matched = items.filter(function(item) {
        var str = (item.t + ' ' + item.b + ' ' + item.m + ' ' + item.c).toLowerCase();
        
        if (currentFilter !== 'all') {
          if (currentFilter === 'hepa' && !str.includes('hepa')) return false;
          if (currentFilter === 'firca' && !str.includes('fırça') && !str.includes('firca')) return false;
          if (currentFilter === 'mop' && !str.includes('mop')) return false;
          if (currentFilter === 'hata' && !str.includes('hata') && !str.includes('reset')) return false;
          if (['roborock', 'xiaomi', 'dreame', 'dyson', 'ecovacs'].includes(currentFilter)) {
            if (!item.b.toLowerCase().includes(currentFilter)) return false;
          }
        }

        if (!words.length) return true;
        return words.every(function(w) { return str.indexOf(w) > -1; });
      });

      if (col1 && col2 && col3) {
        renderColumns(matched);
      }

      if (dropdown) {
        if (!q && currentFilter === 'all') {
          dropdown.classList.remove('show');
          dropdown.innerHTML = '';
        } else {
          renderDropdown(matched.slice(0, 10));
        }
      }
    });
  }

  function renderDropdown(items) {
    if (!dropdown) return;
    if (!items.length) {
      dropdown.innerHTML = '<div style="padding:14px; text-align:center; color:#94a3b8; font-size:13px;">Eşleşen model veya parça bulunamadı.</div>';
      dropdown.classList.add('show');
      return;
    }

    var html = items.map(function(item) {
      var imgTag = item.img 
        ? '<img src="' + item.img + '" class="search-item-thumb" alt="" loading="lazy">' 
        : '<span style="font-size:20px; width:36px; text-align:center; display:inline-block;">' + (item.icon || '📦') + '</span>';
      var subText = item.type === 'model' ? item.b + ' Robot Süpürgesi' : (item.b + ' ' + item.m + (item.asin ? ' | ASIN: ' + item.asin : ''));
      return '<a href="' + item.u + '" class="search-dropdown-item">' +
        '<div class="search-item-left">' +
          imgTag +
          '<div class="search-item-texts">' +
            '<span class="search-item-title">' + item.t + '</span>' +
            '<span class="search-item-sub">' + subText + '</span>' +
          '</div>' +
        '</div>' +
        '<span class="search-item-arrow">›</span>' +
      '</a>';
    }).join('');

    dropdown.innerHTML = html;
    dropdown.classList.add('show');
  }

  function renderColumns(items) {
    var parts = [];
    var models = [];
    var guides = [];

    items.forEach(function(it) {
      if (it.type === 'part' && (it.c.includes('hata') || it.c.includes('reset') || it.c.includes('sensor'))) {
        guides.push(it);
      } else if (it.type === 'part') {
        parts.push(it);
      } else if (it.type === 'model' || it.type === 'brand') {
        models.push(it);
      }
    });

    if (count1) count1.textContent = parts.length + ' Sonuç';
    if (count2) count2.textContent = models.length + ' Model';
    if (count3) count3.textContent = guides.length + ' Rehber';

    if (col1) {
      if (!parts.length) {
        col1.innerHTML = '<div style="padding:20px; color:#94a3b8; font-size:13px; text-align:center;">Eşleşen parça bulunamadı.</div>';
      } else {
        col1.innerHTML = parts.slice(0, 40).map(function(p) {
          var imgTag = p.img ? '<img src="' + p.img + '" class="item-thumb-sm" alt="" loading="lazy">' : '';
          return '<a href="' + p.u + '" class="item-row">' +
            imgTag +
            '<div class="item-info">' +
              '<span class="item-name">' + p.icon + ' ' + p.t + '</span>' +
              '<span class="item-sub">' + p.b + ' ' + p.m + ' (ASIN: ' + (p.asin || 'Prime') + ')</span>' +
            '</div>' +
            '<span class="btn-amazon-pill">Amazon\\'da Aç ↗</span>' +
          '</a>';
        }).join('');
      }
    }

    if (col2) {
      if (!models.length) {
        col2.innerHTML = '<div style="padding:20px; color:#94a3b8; font-size:13px; text-align:center;">Eşleşen model bulunamadı.</div>';
      } else {
        col2.innerHTML = models.slice(0, 40).map(function(m) {
          return '<a href="' + m.u + '" class="item-row">' +
            '<div class="item-info">' +
              '<span class="item-name">' + m.icon + ' ' + m.t + '</span>' +
              '<span class="item-sub">' + m.b + ' Serisi</span>' +
            '</div>' +
            '<span class="item-badge">Modeller ↗</span>' +
          '</a>';
        }).join('');
      }
    }

    if (col3) {
      if (!guides.length) {
        col3.innerHTML = '<div style="padding:20px; color:#94a3b8; font-size:13px; text-align:center;">Eşleşen rehber bulunamadı.</div>';
      } else {
        col3.innerHTML = guides.slice(0, 40).map(function(g) {
          return '<a href="' + g.u + '" class="item-row">' +
            '<div class="item-info">' +
              '<span class="item-name">' + g.icon + ' ' + g.t + '</span>' +
              '<span class="item-sub">' + g.b + ' ' + g.m + ' Arıza Kılavuzu</span>' +
            '</div>' +
            '<span class="item-badge" style="background:#fef3c7; color:#92400e;">Rehber</span>' +
          '</a>';
        }).join('');
      }
    }
  }

  if (pillBtns && pillBtns.length) {
    pillBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        pillBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter') || 'all';
        filterData(input ? input.value : '');
      });
    });
  }
})();
`;
  fs.writeFileSync(path.join(DIST_DIR, 'instant-search.js'), clientJs, 'utf8');

  // Sitemaps
  sitemapUrls.unshift({ loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'daily' });
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>2026-10-20</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`, 'utf8');
  // Write .nojekyll to ensure GitHub Pages serves raw pre-rendered HTML without running Jekyll
  fs.writeFileSync(path.join(DIST_DIR, '.nojekyll'), '', 'utf8');

  // Print Exact Verified Statistics
  console.log(`✅ Build Complete!`);
  console.log(`📊 EXACT Page Breakdown:`);
  console.log(`   • ${partPagesCount} Dedicated Product/Part Landing Pages`);
  console.log(`   • ${MODELS.length} Model Hub Pages`);
  console.log(`   • ${BRANDS.length} Brand Hub Pages`);
  console.log(`   • ${PART_CATEGORIES.length} Category Silo Hub Pages`);
  console.log(`   • 1 Instant Homepage`);
  console.log(`🎯 TOTAL EXACT SITEMAP PAGES: ${sitemapUrls.length}`);
}

runBuild().catch(err => {
  console.error('Build Error:', err);
  process.exit(1);
});
