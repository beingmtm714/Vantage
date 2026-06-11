# Phase 4 — Delivery tracker

Goal: close the loop. Show delivery milestones and two expansion signals that feed a new opportunity, in the same surface as the sale.

Reuse: Sonar feed and list styles, and status-chip styles.

Build:
- A milestone list from `account.engagement[]` with status chips (planned, in progress, done).
- Two expansion-signal rows that point back to a new opportunity, e.g. a function adopting the tooling and asking for more.
- Static only.

Files: `src/App.jsx`, `src/account.js`.

Done when: the tracker renders milestones with statuses and two expansion signals, reusing existing chip styles, with no new dependencies.

Assumptions: statuses are illustrative. Expansion signals exist to show the motion loops, not to model real pipeline.
