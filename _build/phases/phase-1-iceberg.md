# Phase 1 — Iceberg panel

Goal: one screen showing scattered AI use on top and the org-wide opportunity below a waterline.

Reuse: Sonar card and panel classes. No new design tokens.

Build:
- A panel with a horizontal waterline divider.
- Above the line: map `account.newReality[]`, labeled "In use now, uncoordinated."
- Below the line: map `account.opportunityParts[]`, labeled "The system no one owns yet."
- Static only. No Claude call.

Files: `src/App.jsx` (an `IcebergPanel` in the same file is fine), `src/account.js` only if `opportunityParts` needs editing.

Plan:
1. Build the two-zone panel from account arrays -> verify: both halves render from data.
2. Check mobile -> verify: stacks cleanly, no overflow.

Done when: the panel renders both halves from account data, reads clearly on desktop and mobile, and no panel copy duplicates what already lives in `account.js`.

Assumptions: the waterline is visual only, built with existing CSS. Do not pull in an SVG or chart library.
