import styles from "../../styles";

export default function SummaryView({
  intake,
  summary,
  summaryLoading,
  error,
  onBackToChat,
  onRestart,
}) {
  return (
    <div style={styles.card}>
      {/* Heading */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 600 }}>
          📄 Case Summary
        </h2>
        <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
          A summary of your AI Public Defender consultation.
        </p>
      </div>

      {/* Meta row */}
      <div style={styles.summaryMeta}>
        <span>👤 {intake.name}</span>
        <span>⚖️ {intake.charge}</span>
        <span>📍 {intake.state}</span>
      </div>

      {/* Body */}
      {summaryLoading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={styles.spinner} />
          <p style={{ color: "#888", marginTop: 16 }}>
            Generating your case summary...
          </p>
        </div>
      ) : (
        <>
          <div style={styles.summaryBody}>
            {summary ? (
              summary
                .split("\n")
                .filter(Boolean)
                .map((line, i) => (
                  <p key={i} style={{ margin: "0 0 10px", lineHeight: 1.7 }}>
                    {line}
                  </p>
                ))
            ) : (
              <p style={{ color: "#999" }}>No summary available.</p>
            )}
          </div>

          {error && <div style={{ ...styles.errorBox, marginTop: 12 }}>{error}</div>}

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button style={styles.btnPrimary} onClick={onBackToChat}>
              ← Back to Chat
            </button>
            <button style={styles.btnOutline} onClick={onRestart}>
              Start New Case
            </button>
          </div>
        </>
      )}

      {/* Disclaimer */}
      <div style={styles.disclaimer}>
        ⚠️ This summary is for informational purposes only and does not
        constitute legal advice.
      </div>
    </div>
  );
}