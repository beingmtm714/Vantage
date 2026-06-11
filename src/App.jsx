import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { account } from "./account.js";

// ─── RESPONSIVE HOOK ───
const useIsMobile = (breakpoint = 640) => {
  const [mobile, setMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [breakpoint]);
  return mobile;
};

// ─── DESIGN TOKENS ───
const T = {
  bg: "#0C0D0F", surface: "#141518", surfaceHover: "#1A1B20", surfaceActive: "#1E1F25",
  border: "#2A2B32", borderSubtle: "#1E1F25",
  text: "#E8E9EC", textMuted: "#C0C8DA", textDim: "#8096B8",
  accent: "#4F8CFF", accentDim: "rgba(79,140,255,0.12)",
  green: "#34D399", greenDim: "rgba(52,211,153,0.12)",
  amber: "#FBBF24", amberDim: "rgba(251,191,36,0.12)",
  red: "#F87171", redDim: "rgba(248,113,113,0.12)",
  purple: "#A78BFA", purpleDim: "rgba(167,139,250,0.12)",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
  sans: "'Helvetica Neue', sans-serif",
  r: "6px",
};

// ─── SMALL COMPONENTS ───
const Tag = ({ label, color, bg }) => (
  <span style={{ display: "inline-block", padding: "2px 7px", borderRadius: "3px", fontSize: "10px", fontFamily: T.mono, letterSpacing: "0.03em", color, background: bg, fontWeight: 500, lineHeight: "17px", whiteSpace: "nowrap" }}>{label}</span>
);
const ScrollRow = ({ children, style: s }) => (
  <div style={{ display: "flex", gap: "5px", overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", paddingBottom: "2px", ...s }}>
    {children}
  </div>
);
const FieldRow = ({ label, value, color }) => (
  <div style={{ display: "flex", gap: "6px", marginBottom: "3px" }}>
    <span style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.06em", width: "80px", flexShrink: 0, paddingTop: "1px" }}>{label}</span>
    <span style={{ fontFamily: T.sans, fontSize: "11px", color: color || T.textMuted }}>{value}</span>
  </div>
);

// ─── DISCOVERY SYSTEM PROMPT ───
const DISCOVERY_PROMPT = `You are a discovery copilot for an HTEC client partner working an advanced-tech account where AI use has spread across the whole org, not just engineering. The old motion sold a scoped build to the CTO. The new motion is a combined sale and change-management engagement across a buying group.

Given what the client partner knows about the account and its stakeholders, return two things.

1. The sharpest discovery questions to ask across the buying group (CTO, ops, and function heads) to map where AI is already used, where the IP and security risk sits, and where the process and tooling gaps are.

2. A scoping hypothesis for a combined engagement covering tooling, process, change management, and the targeted engineering build HTEC should own, framed as outcomes, not headcount.

Be concrete. No filler.`;

// ─── DISCOVERY PANEL ───
const DiscoveryPanel = ({ mobile }) => {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!notes.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    const userMessage = [
      `Account: ${account.name} — ${account.profile}`,
      `Stakeholders: ${account.stakeholders.map(s => `${s.role} (${s.stake})`).join("; ")}`,
      `AI in use now: ${account.newReality.join("; ")}`,
      `Tensions: ${account.tensions.join("; ")}`,
      ``,
      `What the partner knows so far:`,
      notes,
    ].join("\n");

    try {
      const res = await fetch("/.netlify/functions/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1200,
          skipWebSearch: true,
          system: DISCOVERY_PROMPT,
          messages: [{ role: "user", content: userMessage }],
        }),
      });
      const data = await res.json();
      if (data.type === "error" || !data.content) {
        setError(data.error?.message || "No response from API.");
      } else {
        const text = data.content.filter(b => b.type === "text").map(b => b.text).join("");
        setResult(text);
      }
    } catch (err) {
      setError("Request failed. Check connection and try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ background: T.surface, borderRadius: T.r, border: `1px solid ${T.border}`, padding: mobile ? "16px" : "22px 24px", marginBottom: "14px" }}>
      <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
        Discovery Copilot
      </div>

      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder={"What do you know about this account so far?\n\nE.g. who you've spoken to, what they said, where the friction is, what the sponsor cares about."}
        style={{ width: "100%", height: mobile ? "110px" : "140px", background: T.bg, border: `1px solid ${result ? T.borderSubtle : T.border}`, borderRadius: T.r, padding: "12px 14px", fontFamily: T.sans, fontSize: "13px", color: T.text, resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: "1.6" }}
      />

      <button
        onClick={handleSubmit}
        disabled={!notes.trim() || loading}
        style={{ marginTop: "10px", padding: "10px 22px", border: "none", borderRadius: T.r, fontFamily: T.mono, fontSize: "11px", fontWeight: 600, cursor: notes.trim() && !loading ? "pointer" : "default", background: T.accent, color: "#fff", letterSpacing: "0.04em", opacity: !notes.trim() || loading ? 0.45 : 1 }}
      >
        {loading ? "Analyzing..." : "Run Discovery"}
      </button>

      {error && (
        <div style={{ marginTop: "12px", padding: "10px 14px", background: T.redDim, border: `1px solid ${T.red}`, borderRadius: T.r, fontFamily: T.mono, fontSize: "11px", color: T.red }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: "14px", background: T.bg, border: `1px solid ${T.accent}`, borderRadius: T.r, overflow: "hidden" }}>
          <div style={{ padding: mobile ? "10px 12px 4px" : "14px 18px 6px", fontFamily: T.mono, fontSize: "9px", color: T.accent, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Discovery Output
          </div>
          <div style={{ padding: mobile ? "4px 12px 14px" : "4px 18px 18px" }}>
            {result.split("\n").filter(l => l.trim()).map((line, i) => {
              const isBullet = /^[-•*]\s/.test(line.trim());
              const isNumbered = /^\d+\.\s/.test(line.trim());
              const isHeading = /^\*\*/.test(line.trim()) || (isNumbered && line.trim().length < 80);
              const text = line.trim().replace(/^\*\*|\*\*$/g, "").replace(/^[-•*]\s*/, "").replace(/^\d+\.\s*/, "");
              if (isHeading && (isNumbered || /^\*\*/.test(line.trim()))) {
                return (
                  <div key={i} style={{ fontFamily: T.sans, fontSize: "13px", fontWeight: 700, color: T.text, marginTop: i === 0 ? 0 : "16px", marginBottom: "6px", lineHeight: "1.4" }}>
                    {text}
                  </div>
                );
              }
              if (isBullet) {
                return (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "5px" }}>
                    <span style={{ color: T.accent, fontFamily: T.mono, fontSize: "10px", flexShrink: 0, paddingTop: "3px" }}>›</span>
                    <span style={{ fontFamily: T.sans, fontSize: "13px", color: T.textMuted, lineHeight: "1.6" }}>{text}</span>
                  </div>
                );
              }
              return (
                <p key={i} style={{ fontFamily: T.sans, fontSize: "13px", color: T.textMuted, lineHeight: "1.6", margin: "0 0 6px 0" }}>{text}</p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── ENGAGEMENT PANEL ───
const EngagementPanel = ({ mobile }) => {
  const totalWeeks = Math.max(...account.engagement.map(m => m.weeks));
  // Rough total assuming milestones run mostly sequentially with some overlap
  const totalWeeksSequential = account.engagement.reduce((a, m) => a + m.weeks, 0);
  const totalFee = account.engagement.reduce((a, m) => a + m.fee, 0);

  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "3fr 2fr", gap: "14px", alignItems: "start" }}>

        {/* OUTCOME-BASED COLUMN */}
        <div style={{ background: T.surface, borderRadius: T.r, border: `1px solid ${T.border}`, overflow: "hidden" }}>
          <div style={{ padding: mobile ? "14px 14px 10px" : "18px 22px 12px", borderBottom: `1px solid ${T.borderSubtle}` }}>
            <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Outcome-based</div>
            <div style={{ display: "flex", gap: "16px", fontFamily: T.mono, fontSize: "11px", color: T.textMuted }}>
              <span style={{ color: T.text, fontWeight: 700 }}>${totalFee}k</span>
              <span>{totalWeeksSequential} weeks</span>
              <span>{account.engagement.length} milestones</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {account.engagement.map((m, i) => (
              <div key={i} style={{ padding: mobile ? "12px 14px" : "14px 22px", borderBottom: i < account.engagement.length - 1 ? `1px solid ${T.borderSubtle}` : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px", marginBottom: "5px" }}>
                  <span style={{ fontFamily: T.mono, fontSize: "11px", fontWeight: 700, color: T.text }}>{m.milestone}</span>
                  <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
                    <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim }}>{m.weeks}w</span>
                    <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.accent, fontWeight: 700 }}>${m.fee}k</span>
                  </div>
                </div>
                <p style={{ fontFamily: T.sans, fontSize: "12px", color: T.textMuted, lineHeight: "1.5", margin: "0 0 6px 0" }}>{m.outcome}</p>
                <div style={{ display: "flex", gap: "6px", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: T.mono, fontSize: "9px", color: T.green, textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0, paddingTop: "2px" }}>Value</span>
                  <span style={{ fontFamily: T.sans, fontSize: "11px", color: T.green, lineHeight: "1.4" }}>{m.valueMetric}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* T&M BASELINE COLUMN */}
        <div style={{ background: T.surface, borderRadius: T.r, border: `1px solid ${T.border}`, overflow: "hidden" }}>
          <div style={{ padding: mobile ? "14px 14px 10px" : "18px 22px 12px", borderBottom: `1px solid ${T.borderSubtle}` }}>
            <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Time &amp; Materials — old motion</div>
            <div style={{ display: "flex", gap: "16px", fontFamily: T.mono, fontSize: "11px", color: T.textMuted }}>
              <span style={{ color: T.textMuted, fontWeight: 700 }}>${account.tmBaseline.fee}k</span>
              <span>{account.tmBaseline.weeks} weeks</span>
            </div>
          </div>
          <div style={{ padding: mobile ? "14px" : "16px 22px" }}>
            <FieldRow label="Scope" value={account.tmBaseline.scope} />
            <FieldRow label="Team" value={account.tmBaseline.team} />
            <FieldRow label="Billing" value="Weekly T&M, scope drift risk on client" />
            <div style={{ marginTop: "14px", padding: "10px 12px", background: T.amberDim, border: `1px solid ${T.amber}22`, borderRadius: T.r }}>
              <p style={{ fontFamily: T.sans, fontSize: "11px", color: T.amber, lineHeight: "1.5", margin: 0 }}>{account.tmBaseline.note}</p>
            </div>

            <div style={{ marginTop: "16px", borderTop: `1px solid ${T.borderSubtle}`, paddingTop: "14px" }}>
              <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>What changes</div>
              {[
                ["Stakeholders", "1 → 3", T.accent],
                ["Scope", "Build only → full system", T.accent],
                ["Accountability", "Hours billed → outcomes met", T.green],
                ["Risk", "Client owns drift → shared", T.green],
              ].map(([label, value, color]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "7px" }}>
                  <span style={{ fontFamily: T.sans, fontSize: "11px", color: T.textDim }}>{label}</span>
                  <span style={{ fontFamily: T.mono, fontSize: "10px", color, fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// ─── DELIVERY PANEL ───
const STATUS_COLOR = { done: "#34D399", "in progress": "#FBBF24", planned: "#8096B8" };
const STATUS_BG    = { done: "rgba(52,211,153,0.12)", "in progress": "rgba(251,191,36,0.12)", planned: "rgba(128,150,184,0.08)" };

const DeliveryPanel = ({ mobile }) => (
  <div style={{ marginBottom: "14px" }}>

    {/* MILESTONE TRACKER */}
    <div style={{ background: T.surface, borderRadius: T.r, border: `1px solid ${T.border}`, overflow: "hidden", marginBottom: "10px" }}>
      <div style={{ padding: mobile ? "14px 14px 10px" : "18px 22px 12px", borderBottom: `1px solid ${T.borderSubtle}`, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em" }}>Delivery Tracker</div>
        <div style={{ display: "flex", gap: "8px" }}>
          {["done", "in progress", "planned"].map(s => (
            <Tag key={s} label={s} color={STATUS_COLOR[s]} bg={STATUS_BG[s]} />
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {account.engagement.map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: mobile ? "11px 14px" : "13px 22px", borderBottom: i < account.engagement.length - 1 ? `1px solid ${T.borderSubtle}` : "none", opacity: m.status === "planned" ? 0.6 : 1 }}>
            {/* timeline dot */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: "3px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: STATUS_COLOR[m.status], flexShrink: 0 }} />
              {i < account.engagement.length - 1 && (
                <div style={{ width: "1px", flex: 1, minHeight: "24px", background: T.borderSubtle, marginTop: "3px" }} />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px", marginBottom: "3px" }}>
                <span style={{ fontFamily: T.mono, fontSize: "11px", fontWeight: 700, color: T.text }}>{m.milestone}</span>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim }}>{m.weeks}w · ${m.fee}k</span>
                  <Tag label={m.status} color={STATUS_COLOR[m.status]} bg={STATUS_BG[m.status]} />
                </div>
              </div>
              <p style={{ fontFamily: T.sans, fontSize: "12px", color: T.textMuted, lineHeight: "1.45", margin: "0 0 4px 0" }}>{m.outcome}</p>
              {m.status !== "planned" && (
                <div style={{ display: "flex", gap: "5px", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: T.mono, fontSize: "9px", color: T.green, textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0, paddingTop: "2px" }}>Value</span>
                  <span style={{ fontFamily: T.sans, fontSize: "11px", color: T.green, lineHeight: "1.4" }}>{m.valueMetric}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* EXPANSION SIGNALS */}
    <div style={{ background: T.surface, borderRadius: T.r, border: `1px solid ${T.border}`, overflow: "hidden" }}>
      <div style={{ padding: mobile ? "14px 14px 10px" : "18px 22px 12px", borderBottom: `1px solid ${T.borderSubtle}` }}>
        <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em" }}>Expansion Signals</div>
      </div>
      {account.expansionSignals.map((s, i) => (
        <div key={i} style={{ padding: mobile ? "12px 14px" : "16px 22px", borderBottom: i < account.expansionSignals.length - 1 ? `1px solid ${T.borderSubtle}` : "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <Tag label={s.func} color={T.purple} bg={T.purpleDim} />
            <span style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.06em" }}>New signal</span>
          </div>
          <p style={{ fontFamily: T.sans, fontSize: "12px", color: T.textMuted, lineHeight: "1.5", margin: "0 0 8px 0" }}>{s.signal}</p>
          <div style={{ display: "flex", gap: "6px", alignItems: "flex-start", padding: "8px 12px", background: T.accentDim, borderRadius: T.r, border: `1px solid rgba(79,140,255,0.15)` }}>
            <span style={{ fontFamily: T.mono, fontSize: "9px", color: T.accent, textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0, paddingTop: "2px" }}>Opp</span>
            <span style={{ fontFamily: T.sans, fontSize: "12px", color: T.accent, lineHeight: "1.4" }}>{s.opportunity}</span>
          </div>
        </div>
      ))}
    </div>

  </div>
);

// ─── ICEBERG PANEL ───
const IcebergPanel = ({ mobile }) => (
  <div style={{ background: T.surface, borderRadius: T.r, border: `1px solid ${T.border}`, overflow: "hidden", marginBottom: "14px" }}>

    {/* ABOVE WATERLINE */}
    <div style={{ padding: mobile ? "16px 14px 14px" : "20px 24px 18px" }}>
      <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
        In use now, uncoordinated
      </div>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(2, 1fr)", gap: "8px" }}>
        {account.newReality.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "10px 12px", background: T.bg, borderRadius: T.r, border: `1px solid ${T.borderSubtle}` }}>
            <span style={{ color: T.amber, fontFamily: T.mono, fontSize: "11px", flexShrink: 0, paddingTop: "1px" }}>~</span>
            <span style={{ fontFamily: T.sans, fontSize: "12px", color: T.textMuted, lineHeight: "1.5" }}>{item}</span>
          </div>
        ))}
      </div>
    </div>

    {/* WATERLINE */}
    <div style={{ position: "relative", borderTop: `2px solid ${T.accent}`, margin: "0" }}>
      <span style={{
        position: "absolute", top: "50%", left: mobile ? "14px" : "24px",
        transform: "translateY(-50%)",
        fontFamily: T.mono, fontSize: "9px", color: T.accent,
        background: T.surface, padding: "0 8px",
        textTransform: "uppercase", letterSpacing: "0.1em",
      }}>
        Waterline
      </span>
    </div>

    {/* BELOW WATERLINE */}
    <div style={{ padding: mobile ? "14px 14px 16px" : "18px 24px 20px", background: T.surfaceActive }}>
      <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px", marginTop: "4px" }}>
        The system no one owns yet
      </div>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(2, 1fr)", gap: "8px" }}>
        {account.opportunityParts.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "10px 12px", background: T.bg, borderRadius: T.r, border: `1px solid ${T.accentDim}` }}>
            <span style={{ color: T.accent, fontFamily: T.mono, fontSize: "11px", flexShrink: 0, paddingTop: "1px" }}>›</span>
            <span style={{ fontFamily: T.sans, fontSize: "12px", color: T.textMuted, lineHeight: "1.5" }}>{item}</span>
          </div>
        ))}
      </div>
    </div>

  </div>
);

// ─── MAIN APP ───
export default function Vantage() {
  const mobile = useIsMobile();
  const px = mobile ? "12px" : "24px";

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.sans }}>

      {/* HEADER */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: T.bg }}>
        <div style={{ borderBottom: `1px solid ${T.borderSubtle}`, padding: `0 ${px}` }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "48px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span style={{ fontFamily: T.mono, fontSize: mobile ? "13px" : "14px", fontWeight: 700, color: T.text }}>VANTAGE</span>
              <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim }}>by HTEC</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: T.accent }} />
              <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textDim }}>demo</span>
            </div>
          </div>
        </div>

        {/* NAV — placeholder anchors for phases 1–4 */}
        <div style={{ borderBottom: `1px solid ${T.border}`, padding: `0 ${px}`, overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", background: T.surface }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", height: "44px", alignItems: "center" }}>
            {[
              { label: "Account",    id: "section-account",    live: true  },
              { label: "Discovery",  id: "section-discovery",  live: true  },
              { label: "Engagement", id: "section-engagement",  live: true  },
              { label: "Delivery",   id: "section-delivery",   live: true  },
            ].map(({ label, id, live }) => (
              <button key={label}
                onClick={() => id && document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                style={{ padding: "0 18px", height: "44px", border: "none", background: "transparent", fontFamily: T.mono, fontSize: "11px", color: live ? T.textMuted : T.textDim, cursor: live ? "pointer" : "default", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0, opacity: live ? 1 : 0.4 }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: `24px ${px}` }}>

        {/* ACCOUNT HEADER */}
        <div id="section-account" style={{ background: T.surface, borderRadius: T.r, border: `1px solid ${T.border}`, padding: mobile ? "16px" : "22px 24px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
            <div>
              <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>Account</div>
              <div style={{ fontFamily: T.sans, fontSize: mobile ? "20px" : "24px", fontWeight: 700, color: T.text, letterSpacing: "-0.02em", marginBottom: "4px" }}>{account.name}</div>
              <div style={{ fontFamily: T.mono, fontSize: "11px", color: T.textDim }}>{account.vertical}</div>
            </div>
            <Tag label={account.stage} color={T.accent} bg={T.accentDim} />
          </div>

          <p style={{ fontFamily: T.sans, fontSize: "13px", color: T.textMuted, lineHeight: "1.6", margin: "0 0 16px 0" }}>{account.profile}</p>

          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: "10px" }}>
            <div style={{ padding: "12px 14px", background: T.bg, borderRadius: T.r, border: `1px solid ${T.borderSubtle}` }}>
              <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Old Motion</div>
              <p style={{ fontFamily: T.sans, fontSize: "12px", color: T.textMuted, lineHeight: "1.5", margin: 0 }}>{account.oldMotion}</p>
            </div>
            <div style={{ padding: "12px 14px", background: T.bg, borderRadius: T.r, border: `1px solid ${T.borderSubtle}` }}>
              <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Opportunity</div>
              <p style={{ fontFamily: T.sans, fontSize: "12px", color: T.textMuted, lineHeight: "1.5", margin: 0 }}>{account.opportunity}</p>
            </div>
          </div>
        </div>

        {/* NEW REALITY */}
        <div style={{ background: T.surface, borderRadius: T.r, border: `1px solid ${T.border}`, padding: mobile ? "14px" : "18px 22px", marginBottom: "14px" }}>
          <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>New Reality — AI is already in the org</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {account.newReality.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ color: T.accent, fontFamily: T.mono, fontSize: "10px", flexShrink: 0, paddingTop: "2px" }}>›</span>
                <span style={{ fontFamily: T.sans, fontSize: "13px", color: T.textMuted, lineHeight: "1.5" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TENSIONS + STAKEHOLDERS */}
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
          <div style={{ background: T.surface, borderRadius: T.r, border: `1px solid ${T.border}`, padding: mobile ? "14px" : "18px 22px" }}>
            <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.amber, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Tensions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {account.tensions.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ color: T.amber, fontFamily: T.mono, fontSize: "10px", flexShrink: 0, paddingTop: "2px" }}>!</span>
                  <span style={{ fontFamily: T.sans, fontSize: "12px", color: T.textMuted, lineHeight: "1.5" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: T.surface, borderRadius: T.r, border: `1px solid ${T.border}`, padding: mobile ? "14px" : "18px 22px" }}>
            <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Stakeholders</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {account.stakeholders.map((s, i) => (
                <div key={i}>
                  <FieldRow label={s.role} value={s.stake} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ICEBERG */}
        <IcebergPanel mobile={mobile} />

        {/* DISCOVERY */}
        <div id="section-discovery" style={{ scrollMarginTop: "100px" }}>
          <DiscoveryPanel mobile={mobile} />
        </div>

        {/* ENGAGEMENT */}
        <div id="section-engagement" style={{ scrollMarginTop: "100px" }}>
          <EngagementPanel mobile={mobile} />
        </div>

        {/* DELIVERY */}
        <div id="section-delivery" style={{ scrollMarginTop: "100px" }}>
          <DeliveryPanel mobile={mobile} />
        </div>

      </div>

      <footer style={{ marginTop: "auto", padding: mobile ? "28px 16px" : "32px 24px", borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <span style={{ fontFamily: T.mono, fontSize: "11px", color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Vantage · Account Cockpit</span>
        <span style={{ fontFamily: T.mono, fontSize: "11px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em" }}>HTEC</span>
      </footer>
    </div>
  );
}
