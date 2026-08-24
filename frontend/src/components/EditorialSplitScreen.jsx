import React from 'react';
import { formatPrice } from '../utils/currency';

export default function EditorialSplitScreen({ onSelectProduct, navigateTo }) {
  const featuredLook = {
    id: 'prod_mehr_01',
    edition: 'LOOKBOOK NO. 07',
    tag: 'THE WEDDING EDIT',
    title: 'MAKE AN ENTRANCE',
    subtitle: 'Ivory Georgette Digital Print & Hand-Resham Threadwork',
    story: 'Woven for grand entries and timeless wedding celebrations. An ethereal dialogue between hand-cut floral resham borders, subtle metallic sheen, and effortless fluid drape.',
    specs: [
      { label: 'Craft Origin', value: 'Varanasi Artisanal Loom' },
      { label: 'Fabric Composition', value: 'Pure 100% Viscose Georgette' },
      { label: 'Embellishment', value: 'Micro-Sequins & Scallop Resham' },
      { label: 'Drape Type', value: 'Fluid Festive Silhouette' }
    ],
    price: 24585,
    originalPrice: 32500,
    mainImage: '/images/ivory_floral_georgette.jpg',
    macroImage: '/images/ivory_organza_applique.jpg'
  };

  return (
    <section className="w-full py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-[#FAF8F5] border-b border-brandBorder/30 overflow-hidden">
      <div className="max-w-[1550px] mx-auto">
        
        {/* Section Pill Subheading */}
        <div className="text-center mb-10 md:mb-16">
          <span className="text-[10px] font-sans font-semibold tracking-[0.35em] uppercase text-secondary block mb-2">
            Autumn / Winter 2026 Bridal Capsule
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-charcoal tracking-tight">
            THE WEDDING EDIT
          </h2>
        </div>

        {/* ── ASYMMETRICAL SPLIT-SCREEN LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* ── LEFT SIDE (7 COLUMNS): MASSIVE EDITORIAL IMAGE & DETAIL PREVIEW ── */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] bg-[#F4EFEA] overflow-hidden rounded-sm border border-brandBorder/40 shadow-luxury group">
              <img
                src={featuredLook.mainImage}
                alt="Editorial Drape - Make An Entrance"
                className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />

              {/* Floating Editorial Badge */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 border border-brandBorder/60 shadow-sm">
                <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-primary font-semibold">
                  {featuredLook.edition}
                </span>
              </div>

              {/* Inset Macro Texture Inset on Desktop */}
              <div className="absolute bottom-6 right-6 w-36 h-44 sm:w-44 sm:h-52 bg-white p-1.5 shadow-2xl border border-brandBorder/60 rounded-xs hidden sm:block">
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={featuredLook.macroImage}
                    alt="Fabric Macro Texture"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[8px] uppercase tracking-widest px-1.5 py-0.5">
                    Macro Detail
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDE (5 COLUMNS): STICKY EDITORIAL PRODUCT DETAILS & CTA ── */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col gap-6 pt-2">
            
            <div>
              <span className="text-[11px] font-sans uppercase tracking-[0.28em] text-secondary font-semibold block mb-2">
                {featuredLook.tag}
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-charcoal leading-[1.15] tracking-tight">
                MAKE AN ENTRANCE
              </h3>
              <p className="font-serif italic text-base sm:text-lg text-charcoal/85 mt-2">
                {featuredLook.subtitle}
              </p>
            </div>

            <p className="font-sans text-xs sm:text-sm text-charcoal-muted leading-relaxed font-light">
              {featuredLook.story}
            </p>

            {/* Weave Specifications Grid */}
            <div className="grid grid-cols-2 gap-3 py-4 border-y border-brandBorder/40">
              {featuredLook.specs.map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-[10px] font-sans uppercase tracking-wider text-charcoal-muted font-medium">
                    {item.label}
                  </span>
                  <span className="text-xs font-serif text-charcoal mt-0.5">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing Details */}
            <div className="flex items-baseline gap-3">
              <span className="font-sans text-2xl sm:text-3xl font-medium text-charcoal">
                ₹{formatPrice(featuredLook.price)}
              </span>
              <span className="font-sans text-sm text-charcoal-muted line-through opacity-75">
                ₹{formatPrice(featuredLook.originalPrice)}
              </span>
              <span className="text-xs font-sans uppercase tracking-wider text-primary font-semibold ml-auto bg-primary/10 px-2.5 py-1 rounded-xs">
                Limited Batch
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  if (onSelectProduct) onSelectProduct(featuredLook.id);
                  if (navigateTo) navigateTo('detail', featuredLook.id);
                }}
                className="flex-1 py-4 px-6 bg-charcoal hover:bg-primary text-white font-sans text-xs uppercase tracking-luxury font-medium transition-all duration-300 shadow-sm text-center"
              >
                Shop The Wedding Edit
              </button>
              <button
                onClick={() => navigateTo && navigateTo('catalog')}
                className="py-4 px-6 border border-charcoal/30 hover:border-charcoal bg-white/60 text-charcoal font-sans text-xs uppercase tracking-luxury font-medium transition-colors text-center"
              >
                View Full Lookbook
              </button>
            </div>

            {/* WhatsApp Concierge Note */}
            <p className="text-[11px] font-sans text-charcoal-muted flex items-center gap-2 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>Personal bridal stylists available for live video drapes.</span>
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}
