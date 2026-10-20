// lib/content/faqs.js - 4 Distinct Technical FAQ Tracks per Category (16 Authentic Q&As per Category)
const { simpleHash } = require('./helpers');

function getTailoredFaqs(model, part) {
  const p = part.slug;
  const brand = model.brand;
  const name = model.name;
  const isDysonCordless = brand.toLowerCase() === 'dyson' && !name.includes('360');
  const track = simpleHash(`${model.slug}-${p}-faq-v10`) % 4;

  if (p === 'hepa-filtre') {
    if (isDysonCordless) {
      const dysonFaqs = [
        [
          { q: `${brand} ${name} HEPA filtreyi bulaşık makinesinde veya çamaşır makinesinde yıkayabilir miyim?`, a: `Kesinlikle hayır. Yüksek sıcaklık ve deterjanlar filtrenin plastik gövdesini büker ve 0.3 mikronluk mikro gözenek yapısını parçalar. Yalnızca soğuk musluk suyu altında deterjansız yıkanmalıdır.` },
          { q: `Filtreyi yıkadıktan sonra ne kadar süre kurutmalıyım?`, a: `Oda sıcaklığında, havadar bir yerde en az 24 saat tam kurutulmalıdır. Filtrenin hafif nemli takılması bile motora nem çekilmesine, paslanmaya ve kötü koku oluşmasına neden olur.` },
          { q: `${brand} ${name} süpürgem tetiğe basınca neden kesik kesik çalışıyor (pulsing)?`, a: `Bu durum motorun arızalandığını değil, hava akışının tıkandığını gösterir. Ön veya arka filtre tıkandığında motor aşırı ısınmayı önlemek için gücü ritmik olarak keser. Filtreleri yıkayıp kurutmak sorunu çözer.` },
          { q: `Dyson filtrelerini ne sıklıkla yenisiyle değiştirmeliyim?`, a: `Düzenli yıkansa bile mikro gözenekler zamanla ince tozla kilitlenir. Emiş gücünü korumak için 6 ila 12 ayda bir orijinal standartta yeni filtre takılması tavsiye edilir.` }
        ],
        [
          { q: `${brand} ${name} filtresi yıkanırken sabun veya deterjan kullanılır mı?`, a: `Hayır. Kimyasal temizleyiciler filtre liflerinin arasına yapışarak hava geçirgenliğini %50 oranında düşürür. Sadece berrak soğuk su ile durulanmalıdır.` },
          { q: `Filtreyi kalorifer peteği veya saç kurutma makinesiyle hızlı kurutabilir miyim?`, a: `Kesinlikle önerilmez. Yüksek ısı filtrenin mikro kauçuk contalarını ve yapıştırıcı katmanlarını eriterek hava kaçağına yol açar. Doğal oda havasında 24 saat kurumalıdır.` },
          { q: `Ön çubuk filtre ile arka egzoz filtresi aynı anda mı değiştirilmelidir?`, a: `Evet. Siklon dengesini ve iki kademeli hava filtrasyonunu korumak için her iki filtrenin birlikte yenilenmesi motor ömrünü iki katına çıkarır.` },
          { q: `Filtre temiz olduğu halde süpürge neden emiş gücünü kaybediyor?`, a: `Hazne girişindeki lastik klapede veya çubuk boru içinde tıkanıklık olabilir. Boruyu çıkarıp içine ışık tutarak kontrol ediniz.` }
        ],
        [
          { q: `${brand} ${name} arka HEPA kapağı nasıl açılır?`, a: `Filtreyi saat yönünün tersine yaklaşık çeyrek tur çevirip nokta işaretlerini hizalayarak gövdeden çekip çıkarabilirsiniz.` },
          { q: `Yıkama sonrası filtrede kötü koku oluşursa ne yapılmalıdır?`, a: `Kötü koku filtrenin tam kurumadan takıldığını ve içinde bakteri ürediğini gösterir. Bu durumda filtreyi yeni orijinal uyumlu kartuşla değiştirmek en sağlıklı çözümdür.` },
          { q: `Filtresiz Dyson süpürge çalıştırmak cihaza zarar verir mi?`, a: `Evet. Toz doğrudan 110.000 devirle dönen dijital motor türbinine kaçarak motor sargılarının anında yanmasına sebep olur; kesinlikle filtresiz çalıştırılmamalıdır.` },
          { q: `Evcil hayvan tüyleri filtre ömrünü kısaltır mı?`, a: `Tüyler ve dander partikülleri gözenekleri daha hızlı doldurur. Evcil hayvan bulunan evlerde filtrelerin 15 günde bir çırpılması ve 6-8 ayda bir yenilenmesi önerilir.` }
        ],
        [
          { q: `Dyson V8 / V11 / V15 filtreleri birbiriyle uyumlu mudur?`, a: `Hayır. Her serinin motor gövdesi, çapı ve kilit tırnakları farklıdır. ${brand} ${name} için özel tasarlanmış filtre tercih edilmelidir.` },
          { q: `Filtrenin kuruduğunu en kesin nasıl anlarım?`, a: `Filtre süngerinin en derin iç kısmına kuru bir peçeteyle bastırın; peçetede en ufak nem izi kalmamışsa kullanıma hazırdır.` },
          { q: `MAX modda motorun aniden durması filtreyle ilgili midir?`, a: `Evet. MAX modda motor en yüksek hava debisini çeker; filtrede en küçük hava direnci bile termal emniyet devresini tetikler.` },
          { q: `Filtre yıkama suyu neden çamurlu akar?`, a: `Mikron seviyesindeki tozlar suyla birleştiğinde çamurlaşır; su tamamen şeffaf ve berrak akana kadar durulamaya devam edilmelidir.` }
        ]
      ];
      return dysonFaqs[track];
    }

    const robotFaqs = [
      [
        { q: `${brand} ${name} HEPA filtresi yıkanabilir mi?`, a: `Evet, filtre teflon (PTFE) kaplamalıdır ve soğuk musluk suyuyla yıkanabilir. Ancak fırça veya parmakla ovalanmamalı, deterjan kullanılmamalı ve en az 24 saat gölgede kurutulmalıdır.` },
        { q: `Filtre ıslak takılırsa ne olur?`, a: `Robot "Error 10: Filtre tıkalı veya ıslak" uyarısı verir. Nemli filtre hava geçirmez ve vakum türbini hava çekemediği için motoruna nem kaçarak yanabilir.` },
        { q: `HEPA filtreyi ne sıklıkla değiştirmeliyim?`, a: `Filtrenin mikron gözenekleri zamanla ince tozla kilitlenir. Emiş gücünün düşmemesi için 3 ila 6 ayda bir yeni filtre takılması tavsiye edilir.` },
        { q: `Filtre temiz olduğu halde robot neden filtre uyarısı veriyor?`, a: `Filtre çerçevesindeki silikon contanın hazneye tam oturduğundan ve hazne arkasındaki hava çıkış ızgarasının tıkalı olmadığından emin olun.` }
      ],
      [
        { q: `${brand} ${name} HEPA filtre yıkanırken sıcak su kullanılabilir mi?`, a: `Hayır. Sıcak su PTFE zarın yapıştırıcı katmanını bozar ve filtre kasedinin eğrilmesine yol açar; mutlaka soğuk su kullanılmalıdır.` },
        { q: `Filtre yıkamadan sadece vurularak temizlenebilir mi?`, a: `Evet. Düzenli olarak çöp kovası kenarına hafifçe vurmak kaba tozu döker ve filtrenin yıkama ihtiyacını ayda 1 sefere indirir.` },
        { q: `Yedek filtre kullanmanın avantajı nedir?`, a: `Bir filtre yıkanıp 24 saat kurumaya bırakıldığında, diğer kuru yedek filtre robota takılarak temizliğin kesintisiz devam etmesi sağlanır.` },
        { q: `Orijinal olmayan kalitesiz filtreler robota nasıl zarar verir?`, a: `Hava geçirgenliği hatalı olan filtreler motorun fazla akım çekip ısınmasına ve toz kaçırarak fan kanatlarının bozulmasına yol açar.` }
      ],
      [
        { q: `Filtre üzerindeki ince file katmanı ne işe yarar?`, a: `Ön file katmanı kaba saç ve tüylerin pileli HEPA liflerine saplanmasını engeller; filedeki tüyler parmakla kolayca sıyrılabilir.` },
        { q: `Robotun emiş gücü neden yarıya düştü?`, a: `En yaygın sebep filtre gözeneklerinin mikroskobik tozla dolmasıdır. Filtreyi yenilemek hava debisini anında %100 seviyesine döndürür.` },
        { q: `Filtre contası yırtılırsa ne olur?`, a: `Conta hava sızdırır, toz haznesi baypas edilir ve kirli hava doğrudan motor bölmesine kaçarak türbin rulmanlarını bozar.` },
        { q: `Uygulamadaki filtre ömrü sayacı nasıl sıfırlanır?`, a: `Yeni filtreyi taktıktan sonra mobil uygulamanın Sarf Malzemeler (Consumables) menüsünden filtreyi seçip "Sıfırla" butonuna basmanız yeterlidir.` }
      ],
      [
        { q: `Filtre temizleme fırçası kullanılmalı mıdır?`, a: `Sadece filtre önündeki kaba tozu süpürmek için kullanılabilir; sert kıllarla pileli beyaz HEPA liflerini kazımak filtreyi deler.` },
        { q: `Alerjisi olanlar için bu filtrenin etkisi nedir?`, a: `E11/H12 standardındaki HEPA filtre 0.3 mikron boyutundaki toz akarlarını, polenleri ve evcil hayvan danderini %99.2 oranında yakalar.` },
        { q: `Toz kutusunu suyla yıkarken filtre üstünde kalabilir mi?`, a: `Hayır, hazneyi yıkamadan önce filtre mutlaka çıkarılmalı; filtre sadece ayrı olarak soğuk suyla durulanmalıdır.` },
        { q: `Filtre kuruduktan sonra neden sertleşir?`, a: `Liflerin yapısı gereği kuruyunca doğal formuna döner; hazneye düzgünce yerleştirildiğinde vakum basıncıyla normal esnekliğini kazanır.` }
      ]
    ];
    return robotFaqs[track];
  }

  if (p === 'ana-firca') {
    if (isDysonCordless) {
      const dysonRollerFaqs = [
        [
          { q: `${brand} ${name} zemin başlığı fırçası dönmüyor, nedeni nedir?`, a: `Rulman miline saç dolanmış olabilir veya başlık emniyet devresi kilitlenmiştir. Madeni parayla yan kapağı açıp saçları temizleyin; ardından tetiğe basarak test edin.` },
          { q: `Rulo fırça suyla yıkanabilir mi?`, a: `Soft Roller kumaş rulo soğuk suyla yıkanabilir ancak uçtaki metal rulman mekanizmasına su kaçırılmamalı ve 24 saat tam kurutulmalıdır.` },
          { q: `Fırça rulonun yıprandığı nasıl anlaşılır?`, a: `Kıllar dökülmüşse, karbon fiber şeritler aşınmışsa veya rulo dönerken başlık titriyorsa yeni rulo takılmalıdır.` },
          { q: `Direct Drive başlık halıda neden aniden duruyor?`, a: `Kalın halı dokusu ruloya aşırı direnç uyguladığında motor koruma kartı devreyi keser. Rulman temizliği direnci düşürerek durmaları önler.` }
        ],
        [
          { q: `${brand} ${name} başlık yan vidası nasıl açılır?`, a: `Madeni para veya kalın uçlu düz tornavida ile vidayı çeyrek tur saat yönünün tersine çevirerek kilidi açabilirsiniz.` },
          { q: `Karbon fiber şeritler elektrik çarpar mı?`, a: `Hayır, karbon fiber lifler zararsız statik elektriği nötralize etmek ve mikron tozu çekmek için tasarlanmıştır.` },
          { q: `Rulman yuvasına yağ sürülmeli midir?`, a: `Kesinlikle hayır. Sıvı yağ veya gres tozu mıknatıs gibi çeker ve rulmanın kilitlenmesine neden olur.` },
          { q: `Soft roller rulo ile direct drive rulo birbiri yerine uyar mı?`, a: `Hayır, her iki başlığın iç motor tahrik mili ve kasa çapı farklıdır; modelinize uygun rulo seçilmelidir.` }
        ],
        [
          { q: `Fırça dönerken tiz bir sürtünme sesi neden gelir?`, a: `Yan rulman başlığına saç telleri sarılmıştır. Başlığı söküp rulman kovanını temizlediğinizde ses anında kesilir.` },
          { q: `Rulonun kılları eğrilirse nasıl düzeltilir?`, a: `Ilık suyla hafifçe yıkayıp parmaklarınızla düzelterek oda sıcaklığında kurumaya bırakabilirsiniz.` },
          { q: `Dyson başlık fırçası ne sıklıkla yenilenmelidir?`, a: `Haftada 2-3 kez kullanılan evlerde optimum zemin süpürme performansı için yılda bir kez değiştirilmesi önerilir.` },
          { q: `Başlık tırnakları kırılırsa tamir edilebilir mi?`, a: `Plastik tırnaklar yüksek torka dayandığından yapıştırma tutmaz; yeni orijinal uyumlu rulo takılması en güvenli çözümdür.` }
        ],
        [
          { q: `Fırça rulosu temizlenmezse batarya ömrünü etkiler mi?`, a: `Evet. Saç dolanan fırça motora 2 kat fazla yük bindirir; batarya 20 dakika yerine 8-10 dakikada biter.` },
          { q: `Başlığın içindeki motor bağımsız değiştirilebilir mi?`, a: `Genellikle fırça rulosunun temizlenmesi veya değiştirilmesi sorunu çözer; motor arızası nadiren görülür.` },
          { q: `Evcil hayvan tüyleri ruloya sarılınca nasıl çıkarılır?`, a: `Rulonun üzerindeki özel oluk boyunca makas veya falçatayı kaydırarak tüyleri tek hamlede kesebilirsiniz.` },
          { q: `Yeni rulo başlığa takılınca tık sesi gelmeli midir?`, a: `Evet, kilit kapağı tam yerine oturmalı ve madeni parayla kilitlendiğinde boşluk kalmamalıdır.` }
        ]
      ];
      return dysonRollerFaqs[track];
    }

    const robotRollerFaqs = [
      [
        { q: `${brand} ${name} robotumda "Error 5: Ana fırça sıkıştı" uyarısı alıyorum, ne yapmalıyım?`, a: `Robotu ters çevirin, fırça kafesini açıp ana fırçayı çıkarın. Fırçanın iki ucundaki rulman kapaklarını sökerek mildeki saçları temizleyin ve tekrar yerine oturtun.` },
        { q: `Kauçuk fırça mı yoksa kıllı fırça mı daha avantajlıdır?`, a: `Tam kauçuk fırçalar saç dolanmasını büyük ölçüde engeller ve kolay temizlenir; kıllı fırçalar ise halı dokusunun derinliklerine daha iyi nüfuz eder.` },
        { q: `Ana fırçayı suyla yıkayabilir miyim?`, a: `Evet, ancak fırçayı yıkamadan önce uçlardaki metal rulman kapaklarını çıkarmanız gerekir. Rulmanlar paslanmaması için suya sokulmamalıdır.` },
        { q: `Ana fırçayı ne zaman değiştirmeliyim?`, a: `Kauçuk kanatçıklar yırtıldığında, kıllar döküldüğünde veya 6-12 aylık düzenli kullanım sonucunda yenilenmelidir.` }
      ],
      [
        { q: `Rulman yan kapakları nasıl çıkarılır?`, a: `Fırçanın iki ucundaki plastik kapaklar tırnaklıdır; parmaklarınızla hafifçe dışarı çekerek kolayca çıkarabilirsiniz.` },
        { q: `Fırça dönerken halıyı çizer mi?`, a: `Hayır, fırçanın kılları ve kauçuk bıçakları zemin dostu elastomer malzemeden üretilmiştir; parke ve halıya zarar vermez.` },
        { q: `Ana fırça kafesi tam kapanmazsa ne olur?`, a: `Kafes açık kalırsa fırça yuvasından fırlar, tekerlek hareketini engeller ve robot arıza vererek durur.` },
        { q: `Fırça miline saç dolanması motoru yakar mı?`, a: `Anakart aşırı akım korumasına sahiptir; ancak uzun süre temizlenmezse motor sürücü entegresi aşırı ısınıp bozulabilir.` }
      ],
      [
        { q: `Çift rulo (DuoRoller) sisteminde fırçalar nasıl takılır?`, a: `Fırçalar renk veya simgelerle (ön/arka) ayrılmıştır; her rulo kendi yuvasına yön işaretine göre takılmalıdır.` },
        { q: `Uygulamadaki ana fırça ömrü nasıl sıfırlanır?`, a: `Mobil uygulamanın Ayarlar > Bakım menüsünden Ana Fırça seçilerek "Sıfırla" seçeneğine basılır.` },
        { q: `Fırça dönerken gıcırtı sesi geliyorsa ne yapılmalıdır?`, a: `Ses rulman yatağındaki kuru sürtünmeden kaynaklanır; yatağı temizleyip saçları uzaklaştırmak sesi keser.` },
        { q: `Evcil hayvan olan evlerde fırça ne sıklıkla temizlenmeli?`, a: `Haftada en az bir kez fırça uç kapakları açılarak saç ve tüy temizliği yapılmalıdır.` }
      ],
      [
        { q: `Fırçanın kare tahrik ucu aşınırsa ne olur?`, a: `Tahrik yuvası boşta döner, fırça tork üretemez ve robot süpürmeyi bırakarak toz toplamamaya başlar.` },
        { q: `Orijinal uyumlu ana fırça zemin temizliğini nasıl etkiler?`, a: `Milimetrik toleransla üretilen fırça vakum kanalına hava kaçağı bırakmaz ve emiş verimini en üstte tutar.` },
        { q: `Kafes üzerindeki tel koruyucular sökülebilir mi?`, a: `Hayır, o teller halı kenarlarının ve kabloların fırça boğazına sarılmasını engelleyen güvenlik elemanlarıdır.` },
        { q: `Fırça takarken yön fark eder mi?`, a: `Evet, bir ucu tahrik motorunun dişlisine, diğer ucu serbest rulman yuvasına oturacak şekilde tasarlanmıştır.` }
      ]
    ];
    return robotRollerFaqs[track];
  }

  if (p === 'yan-firca') {
    const sideFaqs = [
      [
        { q: `${brand} ${name} yan fırçası neden dönmüyor?`, a: `Yan fırça miline saç veya ip sarılmış olabilir (Error 6). Vidayı söküp mili cımbızla temizleyiniz. Sorun devam ediyorsa redüktör motoru aşırı yük korumasına geçmiş olabilir.` },
        { q: `Bükülen yan fırça kolları nasıl düzeltilir?`, a: `Kolları 80°C sıcak su dolu bir kasede 30-60 saniye beklettiğinizde silikon kollar gevşeyip fabrika düzlüğüne ve orijinal formuna geri döner.` },
        { q: `3 kollu fırça ile 5 kollu silikon fırça arasındaki fark nedir?`, a: `5 kollu silikon fırçalar daha sık süpürme yaparak köşeleri daha iyi temizler ve halı püsküllerine dolanma riski daha düşüktür.` },
        { q: `Yan fırça ne sıklıkla değiştirilmelidir?`, a: `Kollar koptuğunda, kısaldığında veya 3 ila 6 aylık kullanım sonrasında köşe temizleme verimini korumak için yenilenmelidir.` }
      ],
      [
        { q: `Yan fırça vidası çok sıkılırsa ne olur?`, a: `Vida aşırı sıkılırsa fırça göbeği plastik yatağa baskı yapar ve motorun serbest dönmesini engeller; tatlı sert sıkılmalıdır.` },
        { q: `Yan fırça neden açık alanda yavaş, duvarda hızlı döner?`, a: `Bu akıllı bir algoritmadır; açık alanda tozları etrafa fırlatmamak için 130 RPM, süpürgelik dibinde ise 330 RPM devirle çalışır.` },
        { q: `Yan fırça vidası kaybolursa ne takılabilir?`, a: `Standart metrik ince dişli vida kullanılmalıdır; paketlerimiz genellikle yedek montaj vidasıyla birlikte sunulur.` },
        { q: `Yan fırça kolları halıya takılıp robotu durdurur mu?`, a: `Esnek silikon kollar bükülerek halıdan kurtulur; ancak kollar sertleşmişse halı saçaklarına takılabilir.` }
      ],
      [
        { q: `Vidasız (geçmeli / tırnaklı) yan fırçalar nasıl sökülür?`, a: `İki parmağınızla fırçanın göbeğinden kavrayıp dik açıyla yukarı doğru çekerek tırnaklarından kurtarabilirsiniz.` },
        { q: `Yan fırça dönmediğinde haritalama etkilenir mi?`, a: `Robot temizliğe devam eder ancak köşe ve kenarlarda toz bırakır; ayrıca motor aşırı akım ikazı verebilir.` },
        { q: `Yan fırça şaftındaki saçlar temizlenmezse ne olur?`, a: `Saçlar şaft contasına baskı yaparak küçük dişli kutusunu (gearbox) kilitler ve motorun yanmasına sebep olur.` },
        { q: `Yeni yan fırça takıldıktan sonra ses yapar mı?`, a: `Hayır, kaliteli elastomer kollar süpürgeliklere ve zemine temas ederken sıfır ses ile çalışır.` }
      ],
      [
        { q: `Yan fırça hangi periyotla kontrol edilmelidir?`, a: `10 günde bir altıgen mil etrafına saç sarılıp sarılmadığı gözle kontrol edilmelidir.` },
        { q: `Silikon kollar koptuğunda tamir edilebilir mi?`, a: `Hayır, kopan kollar zemin dengesini bozar; fırçanın yenisiyle değiştirilmesi gerekir.` },
        { q: `Uygulamadaki yan fırça sayacı nasıl sıfırlanır?`, a: `Uygulama menüsünden Sarf Malzemeler > Yan Fırça seçilerek "Sıfırla" seçeneğine dokunulur.` },
        { q: `Kutudan çıkan yan fırçalar eğri geldiyse ne yapılmalı?`, a: `Kargoda basınca maruz kalan kolları sıcak suya 30 saniye batırmak anında düzleştirir.` }
      ]
    ];
    return sideFaqs[track];
  }

  if (p === 'mop-bezi') {
    const mopFaqs = [
      [
        { q: `${brand} ${name} mop bezi çamaşır makinesinde yıkanabilir mi?`, a: `Evet, 40°C sıcaklıkta yıkanabilir. Ancak kesinlikle çamaşır yumuşatıcısı ve çamaşır suyu kullanılmamalıdır; yumuşatıcı mikrofiber gözeneklerini tıkayarak su emiciliği yok eder.` },
        { q: `Mop bezi neden zemin üzerinde su lekesi ve çizgi bırakır?`, a: `Bezin lifleri kireç veya deterjan artıklarıyla doymuş olabilir veya bez aşırı kirlenmiştir. Bezi doğal sabunla yıkayıp durulamak sorunu giderir.` },
        { q: `Mop bezi temizlik bittikten sonra robotta bırakılabilir mi?`, a: `Hayır. Islak mop bezi parkelerin kabarmasına, bakteri üremesine ve kötü koku oluşmasına neden olur. Temizlik bitince derhal çıkarılıp kurutulmalıdır.` },
        { q: `Mop bezini ne sıklıkla değiştirmeliyim?`, a: `Mikrofiber dokunun zemin temasını ve leke çıkarma performansını korumak için 1 ila 3 ayda bir yenisiyle değiştirilmesi önerilir.` }
      ],
      [
        { q: `Mop bezi cırt cırtı tutmuyor ve kayıyor, ne yapmalıyım?`, a: `Bezin arkasındaki kumaş tüylenmiş veya tabla cırt cırtlarına toz dolmuş olabilir; yeni bir bez takarak tutunmayı tazeleyebilirsiniz.` },
        { q: `Titreşimli (Sonic) mop bezi ile standart bez farkı nedir?`, a: `Titreşimli modeller için üretilen bezler dakikada 3.000 titreşime dayanacak takviyeli dikişlere ve yüksek yoğunluklu liflere sahiptir.` },
        { q: `Döner paspas (spinning) pedleri nasıl yıkanır?`, a: `Cırt cırtından ayrılıp ılık suyla elde çitilenir veya makinede kısa programda yıkanıp düz bir zeminde kurutulur.` },
        { q: `Halıya çıkarken mop bezi halıyı ıslatır mı?`, a: `Robotun ultrasonik sensörü halıyı algıladığında mop tablasını otomatik kaldırır; ancak orijinal kalınlıktaki bezler kullanılmalıdır.` }
      ],
      [
        { q: `Mop bezinde küf kokusu oluşursa nasıl giderilir?`, a: `Ilık suya bir miktar beyaz sirke ekleyip 15 dakika bekletip durulayınız; koku geçmiyorsa yeni bez takınız.` },
        { q: `Kurutma makinesine mop bezi atılır mı?`, a: `Hayır, kurutma makinesinin yüksek ısısı mikrofiber lifleri ve cırt cırt kumaşını büzüştürür; doğal ortamda kurutulmalıdır.` },
        { q: `Mop yaparken deterjan doğrudan beze dökülür mü?`, a: `Hayır, köpük yaparak tekerleklerin kaymasına neden olur; sadece su tankına uygun robot solüsyonu eklenmelidir.` },
        { q: `Bir mop bezi kaç yıkamaya dayanır?`, a: `Kaliteli orijinal standarttaki mikrofiber bezler formunu kaybetmeden yaklaşık 50-60 yıkamaya kadar dayanıklıdır.` }
      ],
      [
        { q: `Zeminde gri kir tabakası oluşuyorsa sebebi nedir?`, a: `Mop bezinin çok uzun süre yıkanmadan kullanılması kirin zemine yayılmasına yol açar; her odadan sonra bez durulanmalıdır.` },
        { q: `Mop tablası yerine oturmazsa ne olur?`, a: `Robot mop modülünün takılı olduğunu algılayamaz ve paspaslama moduna geçmez.` },
        { q: `Yedek mop bezine neden ihtiyaç duyulur?`, a: `Biri yıkanıp kururken diğerinin takılması robotun temizlik rutininin aksamamasını sağlar.` },
        { q: `Fitilli mop bezi tablaya nasıl takılır?`, a: `Önce sert fitil ucu plastik ray boyunca sonuna kadar kaydırılır, ardından bez cırt cırta gergin şekilde yapıştırılır.` }
      ]
    ];
    return mopFaqs[track];
  }

  if (p === 'toz-torbasi') {
    const bagFaqs = [
      [
        { q: `${brand} ${name} istasyon toz torbası tekrar boşaltılıp kullanılabilir mi?`, a: `Hayır. Meltblown mikro filtre kumaşı tek kullanımlık olarak tasarlanmıştır. Torbayı açıp boşaltmak mikro gözenekleri yırtarak istasyon motoruna toz kaçmasına ve motorun yanmasına sebep olur.` },
        { q: `Bir toz torbası ortalama ne kadar süre gider?`, a: `Evin büyüklüğüne ve evcil hayvan yoğunluğuna bağlı olarak 2.5L-3.0L hacmindeki bir torba 6 ila 8 hafta boyunca yeterlidir.` },
        { q: `Torba dolduğunda robot veya istasyon nasıl uyarır?`, a: `İstasyon üzerindeki durum ışığı turuncu/kırmızıya döner ve mobil uygulama "Toz torbası dolu, lütfen değiştirin" bildirimi gönderir.` },
        { q: `Torba çıkarılırken ortama toz yayılır mı?`, a: `Hayır. Plastik flanş üzerindeki sürgülü kapak yukarı çekildiğinde torba ağzı otomatik olarak kilitlenir ve toza temas etmeden hijyenik tahliye sağlar.` }
      ],
      [
        { q: `Standart kağıt torbalar bu istasyonda kullanılabilir mi?`, a: `Kesinlikle hayır. İstasyon 27.000 Pa vakum gücü uygular; kağıt torbalar patlayarak istasyon türbinine telafisi imkansız zarar verir.` },
        { q: `İstasyon torbasında koku oluşmaması için ne yapılabilir?`, a: `Aktif karbon katmanlı torbalar tercih edilmeli ve ıslak/nemli döküntülerin süpürülmesinden kaçınılmalıdır.` },
        { q: `Torba tam dolmadan değiştirilmeli midir?`, a: `Aylar süren beklemelerde koku oluştuysa veya emiş gücü azaldıysa torbanın erkenden yenilenmesi tavsiye edilir.` },
        { q: `İstasyon kapağı tam kapanmazsa boşaltma yapar mı?`, a: `Hayır, kapak emniyet sivici açık kaldığında istasyon hava sızdırmazlığı sağlayamaz ve boşaltma başlatmaz.` }
      ],
      [
        { q: `Torba takılı olmadığı halde istasyon çalışır mı?`, a: `İçerideki mekanik algılayıcı torba yokken istasyonun çalışmasını engeller ve sesli ikaz verir.` },
        { q: `Meltblown kumaşın filtrasyon gücü nedir?`, a: `0.3 mikron boyutundaki alerjen ve polen partiküllerini %99.7 oranında torba içerisinde hapseder.` },
        { q: `İstasyon haznesine toz kaçtıysa nasıl temizlenir?`, a: `İstasyon fişten çekilmeli ve hazne içi hafif nemli bir mikrofiber bezle silinip kurulanmalıdır.` },
        { q: `Torba flanşı kızağa tam oturmazsa ne olur?`, a: `Emiş havası kaçar, robot haznesi tam boşalmaz ve istasyon arıza alarmı verir.` }
      ],
      [
        { q: `Yeni torba takıldıktan sonra uygulamada sıfırlama gerekir mi?`, a: `Bazı modellerde sensör otomatik algılar; bazı modellerde ise uygulama menüsünden torba sayacı sıfırlanır.` },
        { q: `Evcil hayvan tüyleri torbayı daha hızlı mı doldurur?`, a: `Evet, yoğun tüy döken evcil hayvanlar bulunan evlerde torba değişim süresi 3-4 haftaya inebilir.` },
        { q: `Torba takarken kumaşı açmak gerekir mi?`, a: `Evet, körüklü kumaş katlarını elinizle hafifçe açmak torbanın hazne içinde tam hacimle dolmasını sağlar.` },
        { q: `Orijinal standartta torba kullanmak neden şarttır?`, a: `Hava geçirgenliği test edilmiş torbalar istasyon türbin motorunun aşırı ısınmadan soğumasını garanti eder.` }
      ]
    ];
    return bagFaqs[track];
  }

  if (p === 'batarya-pil') {
    if (isDysonCordless) {
      const dysonBatteryFaqs = [
        [
          { q: `${brand} ${name} bataryasında 32 kez kırmızı ışık yanıp sönüyor, çözümü nedir?`, a: `32 kez kırmızı flaş, Batarya Yönetim Sistemi'nin (BMS) ya da hücrelerin kalıcı voltaj çöküşü yaşadığını gösterir. Cihaz kendini kilitler; çözümü yeni bir Dyson uyumlu batarya takmaktır.` },
          { q: `Yeni bataryayı kendim evde takabilir miyim?`, a: `Evet. Tutma kolu arkasındaki ve batarya tabanındaki toplam 3 adet vidayı sökerek 3 dakikada yeni bataryayı kolayca takabilirsiniz.` },
          { q: `Bataryanın şarjı MAX modda neden sadece 5-7 dakika gidiyor?`, a: `Bu bir arıza değildir. MAX modu motordan 25 Amperden fazla akım çeker; fabrika standardında bile MAX mod süresi 7 dakikadır. Normal temizlik ECO modda yapılmalıdır.` },
          { q: `Süpürge durup sarı (kehribar) ışık yakarsa ne yapılmalıdır?`, a: `Sarı ışık aşırı ısınma korumasıdır. Cihazı şarja takmadan önce oda sıcaklığında 30-45 dakika soğumasını bekleyiniz; ardından normale döner.` }
        ],
        [
          { q: `Dyson bataryasının ömrünü uzatmak için ne yapılmalı?`, a: `MAX modunu sadece inatçı lekelerde kısa süreli kullanın, süpürme sonrası pil sıcakken hemen şarja takmayın ve daima oda sıcaklığında saklayın.` },
          { q: `Yeni batarya takıldıktan sonra ilk şarj ne kadar sürmelidir?`, a: `Hücrelerin tam dengelenmesi ve kalibrasyonu için ilk kullanım öncesi kesintisiz 4 saat şarj edilmelidir.` },
          { q: `Tetiğe basınca mavi ışık hızla yanıp sönüyorsa anlamı nedir?`, a: `Batarya şarjı kritik eşiğin altına inmiştir (%0). Adaptöre takıp şarj etmeniz gerekir.` },
          { q: `Yüksek kapasiteli (örneğin 3000-4000 mAh) batarya takmak süpürgeye zarar verir mi?`, a: `Hayır, voltaj (21.6V) aynı kaldığı sürece yüksek mAh değeri cihazın çalışma süresini güvenle uzatır.` }
        ],
        [
          { q: `Batarya şarj aletinde takılı bırakılabilir mi?`, a: `Evet, dahili BMS devresi şarj tamamlandığında akımı keser; bataryanın sürekli dock üzerinde kalması güvenlidir.` },
          { q: `Batarya vidaları sökülürken hangi tornavida kullanılır?`, a: `PH1 veya PH2 uçlu standart yıldız tornavida vida yuvalarını sıyırmadan kolayca açar.` },
          { q: `Süpürge hiç tepki vermiyor, bataryadan mı motordan mı kaynaklanır?`, a: `Tetiğe basınca hiçbir LED yanmıyorsa veya anında kırmızı yanıyorsa sorun %95 bataryadadır.` },
          { q: `Dyson batarya hücreleri tek tek tamir edilebilir mi?`, a: `Güvenlik ve yangın riski nedeniyle lityum hücrelerin amatörce lehimlenmesi tehlikelidir; komple sertifikalı paket değişimi şarttır.` }
        ],
        [
          { q: `Kışın soğuk balkonda bırakılan Dyson bataryası neden çalışmaz?`, a: `Lityum piller 5°C altındaki sıcaklıklarda kimyasal tepkimeyi durdurur; oda sıcaklığına alınıp ısıtıldığında tekrar çalışır.` },
          { q: `Batarya değişiminden sonra çekiş gücü artar mı?`, a: `Evet, taze hücreler motora stabil yüksek akım sağlayarak fan devrini fabrika zirvesine ulaştırır.` },
          { q: `Süpürge şarjdayken tetiğe basılırsa çalışır mı?`, a: `Hayır, Dyson güvenlik protokolü şarj kablosu takılıyken motorun çalışmasını kilitler.` },
          { q: `Batarya garantisi neleri kapsar?`, a: `Üretim kaynaklı hücre arızaları ve erken kapasite düşüşleri birebir değişim garantimiz altındadır.` }
        ]
      ];
      return dysonBatteryFaqs[track];
    }

    const robotBatteryFaqs = [
      [
        { q: `${brand} ${name} temizliği bitiremeden şarjı bitip duruyor, batarya mı arızalı?`, a: `Evet. 1.5-2 yıllık kullanım sonrası lityum hücrelerin kapasitesi düşer. Robot temizliği yarıda bırakıp docka dönemiyorsa (Error 12) yeni batarya takılmalıdır.` },
        { q: `Yeni bataryayı evde kendim takabilir miyim?`, a: `Evet. Robotun alt kapağındaki vidaları söküp eski bataryanın kablo soketini tırnağından ayırarak 5 dakikada yeni bataryayı bağlayabilirsiniz.` },
        { q: `Yeni batarya takıldıktan sonra ilk şarj nasıl yapılmalıdır?`, a: `Robotu şarj dockuna oturtup kesintisiz en az 4 saat şarj ederek hücrelerin %100 dengelenmesini sağlayınız.` },
        { q: `Yüksek kapasiteli batarya robota zarar verir mi?`, a: `Hayır. Voltaj (14.4V) aynı kaldığı sürece yüksek mAh değeri robotun tek şarjla süpürdüğü metrekare alanını güvenle artırır.` }
      ],
      [
        { q: `Robot şarj standından ayrılınca aniden kapanıyor, nedeni nedir?`, a: `Batarya hücrelerinden biri tamamen çökmüştür ve dockun 14.4V beslemesi kesildiği an anakart enerjisiz kalır; batarya değişmelidir.` },
        { q: `Lityum bataryanın ömrü kaç yıldır?`, a: `Ortalama 500 şarj döngüsü (yaklaşık 2 ila 3 yıl) boyunca yüksek performans sunar; ardından kimyasal yıpranma başlar.` },
        { q: `Robot uzun süre tatile giderken nasıl bırakılmalıdır?`, a: `Dock prizde bırakılmalı veya robot %70 şarj edilip alt anahtarından tamamen kapatılmalıdır.` },
        { q: `BMS devresi bataryayı neden kilitler?`, a: `Aşırı akım, kısa devre veya hücre voltaj farkı oluştuğunda yangın riskini önlemek için koruma moduna geçer.` }
      ],
      [
        { q: `Batarya değişimi sonrası harita silinir mi?`, a: `Hayır, haritalar robotun dahili flaş hafızasında veya bulut hesabınızda saklanır; batarya değişimi haritayı silmez.` },
        { q: `Robotun şarj süresi neden uzadı?`, a: `Şarj kontaklarındaki toz veya bataryanın artan iç direnci şarj süresini uzatabilir; kontakları alkolle siliniz.` },
        { q: `Sıcak havalarda robotun şarjı durması normal midir?`, a: `Evet, batarya sıcaklığı 45°C üzerine çıktığında termal sensör hücreleri korumak için şarjı geçici durdurur.` },
        { q: `Batarya paketi içindeki kablo soketi ters takılabilir mi?`, a: `Hayır, soket tırnaklı ve tek yönlüdür; yalnızca doğru polaritede yerine kilitlenir.` }
      ],
      [
        { q: `Robot temizlik sırasında şarjı %20 kalınca ne yapar?`, a: `Otomatik olarak şarj dockuna döner, %80 şarj olduktan sonra temizliği kaldığı noktadan sürdürür.` },
        { q: `Kapasitesi düşen batarya emiş gücünü etkiler mi?`, a: `Evet, voltaj düştüğünde türbin motoruna giden güç azalarak vakum çekişini zayıflatır.` },
        { q: `Eski batarya nereye atılmalıdır?`, a: `Ev çöpüne kesinlikle atılmamalıdır; belediyelerin veya marketlerin atık pil toplama kutularına bırakılmalıdır.` },
        { q: `Bataryanın orijinal olup olmadığını nasıl anlarım?`, a: `Üzerindeki voltaj (14.4V), CE/RoHS sertifikaları ve kaliteli lehimli punta yapısı güvenilirliği gösterir.` }
      ]
    ];
    return robotBatteryFaqs[track];
  }

  if (p === 'su-haznesi-filtresi') {
    const waterFaqs = [
      [
        { q: `${brand} ${name} paspas yaparken su akıtmıyor, bez kuru kalıyor?`, a: `Su haznesi nozulları kireçten tıkanmış veya pompa hava yapmış olabilir. Ilık arıtılmış suyla hazneyi çalkalayınız; uygulama üzerinden su debisini en yüksek seviyeye alınız.` },
        { q: `Su haznesine oda kokusu veya çamaşır suyu konulabilir mi?`, a: `Kesinlikle hayır. Aşındırıcı kimyasallar dahili mikro pompanın silikon diyaframını eritir ve garantiyi bozar; sadece köpürmeyen robot solüsyonu kullanılmalıdır.` },
        { q: `Mop filtresi ne sıklıkla değiştirilmelidir?`, a: `Su çıkış tıpaları ve filtreleri kireçlenme durumuna bağlı olarak 3 ila 6 ayda bir yenilenmelidir.` },
        { q: `Robot parkede su damlacıkları bırakıyorsa sebebi nedir?`, a: `Su tankı kapağındaki silikon conta hava sızdırıyor veya mop bezi çok eskimiş ve suyu homojen dağıtamıyor olabilir.` }
      ],
      [
        { q: `Kireçli musluk suyu su tankına konursa ne olur?`, a: `Kireç kristalleri 0.5 mm çapındaki mikro nozulları tıkar ve pompa motorunun yanmasına sebep olur; daima arıtılmış su kullanılmalıdır.` },
        { q: `Manyetik şamandıra neden su bitti uyarısı verir?`, a: `Tank içindeki küçük mıknatıslı şamandıra kireç nedeniyle tabana yapışmış olabilir; hazneyi sallayarak serbest bırakınız.` },
        { q: `Robot şarjdayken su tankı takılı kalabilir mi?`, a: `Elektronik valf suyu kesse bile nemli bez parkeyi kabartabileceğinden hazne veya mop braketi ayrılmalıdır.` },
        { q: `Tıkanan su çıkış deliklerine dikiş iğnesi sokulabilir mi?`, a: `Asla sokulmamalıdır; iğne pirinç nozulun hassas geometrisini genişleterek suyun damlamasına yol açar.` }
      ],
      [
        { q: `Elektronik su debisi uygulamadan nasıl kontrol edilir?`, a: `Uygulama harita ekranındaki Temizlik Ayarları menüsünden Düşük, Orta ve Yüksek su seviyeleri seçilebilir.` },
        { q: `Su tankı contaları nasıl temizlenir?`, a: `Silikon tıpalar nemli bezle silinip yerine tam bastırılmalıdır; çatlak conta yenisiyle değiştirilmelidir.` },
        { q: `Kış aylarında su haznesi nasıl saklanmalıdır?`, a: `İçindeki su tamamen boşaltılmalı, kapağı açık kurutulmalı ve donma riski olan yerlerde bırakılmamalıdır.` },
        { q: `Su tankı filtresi tıkanırsa pompa ses çıkarır mı?`, a: `Evet, pompa suyu çekemediği için boğuk bir titreşim sesi çıkarır; filtre temizlendiğinde ses normale döner.` }
      ],
      [
        { q: `Su tankı filtresi paketi içinde kaç adet bulunur?`, a: `Genellikle 2 ila 4 adet yedek filtre tapası ve silikon conta setiyle birlikte gelir.` },
        { q: `Filtre elemanları takılmadan önce ıslatılmalı mıdır?`, a: `Evet, kuru filtre elemanını önce suya batırıp ıslatmak kılcal akışı hızlandırır.` },
        { q: `Su tankı çatlağı tamir edilebilir mi?`, a: `Basınçlı hazneler su sızdırarak anakarta zarar verebileceğinden çatlak tank yenisiyle değiştirilmelidir.` },
        { q: `İstasyonlu modellerde su tankı filtresi nerede bulunur?`, a: `Robotun gövdesindeki dahili tankın su besleme girişinde ve istasyonun temiz su haznesinde yer alır.` }
      ]
    ];
    return waterFaqs[track];
  }

  if (p === 'tekerlek-bakimi') {
    const wheelFaqs = [
      [
        { q: `${brand} ${name} robotum kendi etrafında dönüyor ve duruyor, nedeni nedir?`, a: `Tekerleklerden birinin aksına saç veya ip dolanmış (Error 7) ya da ön sarhoş tekerlek kilitlenmiştir. Tekerlekleri söküp saçları temizleyiniz.` },
        { q: `Ön küçük tekerlek nasıl sökülür?`, a: `Düz uçlu tornavidayı tekerlek gövdesinin altına hafifçe sokup yukarı doğru kanırtarak modülü serbest bırakabilirsiniz.` },
        { q: `Tekerlek lastikleri aşındığında ne olur?`, a: `Robot seramik veya ıslak zeminlerde patinaj yapar, kapı eşiklerini aşamaz ve navigasyon haritası kayar.` },
        { q: `Tekerlek mekanizmasına yağ sıkılabilir mi?`, a: `Kesinlikle hayır. Yağ tozu ve kiri kendine çekerek çamurlaşır ve tekerlek dişli kutusunu tamamen kilitler.` }
      ],
      [
        { q: `Error 3: Tekerlek havada / askıda hatası nasıl çözülür?`, a: `Robotu düz bir zemine koyun ve iki ana tekerleği elinizle yukarı aşağı bastırarak süspansiyon yayının rahatça esnediğini doğrulayın.` },
        { q: `Ön tekerlek aks milindeki saçlar nasıl çıkarılır?`, a: `Tekerleği plastik çatalsı braketinden çekip çıkarın; çelik aks milini çekerek etrafındaki saç yumağını temizleyin.` },
        { q: `Aşınan tekerlek lastiği komple motor değişimi gerektirir mi?`, a: `Hayır, sadece dış kauçuk lastik bandı sökülüp yeni dişli silikon lastik takılarak sorun çözülür.` },
        { q: `Robot 20 mm halı eşiğini neden aşamıyor?`, a: `Tekerlek süspansiyon yayları arasına yabancı cisim kaçmış olabilir veya lastik sırtı aşındığı için tutunamıyordur.` }
      ],
      [
        { q: `Ön tekerlek optik sensörü ne işe yarar?`, a: `Tekerleğin altındaki sensör tekerleğin dönüşünü okuyarak robotun hareket ettiğini doğrular; tozlanırsa robot sıkıştı sanır.` },
        { q: `Tekerlek dişli kutusundan (gearbox) tıkırtı sesi gelirse ne yapılır?`, a: `Aks miline kıl dolanmıştır; temizlenmezse dişli sıyırması yapabilir, derhal temizlenmelidir.` },
        { q: `Çekiş lastikleri parkede iz bırakır mı?`, a: `Orijinal standarttaki kauçuk lastikler iz bırakmaz ve zemin üzerinde sessizce ilerler.` },
        { q: `Tekerlek motoru arızası nasıl anlaşılır?`, a: `Robotu elinizle sürdüğünüzde bir tekerlek çok sert ve dönmüyorsa motor redüktörü sıkışmış olabilir.` }
      ],
      [
        { q: `Tekerlek bakım kiti neleri içerir?`, a: `Genellikle 1 adet komple ön sarhoş tekerlek modülü ve 2 adet sağ/sol tahrik tekerlek kauçuk sırt lastiği içerir.` },
        { q: `Ön tekerlek neden yuvasından düşer?`, a: `Plastik tutucu tırnakları aşınmış olabilir; yeni modül yerine bastırılarak tam kilitlenmelidir.` },
        { q: `Tekerlek lastiklerini takmak zor mudur?`, a: `Hayır, esnek kauçuk yapı eski lastik janttan sıyrıldıktan sonra yeni lastik kolayca janta geçirilir.` },
        { q: `Tekerlek temizliği ne sıklıkla yapılmalıdır?`, a: `Haftada bir ön bilye kontrol edilmeli, 2 haftada bir ana tekerlek süspansiyonları esnetilmelidir.` }
      ]
    ];
    return wheelFaqs[track];
  }

  if (p === 'temizlik-solusyonu') {
    const solutionFaqs = [
      [
        { q: `Normal yüzey temizleyici veya çamaşır suyu robota konulabilir mi?`, a: `Kesinlikle hayır. Standart deterjanlar köpürerek mikro su pompasını bozar ve asidik yapılarıyla silikon contaları eriterek cihazı garanti dışı bırakır.` },
        { q: `Robot temizlik solüsyonunun karışım oranı nedir?`, a: `1:200 konsantrasyona sahiptir. Her 1 litre arıtılmış suya yalnızca 1 kapak (5 ml) eklenmesi yeterlidir.` },
        { q: `Solüsyon ahşap parkelere zarar verir mi?`, a: `Hayır. Özel formülü pH 7.0 nötrdür; parkelerde kabarma yapmaz, iz bırakmaz ve parlak bir görünüm sağlar.` },
        { q: `Solüsyon evcil hayvanlar ve çocuklar için güvenli midir?`, a: `Evet, zararlı ağır kimyasallar içermez ve hızla kuruduğundan zemin temaslarında tamamen güvenlidir.` }
      ],
      [
        { q: `Solüsyon köpük yapar mı?`, a: `Hayır, robot süpürgeler için özel olarak geliştirilmiş köpürmeyen (non-foaming) formüle sahiptir.` },
        { q: `Fazla solüsyon konursa ne olur?`, a: `Aşırı deterjan zeminde yapışkanlık yaratır ve robotun tekerleklerinin patinaj yapıp haritayı bozmasına sebep olur.` },
        { q: `İstasyonlu modellerin temiz su tankına konur mu?`, a: `Evet, istasyonun 3-4 litrelik temiz su haznesine 3-4 kapak eklenerek paspas yıkama hijyeni artırılır.` },
        { q: `Solüsyon su nozullarını tıkar mı?`, a: `Aksine, içerisindeki kireç önleyici aktif maddeler nozulların tıkanmasını ve kireçlenmesini engeller.` }
      ],
      [
        { q: `Solüsyonun kokusu nasıldır?`, a: `Hafif, ferahlatıcı ve kalıcı bir botanik kokusu vardır; solunum yollarını rahatsız etmez.` },
        { q: `Mermer ve granit zeminlerde leke bırakır mı?`, a: `Hayır, asitsiz nötr yapısıyla mermerin parlak cilasını matlaştırmaz ve lekesiz kurur.` },
        { q: `Şişe kapağı ölçü kabı olarak kullanılabilir mi?`, a: `Evet, şişe kapağı tam olarak 5 ml ölçüsündedir; 1 litre su için 1 kapak yeterlidir.` },
        { q: `Bir şişe solüsyon ortalama kaç ay yeterlidir?`, a: `Konsantre formülü sayesinde haftada 3 kez paspas yapılan bir evde ortalama 4 ila 6 ay yeterlidir.` }
      ],
      [
        { q: `Sadece saf su yerine solüsyon kullanmak temizliği nasıl etkiler?`, a: `Yağlı mutfak lekelerini, evcil hayvan ayak izlerini ve kurumuş kirleri mekanik olarak hızla çözer.` },
        { q: `Kirli su tankında kötü koku oluşmasını önler mi?`, a: `Evet, antibakteriyel bileşenleri istasyon kirli su haznesinde bakteri üremesini ve koku oluşumunu engeller.` },
        { q: `Solüsyon mop bezine zarar verir mi?`, a: `Hayır, mikrofiber liflerin yumuşaklığını ve gözenekli yapısını koruyarak bezin ömrünü uzatır.` },
        { q: `Son kullanma tarihi var mıdır?`, a: `Kapağı kapalı muhafaza edildiğinde üretim tarihinden itibaren 3 yıl boyunca etkinliğini korur.` }
      ]
    ];
    return solutionFaqs[track];
  }

  if (p === 'sensor-bakimi') {
    const sensorFaqs = [
      [
        { q: `${brand} ${name} LDS lazer kulesi dönmüyor (Error 1), ne yapmalıyım?`, a: `Kuleye toz kaçmış veya ayna kirlenmiş olabilir. Kuleyi elinizle hafifçe çevirerek serbest hareket ettiğini kontrol edin ve pamuklu çubukla lazer gözlerini silin.` },
        { q: `Robot koyu renkli halıya çıkınca neden geri çekilip duruyor?`, a: `Alt kısımdaki kızılötesi düşme (uçurum) sensörleri siyah rengi boşluk algılar. Sensör camlarını mikrofiber bezle silmek veya uygulamadan sanal duvar çekmek sorunu çözer.` },
        { q: `Robot şarj standına yanaşıyor ama şarj olmuyor (Error 13)?`, a: `Robot altındaki ve istasyondaki metal şarj temas plakaları oksitlenmiştir. Kontakları alkollü pamukla ovalayarak parlatınız.` },
        { q: `Sensörler ıslak bezle veya deterjanla silinebilir mi?`, a: `Kesinlikle hayır. Kimyasal deterjanlar optik camları matlaştırır; yalnızca kuru mikrofiber bez veya alkolsüz optik mendil kullanılmalıdır.` }
      ],
      [
        { q: `LDS lazeri göze zarar verir mi?`, a: `Robotlarda kullanılan lazerler Sınıf 1 (Class 1) güvenli kızılötesi lazerlerdir; göze ve evcil hayvanlara zarar vermez.` },
        { q: `Ön tampondaki ToF sensörü ne işe yarar?`, a: `Ön tampon ToF camı robotun mobilyalara ve süpürgeliklere çarpmadan milimetrik mesafede ilerlemesini sağlar.` },
        { q: `Robot haritayı ters çevirdi veya odaları karıştırdı, neden olur?`, a: `LDS aynasının tozlanması veya şarj dockunun yerinin değiştirilmesi harita kaymasına yol açar; sensörleri silip haritayı geri yükleyin.` },
        { q: `Uçurum sensörleri kaç adettir?`, a: `Robotun alt çevresinde genellikle 4 ila 6 adet aşağı yönlü optik düşme sensörü bulunur.` }
      ],
      [
        { q: `Şarj kontaklarındaki paslanma veya kararma nasıl geçer?`, a: `Kurşun kalem silgisiyle plakaları hafifçe silmek veya izopropil alkollü pamukla parlatmak metali anında temizler.` },
        { q: `Lazer kulesine basınçlı hava sıkılır mı?`, a: `Evet, 20-30 cm mesafeden kısa darbelerle hava üflemek iç aynalardaki tozu çizmeden uzaklaştırır.` },
        { q: `Robot aynalara veya cam kapılara neden çarpıyor?`, a: `Lazer ışınları camdan geçer veya aynadan kırılır; bu alanlar uygulamadan "Yasaklı Bölge" olarak işaretlenmelidir.` },
        { q: `Sensör temizliği ne sıklıkla yapılmalıdır?`, a: `Optik hassasiyeti ve kusursuz navigasyonu korumak için haftada bir kez kuru mikrofiber bezle silinmelidir.` }
      ],
      [
        { q: `Ön engel tanıma kamerası nasıl temizlenir?`, a: `Ön tampondaki yapay zeka kamera merceğini çizmemek için mikrofiber gözlük temizleme beziyle nazikçe siliniz.` },
        { q: `Sensör camı kırılırsa ne yapılmalıdır?`, a: `Kırık optik pencere ışığı kırarak navigasyonu kilitler; yetkili parça değişimi gerektirir.` },
        { q: `Robotun şarj dockunu bulamaması sensörle mi ilgilidir?`, a: `Evet, dock üzerindeki kızılötesi sinyal penceresi tozlandığında robot yanaşma açısını bulamaz.` },
        { q: `Sensör bakım rehberini uygulamak garantiyi bozar mı?`, a: `Hayır, dış optik pencerelerin ve kontakların temizliği standart kullanıcı bakım protokolüdür.` }
      ]
    ];
    return sensorFaqs[track];
  }

  if (p === 'reset-ve-wifi') {
    if (isDysonCordless) {
      const dysonResetFaqs = [
        [
          { q: `${brand} ${name} kablosuz süpürgede Wi-Fi veya Bluetooth var mıdır?`, a: `Hayır. Dyson dikey süpürgelerde kablosuz ağ bağlantısı veya mobil uygulama bulunmaz; cihaz doğrudan mekanik tetik ile çalışır.` },
          { q: `Dyson süpürgede donanımsal reset (sıfırlama) nasıl yapılır?`, a: `Bataryayı tutan 3 adet montaj vidasını sökerek bataryayı gövdeden ayırın, 10 dakika bekleyerek anakart statik elektriğini boşaltın ve tekrar takın.` },
          { q: `Tetik basılı kalıyor ve süpürge durmuyor, nedeni nedir?`, a: `İç tetik mekanizma plastiği kırılmış veya mekanik yay sıkışmış olabilir; güçlendirilmiş tetik mandalı takılmalıdır.` },
          { q: `Süpürge şarjda olmasına rağmen çalışmıyor, nasıl sıfırlanır?`, a: `Adaptör fişini prizden çekip 5 dakika bekleyin, batarya kontaklarını kuru bezle silin ve cihazı farklı bir prize takarak deneyin.` }
        ],
        [
          { q: `Dyson tetik mandalı neden kırılır?`, a: `Tetik mekanizması sert basmalarda yüksek torka maruz kalır; plastik yorulması sonucu iç tırnak kırılabilir.` },
          { q: `Batarya şoklama ile sıfırlanabilir mi?`, a: `BMS devresini uyandırmak için orijinal şarj aleti 5 kez peş peşe takılıp çıkarılabilir; ancak kırmızı flaş sürüyorsa batarya bitmiştir.` },
          { q: `Hava akışı klapesi nasıl sıfırlanır?`, a: `Kırmızı hazne açma kolunu 3 kez sertçe aşağı çekip kapatmak giriş klapesini hareketlendirerek emniyeti sıfırlar.` },
          { q: `MAX modu kilidi nasıl açılır?`, a: `Gövde üzerindeki güç modunu ECO veya Normal seviyeye alıp cihazı 30 dakika soğumaya bırakınız.` }
        ],
        [
          { q: `Dyson V8 / V11 gövdesi reset için tamamen sökülmeli midir?`, a: `Hayır, sadece bataryanın vidalarını çıkarıp beklemek elektronik yükü boşaltmak için yeterlidir.` },
          { q: `Tetik gevşek sallanıyorsa mekanik çözümü nedir?`, a: `Gövde açılarak kırılan plastik mandalın yerine metal takviyeli yeni mandal takılması kalıcı çözümdür.` },
          { q: `Motor emniyet kilidi neden devreye girer?`, a: `Filtre tamamen tıkandığında motorun yanmasını önlemek için sistem gücü otomatik olarak keser.` },
          { q: `Sıfırlama sonrası süpürge çalışmazsa sorun nerededir?`, a: `Sorun ya batarya hücrelerinin kalıcı çöküşünden ya da motor kömürsüz sürücü kartından kaynaklanır.` }
        ],
        [
          { q: `Dyson bataryası gövdeden ayrılınca garanti bozulur mu?`, a: `Hayır, batarya sökülebilir bir sarf malzemedir ve vida yerleri servis mührü içermez.` },
          { q: `Adaptör kablosunda kırık olup olmadığı nasıl anlaşılır?`, a: `Kabloyu hafifçe oynattığınızda şarj ledi sönüp yanıyorsa adaptör kablosu temassızlık yapıyordur.` },
          { q: `Süpürgeyi kapatıp açma tuşu var mıdır?`, a: `Dyson dikey süpürgeler sadece tetiğe basıldığında çalışır; tetiği bıraktığınızda anında durur.` },
          { q: `Statik elektrik sıfırlama işlemi ne işe yarar?`, a: `Kondansatörlerdeki hatalı hata kodlarını temizleyerek BMS kartının yeniden başlamasını sağlar.` }
        ]
      ];
      return dysonResetFaqs[track];
    }

    const robotResetFaqs = [
      [
        { q: `${brand} ${name} Wi-Fi ağına bağlanmıyor, nedeni nedir?`, a: `Modeminizin 5 GHz bandında olması en yaygın nedendir. Akıllı robotlar yalnızca 2.4 GHz frekansını destekler. Modemden 2.4 GHz bandını ayrı bir SSID ile seçiniz.` },
        { q: `Wi-Fi nasıl sıfırlanır?`, a: `Robotun Güç ve Şarj (Home) tuşlarına aynı anda 3 saniye basılı tutunuz. "Wi-Fi sıfırlandı" sesli uyarısını duyduğunuzda Wi-Fi ledi yavaşça yanıp sönmeye başlar.` },
        { q: `Fabrika ayarlarına sıfırlama (Hard Reset) nasıl yapılır?`, a: `Üst kapak altındaki küçük reset deliğine ataşla 5 saniye basılı tutunuz. Robot "Fabrika ayarlarına dönülüyor" ikazı vererek yeniden başlar.` },
        { q: `Resetleme sonrası haritalar silinir mi?`, a: `Yalnızca Wi-Fi sıfırlamada haritalar silinmez. Ancak pinhole deliğinden fabrika resetlemesi yapılırsa haritalar silinir ve evi baştan haritalandırmak gerekir.` }
      ],
      [
        { q: `Uygulamada robot neden sürekli "Çevrimdışı" görünüyor?`, a: `Modemin DHCP IP adresi kiralama süresi dolmuş veya robot Wi-Fi sinyalinin zayıf olduğu kör noktada kalmış olabilir; modemi yeniden başlatınız.` },
        { q: `Wi-Fi şifresinde hangi karakterler olmamalıdır?`, a: `Türkçe karakterler (ç, ğ, ı, ö, ş, ü) ve karmaşık semboller (@, #, !) bağlantı hatasına yol açabilir; sadece harf ve rakam kullanılmalıdır.` },
        { q: `Kurulum esnasında telefon robota bağlanamıyor?`, a: `Telefonunuzun Mobil Veri (Hücresel Veri) özelliğini kapatın ve Konum (GPS) servisini açarak kuruluma devam edin.` },
        { q: `Modem şifresi değiştiğinde ne yapılmalıdır?`, a: `Robotun iki ana tuşuna basarak Wi-Fi sıfırlanmalı ve yeni şifreyle uygulama üzerinden tekrar eşleştirilmelidir.` }
      ],
      [
        { q: `Robotun Wi-Fi ışığı mavi hızlı yanıp sönüyorsa anlamı nedir?`, a: `Cihazın ev Wi-Fi ağına veya bulut sunucularına bağlanmaya çalıştığını gösterir.` },
        { q: `Robotun Wi-Fi ışığı sabit mavi yanıyorsa anlamı nedir?`, a: `Robotun başarıyla modeme ve bulut sunucusuna bağlandığını, kontrole hazır olduğunu belirtir.` },
        { q: `Yazılım güncellemesi (Firmware Update) sırasında robot kapanırsa ne olur?`, a: `Pinhole reset deliğine basılarak fabrika çıkış işletim sistemi geri yüklenmelidir.` },
        { q: `Misafir Wi-Fi (Guest Network) üzerinden bağlantı kurulabilir mi?`, a: `Genellikle hayır, çünkü misafir ağları yerel cihazların birbirini görmesini engeller; ana 2.4 GHz ağı seçilmelidir.` }
      ],
      [
        { q: `Mobil uygulama robotu bulamıyorsa ilk adım ne olmalıdır?`, a: `Robotu modemin 1 metre yanına taşıyın, Bluetooth'u açın ve Wi-Fi sıfırlama tuşlarına 3 saniye basılı tutun.` },
        { q: `Robot birden fazla telefondan kontrol edilebilir mi?`, a: `Evet, ana kullanıcı uygulamanın "Cihazı Paylaş" menüsünden aile bireylerinin hesaplarına yetki verebilir.` },
        { q: `Harita ters döndüğünde reset atmak şart mıdır?`, a: `Önce uygulama menüsünden "Haritayı Geri Yükle" seçeneği denenmeli; düzelmezse fabrika resetlemesi yapılmalıdır.` },
        { q: `Statik IP tanımlamak bağlantı kopmasını engeller mi?`, a: `Evet, modem arayüzünden robotun MAC adresine sabit IP atamak kopma sorununu %100 çözer.` }
      ]
    ];
    return robotResetFaqs[track];
  }

  if (p === 'hata-kodlari') {
    if (isDysonCordless) {
      const dysonErrorFaqs = [
        [
          { q: `${brand} ${name} süpürgem tetiğe basınca kesik kesik çalışıyor ve duruyor (vut-vut sesi), nedeni nedir?`, a: `Bu bir arıza değil, Dyson motor emniyet sistemidir (pulsing). Hava akışında, çubuk boruda veya HEPA filtrede tıkanıklık olduğunda motorun yanmasını önlemek için cihaz gücü keser. Filtreyi yıkayıp hazne girişindeki valfi temizlediğinizde sorun anında çözülür.` },
          { q: `${brand} ${name} bataryasında 32 kez kırmızı ışık yanıp sönüyor, nasıl düzelir?`, a: `Aralıksız kırmızı ışık flaşı (genellikle 12 veya 32 kez), Batarya Yönetim Sistemi'nin (BMS) ya da lityum hücrelerin kalıcı voltaj çöküşü yaşadığını gösterir. Cihaz kendini kilitler; çözümü yeni bir Dyson uyumlu batarya paketi takmaktır.` },
          { q: `Süpürge çalışırken aniden durdu ve sarı (kehribar) ışık yandı, ne yapmalıyım?`, a: `Sarı ışık aşırı ısınma korumasıdır. Genellikle MAX modunda uzun süreli kullanım sonrası oluşur. Cihazı prize takmadan, oda sıcaklığında 30 ila 45 dakika motorun ve bataryanın soğumasını bekleyin; ardından normale döner.` },
          { q: `${brand} ${name} modelinde dijital hata ekranı veya hata numarası var mı?`, a: `Hayır. Dyson V7, V8 gibi dikey modellerde LCD ekran bulunmaz. Tüm arıza ve durum bildirimleri motorun kesik kesik ses çıkarması (pulsing) ve batarya üzerindeki renkli LED ışık kodlarıyla iletilir.` }
        ],
        [
          { q: `Rulo fırça dönmüyor ancak motor çalışıyor, sorun nerede?`, a: `Direct drive başlık motoru aşırı saç dolanması nedeniyle kendini korumaya almıştır. Yan kilit vidasını bozuk parayla açıp rulmandaki saçları temizleyin.` },
          { q: `Tetiğe basınca mavi ışık hızla yanıp sönüyor, cihaz çalışmıyor?`, a: `Batarya şarjı kritik %0 seviyesindedir. Şarj adaptörünü prize takıp süpürgeyi en az 3.5 saat şarj ediniz.` },
          { q: `Filtre temiz olduğu halde motor pulsing yapmaya devam ediyor?`, a: `Şeffaf toz haznesi girişindeki kırmızı/şeffaf esnek klapede peçete veya çorap sıkışmış olabilir; boruyu çıkarıp deliği kontrol edin.` },
          { q: `Tetik basılı kalıyor ve motor durmuyor, çözümü nedir?`, a: `Gövde içindeki plastik tetik mandalı kırılmıştır; güçlendirilmiş yedek tetik değişimi yapılması gerekir.` }
        ],
        [
          { q: `Süpürge şarjdayken batarya LED'i hiç yanmıyor?`, a: `Şarj adaptöründe temassızlık olabilir veya batarya BMS devresi tamamen çökmüştür; adaptör prizini ve jak ucunu kontrol ediniz.` },
          { q: `Dyson süpürgeden yanık kokusu geliyorsa ne yapılmalıdır?`, a: `Derhal tetiği bırakın ve bataryayı sökün. Genellikle nemli filtre takılması veya motora yabancı cisim kaçması sonucu oluşur.` },
          { q: `MAX moduna alınca süpürge 5 saniye sonra duruyor?`, a: `Batarya hücrelerinin kimyasal ömrü tükenmiştir; normal modda çalışsa bile yüksek akımı taşıyamıyordur, batarya yenilenmelidir.` },
          { q: `Süpürge çalışırken yüksek tiz ıslık sesi çıkarıyor?`, a: `Filtre contası hava kaçırıyor veya siklon giriş kanallarında küçük bir yabancı cisim hava türbülansı yaratıyordur.` }
        ],
        [
          { q: `Dyson arızaları yetkili servise gitmeden evde çözülebilir mi?`, a: `Evet, arızaların %90'ı filtre yıkama, boru tıkanıklığı açma ve batarya/tetik değişimi gibi evde 5 dakikada yapılabilecek işlemlerdir.` },
          { q: `Kırmızı ışık 1 kez yanıp sönerse anlamı nedir?`, a: `Genellikle motor başlığında kısa devre olduğunu veya başlık elektrik kablosunun temassızlık yaptığını gösterir.` },
          { q: `Filtre yıkandıktan kaç saat sonra takılabilir?`, a: `En az 24 saat oda sıcaklığında kurumalıdır; ıslak takmak motorun yanmasına ve arıza kodlarına sebep olur.` },
          { q: `Çubuk boruda tıkanıklık olduğu nasıl anlaşılır?`, a: `Boruyu gövdeden ayırıp içine bozuk para atın; para diğer uçtan düşmüyorsa içeride tıkanıklık vardır.` }
        ]
      ];
      return dysonErrorFaqs[track];
    }

    const errorFaqs = [
      [
        { q: `${brand} ${name} robot süpürgem "Error 1: LDS sensörü engellendi" hatası veriyor, ne yapmalıyım?`, a: `Robotun üstündeki döner lazer kulesine toz kaçmış veya optik ayna kirlenmiştir. Kulenin elinizle rahatça döndüğünü kontrol edin, basınçlı hava veya pamuklu çubukla lazer deliklerini temizleyin.` },
        { q: `Robot kendi etrafında dönüp duruyor ve "Error 2: Tampon sıkıştı" diyor?`, a: `Ön çarpışma tamponunun iki tarafına hafifçe parmaklarınızla tıklatarak yaylanma hareketini serbest bırakın; araya sıkışan küçük parçacıkları temizleyin.` },
        { q: `Robot halıda veya düz zeminde durup "Error 4: Düşme sensörlerini temizleyin" uyarısı veriyor?`, a: `Robotu ters çevirin ve alt kenarlardaki 4 ila 6 adet kızılötesi düşme sensörü penceresini kuru mikrofiber bezle silin. Siyah halılarda sensör kılıfı veya sanal duvar kullanın.` },
        { q: `Robot süpürgelerde sesli hata kodlarının nedeni nedir?`, a: `Robot anakartı, fırça sıkışması (Error 5), tekerlek zorlanması (Error 7) veya filtre tıkanması (Error 10) gibi durumlarda motoru yanmaktan korumak için güvenliğe geçer ve hata kodu bildirir.` }
      ],
      [
        { q: `"Error 5: Ana fırça sıkıştı" hatası nasıl giderilir?`, a: `Fırça kafesini açıp ruloyu çıkarın; özellikle fırça uçlarındaki çıkarılabilir yatak başlıklarını sökerek çelik mildeki saçları temizleyin.` },
        { q: `"Error 10: Filtre tıkalı veya ıslak" uyarısı neden verilir?`, a: `Toz haznesi filtresi yıkanıp 24 saat tam kurutulmadan takıldıysa veya gözenekleri aşırı dolduysa vakum basıncı düşer ve bu uyarı üretilir.` },
        { q: `"Error 13: Şarj hatası" nasıl çözülür?`, a: `Robot altındaki ve şarj istasyonundaki metal şarj plakalarını alkollü pamukla silerek oksit ve tozu temizleyin; robotu elle docka oturtun.` },
        { q: `"Error 12: Düşük pil" uyarısı ne zaman batarya değişimini gösterir?`, a: `Robot şarj istasyonuna dönemeden evin ortasında aniden kapanıyorsa batarya hücreleri ömrünü tamamlamıştır; yeni batarya takılmalıdır.` }
      ],
      [
        { q: `Robot düz gidemiyor, daire çiziyor ve "Error 7" veriyor?`, a: `Sağ veya sol tahrik tekerleğinin aksına saç dolanmıştır. Tekerleği elinizle döndürerek direnci hissedin ve saçları cımbızla temizleyin.` },
        { q: `Robot merdiven kenarında değilken neden durup düşme uyarısı verir?`, a: `Sensör pencerelerinde statik toz tabakası birikmiştir; kuru bezle silindiğinde optik yansıma düzelir.` },
        { q: `Uygulamada "Cihaz Çevrimdışı" hatası nasıl giderilir?`, a: `Güç ve Şarj tuşlarına 3 saniye basarak Wi-Fi'ı sıfırlayın ve modemin 2.4 GHz bandına yeniden eşleştirin.` },
        { q: `Robotun sensörleri temizlendiği halde hata devam ederse ne yapılır?`, a: `Güç tuşuna 5 saniye basarak cihazı kapatıp 10 saniye sonra açınız (soft reset); düzelmezse pinhole deliğinden fabrika resetlemesi yapınız.` }
      ],
      [
        { q: `Error 18 fan hatası ne anlama gelir?`, a: `Vakum türbin fanına yabancı cisim kaçtığını veya motorun aşırı akım çektiğini gösterir; toz haznesi arkasındaki motor ızgarası kontrol edilmelidir.` },
        { q: `Robot şarj dockunu bulamıyor, etrafında dönüyor?`, a: `Dock önündeki kızılötesi panel tozlanmıştır veya dock etrafında 0.5 metrelik engel vardır; önünü açıp paneli siliniz.` },
        { q: `Mop bezi takılı olduğu halde su gelmiyor uyarısı?`, a: `Su tankı filtreleri kireçlenmiştir; ılık arıtılmış suyla filtreleri yıkayın veya yeni filtre tapası takın.` },
        { q: `Hata kodları sonrası parça değişimi garantiyi etkiler mi?`, a: `Hayır, filtre, ana fırça, yan fırça ve batarya gibi parçalar standart kullanıcı değişimine uygun tasarlanmıştır.` }
      ]
    ];
    return errorFaqs[track];
  }

  return [
    { q: `${brand} ${name} parçası nasıl değiştirilir?`, a: `Eski parçayı tırnaklarından serbest bırakarak çıkarıp yeni parçayı yerine oturtarak kolayca değiştirebilirsiniz.` },
    { q: `Bu parça orijinal standartta mıdır?`, a: `Evet, cihazınızın fabrika mekanik toleranslarına ve boyutlarına %100 uyumludur.` }
  ];
}

module.exports = {
  getTailoredFaqs
};
