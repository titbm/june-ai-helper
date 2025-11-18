// Vercel Serverless Function для работы с Gemini API
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required' });
    }

    // Формируем промпт для Gemini
    const prompt = messages.map(m => {
      // Декодируем если пришло в неправильной кодировке
      const content = m.content;
      return typeof content === 'string' ? content : String(content);
    }).join('\n');

    // Запрос к Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API error:', error);
      return res.status(response.status).json({ 
        error: 'Gemini API error',
        details: error 
      });
    }

    const data = await response.json();
    
    // Преобразуем ответ Gemini в формат OpenRouter для совместимости
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    return res.status(200).json({
      choices: [{
        message: {
          role: 'assistant',
          content: text
        }
      }]
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
