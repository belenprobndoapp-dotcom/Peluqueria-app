import React from 'react';
import { History, Camera, Maximize2, Minimize2 } from 'lucide-react';
import { EscuelaTecnicaLogo } from './EscuelaTecnicaLogo';

interface NavbarProps {
  onNewAnalysis: () => void;
  onOpenHistory: () => void;
  hasReport: boolean;
  historyCount: number;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewAnalysis,
  onOpenHistory,
  hasReport,
  historyCount,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-neutral-950/80 border-b border-neutral-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onNewAnalysis}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-rose-400 to-amber-600 p-[1.5px] shadow-lg shadow-amber-500/15 transition-transform group-hover:scale-105 shrink-0">
            <div className="w-full h-full rounded-2xl bg-neutral-950 flex items-center justify-center p-0.5 overflow-hidden">
              <EscuelaTecnicaLogo className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-luxury text-base sm:text-xl font-bold tracking-tight text-neutral-100 group-hover:text-amber-200 transition-colors">
                Escuela Técnica Dr. Juan Gregorio Pujol
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Studio IA
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-semibold tracking-wide">
              PELUQUERIA II • MUESTRA TÉCNICA 2026
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Botón chiquito de expandir / contraer */}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl text-neutral-400 hover:text-amber-300 bg-neutral-900/80 hover:bg-neutral-800/90 border border-neutral-800 transition-all flex items-center gap-1.5 text-xs font-medium"
              title={isFullscreen ? 'Contraer pantalla' : 'Expandir pantalla completa'}
              aria-label={isFullscreen ? 'Contraer pantalla' : 'Expandir pantalla completa'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="hidden md:inline text-[11px]">Contraer</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                  <span className="hidden md:inline text-[11px]">Expandir</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-neutral-300 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 transition-all hover:text-white"
            title="Ver análisis anteriores"
          >
            <History className="w-4 h-4 text-neutral-400" />
            <span className="hidden sm:inline">Historial</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {hasReport && (
            <button
              onClick={onNewAnalysis}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-neutral-950 bg-gradient-to-r from-amber-300 via-rose-300 to-amber-200 hover:from-amber-200 hover:to-rose-200 shadow-md shadow-amber-500/10 transition-all transform hover:scale-[1.02]"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo Análisis</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
