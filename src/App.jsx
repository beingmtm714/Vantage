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
            {["Account", "Discovery", "Engagement", "Delivery"].map(label => (
              <button key={label} style={{ padding: "0 18px", height: "44px", border: "none", background: "transparent", fontFamily: T.mono, fontSize: "11px", color: T.textMuted, cursor: "default", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0, opacity: 0.5 }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: `24px ${px}` }}>

        {/* ACCOUNT HEADER */}
        <div style={{ background: T.surface, borderRadius: T.r, border: `1px solid ${T.border}`, padding: mobile ? "16px" : "22px 24px", marginBottom: "20px" }}>
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

      </div>

      <footer style={{ marginTop: "auto", padding: mobile ? "28px 16px" : "32px 24px", borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <span style={{ fontFamily: T.mono, fontSize: "11px", color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Vantage · Account Cockpit</span>
        <span style={{ fontFamily: T.mono, fontSize: "11px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em" }}>HTEC</span>
      </footer>
    </div>
  );
}
