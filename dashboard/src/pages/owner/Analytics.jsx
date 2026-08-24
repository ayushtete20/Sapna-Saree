import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../utils/config';

export default function Analytics() {
  const { token, isAdmin, isOwner } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/owner/analytics`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.success) setData(resData.analytics);
      });
  }, [token]);

  if (!isAdmin && !isOwner) {
    return <div style={{ color: '#78281f', padding: '2rem' }}>Access Denied. Internal Admin or Owner credentials required.</div>;
  }


  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#2C2420', margin: 0 }}>Sales Trends &amp; Traffic Analytics</h1>
        <p style={{ fontSize: '0.85rem', color: '#8C7B72', margin: '0.2rem 0 0' }}>Customer engagement and weave category popularity breakdown.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(200,169,110,0.3)', padding: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#7A1C2E', marginTop: 0 }}>Category Sales Distribution</h3>
          {(data?.topCategories || []).map((cat, idx) => (
            <div key={idx} style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                <span style={{ fontWeight: '500' }}>{cat.name}</span>
                <span style={{ color: '#C8A96E' }}>{cat.percentage}% of Orders</span>
              </div>
              <div style={{ height: '8px', background: '#F3EDE3', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${cat.percentage}%`, height: '100%', background: '#7A1C2E' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid rgba(200,169,110,0.3)', padding: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#2C2420', marginTop: 0 }}>Key Metrics Summary</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #FAF6F0', paddingBottom: '0.5rem' }}>
              <span>Total Orders Executed</span>
              <strong>{data?.totalOrders || 2}</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #FAF6F0', paddingBottom: '0.5rem' }}>
              <span>Registered Luxury Clients</span>
              <strong>{data?.totalCustomers || 1}</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #FAF6F0', paddingBottom: '0.5rem' }}>
              <span>Average Order Value (AOV)</span>
              <strong>₹25,250</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #FAF6F0', paddingBottom: '0.5rem' }}>
              <span>WhatsApp Inquiry Conversion Rate</span>
              <strong style={{ color: '#196f3d' }}>68.4%</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
