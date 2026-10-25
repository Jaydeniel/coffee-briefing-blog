// 홈 대시보드 보강: 추세 그래프(sparkline), 천 단위 쉼표, 갱신 지연 표시. 스크립트가 없어도 숫자는 보인다.
(function () {
  var STALE_DAYS = { arabica: 7, robusta: 7, coffee_shops: 150 };
  var today = new Date();

  document.querySelectorAll('.dash-card').forEach(function (card) {
    // 천 단위 쉼표
    var num = card.querySelector('.dash-num');
    if (num) {
      var d = +num.getAttribute('data-digits') || 0;
      var v = parseFloat(num.textContent);
      if (!isNaN(v)) num.textContent = v.toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d });
    }

    // 갱신 지연
    var asOf = card.getAttribute('data-as-of') || '';
    var dt = new Date(asOf.length === 7 ? asOf + '-01' : asOf);
    var limit = STALE_DAYS[card.getAttribute('data-key')] || 7;
    if (!isNaN(dt) && (today - dt) / 86400000 > limit) {
      var s = card.querySelector('.dash-stale');
      if (s) s.hidden = false;
    }

    // 추세 그래프
    var box = card.querySelector('.dash-spark');
    var hist;
    try { hist = JSON.parse(card.getAttribute('data-history') || '[]'); } catch (e) { hist = []; }
    if (!box || hist.length < 2) { if (box) box.remove(); return; }
    var W = 200, H = 40, P = 3;
    var vals = hist.map(function (h) { return h[1]; });
    var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
    var span = max - min || 1;
    var pts = vals.map(function (v, i) {
      var x = P + (W - 2 * P) * i / (vals.length - 1);
      var y = H - P - (H - 2 * P) * (v - min) / span;
      return [x.toFixed(1), y.toFixed(1)];
    });
    var line = pts.map(function (p) { return p.join(','); }).join(' ');
    var area = 'M' + pts[0][0] + ',' + (H - P) + ' L' + line.replace(/ /g, ' L') + ' L' + pts[pts.length - 1][0] + ',' + (H - P) + ' Z';
    var last = pts[pts.length - 1];
    box.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" role="img" aria-label="최근 ' + vals.length + '개 기록 추세">' +
      '<path class="area" d="' + area + '"/><polyline class="line" points="' + line + '"/>' +
      '<circle class="dot" cx="' + last[0] + '" cy="' + last[1] + '" r="2.5"/></svg>';
  });
})();
