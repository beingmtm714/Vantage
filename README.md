# Sonar by Riviera

Sonar captures market intelligence from BD conversations and makes it searchable. Every founder meeting, every VC talent partner sync, every board advisor call generates signal — who's hiring, how orgs are changing, where comp is moving, what capability gaps are showing up. Right now that signal lives in someone's head or in scattered meeting notes. Sonar structures it, enriches it with external data, and lets you query it in plain English.

---

## What it does

**Signal Intake.** Connect Granola, Otter.ai, Fathom, Fireflies, Avoma, or Read.ai and set meetings to autosync — signals get captured without manual action. Or paste raw meeting notes and Claude extracts the structured signal. Or drop a photo of handwritten notes and it OCRs them. Recent calendar meetings surface automatically as one-click sync targets.

**Signal Feed.** A filterable feed of signals tagged by company, stage, function, and type (Hiring Trigger, Org Pattern, Comp Shift, Capability Gap). Each signal expands to show source, VC reference, and enrichment data from Crunchbase, LinkedIn, and news.

**Pattern Detection.** Aggregated view of recurring themes. "5 Series A/B companies asked about player-coach eng leaders this month." That's not just a BD note — it's a product signal and a firm-wide intelligence input. A monthly brief summarizes the top patterns for distribution across the practice.

**Ask Sonar.** Natural language search running against the full signal database via Claude. "Which companies need eng leadership right now?" "What's Paradigm surfacing?" "Where is comp moving at Series B?" Returns a synthesized answer with the specific signals and patterns it drew from.

**VC Relationship Tracker.** Active, building, and prospect VC relationships with signal counts, commercial engagement attribution, and a progress bar toward the 12-month target of 15+ active relationships.

---

## Why it matters

Conversations are the raw material of BD work. Sonar turns them into institutional knowledge instead of letting them disappear into meeting notes.

Most firms track relationships in a CRM and patterns in someone's head. Sonar structures both. The signal dataset builds over time — six months in, you have data on what the market needs before it formalizes into a search mandate. The VC tracker attributes commercial outcomes back to specific relationships. The Patterns view flags emerging hiring trends, comp shifts, and org design changes automatically from signals you're already capturing.

One person's BD activity becomes firm-wide market awareness. The search practice and advisory team work from the same intelligence, structured and distributed through a monthly brief.

---

## Stack

React 18 + Vite, Claude Sonnet via Netlify Functions proxy, Netlify hosting. No database — signal data is hardcoded for demo purposes. Production would connect to a backend (Supabase or Airtable) and to notetaker APIs via OAuth.
