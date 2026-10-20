// lib/content/leads.js - 4 Distinct Procedural Lead Variations per Category
const { simpleHash, pick } = require('./helpers');

function getProductLead(model, part) {
  const p = part.slug;
  const b = model.brand;
  const m = model.name;
  const s = model.suction || 'yüksek vakum';
  const y = model.year || 'güncel seri';
  const isDysonCordless = b.toLowerCase() === 'dyson' && !m.includes('360');
  const h = simpleHash(`${model.slug}-${p}-lead-v10`);

  if (isDysonCordless) {
    if (p === 'hepa-filtre') {
      return pick([
        `<strong>${b} ${m}</strong> dikey kablosuz süpürgenizin 110.000 RPM dijital motorunu korumak ve mikroskobik polenleri hapsetmek için üretilmiş çift kademeli orijinal uyumlu HEPA filtre kiti.`,
        `Evinizdeki hava kalitesini artıran ve <strong>${b} ${m}</strong> cihazınızın hava kanallarını açık tutarak emiş kaybını önleyen yüksek yoğunluklu yıkanabilir filtre kartuşu.`,
        `<strong>${b} ${m} (${y})</strong> süpürgenizde motorun kesik kesik çalışma (pulsing) arızasını önleyen, 0.3 mikron partikül tutma sertifikalı arka egzoz ve ön çubuk filtre takımı.`,
        `Yoğun kullanımda azalan hava akışını fabrika çıkış debisine döndürmek için tasarlanmış, <strong>${b} ${m}</strong> ile tam kalibreli yedek filtre seti.`
      ], h);
    }
    if (p === 'ana-firca') {
      return pick([
        `<strong>${b} ${m}</strong> motorlu başlığınız için doğrudan tahrikli (Direct Drive) veya Soft Roller uyumlu, zemin temasını maksimize eden yüksek torklu rulo fırça.`,
        `Sert zeminlerde statik elektriği nötralize eden, halılarda ise dip liflere inerek tozu söken <strong>${b} ${m}</strong> uyumlu yedek fırça silindiri.`,
        `Aşınmış veya rulman yuvasına saç dolanması sonucu dönmeyen <strong>${b} ${m}</strong> başlıkları için orijinal mekanik toleranslarda üretilmiş döner fırça ünitesi.`,
        `<strong>${b} ${m} (${y})</strong> cihazınızın zemin kavrama gücünü yenileyen, rulman korumalı ve kolay çıkarılabilir yedek rulo bileşeni.`
      ], h);
    }
    if (p === 'batarya-pil') {
      return pick([
        `<strong>${b} ${m}</strong> kablosuz süpürgenizin kullanım süresini sıfırlayan, 21.6V yüksek deşarjlı lityum-iyon hücrelere ve dahili BMS devre korumasına sahip yedek batarya paketi.`,
        `Tetiğe basıldığında 32 kez kırmızı ışık flaşı veren veya MAX modda aniden kapanan <strong>${b} ${m}</strong> modelleri için test edilmiş güvenli batarya ünitesi.`,
        `Evin tamamını tek şarjla süpürmenizi sağlayan, aşırı şarj ve termal ısınma korumalı <strong>${b} ${m} (${y})</strong> uyumlu yüksek kapasiteli güç hücresi.`,
        `Fabrika çevrim ömrünü dolduran bataryanızı servise gitmeden 3 vidayla yenilemenizi sağlayan <strong>${b} ${m}</strong> birebir uyumlu yedek güç paketi.`
      ], h);
    }
    if (p === 'hata-kodlari') {
      return pick([
        `<strong>${b} ${m}</strong> kablosuz süpürgenizde motorun kesik kesik çalışması (pulsing), batarya LED ışık flaşları ve aniden durma arızalarını evde çözmeniz için hazırlanmış teknik teşhis kılavuzudur.`,
        `Tetiğe basıldığında duyulan ritmik "vut-vut" sesi, sarı ısınma ışığı ve 32x kırmızı flaş hatalarını servise başvurmadan giderme adımları.`,
        `<strong>${b} ${m} (${y})</strong> dikey süpürgenizin dijital motor koruma protokollerini ve LED gösterge sinyallerini yorumlayan kapsamlı arıza teşhis rehberi.`,
        `Hava akışı kilitlenmeleri ve batarya voltaj kesintilerini dakikalar içinde test edip çözmenizi sağlayan <strong>${b} ${m}</strong> donanımsal kontrol listesi.`
      ], h);
    }
    if (p === 'reset-ve-wifi') {
      return pick([
        `<strong>${b} ${m}</strong> dikey süpürgelerde Wi-Fi bulunmaz; bu rehber motor hava kilidi sıfırlama, tetik takılma çözümü ve batarya statik elektrik deşarjı adımlarını içerir.`,
        `Tetik basılı kalması, motorun tepki vermemesi ve batarya BMS devre kilidini manuel sıfırlama işlemlerini kapsayan <strong>${b} ${m}</strong> mekanik bakım protokolü.`,
        `<strong>${b} ${m}</strong> donanımında hava yolu boşaltma, filtre sensör resetleme ve batarya kontak temizliğiyle performansı fabrika değerlerine döndürme kılavuzu.`,
        `Servis gerektirmeyen temel mekanik sıfırlama ve tetik mandalı kontrol adımlarını içeren <strong>${b} ${m} (${y})</strong> teknik yardım sayfası.`
      ], h);
    }
    // General Dyson cordless fallback for accessories
    return pick([
      `<strong>${b} ${m} (${y})</strong> kablosuz süpürgenizin siklonik performansını ve zemin temizleme kabiliyetini koruyan orijinal standartlarda <strong>${part.name}</strong> ünitesidir.`,
      `Günlük süpürme işlemlerinde hava sızdırmazlığını ve motor sağlığını güvenceye alan tam uyumlu <strong>${b} ${m} ${part.shortName}</strong> bileşeni.`,
      `<strong>${b} ${m}</strong> donanımıyla birebir eşleşen, pratik tak-çıkar mekanizmalı birinci sınıf <strong>${part.name}</strong>.`,
      `Yüksek devirli dijital motorun verimliliğini korumak için titizlikle test edilmiş <strong>${b} ${m}</strong> yedek parçası.`
    ], h);
  }

  // ROBOT VACUUM CATEGORIES (All 12)
  if (p === 'hepa-filtre') {
    return pick([
      `<strong>${b} ${m} (${y})</strong> robot süpürgenizin ${s} vakum türbinini koruyan ve 0.3 mikron tozları hapseden ${model.filterSize} standartlarında E11/H12 mikro filtre kartuşu.`,
      `Motorun aşırı ısınmasını ve Error 10 hava akışı uyarısını engelleyen, <strong>${b} ${m}</strong> toz haznesiyle %100 sızdırmaz uyumlu yedek HEPA filtre.`,
      `Ev ortamındaki mikroskobik akarları ve evcil hayvan tüylerini hapsederek egzoz havasını tazeleyen <strong>${b} ${m}</strong> yıkanabilir filtre ünitesi.`,
      `Zamanla dolan mikro lif gözeneklerini yenileyerek <strong>${b} ${m}</strong> robotunuzun çekiş gücünü ilk günkü sessizliğinde sürdüren yüksek filtrasyonlu kartuş.`
    ], h);
  }

  if (p === 'ana-firca') {
    return pick([
      `<strong>${b} ${m}</strong> robot süpürgenizin zemin temasını sağlayan, ${model.roller || 'silindir rulo'} mimarisine tam uyumlu yüksek torklu yedek ana fırça.`,
      `Sert zeminlerde toz bırakmayan, halı dokusunda ise derin liflere nüfuz eden <strong>${b} ${m} (${y})</strong> uyumlu çıkarılabilir rulmanlı döner fırça.`,
      `Saç ve iplik dolanmalarını en aza indiren, Error 5 fırça sıkışma uyarısını önleyen <strong>${b} ${m}</strong> orijinal standart yedek silindir ünitesi.`,
      `Aşınan kauçuk bıçakları ve fırça kıllarını yenileyerek süpürme verimini fabrika standardına getiren <strong>${b} ${m}</strong> ana fırça bileşeni.`
    ], h);
  }

  if (p === 'yan-firca') {
    return pick([
      `<strong>${b} ${m}</strong> robotunuzun süpürgelik dipleri ve köşe kör noktalarındaki tozları ana fırça kanalına süpüren yüksek elastikiyetli yedek yan fırça.`,
      `Altıgen tahrik miline tam oturan ve duvar takip sensörüyle senkronize çalışan <strong>${b} ${m} (${y})</strong> uyumlu dayanıklı köşe fırçası.`,
      `Zemini çizmeyen yumuşak silikon/naylon kollarla donatılmış, Error 6 motor kilitlenmesini önleyen <strong>${b} ${m}</strong> yedek yan fırça takımı.`,
      `Bükülen ve aşınan köşe kollarını tazeleyerek kenar süpürme performansını %100 artıran <strong>${b} ${m}</strong> vidalı/tırnaklı montaj kiti.`
    ], h);
  }

  if (p === 'mop-bezi') {
    return pick([
      `<strong>${b} ${m}</strong> robot süpürgenizin zemin silme modülüne tam oturan, yüksek su emici mikrofiber dokulu yıkanabilir yedek mop pedi.`,
      `Sert zeminlerde su lekesi bırakmadan inatçı kirleri ve yağ tabakasını çözen <strong>${b} ${m} (${y})</strong> uyumlu antibakteriyel mop bezi.`,
      `Cırt cırt ve raylı kızağa milimetrik tutunan, titreşimli veya döner paspas baskısını zemine eşit yayan <strong>${b} ${m}</strong> zemin bezi.`,
      `Yıkama sonrası lif yapısını koruyan ve kuruma esnasında koku yapmayan dayanıklı <strong>${b} ${m}</strong> mikrofiber paspas ünitesi.`
    ], h);
  }

  if (p === 'toz-torbasi') {
    return pick([
      `<strong>${b} ${m}</strong> otomatik çöp boşaltma istasyonunuz için meltblown filtre kumaşından üretilmiş, sızdırmaz kilitli yüksek kapasiteli toz torbası.`,
      `İstasyonun 27.000 Pa vakum emişinde toz kaçırmayan ve motor filtresini koruyan <strong>${b} ${m} (${y})</strong> uyumlu hijyenik yedek torba.`,
      `Toz haznesi boşaltılırken alerjenlerin ortama yayılmasını sürgülü kapak mekanizmasıyla engelleyen <strong>${b} ${m}</strong> istasyon torbası.`,
      `Haftalarca zahmetsiz temizlik sağlayan, 2.5L - 3.0L hazne hacmiyle tam uyumlu çok katmanlı <strong>${b} ${m}</strong> toz toplama kiti.`
    ], h);
  }

  if (p === 'batarya-pil') {
    return pick([
      `<strong>${b} ${m}</strong> robotunuzun tek şarjla tüm evi temizlemesini sağlayan, ${model.battery || '5200 mAh'} kapasiteli yüksek kaliteli lityum-iyon yedek batarya.`,
      `Hücre voltaj dengesini koruyan BMS devresine sahip, Error 12 düşük voltaj kapanmalarını gideren <strong>${b} ${m} (${y})</strong> batarya paketi.`,
      `Temizlik ortasında şarjı bitip docka dönemeyen <strong>${b} ${m}</strong> robotlar için fabrika çıkış menzilini geri kazandıran lityum güç hücresi.`,
      `Aşırı akım, kısa devre ve termal aşırı ısınma korumalı hücrelerden oluşan <strong>${b} ${m}</strong> uyumlu uzun ömürlü pil bloğu.`
    ], h);
  }

  if (p === 'su-haznesi-filtresi') {
    return pick([
      `<strong>${b} ${m}</strong> elektronik su pompasını kireçten koruyan ve mop bezine homojen su aktarımı sağlayan yedek su haznesi nozul filtresi.`,
      `Mop bezinin kuru kalmasını veya su sızıntılarını önleyen, <strong>${b} ${m} (${y})</strong> dahili su tankıyla tam uyumlu conta ve filtre seti.`,
      `Elektronik kontrollü su debisinin tıkanmadan zemine iletilmesini temin eden <strong>${b} ${m}</strong> mikron gözenekli su tankı valfi.`,
      `Silikon sızdırmazlık halkasıyla su damlatma arızalarını sonlandıran orijinal standartlarda <strong>${b} ${m}</strong> su haznesi bileşeni.`
    ], h);
  }

  if (p === 'tekerlek-bakimi') {
    return pick([
      `<strong>${b} ${m}</strong> robot süpürgenizin halı ve eşik tırmanma kabiliyetini koruyan, Error 7 çekiş motoru kilitlenmesini önleyen tekerlek bakım seti.`,
      `Aşınan ve zemin üzerinde patinaj yapan tahrik tekerlekleri için kaydırmaz kauçuk lastik ve <strong>${b} ${m} (${y})</strong> ön sarhoş tekerlek ünitesi.`,
      `360 derece döner ön bilye aksına dolanan saçları temizleyerek yön bulma hassasiyetini yenileyen <strong>${b} ${m}</strong> tekerlek modülü.`,
      `Süspansiyon yay sertliğini fabrika toleransında tutarak 20 mm engel aşma kabiliyetini tazeleyen <strong>${b} ${m}</strong> çekiş kiti.`
    ], h);
  }

  if (p === 'temizlik-solusyonu') {
    return pick([
      `<strong>${b} ${m}</strong> akıllı robot süpürgelerin dahili mikro su pompası ve contalarıyla %100 uyumlu, köpürmeyen kireç önleyici konsantre temizlik solüsyonu.`,
      `Sert zeminlerde iz bırakmayan, pH nötr formülüyle robotun elektronik su kanallarını tıkamayan <strong>${b} ${m} (${y})</strong> özel yüzey deterjanı.`,
      `Çamaşır suyu ve aşındırıcı kimyasalların contaları eritmesini önleyen, 1:200 konsantre oranına sahip <strong>${b} ${m}</strong> uyumlu temizlik sıvısı.`,
      `Parke, mermer ve fayanslarda derinlemesine hijyen sağlarken robotun su nozullarını kireçten koruyan <strong>${b} ${m}</strong> zemin solüsyonu.`
    ], h);
  }

  if (p === 'sensor-bakimi') {
    return pick([
      `<strong>${b} ${m}</strong> robotunuzun LDS lazer kulesi, alt uçurum fotodiyotları ve şarj kontaklarının optik hassasiyetini koruyan teknik bakım rehberidir.`,
      `Harita kaymalarını, koyu zeminlerde sahte düşme alarmlarını ve şarj olmama temassızlıklarını gideren <strong>${b} ${m} (${y})</strong> sensör hijyen protokolü.`,
      `Robotun duvar mesafesini milimetrik algılamasını sağlayan yan ToF sensörleri ve kızılötesi gözleri arındırma kılavuzu.`,
      `Optik merceklerde oluşan mikron toz tabakasını temizleyerek Error 1 ve Error 4 uyarılarını ortadan kaldıran <strong>${b} ${m}</strong> bakım adımları.`
    ], h);
  }

  if (p === 'reset-ve-wifi') {
    return pick([
      `<strong>${b} ${m}</strong> cihazınızın Wi-Fi ağını sıfırlama, 2.4 GHz modem eşleştirme ve uygulamadaki 'Cihaz Çevrimdışı' hatasını çözme adımlarıdır.`,
      `Modem değişimi veya internet kopması sonrası <strong>${b} ${m} (${y})</strong> robotunuzu akıllı uygulamaya yeniden bağlama ve fabrika resetleme kılavuzu.`,
      `Robotun haritayı ters çevirmesi veya hafıza çakışması durumlarında fabrika yazılımına döndürme tuş kombinasyonları.`,
      `Çift bant 5 GHz / 2.4 GHz yönlendirici uyumsuzluklarını aşarak <strong>${b} ${m}</strong> bağlantısını kalıcı hale getiren ağ kılavuzu.`
    ], h);
  }

  if (p === 'hata-kodlari') {
    return pick([
      `<strong>${b} ${m} (${y})</strong> robot süpürgenizde karşılaştığınız Error 1 ila Error 18 arası hata kodları ve sesli ikazları 5 dakikada çözme rehberidir.`,
      `LDS kule dönmüyor, ana fırça sıkıştı ve filtre tıkalı uyarılarını servise gitmeden evde gidermenizi sağlayan <strong>${b} ${m}</strong> teknik teşhis tablosu.`,
      `Robotun aniden durup kırmızı ışık yakması ve sesli uyarı vermesi durumunda uygulanacak adım adım <strong>${b} ${m}</strong> donanımsal müdahale adımları.`,
      `Anakart koruma devrelerini açarak cihazı fabrika çalışma düzenine döndüren <strong>${b} ${m}</strong> arıza kodları ve onarım kılavuzu.`
    ], h);
  }

  return `<strong>${b} ${m}</strong> cihazınızın fabrika performansını korumak için tasarlanmış orijinal standartlarda <strong>${part.name}</strong> ünitesidir.`;
}

module.exports = {
  getProductLead
};
