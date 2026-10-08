import React, { useState } from 'react';
import { Eye, Ruler, Sparkles, Check, Info } from 'lucide-react';
import { FaceAnalysis } from '../types/visagism';
import { getFaceShapeIcon } from '../utils/faceShapeSVGs';

interface FaceMorphologyCardProps {
  faceAnalysis: FaceAnalysis;
  imageUrl: string;
}

export const FaceMorphologyCard: React.FC<FaceMorphologyCardProps> = ({
  faceAnalysis,
  imageUrl,
}) => {
  const [showLandmarks, setShowLandmarks] = useState(false);
  const m = faceAnalysis.measurements;

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
            {getFaceShapeIcon(faceAnalysis.faceShape, 'w-7 h-7')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
                Clasificación Morfológica
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                {Math.round(faceAnalysis.confidenceScore * 100)}% Confianza
              </span>
            </div>
            <h3 className="font-serif-luxury text-2xl font-bold text-neutral-100">
              Rostro {faceAnalysis.faceShape}
            </h3>
          </div>
        </div>

        <button
          onClick={() => setShowLandmarks(!showLandmarks)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            showLandmarks
              ? 'bg-amber-400 text-neutral-950 shadow-md'
              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>{showLandmarks ? 'Ocultar Puntos Faciales' : 'Ver Puntos y Guías'}</span>
        </button>
      </div>

      {/* Main Grid: Visual Photo with Overlay & Proportions */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Photo Container with Landmarks (5 cols) */}
        <div className="md:col-span-5 relative rounded-2xl overflow-hidden aspect-[4/5] bg-black border border-neutral-800 flex items-center justify-center">
          <img
            src={imageUrl}
            alt="Análisis facial"
            className="w-full h-full object-cover"
          />

          {/* Interactive Visagism Landmarks Grid Overlay */}
          {showLandmarks && (
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 bg-black/30 backdrop-blur-[0.5px] transition-all">
              {/* Forehead line */}
              <div className="w-full border-t-2 border-dashed border-amber-400/80 relative">
                <span className="absolute -top-4 right-0 text-[10px] bg-neutral-950/90 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/30">
                  Frente {m ? `${m.foreheadWidthPercent}%` : ''}
                </span>
              </div>

              {/* Cheekbones line */}
              <div className="w-full border-t-2 border-dashed border-rose-400/80 relative">
                <span className="absolute -top-4 right-0 text-[10px] bg-neutral-950/90 text-rose-300 px-1.5 py-0.2 rounded border border-rose-400/30">
                  Pómulos (Bizigomático) {m ? `${m.cheekboneWidthPercent}%` : ''}
                </span>
              </div>

              {/* Jawline line */}
              <div className="w-full border-t-2 border-dashed border-cyan-400/80 relative">
                <span className="absolute -top-4 right-0 text-[10px] bg-neutral-950/90 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-400/30">
                  Mandíbula {m ? `${m.jawlineWidthPercent}%` : ''}
                </span>
              </div>

              {/* Center vertical axis */}
              <div className="absolute inset-y-4 left-1/2 -translate-x-1/2 border-l border-white/40" />

              {/* Geometric Silhouette boundary */}
              <div className="absolute inset-4 border-2 border-amber-400/60 rounded-[45%] shadow-[0_0_20px_rgba(251,191,36,0.25)]" />
            </div>
          )}

          {/* Bottom badge */}
          <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-neutral-950/85 backdrop-blur-md border border-neutral-800 text-[11px] text-neutral-300 flex items-center justify-between">
            <span>Geometría:</span>
            <span className="font-bold text-amber-300">{faceAnalysis.geometricRatio || 'Equilibrado'}</span>
          </div>
        </div>

        {/* Morphologic details & Proportions (7 cols) */}
        <div className="md:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Diagnóstico Antropométrico</span>
            </span>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {faceAnalysis.proportionsDescription}
            </p>
          </div>

          {/* Measurements Bars */}
          {m && (
            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-amber-400" />
                  <span>Proporciones Transversales Relativas</span>
                </span>
                <span className="text-[11px] text-neutral-400">
                  Ratio L/A: <strong className="text-white">{m.lengthToWidthRatio}x</strong>
                </span>
              </div>

              {/* Forehead */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-neutral-400">
                  <span>Ancho de Frente</span>
                  <span className="text-neutral-200 font-medium">{m.foreheadWidthPercent}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{ width: `${Math.min(m.foreheadWidthPercent, 100)}%` }}
                  />
                </div>
              </div>

              {/* Cheekbones */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-neutral-400">
                  <span>Pómulos (Bizigomático)</span>
                  <span className="text-neutral-200 font-medium">{m.cheekboneWidthPercent}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-rose-400 rounded-full transition-all"
                    style={{ width: `${Math.min(m.cheekboneWidthPercent, 100)}%` }}
                  />
                </div>
              </div>

              {/* Jawline */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-neutral-400">
                  <span>Línea Mandibular</span>
                  <span className="text-neutral-200 font-medium">{m.jawlineWidthPercent}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full transition-all"
                    style={{ width: `${Math.min(m.jawlineWidthPercent, 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800/80 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Ángulo Mandibular:</span>
                  <span className="text-neutral-300 font-medium">{m.jawlineAngle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Mentón:</span>
                  <span className="text-neutral-300 font-medium">{m.chinShape}</span>
                </div>
              </div>
            </div>
          )}

          {/* Key Features Pill Badges */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
              Rasgos Clave Identificados:
            </span>
            <div className="flex flex-wrap gap-2">
              {faceAnalysis.keyFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-800/80 border border-neutral-700/60 text-xs font-medium text-neutral-200"
                >
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
