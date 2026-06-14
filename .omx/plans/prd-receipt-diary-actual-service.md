# PRD: Receipt Diary Actual Service

Date: 2026-06-14
Status: Planning artifact for `$ralph`
Related plan: `.omx/plans/receipt-diary-actual-service-design.md`
Source spec: `.omx/specs/deep-interview-actual-service-ai-storage-privacy-login.md`

## Product Goal

Move Receipt Diary from a local-first MVP to a first actual-service version where users can sign in, sync their diary records across devices, and receive real AI interpretations that help them notice hidden value in their day.

## Product Intent

Receipt Diary is a reflective diary app. The receipt is a visual metaphor for rereading an ordinary day with care. The product should not evaluate, measure, compare, or optimize the user's day.

The core service quality is interpretation quality: the user should feel that the app noticed a value they had missed.

## In Scope

- Social login, starting with Google.
- Owner-only server storage.
- Cross-device synchronization after login.
- Migration/import from localStorage MVP entries.
- Server-side AI interpretation.
- Privacy preprocessing before any AI call.
- Current receipt result structure: day summary phrase, one-line summary, hidden values, metadata, original diary access.
- Receipt-surface loading, retry, auth, and error states.
- Deployment docs for frontend, Supabase, OAuth, and secrets.

## Out Of Scope

- Email/password login.
- Social feeds, sharing, or comparison.
- Public profiles.
- Changing the core receipt UX before user feedback.
- Storing sanitized diary text by default.
- Sending raw diary text to any AI model.

## Hard Product Constraints

Do not introduce finance or performance semantics in UI, data model, copy, tests, component names, class names, prompts, AI output, or analytics naming except when documenting forbidden constraints.

Forbidden concepts:

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

## User Stories

### US-001: Social Login

As a user, I want to sign in with a social account so that my diary records can be tied to my account without creating a password.

Acceptance criteria:

- Google login works in local and deployed environments.
- Logout works.
- Auth state persists across refresh.
- Login UI appears inside the receipt surface.

### US-002: Owner-Only Diary Storage

As a user, I want my diary records stored privately so that only I can read and manage them.

Acceptance criteria:

- Authenticated user can create/read/update/delete only their own entries.
- A second authenticated user cannot access another user's entries through client queries or function calls.
- RLS is enabled on all user-owned tables.
- Private profile rows are only visible to their owner.

### US-003: Cross-Device Sync

As a user, I want my diary records to appear after login on another device so that the diary is not trapped in one browser.

Acceptance criteria:

- Server entries load after login.
- New entries are persisted remotely.
- Local MVP entries import idempotently through `local_id`.
- Legacy mock receipts are not treated as production AI interpretations.

### US-004: Real AI Interpretation

As a user, I want the app to interpret my diary with care so that I can notice hidden value in the day.

Acceptance criteria:

- AI call happens only on the server side.
- Browser never sees OpenAI secrets.
- AI output follows the required schema.
- Output remains suggestive, grounded, and non-judgmental.
- Forbidden concept guardrails pass.

### US-005: Privacy Preprocessing

As a user, I want direct identifiers removed before AI processing so that interpretation quality is balanced with privacy.

Acceptance criteria:

- Raw diary text is never sent to any AI model.
- Direct identifiers are replaced before AI calls.
- Relationship, situation, and emotional flow are preserved when possible.
- Redaction metadata is stored without storing sanitized diary text by default.

### US-006: Failure And Retry States

As a user, I want failed sync or AI interpretation to be clear and recoverable inside the receipt UI.

Acceptance criteria:

- Save failure shows an in-receipt retry state.
- AI failure keeps the diary entry saved.
- Retry can regenerate interpretation.
- Refresh does not lose saved remote data.

## Success Criteria

- `npm run test`, `npm run lint`, and `npm run build` pass.
- Supabase migrations apply locally.
- Two-user RLS tests pass.
- Edge Function auth and payload rejection tests pass.
- AI schema/privacy guardrail tests pass.
- MVP receipt UX structure remains intact.

## Open Product Follow-Ups

- Public launch requires final deletion/export/retention policy.
- Apple login can be considered after Google login is stable.
- OpenAI modified retention controls or zero data retention can be evaluated if usage sensitivity warrants it.
