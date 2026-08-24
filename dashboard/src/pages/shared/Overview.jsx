import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../utils/config';

export default function Overview({ setActiveTab }) {
  const { user, isOwner, isAdmin, isEmployee, token } = useAuth();
  const [stats, setStats] = useState({
    activeOrders: 2,
    totalSarees: 6,
    lowStock: 1,
    pendingApprovals: 0
  });
  const [lowStockItems, setLowStockItems] = useState([
    { name: 'Ivory Mulberry Silk Kanjivaram', stock: 5, id: 'prod_kanjivaram_02' }
  ]);

  useEffect(() => {
    // Fetch live counts from backend APIs to show real-time stats
    const fetchStats = async () => {
      try {
        const orderRes = await fetch(`${API_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const orderData = await orderRes.json();
        
        const productRes = await fetch(`${API_URL}/products`);
        const productData = await productRes.json();

        let activeCount = 2;
        if (orderData.success && orderData.orders) {
          activeCount = orderData.orders.filter(o => o.status === 'PENDING' || o.status === 'IN_PROCESS').length;
        }

        let totalSareesCount = 6;
        let lowStockCount = 1;
        let lowItemsList = [{ name: 'Ivory Mulberry Silk Kanjivaram', stock: 5, id: 'prod_kanjivaram_02' }];

        if (productData.success && productData.products) {
          totalSareesCount = productData.products.length;
          const low = productData.products.filter(p => p.stockQuantity <= 5);
          lowStockCount = low.length;
          if (low.length > 0) {
            lowItemsList = low.map(p => ({ name: p.name, stock: p.stockQuantity, id: p.id }));
          } else {
            lowItemsList = [];
          }
        }

        let pendingApps = 0;
        if (isOwner) {
          const staffRes = await fetch(`${API_URL}/employees`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const staffData = await staffRes.json();
          if (staffData.success && staffData.staff) {
            pendingApps = staffData.staff.filter(s => s.accountStatus === 'PENDING_APPROVAL' || s.accountStatus === 'PENDING_DELETION').length;
          }
        }

        setStats({
          activeOrders: activeCount,
          totalSarees: totalSareesCount,
          lowStock: lowStockCount,
          pendingApprovals: pendingApps
        });
        setLowStockItems(lowItemsList);

      } catch (err) {
        console.warn('API connection offline or database unseeded. Using mock stats.');
      }
    };

    fetchStats();
  }, [token, isOwner]);

  return (
    <div style={{ fontFamily: 'Jost, sans-serif' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #2C2420 0%, #18140F 100%)',
        padding: '2.5rem',
        border: '1px solid #C8A96E',
        borderRadius: '4px',
        color: '#FAF6F0',
        marginBottom: '2rem',
        boxShadow: '0 8px 30px rgba(0,0,0,0.05)'
      }}>
        <span style={{ fontFamily: 'cursive', fontSize: '1rem', color: '#C8A96E', display: 'block', marginBottom: '0.4rem' }}>
          Namaste &amp; Welcome back
        </span>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#FAF6F0', margin: 0, fontWeight: 'normal' }}>
          {user?.name || 'Atelier Staff'}
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#8C7B72', marginTop: '0.5rem', maxWidth: '600px' }}>
          Welcome to the Sapna Sarees Atelier portal. Manage luxury saree catalog collections, process custom orders, and review artisan weaves.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(200,169,110,0.3)', padding: '1.5rem', borderRadius: '4px' }}>
          <span style={{ fontSize: '0.75rem', color: '#8C7B72', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📦 Active Orders</span>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2.2rem', color: '#7A1C2E', margin: '0.5rem 0 0.2rem' }}>{stats.activeOrders}</h2>
          <p style={{ fontSize: '0.75rem', color: '#8C7B72', margin: 0 }}>Pending processing or shipping</p>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid rgba(200,169,110,0.3)', padding: '1.5rem', borderRadius: '4px' }}>
          <span style={{ fontSize: '0.75rem', color: '#8C7B72', textTransform: 'uppercase', letterSpacing: '0.05em' }}>👗 Catalog Styles</span>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2.2rem', color: '#2C2420', margin: '0.5rem 0 0.2rem' }}>{stats.totalSarees}</h2>
          <p style={{ fontSize: '0.75rem', color: '#8C7B72', margin: 0 }}>Active designs in collection</p>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid rgba(200,169,110,0.3)', padding: '1.5rem', borderRadius: '4px' }}>
          <span style={{ fontSize: '0.75rem', color: '#8C7B72', textTransform: 'uppercase', letterSpacing: '0.05em' }}>⚠️ Low Stock Alerts</span>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2.2rem', color: stats.lowStock > 0 ? '#C8A96E' : '#2C2420', margin: '0.5rem 0 0.2rem' }}>{stats.lowStock}</h2>
          <p style={{ fontSize: '0.75rem', color: '#8C7B72', margin: 0 }}>Drapes with stock quantity &le; 5</p>
        </div>

        {isOwner && (
          <div style={{ background: '#FFFFFF', border: '1px solid rgba(200,169,110,0.3)', padding: '1.5rem', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: '#8C7B72', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🛡️ Staff Requests</span>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2.2rem', color: stats.pendingApprovals > 0 ? '#7A1C2E' : '#2C2420', margin: '0.5rem 0 0.2rem' }}>{stats.pendingApprovals}</h2>
            <p style={{ fontSize: '0.75rem', color: '#8C7B72', margin: 0 }}>Awaiting activation approvals</p>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        {/* Quick Actions */}
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(200,169,110,0.3)', padding: '1.75rem', borderRadius: '4px' }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#2C2420', marginTop: 0, marginBottom: '1.25rem' }}>Atelier Task Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button 
              onClick={() => setActiveTab('orders')}
              style={{
                padding: '1.25rem',
                background: '#FAF6F0',
                border: '1px solid rgba(200,169,110,0.4)',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📦</div>
              <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#7A1C2E', margin: '0 0 0.2rem' }}>Order Processing</h4>
              <p style={{ fontSize: '0.75rem', color: '#8C7B72', margin: 0 }}>Process client orders and ship drapes</p>
            </button>

            <button 
              onClick={() => setActiveTab('catalog')}
              style={{
                padding: '1.25rem',
                background: '#FAF6F0',
                border: '1px solid rgba(200,169,110,0.4)',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👗</div>
              <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#7A1C2E', margin: '0 0 0.2rem' }}>Saree Catalog</h4>
              <p style={{ fontSize: '0.75rem', color: '#8C7B72', margin: 0 }}>Manage collections and update stocks</p>
            </button>

            {isAdmin && (
              <button 
                onClick={() => setActiveTab('staff')}
                style={{
                  padding: '1.25rem',
                  background: '#FAF6F0',
                  border: '1px solid rgba(200,169,110,0.4)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  gridColumn: 'span 2',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👥</div>
                <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#7A1C2E', margin: '0 0 0.2rem' }}>Staff Account Requests</h4>
                <p style={{ fontSize: '0.75rem', color: '#8C7B72', margin: 0 }}>Request account creations and deletions</p>
              </button>
            )}

            {isOwner && (
              <button 
                onClick={() => setActiveTab('approvals')}
                style={{
                  padding: '1.25rem',
                  background: '#FAF6F0',
                  border: '1px solid rgba(200,169,110,0.4)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  gridColumn: 'span 2',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🛡️</div>
                <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#7A1C2E', margin: '0 0 0.2rem' }}>Staff Account Approvals</h4>
                <p style={{ fontSize: '0.75rem', color: '#8C7B72', margin: 0 }}>Review and approve staff account requests</p>
              </button>
            )}
          </div>
        </div>

        {/* Low Stock Alerts list */}
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(200,169,110,0.3)', padding: '1.75rem', borderRadius: '4px' }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#2C2420', marginTop: 0, marginBottom: '1.25rem' }}>Low Stock Inventory Alerts</h3>
          {lowStockItems.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#8C7B72', fontSize: '0.85rem' }}>
              🟢 All saree stocks are fully supplied.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {lowStockItems.map((item, idx) => (
                <div key={idx} style={{
                  padding: '0.75rem 1rem',
                  background: '#FAF6F0',
                  borderLeft: '4px solid #C8A96E',
                  fontSize: '0.8rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong style={{ color: '#2C2420', display: 'block' }}>{item.name}</strong>
                    <span style={{ fontSize: '0.7rem', color: '#8C7B72', fontFamily: 'monospace' }}>ID: {item.id}</span>
                  </div>
                  <span style={{
                    padding: '0.2rem 0.5rem',
                    background: '#fcf3cf',
                    color: '#7d6608',
                    fontWeight: '600',
                    borderRadius: '2px'
                  }}>
                    Stock: {item.stock}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
