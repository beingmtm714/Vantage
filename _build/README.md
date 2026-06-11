# Vantage — CP+ Account Cockpit (demo)

A one-account demo for an HTEC client partner. It runs the full motion in one surface: see the opportunity, run a technical discovery, scope an outcome-based engagement, track delivery. It argues one point: when anyone in an org can use AI, the sale becomes a multi-stakeholder change-and-build engagement, and pre-sale and post-sale collapse into one role.

## The account
Cordova Systems, an advanced-tech archetype: custom silicon plus the software that ships with connected devices. AI use has spread past engineering into docs, field engineering, ops, support, and marketing, with no shared tooling or governance. The opportunity is a combined engagement, not a scoped build sold to the CTO.

## Panels
- Iceberg: scattered AI use today over the org-wide system no one owns yet.
- Discovery: live Claude copilot returning discovery questions across the buying group and a scoping hypothesis.
- Engagement: outcome-based milestones beside a time-and-materials baseline.
- Delivery: milestone tracker with expansion signals that loop back.

## What is live vs simulated
| Feature | Status |
|---|---|
| Discovery copilot | Live. Real Claude call via the Netlify function. |
| Iceberg, engagement, delivery | Seeded demo data. |
| Account data | Hardcoded archetype, not a real company. |

The discovery panel is the live piece. Everything else is seeded so the story is walkable. Say this out loud in a demo.

## Stack
React 18 + Vite. Claude via Netlify serverless proxy. Netlify hosting. No database. Built on the Sonar scaffold.

## Deploy
Same as Sonar. Push to GitHub, connect to Netlify, set `ANTHROPIC_API_KEY` as an env var, build `npm run build`, publish `dist`. Run locally with `netlify dev` so the function proxy works.
