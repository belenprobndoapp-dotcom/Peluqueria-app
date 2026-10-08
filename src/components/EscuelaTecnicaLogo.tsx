import React, { useState } from 'react';
import schoolLogoImg from '../assets/images/escuela_tecnica_saladas_logo_real_1791464176380.jpg';

interface EscuelaTecnicaLogoProps {
  className?: string;
  size?: number;
}

export const EscuelaTecnicaLogo: React.FC<EscuelaTecnicaLogoProps> = ({
  className = "w-9 h-9",
}) => {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Escudo Oficial Escuela Técnica Saladas - Corrientes"
      >
        <title>Escuela Técnica Saladas - Corrientes</title>
        <circle cx="50" cy="50" r="48" fill="#1D4ED8" stroke="#1E40AF" strokeWidth="2" />
        <circle cx="50" cy="50" r="38" fill="#FFFFFF" />
        <text x="50" y="18" fill="#FFFFFF" fontSize="6.5" fontWeight="bold" textAnchor="middle">
          ESCUELA TÉCNICA
        </text>
        <text x="50" y="93" fill="#FFFFFF" fontSize="5.5" fontWeight="bold" textAnchor="middle">
          SALADAS - CORRIENTES
        </text>
        <text x="50" y="56" fill="#1D4ED8" fontSize="22" fontWeight="900" textAnchor="middle">
          ET
        </text>
      </svg>
    );
  }

  return (
    <img
      src={schoolLogoImg}
      alt="Escudo Oficial Escuela Técnica Saladas - Corrientes"
      title="Escuela Técnica Saladas - Corrientes"
      className={`rounded-full object-cover select-none drop-shadow-md transition-transform duration-300 ${className}`}
      style={{ clipPath: 'circle(46% at 50% 50%)' }}
      loading="eager"
      onError={() => setImageError(true)}
    />
  );
};
