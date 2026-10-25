# Espresso Vibe 디자인 시스템 — Annual Report 적용판

2026-10-25부터 블로그 디자인은 claude.ai 아티팩트 **"Annual Report"** 디자인 시스템(https://claude.ai/artifact/TEgpXSgSLx16BFEDf5XoiP)을 따른다. 원본은 "인쇄된 연차보고서를 슬라이드로 옮긴" 시스템이고, 여기서는 웹 블로그에 옮겼다. 원본 규칙이 우선하며, 아래 "웹으로 옮기며 바꾼 것"만 예외다. 값은 `_sass/espresso/_tokens.scss`에만 둔다(원본 토큰 이름 그대로).

## 원칙 (원본)
- 흰 배경(`surface`) 위에 **선과 숫자로만** 구조를 만든다. 그림자·그라디언트·둥근 모서리·어두운 배경·3D·파이 차트 없음.
- 강조색은 `evergreen` 하나. `gold`는 표지 키라인에만, 텍스트에 쓰지 않는다. 색면은 `surface-tint` 하나(표의 당해 열 음영).
- 서명은 연도: 표지에 보고 연도를 `evergreen` 거대 세리프로, 가장자리에서 잘리게.
- 헤드라인·큰 숫자는 DM Serif Display, 본문·레이블·표는 DM Sans. 숫자는 tabular-nums.
- 증감은 빨강/초록으로 나누지 않는다. `evergreen`과 부호(+, −)로 말한다.
- 금지: 카드 그리드, 그림자, 그라디언트, 아이콘·클립아트, 대문자 레이블, 가운데 정렬 본문, 어두운 배경.

## 디자인 값
| 토큰 | 값 | 쓰임 |
|---|---|---|
| `--surface` | #ffffff | 모든 배경 |
| `--surface-tint` | #eef4f1 | 표 당해 열 음영(유일한 색면), 인라인 코드 |
| `--ink` | #0e2a22 | 헤드라인, 큰 숫자, 굵은 룰 |
| `--text` | #33443e | 본문 |
| `--muted` | #6e7f78 | 노트, 출처, 러닝 헤더, 날짜 |
| `--evergreen` | #0e4d3c | 유일한 강조: 거대 연도, 증감, 섹션명, 창업 단계, 당해 막대 |
| `--chart-2` / `--mint` | #4f9c7f / #a8d5c2 | 차트 2·3번, 이전 기록 막대 (텍스트 금지) |
| `--gold` | #c9a227 | 표지 72px 키라인만 |
| `--rule` | #cfded7 | 1px 행 구분선 |
| 선 | hairline 1px rule · strong 2px ink · accent 3px evergreen · keyline 4px gold | 그림자 대신 쓰는 유일한 구분 |

간격 4·8·12·16·24·32·48·64px(`--space-*`, `--page-margin`), 둥근 모서리 0.

## 구성 요소 (원본 → 블로그)
| 원본 | 블로그 | 파일 |
|---|---|---|
| Cover + GiantYear | 홈 표지: 사이트명(evergreen 소형) → "커피 시장 브리핑 [연도]" → 스탠드퍼스트 → gold 키라인 → 아래에서 잘린 거대 연도 | `_layouts/home.html`, `_components.scss` |
| GlanceRow | 홈 대시보드 "오늘의 커피 지표": 선으로 나눈 줄, 큰 숫자·이름·증감(evergreen+부호)·다섯 막대(mint, 마지막 evergreen) | `_includes/dashboard.html`, `_dashboard.scss`, `assets/js/dashboard.js` |
| PageFurniture | 글 러닝 헤더 "커피 시장 브리핑 [연도]"(muted) + "아침 브리핑"(evergreen 600), 글 끝 노트(muted) | `_layouts/post.html` |
| PullQuote | 오늘의 한 줄 = evergreen 짧은 룰 아래 세리프 인용문 / 오늘의 기초 지식 = 두 단(왼쪽 룰·표시·개념, 오른쪽 문단) | `_post-sections.scss` |
| SummaryTable | 다가오는 일정, 본문 표: 헤더 아래 ink 2px, 행 1px, 숫자 오른쪽 | `_post-sections.scss`, `_base.scss` |
| (목록) | 글 목록: 카드 대신 rule로 나눈 줄(날짜 · 세리프 제목 · 기초 지식) | `_layouts/home.html` |

## 웹으로 옮기며 바꾼 것
1. **한글 서체**: DM 서체에 한글이 없어 세리프는 Noto Serif KR, 산세리프는 Pretendard로 받친다(라틴·숫자는 DM).
2. **크기**: 원본은 인쇄 기준(본문 15px, 노트 10px). 웹 읽기용으로 본문 16px, 노트 12px. 거대 연도는 원본 360~420px(1920 캔버스) 대신 240px(본문 폭 760px에서 글과 겹치지 않게).
3. **창업 단계 표시**: Notion의 주황·초록·회색 대신 evergreen 600 글자 하나로(강조색 하나 규칙).
4. **출처 표시**: 알약 모양 대신 note 크기의 muted 한 줄("매체 · 날짜").
5. **브랜드 마크 없음**: 원본에 로고가 없어 사이트명 글자만.
6. 러닝 헤더·노트는 웹에 페이지 번호가 없어 번호는 뺐다.

## 동작 방식 (그대로)
- `post.html`이 본문을 `<h2>` 단위로 잘라 섹션 종류(한 줄 / 기초 지식 / 일정 / 소식)를 고른다. `post.js`는 출처·팁 이름표·일정 날짜 칸만 더한다(없어도 읽힘).
- 대시보드 데이터 `_data/metrics.json`은 private 저장소 `blog/push_metrics.py`가 매일 만든다. 손으로 고치지 않는다.
- 스타일·스크립트 주소에 `?v=site.time`을 붙여 배포 직후 캐시 문제를 막는다.

## 다음 단계
개념 사전 페이지(SummaryTable 형식), 404, 공유 이미지. 다크 모드는 원본이 어두운 배경을 금지해 만들지 않는다.
