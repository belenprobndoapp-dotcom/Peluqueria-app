import React from 'react';
import { X, Trash2, History, ChevronRight, Sparkles } from 'lucide-react';
import { VisagismReport } from '../types/visagism';

interface AnalysisHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: VisagismReport[];
  onSelectReport: (report: VisagismReport) => void;
  onClearHistory: () => void;
}

export const AnalysisHistoryModal: React.FC<AnalysisHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectReport,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif-luxury text-lg font-bold text-neutral-100">
              Historial de Diagnósticos ({history.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-neutral-800 transition-colors"
                title="Borrar historial"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="py-16 text-center text-neutral-400 space-y-2">
              <Sparkles className="w-10 h-10 mx-auto text-neutral-600" />
              <p className="text-sm font-medium">Aún no tienes análisis guardados.</p>
              <p className="text-xs text-neutral-500">
                Sube o toma una foto para iniciar tu primer diagnóstico.
              </p>
            </div>
          ) : (
            history.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => {
                  onSelectReport(item);
                  onClose();
                }}
                className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-amber-400/50 cursor-pointer flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt="Miniatura"
                    className="w-12 h-12 rounded-xl object-cover border border-neutral-800 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-neutral-200 group-hover:text-amber-300 transition-colors truncate">
                      Rostro {item.faceShape}
                    </p>
                    <p className="text-xs text-neutral-400 truncate">
                      Piel {item.skinAnalysis.tone} • Cabello Nivel {item.currentHairAnalysis.baseLevel}
                    </p>
                    {item.timestamp && (
                      <span className="text-[10px] text-neutral-500 block">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 transition-colors shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
