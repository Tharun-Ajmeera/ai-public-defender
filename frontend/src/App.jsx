import { useState, useRef, useEffect } from "react";
import "./App.css";

const STAGES = ["intake", "chat", "summary"];

const CHARGE_OPTIONS = [
  "Theft / Shoplifting",
  "Drug Possession",
  "DUI / DWI",
  "Assault",
  "Trespassing",
  "Disorderly Conduct",
  "Vandalism",
  "Traffic Violation",
  "Domestic Dispute",
  "Other",
];

function TypingIndicator() {
  return (
    <div className="message assistant typing">
      <div className="avatar">⚖️</div>
      <div className="bubble typing-bubble">
        <span /><span /><span />
      </div>
    </div>
  );
}

function Message({ msg }) {
  return (
    <div className={`message ${msg.role}`}>
      {msg.role === "assistant" && <div className="avatar">⚖️</div>}
      <div className="bubble">
        {msg.content.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      {msg.role === "user" && <div className="avatar user-avatar">👤</div>}
    </div>
  );
}

export default function App() {
  const [stage, setStage] = useState("intake");
  const [intake, setIntake] = useState({ name: "", charge: "", state: "", details: "" });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleIntakeSubmit = async (e) => {
    e.preventDefault();
    if (!intake.name || !intake.charge || !intake.state) {
      setError("Please fill in your name, charge, and state.");
      return;
    }
    setError("");
    setStage("chat");
    const systemGreeting = `Hello ${intake.name}, I'm your AI Public Defender. I've reviewed your intake information — you're facing a charge of ${intake.charge} in ${intake.state}. I'm here to help you understand your rights, the legal process, and what options may be available to you. Everything you share is confidential. What would you like to know first?`;
    setMessages([{ role: "assistant", content: systemGreeting }]);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, intake }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError("Connection error. Make sure your backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const generateSummary = async () => {
    setSummaryLoading(true);
    setStage("summary");
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, intake }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      setError("Could not generate summary. Check your backend.");
      setSummary("");
    } finally {
      setSummaryLoading(false);
    }
  };

  const restart = () => {
    setStage("intake");
    setIntake({ name: "", charge: "", state: "", details: "" });
    setMessages([]);
    setInput("");
    setSummary("");
    setError("");
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">⚖️</span>
            <div>
              <h1>PublicDefender<span className="logo-ai">.ai</span></h1>
              <p className="tagline">Know your rights. Free. Now.</p>
            </div>
          </div>
          <div className="header-badges">
            <span className="badge">Confidential</span>
            <span className="badge badge-green">Free Access</span>
          </div>
        </div>
        <div className="stage-bar">
          {["intake", "chat", "summary"].map((s, i) => (
            <div key={s} className={`stage-step ${stage === s ? "active" : STAGES.indexOf(stage) > i ? "done" : ""}`}>
              <span className="step-num">{i + 1}</span>
              <span className="step-label">{s === "intake" ? "Your Info" : s === "chat" ? "Consultation" : "Summary"}</span>
            </div>
          ))}
        </div>
      </header>

      <main className="main">
        {stage === "intake" && (
          <div className="card intake-card">
            <div className="card-header">
              <h2>Begin Your Free Consultation</h2>
              <p>Your information is private and never stored. Fill in the basics so your AI defender can help you.</p>
            </div>
            <form onSubmit={handleIntakeSubmit} className="intake-form">
              <div className="form-row">
                <label>Full Name *</label>
                <input type="text" placeholder="e.g. Jordan Lee" value={intake.name} onChange={(e) => setIntake({ ...intake, name: e.target.value })} />
              </div>
              <div className="form-row">
                <label>Charge / Alleged Offense *</label>
                <select value={intake.charge} onChange={(e) => setIntake({ ...intake, charge: e.target.value })}>
                  <option value="">Select a charge...</option>
                  {CHARGE_OPTIONS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label>State *</label>
                <input type="text" placeholder="e.g. California" value={intake.state} onChange={(e) => setIntake({ ...intake, state: e.target.value })} />
              </div>
              <div className="form-row">
                <label>Additional Details <span className="optional">(optional)</span></label>
                <textarea rows={3} placeholder="Briefly describe what happened..." value={intake.details} onChange={(e) => setIntake({ ...intake, details: e.target.value })} />
              </div>
              {error && <div className="error-msg">{error}</div>}
              <button type="submit" className="btn-primary">Start My Consultation →</button>
            </form>
            <div className="disclaimer">⚠️ This tool provides general legal information, not legal advice. For serious matters, consult a licensed attorney.</div>
          </div>
        )}

        {stage === "chat" && (
          <div className="chat-layout">
            <div className="chat-sidebar">
              <div className="sidebar-card">
                <h3>Your Case</h3>
                <div className="case-detail"><span>Name</span><strong>{intake.name}</strong></div>
                <div className="case-detail"><span>Charge</span><strong>{intake.charge}</strong></div>
                <div className="case-detail"><span>State</span><strong>{intake.state}</strong></div>
              </div>
              <div className="sidebar-card tips-card">
                <h3>Quick Tips</h3>
                <ul>
                  <li>🤫 You have the right to remain silent</li>
                  <li>🚫 Don't consent to searches</li>
                  <li>📞 Ask for a lawyer immediately</li>
                  <li>✍️ Document everything</li>
                </ul>
              </div>
              <button className="btn-outline" onClick={generateSummary}>📄 Generate Summary</button>
              <button className="btn-ghost" onClick={restart}>↩ Start Over</button>
            </div>
            <div className="chat-main">
              <div className="messages-container">
                {messages.map((msg, i) => <Message key={i} msg={msg} />)}
                {loading && <TypingIndicator />}
                {error && <div className="error-msg chat-error">{error}</div>}
                <div ref={bottomRef} />
              </div>
              <div className="input-bar">
                <textarea rows={2} placeholder="Ask about your rights, the charges, what to expect in court..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} />
                <button className="btn-send" onClick={sendMessage} disabled={loading || !input.trim()}>{loading ? "..." : "Send"}</button>
              </div>
              <p className="input-hint">Press Enter to send · Shift+Enter for new line</p>
            </div>
          </div>
        )}

        {stage === "summary" && (
          <div className="card summary-card">
            <div className="card-header">
              <h2>📄 Case Summary</h2>
              <p>A summary of your consultation with your AI Public Defender.</p>
            </div>
            {summaryLoading ? (
              <div className="summary-loading">
                <div className="spinner" />
                <p>Generating your case summary...</p>
              </div>
            ) : (
              <>
                <div className="summary-meta">
                  <span>👤 {intake.name}</span>
                  <span>⚖️ {intake.charge}</span>
                  <span>📍 {intake.state}</span>
                </div>
                <div className="summary-body">
                  {summary ? summary.split("\n").map((line, i) => <p key={i}>{line}</p>) : <p className="no-summary">No summary available.</p>}
                </div>
                {error && <div className="error-msg">{error}</div>}
                <div className="summary-actions">
                  <button className="btn-primary" onClick={() => setStage("chat")}>← Back to Chat</button>
                  <button className="btn-outline" onClick={restart}>Start New Case</button>
                </div>
              </>
            )}
            <div className="disclaimer">⚠️ This summary is for informational purposes only and does not constitute legal advice.</div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Built for justice · AI Public Defender · Hackathon 2024 · <a href="https://github.com/Tharun-Ajmeera/ai-public-defender" target="_blank" rel="noreferrer">GitHub</a></p>
      </footer>
    </div>
  );
}