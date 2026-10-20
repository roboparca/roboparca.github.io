// lib/content/troubleshoot.js - 4 Distinct Procedural Urgency & Troubleshooting Notes per Category
const { simpleHash, pick } = require('./helpers');

function getTroubleshootNote(model, part) {
  const p = part.slug;
  const b = model.brand;
  const m = model.name;
  const isDysonCordless = b.toLowerCase() === 'dyson' && !m.includes('360');
  const h = simpleHash(`${model.slug}-${p}-note-v10`);

  if (isDysonCordless) {
    if (p === 'hepa-filtre') {
      return pick([
        `Tıkanmış veya nemli bırakılmış filtre motor hava akışını boğar, emiş gücünü %40 düşürür ve cihazın motor emniyet devresini (pulsing) tetikleyerek aşırı ısınmasına yol açar.`,
        `Dyson dijital motorlar hava soğutmalıdır. Filtre gözenekleri mikro tozla dolduğunda soğutma yetersiz kalır ve motor sargıları kalıcı hasar görebilir.`,
        `Filtrenin 24 saat tam kurutulmadan takılması, 110.000 devirli fan kanatlarına nem sıçratarak rulman korozyonuna ve ağır kokuya sebep olur.`,
        `Düzenli yıkanmayan filtreler bataryanın aşırı akım çekmesine ve şarjın 5-10 dakikada tükenmesine yol açar; periyodik değişim motoru güvenceye alır.`
      ], h);
    }
    if (p === 'ana-firca') {
      return pick([
        `Aşınmış veya rulmanına saç dolanmış fırça silindiri doğrudan tahrik motorunu zorlar, yüksek batarya tüketir ve sert zeminleri çizebilir.`,
        `Rulman kovanına sarılan saçlar yüksek sürtünme ısısı yaratarak plastik başlık yuvasını eritebilir; haftalık saç temizliği şarttır.`,
        `Kılları dökülmüş veya kauçuk sıyırıcısı yıpranmış rulo halı liflerindeki gömülü tozu çekemez ve süpürme verimini yarıya indirir.`,
        `Fırça rulonun kilitlenmesi başlık koruma kartını devreye sokar; serbest dönüşü sağlamak için rulman yuvaları düzenli arındırılmalıdır.`
      ], h);
    }
    if (p === 'batarya-pil') {
      return pick([
        `Lityum hücrelerin kimyasal ömrü dolduğunda voltaj çöküşü yaşanır; 32x kırmızı flaş uyarısı bataryanın kalıcı kilitlendiğini gösterir.`,
        `MAX modunda süpürgenin 1-2 dakikada kapanması hücre iç direncinin arttığını belgeler; yeni bir batarya paketi takılması zorunludur.`,
        `Aşırı ısınan bataryayı hemen şarja takmak hücre ömrünü kısaltır; kullanım sonrası 20 dakika soğuma süresi tanınmalıdır.`,
        `Derin deşarja uğramış piller cihazı çalıştırmaz; sertifikalı yedek batarya süpürgenin çalışma süresini ilk günkü seviyesine getirir.`
      ], h);
    }
    if (p === 'hata-kodlari' || p === 'reset-ve-wifi') {
      return pick([
        `Dyson kablosuz süpürgelerde donanım kilitlenmelerinin %90’ı hava yollarının, filtrelerin ve rulman yataklarının temizlenmesiyle giderilir; yetkili servise gitmeden önce rehberdeki adımları uygulayınız.`,
        `Motorun kesik kesik çalışması arıza değil emniyet protokolüdür; filtre yıkanıp boru içi boşaltıldığında süpürge anında normale döner.`,
        `Batarya LED sinyalleri arızanın yerini net olarak belirtir; gereksiz motor değişimi masrafı yapmadan önce LED flaş sayısını tablodan doğrulayınız.`,
        `Tetik mandalı takılması veya hava klapesi kilitlenmesi evde 5 dakikada çözülebilen mekanik durumlardır; basit kontrollerle cihazı sıfırlayabilirsiniz.`
      ], h);
    }
    return pick([
      `Orijinal standarttaki uyumlu sarf malzemeler hava sızdırmazlığını sağlayarak siklonik emiş gücünü korur ve motor ömrünü uzatır.`,
      `Doğru oturmayan yan sanayi kalitesiz parçalar hava kaçağına ve motorun aşırı ısınmasına yol açabilir.`
    ], h);
  }

  // ROBOT VACUUMS (12 Categories)
  if (p === 'hepa-filtre') {
    return pick([
      `Tıkanmış veya yıpranmış filtre motor hava akışını boğar, emiş gücünü %40 düşürür ve cihazın aşırı ısınıp Error 10 arızası vermesine yol açar.`,
      `Filtrenin ıslak takılması vakum türbinine nem kaçırarak motor rulmanlarının paslanmasına ve kalıcı elektronik arızaya neden olur.`,
      `Gözenekleri dolmuş filtreler hazne içi vakum basıncını düşürür; robot zeminlerdeki tozu çekemeyerek arkasında kalıntı bırakır.`,
      `Zamanında değiştirilmeyen filtre kartuşu motorun aşırı akım çekmesine ve batarya şarjının hızla tükenmesine yol açar.`
    ], h);
  }

  if (p === 'ana-firca') {
    return pick([
      `Aşınmış veya saç dolanmış ana fırça motor dişlilerini zorlar, yüksek enerji tüketir ve zeminleri çizebilir; Error 5 hatasını tetikler.`,
      `Rulman yan kapakları altına sarılan saç telleri fırça şaftını kilitleyerek anakart sürücü devresinin aşırı ısınmasına sebep olur.`,
      `Kauçuk kanatçıkları yıpranan fırça zeminle hava perdesini kaybeder ve halı diplerindeki kum partiküllerini vakum kanalına aktaramaz.`,
      `Fırça kafesi telleri arasına kaçan yabancı cisimler rulonun dönmesini engeller; haftalık fırça temizliği robotun ömrünü iki katına çıkarır.`
    ], h);
  }

  if (p === 'yan-firca') {
    return pick([
      `Altıgen tahrik miline saç dolanması yan fırça motorunun aşırı akım çekmesine, Error 6 arızasına ve redüktör dişlisinin sıyırmasına neden olur.`,
      `Bükülen ve aşınan yan fırça kolları süpürgelik diplerine ulaşamaz; tozları ana fırçaya iletemeyerek köşe temizliğini aksatır.`,
      `Gevşek bırakılan yan fırça vidası fırçanın halıya takılıp yuvasından fırlamasına ve tahrik şaftının aşınmasına yol açar.`,
      `Kolları kopmuş bir yan fırça robotun dengesiz savurma yapmasına sebep olur; 3-6 ayda bir yenilenmesi önerilir.`
    ], h);
  }

  if (p === 'mop-bezi') {
    return pick([
      `Yıpranmış mop bezi zemine eşit baskı uygulayamaz ve su lekesi bırakır; nemli bırakılan bezler bakteriyel koku ve küf yapar.`,
      `Mikrofiber lifleri keçeleşen paspas suyu homojen ememez; parke yüzeylerde aşırı su göllenmesine veya kuru kalmasına neden olur.`,
      `Cırt cırt tutucusu zayıflayan bez halı geçişlerinde kayarak fırlar ve robotun tekerleklerine dolanabilir.`,
      `Yumuşatıcı ile yıkanmış mop bezleri su geçirgenliğini kaybederek zemin silme performansını sıfırlar; düzenli yenilenmelidir.`
    ], h);
  }

  if (p === 'toz-torbasi') {
    return pick([
      `Dolan toz torbası istasyon emiş türbinini zorlar, aşırı ısınmaya sebep olur ve toz sızdırarak motor koruma filtresini tıkar.`,
      `Meltblown kumaş yırtılması durumunda istasyonun 27.000 Pa vakum motoru tozu içine çekerek kalıcı motor yanmasına yol açar.`,
      `Zamanında değiştirilmeyen torbalar istasyon içinde kötü koku yayar ve robot haznesinin tam boşaltılmasını engeller.`,
      `Sürgülü kilidi düzgün takılmayan torbalar hava kaçağı yaratarak boşaltma döngüsünün arızayla sonuçlanmasına neden olur.`
    ], h);
  }

  if (p === 'batarya-pil') {
    return pick([
      `Kapasitesi düşen batarya robotun temizliği tamamlayamadan yolda kalmasına ve Error 12 düşük voltaj uyarısına sebep olur.`,
      `500 döngüyü aşmış pillerde hücre voltaj dengesizliği oluşur; robot şarj dockuna yanaşamadan aniden güç kaybedebilir.`,
      `Aşırı ısınan bataryalar güvenlik sensörlerini tetikler; tam kapasiteli yedek pil robotun tek şarjla menzilini iki katına çıkarır.`,
      `Robotun dock dışında prizden çekilmiş bırakılması lityum hücrelerin derin deşarja girmesine ve kalıcı bozulmasına yol açar.`
    ], h);
  }

  if (p === 'su-haznesi-filtresi') {
    return pick([
      `Kireçli su kullanımı veya tıkalı filtre mikro pompanın kuru çalışmasına, zorlanmasına ve paspaslama esnasında su basmamasına yol açar.`,
      `Su tankı contalarının aşınması parke zeminlere su sızmasına ve robot tabanındaki elektronik aksamın nemlenmesine sebep olur.`,
      `Manyetik şamandıranın kireçlenmesi hazne dolu olsa bile cihazın "Su tankı boş" uyarısı vererek durmasına neden olur.`,
      `Standart deterjan kullanımı silikon valfleri eritir; pompa sağlığı için daima pH nötr robot solüsyonu kullanılmalıdır.`
    ], h);
  }

  if (p === 'tekerlek-bakimi') {
    return pick([
      `Tekerlek aksına saç dolanması motorun aşırı akım çekerek Error 7 vermesine, robotun kendi etrafında dönmesine ve rotanın kaymasına neden olur.`,
      `Ön sarhoş bilye aksının kilitlenmesi tekerleğin dönmeden sürüklenmesine ve parke zeminlerin çizilmesine yol açar.`,
      `Aşınmış çekiş lastikleri robotun ıslak zeminde patinaj yapmasına, kapı eşiklerine tırmanamamasına ve haritanın bozulmasına sebep olur.`,
      `Süspansiyon yaylarının sıkışması robotun düz zeminde olduğu halde Error 3 tekerlek askıda uyarısı vermesine yol açar.`
    ], h);
  }

  if (p === 'temizlik-solusyonu') {
    return pick([
      `Normal çamaşır suyu veya standart yüzey temizleyiciler su pompasını aşındırıp contaları eriterek garantiyi bozar; özel solüsyon zorunludur.`,
      `Köpüren deterjanlar su kanallarında hava kilidi (kavitasyon) oluşturarak mikro pompanın yanmasına ve su püskürtmemesine sebep olur.`,
      `Aşırı dozajda kullanılan kimyasallar zeminde yapışkan bir film bırakır; tekerlekler patinaj yapar ve harita çarpılır.`,
      `Kireç önleyici özel formül dahili su nozullarını açık tutarak cihazın paspaslama ömrünü uzatır.`
    ], h);
  }

  if (p === 'sensor-bakimi') {
    return pick([
      `Tozlanan şarj kontakları cihazın şarj olmamasına (Error 13); kirli düşme sensörleri ise robotun merdivenden düşmesine veya koyu halıda durmasına neden olur.`,
      `LDS lazer kulesi optik aynalarının kirlenmesi navigasyonu körleştirir; robot odaları karıştırdığında veya Error 1 verdiğinde optik temizlik şarttır.`,
      `Duvar ToF sensörünün tozla kaplanması süpürgenin süpürgeliklere çarpmasına veya kenar takibini yarıda bırakmasına yol açar.`,
      `Ön engel kameralarının mikrofiber bezle periyodik silinmesi mobilyalara sert çarpma riskini ortadan kaldırır.`
    ], h);
  }

  if (p === 'reset-ve-wifi') {
    return pick([
      `Cihaz Ağa Bağlanamıyor veya haritayı ters çevirip kayboluyorsa fabrika ayarlarına sıfırlama ve 2.4 GHz eşleştirmesi tek kalıcı çözümdür.`,
      `Modem IP çakışması robotun çevrimdışı kalmasına neden olur; modemi yeniden başlatıp Wi-Fi sıfırlama adımlarını uygulamak bağlantıyı onarır.`,
      `Yazılım kilitlenmelerinde pinhole deliğinden reset atmak cihazı fabrika çıkış firmware sürümüne döndürerek hafızayı temizler.`,
      `Çift bantlı modemlerde 5 GHz bandının geçici kapatılması robotun kurulum aşamasında takılmasını %100 engeller.`
    ], h);
  }

  if (p === 'hata-kodlari') {
    return pick([
      `Hata kodunun doğru tespiti gereksiz yere yüksek servis ve anakart değişim ücreti ödemenizi engeller; arızaların %90'ı sarf malzeme temizliğiyle çözülür.`,
      `Sesli ikazlar robotun motor ve devrelerini korumak için tasarlanmıştır; mekanik engeli giderip cihazı yeniden başlatmak sistemi açar.`,
      `Error 1-18 arası hata kodlarında robotu zorlamadan tablodaki kontrol listesini uygulayınız; çoğu hata saç temizliğiyle anında giderilir.`,
      `Servise göndermeden önce fırça, filtre ve sensör camlarını temizleyip şarj docku üzerinde test etmek gereksiz masrafları önler.`
    ], h);
  }

  return `Orijinal standarttaki sarf malzeme kullanımı cihazın mekanik ömrünü uzatır ve arızaları engeller.`;
}

module.exports = {
  getTroubleshootNote
};
