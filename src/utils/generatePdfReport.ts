import { VisagismReport } from '../types/visagism';
import { generateDossierHtml } from './generateDossierHtml';
import { generateDossierText } from './generateDossierText';

/**
 * Robust file downloader that works in iframes and mobile browsers
 * with automatic fallback from Blob URL to Data URI.
 */
export function triggerFileDownload(
  content: string | Blob,
  filename: string,
  mimeType = 'text/html;charset=utf-8'
): void {
  try {
    let url: string;
    let isObjectUrl = false;

    if (content instanceof Blob) {
      url = window.URL.createObjectURL(content);
      isObjectUrl = true;
    } else {
      const blob = new Blob([content], { type: mimeType });
      url = window.URL.createObjectURL(blob);
      isObjectUrl = true;
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      if (isObjectUrl) {
        window.URL.revokeObjectURL(url);
      }
    }, 600);
  } catch (err) {
    console.warn('Blob URL download failed, falling back to data URI:', err);
    if (typeof content === 'string') {
      const encoded = encodeURIComponent(content);
      const link = document.createElement('a');
      link.href = `data:${mimeType},${encoded}`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => document.body.removeChild(link), 500);
    }
  }
}

/**
 * Downloads the Ficha Técnica as a self-contained HTML file.
 * Opens offline on any device and features a 1-click "Guardar como PDF / Imprimir" button.
 */
export function downloadDossierHtml(report: VisagismReport): void {
  const html = generateDossierHtml(report);
  const cleanShape = (report.faceShape || 'Visagismo').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Ficha_Tecnica_Escuela_Pujol_${cleanShape}.html`;
  triggerFileDownload(html, filename, 'text/html;charset=utf-8');
}

/**
 * Downloads the Ficha Técnica as a clean formatted UTF-8 TXT file.
 */
export function downloadDossierText(report: VisagismReport): void {
  const text = generateDossierText(report);
  const cleanShape = (report.faceShape || 'Visagismo').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Ficha_Tecnica_Escuela_Pujol_${cleanShape}.txt`;
  triggerFileDownload(text, filename, 'text/plain;charset=utf-8');
}

/**
 * Generates and downloads the PDF using html2pdf.js,
 * with automatic fallback to standalone HTML Ficha Técnica if html2pdf fails or is blocked in the iframe.
 */
export async function generatePdfReport(
  report: VisagismReport,
  onProgress?: (status: string) => void
): Promise<{ success: boolean; format: 'pdf' | 'html' }> {
  const cleanShape = (report.faceShape || 'Visagismo').replace(/[^a-zA-Z0-9]/g, '_');
  const pdfFilename = `Ficha_Tecnica_Escuela_Pujol_${cleanShape}.pdf`;

  onProgress?.('Preparando documento de visagismo...');

  try {
    // Dynamic import to prevent SSR/Node issues
    // @ts-ignore
    const html2pdfModule = await import('html2pdf.js');
    const html2pdf = html2pdfModule.default || html2pdfModule;

    // Create a temporary element with the dossier HTML content
    const fullHtml = generateDossierHtml(report);
    const parser = new DOMParser();
    const doc = parser.parseFromString(fullHtml, 'text/html');

    // Remove the sticky top action bar for the PDF export
    const topBar = doc.querySelector('.top-action-bar');
    if (topBar) topBar.remove();

    const wrapper = doc.querySelector('.dossier-wrapper');
    if (!wrapper) {
      throw new Error('No se pudo encontrar el contenedor de la ficha');
    }

    // Append to body temporarily with high z-index off-screen
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'fixed';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = '800px';
    tempDiv.style.background = '#ffffff';
    tempDiv.innerHTML = wrapper.outerHTML;
    document.body.appendChild(tempDiv);

    onProgress?.('Generando PDF con html2pdf.js...');

    const opt = {
      margin: 8,
      filename: pdfFilename,
      image: { type: 'jpeg' as const, quality: 0.95 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait' as const,
      },
    };

    try {
      await html2pdf().set(opt).from(tempDiv).save();
      onProgress?.('¡PDF descargado con éxito!');
      return { success: true, format: 'pdf' };
    } finally {
      if (document.body.contains(tempDiv)) {
        document.body.removeChild(tempDiv);
      }
    }
  } catch (pdfErr) {
    console.warn('html2pdf.js generation encountered an issue, falling back to direct HTML dossier download:', pdfErr);
    onProgress?.('Generando Ficha Técnica interactiva descargable...');

    // Fallback: download standalone HTML Ficha Técnica immediately
    downloadDossierHtml(report);
    onProgress?.('¡Ficha Técnica descargada!');
    return { success: true, format: 'html' };
  }
}
