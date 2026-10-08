import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Set payload limit high for base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Server-side Gemini initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Candidate models ordered with gemini-flash-latest first as active stable model
const CANDIDATE_MODELS = [
  'gemini-flash-latest',
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
];

async function generateWithFallbackAndRetry(
  requestBuilder: (modelName: string) => Promise<any>,
  maxRetriesPerModel = 2
) {
  let lastError: any = null;

  for (const modelName of CANDIDATE_MODELS) {
    for (let attempt = 0; attempt < maxRetriesPerModel; attempt++) {
      try {
        console.log(`Executing request with model: ${modelName} (attempt ${attempt + 1}/${maxRetriesPerModel})`);
        const result = await requestBuilder(modelName);
        return result;
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || String(err);
        const status = err?.status || err?.code || '';
        const isUnavailable =
          errMsg.includes('503') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('high demand') ||
          errMsg.includes('temporarily unavailable') ||
          errMsg.includes('Resource has been exhausted') ||
          errMsg.includes('429') ||
          status === 503 ||
          status === 429;

        console.warn(`Model ${modelName} attempt ${attempt + 1} failed: ${errMsg}`);

        if (isUnavailable && attempt < maxRetriesPerModel - 1) {
          // Jitter delay before retry on same model
          const delayMs = 1000 * (attempt + 1);
          await new Promise((res) => setTimeout(res, delayMs));
          continue;
        }

        // If unavailable, try next candidate model
        if (isUnavailable) {
          console.warn(`Switching immediately from ${modelName} to next model in line.`);
          break;
        }

        // For non-availability errors (e.g. invalid arguments), throw immediately
        throw err;
      }
    }
  }

  throw lastError;
}

