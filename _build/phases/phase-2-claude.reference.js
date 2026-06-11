// netlify/functions/claude.js — REFERENCE for the Phase 2 swap.
// Shows the standard Sonar proxy shape and the two parts that change.
// Match your actual Sonar file. Do not overwrite it blindly. (karpathy: surgical)
//
// ASSUMPTION: Sonar's system prompt lives in this function. If yours lives in
// App.jsx instead, make the same swap there. The pattern is identical.
//
// CONTRACT CHANGE: the discovery panel POSTs { notes, account } to this function,
// where notes is the textarea string and account is the object from src/account.js.

// (1) THE SWAP: replace Sonar's "act as Sonar" prompt with the discovery prompt.
// Canonical copy lives in src/discovery-prompt.txt. Keep the two in sync.
const SYSTEM_PROMPT = `You are a discovery copilot for an HTEC client partner working an advanced-tech account where AI use has spread across the whole org, not just engineering. The old motion sold a scoped build to the CTO. The new motion is a combined sale and change-management engagement across a buying group.

Given what the client partner knows about the account and its stakeholders, return two things.

1. The sharpest discovery questions to ask across the buying group (CTO, ops, and function heads) to map where AI is already used, where the IP and security risk sits, and where the process and tooling gaps are.

2. A scoping hypothesis for a combined engagement covering tooling, process, change management, and the targeted engineering build HTEC should own, framed as outcomes, not headcount.

Be concrete. No filler.`;

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { notes, account } = JSON.parse(event.body || "{}");

    // (2) GROUNDING: fold the account into the user message so the model names
    // this account's stakeholders and tensions, not generic ones.
    const userMessage = [
      `Account: ${account?.name} — ${account?.profile}`,
      `Stakeholders: ${(account?.stakeholders || []).map(s => `${s.role} (${s.stake})`).join("; ")}`,
      `AI in use now: ${(account?.newReality || []).join("; ")}`,
      `Tensions: ${(account?.tensions || []).join("; ")}`,
      ``,
      `What the partner knows so far:`,
      notes || "(nothing entered yet)"
    ].join("\n");

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY, // server-side only, never in the browser
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6", // set to your current Sonnet model string
        max_tokens: 1200,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await res.json();
    const text = (data.content || [])
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join("\n");

    return { statusCode: 200, body: JSON.stringify({ text }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};
