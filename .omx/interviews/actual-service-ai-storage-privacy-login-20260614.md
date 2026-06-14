# Deep Interview: Actual Service AI, Storage, Privacy, Login

Date: 2026-06-14
Interview ID: EB0B08A2-02D9-4905-88BC-0323798EAC87
Context snapshot: `.omx/context/actual-service-ai-storage-privacy-login-20260614T001129Z.md`
Project: Receipt Diary
Mode: `$deep-interview`
Status: Complete

## Purpose

Clarify the next product phase after the local-first MVP: real AI interpretation, server storage, privacy treatment, login, and synchronization boundaries.

The interview did not authorize implementation. It produced a handoff-ready requirement artifact for `$ralplan`, `$ralph`, or equivalent execution planning.

## Current Product Baseline

Receipt Diary MVP is implemented as a Vite + React + TypeScript app.

Current implementation:

- Local-first diary writing flow.
- Browser `localStorage` persistence under `receipt-diary.entries.v1`.
- Deterministic mock interpretation adapter.
- Receipt-style UI across the main writing, archive, detail, and original diary flows.
- No real backend, login, cloud sync, or AI API integration.

## Clarified Intent

The core of the actual service is interpretation quality.

The app should help users understand their day through diary writing and notice hidden value they may have missed. The target feeling is not simply "the diary was summarized correctly"; it is:

> "I discovered a value in my day that I had not noticed."

The AI interpretation must remain suggestive, personal, and careful.

## Product Non-Goals

The actual service must not turn a day into a measurable performance object.

Do not introduce:

- Cost, amount, price, money, currency, or financial semantics.
- Totals, scores, points, ranking, best/worst day, streaks, or performance dashboards.
- Psychological diagnosis.
- Moral judgment, scolding, prescription, or coaching framed as certainty.
- Forced hidden-value categories.
- Social comparison.

The receipt remains an emotional and structural metaphor for rereading a day, not a financial or productivity record.

## AI Interpretation Direction

The AI should look for hidden value in the user's diary and propose it cautiously.

Allowed:

- Grounded interpretation based on the diary text.
- Very careful expansion when anchored to the entry, such as "이런 하루에는 ~가치도 숨어있을 수 있겠군요."
- Suggestive Korean wording: "제가 보기에는", "같아요", "보여요", "느껴져요", "숨어있을 수 있겠군요."

Not allowed:

- Inventing situations not present in the diary.
- Declaring the user's day objectively good or bad.
- Overly positive reframing that ignores hard parts of the day.
- Diagnosis, moralizing, instruction, or prescriptive advice.
- Claims that sound authoritative rather than personal and tentative.

## Interpretation Output Structure

Keep the current MVP result structure for the first actual-service iteration.

Required output remains:

- Day summary phrase.
- One-line summary.
- Hidden values.
- Basic diary metadata such as date, time, and diary sequence.
- Access to the original diary text.

The user will review a completed service version and provide feedback before changing this structure.

## Privacy And AI Input Policy

Server storage is allowed, but stored diary data must be accessible only to the owner.

Before sending text to an AI API:

- Remove direct personally identifying information.
- Preserve relationship, situation, emotional flow, and context as much as possible.
- Rewrite the sanitized text so the remaining context is coherent.

Default tradeoff:

- Interpretation quality takes priority over maximum redaction.
- Direct identifiers should be removed.
- Relationship roles, situation shape, emotional sequence, and reflective detail should be retained when they are important for interpretation.

Example policy direction:

- Prefer replacing a person's name with "친구", "동료", "가족", or similar contextual role.
- Prefer replacing exact company/place names with contextual descriptions when needed.
- Preserve the emotional and narrative meaning after redaction.

## Storage And Access Scope

Actual service phase should include:

- User account identity.
- Server-side diary storage.
- Server-side interpretation storage.
- Owner-only access control.
- Cross-device synchronization after login.

Deletion/export controls were not fully specified in this interview, but they are a required follow-up for a privacy-sensitive diary service.

## Login Scope

First actual-service version should use social login as the primary login path.

Required:

- Social login centered onboarding.
- Immediate synchronization of the user's own diary data after login.

Out of scope for first version:

- Email/password account system.
- Complex account recovery flows beyond what the selected auth provider supplies.

## Technology Decision Boundary

Codex may choose the recommended technical stack based on quality and maintainability.

Codex may recommend:

- AI provider.
- Auth provider.
- Database/backend platform.
- Deployment platform.
- Storage architecture.
- Privacy preprocessing architecture.

The user does not require every technology choice to be separately approved before a recommended design is written. However, high-risk decisions should still be explained with alternatives and tradeoffs in the plan.

## Success Criteria

The actual-service design is acceptable if:

- A user can log in with a social account.
- The user's diary entries synchronize to server storage and remain visible only to that user.
- AI interpretation uses a real provider through a server-side boundary, not directly from the browser.
- The text sent to the AI API is sanitized and coherently rewritten before transmission.
- Interpretation quality preserves enough context for the AI to notice hidden value.
- Output remains suggestive and non-judgmental.
- The existing receipt-based product structure remains intact.
- The product still avoids all finance, scoring, ranking, streak, and performance concepts.

