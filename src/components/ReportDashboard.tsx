import React, { useState } from 'react';
import {
  Sparkles,
  Scissors,
  Palette,
  Sun,
  Eye,
  MessageSquare,
  Printer,
  RotateCcw,
  Database,
  Glasses,
  Check,
  ChevronRight,
  Download,
  Loader2,
  FileText,
} from 'lucide-react';
import { VisagismReport, HairColorRecommendation } from '../types/visagism';
import { normalizeReportToSpanish } from '../utils/spanishTranslation';
import { FaceMorphologyCard } from './FaceMorphologyCard';
import { ColorimetryMatrixCard } from './ColorimetryMatrixCard';
import { HaircutRecommendationsCard } from './HaircutRecommendationsCard';
import { HairColorRecommendationsCard } from './HairColorRecommendationsCard';
import { VirtualColorTryOn } from './VirtualColorTryOn';
import { ExtraVisagismCard } from './ExtraVisagismCard';
import { VisagismChatbot } from './VisagismChatbot';
import { DownloadDossierModal } from './DownloadDossierModal';
import { generatePdfReport } from '../utils/generatePdfReport';

interface ReportDashboardProps {
  report: VisagismReport;
  onNewAnalysis: () => void;
  onOpenDatabase: (tab?: 'haircuts' | 'colors') => void;
  onPrintDossier: () => void;
}

