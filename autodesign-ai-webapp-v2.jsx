import { useState, useRef, useEffect, useCallback } from "react";

// ── DESIGN DIRECTION: Industrial Precision ────────────────────────────────────
// Think: automotive engineering blueprints meets modern SaaS.
// Warm off-white background, deep navy sidebar, amber accents.
// Monospaced rule IDs, crisp data tables, surgical layout.
// ─────────────────────────────────────────────────────────────────────────────

const TEAM_MEMBERS = [
  { id: 1, name: "Arjun Mehta",    role: "Lead Designer",      avatar: "AM", color: "#D97706" },
  { id: 2, name: "Priya Nair",     role: "Brand Compliance",   avatar: "PN", color: "#0891B2" },
  { id: 3, name: "Rajan Das",      role: "Senior Designer",    avatar: "RD", color: "#7C3AED" },
  { id: 4, name: "Sowmya Krishn",  role: "UX Reviewer",        avatar: "SK", color: "#059669" },
];

const CURRENT_USER = TEAM_MEMBERS[0];

const INITIAL_RULES = [
  { id: "HDR-TYPO-001", category: "Typography", title: "Minimum Primary Headline Font Size", description: "Primary headlines must use a minimum font size of 24pt (32px) for digital displays and 18pt for print materials. Applies to model names, feature headlines, and campaign titles.", rationale: "Ensures readability at standard automotive showroom viewing distances of 3–5 meters.", severity: "critical", status: "active", version: "2.1", parameters: { digital_min_px: 32, print_min_pt: 18, viewing_distance_m: 3 }, lastEditedBy: "Priya Nair", lastEditedAt: "2024-12-10" },
  { id: "HDR-TYPO-002", category: "Typography", title: "Approved Headline Font Families", description: "Headlines must use only approved brand font families: Primary — 'AutoSans Pro' or 'Helvetica Neue'; Secondary fallback — 'Arial', 'system-ui'. Decorative fonts are prohibited without brand team approval.", rationale: "Maintains brand consistency across all vehicle communication materials globally.", severity: "major", status: "active", version: "1.3", parameters: { approved_primary: ["AutoSans Pro", "Helvetica Neue"], approved_fallback: ["Arial"], prohibited: ["Comic Sans", "Times New Roman"] }, lastEditedBy: "Arjun Mehta", lastEditedAt: "2024-11-22" },
  { id: "HDR-TYPO-003", category: "Typography", title: "Headline Letter Spacing (Tracking)", description: "Primary headlines must maintain a minimum letter-spacing of 0.02em. All-caps headlines require a minimum of 0.08em tracking. Negative letter-spacing is strictly prohibited.", rationale: "Proper tracking improves legibility, especially for all-caps model names at distance.", severity: "minor", status: "active", version: "1.0", parameters: { min_tracking_em: 0.02, all_caps_min_em: 0.08, negative_tracking: false }, lastEditedBy: "Rajan Das", lastEditedAt: "2024-10-05" },
  { id: "HDR-TYPO-004", category: "Typography", title: "Headline Line Height", description: "Headline line-height must be between 1.1 and 1.3 for single or multi-line headlines. Body copy under headlines must use a minimum line-height of 1.5.", rationale: "Optimal line-height prevents visual crowding in multi-line model descriptors.", severity: "minor", status: "active", version: "1.0", parameters: { headline_lh_min: 1.1, headline_lh_max: 1.3, body_lh_min: 1.5 }, lastEditedBy: "Sowmya Krishn", lastEditedAt: "2024-09-18" },
  { id: "HDR-COLOR-001", category: "Color", title: "Minimum Contrast Ratio — WCAG AA", description: "All headline text must achieve a minimum contrast ratio of 4.5:1 against its background for normal text, and 3:1 for large text (18pt+ or 14pt+ bold). Applies to all digital and print materials.", rationale: "WCAG AA compliance is legally required in many markets and ensures accessibility.", severity: "critical", status: "active", version: "2.0", parameters: { normal_text_ratio: 4.5, large_text_ratio: 3.0, standard: "WCAG 2.1 AA" }, lastEditedBy: "Priya Nair", lastEditedAt: "2025-01-03" },
  { id: "HDR-COLOR-002", category: "Color", title: "Approved Brand Color Palette", description: "Headlines must use only brand-approved hex values. Off-palette colors are prohibited without written approval from brand director.", rationale: "Color consistency reinforces brand recognition across markets.", severity: "major", status: "active", version: "1.1", parameters: { approved: ["#1A1A2E", "#E63946", "#F5F5F0", "#2563EB", "#FFFFFF"] }, lastEditedBy: "Arjun Mehta", lastEditedAt: "2024-12-20" },
  { id: "HDR-LAYOUT-001", category: "Layout", title: "Headline Clear Zone (Minimum Margin)", description: "A minimum 30px clear zone must surround all headline blocks on digital materials. No overlapping elements, images, or other copy within this zone.", rationale: "Clear zones prevent visual clutter around primary brand messaging.", severity: "major", status: "active", version: "1.2", parameters: { clear_zone_px: 30 }, lastEditedBy: "Rajan Das", lastEditedAt: "2024-08-14" },
  { id: "HDR-LAYOUT-002", category: "Layout", title: "Maximum Headline Line Length", description: "Headlines must not exceed 75 characters per line. Use CSS max-width: 75ch or line-break logic to enforce this.", rationale: "Limits excessive eye travel and maintains comfortable reading measure.", severity: "minor", status: "active", version: "1.0", parameters: { max_chars: 75 }, lastEditedBy: "Sowmya Krishn", lastEditedAt: "2024-07-30" },
  { id: "HDR-BRAND-001", category: "Branding", title: "Logo Proximity to Primary Headline", description: "The brand logo must appear within 80px of the primary headline on all digital and print materials. Logo must never be obscured or overlapped by headline text.", rationale: "Brand logo association with headlines reinforces recall and brand identity.", severity: "critical", status: "active", version: "1.5", parameters: { max_distance_px: 80, logo_overlap: false }, lastEditedBy: "Priya Nair", lastEditedAt: "2025-01-15" },
  { id: "HDR-SAFE-001", category: "Safety", title: "Safety Warning Label Placement", description: "Safety warning labels must appear directly below the primary headline, use minimum 12pt font, and must not be obscured by any design element.", rationale: "Regulatory requirement across all markets. Non-compliance can result in product recall.", severity: "critical", status: "active", version: "3.0", parameters: { min_size_pt: 12, placement: "below headline", obscured: false }, lastEditedBy: "Priya Nair", lastEditedAt: "2025-02-01" },
  { id: "HDR-DIGIT-001", category: "Digital", title: "Responsive Headline Scaling", description: "Headlines must scale proportionally across all viewport breakpoints from 320px to 1920px. Fluid typography using clamp() is strongly recommended.", rationale: "Ensures headline legibility on all device types used by customers.", severity: "major", status: "draft", version: "0.9", parameters: { min_viewport: 320, max_viewport: 1920, method: "CSS clamp()" }, lastEditedBy: "Rajan Das", lastEditedAt: "2025-02-10" },
  { id: "HDR-PRINT-001", category: "Print", title: "Print Bleed and Headline Safe Zone", description: "Headlines must be placed at least 5mm inside the print bleed line. No headline text within the bleed area.", rationale: "Prevents headline text from being cut during print trimming.", severity: "major", status: "active", version: "1.0", parameters: { safe_zone_mm: 5, bleed_area: "excluded" }, lastEditedBy: "Arjun Mehta", lastEditedAt: "2024-06-12" },
];