## Open Risks

- Over-redaction may reduce interpretation quality.
- Under-redaction may expose sensitive personal context to the AI API.
- Real AI output may drift into diagnosis, advice, or overconfident judgment unless prompt and validation guardrails are strong.
- Social login and server sync introduce security requirements beyond the current MVP.
- Diary deletion, export, retention, and AI-processing disclosure need explicit product decisions before production launch.

## Interview Transcript

### Round 1

Question: 실제 서비스화 1차 목표에서 가장 중요한 가치는 무엇이어야 하나요?

Answer: 결국 이 앱은 일기를 통해 유저의 하루를 이해하고 그 안에 숨겨져 있는 가치를 찾아주는 것이 핵심이기 때문에 해석품질이 가장 중요한 것 같아

Interpretation: 1차 서비스화 핵심은 해석 품질. 로그인/동기화보다 AI가 하루를 이해하고 숨은 가치를 찾아주는 경험이 중요.

### Round 2

Question: 해석 품질이 좋다는 것을 사용자가 결과물을 봤을 때 어떤 느낌이나 행동으로 판단하면 좋을까요?

Answer: 내가 놓친 가치를 발견한 느낌

Interpretation: 좋은 해석의 핵심은 정확한 요약보다 사용자가 놓친 가치를 발견하게 하는 것.

### Round 3

Question: 사용자가 놓친 가치를 발견하게 하는 해석에서, 절대 넘지 말아야 할 선은 무엇인가요?

Answer: 5. 다 포함

Interpretation: 해석은 심리 진단, 훈계/처방, 과도한 긍정, 사실 왜곡을 모두 피해야 함.

### Round 4

Question: AI가 일기 원문을 해석할 때, "숨은 가치"를 어디까지 제안해도 된다고 보나요?

Answer: 2. 조심스러운 확장을 허용하는데 어떤 상황을 상상해서 확장하는게 아니라, "이런 하루에는 ~가치도 숨어있을 수 있겠군요" 정도의 매우 조심스러운 확장만 허용

Interpretation: AI는 상황을 창작하지 않고 원문 맥락에 붙어 있는 가치만 매우 조심스럽게 확장 제안해야 함.

### Round 5

Question: 실제 AI 해석을 붙일 때, 일기 원문 데이터는 1차 서비스에서 어디까지 다뤄야 한다고 보나요?

Answer: 2. 서버 저장 허용, 다만 서버에 저장된 내용은 본인만 볼 수 있어야 하며 ai api에게 전송할때는 개인적인 정보는 모두 제거하고, 개인적인 정보를 제거한 뒤에도 문맥이 이상하지 않게 수정한 뒤에 해당 내용을 ai api에게 전송

Interpretation: 1차 실제 서비스는 로그인/서버 저장 허용. 서버 저장 내용은 본인만 접근 가능해야 하며, AI API에는 개인정보를 제거하고 문맥을 보정한 텍스트만 전송해야 함.

### Round 6

Question: 개인정보 제거 강도와 해석 품질 사이의 기본 정책은 어디에 가까워야 하나요?

Answer: 2. 해석 품질 우선

Interpretation: 1차 기본 정책은 해석 품질 우선. 직접 식별 정보는 제거하되 관계, 상황, 감정 흐름은 최대한 유지해 AI가 맥락을 충분히 읽도록 해야 함.

### Round 7

Question: 사용자가 "내가 놓친 가치를 발견했다"고 느끼게 만드는 AI 해석 결과물은 어떤 구성이어야 하나요?

Answer: 일단은 현행유지하고 완성된 결과물을 바탕으로 피드백할게

Interpretation: 실제 서비스 1차에서도 MVP의 결과 구조를 유지한다. 하루 요약 문구, 한줄 요약, 오늘의 숨어있는 가치, 기본 메타데이터, 원문 보기 흐름은 유지하고 완성본 피드백 이후 조정한다.

### Round 8

Question: 1차 서비스에서 로그인은 어떤 수준이 필요하다고 보나요?

Answer: 간편한 소셜 로그인 중심으로 바로 본인 데이터 동기화 까지 제공하자

Interpretation: 1차 서비스는 소셜 로그인 중심으로 제공하고, 로그인 직후 본인 데이터 서버 동기화까지 포함한다. 이메일/비밀번호 계정은 우선 범위 밖으로 둔다.

### Round 9

Question: 실제 구현 설계에서 AI 제공자, 인증/DB 백엔드, 배포 플랫폼 같은 기술 선택은 내가 품질/유지보수 기준으로 추천안을 정해도 되나요, 아니면 각 선택마다 후보 비교 후 별도 확인을 받고 싶나요?

Answer: 너가 품질/유지보수 기준으로 추천안을 정해

Interpretation: Codex may recommend the stack directly using quality and maintainability as the primary criteria.
