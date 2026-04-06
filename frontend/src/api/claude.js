// ===============================
// 🔗 BACKEND API CALLS (GROQ)
// ===============================

/**
 * Sends messages to your backend (/api/chat)
 */
export async function callAI(messages, intake) {
  const response = await fetch("http://localhost:5000/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      intake,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error || "Backend error");
  }

  const data = await response.json();
  return data.reply;
}

/**
 * Calls summary endpoint
 */
export async function getSummary(messages, intake) {
  const response = await fetch("http://localhost:5000/api/summary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      intake,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error || "Summary error");
  }

  const data = await response.json();
  return data.summary;
}

/**
 * (Optional) Keep this if you want frontend-side prompt control
 */
export function buildChatSystemPrompt(intake) {
  return `You are an AI Public Defender providing free legal information (not legal advice).
The user's name is ${intake.name}. They are facing a charge of "${intake.charge}" in ${intake.state}.
${intake.details ? `Additional context: ${intake.details}` : ""}
Be empathetic, clear, and helpful.`;
}

/**
 * (Optional) Summary prompt (backend already handles it)
 */
export function buildSummaryMessages(messages, intake) {
  const transcript = messages
    .map((m) => `${m.role === "user" ? "Client" : "Defender"}: ${m.content}`)
    .join("\n\n");

  return [
    {
      role: "user",
      content: `Summarize case for ${intake.name} (${intake.charge}, ${intake.state}):\n\n${transcript}`,
    },
  ];
}