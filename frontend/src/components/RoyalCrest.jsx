import React from 'react';

export default function RoyalCrest({ className = "w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56" }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Outer Golden Ambient Glow */}
      <div className="absolute inset-0 rounded-full bg-[#C8A96E]/20 blur-xl animate-pulse" />

      {/* Official Circular Sapna Saree Emblem Badge */}
      <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[#C8A96E]/80 shadow-[0_4px_30px_rgba(0,0,0,0.6)] group">
        <img
          src="/images/sapna_saree_logo.jpg"
          alt="Sapna Saree Official Logo"
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
        />
        {/* Subtle Luxury Glass Glare */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
