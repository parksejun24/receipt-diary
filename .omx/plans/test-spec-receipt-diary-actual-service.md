# Test Spec: Receipt Diary Actual Service

Date: 2026-06-14
Status: Planning artifact for `$ralph`
Related plan: `.omx/plans/receipt-diary-actual-service-design.md`
Related PRD: `.omx/plans/prd-receipt-diary-actual-service.md`

## Verification Layers

### Baseline

Commands:

```bash
npm run test
npm run lint
npm run build
```

Expected result:

- Existing MVP tests remain green.
- Forbidden-language guardrails remain green.
- Production build succeeds.

### Supabase Local

Commands to add/use:

```bash
npx supabase start
npx supabase db reset
npm run test:supabase
```

Expected result:

- Migrations apply from a clean local database.
- Required tables, indexes, grants, and RLS policies exist.
- `profiles` is private and owner-only.
- `diary_entries`, `diary_interpretations`, and `ai_processing_events` enforce owner-only access.

### RLS And Cross-User Isolation

Required tests:

- User A can create/read/update/delete User A diary rows.
- User B cannot read/update/delete User A diary rows.
- User B cannot read/update User A profile.
- User B cannot read User A interpretations.
- Insert/update with mismatched `user_id` is rejected.
- Interpretation row cannot be inserted for a diary entry owned by another user.

### Privacy Preprocessing

Required tests:

- Names are replaced with contextual roles where detectable.
- Emails, phone numbers, URLs, handles, and address-like strings are removed or replaced.
- Company/place identifiers are generalized where detectable.
- Relationship, situation, and emotional flow remain coherent.
- Raw diary text is not passed to any AI adapter test double.
- Sanitized diary text is not persisted by default.

### Edge Function

Commands to add/use:

```bash
npx supabase functions serve interpret-diary --env-file supabase/.env.local
npm run test:functions
```

Required tests:

- Unauthenticated invocation is rejected.
- Authenticated invocation with owned `diaryEntryId` succeeds.
- Authenticated invocation with another user's `diaryEntryId` is rejected.
- Payload containing raw `body`, `userId`, generated interpretation fields, or provider/model override fields is rejected.
- Function uses sanitized coherent text for AI adapter input.
- Function validates structured AI output before saving.
- Function records processing metadata without diary body, sanitized body, or AI output text in logs.

### Frontend Integration

Required tests:

- Auth state loads and updates UI.
- Login/logout controls stay inside the receipt surface.
- Anonymous local entry imports after login.
- Imported local entry uses legacy `id` as remote `local_id`.
- Legacy mock receipt is not treated as production AI output.
- AI pending/failure/retry states render inside the receipt surface.
- Archive/detail/original diary flows still work.

### E2E Smoke

Recommended browser checks:

- Mobile viewport: write local diary, login, sync, receive interpretation, open original diary.
- Desktop viewport: archive/detail navigation after refresh.
- Network failure: save/AI failure state and retry.
- Second account: verify no cross-user data appears.

## Required Final Evidence

Before implementation can be called complete:

- `npm run test`: pass.
- `npm run lint`: pass.
- `npm run build`: pass.
- `npx supabase db reset`: pass in local setup, or documented blocker if Supabase CLI/env is unavailable.
- `npm run test:supabase`: pass.
- `npm run test:functions`: pass.
- Manual or automated smoke test evidence for login/sync/interpretation flow.
- No source violations of forbidden product concepts.
