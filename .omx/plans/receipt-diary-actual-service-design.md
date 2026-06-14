# Receipt Diary Actual Service Design Plan

Date: 2026-06-14
Workflow: `$ralplan`
Status: Approved by Architect and Critic
Context snapshot: `.omx/context/receipt-diary-actual-service-design-20260614T003900Z.md`

## Requirements Summary

Turn the completed local-first Receipt Diary MVP into a first actual-service version with real AI interpretation, social login, owner-only server storage, cross-device sync, privacy preprocessing, schema migration, deployment, security tests, and rollout controls.

This plan does not authorize implementation inside `$ralplan`. It is a handoff artifact for `$ralph` or `$team`.

Current repo evidence:

- The app is Vite + React + TypeScript with `dev`, `build`, `lint`, and `test` scripts in `package.json:6`.
- MVP status says entries are currently local-only under `receipt-diary.entries.v1`, with no backend, login, cloud sync, or real AI API in `docs/PROJECT_STATUS.md:72`.
- `src/App.tsx:24` creates a diary entry, calls `createMockInterpretation`, and writes via `prependDiaryEntry`, so this is the primary seam to replace with an async service flow.
- `src/types/diary.ts:1` defines the current local data shape.
- `src/lib/storage.ts:3` defines the localStorage key and `src/lib/storage.ts:25` owns local loading.
- `src/lib/interpretation.ts:31` owns the mock interpretation adapter.
- `src/test/guardrails.test.ts:6` blocks forbidden finance/performance language in source.
- The actual-service spec requires social login, owner-only server storage, cross-device sync, server-side AI, and privacy preprocessing in `.omx/specs/deep-interview-actual-service-ai-storage-privacy-login.md:51`.
- The receipt UX must stay visually restrained and content-focused per `docs/design/REFERENCE_DESIGN.md:107`.

## RALPLAN-DR Summary

### Principles

1. Preserve the receipt as a reflective metaphor, not a finance or performance object.
2. Keep AI interpretation suggestive, grounded, and schema-validated.
3. Enforce owner-only access at the database/API boundary, not only in React state.
4. Send only sanitized, coherent text to the AI provider.
5. Keep the first service architecture small enough to ship, verify, and maintain.

### Decision Drivers

1. Privacy-sensitive diary data requires strong authorization, server-side AI secrets, and testable redaction.
2. The current Vite/React MVP should be preserved where possible to avoid redesign churn.
3. The service needs a maintainable path from localStorage MVP data to authenticated cloud storage.

### Viable Options

#### Option A: Supabase + Supabase Edge Functions + OpenAI + Vercel

Approach: Keep Vite/React frontend, add Supabase Auth/Postgres/RLS for social login and owner-only storage, call OpenAI from a Supabase Edge Function, deploy frontend to Vercel.

Pros:

- Supabase Auth integrates with Postgres RLS, matching the owner-only requirement.
- Supabase supports social login and OAuth flows through `supabase-js`.
- Edge Functions keep OpenAI keys server-side while staying close to the database/auth context.
- Vercel supports Vite deployments with minimal frontend migration.
- Local Supabase migrations give a versioned path for schema changes.

Cons:

- Edge Functions use Deno conventions, which are new compared with the current Node/Vite-only repo.
- RLS policy mistakes can silently break sync or leak data unless tested thoroughly.
- Vercel and Supabase split deployment/observability across two dashboards.

#### Option B: Next.js + Supabase + OpenAI

Approach: Migrate the app from Vite to Next.js, use route handlers/server actions for AI calls, and use Supabase for Auth/Postgres/RLS.

Pros:

- One frontend/server framework can host UI and API routes together.
- Server routes can run OpenAI calls without Supabase Edge Function Deno constraints.
- Next.js can improve future SSR/SEO options if the app later needs a public marketing layer.

Cons:

- Framework migration creates avoidable churn before the service concept is validated.
- Current Vite app structure and tests are already sufficient for a private diary app.
- More routing/build changes increase risk around the polished receipt UX.

#### Option C: Custom or Next.js BFF + Supabase/Postgres + OpenAI

