import React from 'react';

export function getFaceShapeIcon(shape: string, className = 'w-16 h-16') {
  const normalized = shape.toLowerCase();

  if (normalized.includes('oval')) {
    return (
      <svg viewBox="0 0 100 120" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
        <ellipse cx="50" cy="60" rx="35" ry="48" className="stroke-amber-400" />
        <line x1="20" y1="45" x2="80" y2="45" strokeDasharray="3 3" className="stroke-amber-400/40" />
        <line x1="15" y1="60" x2="85" y2="60" strokeDasharray="3 3" className="stroke-amber-400/60" />
        <line x1="25" y1="85" x2="75" y2="85" strokeDasharray="3 3" className="stroke-amber-400/40" />
      </svg>
    );
  }

  if (normalized.includes('redond') || normalized.includes('round')) {
    return (
      <svg viewBox="0 0 100 120" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="50" cy="60" r="42" className="stroke-rose-400" />
        <line x1="15" y1="60" x2="85" y2="60" strokeDasharray="3 3" className="stroke-rose-400/60" />
        <line x1="50" y1="20" x2="50" y2="100" strokeDasharray="3 3" className="stroke-rose-400/60" />
      </svg>
    );
  }

  if (normalized.includes('cuadrad') || normalized.includes('square')) {
    return (
      <svg viewBox="0 0 100 120" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M 22 25 Q 50 20 78 25 L 80 75 Q 75 98 50 100 Q 25 98 20 75 Z" className="stroke-emerald-400" />
        <line x1="22" y1="75" x2="78" y2="75" strokeDasharray="3 3" className="stroke-emerald-400/60" />
      </svg>
    );
  }

  if (normalized.includes('coraz') || normalized.includes('heart') || normalized.includes('invertid')) {
    return (
      <svg viewBox="0 0 100 120" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M 18 30 Q 50 24 82 30 Q 82 55 50 102 Q 18 55 18 30 Z" className="stroke-pink-400" />
        <line x1="20" y1="35" x2="80" y2="35" strokeDasharray="3 3" className="stroke-pink-400/60" />
      </svg>
    );
  }

  if (normalized.includes('diamant') || normalized.includes('diamond')) {
    return (
      <svg viewBox="0 0 100 120" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M 50 18 L 84 58 L 50 102 L 16 58 Z" className="stroke-cyan-400" />
        <line x1="16" y1="58" x2="84" y2="58" strokeDasharray="3 3" className="stroke-cyan-400/60" />
      </svg>
    );
  }

  // Alargado / Rectangular / Default
  return (
    <svg viewBox="0 0 100 120" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
      <rect x="22" y="15" width="56" height="90" rx="26" className="stroke-indigo-400" />
      <line x1="22" y1="40" x2="78" y2="40" strokeDasharray="3 3" className="stroke-indigo-400/40" />
      <line x1="22" y1="80" x2="78" y2="80" strokeDasharray="3 3" className="stroke-indigo-400/40" />
    </svg>
  );
}
