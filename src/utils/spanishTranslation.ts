import {
  VisagismReport,
  HaircutRecommendation,
  HairColorRecommendation,
  HaircutToAvoid,
  HairColorToAvoid,
} from '../types/visagism';

/**
 * Diccionario de categorías de corte a español
 */
export function translateHaircutCategory(cat: string | undefined): 'Corto' | 'Medio' | 'Largo' {
  if (!cat) return 'Medio';
  const c = cat.toLowerCase().trim();
  if (c.includes('short') || c.includes('corto') || c.includes('muy corto')) return 'Corto';
  if (c.includes('long') || c.includes('largo') || c.includes('xl')) return 'Largo';
  return 'Medio';
}

/**
 * Diccionario de niveles de mantenimiento a español
 */
export function translateMaintenance(level: string | undefined): 'Bajo' | 'Medio' | 'Alto' {
  if (!level) return 'Medio';
  const l = level.toLowerCase().trim();
  if (l.includes('low') || l.includes('bajo') || l.includes('mínimo') || l.includes('facil')) return 'Bajo';
  if (l.includes('high') || l.includes('alto') || l.includes('frecuente') || l.includes('exigente')) return 'Alto';
  return 'Medio';
}

/**
 * Diccionario de formas de rostro a español
 */
export function translateFaceShape(shape: string | undefined): string {
  if (!shape) return 'Armónico';
  const s = shape.toLowerCase().trim();
  if (s.includes('oval')) return 'Ovalado';
  if (s.includes('round') || s.includes('redond')) return 'Redondo';
  if (s.includes('square') || s.includes('cuadrad')) return 'Cuadrado';
  if (s.includes('heart') || s.includes('coraz')) return 'Corazón';
  if (s.includes('diamond') || s.includes('diamant')) return 'Diamante';
  if (s.includes('oblong') || s.includes('rectang') || s.includes('alargad')) return 'Alargado';
  return shape;
}

/**
 * Diccionario de subtonos de piel a español
 */
export function translateUndertone(undertone: string | undefined): string {
  if (!undertone) return 'Neutro';
  const u = undertone.toLowerCase().trim();
  if (u.includes('warm') || u.includes('cálid') || u.includes('calid')) return 'Cálido';
  if (u.includes('cool') || u.includes('frí') || u.includes('fri')) return 'Frío';
  if (u.includes('olive') || u.includes('oliv')) return 'Oliva';
  if (u.includes('neutral') || u.includes('neutr')) return 'Neutro';
  return undertone;
}

/**
 * Diccionario de profundidad de piel a español
 */
export function translateSkinTone(tone: string | undefined): string {
  if (!tone) return 'Medio';
  const t = tone.toLowerCase().trim();
  if (t.includes('fair') || t.includes('muy claro') || t.includes('pálid')) return 'Muy Claro';
  if (t.includes('light') || t.includes('claro')) return 'Claro';
  if (t.includes('deep') || t.includes('dark') || t.includes('oscur') || t.includes('profund')) return 'Oscuro / Profundo';
  if (t.includes('tan') || t.includes('broncead')) return 'Bronceado';
  if (t.includes('medium') || t.includes('medio') || t.includes('trigueñ')) return 'Medio / Trigueño';
  return tone;
}

/**
 * Diccionario de texturas capilares a español
 */
export function translateHairTexture(tex: string | undefined): string {
  if (!tex) return 'Normal';
  const t = tex.toLowerCase().trim();
  if (t.includes('straight') || t.includes('laci') || t.includes('lis')) return 'Lacio';
  if (t.includes('wavy') || t.includes('ondulad')) return 'Ondulado';
  if (t.includes('curly') || t.includes('rizad')) return 'Rizado';
  if (t.includes('coily') || t.includes('afro') || t.includes('kinky')) return 'Afro';
  if (t.includes('fine') || t.includes('fin')) return 'Fino';
  if (t.includes('thick') || t.includes('grues')) return 'Grueso';
  return tex;
}

/**
 * Diccionario de técnicas de tinte en español
 */
export function translateTechnique(tech: string | undefined): string {
  if (!tech) return 'Balayage Iluminador';
  const t = tech.toLowerCase().trim();
  if (t.includes('balayage')) return 'Balayage Iluminador Multidimensional';
  if (t.includes('face framing') || t.includes('money piece') || t.includes('contorno')) return 'Iluminación Frontal (Face Framing)';
  if (t.includes('babylights') || t.includes('micro mechas') || t.includes('highlights')) return 'Mechas Babylights Finas';
  if (t.includes('all-over') || t.includes('full color') || t.includes('global') || t.includes('tinte total')) return 'Coloración Global Uniforme';
  if (t.includes('root') || t.includes('sombre') || t.includes('fundido')) return 'Fundido / Sombreado de Raíz';
  if (t.includes('gloss') || t.includes('brillo') || t.includes('toner') || t.includes('matiz')) return 'Baño de Brillo & Gloss Iluminador';
  return tech;
}

