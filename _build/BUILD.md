# HTEC CP+ Cockpit — Build Package (working name: Vantage)

A one-account demo that shows the pre-sale / post-sale collapse in HTEC's advanced-tech vertical. It reuses an existing app (Sonar) as the base. Feed it to Claude Code one phase at a time.

## How to use this package
1. Read `00-context.md` once. It holds the stack, the reuse rule, and the design system. Do not re-derive these per phase.
2. Build phases in order from `phases/`. Each is self-contained and shippable.
3. Phases 0 to 2 are the minimum demo: shell, iceberg, live discovery. Ship that first. Phases 3 to 4 add the engagement model and delivery tracker.
4. Drop-in assets live in `src/`: `account.js` (seed data) and `discovery-prompt.txt` (the Phase 2 system prompt).

## Prerequisite (do this first)
This package does not contain Sonar. The build session must run inside a copy of the Sonar repo with this folder dropped in as `_build/`, so Claude Code can read the code it reuses. Follow `SETUP.md` before anything else.

## Rule that governs every phase
Reuse, do not rebuild. Touch only what the phase names. Match Sonar's existing style. Every changed line traces to the phase goal. (karpathy-guidelines.)