export const ReportDashboard: React.FC<ReportDashboardProps> = ({
  report: rawReport,
  onNewAnalysis,
  onOpenDatabase,
  onPrintDossier,
}) => {
  const report = normalizeReportToSpanish(rawReport);
  const [activeTab, setActiveTab] = useState<
    'morphology' | 'haircuts' | 'colorimetry' | 'tryon' | 'chat' | 'extra'
  >('morphology');

  const [selectedTryOnColor, setSelectedTryOnColor] = useState<HairColorRecommendation | null>(
    report.hairColorRecommendations[0] || null
  );

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfStatusText, setPdfStatusText] = useState('');
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    setPdfStatusText('Iniciando...');
    try {
      await generatePdfReport(report, (status) => setPdfStatusText(status));
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
      setPdfStatusText('');
      setIsDownloadModalOpen(true);
    }
  };

  const handleTestColor = (color: HairColorRecommendation) => {
    setSelectedTryOnColor(color);
    setActiveTab('tryon');
  };

  const handleAskChatbotAboutItem = (itemName: string) => {
    setActiveTab('chat');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner with Key Diagnosis Summary */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-semibold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Diagnóstico de Visagismo & Colorimetría Completado</span>
            </div>

            <h2 className="font-serif-luxury text-2xl sm:text-4xl font-extrabold text-neutral-100">
              Tu Ficha Personalizada de Armonía Facial
            </h2>

            {/* Quick Badges Row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
              <span className="px-3 py-1 rounded-xl bg-amber-400/15 text-amber-300 font-bold border border-amber-400/30">
                Rostro {report.faceShape}
              </span>
              <span className="px-3 py-1 rounded-xl bg-rose-400/15 text-rose-300 font-bold border border-rose-400/30">
                Piel {report.skinAnalysis.tone} ({report.skinAnalysis.undertone})
              </span>
              <span className="px-3 py-1 rounded-xl bg-neutral-800 text-neutral-200 font-semibold border border-neutral-700">
                Base Capilar Nivel {report.currentHairAnalysis.baseLevel}
              </span>
              <span className="px-3 py-1 rounded-xl bg-cyan-400/15 text-cyan-300 font-semibold border border-cyan-400/30">
                {report.skinAnalysis.seasonalPalette.season}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-rose-400 to-amber-500 hover:from-amber-300 hover:to-rose-300 text-neutral-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{pdfStatusText || 'Generando...'}</span>
                </>
              ) : (
                <>
                  <span>📥</span>
                  <span>Descargar PDF</span>
                </>
              )}
            </button>

            <button
              onClick={onPrintDossier}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs sm:text-sm font-semibold text-neutral-200 border border-neutral-700 transition-colors"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Imprimir Ficha</span>
            </button>

            <button
              onClick={() => onOpenDatabase()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs sm:text-sm font-semibold text-neutral-200 border border-neutral-700 transition-colors"
            >
              <Database className="w-4 h-4 text-rose-400" />
              <span>Base de Datos</span>
            </button>

            <button
              onClick={onNewAnalysis}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs sm:text-sm font-semibold text-neutral-200 border border-neutral-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>Otra Foto</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation Bar */}
      <div className="flex items-center p-1.5 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-x-auto scrollbar-none gap-1.5">
        {[
          { id: 'morphology', label: '1. Rostro & Proporciones', icon: Eye },
          { id: 'haircuts', label: '2. Cortes que Favorecen', icon: Scissors },
          { id: 'colorimetry', label: '3. Colorimetría & Luz', icon: Palette },
          { id: 'tryon', label: '4. Probador de Luz', icon: Sun },
          { id: 'chat', label: '5. Chatbot con Estilista', icon: MessageSquare },
          { id: 'extra', label: '6. Gafas & Complementos', icon: Glasses },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow-md'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'morphology' && (
          <div className="space-y-6 animate-fade-in">
            <FaceMorphologyCard
              faceAnalysis={report.faceAnalysis}
              imageUrl={report.imageUrl}
            />

            {/* Quick CTA to Cuts */}
            <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-neutral-100">
                  ¿Quieres ver los cortes que compensan tu geometría facial?
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Descubre los peinados que estilizan y afinan tu rostro {report.faceShape}.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('haircuts')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs hover:bg-amber-300 transition-colors"
              >
                <span>Ver Cortes</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'haircuts' && (
          <div className="space-y-6 animate-fade-in">
            <HaircutRecommendationsCard
              cuts={report.haircutRecommendations}
              avoidCuts={report.haircutsToAvoid}
              faceShape={report.faceShape}
              onOpenDatabase={() => onOpenDatabase('haircuts')}
              onAskChatbotAboutCut={handleAskChatbotAboutItem}
            />
          </div>
        )}

        {activeTab === 'colorimetry' && (
          <div className="space-y-8 animate-fade-in">
            <ColorimetryMatrixCard
              skinAnalysis={report.skinAnalysis}
              hairAnalysis={report.currentHairAnalysis}
            />

            <HairColorRecommendationsCard
              colors={report.hairColorRecommendations}
              avoidColors={report.hairColorsToAvoid}
              skinTone={report.skinAnalysis.tone}
              onOpenDatabase={() => onOpenDatabase('colors')}
              onTestColorInTryOn={handleTestColor}
              onAskChatbotAboutColor={handleAskChatbotAboutItem}
            />
          </div>
        )}

        {activeTab === 'tryon' && (
          <div className="space-y-6 animate-fade-in">
            <VirtualColorTryOn
              imageUrl={report.imageUrl}
              recommendedColors={report.hairColorRecommendations}
              currentHairHex={report.currentHairAnalysis.detectedHairHex}
              currentHairColor={report.currentHairAnalysis.detectedColor}
              selectedColor={selectedTryOnColor}
            />
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 backdrop-blur-xl">
              <h3 className="font-serif-luxury text-xl font-bold text-neutral-100 mb-1">
                Consultoría Personalizada de Cambio de Look
              </h3>
              <p className="text-xs text-neutral-400">
                Conversa directamente con tu estilista IA. Conoce al detalle tu fisonomía, tus dudas sobre el corte o color, y se adapta a tus gustos y rutina.
              </p>
            </div>

            <div className="h-[620px] rounded-3xl overflow-hidden border border-neutral-800">
              <VisagismChatbot report={report} isOpen={true} isFloating={false} />
            </div>
          </div>
        )}

        {activeTab === 'extra' && (
          <div className="space-y-6 animate-fade-in">
            <ExtraVisagismCard
              tips={report.extraVisagismTips}
              faceShape={report.faceShape}
            />
          </div>
        )}
      </div>

      {/* Prominent End-of-Report PDF Download Banner */}
      <div className="mt-10 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 blur-3xl pointer-events-none" />

        <div className="space-y-2 text-center md:text-left relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Escuela Técnica Dr. Juan Gregorio Pujol • Ficha Técnica Oficial en Español</span>
          </div>

          <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-neutral-100">
            Ficha Técnica de Cortes y Tintes para Imprimir o Guardar
          </h3>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed">
            Descarga o imprime tu diagnóstico completo 100% en español con tu fotografía, fisonomía facial, colorimetría y las imágenes de alta resolución de todas las recomendaciones de cortes y fórmulas de tinte.
          </p>
        </div>

        <div className="relative z-10 w-full md:w-auto flex flex-col items-center sm:items-end gap-2">
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-400 to-amber-500 hover:from-amber-300 hover:to-rose-300 text-neutral-950 font-extrabold text-sm sm:text-base shadow-xl shadow-amber-500/25 disabled:opacity-50 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{pdfStatusText || 'Generando Ficha Técnica...'}</span>
              </>
            ) : (
              <>
                <span className="text-xl">📥</span>
                <span>Descargar Ficha Técnica en PDF</span>
              </>
            )}
          </button>

          <span className="text-[11px] text-neutral-400">
            Formato A4 optimizado con fotos de alta resolución
          </span>
        </div>
      </div>

      {/* Floating Quick Action Button on Bottom-Left */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-neutral-900/90 hover:bg-neutral-850 text-amber-300 hover:text-amber-200 font-bold border border-amber-400/40 shadow-2xl backdrop-blur-md transition-all transform hover:scale-105 active:scale-95 group"
          title="Descargar Ficha Técnica en PDF"
        >
          {isGeneratingPdf ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span className="text-xs">{pdfStatusText || 'Generando...'}</span>
            </>
          ) : (
            <>
              <span className="text-base group-hover:scale-110 transition-transform">📥</span>
              <span className="text-xs hidden sm:inline">Descargar Ficha en PDF</span>
              <span className="text-xs sm:hidden">PDF</span>
            </>
          )}
        </button>
      </div>

      {/* Download Options & Fallbacks Modal */}
      <DownloadDossierModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        report={report}
      />
    </div>
  );
};
