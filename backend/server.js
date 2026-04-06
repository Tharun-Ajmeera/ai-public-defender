const express = require("express");
const cors = require("cors");
require("dotenv").config();

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
  const { messages, intake, category } = req.body;

  const systemPrompt =
    SYSTEM_PROMPT +
    (intake ? `\n\nClient Info — Name: ${intake.name}, Charge: ${intake.charge}, State: ${intake.state}. Details: ${intake.details || "None provided."}` : "") +
    (category ? `\n\nFocus on: ${category}` : "");

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        max_tokens: 1024,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I couldn't generate a response.";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.post("/api/summary", async (req, res) => {
  const { messages, intake } = req.body;

  const conversation = messages
    .map((m) => `${m.role === "user" ? "Client" : "Defender"}: ${m.content}`)
    .join("\n");

  const summaryPrompt = `You are summarizing a legal consultation session.

Client: ${intake?.name || "Unknown"}
Charge: ${intake?.charge || "Unknown"}
State: ${intake?.state || "Unknown"}
Details: ${intake?.details || "None"}

Conversation:
${conversation}

Write a clear, concise summary including:
1. The charge and situation
2. Key rights and legal points discussed
3. Recommended next steps
4. Important warnings or reminders

Keep it under 300 words. Use plain English.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        max_tokens: 1024,
        messages: [
          { role: "user", content: summaryPrompt },
        ],
      }),
    });

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content || "Could not generate summary.";
    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
