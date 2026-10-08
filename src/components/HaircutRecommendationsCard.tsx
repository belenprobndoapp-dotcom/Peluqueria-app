import React, { useState } from 'react';
import { Scissors, AlertTriangle, Sparkles, Database, Star, ZoomIn, Eye } from 'lucide-react';
import { HaircutRecommendation, HaircutToAvoid } from '../types/visagism';
import { getHaircutImage } from '../utils/visagismVisuals';
import { ImageLightboxModal } from './ImageLightboxModal';

interface HaircutRecommendationsCardProps {
  cuts: HaircutRecommendation[];
  avoidCuts: HaircutToAvoid[];
  faceShape: string;
  onOpenDatabase: () => void;
  onAskChatbotAboutCut?: (cutName: string) => void;
}

export const HaircutRecommendationsCard: React.FC<HaircutRecommendationsCardProps> = ({
  cuts,
  avoidCuts,
  faceShape,
  onOpenDatabase,
  onAskChatbotAboutCut,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'Todos' | 'Corto' | 'Medio' | 'Largo'>('Todos');
  const [lightboxData, setLightboxData] = useState<{
    imageUrl: string;
    title: string;
    subtitle: string;
    description: string;
    extraInfo: string;
  } | null>(null);

  const filteredCuts = cuts.filter((c) => {
    if (selectedFilter === 'Todos') return true;
    return c.category.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Lightbox Modal */}
      <ImageLightboxModal
        isOpen={!!lightboxData}
        onClose={() => setLightboxData(null)}
        imageUrl={lightboxData?.imageUrl || null}
        title={lightboxData?.title || ''}
        subtitle={lightboxData?.subtitle}
        badge="Corte Recomendado"
        type="haircut"
        description={lightboxData?.description}
        extraInfo={lightboxData?.extraInfo}
        onAction={
          onAskChatbotAboutCut && lightboxData
            ? () => onAskChatbotAboutCut(lightboxData.title)
            : undefined
        }
        actionLabel="Consultar con la Estilista sobre este corte"
      />

      {/* Header with Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
            <Scissors className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
              Arquitectura Capilar Personalizada
            </span>
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-neutral-100">
              Cortes que Favorecen tu Rostro {faceShape}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Length Filter Pills */}
          <div className="flex items-center p-1 bg-neutral-950 rounded-2xl border border-neutral-800">
            {(['Todos', 'Corto', 'Medio', 'Largo'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedFilter === cat
                    ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenDatabase}
            className="p-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold text-neutral-300 bg-neutral-800 hover:bg-neutral-700 transition-colors flex items-center gap-1.5"
            title="Ver catálogo completo de cortes"
          >
            <Database className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Ver Más Cortes</span>
          </button>
        </div>
      </div>

      {/* Haircuts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCuts.map((cut, idx) => {
          const cutImage = cut.imageUrl || getHaircutImage(cut.name, cut.category, idx);

          return (
            <div
              key={cut.id}
              className="bg-neutral-900/80 border border-neutral-800 hover:border-amber-400/50 rounded-3xl overflow-hidden backdrop-blur-xl flex flex-col justify-between group transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10"
            >
              {/* Photo Area */}
              <div
                className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-neutral-950 overflow-hidden cursor-pointer"
                onClick={() =>
                  setLightboxData({
                    imageUrl: cutImage,
                    title: cut.name,
                    subtitle: `Corte ${cut.category} • ${cut.suitabilityScore}% Compatibilidad`,
                    description: cut.whyItWorks,
                    extraInfo: cut.stylingTips,
                  })
                }
              >
                <img
                  src={cutImage}
                  alt={cut.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-80" />

                {/* Badges on image */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-neutral-950/80 backdrop-blur-md text-amber-300 border border-amber-400/30 shadow">
                    {cut.category}
                  </span>

                  <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-neutral-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/30 shadow">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{cut.suitabilityScore}% Compatibilidad</span>
                  </div>
                </div>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/90 text-neutral-100 text-xs font-semibold border border-neutral-700 shadow-xl">
                    <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ver Fotografía en Detalle</span>
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 z-10">
                  <h4 className="font-serif-luxury text-lg sm:text-xl font-bold text-white drop-shadow-md">
                    {cut.name}
                  </h4>
                </div>
              </div>

              {/* Details Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Visagism Effect */}
                  <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Por Qué Te Favorece:</span>
                    </span>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {cut.whyItWorks}
                    </p>
                  </div>

                  {/* Styling Tips */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-semibold text-neutral-400 block">
                      Consejos de Estilizado & Volumen:
                    </span>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {cut.stylingTips}
                    </p>
                  </div>
                </div>

                {/* Bottom: References & Consultation Trigger */}
                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs gap-2">
                  <span className="text-neutral-400 truncate max-w-[200px]">
                    {cut.celebrityOrVisualReference ? (
                      <span>Ref: <strong className="text-neutral-200">{cut.celebrityOrVisualReference}</strong></span>
                    ) : (
                      <span>Estilo Alta Peluquería</span>
                    )}
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxData({
                          imageUrl: cutImage,
                          title: cut.name,
                          subtitle: `Corte ${cut.category} • ${cut.suitabilityScore}% Compatibilidad`,
                          description: cut.whyItWorks,
                          extraInfo: cut.stylingTips,
                        })
                      }
                      className="text-neutral-400 hover:text-white flex items-center gap-1 text-xs"
                      title="Ampliar foto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Foto</span>
                    </button>

                    {onAskChatbotAboutCut && (
                      <button
                        type="button"
                        onClick={() => onAskChatbotAboutCut(cut.name)}
                        className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline"
                      >
                        Consultar →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cuts to Avoid Warning Section */}
      {avoidCuts?.length > 0 && (
        <div className="bg-neutral-900/60 border border-rose-500/20 rounded-3xl p-6 sm:p-7 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2.5 text-rose-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h4 className="font-serif-luxury text-base font-bold">
              Estilos que Deberías Evitar para Este Tipo de Rostro
            </h4>
          </div>

          <p className="text-xs text-neutral-400">
            Estos cortes rompen la proporción visual o enfatizan rasgos desproporcionadamente:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {avoidCuts.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-1"
              >
                <h5 className="text-xs sm:text-sm font-bold text-rose-300">
                  ✕ {item.name}
                </h5>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {item.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
