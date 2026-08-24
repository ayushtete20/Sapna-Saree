import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const LOOKBOOK_ITEMS = [
  {
    id: '01',
    edition: 'Edition I',
    title: 'The Crimson Kadwa Jaal',
    subtitle: 'Varanasi Master Looms · Pure Katan Silk',
    quote: 'Eighteen days of hand-weaving by generational master weavers.',
    macroImg: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=85',
    fullImg: '/images/ivory_floral_georgette.jpg',
    specs: '24K Gold Plated Zari · Hand-loomed'
  },
  {
    id: '02',
    edition: 'Edition II',
    title: 'Daffodil Luminescence',
    subtitle: 'Micro-Sequins with Gold Resham Lace',
    quote: 'A shimmering cascade celebrating festive twilight soirées.',
    macroImg: '/images/daffodil_yellow_georgette.jpg',
    fullImg: 'https://images.unsplash.com/photo-1583391733981-8498408ee4b6?w=900&q=85',
    specs: 'Viscose Georgette · Lightweight Drape'
  },
  {
    id: '03',
    edition: 'Edition III',
    title: 'Ethereal Sheer Organza',
    subtitle: 'Appliqué Botanicals · Hand-cut Borders',
    quote: 'Whisper-light silks capturing the delicacy of morning mist.',
    macroImg: '/images/ivory_organza_applique.jpg',
    fullImg: '/images/blue_georgette_printed.jpg',
    specs: 'Pure Silk Organza · Scalloped Hem'
  },
  {
    id: '04',
    edition: 'Edition IV',
    title: 'Heirloom Kanjivaram Korvai',
    subtitle: 'Kanchipuram Guilds · Heavy Mulberry Silk',
    quote: 'Centuries of South Indian temple geometry woven into royal silk.',
    macroImg: '/images/blue_georgette_printed.jpg',
    fullImg: '/images/hero_mehr_annu.jpg',
    specs: 'Solid Gold Temple Borders · Heirloom Trousseau'
  }
];

