import React, { useState } from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({
  sarees = [],
  title = "Curated Atelier",
  subtitle = "Handcrafted pure silk weaves sourced directly from master handlooms across Varanasi, Kanchipuram, and Chanderi.",
  onSelectProduct,
  onAddToCart,
  enableFilterBar = false
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  const categories = ['All', 'Banarasi', 'Kanjivaram', 'Chanderi', 'Organza', 'Bridal'];

  const filtered = sarees.filter(s => {
    if (activeCategory === 'All') return true;
    return (
      s.collection?.toLowerCase().includes(activeCategory.toLowerCase()) ||
      s.name?.toLowerCase().includes(activeCategory.toLowerCase()) ||
      s.fabric?.toLowerCase().includes(activeCategory.toLowerCase())
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <section className="w-full bg-surface-ivory py-20 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* ── EDITORIAL SECTION HEADER WITH GENEROUS WHITESPACE ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8 pb-8 border-b border-brandBorder/40">
          <div className="max-w-2xl">
            <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-secondary block mb-3">
              The Artisan Edit
            </span>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-light text-charcoal tracking-tight leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="font-sans text-xs md:text-sm text-charcoal-muted font-light mt-4 leading-relaxed max-w-xl">
                {subtitle}
              </p>
            )}
          </div>

          {/* Optional Clean Filter / Sort Bar */}
          {enableFilterBar && (
            <div className="flex flex-wrap items-center gap-6 self-start md:self-end">
              <div className="flex items-center gap-2 overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[11px] font-sans uppercase tracking-[0.16em] py-1 px-3 border transition-colors ${
                      activeCategory === cat
                        ? 'bg-primary text-surface-ivory border-primary'
                        : 'bg-transparent text-charcoal border-brandBorder hover:border-primary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border border-brandBorder text-[11px] font-sans uppercase tracking-[0.16em] text-charcoal py-1.5 px-3 focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          )}
        </div>

        {/* ── EDITORIAL PRODUCT GRID (Max 3-4 Cols Desktop, 2 Cols Mobile, Massive Row Gap, Tight Col Gap) ── */}
        {sorted.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-16 md:gap-y-24">
            {sorted.map((saree, idx) => (
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
          <div className="py-24 text-center text-charcoal-muted">
            <p className="font-serif text-2xl text-charcoal font-light">No sarees found in this selection.</p>
            <p className="font-sans text-xs mt-2">Please explore other artisanal categories.</p>
          </div>
        )}
      </div>
    </section>
  );
}
