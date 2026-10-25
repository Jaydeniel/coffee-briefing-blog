// Espresso Vibe 글 구성 요소 보강 (DESIGN.md 2단계). 스크립트가 없어도 글은 그대로 읽힌다.
(function () {
  var body = document.querySelector('.post-body');
  if (!body) return;

  var DATE_AFTER = /^\s*·\s*((?:수집\s*)?\d{4}-\d{2}-\d{2})/;

  // 1) 출처 표시: "… — <a>매체</a> · YYYY-MM-DD" → <span class="src"><a>매체</a><time>YYYY-MM-DD</time></span>
  body.querySelectorAll('.sec li, .sec p').forEach(function (el) {
    var links = Array.prototype.filter.call(el.childNodes, function (n) { return n.nodeName === 'A'; });
    var a = links[links.length - 1];
    if (!a) return;
    var prev = a.previousSibling;
    if (!prev || prev.nodeType !== 3 || !/—\s*$/.test(prev.nodeValue)) return;

    var span = document.createElement('span');
    span.className = 'src';
    prev.nodeValue = prev.nodeValue.replace(/\s*—\s*$/, ' ');
    a.parentNode.insertBefore(span, a);
    span.appendChild(a);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');

    var next = span.nextSibling;
    if (next && next.nodeType === 3) {
      var m = next.nodeValue.match(DATE_AFTER);
      if (m) {
        var t = document.createElement('time');
        t.textContent = m[1];
        t.setAttribute('datetime', m[1].replace(/^수집\s*/, ''));
        span.appendChild(t);
        next.nodeValue = next.nodeValue.slice(m[0].length);
      }
    }
  });

  // 2) "카페를 준비한다면:" 팁 이름표
  body.querySelectorAll('.sec-news li > ul > li').forEach(function (li) {
    var first = li.firstChild;
    if (!first || first.nodeType !== 3) return;
    var m = first.nodeValue.match(/^\s*([^:：]{2,20})[:：]\s*/);
    if (!m) return;
    var label = document.createElement('span');
    label.className = 'tip-label';
    label.textContent = m[1];
    first.nodeValue = first.nodeValue.slice(m[0].length);
    li.insertBefore(label, first);
  });

  // 3) 일정 날짜 칸: "2026-11-11~14 …" → <span class="sch-date">11.11–14<small>2026</small></span>
  body.querySelectorAll('.sec-schedule > ul > li').forEach(function (li) {
    var first = li.firstChild;
    if (!first || first.nodeType !== 3) return;
    var m = first.nodeValue.match(/^\s*(\d{4})-(\d{2})-(\d{2})(?:\s*~\s*(?:(\d{2})-)?(\d{2}))?\s*/);
    if (!m) return;
    var d = document.createElement('span');
    d.className = 'sch-date';
    var mmdd = +m[2] + '.' + +m[3];
    if (m[5]) mmdd += '–' + (m[4] ? +m[4] + '.' : '') + +m[5];
    d.textContent = mmdd;
    var y = document.createElement('small');
    y.textContent = m[1];
    d.appendChild(y);
    first.nodeValue = first.nodeValue.slice(m[0].length);
    var rest = document.createElement('span');
    while (li.firstChild) rest.appendChild(li.firstChild);
    li.appendChild(d);
    li.appendChild(rest);
    li.classList.add('has-date');
  });

  // 4) 링크 복사 (벤치마킹 1단계). 클립보드 API → execCommand → 주소 입력창 순으로 시도
  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }
  document.querySelectorAll('.copy-link').forEach(function (btn) {
    var label = btn.textContent;
    function show(text, ok) {
      btn.textContent = text;
      btn.classList.toggle('copied', ok);
      setTimeout(function () { btn.textContent = label; btn.classList.remove('copied'); }, 2000);
    }
    btn.addEventListener('click', function () {
      var url = btn.getAttribute('data-url') || location.href;
      var fallback = function () {
        if (legacyCopy(url)) { show('복사했습니다', true); return; }
        window.prompt('아래 주소를 복사하세요', url);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () { show('복사했습니다', true); }, fallback);
      } else {
        fallback();
      }
    });
  });

  // 5) 섹션 바로가기: 지금 읽는 섹션 표시
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.post-toc a'));
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    tocLinks.forEach(function (a) { byId[decodeURIComponent(a.getAttribute('href').slice(1))] = a; });
    var current = null;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.id;
        if (current) current.classList.remove('is-current');
        current = byId[id];
        if (current) current.classList.add('is-current');
      });
    }, { rootMargin: '-80px 0px -70% 0px' });
    Object.keys(byId).forEach(function (id) {
      var h = document.getElementById(id);
      if (h) obs.observe(h);
    });
  }
})();
