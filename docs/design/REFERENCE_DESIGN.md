# Receipt Diary Reference Design

This folder stores visual references for the Receipt Diary MVP.

Primary reference:

- [`reference/receipt-diary-reference.png`](reference/receipt-diary-reference.png)

## Core Intent

Receipt Diary should feel like a warm, crumpled receipt that was almost discarded, then picked up and reread with care.

The visual system should make ordinary daily fragments feel worth looking at again. It should support reflection without turning the day into a score, cost, achievement, or performance record.

Texture is emotional support, not the subject. Diary content must stay visually primary.

## How To Use The Reference

Use the image as an atmosphere and layout reference, not as a pixel-perfect target.

The MVP should borrow:

- a long, narrow receipt-like paper surface
- warm off-white paper on a dark surrounding background
- crumpled paper texture
- subtle paper grain, folds, and creases
- restrained shadows that separate the paper from the background
- black monochrome typography
- receipt-like alignment, dividers, and metadata blocks
- a warm, quiet, personal, archival feeling

The MVP should not copy:

- exact text content from the reference
- exact dimensions or spacing
- the two-receipt composition if a single-screen flow works better
- heavy torn-edge effects
- strong or irregular shadows
- decorative aging that makes the screen visually tiring
- texture that pulls attention away from the diary content
- any money, cost, total, score, ranking, best/worst day, streak, or dashboard semantics

## Visual System Direction

Center the receipt style on these qualities:

- **Warm paper:** use a warm off-white base rather than cold white or gray.
- **Crumpled texture:** make creases and pressure marks visible enough to feel tactile.
- **Readable surface:** keep texture low-contrast behind text.
- **Restrained depth:** use shadow to locate the paper in space, not to create drama.
- **Receipt typography:** use mono or receipt-like typography for metadata and dividers; preserve comfortable Korean reading in longer text.
- **Quiet structure:** use dashed separators, small labels, and metadata blocks to suggest a receipt without introducing finance semantics.
- **Mobile-first composition:** the main record should read as a receipt-like paper artifact in the first viewport.

Torn edges are optional. If used, they must be subtle.

## Product Constraints

The receipt metaphor is structural and emotional. It must not turn the day into a financial or performance object.

Do not introduce these concepts in UI, data, mocks, tests, copy, component names, or CSS class names:

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

Receipt rows should represent reflective fragments such as hidden values, one-line summaries, day phrases, and diary metadata.

## Decision Boundaries

Codex/Ralph may decide all design details during implementation without asking for pre-approval, including:

- exact color values
- paper texture implementation
- shadow strength
- font selection
- spacing
- receipt width
- mobile and desktop layout details
- animation or transition usage
- original diary view presentation

The user will review the completed result and provide feedback after seeing it.

## Failure Criteria

The design has gone too far if:

- the background or paper texture prevents focus on the diary content
- decorative treatment causes visual fatigue
- torn edges become a dominant visual feature
- shadows become irregular enough to distract from reading
- the app begins to feel like a finance tracker
- the app begins to feel like a performance dashboard
- the receipt style makes AI interpretation feel like judgment

## Visual Acceptance Checklist

Before considering the MVP visually complete:

- The main record reads as a paper receipt within the first viewport.
- The paper has a warm, crumpled texture.
- The receipt feels like something almost discarded but worth rereading.
- Diary content remains the visual focus.
- Background texture does not compete with the content.
- Decorative treatment does not cause visual fatigue.
- Torn-edge effects, if present, are subtle.
- Shadows do not interfere with readability.
- The receipt visual feels intimate and archival, not like a finance tracker or performance dashboard.
- Korean diary text has enough line-height and does not clip or overlap.
- Dashed separators and receipt-like metadata support reading without dominating it.
- The original diary remains accessible from the receipt detail.
- The design works on mobile first, then desktop.
- The reference image was checked during visual QA, but exact matching was not required.

## Implementation Handoff

Before building or visually polishing receipt components, read this file and use the reference image for mood only.

The implementation should optimize for the following priority order:

1. Content focus and readability.
2. Warm crumpled receipt feeling.
3. Receipt-like metadata structure.
4. Subtle paper depth and texture.
5. Optional imperfect edges or aging details.

Do not sacrifice the first two priorities for visual effects.
