# Context (read once)

## What we are building
A single-account cockpit for an HTEC client partner. It runs the whole motion in one surface: spot the opportunity, run a credible technical discovery, scope an outcome-based engagement, track delivery. The point it makes: when anyone in an org can use AI, the sale stops being a direct CTO pitch and becomes a multi-stakeholder change-and-build engagement. Pre-sale and post-sale collapse into one.

## Stack (inherited from Sonar, do not change)
- React 18 + Vite, single page.
- Anthropic Claude via a Netlify serverless proxy at `netlify/functions/claude.js`. The API key stays server-side.
- `netlify.toml` with CSP. No database. All data hardcoded for demo.

## Reuse (surgical)
These Sonar files must be present in the build session's working tree, see SETUP.md. Start from a copy of the Sonar repo. Keep verbatim:
- `package.json`, `vite.config.js`, `netlify.toml`, `netlify/functions/claude.js`
- the CSS file and shell layout, including all class names

Change only:
- one accent color token, so the demo does not ship another client's brand palette
- the panel content and the one system prompt

Reuse the RADIUS mode-toggle pattern (Portfolio / Query / Diligence) to switch cockpit panels. Reuse Sonar's Ask Sonar fetch for the one live feature.

## One live feature
Only the discovery panel calls Claude, reusing the Ask Sonar fetch to `/.netlify/functions/claude`. Everything else renders hardcoded data, same as Sonar. Keep this honest in the README.

## Design system
Dark theme, Sonar's existing classes and fonts. Cards, panels, status chips, list and filter styles already exist. Reuse them. Do not add a component library or new design tokens.

## Data model
The account lives in `src/account.js`. Import it. Do not inline a second copy. Fields: profile, oldMotion, newReality[], tensions[], stakeholders[], opportunity.

## Constraints (karpathy)
- Simplicity first. Minimum code per phase. No speculative features, no configurability nobody asked for.
- Surface assumptions in code comments wherever you make a choice.
- Each phase has a Done-when check. Build until it passes, then stop.
