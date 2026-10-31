// 홈 시장 개요 차트와 섹션 탭 (결정 0031). 데이터는 페이지에 박힌 market-data, 외부 호출 없음. 스크립트가 없어도 카드·표는 보인다.
(function () {
  // Annual Report 차트 색: ink, evergreen, chart-2, mint (DESIGN.md)
  var C = { ink: '#0e2a22', green: '#0e4d3c', c2: '#4f9c7f', mint: '#a8d5c2', muted: '#6e7f78', grid: '#cfded7' };
  var tabs = [].slice.call(document.querySelectorAll('.m-tabs a'));
  var sections = tabs.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  function setTab() {
    var cur = 0;
    sections.forEach(function (s, i) { if (s.getBoundingClientRect().top < 160) cur = i; });
    tabs.forEach(function (a, i) {
      var on = i === cur;
      if (on && !a.classList.contains('is-active') && a.parentNode.scrollWidth > a.parentNode.clientWidth) a.parentNode.scrollLeft = a.offsetLeft - 16;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', setTab, { passive: true });
  setTab();

  var el = document.getElementById('market-data');
  if (!el || !window.Chart) return;
  var d = JSON.parse(el.textContent);
  var font = '"DM Sans", "Pretendard Variable", Pretendard, sans-serif';
  Chart.defaults.font.family = font;
  Chart.defaults.font.size = 11;
  Chart.defaults.color = C.muted;
  Chart.defaults.animation = false;
  Chart.defaults.maintainAspectRatio = false;
  Chart.defaults.plugins.legend.position = 'bottom';
  Chart.defaults.plugins.legend.labels.boxWidth = 10;
  Chart.defaults.plugins.legend.labels.boxHeight = 10;
  Chart.defaults.plugins.tooltip.backgroundColor = C.ink;

  var M = function (a) { return a.map(function (v) { return v == null ? null : v / 1e6; }); };
  var fmt = function (v) { return Math.abs(v) >= 100 ? Math.round(v).toLocaleString('ko-KR') : (+v.toFixed(2)).toLocaleString('ko-KR'); };
  var money = { callbacks: { label: function (c) { var v = c.parsed._custom || (c.chart.options.indexAxis === 'y' ? c.parsed.x : c.parsed.y); return (c.dataset.label ? c.dataset.label + ': ' : '') + fmt(v); } } };
  function axes(stacked) {
    return {
      x: { stacked: !!stacked, grid: { display: false }, ticks: { maxRotation: 0, autoSkipPadding: 12 } },
      y: { stacked: !!stacked, grid: { color: C.grid }, border: { display: false } }
    };
  }
  function draw(id, type, labels, datasets, opt) {
    var c = document.getElementById(id);
    if (!c) return;
    new Chart(c, { type: type, data: { labels: labels, datasets: datasets }, options: Object.assign({ scales: axes(), plugins: { tooltip: money }, interaction: { mode: 'index', intersect: false } }, opt || {}) });
  }
  function dates(a) { return a.map(function (s) { return s.slice(2, 4) + '.' + s.slice(5, 7); }); }
  function line(label, data, color, extra) { return Object.assign({ label: label, data: data, borderColor: color, backgroundColor: color, borderWidth: 1.6, pointRadius: 0, tension: 0.1, spanGaps: true }, extra || {}); }
  function bar(label, data, color) { return { label: label, data: data, backgroundColor: color, borderWidth: 0 }; }
  var noLegend = { legend: { display: false }, tooltip: money };

  var b = d.balance;
  draw('c-supply', 'bar', b.labels, [bar('생산', M(b.production), C.mint), bar('소비', M(b.consumption), C.green)]);
  draw('c-balance', 'bar', b.labels, [{ label: '수급 차이', data: M(b.balance), backgroundColor: C.green }], { plugins: noLegend });

  var p = d.prices, pl = dates(p.dates);
  draw('c-icip', 'line', pl, [line('I-CIP', p.icip, C.green)], { plugins: noLegend });
  draw('c-groups', 'line', pl, [
    line('콜롬비아 마일드', p.col, C.green), line('기타 마일드', p.oth, C.c2), line('브라질 내추럴', p.bra, C.mint), line('로부스타', p.rob, C.muted),
    line('I-CIP', p.icip, C.ink, { borderDash: [3, 3] })
  ]);
  draw('c-futures', 'line', pl, [line('I-CIP', p.icip, C.ink), line('뉴욕 (아라비카)', p.ny, C.green), line('런던 (로부스타)', p.ldn, C.c2)]);

  var g = d.exports_group;
  draw('c-exp-group', 'bar', g.labels, [bar(g.prior_label, M(g.prior), C.mint), bar(g.cur_label, M(g.cur), C.green)], {
    indexAxis: 'y', scales: { x: { grid: { color: C.grid } }, y: { grid: { display: false } } }
  });
  [['c-exp-region', d.exports_region, [C.ink, C.green, C.c2, C.mint]], ['c-exp-form', d.exports_form, [C.green, C.c2, C.mint]]].forEach(function (x) {
    draw(x[0], 'bar', x[1].years, x[1].series.map(function (s, i) { return bar(s.name, M(s.data), x[2][i]); }), { scales: axes(true) });
  });

  var names;
  try { names = new Intl.DisplayNames(['ko'], { type: 'region' }); } catch (e) { names = null; }
  function country(r) { try { return names ? names.of(r.iso) : r.name; } catch (e) { return r.name; } }
  [['c-producers', d.producers, C.green], ['c-importers', d.importers, C.green], ['c-exporters', d.exporters, C.green]].forEach(function (x) {
    draw(x[0], 'bar', x[1].map(country), [bar('', M(x[1].map(function (r) { return r.bags; })), x[2])], {
      indexAxis: 'y', plugins: noLegend, scales: { x: { grid: { color: C.grid } }, y: { grid: { display: false }, ticks: { autoSkip: false } } }
    });
  });

  var s = d.stocks;
  draw('c-stocks', 'line', s.months, [line('뉴욕 (아라비카)', s.ny, C.green, { tension: 0.3, borderWidth: 2 }), line('런던 (로부스타)', s.london, C.c2, { tension: 0.3, borderWidth: 2 })]);
})();
