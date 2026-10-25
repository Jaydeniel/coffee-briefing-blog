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

  // 5) 좁은 화면(1240px 미만): 떠 있는 "목차" 버튼 + 아래에서 올라오는 섹션 목록
  var toc = document.querySelector('.post-toc');
  var fab = null, sheet = null;
  if (toc) {
    fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'toc-fab';
    fab.textContent = '목차';
    fab.setAttribute('aria-haspopup', 'dialog');
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('aria-controls', 'toc-sheet');

    sheet = document.createElement('div');
    sheet.className = 'toc-sheet';
    sheet.id = 'toc-sheet';
    sheet.hidden = true;
    sheet.innerHTML =
      '<div class="toc-sheet-backdrop" data-close></div>' +
      '<div class="toc-sheet-panel" role="dialog" aria-modal="true" aria-labelledby="toc-sheet-title">' +
        '<div class="toc-sheet-head"><p id="toc-sheet-title">이 글에서</p>' +
        '<button type="button" class="toc-sheet-close" data-close>닫기</button></div>' +
      '</div>';
    var list = toc.querySelector('ol').cloneNode(true);
    sheet.querySelector('.toc-sheet-panel').appendChild(list);
    document.body.appendChild(fab);
    document.body.appendChild(sheet);

    var openSheet = function () {
      sheet.hidden = false;
      document.documentElement.classList.add('sheet-open');
      fab.setAttribute('aria-expanded', 'true');
      var first = sheet.querySelector('a.is-current') || sheet.querySelector('a');
      if (first) first.focus();
    };
    var closeSheet = function (returnFocus) {
      sheet.hidden = true;
      document.documentElement.classList.remove('sheet-open');
      fab.setAttribute('aria-expanded', 'false');
      if (returnFocus) fab.focus();
    };
    fab.addEventListener('click', openSheet);
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) closeSheet(true);
      else if (e.target.closest('a')) closeSheet(false); // 앵커 이동은 그대로 일어난다
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !sheet.hidden) closeSheet(true);
    });
  }

  // 6) 지금 읽는 섹션 표시 (고정 목차·한 줄 목차·떠 있는 목록 모두)
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.post-toc a, .toc-sheet a'));
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    tocLinks.forEach(function (a) {
      var id = decodeURIComponent(a.getAttribute('href').slice(1));
      (byId[id] = byId[id] || []).push(a);
    });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        tocLinks.forEach(function (a) { a.classList.remove('is-current'); a.removeAttribute('aria-current'); });
        (byId[e.target.id] || []).forEach(function (a) { a.classList.add('is-current'); a.setAttribute('aria-current', 'true'); });
      });
    }, { rootMargin: '-80px 0px -70% 0px' });
    Object.keys(byId).forEach(function (id) {
      var h = document.getElementById(id);
      if (h) obs.observe(h);
    });
  }

  // 7) 넓은 화면 고정 목차와 좁은 화면 목차 버튼은 커버를 지난 뒤에만 보인다
  var cover = document.querySelector('.post-cover.has-photo');
  var setVisible = function (v) {
    if (toc) toc.classList.toggle('is-visible', v);
    if (fab) fab.classList.toggle('is-visible', v);
  };
  if (cover && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { setVisible(!es[0].isIntersecting); }, { rootMargin: '-60px 0px 0px 0px' }).observe(cover);
  } else {
    setVisible(true);
  }
})();
