import React, { useState } from 'react';
import { CONVERSATIONAL_TAGS, DEMO_SAREES } from '../utils/demoData';
import { formatPrice } from '../utils/currency';

export default function StyleFinderSection({ onSelectProduct, navigateTo }) {
  const [activeTagIndex, setActiveTagIndex] = useState(0);
  const [isStyleFinderModalOpen, setIsStyleFinderModalOpen] = useState(false);

  const currentTag = CONVERSATIONAL_TAGS[activeTagIndex];

  // Find matching sarees for this tag
  const matchingSarees = DEMO_SAREES.filter(s => 
    s.useCases && s.useCases.includes(currentTag.label)
  ).slice(0, 3);

  // WhatsApp concierge pre-filled message
  const whatsappUrl = `https://wa.me/919999999999?text=${encodeURIComponent(
    `Hello Sapna Sarees Concierge! I need styling guidance for: "${currentTag.label}". Could you please share recommendations and video drapes?`
  )}`;

  return (
    <section className="w-full py-20 md:py-28 px-4 sm:px-6 md:px-12 bg-[#F4EFEA] border-b border-brandBorder/40 select-none">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        
        {/* Editorial Subheading */}
        <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.35em] uppercase text-secondary block mb-3">
          Conversational Personal Stylist
        </span>

        {/* Large Centered Serif Heading */}
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-charcoal tracking-tight mb-3">
          NOT SURE WHAT TO WEAR?
        </h2>

        {/* Subtitle */}
        <p className="font-sans text-xs sm:text-sm text-charcoal-muted max-w-lg mx-auto font-light leading-relaxed mb-8 sm:mb-10">
          Select what best describes your occasion or budget, and our atelier stylists will instantly curate the ideal handloom weave for you.
        </p>

        {/* ── CONVERSATIONAL TAG CLOUD ── */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-3xl mb-8">
          {CONVERSATIONAL_TAGS.map((item, idx) => {
            const isSelected = activeTagIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveTagIndex(idx)}
                className={`py-2.5 px-4 sm:px-5 rounded-full text-xs sm:text-[13px] font-sans tracking-wide transition-all duration-300 border ${
                  isSelected
                    ? 'bg-charcoal text-white border-charcoal shadow-md scale-105 font-medium'
                    : 'bg-white/80 text-charcoal border-charcoal/20 hover:border-charcoal hover:bg-white'
                }`}
              >
                ✦ {item.label}
              </button>
            );
          })}
        </div>

        {/* ── DYNAMIC RECOMMENDATION DOSSIER CARD ── */}
        <div className="w-full bg-white/90 backdrop-blur-sm border border-brandBorder/60 p-6 sm:p-8 rounded-sm shadow-luxury mb-10 text-left animate-fadeIn">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-brandBorder/30">
            <div>
              <span className="text-[10px] font-sans uppercase tracking-[0.24em] text-primary font-semibold block">
                Atelier Recommendation
              </span>
              <h4 className="font-serif text-xl sm:text-2xl text-charcoal font-normal mt-0.5">
                "{currentTag.label}"
              </h4>
            </div>
            <span className="text-xs font-sans text-charcoal-muted italic">
              {currentTag.advice}
            </span>
          </div>

          {/* Quick matching product cards preview */}
          {matchingSarees.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
              {matchingSarees.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    if (onSelectProduct) onSelectProduct(s.id);
                    if (navigateTo) navigateTo('detail', s.id);
                  }}
                  className="flex items-center gap-3 p-2.5 bg-[#FAF8F5] border border-brandBorder/30 rounded-xs hover:border-primary cursor-pointer transition-colors group"
                >
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-14 h-16 object-cover rounded-xs"
                  />
                  <div className="overflow-hidden">
                    <p className="font-sans text-xs text-charcoal font-medium truncate group-hover:text-primary transition-colors">
                      {s.name}
                    </p>
                    <p className="font-sans text-[11px] text-charcoal-muted mt-0.5">
                      ₹{formatPrice(s.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── SIDE-BY-SIDE PRIMARY CTAS ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          
          {/* Solid Dark "FIND MY LOOK" Button */}
          <button
            onClick={() => {
              if (navigateTo) navigateTo('catalog');
            }}
            className="w-full sm:w-1/2 py-4 px-6 bg-charcoal hover:bg-primary text-white font-sans text-xs uppercase tracking-luxury font-medium transition-all duration-300 shadow-md text-center"
          >
            FIND MY LOOK
          </button>

          {/* Transparent, Outlined "ASK ON WHATSAPP" Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-1/2 py-4 px-6 bg-transparent border border-charcoal/60 hover:border-primary text-charcoal hover:text-primary font-sans text-xs uppercase tracking-luxury font-medium transition-all duration-300 text-center flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 fill-[#25D366]" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            <span>ASK ON WHATSAPP</span>
          </a>

        </div>

      </div>
    </section>
  );
}
