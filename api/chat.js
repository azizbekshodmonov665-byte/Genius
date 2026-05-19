// api/chat.js — Vercel Serverless Function
// API kalit faqat shu yerda, foydalanuvchilar ko'rmaydi

export default async function handler(req, res) {
  // Faqat POST so'rovlarga ruxsat
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Faqat POST ruxsat etilgan' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages massivi kerak' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY, // Vercel Environment Variable
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: "Siz UzGenius — foydali, do'stona va aqlli AI yordamchisiz. O'zbek tilida muloqot qiling. Qisqa va aniq javob bering. O'zingizni UzGenius deb tanishtiring.",
        messages: messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'API xatosi' });
    }

    const reply = data.content?.[0]?.text || 'Javob olishda xatolik.';
    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({ error: 'Server xatosi: ' + err.message });
  }
}