const INITIAL_PROCEDURES = [
  { id: "PROC-001", title: "New Model Headline Review", category: "Launch", status: "active", steps: [{ n: 1, title: "Submit to Brand Portal", detail: "Upload design file to the Brand Team portal with completed metadata form." }, { n: 2, title: "Automated Contrast Check", detail: "Run through contrast analyzer against HDR-COLOR-001. Document ratio." }, { n: 3, title: "Font Family Verification", detail: "Confirm all headline fonts match approved list in HDR-TYPO-002." }, { n: 4, title: "Clear Zone & Logo Proximity", detail: "Verify 30px clear zone (HDR-LAYOUT-001) and logo within 80px (HDR-BRAND-001)." }, { n: 5, title: "Safety Compliance Sign-off", detail: "Safety team reviews warning label placement per HDR-SAFE-001." }, { n: 6, title: "Publish to Asset Library", detail: "Approved assets uploaded to shared library with version tag." }], relatedRules: ["HDR-COLOR-001", "HDR-TYPO-002", "HDR-LAYOUT-001", "HDR-BRAND-001", "HDR-SAFE-001"], owner: "Priya Nair" },
  { id: "PROC-002", title: "Campaign Headline Approval", category: "Campaign", status: "active", steps: [{ n: 1, title: "Draft Copy within 75ch", detail: "Ensure headline copy does not exceed 75 characters (HDR-LAYOUT-002)." }, { n: 2, title: "Apply Approved Brand Fonts", detail: "Apply fonts from approved list per HDR-TYPO-002." }, { n: 3, title: "Verify Minimum Font Size", detail: "Confirm 32px minimum on digital assets (HDR-TYPO-001)." }, { n: 4, title: "Contrast Ratio Test", detail: "Run Contrast Analyzer and document passing ratio (HDR-COLOR-001)." }, { n: 5, title: "Marketing Lead Approval", detail: "Submit to marketing lead via Slack #design-approvals with evidence checklist." }], relatedRules: ["HDR-LAYOUT-002", "HDR-TYPO-001", "HDR-COLOR-001", "HDR-TYPO-002"], owner: "Arjun Mehta" },
  { id: "PROC-003", title: "Digital Display Compliance Check", category: "Digital", status: "active", steps: [{ n: 1, title: "Responsive Breakpoint Review", detail: "Test headline rendering at 320px, 768px, 1280px, 1920px viewports." }, { n: 2, title: "Verify clamp() Implementation", detail: "Confirm fluid typography using CSS clamp() per HDR-DIGIT-001 (draft)." }, { n: 3, title: "Screen Capture & Document", detail: "Take screenshots at all breakpoints and attach to review ticket." }], relatedRules: ["HDR-DIGIT-001", "HDR-TYPO-001"], owner: "Rajan Das" },
];

const CATEGORIES = ["All", "Typography", "Color", "Layout", "Branding", "Safety", "Digital", "Print"];
const SEV_META = { critical: { color: "#DC2626", bg: "#FEF2F2", label: "CRITICAL" }, major: { color: "#D97706", bg: "#FFFBEB", label: "MAJOR" }, minor: { color: "#2563EB", bg: "#EFF6FF", label: "MINOR" }, info: { color: "#64748B", bg: "#F8FAFC", label: "INFO" } };
const STATUS_META = { active: { color: "#059669", bg: "#ECFDF5" }, draft: { color: "#7C3AED", bg: "#F5F3FF" }, deprecated: { color: "#94A3B8", bg: "#F1F5F9" } };