Approach: Keep Supabase/Postgres as the database but do not expose diary tables through the browser Data API. Route all diary writes, reads, interpretation calls, logs, privacy preprocessing, and authorization checks through a centralized Node server boundary.

Pros:

- Centralizes auth checks, privacy preprocessing, AI calls, logging, and rate limiting in one runtime.
- Reduces reliance on perfect client-side Data API usage and RLS policy coverage.
- Keeps Edge Function Deno code out of a Node/Vite repo.

Cons:

- Adds a custom backend or framework migration before the first actual-service validation.
- Duplicates some value Supabase already provides through Auth, Postgres, RLS, and Functions.
- Increases deployment and operational surface.

#### Option D: Firebase Auth/Firestore/Cloud Functions + OpenAI

Approach: Use Firebase social auth, Firestore security rules, Cloud Functions for AI calls, and Firebase/Vercel hosting.

Pros:

- Mature social auth and client SDK.
- Good real-time sync primitives.
- Cloud Functions can hold OpenAI secrets.
- Firebase Security Rules can use Authentication to grant user-based permissions, and emulator tests can validate rules before deployment.

Cons:

- Firestore document modeling is less natural for relational user-owned diary/interpretation records.
- Security rules require separate mental model from SQL/RLS and are easier to under-test in a React-only repo.
- Local migration/versioning story is weaker than SQL migrations for this project.

### Recommended Option

Choose Option A: Supabase + Supabase Edge Functions + OpenAI + Vercel.

This is the best fit because it preserves the current Vite/React app, adds social login and owner-only storage through a single backend platform, supports SQL migration files, and keeps AI secrets behind a server-side function. The choice is valid only if RLS, grants, function auth, and service-key boundaries are implemented and tested as first-class requirements.

## Deliberate Pre-Mortem

1. **Cross-user data exposure:** A table, view, function, or query bypasses owner filtering.
   Mitigation: enable RLS on every user-owned table, write explicit `auth.uid() = user_id` policies, test with two users, and avoid service-role reads in user-facing functions unless the function re-checks ownership.

2. **AI output becomes too confident or invented:** Real model output drifts into diagnosis, advice, or unsupported interpretation.
   Mitigation: use strict structured output, prompt versioning, server-side schema validation, forbidden-language guardrails, and tests with difficult diary fixtures.

3. **Privacy preprocessing damages interpretation quality:** Redaction removes the emotional context needed to find hidden value.
   Mitigation: implement a two-step privacy pipeline: direct identifier replacement first, coherent rewrite second, then regression fixtures comparing preserved relationship/situation/emotional flow.

## External Documentation Basis

- Supabase RLS docs: RLS should be enabled for tables in exposed schemas, and policies determine access. Source: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase API security docs: grants and RLS work together; grants determine which roles can reach database objects, while RLS determines row access. Source: https://supabase.com/docs/guides/api/securing-your-api
- Supabase secure-data docs: browser clients can use publishable/anon keys safely only with RLS and least-privilege grants. Source: https://supabase.com/docs/guides/database/secure-data
- Supabase Auth docs: Auth integrates with database features and RLS for authorization. Source: https://supabase.com/docs/guides/auth
- Supabase social login docs: OAuth supports logging in through third-party providers without sharing passwords. Source: https://supabase.com/docs/guides/auth/social-login
- Supabase `signInWithOAuth` docs: `supabase.auth.signInWithOAuth` supports third-party provider login and PKCE. Source: https://supabase.com/docs/reference/javascript/auth-signinwithoauth
- Supabase Edge Function auth docs: signed-in invocations can use caller JWTs and user-scoped clients. Source: https://supabase.com/docs/guides/functions/auth
- Supabase Edge Function secrets docs: browser-safe anon keys differ from server-only secret/service keys. Source: https://supabase.com/docs/guides/functions/secrets
- Supabase migrations/local development docs: schema changes can be captured in migration files and tested locally. Source: https://supabase.com/docs/guides/deployment/database-migrations
- OpenAI Structured Outputs docs: model responses can adhere to a supplied JSON Schema. Source: https://developers.openai.com/api/docs/guides/structured-outputs
- OpenAI data controls docs: API abuse-monitoring logs may retain customer content for up to 30 days by default unless modified retention controls apply. Source: https://developers.openai.com/api/docs/guides/your-data
- Vercel Vite docs: Vercel supports Vite frontend deployment. Source: https://vercel.com/docs/frameworks/frontend/vite
- Vercel environment variables docs: environment-specific configuration is managed outside source code and encrypted at rest. Source: https://vercel.com/docs/environment-variables
- Firebase Security Rules docs: rules can leverage Authentication for user-based permissions and should be tested before deployment. Source: https://firebase.google.com/docs/rules

