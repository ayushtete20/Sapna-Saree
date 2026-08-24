import React, { useState } from 'react';
import { formatPrice } from '../utils/currency';

export default function ProductCard({ saree, idx = 0, onSelect, onAddToCart }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);

  const primaryImg = saree.image || '/images/ivory_floral_georgette.jpg';
  const secondaryImg = saree.secondaryImage || '/images/ivory_organza_applique.jpg';

  const isSoldOut = saree.stock !== undefined && saree.stock <= 0;
  
  // Calculate discount percentage if not explicitly provided
  const originalPrice = saree.originalPrice || (saree.price ? Math.round(Number(saree.price) * 1.3) : null);
  const discountText = saree.discount || (originalPrice && originalPrice > saree.price 
    ? `${Math.round(((originalPrice - saree.price) / originalPrice) * 100)}% OFF` 
    : null);

  const handleAdd = (e) => {
    e.stopPropagation();
    if (isSoldOut || adding) return;
    setAdding(true);
    if (onAddToCart) {
      onAddToCart(saree);
    }
    setTimeout(() => {
      setAdding(false);
    }, 1200);
  };

  // Personalized WhatsApp Enquiry Message
  const waEnquiryMsg = `Hello Sapna Saree Concierge! 🌸\n\nI would like to enquire about this saree:\n• *Name*: ${saree.name}\n• *Price*: ₹${formatPrice(saree.price)}\n• *Fabric*: ${saree.fabric || 'Pure Silk'}\n• *Collection*: ${saree.collection || 'Handloom Heritage'}\n\nPlease share more photos, video drape, and availability details. Thank you!`;
  const waEnquiryUrl = `https://wa.me/919999999999?text=${encodeURIComponent(waEnquiryMsg)}`;

  return (
    <article
      className="group relative flex flex-col cursor-pointer select-none bg-white rounded-sm overflow-hidden border border-brandBorder/30 hover:border-brandBorder/80 transition-all duration-400 hover:shadow-luxury"
      onClick={() => onSelect(saree.id)}
    >
      {/* ── 1. STRICT PORTRAIT IMAGE CONTAINER (3:4 ASPECT RATIO) ── */}
      <div className="relative w-full aspect-[3/4] bg-[#F4EFEA] overflow-hidden">
        
        {/* Primary Image */}
        <img
          src={primaryImg}
          alt={saree.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:opacity-0 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=85';
          }}
        />

        {/* Secondary Hover Image Drape */}
        <img
          src={secondaryImg}
          alt={`${saree.name} - Drape View`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-0 scale-100 transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:opacity-100 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1583391733981-8498408ee4b6?w=900&q=85';
          }}
        />

        {/* ── SUBTLE TOP-LEFT BADGE ── */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-[#FAF8F5]/95 backdrop-blur-md text-charcoal border border-brandBorder/60 px-2.5 py-1 text-[9px] font-sans tracking-[0.2em] uppercase font-semibold shadow-xs">
            {saree.tag || 'BESTSELLER'}
          </span>
        </div>

        {/* ── TOP-RIGHT FLOATING HEART ICON ── */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setWishlisted(!wishlisted);
          }}
          className="absolute top-2.5 right-2.5 w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center text-charcoal hover:text-red-600 transition-all duration-300 z-10 shadow-sm hover:scale-110 active:scale-95"
          aria-label="Save to Wishlist"
        >
          {wishlisted ? (
            <svg className="w-4 h-4 fill-red-600 stroke-red-600 transition-transform scale-110" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4 stroke-charcoal fill-none stroke-[1.75] hover:stroke-red-600 transition-colors" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          )}
        </button>

        {/* Quick View Tag on Hover */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="bg-black/75 backdrop-blur-md text-white text-[9.5px] uppercase font-sans tracking-widest px-3 py-1 font-light rounded-xs">
            Quick Drape View
          </span>
        </div>
      </div>

      {/* ── 2. METADATA CONTAINER ── */}
      <div className="p-3.5 flex flex-col justify-between flex-grow gap-2">
        <div>
          <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#8C7B72] font-semibold block mb-0.5 truncate">
            {saree.collection || 'Handloom Heritage'}
          </span>
          <h3 className="font-serif text-sm sm:text-base text-charcoal font-medium line-clamp-1 leading-snug group-hover:text-primary transition-colors">
            {saree.name}
          </h3>
          <p className="text-[11px] font-sans text-charcoal-muted line-clamp-1 mt-0.5">
            {saree.fabric || 'Pure Katan Silk'}
          </p>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="font-sans font-semibold text-sm sm:text-base text-charcoal">
              ₹{formatPrice(saree.price)}
            </span>
            
            {originalPrice && originalPrice > saree.price && (
              <span className="font-sans text-xs text-charcoal-muted line-through opacity-75">
                ₹{formatPrice(originalPrice)}
              </span>
            )}

            {discountText && (
              <span className="text-[10px] font-sans font-semibold tracking-wider text-[#7A1C2E] bg-[#FAF8F5] border border-[#7A1C2E]/20 px-1.5 py-0.5 rounded-xs">
                {discountText}
              </span>
            )}
          </div>
        </div>

        {/* ── 3. DUAL ACTION BUTTONS (ADD TO BAG + WHATSAPP ENQUIRY) ── */}
        <div className="flex flex-col gap-1.5 mt-1">
          {/* Solid Add to Bag Button */}
          <button
            onClick={handleAdd}
            disabled={isSoldOut}
            className={`w-full h-11 min-h-[44px] px-3 text-[11px] sm:text-[11.5px] font-sans font-medium tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 select-none active:scale-[0.98] rounded-xs ${
              isSoldOut
                ? 'bg-charcoal-muted text-white cursor-not-allowed'
                : adding
                ? 'bg-[#2E7D32] text-white shadow-sm'
                : 'bg-charcoal hover:bg-primary text-white shadow-xs'
            }`}
          >
            {adding ? (
              <>
                <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Added to bag</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <span>{isSoldOut ? 'Sold Out' : 'Add to bag'}</span>
              </>
            )}
          </button>

          {/* Dedicated WhatsApp Enquiry Button with Pre-filled Text Message */}
          <a
            href={waEnquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full h-11 min-h-[44px] px-3 bg-[#25D366]/10 hover:bg-[#25D366] text-[#0f6b5f] hover:text-white border border-[#25D366]/35 hover:border-[#25D366] text-[10.5px] sm:text-[11px] font-sans font-medium tracking-wide transition-all duration-300 flex items-center justify-center gap-1.5 rounded-xs group/wa shadow-2xs text-center"
            title="Enquire on WhatsApp with details"
          >
            <svg className="w-3.5 h-3.5 fill-[#25D366] group-hover/wa:fill-white transition-colors" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            <span>Enquire on WhatsApp</span>
          </a>
        </div>
      </div>
    </article>
  );
}
