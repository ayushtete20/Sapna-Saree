import React from 'react';

const PRICE_TIERS = [
  { id: 'all', label: 'All Collections', max: Infinity, min: 0 },
  { id: 'under-799', label: 'Under ₹799', max: 799, min: 0 },
  { id: 'under-1999', label: 'Under ₹1999', max: 1999, min: 0 },
  { id: 'under-2999', label: 'Under ₹2999', max: 2999, min: 0 },
  { id: 'under-4999', label: 'Under ₹4999', max: 4999, min: 0 },
  { id: 'luxury', label: 'Luxury ₹9999+', max: Infinity, min: 9999 }
];

export default function PriceFilterPills({ activeFilter = 'all', onSelectFilter }) {
  return (
    <div className="w-full flex items-center justify-center overflow-x-auto scrollbar-none py-4 px-2 select-none">
      <div className="flex items-center gap-2.5 sm:gap-3.5 flex-wrap justify-center">
        {PRICE_TIERS.map((tier) => {
          const isActive = activeFilter === tier.id;
          return (
            <button
              key={tier.id}
              onClick={() => onSelectFilter(tier.id, tier)}
              className={`rounded-full py-2 px-5 sm:px-6 text-[11px] sm:text-xs font-sans tracking-[0.14em] uppercase transition-all duration-300 border ${
                isActive
                  ? 'bg-charcoal text-white border-charcoal shadow-sm font-medium scale-105'
                  : 'bg-white/70 text-charcoal border-charcoal/20 hover:border-charcoal hover:bg-white'
              }`}
            >
              {tier.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