// Visagism Analysis Endpoint
app.post('/api/analyze-face', async (req: Request, res: Response) => {
  try {
    const { image, genderPreference = 'todos', lengthPreference = 'todos', userNotes = '' } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No se ha proporcionado ninguna imagen para el análisis.' });
    }

    // Process base64 string
    let mimeType = 'image/jpeg';
    let base64Data = image;

    if (image.includes(';base64,')) {
      const parts = image.split(';base64,');
      const mimeMatch = parts[0].match(/:(.*?)$/);
      if (mimeMatch) {
        mimeType = mimeMatch[1];
      }
      base64Data = parts[1];
    }

    const promptText = `
Eres un Master Visagista y Colorista Capilar de Alta Peluquería Internacional, Antropometrista Facial y Asesor de Imagen.
Analiza con rigor científico y estético la fotografía facial adjunta.
Nota sobre la captura: La imagen puede provenir de una cámara web en tiempo real, selfie o cámara frontal móvil. Adapta el diagnóstico a las condiciones de luz ambiental y resolución de la imagen para determinar con alta precisión y fidelidad la morfología ósea, subtono de piel y matiz capilar.

Aplica el siguiente PROTOCOLO DE RECONOCIMIENTO FACIAL Y COLORIMÉTRICO DE ALTA PRECISIÓN:

1. MORFOLOGÍA Y CLASIFICACIÓN EXACTA DEL ROSTRO:
   - Determina la forma geométrica predominante: Ovalado, Redondo, Cuadrado, Corazón / Triángulo Invertido, Diamante, o Alargado / Rectangular.
   - Medición de proporciones relativas:
     * Relación Longitud / Ancho bizigomático (pómulos): (ej. 1.15 para redondo, 1.45 para ovalado, 1.65 para alargado).
     * Proporción de tercios faciales: frente (trichion a glabela), zona media (glabela a subnasal), zona inferior (subnasal a mentón).
     * Amplitud comparativa: Ancho de frente (tritemporal) vs Pómulos (bizigomático) vs Mandíbula (bigonial).
     * Ángulo mandibular: Suave, Medio o Marcado / Angular (típico en rostros cuadrados o diamante).
     * Geometría del mentón: Redondeada, Puntiaguda/Cónica, Cuadrada u Ovalada.
   - Describe con claridad por qué pertenece a esta clasificación geométrica y no a otra similar.

2. COLORIMETRÍA Y MATICES DEL TONO DE PIEL:
   - Profundidad: Muy Claro (Fair), Claro (Light), Medio / Trigueño (Medium), Bronceado (Tan), u Oscuro / Profundo (Deep).
   - Subtono de piel exacto:
     * CÁLIDO: Presencia dominante de carotenos y feomelanina dorada. Reflejos melocotón, dorados o canela.
     * FRÍO: Presencia dominante de hemoglobina rosácea o matices azulados translúcidos. Ausencia de pigmentos cetrinos.
     * NEUTRO: Equilibrio exacto entre calidez y frescura sin dominancia polarizada.
     * OLIVA: Matiz sutil verdoso o ceniciento sobre base neutra-cálida (típico mediterráneo o latino).
   - Extrae 3 puntos de muestreo cromático en formato HEX:
     * Punto de luz central (mejilla alta / frente iluminada).
     * Tono medio facial (mejilla / mentón).
     * Sombra de contorno natural.
   - Estación de colorimetría personal (Primavera Cálida/Brillante, Verano Suave/Frío, Otoño Cálido/Profundo, Invierno Brillante/Profundo).
   - Factores clave para potenciar la luminosidad natural de esta tez específica.

3. SUBTONO Y MATIZ DEL CABELLO ACTUAL:
   - Nivel de altura de tono según la Escala Internacional (1 al 10): 1 Negro, 2 Moreno, 3 Castaño Oscuro, 4 Castaño Medio, 5 Castaño Claro, 6 Rubio Oscuro, 7 Rubio Medio, 8 Rubio Claro, 9 Rubio Muy Claro, 10 Platino.
   - Subtono de reflejo capilar:
     * Ceniza (.1): Reflejos fríos, grisáceos o azulados.
     * Irisado / Nacarado (.2): Reflejos perlados violetas.
     * Dorado (.3): Destellos amarillos/oro cálidos.
     * Cobrizo (.4): Reflejos anaranjados/ámbar cálidos.
     * Caoba (.5) / Rojizo (.6): Reflejos rojos o violetas.
     * Marrón / Natural (.0 / .7): Reflejos tierra o neutros.
   - Temperatura capilar dominante (Cálido, Frío o Neutro).
   - Textura observable (Lacio, Ondulado, Rizado, Afro, Fino, Grueso).
   - Código Hex estimado del cabello.

4. CORTES DE CABELLO QUE MÁS LE FAVORECEN (OBLIGATORIO 100% EN ESPAÑOL):
   - Proporciona entre 3 y 4 cortes de cabello específicos que armonicen y estilicen su estructura ósea (preferencia indicada: ${genderPreference}, longitud: ${lengthPreference}).
   - El nombre de cada corte DEBE ESTAR EN ESPAÑOL técnico de peluquería (ejemplos: "Corte Bob Desfilado al Mentón", "Melena Midi en Capas con Flequillo Cortina", "Corte Pixie Texturizado", "Corte en Capas Largas con Movimiento", "Degradado Fade Medio Masculino", "Corte Garçom con Volumen Superior"). NUNCA uses nombres exclusivamente en inglés sin adaptar.
   - El campo 'category' DEBE SER EXACTAMENTE uno de estos tres valores en español: 'Corto', 'Medio', o 'Largo'.
   - Explica el efecto geométrico compensatorio de cada corte en español (por qué le favorece y qué ilusión óptica crea).
   - Consejos de peinado, dirección de raya (medio/lado) y volumen estratégico en español.
   - Lista además 2 o 3 estilos o cortes que DEBE EVITAR con nombre y motivo detallado en español.

5. TONOS DE COLOR DE CABELLO / TINTES QUE ACENTÚAN LA LUZ NATURAL (OBLIGATORIO 100% EN ESPAÑOL):
   - Recomienda entre 3 y 4 tonos de tinte / coloración capilar diseñados para elevar la luminosidad natural de su piel y mirada.
   - Para cada tono, incluye:
     * Nombre comercial evocador 100% en español (ej: "Rubio Miel Dorado Cálido", "Castaño Chocolate Intenso", "Cobrizo Avellana Luminoso", "Rubio Ceniza Claro", "Caramelo Tostado Reflejante").
     * Fórmula técnica o altura/reflejo (ej: "7.34 Rubio Dorado Cobrizo", "5.35 Castaño Chocolate", "8.1 Rubio Ceniza").
     * Código Hex representativo (#xxxxxx).
     * Explicación en español de cómo ilumina el rostro (contraste, calidez o frescura que enciende su piel).
     * Técnica ideal de aplicación en español (ej: "Balayage Iluminador", "Iluminación Frontal / Face Framing", "Mechas Babylights Finas", "Coloración Global Refrescante", "Baño de Brillo & Gloss").
     * Nivel de mantenimiento: DEBE SER EXACTAMENTE uno de estos tres valores en español: 'Bajo', 'Medio', o 'Alto' (NUNCA en inglés como 'Low', 'Medium', 'High').
   - Lista 2 tonos de tinte que DEBE EVITAR porque apagarían o envejecerían la luz de su piel, con nombre y motivo en español.

6. CONSEJOS EXTRA DE VISAGISMO:
   - Tipo de lentes/gafas recomendados y cuáles evitar (en español).
   - Escotes / cuellos que favorecen su morfología facial (en español).
   - Recomendaciones de maquillaje iluminador y tonos de labial/blush en armonía (en español).

Filtros del usuario:
- Preferencia de género: ${genderPreference}
- Longitud preferida: ${lengthPreference}
${userNotes ? `- Notas adicionales del usuario: ${userNotes}` : ''}

REGLA ABSOLUTA DE IDIOMA PARA IMPRESIÓN Y SALÓN TÉCNICO:
Todos los campos, nombres de cortes, nombres de tintes, descripciones, categorías, técnicas, consejos y justificaciones DEBEN ESTAR EXCLUSIVA Y RIGUROSAMENTE EN ESPAÑOL (para que la Ficha Técnica oficial de la Muestra Técnica 2026 de la Escuela Técnica Dr. Juan Gregorio Pujol se imprima de forma impecable sin términos residuales en inglés).
Devuelve ÚNICAMENTE un objeto JSON válido con la estructura solicitada.
`;

    const response = await generateWithFallbackAndRetry((modelName) =>
      ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data,
              },
            },
            {
              text: promptText,
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              faceAnalysis: {
                type: Type.OBJECT,
                properties: {
                  faceShape: { type: Type.STRING },
                  faceShapeEnglish: { type: Type.STRING },
                  confidenceScore: { type: Type.NUMBER },
                  proportionsDescription: { type: Type.STRING },
                  keyFeatures: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  geometricRatio: { type: Type.STRING },
                  visualDescription: { type: Type.STRING },
                  measurements: {
                    type: Type.OBJECT,
                    properties: {
                      lengthToWidthRatio: { type: Type.NUMBER },
                      foreheadWidthPercent: { type: Type.NUMBER },
                      cheekboneWidthPercent: { type: Type.NUMBER },
                      jawlineWidthPercent: { type: Type.NUMBER },
                      jawlineAngle: { type: Type.STRING },
                      chinShape: { type: Type.STRING },
                    },
                    required: [
                      'lengthToWidthRatio',
                      'foreheadWidthPercent',
                      'cheekboneWidthPercent',
                      'jawlineWidthPercent',
                      'jawlineAngle',
                      'chinShape',
                    ],
                  },
                },
                required: ['faceShape', 'confidenceScore', 'proportionsDescription', 'keyFeatures'],
              },
              skinAnalysis: {
                type: Type.OBJECT,
                properties: {
                  tone: { type: Type.STRING },
                  undertone: { type: Type.STRING },
                  undertoneExplanation: { type: Type.STRING },
                  skinSampleHex: { type: Type.STRING },
                  chromaticNuances: {
                    type: Type.OBJECT,
                    properties: {
                      primaryUndertone: { type: Type.STRING },
                      secondaryNuance: { type: Type.STRING },
                      luminosityGrade: { type: Type.STRING },
                      highlightSkinHex: { type: Type.STRING },
                      midToneSkinHex: { type: Type.STRING },
                      shadowSkinHex: { type: Type.STRING },
                    },
                    required: [
                      'primaryUndertone',
                      'secondaryNuance',
                      'luminosityGrade',
                      'highlightSkinHex',
                      'midToneSkinHex',
                      'shadowSkinHex',
                    ],
                  },
                  seasonalPalette: {
                    type: Type.OBJECT,
                    properties: {
                      season: { type: Type.STRING },
                      description: { type: Type.STRING },
                      recommendedClothingColors: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            name: { type: Type.STRING },
                            hex: { type: Type.STRING },
                          },
                          required: ['name', 'hex'],
                        },
                      },
                      colorsToAvoid: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            name: { type: Type.STRING },
                            hex: { type: Type.STRING },
                            reason: { type: Type.STRING },
                          },
                          required: ['name', 'hex', 'reason'],
                        },
                      },
                    },
                    required: ['season', 'description', 'recommendedClothingColors', 'colorsToAvoid'],
                  },
                  naturalLuminosityFactors: { type: Type.STRING },
                },
                required: [
                  'tone',
                  'undertone',
                  'undertoneExplanation',
                  'skinSampleHex',
                  'seasonalPalette',
                  'naturalLuminosityFactors',
                ],
              },
              currentHairAnalysis: {
                type: Type.OBJECT,
                properties: {
                  detectedColor: { type: Type.STRING },
                  baseLevel: { type: Type.NUMBER },
                  underlyingWarmth: { type: Type.STRING },
                  textureEstimate: { type: Type.STRING },
                  detectedHairHex: { type: Type.STRING },
                  subtoneNuance: {
                    type: Type.OBJECT,
                    properties: {
                      baseLevel: { type: Type.NUMBER },
                      baseLevelName: { type: Type.STRING },
                      primaryReflect: { type: Type.STRING },
                      secondaryReflect: { type: Type.STRING },
                      temperature: { type: Type.STRING },
                      surfaceShine: { type: Type.STRING },
                    },
                    required: ['baseLevel', 'baseLevelName', 'primaryReflect', 'temperature', 'surfaceShine'],
                  },
                },
                required: ['detectedColor', 'baseLevel', 'underlyingWarmth', 'textureEstimate', 'detectedHairHex'],
              },
              haircutRecommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    category: { type: Type.STRING },
                    suitabilityScore: { type: Type.NUMBER },
                    whyItWorks: { type: Type.STRING },
                    stylingTips: { type: Type.STRING },
                    celebrityOrVisualReference: { type: Type.STRING },
                    avoidWarning: { type: Type.STRING },
                  },
                  required: ['id', 'name', 'category', 'suitabilityScore', 'whyItWorks', 'stylingTips'],
                },
              },
              haircutsToAvoid: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    reason: { type: Type.STRING },
                  },
                  required: ['name', 'reason'],
                },
              },
              hairColorRecommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    shadeName: { type: Type.STRING },
                    dyeCode: { type: Type.STRING },
                    hexColor: { type: Type.STRING },
                    luminosityEffect: { type: Type.STRING },
                    bestTechnique: { type: Type.STRING },
                    maintenanceLevel: { type: Type.STRING },
                  },
                  required: ['id', 'shadeName', 'dyeCode', 'hexColor', 'luminosityEffect', 'bestTechnique', 'maintenanceLevel'],
                },
              },
              hairColorsToAvoid: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    hexColor: { type: Type.STRING },
                    reason: { type: Type.STRING },
                  },
                  required: ['name', 'hexColor', 'reason'],
                },
              },
              extraVisagismTips: {
                type: Type.OBJECT,
                properties: {
                  eyewear: {
                    type: Type.OBJECT,
                    properties: {
                      recommended: { type: Type.STRING },
                      avoid: { type: Type.STRING },
                    },
                    required: ['recommended', 'avoid'],
                  },
                  necklines: { type: Type.STRING },
                  makeupHighlights: { type: Type.STRING },
                },
                required: ['eyewear', 'necklines', 'makeupHighlights'],
              },
            },
            required: [
              'faceAnalysis',
              'skinAnalysis',
              'currentHairAnalysis',
              'haircutRecommendations',
              'haircutsToAvoid',
              'hairColorRecommendations',
              'hairColorsToAvoid',
              'extraVisagismTips',
            ],
          },
        },
      })
    );

    let text = response.text;
    if (!text) {
      throw new Error('No se recibió respuesta del modelo de análisis.');
    }

    // Strip markdown codeblocks if model wrapped JSON
    if (text.includes('```json')) {
      text = text.replace(/```json/gi, '').replace(/```/g, '');
    } else if (text.includes('```')) {
      text = text.replace(/```/g, '');
    }
    text = text.trim();

    const data = JSON.parse(text);
    return res.json(data);
  } catch (error: any) {
    console.error('Error during visagism analysis:', error);
    const isServiceBusy =
      error?.message?.includes('503') ||
      error?.message?.includes('UNAVAILABLE') ||
      error?.message?.includes('high demand');

    return res.status(500).json({
      error: isServiceBusy
        ? 'Los servidores de IA están experimentando una alta demanda momentánea. Por favor, reintenta en unos instantes.'
        : error.message || 'Ocurrió un error al procesar la fotografía facial.',
    });
  }
});

// Visagism Chatbot Endpoint
app.post('/api/visagism-chat', async (req: Request, res: Response) => {
  try {
    const { messages, reportContext } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Historial de mensajes inválido.' });
    }

    const contextPrompt = reportContext
      ? `
CONTEXTO DEL DIAGNÓSTICO DE LA CLIENTE/MODELO:
- Tipo de Rostro: ${reportContext.faceShape || 'No especificado'} (${reportContext.proportions || ''})
- Tono y Subtono de Piel: ${reportContext.skinTone || 'No especificado'}, Subtono: ${reportContext.skinUndertone || 'No especificado'}
- Estación de Color: ${reportContext.season || 'No especificado'}
- Cabello Actual: ${reportContext.currentHair || 'No especificado'}
- Cortes Recomendados: ${Array.isArray(reportContext.recommendedCuts) ? reportContext.recommendedCuts.join(', ') : ''}
- Cortes a Evitar: ${Array.isArray(reportContext.cutsToAvoid) ? reportContext.cutsToAvoid.join(', ') : ''}
- Tonos Recomendados para Iluminar: ${Array.isArray(reportContext.recommendedColors) ? reportContext.recommendedColors.join(', ') : ''}
- Tonos a Evitar: ${Array.isArray(reportContext.colorsToAvoid) ? reportContext.colorsToAvoid.join(', ') : ''}
`
      : 'Aún no se ha realizado un diagnóstico con foto; responde como asesor general invitándola a subir su foto o resolver dudas previas.';

    const systemInstruction = `
Eres "Lumière Stylist", una asesora de imagen, visagista profesional y máster colorista capilar de salón de alta gama.
Tu cliente o modelo te está consultando porque se va a realizar un cambio de look y quiere tomar la mejor decisión según sus preferencias, estilo de vida y fisonomía.

${contextPrompt}

DIRECTRICES DE RESPUESTA:
1. Sé cálida, empática, profesional, elegante y cercana.
2. Basa siempre tus respuestas en la fisonomía real diagnosticada (su tipo de rostro, tono de piel y cabello actual).
3. Si la modelo expresa dudas o preferencias particulares (ej: "tengo miedo de cortarlo muy corto", "no tengo tiempo de peinarme con secador", "tengo piel grasa/sensible", "uso lentes", "prefiero poco mantenimiento"), adáptate y dale alternativas viables sin traicionar la armonía de su rostro.
4. Explica siempre el "por qué": cómo un flequillo, unas capas o un reflejo miel/dorado/cenizo equilibran sus proporciones o potencian la luz natural de su mirada.
5. Puedes sugerir preguntas frecuentes de seguimiento para que la conversación fluya de manera interactiva.
6. Mantén tus respuestas conversacionales, claras y enriquecedoras (ni telegráficas ni enciclopédicas).
`;

    // Map conversation to Gemini contents format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await generateWithFallbackAndRetry((modelName) =>
      ai.models.generateContent({
        model: modelName,
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      })
    );

    const reply = response.text || 'Disculpa, no pude procesar tu respuesta en este momento.';
    return res.json({ reply });
  } catch (error: any) {
    console.error('Error in visagism chat:', error);
    const isServiceBusy =
      error?.message?.includes('503') ||
      error?.message?.includes('UNAVAILABLE') ||
      error?.message?.includes('high demand');

    return res.status(500).json({
      error: isServiceBusy
        ? 'El servicio de IA está con alta demanda temporal. Por favor inténtalo de nuevo en unos segundos.'
        : error.message || 'Error en la sesión de asesoría capilar.',
    });
  }
});

// Mount Vite or static server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Visagismo IA Server running on http://localhost:${PORT}`);
  });
}

startServer();
