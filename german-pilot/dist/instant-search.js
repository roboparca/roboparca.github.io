
  (function() {
    let indexData = [];
    const searchInput = document.getElementById('site-search');
    const searchClear = document.getElementById('search-clear');
    const searchDropdown = document.getElementById('search-dropdown');

    if (!searchInput) return;

    fetch('https://roboparca.github.io/kaffeereparatur/search-index.json')
      .then(r => r.json())
      .then(d => { indexData = d; })
      .catch(e => console.error(e));

    searchInput.addEventListener('input', function() {
      const q = this.value.trim().toLowerCase();
      if (!q) {
        searchDropdown.classList.remove('show');
        searchClear.style.display = 'none';
        return;
      }
      searchClear.style.display = 'block';

      const results = indexData.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.category.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        (item.asin && item.asin.toLowerCase().includes(q))
      ).slice(0, 8);

      if (results.length === 0) {
        searchDropdown.innerHTML = '<div style="padding:12px; font-size:13px; color:#78716c;">Kein passendes Bauteil gefunden.</div>';
      } else {
        searchDropdown.innerHTML = results.map(r => `
          <a href="${r.url}" class="search-dropdown-item">
            <div style="display:flex; align-items:center; overflow:hidden;">
              <img src="${r.thumb}" class="search-item-thumb" alt="${r.title}" onerror="this.style.display='none'">
              <div style="overflow:hidden;">
                <div style="font-size:13px; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:260px;">${r.title}</div>
                <div style="font-size:11px; color:#78716c;">${r.brand} • ${r.category}</div>
              </div>
            </div>
            <span style="font-size:12px; color:#854d0e; font-weight:700;">›</span>
          </a>
        `).join('');
      }
      searchDropdown.classList.add('show');
    });

    searchClear.addEventListener('click', function() {
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
  })();
  