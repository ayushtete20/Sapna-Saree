import React from 'react';
import { INSTAGRAM_POSTS } from '../utils/demoData';

export default function TrendingInstagram({ onSelectProduct, navigateTo }) {
  return (
    <section className="w-full py-20 md:py-28 px-4 sm:px-6 md:px-12 bg-[#FAF8F5] border-b border-brandBorder/30">
      <div className="max-w-[1550px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="text-[10px] font-sans font-semibold tracking-[0.35em] uppercase text-secondary block mb-2">
            Social Commerce &bull; As Seen On You
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-charcoal tracking-tight">
            TRENDING ON INSTAGRAM
          </h2>
          <p className="font-sans text-xs sm:text-sm text-charcoal-muted mt-3 font-light">
            Tag <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-primary font-medium hover:underline">@sapnanext</a> on your celebratory moments to join our global patron gallery.
          </p>
        </div>

        {/* 5-Column / Responsive Square Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5">
          {INSTAGRAM_POSTS.map((post) => (
            <div
              key={post.id}
              onClick={() => navigateTo && navigateTo('catalog')}
              className="group relative aspect-square bg-[#F4EFEA] overflow-hidden rounded-sm border border-brandBorder/40 cursor-pointer shadow-sm"
            >
              {/* Product Image */}
              <img
                src={post.image}
                alt={post.caption}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80';
                }}
              />

              {/* ── FLOATING @SAPNANEXT INSTAGRAM HANDLE TAG (Top Left) ── */}
              <div className="absolute top-2.5 left-2.5 z-20">
                <span className="inline-flex items-center gap-1.5 bg-black/75 backdrop-blur-md text-white text-[9.5px] font-sans tracking-wider px-2.5 py-1 rounded-xs border border-white/20 shadow-sm">
                  <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>{post.handle}</span>
                </span>
              </div>

              {/* Hover Dark Overlay with Details & CTA */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-400 p-4 flex flex-col justify-between text-white z-10">
                <div className="flex items-center justify-end">
                  <span className="text-[10px] font-sans flex items-center gap-1 opacity-90">
                    ♥ {post.likes}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <p className="font-serif italic text-xs leading-tight line-clamp-2 text-white/95">
                    "{post.caption}"
                  </p>
                  <div className="pt-2 border-t border-white/20 flex items-center justify-between">
                    <div>
                      <p className="font-sans text-[11px] font-medium text-white truncate max-w-[120px]">
                        {post.productName}
                      </p>
                      <p className="font-sans text-[10px] text-secondary-light">
                        {post.price}
                      </p>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-sans font-medium bg-white text-charcoal px-2 py-1 rounded-xs">
                      Shop →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Instagram CTA */}
        <div className="text-center mt-10">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 py-3 px-8 border border-charcoal/30 hover:border-primary bg-white text-charcoal hover:text-primary text-[11px] font-sans uppercase tracking-[0.2em] font-medium transition-all shadow-xs"
          >
            <span>Follow @sapnanext on Instagram</span>
            <span>↗</span>
          </a>
        </div>

      </div>
    </section>
  );
}
