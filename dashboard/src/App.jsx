import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/shared/Login';

// Shared / Admin Pages
import Orders from './pages/admin/Orders';
import Catalog from './pages/admin/Catalog';
import Staff from './pages/owner/Staff';

// Owner Pages
import Financials from './pages/owner/Financials';
import Analytics from './pages/owner/Analytics';
import Weaver from './pages/admin/Weaver';
import Approvals from './pages/owner/Approvals';
import Overview from './pages/shared/Overview';

export default function App() {
  const { user, isOwner, isAdmin, isEmployee, canManageCatalog, canManageOrders, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      setActiveTab('overview');
    }
  }, [user]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#FAF8F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: '18px',
        color: '#7A1C2E'
      }}>
        Loading Sapna Sarees Atelier Suite...
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#FAF8F5',
      color: '#2C2420',
      fontFamily: "'Montserrat', 'Jost', system-ui, sans-serif"
    }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{ flex: 1, padding: '2.25rem 3rem', overflowY: 'auto', background: '#FAF8F5' }}>
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid rgba(200,169,110,0.35)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#C8A96E', fontWeight: 600 }}>
                Sapna Sarees Atelier Console
              </span>
              <span style={{ color: 'rgba(200,169,110,0.5)' }}>•</span>
              <span style={{ fontSize: '10px', color: '#7C6E66' }}>
                {isOwner ? '👑 Founder Suite' : isAdmin ? '🛠️ Admin Suite' : '👗 Staff Atelier'}
              </span>
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
              fontSize: '1.5rem',
              color: '#7A1C2E',
              margin: 0,
              fontWeight: 500
            }}>
              {user.name} <span style={{ fontSize: '13px', color: '#7C6E66', fontFamily: "'Montserrat', sans-serif", fontWeight: 400 }}>({user.role.toUpperCase()})</span>
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="luxury-btn-secondary"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>↗</span> Open Storefront
            </a>
            <button
              onClick={logout}
              className="luxury-btn-primary"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* SHARED LANDING VIEW FOR ALL ROLES */}
        {activeTab === 'overview' && <Overview setActiveTab={setActiveTab} />}

        {/* CATALOG */}
        {activeTab === 'catalog' && canManageCatalog && <Catalog />}
        {activeTab === 'catalog' && !canManageCatalog && (
          <div className="luxury-card" style={{ padding: '3rem', textAlign: 'center', color: '#78281F' }}>
            ⛔ You do not have permission to access the Saree Catalog. Contact your Atelier Admin.
          </div>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && canManageOrders && <Orders />}
        {activeTab === 'orders' && !canManageOrders && (
          <div className="luxury-card" style={{ padding: '3rem', textAlign: 'center', color: '#78281F' }}>
            ⛔ You do not have permission to access Orders & Shipping. Contact your Atelier Admin.
          </div>
        )}

        {/* ADMIN EXCLUSIVE / STAFF MANAGEMENT */}
        {isAdmin && activeTab === 'staff' && <Staff />}

        {/* OWNER EXCLUSIVE */}
        {isOwner && activeTab === 'financials' && <Financials />}
        {isOwner && activeTab === 'analytics' && <Analytics />}
        {isOwner && activeTab === 'weaver' && <Weaver />}
        {isOwner && activeTab === 'approvals' && <Approvals />}
        {isOwner && activeTab === 'staff' && <Staff />}
      </main>
    </div>
  );
}
