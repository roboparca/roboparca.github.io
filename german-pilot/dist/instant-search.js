
  (function() {
    let indexData = [];
    const searchInput = document.getElementById('site-search');
    const searchClear = document.getElementById('search-clear');
    const searchDropdown = document.getElementById('search-dropdown');

    window.focusFkSearch = function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (searchInput) {
        setTimeout(function() { searchInput.focus(); }, 200);
      }
    };

    if (!searchInput) return;

    fetch('https://kaffeereparatur.github.io/search-index.json')
      .then(function(r) { return r.json(); })
      .then(function(d) { indexData = d; })
      .catch(function(e) { console.error('Search load error:', e); });

    function performSearch() {
      const q = searchInput.value.trim().toLowerCase();
      if (!q) {
        searchDropdown.classList.remove('show');
        searchClear.style.display = 'none';
        return;
      }
      searchClear.style.display = 'block';

      const results = indexData.filter(function(item) {
        return item.title.toLowerCase().includes(q) || 
               item.category.toLowerCase().includes(q) ||
               item.brand.toLowerCase().includes(q) ||
               (item.asin && item.asin.toLowerCase().includes(q));
      }).slice(0, 10);

      if (results.length === 0) {
        searchDropdown.innerHTML = '<div style="padding:16px; text-align:center; font-size:13px; color:#878787;">Kein passendes Ersatzteil gefunden.</div>';
      } else {
        searchDropdown.innerHTML = results.map(function(r) {
          return '<a href="' + r.url + '" class="fk-search-item">' +
            '<img src="' + r.thumb + '" class="fk-search-thumb" alt="' + r.title + '" onerror="this.style.display=\'none\'">' +
            '<div style="flex:1; min-width:0;">' +
              '<div class="fk-search-title">' + r.title + '</div>' +
              '<div class="fk-search-sub">' + r.brand + ' • ' + r.category + '</div>' +
            '</div>' +
            '<span style="color:#2874f0; font-weight:700; font-size:14px;">›</span>' +
          '</a>';
        }).join('');
      }
      searchDropdown.classList.add('show');
    }

    window.performFkSearch = performSearch;

    searchInput.addEventListener('input', performSearch);
    searchInput.addEventListener('focus', function() {
      if (this.value.trim().length > 0) {
        searchDropdown.classList.add('show');
      }
    });

    searchClear.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      searchInput.value = '';
      searchDropdown.classList.remove('show');
      searchClear.style.display = 'none';
      searchInput.focus();
    });

    document.addEventListener('click', function(e) {
      if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.classList.remove('show');
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        searchDropdown.classList.remove('show');
        searchInput.blur();
      }
    });
  })();
  