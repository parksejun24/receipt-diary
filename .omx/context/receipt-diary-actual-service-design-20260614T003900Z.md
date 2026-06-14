# Context Snapshot: Receipt Diary Actual Service Design

Timestamp: 2026-06-14T00:39:00Z
Workflow: `$ralplan`

## Task Statement

Create a high-quality implementation planning artifact for turning the completed Receipt Diary MVP into an actual service with real AI interpretation, social login, owner-only server storage, cross-device sync, privacy preprocessing, schema migration, deployment, security tests, and rollout strategy.

Do not implement code in this workflow.

## Desired Outcome

A consensus-ready plan saved under `.omx/plans/` that Codex/Ralph can execute later. The plan must include recommended technology choices, alternatives, tradeoffs, acceptance criteria, testing strategy, risk mitigation, rollout stages, and a `$ralph` execution prompt.

## Known Facts And Evidence

- Current app is Vite + React + TypeScript with scripts `dev`, `build`, `lint`, and `test` in `package.json`.
- Current MVP is complete and pushed to `origin/main`; `docs/PROJECT_STATUS.md` says the app is local-first and has no backend, login, cloud sync, or real AI API.
- Current entries are persisted only in browser localStorage under `receipt-diary.entries.v1`.
- `src/App.tsx` directly creates local mock interpretations and prepends entries to localStorage.
- `src/types/diary.ts` defines `DiaryEntry`, `ReceiptInterpretation`, `HiddenValue`, and `NewDiaryInput`.
- `src/lib/interpretation.ts` contains a deterministic mock interpretation adapter that already preserves suggestive wording and filters forbidden concepts.
- `src/test/guardrails.test.ts` enforces forbidden finance/performance language in source.
- `.omx/specs/deep-interview-actual-service-ai-storage-privacy-login.md` clarifies the next phase: AI interpretation quality, social login, owner-only server storage, cross-device sync, privacy preprocessing, and current receipt UX preservation.

## Constraints

- Do not implement during ralplan.
- Preserve the current receipt UX structure for the first actual-service iteration.
- Never add finance/performance concepts: cost, amount, price, money, currency, total, score, points, rank, best day, worst day, streak, performance dashboard.
- AI must be suggestive, not judgmental.
- Remove direct identifying information before AI API calls while preserving relationship, situation, and emotional flow.
- Server-stored content must be owner-only.
- Technology choices may be recommended by Codex based on quality and maintainability.

## Unknowns And Follow-Ups

- Exact production domain and OAuth provider credentials are not available yet.
- Deletion/export/retention policies must be finalized before public launch.
- Whether to import existing localStorage entries automatically or offer explicit import needs implementation detail.
- Pricing/usage limits for AI calls need provider account context later.

## Likely Codebase Touchpoints

- `src/App.tsx`
- `src/types/diary.ts`
- `src/lib/storage.ts`
- `src/lib/interpretation.ts`
- `src/test/guardrails.test.ts`
- `src/components/*`
- `src/styles/receipt.css`
- New likely files: Supabase client, auth state, repository layer, AI adapter, privacy preprocessing utilities, Supabase migrations/functions, integration tests.
