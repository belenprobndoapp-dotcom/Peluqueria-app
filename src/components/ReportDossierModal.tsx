import React, { useState } from 'react';
import { X, Printer, Sparkles, Scissors, Palette, Check, Download, Loader2 } from 'lucide-react';
import { VisagismReport } from '../types/visagism';
import { getHaircutImage, getHairColorImage } from '../utils/visagismVisuals';
import { generatePdfReport } from '../utils/generatePdfReport';
import { generateDossierHtml } from '../utils/generateDossierHtml';
import { normalizeReportToSpanish } from '../utils/spanishTranslation';

interface ReportDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: VisagismReport | null;
}

export const ReportDossierModal: React.FC<ReportDossierModalProps> = ({
  isOpen,
  onClose,
  report: rawReport,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfStatus, setPdfStatus] = useState('');

  if (!isOpen || !rawReport) return null;

  const report = normalizeReportToSpanish(rawReport);

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

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf || !report) return;
    setIsGeneratingPdf(true);
    setPdfStatus('Preparando...');
    try {
      await generatePdfReport(report, (status) => setPdfStatus(status));
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
      setPdfStatus('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl my-8 space-y-6 text-neutral-100 print:bg-white print:text-black print:border-none print:shadow-none print:m-0 print:p-4">
        {/* Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 print:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif-luxury text-lg font-bold">
              Ficha Técnica de Visagismo & Color para el Salón
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-rose-400 to-amber-500 hover:from-amber-300 hover:to-rose-300 text-neutral-950 font-bold text-xs shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{pdfStatus || 'Generando...'}</span>
                </>
              ) : (
                <>
                  <span>📥</span>
                  <span>Descargar Ficha en PDF</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs border border-neutral-700 transition-colors"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Card Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <h1 className="font-serif-luxury text-xl sm:text-2xl font-bold">
              Escuela Técnica Dr. Juan Gregorio Pujol • Peluquería I
            </h1>
            <p className="text-xs text-neutral-400">
              Muestra Técnica 2026 — Ficha Técnica de Asesoría Facial (Cortes y Tintes en Español)
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-neutral-700 shrink-0">
            <img
              src={report.imageUrl}
              alt="Foto diagnóstico"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Primary Diagnosis Row */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 print:border-neutral-300 print:bg-neutral-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
              Tipo de Rostro
            </span>
            <p className="text-base font-bold text-amber-300 font-serif-luxury">
              {report.faceShape}
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
              Piel & Subtono
            </span>
            <p className="text-sm font-bold text-rose-300">
              {report.skinAnalysis.tone}
            </p>
            <span className="text-[10px] text-neutral-400">
              Subtono {report.skinAnalysis.undertone}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
              Cabello Actual
            </span>
            <p className="text-sm font-bold text-neutral-200">
              Nivel {report.currentHairAnalysis.baseLevel}
            </p>
            <span className="text-[10px] text-neutral-400 truncate block">
              {report.currentHairAnalysis.detectedColor}
            </span>
          </div>
        </div>

        {/* Recommended Haircuts */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Scissors className="w-4 h-4" />
            <span>Cortes de Cabello Recomendados (Compensación Geométrica)</span>
          </h4>

          <div className="space-y-2.5">
            {report.haircutRecommendations.map((cut, idx) => {
              const cutImg = cut.imageUrl || getHaircutImage(cut.name, cut.category, idx);

              return (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-start gap-3.5 text-xs"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-neutral-700 bg-black">
                    <img
                      src={cutImg}
                      alt={cut.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex justify-between items-center">
                      <strong className="text-sm font-bold text-neutral-100">{cut.name}</strong>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">
                        {cut.category} • {cut.suitabilityScore}% afinidad
                      </span>
                    </div>
                    <p className="text-neutral-300">{cut.whyItWorks}</p>
                    <p className="text-neutral-400 text-[11px]">
                      <strong>Peinado:</strong> {cut.stylingTips}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommended Hair Colors */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <Palette className="w-4 h-4" />
            <span>Fórmulas de Tinte & Reflejos para Iluminar el Rostro</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {report.hairColorRecommendations.map((color, idx) => {
              const colorImg = color.imageUrl || getHairColorImage(color.shadeName, color.dyeCode, color.hexColor, idx);

              return (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-start gap-3 text-xs overflow-hidden"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-neutral-700 bg-black relative">
                    <img
                      src={colorImg}
                      alt={color.shadeName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-white"
                      style={{ backgroundColor: color.hexColor }}
                    />
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <strong className="text-neutral-100 truncate">{color.shadeName}</strong>
                      <span className="text-[10px] font-mono text-amber-300 shrink-0">({color.dyeCode})</span>
                    </div>
                    <p className="text-neutral-300 text-[11px] leading-relaxed line-clamp-2">
                      {color.luminosityEffect}
                    </p>
                    <span className="text-[10px] text-neutral-400 block truncate">
                      Técnica: <strong>{color.bestTechnique}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Footer for Salon Stylist */}
        <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
          <span>Estación de Color: <strong>{report.skinAnalysis.seasonalPalette.season}</strong></span>
          <span>Escuela Técnica Dr. Juan Gregorio Pujol • Formación Profesional Peluquería I • Muestra Técnica 2026</span>
        </div>
      </div>
    </div>
  );
};
