import React, { useState } from 'react';
import { Eye, Sparkles, Sun, Sliders, Split, RefreshCw, Palette, ImageIcon } from 'lucide-react';
import { HairColorRecommendation } from '../types/visagism';
import { HAIR_COLORS_DATABASE } from '../data/visagismDatabase';
import { getHairColorImage } from '../utils/visagismVisuals';

interface VirtualColorTryOnProps {
  imageUrl: string;
  recommendedColors: HairColorRecommendation[];
  currentHairHex: string;
  currentHairColor: string;
  selectedColor?: HairColorRecommendation | null;
}

export const VirtualColorTryOn: React.FC<VirtualColorTryOnProps> = ({
  imageUrl,
  recommendedColors,
  currentHairHex,
  currentHairColor,
  selectedColor: initialColor,
}) => {
  const [activeColor, setActiveColor] = useState<{ name: string; hex: string; dyeCode: string }>(
    initialColor
      ? { name: initialColor.shadeName, hex: initialColor.hexColor, dyeCode: initialColor.dyeCode }
      : recommendedColors[0]
      ? {
          name: recommendedColors[0].shadeName,
          hex: recommendedColors[0].hexColor,
          dyeCode: recommendedColors[0].dyeCode,
        }
      : {
          name: 'Balayage Miel Dorado',
          hex: '#c58b45',
          dyeCode: '7.34',
        }
  );

  const [glowIntensity, setGlowIntensity] = useState<number>(65);
  const [lightTemperature, setLightTemperature] = useState<'calido' | 'frio' | 'neutro'>('calido');
  const [splitMode, setSplitMode] = useState<boolean>(false);
  const [splitPosition, setSplitPosition] = useState<number>(50);

  // Quick swatches including recommended + top database colors
  const paletteSwatches = [
    ...recommendedColors.map((c) => ({ name: c.shadeName, hex: c.hexColor, dyeCode: c.dyeCode })),
    ...HAIR_COLORS_DATABASE.slice(0, 4).map((c) => ({
      name: c.shadeName,
      hex: c.hexColor,
      dyeCode: c.dyeCode,
    })),
  ].filter((v, i, a) => a.findIndex((t) => t.hex === v.hex) === i);

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
              Simulador Visual
            </span>
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-neutral-100">
              Probador de Luz & Tono Capilar
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSplitMode(!splitMode)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              splitMode
                ? 'bg-amber-400 text-neutral-950 font-bold'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>{splitMode ? 'Vista Completa' : 'Comparar Antes / Después'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Canvas / Image Display (7 cols) */}
        <div className="lg:col-span-7 relative aspect-[4/5] bg-black rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl flex items-center justify-center select-none group">
          {/* Base photo */}
          <img
            src={imageUrl}
            alt="Simulación de color"
            className="w-full h-full object-cover"
          />

          {/* Color Aura Glow Lighting Overlay */}
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300 mix-blend-color"
            style={{
              backgroundColor: activeColor.hex,
              opacity: (glowIntensity / 100) * 0.42,
            }}
          />

          {/* Radiant Soft-light filter */}
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300 mix-blend-soft-light"
            style={{
              backgroundColor: activeColor.hex,
              opacity: (glowIntensity / 100) * 0.55,
            }}
          />

          {/* Ambient Rim Lighting Gradient for hair frame */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: `inset 0 0 100px 30px ${activeColor.hex}50`,
            }}
          />

          {/* Split Mode Slider Overlay */}
          {splitMode && (
            <div
              className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
              style={{ width: `${splitPosition}%` }}
            >
              {/* Left raw original image */}
              <img
                src={imageUrl}
                alt="Original"
                className="w-full h-full object-cover max-w-none"
                style={{ width: '100%', height: '100%' }}
              />
              <span className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-bold text-white border border-white/20">
                Original (Nivel {currentHairColor})
              </span>
            </div>
          )}

          {splitMode && (
            <>
              {/* Divider handle */}
              <div
                className="absolute inset-y-0 w-1 bg-amber-400 cursor-ew-resize flex items-center justify-center shadow-lg"
                style={{ left: `${splitPosition}%` }}
              >
                <div className="w-7 h-7 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center font-bold text-xs shadow-md">
                  ↔
                </div>
              </div>

              {/* Invisible range control over image */}
              <input
                type="range"
                min="5"
                max="95"
                value={splitPosition}
                onChange={(e) => setSplitPosition(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
              />
            </>
          )}

          {/* Active shade floating badge */}
          <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-neutral-950/85 backdrop-blur-md border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: activeColor.hex }}
              />
              <div>
                <p className="text-xs font-bold text-neutral-100">{activeColor.name}</p>
                <span className="text-[10px] font-mono text-neutral-400">
                  Reflejo {activeColor.dyeCode} • {activeColor.hex}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-amber-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulación Activa</span>
            </div>
          </div>
        </div>

        {/* Controls & Swatches Palette (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Swatch Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-amber-400" />
                <span>Tonos Disponibles para Probar:</span>
              </span>
              <span className="text-[11px] text-neutral-400">Haz clic en un tono</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {paletteSwatches.map((swatch, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveColor(swatch)}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    activeColor.hex === swatch.hex
                      ? 'bg-neutral-800 border-amber-400 shadow-md ring-1 ring-amber-400/40'
                      : 'bg-neutral-950/60 border-neutral-800 hover:bg-neutral-800'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-lg border border-white/20 shrink-0"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-neutral-200 truncate">{swatch.name}</p>
                    <span className="text-[10px] font-mono text-neutral-400">{swatch.dyeCode}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Real Photo Reference for Active Shade */}
          <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-neutral-700 bg-black relative">
              <img
                src={getHairColorImage(activeColor.name, activeColor.dyeCode, activeColor.hex)}
                alt={activeColor.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-white"
                style={{ backgroundColor: activeColor.hex }}
              />
            </div>

            <div className="space-y-0.5 flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 block">
                Referencia Visual del Tono
              </span>
              <h5 className="text-xs font-bold text-neutral-100 truncate">
                {activeColor.name}
              </h5>
              <span className="text-[11px] font-mono text-amber-300 block">
                Fórmula de salón: {activeColor.dyeCode}
              </span>
            </div>
          </div>

          {/* Sliders: Glow Intensity & Light Temperature */}
          <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-4">
            {/* Glow Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-neutral-300">
                <span className="flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Intensidad de Brillo & Reflejo</span>
                </span>
                <span className="font-bold text-amber-300">{glowIntensity}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={glowIntensity}
                onChange={(e) => setGlowIntensity(Number(e.target.value))}
                className="w-full accent-amber-400 h-1.5 rounded-full bg-neutral-800 cursor-pointer"
              />
            </div>

            {/* Light Temperature Selector */}
            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <span className="text-xs font-semibold text-neutral-300 block">
                Temperatura de Luz Ambiental:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'calido', label: 'Cálida (Golden Hour)' },
                  { id: 'neutro', label: 'Neutra (Día Natural)' },
                  { id: 'frio', label: 'Fría (Luz Nieve)' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setLightTemperature(t.id as any)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-medium transition-all ${
                      lightTemperature === t.id
                        ? 'bg-amber-400 text-neutral-950 font-bold'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Salon Tip */}
          <p className="text-[11px] text-neutral-400 leading-relaxed bg-neutral-950/40 p-3.5 rounded-2xl border border-neutral-800/60">
            💡 <strong>Consejo del Colorista:</strong> Si tienes ojos marrones o miel, un reflejo con destellos dorados o cobrizos cálidos amplifica el iris. Si tus ojos son negros o verdes fríos, los reflejos avellana moka o beige nacarado crean un marco de contraste nítido.
          </p>
        </div>
      </div>
    </div>
  );
};
