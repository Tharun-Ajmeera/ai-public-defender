import { useState } from "react";

import Header from "./components/Header/Header";
import IntakeForm from "./components/IntakeForm/IntakeForm";
import ChatView from "./components/Chat/ChatView";
import SummaryView from "./components/Summary/SummaryView";

// ✅ UPDATED IMPORTS (No Claude anymore)
import { callAI, getSummary } from "./api/claude";

import styles from "./styles";

const INITIAL_INTAKE = { name: "", charge: "", state: "", details: "" };

export default function App() {
  const [stage, setStage] = useState("intake");
  const [intake, setIntake] = useState(INITIAL_INTAKE);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [error, setError] = useState("");

  // =========================
  // INTAKE SUBMIT
  // =========================
  const handleIntakeSubmit = () => {
    if (!intake.name.trim() || !intake.charge || !intake.state) {
      setError("Please fill in your name, charge, and state.");
      return;
    }

    setError("");
    setStage("chat");

    const greeting = `Hello ${intake.name}, I'm your AI Public Defender. I've reviewed your intake — you're facing a ${intake.charge} charge in ${intake.state}. I'm here to help you understand your rights, the legal process, and your options. What would you like to know first?`;

    setMessages([{ role: "assistant", content: greeting }]);
  };

  // =========================
  // SEND MESSAGE
  // =========================
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      // ✅ CALL BACKEND (Groq)
      const reply = await callAI(updatedMessages, intake);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ENTER KEY
  // =========================
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // =========================
  // GENERATE SUMMARY
  // =========================
  const generateSummary = async () => {
    setSummaryLoading(true);
    setStage("summary");
    setError("");
    setSummary("");

    try {
      // ✅ CALL BACKEND SUMMARY API
      const result = await getSummary(messages, intake);
      setSummary(result);
    } catch (err) {
      setError(`Could not generate summary: ${err.message}`);
    } finally {
      setSummaryLoading(false);
    }
  };

  // =========================
  // RESET
  // =========================
  const restart = () => {
    setStage("intake");
    setIntake(INITIAL_INTAKE);
    setMessages([]);
    setInput("");
    setSummary("");
    setError("");
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={styles.app}>
      <Header stage={stage} />

      <main style={styles.main}>
        {stage === "intake" && (
          <IntakeForm
            intake={intake}
            onChange={setIntake}
            onSubmit={handleIntakeSubmit}
            error={error}
          />
        )}

        {stage === "chat" && (
          <ChatView
            intake={intake}
            messages={messages}
            input={input}
            loading={loading}
            error={error}
            onInputChange={setInput}
            onSend={sendMessage}
            onKeyDown={handleKeyDown}
            onGenerateSummary={generateSummary}
            onRestart={restart}
          />
        )}

        {stage === "summary" && (
          <SummaryView
            intake={intake}
            summary={summary}
            summaryLoading={summaryLoading}
            error={error}
            onBackToChat={() => setStage("chat")}
            onRestart={restart}
          />
        )}
      </main>

      <footer style={styles.footer}>
        <p style={{ margin: 0, fontSize: 13, color: "#aaa" }}>
          AI Public Defender · Hackathon Ready 🚀
        </p>
      </footer>
    </div>
  );
}