/**
 * Traducción y adaptación de nombres de cortes comunes de peluquería al español
 */
const HAIRCUT_NAME_MAP: Record<string, string> = {
  'pixie': 'Corte Pixie Texturizado',
  'pixie cut': 'Corte Pixie Texturizado',
  'textured pixie': 'Corte Pixie Texturizado',
  'bob': 'Corte Bob Clásico',
  'blunt bob': 'Corte Bob Recto Pulido',
  'long bob': 'Corte Long Bob (Lob) Desfilado',
  'lob': 'Corte Long Bob (Lob) Desfilado',
  'french bob': 'Corte Bob Francés al Mentón',
  'layered bob': 'Corte Bob en Capas Fluidas',
  'shag': 'Corte Shaggy con Capas y Textura',
  'shaggy': 'Corte Shaggy Descontracturado',
  'wolf cut': 'Corte Wolf Cut en Capas Degradadas',
  'butterfly cut': 'Corte Mariposa (Butterfly Cut) con Capas',
  'curtain bangs': 'Corte en Capas con Flequillo Cortina',
  'long layers': 'Corte en Capas Largas con Movimiento',
  'layered cut': 'Corte en Capas Escalonadas',
  'side swept': 'Corte Desfilado con Raya al Lado',
  'fade': 'Corte Degradado Fade Técnico',
  'low fade': 'Corte Degradado Bajo (Low Fade)',
  'mid fade': 'Corte Degradado Medio (Mid Fade)',
  'high fade': 'Corte Degradado Alto (High Fade)',
  'buzz cut': 'Corte Rapado Uniforme (Buzz Cut)',
  'crew cut': 'Corte Clásico Militar Texturizado',
  'french crop': 'Corte Francés Texturizado (Crop)',
  'pompadour': 'Corte Pompadour con Volumen Superior',
  'undercut': 'Corte Desconectado (Undercut)',
  'taper fade': 'Degradado Cónico Pulido (Taper Fade)',
  'quiff': 'Corte con Tupé Texturizado',
  'mullet': 'Corte Mullet Moderno',
};

export function translateCutName(name: string): string {
  if (!name) return 'Corte Estilizador Personalizado';
  const lower = name.toLowerCase().trim();

  // Coincidencia exacta
  if (HAIRCUT_NAME_MAP[lower]) {
    return HAIRCUT_NAME_MAP[lower];
  }

  let translated = name;

  // Reemplazo de palabras clave en inglés de peluquería
  const replacements: [RegExp, string][] = [
    [/\btextured pixie cut\b/gi, 'Corte Pixie Texturizado'],
    [/\bpixie cut\b/gi, 'Corte Pixie'],
    [/\bblunt bob\b/gi, 'Corte Bob Recto Pulido'],
    [/\blong bob\b/gi, 'Long Bob Desfilado'],
    [/\bfrench bob\b/gi, 'Bob Francés al Mentón'],
    [/\bbutterfly cut\b/gi, 'Corte Mariposa en Capas'],
    [/\bwolf cut\b/gi, 'Corte Wolf Cut con Textura'],
    [/\bcurtain bangs\b/gi, 'Flequillo Cortina'],
    [/\bface framing layers\b/gi, 'Capas que Enmarcan el Rostro'],
    [/\bface-framing\b/gi, 'Enmarcado Frontal'],
    [/\blong layered waves\b/gi, 'Capas Largas con Ondas Suaves'],
    [/\blayered cut\b/gi, 'Corte en Capas Escalonadas'],
    [/\blayers\b/gi, 'Capas'],
    [/\bbuzz cut\b/gi, 'Corte Rapado (Buzz Cut)'],
    [/\bfrench crop\b/gi, 'Corte Francés Texturizado'],
    [/\blow fade\b/gi, 'Degradado Bajo (Low Fade)'],
    [/\bmid fade\b/gi, 'Degradado Medio (Mid Fade)'],
    [/\bhigh fade\b/gi, 'Degradado Alto (High Fade)'],
    [/\btaper fade\b/gi, 'Degradado Cónico (Taper Fade)'],
    [/\bundercut\b/gi, 'Corte Desconectado (Undercut)'],
    [/\bquiff\b/gi, 'Tupé Texturizado'],
    [/\bpompadour\b/gi, 'Pompadour Clásico'],
    [/\bcrew cut\b/gi, 'Corte Militar Texturizado'],
    [/\btextured fringe\b/gi, 'Flequillo Texturizado'],
    [/\bside-swept bangs\b/gi, 'Flequillo Lateral Desfilado'],
    [/\bshag cut\b/gi, 'Corte Shaggy'],
    [/\bshoulder length\b/gi, 'A la Altura de los Hombros'],
    [/\bchin length\b/gi, 'A la Altura del Mentón'],
    [/\bcollarbone length\b/gi, 'A la Clavícula'],
    [/\bshort hair\b/gi, 'Cabello Corto'],
    [/\blong hair\b/gi, 'Cabello Largo'],
    [/\bmedium hair\b/gi, 'Cabello Medio'],
  ];

  for (const [pattern, repl] of replacements) {
    translated = translated.replace(pattern, repl);
  }

  // Si no empieza con "Corte", "Melena", "Degradado", agregarlo para mayor elegancia técnica
  if (
    !translated.startsWith('Corte') &&
    !translated.startsWith('Melena') &&
    !translated.startsWith('Degradado') &&
    !translated.startsWith('Flequillo') &&
    !translated.startsWith('Estilo')
  ) {
    translated = `Corte ${translated}`;
  }

  return translated.trim();
}

