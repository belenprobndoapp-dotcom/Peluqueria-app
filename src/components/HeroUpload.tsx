import React, { useState, useRef } from 'react';
import { Upload, Camera, Sparkles, Database, CheckCircle2, User, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { SAMPLE_MODELS } from '../data/sampleModels';
import { SampleModel } from '../types/visagism';

interface HeroUploadProps {
  onImageSelected: (base64Image: string, genderPref: string, lengthPref: string, notes: string) => void;
  onOpenCamera: () => void;
  onOpenDatabase: () => void;
  isLoading: boolean;
  externalImage?: string | null;
  onClearExternalImage?: () => void;
}

export const HeroUpload: React.FC<HeroUploadProps> = ({
  onImageSelected,
  onOpenCamera,
  onOpenDatabase,
  isLoading,
  externalImage,
  onClearExternalImage,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(externalImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const [genderPref, setGenderPref] = useState<'todos' | 'femenino' | 'masculino' | 'unisex'>('todos');
  const [lengthPref, setLengthPref] = useState<'todos' | 'corto' | 'medio' | 'largo'>('todos');
  const [userNotes, setUserNotes] = useState('');
  const [showAdvancedPrefs, setShowAdvancedPrefs] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync external image if provided (e.g. from webcam capture)
  React.useEffect(() => {
    if (externalImage) {
      setSelectedImage(externalImage);
    }
  }, [externalImage]);

  // Helper to optimize and resize base64 images before upload
  const compressImage = (base64Str: string, maxWidth = 1024, maxHeight = 1024, quality = 0.85): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(base64Str);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(base64Str);
      img.src = base64Str;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const result = reader.result as string;
      const optimized = await compressImage(result);
      setSelectedImage(optimized);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = async () => {
        const optimized = await compressImage(reader.result as string);
        setSelectedImage(optimized);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sample: SampleModel) => {
    fetchImageAsBase64(sample.imageUrl);
  };

  const fetchImageAsBase64 = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = async () => {
        const optimized = await compressImage(reader.result as string);
        setSelectedImage(optimized);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Error fetching sample image:', err);
      setSelectedImage(url);
    }
  };

  const handleSubmitAnalysis = () => {
    if (!selectedImage || isLoading) return;
    onImageSelected(selectedImage, genderPref, lengthPref, userNotes);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Hero Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-500/20 text-xs sm:text-sm font-semibold tracking-wide text-amber-300">
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          <span>FORMACIÓN PROFESIONAL</span>
          <span className="text-amber-500/50">•</span>
          <span className="text-amber-200">TRABAJO FINAL</span>
        </div>

        <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-100 leading-tight">
          Descubre el corte y color que <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-amber-100 bg-clip-text text-transparent">iluminan tu rostro</span>
        </h1>

        <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Sube una foto frontal para diagnosticar tu <strong>tipo de rostro exacto</strong>, los <strong>matices de tu piel</strong> (cálido, frío, neutro, oliva) y el <strong>subtono de tu cabello</strong> (ceniza, dorado, cobrizo). Recibe recomendaciones de alta peluquería y consulta con tu estilista IA.
        </p>

        {/* Database Quick Access Button */}
        <div className="pt-2">
          <button
            onClick={onOpenDatabase}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-neutral-300 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 transition-all hover:border-amber-400/40 hover:text-white"
          >
            <Database className="w-4 h-4 text-amber-400" />
            <span>Explorar Base de Datos de Cortes & Paletas de Tintes</span>
          </button>
        </div>
      </div>

      {/* Main Upload / Preview Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Upload Dropzone & Controls (7 cols) */}
        <div className="lg:col-span-7 bg-neutral-900/70 border border-neutral-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-luxury text-lg font-bold text-neutral-100 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-400" />
              <span>Fotografía para Diagnóstico</span>
            </h3>
            {selectedImage && (
              <button
                onClick={() => {
                  setSelectedImage(null);
                  onClearExternalImage?.();
                }}
                className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
              >
                Cambiar foto
              </button>
            )}
          </div>

          {!selectedImage ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[300px] ${
                isDragging
                  ? 'border-amber-400 bg-amber-500/10 scale-[0.99]'
                  : 'border-neutral-700/80 hover:border-amber-400/50 hover:bg-neutral-800/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-16 h-16 rounded-3xl bg-neutral-800/90 border border-neutral-700 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7" />
              </div>

              <h4 className="text-base font-bold text-neutral-200">
                Arrastra tu foto o haz clic para subir
              </h4>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                Formatos JPG, PNG o WEBP. Procura buena luz frontal y el rostro despejado.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 border border-neutral-700 transition-colors"
                >
                  Seleccionar Archivo
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCamera();
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 text-xs font-semibold border border-amber-400/30 transition-colors flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Usar Cámara / Selfie</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden bg-black aspect-[4/3] flex items-center justify-center border border-neutral-800 group">
              <img
                src={selectedImage}
                alt="Foto seleccionada"
                className="w-full h-full object-contain"
              />

              {/* Visagism grid overlay preview */}
              <div className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity flex items-center justify-center">
                <div className="w-48 h-64 border-2 border-dashed border-amber-300 rounded-[50%]" />
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-2xl bg-neutral-950/80 backdrop-blur-md border border-neutral-800">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Fotografía lista para análisis</span>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-neutral-300 hover:text-white underline font-medium"
                >
                  Cambiar
                </button>
              </div>
            </div>
          )}

          {/* Preferences Accordion */}
          <div className="border border-neutral-800 rounded-2xl p-4 bg-neutral-950/50 space-y-4">
            <button
              type="button"
              onClick={() => setShowAdvancedPrefs(!showAdvancedPrefs)}
              className="w-full flex items-center justify-between text-xs sm:text-sm font-semibold text-neutral-300 hover:text-white"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span>Preferencias de Look & Estilo (Opcional)</span>
              </div>
              <span className="text-xs text-neutral-500">
                {showAdvancedPrefs ? 'Ocultar' : 'Ajustar'}
              </span>
            </button>

            {showAdvancedPrefs && (
              <div className="space-y-4 pt-3 border-t border-neutral-800/80">
                {/* Gender Vibe */}
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                    Estilo o enfoque de corte:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['todos', 'femenino', 'masculino', 'unisex'] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGenderPref(g)}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                          genderPref === g
                            ? 'bg-amber-400 text-neutral-950 font-bold'
                            : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Length Preference */}
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                    Longitud preferida:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['todos', 'corto', 'medio', 'largo'] as const).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLengthPref(l)}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                          lengthPref === l
                            ? 'bg-rose-400 text-neutral-950 font-bold'
                            : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Notes */}
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                    Notas adicionales (textura, canas, rutina, miedos):
                  </label>
                  <input
                    type="text"
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                    placeholder="Ej: Cabello fino sin volumen, uso lentes, no quiero decoloración agresiva..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-amber-400/50"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleSubmitAnalysis}
            disabled={!selectedImage || isLoading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-400 to-amber-500 hover:from-amber-300 hover:to-rose-300 text-neutral-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>Analizando fisonomía, tono de piel y cabello...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Realizar Diagnóstico de Visagismo & Color</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Instant 1-Click Sample Models & Visagism Guide (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Models Card */}
          <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-3xl p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-luxury text-base font-bold text-neutral-100 flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" />
                <span>¿Sin foto a mano? Prueba un modelo</span>
              </h3>
              <span className="text-[11px] text-amber-400/90 font-medium">1 clic</span>
            </div>

            <p className="text-xs text-neutral-400">
              Selecciona una modelo con rasgos diversos para probar el diagnóstico instantáneamente:
            </p>

            <div className="grid grid-cols-2 gap-3">
              {SAMPLE_MODELS.map((model) => (
                <div
                  key={model.id}
                  onClick={() => handleSelectSample(model)}
                  className="group cursor-pointer rounded-2xl overflow-hidden border border-neutral-800 hover:border-amber-400/60 bg-neutral-950 transition-all p-2 flex items-center gap-2.5 hover:shadow-lg hover:shadow-amber-500/5"
                >
                  <img
                    src={model.imageUrl}
                    alt={model.name}
                    className="w-12 h-12 rounded-xl object-cover group-hover:scale-105 transition-transform shrink-0"
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-neutral-200 group-hover:text-amber-300 truncate transition-colors">
                      {model.name.split(' (')[0]}
                    </p>
                    <span className="text-[10px] text-neutral-400 block truncate">
                      {model.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guide Tips Card */}
          <div className="bg-neutral-900/50 border border-neutral-800/60 rounded-3xl p-6 space-y-3.5">
            <h4 className="font-serif-luxury text-sm font-bold text-neutral-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Para un diagnóstico 100% preciso:</span>
            </h4>
            <ul className="text-xs text-neutral-400 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Luz natural difusa:</strong> Evita sombras duras o filtros de color que alteren tu subtono.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Rostro descubierto:</strong> Deja visible la frente, pómulos y línea de la mandíbula.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Mirada frontal:</strong> Mantén la cabeza nivelada a la altura de la cámara.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
