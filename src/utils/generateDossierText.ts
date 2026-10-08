import { VisagismReport } from '../types/visagism';
import { normalizeReportToSpanish } from './spanishTranslation';

export function generateDossierText(rawReport: VisagismReport): string {
  const report = normalizeReportToSpanish(rawReport);
  const dateStr = new Date(report.timestamp || Date.now()).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const divider = '========================================================================\n';
  const subDivider = '------------------------------------------------------------------------\n';

  let txt = '';
  txt += divider;
  txt += ' ESCUELA TÉCNICA DR. JUAN GREGORIO PUJOL • FORMACIÓN PROFESIONAL PELUQUERÍA I\n';
  txt += '       MUESTRA TÉCNICA 2026 — FICHA TÉCNICA DE VISAGISMO, CORTES Y TINTES\n';
  txt += divider;
  txt += `Fecha: ${dateStr}\n`;
  txt += `ID de Ficha: ${report.id || 'FICHA-OFICIAL'}\n\n`;

  txt += '1. DIAGNÓSTICO MORFOLÓGICO FACIAL\n';
  txt += subDivider;
  txt += `Forma de Rostro: Rostro ${report.faceShape}\n`;
  txt += `Proporciones: ${report.faceAnalysis?.proportionsDescription || 'Estructura ósea equilibrada'}\n`;
  if (report.faceAnalysis?.keyFeatures?.length) {
    txt += `Rasgos clave: ${report.faceAnalysis.keyFeatures.join(', ')}\n`;
  }
  txt += '\n';

  txt += '2. COLORIMETRÍA & SUBTONO DE PIEL\n';
  txt += subDivider;
  txt += `Profundidad de Tono: ${report.skinAnalysis?.tone}\n`;
  txt += `Subtono Exacto: ${report.skinAnalysis?.undertone}\n`;
  txt += `Explicación Cromática: ${report.skinAnalysis?.undertoneExplanation}\n`;
  txt += `Muestra Hexadecimal: ${report.skinAnalysis?.skinSampleHex}\n`;
  txt += `Estación Personal: ${report.skinAnalysis?.seasonalPalette?.season}\n`;
  txt += `Factor de Luz Natural: ${report.skinAnalysis?.naturalLuminosityFactors}\n\n`;

  txt += '3. DIAGNÓSTICO DE CABELLO ACTUAL\n';
  txt += subDivider;
  txt += `Altura de Tono Base: Nivel ${report.currentHairAnalysis?.baseLevel} (${report.currentHairAnalysis?.detectedColor})\n`;
  txt += `Calidez Subyacente: ${report.currentHairAnalysis?.underlyingWarmth}\n`;
  txt += `Textura: ${report.currentHairAnalysis?.textureEstimate}\n\n`;

  txt += '4. CORTES DE CABELLO RECOMENDADOS (COMPENSACIÓN GEOMÉTRICA)\n';
  txt += subDivider;
  report.haircutRecommendations.forEach((cut, i) => {
    txt += `${i + 1}. ${cut.name.toUpperCase()} (Largo: ${cut.category}) - ${cut.suitabilityScore}% Compatibilidad\n`;
    txt += `   • Por qué te favorece: ${cut.whyItWorks}\n`;
    txt += `   • Consejos de peinado: ${cut.stylingTips}\n`;
    if (cut.celebrityOrVisualReference) {
      txt += `   • Referencia visual: ${cut.celebrityOrVisualReference}\n`;
    }
    txt += '\n';
  });

  if (report.haircutsToAvoid?.length) {
    txt += '   [!] CORTES Y ESTILOS A EVITAR:\n';
    report.haircutsToAvoid.forEach((avoid) => {
      txt += `   ✕ ${avoid.name}: ${avoid.reason}\n`;
    });
    txt += '\n';
  }

  txt += '5. PALETA DE COLOR & FÓRMULAS DE TINTE ILUMINADORAS\n';
  txt += subDivider;
  report.hairColorRecommendations.forEach((col, i) => {
    txt += `${i + 1}. ${col.shadeName.toUpperCase()} - Fórmula: ${col.dyeCode}\n`;
    txt += `   • Tono Hex: ${col.hexColor} | Mantenimiento: ${col.maintenanceLevel}\n`;
    txt += `   • Efecto de luz natural: ${col.luminosityEffect}\n`;
    txt += `   • Técnica sugerida: ${col.bestTechnique}\n\n`;
  });

  if (report.hairColorsToAvoid?.length) {
    txt += '   [!] TONOS DE TINTE A EVITAR:\n';
    report.hairColorsToAvoid.forEach((avoid) => {
      txt += `   ✕ ${avoid.name}: ${avoid.reason}\n`;
    });
    txt += '\n';
  }

  txt += '6. RECOMENDACIONES EXTRA DE VISAGISMO\n';
  txt += subDivider;
  txt += `Lentes recomendadas: ${report.extraVisagismTips?.eyewear?.recommended}\n`;
  txt += `Lentes a evitar: ${report.extraVisagismTips?.eyewear?.avoid}\n`;
  txt += `Escotes favorables: ${report.extraVisagismTips?.necklines}\n`;
  txt += `Puntos de maquillaje: ${report.extraVisagismTips?.makeupHighlights}\n\n`;

  txt += divider;
  txt += 'Presenta esta ficha técnica a tu peluquero o estilista de confianza.\n';
  txt += 'Escuela Técnica Dr. Juan Gregorio Pujol • Formación Profesional Peluquería I • Muestra Técnica 2026\n';
  txt += divider;

  return txt;
}
