import React, { useState } from 'react';
import { X, Search, Filter, Scissors, Palette, Sparkles, Check, AlertCircle, Heart } from 'lucide-react';
import {
  HAIRCUTS_DATABASE,
  HAIR_COLORS_DATABASE,
  HaircutEntry,
  HairColorEntry,
  queryHaircuts,
  queryHairColors,
} from '../data/visagismDatabase';
import { getHairColorImage } from '../utils/visagismVisuals';

interface DatabaseExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'haircuts' | 'colors';
  userFaceShape?: string;
  userSkinUndertone?: string;
}

export const DatabaseExplorerModal: React.FC<DatabaseExplorerModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'haircuts',
  userFaceShape,
  userSkinUndertone,
}) => {
  const [activeTab, setActiveTab] = useState<'haircuts' | 'colors'>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');

  // Haircuts filters
  const [selectedShape, setSelectedShape] = useState<string>(userFaceShape || 'todos');
  const [selectedGender, setSelectedGender] = useState<string>('todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Hair color filters
  const [selectedUndertone, setSelectedUndertone] = useState<string>(
    userSkinUndertone?.includes('Cálid')
      ? 'Cálido'
      : userSkinUndertone?.includes('Frí')
      ? 'Frío'
      : userSkinUndertone?.includes('Oliv')
      ? 'Oliva'
      : userSkinUndertone?.includes('Neutr')
      ? 'Neutro'
      : 'todos'
  );
  const [selectedSkinDepth, setSelectedSkinDepth] = useState<string>('todos');
  const [selectedColorFamily, setSelectedColorFamily] = useState<string>('todos');

  if (!isOpen) return null;

  // Filtered haircuts
  const filteredHaircuts = queryHaircuts({
    faceShape: selectedShape !== 'todos' ? selectedShape : undefined,
    gender: selectedGender !== 'todos' ? selectedGender : undefined,
    category: selectedCategory !== 'todos' ? selectedCategory : undefined,
    searchTerm: searchTerm.trim() || undefined,
  });

  // Filtered hair colors
  const filteredColors = queryHairColors({
    undertone: selectedUndertone !== 'todos' ? selectedUndertone : undefined,
    skinTone: selectedSkinDepth !== 'todos' ? selectedSkinDepth : undefined,
    category: selectedColorFamily !== 'todos' ? selectedColorFamily : undefined,
    searchTerm: searchTerm.trim() || undefined,
  });

  const faceShapesList = ['todos', 'Ovalado', 'Redondo', 'Cuadrado', 'Corazón', 'Diamante', 'Alargado'];
  const undertonesList = ['todos', 'Cálido', 'Frío', 'Neutro', 'Oliva'];
  const skinDepthsList = ['todos', 'Muy Claro', 'Claro', 'Medio', 'Bronceado', 'Oscuro'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl">
      <div className="relative w-full max-w-5xl h-[90vh] bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-400 p-[1px]">
              <div className="w-full h-full rounded-2xl bg-neutral-950 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
            </div>
            <div>
              <h2 className="font-serif-luxury text-xl font-bold text-neutral-100">
                Base de Datos de Visagismo & Colorimetría
              </h2>
              <p className="text-xs text-neutral-400">
                Catálogo técnico de cortes por fisonomía y fórmulas de tinte iluminadoras
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs & Search */}
        <div className="px-6 py-3.5 bg-neutral-900 border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center p-1 bg-neutral-950 rounded-2xl border border-neutral-800">
            <button
              onClick={() => setActiveTab('haircuts')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'haircuts'
                  ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Scissors className="w-4 h-4" />
              <span>Estilos de Corte ({HAIRCUTS_DATABASE.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('colors')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'colors'
                  ? 'bg-rose-400/15 text-rose-300 border border-rose-400/30 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Paletas de Tintes & Luz ({HAIR_COLORS_DATABASE.length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={activeTab === 'haircuts' ? 'Buscar corte, técnica, estilo...' : 'Buscar tinte, tono, reflejo...'}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-amber-400/50"
            />
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="px-6 py-3 bg-neutral-950/40 border-b border-neutral-800/60 overflow-x-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 shrink-0 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtros:</span>
          </div>

          {activeTab === 'haircuts' ? (
            <>
              {/* Face Shape Filter */}
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[11px] text-neutral-500 mr-1">Rostro:</span>
                {faceShapesList.map((shape) => (
                  <button
                    key={shape}
                    onClick={() => setSelectedShape(shape)}
                    className={`text-xs px-2.5 py-1 rounded-lg transition-all ${
                      selectedShape === shape
                        ? 'bg-amber-400 text-neutral-950 font-bold'
                        : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {shape === 'todos' ? 'Todos los Rostros' : shape}
                  </button>
                ))}
              </div>

              {/* Length Filter */}
              <div className="flex items-center gap-1 shrink-0 ml-2 border-l border-neutral-800 pl-3">
                <span className="text-[11px] text-neutral-500 mr-1">Largo:</span>
                {['todos', 'Corto', 'Medio', 'Largo'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-2.5 py-1 rounded-lg transition-all ${
                      selectedCategory === cat
                        ? 'bg-neutral-200 text-neutral-950 font-bold'
                        : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {cat === 'todos' ? 'Cualquier Largo' : cat}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Undertone Filter */}
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[11px] text-neutral-500 mr-1">Subtono Piel:</span>
                {undertonesList.map((ut) => (
                  <button
                    key={ut}
                    onClick={() => setSelectedUndertone(ut)}
                    className={`text-xs px-2.5 py-1 rounded-lg transition-all ${
                      selectedUndertone === ut
                        ? 'bg-rose-400 text-neutral-950 font-bold'
                        : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {ut === 'todos' ? 'Todos' : ut}
                  </button>
                ))}
              </div>

              {/* Skin Depth Filter */}
              <div className="flex items-center gap-1 shrink-0 ml-2 border-l border-neutral-800 pl-3">
                <span className="text-[11px] text-neutral-500 mr-1">Tono Tez:</span>
                {skinDepthsList.map((depth) => (
                  <button
                    key={depth}
                    onClick={() => setSelectedSkinDepth(depth)}
                    className={`text-xs px-2.5 py-1 rounded-lg transition-all ${
                      selectedSkinDepth === depth
                        ? 'bg-amber-400 text-neutral-950 font-bold'
                        : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {depth === 'todos' ? 'Todos' : depth}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-neutral-950/20">
          {activeTab === 'haircuts' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredHaircuts.length === 0 ? (
                <div className="col-span-full py-16 text-center text-neutral-400">
                  <Scissors className="w-12 h-12 mx-auto text-neutral-600 mb-3" />
                  <p className="text-base font-medium">No se encontraron cortes con estos filtros.</p>
                  <p className="text-xs text-neutral-500 mt-1">Prueba seleccionando "Todos los Rostros" o borrando la búsqueda.</p>
                </div>
              ) : (
                filteredHaircuts.map(({ item, matchScore, matchReasons }) => (
                  <div
                    key={item.id}
                    className="bg-neutral-900 border border-neutral-800 hover:border-amber-400/40 rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5"
                  >
                    {/* Image Header */}
                    <div className="relative h-44 overflow-hidden bg-neutral-950">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />

                      {/* Match Badge */}
                      {selectedShape !== 'todos' && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md border border-amber-400/30 text-amber-300 text-xs font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>{matchScore}% Afinidad</span>
                        </div>
                      )}

                      {/* Category & Gender */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-400 text-neutral-950">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-neutral-900/90 text-neutral-200 border border-neutral-700">
                          {item.gender}
                        </span>
                      </div>
                    </div>

                    {/* Details Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="font-serif-luxury text-base font-bold text-neutral-100 group-hover:text-amber-200 transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                          {item.visagismEffect}
                        </p>
                      </div>

                      {/* Compatible Shapes Tags */}
                      <div>
                        <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block mb-1.5">
                          Rostros que mejor favorece:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.compatibleFaceShapes.map((shape) => (
                            <span
                              key={shape}
                              className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                                selectedShape === shape
                                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                  : 'bg-neutral-800 text-neutral-300'
                              }`}
                            >
                              {shape}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Styling & Celebrity */}
                      <div className="pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">Mantenimiento:</span>
                          <span className="font-medium text-neutral-200">{item.maintenanceLevel}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">Referencia:</span>
                          <span className="font-medium text-neutral-300 truncate max-w-[160px]">
                            {item.celebrityReference}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredColors.length === 0 ? (
                <div className="col-span-full py-16 text-center text-neutral-400">
                  <Palette className="w-12 h-12 mx-auto text-neutral-600 mb-3" />
                  <p className="text-base font-medium">No se encontraron tonos con estos filtros.</p>
                  <p className="text-xs text-neutral-500 mt-1">Prueba seleccionando "Todos los Subtonos".</p>
                </div>
              ) : (
                filteredColors.map(({ item, matchScore }, idx) => {
                  const colorImg = (item as any).imageUrl || getHairColorImage(item.shadeName, item.dyeCode, item.hexColor, idx);

                  return (
                    <div
                      key={item.id}
                      className="bg-neutral-900 border border-neutral-800 hover:border-rose-400/40 rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/5"
                    >
                      {/* Photo with Swatch Overlay */}
                      <div className="relative aspect-[16/10] w-full bg-neutral-950 overflow-hidden">
                        <img
                          src={colorImg}
                          alt={item.shadeName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-amber-300 border border-amber-400/30">
                            {item.dyeCode}
                          </span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-white border border-white/20">
                            {item.category}
                          </span>
                        </div>

                        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-neutral-950/80 backdrop-blur-md border border-neutral-700">
                          <div
                            className="w-3.5 h-3.5 rounded-full border border-white"
                            style={{ backgroundColor: item.hexColor }}
                          />
                          <span className="text-[11px] font-mono text-white/90">
                            {item.hexColor}
                          </span>
                        </div>
                      </div>

                      {/* Swatch Ribbon */}
                      <div
                        className="h-1.5 w-full"
                        style={{
                          background: `linear-gradient(90deg, ${item.hexColor} 0%, ${item.secondaryHex || item.hexColor} 100%)`,
                        }}
                      />

                      {/* Body */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="font-serif-luxury text-base font-bold text-neutral-100 group-hover:text-rose-200 transition-colors">
                          {item.shadeName}
                        </h4>
                        <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                          {item.luminosityEffect}
                        </p>
                      </div>

                      {/* Enhanced Undertones & Skin tones */}
                      <div className="space-y-2 pt-2 border-t border-neutral-800/80">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block mb-1">
                            Realza los subtonos:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {item.enhancedUndertones.map((ut) => (
                              <span
                                key={ut}
                                className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                                  selectedUndertone === ut
                                    ? 'bg-rose-400/20 text-rose-300 border border-rose-400/40'
                                    : 'bg-neutral-800 text-neutral-300'
                                }`}
                              >
                                {ut}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block mb-1">
                            Técnica recomendada:
                          </span>
                          <span className="text-xs font-medium text-amber-300/90 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 inline-block">
                            {item.bestTechnique}
                          </span>
                        </div>

                        <div className="text-[11px] text-neutral-400 pt-1">
                          <span className="text-neutral-500">Bases compatibles: </span>
                          <span className="text-neutral-300">
                            {item.compatibleBaseHairColors.join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
