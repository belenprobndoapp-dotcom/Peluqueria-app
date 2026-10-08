import React from 'react';
import { Palette, Sun, Sparkles, AlertTriangle, Check, Droplet, Eye } from 'lucide-react';
import { SkinAnalysis, CurrentHairAnalysis } from '../types/visagism';

interface ColorimetryMatrixCardProps {
  skinAnalysis: SkinAnalysis;
  hairAnalysis: CurrentHairAnalysis;
}

export const ColorimetryMatrixCard: React.FC<ColorimetryMatrixCardProps> = ({
  skinAnalysis,
  hairAnalysis,
}) => {
  const nuances = skinAnalysis.chromaticNuances;
  const hairSubtone = hairAnalysis.subtoneNuance;

  return (
    <div className="space-y-6">
      {/* 2-Column Grid: Skin Matrix vs Hair Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Skin Tone & Undertone Precision (7 cols) */}
        <div className="lg:col-span-7 bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-400/10 border border-rose-400/20 flex items-center justify-center text-rose-400">
                <Sun className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-rose-400">
                  Colorimetría Facial
                </span>
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-neutral-100">
                  {skinAnalysis.tone}
                </h3>
              </div>
            </div>

            {/* Undertone Badge */}
            <div className="px-3.5 py-1.5 rounded-full bg-neutral-950 border border-neutral-800 flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                style={{ backgroundColor: skinAnalysis.skinSampleHex }}
              />
              <span className="text-xs font-bold text-amber-300">
                Subtono {skinAnalysis.undertone}
              </span>
            </div>
          </div>

          {/* Undertone Explanation */}
          <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400/90 block">
              Comportamiento Pigmentario & Reacción a la Luz
            </span>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {skinAnalysis.undertoneExplanation}
            </p>
          </div>

          {/* Multi-Point Chromatic Sampling Swatches */}
          {nuances && (
            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-3">
              <span className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-rose-400" />
                <span>Muestreo Cromático Facial (3 Puntos)</span>
              </span>

              <div className="grid grid-cols-3 gap-3">
                {/* Highlight */}
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col items-center text-center space-y-1.5">
                  <div
                    className="w-10 h-10 rounded-full border-2 border-white/30 shadow-md"
                    style={{ backgroundColor: nuances.highlightSkinHex }}
                  />
                  <span className="text-[10px] text-neutral-400">Luz Central</span>
                  <span className="text-[11px] font-mono text-neutral-200 font-bold">
                    {nuances.highlightSkinHex}
                  </span>
                </div>

                {/* Midtone */}
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col items-center text-center space-y-1.5">
                  <div
                    className="w-10 h-10 rounded-full border-2 border-white/30 shadow-md"
                    style={{ backgroundColor: nuances.midToneSkinHex }}
                  />
                  <span className="text-[10px] text-neutral-400">Tono Medio</span>
                  <span className="text-[11px] font-mono text-neutral-200 font-bold">
                    {nuances.midToneSkinHex}
                  </span>
                </div>

                {/* Shadow/Contour */}
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col items-center text-center space-y-1.5">
                  <div
                    className="w-10 h-10 rounded-full border-2 border-white/30 shadow-md"
                    style={{ backgroundColor: nuances.shadowSkinHex }}
                  />
                  <span className="text-[10px] text-neutral-400">Contorno</span>
                  <span className="text-[11px] font-mono text-neutral-200 font-bold">
                    {nuances.shadowSkinHex}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-400">
                <span>Matiz secundario:</span>
                <span className="font-medium text-neutral-200">{nuances.secondaryNuance}</span>
              </div>
            </div>
          )}

          {/* Natural Luminosity Formula */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-500/20 space-y-2">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Cómo Activar la Luz Natural de Tu Piel:</span>
            </span>
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
              {skinAnalysis.naturalLuminosityFactors}
            </p>
          </div>
        </div>

        {/* Right: Current Hair Base & Subtone Reflector (5 cols) */}
        <div className="lg:col-span-5 bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
          <div className="pb-4 border-b border-neutral-800">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
              Diagnóstico Capilar Base
            </span>
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-neutral-100 mt-1">
              {hairAnalysis.detectedColor}
            </h3>
          </div>

          {/* Hair Color Swatch & Level */}
          <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl border-2 border-white/20 shadow-lg shrink-0 flex items-center justify-center font-bold text-white text-xs drop-shadow"
              style={{ backgroundColor: hairAnalysis.detectedHairHex }}
            >
              {hairAnalysis.baseLevel}
            </div>
            <div>
              <span className="text-[11px] text-neutral-400 uppercase font-semibold">
                Altura de Tono Internacional
              </span>
              <p className="text-sm font-bold text-neutral-100">
                Nivel {hairAnalysis.baseLevel} de 10
              </p>
              <span className="text-xs font-mono text-neutral-400">
                {hairAnalysis.detectedHairHex}
              </span>
            </div>
          </div>

          {/* Scale 1-10 visual slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-neutral-400">
              <span>1 (Negro)</span>
              <span className="text-amber-300 font-bold">Nivel Actual: {hairAnalysis.baseLevel}</span>
              <span>10 (Platino)</span>
            </div>
            <div className="h-3 rounded-full bg-gradient-to-r from-neutral-950 via-amber-800 via-amber-400 to-amber-100 p-0.5 border border-neutral-700">
              <div
                className="w-3 h-full bg-white rounded-full shadow-md transition-all"
                style={{ marginLeft: `${Math.min(Math.max((hairAnalysis.baseLevel - 1) * 11, 0), 96)}%` }}
              />
            </div>
          </div>

          {/* Hair Subtone Nuance Details */}
          <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-3">
            <span className="text-xs font-bold text-neutral-200 block">
              Reflejo & Subtono Detectado:
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-800/80">
                <span className="text-neutral-400">Reflejo Principal:</span>
                <span className="font-bold text-amber-300">
                  {hairSubtone?.primaryReflect || hairAnalysis.underlyingWarmth}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-neutral-800/80">
                <span className="text-neutral-400">Temperatura Capilar:</span>
                <span className="font-medium text-neutral-200">
                  {hairSubtone?.temperature || 'Neutro'}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-neutral-800/80">
                <span className="text-neutral-400">Textura Estimada:</span>
                <span className="font-medium text-neutral-200">{hairAnalysis.textureEstimate}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Acabado de Brillo:</span>
                <span className="font-medium text-neutral-200">
                  {hairSubtone?.surfaceShine || 'Satinado'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seasonal Colorimetry Palette Bar */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
              Estación de Armonía Cromática
            </span>
            <h4 className="font-serif-luxury text-xl font-bold text-neutral-100">
              {skinAnalysis.seasonalPalette.season}
            </h4>
          </div>
          <p className="text-xs text-neutral-400 max-w-md">
            {skinAnalysis.seasonalPalette.description}
          </p>
        </div>

        {/* Clothing harmony swatches */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
            Colores que potencian tu luz natural:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {skinAnalysis.seasonalPalette.recommendedClothingColors.map((color, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-2.5"
              >
                <div
                  className="w-7 h-7 rounded-lg border border-white/20 shadow-sm shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-neutral-200 truncate">{color.name}</p>
                  <span className="text-[10px] font-mono text-neutral-500">{color.hex}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colors to avoid */}
        {skinAnalysis.seasonalPalette.colorsToAvoid?.length > 0 && (
          <div className="pt-2 border-t border-neutral-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400/90 block mb-2">
              Colores a evitar cerca del rostro (apagan la piel):
            </span>
            <div className="flex flex-wrap gap-2">
              {skinAnalysis.seasonalPalette.colorsToAvoid.map((avoid, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-neutral-950/80 border border-rose-500/20 text-xs text-neutral-300 flex items-center gap-2"
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-white/20"
                    style={{ backgroundColor: avoid.hex }}
                  />
                  <span>
                    <strong>{avoid.name}:</strong> {avoid.reason}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