export default function EditorialLookbook({ navigateTo }) {
  const containerRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);

  useEffect(() => {
    // ── 1. LENIS SMOOTH SCROLL FOUNDATION ──
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // ── 2. GSAP ASYMMETRICAL PARALLAX LOGIC (DESKTOP) ──
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop Viewports (>= 768px): Dynamic Parallax Friction
      mm.add('(min-width: 768px)', () => {
        // Asymmetrical shift on the right column (slower / offset movement)
        gsap.to(rightColRef.current, {
          y: () => -(containerRef.current.offsetHeight * 0.18),
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
            invalidateOnRefresh: true
          }
        });

        // Individual item parallax on images
        const leftImages = leftColRef.current.querySelectorAll('.parallax-img');
        leftImages.forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: 'none',
              scrollTrigger: {
                trigger: img.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
              }
            }
          );
        });

        const rightImages = rightColRef.current.querySelectorAll('.parallax-img');
        rightImages.forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: 12 },
            {
              yPercent: -12,
              ease: 'none',
              scrollTrigger: {
                trigger: img.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
              }
            }
          );
        });
      });

      // Mobile Viewports (< 768px): Smooth Fade-in Reveal Fallback
      mm.add('(max-width: 767px)', () => {
        const cards = containerRef.current.querySelectorAll('.editorial-card');
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        });
      });
    }, containerRef);

    // ── 3. CLEANUP ON UNMOUNT ──
    return () => {
      ctx.revert();
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-surface-ivory py-24 md:py-36 px-6 md:px-12 lg:px-16 overflow-hidden border-b border-brandBorder/40 select-none"
    >
      {/* ── EDITORIAL SECTION HEADER ── */}
      <div className="max-w-[1550px] mx-auto mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-brandBorder/40">
        <div>
          <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-secondary block mb-2">
            The Atelier Lookbook &bull; Autumn / Winter 2025
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl font-light text-charcoal tracking-tight leading-[1.1]">
            Texture, Form <span className="italic font-normal text-primary">&amp; Drape</span>
          </h2>
        </div>

        <div className="max-w-md text-right md:text-left">
          <p className="font-sans text-xs md:text-sm text-charcoal-muted font-light leading-relaxed">
            An intimate photographic dialogue between macro weave craftsmanship and full-length silhouette poise.
          </p>
        </div>
      </div>

      {/* ── ASYMMETRICAL 2-COLUMN SPLIT SCREEN ── */}
      <div className="max-w-[1550px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 lg:gap-20 items-start">
        
        {/* ── LEFT COLUMN: MACRO CLOSE-UPS (Standard Scroll Speed) ── */}
        <div ref={leftColRef} className="flex flex-col gap-16 md:gap-28 lg:gap-36">
          {LOOKBOOK_ITEMS.map((item, idx) => (
            <article
              key={`left-${item.id}`}
              className="editorial-card group flex flex-col relative"
            >
              {/* Macro Texture Image Wrapper */}
              <div className="relative w-full aspect-[4/5] bg-surface-cream overflow-hidden border border-brandBorder/30 shadow-luxury">
                <img
                  src={item.macroImg}
                  alt={`${item.title} - Fabric Macro`}
                  className="parallax-img w-full h-[120%] object-cover object-center -mt-[10%] transition-transform duration-1000 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Floating Monogram / Counter Tag */}
                <div className="absolute top-4 left-4 bg-surface-ivory/90 backdrop-blur-md px-3 py-1.5 border border-brandBorder/40">
                  <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-secondary font-medium">
                    {item.edition} &bull; 0{idx + 1}
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-surface-ivory text-[9px] uppercase font-sans tracking-widest px-3 py-1 font-light">
                  Texture &bull; Detail
                </div>
              </div>

              {/* Editorial Caption & Craft Metadata */}
              <div className="pt-6 pb-2">
                <span className="text-[10px] font-sans uppercase tracking-[0.24em] text-secondary font-semibold block mb-1">
                  {item.specs}
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-light text-charcoal group-hover:text-primary transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="font-serif italic text-sm text-charcoal-muted mt-1">
                  "{item.quote}"
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* ── RIGHT COLUMN: FULL CONTEXTUAL LIFESTYLE SHOTS (Parallax Offset Speed) ── */}
        <div ref={rightColRef} className="flex flex-col gap-16 md:gap-28 lg:gap-36 md:pt-24 lg:pt-32">
          {LOOKBOOK_ITEMS.map((item, idx) => (
            <article
              key={`right-${item.id}`}
              className="editorial-card group flex flex-col relative"
            >
              {/* Full Lifestyle Drape Image Wrapper */}
              <div className="relative w-full aspect-[4/5] bg-surface-cream overflow-hidden border border-brandBorder/30 shadow-luxury">
                <img
                  src={item.fullImg}
                  alt={`${item.title} - Full Drape`}
                  className="parallax-img w-full h-[120%] object-cover object-center -mt-[10%] transition-transform duration-1000 group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute top-4 right-4 bg-surface-ivory/90 backdrop-blur-md px-3 py-1.5 border border-brandBorder/40">
                  <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-primary font-medium">
                    Lookbook Drape
                  </span>
                </div>

                {/* Floating "View Saree" CTA Overlay on Hover */}
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <button
                    onClick={() => navigateTo && navigateTo('catalog')}
                    className="py-3 px-8 bg-surface-ivory text-charcoal hover:bg-primary hover:text-surface-ivory text-[10px] font-sans uppercase tracking-[0.22em] font-medium transition-colors shadow-lg"
                  >
                    Explore Drape →
                  </button>
                </div>
              </div>

              {/* Minimal Bottom Metadata */}
              <div className="pt-6 pb-2 flex items-baseline justify-between border-b border-brandBorder/30">
                <div>
                  <h4 className="font-serif text-lg md:text-xl text-charcoal font-light">
                    {item.subtitle}
                  </h4>
                </div>
                <span className="font-sans text-xs text-secondary font-medium tracking-widest">
                  0{idx + 1} / 04
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* ── BOTTOM ATELIER SIGNATURE FOOTNOTE ── */}
      <div className="max-w-4xl mx-auto mt-24 text-center border-t border-brandBorder/40 pt-10">
        <span className="font-script text-2xl text-secondary block mb-1">
          Sapna Sarees by Lavichitra
        </span>
        <p className="font-serif italic text-sm text-charcoal-muted">
          Every piece in this editorial is hand-loomed in limited batches of 3 to 5 sarees worldwide.
        </p>
      </div>
    </section>
  );
}
