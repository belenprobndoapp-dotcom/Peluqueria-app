import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Falta la API Key de Gemini' });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Extraer datos de la imagen recibida
    const { image, prompt } = req.body || {};

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        prompt || 'Analiza el tipo de rostro, tono de piel y subtono de cabello.',
        image
      ],
    });

    return res.status(200).json({ result: response.text });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Error al analizar la imagen' });
  }
}
