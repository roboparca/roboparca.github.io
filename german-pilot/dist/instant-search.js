
(function(){
  var searchInput = document.getElementById('instant-search-input');
  var clearBtn = document.getElementById('search-clear-btn');
  var dropdown = document.getElementById('instant-search-dropdown');
  var index = [{"t":"De'Longhi Magnifica S (ECAM 22.110.B) Brühgruppe Revision & O-Ring Dichtungsset","b":"De'Longhi","m":"Magnifica S (ECAM 22.110.B)","p":"Brühgruppe Revision & O-Ring Dichtungsset","c":"Brühgruppe & Dichtungen","u":"https://roboparca.github.io/kaffeereparatur/delonghi/magnifica-s/bruehgruppe/","i":"https://m.media-amazon.com/images/I/71YV6V5e4eL._AC_SL1500_.jpg"},{"t":"De'Longhi Magnifica S (ECAM 22.110.B) Ulka EX5 Vibrationspumpe 15 Bar (48W)","b":"De'Longhi","m":"Magnifica S (ECAM 22.110.B)","p":"Ulka EX5 Vibrationspumpe 15 Bar (48W)","c":"Pumpen & Hydraulik","u":"https://roboparca.github.io/kaffeereparatur/delonghi/magnifica-s/vibrationspumpe/","i":"https://m.media-amazon.com/images/I/61b7L4FjKLL._AC_SL1200_.jpg"},{"t":"De'Longhi Magnifica S (ECAM 22.110.B) Fehlercodes, Rotes Warndreieck & Diagnose","b":"De'Longhi","m":"Magnifica S (ECAM 22.110.B)","p":"Fehlercodes, Rotes Warndreieck & Diagnose","c":"Störungsdiagnose & Fehlercodes","u":"https://roboparca.github.io/kaffeereparatur/delonghi/magnifica-s/fehlercodes/","i":"https://m.media-amazon.com/images/I/71YV6V5e4eL._AC_SL1500_.jpg"},{"t":"Siemens EQ.6 Plus s700 (TE657503DE) Keramik-Mahlwerk & Mahlwerksjustierung","b":"Siemens","m":"EQ.6 Plus s700 (TE657503DE)","p":"Keramik-Mahlwerk & Mahlwerksjustierung","c":"Mahlwerke & Mahlscheiben","u":"https://roboparca.github.io/kaffeereparatur/siemens/eq6-plus-s700/mahlwerk/","i":"https://m.media-amazon.com/images/I/61T2gD8Jc7L._AC_SL1200_.jpg"},{"t":"Siemens EQ.6 Plus s700 (TE657503DE) Edelstahl Milchansaugrohr & Silikonschlauch","b":"Siemens","m":"EQ.6 Plus s700 (TE657503DE)","p":"Edelstahl Milchansaugrohr & Silikonschlauch","c":"Milchsysteme & Düsen","u":"https://roboparca.github.io/kaffeereparatur/siemens/eq6-plus-s700/milchsystem/","i":"https://m.media-amazon.com/images/I/71a6eUqW-QL._AC_SL1500_.jpg"},{"t":"Siemens EQ.6 Plus s700 (TE657503DE) Fehler E0511, E0513 & Wasserfluss-Störung","b":"Siemens","m":"EQ.6 Plus s700 (TE657503DE)","p":"Fehler E0511, E0513 & Wasserfluss-Störung","c":"Störungsdiagnose & Fehlercodes","u":"https://roboparca.github.io/kaffeereparatur/siemens/eq6-plus-s700/fehlercodes/","i":"https://m.media-amazon.com/images/I/71a6eUqW-QL._AC_SL1500_.jpg"},{"t":"Jura Jura E8 (Gen 3 / EB / EC) Claris Smart Filterpatrone (RFID) & Flowmeter","b":"Jura","m":"Jura E8 (Gen 3 / EB / EC)","p":"Claris Smart Filterpatrone (RFID) & Flowmeter","c":"Wasserfilter & Entkalkung","u":"https://roboparca.github.io/kaffeereparatur/jura/e8/wasserfilter/","i":"https://m.media-amazon.com/images/I/61U0t4pU8JL._AC_SL1500_.jpg"},{"t":"Jura Jura E8 (Gen 3 / EB / EC) Drainageventil & Dichtungs-Revisionsset","b":"Jura","m":"Jura E8 (Gen 3 / EB / EC)","p":"Drainageventil & Dichtungs-Revisionsset","c":"Brühgruppe & Dichtungen","u":"https://roboparca.github.io/kaffeereparatur/jura/e8/drainageventil/","i":"https://m.media-amazon.com/images/I/51wY4V2gU1L._AC_SL1000_.jpg"},{"t":"Philips LatteGo 5400 (EP5447/90) AquaClean Kalk- und Wasserfilter CA6903/10","b":"Philips","m":"LatteGo 5400 (EP5447/90)","p":"AquaClean Kalk- und Wasserfilter CA6903/10","c":"Wasserfilter & Entkalkung","u":"https://roboparca.github.io/kaffeereparatur/philips/lattego-5400/aquaclean-filter/","i":"https://m.media-amazon.com/images/I/61gEw-1J0iL._AC_SL1500_.jpg"},{"t":"Philips LatteGo 5400 (EP5447/90) LatteGo 2-Teiliger Milchbehälter & Schäumdeckel","b":"Philips","m":"LatteGo 5400 (EP5447/90)","p":"LatteGo 2-Teiliger Milchbehälter & Schäumdeckel","c":"Milchsysteme & Düsen","u":"https://roboparca.github.io/kaffeereparatur/philips/lattego-5400/milchbehaelter/","i":"https://m.media-amazon.com/images/I/61U2tBvYp-L._AC_SL1500_.jpg"}];

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