## Recommended Architecture

### Frontend

Keep Vite + React + TypeScript.

Add frontend layers:

- `src/lib/supabaseClient.ts`: browser client using only public Supabase URL and anon key.
- `src/lib/auth.ts`: auth state helpers and social login/logout commands.
- `src/lib/diaryRepository.ts`: storage abstraction that can read/write local and remote entries.
- `src/lib/sync.ts`: localStorage import and authenticated sync orchestration.
- `src/lib/interpretationClient.ts`: client wrapper that invokes the server interpretation function.
- `src/lib/privacyPreview.ts` only if the UI later shows a user-facing privacy explanation; actual preprocessing remains server-side.

Keep UI components mostly intact:

- `src/App.tsx:24` should move from synchronous `createMockInterpretation` + `prependDiaryEntry` to async create/save/interpret flow.
- `src/components/DiaryWriter.tsx` should add pending/error states without leaving the receipt surface.
- `src/components/ArchiveReceipt.tsx`, `ReceiptDetail.tsx`, and `OriginalDiaryView.tsx` should consume the same domain shape, not Supabase row objects directly.

### Backend

Add Supabase project files:

```text
supabase/
  config.toml
  migrations/
    0001_receipt_diary_schema.sql
    0002_receipt_diary_policies.sql
  functions/
    interpret-diary/
      index.ts
      prompt.ts
      schema.ts
      privacy.ts
```

Use Supabase Edge Function `interpret-diary` for:

1. Require JWT verification for the function.
2. Derive user identity from the verified JWT, never from client-supplied `user_id`.
3. Accept only `diary_entry_id` and optional idempotency metadata from the client.
4. Do not accept client-supplied diary body, interpretation text, owner id, or sequence fields.
5. Use a user-scoped Supabase client first to load the requested diary entry under the caller's RLS policies.
6. Fail closed if the entry is absent, soft-deleted, or not owned by the caller.
7. Preprocess the diary body into sanitized coherent text.
8. Call OpenAI Responses API with Structured Outputs.
9. Validate output against schema and guardrails.
10. Save the interpretation with prompt/schema/model metadata.
11. Use a service-role client only after ownership is proven, and only for the minimum writes that cannot be done safely under the user-scoped client.
12. Return the saved interpretation to the client.

### AI Provider

Use OpenAI for first implementation.

Reasoning:

- The user wants high interpretation quality.
- Structured Outputs reduce parsing risk.
- Data controls documentation is clear enough to inform privacy copy and retention follow-ups.

Execution rule:

- The browser never calls OpenAI.
- The browser never receives the AI API key.
- The server function receives only the diary entry id, not raw diary text from the client after save.

## Data Model

### Domain Types

Keep the frontend domain shape close to `src/types/diary.ts:1`, but add remote metadata:

```ts
type DiaryEntry = {
  id: string;
  userId: string;
  localId?: string;
  date: string;
  body: string;
  receipt: ReceiptInterpretation | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  syncState?: "local" | "syncing" | "synced" | "failed";
};

type ReceiptInterpretation = {
  id: string;
  diaryEntryId: string;
  sequenceNumber: number;
  oneLineSummary: string;
  daySummaryPhrase: string;
  hiddenValues: HiddenValue[];
  generatedAt: string;
  promptVersion: string;
  schemaVersion: string;
  model: string;
};
```

Use `receipt` in TypeScript only as the established metaphor. Do not add finance/performance semantics.

### Supabase Tables

`profiles`

- `id uuid primary key references auth.users(id) on delete cascade`
- `display_name text`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Profiles are private in the first actual-service version. No public profile fields are required for this diary product.

