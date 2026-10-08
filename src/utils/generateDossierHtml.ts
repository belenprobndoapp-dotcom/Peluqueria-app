import { VisagismReport } from '../types/visagism';
import { getHaircutImage, getHairColorImage } from './visagismVisuals';
import { normalizeReportToSpanish } from './spanishTranslation';

/**
 * Builds a completely self-contained, standalone luxury HTML document of the Visagism Dossier.
 * Works offline, in any browser (mobile or desktop), and can be printed or saved as PDF directly.
 */
export function generateDossierHtml(rawReport: VisagismReport): string {
  const report = normalizeReportToSpanish(rawReport);
  const dateStr = new Date(report.timestamp || Date.now()).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const haircutsHtml = report.haircutRecommendations
    .map((cut, idx) => {
      const img = cut.imageUrl || getHaircutImage(cut.name, cut.category, idx);
      return `
      <div class="cut-card">
        <div class="card-img-wrap">
          <img src="${img}" alt="${cut.name}" />
          <span class="match-badge">${cut.suitabilityScore}% Compatibilidad</span>
        </div>
        <div class="card-body">
          <div class="card-header">
            <h4>${cut.name}</h4>
            <span class="category-tag">Largo: ${cut.category}</span>
          </div>
          <p class="why-works"><strong>Efecto compensatorio:</strong> ${cut.whyItWorks}</p>
          <p class="styling-tips"><strong>Estilizado & Volumen:</strong> ${cut.stylingTips}</p>
        </div>
      </div>
    `;
    })
    .join('');

  const hairColorsHtml = report.hairColorRecommendations
    .map((col, idx) => {
      const img = col.imageUrl || getHairColorImage(col.shadeName, col.dyeCode, col.hexColor, idx);
      return `
      <div class="color-card">
        <div class="card-img-wrap">
          <img src="${img}" alt="${col.shadeName}" />
          <div class="color-swatch-pip" style="background-color: ${col.hexColor};"></div>
        </div>
        <div class="card-body">
          <div class="card-header">
            <h4>${col.shadeName}</h4>
            <span class="dye-badge">Fórmula: ${col.dyeCode}</span>
          </div>
          <div class="color-details">
            <span class="hex-label">Tono Hex: <code>${col.hexColor}</code></span>
            <span class="maint-label">Mantenimiento: <strong>${col.maintenanceLevel}</strong></span>
          </div>
          <p class="why-works"><strong>Luz natural en tu rostro:</strong> ${col.luminosityEffect}</p>
          <p class="styling-tips"><strong>Técnica recomendada:</strong> ${col.bestTechnique}</p>
        </div>
      </div>
    `;
    })
    .join('');

  const avoidCutsHtml = (report.haircutsToAvoid || [])
    .map(
      (c) => `
    <div class="avoid-item">
      <strong>✕ ${c.name}</strong>: <span>${c.reason}</span>
    </div>
  `
    )
    .join('');

  const avoidColorsHtml = (report.hairColorsToAvoid || [])
    .map(
      (c) => `
    <div class="avoid-item">
      <span class="avoid-swatch" style="background-color: ${c.hexColor};"></span>
      <div>
        <strong>✕ ${c.name}</strong>: <span>${c.reason}</span>
      </div>
    </div>
  `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ficha Técnica de Visagismo - ${report.faceShape}</title>
  <style>
    :root {
      --gold: #c58b45;
      --gold-dark: #9a6524;
      --gold-light: #faf5ee;
      --rose: #c44d56;
      --dark: #121212;
      --text: #222222;
      --text-muted: #666666;
      --border: #e6decb;
      --bg-card: #ffffff;
      --bg-page: #fdfbf7;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: var(--bg-page);
      color: var(--text);
      line-height: 1.5;
      padding: 24px;
    }

    /* Fixed Action Bar at Top */
    .top-action-bar {
      position: sticky;
      top: 12px;
      z-index: 100;
      max-width: 900px;
      margin: 0 auto 24px auto;
      padding: 12px 20px;
      background: rgba(18, 18, 18, 0.94);
      backdrop-filter: blur(12px);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #fff;
      box-shadow: 0 10px 30px rgba(0,0,0,0.25);
    }

    .top-action-bar .brand {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 1px;
      color: #f3c27e;
      text-transform: uppercase;
    }

    .top-action-bar .actions {
      display: flex;
      gap: 10px;
    }

    .btn-print {
      background: linear-gradient(135deg, #f3c27e, #c58b45);
      color: #111;
      font-weight: 800;
      font-size: 12px;
      border: none;
      padding: 8px 18px;
      border-radius: 10px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: transform 0.15s ease;
    }
    .btn-print:hover { transform: scale(1.03); }

    /* Main Container */
    .dossier-wrapper {
      max-width: 900px;
      margin: 0 auto;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.06);
    }

    /* Header */
    .dossier-header {
      border-bottom: 2px solid var(--gold);
      padding-bottom: 20px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .subtitle-badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--gold-dark);
      background: var(--gold-light);
      padding: 4px 10px;
      border-radius: 6px;
      margin-bottom: 6px;
    }

    .dossier-header h1 {
      font-size: 26px;
      font-weight: 800;
      color: #111;
      letter-spacing: -0.5px;
    }

    .dossier-meta {
      text-align: right;
      font-size: 11px;
      color: var(--text-muted);
    }

    /* Client Profile Card */
    .client-card {
      display: flex;
      gap: 24px;
      background: #faf7f2;
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 20px;
      margin-bottom: 28px;
    }

    .client-photo {
      width: 140px;
      height: 160px;
      border-radius: 14px;
      overflow: hidden;
      border: 2px solid var(--gold);
      flex-shrink: 0;
      background: #000;
    }

    .client-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .client-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
    }

    .info-block label {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 800;
      letter-spacing: 1px;
      color: var(--text-muted);
      display: block;
      margin-bottom: 2px;
    }

    .info-block .value {
      font-size: 17px;
      font-weight: 800;
      color: var(--gold-dark);
    }

    .info-block .sub {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .skin-swatch {
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 1.5px solid #ccc;
      vertical-align: middle;
      margin-left: 6px;
    }

    /* Sections */
    .section-title {
      font-size: 14px;
      text-transform: uppercase;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: #111;
      border-bottom: 1.5px solid #eee;
      padding-bottom: 8px;
      margin: 32px 0 16px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }

    .cut-card, .color-card {
      display: flex;
      gap: 14px;
      background: #ffffff;
      border: 1px solid #ebe5d8;
      border-radius: 16px;
      padding: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.02);
    }

    .card-img-wrap {
      width: 96px;
      height: 110px;
      border-radius: 12px;
      overflow: hidden;
      flex-shrink: 0;
      background: #111;
      position: relative;
    }

    .card-img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .match-badge {
      position: absolute;
      top: 4px;
      left: 4px;
      background: rgba(18, 18, 18, 0.85);
      color: #f3c27e;
      font-size: 9px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 6px;
    }

    .color-swatch-pip {
      position: absolute;
      bottom: 4px;
      right: 4px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 2px solid #fff;
    }

    .card-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-width: 0;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
    }

    .card-header h4 {
      font-size: 13px;
      font-weight: 800;
      color: #111;
      line-height: 1.3;
    }

    .category-tag {
      font-size: 10px;
      font-weight: 700;
      background: #fdf2e4;
      color: var(--gold-dark);
      padding: 2px 6px;
      border-radius: 6px;
      white-space: nowrap;
    }

    .dye-badge {
      font-size: 10px;
      font-family: monospace;
      font-weight: 800;
      background: #fdebed;
      color: var(--rose);
      padding: 2px 6px;
      border-radius: 6px;
      white-space: nowrap;
    }

    .why-works {
      font-size: 11px;
      color: #444;
      margin: 4px 0;
      line-height: 1.35;
    }

    .styling-tips {
      font-size: 10px;
      color: #666;
    }

    .color-details {
      display: flex;
      gap: 12px;
      font-size: 10.5px;
      color: var(--text-muted);
      margin: 2px 0 4px 0;
    }

    /* Warning boxes */
    .avoid-box {
      background: #fff8f8;
      border: 1px solid #fbd6d9;
      border-radius: 14px;
      padding: 14px;
      margin-top: 14px;
      font-size: 11px;
    }

    .avoid-box h5 {
      color: var(--rose);
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }

    .avoid-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 4px;
      color: #555;
    }

    .avoid-swatch {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 1px solid #ccc;
      margin-top: 3px;
      flex-shrink: 0;
    }

    /* Extra Visagism Box */
    .extra-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      background: #faf7f2;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 16px;
      margin-top: 24px;
      font-size: 11px;
    }

    .extra-block strong {
      color: var(--gold-dark);
      display: block;
      margin-bottom: 3px;
      text-transform: uppercase;
      font-size: 10px;
    }

    /* Footer */
    .dossier-footer {
      border-top: 1px solid #eee;
      padding-top: 16px;
      margin-top: 32px;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: var(--text-muted);
    }

    /* Print Styles */
    @media print {
      body { background: #fff; padding: 0; }
      .top-action-bar { display: none; }
      .dossier-wrapper { border: none; box-shadow: none; padding: 0; max-width: 100%; }
      .client-card, .cut-card, .color-card, .extra-grid { break-inside: avoid; }
    }
  </style>
</head>
<body>

  <!-- Top Sticky Bar with 1-Click Print / PDF Trigger -->
  <div class="top-action-bar">
    <div class="brand">Escuela Técnica Dr. Juan Gregorio Pujol • Peluquería I</div>
    <div class="actions">
      <button onclick="window.print()" class="btn-print">
        🖨️ Imprimir / Guardar en PDF
      </button>
    </div>
  </div>

  <div class="dossier-wrapper">
    <!-- Header -->
    <header class="dossier-header">
      <div>
        <span class="subtitle-badge">Escuela Técnica Dr. Juan Gregorio Pujol • Muestra Técnica 2026</span>
        <h1>Ficha Técnica de Asesoría Facial (Cortes y Tintes)</h1>
        <p style="font-size: 11px; color: #666; margin-top: 2px;">
          Formación Profesional • Peluquería I — Diagnóstico morfológico, diseño de corte y colorimetría en español
        </p>
      </div>
      <div class="dossier-meta">
        <div><strong>Fecha:</strong> ${dateStr}</div>
        <div style="color: var(--gold-dark); font-weight: 700; margin-top: 2px;">ID: ${report.id || 'FICHA-OFICIAL'}</div>
      </div>
    </header>

    <!-- Client Profile & Diagnosis -->
    <div class="client-card">
      <div class="client-photo">
        <img src="${report.imageUrl}" alt="Foto frontal del cliente" />
      </div>

      <div class="client-info">
        <div class="info-grid">
          <div class="info-block">
            <label>Tipo de Rostro</label>
            <div class="value">Rostro ${report.faceShape}</div>
            <div class="sub">${report.faceAnalysis?.proportionsDescription || 'Proporciones faciales armónicas.'}</div>
          </div>

          <div class="info-block">
            <label>Tono de Piel & Subtono</label>
            <div class="value" style="color: var(--rose);">
              ${report.skinAnalysis?.tone} (${report.skinAnalysis?.undertone})
              <span class="skin-swatch" style="background-color: ${report.skinAnalysis?.skinSampleHex || '#d9b38c'};"></span>
            </div>
            <div class="sub">Estación: <strong>${report.skinAnalysis?.seasonalPalette?.season || 'Primavera'}</strong></div>
          </div>

          <div class="info-block">
            <label>Cabello Actual</label>
            <div class="value" style="color: #333;">Nivel ${report.currentHairAnalysis?.baseLevel || '5'}</div>
            <div class="sub">${report.currentHairAnalysis?.detectedColor || 'Castaño'} (${report.currentHairAnalysis?.textureEstimate || 'Normal'})</div>
          </div>

          <div class="info-block">
            <label>Factor de Luminosidad</label>
            <div class="sub" style="color: #444; margin-top: 4px;">
              ${report.skinAnalysis?.naturalLuminosityFactors || 'Contraste cálido y luminoso que favorece reflejos dorados y avellana.'}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Haircuts Section -->
    <section>
      <h3 class="section-title">
        <span>✂</span> Cortes de Cabello que Más Te Favorecen (Diseño y Geometría)
      </h3>

      <div class="cards-grid">
        ${haircutsHtml}
      </div>

      ${
        avoidCutsHtml
          ? `
        <div class="avoid-box">
          <h5>✕ Cortes a Evitar (Descompensan la fisonomía)</h5>
          ${avoidCutsHtml}
        </div>
      `
          : ''
      }
    </section>

    <!-- Hair Colors Section -->
    <section>
      <h3 class="section-title" style="margin-top: 36px;">
        <span>🎨</span> Fórmulas de Color & Tintes Iluminadores Recomendados
      </h3>

      <div class="cards-grid">
        ${hairColorsHtml}
      </div>

      ${
        avoidColorsHtml
          ? `
        <div class="avoid-box">
          <h5>✕ Tonos de Tinte a Evitar (Apagan la luz de tu piel)</h5>
          ${avoidColorsHtml}
        </div>
      `
          : ''
      }
    </section>

    <!-- Extra Tips -->
    <section>
      <div class="extra-grid">
        <div class="extra-block">
          <strong>👓 Lentes & Monturas Ideales</strong>
          <p><strong>Favorece:</strong> ${report.extraVisagismTips?.eyewear?.recommended || 'Marcos que estilicen el contorno.'}</p>
          <p style="color: #777; margin-top: 2px;"><strong>Evitar:</strong> ${report.extraVisagismTips?.eyewear?.avoid || 'Marcos de igual forma ósea.'}</p>
        </div>

        <div class="extra-block">
          <strong>✨ Escotes & Puntos de Luz</strong>
          <p><strong>Escotes:</strong> ${report.extraVisagismTips?.necklines || 'Escote en V o barco.'}</p>
          <p style="color: #777; margin-top: 2px;"><strong>Maquillaje:</strong> ${report.extraVisagismTips?.makeupHighlights || 'Iluminador en pómulos altos y arco de cupido.'}</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="dossier-footer">
      <div>Escuela Técnica Dr. Juan Gregorio Pujol • Formación Profesional Peluquería I • Muestra Técnica 2026</div>
      <div>Presenta esta ficha a tu peluquero o estilista para un resultado óptimo</div>
    </footer>
  </div>

</body>
</html>
`;
}
