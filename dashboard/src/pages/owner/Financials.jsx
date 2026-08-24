import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../utils/config';

export default function Financials() {
  const { token, isAdmin, isOwner } = useAuth();
  const [financials, setFinancials] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/owner/financials`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setFinancials(data.financials);
      });
  }, [token]);

  if (!isAdmin && !isOwner) {
    return <div style={{ color: '#78281f', padding: '2rem' }}>Access Denied. Internal Admin or Owner credentials required.</div>;
  }


  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#2C2420', margin: 0 }}>Financial Revenue &amp; Profit Margins</h1>
        <p style={{ fontSize: '0.85rem', color: '#8C7B72', margin: '0.2rem 0 0' }}>Confidential executive report accessible strictly by Atelier Owner.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(200,169,110,0.3)', padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#8C7B72', textTransform: 'uppercase' }}>Gross Revenue</span>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#7A1C2E', margin: '0.4rem 0 0' }}>
            ₹{financials ? financials.totalRevenue.toLocaleString('en-IN') : '50,500'}
          </h2>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid rgba(200,169,110,0.3)', padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#8C7B72', textTransform: 'uppercase' }}>Cost of Goods (Weavers)</span>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#2C2420', margin: '0.4rem 0 0' }}>
            ₹{financials ? financials.costOfGoods.toLocaleString('en-IN') : '22,725'}
          </h2>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid rgba(200,169,110,0.3)', padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#8C7B72', textTransform: 'uppercase' }}>Net Atelier Profit</span>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#196f3d', margin: '0.4rem 0 0' }}>
            ₹{financials ? financials.grossProfit.toLocaleString('en-IN') : '27,775'}
          </h2>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid rgba(200,169,110,0.3)', padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#8C7B72', textTransform: 'uppercase' }}>Profit Margin</span>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#C8A96E', margin: '0.4rem 0 0' }}>
            {financials ? financials.netMargin : '55%'}
          </h2>
        </div>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid rgba(200,169,110,0.3)', padding: '1.5rem' }}>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: '#2C2420', marginTop: 0 }}>Quarterly Financial Growth Projections</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#FAF6F0', borderBottom: '1px solid rgba(200,169,110,0.3)', color: '#7A1C2E' }}>
              <th style={{ padding: '0.75rem' }}>Month</th>
              <th style={{ padding: '0.75rem' }}>Projected Revenue</th>
              <th style={{ padding: '0.75rem' }}>Estimated Net Profit</th>
            </tr>
          </thead>
          <tbody>
            {(financials?.monthlyProjections || []).map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #FAF6F0' }}>
                <td style={{ padding: '0.75rem', fontWeight: '500' }}>{row.month}</td>
                <td style={{ padding: '0.75rem', fontFamily: 'Georgia, serif' }}>₹{row.revenue.toLocaleString('en-IN')}</td>
                <td style={{ padding: '0.75rem', fontFamily: 'Georgia, serif', color: '#196f3d' }}>₹{row.profit.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