`diary_entries`

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `local_id text`
- `entry_date date not null`
- `body text not null`
- `sequence_number integer not null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `deleted_at timestamptz`
- unique index on `(user_id, local_id)` where `local_id is not null`

`diary_interpretations`

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `diary_entry_id uuid not null references diary_entries(id) on delete cascade`
- `one_line_summary text not null`
- `day_summary_phrase text not null`
- `hidden_values jsonb not null`
- `model text not null`
- `prompt_version text not null`
- `schema_version text not null`
- `generated_at timestamptz not null default now()`
- unique index on `(diary_entry_id, prompt_version, schema_version)`

`ai_processing_events`

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `diary_entry_id uuid not null references diary_entries(id) on delete cascade`
- `interpretation_id uuid references diary_interpretations(id) on delete set null`
- `provider text not null`
- `model text not null`
- `prompt_version text not null`
- `schema_version text not null`
- `redaction_version text not null`
- `status text not null check (status in ('started', 'succeeded', 'failed'))`
- `error_code text`
- `created_at timestamptz not null default now()`

Do not persist sanitized diary text by default. Persisting transformed text increases sensitive-data surface. If debugging requires it, add a short-lived debug table later behind an explicit retention decision.

### RLS Policy Shape

For `profiles`:

- Select: `auth.uid() = id`
- Insert: `auth.uid() = id`
- Update: `auth.uid() = id`
- Delete: no direct delete policy in first version; account deletion should be handled through an explicit account-deletion flow later.

For tables with `user_id`:

- Select: `auth.uid() = user_id`
- Insert: `auth.uid() = user_id`
- Update: `auth.uid() = user_id`
- Delete or soft-delete update: `auth.uid() = user_id`

For interpretations, also ensure the linked diary entry belongs to the same user.

Migration requirements:

```sql
alter table public.profiles enable row level security;
alter table public.diary_entries enable row level security;
alter table public.diary_interpretations enable row level security;
alter table public.ai_processing_events enable row level security;

grant select, insert, update, delete on public.diary_entries to authenticated;
grant select, insert, update, delete on public.diary_interpretations to authenticated;
grant select, insert, update on public.ai_processing_events to authenticated;
grant select, insert, update on public.profiles to authenticated;
revoke all on public.diary_entries from anon;
revoke all on public.diary_interpretations from anon;
revoke all on public.ai_processing_events from anon;
revoke all on public.profiles from anon;

create policy profiles_select_own
  on public.profiles
  for select
  using (auth.uid() = id);

create policy profiles_insert_own
  on public.profiles
  for insert
  with check (auth.uid() = id);

create policy profiles_update_own
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy diary_entries_select_own
  on public.diary_entries
  for select
  using (auth.uid() = user_id);

create policy diary_entries_insert_own
  on public.diary_entries
  for insert
  with check (auth.uid() = user_id);

create policy diary_entries_update_own
  on public.diary_entries
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy diary_entries_delete_own
  on public.diary_entries
  for delete
  using (auth.uid() = user_id);
