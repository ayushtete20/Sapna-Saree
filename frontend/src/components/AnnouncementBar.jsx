import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "✦ COD AVAILABLE ACROSS INDIA",
  "✦ EASY 7-DAY HASSLE-FREE RETURNS",
  "✦ COMPLIMENTARY SHIPPING ON ORDERS OVER ₹1999",
  "✦ EXPRESS 48-HOUR DISPATCH ACROSS INDIA",
  "✦ BESPOKE BRIDAL CONSULTATION VIA WHATSAPP"
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % MESSAGES.length);
        setFade(true);
      }, 300);
    }, 3800);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + MESSAGES.length) % MESSAGES.length);
      setFade(true);
    }, 200);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % MESSAGES.length);
      setFade(true);
    }, 200);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full bg-black text-white py-2 px-4 select-none z-50 text-center flex items-center justify-between border-b border-white/10"
    >
      {/* Left Chevron Button */}
      <button
        onClick={handlePrev}
        className="text-white/60 hover:text-white transition-colors p-1 text-xs opacity-80 hover:opacity-100 hidden sm:block"
        aria-label="Previous announcement"
      >
        ‹
      </button>

      {/* Rotating Message */}
      <div className="flex-1 flex items-center justify-center overflow-hidden h-5">
        <p
          className={`font-sans text-[10px] sm:text-[11px] tracking-[0.22em] uppercase font-medium transition-all duration-300 transform ${
            fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1.5'
          }`}
        >
          {MESSAGES[currentIndex]}
        </p>
      </div>

      {/* Right Chevron Button */}
      <button
        onClick={handleNext}
        className="text-white/60 hover:text-white transition-colors p-1 text-xs opacity-80 hover:opacity-100 hidden sm:block"
        aria-label="Next announcement"
      >
        ›
      </button>
    </div>
  );
}
