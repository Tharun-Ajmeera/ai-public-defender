const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are an AI Public Defender — a compassionate, knowledgeable legal assistant helping individuals who cannot afford a lawyer.

Your role:
- Explain laws, rights, and legal procedures in simple, clear language
- Help users understand their situation and available options
- Guide them through legal processes step by step
- Always be empathetic — many users are scared and confused

Rules:
- Always recommend consulting a real lawyer for serious matters
- Never give definitive legal advice — guide and inform only
- Keep responses concise, clear, and in plain English
- Use numbered steps when explaining procedures
- Be warm and reassuring in tone`;

app.post("/api/chat", async (req, res) => {
  const { messages, category } = req.body;
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPT + (category ? `\n\nFocus on: ${category}` : ""),
        messages: messages,
      }),
    });
    const data = await response.json();
    const reply = data.content[0]?.text || "I couldn't generate a response.";
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