// ── AI STREAMING SIMULATOR ────────────────────────────────────────────────────
async function* streamResponse(msg) {
  const q = msg.toLowerCase();
  let text = "", rules = [];

  if (q.includes("font") || q.includes("typo") || q.includes("typeface")) {
    text = "Typography compliance covers three active rules:\n\n[HDR-TYPO-001] Primary headlines require ≥32px on digital (18pt print) — CRITICAL.\n[HDR-TYPO-002] Only approved fonts: 'AutoSans Pro', 'Helvetica Neue', Arial fallback. Decorative fonts need brand team approval.\n[HDR-TYPO-003] Letter-spacing ≥0.02em; all-caps ≥0.08em. Negative tracking is strictly prohibited.\n[HDR-TYPO-004] Line-height between 1.1–1.3 for headlines.\n\nPaste your CSS into the Analyzer tab for an instant automated check.";
    rules = [{ id: "HDR-TYPO-001", v: false }, { id: "HDR-TYPO-002", v: false }, { id: "HDR-TYPO-003", v: false }];
  } else if (q.includes("contrast") || q.includes("color") || q.includes("colour") || q.includes("palette")) {
    text = "Color & contrast rules:\n\n[HDR-COLOR-001] CRITICAL — minimum 4.5:1 contrast ratio (normal text), 3:1 for large text (18pt+). WCAG 2.1 AA standard.\n[HDR-COLOR-002] Only approved brand hex values: #1A1A2E, #E63946, #F5F5F0, #2563EB, #FFFFFF. Off-palette requires written brand director approval.\n\nUse the Analyzer tab to check contrast ratios automatically.";
    rules = [{ id: "HDR-COLOR-001", v: true }, { id: "HDR-COLOR-002", v: false }];
  } else if (q.includes("safety") || q.includes("warning") || q.includes("label")) {
    text = "[HDR-SAFE-001] CRITICAL (v3.0, updated Feb 2025) — Safety warning labels must:\n• Appear directly below the primary headline\n• Use minimum 12pt font size\n• Never be obscured by any design element\n\nThis is a regulatory requirement across all markets. Non-compliance can result in product recall. This rule was last updated by Priya Nair on Feb 1, 2025.";
    rules = [{ id: "HDR-SAFE-001", v: false }];
  } else if (q.includes("logo") || q.includes("brand")) {
    text = "[HDR-BRAND-001] Logo must appear within 80px of the primary headline on all materials. Logo must never be overlapped by headline text.\n\nFor new model launches, refer to PROC-001 Step 4 which includes logo proximity as a mandatory checkpoint with documented evidence.";
    rules = [{ id: "HDR-BRAND-001", v: false }];
  } else if (q.includes("procedure") || q.includes("process") || q.includes("approval") || q.includes("workflow")) {
    text = "Three standard procedures are in the database:\n\nPROC-001 — New Model Headline Review (6 steps) — Owner: Priya Nair\nPROC-002 — Campaign Headline Approval (5 steps) — Owner: Arjun Mehta\nPROC-003 — Digital Display Compliance Check (3 steps) — Owner: Rajan Das\n\nFor new model launches, always start with PROC-001. Switch to the Rules DB tab to view full procedure step-by-step.";
    rules = [];
  } else if (q.includes("check") || q.includes("compliance") || q.includes("review") || q.includes("audit")) {
    text = "Running a quick compliance scan...\n\n✅ [HDR-TYPO-001] Font size — verify ≥32px on digital assets\n⚠️ [HDR-COLOR-001] Contrast ratio — needs hex values to verify 4.5:1\n✅ [HDR-LAYOUT-001] Clear zone — 30px minimum required around headline\n⚠️ [HDR-BRAND-001] Logo proximity — confirm within 80px manually\n✅ [HDR-SAFE-001] Safety label — confirm 12pt below headline\n\nFor a full automated check, paste your CSS/HTML in the Analyzer tab.";
    rules = [{ id: "HDR-TYPO-001", v: false }, { id: "HDR-COLOR-001", v: true }, { id: "HDR-BRAND-001", v: true }];
  } else {
    text = "I can help your team with:\n\n• Typography rules — font sizes, families, tracking, line-height\n• Color & contrast — WCAG compliance, brand palette\n• Layout — clear zones, max line length\n• Brand & safety — logo placement, warning labels\n• Procedures — step-by-step approval workflows\n• Compliance checks — paste CSS/HTML for instant analysis\n\nTry: \"Check my headline for compliance\" or \"What are the font rules?\"";
    rules = [];
  }

  for (let i = 0; i < text.length; i++) {
    yield { ch: text[i], done: false, rules };
    await new Promise(r => setTimeout(r, text[i] === "\n" ? 30 : 8));
  }
  yield { ch: "", done: true, rules };
}

// ── COMPLIANCE ANALYZER ───────────────────────────────────────────────────────
function runAnalysis(text) {
  const t = text.toLowerCase();
  const results = [];

  const fsPx = text.match(/font-size:\s*(\d+)px/i);
  if (fsPx) results.push({ rule: "HDR-TYPO-001", title: "Font Size", pass: parseInt(fsPx[1]) >= 32, detail: `${fsPx[1]}px detected — minimum 32px required`, sev: "critical" });

  const ff = text.match(/font-family:\s*([^;{]+)/i);
  if (ff) {
    const val = ff[1].toLowerCase();
    const ok = ["helvetica neue", "autosans pro", "arial"].some(f => val.includes(f));
    results.push({ rule: "HDR-TYPO-002", title: "Font Family", pass: ok, detail: ok ? "Approved font detected" : `Unapproved font — use Helvetica Neue or Arial`, sev: "major" });
  }

  const ls = text.match(/letter-spacing:\s*([-\d.]+)em/i);
  if (ls) results.push({ rule: "HDR-TYPO-003", title: "Letter Spacing", pass: parseFloat(ls[1]) >= 0.02, detail: `${ls[1]}em — minimum 0.02em required`, sev: "minor" });

  const lh = text.match(/line-height:\s*([\d.]+)/i);
  if (lh) { const v = parseFloat(lh[1]); results.push({ rule: "HDR-TYPO-004", title: "Line Height", pass: v >= 1.1 && v <= 1.3, detail: `${v} — must be between 1.1 and 1.3`, sev: "minor" }); }

  if (t.includes("logo")) results.push({ rule: "HDR-BRAND-001", title: "Logo Proximity", pass: null, detail: "Manually verify logo is within 80px of headline", sev: "critical" });
  if (t.includes("warning") || t.includes("safety")) results.push({ rule: "HDR-SAFE-001", title: "Safety Label", pass: null, detail: "Verify placement is directly below headline at ≥12pt", sev: "critical" });
  if (t.includes("color") || t.includes("background")) results.push({ rule: "HDR-COLOR-001", title: "Contrast Ratio", pass: null, detail: "Add hex color pairs to verify 4.5:1 ratio automatically", sev: "critical" });

  if (!results.length) results.push(
    { rule: "HDR-TYPO-001", title: "Font Size", pass: null, detail: "Include CSS font-size in px to detect", sev: "critical" },
    { rule: "HDR-COLOR-001", title: "Contrast Ratio", pass: null, detail: "Include color and background-color hex values", sev: "critical" },
    { rule: "HDR-LAYOUT-001", title: "Clear Zone", pass: null, detail: "Include margin/padding values to verify 30px clear zone", sev: "major" },
  );
  return results;
}

// ── SMALL COMPONENTS ──────────────────────────────────────────────────────────
const Avatar = ({ member, size = 30 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: member.color + "22", border: `1.5px solid ${member.color}55`, color: member.color, fontSize: size * 0.35, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", flexShrink: 0 }}>{member.avatar}</div>
);

const SevBadge = ({ sev }) => (
  <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "monospace", letterSpacing: "0.06em", color: SEV_META[sev].color, background: SEV_META[sev].bg, borderRadius: 4, padding: "2px 7px", border: `1px solid ${SEV_META[sev].color}33` }}>{SEV_META[sev].label}</span>
);

