import React from 'react';
import { formatPrice } from '../utils/currency';

export default function OrderConfirmationModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  return (
    <div className="modal-overlay active" style={{ zIndex: 4000 }} onClick={onClose}>
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()} 
        style={{
          padding: '2.5rem',
          maxWidth: '520px',
          width: '90%',
          background: '#FAF6F0',
          border: '1.5px solid #C8A96E',
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
          textAlign: 'center'
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✨</div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#7A1C2E', margin: '0 0 0.3rem' }}>
          Order Confirmed!
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#8C7B72', marginBottom: '1.5rem' }}>
          Thank you for choosing Sapna Sarees by Lavichitra. Your order has been placed and is now live on our atelier system.
        </p>

        <div style={{ background: '#FFFFFF', border: '1px solid rgba(200,169,110,0.3)', padding: '1.25rem', borderRadius: '4px', textAlign: 'left', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #FAF6F0', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ color: '#8C7B72' }}>Order ID:</span>
            <strong style={{ fontFamily: 'monospace', color: '#7A1C2E' }}>{order.id}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #FAF6F0', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ color: '#8C7B72' }}>User ID:</span>
            <strong style={{ fontFamily: 'monospace', color: '#2C2420' }}>{order.userId}</strong>
          </div>

          <div style={{ marginBottom: '0.75rem' }}>
            <span style={{ color: '#8C7B72', display: 'block', marginBottom: '0.3rem' }}>Purchased Items &amp; Product IDs:</span>
            {(order.items || []).map((it, idx) => (
              <div key={idx} style={{ background: '#FAF6F0', padding: '0.5rem', marginBottom: '0.3rem', borderRadius: '3px', fontSize: '0.8rem' }}>
                <div><strong>{it.name}</strong> (x{it.quantity})</div>
                <div style={{ fontSize: '0.7rem', color: '#C8A96E', fontFamily: 'monospace' }}>Product ID: {it.productId}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(200,169,110,0.3)', paddingTop: '0.5rem', fontSize: '1rem' }}>
            <span>Total Value:</span>
            <strong style={{ fontFamily: 'var(--font-serif)', color: '#7A1C2E' }}>₹{formatPrice(order.totalAmount)}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.8rem' }}>
            <span>Live System Status:</span>
            <span style={{ padding: '0.2rem 0.6rem', background: '#fcf3cf', color: '#7d6608', fontWeight: '600', borderRadius: '3px' }}>
              {order.status || 'PENDING'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button 
            onClick={onClose} 
            className="btn btn--gold"
            style={{ padding: '0.75rem 1.5rem' }}
          >
            Continue Shopping
          </button>
          <a 
            href={DASHBOARD_URL} 
            target="_blank" 
            rel="noreferrer"
            className="btn btn--outline-dark"
            style={{ padding: '0.75rem 1.5rem', textDecoration: 'none', display: 'inline-block' }}
          >
            View in Admin Dashboard ↗
          </a>
        </div>
      </div>
    </div>
  );
}
