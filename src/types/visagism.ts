export interface FacialMeasurements {
  lengthToWidthRatio: number; // e.g. 1.45
  foreheadWidthPercent: number; // relative proportion
  cheekboneWidthPercent: number;
  jawlineWidthPercent: number;
  jawlineAngle: 'Suave' | 'Medio' | 'Marcado / Angular';
  chinShape: 'Redondeada' | 'Puntiaguda / Cónica' | 'Cuadrada' | 'Ovalada';
}

export interface ChromaticNuances {
  primaryUndertone: 'Cálido' | 'Frío' | 'Neutro' | 'Oliva';
  secondaryNuance: string; // e.g. "Dorado melocotón sutil", "Rosado frío translúcido", "Verdoso oliva tenue"
  luminosityGrade: 'Alta' | 'Media' | 'Baja';
  highlightSkinHex: string; // punto de luz
  midToneSkinHex: string; // tono medio
  shadowSkinHex: string; // tono sombra contorno
}

export interface HairSubtoneNuance {
  baseLevel: number; // 1 to 10
  baseLevelName: string; // e.g. "Castaño Claro altura 5"
  primaryReflect: string; // e.g. ".3 Dorado", ".1 Ceniza", ".4 Cobrizo", ".0 Natural"
  secondaryReflect?: string;
  temperature: 'Cálido' | 'Frío' | 'Neutro';
  grayHairPercentage?: number;
  surfaceShine: 'Opaco' | 'Satinado' | 'Brillante';
}

export interface FaceAnalysis {
  faceShape: string;
  faceShapeEnglish?: string;
  confidenceScore: number;
  proportionsDescription: string;
  keyFeatures: string[];
  geometricRatio?: string;
  visualDescription?: string;
  measurements?: FacialMeasurements;
}

export interface ClothingColor {
  name: string;
  hex: string;
}

export interface ColorToAvoidClothing {
  name: string;
  hex: string;
  reason: string;
}

export interface SeasonalPalette {
  season: string;
  description: string;
  recommendedClothingColors: ClothingColor[];
  colorsToAvoid: ColorToAvoidClothing[];
}

export interface SkinAnalysis {
  tone: string;
  undertone: string;
  undertoneExplanation: string;
  skinSampleHex: string;
  chromaticNuances?: ChromaticNuances;
  seasonalPalette: SeasonalPalette;
  naturalLuminosityFactors: string;
}

export interface CurrentHairAnalysis {
  detectedColor: string;
  baseLevel: number;
  underlyingWarmth: string;
  textureEstimate: string;
  detectedHairHex: string;
  subtoneNuance?: HairSubtoneNuance;
}

export interface HaircutRecommendation {
  id: string;
  name: string;
  category: 'Corto' | 'Medio' | 'Largo' | string;
  suitabilityScore: number;
  whyItWorks: string;
  stylingTips: string;
  celebrityOrVisualReference?: string;
  avoidWarning?: string;
  imageUrl?: string;
}

export interface HaircutToAvoid {
  name: string;
  reason: string;
}

export interface HairColorRecommendation {
  id: string;
  shadeName: string;
  dyeCode: string;
  hexColor: string;
  secondaryHex?: string;
  luminosityEffect: string;
  bestTechnique: string;
  maintenanceLevel: 'Bajo' | 'Medio' | 'Alto' | string;
  imageUrl?: string;
}

export interface HairColorToAvoid {
  name: string;
  hexColor: string;
  reason: string;
}

export interface ExtraVisagismTips {
  eyewear: {
    recommended: string;
    avoid: string;
  };
  necklines: string;
  makeupHighlights: string;
}

export interface VisagismReport {
  id?: string;
  timestamp?: number;
  imageUrl: string;
  faceShape: string;
  proportionsDescription?: string;
  faceAnalysis: FaceAnalysis;
  skinAnalysis: SkinAnalysis;
  currentHairAnalysis: CurrentHairAnalysis;
  haircutRecommendations: HaircutRecommendation[];
  haircutsToAvoid: HaircutToAvoid[];
  hairColorRecommendations: HairColorRecommendation[];
  hairColorsToAvoid: HairColorToAvoid[];
  extraVisagismTips: ExtraVisagismTips;
}

export interface SampleModel {
  id: string;
  name: string;
  tag: string;
  imageUrl: string;
  expectedShape: string;
  gender: 'femenino' | 'masculino';
}
