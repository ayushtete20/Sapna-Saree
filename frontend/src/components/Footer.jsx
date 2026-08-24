import React, { useState } from 'react';
import { DASHBOARD_URL } from '../utils/config';

export default function Footer({ navigateTo }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-charcoal text-surface-ivory pt-24 md:pt-32 pb-12 px-6 md:px-12 border-t border-brandBorder">
      <div className="max-w-7xl mx-auto flex flex-col gap-20">
        
        {/* ── TOP SECTION: NEWSLETTER SIGNUP (Minimalist Bottom-Border-Only Input) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-end pb-16 border-b border-white/10">
          <div>
            <span className="text-[10px] font-sans font-semibold tracking-[0.35em] uppercase text-secondary block mb-3">
              The Atelier Gazette
            </span>
            <h3 className="font-serif text-3xl md:text-5xl font-light text-surface-ivory leading-tight">
              Join the Sapna Inner Circle
            </h3>
            <p className="font-sans text-xs md:text-sm text-charcoal-light font-light mt-3 leading-relaxed max-w-md">
              Receive private salon invites, seasonal lookbook debuts, and complimentary bridal curation consultations.
            </p>
          </div>

          <div>
            {subscribed ? (
              <p className="font-serif text-xl text-secondary animate-fadeIn">
                ✦ Thank you for entering our inner circle. Your welcome dossier is en route.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full bg-transparent border-b border-white/30 focus:border-secondary py-3 text-sm md:text-base font-serif text-surface-ivory placeholder:font-sans placeholder:text-xs placeholder:text-charcoal-light focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-0 text-xs font-sans uppercase tracking-[0.24em] text-secondary hover:text-secondary-light transition-colors pb-1"
                >
                  Subscribe →
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── MIDDLE SECTION: MULTI-COLUMN ATELIER DIRECTORY ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 md:gap-12">
          
          {/* Brand Identity */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#C8A96E]/70 shadow-md">
                <img
                  src="/images/sapna_saree_logo.jpg"
                  alt="Sapna Saree Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-serif text-2xl md:text-3xl text-surface-ivory leading-none">Sapna Saree</h4>
                <span className="font-sans text-[9px] uppercase tracking-[0.26em] text-secondary font-medium">Handloom Heritage</span>
              </div>
            </div>
            <p className="font-sans text-xs text-charcoal-light leading-relaxed font-light max-w-sm mt-1">
              Purveyors of master handloom silks, authentic Varanasi kadwa zari, and heirloom bridal drapes woven across certified generational looms.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-xs text-charcoal-light hover:text-secondary transition-colors">
                Instagram ↗
              </a>
              <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="text-xs text-charcoal-light hover:text-secondary transition-colors">
                WhatsApp Concierge ↗
              </a>
            </div>
          </div>

          {/* Collections */}
          <div className="flex flex-col gap-3">
            <h5 className="font-sans text-[10px] uppercase tracking-[0.26em] text-secondary font-semibold">
              Collections
            </h5>
            <ul className="flex flex-col gap-2 font-sans text-xs text-charcoal-light font-light">
              <li><button onClick={() => navigateTo('catalog')} className="hover:text-surface-ivory transition-colors">Banarasi Katan Silk</button></li>
              <li><button onClick={() => navigateTo('catalog')} className="hover:text-surface-ivory transition-colors">Pure Kanjivaram</button></li>
              <li><button onClick={() => navigateTo('catalog')} className="hover:text-surface-ivory transition-colors">Tissue &amp; Organza</button></li>
              <li><button onClick={() => navigateTo('catalog')} className="hover:text-surface-ivory transition-colors">Chanderi Zari Edit</button></li>
              <li><button onClick={() => navigateTo('catalog')} className="hover:text-surface-ivory transition-colors">Bridal Trousseau</button></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="flex flex-col gap-3">
            <h5 className="font-sans text-[10px] uppercase tracking-[0.26em] text-secondary font-semibold">
              Client Services
            </h5>
            <ul className="flex flex-col gap-2 font-sans text-xs text-charcoal-light font-light">
              <li><a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="hover:text-surface-ivory transition-colors">Bespoke Video Consultation</a></li>
              <li><button onClick={() => navigateTo('catalog')} className="hover:text-surface-ivory transition-colors">Silk Mark Authentication</button></li>
              <li><button onClick={() => navigateTo('catalog')} className="hover:text-surface-ivory transition-colors">Worldwide Shipping Rates</button></li>
              <li><button onClick={() => navigateTo('catalog')} className="hover:text-surface-ivory transition-colors">Care &amp; Preservation Guide</button></li>
            </ul>
          </div>

          {/* Internal Atelier */}
          <div className="flex flex-col gap-3">
            <h5 className="font-sans text-[10px] uppercase tracking-[0.26em] text-secondary font-semibold">
              Atelier
            </h5>
            <ul className="flex flex-col gap-2 font-sans text-xs text-charcoal-light font-light">
              <li><button onClick={() => navigateTo('home')} className="hover:text-surface-ivory transition-colors">Our Weaver Looms</button></li>
              <li><button onClick={() => navigateTo('home')} className="hover:text-surface-ivory transition-colors">Heritage Craft Vault</button></li>
              <li>
                <a
                  href={DASHBOARD_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-secondary hover:text-secondary-light transition-colors font-medium"
                >
                  Internal Staff Portal ↗
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* ── BOTTOM SECTION: COPYRIGHT & PAYMENT SECURITY ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10 text-[11px] font-sans text-charcoal-light tracking-wide">
          <p>
            &copy; {new Date().getFullYear()} Sapna Sarees by Lavichitra. All Worldwide Rights Reserved.
          </p>

          <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-charcoal-light">
            <span>Visa</span>
            <span>&bull;</span>
            <span>Mastercard</span>
            <span>&bull;</span>
            <span>UPI / Netbanking</span>
            <span>&bull;</span>
            <span>DHL Insured Express</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