/**
 * Traducción de nombres de tonos de tintes al español
 */
export function translateDyeName(shadeName: string): string {
  if (!shadeName) return 'Tono Iluminador de Salón';
  let s = shadeName;

  const dyeReplacements: [RegExp, string][] = [
    [/\bhoney blonde\b/gi, 'Rubio Miel Dorado'],
    [/\bash blonde\b/gi, 'Rubio Ceniza Luminoso'],
    [/\bplatinum blonde\b/gi, 'Rubio Platino Nórdico'],
    [/\bgolden blonde\b/gi, 'Rubio Dorado Cálido'],
    [/\bcaramel blonde\b/gi, 'Rubio Caramelo Suave'],
    [/\bcaramel\b/gi, 'Caramelo Cálido'],
    [/\bchocolate brown\b/gi, 'Castaño Chocolate Intenso'],
    [/\bchestnut brown\b/gi, 'Castaño Avellana Tostado'],
    [/\bmocha brown\b/gi, 'Castaño Moka Profundo'],
    [/\bwarm chestnut\b/gi, 'Castaño Cálido Cobrizo'],
    [/\bdark brown\b/gi, 'Castaño Oscuro Natural'],
    [/\blight brown\b/gi, 'Castaño Claro Iluminador'],
    [/\bmedium brown\b/gi, 'Castaño Medio Armónico'],
    [/\bcopper red\b/gi, 'Cobrizo Rojizo Vibrante'],
    [/\bcopper\b/gi, 'Cobrizo Reflejante'],
    [/\bauburn\b/gi, 'Caoba Rojizo Profundo'],
    [/\bjet black\b/gi, 'Negro Azabache Puro'],
    [/\bsoft black\b/gi, 'Negro Suave Natural'],
    [/\bespresso\b/gi, 'Café Espresso Profundo'],
    [/\bcinnamon\b/gi, 'Canela Especiada'],
    [/\brose gold\b/gi, 'Oro Rosa Iluminador'],
    [/\bbalayage\b/gi, 'Balayage Reflejante'],
    [/\bhighlights\b/gi, 'Reflejos Iluminadores'],
  ];

  for (const [pattern, repl] of dyeReplacements) {
    s = s.replace(pattern, repl);
  }

  return s.trim();
}

/**
 * Traduce frases residuales en inglés en textos descriptivos
 */
export function translateTextContent(text: string | undefined): string {
  if (!text) return '';
  let str = text;

  const phraseReplacements: [RegExp, string][] = [
    [/\belongates the face\b/gi, 'alarga visualmente el rostro'],
    [/\bsoftens the jawline\b/gi, 'suaviza la línea de la mandíbula'],
    [/\bsoftens facial angles\b/gi, 'suaviza los ángulos faciales'],
    [/\badds volume\b/gi, 'aporta volumen estratégico'],
    [/\badds width\b/gi, 'aporta amplitud visual'],
    [/\bbalances proportions\b/gi, 'equilibra las proporciones del rostro'],
    [/\blow maintenance\b/gi, 'bajo mantenimiento'],
    [/\bhigh maintenance\b/gi, 'alto mantenimiento'],
    [/\bmedium maintenance\b/gi, 'mantenimiento medio'],
    [/\bstyle with\b/gi, 'peinar con'],
    [/\bblow dry\b/gi, 'secar con secador'],
    [/\bair dry\b/gi, 'secar al aire'],
    [/\bcurling iron\b/gi, 'rizador o tenaza'],
    [/\bflat iron\b/gi, 'plancha alisadora'],
    [/\bround brush\b/gi, 'cepillo redondo'],
    [/\bsea salt spray\b/gi, 'spray de sal marina texturizante'],
    [/\bmatte pomade\b/gi, 'pomada mate'],
    [/\bcenter part\b/gi, 'raya al centro'],
    [/\bside part\b/gi, 'raya al costado'],
    [/\bhardens facial features\b/gi, 'endurece los rasgos faciales'],
    [/\bwashes out\b/gi, 'apaga la luminosidad de'],
    [/\bwarm undertones\b/gi, 'subtonos cálidos'],
    [/\bcool undertones\b/gi, 'subtonos fríos'],
    [/\bneutral undertones\b/gi, 'subtonos neutros'],
  ];

  for (const [pattern, repl] of phraseReplacements) {
    str = str.replace(pattern, repl);
  }

  return str.trim();
}

