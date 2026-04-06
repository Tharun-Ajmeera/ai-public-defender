const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Adjust if your frontend runs on a different port
}));

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ---- TOPIC GUARD ----
const LEGAL_KEYWORDS = [
  'arrest', 'charge', 'court', 'lawyer', 'attorney', 'defendant',
  'rights', 'miranda', 'bail', 'sentence', 'felony', 'misdemeanor',
  'police', 'warrant', 'search', 'seizure', 'public defender', 'trial',
  'plea', 'guilty', 'innocent', 'prison', 'jail', 'probation', 'parole',
  'immigration', 'detained', 'evidence', 'motion', 'hearing', 'judge',
  'jury', 'criminal', 'legal', 'law', 'constitution', 'amendment',
  'officer', 'cop', 'stopped', 'handcuffed', 'indicted', 'case'
];

const BLOCKED_TOPICS = [
  'recipe', 'cook', 'weather', 'sport', 'movie', 'song', 'music',
  'homework', 'math', 'stock', 'invest', 'game',
  'travel', 'hotel', 'flight', 'relationship', 'date',
  'diet', 'fitness', 'shopping', 'fashion'
];

function isLegalTopic(message) {
  const lower = message.toLowerCase();
  const hasLegalKeyword = LEGAL_KEYWORDS.some(kw => lower.includes(kw));
  const hasBlockedTopic = BLOCKED_TOPICS.some(kw => lower.includes(kw));
  if (hasLegalKeyword) return true;
  if (hasBlockedTopic) return false;
  return true;
}

const SYSTEM_PROMPT = `
You are an AI Public Defender.

You provide general legal information ONLY (not legal advice).

========================
🔒 STRICT SCOPE RULE
========================
You can ONLY answer questions related to:
- Criminal law
- Arrests, police encounters
- Legal rights (Miranda, search, seizure)
- Bail, court process, sentencing
- Public defender access

If the question is NOT related to criminal/legal topics:
Respond ONLY with:
"⚖️ I'm your AI Public Defender — I can only help with criminal law and legal rights."

========================
⚠️ CRITICAL RULES
========================
- NEVER assume the user is guilty
- ALWAYS include this disclaimer:
  "This is general legal information, not legal advice."
- ALWAYS suggest contacting a real lawyer
- Laws vary by state — mention this when relevant

========================
🚨 EMERGENCY (VERY IMPORTANT)
========================
If user is being arrested RIGHT NOW:
Tell them EXACTLY:
1. Stay calm, do not resist
2. Say: "I am invoking my right to remain silent."
3. Say: "I want a lawyer."
4. Do not answer any questions
5. Do not consent to searches

========================
🧠 RESPONSE FORMAT (MANDATORY)
========================
Always structure your response like this:

1. ✅ Quick Answer (1–2 lines)
2. 📘 Explanation (simple language)
3. ⚖️ Your Rights (bullet points)
4. 👉 What You Should Do Next (action steps)
5. ⚠️ Disclaimer

Keep it clear, calm, and supportive.
Avoid long paragraphs.
`;

// ---- MAIN CHAT ROUTE ----
app.post('/api/chat', async (req, res) => {
  const { message, messages, intake } = req.body;

  const userMessage = message || (messages && messages[messages.length - 1]?.content);

  if (!userMessage) {
    return res.status(400).json({ error: 'No message provided.' });
  }

  if (!isLegalTopic(userMessage)) {
    return res.json({
      reply: "⚖️ I'm your AI Public Defender — I'm specialized in criminal law and legal rights only. I can't help with that topic, but I'm here if you have questions about your rights, a criminal case, bail, or need help drafting a legal document. What can I help you with?"
    });
  }

  try {
    const chatMessages = messages
      ? messages.map(m => ({ role: m.role, content: m.content }))
      : [{ role: 'user', content: userMessage }];

    // Add intake context to system prompt if available
    const systemWithIntake = intake
      ? `${SYSTEM_PROMPT}\n\n## CURRENT CLIENT\nName: ${intake.name}\nCharge: ${intake.charge}\nState: ${intake.state}\nDetails: ${intake.details || 'None provided'}`
      : SYSTEM_PROMPT;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemWithIntake },
        ...chatMessages,
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply, response: reply });

  } catch (error) {
    console.error('Groq API error:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// ---- SUMMARY ROUTE ----
app.post('/api/summary', async (req, res) => {
  const { messages, intake } = req.body;

  if (!messages || !intake) {
    return res.status(400).json({ error: 'Missing messages or intake data.' });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 1024,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        {
          role: 'user',
          content: `Please provide a concise and clear case summary for ${intake.name} who is facing a charge of "${intake.charge}" in ${intake.state}.
Include:
1. Key legal rights relevant to this charge
2. What to expect in the legal process
3. Recommended next steps
4. Important resources they should contact
Keep it clear, empathetic, and easy to understand.`
        }
      ],
    });

    let reply = completion.choices[0].message.content;

// Optional: enforce fallback if model goes off-topic
if (!reply || reply.length < 10) {
  reply = "⚖️ I couldn't understand fully. Please ask about your legal rights or situation.";
}

// Trim overly long responses
if (reply.length > 3000) {
  reply = reply.substring(0, 3000) + "...";
}

res.json({ reply });

  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ error: 'Could not generate summary. Please try again.' });
  }
});

app.get('/', (req, res) => {
  res.send('AI Public Defender Backend is running ✅');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});