# Spec: Receipt Diary Actual Service AI, Storage, Privacy, Login

Date: 2026-06-14
Source interview: `.omx/interviews/actual-service-ai-storage-privacy-login-20260614.md`
Context snapshot: `.omx/context/actual-service-ai-storage-privacy-login-20260614T001129Z.md`
MVP baseline: `docs/PROJECT_STATUS.md`, `MVP_IMPLEMENTATION_PLAN.md`, `docs/design/REFERENCE_DESIGN.md`
Status: Ready for `$ralplan`

## Objective

Design the next Receipt Diary service phase after the completed local MVP.

The next phase should add real AI interpretation, social login, owner-only server storage, and cross-device synchronization while preserving the existing receipt metaphor and non-judgmental product intent.

## Product Intent

Receipt Diary helps users reread an ordinary day and notice hidden value inside it.

The primary service quality is interpretation quality: the user should feel that the app surfaced a value they missed, not merely summarized their text.

The service should sound like a careful reader:

> 제가 보기에는 당신의 하루에는 이런 가치가 숨어있는 것 같아요.

## Non-Goals

Never introduce the following in UI, data model, copy, tests, component names, CSS class names, prompts, AI output, or analytics naming unless explicitly documenting a forbidden constraint:

- cost
- amount
- price
- money
- currency
- total
- score
- points
- rank
- best day
- worst day
- streak
- performance dashboard

Also out of scope:

- Email/password login in the first actual-service version.
- Social features or comparison.
- Psychological diagnosis or personality assessment.
- Fixed universal categories for hidden value.
- Replacing the current receipt result structure before user feedback.

## In Scope

- Social login.
- Owner-only server storage.
- Cross-device synchronization.
- Real AI interpretation through a server-side API path.
- Privacy preprocessing before AI API calls.
- Storage model for original diary text and interpretation output.
- Prompt/output guardrails for suggestive, non-judgmental interpretation.
- Failure states for AI, auth, storage, and sync.
- Privacy-facing product copy and deletion/export planning.

## Architecture Direction

Recommended architecture should be selected by Codex based on quality and maintainability.

Baseline shape:

1. Frontend remains React/Vite unless a later plan justifies a framework migration.
2. Auth runs through a maintained social-login provider.
3. Database stores user-owned diary entries and AI interpretations with row/user-level access control.
4. AI calls happen only on a server/API boundary.
5. Client never stores or exposes AI provider secrets.
6. A privacy preprocessing step produces a sanitized, coherent text version before calling the AI provider.
7. The original diary text remains private to the owner.

## Data Model Requirements

Minimum entities:

- User profile linked to auth identity.
- Diary entry.
- Interpretation.
- AI processing audit metadata.

Diary entry should include:

- Owner/user id.
- Original diary body.
- Date metadata.
- Written time metadata.
- Diary sequence metadata.
- Created/updated timestamps.
- Soft deletion or deletion metadata if supported.

Interpretation should include:

- Owner/user id.
- Diary entry id.
- Day summary phrase.
- One-line summary.
- Hidden value lines.
- Optional evidence snippets when safe.
- Model/provider metadata.
- Generated timestamp.
- Prompt/schema version.

Privacy preprocessing record should include enough metadata to debug quality without storing unnecessary sensitive transformed text unless the plan explicitly justifies it.

## AI Input Policy

Before calling the AI provider:

- Remove direct identifiers such as names, exact company names, exact addresses, exact contact information, and uniquely identifying references.
- Replace identifiers with coherent contextual roles where useful.
- Preserve relationship roles, situation shape, emotional flow, and reflective detail.
- Rewrite the sanitized text so it remains natural and interpretable.

The default policy is interpretation-quality-first with direct identifier removal.

## AI Output Contract

Output must keep the current MVP structure:

- `daySummaryPhrase`
- `oneLineSummary`
- `hiddenValues`
- metadata for date/time/diary sequence
- link/path to original diary view

Tone rules:

- Use suggestive wording.
- Do not define the user's day as objectively good or bad.
- Do not diagnose or prescribe.
- Do not invent events.
- Do not exaggerate positivity.
- Do not use any forbidden performance/finance concepts.

## Security And Privacy Requirements

- Server data must be owner-only.
- Authorization must be enforced server-side, not only in the client UI.
- AI provider key must remain server-side.
- AI input sanitization must be testable.
- User should be able to understand that diary text is processed by AI.
- Deletion/export/retention policy must be decided before public production launch.

## Acceptance Criteria

Planning acceptance:

- A recommended stack is chosen and justified.
- The plan explains why chosen auth/database/AI/deployment options are maintainable.
- The plan includes a privacy preprocessing pipeline.
- The plan includes schema changes and migration strategy from LocalStorage MVP.
- The plan preserves current receipt UX structure.
- The plan includes prompt/schema guardrails and validation tests.
- The plan includes sync behavior and owner-only access tests.
- The plan names unresolved production policy decisions, especially deletion/export/retention.

Implementation acceptance:

- User can log in with social login.
- User's diary entries sync across devices.
- User can only read/write their own entries.
- Creating a diary entry triggers server-backed AI interpretation.
- AI request uses sanitized coherent text, not raw diary text.
- Generated interpretation remains suggestive and avoids forbidden concepts.
- Existing receipt UI continues to show summary, hidden values, metadata, and original diary access.
- Build, lint, tests, and relevant security/authorization checks pass.

## Required Test Strategy

Add or plan tests for:

- Authenticated access control.
- Cross-user isolation.
- Diary CRUD through server storage.
- Local-to-server migration or import if existing local entries are retained.
- Privacy redaction and coherent rewrite behavior.
- AI adapter request shape.
- AI response schema validation.
- Forbidden language guardrails.
- Suggestive tone guardrails.
- Failure states: AI unavailable, auth failure, save failure, sync conflict, network loss.

## Risk Mitigation

- Use schema validation around AI output before saving or rendering.
- Keep mock interpreter available for test/dev fallback.
- Use prompt versioning so interpretation behavior can evolve deliberately.
- Keep privacy preprocessing separate from final interpretation prompt.
- Add server authorization tests before broad UI work.
- Do not ship production AI calls until deletion/export/retention decisions are documented.

## Recommended Next `$ralplan` Prompt

Use this as the next planning command:

```text
$ralplan AGENTS.md, docs/PROJECT_STATUS.md, MVP_IMPLEMENTATION_PLAN.md, docs/design/REFERENCE_DESIGN.md, and .omx/specs/deep-interview-actual-service-ai-storage-privacy-login.md를 기준으로 Receipt Diary 실제 서비스화 설계안을 작성해줘. 지금은 구현하지 말고 repo를 먼저 분석한 뒤, real AI interpretation, social login, owner-only server storage, cross-device sync, privacy preprocessing, schema migration, deployment, security tests, and rollout strategy를 포함한 고품질 계획만 작성해줘. 기술 선택은 품질/유지보수 기준으로 Codex가 추천안을 정하되, 선택 이유와 대안 tradeoff를 명확히 설명해줘. MVP의 현재 receipt UX 구조는 유지하고, 금액/점수/총합/순위/베스트·워스트/스트릭/performance dashboard 개념은 절대 포함하지 마. AI는 판단이 아니라 조심스러운 제안이어야 하고, 직접 식별 정보는 제거하되 관계/상황/감정 흐름은 유지해서 해석 품질을 우선해줘. 마지막에는 $ralph가 그대로 실행할 수 있는 단계별 구현 프롬프트를 작성해줘.
```