/**
 * Normaliza un reporte completo de visagismo para asegurar que el 100%
 * de los cortes, tintes, categorías, técnicas y motivos estén en español impecable.
 */
export function normalizeReportToSpanish(report: VisagismReport): VisagismReport {
  if (!report) return report;

  const translatedHaircuts: HaircutRecommendation[] = (report.haircutRecommendations || []).map((cut, idx) => ({
    ...cut,
    name: translateCutName(cut.name),
    category: translateHaircutCategory(cut.category),
    whyItWorks: translateTextContent(cut.whyItWorks),
    stylingTips: translateTextContent(cut.stylingTips),
    celebrityOrVisualReference: cut.celebrityOrVisualReference
      ? translateTextContent(cut.celebrityOrVisualReference)
      : undefined,
  }));

  const translatedAvoidCuts: HaircutToAvoid[] = (report.haircutsToAvoid || []).map((avoid) => ({
    name: translateCutName(avoid.name),
    reason: translateTextContent(avoid.reason),
  }));

  const translatedHairColors: HairColorRecommendation[] = (report.hairColorRecommendations || []).map((col) => ({
    ...col,
    shadeName: translateDyeName(col.shadeName),
    maintenanceLevel: translateMaintenance(col.maintenanceLevel),
    bestTechnique: translateTechnique(col.bestTechnique),
    luminosityEffect: translateTextContent(col.luminosityEffect),
  }));

  const translatedAvoidColors: HairColorToAvoid[] = (report.hairColorsToAvoid || []).map((avoid) => ({
    name: translateDyeName(avoid.name),
    hexColor: avoid.hexColor,
    reason: translateTextContent(avoid.reason),
  }));

  const translatedFaceShape = translateFaceShape(report.faceShape);

  return {
    ...report,
    faceShape: translatedFaceShape,
    faceAnalysis: {
      ...report.faceAnalysis,
      faceShape: translatedFaceShape,
      proportionsDescription: translateTextContent(report.faceAnalysis?.proportionsDescription),
      keyFeatures: (report.faceAnalysis?.keyFeatures || []).map(translateTextContent),
    },
    skinAnalysis: {
      ...report.skinAnalysis,
      tone: translateSkinTone(report.skinAnalysis?.tone),
      undertone: translateUndertone(report.skinAnalysis?.undertone),
      undertoneExplanation: translateTextContent(report.skinAnalysis?.undertoneExplanation),
      naturalLuminosityFactors: translateTextContent(report.skinAnalysis?.naturalLuminosityFactors),
      seasonalPalette: report.skinAnalysis?.seasonalPalette
        ? {
            ...report.skinAnalysis.seasonalPalette,
            description: translateTextContent(report.skinAnalysis.seasonalPalette.description),
          }
        : report.skinAnalysis?.seasonalPalette,
    },
    currentHairAnalysis: {
      ...report.currentHairAnalysis,
      detectedColor: translateTextContent(report.currentHairAnalysis?.detectedColor),
      textureEstimate: translateHairTexture(report.currentHairAnalysis?.textureEstimate),
      underlyingWarmth: translateTextContent(report.currentHairAnalysis?.underlyingWarmth),
    },
    haircutRecommendations: translatedHaircuts,
    haircutsToAvoid: translatedAvoidCuts,
    hairColorRecommendations: translatedHairColors,
    hairColorsToAvoid: translatedAvoidColors,
    extraVisagismTips: report.extraVisagismTips
      ? {
          eyewear: {
            recommended: translateTextContent(report.extraVisagismTips.eyewear?.recommended),
            avoid: translateTextContent(report.extraVisagismTips.eyewear?.avoid),
          },
          necklines: translateTextContent(report.extraVisagismTips.necklines),
          makeupHighlights: translateTextContent(report.extraVisagismTips.makeupHighlights),
        }
      : report.extraVisagismTips,
  };
}
