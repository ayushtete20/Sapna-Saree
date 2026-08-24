import React, { useState } from 'react';
import RoyalCrest from '../components/RoyalCrest';
import ProductCard from '../components/ProductCard';
import CategorySlider from '../components/CategorySlider';
import PriceFilterPills from '../components/PriceFilterPills';
import EditorialSplitScreen from '../components/EditorialSplitScreen';
import EditorialLookbook from '../components/EditorialLookbook';
import TrendingInstagram from '../components/TrendingInstagram';
import StyleFinderSection from '../components/StyleFinderSection';
import { DEMO_SAREES } from '../utils/demoData';

export default function Home({ sarees = [], onSelectProduct, onAddToCart, navigateTo }) {
  const displaySarees = sarees && sarees.length > 0 ? sarees : DEMO_SAREES;
  const [activePriceFilter, setActivePriceFilter] = useState('all');
  const [selectedTier, setSelectedTier] = useState(null);

  const handlePriceFilterChange = (id, tier) => {
    setActivePriceFilter(id);
    setSelectedTier(tier);
  };

  // Filter products based on selected price tier
  const filteredShowcase = displaySarees.filter(s => {
    if (!selectedTier || selectedTier.id === 'all') return true;
    return s.price <= selectedTier.max && s.price >= selectedTier.min;
  });

  return (
    <main className="bg-[#FAF8F5] min-h-screen text-charcoal selection:bg-primary selection:text-white pt-[76px] sm:pt-[82px]">
      
      {/* ── 1. EDITORIAL FULL-SCREEN HERO SECTION ── */}
      <section className="relative w-full h-[88vh] min-h-[580px] max-h-[920px] flex items-center overflow-hidden">
        {/* Editorial Background Image */}
        <img
          src="/images/hero_mehr_annu.jpg"
          alt="Sapna Sarees Editorial Drape"
          className="absolute inset-0 w-full h-full object-cover object-[30%_center] sm:object-center"
        />

        {/* Subtle Vignette & Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-black/35 pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-20 w-full max-w-[1550px] mx-auto px-6 md:px-16 flex flex-col items-end justify-center h-full">
          <div className="w-full max-w-lg lg:max-w-xl text-center flex flex-col items-center animate-fadeIn mr-0 lg:mr-8">
            
            {/* Royal Filigree Monogram Crest */}
            <div className="mb-3">
              <RoyalCrest letter="S" className="w-36 h-36 sm:w-48 sm:h-48 lg:w-56 lg:h-56 mx-auto" />
            </div>

            {/* Editorial Headline */}
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-[42px] font-normal text-white leading-[1.2] tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
              A tale as old as time;
              <br />
              <span className="font-light">The Saree &amp; its adornments</span>
            </h1>

            {/* Italic Subtitle */}
            <p className="font-serif italic text-base sm:text-xl lg:text-2xl text-white/95 mt-2.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
              Made for the women of today
            </p>

            {/* Minimalist CTA Button */}
            <button
              onClick={() => navigateTo('catalog')}
              className="mt-7 py-3.5 px-8 border border-white text-white hover:bg-white hover:text-charcoal text-[11px] font-sans uppercase tracking-[0.24em] font-medium transition-all duration-500 backdrop-blur-xs shadow-lg"
            >
              Shop The Collection →
            </button>
          </div>
        </div>

        {/* Floating WhatsApp Concierge Button (Bottom Right) */}
        <a
          href="https://wa.me/919999999999?text=Hello%20Sapna%20Sarees%20Concierge%2C%20I%20would%20like%20to%20inquire%20about%20your%20handloom%20saree%20collection."
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-50 w-13 h-13 sm:w-14 sm:h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 group"
          title="WhatsApp Concierge"
        >
          <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
          <svg className="w-7 h-7 sm:w-8 sm:h-8 fill-current relative z-10" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
        </a>
      </section>

      {/* ── 2. CATEGORY SLIDER (HORIZONTAL SCROLLABLE SQUARE CARDS) ── */}
      <CategorySlider navigateTo={navigateTo} />

      {/* ── 3. CURATED SHOWCASE & PRICE FILTER PILLS ── */}
      <section className="w-full py-16 md:py-24 px-4 sm:px-6 md:px-10 lg:px-12 bg-[#FAF8F5]">
        <div className="max-w-[1550px] mx-auto">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="text-[10px] font-sans font-semibold tracking-[0.35em] uppercase text-secondary block mb-2">
              Featured Ateliers &bull; Handcrafted Weaves
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-charcoal tracking-tight">
              THE SAPNA SHOWCASE
            </h2>
          </div>

          {/* Minimalist Price Filter Pills */}
          <div className="mb-10 sm:mb-14">
            <PriceFilterPills
              activeFilter={activePriceFilter}
              onSelectFilter={handlePriceFilterChange}
            />
          </div>

          {/* Product Cards Grid (3:4 Portrait Aspect Ratio) */}
          {filteredShowcase.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-6 gap-y-6 md:gap-y-12 animate-fadeIn">
              {filteredShowcase.slice(0, 8).map((saree, idx) => (
                <ProductCard
                  key={saree.id}
                  saree={saree}
                  idx={idx}
                  onSelect={onSelectProduct}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-charcoal-muted">
              <p className="font-serif text-2xl text-charcoal font-light mb-2">No sarees in this price range</p>
              <button
                onClick={() => setActivePriceFilter('all')}
                className="h-12 min-h-[48px] px-8 mt-3 bg-primary text-white text-xs uppercase tracking-luxury font-medium flex items-center justify-center mx-auto"
              >
                View All Sarees
              </button>
            </div>
          )}

          {/* View Full Catalog Link */}
          <div className="text-center mt-12 md:mt-16">
            <button
              onClick={() => navigateTo('catalog')}
              className="h-12 min-h-[48px] px-10 border border-charcoal text-charcoal hover:bg-charcoal hover:text-white font-sans text-xs uppercase tracking-[0.22em] font-medium transition-all shadow-xs inline-flex items-center justify-center"
            >
              Explore Complete Catalog ({displaySarees.length} Weaves) →
            </button>
          </div>
        </div>
      </section>

      {/* ── 4. MOVING EDITORIAL TICKER MARQUEE ── */}
      <div className="w-full bg-[#F4EFEA] border-y border-brandBorder/40 py-4 overflow-hidden select-none">
        <div className="flex whitespace-nowrap gap-12 font-sans text-xs uppercase tracking-[0.28em] text-charcoal-muted font-medium items-center">
          <div className="flex items-center gap-12 animate-marquee">
            <span>✦ Hand Embroidered Pure Silks</span>
            <span>✦ Certified Silk Mark India</span>
            <span>✦ Limited Batch Artisanal Weaves</span>
            <span>✦ Bespoke Bridal Trousseau Consultation</span>
            <span>✦ Complimentary Worldwide Insured Courier</span>
            <span>✦ Hand Embroidered Pure Silks</span>
            <span>✦ Certified Silk Mark India</span>
            <span>✦ Limited Batch Artisanal Weaves</span>
          </div>
        </div>
      </div>

      {/* ── 5. ASYMMETRICAL SPLIT-SCREEN EDITORIAL: "MAKE AN ENTRANCE" & "THE WEDDING EDIT" ── */}
      <EditorialSplitScreen
        onSelectProduct={onSelectProduct}
        navigateTo={navigateTo}
      />

      {/* ── 6. INTERACTIVE "NOT SURE WHAT TO WEAR?" CONVERSATIONAL SECTION ── */}
      <StyleFinderSection
        onSelectProduct={onSelectProduct}
        navigateTo={navigateTo}
      />

      {/* ── 7. ADVANCED PARALLAX EDITORIAL LOOKBOOK ── */}
      <EditorialLookbook navigateTo={navigateTo} />

      {/* ── 8. SOCIAL COMMERCE: "TRENDING ON INSTAGRAM" WITH FLOATING @SAPNANEXT TAG ── */}
      <TrendingInstagram
        onSelectProduct={onSelectProduct}
        navigateTo={navigateTo}
      />

    </main>
  );
}
