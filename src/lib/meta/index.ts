export async function sendInstagramMessage(recipientId: string, text: string, pageAccessToken: string) {
  const url = `https://graph.facebook.com/v19.0/me/messages?access_token=${pageAccessToken}`

  const payload = {
    recipient: { id: recipientId },
    message: { text: text },
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (!res.ok) {
      console.error('Erreur API Meta Graph:', data)
      return false
    }
    return true
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message Instagram:', error)
    return false
  }
}
