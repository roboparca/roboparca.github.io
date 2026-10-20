// lib/content/steps.js - 4 Distinct Step-by-Step DIY Protocol Tracks per Category
const { simpleHash } = require('./helpers');

function getStepByStepGuide(model, part) {
  const p = part.slug;
  const b = model.brand;
  const n = model.name;
  const isDysonCordless = b.toLowerCase() === 'dyson' && !n.includes('360');
  const track = simpleHash(`${model.slug}-${p}-step-v10`) % 4;

  if (p === 'hepa-filtre') {
    if (isDysonCordless) {
      const dysonFilterSteps = [
        [
          { s: 'Adım 1', t: 'Filtreleri Çıkarın', d: `${b} ${n} üst konik çubuk filtreyi çekip çıkarın; arka mor HEPA filtreyi saat yönünün tersine çeyrek tur çevirerek gövdeden ayırın.` },
          { s: 'Adım 2', t: 'Kaba Tozu Çırpın', d: 'Filtreleri çöp kovasına hafifçe vurarak biriken kaba toz ve tüy tabakasını dökün (kesinlikle sert cisimle kazımayın).' },
          { s: 'Adım 3', t: 'Soğuk Suyla Yıkayın', d: 'Yalnızca soğuk musluk suyu altında, deterjan veya sabun kullanmadan su berrak akana kadar durulayın.' },
          { s: 'Adım 4', t: '24 Saat Tam Kurutun', d: 'Radyatör veya doğrudan güneş ışığına maruz bırakmadan, oda sıcaklığında en az 24 saat tam kurutun; ıslak takmayın.' }
        ],
        [
          { s: 'Adım 1', t: 'Güvenlik Kontrolü', d: `${b} ${n} tetiğini bırakın ve şarj kablosundan ayırın; cihazın kapalı olduğundan emin olun.` },
          { s: 'Adım 2', t: 'Siklon Haznesini Boşaltın', d: 'Kırmızı mandalı aşağı iterek şeffaf hazneyi açın ve siklon girişindeki kaba pislikleri temizleyin.' },
          { s: 'Adım 3', t: 'Filtre Kartuşunu Durulayın', d: 'Ön ve arka filtreleri akan ılık musluk suyu altında hafifçe çevirerek yıkayın; lifleri ezmeyin.' },
          { s: 'Adım 4', t: 'Kuruma ve Yerleştirme', d: 'Filtrelerin tamamen kuruduğunu parmağınızla kontrol edin; arka filtreyi tık sesini duyana kadar çevirip kilitleyin.' }
        ],
        [
          { s: 'Adım 1', t: 'Arka Egzoz Filtresini Çevirin', d: `${b} ${n} motorunun arkasındaki HEPA kapağını nokta işaretleri hizalanana kadar saat yönünün tersine çevirin.` },
          { s: 'Adım 2', t: 'Mikron Gözenek Kontrolü', d: 'Filtre pileleri arasında biriken gri toz tabakasını hafif hava üfleyerek veya yumuşak fırçayla gevşetin.' },
          { s: 'Adım 3', t: 'Deterjansız Yıkama', d: 'Filtre içerisine soğuk su doldurup elinizle çalkalayarak akıtın; köpük yapıcı hiçbir kimyasal kullanmayın.' },
          { s: 'Adım 4', t: 'Hava Sirkülasyonlu Kurutma', d: 'Filtreyi hava alan bir pencere kenarında 24 saat bekletin; nemli takılması motorda koku yapar.' }
        ],
        [
          { s: 'Adım 1', t: 'Ön Çubuk Filtreyi Çekin', d: `${b} ${n} siklonunun tam ortasında yer alan üst çubuk filtreyi parmaklarınızla yukarı doğru çekerek çıkarın.` },
          { s: 'Adım 2', t: 'Gövde Hava Kanalı İncelemesi', d: 'Filtrenin oturduğu dairesel yuvaya fenerle bakın, tıkanıklık varsa uzun bir cımbızla temizleyin.' },
          { s: 'Adım 3', t: 'Filtreyi Sıkıp Durulayın', d: 'Filtre süngerini su altında hafifçe sıkarak arındırın; şeklini bozacak şekilde burkmayın.' },
          { s: 'Adım 4', t: 'Montaj ve Test', d: 'Tam kuruyan filtreyi yerine bastırın; tetiğe basarak motorun kesintisiz ve tek ses çalıştığını doğrulayın.' }
        ]
      ];
      return dysonFilterSteps[track];
    }

    const robotFilterSteps = [
      [
        { s: 'Adım 1', t: 'Hazneyi Çıkarın', d: `${b} ${n} üst kapağını açıp toz kutusu mandalına basarak kutuyu robottan ayırın ve çöpe boşaltın.` },
        { s: 'Adım 2', t: 'Filtreyi Ayırın', d: 'Hazne kapağındaki tırnağı gevşetip filtreyi çıkarın; hafifçe vurarak gözeneklerdeki kaba tozu dökün.' },
        { s: 'Adım 3', t: 'Deterjansız Yıkayın', d: 'Musluk altında hafif su akışıyla filtreyi yıkayın; lif yapısını zedelememek için kesinlikle fırça veya sabun kullanmayın.' },
        { s: 'Adım 4', t: '24 Saat Kurutma', d: 'Filtreyi gölgede en az 24 saat tamamen kurutun. Nemli takılırsa motora nem çekerek Error 10 hatasına yol açar.' }
      ],
      [
        { s: 'Adım 1', t: 'Toz Kutusu Kapağını Açın', d: `${b} ${n} toz haznesini çıkarıp yan mandala basarak içindeki partikülleri çöp kutusuna boşaltın.` },
        { s: 'Adım 2', t: 'Ön Izgara Temizliği', d: 'Filtre önündeki ince file katmanında biriken saç ve tüyleri parmağınızla sıyırarak alın.' },
        { s: 'Adım 3', t: 'Soğuk Suyla Çalkalama', d: 'Filtreyi ters tarafından soğuk su tutarak yıkayın; suyun basınçlı olmamasına dikkat edin.' },
        { s: 'Adım 4', t: 'Gölgede Tam Kurutma', d: 'Filtreyi kalorifer peteği üzerine koymadan, oda sıcaklığında 24 saat kurutup yerine sıkıca oturtun.' }
      ],
      [
        { s: 'Adım 1', t: 'Robotu Durdurun', d: `${b} ${n} temizlik döngüsünü durdurup cihazı şarj istasyonundan 1 metre uzağa alın.` },
        { s: 'Adım 2', t: 'Filtre Çerçevesini Çözün', d: 'Haznenin arkasındaki silikon contalı filtre kartuşunu tırnaklarından serbest bırakarak çekin.' },
        { s: 'Adım 3', t: 'Hava Basıncı veya Hafif Vurma', d: 'Filtreyi sertçe değil, lavabo kenarına tık tık vurarak mikro peteklerdeki kireç ve un tozunu dökün.' },
        { s: 'Adım 4', t: 'Yedek Filtre Montajı', d: 'Yıkanan filtre kururken cihazı bekletmemek için temiz kuru yedek filtreyi takıp kapağı kapatın.' }
      ],
      [
        { s: 'Adım 1', t: 'Toz Kutusu Mandalı', d: `${b} ${n} haznesini tek elle mandala basarak yuvasından dışarı doğru kaydırın.` },
        { s: 'Adım 2', t: 'Conta Sızdırmazlık İncelemesi', d: 'Filtre kenarındaki siyah kauçuk contada aşınma veya yırtık olup olmadığını kontrol edin.' },
        { s: 'Adım 3', t: 'Su Altında Arındırma', d: 'Filtreyi deterjansız akar suyun altında 30 saniye gezdirin; mikro deliklerin açılmasını sağlayın.' },
        { s: 'Adım 4', t: 'Tam Kuruluk ve Yerleşim', d: 'Filtre tamamen kuruduktan sonra hazneye takıp klik sesini duyun; cihaz hava akışını otomatik kalibre eder.' }
      ]
    ];
    return robotFilterSteps[track];
  }

  if (p === 'ana-firca') {
    if (isDysonCordless) {
      const dysonRollerSteps = [
        [
          { s: 'Adım 1', t: 'Başlığı Ayırın', d: `${b} ${n} motorlu zemin başlığını kırmızı çıkarma düğmesine basarak çubuk borudan ayırın.` },
          { s: 'Adım 2', t: 'Kilit Vidasını Çevirin', d: 'Başlığın yan tarafındaki plastik kilit vidasını bozuk para veya madeni parayla çeyrek tur çevirip açın.' },
          { s: 'Adım 3', t: 'Ruloyu Dışarı Kaydırın', d: 'Rulo fırçayı yuvadan dışarı kaydırıp çıkarın; rulman miline sarılan saç ve ipleri makasla kesin.' },
          { s: 'Adım 4', t: 'Yerleştirip Kilitleyin', d: 'Ruloyu yerine oturtup yan kapağı bastırın ve kilit vidasını tekrar çevirerek sabitleyin.' }
        ],
        [
          { s: 'Adım 1', t: 'Güç Kesintisi', d: 'Süpürgeyi tetiğe basılmayacak güvenli bir masaya koyun ve başlığı gövdeden ayırın.' },
          { s: 'Adım 2', t: 'Uç Kapağı Serbest Bırakın', d: 'Yan taraftaki kilit tırnağını ok yönünde çevirerek uç destek braketini çıkarın.' },
          { s: 'Adım 3', t: 'Karbon Fiber Şerit Kontrolü', d: 'Rulo üzerindeki kırmızı ve mavi lifleri kontrol edin; sert kalıntıları elinizle ayıklayın.' },
          { s: 'Adım 4', t: 'Rulman Yuvasını Test Edin', d: 'Ruloyu taktıktan sonra elinizle bir tur çevirerek sürtünmesiz serbest döndüğünü onaylayın.' }
        ],
        [
          { s: 'Adım 1', t: 'Motorhead Başlığını Ters Çevirin', d: `${b} ${n} zemin başlığını ters çevirip alt tabla kılavuzunu inceleyin.` },
          { s: 'Adım 2', t: 'Mekanik Kilidi Açın', d: 'Bozuk parayla uç kilit mekanizmasını 90 derece döndürerek kilidi serbest bırakın.' },
          { s: 'Adım 3', t: 'Saç ve Lifleri Ayıklayın', d: 'Rulonun metal tahrik soketinde biriken lifleri temizleyin; suyla temas ettirmeyin.' },
          { s: 'Adım 4', t: 'Geri Montaj', d: 'Fırçayı tırnaklara denk getirip itin ve kapağı kilitleyip başlığı çubuğa takın.' }
        ],
        [
          { s: 'Adım 1', t: 'Temizleme Alanı Hazırlığı', d: 'Zeminde havlu açarak başlığı üzerine koyun ve elektrik pimlerini temizleyin.' },
          { s: 'Adım 2', t: 'Silindir Ruloyu Kaydırın', d: 'Uç mandalı açıp silindiri hafifçe çekerek yatağından çıkarın.' },
          { s: 'Adım 3', t: 'Hava Boğazı Kontrolü', d: 'Fırçanın arkasındaki vakum emiş boğazına bakın, kaçmış çorap veya kaba çöp varsa çıkarın.' },
          { s: 'Adım 4', t: 'Tork Doğrulaması', d: 'Ruloyu yerine oturtup kilidi kapatın; tetiğe basıp fırçanın yüksek devirde döndüğünü görün.' }
        ]
      ];
      return dysonRollerSteps[track];
    }

    const robotRollerSteps = [
      [
        { s: 'Adım 1', t: 'Robotu Ters Çevirin', d: `${b} ${n} robotunuzu çizmeyen yumuşak bir zemine ters yatırın.` },
        { s: 'Adım 2', t: 'Fırça Kafesini Açın', d: 'Fırça kafesi üzerindeki iki kırmızı/turuncu mandalı içe doğru sıkarak kafes kapağını kaldırın.' },
        { s: 'Adım 3', t: 'Rulman Kapaklarını Sökün', d: 'Ana fırçayı kaldırıp uçlardaki çıkarılabilir yatak başlıklarını çekip çıkarın; mildeki saçları temizleyin.' },
        { s: 'Adım 4', t: 'Yuvaya Oturtun', d: 'Fırçanın kare veya altıgen ucunu tahrik motoruna denk getirip kafes kapağını tık sesiyle kapatın.' }
      ],
      [
        { s: 'Adım 1', t: 'Cihazı Kapatın', d: `${b} ${n} güç tuşuna 3 saniye basarak cihazı kapatın ve ters çevirin.` },
        { s: 'Adım 2', t: 'Fırça Çerçevesini Çıkarın', d: 'Kafes mandallarını gevşetip tel ızgaralı koruma kapağını gövdeden ayırın.' },
        { s: 'Adım 3', t: 'Temizleme Bıçağı ile Kesin', d: 'Rulo etrafındaki saç oluğuna temizleme bıçağını sokup saçları boydan boya kesin.' },
        { s: 'Adım 4', t: 'Kafesi Kilitleyin', d: 'Yeni veya temizlenmiş ruloyu yuvasına yerleştirin; kafes mandallarının yerine kilitlendiğini doğrulayın.' }
      ],
      [
        { s: 'Adım 1', t: 'Alt Gövdeye Ulaşın', d: 'Robotu halı üzerine koyup fırça bölmesini el feneriyle aydınlatın.' },
        { s: 'Adım 2', t: 'Rulo Fırçayı Yukarı Kaldırın', d: 'Mandalları açtıktan sonra fırçanın rulmanlı ucunu hafifçe yukarı kaldırıp dışarı çekin.' },
        { s: 'Adım 3', t: 'Dişli Soketini Arındırın', d: 'Motor tahrik yuvasına kaçmış toz ve saç yumağını cımbızla alıp yatağı rahatlatın.' },
        { s: 'Adım 4', t: 'Serbest Dönüş Testi', d: 'Fırçayı takıp parmağınızla döndürün; takılma yoksa kafesi kapatıp robotu düz çevirin.' }
      ],
      [
        { s: 'Adım 1', t: 'Güvenli Konumlandırma', d: `${b} ${n} robotunu düz bir masaya alın ve üst kapak kilitlerini sarsmayın.` },
        { s: 'Adım 2', t: 'Kafes Tırnaklarını Bastırın', d: 'Sağ ve sol kilit tırnaklarını aynı anda bastırarak fırça çerçevesini serbest bırakın.' },
        { s: 'Adım 3', t: 'Kauçuk Bıçak Kontrolü', d: 'Rulo üzerindeki kauçuk sıyırıcı kanatların yırtılıp yırtılmadığını kontrol edin; aşınmışsa yenileyin.' },
        { s: 'Adım 4', t: 'Kapatma ve Kalibrasyon', d: 'Rulonun doğru yönde takıldığından emin olun ve kafesi tık sesi gelene kadar bastırın.' }
      ]
    ];
    return robotRollerSteps[track];
  }

  if (p === 'yan-firca') {
    const sideBrushSteps = [
      [
        { s: 'Adım 1', t: 'Vidayı Sökün', d: `${b} ${n} ters çevirin; yan fırça göbeğindeki yıldız vidayı uygun tornavidayla gevşetin.` },
        { s: 'Adım 2', t: 'Fırçayı Yukarı Çekin', d: 'Fırça gövdesini iki parmağınızla hafifçe yukarı çekerek altıgen şafttan ayırın.' },
        { s: 'Adım 3', t: 'Mil Yuvasını Temizleyin', d: 'Şaft etrafına sarılmış saç ve iplikleri cımbızla tamamen temizleyin.' },
        { s: 'Adım 4', t: 'Yeni Fırçayı Sabitleyin', d: 'Yeni yan fırçayı şafta oturtun ve vidayı aşırı sıkmadan tatlı sert vidalayın.' }
      ],
      [
        { s: 'Adım 1', t: 'Robotu Güvenliğe Alın', d: `${b} ${n} cihazını kapatın ve ön tekerleğin serbest döndüğünü kontrol edin.` },
        { s: 'Adım 2', t: 'Tırnaklı/Vidalı Ayırma', d: 'Fırça tipine göre vidayı açın veya geçmeli tırnakları çekerek fırçayı gövdeden çıkarın.' },
        { s: 'Adım 3', t: 'Sıcak Su İle Düzeltme', d: 'Kollarda eğrilme varsa 80°C sıcak suda 30 saniye bekleterek fabrika düzlüğüne getirin.' },
        { s: 'Adım 4', t: 'Geri Montaj', d: 'Fırçayı şafta tam oturtup sabitleyin; elle döndürerek sürtünmesiz çalıştığını teyit edin.' }
      ],
      [
        { s: 'Adım 1', t: 'Köşe Bölgesini İnceleyin', d: `${b} ${n} yan fırça bölgesindeki tozları fırça yardımıyla süpürün.` },
        { s: 'Adım 2', t: 'Şaft Bağlantısını Çözün', d: 'Merkezdeki bağlantı vidasını sökerek fırçayı tahrik motorundan ayırın.' },
        { s: 'Adım 3', t: 'Motor Contası Kontrolü', d: 'Şaft dibindeki kauçuk toz contasının yerinde ve sağlam olduğunu gözlemleyin.' },
        { s: 'Adım 4', t: 'Yeni Fırça Yerleşimi', d: 'Orijinal standarttaki yedek fırçayı oturtup vidayı kilitleyin; rotayı test edin.' }
      ],
      [
        { s: 'Adım 1', t: 'Uygun Tornavida Seçimi', d: 'PH1 uçlu yıldız tornavida kullanarak vida başını sıyırmadan nazikçe açın.' },
        { s: 'Adım 2', t: 'Eski Parçayı Alın', d: 'Aşınmış veya kopmuş kollara sahip eski yan fırçayı gövdeden ayırın.' },
        { s: 'Adım 3', t: 'Pirinç Yuva Temizliği', d: 'Motor milindeki pirinç dişliye dolanmış lifleri çıkarıp yuvayı temizleyin.' },
        { s: 'Adım 4', t: 'Montaj ve Dönüş Doğrulaması', d: 'Yeni fırçayı yerleştirin, vidayı sıkın ve robotu başlatarak kenar süpürmesini izleyin.' }
      ]
    ];
    return sideBrushSteps[track];
  }

  if (p === 'mop-bezi') {
    const mopSteps = [
      [
        { s: 'Adım 1', t: 'Mop Tablasını Ayırın', d: `${b} ${n} arkasındaki iki mandala basarak mop braketini dışarı kaydırın.` },
        { s: 'Adım 2', t: 'Bezi Cırt Cırttan Sıyırın', d: 'Mop bezini cırt cırt tutucudan ve kenar montaj rayından çekerek çıkartın.' },
        { s: 'Adım 3', t: 'Ilık Suda Yıkayın', d: 'Bezi musluk altında doğal sabunla yıkayın; asla çamaşır yumuşatıcısı kullanmayın.' },
        { s: 'Adım 4', t: 'Kızağa Geçirip Yapıştırın', d: 'Bezin oluklu fitilini tablaya geçirip cırt cırta gergin şekilde yapıştırın.' }
      ],
      [
        { s: 'Adım 1', t: 'Paspas Modülünü Çözün', d: 'Robot dururken mop tablasını tırnaklarından serbest bırakıp çıkarın.' },
        { s: 'Adım 2', t: 'Mikrofiber Lif Kontrolü', d: 'Bezin alt yüzeyindeki liflerin keçeleşip keçeleşmediğini kontrol edin; sertleşmişse yenileyin.' },
        { s: 'Adım 3', t: '40°C Makine Yıkaması', d: 'Mop bezini çamaşır makinesinde 40°C kısa programda deterjansız/az deterjanla yıkayın.' },
        { s: 'Adım 4', t: 'Tam Kuruma ve Takma', d: 'Bezi hava alan yerde kurutun veya yedek bezi takarak robotu hazır hale getirin.' }
      ],
      [
        { s: 'Adım 1', t: 'Döner Pedleri Ayırın (Spinning)', d: 'Döner moplu modellerde cırt cırtlı disk pedleri çekerek başlıklardan ayırın.' },
        { s: 'Adım 2', t: 'Zemin Baskı Tablasını Silin', d: 'Pedlerin altındaki plastik tutucu yüzeyi ıslak mendille silerek tozlardan arındırın.' },
        { s: 'Adım 3', t: 'Manuel Durulama', d: 'Pedleri ılık su dolu kapta çitileyerek biriken deterjan ve kir artıklarını akıtın.' },
        { s: 'Adım 4', t: 'Simetrik Yerleşim', d: 'Pedleri disklerin merkezine denk gelecek şekilde yapıştırarak dönüş dengesini sağlayın.' }
      ],
      [
        { s: 'Adım 1', t: 'Su Tankı İle Birlikte Ayırma', d: 'Kombine hazneli modellerde mandallara basarak tank ve mop ünitesini çıkarın.' },
        { s: 'Adım 2', t: 'Fitil Rayından Sıyırma', d: 'Mop bezinin yan kılavuz fitilini plastik raydan kaydırarak tabladan ayırın.' },
        { s: 'Adım 3', t: 'Antibakteriyel Kurutma', d: 'Koku oluşumunu engellemek için yıkanan bezi doğrudan güneşte veya havadar yerde kurutun.' },
        { s: 'Adım 4', t: 'Halı Sensör Uyumu', d: 'Yeni bezi kırışıklık olmadan düzgünce yapıştırın; otomatik mop kaldırma payını kontrol edin.' }
      ]
    ];
    return mopSteps[track];
  }

  if (p === 'toz-torbasi') {
    const bagSteps = [
      [
        { s: 'Adım 1', t: 'İstasyon Kapağını Açın', d: `${b} ${n} otomatik boşaltma istasyonunun üst kapağını yukarı doğru kaldırın.` },
        { s: 'Adım 2', t: 'Kolu Çekerek Torbayı Kapatın', d: 'Torbanın plastik yakasındaki karton/plastik kolu yukarı çekin; ağız otomatik mühürlenir.' },
        { s: 'Adım 3', t: 'Torbayı Çöpe Atın', d: 'Toz kaçırmayan mühürlü torbayı yuvasından çıkarıp doğrudan ev çöpüne atın.' },
        { s: 'Adım 4', t: 'Yeni Torbayı Kızağa İtin', d: 'Yeni torbanın yakasını istasyon kılavuz rayına sonuna kadar itin ve kapağı kapatın.' }
      ],
      [
        { s: 'Adım 1', t: 'İstasyon Enerjisini Kesmeyin', d: 'İstasyon fişteyken üst kapağı açın; sensör kapağın açıldığını algılayacaktır.' },
        { s: 'Adım 2', t: 'Sürgülü Kilidi Kontrol Edin', d: 'Eski torbayı çekerken sürgünün tam kapandığını doğrulayarak toz solumayı önleyin.' },
        { s: 'Adım 3', t: 'İstasyon Haznesini Kontrol Edin', d: 'Torbanın oturduğu iç haznede kaçmış döküntü varsa nemli bezle silin.' },
        { s: 'Adım 4', t: 'Conta Sızdırmazlığı', d: 'Yeni torbayı yerleştirip conta çevresinde katlanma olmadığını kontrol edin ve kapağı kapatın.' }
      ],
      [
        { s: 'Adım 1', t: 'Doluluk Uyarısı Sonrası Açılış', d: 'Uygulama "Toz torbası dolu" uyarısı verdiğinde istasyon kapağını kaldırın.' },
        { s: 'Adım 2', t: 'Kılavuz Raydan Sürükleyin', d: 'Plastik flanşı iki parmağınızla tutarak yukarı doğru düz bir hatta çekin.' },
        { s: 'Adım 3', t: 'Hava Kanalı Izgarası Kontrolü', d: 'İstasyonun altındaki emiş ızgarasında tıkanıklık olmadığını gözlemleyin.' },
        { s: 'Adım 4', t: 'Tam Oturma ve Test', d: 'Yeni torbayı raylara geçirip aşağı bastırın; robotu docka gönderip manuel boşaltma yaptırın.' }
      ],
      [
        { s: 'Adım 1', t: 'Üst Paneli Kaldırın', d: 'İstasyonun üstündeki kapağı 90 derece açarak torba yuvasını açığa çıkarın.' },
        { s: 'Adım 2', t: 'Hijyenik Tahliye', d: 'Kendinden kilitli torbayı çıkarın; toza temas etmeden çöp poşetine bırakın.' },
        { s: 'Adım 3', t: 'Yeni Torba Katlarını Açın', d: 'Yeni torbayı takmadan önce kumaş körüklerini elinizle hafifçe açarak hacim kazandırın.' },
        { s: 'Adım 4', t: 'Kapağı Kapatma', d: 'Flanşı rayına kilitleyin ve kapağı tam kapatın; gösterge ışığının beyaza/maviye döndüğünü görün.' }
      ]
    ];
    return bagSteps[track];
  }

  if (p === 'batarya-pil') {
    if (isDysonCordless) {
      const dysonBatterySteps = [
        [
          { s: 'Adım 1', t: 'Vidaları Sökün', d: `${b} ${n} tutma kolunun arkasındaki 1 adet ve batarya tabanındaki 2 adet yıldız vidayı sökün.` },
          { s: 'Adım 2', t: 'Eski Bataryayı Kaydırın', d: 'Batarya paketini aşağıya ve hafifçe öne doğru çekerek gövdeden ayırın.' },
          { s: 'Adım 3', t: 'Konnektör Yuvasını Kontrol Edin', d: 'Gövde içindeki güç pinlerinde toz veya korozyon olmadığını doğrulayın.' },
          { s: 'Adım 4', t: 'Yeni Bataryayı Vidalyın', d: 'Yeni bataryayı yuvaya oturtup 3 vidayı sıkın; ilk kullanım öncesi 4 saat kesintisiz şarj edin.' }
        ],
        [
          { s: 'Adım 1', t: 'Cihazı Şarjdan Çıkarın', d: 'Süpürgeyi duvara asılı şarj ünitesinden veya adaptörden tamamen ayırın.' },
          { s: 'Adım 2', t: 'Doğru Tornavida Boyutu', d: 'PH1 tornavida ile tutma kolu arkasındaki ve tabandaki vidaları sıyırmadan gevşetin.' },
          { s: 'Adım 3', t: 'Eski Pili Güvenle Alın', d: 'Eski bataryayı çıkarıp terminallerini bantlayarak geri dönüşüm kutusuna ayırın.' },
          { s: 'Adım 4', t: 'İlk Şarj Kalibrasyonu', d: 'Yeni bataryayı yerine monte edin ve prize takarak LED göstergenin sabit maviye döndüğünü izleyin.' }
        ],
        [
          { s: 'Adım 1', t: 'Toz Haznesini Çıkarın', d: 'Daha rahat çalışmak için kırmızı mandalı iki kez itip şeffaf hazneyi gövdeden ayırın.' },
          { s: 'Adım 2', t: 'Batarya Montaj Vidaları', d: 'Bataryayı tutan 3 noktadaki vidaları sökün ve küçük bir kasede muhafaza edin.' },
          { s: 'Adım 3', t: 'Bataryayı Ayırın', d: 'Batarya gövdesini tutma sapından aşağı doğru kaydırarak çıkarın.' },
          { s: 'Adım 4', t: 'Vidaları Sabitleyin', d: 'Yeni bataryayı yerine itin, vidaları sıkın, hazneyi takın ve 4 saat tam şarj edin.' }
        ],
        [
          { s: 'Adım 1', t: 'Güvenlik Kontrolü', d: 'Tetiğe basılmadığından ve cihazın tamamen soğuk olduğundan emin olun.' },
          { s: 'Adım 2', t: 'Vidalı Bağlantıları Çözün', d: 'Tutma sapı arkasındaki 1 vidayı ve batarya altındaki 2 vidayı dikkatlice çıkarın.' },
          { s: 'Adım 3', t: 'Kontak Noktalarını Temizleyin', d: 'Gövde soketindeki terminalleri kuru mikrofiber bezle silerek tozlardan arındırın.' },
          { s: 'Adım 4', t: 'Montaj ve Test', d: 'Yeni bataryayı yerine oturtup vidalayın; tetiğe basarak motorun ilk tepkisini test edin.' }
        ]
      ];
      return dysonBatterySteps[track];
    }

    const robotBatterySteps = [
      [
        { s: 'Adım 1', t: 'Cihazı Kapatıp Ters Çevirin', d: `${b} ${n} güç tuşuna basılı tutarak kapatın; robotu ters çevirip alt kapağı açığa çıkarın.` },
        { s: 'Adım 2', t: 'Alt Gövde Vidalarını Sökün', d: 'Alt muhafaza kapağını tutan vidaları gevşetin ve kapağı kaldırın.' },
        { s: 'Adım 3', t: 'Batarya Soketini Çıkarın', d: 'Batarya paketinin tırnaklı kablo konektörünü mandalına basarak anakarttan ayırın.' },
        { s: 'Adım 4', t: 'Yeni Bataryayı Takın', d: 'Yeni bataryayı yuvasına koyup soketi takın, kapağı vidalayın ve dock üzerinde 4 saat şarj edin.' }
      ],
      [
        { s: 'Adım 1', t: 'Güvenli Kapatma', d: 'Robotun şarj dockuyla olan temasını kesin ve güç anahtarını kapalı konuma getirin.' },
        { s: 'Adım 2', t: 'Pil Yuvası Kapağı', d: 'Pil yuvası üzerindeki özel vidaları sökerek batarya bölmesini açın.' },
        { s: 'Adım 3', t: 'Şerit Kumaştan Çekin', d: 'Bataryanın altındaki kumaş çıkarma şeridinden tutarak pili yukarı doğru kaldırın.' },
        { s: 'Adım 4', t: 'Soket Kilitlenmesi', d: 'Yeni bataryanın soketini tık sesi duyulana kadar itin; kapağı kapatıp şarj standına oturtun.' }
      ],
      [
        { s: 'Adım 1', t: 'Çalışma Alanı Hazırlığı', d: 'Robotun sensörlerine zarar vermemek için altına bir bez serip ters yatırın.' },
        { s: 'Adım 2', t: 'Ana Fırça ve Kafesi Alın', d: 'Gerekiyorsa ana fırça kafesini çıkararak alt kapak vidalarına rahatça erişin.' },
        { s: 'Adım 3', t: 'Termal Sensör İncelemesi', d: 'Eski bataryanın soketini ayırın; yuva içerisindeki termal pedlerin düzgün durduğunu kontrol edin.' },
        { s: 'Adım 4', t: 'Montaj ve BMS Kalibrasyonu', d: 'Yeni bataryayı bağlayın, kapağı kapatın ve pili %100 dolana kadar kesintisiz şarj edin.' }
      ],
      [
        { s: 'Adım 1', t: 'Robotu Devre Dışı Bırakın', d: `${b} ${n} sesli kapanma melodisini duyana kadar güç tuşuna basılı tutun.` },
        { s: 'Adım 2', t: 'Vidaları Sökün', d: 'Alt plaka üzerindeki yıldız vidaları sökün ve vidaları kaybolmayacak şekilde dizin.' },
        { s: 'Adım 3', t: 'Kablo Bağlantısını Çözün', d: 'Kablo demetini asılmadan, plastik soket gövdesinden tutarak anakarttan ayırın.' },
        { s: 'Adım 4', t: 'Geri Kapatma ve İlk Çalıştırma', d: 'Yeni pili yerleştirin, alt kapağı vidalayın ve robotu açarak docka gönderin.' }
      ]
    ];
    return robotBatterySteps[track];
  }

  if (p === 'su-haznesi-filtresi') {
    const waterSteps = [
      [
        { s: 'Adım 1', t: 'Su Tankını Çıkarın', d: `${b} ${n} arkasındaki mandallara basarak su tankını robottan ayırın ve içindeki suyu boşaltın.` },
        { s: 'Adım 2', t: 'Filtre Elemanını Sökün', d: 'Su çıkış deliklerindeki veya tank tabanındaki mikro filtre tıpasını cımbızla çekerek çıkarın.' },
        { s: 'Adım 3', t: 'Ilık Suyla Durulayın', d: 'Filtre gözeneklerini ılık arıtılmış su altında yıkayın; kireç kalıntılarını temizleyin.' },
        { s: 'Adım 4', t: 'Yeni Filtreyi Takın', d: 'Yeni filtre tıpalarını yuvalarına bastırarak oturtun; sızdırmazlık contasını kontrol edin.' }
      ],
      [
        { s: 'Adım 1', t: 'Hazneyi Boşaltın', d: 'Su haznesi kapağını açıp kalan tüm suyu dökün ve hazne ağzını kurulayın.' },
        { s: 'Adım 2', t: 'Silikon Contaları İnceleyin', d: 'Su sızdırmazlık tıpalarında çatlak veya yırtık olup olmadığını gözlemleyin.' },
        { s: 'Adım 3', t: 'Nozul Çıkışlarını Kontrol Edin', d: 'Su basan minik deliklerde kireç birikintisi varsa yumuşak bir fırçayla arındırın.' },
        { s: 'Adım 4', t: 'Arıtılmış Suyla Test Edin', d: 'Hazneye arıtılmış temiz su doldurup mop bezinin homojen ıslandığını doğrulayın.' }
      ],
      [
        { s: 'Adım 1', t: 'Mop Modülünü Çıkarın', d: 'Su tankı ve mop plakasını birbirinden ayırarak su besleme kanallarını açığa çıkarın.' },
        { s: 'Adım 2', t: 'Eski Filtre Kapsüllerini Alın', d: 'Plastik yuvalar içindeki yuvarlak pamuksu filtre elemanlarını cımbızla çekin.' },
        { s: 'Adım 3', t: 'Yeni Kapsülleri Islatın', d: 'Yeni filtre kapsüllerini takmadan önce temiz suyla ıslatarak kılcal emişi başlatın.' },
        { s: 'Adım 4', t: 'Yuvalara Bastırın', d: 'Kapsülleri yerine tam oturtun; su tankını cihaza takıp su seviyesini orta kademeye alın.' }
      ],
      [
        { s: 'Adım 1', t: 'Elektronik Pompa Girişi', d: 'Haznenin robotla temas eden su besleme valfini mikrofiber bezle silin.' },
        { s: 'Adım 2', t: 'Filtre Değişimi', d: 'Su filtre kartuşunu tırnağından serbest bırakıp yerine yeni orijinal filtreyi yerleştirin.' },
        { s: 'Adım 3', t: 'Kireç Tıkaçlarını Çözün', d: 'Hazneye az miktarda ılık arıtılmış su koyup çalkalayarak nozul kanallarını durulayın.' },
        { s: 'Adım 4', t: 'Hazneyi Kapatıp Takın', d: 'Lastik tıpayı sıkıca kapatın; su tankını yerine tık sesi gelene kadar itin.' }
      ]
    ];
    return waterSteps[track];
  }

  if (p === 'tekerlek-bakimi') {
    const wheelSteps = [
      [
        { s: 'Adım 1', t: 'Ön Sarhoş Tekerleği Çıkarın', d: 'Düz tornavidayı ön küçük tekerleğin altına hafifçe sokup yukarı doğru kanırtarak tekerleği çıkarın.' },
        { s: 'Adım 2', t: 'Çelik Mili Yuvasından Çekin', d: 'Tekerlek bilyesini plastik braketinden ayırın ve çelik aks milini dışarı doğru itin.' },
        { s: 'Adım 3', t: 'Saç Yumağını Kesin', d: 'Mil etrafına sarılarak tekerleğin dönmesini engelleyen saçları makasla kesip temizleyin.' },
        { s: 'Adım 4', t: 'Yağsız Yerleştirin', d: 'Tekerleği tekrar miline takıp gövdeye bastırın; klik sesini duyun (asla yağ sürmeyin, toz çeker).' }
      ],
      [
        { s: 'Adım 1', t: 'Robotu Ters Yatırın', d: `${b} ${n} altındaki tekerlek süspansiyon yuvalarını inceleyin.` },
        { s: 'Adım 2', t: 'Süspansiyon Esnetme Testi', d: 'Ana çekiş tekerleklerini elinizle yukarı ve aşağı bastırarak yayların esnekliğini test edin.' },
        { s: 'Adım 3', t: 'Aks Saç Temizliği', d: 'Tekerlek jantı ile motor gövdesi arasına giren saçları cımbız yardımıyla çıkarın.' },
        { s: 'Adım 4', t: 'Kauçuk Lastik Değişimi', d: 'Aşınmış kauçuk lastik bandı janttan sıyırıp yerine yeni kaydırmaz sırt lastiğini geçirin.' }
      ],
      [
        { s: 'Adım 1', t: 'Ön Tekerlek Yuva Kontrolü', d: 'Ön tekerlek yuvasındaki optik siyah-beyaz enkoder okuyucu camını pamuklu çubukla silin.' },
        { s: 'Adım 2', t: 'Aks Pimi Temizliği', d: 'Çelik pimi kuru bezle parlatın; pas veya kir tabakasını tamamen uzaklaştırın.' },
        { s: 'Adım 3', t: 'Tekerlek Dönüş Testi', d: 'Pimi tekerleğe takıp parmağınızla döndürün; tekerleğin yalpasız döndüğünü onaylayın.' },
        { s: 'Adım 4', t: 'Gövdeye Kilitleme', d: 'Ön modülü dikey olarak gövdeye bastırın; yerine tam oturduğunu kontrol edin.' }
      ],
      [
        { s: 'Adım 1', t: 'Tekerlek Dişli Kontrolü', d: 'Sağ ve sol çekiş tekerleklerini yavaşça elinizle çevirin; takılma veya çıtırtı sesi dinleyin.' },
        { s: 'Adım 2', t: 'Yay Boşluğunu Arındırın', d: 'Süspansiyon körüğüne kaçmış kumaş parçası veya kürdan gibi engelleri temizleyin.' },
        { s: 'Adım 3', t: 'Zemin Tutunma Sırtı', d: 'Tekerlek yüzeyindeki toz ve yağ katmanını alkollü mendille silerek sürtünmeyi artırın.' },
        { s: 'Adım 4', t: 'Düz Zemin Testi', d: 'Robotu yere bırakıp 1 metre ileri sürün; tekerleklerin simetrik hareket ettiğini görün.' }
      ]
    ];
    return wheelSteps[track];
  }

  if (p === 'temizlik-solusyonu') {
    const solutionSteps = [
      [
        { s: 'Adım 1', t: 'Su Tankına Arıtılmış Su Doldurun', d: `${b} ${n} su haznesine maksimum çizgisine kadar oda sıcaklığında temiz içme/arıtma suyu koyun.` },
        { s: 'Adım 2', t: 'Dozaj Kapağını Kullanın', d: 'Her 1 litre su için 1 kapak (yaklaşık 5 ml) konsantre temizlik solüsyonu ölçün.' },
        { s: 'Adım 3', t: 'Suya İlave Edip Çalkalayın', d: 'Solüsyonu su haznesine dökün, tıpayı kapatın ve köpürtmeden hafifçe çalkalayarak karıştırın.' },
        { s: 'Adım 4', t: 'Mop Modülünü Başlatın', d: 'Hazneyi robota takın ve uygulama üzerinden su seviyesini istediğiniz kademeye ayarlayın.' }
      ],
      [
        { s: 'Adım 1', t: 'Hazneyi Hazırlayın', d: 'Su haznesini robottan çıkarıp içini temiz suyla çalkalayarak eski tortulardan arındırın.' },
        { s: 'Adım 2', t: '1:200 Oranını Koruyun', d: 'Solüsyonu asla doğrudan hazneye boca etmeyin; mutlaka 1:200 seyreltme oranına sadık kalın.' },
        { s: 'Adım 3', t: 'Tankı Yerleştirin', d: 'Karışımı hazırladıktan sonra silikon tıpayı sıkıca kapatıp hazneyi robota tık sesiyle takın.' },
        { s: 'Adım 4', t: 'Zemin Hijyenini İzleyin', d: 'Temizlik esnasında zeminin hızla kuruduğunu ve leke bırakmadığını gözlemleyin.' }
      ],
      [
        { s: 'Adım 1', t: 'İstasyonlu Modeller İçin Dozaj', d: 'Otomatik istasyonun temiz su tankına (örneğin 3L-4L) 3 ila 4 kapak solüsyon ekleyin.' },
        { s: 'Adım 2', t: 'Köpüksüz Formül Kontrolü', d: 'Karışımın tank içinde köpük yapmadığını teyit edin; köpük istasyon pompasını hava yaptırır.' },
        { s: 'Adım 3', t: 'Mop Yıkama Döngüsü', d: 'Robotu istasyonda mop yıkamaya gönderin; solüsyonun mop bezlerini derinlemesine yıkamasını sağlayın.' },
        { s: 'Adım 4', t: 'Kirli Su Tankı Boşaltımı', d: 'Temizlik bitiminde kirli su tankını boşaltıp durulayın; solüsyon kötü koku oluşumunu engeller.' }
      ],
      [
        { s: 'Adım 1', t: 'Doğru Sıvı Seçimi', d: 'Asla standart yer deterjanı veya çamaşır suyu koymayın; sadece pH nötr robot solüsyonu kullanın.' },
        { s: 'Adım 2', t: 'Önce Su Sonra Solüsyon', d: 'Köpük oluşumunu sıfırlamak için önce suyu hazneye doldurun, ardından solüsyonu ilave edin.' },
        { s: 'Adım 3', t: 'Nozul Tıkanıklık Koruması', d: 'Solüsyon içerisindeki kireç önleyici aktif maddelerin nozullara ulaşması için paspası başlatın.' },
        { s: 'Adım 4', t: 'Periyodik Duru Su Geçişi', d: 'Her 4-5 solüsyonlu temizlikten sonra bir kez saf suyla temizlik yaparak kanalları yıkayın.' }
      ]
    ];
    return solutionSteps[track];
  }

  if (p === 'sensor-bakimi') {
    const sensorSteps = [
      [
        { s: 'Adım 1', t: 'LDS Kulesini Temizleyin', d: 'Tavandaki döner kule boşluklarına kuru pamuklu çubuk sokarak optik cam ve aynalardaki tozu silin.' },
        { s: 'Adım 2', t: 'Uçurum Sensörlerini Silin', d: `${b} ${n} ters çevirip alt kenarlardaki 4-6 adet düşme sensörü camını mikrofiber bezle silin.` },
        { s: 'Adım 3', t: 'Şarj Kontaklarını Parlatın', d: 'Robot altındaki ve istasyondaki metal şarj plakalarını alkollü mendille ovalayarak parlatın.' },
        { s: 'Adım 4', t: 'Duvar ve Tampon Sensörleri', d: 'Robotun sağ yanındaki duvar takip penceresi ve ön tampondaki ToF camlarını kurulayın.' }
      ],
      [
        { s: 'Adım 1', t: 'Cihazı Kapatın', d: `${b} ${n} güç tuşuna basarak kapatın; optik yüzeylere zarar vermemek için statik bez hazırlayın.` },
        { s: 'Adım 2', t: 'Lazer Döner Başlık Kontrolü', d: 'LDS kulesini parmağınızla hafifçe çevirin; serbest döndüğünü ve yabancı cisim olmadığını onaylayın.' },
        { s: 'Adım 3', t: 'Düşme Sensörlerini Arındırın', d: 'Alt gövdedeki kızılötesi pencereleri hafif nemli bezle silip ardından kuru bezle parlatın.' },
        { s: 'Adım 4', t: 'İstasyon Sinyal Penceresi', d: 'Şarj istasyonunun önündeki siyah kızılötesi yerleştirme panelini tozdan arındırın.' }
      ],
      [
        { s: 'Adım 1', t: 'Basınçlı Hava Kullanımı', d: 'LDS lazer kulesi deliklerine 20 cm mesafeden basınçlı hava tutarak biriken mikro tozu uçurun.' },
        { s: 'Adım 2', t: 'Alt Optik Hijyen', d: 'Tekerleklerin yanındaki ve ön tampondaki uçurum sensörlerini alkolsüz optik temizleme beziyle silin.' },
        { s: 'Adım 3', t: 'Oksit Temizliği', d: 'Şarj temas plakalarında kararma varsa kurşun kalem silgisiyle hafifçe silerek parlatın.' },
        { s: 'Adım 4', t: 'Haritalama Testi', d: 'Robotu çalıştırıp haritada kayma veya oda karıştırma olup olmadığını uygulamadan izleyin.' }
      ],
      [
        { s: 'Adım 1', t: 'Haftalık Sensör Rutini', d: 'Temizlik öncesi robotun tüm dış optik yüzeylerini mikrofiber gözlük beziyle temizleyin.' },
        { s: 'Adım 2', t: 'Ön Engel Tanıma Kamerası', d: 'Ön tampondaki yapay zeka kamera ve 3D çizgi lazer pencerelerini parmak izinden arındırın.' },
        { s: 'Adım 3', t: 'Uçurum Camı Kontrolü', d: 'Koyu halılarda robot duruyorsa düşme sensörü pencerelerindeki statik tozu tamamen silin.' },
        { s: 'Adım 4', t: 'Dock Hizalama', d: 'Şarj standının etrafında 0.5 metre engel bırakmayın; sinyal alışverişini doğrulayın.' }
      ]
    ];
    return sensorSteps[track];
  }

  if (p === 'reset-ve-wifi') {
    if (isDysonCordless) {
      const dysonResetSteps = [
        [
          { s: 'Adım 1', t: 'Bataryayı Gövdeden Ayırın', d: `${b} ${n} tutma kolu arkasındaki ve tabanındaki 3 adet vidayı sökerek bataryayı çıkarın.` },
          { s: 'Adım 2', t: '10 Dakika Bekleyin', d: 'Anakart ve BMS kondansatörlerindeki artık statik yükün tamamen sıfırlanması için 10 dakika bekleyin.' },
          { s: 'Adım 3', t: 'Tetik Mekanizmasını Test Edin', d: 'Kırmızı tetiğe basıp bırakarak mikro anahtardan klik sesi gelip gelmediğini kontrol edin.' },
          { s: 'Adım 4', t: 'Bataryayı Takıp Şarj Edin', d: 'Bataryayı yerine takıp vidalayın ve prize takarak mavi LED göstergeyle çalışmayı test edin.' }
        ],
        [
          { s: 'Adım 1', t: 'Şarj Adaptörünü Çıkarın', d: 'Cihazı şarj ünitesinden ayırın ve boru ile başlığı gövdeden çıkarın.' },
          { s: 'Adım 2', t: 'Hava Emniyet Klapesini Açın', d: 'Kırmızı hazne boşaltma mandalını 3 kez sertçe aşağı çekip bırakarak klapeyi hareketlendirin.' },
          { s: 'Adım 3', t: 'Filtre Kilit Resetleme', d: 'Arka HEPA filtreyi sökün, yerine tekrar oturtup kilit hizasına kadar çevirin.' },
          { s: 'Adım 4', t: 'Tetik Darbe Testi', d: 'Tetiğe 1 saniye aralıklarla 3 kez basarak motorun hava akışını yeniden kalibre edin.' }
        ],
        [
          { s: 'Adım 1', t: 'MAX / Eco Mod Anahtarını Değiştirin', d: 'Gövde üzerindeki güç modu anahtarını MAX modundan ECO/Normal moduna alın.' },
          { s: 'Adım 2', t: 'Termal Soğuma Süresi', d: 'Cihaz aşırı ısınmışsa 45 dakika oda sıcaklığında soğumasını bekleyin.' },
          { s: 'Adım 3', t: 'Kontak Noktası Silme', d: 'Batarya ve şarj jakı terminallerini kuru bir bezle ovalayarak oksitlenmeyi giderin.' },
          { s: 'Adım 4', t: 'Kesintisiz Şarj Döngüsü', d: 'Cihazı prize takıp en az 3.5 saat kesintisiz şarj ederek hücreleri dengeleyin.' }
        ],
        [
          { s: 'Adım 1', t: 'Görsel Tetik İncelemesi', d: 'Tetik boşta sallanıyorsa gövde içi kırık kontrolü yapın; mekanik müdahale planlayın.' },
          { s: 'Adım 2', t: 'Siklon Ayrıştırma Kontrolü', d: 'Şeffaf hazneyi çıkarıp siklon ızgarasında tıkanıklık kalmadığından emin olun.' },
          { s: 'Adım 3', t: 'Batarya Deşarjı', d: 'Süpürgeyi normal modda batarya bitene kadar çalıştırıp ardından tek seferde %100 doldurun.' },
          { s: 'Adım 4', t: 'Çalışma Doğrulaması', d: 'MAX moduna alarak çekiş gücünün sabit ve kesintisiz olduğunu gözlemleyin.' }
        ]
      ];
      return dysonResetSteps[track];
    }

    const robotResetSteps = [
      [
        { s: 'Adım 1', t: 'Modemi 2.4 GHz Moduna Alın', d: 'Modem ayarlarınızdan 5 GHz bandını geçici olarak kapatın veya 2.4 GHz için ayrı bir SSID oluşturun.' },
        { s: 'Adım 2', t: 'Tuşlara 3 Saniye Basın', d: `${b} ${n} Güç ve Şarj (Home) tuşlarına aynı anda 3 saniye basılı tutarak "Wi-Fi Sıfırlandı" sesini duyun.` },
        { s: 'Adım 3', t: 'Uygulamadan Cihazı Ekleyin', d: 'Mobil uygulamayı açıp sağ üstteki (+) butonuna basın ve bulunan robotu seçin.' },
        { s: 'Adım 4', t: 'Şifreyi Girip Eşleştirin', d: '2.4 GHz Wi-Fi şifrenizi girerek telefonunuzu robota yaklaştırın; kurulumun %100 olmasını bekleyin.' }
      ],
      [
        { s: 'Adım 1', t: 'Üst Kapağı Kaldırın', d: `${b} ${n} üst kapağını açıp Wi-Fi gösterge LEDinin durumunu kontrol edin.` },
        { s: 'Adım 2', t: 'Ağ Ayarlarını Sıfırlayın', d: 'İki ana tuşa basarak LEDin mavi renkte yavaşça yanıp sönmesini (eşleşme modu) sağlayın.' },
        { s: 'Adım 3', t: 'Robotun Kendi Ağına Bağlanın', d: 'Telefonunuzun Wi-Fi listesinden robotun yaydığı geçici ağa bağlanıp uygulamaya dönün.' },
        { s: 'Adım 4', t: 'Bulut Kaydını Tamamlayın', d: 'Ev Wi-Fi bilgilerinizi aktarın; robot "Wi-Fi bağlandı" dediğinde işlem tamamdır.' }
      ],
      [
        { s: 'Adım 1', t: 'Pinhole Reset İğnesi Hazırlayın', d: 'Ataş veya SIM iğnesi alarak kapak altındaki küçük "Reset" deliğini bulun.' },
        { s: 'Adım 2', t: '5 Saniye Basılı Tutun', d: 'İğneyle reset butonuna 5 saniye basılı tutun; robot "Fabrika ayarlarına dönülüyor" ikazı verir.' },
        { s: 'Adım 3', t: 'Cihazın Yeniden Başlamasını Bekleyin', d: 'Robotun ışıklarının sönüp açılmasını ve fabrika karşılama sesini vermesini bekleyin.' },
        { s: 'Adım 4', t: 'Sıfırdan Haritalama Başlatın', d: 'Uygulamadan yeni cihaz gibi eşleştirin ve ev için ilk hızlı haritalama turunu başlatın.' }
      ],
      [
        { s: 'Adım 1', t: 'Konum ve Bluetooth Açın', d: 'Telefonunuzun Bluetooth, Wi-Fi ve Konum servislerini aktif hale getirin.' },
        { s: 'Adım 2', t: 'Modem Mesafesi', d: 'Eşleştirme esnasında robotu ve şarj istasyonunu modemin 2-3 metre yakınına taşıyın.' },
        { s: 'Adım 3', t: 'Kombine Tuş Resetleme', d: 'Wi-Fi tuşlarına basarak sesli onay alın ve uygulamada otomatik algılanmasını bekleyin.' },
        { s: 'Adım 4', t: 'DHCP Sabit IP Atama', d: 'Bağlantı kurulduktan sonra modemden robota sabit IP tanımlayarak çevrimdışı kalmasını önleyin.' }
      ]
    ];
    return robotResetSteps[track];
  }

  if (p === 'hata-kodlari') {
    if (isDysonCordless) {
      const dysonErrorSteps = [
        [
          { s: 'Adım 1', t: 'Ritmik Sesi Dinleyin', d: 'Tetiğe basınca motor kesik kesik (pulsing) çalışıyorsa hava akışı tıkalıdır; filtreleri çıkarın.' },
          { s: 'Adım 2', t: 'Boru ve Başlık Tıkanıklık Kontrolü', d: 'Çubuğu söküp içine bakın; ışık geçmiyorsa sıkışan yabancı cismi süpürge sapıyla itin.' },
          { s: 'Adım 3', t: 'Filtreleri Yıkayıp Kurutun', d: 'Ön ve arka filtreleri yıkayın; en az 24 saat radyatörsüz ortamda tam kurutup takın.' },
          { s: 'Adım 4', t: 'LED Işık Rengini İnceleyin', d: 'Kırmızı ışık batarya arızasını, sarı ışık aşırı ısınmayı, mavi ışık şarj bitmesini gösterir.' }
        ],
        [
          { s: 'Adım 1', t: 'Batarya Flaş Sayımı', d: 'Kırmızı LED yanıyorsa kaç kez yanıp söndüğünü sayın; 12 veya 32 flaş kalıcı batarya arızasıdır.' },
          { s: 'Adım 2', t: '30 Dakika Soğuma Bırakın', d: 'Sarı ışık yandıysa MAX modunda motor ısınmıştır; prize takmadan oda sıcaklığında soğumasını bekleyin.' },
          { s: 'Adım 3', t: 'Hazne Giriş Klapesini Açın', d: 'Toz haznesini açıp giriş deliğindeki şeffaf lastik kapağın basılı kalmadığından emin olun.' },
          { s: 'Adım 4', t: 'Doğrudan Başlık Testi', d: 'Başlığı boru olmadan doğrudan gövdeye takarak tetiğe basın; motor çalışırsa sorun borudadır.' }
        ],
        [
          { s: 'Adım 1', t: 'Tetik Mikro Sivicini Deneyin', d: 'Tetiğe bastığınızda klik sesi gelmiyorsa iç tetik mandalı kırılmıştır; parça değişimi gerekir.' },
          { s: 'Adım 2', t: 'Fırça Motoru Sıkışması', d: 'Rulo dönmüyorsa bozuk parayla başlık kilit vidasını açıp mil yatağındaki saçları kesin.' },
          { s: 'Adım 3', t: 'Şarj Soketi Temizliği', d: 'Adaptör jakını ve batarya soketini kuru bezle silerek şarj temassızlığını giderin.' },
          { s: 'Adım 4', t: 'Normal Modda Süre Ölçümü', d: 'Tam şarj sonrası ECO modda süreyi ölçün; 5 dakikadan az gidiyorsa bataryayı yenileyin.' }
        ],
        [
          { s: 'Adım 1', t: 'Siklon Girişlerini Aydınlatın', d: 'Fenerle siklon konilerinin deliklerine bakın; un veya ince toz tıkanıklıklarını fırçalayın.' },
          { s: 'Adım 2', t: 'Nem ve Koku Kontrolü', d: 'Islak filtre takıldıysa hemen çıkarın; motoru çalıştırmadan filtreyi 24 saat kurutun.' },
          { s: 'Adım 3', t: 'Batarya Deşarj ve Şoklama', d: 'Cihaz hiç açılmıyorsa adaptörü 5 kez peş peşe takıp çıkararak BMS devresini uyandırın.' },
          { s: 'Adım 4', t: 'Çözüm Parçası Temini', d: 'Arıza devam ediyorsa orijinal standarttaki uyumlu yedek batarya veya filtre kartuşu takın.' }
        ]
      ];
      return dysonErrorSteps[track];
    }

    const errorSteps = [
      [
        { s: 'Adım 1', t: 'Sesli Hata Kodunu Dinleyin', d: `${b} ${n} verdiği sesli uyarıyı (Error 1 ila Error 18) veya uygulama bildirimini not edin.` },
        { s: 'Adım 2', t: 'LDS Kulesini Serbest Bırakın (Error 1)', d: 'Lazer kulesine hafifçe üfleyin, elinizle bir tur çevirerek takılma olmadığını doğrulayın.' },
        { s: 'Adım 3', t: 'Fırça ve Tekerlek Kıllarını Kesin (Error 5/7)', d: 'Ana fırça ve tekerlek rulmanlarına sarılan saçları temizleme bıçağıyla temizleyin.' },
        { s: 'Adım 4', t: 'Sensör Camlarını Silip Başlatın (Error 4/10)', d: 'Düşme sensörlerini ve filtreyi temizleyin; robotu düz zemine bırakıp yeniden başlatın.' }
      ],
      [
        { s: 'Adım 1', t: 'Uygulama Hata Mesajını Açın', d: 'Uygulama ekranındaki kırmızı arıza uyarısına dokunarak arıza bölgesini tespit edin.' },
        { s: 'Adım 2', t: 'Tampon Mikrosiviç Yaylanması (Error 2)', d: 'Ön tamponun iki ucuna hafifçe vurarak içeri basılı kalmış sivici serbest bırakın.' },
        { s: 'Adım 3', t: 'Filtre Kuruluk Kontrolü (Error 10)', d: 'Toz haznesindeki HEPA filtrenin ıslak veya aşırı tozlu olmadığını teyit edin.' },
        { s: 'Adım 4', t: 'Düz Zeminde Sıfırlama', d: 'Robotu şarj dockunun 1 metre önüne koyup açma tuşuna bir kez basarak temizliği başlatın.' }
      ],
      [
        { s: 'Adım 1', t: 'Cihazı Kapatıp Açın (Soft Reboot)', d: 'Güç tuşuna 5 saniye basarak robotu kapatın, 10 saniye bekleyip tekrar açın.' },
        { s: 'Adım 2', t: 'Şarj Kontak Temizliği (Error 13)', d: 'Robotun altındaki metal şarj plakalarını alkollü pamukla silerek oksitlenmeyi giderin.' },
        { s: 'Adım 3', t: 'Uçurum Sensörü İncelemesi (Error 4)', d: 'Koyu renkli zeminlerde düşme hatası veriyorsa sensör camlarını mikrofiber bezle silin.' },
        { s: 'Adım 4', t: 'Yan Fırça Şaft Kontrolü (Error 6)', d: 'Yan fırça vidasını söküp şafta dolanan ip ve saçları cımbızla temizleyip vidalayın.' }
      ],
      [
        { s: 'Adım 1', t: 'Hata Kodunu Tablodan Eşleştirin', d: 'Sayfamızdaki arıza tablosundan cihazınızın modeline özgü hata numarasını bulun.' },
        { s: 'Adım 2', t: 'Mekanik Engeli Giderin', d: 'Hata veren parçayı (fırça, tekerlek veya filtre) sökerek yabancı cisimleri ayıklayın.' },
        { s: 'Adım 3', t: 'Sensör Hijyen Protokolü', d: 'Optik sensör pencerelerini kuru bezle temizleyip harita okuma kalitesini yükseltin.' },
        { s: 'Adım 4', t: 'Dock Üzerinde Kalibrasyon', d: 'Robotu elle şarj istasyonuna oturtun; şarj sinyalini duyduktan sonra görevi başlatın.' }
      ]
    ];
    return errorSteps[track];
  }

  return [
    { s: 'Adım 1', t: 'Cihazı Kapatın', d: `${b} ${n} güç tuşuna basarak kapatın ve güvenli bir zemine alın.` },
    { s: 'Adım 2', t: 'Eski Parçayı Çıkarın', d: 'Eski parçayı tırnaklarından serbest bırakarak yuvasından ayırın.' },
    { s: 'Adım 3', t: 'Yuvayı Temizleyin', d: 'Parçanın oturduğu mekanik yuvadaki toz ve kir kalıntılarını silin.' },
    { s: 'Adım 4', t: 'Yeni Parçayı Takın', d: 'Orijinal uyumlu yeni parçayı yerine oturtup tık sesini duyun.' }
  ];
}

module.exports = {
  getStepByStepGuide
};
