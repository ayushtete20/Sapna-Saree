import React from 'react';
import { formatPrice } from '../utils/currency';

export default function SareeCard({ saree, onSelect, onAddToCart }) {
  return (
    <article className="product-card">
      <div 
        className="product-card__swatch" 
        style={{ background: saree.hue || '#6B1E2E' }}
        onClick={() => onSelect(saree.id)}
      >
        <img 
          src={saree.image || '/images/banarasi_red.png'} 
          alt={saree.name} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80';
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
        />
        <span className="product-card__tag">{saree.tag}</span>
        {saree.stock !== undefined && saree.stock <= 0 && (
          <span style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: '#D32F2F', color: '#FFF', padding: '0.2rem 0.5rem', fontSize: '0.65rem', fontWeight: 700, borderRadius: '2px', textTransform: 'uppercase' }}>
            Out of Stock
          </span>
        )}

        <div className="product-card__hover">
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={(e) => { e.stopPropagation(); onSelect(saree.id); }}
              className="product-card__wa-btn" 
              style={{ flex: 1, background: 'var(--c-ink)', borderColor: 'var(--c-ink)' }}
            >
              Details
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); if (saree.stock > 0 || saree.stock === undefined) onAddToCart(saree); }}
              disabled={saree.stock !== undefined && saree.stock <= 0}
              className="product-card__wa-btn" 
              style={{ flex: 1, background: (saree.stock !== undefined && saree.stock <= 0) ? '#888' : 'var(--c-gold)', borderColor: (saree.stock !== undefined && saree.stock <= 0) ? '#888' : 'var(--c-gold)', cursor: (saree.stock !== undefined && saree.stock <= 0) ? 'not-allowed' : 'pointer' }}
            >
              {saree.stock !== undefined && saree.stock <= 0 ? 'Sold Out' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      <div className="product-card__info" onClick={() => onSelect(saree.id)} style={{ cursor: 'pointer' }}>
        <div>
          <p className="product-card__fabric">{saree.fabric}</p>
          <h3 className="product-card__name">{saree.name}</h3>
        </div>
        <p className="product-card__price"><sup>&#8377;</sup>{formatPrice(saree.price)}</p>
      </div>
    </article>
  );
}
