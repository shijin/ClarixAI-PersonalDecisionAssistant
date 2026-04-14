import { SYSTEM_PROMPT, buildUserPrompt } from '../constants/prompts'

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-3-5-haiku-20241022'

export async function getRecommendation(situation, context = {}) {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY

  if (!apiKey) {
    throw new Error('Claude API key is not configured. Add VITE_CLAUDE_API_KEY to your environment secrets.')
  }

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildUserPrompt(situation, context),
        },
      ],
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Claude API error ${response.status}: ${errorBody}`)
  }

  const json = await response.json()
  const rawText = json.content?.[0]?.text

  if (!rawText) {
    throw new Error('Empty response from Claude API')
  }

  try {
    return JSON.parse(rawText)
  } catch {
    const match = rawText.match(/\{[\s\S]*\}/)
    if (match) {
      return JSON.parse(match[0])
    }
    throw new Error('Could not parse recommendation from Claude response')
  }
}
