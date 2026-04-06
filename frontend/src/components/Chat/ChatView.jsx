import { useRef, useEffect } from "react";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import ChatSidebar from "./ChatSidebar";
import styles from "../../styles";

export default function ChatView({
  intake,
  messages,
  input,
  loading,
  error,
  onInputChange,
  onSend,
  onKeyDown,
  onGenerateSummary,
  onRestart,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div style={styles.chatLayout}>
      <ChatSidebar
        intake={intake}
        messageCount={messages.length}
        onGenerateSummary={onGenerateSummary}
        onRestart={onRestart}
      />

      {/* Main chat panel */}
      <div style={styles.chatMain}>
        {/* Message list */}
        <div style={styles.messagesContainer}>
          {messages.map((msg, i) => (
            <Message key={i} msg={msg} />
          ))}
          {loading && <TypingIndicator />}
          {error && (
            <div style={{ ...styles.errorBox, margin: "8px 0" }}>{error}</div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div style={styles.inputBar}>
          <textarea
            style={styles.chatInput}
            rows={2}
            placeholder="Ask about your rights, the charges, what to expect in court..."
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button
            style={{
              ...styles.btnSend,
              opacity: loading || !input.trim() ? 0.5 : 1,
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            }}
            onClick={onSend}
            disabled={loading || !input.trim()}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>

        <p style={{ fontSize: 12, color: "#aaa", margin: "6px 16px 10px", textAlign: "right" }}>
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}