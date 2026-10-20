
(function() {
  var input = document.getElementById('instant-search-input');
  var clearBtn = document.getElementById('search-clear-btn');
  var dropdown = document.getElementById('instant-search-dropdown');
  var col1 = document.getElementById('col-1-list');
  var col2 = document.getElementById('col-2-list');
  var col3 = document.getElementById('col-3-list');
  var count1 = document.getElementById('count-col-1');
  var count2 = document.getElementById('count-col-2');
  var count3 = document.getElementById('count-col-3');
  var pillBtns = document.querySelectorAll('.pill-btn');

  var dataset = null;
  var currentFilter = 'all';

  function loadDataset() {
    if (dataset) return Promise.resolve(dataset);
    return fetch('/search-index.json')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        dataset = data;
        return data;
      });
  }

  if (input) {
    input.addEventListener('focus', function() {
      loadDataset().then(function() {
        if (input.value.trim().length > 0) {
          filterData(input.value);
        }
      });
    });
    document.addEventListener('touchstart', function() { loadDataset(); }, { once: true });

    var timer = null;
    input.addEventListener('input', function() {
      var val = input.value;
      if (clearBtn) clearBtn.style.display = val ? 'flex' : 'none';
      clearTimeout(timer);
      timer = setTimeout(function() {
        filterData(val);
      }, 10);
    });

    input.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        input.value = '';
        if (clearBtn) clearBtn.style.display = 'none';
        if (dropdown) dropdown.classList.remove('show');
        filterData('');
        input.blur();
      } else if (e.key === 'Enter') {
        if (dropdown && dropdown.classList.contains('show')) {
          var firstLink = dropdown.querySelector('a');
          if (firstLink) {
            e.preventDefault();
            window.location.href = firstLink.href;
          }
        }
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      if (input) {
        input.value = '';
        input.focus();
      }
      clearBtn.style.display = 'none';
      if (dropdown) dropdown.classList.remove('show');
      filterData('');
    });
  }

  document.addEventListener('click', function(e) {
    if (dropdown && !e.target.closest('.header-search-wrap')) {
      dropdown.classList.remove('show');
    }
  });

  function filterData(query) {
    loadDataset().then(function(items) {
      var q = (query || '').trim().toLowerCase();
      var words = q.split(/\s+/).filter(Boolean);

      var matched = items.filter(function(item) {
        var str = (item.t + ' ' + item.b + ' ' + item.m + ' ' + item.c).toLowerCase();
        
        if (currentFilter !== 'all') {
          if (currentFilter === 'hepa' && !str.includes('hepa')) return false;
          if (currentFilter === 'firca' && !str.includes('fırça') && !str.includes('firca')) return false;
          if (currentFilter === 'mop' && !str.includes('mop')) return false;
          if (currentFilter === 'hata' && !str.includes('hata') && !str.includes('reset')) return false;
          if (['roborock', 'xiaomi', 'dreame', 'dyson', 'ecovacs'].includes(currentFilter)) {
            if (!item.b.toLowerCase().includes(currentFilter)) return false;
          }
        }

        if (!words.length) return true;
        return words.every(function(w) { return str.indexOf(w) > -1; });
      });

      if (col1 && col2 && col3) {
        renderColumns(matched);
      }

      if (dropdown) {
        if (!q && currentFilter === 'all') {
          dropdown.classList.remove('show');
          dropdown.innerHTML = '';
        } else {
          renderDropdown(matched.slice(0, 10));
        }
      }
    });
  }

  function renderDropdown(items) {
    if (!dropdown) return;
    if (!items.length) {
      dropdown.innerHTML = '<div style="padding:14px; text-align:center; color:#94a3b8; font-size:13px;">Eşleşen model veya parça bulunamadı.</div>';
      dropdown.classList.add('show');
      return;
    }

    var html = items.map(function(item) {
      var imgTag = item.img 
        ? '<img src="' + item.img + '" class="search-item-thumb" alt="" loading="lazy">' 
        : '<span style="font-size:20px; width:36px; text-align:center; display:inline-block;">' + (item.icon || '📦') + '</span>';
      var subText = item.type === 'model' ? item.b + ' Robot Süpürgesi' : (item.b + ' ' + item.m + (item.asin ? ' | ASIN: ' + item.asin : ''));
      return '<a href="' + item.u + '" class="search-dropdown-item">' +
        '<div class="search-item-left">' +
          imgTag +
          '<div class="search-item-texts">' +
            '<span class="search-item-title">' + item.t + '</span>' +
            '<span class="search-item-sub">' + subText + '</span>' +
          '</div>' +
        '</div>' +
        '<span class="search-item-arrow">›</span>' +
      '</a>';
    }).join('');

    dropdown.innerHTML = html;
    dropdown.classList.add('show');
  }

  function renderColumns(items) {
    var parts = [];
    var models = [];
    var guides = [];

    items.forEach(function(it) {
      if (it.type === 'part' && (it.c.includes('hata') || it.c.includes('reset') || it.c.includes('sensor'))) {
        guides.push(it);
      } else if (it.type === 'part') {
        parts.push(it);
      } else if (it.type === 'model' || it.type === 'brand') {
        models.push(it);
      }
    });

    if (count1) count1.textContent = parts.length + ' Sonuç';
    if (count2) count2.textContent = models.length + ' Model';
    if (count3) count3.textContent = guides.length + ' Rehber';

    if (col1) {
      if (!parts.length) {
        col1.innerHTML = '<div style="padding:20px; color:#94a3b8; font-size:13px; text-align:center;">Eşleşen parça bulunamadı.</div>';
      } else {
        col1.innerHTML = parts.slice(0, 40).map(function(p) {
          var imgTag = p.img ? '<img src="' + p.img + '" class="item-thumb-sm" alt="" loading="lazy">' : '';
          return '<a href="' + p.u + '" class="item-row">' +
            imgTag +
            '<div class="item-info">' +
              '<span class="item-name">' + p.icon + ' ' + p.t + '</span>' +
              '<span class="item-sub">' + p.b + ' ' + p.m + ' (ASIN: ' + (p.asin || 'Prime') + ')</span>' +
            '</div>' +
            '<span class="btn-amazon-pill">Amazon\'da Aç ↗</span>' +
          '</a>';
        }).join('');
      }
    }

    if (col2) {
      if (!models.length) {
        col2.innerHTML = '<div style="padding:20px; color:#94a3b8; font-size:13px; text-align:center;">Eşleşen model bulunamadı.</div>';
      } else {
        col2.innerHTML = models.slice(0, 40).map(function(m) {
          return '<a href="' + m.u + '" class="item-row">' +
            '<div class="item-info">' +
              '<span class="item-name">' + m.icon + ' ' + m.t + '</span>' +
              '<span class="item-sub">' + m.b + ' Serisi</span>' +
            '</div>' +
            '<span class="item-badge">Modeller ↗</span>' +
          '</a>';
        }).join('');
      }
    }

    if (col3) {
      if (!guides.length) {
        col3.innerHTML = '<div style="padding:20px; color:#94a3b8; font-size:13px; text-align:center;">Eşleşen rehber bulunamadı.</div>';
      } else {
        col3.innerHTML = guides.slice(0, 40).map(function(g) {
          return '<a href="' + g.u + '" class="item-row">' +
            '<div class="item-info">' +
              '<span class="item-name">' + g.icon + ' ' + g.t + '</span>' +
              '<span class="item-sub">' + g.b + ' ' + g.m + ' Arıza Kılavuzu</span>' +
            '</div>' +
            '<span class="item-badge" style="background:#fef3c7; color:#92400e;">Rehber</span>' +
          '</a>';
        }).join('');
      }
    }
  }

  if (pillBtns && pillBtns.length) {
    pillBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        pillBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter') || 'all';
        filterData(input ? input.value : '');
      });
    });
  }
})();
