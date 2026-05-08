import OpenAI from 'openai'

// On utilise le SDK OpenAI, mais on le fait pointer vers les serveurs de Groq !
// Groq offre un accès 100% gratuit et ultra-rapide aux modèles open-source comme LLaMA 3.
export const ai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || 'your_groq_api_key',
  baseURL: 'https://api.groq.com/openai/v1',
})

export const DEFAULT_MODEL = 'llama3-8b-8192'

export async function generateResponse(systemPrompt: string, messages: { role: 'user' | 'assistant', content: string }[]) {
  try {
    const completion = await ai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 250,
    })

    return completion.choices[0]?.message?.content || 'Désolé, je ne peux pas répondre pour le moment.'
  } catch (error) {
    console.error('Erreur IA:', error)
    return 'Désolé, je rencontre un problème technique.'
  }
}
