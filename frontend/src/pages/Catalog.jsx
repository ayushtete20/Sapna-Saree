import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import PriceFilterPills from '../components/PriceFilterPills';

const CATEGORIES = ['All', 'Wedding Wear', 'Dulhan Collection', 'Party Wear', 'Festive Silks', 'Organza', 'Under ₹1999 Edit'];

export default function Catalog({ sarees = [], onSelectProduct, onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePriceFilter, setActivePriceFilter] = useState('all');
  const [selectedTier, setSelectedTier] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const handlePriceChange = (id, tier) => {
    setActivePriceFilter(id);
    setSelectedTier(tier);
  };

  const filtered = sarees.filter(s => {
    // Category match
    const matchCat = activeCategory === 'All'
      || s.collection?.toLowerCase().includes(activeCategory.toLowerCase())
      || s.name?.toLowerCase().includes(activeCategory.toLowerCase())
      || s.category?.toLowerCase().includes(activeCategory.toLowerCase())
      || s.fabric?.toLowerCase().includes(activeCategory.toLowerCase())
      || s.tag?.toLowerCase().includes(activeCategory.toLowerCase());

    // Price match
    const matchPrice = !selectedTier || selectedTier.id === 'all'
      || (s.price <= selectedTier.max && s.price >= selectedTier.min);

    // Search query match
    const matchSearch = !searchQuery
      || s.name?.toLowerCase().includes(searchQuery.toLowerCase())
      || s.fabric?.toLowerCase().includes(searchQuery.toLowerCase())
      || s.collection?.toLowerCase().includes(searchQuery.toLowerCase())
      || s.origin?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCat && matchPrice && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <main className="bg-[#FAF8F5] min-h-screen pt-32 sm:pt-36 pb-24 md:pb-36">
      
      {/* ── EDITORIAL CATALOG HERO ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center mb-12 md:mb-16">
        <span className="text-[10px] font-sans font-semibold tracking-[0.35em] uppercase text-secondary block mb-3">
          The Atelier Vault &bull; Autumn / Winter 2026
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-charcoal tracking-tight mb-4">
          The Heirloom <span className="italic font-light text-primary">Collection</span>
        </h1>
        <p className="font-sans text-xs md:text-sm text-charcoal-muted max-w-lg mx-auto font-light leading-relaxed">
          Explore handcrafted pure silk sarees, royal kadwa zari brocades, and festive drapes directly from India's generational weaving guilds.
        </p>
      </div>

      {/* ── STICKY CONTROLS & FILTER BAR ── */}
      <div className="sticky top-16 sm:top-20 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-y border-brandBorder/40 py-4 px-6 md:px-12 mb-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          
          {/* Row 1: Category Pills & Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`py-1.5 px-4 text-[11px] font-sans uppercase tracking-[0.16em] whitespace-nowrap transition-all rounded-full border ${
                    activeCategory === cat
                      ? 'bg-charcoal text-white border-charcoal font-medium shadow-xs'
                      : 'bg-white/70 text-charcoal border-charcoal/20 hover:border-charcoal hover:bg-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search & Sort Controls */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="relative flex-1 md:flex-initial">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search fabric or weave..."
                  className="w-full md:w-48 bg-white border border-brandBorder py-1.5 px-3 text-xs font-sans text-charcoal placeholder:text-charcoal-muted focus:outline-none focus:border-primary rounded-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-charcoal-muted hover:text-charcoal"
                  >
                    ✕
                  </button>
                )}
              </div>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-white border border-brandBorder text-[11px] font-sans uppercase tracking-wider text-charcoal py-1.5 px-3 focus:outline-none focus:border-primary cursor-pointer rounded-xs"
              >
                <option value="default">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name A–Z</option>
              </select>

              <span className="text-[11px] font-sans uppercase tracking-widest text-charcoal-muted hidden sm:inline">
                {sorted.length} {sorted.length === 1 ? 'Piece' : 'Pieces'}
              </span>
            </div>

          </div>

          {/* Row 2: Price Filter Pills */}
          <div className="pt-2 border-t border-brandBorder/30">
            <PriceFilterPills
              activeFilter={activePriceFilter}
              onSelectFilter={handlePriceChange}
            />
          </div>

        </div>
      </div>

      {/* ── PRODUCT GRID CONTAINER ── */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-12">
        {sorted.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-6 gap-y-6 md:gap-y-12">
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
            <p className="font-serif text-3xl text-charcoal font-light mb-3">No matching weaves found</p>
            <p className="font-sans text-xs max-w-sm mx-auto mb-6">
              We couldn't find any sarees matching your selected filters. Try clearing your filters or search terms.
            </p>
            <button
              onClick={() => { setActiveCategory('All'); setActivePriceFilter('all'); setSelectedTier(null); setSearchQuery(''); }}
              className="h-12 min-h-[48px] px-8 bg-charcoal text-white text-xs uppercase tracking-luxury font-medium hover:bg-primary transition-colors flex items-center justify-center mx-auto"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

    </main>
  );
}
