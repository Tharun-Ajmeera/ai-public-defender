import styles from "../../styles";

export default function Message({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div style={styles.messageRow(msg.role)}>
      {/* Assistant avatar */}
      {!isUser && <div style={styles.avatar}>⚖️</div>}

      {/* Bubble */}
      <div style={styles.bubble(msg.role)}>
        {msg.content
          .split("\n")
          .filter(Boolean)
          .map((line, i) => (
            <p key={i} style={{ margin: "0 0 6px 0", lineHeight: 1.6 }}>
              {line}
            </p>
          ))}
      </div>

      {/* User avatar */}
      {isUser && (
        <div style={{ ...styles.avatar, background: "#e8f4fd" }}>👤</div>
      )}
    </div>
  );
}