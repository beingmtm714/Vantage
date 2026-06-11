# Phase 0 — Scaffold

Goal: a running copy of Sonar, stripped to an empty cockpit shell with the account loaded.

Reuse: clone Sonar, keep the scaffold and CSS (00-context > Reuse).

Build (delta only):
- Rename the project to `vantage` in `package.json` and the `index.html` title.
- Remove Sonar's feature modules from `App.jsx` (signal feed, intake, pattern, VC tracker, Ask Sonar UI). Keep the shell, the CSS import, and the layout frame.
- Add `src/account.js` and import it into `App.jsx`.
- Render the account header: name, vertical, profile, stage.
- Swap the accent token to a neutral or HTEC accent.

Files: `package.json`, `index.html`, `src/App.jsx`, `src/account.js`.

Plan:
1. Strip modules, keep shell -> verify: app builds, shell renders.
2. Import account, render header -> verify: header shows account fields.
3. Swap accent token -> verify: no Circle-green anywhere.

Done when: `npm run dev` shows the account header in the Sonar shell, no console errors, no leftover Sonar modules rendering.

Assumptions: Sonar's CSS uses one accent token. If the accent is spread across classes, change it at the source, not per class.
