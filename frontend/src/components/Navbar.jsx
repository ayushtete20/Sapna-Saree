import React, { useState, useEffect } from 'react';
import AnnouncementBar from './AnnouncementBar';
import { DASHBOARD_URL } from '../utils/config';

const NAV_LINKS = [
  { name: 'NEW ARRIVALS', href: 'catalog', hasDropdown: false },
  { name: 'SAREES', href: 'catalog', hasDropdown: true },
  { name: 'KURTIS', href: 'catalog', hasDropdown: false },
  { name: 'WEDDING EDIT', href: 'catalog', hasDropdown: false },
  { name: 'LEHENGAS', href: 'catalog', hasDropdown: false },
  { name: 'BESTSELLERS', href: 'catalog', hasDropdown: false }
];

const SAREE_MEGA_CATEGORIES = [
  {
    title: 'By Weave',
    links: ['Banarasi Katan Silk', 'Kanjivaram Korvai', 'Pure Silk Organza', 'Chanderi Zari', 'Tissue Brocade']
  },
  {
    title: 'By Occasion',
    links: ['Dulhan Bridal Trousseau', 'Wedding Reception', 'Sangeet & Cocktail', 'Haldi & Mehendi', 'Everyday Luxury']
  },
  {
    title: 'Curated Edits',
    links: ['Under ₹1999 Edit', 'Under ₹4999 Edit', 'Heirloom Masterpieces', 'Ready-to-Wear Drapes']
  }
];