const StatusBadge = ({ status }) => (
  <span style={{ fontSize: 10, fontWeight: 600, color: STATUS_META[status].color, background: STATUS_META[status].bg, borderRadius: 20, padding: "2px 10px" }}>{status}</span>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [rules, setRules] = useState(INITIAL_RULES);
  const [procedures] = useState(INITIAL_PROCEDURES);
  const [messages, setMessages] = useState([{ role: "bot", text: "Hello, Arjun! I'm AutoDesign AI — your internal compliance assistant. I have access to all 12 rules and 3 procedures in your database. Ask me about any rule, run a compliance check, or ask about approval workflows.", rules: [] }]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [catFilter, setCatFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [newRule, setNewRule] = useState({ id: "", title: "", description: "", rationale: "", category: "Typography", severity: "major" });
  const [analyzeText, setAnalyzeText] = useState("");
  const [analyzeRes, setAnalyzeRes] = useState(null);
  const [showProcDetail, setShowProcDetail] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Chat ──────────────────────────────────────────────────────────────────
  const send = async () => {
    if (!input.trim() || streaming) return;
    const q = input.trim(); setInput(""); setStreaming(true);
    setMessages(p => [...p, { role: "user", text: q, rules: [] }, { role: "bot", text: "", rules: [] }]);
    let finalRules = [];
    for await (const chunk of streamResponse(q)) {
      if (!chunk.done) setMessages(p => { const n = [...p]; n[n.length - 1] = { ...n[n.length - 1], text: n[n.length - 1].text + chunk.ch }; return n; });
      else finalRules = chunk.rules;
    }
    setMessages(p => { const n = [...p]; n[n.length - 1] = { ...n[n.length - 1], rules: finalRules }; return n; });
    setStreaming(false);
  };

  // ── Rules CRUD ────────────────────────────────────────────────────────────
  const saveEdit = () => {
    setRules(p => p.map(r => r.id === editData.id ? { ...editData, lastEditedBy: CURRENT_USER.name, lastEditedAt: new Date().toISOString().slice(0, 10) } : r));
    setSelected(editData); setEditMode(false); showToast("Rule updated successfully");
  };
  const deleteRule = (id) => { setRules(p => p.filter(r => r.id !== id)); setSelected(null); setDeleteConfirm(null); showToast("Rule deleted", "error"); };
  const addRule = () => {
    if (!newRule.id || !newRule.title) return;
    const r = { ...newRule, status: "draft", version: "1.0", parameters: {}, rationale: newRule.rationale || "", lastEditedBy: CURRENT_USER.name, lastEditedAt: new Date().toISOString().slice(0, 10) };
    setRules(p => [...p, r]); setShowAdd(false); setNewRule({ id: "", title: "", description: "", rationale: "", category: "Typography", severity: "major" }); showToast("New rule added as draft");
  };

  const filtered = rules.filter(r => (catFilter === "All" || r.category === catFilter) && (r.title.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase())));
  const stats = { total: rules.length, critical: rules.filter(r => r.severity === "critical").length, active: rules.filter(r => r.status === "active").length, draft: rules.filter(r => r.status === "draft").length };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Mono', 'Fira Code', 'Courier New', monospace", background: "#F7F5F0", color: "#1C1917" }}>

      {/* ── TOP BAR ── */}
      <header style={{ background: "#1C1917", color: "#F7F5F0", display: "flex", alignItems: "center", padding: "0 0 0 0", height: 56, flexShrink: 0, borderBottom: "3px solid #D97706" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0, padding: "0 24px", borderRight: "1px solid #3C3530", height: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", color: "#D97706" }}>AUTODESIGN</span>
            <span style={{ fontSize: 9, letterSpacing: "0.2em", color: "#78716C" }}>COMPLIANCE SYSTEM</span>
          </div>
        </div>

        <nav style={{ display: "flex", height: "100%" }}>
          {[
            { id: "dashboard", label: "DASHBOARD" },
            { id: "chat",      label: "AI CHAT" },
            { id: "rules",     label: "RULES DB" },
            { id: "analyzer",  label: "ANALYZER" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ height: "100%", padding: "0 20px", border: "none", borderBottom: tab === t.id ? "3px solid #D97706" : "3px solid transparent", background: tab === t.id ? "#2C2520" : "none", color: tab === t.id ? "#D97706" : "#A8A29E", fontSize: 11, fontFamily: "inherit", letterSpacing: "0.12em", cursor: "pointer", transition: "all 0.15s" }}>{t.label}</button>
          ))}
        </nav>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16, padding: "0 20px" }}>
          <div style={{ display: "flex", gap: -4 }}>
            {TEAM_MEMBERS.map(m => <div key={m.id} title={m.name} style={{ marginLeft: -6 }}><Avatar member={m} size={28} /></div>)}
          </div>
          <div style={{ width: 1, height: 28, background: "#3C3530" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar member={CURRENT_USER} size={30} />
            <div>
              <div style={{ fontSize: 11, color: "#F7F5F0", fontWeight: 700 }}>{CURRENT_USER.name}</div>
              <div style={{ fontSize: 9, color: "#78716C", letterSpacing: "0.08em" }}>{CURRENT_USER.role.toUpperCase()}</div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>

        {/* ════════════════════════════════════════════════════
            DASHBOARD
        ════════════════════════════════════════════════════ */}
        {tab === "dashboard" && (
          <div style={{ flex: 1, overflowY: "auto", padding: 32 }}>
            <div style={{ maxWidth: 1140, margin: "0 auto" }}>

              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 4 }}>COMPLIANCE OVERVIEW</h1>
                <p style={{ fontSize: 12, color: "#78716C", letterSpacing: "0.04em" }}>AUTOMOBILE HEADLINE DESIGN — INTERNAL DASHBOARD — {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }).toUpperCase()}</p>
              </div>

              {/* Stat cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
                {[
                  { label: "TOTAL RULES", val: stats.total,    accent: "#1C1917" },
                  { label: "CRITICAL",    val: stats.critical, accent: "#DC2626" },
                  { label: "ACTIVE",      val: stats.active,   accent: "#059669" },
                  { label: "DRAFT",       val: stats.draft,    accent: "#7C3AED" },
                ].map(s => (
                  <div key={s.label} style={{ background: "white", border: "1px solid #E7E5E0", borderTop: `3px solid ${s.accent}`, borderRadius: 8, padding: "20px 24px" }}>
                    <div style={{ fontSize: 36, fontWeight: 700, color: s.accent, lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontSize: 10, color: "#78716C", letterSpacing: "0.12em", marginTop: 8 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, marginBottom: 24 }}>

                {/* Rules by category */}
                <div style={{ background: "white", border: "1px solid #E7E5E0", borderRadius: 8, padding: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#78716C", marginBottom: 20 }}>RULES BY CATEGORY</div>
                  {["Typography","Color","Layout","Branding","Safety","Digital","Print"].map(cat => {
                    const count = rules.filter(r => r.category === cat).length;
                    const crit  = rules.filter(r => r.category === cat && r.severity === "critical").length;
                    const pct   = Math.round((count / rules.length) * 100);
                    return (
                      <div key={cat} style={{ marginBottom: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                          <span style={{ color: "#1C1917", fontWeight: 600 }}>{cat}</span>
                          <span style={{ color: "#78716C" }}>{count} rules{crit > 0 ? ` · ${crit} critical` : ""}</span>
                        </div>
                        <div style={{ background: "#F7F5F0", borderRadius: 2, height: 6, overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: crit > 0 ? "#DC2626" : "#D97706", borderRadius: 2, transition: "width 0.8s" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Team activity */}
                <div style={{ background: "white", border: "1px solid #E7E5E0", borderRadius: 8, padding: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#78716C", marginBottom: 20 }}>RECENT EDITS</div>
                  {[...rules].sort((a, b) => new Date(b.lastEditedAt) - new Date(a.lastEditedAt)).slice(0, 6).map(r => {
                    const member = TEAM_MEMBERS.find(m => m.name === r.lastEditedBy) || TEAM_MEMBERS[0];
                    return (
                      <div key={r.id} onClick={() => { setSelected(r); setTab("rules"); }} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, cursor: "pointer" }}>
                        <Avatar member={member} size={28} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11, color: "#1C1917", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.id}</div>
                          <div style={{ fontSize: 10, color: "#78716C" }}>{r.lastEditedAt}</div>
                        </div>
                        <SevBadge sev={r.severity} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Procedures */}
              <div style={{ background: "white", border: "1px solid #E7E5E0", borderRadius: 8, padding: 24, marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#78716C", marginBottom: 20 }}>APPROVAL PROCEDURES</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                  {procedures.map(p => {
                    const owner = TEAM_MEMBERS.find(m => m.name === p.owner) || TEAM_MEMBERS[0];
                    return (
                      <div key={p.id} onClick={() => setShowProcDetail(p)} style={{ border: "1px solid #E7E5E0", borderRadius: 8, padding: 16, cursor: "pointer", transition: "border-color 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor="#D97706"}
                        onMouseLeave={e => e.currentTarget.style.borderColor="#E7E5E0"}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#D97706", letterSpacing: "0.1em" }}>{p.id}</span>
                          <span style={{ fontSize: 10, color: "#78716C" }}>{p.steps.length} steps</span>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", marginBottom: 10 }}>{p.title}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Avatar member={owner} size={22} />
                          <span style={{ fontSize: 10, color: "#78716C" }}>{p.owner}</span>
                        </div>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 10 }}>
                          {p.relatedRules.slice(0, 3).map(r => <span key={r} style={{ fontSize: 9, background: "#F7F5F0", color: "#78716C", borderRadius: 4, padding: "2px 6px" }}>{r}</span>)}
                          {p.relatedRules.length > 3 && <span style={{ fontSize: 9, color: "#78716C" }}>+{p.relatedRules.length - 3}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Critical Rules Alert */}
              <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, padding: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#DC2626", marginBottom: 14 }}>⚠ CRITICAL RULES — MANDATORY COMPLIANCE</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {rules.filter(r => r.severity === "critical").map(r => (
                    <div key={r.id} onClick={() => { setSelected(r); setTab("rules"); }} style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", padding: 8, borderRadius: 6, transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <span style={{ fontFamily: "monospace", fontSize: 11, color: "#DC2626", fontWeight: 700, flexShrink: 0 }}>{r.id}</span>
                      <span style={{ fontSize: 12, color: "#7F1D1D" }}>{r.title}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            AI CHAT
        ════════════════════════════════════════════════════ */}
        {tab === "chat" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: 760, width: "100%", margin: "0 auto", padding: "0 20px" }}>
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 0", display: "flex", flexDirection: "column", gap: 20 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                  {m.role === "bot" && (
                    <div style={{ fontSize: 10, color: "#78716C", letterSpacing: "0.1em", marginBottom: 6 }}>AUTODESIGN AI</div>
                  )}
                  {m.role === "user" && (
                    <div style={{ fontSize: 10, color: "#78716C", letterSpacing: "0.1em", marginBottom: 6 }}>{CURRENT_USER.name.toUpperCase()}</div>
                  )}
                  <div style={{
                    maxWidth: "80%",
                    background: m.role === "user" ? "#1C1917" : "white",
                    border: m.role === "user" ? "none" : "1px solid #E7E5E0",
                    borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "2px 12px 12px 12px",
                    padding: "12px 16px",
                    fontSize: 13,
                    lineHeight: 1.7,
                    color: m.role === "user" ? "#F7F5F0" : "#1C1917",
                    whiteSpace: "pre-wrap",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  }}>
                    {m.text}
                    {i === messages.length - 1 && streaming && <span style={{ opacity: 0.4 }}>▋</span>}
                  </div>
                  {m.rules?.length > 0 && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 7 }}>
                      {m.rules.map(r => (
                        <span key={r.id} onClick={() => { setSelected(rules.find(x => x.id === r.id)); setTab("rules"); }} style={{ fontSize: 10, fontFamily: "monospace", background: r.v ? "#FEF2F2" : "#ECFDF5", color: r.v ? "#DC2626" : "#059669", border: `1px solid ${r.v ? "#FCA5A5" : "#6EE7B7"}`, borderRadius: 4, padding: "2px 8px", cursor: "pointer" }}>
                          {r.v ? "⚠" : "✓"} {r.id}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {messages.length === 1 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                {["What are the font rules?", "Check my headline for compliance", "Explain the approval procedure", "What contrast ratio is required?", "Safety label placement rules"].map(p => (
                  <button key={p} onClick={() => setInput(p)} style={{ background: "white", border: "1px solid #E7E5E0", color: "#78716C", fontSize: 11, padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit" }}>{p}</button>
                ))}
              </div>
            )}

            <div style={{ borderTop: "1px solid #E7E5E0", padding: "14px 0", display: "flex", gap: 10 }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Ask about any rule, procedure, or compliance requirement..."
                style={{ flex: 1, background: "white", border: "1px solid #D6D3CC", borderRadius: 8, padding: "11px 14px", color: "#1C1917", fontSize: 13, fontFamily: "inherit", outline: "none" }} />
              <button onClick={send} disabled={streaming || !input.trim()}
                style={{ background: streaming || !input.trim() ? "#E7E5E0" : "#1C1917", border: "none", borderRadius: 8, width: 44, height: 44, cursor: streaming || !input.trim() ? "not-allowed" : "pointer", color: streaming || !input.trim() ? "#A8A29E" : "#D97706", fontSize: 16 }}>
                ➤
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            RULES DATABASE
        ════════════════════════════════════════════════════ */}
        {tab === "rules" && (
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

            {/* List pane */}
            <div style={{ width: 380, borderRight: "1px solid #E7E5E0", display: "flex", flexDirection: "column", background: "white", flexShrink: 0 }}>
              <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #E7E5E0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#78716C" }}>RULES DB — {filtered.length} / {rules.length}</span>
                  <button onClick={() => setShowAdd(true)} style={{ background: "#1C1917", border: "none", color: "#D97706", fontSize: 11, padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.06em" }}>+ ADD RULE</button>
                </div>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search rules..."
                  style={{ width: "100%", background: "#F7F5F0", border: "1px solid #E7E5E0", borderRadius: 6, padding: "8px 10px", fontSize: 12, fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: 8 }} />
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {CATEGORIES.map(c => (
                    <button key={c} onClick={() => setCatFilter(c)} style={{ background: catFilter === c ? "#1C1917" : "#F7F5F0", border: "none", color: catFilter === c ? "#D97706" : "#78716C", borderRadius: 20, padding: "3px 10px", fontSize: 10, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.06em" }}>{c.toUpperCase()}</button>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1, overflowY: "auto" }}>
                {filtered.map(r => (
                  <div key={r.id} onClick={() => { setSelected(r); setEditMode(false); }}
                    style={{ padding: "12px 16px", borderBottom: "1px solid #F0EDE8", cursor: "pointer", background: selected?.id === r.id ? "#FFF8EF" : "white", borderLeft: selected?.id === r.id ? "3px solid #D97706" : "3px solid transparent", transition: "all 0.12s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "monospace", color: "#D97706", letterSpacing: "0.06em" }}>{r.id}</span>
                      <div style={{ display: "flex", gap: 4 }}>
                        <SevBadge sev={r.severity} />
                        <StatusBadge status={r.status} />
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: "#1C1917", fontWeight: 600, marginBottom: 3 }}>{r.title}</div>
                    <div style={{ fontSize: 10, color: "#A8A29E" }}>{r.category} · v{r.version} · {r.lastEditedBy}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detail pane */}
            <div style={{ flex: 1, overflowY: "auto", background: "#F7F5F0" }}>
              {selected ? (
                <div style={{ padding: 32, maxWidth: 720 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#D97706", letterSpacing: "0.12em", marginBottom: 6 }}>{selected.id}</div>
                      {editMode
                        ? <input value={editData.title} onChange={e => setEditData(p => ({ ...p, title: e.target.value }))} style={{ fontSize: 20, fontWeight: 700, background: "white", border: "1px solid #D97706", borderRadius: 6, padding: "6px 10px", width: "100%", fontFamily: "inherit", outline: "none" }} />
                        : <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1C1917", marginBottom: 10 }}>{selected.title}</h2>
                      }
                      <div style={{ display: "flex", gap: 8 }}>
                        <SevBadge sev={selected.severity} />
                        <StatusBadge status={selected.status} />
                        <span style={{ fontSize: 10, color: "#78716C", background: "#F0EDE8", borderRadius: 4, padding: "2px 8px" }}>{selected.category}</span>
                        <span style={{ fontSize: 10, color: "#78716C", background: "#F0EDE8", borderRadius: 4, padding: "2px 8px" }}>v{selected.version}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {!editMode ? (
                        <>
                          <button onClick={() => { setEditMode(true); setEditData({ ...selected }); }} style={{ background: "white", border: "1px solid #E7E5E0", color: "#1C1917", fontSize: 11, padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit" }}>✎ EDIT</button>
                          <button onClick={() => setDeleteConfirm(selected.id)} style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#DC2626", fontSize: 11, padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit" }}>✕ DELETE</button>
                        </>
                      ) : (
                        <>
                          <button onClick={saveEdit} style={{ background: "#059669", border: "none", color: "white", fontSize: 11, padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit" }}>✓ SAVE</button>
                          <button onClick={() => setEditMode(false)} style={{ background: "white", border: "1px solid #E7E5E0", color: "#78716C", fontSize: 11, padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit" }}>CANCEL</button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div style={{ background: "white", border: "1px solid #E7E5E0", borderRadius: 8, padding: 20, marginBottom: 16 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#78716C", marginBottom: 10 }}>DESCRIPTION</div>
                    {editMode
                      ? <textarea value={editData.description} onChange={e => setEditData(p => ({ ...p, description: e.target.value }))} rows={4} style={{ width: "100%", background: "#F7F5F0", border: "1px solid #E7E5E0", borderRadius: 6, padding: "8px 10px", fontSize: 13, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: 1.6 }} />
                      : <p style={{ fontSize: 13, color: "#44403C", lineHeight: 1.7, margin: 0 }}>{selected.description}</p>
                    }
                  </div>

                  {/* Rationale */}
                  {selected.rationale && (
                    <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: 16, marginBottom: 16 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#D97706", marginBottom: 8 }}>RATIONALE</div>
                      <p style={{ fontSize: 12, color: "#78350F", lineHeight: 1.6, margin: 0 }}>{selected.rationale}</p>
                    </div>
                  )}

                  {/* Parameters */}
                  {Object.keys(selected.parameters).length > 0 && (
                    <div style={{ background: "white", border: "1px solid #E7E5E0", borderRadius: 8, padding: 20, marginBottom: 16 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#78716C", marginBottom: 14 }}>PARAMETERS</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
                        {Object.entries(selected.parameters).map(([k, v]) => (
                          <div key={k} style={{ background: "#F7F5F0", borderRadius: 6, padding: "10px 14px" }}>
                            <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "#A8A29E", marginBottom: 4 }}>{k.replace(/_/g, " ").toUpperCase()}</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", fontFamily: "monospace" }}>{Array.isArray(v) ? v.join(", ") : String(v)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div style={{ display: "flex", gap: 10, fontSize: 11, color: "#78716C" }}>
                    <span>Last edited by <strong>{selected.lastEditedBy}</strong></span>
                    <span>·</span>
                    <span>{selected.lastEditedAt}</span>
                    <span>·</span>
                    <span>Version {selected.version}</span>
                  </div>
                </div>
              ) : (
                <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#A8A29E" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>⊡</div>
                  <p style={{ fontSize: 12, letterSpacing: "0.1em" }}>SELECT A RULE TO VIEW DETAILS</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            COMPLIANCE ANALYZER
        ════════════════════════════════════════════════════ */}
        {tab === "analyzer" && (
          <div style={{ flex: 1, overflowY: "auto", padding: 32, background: "#F7F5F0" }}>
            <div style={{ maxWidth: 1000, margin: "0 auto" }}>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 4 }}>COMPLIANCE ANALYZER</h1>
                <p style={{ fontSize: 12, color: "#78716C" }}>Paste CSS, HTML, or design specs below for an instant rules-database check.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#78716C", marginBottom: 8 }}>DESIGN CODE / SPECS</div>
                  <textarea value={analyzeText} onChange={e => setAnalyzeText(e.target.value)} rows={16}
                    placeholder={`.headline {\n  font-family: Helvetica Neue, Arial, sans-serif;\n  font-size: 36px;\n  letter-spacing: 0.04em;\n  line-height: 1.2;\n  color: #1A1A2E;\n  background-color: #F5F5F0;\n  /* logo present */\n  /* safety warning below */\n}`}
                    style={{ width: "100%", background: "white", border: "1px solid #E7E5E0", borderRadius: 8, padding: 16, fontFamily: "monospace", fontSize: 12, resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: 1.6, color: "#1C1917" }} />
                  <button onClick={() => setAnalyzeRes(runAnalysis(analyzeText))} disabled={!analyzeText.trim()}
                    style={{ marginTop: 12, width: "100%", background: analyzeText.trim() ? "#1C1917" : "#E7E5E0", border: "none", color: analyzeText.trim() ? "#D97706" : "#A8A29E", borderRadius: 8, padding: "12px", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "inherit", cursor: analyzeText.trim() ? "pointer" : "not-allowed" }}>
                    ▶ RUN COMPLIANCE CHECK
                  </button>
                  <div style={{ marginTop: 12, background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: 14 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#D97706", letterSpacing: "0.1em", marginBottom: 8 }}>WHAT TO INCLUDE FOR BEST RESULTS</div>
                    {["font-size in px", "font-family value", "letter-spacing in em", "line-height value", "color and background-color", "mention 'logo' if present", "mention 'warning'/'safety' if relevant"].map(t => (
                      <div key={t} style={{ fontSize: 11, color: "#78350F", marginBottom: 4 }}>→ {t}</div>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#78716C", marginBottom: 8 }}>ANALYSIS RESULTS</div>
                  {analyzeRes ? (
                    <div>
                      {/* Summary row */}
                      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                        {[{ l: "PASS", n: analyzeRes.filter(r => r.pass === true).length, c: "#059669", bg: "#ECFDF5" },
                          { l: "FAIL", n: analyzeRes.filter(r => r.pass === false).length, c: "#DC2626", bg: "#FEF2F2" },
                          { l: "MANUAL", n: analyzeRes.filter(r => r.pass === null).length, c: "#7C3AED", bg: "#F5F3FF" }].map(s => (
                          <div key={s.l} style={{ flex: 1, background: s.bg, border: `1px solid ${s.c}33`, borderRadius: 8, padding: "10px 0", textAlign: "center" }}>
                            <div style={{ fontSize: 24, fontWeight: 700, color: s.c }}>{s.n}</div>
                            <div style={{ fontSize: 9, color: s.c, letterSpacing: "0.12em" }}>{s.l}</div>
                          </div>
                        ))}
                      </div>

                      {analyzeRes.map((r, i) => (
                        <div key={i} onClick={() => { setSelected(rules.find(x => x.id === r.rule)); setTab("rules"); }}
                          style={{ background: "white", border: `1px solid ${r.pass === true ? "#6EE7B7" : r.pass === false ? "#FCA5A5" : "#C4B5FD"}`, borderRadius: 8, padding: "12px 16px", marginBottom: 10, cursor: "pointer" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 16 }}>{r.pass === true ? "✅" : r.pass === false ? "❌" : "🔍"}</span>
                              <span style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 700, color: "#D97706" }}>{r.rule}</span>
                              <span style={{ fontSize: 12, fontWeight: 600, color: "#1C1917" }}>{r.title}</span>
                            </div>
                            <SevBadge sev={r.sev} />
                          </div>
                          <p style={{ fontSize: 11, color: "#78716C", margin: 0 }}>{r.detail}</p>
                        </div>
                      ))}

                      <button onClick={() => { setInput("Here are my analyzer results. Help me fix the violations."); setTab("chat"); }}
                        style={{ width: "100%", background: "white", border: "1px solid #D97706", color: "#D97706", borderRadius: 8, padding: 10, fontSize: 11, fontFamily: "inherit", fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer" }}>
                        ASK AI TO HELP FIX VIOLATIONS →
                      </button>
                    </div>
                  ) : (
                    <div style={{ height: 380, background: "white", border: "1px dashed #E7E5E0", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#A8A29E" }}>
                      <div style={{ fontSize: 32, marginBottom: 10 }}>⊡</div>
                      <p style={{ fontSize: 11, letterSpacing: "0.1em" }}>RESULTS APPEAR HERE</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── ADD RULE MODAL ── */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "#00000066", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "white", border: "1px solid #E7E5E0", borderRadius: 12, padding: 32, width: 500, maxWidth: "90vw", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.1em" }}>ADD NEW RULE</h3>
              <button onClick={() => setShowAdd(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#78716C" }}>×</button>
            </div>
            {[{ l: "RULE CODE", k: "id", ph: "e.g. HDR-TYPO-005" }, { l: "TITLE", k: "title", ph: "Short rule name" }, { l: "DESCRIPTION", k: "description", ph: "Full description..." }, { l: "RATIONALE", k: "rationale", ph: "Why this rule exists..." }].map(f => (
              <div key={f.k} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#78716C", display: "block", marginBottom: 6 }}>{f.l}</label>
                {f.k === "description" || f.k === "rationale" ? (
                  <textarea value={newRule[f.k]} onChange={e => setNewRule(p => ({ ...p, [f.k]: e.target.value }))} placeholder={f.ph} rows={3}
                    style={{ width: "100%", background: "#F7F5F0", border: "1px solid #E7E5E0", borderRadius: 6, padding: "8px 10px", fontFamily: "inherit", fontSize: 12, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
                ) : (
                  <input value={newRule[f.k]} onChange={e => setNewRule(p => ({ ...p, [f.k]: e.target.value }))} placeholder={f.ph}
                    style={{ width: "100%", background: "#F7F5F0", border: "1px solid #E7E5E0", borderRadius: 6, padding: "8px 10px", fontFamily: "inherit", fontSize: 12, outline: "none", boxSizing: "border-box" }} />
                )}
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[{ l: "CATEGORY", k: "category", opts: ["Typography","Color","Layout","Branding","Safety","Digital","Print"] },
                { l: "SEVERITY", k: "severity", opts: ["critical","major","minor","info"] }].map(s => (
                <div key={s.k}>
                  <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#78716C", display: "block", marginBottom: 6 }}>{s.l}</label>
                  <select value={newRule[s.k]} onChange={e => setNewRule(p => ({ ...p, [s.k]: e.target.value }))} style={{ width: "100%", background: "#F7F5F0", border: "1px solid #E7E5E0", borderRadius: 6, padding: "8px 10px", fontFamily: "inherit", fontSize: 12, outline: "none" }}>
                    {s.opts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, background: "#F7F5F0", border: "1px solid #E7E5E0", borderRadius: 8, padding: 11, cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>CANCEL</button>
              <button onClick={addRule} disabled={!newRule.id || !newRule.title} style={{ flex: 1, background: newRule.id && newRule.title ? "#1C1917" : "#E7E5E0", border: "none", color: newRule.id && newRule.title ? "#D97706" : "#A8A29E", borderRadius: 8, padding: 11, cursor: newRule.id && newRule.title ? "pointer" : "not-allowed", fontFamily: "inherit", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em" }}>ADD RULE</button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ── */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "#00000066", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "white", border: "1px solid #FCA5A5", borderRadius: 12, padding: 28, width: 380, textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>⚠</div>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>DELETE {deleteConfirm}?</h3>
            <p style={{ fontSize: 12, color: "#78716C", marginBottom: 20 }}>This action cannot be undone. The rule will be permanently removed from the database.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, background: "#F7F5F0", border: "1px solid #E7E5E0", borderRadius: 8, padding: 10, cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>CANCEL</button>
              <button onClick={() => deleteRule(deleteConfirm)} style={{ flex: 1, background: "#DC2626", border: "none", color: "white", borderRadius: 8, padding: 10, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 700 }}>DELETE</button>
            </div>
          </div>
        </div>
      )}

      {/* ── PROCEDURE DETAIL MODAL ── */}
      {showProcDetail && (
        <div style={{ position: "fixed", inset: 0, background: "#00000066", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "white", border: "1px solid #E7E5E0", borderRadius: 12, padding: 32, width: 540, maxWidth: "90vw", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#D97706", letterSpacing: "0.12em", marginBottom: 4 }}>{showProcDetail.id}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>{showProcDetail.title}</h3>
              </div>
              <button onClick={() => setShowProcDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#78716C" }}>×</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <Avatar member={TEAM_MEMBERS.find(m => m.name === showProcDetail.owner) || TEAM_MEMBERS[0]} size={26} />
              <span style={{ fontSize: 11, color: "#78716C" }}>Owner: {showProcDetail.owner}</span>
            </div>
            {showProcDetail.steps.map(s => (
              <div key={s.n} style={{ display: "flex", gap: 14, marginBottom: 18 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1C1917", color: "#D97706", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.n}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: "#78716C", lineHeight: 1.6 }}>{s.detail}</div>
                </div>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #E7E5E0", paddingTop: 16, marginTop: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#78716C", marginBottom: 8 }}>RELATED RULES</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {showProcDetail.relatedRules.map(r => (
                  <span key={r} onClick={() => { setSelected(rules.find(x => x.id === r)); setTab("rules"); setShowProcDetail(null); }} style={{ fontSize: 11, fontFamily: "monospace", background: "#FFF8EF", color: "#D97706", border: "1px solid #FDE68A", borderRadius: 4, padding: "3px 10px", cursor: "pointer" }}>{r}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: toast.type === "error" ? "#DC2626" : "#059669", color: "white", borderRadius: 8, padding: "12px 20px", fontSize: 12, fontWeight: 600, fontFamily: "monospace", letterSpacing: "0.06em", zIndex: 200, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", animation: "fadeIn 0.2s ease" }}>
          {toast.type === "error" ? "✕" : "✓"} {toast.msg}
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; scrollbar-width: thin; scrollbar-color: #E7E5E0 transparent; }
        *::-webkit-scrollbar { width: 4px; }
        *::-webkit-scrollbar-thumb { background: #E7E5E0; border-radius: 4px; }
        input::placeholder, textarea::placeholder { color: #C4BDB5; }
        select option { background: white; color: #1C1917; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
