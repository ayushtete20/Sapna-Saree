import React from 'react';

export default function Weaver() {
  const weavers = [
    { id: "w_1", masterName: "Pandit Rajeshwar Master Weaver", location: "Varanasi, UP", activeLooms: 42, specialty: "Katan Silk Kadwa Zari", fairTradeCertified: true },
    { id: "w_2", masterName: "Kalyanasundaram Weavers Guild", location: "Kanchipuram, TN", activeLooms: 35, specialty: "Pure Silk Korvai", fairTradeCertified: true },
    { id: "w_3", masterName: "Chanderi Handloom Collective", location: "Chanderi, MP", activeLooms: 28, specialty: "Gold Zari Cotton Silk", fairTradeCertified: true },
    { id: "w_4", masterName: "Yeola Paithani Artisans", location: "Yeola, MH", activeLooms: 22, specialty: "Pure Tapestry Peacock Pallu", fairTradeCertified: true }
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#2C2420', margin: 0 }}>Weaver Community Partners</h1>
        <p style={{ fontSize: '0.85rem', color: '#8C7B72', margin: '0.2rem 0 0' }}>Direct fair-wage partnerships with master weaver families across India.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {weavers.map(w => (
          <div key={w.id} style={{ background: '#FFFFFF', border: '1px solid rgba(200,169,110,0.3)', padding: '1.5rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#C8A96E', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{w.location}</span>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#2C2420', margin: '0.4rem 0' }}>{w.masterName}</h3>
            <p style={{ fontSize: '0.85rem', color: '#5C1220', margin: '0 0 1rem' }}>Specialty: {w.specialty}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', paddingTop: '0.75rem', borderTop: '1px solid #FAF6F0' }}>
              <span>Active Looms: <strong>{w.activeLooms}</strong></span>
              <span style={{ color: '#196f3d' }}>✓ Fair Wage Partner</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
