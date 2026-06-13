# Receipt Diary MVP Implementation Plan

Date: 2026-06-13
Status: Revised after deep-interview

## Requirements Summary

Receipt Diary is a personal journaling app that helps users find hidden value inside a day. The user writes a free-form diary entry. The app gently interprets the entry, proposes hidden values it noticed, and renders the result as a receipt-style record.

The receipt theme is a visual and structural metaphor. The MVP must not quantify a day with money, points, totals, rankings, streaks, or performance summaries.

## Product Principles

1. The app helps users look at life in detail.
2. Difficult days are not failures; they are part of the archive.
3. Hidden value must remain personal and open-ended.
4. AI interpretation is a suggestion, not a judgment.
5. The receipt visual should feel intimate, archival, and concrete.

## Non-goals

- No cost, amount, total, score, rank, best day, worst day, or streak.
- No fixed categories for hidden value.
- No emotional diagnosis or personality judgment.
- No monthly performance dashboard.
- No social comparison.

## Design Direction From Reference

- Main visual metaphor: a long torn paper receipt on a dark background.
- Typography: monospace or receipt-like font, strict alignment, dashed separators.
- Color: mostly black text on warm off-white paper, with subtle gray texture and shadows.
- Layout: mobile-first single receipt; desktop can use a two-column archive/detail layout.
- Receipt content should include metadata, summaries, and hidden value lines instead of price rows.

## Recommended Technical Approach

Use a client-first web MVP:

- Vite + React + TypeScript
- Plain CSS or CSS Modules for the receipt visual system
- LocalStorage persistence for MVP
- AI interpretation behind a small adapter so provider choice can change later

Reasoning: the concept needs the writing loop, interpretation quality, and receipt presentation validated before backend infrastructure. LocalStorage is enough for a prototype as long as the storage layer is isolated.

## MVP Data Model

```ts
type DiaryEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  body: string;
  receipt: ReceiptInterpretation | null;
  createdAt: string;
  updatedAt: string;
};

type ReceiptInterpretation = {
  id: string;
  diaryEntryId: string;
  sequenceNumber: number;
  oneLineSummary: string;
  daySummaryPhrase: string;
  hiddenValues: HiddenValue[];
  generatedAt: string;
};

type HiddenValue = {
  id: string;
  text: string;
  evidence?: string;
};
```

## AI Interpretation Contract

The AI should produce a receipt interpretation from the diary body.

Required output:

- `oneLineSummary`: one concise interpretation of the day.
- `daySummaryPhrase`: short receipt-style phrase for the day.
- `hiddenValues`: several open-ended value lines found in the diary.
- Optional `evidence`: short source phrase from the diary that supports the value.

Tone rules:

- Use suggestive wording: "제가 보기에는", "같아요", "보여요", "느껴져요".
- Do not define the user's day as objectively good or bad.
- Do not score, rank, diagnose, moralize, or assign monetary value.
- Do not force hidden values into predefined categories.

## Planned App Structure

```text
src/main.tsx
src/App.tsx
src/types/diary.ts
src/lib/storage.ts
src/lib/date.ts
src/lib/receiptNumber.ts
src/lib/interpretation.ts
src/data/sampleEntries.ts
src/components/ReceiptShell.tsx
src/components/ArchiveReceipt.tsx
src/components/ReceiptRow.tsx
src/components/ReceiptDetail.tsx
src/components/DiaryWriter.tsx
src/components/OriginalDiaryView.tsx
src/components/HiddenValueList.tsx
src/styles/receipt.css
```

## Screens

### 1. Diary Writer

Default creation screen.

Content:

- Today's date.
- Large free-form diary text area.
- Generate receipt action.
- Save draft behavior if simple to include.

Validation:

- Diary body is required.
- Empty or very short entries should ask for more detail before interpretation.

### 2. Receipt Result / Detail

Content:

