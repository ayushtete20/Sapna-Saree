import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user, isOwner, isAdmin, isEmployee, canManageCatalog, canManageOrders } = useAuth();

  const getSectionTitle = () => {
    if (isOwner) return '👑 Executive Owner Suite';
    if (isAdmin) return '🛠️ Operations Management';
    return '👗 Staff Atelier Desk';
  };

  const navItem = (id, icon, label) => {
    const isActive = activeTab === id;
    return (
      <button
        key={id}
        onClick={() => setActiveTab(id)}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '11px 14px',
          background: isActive ? 'linear-gradient(135deg, #7A1C2E, #5C1220)' : 'transparent',
          color: isActive ? '#FAF8F5' : 'rgba(250,248,245,0.75)',
          border: isActive ? '1px solid rgba(200,169,110,0.5)' : '1px solid transparent',
          borderRadius: '2px',
          cursor: 'pointer',
          fontFamily: "'Montserrat', 'Jost', sans-serif",
          fontWeight: isActive ? 600 : 400,
          fontSize: '12px',
          letterSpacing: '0.04em',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          transition: 'all 0.2s ease',
          boxShadow: isActive ? '0 4px 12px rgba(122,28,46,0.35)' : 'none'
        }}
        onMouseEnter={e => {
          if (!isActive) {
            e.currentTarget.style.background = 'rgba(200,169,110,0.12)';
            e.currentTarget.style.color = '#E8D5A3';
          }
        }}
        onMouseLeave={e => {
          if (!isActive) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'rgba(250,248,245,0.75)';
          }
        }}
      >
        <span style={{ fontSize: '14px' }}>{icon}</span>
        <span>{label}</span>
      </button>
    );
  };

  return (
    <aside style={{
      width: '270px',
      background: 'linear-gradient(180deg, #18140F 0%, #241D17 100%)',
      color: '#FAF8F5',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '1.75rem 1.25rem',
      borderRight: '1px solid rgba(200,169,110,0.25)',
      boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
      flexShrink: 0
    }}>
      {/* Brand Header */}
      <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid rgba(200,169,110,0.2)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid #C8A96E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(200,169,110,0.15)',
            color: '#E8D5A3',
            fontSize: '14px'
          }}>
            ✦
          </div>
          <div>
            <h2 style={{
              fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
              fontSize: '1.25rem',
              color: '#FAF8F5',
              margin: 0,
              fontWeight: 500,
              lineHeight: 1.1
            }}>
              Sapna Sarees
            </h2>
            <span style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: '#C8A96E',
              display: 'block'
            }}>
              Atelier Management
            </span>
          </div>
        </div>
      </div>

      {/* Role / Section Heading */}
      <div style={{
        fontSize: '9px',
        textTransform: 'uppercase',
        letterSpacing: '0.16em',
        color: '#C8A96E',
        marginBottom: '0.85rem',
        paddingLeft: '0.5rem',
        fontWeight: 600
      }}>
        {getSectionTitle()}
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
        {navItem('overview', '🏛️', 'Overview Command')}

        {isOwner && (
          <>
            {navItem('financials', '💰', 'Revenue & Financials')}
            {navItem('analytics', '📈', 'Executive Analytics')}
            {navItem('weaver', '🧵', 'Weaver Communities')}
            {navItem('orders', '📦', 'Orders & Dispatch')}
            {navItem('catalog', '👗', 'Saree Catalog')}
            
            <div style={{
              fontSize: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              color: '#A89F91',
              marginTop: '1rem',
              marginBottom: '0.35rem',
              paddingLeft: '0.5rem'
            }}>
              Governance
            </div>
            {navItem('approvals', '🛡️', 'Staff Approvals')}
          </>
        )}

        {isAdmin && (
          <>
            {navItem('orders', '📦', 'Orders & Shipping')}
            {navItem('catalog', '👗', 'Saree Catalog')}
            {navItem('staff', '👥', 'Staff Team Management')}
          </>
        )}

        {isEmployee && (
          <>
            {canManageCatalog && navItem('catalog', '👗', 'Saree Catalog')}
            {canManageOrders && navItem('orders', '📦', 'Orders & Packaging')}
            
            {!canManageCatalog && !canManageOrders && (
              <div style={{
                padding: '1rem',
                fontSize: '11px',
                color: '#C8A96E',
                lineHeight: 1.6,
                background: 'rgba(200,169,110,0.08)',
                border: '1px solid rgba(200,169,110,0.2)',
                borderRadius: '2px',
                marginTop: '1rem'
              }}>
                ℹ️ No active modules assigned. Contact your Administrator for access.
              </div>
            )}
          </>
        )}
      </nav>

      {/* User Session Footer */}
      <div style={{
        paddingTop: '1.25rem',
        borderTop: '1px solid rgba(200,169,110,0.2)',
        fontSize: '11px'
      }}>
        <div style={{ color: '#8C7B72', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Active Session
        </div>
        <p style={{ color: '#FAF8F5', fontWeight: 600, margin: '3px 0 6px', fontSize: '12px' }}>
          {user?.name}
        </p>
        <span className={isOwner ? 'badge-owner' : isAdmin ? 'badge-admin' : 'badge-employee'}>
          {user?.role?.toUpperCase()}
        </span>
      </div>
    </aside>
  );
}
