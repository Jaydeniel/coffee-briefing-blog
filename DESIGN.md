# Espresso Vibe 디자인 시스템

외부 테마 없이 직접 만든 디자인. GitHub Pages(Jekyll 3.10)가 그대로 빌드한다. 값은 `_sass/espresso/_tokens.scss`에만 두고, 다른 파일은 CSS 변수(`var(--…)`)로만 쓴다.

## 원칙
1. **읽기 먼저**: 본문 폭 720px, 줄 간격 1.78, 한국어 줄바꿈은 단어 단위(`keep-all`).
2. **커피 색은 의미로**: 에스프레소 = 제목·브랜드, 크레마 = 포인트, 밀크 = 바탕.
3. **창업 단계 색은 Notion과 같게**: 저가 프랜차이즈 주황 · 개인 카페 초록 · 공통 회색.
4. **장식보다 구조**: 그림자는 카드 하나에만, 테두리는 얇게.

## 디자인 값 (tokens)
| 이름 | 값 | 쓰임 |
|---|---|---|
| `--c-espresso` | #3b2418 | 브랜드, 제목, 강조 |
| `--c-roast` | #5a3a28 | 보조 강조, hover |
| `--c-crema` | #c08a56 | 링크 밑줄, 포커스, 마크 |
| `--c-crema-soft` | #f3e6d6 | 인용·강조 배경 |
| `--c-milk` | #fbf7f1 | 페이지 바탕 |
| `--c-paper` | #ffffff | 카드 바탕 |
| `--c-ink` | #2a211c | 본문 |
| `--c-muted` | #7a6a5e | 날짜, 보조 |
| `--c-line` | #e8dccd | 구분선 |
| `--c-stage-franchise(-bg)` | #c8691c / #fbeadb | 저가 프랜차이즈 |
| `--c-stage-indie(-bg)` | #2f7d4f / #e3f1e8 | 개인 카페 |
| `--c-stage-common(-bg)` | #6f665e / #eeeae6 | 공통 |
| `--c-up(-bg)` / `--c-down(-bg)` | #c2412d / #2d64b3 | 지표 오름·내림 (국내 시세 표기 관례) |

- 글꼴: Pretendard Variable (jsDelivr, v1.3.9 dynamic subset). 기본 17px(모바일 16px).
- 간격: 4px 배수 `--sp-1`~`--sp-8` (4·8·12·16·24·32·48·64).
- 형태: 둥글기 6 / 12 / pill, 카드 그림자 1종.

## 구성 요소
| 이름 | 파일 | 단계 |
|---|---|---|
| 머리글(브랜드 마크 + 메뉴), 바닥글 | `_includes/header.html`, `footer.html` | 1 |
| 첫 화면 소개, 글 목록 카드 | `_layouts/home.html` | 1 |
| 글 머리(날짜·제목·기초 지식 칩·단계·태그), 이전·다음 | `_layouts/post.html` | 1 |
| 창업 단계 표시 | `_includes/stage-badge.html` | 1 |
| 오늘의 한 줄 카드 (`.sec-summary`, 짙은 에스프레소 카드) | `_layouts/post.html`, `_sass/espresso/_post-sections.scss` | 2 |
| 소식 항목·"카페를 준비한다면" 팁 상자 (`.sec-news`, `.tip-label`) | 같음 + `assets/js/post.js` | 2 |
| 출처 표시 (`.src`: 매체↗ + 날짜 알약) | `assets/js/post.js` | 2 |
| 기초 지식 상자 (`.sec-basics`: 위 에스프레소 띠, 표시+단계, 개념 이름) | `_layouts/post.html` | 2 |
| 일정 목록 (`.sec-schedule`, `.sch-date` 날짜 칸) | `assets/js/post.js` | 2 |
| 글 끝 안내 문구 (`.post-disclaimer`, `<hr />` 뒤) | `_layouts/post.html` | 2 |
| 홈 대시보드 "오늘의 커피 지표" (`.dash`: 카드·변동 칩·추세 그래프·갱신 지연) | `_includes/dashboard.html`, `_sass/espresso/_dashboard.scss`, `assets/js/dashboard.js`, 데이터 `_data/metrics.json` | 대시보드 |
| 개념 사전 페이지 (concept·stage 모음) | (예정) | 3 |
| 다크 모드, 404, 공유 이미지 | (예정) | 4 |

## 글이 지켜야 할 형식
초안은 private 저장소의 `blog-draft` 스킬이 만든다. front matter `concept`(개념 이름)와 `stage`(저가 프랜차이즈 / 개인 카페 / 공통)가 목록 카드와 글 머리의 표시가 된다. `##` 섹션 이름(오늘의 한 줄, 국내 커피 시장, 원두·원가, 글로벌 동향, 개인 카페 운영, 오늘의 기초 지식: …, 다가오는 일정)은 2단계 구성 요소가 알아보는 기준이라 바꾸지 않는다.

## 2단계 동작 방식
- `post.html`이 본문을 `<h2>` 단위로 잘라 id로 섹션 종류를 고른다: `오늘의-한-줄` → 한 줄 카드, `오늘의-기초-지식-*` → 기초 지식 상자(제목의 "오늘의 기초 지식: "은 위 표시로 옮김), `다가오는-일정` → 일정, 나머지 → 소식. `<hr />` 뒤는 안내 문구.
- `post.js`는 꾸밈만 더한다: "— 링크 · 날짜" → 출처 표시, "카페를 준비한다면:" → 팁 이름표, 일정 첫머리 날짜 → 날짜 칸. **스크립트가 없어도 글은 그대로 읽힌다.**
- 스타일·스크립트 주소에 빌드 시각(`?v=site.time`)을 붙여 배포 직후 옛 스타일이 캐시로 보이지 않게 한다.

## 대시보드 데이터
- `_data/metrics.json`은 private 저장소의 `blog/push_metrics.py`가 매일 만든다. **손으로 고치지 않는다.**
- 형식: `{updated, indicators:[{key, name, market, unit, unit_label, digits, latest:{value, as_of, change_d, change_m, change_y, source, source_url}, history:[[as_of, value]…]}]}`
- 갱신 지연 기준(`dashboard.js`): 선물 7일, 국세청 월 통계 270일.
