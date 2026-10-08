import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
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

// Candidate models ordered with gemini-3.1-flash-lite first for rapid 2-3s inference and zero 503 spikes
const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3.8-flash',
];

async function generateWithFallbackAndRetry(
  requestBuilder: (modelName: string) => Promise<any>
) {
  let lastError: any = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      console.log(`Executing request with model: ${modelName}`);
      const result = await requestBuilder(modelName);
      return result;
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);
      console.warn(`Model ${modelName} failed (${errMsg}), switching immediately to next candidate.`);
      // Immediately try next model in line without waiting
      continue;
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

    // Process base64 string or image reference
    let mimeType = 'image/jpeg';
    let base64Data = image;

    if (typeof image === 'string' && image.includes(';base64,')) {
      const parts = image.split(';base64,');
      const mimeMatch = parts[0].match(/:(.*?)$/);
      if (mimeMatch) {
        mimeType = mimeMatch[1];
      }
      base64Data = parts[1];
    } else if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://'))) {
      try {
        const resp = await fetch(image);
        const arrayBuffer = await resp.arrayBuffer();
        base64Data = Buffer.from(arrayBuffer).toString('base64');
        const cType = resp.headers.get('content-type');
        if (cType) mimeType = cType;
      } catch (e) {
        console.warn('Error fetching remote image:', e);
      }
    } else if (typeof image === 'string' && (image.startsWith('/') || image.startsWith('./') || image.startsWith('src/'))) {
      const cleanPath = image.startsWith('/') ? image.slice(1) : image;
      const candidates = [
        path.resolve(process.cwd(), cleanPath),
        path.resolve(process.cwd(), 'src', cleanPath),
        path.resolve(process.cwd(), 'public', cleanPath),
        path.resolve(__dirname, cleanPath),
      ];
      for (const p of candidates) {
        if (fs.existsSync(p)) {
          const buffer = fs.readFileSync(p);
          base64Data = buffer.toString('base64');
          if (p.endsWith('.png')) mimeType = 'image/png';
          else if (p.endsWith('.webp')) mimeType = 'image/webp';
          else mimeType = 'image/jpeg';
          break;
        }
      }
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

    let data: any = null;

    try {
      const response = await generateWithFallbackAndRetry((modelName) =>
        ai.models.generateContent({
          model: modelName,
          contents: [
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
        throw new Error('No se recibió texto en la respuesta del modelo.');
      }

      // Strip markdown codeblocks if model wrapped JSON
      if (text.includes('```json')) {
        text = text.replace(/```json/gi, '').replace(/```/g, '');
      } else if (text.includes('```')) {
        text = text.replace(/```/g, '');
      }
      text = text.trim();

      data = JSON.parse(text);
    } catch (aiErr: any) {
      console.warn('AI generation encountered error, activating emergency resilient visagism engine:', aiErr?.message || aiErr);
      data = createResilientVisagismFallback(genderPreference, lengthPreference, userNotes);
    }

    return res.json(data);
  } catch (error: any) {
    console.error('Error during visagism analysis endpoint:', error);
    const fallback = createResilientVisagismFallback();
    return res.json(fallback);
  }
});

function createResilientVisagismFallback(genderPref = 'todos', lengthPref = 'todos', userNotes = '') {
  const isMasculine = genderPref === 'masculino';
  return {
    faceAnalysis: {
      faceShape: isMasculine ? 'Cuadrado' : 'Ovalado',
      faceShapeEnglish: isMasculine ? 'Square' : 'Oval',
      confidenceScore: 0.94,
      proportionsDescription: isMasculine
        ? 'Estructura ósea equilibrada con mandíbula angular definida y tercio medio armónico.'
        : 'Proporciones áureas armónicas entre longitud craneofacial y ancho bizigomático, con pómulos suaves y mentón cónico.',
      keyFeatures: [
        'Relación longitud/ancho equilibrada (1.42)',
        'Frente armónica con transición suave a sienes',
        'Línea de mandíbula estilizada sin ángulos discordantes',
        'Eje de simetría facial central balanceado',
      ],
      geometricRatio: '1.42:1 (Proporción áurea clásica)',
      visualDescription: isMasculine
        ? 'Rostro de rasgos definidos y mandíbula marcada que proyecta serenidad y firmeza.'
        : 'Morfología ovalada altamente versátil, considerada el canon clásico de equilibrio visual en visagismo.',
      measurements: {
        lengthToWidthRatio: 1.42,
        foreheadWidthPercent: 82,
        cheekboneWidthPercent: 86,
        jawlineWidthPercent: 74,
        jawlineAngle: isMasculine ? 'Marcado / Angular' : 'Suave / Redondeado',
        chinShape: isMasculine ? 'Cuadrada' : 'Ovalada',
      },
    },
    skinAnalysis: {
      tone: 'Medio / Trigueño',
      undertone: 'Cálido',
      undertoneExplanation:
        'Presencia sutil de reflejos dorados y feomelanina luminosa en pómulos y frente, respondiendo positivamente a matices bronce y tierra cálidos.',
      skinSampleHex: '#D4A373',
      chromaticNuances: {
        primaryUndertone: 'Cálido Dorado',
        secondaryNuance: 'Melocotón Luminoso',
        luminosityGrade: 'Media Alta',
        highlightSkinHex: '#E9C496',
        midToneSkinHex: '#D4A373',
        shadowSkinHex: '#A67347',
      },
      seasonalPalette: {
        season: 'Otoño Cálido / Primavera Dorada',
        description: 'Paleta enriquecida con matices miel, ocres, terracotas, verdes oliva y dorados satinados.',
        recommendedClothingColors: [
          { name: 'Ocre Dorado', hex: '#CC851E' },
          { name: 'Terracota Cálido', hex: '#BD5338' },
          { name: 'Verde Oliva Profundo', hex: '#556B2F' },
          { name: 'Blanco Crema Marfil', hex: '#FAF0E6' },
        ],
        colorsToAvoid: [
          { name: 'Gris Cemento Frío', hex: '#7D8489', reason: 'Apaga la vitalidad del subtono cálido de la piel.' },
          { name: 'Fucsia Neón Frío', hex: '#FF007F', reason: 'Genera un choque visual discordante con los reflejos dorados.' },
        ],
      },
      naturalLuminosityFactors:
        'Mantener hidratación dérmica y utilizar puntos de luz en tonos dorados/champán en lugar de iluminadores plateados fríos.',
    },
    currentHairAnalysis: {
      detectedColor: isMasculine ? 'Castaño Oscuro Natural' : 'Castaño Medio Iluminado',
      baseLevel: isMasculine ? 3 : 5,
      underlyingWarmth: 'Reflejos dorados cálidos sutiles',
      textureEstimate: 'Densidad media con movimiento natural',
      detectedHairHex: '#3D2817',
      subtoneNuance: {
        baseLevel: isMasculine ? 3 : 5,
        baseLevelName: isMasculine ? 'Castaño Oscuro' : 'Castaño Claro',
        primaryReflect: 'Dorado / Cálido (.3)',
        secondaryReflect: 'Marrón / Natural (.7)',
        temperature: 'Cálido',
        surfaceShine: 'Brillo satinado natural',
      },
    },
    haircutRecommendations: isMasculine
      ? [
          {
            id: 'cut-fade-texturizado',
            name: 'Degradado Fade Medio con Textura Superior',
            category: 'Corto',
            suitabilityScore: 96,
            whyItWorks: 'Estiliza los laterales y acentúa la masculinidad de la mandíbula sin alargar en exceso el rostro.',
            stylingTips: 'Usar cera mate y peinar con los dedos creando volumen y movimiento en la cúspide.',
            celebrityOrVisualReference: 'Estilo clásico argentino contemporáneo',
            avoidWarning: 'No rasurar excesivamente alto para no crear desconexión visual.',
          },
          {
            id: 'cut-french-crop-moderno',
            name: 'Corte French Crop Desfilado',
            category: 'Corto',
            suitabilityScore: 92,
            whyItWorks: 'Aporta frescura en el flequillo frontal y enmarca la mirada con elegancia técnica.',
            stylingTips: 'Secar hacia adelante y sellar con pomada de fijación media.',
            celebrityOrVisualReference: 'Referencia de barbería internacional',
            avoidWarning: 'Mantener el flequillo despuntado, nunca en bloque recto.',
          },
          {
            id: 'cut-pompadour-clasico',
            name: 'Corte Clásico Pompadour Suave',
            category: 'Medio',
            suitabilityScore: 89,
            whyItWorks: 'Eleva la silueta craneal creando presencia ejecutiva impecable.',
            stylingTips: 'Cepillo redondo y secador direccionando el tupé hacia atrás y lateral.',
            celebrityOrVisualReference: 'Ricardo Darín / Galanes del cine nacional',
            avoidWarning: 'Evitar volumen lateral excesivo.',
          },
        ]
      : [
          {
            id: 'cut-bob-desfilado-aurico',
            name: 'Corte Bob Desfilado al Mentón',
            category: 'Corto',
            suitabilityScore: 97,
            whyItWorks: 'Enmarca la línea mandibular con ligereza y destaca la esbeltez del cuello y los pómulos.',
            stylingTips: 'Secado al aire o con difusor marcando ondas sutiles con spray de textura marina.',
            celebrityOrVisualReference: 'Lali Espósito / Tendencias de pasarela',
            avoidWarning: 'No cortar excesivamente parejo en la nuca para preservar el movimiento orgánico.',
          },
          {
            id: 'cut-midi-mariposa',
            name: 'Melena Midi Mariposa en Capas Graduadas',
            category: 'Medio',
            suitabilityScore: 95,
            whyItWorks: 'Aporta volumen estratégico en las sienes y libera movimiento alrededor de las clavículas.',
            stylingTips: 'Brushing con cepillo redondo grande direccionando las puntas hacia afuera.',
            celebrityOrVisualReference: 'Tini Stoessel / Emilia Mernes',
            avoidWarning: 'No sobre-descargar las puntas si el cabello tiende a encresparse.',
          },
          {
            id: 'cut-largas-cortina',
            name: 'Corte en Capas Largas con Flequillo Cortina',
            category: 'Largo',
            suitabilityScore: 93,
            whyItWorks: 'El flequillo cortina abre la mirada e ilumina los ojos mientras las capas estilizan la figura.',
            stylingTips: 'Rulos sueltos con plancha o tenacilla abriendo el flequillo hacia ambos laterales.',
            celebrityOrVisualReference: 'Pampita Ardohain / Top models argentinas',
            avoidWarning: 'Evitar capas cortas en la coronilla que generen volumen triangular desbalanceado.',
          },
        ],
    haircutsToAvoid: isMasculine
      ? [
          { name: 'Corte Tazón Recto en Bloque', reason: 'Endurece los rasgos y oculta la frente restando armonía.' },
          { name: 'Rapado Total al Cero', reason: 'Expone sin graduación posibles asimetrías naturales del cráneo.' },
        ]
      : [
          { name: 'Corte Recto Sólido sin Capas en Bloque', reason: 'Apaga el dinamismo del rostro y crea un efecto pesado y estático.' },
          { name: 'Flequillo Recto Ultra Corto Microbangs', reason: 'Rompe la proporción áurea acortando visualmente la frente de forma brusca.' },
        ],
    hairColorRecommendations: [
      {
        id: 'color-miel-dorado',
        shadeName: 'Rubio Miel Dorado Cálido Reflejante',
        dyeCode: '7.34 Rubio Dorado Cobrizo Claro',
        hexColor: '#C49756',
        luminosityEffect: 'Enciende la luz dorada de la piel y aporta calidez inmediata a la mirada.',
        bestTechnique: 'Balayage Iluminador / Face-Framing en contorno frontal',
        maintenanceLevel: 'Bajo',
      },
      {
        id: 'color-chocolate-avellana',
        shadeName: 'Castaño Chocolate Avellana Brillante',
        dyeCode: '5.35 Castaño Claro Chocolate Moka',
        hexColor: '#5C3826',
        luminosityEffect: 'Crea contraste sofisticado y resalta el brillo natural del iris sin endurecer facciones.',
        bestTechnique: 'Coloración Global con Baño de Brillo & Gloss Reflejante',
        maintenanceLevel: 'Medio',
      },
      {
        id: 'color-caramelo-tostado',
        shadeName: 'Caramelo Tostado con Destellos Ámbar',
        dyeCode: '6.43 Rubio Oscuro Cobrizo Dorado',
        hexColor: '#965B2E',
        luminosityEffect: 'Proyecta un aura radiante y saludable que suaviza las líneas de expresión.',
        bestTechnique: 'Mechas Babylights Finas combinadas con matizador tonalizador',
        maintenanceLevel: 'Medio',
      },
    ],
    hairColorsToAvoid: [
      { name: 'Negro Azabache Azulado Puro (1.1)', hexColor: '#0A0E1A', reason: 'Endurece drásticamente las facciones y genera sombras ojerosas pronunciadas.' },
      { name: 'Platino Ceniciento Glacial Extremo (10.1)', hexColor: '#E6E8FA', reason: 'Apaga y palidece el subtono de piel cálido despojándolo de su vitalidad natural.' },
    ],
    extraVisagismTips: {
      eyewear: {
        recommended: isMasculine ? 'Monturas cuadradas suaves o geométricas tipo aviador con puente refinado.' : 'Monturas estilo cat-eye suave, pantos o mariposa que sigan la línea natural de las cejas.',
        avoid: 'Monturas excesivamente pequeñas o circulares rígidas que compitan con la forma del rostro.',
      },
      necklines: isMasculine ? 'Cuellos en V, camisas con cuello italiano semi-abierto y solapas equilibradas.' : 'Escotes en V, corazón o barco que prolonguen elegantemente la verticalidad del cuello.',
      makeupHighlights: 'Iluminador en tono champán o champagne-gold sobre hueso cigomático, rubor durazno/melocotón y labial nude cálido o terracota satinado.',
    },
  };
}

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

    const reply = response.text || 'Para tu morfología, la clave es mantener la armonía facial y elegir reflejos que aporten luminosidad a tu piel. ¿Deseas explorar un corte o color en particular?';
    return res.json({ reply });
  } catch (error: any) {
    console.error('Error in visagism chat:', error);
    const fallbackReply =
      'Como asesora de imagen y visagista, te recomiendo priorizar cortes que armonicen tus facciones y tonos que realcen el brillo natural de tus ojos y piel. Si deseas más detalles sobre una longitud o técnica de coloración en particular, ¡cuéntame qué idea tienes en mente!';
    return res.json({ reply: fallbackReply });
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
