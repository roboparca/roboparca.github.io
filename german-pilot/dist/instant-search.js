
(function(){
  var searchInput = document.getElementById('site-search');
  var clearBtn = document.getElementById('search-clear');
  var dropdown = document.getElementById('search-dropdown');
  if (!searchInput || !dropdown) return;

  var index = [];
  fetch('https://roboparca.github.io/kaffeereparatur/search-index.json')
    .then(function(r){ return r.json(); })
    .then(function(d){ index = d; });

  function doSearch(val) {
    var q = val.trim().toLowerCase();
    if (!q) {
      dropdown.classList.remove('show');
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
            '<img src="' + item.i + '" class="search-item-thumb" onerror="this.style.opacity=\'0.7\'">' +
            '<div>' +
              '<div style="font-weight:700; font-size:13px;">' + item.t + '</div>' +
              '<div style="font-size:11px; color:#78716c;">' + item.b + ' • ' + item.c + '</div>' +
            '</div>' +
          '</div>' +
          '<span style="font-size:16px; color:#854d0e;">›</span>' +
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
