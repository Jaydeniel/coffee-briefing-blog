// 홈 "오늘의 커피 지표" 보강: 천 단위 쉼표, 막대(최근 기록 최대 5개, 3개 이상일 때), 갱신 지연. 스크립트가 없어도 숫자는 보인다.
// 갱신 지연 기준(일): 매일 시세 7일, 월 통계 75일, 발표가 늦는 월 통계(국세청) 270일, 연 통계는 표시하지 않음.
(function () {
  var STALE = { daily: 7, monthly: 75, monthly_lagged: 270 };
  var today = new Date();
  document.querySelectorAll('.dash-card').forEach(function (card) {
    var num = card.querySelector('.num');
    if (num) {
      var d = +num.getAttribute('data-digits') || 0;
      var v = parseFloat(num.textContent);
      if (!isNaN(v)) num.textContent = v.toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d });
    }
    var limit = STALE[card.getAttribute('data-cadence')];
    var asOf = card.getAttribute('data-as-of') || '';
    var dt = new Date(asOf.length === 7 ? asOf + '-01' : asOf);
    if (limit && !isNaN(dt) && (today - dt) / 86400000 > limit) {
      var s = card.querySelector('.dash-stale');
      if (s) s.hidden = false;
    }
    var box = card.querySelector('.dash-spark');
    var hist;
    try { hist = JSON.parse(card.getAttribute('data-history') || '[]'); } catch (e) { hist = []; }
    var vals = hist.slice(-5).map(function (h) { return h[1]; }).filter(function (x) { return typeof x === 'number'; });
    if (!box) return;
    if (vals.length < 3) { box.classList.add('is-empty'); return; }
    var min = Math.min.apply(null, vals) * 0.9, max = Math.max.apply(null, vals), span = max - min || 1;
    box.innerHTML = vals.map(function (v) { return '<i style="height:' + Math.max(4, Math.round(28 * (v - min) / span)) + 'px"></i>'; }).join('');
  });
})();
