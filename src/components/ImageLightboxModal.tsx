import React from 'react';
import { X, ZoomIn, Sparkles, Scissors, Palette, ExternalLink } from 'lucide-react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  title: string;
  subtitle?: string;
  badge?: string;
  description?: string;
  extraInfo?: string;
  type?: 'haircut' | 'haircolor';
  onAction?: () => void;
  actionLabel?: string;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  subtitle,
  badge,
  description,
  extraInfo,
  type = 'haircut',
  onAction,
  actionLabel,
}) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-neutral-950/80 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors border border-neutral-800"
          title="Cerrar vista previa"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Half */}
        <div className="md:w-3/5 bg-black flex items-center justify-center relative min-h-[300px] md:min-h-[460px] overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />

          {badge && (
            <div className="absolute bottom-4 left-4 z-10 px-3 py-1 rounded-full bg-neutral-950/85 backdrop-blur-md border border-neutral-700/80 text-xs font-semibold text-amber-300 flex items-center gap-1.5 shadow-lg">
              {type === 'haircut' ? (
                <Scissors className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Palette className="w-3.5 h-3.5 text-rose-400" />
              )}
              <span>{badge}</span>
            </div>
          )}
        </div>

        {/* Details Half */}
        <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto space-y-6 bg-neutral-900">
          <div className="space-y-4">
            <div>
              {subtitle && (
                <span className="text-xs uppercase font-bold tracking-wider text-amber-400 block mb-1">
                  {subtitle}
                </span>
              )}
              <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-neutral-100">
                {title}
              </h3>
            </div>

            {description && (
              <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Efecto & Armonía Visagista:</span>
                </span>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {description}
                </p>
              </div>
            )}

            {extraInfo && (
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-neutral-400 block">
                  Recomendación del Estilista:
                </span>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {extraInfo}
                </p>
              </div>
            )}
          </div>

          {/* Action button if supplied */}
          {onAction && actionLabel && (
            <div className="pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  onAction();
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-rose-400 to-amber-500 hover:from-amber-300 hover:to-rose-300 text-neutral-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>{actionLabel}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