```

Interpretation policies must include both direct `user_id` checks and a database-level consistency constraint. The migration should enforce that `diary_interpretations.diary_entry_id` belongs to the same `user_id` through either a trigger or a constrained insertion function. Do not rely only on the client to keep those fields aligned.

Database functions exposed through the Data API require explicit grants and execute control. If a function can bypass RLS or mutate user-owned data, it must verify ownership internally and have direct tests for cross-user rejection.

## Edge Function Auth Contract

`interpret-diary` must follow this contract:

- Function JWT verification is enabled.
- Caller identity comes from the verified Supabase session.
- Client payload schema allows only `diaryEntryId` and optional request idempotency metadata.
- The function rejects any payload containing `body`, `userId`, `receipt`, generated interpretation fields, or provider/model override fields.
- The first database read uses the caller's auth context, so RLS must approve the entry read.
- If service-role access is needed for insertion or audit writes, create it only after the user-scoped ownership lookup succeeds.
- Any service-role helper must require `(userId, diaryEntryId)` parameters derived server-side, not from the client payload.
- Tests must include a malicious authenticated user invoking the function with another user's `diaryEntryId`.

## Privacy Preprocessing Pipeline

Run inside `supabase/functions/interpret-diary/privacy.ts`.

Pipeline:

1. Normalize whitespace and segment the diary into paragraphs/sentences.
2. Detect direct identifiers:
   - Korean/English names when obvious from particles or known patterns.
   - Email, phone, URL, handle, address-like strings.
   - Exact workplace/school/place names when syntactically identifiable.
3. Replace direct identifiers with contextual roles:
   - Person names -> `친구`, `동료`, `가족`, `지인`, or `상대방` based on local context.
   - Company/place names -> `회사`, `가게`, `학교`, `장소`, or `공간`.
4. Preserve relationship, situation, and emotional flow.
5. Produce a coherent sanitized text for AI interpretation.
6. Return a redaction metadata summary without storing the sanitized body:
   - categories touched
   - replacement counts
   - redaction version

First implementation must use deterministic redaction before any AI call. Raw diary text must not be sent to any AI model, including a future rewrite model. A model-assisted coherent rewrite is allowed only after deterministic redaction and only if its input is already sanitized.

## AI Interpretation Contract

Use OpenAI Structured Outputs with a strict schema:

```ts
type AiInterpretationResponse = {
  daySummaryPhrase: string;
  oneLineSummary: string;
  hiddenValues: Array<{
    text: string;
    evidence?: string;
  }>;
};
```

Prompt requirements:

- Interpret only the provided sanitized diary text.
- Use Korean.
- Use suggestive wording.
- Do not diagnose, prescribe, moralize, or invent events.
- Acknowledge hard or ordinary days without forced positivity.
- Avoid all forbidden finance/performance concepts.
- Hidden values should be grounded in specific diary details.

Server-side validation:

- Schema validation passes.
- Hidden values length is within allowed bounds.
- Forbidden-language scan passes.
- Suggestive-tone check passes for at least the main summary and hidden values.
- Evidence, if present, must be a short phrase from sanitized text or omitted.

Fallback:

- If AI fails, save the diary entry and show an in-receipt retry state.
- Keep `createMockInterpretation` for tests and local dev fallback, but do not use it as production AI.

## Auth And Sync Flow

### User Flow

1. User opens app.
2. App checks Supabase auth session.
3. If anonymous:
   - User can write locally or sign in.
   - If local entries exist, show a receipt-style sign-in prompt that says syncing will make records available across devices.
4. User signs in with Google first. Add Apple later if the deployment target includes iOS-heavy usage.
5. After sign-in:
   - Fetch server entries for user.
   - Import unsynced localStorage entries with `local_id` idempotency.
   - Merge local + server state.
   - Clear or mark imported local entries only after server write success.
6. New diary entry:
   - Save diary row.
   - Invoke `interpret-diary`.
   - Update UI with saved interpretation.

### Sync Rules

- Server is source of truth after login.
- LocalStorage remains a temporary offline/import buffer, not the canonical store.
- Import should be idempotent via `local_id`.
- Conflict policy for first service version: latest `updated_at` wins for edits, but entry editing can be deferred if not already in MVP.
- If network fails, keep the entry local with `syncState: "failed"` and provide retry inside the receipt surface.

### Legacy LocalStorage Import Contract

Legacy source:

- Key: `receipt-diary.entries.v1`
- Shape: existing `DiaryEntry` from `src/types/diary.ts:1`
- Legacy `id` maps to remote `local_id`.
- Legacy `body`, `date`, `createdAt`, and `updatedAt` are preserved.

Import behavior:

1. Parse localStorage with the existing tolerant loader behavior from `src/lib/storage.ts:25`.
2. For each valid legacy entry, insert a remote `diary_entries` row with `local_id = legacy.id`.
3. Do not preserve the mock receipt as a production interpretation by default.
4. Mark imported rows as needing server interpretation.
5. Queue interpretation generation after the diary row sync succeeds.
6. Keep a local backup key, `receipt-diary.entries.backup.v1`, until all imports and interpretations complete.
7. Clear or mark the legacy key as imported only after every row is synced or explicitly skipped.
8. Corrupted/invalid entries remain ignored by the tolerant loader, but import QA should verify that the app does not crash and that valid entries still import.

Rationale: mock receipts were useful for MVP validation, but actual service quality depends on real AI interpretation. Preserving old mock interpretations as production output would blur the quality boundary.

## Schema Migration Strategy

First implementation milestone must stop at schema/RLS/function contracts plus service-specific test scripts before broad UI integration. This prevents auth/storage/security defects from being hidden behind frontend work.

1. Add Supabase CLI and project scaffolding.
2. Create SQL migrations for tables, indexes, triggers, and RLS policies.
3. Generate TypeScript DB types if using Supabase type generation.
4. Add repository abstractions while keeping existing local tests green.
5. Add localStorage import path from `receipt-diary.entries.v1`.
6. Implement remote write/read behind feature flag or environment availability.
7. Keep rollback simple: if Supabase env vars are absent, app can run in local/mock mode for development.

## Deployment Strategy

### Frontend

Deploy Vite app on Vercel.

Required Vercel env vars:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Only public browser-safe values use the `VITE_` prefix.

### Supabase

Deploy migrations and Edge Function through Supabase CLI.

Required Supabase function secrets:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- optional `INTERPRETATION_PROMPT_VERSION`

Do not expose server-side secrets to Vercel frontend env.

### OAuth

Start with Google social login.

Configuration requirements:

- Local callback URLs for development.
- Vercel preview/production URLs.
- Supabase OAuth callback URL.
- Production domain once chosen.

## Rollout Strategy

1. **Local service dev:** Supabase local stack, migrations, function tests, mock OpenAI mode.
2. **Private preview:** real Supabase project, Google login, restricted testers, OpenAI key in function secrets.
3. **Data safety pass:** verify owner-only access, deletion behavior, export behavior decision, privacy copy.
4. **Soft launch:** production Vercel deployment with limited invite distribution.
5. **Post-launch monitoring:** observe function errors, auth failures, AI validation failures, and sync retry rates without storing diary content in logs.

## Acceptance Criteria

Planning acceptance:

- Recommended stack is documented with alternatives and tradeoffs.
- Data model and RLS policy shape are specified.
- AI input privacy pipeline is specified.
- AI output schema and guardrails are specified.
- LocalStorage-to-server migration path is specified.
- Deployment and env var boundaries are specified.
- Security and privacy test strategy is specified.
- `$ralph` handoff prompt is included.

Implementation acceptance:

- User can sign in with Google social login.
- After login, entries persist to owner-only server storage.
- The same user sees their entries across devices.
- A second user cannot access the first user's entries through client queries or direct API calls.
- New entries create server-backed AI interpretations.
- The AI function sends sanitized coherent text to OpenAI, not raw diary text.
- The receipt result still shows day summary phrase, one-line summary, hidden values, metadata, and original diary access.
- Existing forbidden-language guardrails remain green.
- `npm run test`, `npm run lint`, and `npm run build` pass.

## Expanded Test Plan

### Unit Tests

- Privacy preprocessing replaces direct identifiers while preserving context.
- AI response schema parser rejects malformed output.
- Forbidden-language scan rejects blocked finance/performance concepts.
- Suggestive-tone validator rejects overconfident phrasing.
- Repository mappers convert Supabase rows to domain types.
- LocalStorage import normalizes legacy `receipt-diary.entries.v1` entries.

### Integration Tests

- Authenticated diary CRUD works against local Supabase.
- RLS prevents cross-user select/update/delete.
- Private profile RLS prevents cross-user profile reads/updates.
- `interpret-diary` rejects unauthenticated requests.
- `interpret-diary` rejects a diary entry id owned by another user.
- `interpret-diary` rejects payloads containing body/user/interpretation override fields.
- `interpret-diary` saves interpretation only for the owner.
- Local import is idempotent by `local_id`.

Expected Supabase verification commands, adjusted as needed for final scripts:

```bash
npx supabase start
npx supabase db reset
npx supabase functions serve interpret-diary --env-file supabase/.env.local
npm run test -- --run src/lib src/test
npm run test:supabase
npm run test:functions
```

If `test:supabase` or `test:functions` do not exist yet, `$ralph` must add them before claiming service verification.

### E2E Tests

- Anonymous user writes a local entry, signs in, and sees it synced.
- Authenticated user writes an entry and receives a receipt interpretation.
- User refreshes and sees server-backed archive.
- AI unavailable state appears inside the receipt surface and retry works.
- Mobile viewport has no clipped receipt controls.

### Observability Checks

- Edge Function logs include request id, user id hash or internal id, status, model, prompt/schema version, and error code.
- Logs do not include diary body, sanitized body, or AI output text.
- AI validation failure rate is visible.
- Sync/import failures are visible without exposing diary content.

## Risks And Mitigations

| Risk | Mitigation |
| --- | --- |
| RLS policy leak | Write two-user integration tests before UI polish. |
| AI output drift | Structured Outputs, schema validation, prompt versioning, guardrail tests. |
| Privacy preprocessing too destructive | Fixture tests for relationship/situation/emotional-flow preservation. |
| OAuth callback misconfiguration | Document local/preview/production redirect URLs before deployment. |
| Local import duplication | Use `local_id` idempotency and import ledger state. |
| UI becomes generic auth app | Keep auth/sync states inside receipt surface and preserve design guide priorities. |
| Sensitive logs | Ban diary body/sanitized body/AI output from logs and test log helpers where feasible. |

## ADR

### Decision

Use Supabase Auth/Postgres/RLS/Edge Functions, OpenAI Structured Outputs, and Vercel for the first actual-service implementation.

### Drivers

- Owner-only diary storage is mandatory.
- AI provider secrets must stay server-side.
- The existing Vite/React MVP should remain the base.
- Privacy preprocessing must be independently testable.
- Schema changes should be versioned.

### Alternatives Considered

- Next.js + Supabase + OpenAI: rejected for first iteration because framework migration adds risk without solving a current product need.
- Custom or Next.js BFF + Supabase/Postgres + OpenAI: rejected for first iteration because centralizing all access through one server boundary is security-attractive but adds backend/runtime churn before the actual-service concept is validated.
- Firebase Auth/Firestore/Cloud Functions + OpenAI: rejected because its auth/rules/emulator story is strong, but relational records, SQL migrations, and RLS better match this project's diary-entry, interpretation, and audit metadata.
- Fully custom backend: rejected because it increases operational surface before interpretation-quality validation.

### Why Chosen

Supabase gives Auth, Postgres, RLS, local migrations, and Edge Functions in one platform. That directly matches the service requirements while preserving the current Vite frontend. The strongest objection is that a centralized BFF would reduce reliance on RLS/function discipline, but the first service version benefits more from preserving the current app and using explicit RLS/function tests. OpenAI Structured Outputs improves interpretation response reliability. Vercel is a low-friction Vite frontend host.

### Consequences

- The repo will gain Supabase CLI/project files and Deno Edge Function code.
- Tests must include database policy checks, not only React/Vitest tests.
- The team must manage OAuth redirect configuration for local, preview, and production.
- Privacy and AI behavior become versioned backend concerns.

### Follow-Ups

- Decide deletion/export/retention product policy before public production launch.
- Decide whether to add Apple login after Google login.
- Decide whether to apply for OpenAI modified retention controls or zero data retention if usage becomes sensitive enough.
- Decide whether to store any sanitized text for debugging; default is no.

## Available-Agent-Types Roster

Known useful roles for follow-up execution:

- `architect`: architecture and security boundary review.
- `dependency-expert`: dependency and SDK setup review.
- `executor`: implementation of frontend/backend slices.
- `security-reviewer`: RLS, auth, privacy, and secret handling review.
- `test-engineer`: unit/integration/e2e test plan and test implementation.
- `verifier`: final evidence pass.
- `designer`: receipt-surface auth/sync/error-state UX polish.
- `code-reviewer`: final comprehensive review.
- `build-fixer`: build/type/lint failure repair.
- `git-master`: commit structure and branch hygiene.

## Follow-Up Staffing Guidance

### `$ralph` Sequential Execution

Recommended for controlled implementation because auth/security/data migration is high-risk.

Suggested lanes inside Ralph:

- Architecture lane: `architect`, high reasoning, validate Supabase schema/RLS/function boundaries before code.
- Implementation lane: `executor`, medium reasoning, implement in small commits.
- Security lane: `security-reviewer`, medium reasoning, review RLS and secret handling.
- Test lane: `test-engineer`, medium reasoning, add policy/function/UI tests.
- Final sign-off lane: `verifier` or `code-reviewer`, high reasoning.

### `$team` Parallel Execution

Use only after a stable schema/API contract exists.

Suggested team split:

- Worker 1: Supabase schema, migrations, RLS policies.
- Worker 2: Edge Function privacy preprocessing and OpenAI adapter.
- Worker 3: Frontend auth/repository/sync integration.
- Worker 4: Tests and verification harness.
- Worker 5: Receipt-surface UX states for auth/sync/error.

Team verification path:

1. Team proves migrations apply locally.
2. Team proves two-user RLS tests pass.
3. Team proves AI function schema and privacy tests pass.
4. Team proves React tests/lint/build pass.
5. Ralph or verifier does final integrated smoke test and security review.

## Launch Hints

Ralph path:

```text
$ralph AGENTS.md, docs/PROJECT_STATUS.md, docs/design/REFERENCE_DESIGN.md, .omx/specs/deep-interview-actual-service-ai-storage-privacy-login.md, .omx/plans/receipt-diary-actual-service-design.md, .omx/plans/prd-receipt-diary-actual-service.md, and .omx/plans/test-spec-receipt-diary-actual-service.md를 최우선 기준으로 Receipt Diary 실제 서비스화 구현을 진행해줘. main에서 직접 작업하지 말고 feat/actual-service-ai-sync 브랜치를 사용해. 구현 시작 전에 actual-service PRD/test-spec가 MVP용 파일이 아니라 현재 서비스화 범위를 설명하는지 확인해. 구현 순서는 baseline verification → Supabase project/migrations/RLS → auth client/social login → repository abstraction/local import → privacy preprocessing → Edge Function OpenAI Structured Outputs adapter → frontend async interpretation/sync flow → receipt-surface auth/error states → security/guardrail tests → deployment docs → final QA 순서로 진행해. 각 단계마다 변경 범위, 완료 조건, 검증 결과를 .omx/ultragoal ledger에 기록해. 금액/점수/총합/순위/베스트·워스트/스트릭/performance dashboard 개념은 절대 추가하지 마. AI 해석은 판단이 아니라 조심스러운 제안이어야 하며, AI API에는 직접 식별 정보를 제거하되 관계/상황/감정 흐름을 보존한 텍스트만 전송해. 가능한 경우 npm run test, npm run lint, npm run build, npx supabase db reset, RLS two-user tests, and Edge Function invocation tests를 실행하고 실패하면 다음 단계로 넘어가지 말고 수정 후 재검증해. test:supabase/test:functions 스크립트가 없다면 먼저 추가해. 안정 지점마다 Lore Commit Protocol에 맞춰 커밋하고, push/PR은 사용자 지시 전까지 하지 마.
```

Team path:

```text
$team .omx/plans/receipt-diary-actual-service-design.md를 기준으로 Receipt Diary 실제 서비스화 구현을 병렬 진행해줘. schema/RLS, Edge Function+AI/privacy, frontend auth/sync, tests/verification, receipt UX states로 작업을 분리하고 shared contracts를 먼저 고정해. 모든 worker는 AGENTS.md와 금지 개념/AI suggestive wording/privacy preprocessing 제약을 준수해야 해. 팀 종료 전 migrations, RLS two-user tests, AI schema/privacy tests, npm test/lint/build evidence를 제출해.
```

## Changelog

- Initial draft created from repo inspection, deep-interview spec, and official documentation review.
- Architect iteration applied: explicit RLS/grants/function requirements, stricter Edge Function auth contract, no raw text to any AI model, legacy localStorage import contract, stronger alternatives, and direct official-source URLs.
- Critic iteration applied: private profile RLS/grants, actual-service PRD/test-spec references, concrete Supabase verification commands, and stronger Ralph handoff gate.
- Final Critic approval suggestion applied: first implementation milestone must focus on schema/RLS/function contracts and service-specific test scripts before broad UI integration.
