import styles from "../../styles";

const TIPS = [
  "You have the right to remain silent",
  "Don't consent to searches",
  "Ask for a lawyer immediately",
  "Document everything",
];

export default function ChatSidebar({ intake, messageCount, onGenerateSummary, onRestart }) {
  return (
    <aside style={styles.sidebar}>
      {/* Case info card */}
      <div style={{ ...styles.card, marginBottom: 12, padding: "16px 20px" }}>
        <h3 style={styles.sidebarHeading}>Your Case</h3>
        {[
          ["Name",   intake.name],
          ["Charge", intake.charge],
          ["State",  intake.state],
        ].map(([label, value]) => (
          <div key={label} style={styles.caseDetail}>
            <span style={{ color: "#888", fontSize: 12 }}>{label}</span>
            <strong style={{ fontSize: 13 }}>{value}</strong>
          </div>
        ))}
      </div>

      {/* Tips card */}
      <div style={{ ...styles.card, marginBottom: 12, padding: "16px 20px" }}>
        <h3 style={styles.sidebarHeading}>Quick Tips</h3>
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {TIPS.map((tip) => (
            <li
              key={tip}
              style={{
                fontSize: 13,
                color: "#555",
                marginBottom: 8,
                paddingLeft: 16,
                position: "relative",
              }}
            >
              <span style={{ position: "absolute", left: 0 }}>•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <button
        style={{ ...styles.btnOutline, width: "100%", marginBottom: 8 }}
        onClick={onGenerateSummary}
        disabled={messageCount < 3}
        title={messageCount < 3 ? "Chat a little more before generating a summary" : ""}
      >
        📄 Generate Summary
      </button>

      <button style={{ ...styles.btnGhost, width: "100%" }} onClick={onRestart}>
        ↩ Start Over
      </button>
    </aside>
  );
}