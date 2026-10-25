// 홈 대시보드(GlanceRow) 보강: 다섯 막대 스파크, 천 단위 쉼표, 갱신 지연. 스크립트가 없어도 숫자·증감은 보인다.
// 갱신 지연 기준(일): 선물 시세는 7일, 국세청 월 통계는 발표가 몇 달 늦어 270일.
(function () {
  var STALE_DAYS = { arabica: 7, robusta: 7, coffee_shops: 270 };
  var today = new Date();

  document.querySelectorAll('.glance-row').forEach(function (row) {
    var num = row.querySelector('.num');
    if (num) {
      var d = +num.getAttribute('data-digits') || 0;
      var v = parseFloat(num.textContent);
      if (!isNaN(v)) num.textContent = v.toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d });
    }

    var asOf = row.getAttribute('data-as-of') || '';
    var dt = new Date(asOf.length === 7 ? asOf + '-01' : asOf);
    var limit = STALE_DAYS[row.getAttribute('data-key')] || 7;
    if (!isNaN(dt) && (today - dt) / 86400000 > limit) {
      var s = row.querySelector('.glance-stale');
      if (s) s.hidden = false;
    }

    // 다섯 막대: 최근 기록 5개, 마지막(기준일)만 evergreen. 높이는 최솟값의 90%를 바닥으로 비례.
    var box = row.querySelector('.glance-spark');
    var hist;
    try { hist = JSON.parse(row.getAttribute('data-history') || '[]'); } catch (e) { hist = []; }
    var vals = hist.slice(-5).map(function (h) { return h[1]; });
    if (!box) return;
    if (vals.length < 2) { box.style.visibility = 'hidden'; return; }
    var min = Math.min.apply(null, vals) * 0.9, max = Math.max.apply(null, vals);
    var span = max - min || 1;
    box.innerHTML = vals.map(function (v) {
      return '<i style="height:' + Math.max(4, Math.round(40 * (v - min) / span)) + 'px"></i>';
    }).join('');
  });
})();
