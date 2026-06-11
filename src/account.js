// Seed account for the cockpit demo. Archetype, not a real company.
// Imported by App.jsx. Single source of truth for all panels.
export const account = {
  name: "Cordova Systems (archetype)",
  vertical: "Advanced tech, connected hardware and silicon",
  profile: "~2,000 employees. Designs custom silicon and the firmware and software that ship with its connected devices. Software is core to the product and to the go-to-market.",
  stage: "Scaling, multiple active design wins",
  oldMotion: "HTEC used to sell here by going straight to the CTO for a scoped engineering build.",
  newReality: [
    "Verification and firmware engineers run AI copilots on their own",
    "Technical writers draft SDK docs and guides with AI",
    "Field and sales engineers answer customer integration questions with AI",
    "Ops and supply-chain teams prototype AI for planning and yield analysis",
    "Marketing and support adopt tools with no shared standard"
  ],
  tensions: [
    "Adoption is uneven and ungoverned, with IP and security exposure",
    "No shared tooling, process, or success metric across functions",
    "The CTO can no longer own this alone, it now spans the org"
  ],
  stakeholders: [
    { role: "CTO", stake: "Owns the build, wary of shadow tooling and IP leakage" },
    { role: "COO / Head of Ops", stake: "Wants process and measurable productivity" },
    { role: "Function heads (docs, field eng, support)", stake: "Already using AI, want it sanctioned and working" }
  ],
  // Phase 1 may split this into opportunityParts[]; see phase-1.
  opportunity: "One combined engagement: help leadership see what is real, plan tooling and process across functions, implement with change management, and build the engineering pieces that need HTEC's IP. Sale and delivery fused, several stakeholders, not one.",
  opportunityParts: [
    "Tooling: a sanctioned, secure AI tool stack across functions",
    "Process: shared workflows and a success metric",
    "Change management: enablement and governance the org adopts",
    "Build: the engineering IP that needs HTEC, e.g. the customer-facing SDK"
  ],

  // Phase 3: outcome-based engagement model. Numbers are illustrative.
  engagement: [
    {
      milestone: "1 · Visibility",
      outcome: "Map where AI sits across all functions, who owns it, and where IP and security risk lives",
      valueMetric: "Risk inventory signed off by CTO and COO",
      weeks: 4,
      fee: 60,
    },
    {
      milestone: "2 · Tooling",
      outcome: "Sanctioned AI tool stack deployed with access controls, data policy, and usage governance",
      valueMetric: "Shadow tooling eliminated across all five functions",
      weeks: 8,
      fee: 140,
    },
    {
      milestone: "3 · Process",
      outcome: "Shared workflows and a single productivity metric adopted across engineering, docs, field, and support",
      valueMetric: "Measurable reduction in time-to-answer for field and support teams",
      weeks: 6,
      fee: 100,
    },
    {
      milestone: "4 · Change management",
      outcome: "Every function head has adopted the standard and owns ongoing governance without HTEC in the room",
      valueMetric: "Adoption rate above 80% across target roles",
      weeks: 6,
      fee: 90,
    },
    {
      milestone: "5 · SDK Build",
      outcome: "Customer-facing SDK delivered with AI-accelerated developer experience and integration tooling",
      valueMetric: "Integration time for top three customer segments cut by half",
      weeks: 12,
      fee: 200,
    },
  ],

  // T&M baseline: the old motion, for contrast only.
  tmBaseline: {
    scope: "Scoped engineering build — SDK and firmware integration layer for the CTO",
    team: "4 HTEC engineers",
    weeks: 24,
    fee: 480,
    note: "Single stakeholder. No tooling governance, no process, no change management. Org-wide AI risk unresolved.",
  },
};
