const styles = {
  // ── Layout ──────────────────────────────────────────────────────────────
  app: {
    fontFamily: "'Inter', -apple-system, sans-serif",
    minHeight: "100vh",
    background: "#f7f8fc",
    display: "flex",
    flexDirection: "column",
  },

  // ── Header ───────────────────────────────────────────────────────────────
  header: {
    background: "#fff",
    borderBottom: "1px solid #e8e8e8",
    padding: "0 24px",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  headerInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 0",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  logoTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: "-0.5px",
  },
  tagline: {
    margin: 0,
    fontSize: 12,
    color: "#888",
  },
  badge: (bg, color) => ({
    background: bg,
    color,
    fontSize: 12,
    fontWeight: 500,
    padding: "4px 10px",
    borderRadius: 20,
  }),

  // ── Stage Bar ─────────────────────────────────────────────────────────────
  stageBar: {
    display: "flex",
    gap: 0,
    borderTop: "1px solid #f0f0f0",
  },
  stageStep: (isActive, isDone) => ({
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 20px",
    borderBottom: isActive ? "2px solid #4f8ef7" : "2px solid transparent",
    color: isActive ? "#4f8ef7" : isDone ? "#2b7a4b" : "#aaa",
    fontSize: 13,
    cursor: "default",
    transition: "all 0.2s",
  }),
  stepNum: (isActive, isDone) => ({
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: isActive ? "#4f8ef7" : isDone ? "#2b7a4b" : "#e0e0e0",
    color: isActive || isDone ? "#fff" : "#999",
    fontSize: 11,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),

  // ── Main content area ─────────────────────────────────────────────────────
  main: {
    flex: 1,
    padding: "32px 24px",
    maxWidth: 1100,
    width: "100%",
    margin: "0 auto",
    boxSizing: "border-box",
  },

  // ── Shared card ───────────────────────────────────────────────────────────
  card: {
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #e8e8e8",
    padding: "28px 32px",
    maxWidth: 640,
    margin: "0 auto",
  },

  // ── Form elements ─────────────────────────────────────────────────────────
  formRow: {
    marginBottom: 20,
  },
  label: {
    display: "block",
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 6,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    fontSize: 14,
    border: "1px solid #ddd",
    borderRadius: 8,
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    color: "#333",
  },

  // ── Buttons ───────────────────────────────────────────────────────────────
  btnPrimary: {
    width: "100%",
    padding: "12px 24px",
    background: "#4f8ef7",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 8,
  },
  btnOutline: {
    padding: "10px 20px",
    background: "transparent",
    color: "#4f8ef7",
    border: "1px solid #4f8ef7",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
  },
  btnGhost: {
    padding: "10px 20px",
    background: "transparent",
    color: "#888",
    border: "1px solid #e0e0e0",
    borderRadius: 8,
    fontSize: 14,
    cursor: "pointer",
  },
  btnSend: {
    padding: "10px 20px",
    background: "#4f8ef7",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  // ── Feedback / alerts ─────────────────────────────────────────────────────
  errorBox: {
    background: "#fff5f5",
    border: "1px solid #fcc",
    color: "#c0392b",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    marginBottom: 12,
  },
  disclaimer: {
    marginTop: 20,
    padding: "10px 14px",
    background: "#fffbea",
    border: "1px solid #ffe082",
    borderRadius: 8,
    fontSize: 13,
    color: "#7a6000",
  },

  // ── Chat layout ───────────────────────────────────────────────────────────
  chatLayout: {
    display: "flex",
    gap: 20,
    height: "calc(100vh - 180px)",
    maxWidth: 1100,
    margin: "0 auto",
  },
  sidebar: {
    width: 220,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
  },
  sidebarHeading: {
    margin: "0 0 12px",
    fontSize: 13,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#aaa",
  },
  caseDetail: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 10,
  },
  chatMain: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #e8e8e8",
    overflow: "hidden",
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
  },

  // ── Message bubbles ───────────────────────────────────────────────────────
  messageRow: (role) => ({
    display: "flex",
    flexDirection: role === "user" ? "row-reverse" : "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 16,
  }),
  avatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "#eef4ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    flexShrink: 0,
  },
  bubble: (role) => ({
    maxWidth: "72%",
    padding: "12px 16px",
    borderRadius: role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
    background: role === "user" ? "#4f8ef7" : "#f4f6f9",
    color: role === "user" ? "#fff" : "#333",
    fontSize: 14,
    lineHeight: 1.6,
  }),

  // ── Typing indicator ──────────────────────────────────────────────────────
  typingDots: {
    display: "flex",
    gap: 5,
    alignItems: "center",
    height: 16,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#aaa",
    display: "inline-block",
    animation: "bounce 1.2s infinite",
  },

  // ── Input bar ─────────────────────────────────────────────────────────────
  inputBar: {
    display: "flex",
    gap: 10,
    padding: "14px 20px",
    borderTop: "1px solid #eee",
    alignItems: "flex-end",
  },
  chatInput: {
    flex: 1,
    padding: "10px 14px",
    fontSize: 14,
    border: "1px solid #ddd",
    borderRadius: 8,
    resize: "none",
    outline: "none",
    fontFamily: "inherit",
    lineHeight: 1.5,
  },

  // ── Summary ───────────────────────────────────────────────────────────────
  summaryMeta: {
    display: "flex",
    gap: 16,
    marginBottom: 20,
    flexWrap: "wrap",
    fontSize: 14,
    color: "#555",
  },
  summaryBody: {
    background: "#f8f9fb",
    borderRadius: 8,
    padding: "20px 24px",
    fontSize: 14,
    lineHeight: 1.8,
    color: "#333",
    minHeight: 100,
  },
  spinner: {
    width: 36,
    height: 36,
    border: "3px solid #e0e0e0",
    borderTop: "3px solid #4f8ef7",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    margin: "0 auto",
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    textAlign: "center",
    padding: "20px 24px",
    borderTop: "1px solid #eee",
    background: "#fff",
  },
};

export default styles;