
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8" }) => {
  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      {/* 
        Official Insignia of the Myanmar Army Corps of Military Engineers.
        Features: Red shield with two dark blue horizontal bands and a central flaming grenade.
      */}
      <svg viewBox="0 0 160 185" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
        {/* Shield Base Shape */}
        <path 
          d="M5 5C5 5 30 0 80 0C130 0 155 5 155 5V125C155 155 120 175 80 185C40 175 5 155 5 125V5Z" 
          fill="#ED1C24" 
        />
        
        {/* Blue Stripes (Horizontal Bands) */}
        <path d="M5 35H155V65H5V35Z" fill="#2E3192" />
        <path d="M5 95H155V125H5V95Z" fill="#2E3192" />
        
        {/* Flaming Grenade (Yellow/Gold) */}
        <g transform="translate(80, 105)">
          {/* Base Sphere */}
          <circle cx="0" cy="15" r="28" fill="#FFF200" stroke="#000000" strokeWidth="1.5" />
          
          {/* Flame Petals */}
          <path 
            d="M-5 -12C-5 -12 -25 -40 0 -85C25 -40 5 -12 5 -12H-5Z" 
            fill="#FFF200" 
            stroke="#000000" 
            strokeWidth="1.5" 
          />
          <path 
            d="M-10 -10C-10 -10 -35 -30 -20 -65C-5 -30 2 -8 2 -8H-10Z" 
            fill="#FFF200" 
            stroke="#000000" 
            strokeWidth="1.5" 
          />
          <path 
            d="M10 -10C10 -10 35 -30 20 -65C5 -30 -2 -8 -2 -8H10Z" 
            fill="#FFF200" 
            stroke="#000000" 
            strokeWidth="1.5" 
          />
          <path 
            d="M-15 -5C-15 -5 -45 -15 -35 -45C-20 -15 -5 -3 -5 -3H-15Z" 
            fill="#FFF200" 
            stroke="#000000" 
            strokeWidth="1.5" 
          />
          <path 
            d="M15 -5C15 -5 45 -15 35 -45C20 -15 5 -3 5 -3H15Z" 
            fill="#FFF200" 
            stroke="#000000" 
            strokeWidth="1.5" 
          />
          
          {/* Collar Detail */}
          <rect x="-8" y="-12" width="16" height="4" rx="1" fill="#FFF200" stroke="#000000" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
};

export default Logo;
