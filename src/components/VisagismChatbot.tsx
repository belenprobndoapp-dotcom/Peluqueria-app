import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, User, Bot, X, Minimize2, Maximize2, RefreshCw, Scissors, Palette } from 'lucide-react';
import { VisagismReport } from '../types/visagism';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface VisagismChatbotProps {
  report: VisagismReport | null;
  isOpen?: boolean;
  onClose?: () => void;
  isFloating?: boolean;
}

export const VisagismChatbot: React.FC<VisagismChatbotProps> = ({
  report,
  isOpen = true,
  onClose,
  isFloating = false,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: report
        ? `¡Hola! Soy tu **Master Stylist & Visagista Lumière**. He revisado tu diagnóstico: tienes rostro **${report.faceShape}**, piel **${report.skinAnalysis.tone}** (${report.skinAnalysis.undertone}) y cabello actual **${report.currentHairAnalysis.detectedColor}**.\n\n¿Qué tipo de cambio estás soñando hacerte? Cuéntame tus preferencias de largo, rutina de peinado o dudas sobre los cortes y colores sugeridos.`
        : '¡Hola! Soy tu **Master Stylist & Visagista**. Puedes preguntarme cualquier duda sobre visagismo, tipos de rostro, cortes que favorecen o colorimetría capilar. ¿En qué puedo asesorarte hoy?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update initial greeting when report changes
  useEffect(() => {
    if (report) {
      setMessages([
        {
          role: 'assistant',
          content: `¡Hola! Soy tu **Master Stylist & Visagista Lumière**. Analicé tu fisonomía: tu rostro es **${report.faceShape}**, con piel **${report.skinAnalysis.tone}** (${report.skinAnalysis.undertone}) y cabello **${report.currentHairAnalysis.detectedColor}**.\n\n¿Qué preferencias tienes para tu cambio de look? Cuéntame si buscas algo de bajo mantenimiento, si te preocupa algún rasgo o cuál de los cortes y tonos sugeridos te llama más la atención.`,
        },
      ]);
    }
  }, [report?.imageUrl]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickPrompts = report
    ? [
        `¿Qué corte me favorece si no quiero perder mucho largo?`,
        `¿El flequillo cortina armoniza con mi rostro ${report.faceShape}?`,
        `¿Cómo mantengo el brillo en el color ${report.hairColorRecommendations[0]?.shadeName || 'recomendado'}?`,
        `¿Qué estilo me recomiendas si uso gafas graduadas?`,
        `Tengo poco tiempo para peinarme, ¿cuál corte requiere menos secador?`,
      ]
    : [
        '¿Cómo saber qué tipo de rostro tengo?',
        '¿Qué tonos de cabello dan más luz a pieles cálidas?',
        '¿Qué corte estiliza un rostro redondo o cuadrado?',
        '¿Cuál es la diferencia entre subtono cálido y frío?',
      ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const reportContext = report
        ? {
            faceShape: report.faceShape,
            proportions: report.proportionsDescription,
            skinTone: report.skinAnalysis.tone,
            skinUndertone: report.skinAnalysis.undertone,
            season: report.skinAnalysis.seasonalPalette?.season,
            currentHair: report.currentHairAnalysis.detectedColor,
            recommendedCuts: report.haircutRecommendations.map((c) => c.name),
            cutsToAvoid: report.haircutsToAvoid.map((c) => c.name),
            recommendedColors: report.hairColorRecommendations.map((c) => `${c.shadeName} (${c.dyeCode})`),
            colorsToAvoid: report.hairColorsToAvoid.map((c) => c.name),
          }
        : null;

      const res = await fetch('/api/visagism-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          reportContext,
        }),
      });

      if (!res.ok) {
        throw new Error('Error al conectar con la asesora.');
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply || 'Disculpa, ¿podrías repetir la pregunta?' },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Lo siento, ocurrió una interrupción en la conexión. Por favor intenta preguntarme de nuevo.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    if (report) {
      setMessages([
        {
          role: 'assistant',
          content: `¡Listo! Empecemos de nuevo. Recuerda que tienes rostro **${report.faceShape}** y piel **${report.skinAnalysis.tone}**. ¿Qué cambio o consulta tienes en mente?`,
        },
      ]);
    } else {
      setMessages([
        {
          role: 'assistant',
          content: '¡Conversación reiniciada! ¿Qué dudas de visagismo o colorimetría tienes?',
        },
      ]);
    }
  };

  if (!isOpen) return null;

  // Floating window wrapper vs embedded panel
  const containerClasses = isFloating
    ? `fixed bottom-6 right-6 z-50 w-full sm:w-[420px] max-w-[calc(100vw-2rem)] shadow-2xl transition-all duration-300 ${
        isMinimized ? 'h-14' : 'h-[620px] max-h-[85vh]'
      }`
    : 'w-full h-[640px] flex flex-col';

  return (
    <div
      className={`${containerClasses} flex flex-col bg-neutral-900/95 backdrop-blur-2xl border border-neutral-800 rounded-3xl overflow-hidden shadow-amber-500/5`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-950/90 border-b border-neutral-800/80">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 p-[1.5px] shadow-sm">
              <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center">
                <Bot className="w-4 h-4 text-amber-300" />
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-neutral-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-neutral-100 font-serif-luxury">
                Asesora Lumière
              </h3>
              <span className="text-[10px] font-medium text-amber-400/90 bg-amber-400/10 px-1.5 py-0.5 rounded-md">
                Visagista IA
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              {report ? `Personalizado para rostro ${report.faceShape}` : 'Consultoría de Estilo & Color'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleResetChat}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Reiniciar chat"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {isFloating && (
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title={isMinimized ? 'Expandir' : 'Minimizar'}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={index}
                  className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      isAssistant
                        ? 'bg-neutral-800/80 text-neutral-100 border border-neutral-700/60'
                        : 'bg-gradient-to-r from-amber-500 to-rose-500 text-neutral-950 font-medium shadow-md'
                    }`}
                  >
                    {/* Simple formatting for bold and list items */}
                    <div className="whitespace-pre-line space-y-1">
                      {msg.content.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx}>
                          {paragraph.split('**').map((part, bIdx) =>
                            bIdx % 2 === 1 ? (
                              <strong
                                key={bIdx}
                                className={isAssistant ? 'text-amber-300 font-semibold' : 'font-bold'}
                              >
                                {part}
                              </strong>
                            ) : (
                              part
                            )
                          )}
                        </p>
                      ))}
                    </div>
                  </div>

                  {!isAssistant && (
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-amber-300" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                </div>
                <div className="bg-neutral-800/80 border border-neutral-700/60 rounded-2xl px-4 py-2.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                  <span
                    className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"
                    style={{ animationDelay: '0.15s' }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"
                    style={{ animationDelay: '0.3s' }}
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Suggestions */}
          <div className="px-4 py-2 bg-neutral-950/60 border-t border-neutral-800/80 overflow-x-auto scrollbar-none flex gap-2">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="shrink-0 text-[11px] px-3 py-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700/80 text-neutral-300 hover:text-white border border-neutral-700/50 transition-colors whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3.5 bg-neutral-950/95 border-t border-neutral-800/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu preferencia, miedo o duda..."
                disabled={isLoading}
                className="flex-1 bg-neutral-900 border border-neutral-700/80 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-rose-400 text-neutral-950 hover:from-amber-300 hover:to-rose-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all transform hover:scale-105 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
