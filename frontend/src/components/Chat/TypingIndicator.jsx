import styles from "../../styles";

export default function TypingIndicator() {
  return (
    <div style={styles.messageRow("assistant")}>
      <div style={styles.avatar}>⚖️</div>
      <div style={{ ...styles.bubble("assistant"), padding: "14px 18px" }}>
        <div style={styles.typingDots}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{ ...styles.dot, animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}