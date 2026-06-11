# SETUP — run this in a Claude Code session that can see Sonar

This package tells Claude Code to reuse Sonar. It does not contain Sonar. For the build session to speak to Sonar, Sonar's files must sit in the same working tree.

## Do this first
1. Copy the Sonar repo to a new working copy named `vantage`. Leave the original Sonar untouched.
2. Copy this whole folder into the root of `vantage`, as `_build/`.
3. Open the Claude Code session at the `vantage` root, so it reads both `_build/` (the instructions) and the Sonar source (the code to reuse).

Layout Claude Code should see:
```
vantage/
  _build/                      <- this package
    BUILD.md
    00-context.md
    SETUP.md
    phases/
    src/account.js
    src/discovery-prompt.txt
  src/App.jsx                  <- Sonar source
  src/<main>.css               <- Sonar source (confirm exact name)
  netlify/functions/claude.js  <- Sonar source
  netlify.toml
  package.json
  vite.config.js
```

## Step 0 for Claude Code: read before building
Before any phase, read these from the Sonar source and confirm the facts the phases depend on:
- `src/App.jsx` — the shell and layout, the panel-switch pattern, and the Ask Sonar fetch. Note the exact request and response shape.
- the main CSS file — confirm its filename and the class names for cards, panels, status chips, lists, and the accent token. Phases reuse these by name.
- `netlify/functions/claude.js` — confirm where the system prompt lives and the request shape, then compare to `_build/phases/phase-2-claude.reference.js`.
- `package.json`, `netlify.toml`, `vite.config.js` — confirm scripts and the function setup.

State two things back before writing code: the exact CSS filename and class names you will reuse, and whether the system prompt lives in the function or in `App.jsx`. (karpathy: define before building.)

## Then
Build phases in order from `_build/phases/`. Move `_build/src/account.js` and `_build/src/discovery-prompt.txt` into the real `src/` when Phase 0 and Phase 2 call for them.
