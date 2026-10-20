// lib/content/deep-guides.js - 4 Research-Backed Technical Engineering Tracks per Category
const { simpleHash } = require('./helpers');

function getDeepEngineeringGuide(model, part) {
  const p = part.slug;
  const brand = model.brand;
  const name = model.name;
  const isDysonCordless = brand.toLowerCase() === 'dyson' && !name.includes('360');
  const track = simpleHash(`${model.slug}-${p}-deep-v10`) % 4;

  if (p === 'hepa-filtre') {
    if (isDysonCordless) {
      const dysonFilterTracks = [
        `
          <h3>🔬 Dyson Siklonik Ayrıştırma ve HEPA Filtrasyon Dinamikleri</h3>
          <p>
            Dyson dikey kablosuz süpürgelerde temizlik performansı, motorun ürettiği 100.000+ RPM devir ile siklon konilerinde oluşturulan 79.000g merkezkaç kuvvetine dayanır. <strong>${brand} ${name}</strong> hava akışında kaba partiküller şeffaf haznede çökerken, mikroskobik polen, akar ve 0.3 mikron boyutundaki alerjenler ön çubuk filtre ve arka egzoz HEPA filtre tarafından yakalanır.
          </p>
          <p>
            Filtre lifleri mikron seviyesinde tozla dolduğunda süpürgenin hava debisi düşer. Dyson dijital motorları hava soğutmalı olduğundan, filtre tıkandığında motor aşırı ısınmayı önlemek için anında <strong>kesik kesik çalışma (pulsing / ritmik vut-vut sesi)</strong> emniyet moduna geçer. Filtrelerin en az ayda bir soğuk musluk suyuyla yıkanması ve radyatörsüz ortamda <strong>tam 24 saat kurutulması</strong> motorun yanmasını önler.
          </p>
        `,
        `
          <h3>🛡️ Motor Soğutma Mimarisi ve İki Kademeli Filtre Emniyeti</h3>
          <p>
            <strong>${brand} ${name}</strong> serisinde hava filtrasyonu iki bağımsız bariyerden oluşur: Siklon merkezindeki yıkanabilir silindirik ön filtre ve motor egzozundaki pileli HEPA filtre. Ön filtre siklondan kaçan ince pudra kıvamındaki tozu tutarken, egzoz filtresi motor kömürsüz sürücü devrelerinin dışarıya partikül vermesini engeller.
          </p>
          <p>
            Filtrelerin nemli takılması Dyson süpürgelerde karşılaşılan en büyük kullanıcı hatasıdır. Nem, yüksek devirli motor fan kanatçıklarına ulaştığında statik tozla birleşerek rulman korozyonuna ve kalıcı kötü kokuya yol açar. Yılda bir yapılacak orijinal standartta filtre değişimi, hava debisini %100 fabrika seviyesinde tutar.
          </p>
        `,
        `
          <h3>🌀 0.3 Mikron Partikül Yakalama ve Siklon Basınç Dengesi</h3>
          <p>
            Dyson'ın patentli Radial Root Cyclone™ teknolojisi hava hızını artırarak filtreye binen yükü hafifletir. Ancak un, alçı tozu ve kedi kumu gibi ultra ince partiküller filtre liflerinin arasına hapsolarak gözenekleri zamanla kilitler. <strong>${brand} ${name}</strong> bu durumda hava akış kaybı uyarısı vererek bataryanın aşırı ısınmasını engeller.
          </p>
          <p>
            Yıkama esnasında asla fırça veya deterjan kullanılmamalıdır; deterjan artıkları E11/H12 filtre zarının elektrostatik liflerini parçalar. Su berrak akana kadar durulayıp hava alan bir odada kurutmak filtrenin lif ömrünü maksimize eder.
          </p>
        `,
        `
          <h3>⚙️ Akustik Yalıtım, Hava Akış Aerodinamiği ve Çekiş Stabilitesi</h3>
          <p>
            <strong>${brand} ${name}</strong> arka HEPA filtresi yalnızca hava temizliği sağlamaz; aynı zamanda motor egzozundan çıkan yüksek frekanslı ses dalgalarını sönümleyen bir akustik baffle görevi görür. Orijinal olmayan kalitesiz filtreler ses seviyesini 5 ila 8 desibel artırır.
          </p>
          <p>
            Hava geçiş direncini ideal dengede tutan sertifikalı filtreler, bataryanın tek şarjla sağladığı süpürme süresini doğrudan korur. Motorun hava emmek için ekstra akım çekmesini önleyerek hücre yıpranmasını azaltır.
          </p>
        `
      ];
      return dysonFilterTracks[track];
    }

    const robotFilterTracks = [
      `
        <h3>🔬 E11/H12 HEPA Filtrasyon Standartları ve Diferansiyel Basınç</h3>
        <p>
          Akıllı robot süpürgelerde hava akışı, küçük gövde içerisine yerleştirilen ${model.suction} gücündeki fırçasız Nidec/bldc türbin motoruyla sağlanır. <strong>${brand} ${name}</strong> ${model.filterSize} boyutundaki HEPA filtre kartuşu, 0.3 mikrometreye kadar olan partikülleri %99.2 oranında yakalayan mikro fiber dokudan üretilmiştir.
        </p>
        <p>
          Toz haznesi dolduğunda veya filtre gözenekleri tıkandığında hazne içi vakum basıncı düşer. Robot üzerindeki basınç algılayıcı devre, motorun aşırı ısınıp sargılarının zarar görmesini engellemek için sesli veya uygulamadan <strong>"Error 10: Filtre tıkalı veya ıslak"</strong> uyarısı üretir.
        </p>
      `,
      `
        <h3>🛡️ Yıkanabilir PTFE Zarlı Filtre Bakımı ve 24 Saat Kuralı</h3>
        <p>
          <strong>${brand} ${name}</strong> filtre panelinde suya dayanıklı PTFE (teflon) laminasyonlu mikro doku kullanılır. Bu sayede filtre soğuk musluk suyu altında hafifçe durulanabilir. Ancak yıkama esnasında kesinlikle fırça sürülmemeli, parmakla ovalanmamalı ve deterjan değdirilmemelidir; sürtünme mikro gözeneklerin yırtılmasına neden olur.
        </p>
        <p>
          Yıkanan filtrenin kurumadan cihaza takılması motor fanına mikron seviyesinde su damlacığı çekilmesine yol açar. Yüksek devirli fırçasız motora nem kaçması türbin rulmanlarını paslandırarak geri dönülemez motor arızalarına sebep olur. Filtre en az 24 saat oda sıcaklığında gölgede kurutulmalıdır.
        </p>
      `,
      `
        <h3>🌀 Türbin Vakum Dinamiği ve Sürekli Emiş Verimliliği</h3>
        <p>
          Zamanla filtre lifleri arasına sıkışan mikroskobik un, polen ve kireç tozu yıkamayla tamamen çıkmaz. 3 ila 6 aylık kullanım sonucunda filtrenin hava geçirgenliği %30 ila %45 oranında kalıcı olarak azalır. Bu durum <strong>${brand} ${name}</strong> cihazının zemin temizleme verimini düşürürken batarya tüketimini artırır.
        </p>
        <p>
          Düzenli periyotlarla takılan yeni bir orijinal uyumlu filtre kartuşu, hava devridaimini fabrikasyon değerlerine getirerek robotun tek şarjla süpürebildiği metrekare alanını korur.
        </p>
      `,
      `
        <h3>⚙️ Toz Haznesi Conta Sızdırmazlığı ve Türbin Emniyeti</h3>
        <p>
          Filtre çerçevesindeki elastomerik silikon conta, çekilen kirli havanın filtreyi baypas ederek doğrudan motora kaçmasını engeller. <strong>${brand} ${name}</strong> filtre yuvasındaki contada yırtık veya esneme olduğunda motor bölmesine toz sızar ve fan kanatçıklarına yapışarak balans bozukluğu yaratır.
        </p>
        <p>
          Filtre takılırken tırnakların tam kilitlendiğinden ve contanın hazne kenarına tam oturduğundan emin olunmalıdır. Çift filtre kullanımı (biri kururken diğerinin takılması) süpürgenin aralıksız ve güvenle çalışmasını sağlar.
        </p>
      `
    ];
    return robotFilterTracks[track];
  }

  if (p === 'ana-firca') {
    if (isDysonCordless) {
      const dysonRollerTracks = [
        `
          <h3>🔬 Dyson Motorhead ve Doğrudan Tahrikli Rulo Teknolojisi</h3>
          <p>
            Dyson kablosuz süpürgelerin ana zemin başlığı, fırça çubuğunun içerisine yerleştirilmiş doğrudan tahrikli (Direct Drive) bağımsız bir elektrik motoruyla çalışır. <strong>${brand} ${name}</strong> motorlu başlığında yer alan sert naylon kıllar halı liflerinin derinliklerine nüfuz ederek gömülü kirleri sökerken, antistatik karbon fiber filamentler sert zeminlerdeki mikron tozu toplar.
          </p>
          <p>
            Rulo yataklarına saç ve ip dolandığında motor mili üzerinde sürtünme torku katlanarak artar. Bu durum bataryanın çok hızlı tükenmesine ve aşırı ısınan başlık koruma devresinin fırçayı kilitlenmesine neden olur. Madeni parayla yan kapak sökülerek rulman yuvası düzenli temizlenmelidir.
          </p>
        `,
        `
          <h3>🛡️ Rulman Yuvası Koruma ve Karbon Fiber Statik Deşarjı</h3>
          <p>
            <strong>${brand} ${name}</strong> Soft Roller (Fluffy) başlıklarında kullanılan yumuşak dokuma naylon kumaş, parke ve seramik gibi hassas yüzeyleri parlatırken büyük döküntüleri içine hapseder. Fırça şaftındaki yüksek devirli çelik rulman, saç dolanmalarına karşı labirent conta tasarımıyla korunur.
          </p>
          <p>
            Rulonun suya sokularak yıkanması durumunda iç rulman paslanabilir; bu nedenle yalnızca rulo kumaşı yıkanmalı, rulman mekanizması sıvı temasından kesinlikle uzak tutulmalıdır.
          </p>
        `,
        `
          <h3>🌀 Tork Aşırı Yük Koruması ve Başlık Elektronik Kartı</h3>
          <p>
            Başlık içerisinde yer alan mikro elektronik denetleyici, rulonun dönme direncini sürekli izler. Halı saçağı veya çorap gibi nesneler sıkıştığında devre aşırı akım hissederek ana gövdeden gelen gücü keser.
          </p>
          <p>
            Bu koruma devreye girdiğinde tetiği bırakıp nesneyi rulodan çıkarmak yeterlidir. Aşınmış veya kılları dökülmüş bir rulo zeminle olan sürtünme dengesini bozduğundan periyodik olarak yenilenmelidir.
          </p>
        `,
        `
          <h3>⚙️ Zemin Basınç Dağılımı ve Emiş Kanalı Sızdırmazlığı</h3>
          <p>
            Başlığın altındaki döner mafsal ve esnek körük borusu, rulonun zemine her açıda tam paralel temas etmesini sağlar. <strong>${brand} ${name}</strong> yedek rulo seçerken milimetrik çap toleransı hava kaçağını engellemek için hayati önem taşır.
          </p>
          <p>
            Orijinal standarttaki rulo silindiri fırça yuvasına boşluksuz oturur ve türbinin ürettiği yüksek emiş gücünü zemin yüzeyine kayıpsız odaklar.
          </p>
        `
      ];
      return dysonRollerTracks[track];
    }

    const robotRollerTracks = [
      `
        <h3>🔬 Rulo Fırça Kinematiği: Kauçuk Bıçak vs. Kıl Fırça Mimarisi</h3>
        <p>
          Robot süpürgelerde yer temizliği, vakum emişi ile zeminle temas eden ana fırçanın mekanik süpürme torkunun senkronizasyonuyla gerçekleşir. <strong>${brand} ${name}</strong> serisinde kullanılan ${model.roller || 'yüksek verimli silindir'} tasarımı, sert zeminlerdeki tozu sıyırırken halı dokusunun derinliklerindeki kum ve evcil hayvan tüylerini sarsarak vakum kanalına fırlatır.
        </p>
        <p>
          Fırçanın her iki ucunda yer alan rulman yatakları saç ve lif dolanmalarına en açık bölgelerdir. Saçlar rulman içine sarıldığında motor dişli kutusu (gearbox) aşırı akım çeker ve sistem kendini korumak için <strong>"Error 5: Ana fırça sıkıştı"</strong> ikazı vererek durur.
        </p>
      `,
      `
        <h3>🛡️ Çıkarılabilir Yan Rulman Kapakları ve Aşırı Akım Koruması</h3>
        <p>
          <strong>${brand} ${name}</strong> ana fırçasının en büyük mühendislik avantajı, fırça uçlarındaki yatak kapaklarının tırnaklı veya geçmeli olarak sökülebilmesidir. Bu kapaklar çıkarıldığında, çelik mil etrafına dolanan ve bıçakla kesilemeyen kıl yumakları saniyeler içinde temizlenebilir.
        </p>
        <p>
          Rulman yuvalarının temiz tutulması fırça motorunun çalışma sıcaklığını 15°C düşürür. Bu durum anakart üzerindeki motor sürücü entegrelerinin ömrünü uzatarak robotun batarya menzilini doğrudan korur.
        </p>
      `,
      `
        <h3>🌀 DuoRoller ve Çift Zıt Yönlü Fırça Dinamikleri</h3>
        <p>
          Modern robot süpürgelerde kullanılan zıt yönlü çift kauçuk rulo sistemi, saç dolanmasını %80 oranında engeller. Kauçuk kanatçıklar saç tellerini kesmeden rulman uçlarına doğru kaydırır; bu sayede emiş kanalının tıkanması önlenir.
        </p>
        <p>
          Aşınan kauçuk bıçaklar zeminle olan hava perdesini kaybeder. Yılda bir yapılacak ana fırça değişimi, ${model.suction} vakum gücünün halı liflerine tam odaklanmasını sağlar.
        </p>
      `,
      `
        <h3>⚙️ Yüzer Fırça Kafesi (Floating Brush) ve Zemin Düzensizlikleri</h3>
        <p>
          <strong>${brand} ${name}</strong> fırça modülü gövdeden bağımsız olarak aşağı yukarı 15 mm hareket edebilen yaylı "yüzer" bir kafes içine yerleştirilmiştir. Bu mimari, fayans derzleri veya halı geçiş profillerinde fırçanın zemin temasını kesintisiz sürdürmesini temin eder.
        </p>
        <p>
          Kafes altındaki tel koruyucular kabloların fırçaya dolanmasını engeller. Aşınmış veya eğrilmiş kafes telleri zemini çizebileceğinden kontrol edilmeli ve temiz tutulmalıdır.
        </p>
      `
    ];
    return robotRollerTracks[track];
  }

  if (p === 'yan-firca') {
    const sideBrushTracks = [
      `
        <h3>🌀 Köşe Süpürme Algoritması ve Değişken Devir Kontrolü</h3>
        <p>
          Akıllı navigasyon sistemine sahip <strong>${brand} ${name}</strong>, odanın sınırlarını çizerken duvar takip sensörünü (Wall ToF Sensor) kullanarak süpürgeliklere 10 mm mesafede sabit hızla ilerler. Bu esnada yan fırça süpürgelik diplerindeki tozu ana fırçanın emiş hattına fırlatmak için 330 RPM devirle döner.
        </p>
        <p>
          Robot açık alana çıktığında ise savurma etkisini önlemek için fırça devrini otomatik olarak 130 RPM seviyesine düşürür. Yan fırçanın esnek elastomer kolları, zemine çizik atmadan sürtünmeyi minimumda tutacak mekanik esneklikte üretilmiştir.
        </p>
      `,
      `
        <h3>🛡️ Altıgen Tahrik Şaftı ve Motor Aşırı Yük Koruması</h3>
        <p>
          Yan fırça, redüktörlü küçük bir DC motorun altıgen pirinç veya çelik tahrik miline vidalanır. <strong>${brand} ${name}</strong> süpürme yaparken saç telleri yan fırça göbeğinin altına doğru sarılır.
        </p>
        <p>
          Zamanla biriken saçlar şaft contasına baskı yaparak motorun dönmesini engeller ve robot <strong>"Error 6: Yan fırça sıkıştı"</strong> uyarısı verir. Periyodik olarak yıldız tornavidayla fırça sökülmeli ve mil etrafındaki lifler cımbızla temizlenmelidir.
        </p>
      `,
      `
        <h3>💧 80°C Sıcak Su ile Bükülen Kolları Geri Kazanma Protokolü</h3>
        <p>
          Halı kenarlarına takılma veya kargo kutusu içinde basınca maruz kalma nedeniyle yan fırça kolları bükülebilir veya kıvrılabilir. Eğrilen kollar zeminle temas edemediği için köşe süpürme performansı %60 düşer.
        </p>
        <p>
          Termoplastik hafızaya sahip silikon ve naylon kollar, 80°C sıcak su dolu bir kapta 30 ila 60 saniye bekletildiğinde moleküler yapısı gevşeyerek ilk günkü fabrikasyon düzlüğüne ve formuna geri döner.
        </p>
      `,
      `
        <h3>⚙️ Silikon 5 Kollu vs. Naylon 3 Kollu Fırça Karşılaştırması</h3>
        <p>
          Geleneksel 3 kollu naylon fırçalar sert kıllarla toz toplarken, modern 5 kollu silikon fırçalar elastik sıyırıcı yapısıyla halı püsküllerine takılmadan kayar. <strong>${brand} ${name}</strong> donanımına tam oturan orijinal vidalı veya tırnaklı montaj kiti sessiz çalışmayı garanti eder.
        </p>
        <p>
          Kollar koptuğunda veya aşırı yıprandığında değiştirilen yeni bir yan fırça, süpürgenin köşe temizlik skorunu en üst seviyeye taşır.
        </p>
      `
    ];
    return sideBrushTracks[track];
  }

  if (p === 'mop-bezi') {
    const mopTracks = [
      `
        <h3>🌊 VibraRise ve Sonic Titreşimli Zemin Baskı Mekaniği</h3>
        <p>
          Geleneksel robotların pasif bez sürüklemesinin aksine <strong>${brand} ${name}</strong>, zemine dakikada 3.000 kez yüksek frekanslı sonik titreşim (Sonic Mopping) uygular ve 600 gramlık dikey baskı yapar. Bu dinamik ovma hareketi, kurumuş kahve, şurup ve çamur lekelerini yüzeyden mekanik olarak söker.
        </p>
        <p>
          Mop bezi yıprandığında veya lifleri inceldiğinde titreşim enerjisi zemine iletilemez ve yüzeyde su çizgileri kalır. Yüksek yoğunluklu dokuma mikrofiber bez, titreşimi tüm plaka yüzeyine eşit olarak yayar.
        </p>
      `,
      `
        <h3>🛡️ Mikrofiber Kılcal Emicilik ve Çift Dokulu Yıkama Protokolü</h3>
        <p>
          Mop bezinde kullanılan kompozit mikrofiber lifler, kendi ağırlığının 5 katı kadar suyu bünyesinde tutabilen kılcal kanallara sahiptir. Sert zeminlerdeki ince tozu ve yağ tabakasını deterjan gerektirmeden içine hapseder.
        </p>
        <p>
          Mop bezinin temizliğinde kesinlikle çamaşır yumuşatıcısı kullanılmamalıdır; yumuşatıcılar mikrofiber gözeneklerini silikon tabakasıyla kaplayarak su emiciliği tamamen yok eder. 40°C ılık suda doğal sabunla yıkanıp kurutulmalıdır.
        </p>
      `,
      `
        <h3>🌀 Döner Çift Disk (Spinning) Mop ve Santrifüj Su Dağılımı</h3>
        <p>
          Döner diskli paspas sistemine sahip robot modellerinde, dakikada 180 devirle dönen iki dairesel mikrofiber ped zemin üzerinde zıt yönlü tork oluşturur. Bu hareket zemin üzerindeki yapışkan kirleri merkezkaç kuvvetiyle dışarı doğru atar.
        </p>
        <p>
          Cırt cırt tutunma yüzeyinin aşınması disklerin dönüş esnasında fırlamasına neden olabilir; takviyeli arka taban kumaşına sahip yedek pedler bu riski ortadan kaldırır.
        </p>
      `,
      `
        <h3>⚙️ Halı Tanıma Otomatik Mop Kaldırma (Auto-Lifting) Toleransı</h3>
        <p>
          <strong>${brand} ${name}</strong> ultrasonik halı sensörü halıyı algıladığında, mop tablasını 5 mm ila 10 mm yukarı kaldırarak halıların ıslanmasını önler. Kalın ve standart dışı mop bezleri bu kaldırma payını aşarak halıya sürtünebilir.
        </p>
        <p>
          Orijinal mikron kalınlığına sahip yedek mop bezleri, kaldırma mekanizmasının toleranslarıyla %100 uyumlu çalışarak halı üzerinde sürtünme direncini sıfırlar.
        </p>
      `
    ];
    return mopTracks[track];
  }

  if (p === 'toz-torbasi') {
    const bagTracks = [
      `
        <h3>🗑️ Otomatik Boşaltma İstasyonu ve 27.000 Pa Hava Debisi</h3>
        <p>
          Otomatik çöp boşaltma istasyonları, robot gövdesindeki hazneyi 15-20 saniye içinde boşaltabilmek için 1000W gücünde ve 27.000 Pa emiş üreten devasa bir vakum türbini çalıştırır. <strong>${brand} ${name}</strong> istasyon toz torbası, bu yüksek debili hava akışına yırtılmadan dayanacak güçlendirilmiş meltblown kumaştan üretilmiştir.
        </p>
        <p>
          Sıradan kağıt torbalar bu yüksek basınç altında mikro deliklerden patlayarak istasyonun motor filtresine toz kaçırır ve türbin motorunun yanmasına neden olur. Çok katmanlı dokusuz kumaş (non-woven) yüksek basınca tam direnç gösterir.
        </p>
      `,
      `
        <h3>🛡️ Çok Katmanlı Meltblown Filtrasyonu ve Sızdırmaz Kilit</h3>
        <p>
          Torba kumaşı 3 ila 4 farklı filtreleme katmanından oluşur: Kaba döküntüleri tutan dış spunbond katman, 0.3 mikron polen ve akarları hapseden elektrostatik meltblown orta katman ve mukavemet sağlayan iç astar.
        </p>
        <p>
          Torbanın plastik bağlantı boğazında yer alan kauçuk conta ve çekildiğinde otomatik kapanan sürgülü kapak mekanizması, torba çöpe atılırken tozun ortama kaçmasını %100 engeller.
        </p>
      `,
      `
        <h3>🌀 2.5L - 3.0L Kapasite Optimizasyonu ve Doluluk Basınç Algısı</h3>
        <p>
          İstasyon içerisinde yer alan hava basınç sensörü, torba tamamen dolduğunda artan direnci algılayarak mobil uygulamaya bildirim gönderir. <strong>${brand} ${name}</strong> için tasarlanan 2.5L ila 3.0L hacmindeki torbalar, ortalama bir evde 6 ila 8 hafta boyunca temas gerektirmeyen temizlik sağlar.
        </p>
        <p>
          Aşırı dolmuş torbayla istasyonu çalıştırmaya devam etmek motorun soğumasını engeller; bu nedenle periyodik kontrol yapılarak torba zamanında yenilenmelidir.
        </p>
      `,
      `
        <h3>⚙️ Aktif Karbon Katman ve Kötü Koku Nötralizasyonu</h3>
        <p>
          Haftalarca istasyon torbasında bekleyen evcil hayvan tüyleri ve organik döküntüler nemle birleştiğinde kötü koku yayabilir. Yüksek kaliteli yedek torbalarda bulunan aktif karbon emdirilmiş lifler, organik kokuları moleküler seviyede hapseder.
        </p>
        <p>
          Hava çıkış kanalındaki egzoz filtresiyle birlikte çalışan sistem, evin havasına tozsuz ve ferah bir egzoz çıkışı sağlar.
        </p>
      `
    ];
    return bagTracks[track];
  }

  if (p === 'batarya-pil') {
    if (isDysonCordless) {
      const dysonBatteryTracks = [
        `
          <h3>🔋 Dyson 6-7 Hücreli Li-ion Batarya Mimarisi ve BMS Koruması</h3>
          <p>
            Dyson dikey kablosuz süpürgeler, yüksek enerji yoğunluğuna sahip 21.6V - 25.2V nominal gerilimli seri bağlı 18650 veya 21700 lityum-iyon hücrelerden güç alır. <strong>${brand} ${name}</strong> dijital motoru MAX/Boost modunda bataryadan 25 Amperin üzerinde anlık deşarj akımı çeker.
          </p>
          <p>
            Batarya paketi içerisindeki mikroişlemcili Batarya Yönetim Sistemi (BMS), her hücrenin voltajını bağımsız ölçer. Hücrelerden biri 2.8V kritik eşiğin altına indiğinde veya hücreler arası voltaj farkı açıldığında sistem yangın güvenliği için bataryayı kilitler ve LED göstergede <strong>12x veya 32x kırmızı ışık flaşı</strong> verir.
          </p>
        `,
        `
          <h3>🛡️ NTC Termal Sensör Koruması ve MAX Modu Kullanım Kuralları</h3>
          <p>
            Batarya hücresi içerisine entegre edilen NTC termistör, sıcaklığın 45°C'yi aşması durumunda gücü keserek göstergede sarı (kehribar) ışık yakar. Süpürge MAX modda kullanıldıktan hemen sonra şarja takılmamalıdır.
          </p>
          <p>
            Hücrelerin oda sıcaklığına inmesi için en az 20 dakika beklenmesi, lityum elektrotların kristalleşmesini ve kapasite kaybını önler. Yeni bir batarya paketi takıldığında cihaz ilk günkü 40-60 dakikalık çalışma süresine geri döner.
          </p>
        `,
        `
          <h3>🌀 500 Çevrim Ömrü ve Kimyasal Kapasite Bozulma Eğrisi</h3>
          <p>
            Lityum-iyon piller ortalama 500 tam şarj-deşarj döngüsünden sonra orijinal kimyasal kapasitelerinin %20 ila %30'unu kaybederler. Bu durum süpürgenin normal modda 10 dakikadan az çalışmasına veya tetiğe basınca aniden kesilmesine yol açar.
          </p>
          <p>
            Kaliteli yüksek deşarjlı (High-Drain) Sony/Samsung/LG hücrelerle donatılmış yedek batarya paketleri, ani voltaj çöküşü yaşamadan stabil emiş sağlar.
          </p>
        `,
        `
          <h3>⚙️ Montaj Kolaylığı: 3 Vida ile Evde 3 Dakikada Batarya Değişimi</h3>
          <p>
            <strong>${brand} ${name}</strong> vidalı batarya modellerinde tutma kolunun arkasındaki ve batarya tabanındaki toplam 3 adet yıldız vida sökülerek batarya paketi kolayca gövdeden ayrılır.
          </p>
          <p>
            Yeni batarya yuvasına oturtulup vidalandıktan sonra tam kapasiteye ulaşması için ilk kullanım öncesi kesintisiz 4 saat şarj edilmelidir.
          </p>
        `
      ];
      return dysonBatteryTracks[track];
    }

    const robotBatteryTracks = [
      `
        <h3>🔋 14.4V 4S2P Lityum-İyon Hücre Konfigürasyonu ve BMS Dengesi</h3>
        <p>
          Robot süpürgelerin ${model.suction} türbin motoru, anakart işlemcileri ve iki çekiş tekerleği, 4 seri 2 paralel (4S2P) bağlı 8 adet 18650 lityum-iyon pilden oluşan ${model.battery || '5200 mAh'} batarya bloğundan beslenir.
        </p>
        <p>
          Dahili BMS (Battery Management System) devresi hücrelerin şarj voltajını milivolt seviyesinde dengeler. Hücre dengesizliği oluştuğunda robot evi bitiremeden şarjı biter ve dock istasyonuna dönemeden kapanır (Error 12).
        </p>
      `,
      `
        <h3>🛡️ Derin Deşarj ve Uyku Modu Koruması</h3>
        <p>
          Lityum hücreler 2.5V altına düştüğünde kimyasal olarak geri dönülemez bakır şant hasarı oluşur. <strong>${brand} ${name}</strong> batarya yönetim kartı bu durumu önlemek için pili %15 seviyesinde tutarak robotu otomatik olarak şarj yuvasına gönderir.
        </p>
        <p>
          Robotun uzun süre prizden çekilmiş bir dock üzerinde bırakılması bataryanın derin deşarja girmesine neden olur. Uzun süreli tatillerde robot %60 şarjla alt anahtarından kapatılmalı veya dock prize takılı bırakılmalıdır.
        </p>
      `,
      `
        <h3>🌀 Menzil Optimizasyonu ve Metrekare Temizlik Verimliliği</h3>
        <p>
          Sağlıklı bir batarya, tek şarjla 150 ila 250 metrekarelik bir evin tamamını süpürme ve paspaslama gücüne sahiptir. 2 yıllık kullanımın ardından iç direncin artmasıyla çalışma süresi 40 dakikanın altına iner.
        </p>
        <p>
          Yeni bir yüksek kapasiteli batarya bloğu takıldığında robotun temizliği yarıda kesip şarj olmaya gitme ihtiyacı ortadan kalkar; temizlik tek seferde tamamlanır.
        </p>
      `,
      `
        <h3>⚙️ Isıl Koruma ve Güvenli Şarj Entegrasyonu</h3>
        <p>
          Batarya bloğu yanmaz ABS kasa içerisine yerleştirilmiş ve hücreler arasına termal yalıtım pedleri konulmuştur. Şarj esnasında sıcaklık 45°C üzerine çıktığında şarj akımı otomatik olarak kesilir.
        </p>
        <p>
          Alt gövde vidaları açılarak soketli kablo bağlantısıyla 5 dakikada değiştirilebilen yedek batarya, robotun fabrika çıkış menzilini ilk günkü seviyesine getirir.
        </p>
      `
    ];
    return robotBatteryTracks[track];
  }

  if (p === 'su-haznesi-filtresi') {
    const waterTracks = [
      `
        <h3>💧 30 Kademeli Elektronik Peristaltik Mikro Pompa Mekaniği</h3>
        <p>
          Eski nesil yerçekimiyle su akıtan ilkel sistemlerin aksine <strong>${brand} ${name}</strong>, uygulama üzerinden 30 farklı seviyede su debisi ayarlayabilen elektronik kontrollü bir mikro peristaltik pompa kullanır. Pompa, silikon boruları sıkarak mikrolitre hassasiyetinde suyu mop bezine iletir.
        </p>
        <p>
          Musluk suyunda bulunan kalsiyum ve magnezyum mineralleri, mikro pompanın kılcal çıkış nozullarında kireç tabakası oluşturur. Nozulların tıkanması pompanın zorlanarak yanmasına veya mop bezinin kuru kalmasına yol açar; mutlaka filtrelenmiş arıtma su kullanılmalıdır.
        </p>
      `,
      `
        <h3>🛡️ Silikon Çekvalf ve Sızdırmazlık Conta Bakımı</h3>
        <p>
          Su tankı bağlantı yuvasında yer alan silikon contalar ve yaylı çekvalf, robot şarj standındayken suyun parkelere sızmasını engeller. Kimyasal deterjan kullanımı bu silikon contaları sertleştirerek çatlatır.
        </p>
        <p>
          Contanın hava sızdırması durumunda su tankında vakum bozulur ve cihaz zemin üzerinde su göllenmesi yapar. Contaların düzenli kontrolü ve periyodik filtre değişimi sızıntı riskini sıfırlar.
        </p>
      `,
      `
        <h3>🌀 Manyetik Şamandıra Seviye Algılama Sensörü</h3>
        <p>
          Su tankı içerisinde serbest yüzen küçük bir mıknatıslı şamandıra yer alır. Hazne içindeki su bittiğinde şamandıra tabana iner ve robotun gövdesindeki manyetik reed röle devreyi keserek sesli <strong>"Su tankı boş"</strong> uyarısı verir.
        </p>
        <p>
          Şamandıra kireç veya yosunlanma nedeniyle tabana yapışırsa hazne dolu olsa bile robot su yok alarmı verir. Haznenin periyodik olarak çalkalanması şamandıranın serbest kalmasını sağlar.
        </p>
      `,
      `
        <h3>⚙️ Nozul Tıkanıklıklarını Açma ve Kış Depolama Protokolü</h3>
        <p>
          Su püskürtme nozulları tıkandığında iğne veya sert tel sokulması nozul geometrisini bozarak suyun homojen dağılmasını engeller. Ilık arıtılmış suyla hazneye hafif basınç uygulanması kireç tıkaçlarını çözer.
        </p>
        <p>
          Robotun uzun süre paspas yapmayacağı dönemlerde su haznesi tamamen boşaltılmalı, tıpası açık şekilde kurutulmalı ve mop bezi takılı bırakılmamalıdır.
        </p>
      `
    ];
    return waterTracks[track];
  }

  if (p === 'tekerlek-bakimi') {
    const wheelTracks = [
      `
        <h3>⚙️ 360° Ön Sarhoş (Caster) Bilye ve Optik Enkoder Mimarisi</h3>
        <p>
          Robot süpürgenin yönlenmesini sağlayan ön küçük sarhoş tekerlek, paslanmaz çelik bir aks pimi üzerinde serbestçe döner. <strong>${brand} ${name}</strong> serisinde bu tekerleğin göbeğinde siyah-beyaz bölmeler yer alır; optik sensör bu bölmeleri okuyarak robotun hareket ettiğini doğrular.
        </p>
        <p>
          Aks piminin etrafına saç dolandığında ön tekerlek dönemez ve sabit kalarak zemin üzerinde sürtünür. Bu durum parke zeminlerin çizilmesine, tekerleğin düzleşmesine ve optik sensörün robotu sıkıştı algılamasına yol açar.
        </p>
      `,
      `
        <h3>🛡️ 20 mm Engel Tırmanma Yay Süspansiyonu ve Çekiş Motorları</h3>
        <p>
          Sağ ve sol ana tahrik tekerlekleri, robotun 20 mm yüksekliğindeki halı ve kapı eşiklerini aşabilmesi için bağımsız yüksek torklu dişli kutularına ve güçlü süspansiyon yaylarına sahiptir.
        </p>
        <p>
          Tekerlek süspansiyon yuvasına yabancı cisim girmesi yayın sıkışmasına sebep olur; bu durumda robot düz zeminde olduğu halde <strong>"Error 3: Tekerlek askıda"</strong> ikazı vererek durur. Düzenli temizlik yay esnekliğini korur.
        </p>
      `,
      `
        <h3>🌀 Kaydırmaz Kauçuk Sırt Aşınması ve Patinaj Önleme</h3>
        <p>
          Tekerlek dış yüzeyindeki dişli kauçuk kaplama zamanla aşınır ve yüzeyi pürüzsüzleşir. Özellikle ıslak paspaslama esnasında robot seramik ve mermer zeminlerde patinaj yaparak rotasından sapar ve harita çarpılır.
        </p>
        <p>
          Aşınan tekerlek lastiklerinin üzerine yeni silikon/kauçuk çekiş bantları geçirilmesi robotun tırmanma torkunu ve navigasyon stabilitesini ilk günkü hassasiyetine kavuşturur.
        </p>
      `,
      `
        <h3>⚙️ Dişli Kutusu (Gearbox) Saç Dolanması ve Error 7 Teşhisi</h3>
        <p>
          Tekerlek aks aralığına giren uzun saçlar tekerlek motorunun redüktör dişlilerine kadar sarılabilir. Sürtünme nedeniyle motor aşırı akım çeker ve sistem <strong>"Error 7: Çekiş tekerleği sıkıştı"</strong> ikazı verir.
        </p>
        <p>
          Tekerleği elinizle çevirdiğinizde hissedilen sert direnç saç dolanmasının habercisidir; cımbızla temizlenerek dişli kutusu rahatlatılmalıdır.
        </p>
      `
    ];
    return wheelTracks[track];
  }

  if (p === 'temizlik-solusyonu') {
    const solutionTracks = [
      `
        <h3>🧪 Köpürmeyen pH 7.0 Nötr Formül ve Dahili Pompa Emniyeti</h3>
        <p>
          Akıllı robot süpürgelerin su püskürtme kanalları 0.5 mm çapında mikro pirinç nozullardan ve minyatür silikon diyaframlı pompalardan oluşur. Standart market deterjanları, yüzey temizleyiciler ve çamaşır suyu yüksek köpük oluşturur ve asidik/kostik yapılarıyla pompa contalarını eritir.
        </p>
        <p>
          Köpük oluşması mikro pompanın hava yapmasına (kavitasyon) ve susuz çalışarak yanmasına yol açar. Özel formüle edilmiş köpürmeyen pH nötr robot süpürge solüsyonu, mekanik aksama sıfır zarar vererek zemin temizliği sağlar.
        </p>
      `,
      `
        <h3>🛡️ 1:200 Hassas Konsantrasyon Oranı ve Zemin Tutunma Stabilitesi</h3>
        <p>
          Robot temizleme solüsyonunun en kritik avantajı 1:200 oranındaki yüksek konsantrasyonudur. Her 1 litre arıtılmış suya yalnızca 1 kapak (yaklaşık 5 ml) eklenmesi yeterlidir.
        </p>
        <p>
          Aşırı solüsyon kullanımı zemin üzerinde yapışkan bir film tabakası bırakır; bu yapışkanlık robotun tahrik tekerleklerinin patinaj yapmasına ve haritanın kaymasına sebep olur. Doğru oran, hızlı kuruyan ve lekesiz parlak bir zemin sunar.
        </p>
      `,
      `
        <h3>🌀 Kireç ve Tortu Önleyici Aktif Bileşenler</h3>
        <p>
          Özel solüsyon formülü, su tankı ve ince borularda kireç ve biyofilm tabakasının oluşmasını engelleyen şelatlayıcı ajanlar içerir. Bu sayede su nozulları aylarca kesintisiz tam debide püskürtme yapar.
        </p>
        <p>
          Laminat parke, mermer, granit ve seramik gibi farklı zeminlerde ahşabın kabarmasını önler ve cila tabakasına zarar vermeden hijyen sağlar.
        </p>
      `,
      `
        <h3>⚙️ Evcil Hayvan ve Çocuk Dostu Antibakteriyel İçerik</h3>
        <p>
          Formülasyon zararlı ağır kimyasallar, klor ve fosfat içermez. Zemin hızla kuruduğundan evcil hayvanların patilerine ve küçük çocukların cilt temaslarına karşı tamamen güvenlidir.
        </p>
        <p>
          Robotun kirli su tankına sahip istasyonlu modellerinde de kötü koku ve bakteri üremesini engelleyerek istasyon hijyenini korur.
        </p>
      `
    ];
    return solutionTracks[track];
  }

  if (p === 'sensor-bakimi') {
    const sensorTracks = [
      `
        <h3>👁️ LDS Lidar Lazer Radar Optik Triangülasyon Mimarisi</h3>
        <p>
          Robotun tavanındaki kulede yer alan LDS (Laser Distance Sensor), dakikada 300 devirle dönerek saniyede binlerce kızılötesi lazer darbesi gönderir ve engellerden yansıyan ışığı fotodiyot üzerinde okur. <strong>${brand} ${name}</strong> milimetrik haritayı bu yansımalarla oluşturur.
        </p>
        <p>
          Kule içerisindeki optik aynaların üzerine mikron seviyesinde toz konduğunda lazer ışını kırılır ve robot odayı tanıyamaz hale gelerek <strong>"Error 1: LDS sensörü engellendi"</strong> arızası verir. Basınçlı hava veya kuru pamuklu çubukla periyodik temizlik harita stabilitesini korur.
        </p>
      `,
      `
        <h3>🛡️ Uçurum (Cliff) Kızılötesi Sensörleri ve Koyu Zemin Paradoksu</h3>
        <p>
          Robotun alt gövdesinde kenarlara dizilmiş 4 ila 6 adet aşağı yönlü kızılötesi düşme sensörü bulunur. Bu sensörler zeminin mesafesini sürekli ölçerek robotun merdiven boşluğuna düşmesini engeller.
        </p>
        <p>
          Sensör camları tozlandığında veya robot siyah/koyu desenli bir halıya çıktığında, siyah renk kızılötesi ışığı soğurur ve robot zemin olmadığını sanarak geri çekilip <strong>"Error 4"</strong> verir. Sensör pencerelerinin mikrofiber bezle silinmesi sahte alarmları önler.
        </p>
      `,
      `
        <h3>🌀 Şarj Docku Nikel Kontak Oksitlenmesi ve Error 13 Çözümü</h3>
        <p>
          Robotun altındaki iki metal şarj plakası ile şarj istasyonundaki yaylı elektrotlar düşük voltajlı yüksek akım iletir. Evdeki statik toz ve nem bu plakalar üzerinde gözle görülmeyen yalıtkan bir oksit tabakası oluşturur.
        </p>
        <p>
          Robot şarj dockuna yanaştığında tam temas sağlayamaz, tekrar tekrar çıkıp girer ve sonunda <strong>"Error 13: Şarj hatası"</strong> verir. Kontakların alkollü pamukla silinerek parlatılması şarj sorunlarını anında çözer.
        </p>
      `,
      `
        <h3>⚙️ Duvar Takip (Wall ToF) ve Ön Çarpışma Sensör Hijyeni</h3>
        <p>
          Robotun sağ kenarında bulunan ToF (Time of Flight) duvar sensörü, süpürgenin süpürgeliklere çarpmadan 1 cm mesafede düz bir çizgi halinde ilerlemesini sağlar.
        </p>
        <p>
          Ön tampondaki optik pencereler ise mobilya ayaklarını önceden fark ederek robotun yavaşlamasını temin eder. Bu camların düzenli temizlenmesi mobilyalara sert çarpma riskini ortadan kaldırır.
        </p>
      `
    ];
    return sensorTracks[track];
  }

  if (p === 'reset-ve-wifi') {
    if (isDysonCordless) {
      const dysonResetTracks = [
        `
          <h3>📶 Dyson Mekanik Reset ve Statik Elektrik Boşaltma Protokolü</h3>
          <p>
            Dyson kablosuz el süpürgelerinde Wi-Fi bağlantısı veya mobil uygulama donanımı yer almaz. Cihazın kontrolü tamamen tetik mekanizması ve batarya üzerindeki analog/dijital koruma entegresi tarafından yürütülür.
          </p>
          <p>
            Süpürgenin tetiğe basılmasına rağmen çalışmaması veya şarj almaması durumunda uygulanacak "hard reset" işlemi, bataryanın 3 adet montaj vidası sökülerek gövdeden ayrılması ve 10 dakika boyunca anakart kondansatörlerindeki artık statik yükün boşalmasının beklenmesidir.
          </p>
        `,
        `
          <h3>🛡️ Tetik Mandalı Mekanik Yorulması ve Değişim Kılavuzu</h3>
          <p>
            Dyson V10, V11 gibi modellerde en sık görülen tetik basmama arızası, iç tetik plastiğinin zayıf noktasından kırılmasıdır. Tetiğe basıldığında mikro anahtar (microswitch) klik sesi vermiyorsa elektronik sıfırlama işe yaramaz.
          </p>
          <p>
            Gövde açılarak güçlendirilmiş metal takviyeli yeni bir tetik mandalı takılması cihazın mekanik işlevini eksiksiz geri kazandırır.
          </p>
        `,
        `
          <h3>🌀 Hava Akış Emniyet Klapesi ve Basınç Sıfırlama</h3>
          <p>
            Toz haznesi boşaltıldıktan sonra hazne girişindeki şeffaf lastik klape sıkışabilir veya filtre yuvası tam oturmayabilir.
          </p>
          <p>
            Hazne kırmızı boşaltma mandalını 3 kez sertçe aşağı çekip kapatmak ve filtreyi saat yönünde kilit sesini duyana kadar çevirmek mekanik hava emniyetini sıfırlar.
          </p>
        `,
        `
          <h3>⚙️ Batarya BMS Uyku Modundan Çıkarma ve Şarj Adaptörü Testi</h3>
          <p>
            Aylarca kullanılmayan bataryalar koruma moduna geçerek şarj almayı reddedebilir. Orijinal şarj adaptörünün prize takılıp ucunun batarya jakına 5-6 kez arka arkaya takılıp çıkarılması (şoklama döngüsü) BMS devresini uyandırabilir.
          </p>
          <p>
            Kırmızı LED flaşı devam ediyorsa hücre voltajı kalıcı çökmüştür ve yeni batarya paketi takılmalıdır.
          </p>
        `
      ];
      return dysonResetTracks[track];
    }

    const robotResetTracks = [
      `
        <h3>📶 2.4 GHz vs. 5 GHz Çift Bant Frekans Ayırımı ve Ağ Eşleştirme</h3>
        <p>
          Tüm akıllı robot süpürgeler Wi-Fi modüllerinde yalnızca 2.4 GHz 802.11 b/g/n frekans bandını destekler. Modern fiber modemlerde 2.4 GHz ve 5 GHz bantları tek bir SSID altında birleştirildiğinde robot ağa bağlanamaz veya sürekli çevrimdışı görünür.
        </p>
        <p>
          Modem arayüzüne girilerek 5 GHz bandı geçici olarak kapatılmalı veya 2.4 GHz ağına farklı bir isim verilmelidir. Wi-Fi şifresinde Türkçe karakter veya özel semboller bulunmamalıdır.
        </p>
      `,
      `
        <h3>🛡️ Tuş Kombinasyonuyla Wi-Fi Sıfırlama ve Gösterge LED Durumları</h3>
        <p>
          <strong>${brand} ${name}</strong> üst kapağı altındaki Güç (Power) ve Şarj (Home/Dock) tuşlarına aynı anda 3 saniye basılı tutulduğunda cihaz <strong>"Wi-Fi sıfırlandı"</strong> sesli uyarısını verir ve Wi-Fi gösterge ledi mavi renkte yavaşça yanıp sönmeye başlar.
        </p>
        <p>
          Bu mod robotun kendi dahili kurulum ağını (AP mode) yayına aldığını gösterir; telefon uygulamasından robotun ağına bağlanılarak ev Wi-Fi bilgileri aktarılır.
        </p>
      `,
      `
        <h3>🌀 Pinhole Reset Tuşu ile Fabrika Yazılımına Geri Dönüş</h3>
        <p>
          Yazılım güncellemesi yarıda kaldığında veya robot haritayı ters çevirip kaybolduğunda kalıcı çözüm tam fabrika sıfırlamasıdır. Üst kapak altındaki küçük reset deliğine bir ataş yardımıyla 5 saniye basılı tutulmalıdır.
        </p>
        <p>
          Robot <strong>"Fabrika ayarlarına geri dönülüyor, lütfen bekleyin"</strong> uyarısı verir ve belleğindeki tüm geçici dosyaları silerek fabrika çıkış firmware sürümüne döner.
        </p>
      `,
      `
        <h3>⚙️ Modem DHCP Kiralama Süresi ve DNS Çakışma Çözümleri</h3>
        <p>
          Evdeki akıllı cihaz sayısı arttığında modem IP adresi havuzu tükenebilir ve robot IP alamayarak çevrimdışı kalır. Modemi yeniden başlatmak ve robota modem arayüzünden sabit bir yerel IP (Static IP Lease) atamak bağlantı kopmalarını kalıcı olarak çözer.
        </p>
        <p>
          DNS sunucusu olarak 8.8.8.8 / 1.1.1.1 tanımlanması robotun bulut sunucularıyla haberleşme gecikmesini minimuma indirir.
        </p>
      `
    ];
    return robotResetTracks[track];
  }

  if (p === 'hata-kodlari') {
    if (isDysonCordless) {
      const dysonErrorTracks = [
        `
          <h3>🔬 Dyson Dijital Motor ve Hava Akışı Emniyet Sistemi</h3>
          <p>
            Dyson dikey süpürgelerde yer alan dijital motor, dakikada 110.000 devire kadar döner. Bu yüksek devir esnasında motorun soğuması, hazneye çekilen havanın motor fan kanatçıkları üzerinden geçmesiyle sağlanır. <strong>${brand} ${name}</strong> hava akışında filtre tıkanması veya boruya cisim kaçması durumunda motorun aşırı ısınıp yanmasını önlemek için anında <strong>kesik kesik çalışma (pulsing)</strong> protokolünü devreye sokar.
          </p>
          <p>
            Tetiğe basıldığında duyulan ritmik "vut-vut-vut" sesi mekanik bir arıza değil, motorun hava bulamadığını bildiren emniyet uyarısıdır. Ön çubuk filtre ve arka HEPA filtre yıkanıp temizlendiğinde hava kanalları açılarak süpürge fabrika performansına döner.
          </p>
        `,
        `
          <h3>🛡️ Batarya LED Gösterge Kodları ve Arıza Anlamları</h3>
          <p>
            Dyson bataryası üzerindeki renkli LED gösterge arıza teşhisinin anahtarıdır. Mavi ışığın hızlı yanıp sönmesi bataryanın tamamen bittiğini (%0) gösterir.
          </p>
          <p>
            Sarı (kehribar) ışık aşırı ısınma korumasıdır; cihazın oda sıcaklığında soğuması beklenmelidir. 12 veya 32 kez aralıksız kırmızı ışık yanması ise BMS devresinin kilitlendiğini ve bataryanın kimyasal olarak ömrünü tamamladığını belgeler.
          </p>
        `,
        `
          <h3>🌀 Motorlu Başlık Rulo Kilitlenmesi ve Aşırı Akım Koruması</h3>
          <p>
            Halı veya sert zemin başlığındaki rulo fırça dönerken saç veya yabancı cisim dolandığında, başlık içindeki mini motor zorlanır. Anakart aşırı akım çektiğini hissederek başlığa giden elektriği anında keser.
          </p>
          <p>
            Bu durumda süpürge çalışmaya devam eder ancak fırça dönmez. Madeni parayla yan kilit vidası açılıp rulman yatağındaki saçlar temizlendiğinde fırça dönüşü anında normale döner.
          </p>
        `,
        `
          <h3>⚙️ Şeffaf Hazne Giriş Klapesi ve Siklon Kanalları</h3>
          <p>
            Filtreler temiz olduğu halde pulsing devam ediyorsa, sorun şeffaf hazne girişindeki esnek kırmızı/şeffaf lastik contadadır. Bu conta büyük bir peçete veya çorap kaçmasıyla içeriye doğru basılı kalmış olabilir.
          </p>
          <p>
            Çubuk boru çıkarılıp fenerle hazne giriş deliğine bakılmalı ve tıkalı cisim uzun bir cımbızla alınmalıdır.
          </p>
        `
      ];
      return dysonErrorTracks[track];
    }

    const errorTracks = [
      `
        <h3>📡 LDS Lidar Radar ve Optik Teşhis Algoritmaları</h3>
        <p>
          Akıllı robot süpürgelerde otonom navigasyon, tavandaki LDS lazer kulesinin saniyede binlerce kez mesafe ölçümü yapmasıyla çalışır. <strong>${brand} ${name}</strong> kulesine toz veya yabancı cisim kaçtığında lazer yansıması kesilir ve sistem anında <strong>Error 1 (LDS Sensör Hatası)</strong> üretir.
        </p>
        <p>
          Sensör kulesinin el ile hafifçe çevrilerek serbest hareket ettiğinin doğrulanması ve lazer diyotlarının kuru pamuklu çubukla temizlenmesi, optik rotanın saniyeler içinde yeniden kurulmasını sağlar.
        </p>
      `,
      `
        <h3>🛡️ Tampon, Tekerlek Süspansiyonu ve Çarpışma Koruması</h3>
        <p>
          <strong>${brand} ${name}</strong> ön tamponunda yer alan mikro anahtarlar ve alt uçurum kızılötesi fotodiyotları robotun düşmesini ve engellere sert çarpmasını engeller. Bu sensörlerin tozla kaplanması sahte engel algılamalarına (Error 2 ve Error 4) neden olur.
        </p>
        <p>
          Tampon yaylarının esnekliğinin test edilmesi ve alt sensör pencerelerinin mikrofiber bezle silinmesi, robotun sıkışmadan temizliğe devam etmesini sağlar.
        </p>
      `,
      `
        <h3>🌀 Vakum Basınç Sensörü ve Filtre Emniyet Protokolü</h3>
        <p>
          Robotun ${model.suction} vakum motoru, hazne içerisindeki hava basınç farkını sürekli ölçer. <strong>${brand} ${name}</strong> HEPA filtresi dolduğunda veya ıslak takıldığında hava akışı düşer ve cihaz <strong>Error 10 (Filtre Tıkalı)</strong> sinyali verir.
        </p>
        <p>
          Orijinal mikron geçirgenliğine sahip yeni bir filtre takılması, türbin fan motorunun aşırı ısınmadan tam debide çalışmasını temin eder.
        </p>
      `,
      `
        <h3>⚙️ Fırça ve Tekerlek Tork Kilitlenmesi (Error 5 & Error 7)</h3>
        <p>
          Hareketli parçalara saç veya ip dolandığında tahrik dişlileri zorlanır ve anakart sigortası devreyi korumak için motoru kilitler.
        </p>
        <p>
          Fırça kafesi ve tekerlek mil yataklarının temizlenmesiyle cihaz servissiz olarak anında normal çalışmaya döner.
        </p>
      `
    ];
    return errorTracks[track];
  }

  return `<h3>⚙️ ${name} ${part.shortName} Mühendislik Dinamikleri</h3><p>${brand} ${name} cihazınızın fabrika performansını korumak için tasarlanan bu orijinal standart parça, mekanik toleransları ve malzeme dayanımıyla öne çıkar.</p>`;
}

module.exports = {
  getDeepEngineeringGuide
};
