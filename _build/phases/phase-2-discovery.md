# Phase 2 — Discovery copilot (live)

Goal: a panel where the partner types what they know and Claude returns discovery questions across the buying group plus a scoping hypothesis.

Reuse: Sonar's Ask Sonar fetch to `/.netlify/functions/claude` and its input and response render. Keep the request shape.

Build:
- A discovery panel: a textarea for buyer and account notes, a submit button, a response area. Reuse Ask Sonar styling and loading state.
- In `netlify/functions/claude.js`, replace the Sonar system prompt with the contents of `src/discovery-prompt.txt`. Pass account context (stakeholders, newReality, tensions) into the user message so the model grounds its answer.
- No other Sonar behavior changes.

Files: `src/App.jsx`, `netlify/functions/claude.js`.

Plan:
1. Swap the system prompt -> verify: function returns discovery-style output.
2. Wire the panel UI to the existing fetch -> verify: submit returns a live response.
3. Inject account context into the user message -> verify: output names this account's stakeholders.

Done when: typing a note and submitting returns a live Claude response with discovery questions and a scoping hypothesis grounded in the account. The network call hits the Netlify function, not the API directly.

Assumptions: the Anthropic key is a Netlify env var, same as Sonar. Locally, run `netlify dev` so the function works.

This is the MVP cut. Stop here for the first demo if time is short.

Reference: see `phases/phase-2-claude.reference.js` for the exact prompt swap and the account-grounding shape. The panel must POST `{ notes, account }`.
