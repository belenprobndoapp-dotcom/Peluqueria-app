import React from 'react';
import { Glasses, Sparkles, Shirt, Heart } from 'lucide-react';
import { ExtraVisagismTips } from '../types/visagism';

interface ExtraVisagismCardProps {
  tips: ExtraVisagismTips;
  faceShape: string;
}

export const ExtraVisagismCard: React.FC<ExtraVisagismCardProps> = ({ tips, faceShape }) => {
  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
      <div className="pb-4 border-b border-neutral-800">
        <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
          Asesoría Integral de Imagen
        </span>
        <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-neutral-100 mt-1">
          Complementos, Gafas & Escotes para Rostro {faceShape}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Eyewear */}
        <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <Glasses className="w-5 h-5" />
            <h4 className="font-bold text-sm text-neutral-100 font-serif-luxury">
              Gafas / Lentes Ideales
            </h4>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-0.5">
                Favorecen:
              </span>
              <p className="text-neutral-300 leading-relaxed">
                {tips.eyewear.recommended}
              </p>
            </div>

            <div className="pt-1.5 border-t border-neutral-800">
              <span className="text-[10px] font-bold uppercase text-rose-400 block mb-0.5">
                Evitar:
              </span>
              <p className="text-neutral-400 leading-relaxed">
                {tips.eyewear.avoid}
              </p>
            </div>
          </div>
        </div>

        {/* Necklines */}
        <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2 text-rose-400">
            <Shirt className="w-5 h-5" />
            <h4 className="font-bold text-sm text-neutral-100 font-serif-luxury">
              Escotes & Cuellos Óptimos
            </h4>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed">
            {tips.necklines}
          </p>
        </div>

        {/* Makeup / Illuminator */}
        <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <Sparkles className="w-5 h-5" />
            <h4 className="font-bold text-sm text-neutral-100 font-serif-luxury">
              Toques de Luz & Maquillaje
            </h4>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed">
            {tips.makeupHighlights}
          </p>
        </div>
      </div>
    </div>
  );
};
