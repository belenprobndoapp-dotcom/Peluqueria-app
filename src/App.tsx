/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, AlertCircle, MessageSquare, Database, Scissors, Palette } from 'lucide-react';
import { VisagismReport } from './types/visagism';
import { normalizeReportToSpanish } from './utils/spanishTranslation';
import { Navbar } from './components/Navbar';
import { HeroUpload } from './components/HeroUpload';
import { ReportDashboard } from './components/ReportDashboard';
import { CameraCaptureModal } from './components/CameraCaptureModal';
import { DatabaseExplorerModal } from './components/DatabaseExplorerModal';
import { AnalysisHistoryModal } from './components/AnalysisHistoryModal';
import { ReportDossierModal } from './components/ReportDossierModal';
import { VisagismChatbot } from './components/VisagismChatbot';

const HISTORY_STORAGE_KEY = 'lumiere_visagism_history';

export default function App() {
  const [currentReport, setCurrentReport] = useState<VisagismReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepText, setLoadingStepText] = useState('Analizando estructura facial...');
  const [error, setError] = useState<string | null>(null);
  const [stagedImage, setStagedImage] = useState<string | null>(null);

  // Modals
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);
  const [databaseTab, setDatabaseTab] = useState<'haircuts' | 'colors'>('haircuts');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Monitor fullscreen changes (e.g. user presses Esc key or F11)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          await (document.documentElement as any).webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
      }
    } catch {
      // In case standard requestFullscreen is blocked by iframe policy, fallback to internal layout toggle
      setIsFullscreen((prev) => !prev);
    }
  };

  // History state
  const [history, setHistory] = useState<VisagismReport[]>([]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) {
        const parsed: VisagismReport[] = JSON.parse(saved);
        setHistory(parsed.map(normalizeReportToSpanish));
      }
    } catch (e) {
      console.error('Error loading history:', e);
    }
  }, []);

  const saveToHistory = (report: VisagismReport) => {
    const updated = [report, ...history.filter((h) => h.id !== report.id)].slice(0, 15);
    setHistory(updated);
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving history:', e);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (e) {
      console.error('Error clearing history:', e);
    }
  };

  const handleAnalyzeImage = async (
    base64Image: string,
    genderPref: string,
    lengthPref: string,
    notes: string
  ) => {
    setIsLoading(true);
    setError(null);
    setStagedImage(base64Image);

    // Simulated progressive status steps for delightful UX
    const steps = [
      'Escaneando puntos antropométricos del rostro...',
      'Midiendo proporciones de frente, pómulos y mandíbula...',
      'Identificando subtono de piel (cálido, frío, neutro u oliva)...',
      'Calculando altura de tono y reflejos del cabello actual...',
      'Consultando base de datos de cortes y fórmulas iluminadoras...',
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setLoadingStepText(steps[stepIdx]);
      }
    }, 1400);

    try {
      const response = await fetch('/api/analyze-face', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          genderPreference: genderPref,
          lengthPreference: lengthPref,
          userNotes: notes,
        }),
      });

      clearInterval(interval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'No se pudo completar el análisis de la fotografía.');
      }

      const data = await response.json();

      const newReport: VisagismReport = normalizeReportToSpanish({
        id: `report-${Date.now()}`,
        timestamp: Date.now(),
        imageUrl: base64Image,
        faceShape: data.faceAnalysis.faceShape,
        proportionsDescription: data.faceAnalysis.proportionsDescription,
        faceAnalysis: data.faceAnalysis,
        skinAnalysis: data.skinAnalysis,
        currentHairAnalysis: data.currentHairAnalysis,
        haircutRecommendations: data.haircutRecommendations,
        haircutsToAvoid: data.haircutsToAvoid,
        hairColorRecommendations: data.hairColorRecommendations,
        hairColorsToAvoid: data.hairColorsToAvoid,
        extraVisagismTips: data.extraVisagismTips,
      });

      setCurrentReport(newReport);
      saveToHistory(newReport);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      clearInterval(interval);
      console.error('Analysis error:', err);
      setError(err.message || 'Ocurrió un error inesperado al procesar la imagen.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDatabaseWithTab = (tab: 'haircuts' | 'colors' = 'haircuts') => {
    setDatabaseTab(tab);
    setIsDatabaseOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans relative selection:bg-amber-400/20 selection:text-amber-200">
      {/* Navbar */}
      <Navbar
        onNewAnalysis={() => setCurrentReport(null)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        hasReport={!!currentReport}
        historyCount={history.length}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Global Error Banner */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 mt-6 w-full">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-wrap items-center justify-between gap-3 text-rose-300 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
            <div className="flex items-center gap-2">
              {stagedImage && (
                <button
                  onClick={() => handleAnalyzeImage(stagedImage, 'todos', 'todos', '')}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition-colors"
                >
                  Reintentar Análisis
                </button>
              )}
              <button
                onClick={() => setError(null)}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {isLoading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-neutral-800 border-t-amber-400 border-r-rose-400 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-amber-300 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-neutral-100">
                Diagnosticando Fisonomía & Colorimetría
              </h3>
              <p className="text-xs sm:text-sm text-amber-300/90 font-medium animate-pulse">
                {loadingStepText}
              </p>
              <p className="text-xs text-neutral-500">
                La IA está examinando las proporciones faciales exactas y contrastando con la base de datos de visagismo.
              </p>
            </div>
          </div>
        ) : currentReport ? (
          <ReportDashboard
            report={currentReport}
            onNewAnalysis={() => {
              setCurrentReport(null);
              setStagedImage(null);
            }}
            onOpenDatabase={handleOpenDatabaseWithTab}
            onPrintDossier={() => setIsDossierOpen(true)}
          />
        ) : (
          <HeroUpload
            onImageSelected={(img, gender, length, notes) => {
              setStagedImage(img);
              handleAnalyzeImage(img, gender, length, notes);
            }}
            onOpenCamera={() => setIsCameraOpen(true)}
            onOpenDatabase={() => handleOpenDatabaseWithTab('haircuts')}
            isLoading={isLoading}
            externalImage={stagedImage}
            onClearExternalImage={() => setStagedImage(null)}
          />
        )}
      </main>

      {/* Floating Chatbot Bubble (visible when report exists) */}
      {currentReport && (
        <div className="fixed bottom-6 right-6 z-40">
          {!isFloatingChatOpen ? (
            <button
              onClick={() => setIsFloatingChatOpen(true)}
              className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-400 to-amber-500 text-neutral-950 font-bold shadow-xl shadow-amber-500/20 hover:scale-105 transition-all transform group"
            >
              <MessageSquare className="w-5 h-5 text-neutral-950" />
              <span className="text-xs font-bold hidden sm:inline">
                Consultar con la Estilista IA
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-white" />
            </button>
          ) : (
            <VisagismChatbot
              report={currentReport}
              isOpen={isFloatingChatOpen}
              onClose={() => setIsFloatingChatOpen(false)}
              isFloating={true}
            />
          )}
        </div>
      )}

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(img, autoAnalyze = true) => {
          setStagedImage(img);
          if (autoAnalyze) {
            handleAnalyzeImage(img, 'todos', 'todos', '');
          }
        }}
      />

      {/* Database Explorer Modal */}
      <DatabaseExplorerModal
        isOpen={isDatabaseOpen}
        onClose={() => setIsDatabaseOpen(false)}
        initialTab={databaseTab}
        userFaceShape={currentReport?.faceShape}
        userSkinUndertone={currentReport?.skinAnalysis.undertone}
      />

      {/* History Modal */}
      <AnalysisHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectReport={(rep) => setCurrentReport(rep)}
        onClearHistory={handleClearHistory}
      />

      {/* Dossier Print Modal */}
      <ReportDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        report={currentReport}
      />

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-8 px-4 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif-luxury font-bold text-neutral-300">
              Escuela Técnica Dr. Juan Gregorio Pujol
            </span>
            <span>• PELUQUERIA I • Muestra Técnica 2026</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <button
              onClick={() => handleOpenDatabaseWithTab('haircuts')}
              className="hover:text-amber-300 transition-colors"
            >
              Catálogo de Cortes
            </button>
            <button
              onClick={() => handleOpenDatabaseWithTab('colors')}
              className="hover:text-rose-300 transition-colors"
            >
              Paletas de Tintes
            </button>
            <span>Precisión Visagista & Colorimétrica</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
