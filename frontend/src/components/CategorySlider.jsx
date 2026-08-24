import React, { useRef } from 'react';
import { CATEGORIES_DATA } from '../utils/demoData';

export default function CategorySlider({ onSelectCategory, navigateTo }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (catTitle) => {
    if (onSelectCategory) {
      onSelectCategory(catTitle);
    }
    if (navigateTo) {
      navigateTo('catalog');
    }
  };

  return (
    <section className="w-full py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-[#FAF8F5] border-b border-brandBorder/30">
      <div className="max-w-[1550px] mx-auto">
        
        {/* Section Header with Left/Right Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-12">
          <div>
            <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-secondary block mb-2">
              Curated Collections &amp; Edits
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-charcoal tracking-tight">
              DISCOVER BY OCCASION
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-sans text-charcoal-muted tracking-widest uppercase hidden md:inline">
              Scroll To Explore
            </span>
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-charcoal/20 bg-white/80 hover:bg-primary hover:text-white hover:border-primary flex items-center justify-center text-charcoal transition-all shadow-sm"
              aria-label="Scroll Left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-charcoal/20 bg-white/80 hover:bg-primary hover:text-white hover:border-primary flex items-center justify-center text-charcoal transition-all shadow-sm"
              aria-label="Scroll Right"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Row of Square Image Cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-4 pt-1 select-none scroll-smooth"
        >
          {CATEGORIES_DATA.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.title)}
              className="flex-shrink-0 w-60 sm:w-72 md:w-80 group cursor-pointer"
            >
              {/* Square Image Card Container */}
              <div className="relative w-full aspect-square bg-[#F4EFEA] overflow-hidden border border-brandBorder/40 shadow-sm rounded-sm">
                <img
                  src={cat.image}
                  alt={cat.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80';
                  }}
                />
                
                {/* Subtle Gradient & Badge Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[9px] font-sans uppercase tracking-widest px-2.5 py-1 text-charcoal font-medium border border-white/60">
                  {cat.count}
                </span>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] font-sans tracking-[0.2em] uppercase font-medium">Explore Edit</span>
                  <span>→</span>
                </div>
              </div>

              {/* Title & Short Subtitle Below Each Square Card */}
              <div className="pt-3.5 pb-1">
                <h3 className="font-serif text-lg sm:text-xl font-normal text-charcoal group-hover:text-primary transition-colors leading-tight">
                  {cat.title}
                </h3>
                <p className="font-sans text-xs text-charcoal-muted font-light mt-1">
                  {cat.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
