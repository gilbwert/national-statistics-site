// Nusantara in Numbers — router and views.
// A hash-routed single-page site: every page is a link away (#/indicators,
// #/indicator/<id>, #/provinces, #/province/<slug>, #/about), every figure
// comes from data.js, and every chart from charts.js. Nothing is fetched.
(function () {
  'use strict';

  var D = window.NUSA_DATA;
  var C = window.NUSA_CHARTS;
  var view = document.getElementById('view');

  function latest(ind) { return ind.values[ind.values.length - 1]; }

  // A change is coloured by whether it is good news for that indicator:
  // growth rising is teal, inflation rising is red, and so on.
  function deltaClass(ind) {
    var d = ind.values[ind.values.length - 1] - ind.values[ind.values.length - 2];
    if (d === 0 || ind.direction === 'flat') return 'flat';
    var good = (ind.direction === 'up' && d > 0) || (ind.direction === 'down' && d < 0);
    return good ? 'up' : 'down';
  }

  function statCard(ind) {
    return '<a class="stat-card" href="#/indicator/' + ind.id + '">' +
      '<div class="k">' + C.esc(ind.name) + '</div>' +
      '<div class="v">' + C.fmt(latest(ind), ind.decimals) + ' <small>' + C.esc(ind.short || ind.unit) + '</small></div>' +
      '<div class="d"><span class="delta ' + deltaClass(ind) + '">' + C.deltaText(ind.values, ind.decimals) + '</span> on a year earlier · ' + C.esc(ind.period) + '</div></a>';
  }

  function panelChart(ind, height) {
    return '<div class="panel"><h3>' + C.esc(ind.name) + '</h3>' +
      '<p class="src">' + C.esc(ind.period) + ' · Source: ' + C.esc(ind.source) + '</p>' +
      C.lineChart(D.YEARS, ind.values, { height: height || 240, decimals: ind.decimals >= 2 ? 1 : 0, label: ind.name + ' chart' }) + '</div>';
  }

  function homeView() {
    var headline = ['population', 'gdp-growth', 'inflation', 'poverty', 'unemployment', 'hdi']
      .map(function (id) { return statCard(D.indicatorById(id)); }).join('');
    var topProvinces = D.PROVINCES.slice().sort(function (a, b) { return b.population - a.population; }).slice(0, 5)
      .map(function (p) {
        return '<tr><td><a href="#/province/' + D.provinceSlug(p.name) + '">' + C.esc(p.name) + '</a></td><td>' + C.fmt(p.population, 2) + '</td><td>' + C.fmt(p.poverty, 2) + '</td><td>' + C.fmt(p.hdi, 1) + '</td></tr>';
      }).join('');
    return '' +
      '<div class="hero"><h1>Indonesia, measured:<br><span class="accent">281.6 million people,</span> one economy, 38 provinces.</h1>' +
      '<p class="lede">The headline statistics of the Republic of Indonesia — population, growth, prices, poverty, jobs and human development — with ten years of history behind every figure and a full explorer for every province.</p>' +
      '<p class="hero-meta">Latest data: <strong>2024</strong> · Sources: Statistics Indonesia (BPS) releases · <a href="#/about">How to read these figures</a></p></div>' +
      '<div class="cards">' + headline + '</div>' +
      '<section class="block"><h2>The decade in two charts</h2>' +
      '<p class="sub">Growth has held near 5% in every year but the pandemic; inflation, after the 2022 fuel-price spike, ended 2024 at its lowest December reading in the series. Open either chart\'s indicator for the full story.</p>' +
      '<div class="two-col">' + panelChart(D.indicatorById('gdp-growth')) + panelChart(D.indicatorById('inflation')) + '</div></section>' +
      '<section class="block"><h2>Where Indonesians live</h2>' +
      '<p class="sub">The five largest provinces hold almost half the country. The explorer covers all 38 — search, filter by island group and sort by any column.</p>' +
      '<div class="panel"><table class="data"><thead><tr><th>Province</th><th>Population (m)</th><th>Poverty (%)</th><th>HDI</th></tr></thead><tbody>' + topProvinces + '</tbody></table>' +
      '<p class="count-note"><a href="#/provinces">Open the province explorer →</a></p></div></section>' +
      '<section class="block"><h2>When the next figures land</h2>' +
      '<p class="sub">Official statistics run to a calendar. These are the releases that move the numbers on this site.</p>' +
      '<div class="panel">' + D.RELEASES.slice(0, 3).map(releaseRow).join('') +
      '<p class="count-note"><a href="#/about">Full release calendar and methods →</a></p></div></section>';
  }

  function releaseRow(r) {
    return '<div class="release"><div class="when">' + C.esc(r.date) + '</div><div><h3>' + C.esc(r.title) + '</h3><p>' + C.esc(r.detail) + '</p></div></div>';
  }

  function indicatorsView() {
    var cards = D.INDICATORS.map(function (ind) {
      return '<a class="ind-card" href="#/indicator/' + ind.id + '"><h3>' + C.esc(ind.name) + '</h3>' +
        '<p class="card-sub">' + C.esc(ind.card) + '</p>' +
        '<div class="big">' + C.fmt(latest(ind), ind.decimals) + ' <small>' + C.esc(ind.short || ind.unit) + '</small></div>' +
        C.lineChart(D.YEARS, ind.values, { height: 96, decimals: 0, label: ind.name + ' trend' }) +
        '<p class="period">' + C.esc(ind.period) + ' · <span class="delta ' + deltaClass(ind) + '">' + C.deltaText(ind.values, ind.decimals) + '</span> on the year before</p></a>';
    }).join('');
    return '<section class="block"><h2>Indicators</h2>' +
      '<p class="sub">Ten headline series, each with a decade of history, its definition and its source. Pick one for the full chart and the year-by-year table.</p>' +
      '<div class="ind-list">' + cards + '</div></section>';
  }

  function indicatorView(id) {
    var ind = D.indicatorById(id);
    if (!ind) return indicatorsView();
    var rows = D.YEARS.map(function (yr, i) {
      var change = i === 0 ? '—' : C.deltaText(ind.values.slice(0, i + 1), ind.decimals);
      return '<tr><td>' + yr + '</td><td>' + C.fmt(ind.values[i], ind.decimals) + '</td><td>' + change + '</td></tr>';
    }).join('');
    var others = D.INDICATORS.filter(function (o) { return o.id !== id; }).slice(0, 4)
      .map(function (o) { return '<li><a href="#/indicator/' + o.id + '">' + C.esc(o.name) + '</a> — ' + C.fmt(latest(o), o.decimals) + ' ' + C.esc(o.unit) + '</li>'; }).join('');
    return '<p class="crumb"><a href="#/indicators">Indicators</a> / ' + C.esc(ind.name) + '</p>' +
      '<div class="detail-head"><h1>' + C.esc(ind.name) + '</h1>' +
      '<div class="detail-value">' + C.fmt(latest(ind), ind.decimals) + ' <small>' + C.esc(ind.unit) + '</small></div>' +
      '<p class="sub">' + C.esc(ind.card) + ' · ' + C.esc(ind.period) + ' · <span class="delta ' + deltaClass(ind) + '">' + C.deltaText(ind.values, ind.decimals) + '</span> on the year before</p></div>' +
      '<div class="detail-grid"><div class="panel"><h3>Ten years of ' + C.esc(ind.name.toLowerCase()) + '</h3>' +
      '<p class="src">Source: ' + C.esc(ind.source) + '</p>' +
      C.lineChart(D.YEARS, ind.values, { height: 300, decimals: ind.decimals >= 2 ? 1 : 0, label: ind.name + ' 2015 to 2024' }) +
      '<table class="data"><thead><tr><th>Year</th><th>Value (' + C.esc(ind.unit) + ')</th><th>Change</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<div><div class="panel prose"><h3>About this figure</h3><p>' + C.esc(ind.about) + '</p><h3>How to read it</h3><p>' + C.esc(ind.reading) + '</p></div>' +
      '<div class="panel" style="margin-top:14px"><h3>Keep exploring</h3><ul>' + others + '</ul>' +
      '<p class="count-note"><a href="#/provinces">Compare provinces →</a></p></div></div></div>';
  }

  // Province explorer state, kept across renders of the same page.
  var explorer = { query: '', island: 'All island groups', sortKey: 'population', sortDir: -1 };
  var ISLANDS = ['All island groups', 'Sumatra', 'Java', 'Bali & Nusa Tenggara', 'Kalimantan', 'Sulawesi', 'Maluku & Papua'];
  var COLUMNS = [
    { key: 'name', label: 'Province', numeric: false },
    { key: 'capital', label: 'Capital', numeric: false },
    { key: 'population', label: 'Population (m)', numeric: true },
    { key: 'poverty', label: 'Poverty (%)', numeric: true },
    { key: 'hdi', label: 'HDI', numeric: true },
    { key: 'growth', label: 'Growth (%)', numeric: true }
  ];

  function filteredProvinces() {
    var q = explorer.query.trim().toLowerCase();
    var list = D.PROVINCES.filter(function (p) {
      var inIsland = explorer.island === 'All island groups' || p.island === explorer.island;
      var inQuery = !q || p.name.toLowerCase().indexOf(q) >= 0 || p.capital.toLowerCase().indexOf(q) >= 0;
      return inIsland && inQuery;
    });
    var key = explorer.sortKey, dir = explorer.sortDir;
    list.sort(function (a, b) {
      var av = a[key], bv = b[key];
      if (typeof av === 'string') return dir * av.localeCompare(bv);
      return dir * (av - bv);
    });
    return list;
  }

  function provincesView() {
    var options = ISLANDS.map(function (g) {
      return '<option' + (g === explorer.island ? ' selected' : '') + '>' + g + '</option>';
    }).join('');
    var heads = COLUMNS.map(function (col) {
      var arrow = explorer.sortKey === col.key ? (explorer.sortDir === 1 ? ' ↑' : ' ↓') : '';
      return '<th><button type="button" data-sort="' + col.key + '">' + col.label + arrow + '</button></th>';
    }).join('');
    return '<section class="block"><h2>Province explorer</h2>' +
      '<p class="sub">All 38 provinces with their population, poverty rate, human development index and 2024 economic growth. Search by province or capital, filter by island group, sort by any column, and open a province for its profile.</p>' +
      '<div class="tools"><input type="search" id="q" placeholder="Search provinces or capitals…" value="' + C.esc(explorer.query) + '" aria-label="Search provinces">' +
      '<select id="island" aria-label="Filter by island group">' + options + '</select></div>' +
      '<div class="panel"><table class="data explorer"><thead><tr>' + heads + '</tr></thead><tbody id="prov-rows"></tbody></table>' +
      '<p class="count-note" id="prov-count"></p></div></section>';
  }

  function drawProvinceRows() {
    var tbody = document.getElementById('prov-rows');
    if (!tbody) return;
    var list = filteredProvinces();
    tbody.innerHTML = list.map(function (p) {
      return '<tr><td><a href="#/province/' + D.provinceSlug(p.name) + '">' + C.esc(p.name) + '</a></td>' +
        '<td>' + C.esc(p.capital) + '</td><td>' + C.fmt(p.population, 2) + '</td><td>' + C.fmt(p.poverty, 2) + '</td>' +
        '<td>' + C.fmt(p.hdi, 1) + '</td><td>' + C.fmt(p.growth, 1) + '</td></tr>';
    }).join('') || '<tr><td colspan="6">No province matches that search.</td></tr>';
    document.getElementById('prov-count').textContent =
      'Showing ' + list.length + ' of ' + D.PROVINCES.length + ' provinces · Population mid-2024, poverty March 2024, HDI and growth 2024 · Source: BPS';
  }

  function wireExplorer() {
    var q = document.getElementById('q');
    var sel = document.getElementById('island');
    if (!q || !sel) return;
    q.addEventListener('input', function () { explorer.query = q.value; drawProvinceRows(); });
    sel.addEventListener('change', function () { explorer.island = sel.value; drawProvinceRows(); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-sort]'), function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-sort');
        if (explorer.sortKey === key) explorer.sortDir = -explorer.sortDir;
        else { explorer.sortKey = key; explorer.sortDir = key === 'name' || key === 'capital' ? 1 : -1; }
        render(); // re-render so the sort arrows move
        var input = document.getElementById('q');
        if (input) input.focus();
      });
    });
    drawProvinceRows();
  }

  function provinceView(slug) {
    var p = D.provinceBySlug(slug);
    if (!p) return provincesView();
    var n = D.NATIONAL;
    return '<p class="crumb"><a href="#/provinces">Provinces</a> / ' + C.esc(p.name) + '</p>' +
      '<div class="detail-head"><h1>' + C.esc(p.name) + '</h1>' +
      '<p class="sub">Capital ' + C.esc(p.capital) + ' · ' + C.esc(p.island) + ' · Population ' + C.fmt(p.population, 2) + ' million (mid-2024)</p></div>' +
      '<div class="cards">' +
      '<div class="stat-card"><div class="k">Poverty rate</div><div class="v">' + C.fmt(p.poverty, 2) + ' <small>%</small></div><div class="d">National: ' + C.fmt(n.poverty, 2) + '%</div></div>' +
      '<div class="stat-card"><div class="k">Human Development Index</div><div class="v">' + C.fmt(p.hdi, 1) + '</div><div class="d">National: ' + C.fmt(n.hdi, 2) + '</div></div>' +
      '<div class="stat-card"><div class="k">Economic growth 2024</div><div class="v">' + C.fmt(p.growth, 1) + ' <small>%</small></div><div class="d">National: ' + C.fmt(n.growth, 2) + '%</div></div>' +
      '<div class="stat-card"><div class="k">Share of population</div><div class="v">' + C.fmt((p.population / n.population) * 100, 1) + ' <small>%</small></div><div class="d">of Indonesia\'s ' + C.fmt(n.population, 1) + ' million</div></div></div>' +
      '<section class="block"><div class="panel"><h3>' + C.esc(p.name) + ' against the nation</h3>' +
      '<p class="src">The black marker on each bar is the national figure. Source: BPS, 2024.</p>' +
      C.compareBar('Poverty rate (%)', p.poverty, n.poverty, 40, 2, '%') +
      C.compareBar('Human Development Index', p.hdi, n.hdi, 100, 1, 'points') +
      C.compareBar('Economic growth (%)', p.growth, n.growth, 25, 1, '%') +
      '<p class="count-note"><a href="#/provinces">← Back to the province explorer</a></p></div></section>';
  }

  function aboutView() {
    return '<section class="block"><h2>Sources &amp; methods</h2>' +
      '<p class="sub">Where every figure on this site comes from, when it is published, and the limits to keep in mind when you use it.</p>' +
      '<div class="panel prose"><h3>Sources</h3>' +
      '<p>All series are compiled from <strong>Statistics Indonesia (BPS)</strong>, the national statistics office: the 2020 Population Census and its projections; the national accounts; the consumer price index; the National Socioeconomic Survey (Susenas) for poverty and inequality; the National Labour Force Survey (Sakernas) for jobs; and the BPS Human Development Index. Figures are the published headline values, rounded as BPS rounds them.</p>' +
      '<h3>Methods in brief</h3>' +
      '<p><strong>Growth</strong> is the change in real GDP at constant 2010 prices. <strong>Inflation</strong> is the December-to-December change in the consumer price index unless a page says otherwise. <strong>Poverty</strong> is measured against the BPS basic-needs poverty line from Susenas consumption data, in March and September rounds. <strong>Unemployment</strong> is the open unemployment rate from the August Sakernas round. <strong>HDI</strong> follows the BPS method revised in 2023, which is why the last two readings sit slightly above the older series\' path.</p>' +
      '<div class="note"><strong>Read with care:</strong> provincial figures for the four newest Papuan provinces rest on smaller survey samples and carry wider margins of error. This site is an independent presentation of the statistics, not an official BPS publication; cite BPS directly for legal or policy use.</div></div>' +
      '<section class="block"><h2>Release calendar</h2><div class="panel">' + D.RELEASES.map(releaseRow).join('') + '</div></section></section>';
  }

  function setNav(section) {
    Array.prototype.forEach.call(document.querySelectorAll('.site-nav a'), function (a) {
      a.classList.toggle('active', a.getAttribute('data-nav') === section);
    });
  }

  function render() {
    var hash = location.hash || '#/';
    var parts = hash.replace(/^#\//, '').split('/');
    var html, section = 'home', after = null;
    if (parts[0] === '' || parts[0] === undefined) { html = homeView(); section = 'home'; }
    else if (parts[0] === 'indicators') { html = indicatorsView(); section = 'indicators'; }
    else if (parts[0] === 'indicator' && parts[1]) { html = indicatorView(parts[1]); section = 'indicators'; }
    else if (parts[0] === 'provinces') { html = provincesView(); section = 'provinces'; after = wireExplorer; }
    else if (parts[0] === 'province' && parts[1]) { html = provinceView(parts[1]); section = 'provinces'; }
    else if (parts[0] === 'about') { html = aboutView(); section = 'about'; }
    else { html = homeView(); section = 'home'; }
    view.innerHTML = html;
    setNav(section);
    if (after) after();
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', render);
  render();
})();
