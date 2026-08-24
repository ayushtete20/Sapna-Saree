import React, { useState } from 'react';
import { formatPrice } from '../utils/currency';

export default function ProductDetail({ saree, onAddToCart, navigateTo }) {
  const [selectedSize, setSelectedSize] = useState('Standard (5.5m + 0.8m Blouse)');
  const [activeAccordion, setActiveAccordion] = useState('fabric');
  const [selectedColor, setSelectedColor] = useState(0);

  if (!saree) {
    return (
      <div className="pt-32 pb-24 text-center bg-surface-ivory min-h-[60vh] flex flex-col items-center justify-center">
        <p className="font-serif text-2xl text-charcoal mb-4">Saree not found in atelier vault.</p>
        <button
          onClick={() => navigateTo('catalog')}
          className="py-3 px-8 border border-primary text-primary font-sans text-xs uppercase tracking-widest hover:bg-primary hover:text-surface-ivory transition-colors"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  // Multi-angle vertical scrollable image gallery
  const galleryImages = [
    saree.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=85',
    saree.secondaryImage || 'https://images.unsplash.com/photo-1583391733981-8498408ee4b6?w=1200&q=85',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=85&sat=-20',
    'https://images.unsplash.com/photo-1583391733981-8498408ee4b6?w=1200&q=85&hue=20'
  ];

  const colorSwatches = [
    { name: 'Imperial Maroon', hex: '#7A1C2E' },
    { name: 'Antique Gold', hex: '#C8A96E' },
    { name: 'Deep Crimson', hex: '#5C1220' },
    { name: 'Bridal Blush', hex: '#E8C4B8' }
  ];

  const sizeOptions = [
    'Standard (5.5m + 0.8m Blouse)',
    'Custom Stitched Blouse (+₹2,500)',
    'Ready-to-Wear Pre-Pleated Drape'
  ];

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const isSoldOut = saree.stock !== undefined && saree.stock <= 0;
  const waMsg = `Hello Sapna Saree Concierge! 🌸\n\nI would like to enquire about:\n• *Saree*: ${saree.name}\n• *Price*: ₹${formatPrice(saree.price)}\n• *Fabric*: ${saree.fabric || 'Pure Silk'}\n• *Collection*: ${saree.collection || 'Handloom Heritage'}\n• *Tailoring Option*: ${selectedSize}\n• *Colour Option*: ${colorSwatches[selectedColor].name}\n\nPlease share a high-definition video drape and availability for this piece. Thank you!`;

  return (
    <main className="bg-surface-ivory min-h-screen pt-28 md:pt-36 pb-24 md:pb-36 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.2em] text-charcoal-muted mb-8 md:mb-12">
          <button onClick={() => navigateTo('home')} className="hover:text-primary transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigateTo('catalog')} className="hover:text-primary transition-colors">Atelier Catalog</button>
          <span>/</span>
          <span className="text-charcoal font-medium">{saree.name}</span>
        </nav>

        {/* ── EDITORIAL STICKY SPLIT-SCREEN LAYOUT ── */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          
          {/* ── LEFT COLUMN (60% WIDTH): Vertical Scrollable High-Res Lookbook Stack ── */}
          <div className="w-full lg:w-[60%] flex flex-col gap-6 md:gap-10">
            {galleryImages.map((src, index) => (
              <div
                key={index}
                className="relative w-full aspect-[3/4] bg-surface-cream overflow-hidden border border-brandBorder/30 shadow-luxury"
              >
                <img
                  src={src}
                  alt={`${saree.name} - View ${index + 1}`}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-luxury hover:scale-[1.02]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=85';
                  }}
                />
                <span className="absolute bottom-4 right-4 bg-surface-ivory/80 backdrop-blur-sm text-[9px] font-sans uppercase tracking-widest px-2.5 py-1 text-charcoal-muted">
                  0{index + 1} / 04
                </span>
              </div>
            ))}
          </div>

          {/* ── RIGHT COLUMN (40% WIDTH): Sticky Pinned Product Details ── */}
          <div className="w-full lg:w-[40%] lg:sticky lg:top-28 flex flex-col gap-6 pt-2">
            
            {/* Collection & Origin */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-sans uppercase tracking-[0.28em] text-secondary font-medium">
                {saree.collection || 'Silk Mark Certified'} &bull; {saree.origin || 'Varanasi Master Loom'}
              </span>
              {saree.tag && (
                <span className="text-[9px] font-sans uppercase tracking-widest text-primary border border-primary/30 px-2 py-0.5">
                  {saree.tag}
                </span>
              )}
            </div>

            {/* Saree Title (Large High-End Serif) */}
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-charcoal leading-[1.15] tracking-tight">
              {saree.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 pb-4 border-b border-brandBorder/40">
              <span className="font-serif text-2xl md:text-3xl text-primary font-normal">
                ₹{formatPrice(saree.price)}
              </span>
              {saree.originalPrice && saree.originalPrice > saree.price && (
                <span className="font-sans text-sm text-charcoal-muted line-through opacity-70">
                  ₹{formatPrice(saree.originalPrice)}
                </span>
              )}
              <span className="text-[10px] font-sans uppercase tracking-wider text-charcoal-muted ml-auto">
                Taxes Included &bull; Free Insured Delivery
              </span>
            </div>

            {/* Color Variant Palette (Minimal Circles) */}
            <div>
              <span className="block text-[10px] font-sans uppercase tracking-[0.2em] text-charcoal-muted mb-3 font-medium">
                Weave Hue: <span className="text-charcoal">{colorSwatches[selectedColor].name}</span>
              </span>
              <div className="flex items-center gap-3">
                {colorSwatches.map((color, idx) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(idx)}
                    className={`w-7 h-7 rounded-full transition-transform duration-300 flex items-center justify-center p-0.5 border ${
                      selectedColor === idx ? 'border-primary scale-110' : 'border-transparent hover:scale-105'
                    }`}
                    title={color.name}
                  >
                    <span className="w-full h-full rounded-full" style={{ backgroundColor: color.hex }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Tailoring & Size Selector (Clean Square Minimal Buttons) */}
            <div>
              <span className="block text-[10px] font-sans uppercase tracking-[0.2em] text-charcoal-muted mb-3 font-medium">
                Drape &amp; Tailoring Option
              </span>
              <div className="flex flex-col gap-2">
                {sizeOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedSize(opt)}
                    className={`w-full text-left py-3 px-4 text-xs font-sans uppercase tracking-wider border transition-colors flex items-center justify-between ${
                      selectedSize === opt
                        ? 'bg-surface-cream border-primary text-charcoal font-medium'
                        : 'bg-transparent border-brandBorder text-charcoal-muted hover:border-charcoal'
                    }`}
                  >
                    <span>{opt}</span>
                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      selectedSize === opt ? 'border-primary' : 'border-brandBorder'
                    }`}>
                      {selectedSize === opt && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons — Sticky at Bottom on Mobile */}
            <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-surface-ivory/98 backdrop-blur-md border-t border-brandBorder shadow-2xl md:relative md:p-0 md:bg-transparent md:border-0 md:shadow-none flex flex-col sm:flex-row md:flex-col gap-2.5 pt-2">
              <button
                onClick={() => {
                  if (!isSoldOut) onAddToCart({ ...saree, selectedSize });
                }}
                disabled={isSoldOut}
                className={`w-full h-12 min-h-[48px] uppercase font-sans text-xs tracking-luxury font-medium transition-all duration-400 border flex items-center justify-center ${
                  isSoldOut
                    ? 'bg-charcoal-muted text-surface-ivory cursor-not-allowed border-charcoal-muted'
                    : 'bg-primary text-surface-ivory border-primary hover:bg-primary-deep hover:shadow-luxury'
                }`}
              >
                {isSoldOut ? 'Currently Sold Out' : 'Add to Shopping Bag • Buy Now'}
              </button>

              {/* WhatsApp Atelier Concierge Button */}
              <a
                href={`https://wa.me/919999999999?text=${encodeURIComponent(waMsg)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full h-12 min-h-[48px] bg-[#25D366]/10 hover:bg-[#25D366] text-[#0f6b5f] hover:text-white border border-[#25D366]/40 hover:border-[#25D366] text-xs font-sans uppercase tracking-luxury font-medium text-center flex items-center justify-center gap-2 transition-all duration-300 shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                <span>Enquire on WhatsApp</span>
              </a>
            </div>

            {/* Minimalist Disclosures / Accordions */}
            <div className="border-t border-brandBorder/40 mt-4 pt-2 divide-y divide-brandBorder/30">
              
              {/* Accordion 1: Fabric & Craft Specifications */}
              <div className="py-4">
                <button
                  onClick={() => toggleAccordion('fabric')}
                  className="w-full flex items-center justify-between font-serif text-lg text-charcoal text-left"
                >
                  <span>Atelier Weave &amp; Craft Details</span>
                  <span className="text-xs font-sans text-charcoal-muted">
                    {activeAccordion === 'fabric' ? '−' : '+'}
                  </span>
                </button>
                {activeAccordion === 'fabric' && (
                  <div className="pt-3 font-sans text-xs text-charcoal-muted space-y-2 leading-relaxed animate-fadeIn">
                    <p><strong>Fabric:</strong> {saree.fabric || 'Pure 100% Mulberry Katan Silk'}</p>
                    <p><strong>Weave Technique:</strong> Authentic Kadwa Handloom Zari</p>
                    <p><strong>Origin:</strong> {saree.origin || 'Varanasi, Uttar Pradesh, India'}</p>
                    <p><strong>Dimensions:</strong> 5.5 Metres Saree with 0.8 Metre running matching blouse piece.</p>
                    <p><strong>Certification:</strong> Silk Mark India Authenticity Tag included.</p>
                  </div>
                )}
              </div>

              {/* Accordion 2: Shipping & Delivery */}
              <div className="py-4">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between font-serif text-lg text-charcoal text-left"
                >
                  <span>Complimentary Shipping &amp; Returns</span>
                  <span className="text-xs font-sans text-charcoal-muted">
                    {activeAccordion === 'shipping' ? '−' : '+'}
                  </span>
                </button>
                {activeAccordion === 'shipping' && (
                  <div className="pt-3 font-sans text-xs text-charcoal-muted space-y-2 leading-relaxed animate-fadeIn">
                    <p><strong>India Delivery:</strong> 3-5 business days via Blue Dart Insured Air Express.</p>
                    <p><strong>International Shipping:</strong> 5-8 business days worldwide via DHL Express.</p>
                    <p><strong>Packaging:</strong> Arrives in signature Sapna Sarees velvet preservation box with cedar lining.</p>
                    <p><strong>Returns:</strong> 7-day hassle-free exchange on unstitched pieces.</p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Care Instructions */}
              <div className="py-4">
                <button
                  onClick={() => toggleAccordion('care')}
                  className="w-full flex items-center justify-between font-serif text-lg text-charcoal text-left"
                >
                  <span>Heirloom Care &amp; Preservation</span>
                  <span className="text-xs font-sans text-charcoal-muted">
                    {activeAccordion === 'care' ? '−' : '+'}
                  </span>
                </button>
                {activeAccordion === 'care' && (
                  <div className="pt-3 font-sans text-xs text-charcoal-muted space-y-2 leading-relaxed animate-fadeIn">
                    <p>Strictly Dry Clean Only by luxury silk specialists.</p>
                    <p>Store folded in breathable cotton or muslin fabric; avoid plastic wrapping.</p>
                    <p>Iron only on reverse side on low-silk heat setting with a protective cloth.</p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