- Header: `DIARY RECEIPT`
- Metadata: date, written time, diary sequence number.
- One-line summary.
- Day summary phrase.
- Hidden value lines.
- Footer: `THANK YOU FOR YOUR LIFE.`
- Control to open the original diary.

Interactions:

- Open original diary.
- Return to archive or writer.
- Edit/regenerate can be deferred unless simple.

### 3. Original Diary View

Content:

- Original diary body.
- Date and written time.
- Back to receipt.

### 4. Archive

Content:

- Receipt-style list of saved entries.
- Rows: date, sequence number, one-line summary.
- Empty state that still feels like blank receipt paper.

Interactions:

- Click a row to open receipt detail.
- Add today's diary.

## Implementation Steps

1. Scaffold the app
   - Create Vite React TypeScript project.
   - Add baseline scripts: dev, build, test, lint if available.
   - Add basic app shell and view state.

2. Build core data utilities
   - Define diary and receipt interpretation types.
   - Implement date/time formatting.
   - Implement diary sequence numbering.
   - Implement LocalStorage CRUD behind a small storage API.

3. Build interpretation adapter
   - Start with a deterministic local mock interpreter for offline MVP development.
   - Keep the interface compatible with a future AI provider call.
   - Enforce no-score/no-rank/no-money language in prompt/output contract.

4. Build receipt visual system
   - Create `ReceiptShell` for torn-paper look.
   - Add dashed separators, receipt typography, shadows, paper texture, and narrow receipt width.
   - Verify long Korean text does not clip or overlap.

5. Build read/write flows
   - Diary writer.
   - Receipt result/detail screen.
   - Original diary view.
   - Archive list.
   - Local persistence after refresh.

6. Polish and verify
   - Responsive pass for phone and desktop.
   - Keyboard/input usability pass.
   - Visual QA against the reference image.

## Acceptance Criteria

- A user can write a free-form diary entry.
- The app creates a receipt-style interpretation from that diary.
- The receipt includes hidden values, a one-line summary, a day summary phrase, date, written time, and diary sequence number.
- The receipt uses suggestive language rather than definitive judgment.
- The user can click/open the receipt to see the original diary text.
- Saved receipts remain after browser refresh.
- The UI reads as a monochrome paper receipt, not a generic dashboard.
- There are no cost, amount, total, best day, worst day, rank, or streak concepts in the MVP.
- Mobile layout has no overlapping text or clipped controls.

## Verification Plan

- Unit tests:
  - date/time formatter
  - diary sequence numbering
  - LocalStorage serialization/deserialization
  - mock interpretation contract shape
  - guardrails against money/score fields in receipt data

- Manual QA:
  - write first diary
  - generate receipt
  - open original diary from receipt
  - return to archive
  - refresh browser and confirm persistence
  - check narrow mobile viewport
  - check desktop archive/detail viewport

- Build verification:
  - run typecheck/build
  - run tests
  - inspect app in browser

## Risks And Mitigations

- Risk: the app feels like a finance tracker.
  - Mitigation: remove all amount/total/ranking concepts and use receipt structure only for metadata and value lines.

- Risk: AI feels judgmental.
  - Mitigation: use suggestion language and allow the user to treat results as interpretation, not truth.

- Risk: hidden values feel generic.
  - Mitigation: preserve optional evidence phrases from the user's diary and avoid fixed categories.

- Risk: receipt styling hurts readability.
  - Mitigation: use paper texture subtly, keep Korean body text line-height generous, and test long entries.

## Suggested Milestones

1. Day 1: project scaffold, data model, storage, mock interpretation.
2. Day 2: diary writer and receipt result screen.
3. Day 3: archive, original diary view, persistence.
4. Day 4: visual polish, responsive pass, tests, build verification.

## Next Build Target

The first playable MVP should open to a writing flow. After the user writes a diary, the app generates a receipt containing hidden values, a day summary phrase, a one-line interpretation, and basic diary metadata. The original diary should be accessible from the receipt.
