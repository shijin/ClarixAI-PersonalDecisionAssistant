import { SYSTEM_PROMPT, buildUserPrompt } from "../constants/prompts";

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 1500;

export async function getRecommendation(situation, priorContext = {}) {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing VITE_CLAUDE_API_KEY. Add it to your Replit Secrets.",
    );
  }

  const userPrompt = buildUserPrompt(situation, priorContext);

  const requestBody = {
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
  };

  let response;

  try {
    response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify(requestBody),
    });
  } catch (networkError) {
    throw new Error(
      "Network error — could not reach Claude API. Check your connection.",
    );
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Claude API error " + response.status + ": " + errorText);
  }

  const data = await response.json();

  const rawText = data?.content?.[0]?.text;

  if (!rawText) {
    throw new Error("Claude returned an empty response. Please try again.");
  }

  let parsed;

  try {
    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    parsed = JSON.parse(cleaned);
  } catch (parseError) {
    throw new Error(
      "Could not parse Claude response. Raw: " + rawText.slice(0, 200),
    );
  }

  return parsed;
}

export async function sendFollowUp(messages, followUpText) {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;

  if (!apiKey) {
    throw new Error("Missing VITE_CLAUDE_API_KEY.");
  }

  const conversationHistory = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  conversationHistory.push({
    role: "user",
    content: followUpText,
  });

  const requestBody = {
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: SYSTEM_PROMPT,
    messages: conversationHistory,
  };

  let response;

  try {
    response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify(requestBody),
    });
  } catch (networkError) {
    throw new Error("Network error — could not reach Claude API.");
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Claude API error " + response.status + ": " + errorText);
  }

  const data = await response.json();
  const rawText = data?.content?.[0]?.text;

  if (!rawText) {
    throw new Error("Claude returned an empty response.");
  }

  try {
    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);
    return { type: "structured", data: parsed };
  } catch {
    return { type: "text", data: rawText };
  }
}
