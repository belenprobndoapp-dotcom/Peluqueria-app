import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Loader2,
  Smartphone,
  Globe,
} from 'lucide-react';
import { VisagismReport } from '../types/visagism';
import {
  generatePdfReport,
  downloadDossierHtml,
  downloadDossierText,
} from '../utils/generatePdfReport';
import { generateDossierHtml } from '../utils/generateDossierHtml';

interface DownloadDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: VisagismReport | null;
}

export const DownloadDossierModal: React.FC<DownloadDossierModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  if (!isOpen || !report) return null;

  const handleDownloadPdf = async () => {
    setIsPdfLoading(true);
    setDownloadNotice('Generando archivo PDF...');
    try {
      const res = await generatePdfReport(report, (status) => setDownloadNotice(status));
      setDownloadNotice(
        res.format === 'pdf'
          ? '✓ ¡Archivo PDF descargado con éxito!'
          : '✓ ¡Ficha Técnica descargada en formato HTML lista para abrir e imprimir!'
      );
    } catch {
      setDownloadNotice('Se descargó la ficha en formato compatible.');
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleDownloadHtml = () => {
    downloadDossierHtml(report);
    setDownloadNotice('✓ ¡Ficha Técnica descargada en formato HTML!');
  };

  const handleDownloadText = () => {
    downloadDossierText(report);
    setDownloadNotice('✓ ¡Resumen técnico en TXT descargado!');
  };

  const handlePrint = () => {
    try {
      const htmlContent = generateDossierHtml(report);
      const printIframe = document.createElement('iframe');
      printIframe.style.position = 'fixed';
      printIframe.style.right = '0';
      printIframe.style.bottom = '0';
      printIframe.style.width = '0';
      printIframe.style.height = '0';
      printIframe.style.border = '0';
      document.body.appendChild(printIframe);

      const frameDoc = printIframe.contentWindow?.document || printIframe.contentDocument;
      if (frameDoc) {
        frameDoc.open();
        frameDoc.write(htmlContent);
        frameDoc.close();
        setTimeout(() => {
          printIframe.contentWindow?.focus();
          printIframe.contentWindow?.print();
          setTimeout(() => {
            if (document.body.contains(printIframe)) {
              document.body.removeChild(printIframe);
            }
          }, 2000);
        }, 500);
      } else {
        window.print();
      }
    } catch {
      window.print();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          title="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ficha Técnica Oficial Lumière</span>
          </div>

          <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-neutral-100">
            Descargar tu Ficha de Visagismo
          </h3>

          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Elige el formato preferido para guardar tu diagnóstico facial, colorimetría y las imágenes de cortes y tintes:
          </p>
        </div>

        {/* Status notice if any */}
        {downloadNotice && (
          <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{downloadNotice}</span>
          </div>
        )}

        {/* Download Options List */}
        <div className="space-y-3">
          {/* Option 1: PDF */}
          <button
            onClick={handleDownloadPdf}
            disabled={isPdfLoading}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-400 to-amber-500 hover:from-amber-300 hover:to-rose-300 text-neutral-950 font-bold text-left flex items-center justify-between shadow-lg shadow-amber-500/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center shrink-0">
                {isPdfLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-neutral-950" />
                ) : (
                  <Download className="w-5 h-5 text-neutral-950" />
                )}
              </div>
              <div>
                <p className="text-sm font-extrabold">Descargar en PDF (.pdf)</p>
                <span className="text-[11px] font-medium text-neutral-900/80">
                  Formato A4 con fotos y diseño de salón
                </span>
              </div>
            </div>
            <span className="text-xs bg-black/15 px-2.5 py-1 rounded-lg shrink-0">
              {isPdfLoading ? 'Generando...' : 'Descargar'}
            </span>
          </button>

          {/* Option 2: HTML Ficha Técnica */}
          <button
            onClick={handleDownloadHtml}
            className="w-full p-4 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-800 group-hover:bg-amber-400/20 flex items-center justify-center shrink-0 text-amber-400 transition-colors">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-100 group-hover:text-amber-200 transition-colors">
                  Ficha Interactiva (.html)
                </p>
                <span className="text-[11px] text-neutral-400">
                  Se abre en cualquier celular o PC con botón de imprimir directo
                </span>
              </div>
            </div>
            <span className="text-xs text-neutral-300 font-semibold bg-neutral-800 px-2.5 py-1 rounded-lg shrink-0">
              Descargar
            </span>
          </button>

          {/* Option 3: TXT Summary */}
          <button
            onClick={handleDownloadText}
            className="w-full p-4 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-800 group-hover:bg-rose-400/20 flex items-center justify-center shrink-0 text-rose-400 transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-100 group-hover:text-rose-200 transition-colors">
                  Resumen Técnico (.txt)
                </p>
                <span className="text-[11px] text-neutral-400">
                  Texto limpio para copiar a WhatsApp o notas de salón
                </span>
              </div>
            </div>
            <span className="text-xs text-neutral-300 font-semibold bg-neutral-800 px-2.5 py-1 rounded-lg shrink-0">
              Descargar
            </span>
          </button>
        </div>

        {/* Quick Print Alternative */}
        <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span>¿Quieres imprimir directamente en papel?</span>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-semibold underline"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir ahora</span>
          </button>
        </div>
      </div>
    </div>
  );
};
