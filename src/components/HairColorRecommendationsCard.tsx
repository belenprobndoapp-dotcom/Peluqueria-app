import React, { useState } from 'react';
import { Palette, Sparkles, AlertTriangle, Eye, Database, Sun, ZoomIn } from 'lucide-react';
import { HairColorRecommendation, HairColorToAvoid } from '../types/visagism';
import { getHairColorImage } from '../utils/visagismVisuals';
import { ImageLightboxModal } from './ImageLightboxModal';

interface HairColorRecommendationsCardProps {
  colors: HairColorRecommendation[];
  avoidColors: HairColorToAvoid[];
  skinTone: string;
  onOpenDatabase: () => void;
  onTestColorInTryOn?: (color: HairColorRecommendation) => void;
  onAskChatbotAboutColor?: (colorName: string) => void;
}

export const HairColorRecommendationsCard: React.FC<HairColorRecommendationsCardProps> = ({
  colors,
  avoidColors,
  skinTone,
  onOpenDatabase,
  onTestColorInTryOn,
  onAskChatbotAboutColor,
}) => {
  const [lightboxData, setLightboxData] = useState<{
    imageUrl: string;
    title: string;
    subtitle: string;
    description: string;
    extraInfo: string;
    colorItem?: HairColorRecommendation;
  } | null>(null);

  return (
    <div className="space-y-6">
      {/* Lightbox Modal */}
      <ImageLightboxModal
        isOpen={!!lightboxData}
        onClose={() => setLightboxData(null)}
        imageUrl={lightboxData?.imageUrl || null}
        title={lightboxData?.title || ''}
        subtitle={lightboxData?.subtitle}
        badge="Tono Iluminador Recomendado"
        type="haircolor"
        description={lightboxData?.description}
        extraInfo={lightboxData?.extraInfo}
        onAction={
          lightboxData?.colorItem && onTestColorInTryOn
            ? () => onTestColorInTryOn(lightboxData.colorItem!)
            : undefined
        }
        actionLabel="Simular Este Tono en Probador Virtual"
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-400/10 border border-rose-400/20 flex items-center justify-center text-rose-400">
            <Sun className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-rose-400">
              Colorimetría & Fotocromía Capilar
            </span>
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-neutral-100">
              Tonos y Reflejos que Potencian la Luz de tu Piel
            </h3>
          </div>
        </div>

        <button
          onClick={onOpenDatabase}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-300 bg-neutral-800 hover:bg-neutral-700 transition-colors flex items-center gap-1.5"
        >
          <Database className="w-4 h-4 text-rose-400" />
          <span>Ver Paleta Completa</span>
        </button>
      </div>

      {/* Colors Grid with Visual Model Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {colors.map((color, idx) => {
          const colorImage = color.imageUrl || getHairColorImage(color.shadeName, color.dyeCode, color.hexColor, idx);

          return (
            <div
              key={color.id}
              className="bg-neutral-900/80 border border-neutral-800 hover:border-rose-400/50 rounded-3xl overflow-hidden backdrop-blur-xl flex flex-col justify-between group transition-all duration-300 hover:shadow-2xl hover:shadow-rose-500/10"
            >
              {/* Top Photo & Swatch Split */}
              <div
                className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-neutral-950 overflow-hidden cursor-pointer"
                onClick={() =>
                  setLightboxData({
                    imageUrl: colorImage,
                    title: color.shadeName,
                    subtitle: `Fórmula ${color.dyeCode} • Mantenimiento ${color.maintenanceLevel}`,
                    description: color.luminosityEffect,
                    extraInfo: `Técnica recomendada: ${color.bestTechnique}`,
                    colorItem: color,
                  })
                }
              >
                <img
                  src={colorImage}
                  alt={color.shadeName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-80" />

                {/* Top badges on photo */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-amber-300 border border-amber-400/30 shadow">
                    {color.dyeCode}
                  </span>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-xs font-semibold text-neutral-200 border border-white/20 shadow">
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-white/80 shadow"
                      style={{ backgroundColor: color.hexColor }}
                    />
                    <span className="font-mono text-[11px]">{color.hexColor}</span>
                  </div>
                </div>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/90 text-neutral-100 text-xs font-semibold border border-neutral-700 shadow-xl">
                    <ZoomIn className="w-3.5 h-3.5 text-rose-400" />
                    <span>Ver Resultado Visual en Detalle</span>
                  </span>
                </div>

                {/* Bottom title over image */}
                <div className="absolute bottom-3 left-4 right-4 z-10 flex items-end justify-between">
                  <h4 className="font-serif-luxury text-lg sm:text-xl font-bold text-white drop-shadow-md">
                    {color.shadeName}
                  </h4>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-950/80 text-rose-300 border border-rose-400/30">
                    Mant. {color.maintenanceLevel}
                  </span>
                </div>
              </div>

              {/* Color Swatch Ribbon Bar */}
              <div
                className="h-2.5 w-full relative"
                style={{
                  background: `linear-gradient(90deg, ${color.hexColor} 0%, ${color.secondaryHex || color.hexColor} 60%, #171717 100%)`,
                }}
              />

              {/* Details Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Luminosity Effect */}
                  <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Efecto de Luz Natural en Tu Rostro:</span>
                    </span>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {color.luminosityEffect}
                    </p>
                  </div>

                  {/* Best Technique */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Técnica Recomendada:</span>
                    <span className="font-semibold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                      {color.bestTechnique}
                    </span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {onTestColorInTryOn && (
                      <button
                        type="button"
                        onClick={() => onTestColorInTryOn(color)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 text-xs font-semibold text-amber-300 border border-amber-400/30 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>Probar Tono</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setLightboxData({
                          imageUrl: colorImage,
                          title: color.shadeName,
                          subtitle: `Fórmula ${color.dyeCode} • Mantenimiento ${color.maintenanceLevel}`,
                          description: color.luminosityEffect,
                          extraInfo: `Técnica recomendada: ${color.bestTechnique}`,
                          colorItem: color,
                        })
                      }
                      className="text-neutral-400 hover:text-white text-xs px-2 py-1 transition-colors"
                      title="Ver imagen completa"
                    >
                      Ampliar
                    </button>
                  </div>

                  {onAskChatbotAboutColor && (
                    <button
                      type="button"
                      onClick={() => onAskChatbotAboutColor(color.shadeName)}
                      className="text-xs font-semibold text-rose-400 hover:text-rose-300 underline"
                    >
                      Preguntar a la Estilista →
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Colors to Avoid Section */}
      {avoidColors?.length > 0 && (
        <div className="bg-neutral-900/60 border border-rose-500/20 rounded-3xl p-6 sm:p-7 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2.5 text-rose-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h4 className="font-serif-luxury text-base font-bold">
              Tonos y Reflejos que Deberías Evitar
            </h4>
          </div>

          <p className="text-xs text-neutral-400">
            Estos tonos apagan la luminosidad de tu cutis o generan una apariencia cansada:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {avoidColors.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-start gap-3"
              >
                <div
                  className="w-5 h-5 rounded-full border border-neutral-700 shrink-0 mt-0.5"
                  style={{ backgroundColor: item.hexColor }}
                />
                <div className="space-y-1">
                  <h5 className="text-xs sm:text-sm font-bold text-rose-300">
                    ✕ {item.name}
                  </h5>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {item.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
