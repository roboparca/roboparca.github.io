// lib/content/callouts.js - 4 Distinct Procedural Hardware Callout Variations per Category
const { simpleHash, pick } = require('./helpers');

function getPartHardwareCallout(model, part) {
  const p = part.slug;
  const m = model.name;
  const b = model.brand;
  const isDysonCordless = b.toLowerCase() === 'dyson' && !m.includes('360');
  const h = simpleHash(`${model.slug}-${p}-callout-v10`);

  if (isDysonCordless) {
    if (p === 'hepa-filtre') {
      return pick([
        `<strong>💨 ${b} ${m} Çift Filtre Koruması:</strong> Ön konik filtre ve arka HEPA filtre mikron partikülleri yakalar. Yıkandıktan sonra en az 24 saat tam kurutulmadan takılması motora nem çeker ve kalıcı koku yapar.`,
        `<strong>💨 ${b} ${m} Hava Akışı Emniyeti:</strong> Filtre gözenekleri tıkandığında motor hava bulamaz ve yanmayı önlemek için kesik kesik çalışma (pulsing) emniyet moduna geçer.`,
        `<strong>💨 ${b} ${m} Egzoz Filtrasyon Standardı:</strong> Arka HEPA filtre 0.3 mikron boyutundaki akarları hapseder; soğuk musluk suyuyla deterjansız yıkanmalı, sıcak petek üzerine konulmamalıdır.`,
        `<strong>💨 ${b} ${m} Siklon Basınç Dengesi:</strong> Ön çubuk filtrenin aylık yıkanması, siklon konilerinin yüksek merkezkaç kuvvetini koruyarak motor fanına toz kaçmasını %100 önler.`
      ], h);
    }
    if (p === 'ana-firca') {
      return pick([
        `<strong>🔄 ${b} ${m} Doğrudan Tahrikli Fırça:</strong> Motorlu başlık zeminle milimetrik temasla çalışır. Rulo miline saç dolandığında madeni para ile yan kilit vidası açılıp rulman temizlenmelidir.`,
        `<strong>🔄 ${b} ${m} Rulo Koruma Devresi:</strong> Başlığa halı saçağı veya kablo dolandığında motor kendini korumak için rulonun dönüşünü anında durdurur.`,
        `<strong>🔄 ${b} ${m} Antistatik Karbon Lifler:</strong> Sert zemin başlığındaki karbon fiber şeritler statik tozu nötralize eder; rulman yuvası sıvı temasından korunmalıdır.`,
        `<strong>🔄 ${b} ${m} Tork ve Devir Ayarı:</strong> Fırça rulonun dönme direnci arttığında batarya tüketimi iki katına çıkar; düzenli tüy temizliği pil menzilini korur.`
      ], h);
    }
    if (p === 'batarya-pil') {
      return pick([
        `<strong>🔋 ${b} ${m} 6 Hücreli Li-ion Mimarisi:</strong> 21.6V gerilime sahip lityum batarya, yüksek akım çeken MAX modunda ısınır. Şarj etmeden önce 20 dakika soğuması hücre ömrünü iki katına çıkarır.`,
        `<strong>🔋 ${b} ${m} 32x Kırmızı Flaş Anlamı:</strong> Batarya üzerindeki LED aralıksız kırmızı yanıp sönüyorsa BMS devresi güvenlik kilidine geçmiştir; donanımsal batarya değişimi şarttır.`,
        `<strong>🔋 ${b} ${m} Akıllı BMS Hücre Dengeleme:</strong> Batarya yönetim entegresi her hücrenin eşit şarj olmasını denetler; orijinal şarj aleti kullanımı devre sağlığı için kritiktir.`,
        `<strong>🔋 ${b} ${m} Sıcaklık Sensör Koruması:</strong> Aşırı ısınan batarya kendini korumak için sarı LED yakarak akımı keser; oda sıcaklığına inene kadar şarj almaz.`
      ], h);
    }
    if (p === 'hata-kodlari') {
      return pick([
        `<strong>⚠️ ${b} ${m} Arıza Teşhis Mantığı:</strong> Dyson dikey süpürgelerde dijital ekran yoktur. Motorun kesik kesik çalışması (pulsing) hava yolu tıkanıklığını, 32x kırmızı flaş ise batarya hücresi arızasını gösterir.`,
        `<strong>⚠️ ${b} ${m} Motor Güvenlik Protokolü:</strong> Süpürgenin aniden durup sarı ışık yakması termal aşırı ısınma korumasıdır. 30-45 dk oda sıcaklığında soğuması beklenmelidir.`,
        `<strong>⚠️ ${b} ${m} Tıkanıklık Teşhis Sinyali:</strong> Tetiğe basıldığında duyulan ritmik kesinti, filtrenin tıkandığını veya şeffaf hazne kapağı girişindeki lastik klapenin kapalı kaldığını bildirir.`,
        `<strong>⚠️ ${b} ${m} Mavi Işık Sinyalleri:</strong> Hızlı yanıp sönen mavi ışık bataryanın tamamen bittiğini; sabit mavi ışık ise şarjın devam ettiğini gösterir.`
      ], h);
    }
    if (p === 'reset-ve-wifi') {
      return pick([
        `<strong>📶 ${b} ${m} Donanım Sıfırlama:</strong> Dikey süpürgelerde yazılım reset tuşu yoktur. Bataryanın 3 vidası sökülerek gövdeden 5 dakika ayrılması anakart statik elektriğini boşaltır.`,
        `<strong>📶 ${b} ${m} Tetik Mekanizması Kontrolü:</strong> Tetik basılı kaldığında motor sürekli çalışabilir. Gövde içindeki plastik mandalın kırılmadığı fiziksel olarak kontrol edilmelidir.`,
        `<strong>📶 ${b} ${m} Hava Yolu Boşaltma Döngüsü:</strong> Motor hava emniyet kilidini açmak için hazne boşaltma kolu 3 kez çekilip bırakılarak klape yaylanması tazelenmelidir.`,
        `<strong>📶 ${b} ${m} Batarya Kontak Deşarjı:</strong> Uzun süre kullanılmayan bataryaların şarj temas pinleri kuru bezle temizlenip prize takılarak devre uyandırılır.`
      ], h);
    }
    // Fallback Dyson callout
    return pick([
      `<strong>⚙️ ${b} ${m} Mühendislik Standardı:</strong> Dyson dijital motor toleranslarına uygun orijinal yedek parçalar hava sızdırmazlığını ve siklonik çekişi korur.`,
      `<strong>⚙️ ${b} ${m} Mekanik Uyum:</strong> Doğru oturmayan parçalar hava kaçağına ve motorun aşırı ısınmasına yol açabilir.`
    ], h);
  }

  // ROBOT VACUUMS (12 Categories)
  if (p === 'hepa-filtre') {
    return pick([
      `<strong>💨 ${b} ${m} Hava Akışı Dinamiği:</strong> ${model.suction} gücündeki türbin, ${model.filterSize} boyutundaki E11/H12 mikro filtre panelinden hava çeker. Filtre tıkandığında motor soğutması yetersiz kalır ve Error 10 verir. Yıkama sonrası 24 saat gölgede kurutulmalıdır.`,
      `<strong>💨 ${b} ${m} HEPA Filtrasyon Standartları:</strong> Cihazın ${model.filterSize} petekli filtresi mikroskobik polen ve akarları hapseder. Deterjansız, soğuk musluk suyuyla yıkanmalı; asla fırçalanmamalıdır.`,
      `<strong>💨 ${b} ${m} Basınç Sensörü Uyarısı:</strong> Toz haznesi arkasındaki diferansiyel basınç sensörü, filtre gözenekleri tıkandığında emişi keserek türbin motorunu yanmaktan korur.`,
      `<strong>💨 ${b} ${m} Nem ve Küf Önleme:</strong> Nemli takılan filtre mikro liflerin şişmesine ve motora rutubet kaçmasına sebep olur; yedek filtreyle dönüşümlü kullanılmalıdır.`
    ], h);
  }

  if (p === 'ana-firca') {
    return pick([
      `<strong>🔄 ${b} ${m} Zemin Temas Mimarisi:</strong> Cihazın ${model.roller || 'ana fırça'} mekanizması yüksek torkla döner. Rulman yan kapakları düzenli sökülüp çelik mildeki saçlar temizlenmezse Error 5 arızası verir.`,
      `<strong>🔄 ${b} ${m} Fırça Dişli Emniyeti:</strong> Fırça kafesine tel veya halı püskülü girdiğinde motor kendini korumak için devreyi keser. Rulman yuvalarının yağsız bırakılmaması gerekir.`,
      `<strong>🔄 ${b} ${m} Kauçuk Bıçak Dinamiği:</strong> Sert zeminlerde tozu sıyıran kauçuk kanatlar esnekliğini kaybettiğinde süpürme kalitesi düşer; yılda bir rulo yenilenmelidir.`,
      `<strong>🔄 ${b} ${m} Tork Aşırı Akım Koruması:</strong> Saç dolanan rulmanlarda sürtünme artar, anakart aşırı akım hissederek temizliği yarıda keser; haftalık kıl temizliği şarttır.`
    ], h);
  }

  if (p === 'yan-firca') {
    return pick([
      `<strong>🌀 ${b} ${m} Kenar Süpürme Algoritması:</strong> Yan fırça duvara paralel giderken 330 RPM hızla döner; açık alanda ise tozları fırlatmamak için devrini 130 RPM seviyesine düşürür.`,
      `<strong>🌀 ${b} ${m} Şaft Saç Dolanması:</strong> Yan fırça altındaki çelik mile sarılan kıllar fırça motorunun zorlanmasına (Error 6) yol açar. Tornavidayla düzenli sökülüp mil temizlenmelidir.`,
      `<strong>🌀 ${b} ${m} Sıcak Suyla Form Düzeltme:</strong> Eğrilen veya katlanan yan fırça kolları 80°C sıcak suda 30 saniye bekletilerek fabrika düzlüğüne kavuşturulabilir.`,
      `<strong>🌀 ${b} ${m} Elastomer Kol Dayanımı:</strong> Aşınmaya dayanıklı esnek silikon kollar süpürgelikleri çizmeden tozları vakum kanalına yönlendirir.`
    ], h);
  }

  if (p === 'mop-bezi') {
    return pick([
      `<strong>🌊 ${b} ${m} Mikrofiber Yoğunluğu:</strong> Özel dokunmuş yüksek emici mikrofiber lifler zeminle temas ederek su damlacıklarını homojen yayar. Yumuşatıcı kullanılmadan yıkanmalıdır.`,
      `<strong>🌊 ${b} ${m} Titreşim ve Baskı Dağılımı:</strong> Mop plakası zemine aktif dikey baskı uygular; yıpranmış veya incelmiş bezler zemin temasını kaybederek leke bırakır.`,
      `<strong>🌊 ${b} ${m} Antibakteriyel Lif Yapısı:</strong> Temizlik bitiminde mop bezi tablada ıslak bırakılmamalıdır; nem bakteriyel kokuya ve küf oluşumuna yol açar.`,
      `<strong>🌊 ${b} ${m} Cırt Cırt Tutunma Gücü:</strong> Taban plakasındaki mikro kancalara tam oturan takviyeli dikiş yapısı, halı kaldırma esnasında bezin kaymasını engeller.`
    ], h);
  }

  if (p === 'toz-torbasi') {
    return pick([
      `<strong>🗑️ ${b} ${m} İstasyon Sızdırmazlık Standardı:</strong> 27.000 Pa boşaltma basıncında toz kaçırmayan meltblown kumaş, istasyon motorunu ince partiküllerden korur.`,
      `<strong>🗑️ ${b} ${m} Hijyenik Sürgülü Kapak:</strong> İstasyon kapağı açıldığında kendiliğinden kapanan sürgü, kullanıcının tozla temas etmeden torbayı çöpe atmasını sağlar.`,
      `<strong>🗑️ ${b} ${m} Doluluk Sensörü Uyumu:</strong> Torba dolduğunda istasyon emiş gücünü sınırlar; 6-8 haftada bir yenilenmesi istasyon türbin sağlığı için zorunludur.`,
      `<strong>🗑️ ${b} ${m} Çok Katmanlı Alerjen Filtreleme:</strong> 3 katmanlı dokusuz kumaş yapısı mikroskobik akarları ve polenleri %99.7 oranında torba içinde kilitler.`
    ], h);
  }

  if (p === 'batarya-pil') {
    return pick([
      `<strong>🔋 ${b} ${m} 4S2P Li-ion Hücre Paketi:</strong> 14.4V nominal gerilim ve ${model.battery || '5200 mAh'} kapasiteye sahip batarya, dahili BMS dengeleme devresiyle şarj-deşarj döngüsünü yönetir.`,
      `<strong>🔋 ${b} ${m} Error 12 ve Voltaj Çöküşü:</strong> 500 döngüyü tamamlayan hücrelerde iç direnç artar; cihaz şarj istasyonuna dönemeden kapanıyorsa batarya yenilenmelidir.`,
      `<strong>🔋 ${b} ${m} Termal Hücre Koruması:</strong> Batarya bloğundaki NTC termistör hücre sıcaklığını ölçer; 45°C üzerine çıkan bataryalar şarjı durdurarak güvenliği sağlar.`,
      `<strong>🔋 ${b} ${m} Derin Deşarj Koruması:</strong> Robot uzun süre dock dışında kapalı bırakılmamalıdır; aşırı deşarj lityum hücrelerin kalıcı uykuya geçmesine neden olur.`
    ], h);
  }

  if (p === 'su-haznesi-filtresi') {
    return pick([
      `<strong>💧 ${b} ${m} Peristaltik Pompa Koruması:</strong> Dahili elektronik mikro pompa kılcal nozullardan su basar. Kireçli musluk suyu nozulları tıkar; arıtılmış su kullanılmalıdır.`,
      `<strong>💧 ${b} ${m} Silikon Sızdırmazlık Valfi:</strong> Su haznesi kapağındaki silikon conta hava kaçırmamalıdır; conta aşındığında robot zemin üzerinde su damlacığı bırakır.`,
      `<strong>💧 ${b} ${m} Kuru Pompa Algılama Uyarısı:</strong> Su bittiğinde pompanın kuru çalışmasını engelleyen manyetik şamandıra sensörü hazne içinde serbest hareket etmelidir.`,
      `<strong>💧 ${b} ${m} Nozul Kireç Çözme Protokolü:</strong> Tıkanan su çıkış deliklerine iğne sokulmamalıdır; ılık arıtılmış suyla periyodik durulama yapılmalıdır.`
    ], h);
  }

  if (p === 'tekerlek-bakimi') {
    return pick([
      `<strong>⚙️ ${b} ${m} 360° Sarhoş Bilye Aksı:</strong> Ön yönlendirici küçük tekerleğin çelik miline sarılan saçlar robotun rotadan sapmasına ve sürtünme sesi çıkarmasına yol açar.`,
      `<strong>⚙️ ${b} ${m} Tahrik Yay Mekanizması:</strong> Sağ ve sol çekiş tekerlekleri 20 mm eşik tırmanma yaylarına sahiptir; yay gerginliği robotun halıya tırmanmasını sağlar.`,
      `<strong>⚙️ ${b} ${m} Kauçuk Sırt Diş Aşınması:</strong> Tekerlek dış lastiği zamanla düzleşir ve parkede patinaj yapar; çekiş lastiği değişimi yön hassasiyetini yeniler.`,
      `<strong>⚙️ ${b} ${m} Optik Enkoder Okuyucu:</strong> Tekerlek motoru içindeki enkoder dönme sayısını okur; tekerlek sıkıştığında Error 7 alarmı devreye girer.`
    ], h);
  }

  if (p === 'temizlik-solusyonu') {
    return pick([
      `<strong>🧪 ${b} ${m} pH 7.0 Nötr Formül:</strong> Robotun plastik su haznesi, silikon çekvalfleri ve mikro pompası aşındırıcı kimyasallara duyarlıdır. Asla çamaşır suyu veya standart yüzey temizleyici eklenmemelidir.`,
      `<strong>🧪 ${b} ${m} Köpürmeyen Akışkan Teknolojisi:</strong> Köpüren deterjanlar su tankında hava kabarcığı yaratarak pompanın kuru çalışmasına ve yanmasına yol açar.`,
      `<strong>🧪 ${b} ${m} 1:200 Hassas Dozaj Kuralı:</strong> Her 1 litre arıtılmış suya 1 kapak (5 ml) eklenmesi, zeminde yapışkanlık ve tekerlek patinajı riskini tamamen önler.`,
      `<strong>🧪 ${b} ${m} Kireç Önleyici Aktif Bileşen:</strong> Özel formül mikro pompa nozullarında kireç kristalleşmesini engelleyerek su püskürtme ömrünü uzatır.`
    ], h);
  }

  if (p === 'sensor-bakimi') {
    return pick([
      `<strong>👁️ ${b} ${m} LDS Lidar Optik Triangülasyon:</strong> Tavandaki döner lazer kulesi 360 derece mesafe ölçümü yapar. Optik ayna tozlandığında harita bozulur ve Error 1 verir.`,
      `<strong>👁️ ${b} ${m} Uçurum Kızılötesi Fotodiyotları:</strong> Alt gövdedeki 4-6 adet düşme sensörü zemine IR ışık gönderir. Koyu halılarda ışık soğurulduğu için sahte alarm üretebilir.`,
      `<strong>👁️ ${b} ${m} Nikel Kaplama Şarj Kontakları:</strong> Robot altındaki ve istasyondaki metal plakalar mikron toz tabakasıyla kaplandığında Error 13 şarj arızası oluşur.`,
      `<strong>👁️ ${b} ${m} Duvar ve Engel ToF Sensörleri:</strong> Robotun sağ kenarındaki duvar takip penceresi süpürgelik mesafesini milimetrik ayarlar; kuru bezle silinmelidir.`
    ], h);
  }

  if (p === 'reset-ve-wifi') {
    return pick([
      `<strong>📶 ${b} ${m} 2.4 GHz Frekans Gereksinimi:</strong> Akıllı robotlar 5 GHz Wi-Fi ağlarını desteklemez. Modem ayarlarından 2.4 GHz bandı ayrı bir SSID ile yayına alınmalıdır.`,
      `<strong>📶 ${b} ${m} Tuş Kombinasyonuyla Ağ Sıfırlama:</strong> Güç ve Şarj (Home) tuşlarına 3 saniye basılı tutulup "Wi-Fi Sıfırlandı" sesli bildirimi duyulmalıdır.`,
      `<strong>📶 ${b} ${m} Pinhole Fabrika Sıfırlaması:</strong> Harita kilitlenmelerinde kapak altındaki reset deliğine ataşla 5 saniye basılması fabrika işletim sistemini yükler.`,
      `<strong>📶 ${b} ${m} IP ve DHCP Kiralama Hatası:</strong> Modeme çok sayıda akıllı cihaz bağlıysa robot IP alamaz; modem yeniden başlatılmalı ve cihaz yaklaştırılmalıdır.`
    ], h);
  }

  if (p === 'hata-kodlari') {
    return pick([
      `<strong>⚠️ ${b} ${m} Arıza Teşhis Protokolü:</strong> Robot süpürgelerde oluşan Error 1 ila Error 18 arası arıza bildirimlerinin %90'ı fırça, filtre veya LDS lazer sensör temizliğiyle servissiz çözülür.`,
      `<strong>⚠️ ${b} ${m} Sesli Hata Bildirimi:</strong> Cihazın sesli alarm vermesi anakartı ve motorları korumak içindir; düzenli sarf malzeme temizliği arıza oluşmasını %90 engeller.`,
      `<strong>⚠️ ${b} ${m} Çarpışma Tamponu ve Süspansiyon Testi:</strong> Robotun kendi etrafında dönmesi veya gerilemesi genellikle tampon mikrosiviçlerinin basılı kalmasından kaynaklanır.`,
      `<strong>⚠️ ${b} ${m} Vakum Türbin Emniyeti (Error 10):</strong> Hava akışındaki en küçük direnç bile diferansiyel basınç sensörünü tetikler; kuru ve temiz filtre şarttır.`
    ], h);
  }

  return `<strong>⚠️ ${b} ${m} Bakım Protokolü:</strong> Orijinal standarttaki sarf malzeme kullanımı cihazın mekanik ömrünü uzatır.`;
}

module.exports = {
  getPartHardwareCallout
};
