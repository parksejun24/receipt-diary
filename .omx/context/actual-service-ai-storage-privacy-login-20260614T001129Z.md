# Deep Interview Context Snapshot

Task statement: 실제 서비스화를 위해 Receipt Diary의 AI 해석, 저장, 개인정보, 로그인 범위를 구체화한다.

Desired outcome: 후속 ralplan/ralph가 그대로 사용할 수 있는 실행 전 요구사항 명세를 만든다.

Stated solution: deep-interview를 통해 범위를 질문 기반으로 정리한다.

Probable intent hypothesis: MVP가 로컬 mock 상태로 완성되었으므로, 실제 서비스 전환 전에 개인정보 위험과 제품 방향을 흐리지 않는 기술 범위를 먼저 확정하려는 의도다.

Known facts/evidence:
- `docs/PROJECT_STATUS.md` 기준 MVP는 `origin/main`에 구현 및 push 완료.
- 현재 앱은 Vite + React + TypeScript 기반 local-first MVP다.
- 새 일기는 브라우저 `localStorage`의 `receipt-diary.entries.v1` 키에 저장된다.
- 현재 해석은 mock/local adapter이며 실제 AI/API/server/database/login은 없다.
- 모든 주요 화면은 receipt surface 안에서 동작한다.
- Receipt는 금융 기록이 아니라 diary interpretation을 담는 시각적 은유다.

Constraints:
- 금액, 점수, 총합, 순위, 베스트/워스트 데이, streak, performance dashboard 개념 금지.
- AI 해석은 판단이 아니라 개인적 제안이어야 한다.
- 실제 AI/저장/로그인 설계는 개인정보 경계가 선명해야 한다.

Unknowns/open questions:
- 실제 AI 해석을 언제 호출할지.
- 원문 일기를 서버로 보낼지, 저장할지, 즉시 폐기할지.
- AI 결과를 저장할지, 재생성 가능하게 둘지.
- 로그인/계정이 MVP 다음 단계에 필요한지.
- 로컬 우선, 클라우드 동기화, 백업/export 중 무엇이 1차 서비스 범위인지.
- 사용자가 개인정보 제어를 어떤 수준으로 기대하는지.

Decision-boundary unknowns:
- Codex/OMX가 기술 스택과 저장 방식을 어디까지 결정해도 되는지.
- 로그인 없이 먼저 AI만 붙이는 접근이 허용되는지.
- 개인정보/보안 문구와 삭제/export 정책을 어느 정도까지 제품에 포함해야 하는지.

Likely codebase touchpoints:
- `src/lib/interpretation.ts`
- `src/lib/storage.ts`
- `src/types/diary.ts`
- `src/components/DiaryWriter.tsx`
- `src/components/ReceiptDetail.tsx`
- `src/App.tsx`
- future docs artifact such as `docs/AI_INTERPRETATION_DESIGN.md`

Prompt-safe initial-context summary status: not_needed