export default function Navbar({
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  user,
  onLogout,
  navigateTo,
  isHomePage = true
}) {
  const [scrolled, setScrolled] = useState(false);
  const [sareeDropdownOpen, setSareeDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isStaff = ['OWNER', 'ADMIN', 'EMPLOYEE'].includes(user?.role?.toUpperCase());

  const handleNav = (targetPage, filter = null) => {
    setSareeDropdownOpen(false);
    setMobileMenuOpen(false);
    navigateTo(targetPage);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigateTo('catalog');
      setSearchOpen(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex flex-col">
      {/* ── 1. AUTO-ROTATING BLACK ANNOUNCEMENT TOP BAR ── */}
      <AnnouncementBar />

      {/* ── 2. STICKY LUXURY NAVIGATION HEADER ── */}
      <header
        className={`w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#FAF8F5]/98 backdrop-blur-md shadow-luxury border-b border-brandBorder/40 py-3.5'
            : 'bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-brandBorder/30 py-4.5'
        }`}
      >
        <div className="max-w-[1550px] mx-auto px-5 sm:px-8 md:px-12 flex items-center justify-between">
          
          {/* ── LEFT SECTION: BRAND LOGO ── */}
          <div className="flex items-center gap-6">
            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 text-charcoal hover:text-primary transition-colors"
              aria-label="Open Mobile Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <line x1="3" y1="7" x2="21" y2="7"/>
                <line x1="3" y1="12" x2="16" y2="12"/>
                <line x1="3" y1="17" x2="21" y2="17"/>
              </svg>
            </button>

            {/* Brand Logo: Official Emblem Image + Elegant Typography */}
            <div
              onClick={() => handleNav('home')}
              className="cursor-pointer select-none flex items-center gap-2.5 sm:gap-3 group"
            >
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-[#C8A96E]/70 shadow-xs flex-shrink-0 group-hover:border-primary transition-all duration-300">
                <img
                  src="/images/sapna_saree_logo.jpg"
                  alt="Sapna Saree Logo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-serif text-xl sm:text-2xl lg:text-[24px] font-normal tracking-[0.1em] leading-none text-[#7A1C2E] group-hover:text-[#5C1220] transition-colors">
                  SAPNA
                </span>
                <span className="font-sans text-[8.5px] sm:text-[9.5px] tracking-[0.26em] uppercase text-[#C8A96E] font-semibold mt-0.5">
                  SAREE
                </span>
              </div>
            </div>
          </div>

          {/* ── CENTER SECTION: NAVIGATION LINKS ── */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
            {NAV_LINKS.map((item) => (
              <div
                key={item.name}
                className="relative py-2"
                onMouseEnter={() => item.hasDropdown && setSareeDropdownOpen(true)}
                onMouseLeave={() => item.hasDropdown && setSareeDropdownOpen(false)}
              >
                <button
                  onClick={() => handleNav(item.href)}
                  className="font-sans text-[11.5px] tracking-[0.16em] uppercase font-medium text-charcoal hover:text-primary transition-colors flex items-center gap-1 group"
                >
                  <span className="relative pb-0.5">
                    {item.name}
                    <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-full" />
                  </span>
                  {item.hasDropdown && (
                    <svg className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  )}
                </button>

                {/* Dropdown Mega Menu for Sarees */}
                {item.hasDropdown && sareeDropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[620px] bg-[#FAF8F5] border border-brandBorder shadow-luxury-hover p-8 mt-1 grid grid-cols-3 gap-6 animate-fadeIn text-charcoal rounded-sm">
                    {SAREE_MEGA_CATEGORIES.map((cat, idx) => (
                      <div key={idx} className="flex flex-col gap-3">
                        <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.22em] text-secondary border-b border-brandBorder/40 pb-1.5">
                          {cat.title}
                        </span>
                        <ul className="flex flex-col gap-2">
                          {cat.links.map((link, lIdx) => (
                            <li key={lIdx}>
                              <button
                                onClick={() => handleNav('catalog')}
                                className="font-serif text-[14px] text-charcoal hover:text-primary transition-colors text-left"
                              >
                                {link}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* ── RIGHT SECTION: MINIMALIST SVG ICONS (Search, Heart, User, Cart) ── */}
          <div className="flex items-center gap-4 sm:gap-6 text-charcoal">
            
            {/* 1. Search Icon 🔍 */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1 hover:text-primary transition-colors"
              aria-label="Search Collection"
              title="Search"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>

            {/* 2. Heart (Wishlist) Icon ♡ */}
            <button
              onClick={onOpenWishlist || (() => navigateTo('catalog'))}
              className="p-1 hover:text-primary transition-colors relative"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-sans font-bold flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* 3. User / Account Icon 👤 */}
            {user ? (
              <div className="flex items-center gap-3">
                {isStaff && (
                  <a
                    href={DASHBOARD_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden sm:inline-block text-[10px] font-sans uppercase tracking-widest text-primary border-b border-primary/40 pb-0.5 font-medium"
                  >
                    Portal ↗
                  </a>
                )}
                <button
                  onClick={onLogout}
                  className="p-1 hover:text-primary transition-colors"
                  title={`Sign out (${user.name || user.email})`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="p-1 hover:text-primary transition-colors"
                title="Account / Sign In"
                aria-label="Account"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </button>
            )}

            {/* 4. Cart Icon 🛍️ */}
            <button
              onClick={onOpenCart}
              className="p-1 relative hover:text-primary transition-colors"
              aria-label="Shopping Bag"
              title="Cart"
            >
              <div className="relative">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-sans font-bold flex items-center justify-center shadow-md animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>

          </div>

        </div>

        {/* ── INLINE SEARCH EXPANSION BAR ── */}
        {searchOpen && (
          <div className="max-w-4xl mx-auto px-6 pt-4 pb-2 border-t border-brandBorder/40 mt-3 animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Banarasi, Kanjivaram, Organza, Kurtis, Wedding Edit..."
                className="w-full bg-transparent border-b border-primary/40 py-2 text-sm font-serif text-charcoal placeholder:font-sans placeholder:text-xs placeholder:text-charcoal-muted focus:outline-none focus:border-primary"
                autoFocus
              />
              <div className="absolute right-0 flex items-center gap-3">
                <button
                  type="submit"
                  className="text-[10px] font-sans uppercase tracking-widest text-primary font-medium hover:underline"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-[10px] font-sans uppercase tracking-widest text-charcoal-muted hover:text-charcoal"
                >
                  Close ✕
                </button>
              </div>
            </form>
          </div>
        )}
      </header>

      {/* ── MOBILE MENU DRAWER (Smooth Slide-Out Animation) ── */}
      <div 
        className={`fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div 
          onClick={e => e.stopPropagation()}
          className={`fixed inset-y-0 left-0 max-w-xs w-full bg-[#FAF8F5] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-out transform ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-brandBorder">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-[#C8A96E]/70 shadow-xs">
                  <img
                    src="/images/sapna_saree_logo.jpg"
                    alt="Sapna Saree Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-primary leading-none">SAPNA</h3>
                  <span className="font-sans text-[8px] uppercase tracking-[0.22em] text-secondary font-semibold">SAREE</span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-12 h-12 min-h-[48px] flex items-center justify-center text-charcoal text-xl hover:text-primary"
                aria-label="Close Mobile Menu"
              >
                ✕
              </button>
            </div>

            <nav className="flex flex-col gap-1 mt-6">
              {NAV_LINKS.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNav(item.href)}
                  className="w-full h-12 min-h-[48px] text-left font-serif text-lg text-charcoal hover:text-primary transition-colors flex items-center justify-between px-2 border-b border-brandBorder/20"
                >
                  <span>{item.name}</span>
                  <span className="text-xs font-sans text-secondary">→</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t border-brandBorder flex flex-col gap-3">
            {user ? (
              <button
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                className="w-full h-12 min-h-[48px] bg-surface-cream border border-brandBorder text-xs uppercase tracking-luxury text-charcoal font-medium flex items-center justify-center"
              >
                Sign Out ({user.name || user.email || user.phone})
              </button>
            ) : (
              <button
                onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                className="w-full h-12 min-h-[48px] bg-primary text-white text-xs uppercase tracking-luxury font-medium flex items-center justify-center shadow-luxury"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
