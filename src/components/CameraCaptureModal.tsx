import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Camera,
  X,
  RefreshCw,
  Check,
  RotateCcw,
  AlertCircle,
  Upload,
  Timer,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string, autoAnalyze?: boolean) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  // Play a soft synthetic shutter sound using Web Audio API
  const playShutterSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // Audio playback can fail if user hasn't interacted, which is fine to ignore
    }
  };

  // Helper to optimize and resize base64 images before passing to analysis
  const compressImage = (
    base64Str: string,
    maxWidth = 1024,
    maxHeight = 1024,
    quality = 0.88
  ): Promise<string> => {
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

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraReady(false);
  }, [stream]);

  const attachStreamToVideo = useCallback((mediaStream: MediaStream) => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    video.srcObject = mediaStream;
    video.muted = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('autoplay', 'true');

    video
      .play()
      .then(() => {
        setIsCameraReady(true);
      })
      .catch((err) => {
        console.warn('Video play error on attach:', err);
      });
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    setIsCameraReady(false);

    if (!navigator?.mediaDevices?.getUserMedia) {
      setError(
        'Tu navegador no tiene soporte directo para cámara web o el permiso no está disponible en este entorno. Puedes tomar o seleccionar una foto con tu app nativa usando el botón abajo.'
      );
      return;
    }

    const constraintList: MediaStreamConstraints[] = [
      {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      },
      {
        video: {
          facingMode: facingMode,
        },
        audio: false,
      },
      {
        video: true,
        audio: false,
      },
    ];

    let lastErr: any = null;
    let activeStream: MediaStream | null = null;

    for (const constraints of constraintList) {
      try {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
        activeStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (activeStream) break;
      } catch (err: any) {
        lastErr = err;
      }
    }

    if (!activeStream) {
      console.warn('Webcam stream failed with all constraints:', lastErr);
      if (
        lastErr?.name === 'NotAllowedError' ||
        lastErr?.name === 'PermissionDeniedError' ||
        lastErr?.name === 'SecurityError'
      ) {
        setError(
          'Permiso de cámara no concedido. Por favor otorga permiso a la cámara en tu navegador o usa el botón de abajo para tomar la foto con tu cámara del dispositivo.'
        );
      } else if (
        lastErr?.name === 'NotFoundError' ||
        lastErr?.name === 'DevicesNotFoundError'
      ) {
        setError('No se detectó ninguna cámara conectada en tu equipo.');
      } else {
        setError(
          'No se pudo inicializar la cámara web en vivo. Puedes tomar o subir la foto con el botón inferior.'
        );
      }
      return;
    }

    setStream(activeStream);
    attachStreamToVideo(activeStream);
  }, [facingMode, stream, attachStreamToVideo]);

  // Lifecycle control on modal open / facing mode change
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedPreview(null);
      setError(null);
      setCountdown(null);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  // If video element mounts after stream is acquired
  useEffect(() => {
    if (stream && videoRef.current && !capturedPreview) {
      attachStreamToVideo(stream);
    }
  }, [stream, capturedPreview, attachStreamToVideo]);

  // Execute snapshot from active video stream
  const executeSnapshot = () => {
    const video = videoRef.current;
    if (!video) {
      setError('El elemento de video no está disponible.');
      return;
    }

    let width = video.videoWidth;
    let height = video.videoHeight;

    // Fallback dimensions if metadata not yet populated
    if (!width || !height || width === 0 || height === 0) {
      width = 640;
      height = 480;
    }

    // Limit maximum dimension for speed and AI upload limit
    const maxDim = 1024;
    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    try {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No se pudo inicializar el contexto de dibujo.');
      }

      ctx.save();
      if (facingMode === 'user') {
        // Mirror horizontally for selfie orientation
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);

      if (!dataUrl || dataUrl.length < 200) {
        throw new Error('La captura de imagen resultó vacía.');
      }

      // Visual and audio feedback
      playShutterSound();
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 180);

      setCapturedPreview(dataUrl);
    } catch (err: any) {
      console.error('Error al tomar snapshot:', err);
      setError('Ocurrió un error al capturar la imagen. Por favor reintenta.');
    }
  };

  const handleCaptureClick = () => {
    if (!isCameraReady && !videoRef.current) return;

    if (timerEnabled) {
      setCountdown(3);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            executeSnapshot();
            return null;
          }
          return prev - 1;
        });
      }, 900);
    } else {
      executeSnapshot();
    }
  };

  const handleConfirmAndAnalyze = async () => {
    if (!capturedPreview) return;
    const finalPhoto = capturedPreview;
    stopCamera();
    onClose();
    onCapture(finalPhoto, true);
  };

  const handleConfirmAndCustomize = async () => {
    if (!capturedPreview) return;
    const finalPhoto = capturedPreview;
    stopCamera();
    onClose();
    onCapture(finalPhoto, false);
  };

  const handleRetake = () => {
    setCapturedPreview(null);
    if (!stream) {
      startCamera();
    } else if (videoRef.current) {
      attachStreamToVideo(stream);
    }
  };

  const handleNativeFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const rawResult = reader.result as string;
        const compressed = await compressImage(rawResult, 1024, 1024, 0.88);
        setCapturedPreview(compressed);
        setError(null);
      } catch (err) {
        console.error('Error optimizing fallback photo:', err);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input value to allow selecting identical file if repeated
    e.target.value = '';
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Hidden native camera/file fallback input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="user"
          onChange={handleNativeFileInput}
          className="hidden"
        />

        {/* Flash effect overlay */}
        {isFlashing && (
          <div className="absolute inset-0 bg-white z-40 pointer-events-none transition-opacity duration-150 opacity-90" />
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-neutral-100 text-sm sm:text-base">
              {capturedPreview ? 'Confirmar Fotografía' : 'Cámara Web / Selfie en Vivo'}
            </h3>
          </div>
          <button
            onClick={() => {
              stopCamera();
              setCapturedPreview(null);
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title="Cerrar cámara"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video or Preview Area */}
        <div className="relative aspect-[4/3] bg-neutral-950 overflow-hidden flex items-center justify-center">
          {capturedPreview ? (
            /* Snapshot Preview Screen */
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={capturedPreview}
                alt="Foto capturada con cámara"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-neutral-950/90 px-3 py-1 rounded-full text-xs text-amber-300 border border-amber-400/40 flex items-center gap-1.5 backdrop-blur-md shadow-lg">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Foto Capturada</span>
              </div>
            </div>
          ) : error ? (
            /* Error & Native Camera Fallback state */
            <div className="p-6 text-center space-y-4 max-w-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {error}
              </p>
              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 text-neutral-950 font-bold text-xs sm:text-sm shadow-lg transition-transform transform hover:scale-[1.02]"
                >
                  <Camera className="w-4 h-4" />
                  <span>Tomar con Cámara del Dispositivo</span>
                </button>
                <button
                  type="button"
                  onClick={() => startCamera()}
                  className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 transition-colors"
                >
                  Reintentar Cámara Web
                </button>
              </div>
            </div>
          ) : (
            /* Live Camera Stream */
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    videoRef.current.play().catch(console.warn);
                    setIsCameraReady(true);
                  }
                }}
                onCanPlay={() => setIsCameraReady(true)}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isCameraReady ? 'opacity-100' : 'opacity-40'
                } ${facingMode === 'user' ? '-scale-x-100' : ''}`}
              />

              {/* Visagism Oval Guide Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-52 h-68 sm:w-60 sm:h-76 border-2 border-dashed border-amber-400/80 rounded-[50%] shadow-[0_0_0_9999px_rgba(0,0,0,0.4)] flex flex-col items-center justify-between py-5">
                  <span className="text-[10px] sm:text-[11px] font-medium text-amber-300 bg-neutral-950/85 px-3 py-0.5 rounded-full border border-amber-400/40 shadow">
                    Frente aquí
                  </span>
                  <div className="w-full flex justify-center">
                    <div className="w-10 h-[1px] bg-amber-400/40" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-medium text-amber-300 bg-neutral-950/85 px-3 py-0.5 rounded-full border border-amber-400/40 shadow">
                    Barbilla aquí
                  </span>
                </div>
              </div>

              {/* Loading indicator until ready */}
              {!isCameraReady && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                  <span className="text-xs text-amber-300 font-medium">Iniciando cámara web...</span>
                </div>
              )}

              {/* Countdown overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
                  <span className="text-8xl font-extrabold font-serif-luxury text-amber-300 animate-ping">
                    {countdown}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Controls */}
        <div className="p-4 sm:p-5 bg-neutral-900 border-t border-neutral-800">
          {capturedPreview ? (
            /* Actions when photo is taken */
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleConfirmAndAnalyze}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-400 to-amber-500 hover:from-amber-300 hover:to-rose-300 text-neutral-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all transform hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Analizar Foto Ahora</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirmAndCustomize}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs sm:text-sm border border-neutral-700 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Ajustar Preferencias</span>
                </button>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Repetir Fotografía</span>
                </button>
              </div>
            </div>
          ) : error ? (
            /* Alternative button if webcam failed */
            <button
              type="button"
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="w-full py-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 transition-colors"
            >
              Cerrar
            </button>
          ) : (
            /* Live Camera Controls */
            <div className="flex items-center justify-between gap-3">
              {/* Facing mode flip */}
              <button
                type="button"
                onClick={toggleFacingMode}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                title="Girar cámara frontal / trasera"
              >
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Girar</span>
              </button>

              {/* Shutter Button */}
              <button
                type="button"
                onClick={handleCaptureClick}
                disabled={!isCameraReady || countdown !== null}
                className="flex-1 max-w-[220px] flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-400 to-amber-500 hover:from-amber-300 hover:to-rose-300 text-neutral-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>{timerEnabled ? 'Capturar (3s)' : 'Capturar Foto'}</span>
              </button>

              {/* Timer 3s Toggle */}
              <button
                type="button"
                onClick={() => setTimerEnabled(!timerEnabled)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  timerEnabled
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                }`}
                title="Temporizador de 3 segundos"
              >
                <Timer className="w-4 h-4" />
                <span className="hidden sm:inline">3s</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
