// lib/content/schedules.js - 4 Distinct Maintenance Schedule Variations per Category
const { simpleHash } = require('./helpers');

function getMaintenanceSchedule(model, part) {
  const p = part.slug;
  const b = model.brand;
  const n = model.name;
  const isDysonCordless = b.toLowerCase() === 'dyson' && !n.includes('360');
  const track = simpleHash(`${model.slug}-${p}-sched-v10`) % 4;

  if (p === 'hepa-filtre') {
    if (isDysonCordless) {
      const dysonSchedules = [
        [
          { f: '2 Haftada Bir', a: 'Filtreleri hazneden çıkarıp çöp kovasına vurarak biriken kaba tozu dökün.' },
          { f: 'Ayda Bir', a: 'Yalnızca soğuk musluk suyuyla deterjansız yıkayın ve oda sıcaklığında 24 saat tam kurutun.' },
          { f: '6 - 12 Ay', a: 'Mikron lif gözenekleri dolduğunda ve hava debisi düştüğünde yeni HEPA filtre kiti takın.' }
        ],
        [
          { f: 'Haftalık Kontrol', a: 'Siklon gövdesini ve ön filtre ucunu gözle kontrol edin; kaba tüyleri elinizle temizleyin.' },
          { f: '30 Günde Bir', a: 'Ön ve arka filtreleri su berrak akana kadar durulayın; kesinlikle ıslak veya nemli takmayın.' },
          { f: 'Yılda Bir Kez', a: 'Motor emiş gücünü ilk günkü seviyesinde tutmak için filtre setini yenileyin.' }
        ],
        [
          { f: 'Her 15 Günde', a: 'Arka HEPA kapağını çevirerek çıkarın, hava üfleyerek petekler arasındaki tozu arındırın.' },
          { f: 'Aylık Rutin', a: 'Soğuk su altında filtre süngerini hafifçe sıkarak yıkayın; gölgede tam kuruluk sağlayın.' },
          { f: '8 - 12 Ay', a: 'Pulsing (kesik kesik çalışma) riskini önlemek için orijinal standartta yeni filtre takın.' }
        ],
        [
          { f: 'Yoğun Kullanımda', a: 'Evcil hayvan bulunan evlerde haftada bir çırpma işlemi uygulayın.' },
          { f: 'Ayda Bir Kez', a: 'Kimyasal deterjan değdirmeden soğuk musluk suyuyla yıkayıp 24 saat kurutun.' },
          { f: '6 - 9 Ay', a: 'Alerjen filtreleme verimliliğini %99.9 seviyesinde tutmak için kartuşu değiştirin.' }
        ]
      ];
      return dysonSchedules[track];
    }

    const robotSchedules = [
      [
        { f: 'Haftalık', a: 'Filtreyi hazneden çıkarıp çöp kovasına hafifçe vurarak kaba tozu dökün.' },
        { f: '2-4 Haftada Bir', a: 'Soğuk musluk suyu altında deterjansız yıkayıp en az 24 saat gölgede kurutun.' },
        { f: '3 - 6 Ay', a: 'Mikron gözenekleri dolduğunda ve hava debisi düştüğünde yeni filtre kartuşu takın.' }
      ],
      [
        { f: 'Her Hazne Boşaltımında', a: 'Filtre yüzeyindeki tüy ve kaba toz tabakasını fırçayla temizleyin.' },
        { f: 'Ayda 1-2 Kez', a: 'Filtreyi fırça sürmeden akan suyun altında durulayın; radyatörsüz ortamda kurutun.' },
        { f: '4 - 6 Ay', a: 'Error 10 hatasını önlemek ve türbin motorunu korumak için yeni HEPA filtre takın.' }
      ],
      [
        { f: '10 Günde Bir', a: 'Filtre çerçevesindeki silikon contanın sağlamlığını ve toz birikintisini kontrol edin.' },
        { f: 'Aylık Yıkama', a: 'Filtre kartuşunu soğuk suyla çalkalayarak yıkayın; yedek filtreyle dönüşümlü kullanın.' },
        { f: '150 Saat Süpürme Sonrası', a: 'Mobil uygulama filtre ömrü uyarısı verdiğinde yeni filtreyle değiştirin.' }
      ],
      [
        { f: 'Haftada Bir Kez', a: 'Kaba tozu lavaboya tık tık vurarak dökün; filtre liflerini sivri cisimle kazımayın.' },
        { f: '3 Haftada Bir', a: 'Deterjan kullanmadan nazikçe yıkayın ve 24 saat boyunca oda havasında kurutun.' },
        { f: '6 Ayda Bir', a: 'Vakum türbininin emiş debisini fabrika çıkış gücünde tutmak için kartuşu yenileyin.' }
      ]
    ];
    return robotSchedules[track];
  }

  if (p === 'ana-firca') {
    if (isDysonCordless) {
      const dysonRollerSchedules = [
        [
          { f: 'Haftalık', a: 'Başlığın yan kilit vidasını açıp rulo miline dolanan saç ve ipleri makasla kesin.' },
          { f: 'Aylık', a: 'Soft roller rulo kumaşını soğuk suyla yıkayıp rulman yuvasına su değdirmeden kurutun.' },
          { f: '6 - 12 Ay', a: 'Karbon fiber lifler veya naylon kıllar aşındığında yeni döner rulo takın.' }
        ],
        [
          { f: '10 Günde Bir', a: 'Fırça silindirini yerinden çıkararak metal tahrik soketindeki lifleri temizleyin.' },
          { f: '6 Haftada Bir', a: 'Rulo yataklarını kuru bezle silin; madeni parayla açılan kilit mekanizmasını kontrol edin.' },
          { f: 'Yılda Bir Kez', a: 'Zemin kavrama torkunu yenilemek ve sessiz çalışmayı sağlamak için fırçayı değiştirin.' }
        ],
        [
          { f: 'Haftalık Kontrol', a: 'Rulonun el ile serbestçe döndüğünü test edin; halı püskülü kalıntılarını temizleyin.' },
          { f: 'Aylık Bakım', a: 'Rulo yatağı plastik parçalarını silin; elektrik iletim pimlerindeki tozu arındırın.' },
          { f: '8 - 12 Ay', a: 'Sert zemin ve halı temizleme performansını tazelemek için rulo fırçayı yenileyin.' }
        ],
        [
          { f: 'Her 2 Haftada', a: 'Rulo miline sarılan saç yumağını temizleme bıçağıyla boydan boya keserek sıyırın.' },
          { f: 'Aylık Temizlik', a: 'Rulonun dış yüzeyini nemli bezle silin; rulman yuvasını kesinlikle yağlamayın.' },
          { f: '6 - 10 Ay', a: 'Aşırı kullanım sonucu kılları seyrelen fırçayı yeni orijinal uyumlu ruloyla değiştirin.' }
        ]
      ];
      return dysonRollerSchedules[track];
    }

    const robotRollerSchedules = [
      [
        { f: 'Haftalık', a: 'Rulo etrafına dolanan saç ve lifleri temizleme bıçağıyla sıyırın.' },
        { f: '2 Haftada Bir', a: 'Rulman yan kapaklarını söküp iç çelik milde biriken saç yumağını temizleyin.' },
        { f: '6 - 12 Ay', a: 'Kauçuk kanatçıklar aşındığında veya fırça tırnakları döküldüğünde yeni rulo takın.' }
      ],
      [
        { f: '10 Günde Bir', a: 'Fırça kafesi mandallarını açıp ana rulonun altındaki emiş kanalını kontrol edin.' },
        { f: 'Ayda Bir Kez', a: 'Çıkarılabilir yatak başlıklarını ayırıp çelik aks pimini kuru bezle temizleyin.' },
        { f: '300 Saat Çalışma', a: 'Uygulama fırça ömrü uyarısı verdiğinde veya kauçuk yırtıldığında yenileyin.' }
      ],
      [
        { f: 'Haftada Bir Kez', a: 'Fırçanın dönme torkunu elle test edin; Error 5 uyarısı almamak için saçları ayıklayın.' },
        { f: '3 Haftada Bir', a: 'Kafes altındaki tel koruyucuları silin ve kauçuk sıyırıcı kanatları yıkayıp kurutun.' },
        { f: '6 - 9 Ay', a: 'Zemin süpürme kalitesini ve derin halı temizliğini korumak için yeni ana fırça takın.' }
      ],
      [
        { f: 'Düzenli Rutin', a: 'Evcil hayvan tüyü yoğunluğuna göre fırça rulmanlarını haftalık olarak açıp temizleyin.' },
        { f: 'Aylık Kontrol', a: 'Fırça tahrik motorunun altıgen soketinde boşluk veya aşınma olmadığını doğrulayın.' },
        { f: 'Yılda Bir Kez', a: 'Kauçuk esnekliği kaybolduğunda ve ses seviyesi arttığında ana fırçayı değiştirin.' }
      ]
    ];
    return robotRollerSchedules[track];
  }

  if (p === 'yan-firca') {
    const sideSchedules = [
      [
        { f: '10 Günde Bir', a: 'Fırça kollarına ve altıgen tahrik miline sarılan saçları kontrol edip temizleyin.' },
        { f: 'Aylık', a: 'Eğrilen veya bükülen kolları 80°C sıcak suda 30 saniye bekleterek fabrika düzlüğüne getirin.' },
        { f: '3 - 6 Ay', a: 'Kollar koptuğunda veya esnekliğini kaybettiğinde yenisiyle değiştirin.' }
      ],
      [
        { f: 'Haftalık', a: 'Yan fırça vidasının sıkılığını kontrol edin ve süpürgelik tüylerini temizleyin.' },
        { f: 'Ayda Bir Kez', a: 'Tornavidayla fırçayı söküp şaft etrafındaki saç yumağını cımbızla temizleyin.' },
        { f: '4 - 6 Ay', a: 'Köşe kör noktalarında toz bırakmaya başladığında yeni yan fırça takın.' }
      ],
      [
        { f: '2 Haftada Bir', a: 'Kolların dönme direncini elle kontrol edin; Error 6 arızasını önleyin.' },
        { f: 'Gerektikçe', a: 'Halı altına sıkışarak şekli bozulan fırçayı ılık suya batırıp düzeltin.' },
        { f: '200 Saat Sonrası', a: 'Uygulama yan fırça değişim bildirimi verdiğinde yeni parçayı vidalayın.' }
      ],
      [
        { f: '15 Günde Bir', a: 'Fırça göbeğindeki vida yuvasını ve kolların elastikiyetini gözlemleyin.' },
        { f: 'Aylık Bakım', a: 'Fırçayı çıkarıp motor şaftı contasındaki tozu silerek motor ömrünü uzatın.' },
        { f: '3 - 5 Ay', a: 'Kollar aşındığında ve boyu kısaldığında yeni orijinal standartta fırça takın.' }
      ]
    ];
    return sideSchedules[track];
  }

  if (p === 'mop-bezi') {
    const mopSchedules = [
      [
        { f: 'Her Temizlik Sonrası', a: 'Mop bezini tabladan çıkarıp ılık suyla yıkayın; nemli şekilde robotta bırakmayın.' },
        { f: 'Haftalık', a: 'Çamaşır makinesinde 40°C sıcaklıkta, yumuşatıcı kullanmadan derinlemesine yıkayın.' },
        { f: '1 - 3 Ay', a: 'Mikrofiber lifler sertleştiğinde veya su emiciliği azaldığında yeni bez takın.' }
      ],
      [
        { f: 'Günlük Kullanımda', a: 'Paspaslama bitince bezi durulayıp gölgede havadar yerde kurutun.' },
        { f: '10 Günde Bir', a: 'Bezin cırt cırt tutunma yüzeyindeki lifleri ve montaj rayını kontrol edin.' },
        { f: '2 - 3 Ay', a: 'Zeminde su izi ve dalgalanma oluşmaya başladığında mop bezini yenileyin.' }
      ],
      [
        { f: 'Her Görev Bitimi', a: 'Mop tablasını çıkarın; suyun parkeye temas etmesini önlemek için pedi ayırın.' },
        { f: '2 Haftada Bir', a: 'Doğal sabunla çitileyerek mikrofiber gözeneklere yapışan yağ tabakasını çözün.' },
        { f: '3 Ayda Bir', a: 'Titreşimli veya döner baskı verimini maksimumda tutmak için pedi değiştirin.' }
      ],
      [
        { f: 'Kullanım Sonrası', a: 'Bakteriyel koku ve küf oluşumunu önlemek için bezi derhal durulayıp kurutun.' },
        { f: 'Aylık Değerlendirme', a: 'Bezin kumaş kalınlığını inceleyin; incelmiş bezler zemin temasını kaybeder.' },
        { f: '1 - 2 Ay', a: 'Hijyenik temizlik standardını sürdürmek için yeni yedek mikrofiber mop takın.' }
      ]
    ];
    return mopSchedules[track];
  }

  if (p === 'toz-torbasi') {
    const bagSchedules = [
      [
        { f: 'Haftalık', a: 'İstasyon kapağını açıp torba doluluk seviyesini elle ve gözle kontrol edin.' },
        { f: '6 - 8 Haftada Bir', a: 'Torba dolduğunda veya uygulama uyarı verdiğinde sürgülü kilidi çekip çöpe atın.' },
        { f: 'Her Torba Değişiminde', a: 'İstasyonun iç haznesini ve emiş ızgarasını kuru mikrofiber bezle silin.' }
      ],
      [
        { f: '15 Günde Bir', a: 'İstasyonun boşaltma esnasında ses tonunu dinleyin; tizleşme varsa doluluk yakındır.' },
        { f: '1 - 2 Ay', a: 'Toz torbasını yenileyin; aşırı doldurmak istasyon türbin motorunu zorlar.' },
        { f: 'Torba Değişimiyle Birlikte', a: 'İstasyon kılavuz rayındaki contanın temizliğini sağlayın.' }
      ],
      [
        { f: 'Aylık Kontrol', a: 'Evcil hayvan bulunan evlerde doluluk süresi kısalacağından torbayı yoklayın.' },
        { f: '4 - 6 Hafta', a: 'Doluluk sensörü ikaz verdiğinde hijyenik torbayı çekerek yenisiyle değiştirin.' },
        { f: 'Periyodik', a: 'İstasyon hava çıkış filtresini kontrol ederek dışarıya toz sızmadığından emin olun.' }
      ],
      [
        { f: 'Düzenli İnceleme', a: 'İstasyon kapağının sızdırmazlığını ve torba yakasının tam oturduğunu kontrol edin.' },
        { f: '2 Ayda Bir', a: 'Koku oluşumunu engellemek ve emiş debisini korumak için torbayı yenisiyle değiştirin.' },
        { f: 'Yıllık Bakım', a: 'İstasyonun alt hava geçiş kanalını kontrol edip tıkanıklık kalmadığını teyit edin.' }
      ]
    ];
    return bagSchedules[track];
  }

  if (p === 'batarya-pil') {
    if (isDysonCordless) {
      const dysonBatterySchedules = [
        [
          { f: 'Her Kullanımda', a: 'MAX modu sonrası pili hemen şarja takmayın; oda sıcaklığında 20 dakika soğumasını bekleyin.' },
          { f: 'Aylık', a: 'Batarya şarj temas noktalarını kuru pamuklu bezle silerek korozyonu önleyin.' },
          { f: '1.5 - 3 Yıl', a: 'Çalışma süresi 10 dakikanın altına düştüğünde veya 32x kırmızı ışık yandığında bataryayı yenileyin.' }
        ],
        [
          { f: 'Haftalık Rutin', a: 'Cihazı şarj ünitesinde tam doluma ulaştırın; şarj tamamlanınca sabit mavi ışığı görün.' },
          { f: '3 Ayda Bir', a: 'Bataryayı normal modda tamamen bitirip tek seferde %100 şarj ederek kalibre edin.' },
          { f: '500 Şarj Döngüsü', a: 'Hücrelerin kimyasal ömrü tamamlandığında yeni yüksek kapasiteli batarya takın.' }
        ],
        [
          { f: 'Kullanım Kuralı', a: 'Süpürgeyi doğrudan güneş ışığı alan veya sıfırın altındaki soğuk ortamlarda bırakmayın.' },
          { f: 'Aylık Kontrol', a: 'Adaptör fişinin ve batarya giriş jakının sağlam olduğunu ve ısınmadığını doğrulayın.' },
          { f: '2 Yılda Bir', a: 'MAX modda çalışma süresi 2 dakikaya indiğinde batarya paketini değiştirin.' }
        ],
        [
          { f: 'Düzenli Kontrol', a: 'Batarya kasasında çatlak veya vida gevşemesi olmadığını gözlemleyin.' },
          { f: '6 Ayda Bir', a: 'Kullanılmayacaksa bataryayı %60 şarj seviyesinde serin ortamda muhafaza edin.' },
          { f: 'Kritik Voltaj Düşüşünde', a: 'Tetiğe basınca kırmızı LED yandığında gecikmeden yeni batarya paketine geçin.' }
        ]
      ];
      return dysonBatterySchedules[track];
    }

    const robotBatterySchedules = [
      [
        { f: 'Sürekli', a: 'Robotu her zaman prize takılı şarj standında tutun; dock dışında kapalı bırakmayın.' },
        { f: '3 Ayda Bir', a: 'Robot altındaki ve dock üzerindeki şarj kontaklarını temizleyerek tam akım iletimi sağlayın.' },
        { f: '2 - 3 Yıl', a: 'Robot evi tek seferde bitiremeyip sık sık şarja dönmeye başladığında bataryayı yenileyin.' }
      ],
      [
        { f: 'Aylık Kontrol', a: 'Robotun şarj süresini ve temizlik başına harcadığı pil yüzdesini uygulamadan izleyin.' },
        { f: '6 Ayda Bir', a: 'Bataryayı %100 doldurduktan sonra normal modda tam deşarj döngüsüyle kalibre edin.' },
        { f: '400 - 500 Döngü', a: 'Error 12 hatası veya erken kapanma başladığında yeni lityum pil bloğu takın.' }
      ],
      [
        { f: 'Haftalık', a: 'Robotun şarj dockuna tek seferde sorunsuz oturup şarj aldığını gözlemleyin.' },
        { f: 'Tatil Öncesi', a: 'Uzun süre evde olunmayacaksa robotu %70 şarj edip alt güç tuşundan kapatın.' },
        { f: '2 Yılda Bir', a: 'Lityum hücrelerin iç direnci artıp menzil yarıya indiğinde bataryayı değiştirin.' }
      ],
      [
        { f: 'Düzenli', a: 'Aşırı sıcak odalarda robotu çalıştırmayın; 40°C üzerinde pil ömrü kısalır.' },
        { f: 'Aylık Rutin', a: 'Kontaklardaki mikro toz tabakasını izopropil alkollü mendille silerek parlatın.' },
        { f: 'Kapasite Kaybında', a: 'Temizlik süresi 40 dakikanın altına düştüğünde orijinal kapasitede batarya takın.' }
      ]
    ];
    return robotBatterySchedules[track];
  }

  if (p === 'su-haznesi-filtresi') {
    const waterSchedules = [
      [
        { f: 'Her Kullanımda', a: 'Yalnızca filtrelenmiş arıtma su doldurun; kireçli musluk suyu kullanmayın.' },
        { f: 'Aylık', a: 'Su çıkış nozullarını ve filtre tıpasını ılık suyla durulayın; kireç artıklarını temizleyin.' },
        { f: '3 - 6 Ay', a: 'Su geçirgenliği azaldığında veya mop bezi kuru kaldığında su filtre elemanlarını yenileyin.' }
      ],
      [
        { f: 'Haftalık', a: 'Su tankı silikon tıpalarını ve sızdırmazlık contalarını yıpranmaya karşı inceleyin.' },
        { f: 'Ayda Bir Kez', a: 'Hazneye az miktarda ılık arıtılmış su koyup çalkalayarak pompa kanalını durulayın.' },
        { f: '4 - 6 Ay', a: 'Elektronik pompanın zorlanmasını engellemek için yeni filtre kartuşu takın.' }
      ],
      [
        { f: 'Görev Bitiminde', a: 'Haznede kalan suyu boşaltın; tıpası açık şekilde kurumaya bırakın.' },
        { f: '3 Haftada Bir', a: 'Manyetik şamandıra bölgesini kontrol edin; tabana yapışma olmadığından emin olun.' },
        { f: 'Mop Sezonunda', a: 'Paspasın homojen ıslanması için her 6 ayda bir filtre elemanlarını yenileyin.' }
      ],
      [
        { f: 'Düzenli Rutin', a: 'Asla çamaşır suyu veya standart deterjan koymayın; sadece pH nötr robot solüsyonu kullanın.' },
        { f: 'Aylık Bakım', a: 'Nozul gözeneklerini yumuşak fırçayla temizleyin; kesinlikle iğne sokmayın.' },
        { f: 'Yılda Bir Kez', a: 'Su tankı conta takımını ve filtre grubunu orijinal parçalarla yenileyin.' }
      ]
    ];
    return waterSchedules[track];
  }

  if (p === 'tekerlek-bakimi') {
    const wheelSchedules = [
      [
        { f: 'Haftalık', a: 'Ön sarhoş bilye tekerleği düz tornavidayla çıkarıp çelik miline dolanan saçları temizleyin.' },
        { f: '2 Haftada Bir', a: 'Sağ ve sol çekiş tekerleklerini elinizle esneterek süspansiyon yay hareketini kontrol edin.' },
        { f: 'Yılda Bir', a: 'Kauçuk lastik dişleri aşındığında ve robot parkede patinaj yaptığında tekerlek lastiğini yenileyin.' }
      ],
      [
        { f: '10 Günde Bir', a: 'Ön tekerleğin serbestçe döndüğünü teyit edin; zemin çizilme riskini önleyin.' },
        { f: 'Ayda Bir Kez', a: 'Tekerlek aks aralığına fenerle bakın; sıkışan kumaş veya lifleri cımbızla alın.' },
        { f: 'Gerektikçe', a: 'Error 7 tahrik tekerleği hatasını önlemek için çekiş lastiklerini yenileyin.' }
      ],
      [
        { f: '15 Günde Bir', a: 'Ön tekerlek yuvasındaki optik enkoder okuyucu camını pamuklu çubukla silin.' },
        { f: 'Aylık Rutin', a: 'Ana tekerlek kauçuk sırtındaki tozu alkollü mendille silerek sürtünmeyi artırın.' },
        { f: '12 - 18 Ay', a: 'Robot 20 mm kapı eşiklerini aşmakta zorlandığında tekerlek setini yenileyin.' }
      ],
      [
        { f: 'Düzenli Kontrol', a: 'Tekerlekleri elle yavaşça döndürerek mekanik dişli sürtünme sesi olup olmadığını dinleyin.' },
        { f: '6 Haftada Bir', a: 'Süspansiyon yuvalarındaki yayları temizleyin; kum ve toz kalıntılarını uzaklaştırın.' },
        { f: 'Aşınma Durumunda', a: 'Pürüzsüzleşen lastiklerin yerine yeni dişli kauçuk bantlar monte edin.' }
      ]
    ];
    return wheelSchedules[track];
  }

  if (p === 'temizlik-solusyonu') {
    const solutionSchedules = [
      [
        { f: 'Her Su Dolumunda', a: 'Her 1 litre arıtılmış suya yalnızca 1 kapak (5 ml) konsantre solüsyon ekleyin.' },
        { f: 'Aylık', a: 'Su haznesini temiz suyla çalkalayarak nozul çıkış kanallarını durulayın.' },
        { f: 'Düzenli Tüketim', a: 'Şişe bittiğinde robot donanımına zarar vermeyen pH-nötr orijinal formülü tercih edin.' }
      ],
      [
        { f: 'Mop Hazırlığında', a: 'Köpük oluşumunu engellemek için önce suyu doldurun, ardından solüsyonu ilave edin.' },
        { f: '2 Haftada Bir', a: 'İstasyonlu modellerde kirli su tankını boşaltıp durulayın; koku oluşumunu önleyin.' },
        { f: 'Bittiğinde', a: 'Asla standart yer temizleyici veya çamaşır suyu koymayın; yeni robot solüsyonu temin edin.' }
      ],
      [
        { f: 'Her Paspas Döngüsü', a: '1:200 seyreltme oranına sadık kalın; aşırı dozaj zeminde yapışkanlık ve patinaj yapar.' },
        { f: '3 Haftada Bir', a: 'Nozullarda tortu kalmaması için ayda bir kez sadece saf arıtılmış suyla paspas yaptırın.' },
        { f: 'Sürekli Kullanım', a: 'Parke ve fayanslarda derinlemesine hijyen ve parlaklık için düzenli kullanın.' }
      ],
      [
        { f: 'Hazneye Eklerken', a: 'Dozaj kapağını taşmayacak şekilde ölçün ve hazne tıpasını sıkıca kapatın.' },
        { f: 'Aylık Kontrol', a: 'Su tankı içinde köpük veya tortu birikmediğini kontrol edin.' },
        { f: 'Tükendikçe', a: 'Pompa contalarını eritmeyen, mikro nozul kireç önleyici formülü yeniden sipariş edin.' }
      ]
    ];
    return solutionSchedules[track];
  }

  if (p === 'sensor-bakimi') {
    const sensorSchedules = [
      [
        { f: 'Haftalık', a: 'LDS lazer kulesi deliklerini ve alt uçurum (düşme) sensör camlarını kuru bezle silin.' },
        { f: '2 Haftada Bir', a: 'Robot ve şarj istasyonu üzerindeki metal şarj kontaklarını alkollü pamukla parlatın.' },
        { f: 'Aylık', a: 'Duvar takip sensörü (Wall ToF) ve ön tampon kamera camlarını tozlardan arındırın.' }
      ],
      [
        { f: '10 Günde Bir', a: 'Alt kenarlardaki 4 ila 6 adet kızılötesi düşme sensörü penceresindeki tozu silin.' },
        { f: 'Ayda Bir Kez', a: 'Lazer radar kulesine basınçlı hava tutarak döner optik aynadaki mikro tozu uçurun.' },
        { f: 'Şarj Sorununda', a: 'Error 13 uyarısı almamak için nikel kontak plakalarındaki oksit tabakasını silin.' }
      ],
      [
        { f: 'Her 15 Günde', a: 'Ön tampondaki çarpışma ve engel algılama camlarını mikrofiber bezle nazikçe silin.' },
        { f: 'Aylık Bakım', a: 'Şarj dockunun önündeki kızılötesi konumlandırma panelini kirden arındırın.' },
        { f: 'Harita Kaymasında', a: 'LDS kulesinin serbest döndüğünü ve optik diyotların temiz olduğunu kontrol edin.' }
      ],
      [
        { f: 'Haftada Bir Kez', a: 'Sensör pencerelerini kesinlikle kimyasal deterjan değdirmeden kuru bezle temizleyin.' },
        { f: '3 Haftada Bir', a: 'Şarj kontaklarını kurşun kalem silgisi veya izopropil alkolle ovalayarak parlatın.' },
        { f: 'Periyodik', a: 'Karanlık zeminlerde robotun geri çekilmesini önlemek için düşme sensörlerini temiz tutun.' }
      ]
    ];
    return sensorSchedules[track];
  }

  if (p === 'reset-ve-wifi') {
    const resetSchedules = [
      [
        { f: 'Gerektikçe', a: 'Modem değiştiğinde veya ağ şifresi yenilendiğinde Güç + Şarj tuşlarıyla Wi-Fi ağını sıfırlayın.' },
        { f: 'Harita Bozulduğunda', a: 'Uygulamadan haritayı geri yükleyin; düzelmezse pinhole deliğinden fabrika resetlemesi yapın.' },
        { f: 'Yazılım Güncellemesinde', a: 'Cihazı şarj dockuna oturtup pil seviyesi %50 üzerindeyken firmware güncellemesini tamamlayın.' }
      ],
      [
        { f: 'Ağ Bağlantı Hatasında', a: 'Robotu modeme 2 metre mesafeye taşıyıp Wi-Fi sıfırlama tuşlarına 3 saniye basılı tutun.' },
        { f: 'Çevrimdışı Sorununda', a: 'Modemin 2.4 GHz bandını kontrol edin ve modemi yeniden başlatarak IP çakışmasını giderin.' },
        { f: 'Hafıza Kilitlenmesinde', a: 'Ataşla reset butonuna 5 saniye basarak robotu fabrika ayarlarına döndürün.' }
      ],
      [
        { f: 'İnternet Değişiminde', a: 'Uygulamadaki eski ağ profilini silip yeni 2.4 GHz ağını eşleştirme adımlarıyla tanıtın.' },
        { f: 'Harita Çarpılmasında', a: 'Haritayı sıfırlayıp evi baştan haritalandırmak için hızlı haritalama turunu başlatın.' },
        { f: 'Periyodik', a: 'Mobil uygulama önbelleğini temizleyerek bulut sunucu bağlantısını tazeleyin.' }
      ],
      [
        { f: 'İlk Kurulumda', a: 'Telefonun Bluetooth ve Konum servislerini açarak robotu tek seferde eşleştirin.' },
        { f: 'Kopma Anında', a: 'Modem arayüzünden robota sabit IP tanımlayarak DHCP kira süresi kopmalarını önleyin.' },
        { f: 'Kalıcı Kilitlenmede', a: 'Pinhole reset sonrası cihazı sıfırdan kurarak işletim sistemini tazeleyin.' }
      ]
    ];
    return resetSchedules[track];
  }

  if (p === 'hata-kodlari') {
    const errorSchedules = [
      [
        { f: 'Arıza Anında', a: 'Sesli hata kodunu dinleyin veya uygulamadaki hata numarasını teşhis tablosundan bulun.' },
        { f: 'Haftalık Önleyici', a: 'Fırça rulmanları, filtre ve sensör camlarını temizleyerek arıza oluşmasını %90 engelleyin.' },
        { f: 'Çözülmeyen Hatalarda', a: 'Cihazı şarj dockundan alıp kapatın, 10 saniye bekleyip düz zeminde yeniden başlatın.' }
      ],
      [
        { f: 'Alarm Verildiğinde', a: 'Robotun hareketini durdurup fırça veya tekerleğe yabancı cisim dolanıp dolanmadığını kontrol edin.' },
        { f: 'Düzenli Bakım', a: 'Toz haznesi contasını ve filtreyi temiz tutarak Error 10 motor basınç arızasını önleyin.' },
        { f: 'Isınma Durumunda', a: 'Cihazın oda sıcaklığında soğumasını bekleyin; şarj kontaklarını temizleyerek docka oturtun.' }
      ],
      [
        { f: 'İlk Müdahale', a: 'Ön tampona hafifçe tıklatarak mikrosiviç sıkışmasını (Error 2) serbest bırakın.' },
        { f: '15 Günde Bir', a: 'LDS lazer kulesini el ile çevirerek motor tahrik kayışının sağlamlığını test edin.' },
        { f: 'Kalıcı Hatalarda', a: 'Aşınmış parça tespiti yapıp orijinal uyumlu yedek parçayla evde onarımı tamamlayın.' }
      ],
      [
        { f: 'Hata Kodunda', a: 'Cihazı zorlamadan kapatın; tablodaki adım adım çözüm talimatlarını sırayla uygulayın.' },
        { f: 'Aylık Rutin', a: 'Tekerlek süspansiyonlarını ve şaftları temizleyerek motor aşırı yük alarmlarını önleyin.' },
        { f: 'Servis Öncesi', a: 'Gereksiz servis ücreti ödememek için filtre ve fırçayı söküp temizleyerek son bir test yapın.' }
      ]
    ];
    return errorSchedules[track];
  }

  return [
    { f: 'Haftalık', a: 'Görsel kontrol ve toz temizliği yapın.' },
    { f: 'Aylık', a: 'Parçayı söküp detaylı temizleyin ve aşınma durumunu kontrol edin.' },
    { f: '6 - 12 Ay', a: 'Mekanik verimliliği korumak için yeni orijinal standartta parça takın.' }
  ];
}

module.exports = {
  getMaintenanceSchedule
};
