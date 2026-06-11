# Phase 3 — Engagement model

Goal: show the scope as an outcome-based engagement next to a time-and-materials baseline.

Reuse: Sonar and RADIUS table and card styling.

Build:
- A two-column panel: outcome-based (milestones plus a value metric per milestone) and the old time-and-materials line, for contrast.
- Hardcode milestone data in `account.js` as `engagement[]`, covering tooling, process, change management, and the targeted build.
- Optional, only if Phase 2 is solid: a button that asks Claude to draft milestones from the discovery output. Hardcode first, wire later. Do not block this phase on the wiring.

Files: `src/App.jsx`, `src/account.js`.

Done when: the panel renders both columns from `engagement[]`, and the outcome framing reads without explanation.

Assumptions: this is a demo artifact, not a real quote. Keep numbers round and clearly illustrative.
