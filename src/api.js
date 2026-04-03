const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'

/**
 * Generates an ICP persona using Claude.
 * Requires VITE_ANTHROPIC_API_KEY in your .env file.
 */
export async function generatePersona(formData) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('Missing VITE_ANTHROPIC_API_KEY in environment variables.')
  }

  const prompt = `You are an expert B2B marketer. Generate a detailed Ideal Customer Profile (ICP) persona as a JSON object based on the following inputs:

Product/Service: ${formData.product}
Industry: ${formData.industry}
Job Title: ${formData.jobTitle}
Company Size: ${formData.companySize}
Pain Points: ${formData.painPoints}
Goals: ${formData.goals}

Return ONLY a valid JSON object with these fields:
{
  "name": "persona first name",
  "title": "job title",
  "company": "example company name",
  "industry": "industry",
  "companySize": "company size range",
  "background": "2-3 sentence professional background",
  "painPoints": ["pain point 1", "pain point 2", "pain point 3"],
  "goals": ["goal 1", "goal 2", "goal 3"],
  "buyingTriggers": ["trigger 1", "trigger 2"],
  "objections": ["objection 1", "objection 2"],
  "messagingHook": "one compelling sentence to open a cold email or ad"
}`

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  const text = data.content?.[0]?.text || ''

  // Extract JSON from the response
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Could not parse persona from API response.')

  return JSON.parse(match[0])
}
