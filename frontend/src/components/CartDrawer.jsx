import React from 'react';
import { formatPrice } from '../utils/currency';

export default function CartDrawer({
  isOpen,
  onClose,
  cart = [],
  updateQuantity,
  removeItem,
  onCheckout,
  user
}) {
  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, it) => sum + (it.price * it.quantity), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-surface-ivory shadow-2xl flex flex-col justify-between border-l border-brandBorder animate-fadeIn">
          
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-brandBorder/40 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-2xl text-charcoal font-normal">Shopping Bag</h3>
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-secondary font-medium">
                {cart.length} {cart.length === 1 ? 'Handloom Piece' : 'Handloom Pieces'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-charcoal hover:text-primary transition-colors text-lg p-2"
              aria-label="Close Bag"
            >
              ✕
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 divide-y divide-brandBorder/30">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} className="py-6 flex gap-4 items-start first:pt-0 last:pb-0">
                  {/* Square Aspect Item Image */}
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&q=80'}
                    alt={item.name}
                    className="w-20 h-24 object-cover border border-brandBorder/40 bg-surface-cream flex-shrink-0"
                  />

                  {/* Item Metadata */}
                  <div className="flex-1 flex flex-col justify-between min-h-[96px]">
                    <div>
                      <h4 className="font-serif text-base text-charcoal font-normal leading-snug line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[10px] font-sans uppercase tracking-wider text-charcoal-muted mt-0.5">
                        {item.fabric || 'Pure Silk Handloom'}
                      </p>
                      {item.selectedSize && (
                        <p className="text-[10px] font-sans text-secondary mt-0.5">
                          {item.selectedSize}
                        </p>
                      )}
                      <p className="font-serif text-sm text-primary font-medium mt-1">
                        ₹{formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex items-center justify-between mt-3 pt-2">
                      <div className="flex items-center border border-brandBorder">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-0.5 text-xs text-charcoal hover:bg-surface-cream transition-colors"
                        >
                          −
                        </button>
                        <span className="px-3 py-0.5 text-xs font-sans text-charcoal font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-0.5 text-xs text-charcoal hover:bg-surface-cream transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[10px] font-sans uppercase tracking-widest text-charcoal-muted hover:text-primary transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-charcoal-muted">
                <p className="font-serif text-2xl text-charcoal font-light mb-2">Your Bag is Empty</p>
                <p className="font-sans text-xs">Explore our master looms and curated bridal edits.</p>
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 md:p-8 bg-surface-cream/70 border-t border-brandBorder flex flex-col gap-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-sans uppercase tracking-[0.2em] text-charcoal-muted">
                  Subtotal
                </span>
                <span className="font-serif text-2xl text-primary font-normal">
                  ₹{formatPrice(totalAmount)}
                </span>
              </div>

              <p className="text-[10px] font-sans text-charcoal-muted">
                Taxes, customs &amp; worldwide insured shipping calculated at checkout.
              </p>

              <button
                onClick={onCheckout}
                className="w-full py-4 bg-primary text-surface-ivory uppercase font-sans text-xs tracking-luxury font-medium hover:bg-primary-deep transition-all duration-400 shadow-luxury"
              >
                Proceed to Checkout →
              </button>

              <div className="flex items-center justify-center gap-2 text-[9px] font-sans uppercase tracking-widest text-charcoal-muted pt-1">
                <span>🔒 256-Bit SSL Encrypted</span>
                <span>&bull;</span>
                <span>Silk Mark Authenticated</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
