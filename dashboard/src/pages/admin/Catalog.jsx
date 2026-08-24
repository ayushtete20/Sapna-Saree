import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../utils/config';

export default function Catalog() {
  const { user, token, isAdmin, isOwner } = useAuth();
  const [sarees, setSarees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('All');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSaree, setEditingSaree] = useState(null);
  const [historySaree, setHistorySaree] = useState(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    collection: 'Banarasi Heritage',
    fabric: '',
    price: '',
    originalPrice: '',
    tag: 'New Arrival',
    hue: '#6B1E2E',
    stock: '10',
    description: '',
    image: '',
    updateReason: ''
  });

  const [imagePreview, setImagePreview] = useState('');

  const fetchSarees = () => {
    setLoading(true);
    fetch(`${API_URL}/sarees`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setSarees(data.sarees || []);
      })
      .catch(err => console.error('Failed to load sarees:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSarees();
  }, []);

  // Handle File Upload to Base64
  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setFormData(prev => ({ ...prev, image: base64String }));
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUrlChange = (url) => {
    setFormData(prev => ({ ...prev, image: url }));
    setImagePreview(url);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      collection: 'Banarasi Heritage',
      fabric: '',
      price: '',
      originalPrice: '',
      tag: 'New Arrival',
      hue: '#6B1E2E',
      stock: '10',
      description: '',
      image: '',
      updateReason: ''
    });
    setImagePreview('');
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (saree) => {
    setFormData({
      name: saree.name || '',
      collection: saree.collection || 'Banarasi Heritage',
      fabric: saree.fabric || '',
      price: saree.price ? String(saree.price) : '',
      originalPrice: saree.originalPrice ? String(saree.originalPrice) : '',
      tag: saree.tag || 'New Arrival',
      hue: saree.hue || '#6B1E2E',
      stock: saree.stock !== undefined ? String(saree.stock) : '10',
      description: saree.description || '',
      image: saree.image || '',
      updateReason: ''
    });
    setImagePreview(saree.image || '');
    setEditingSaree(saree);
  };

  const [livePageNotification, setLivePageNotification] = useState(null);

  // Submit Add Saree
  const handleAddSaree = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/sarees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Math.round(Number(formData.price) * 1.25),
          stock: Number(formData.stock)
        })
      });
      const data = await res.json();
      if (data.success) {
        setSarees(prev => [data.saree, ...prev]);
        setShowAddModal(false);
        setLivePageNotification({
          id: data.saree.id,
          name: data.saree.name,
          url: `http://localhost:3000/#product/${data.saree.id}`
        });
        resetForm();
      } else {
        alert(data.message || 'Failed to add saree');
      }
    } catch (err) {
      alert('Failed to connect to backend server');
    }
  };

  // Submit Edit Saree
  const handleUpdateSaree = async (e) => {
    e.preventDefault();
    if (!editingSaree) return;

    try {
      const res = await fetch(`${API_URL}/sarees/${editingSaree.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Math.round(Number(formData.price) * 1.25),
          stock: Number(formData.stock)
        })
      });
      const data = await res.json();
      if (data.success) {
        setSarees(prev => prev.map(s => s.id === editingSaree.id ? data.saree : s));
        setEditingSaree(null);
        resetForm();
      } else {
        alert(data.message || 'Failed to update saree');
      }
    } catch (err) {
      alert('Failed to update saree');
    }
  };

  // Quick Stock Adjustment (+ / -)
  const handleStockAdjust = async (saree, delta) => {
    const newStock = Math.max(0, saree.stock + delta);
    try {
      const res = await fetch(`${API_URL}/sarees/${saree.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          stock: newStock,
          updateReason: `Quick stock adjustment (${delta > 0 ? '+' : ''}${delta})`
        })
      });
      const data = await res.json();
      if (data.success) {
        setSarees(prev => prev.map(s => s.id === saree.id ? data.saree : s));
      }
    } catch (err) {
      console.error('Failed to update stock:', err);
    }
  };

  // Delete Saree
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this Saree from catalog?')) return;
    try {
      const res = await fetch(`${API_URL}/sarees/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSarees(prev => prev.filter(s => s.id !== id));
      } else {
        alert(data.message || 'Failed to delete product.');
      }
    } catch (err) {
      alert('Failed to delete saree');
    }
  };

  const filteredSarees = sarees.filter(saree => {
    const matchesSearch = saree.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          saree.fabric.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCollection = selectedCollection === 'All' || saree.collection === selectedCollection;
    return matchesSearch && matchesCollection;
  });

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#2C2420', margin: 0 }}>Saree Catalog &amp; Inventory Hub</h1>
          <p style={{ fontSize: '0.85rem', color: '#8C7B72', margin: '0.25rem 0 0' }}>
            Manage saree products, upload product pictures, track real-time inventory stock, and review catalog audit logs.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          style={{ padding: '0.75rem 1.5rem', background: '#7A1C2E', color: '#FAF6F0', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', borderRadius: '4px', boxShadow: '0 2px 8px rgba(122,28,46,0.2)' }}
        >
          + Add New Saree
        </button>
      </div>

      {/* Live Product Page Auto-Generation Alert */}
      {livePageNotification && (
        <div style={{
          background: '#FAF8F5',
          border: '2px solid #C8A96E',
          borderRadius: '6px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 4px 16px rgba(200, 169, 110, 0.25)'
        }}>
          <div>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#7A1C2E', fontWeight: 700, display: 'block' }}>
              ✨ Live Product Page Automatically Generated!
            </span>
            <strong style={{ fontSize: '15px', color: '#2C2420' }}>{livePageNotification.name}</strong>
            <p style={{ fontSize: '12px', color: '#7C6E66', margin: '4px 0 0' }}>
              A dedicated storefront page has been published with instant shopping bag integration and WhatsApp concierge.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <a
              href={livePageNotification.url}
              target="_blank"
              rel="noreferrer"
              className="luxury-btn-primary"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 16px' }}
            >
              <span>👁️</span> Open Live Product Page ↗
            </a>
            <button
              onClick={() => setLivePageNotification(null)}
              style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#7C6E66', padding: '4px 8px' }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', background: '#FFFFFF', padding: '1rem', border: '1px solid #EAE0D5', borderRadius: '6px' }}>
        <input 
          type="text" 
          placeholder="Search by saree name or fabric..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
          style={{ flex: '1 1 250px', padding: '0.6rem 1rem', border: '1px solid #D6C7B2', borderRadius: '4px', fontSize: '0.9rem' }}
        />
        <select 
          value={selectedCollection} 
          onChange={e => setSelectedCollection(e.target.value)} 
          style={{ padding: '0.6rem 1rem', border: '1px solid #D6C7B2', borderRadius: '4px', fontSize: '0.9rem', background: '#FFF' }}
        >
          <option value="All">All Collections</option>
          <option value="Banarasi Heritage">Banarasi Heritage</option>
          <option value="Pure Kanjivaram Silk">Pure Kanchipuram Silk</option>
          <option value="Festive Splendour">Festive Splendour</option>
          <option value="Designer Edit">Designer Edit</option>
          <option value="Daily Luxe">Daily Luxe</option>
        </select>
      </div>

      {/* Saree Catalog Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#8C7B72' }}>Loading saree catalog...</div>
      ) : filteredSarees.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: '#FFF', border: '1px solid #EAE0D5', borderRadius: '6px', color: '#8C7B72' }}>
          No sarees match your filter criteria. Click <strong>+ Add New Saree</strong> to add products.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.5rem' }}>
          {filteredSarees.map(saree => {
            const stock = saree.stock !== undefined ? saree.stock : 10;
            const isOutOfStock = stock <= 0;
            const isLowStock = stock > 0 && stock < 10;

            return (
              <div 
                key={saree.id} 
                style={{ 
                  background: '#FFFFFF', 
                  border: '1px solid #EAE0D5', 
                  borderRadius: '8px', 
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                {/* Image Banner */}
                <div style={{ position: 'relative', width: '100%', height: '210px', background: saree.hue || '#F5EBE6' }}>
                  <img 
                    src={saree.image || '/images/banarasi_red.png'} 
                    alt={saree.name} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  {/* Tag badge */}
                  <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#7A1C2E', color: '#FFF', padding: '0.2rem 0.6rem', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, borderRadius: '3px' }}>
                    {saree.tag || 'Atelier Pick'}
                  </span>
                  {/* Stock Status badge */}
                  <span style={{ 
                    position: 'absolute', 
                    top: '10px', 
                    right: '10px', 
                    background: isOutOfStock ? '#D32F2F' : isLowStock ? '#E65100' : '#2E7D32', 
                    color: '#FFF', 
                    padding: '0.2rem 0.6rem', 
                    fontSize: '0.65rem', 
                    fontWeight: 700, 
                    borderRadius: '3px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
                  }}>
                    {isOutOfStock ? 'OUT OF STOCK' : isLowStock ? `LOW STOCK (${stock})` : `IN STOCK (${stock})`}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: '#8C7B72', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {saree.collection || 'Collection'}
                  </span>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#2C2420', margin: '0.3rem 0 0.2rem', lineHeight: '1.3' }}>
                    {saree.name}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#665A52', margin: 0 }}>{saree.fabric}</p>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.8rem 0' }}>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', fontWeight: 700, color: '#7A1C2E' }}>
                      ₹{saree.price ? saree.price.toLocaleString('en-IN') : saree.price}
                    </span>
                    {saree.originalPrice && saree.originalPrice > saree.price && (
                      <span style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: '#A09084' }}>
                        ₹{saree.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Stock Quick Adjustment */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: '#FAF6F0', borderRadius: '4px', margin: '0.5rem 0' }}>
                    <span style={{ fontSize: '0.78rem', color: '#554840', fontWeight: 600 }}>Stock Inventory:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleStockAdjust(saree, -1)}
                        style={{ width: '26px', height: '26px', background: '#FFF', border: '1px solid #D6C7B2', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, color: '#7A1C2E' }}
                        title="Decrease stock"
                      >-</button>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2C2420', minWidth: '24px', textAlign: 'center' }}>
                        {stock}
                      </span>
                      <button 
                        onClick={() => handleStockAdjust(saree, 1)}
                        style={{ width: '26px', height: '26px', background: '#FFF', border: '1px solid #D6C7B2', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, color: '#7A1C2E' }}
                        title="Increase stock"
                      >+</button>
                    </div>
                  </div>

                  {/* User Tracking Info ("Who Updated") */}
                  <div style={{ margin: '0.5rem 0 1rem', padding: '0.5rem 0', borderTop: '1px borderBottom', borderColor: '#F0E8DD', fontSize: '0.72rem', color: '#706259' }}>
                    <div>
                      <strong>Last Updated By:</strong> {saree.updatedBy?.name || 'Aarav Gupta'} ({saree.updatedBy?.role || 'ADMIN'})
                    </div>
                    {saree.updatedBy?.timestamp && (
                      <div style={{ color: '#908278', fontSize: '0.68rem', marginTop: '0.1rem' }}>
                        {new Date(saree.updatedBy.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem', paddingTop: '0.5rem' }}>
                    <button 
                      onClick={() => openEditModal(saree)}
                      style={{ flex: 1, padding: '0.45rem', background: '#F5EBE6', border: '1px solid #D6C7B2', color: '#2C2420', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', borderRadius: '4px' }}
                    >
                      Edit Details
                    </button>
                    {(isAdmin || isOwner) && (
                      <button 
                        onClick={() => setHistorySaree(saree)}
                        style={{ padding: '0.45rem 0.6rem', background: '#FFF', border: '1px solid #C8A96E', color: '#7A1C2E', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', borderRadius: '4px' }}
                        title="View Audit Log & Inventory History"
                      >
                        Audit Log
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(saree.id)}
                      style={{ padding: '0.45rem 0.6rem', background: '#FFF', border: '1px solid #D32F2F', color: '#D32F2F', fontSize: '0.75rem', cursor: 'pointer', borderRadius: '4px' }}
                      title="Delete Product"
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Direct Storefront Product Page Link */}
                  <a
                    href={`http://localhost:3000/#product/${saree.id}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '0.45rem',
                      marginTop: '0.4rem',
                      background: '#FAF8F5',
                      border: '1px solid #C8A96E',
                      color: '#7A1C2E',
                      textDecoration: 'none',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      borderRadius: '4px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#7A1C2E'; e.currentTarget.style.color = '#FAF8F5'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#FAF8F5'; e.currentTarget.style.color = '#7A1C2E'; }}
                  >
                    👁️ View Live Product Page ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Saree Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1rem' }}>
          <div style={{ background: '#FAF6F0', padding: '2rem', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', borderRadius: '8px', border: '1px solid #C8A96E', boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', color: '#7A1C2E', marginTop: 0, marginBottom: '0.5rem' }}>Add New Saree to Atelier</h2>
            <p style={{ fontSize: '0.8rem', color: '#8C7B72', marginBottom: '1.25rem' }}>
              Logged in as <strong>{user?.name || 'Staff User'}</strong> ({user?.role || 'ADMIN'}). Your user details will be linked to this update.
            </p>

            <form onSubmit={handleAddSaree} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#554840', marginBottom: '0.3rem' }}>Saree Name *</label>
                <input type="text" placeholder="e.g. Royal Ruby Silk Banarasi" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '0.6rem', border: '1px solid #D6C7B2', borderRadius: '4px' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#554840', marginBottom: '0.3rem' }}>Collection</label>
                  <select value={formData.collection} onChange={e => setFormData({...formData, collection: e.target.value})} style={{ width: '100%', padding: '0.6rem', border: '1px solid #D6C7B2', borderRadius: '4px', background: '#FFF' }}>
                    <option value="Banarasi Heritage">Banarasi Heritage</option>
                    <option value="Pure Kanjivaram Silk">Pure Kanjivaram Silk</option>
                    <option value="Festive Splendour">Festive Splendour</option>
                    <option value="Designer Edit">Designer Edit</option>
                    <option value="Daily Luxe">Daily Luxe</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#554840', marginBottom: '0.3rem' }}>Fabric &amp; Weave *</label>
                  <input type="text" placeholder="e.g. Pure Katan Silk · Varanasi" value={formData.fabric} onChange={e => setFormData({...formData, fabric: e.target.value})} required style={{ width: '100%', padding: '0.6rem', border: '1px solid #D6C7B2', borderRadius: '4px' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#554840', marginBottom: '0.3rem' }}>Price (INR) *</label>
                  <input type="number" placeholder="e.g. 18500" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required style={{ width: '100%', padding: '0.6rem', border: '1px solid #D6C7B2', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#554840', marginBottom: '0.3rem' }}>Original Price (INR)</label>
                  <input type="number" placeholder="Optional" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} style={{ width: '100%', padding: '0.6rem', border: '1px solid #D6C7B2', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#554840', marginBottom: '0.3rem' }}>Initial Stock *</label>
                  <input type="number" placeholder="e.g. 10" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required style={{ width: '100%', padding: '0.6rem', border: '1px solid #D6C7B2', borderRadius: '4px' }} />
                </div>
              </div>

              {/* Product Picture Input Section with Luxury Presets */}
              <div style={{ background: '#FFF', padding: '1rem', border: '1px solid #EAE0D5', borderRadius: '6px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#7A1C2E', marginBottom: '0.5rem' }}>📷 Product Picture &amp; Luxury Presets</label>
                
                {/* Quick Luxury Presets */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#8C7B72', display: 'block', marginBottom: '0.35rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Select Atelier Curated Drape:
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {[
                      { name: 'Banarasi Crimson', path: '/images/banarasi_red.png' },
                      { name: 'Indigo Chanderi', path: '/images/chanderi_indigo.png' },
                      { name: 'Ivory Kanjivaram', path: '/images/kanjivaram_ivory.png' },
                      { name: 'Tissue Rose Gold', path: '/images/tissue_pink.png' },
                      { name: 'Daffodil Georgette', path: '/images/daffodil_yellow_georgette.jpg' },
                      { name: 'Ivory Organza', path: '/images/ivory_organza_applique.jpg' },
                    ].map(preset => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleImageUrlChange(preset.path)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 8px',
                          background: formData.image === preset.path ? '#7A1C2E' : '#FAF8F5',
                          color: formData.image === preset.path ? '#FAF8F5' : '#2C2420',
                          border: '1px solid #C8A96E',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          cursor: 'pointer'
                        }}
                      >
                        <span>✨</span> {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#665A52' }}>Or Upload Custom Image File:</span>
                    <input type="file" accept="image/*" onChange={handleImageFileUpload} style={{ width: '100%', marginTop: '0.2rem', fontSize: '0.8rem' }} />
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#665A52' }}>Or Enter Image URL:</span>
                    <input type="text" placeholder="https://example.com/saree.jpg or /images/banarasi_red.png" value={formData.image} onChange={e => handleImageUrlChange(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #D6C7B2', borderRadius: '4px', fontSize: '0.85rem' }} />
                  </div>

                  {/* Live Image Preview */}
                  {imagePreview && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={imagePreview} alt="Preview" style={{ width: '80px', height: '105px', objectFit: 'cover', borderRadius: '4px', border: '2px solid #C8A96E' }} />
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#7A1C2E', fontWeight: 600, display: 'block' }}>Theme Matching Active</span>
                        <span style={{ fontSize: '0.7rem', color: '#8C7B72' }}>Will render with 3:4 portrait luxury aspect ratio and gold badge.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#554840', marginBottom: '0.3rem' }}>Catalog Tag</label>
                  <select value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} style={{ width: '100%', padding: '0.6rem', border: '1px solid #D6C7B2', borderRadius: '4px', background: '#FFF' }}>
                    <option value="New Arrival">New Arrival</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="Limited">Limited</option>
                    <option value="Trending">Trending</option>
                    <option value="Exclusive Atelier">Exclusive Atelier</option>
                    <option value="Silk Mark Certified">Silk Mark Certified</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#554840', marginBottom: '0.3rem' }}>Primary Royal Color Hue</label>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {['#7A1C2E', '#C8A96E', '#1A2B4C', '#0F5132', '#D4838F', '#9E1B32'].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFormData({...formData, hue: c})}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: c,
                          border: formData.hue === c ? '2px solid #2C2420' : '1px solid #C8A96E',
                          cursor: 'pointer'
                        }}
                        title={c}
                      />
                    ))}
                    <input type="color" value={formData.hue} onChange={e => setFormData({...formData, hue: e.target.value})} style={{ width: '32px', height: '28px', padding: '0', border: 'none', background: 'none', cursor: 'pointer' }} />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#554840', marginBottom: '0.3rem' }}>Description</label>
                <textarea rows="3" placeholder="Handcrafted silk details, authentic zari motifs, master weaver provenance..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '0.6rem', border: '1px solid #D6C7B2', borderRadius: '4px', resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" style={{ flex: 1, padding: '0.75rem', background: '#7A1C2E', color: '#FFF', border: 'none', cursor: 'pointer', fontWeight: 600, borderRadius: '4px' }}>
                  Save Saree to Catalog
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '0.75rem', background: '#8C7B72', color: '#FFF', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Saree Modal */}
      {editingSaree && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1rem' }}>
          <div style={{ background: '#FAF6F0', padding: '2rem', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', borderRadius: '8px', border: '1px solid #C8A96E', boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', color: '#7A1C2E', marginTop: 0, marginBottom: '0.5rem' }}>Edit Saree Product &amp; Inventory</h2>
            <p style={{ fontSize: '0.8rem', color: '#8C7B72', marginBottom: '1.25rem' }}>
              Updating as <strong>{user?.name || 'Staff User'}</strong> ({user?.role || 'ADMIN'}). All edits will be logged in the database audit history.
            </p>

            <form onSubmit={handleUpdateSaree} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#554840', marginBottom: '0.3rem' }}>Saree Name *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '0.6rem', border: '1px solid #D6C7B2', borderRadius: '4px' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#554840', marginBottom: '0.3rem' }}>Collection</label>
                  <select value={formData.collection} onChange={e => setFormData({...formData, collection: e.target.value})} style={{ width: '100%', padding: '0.6rem', border: '1px solid #D6C7B2', borderRadius: '4px', background: '#FFF' }}>
                    <option value="Banarasi Heritage">Banarasi Heritage</option>
                    <option value="Pure Kanjivaram Silk">Pure Kanjivaram Silk</option>
                    <option value="Festive Splendour">Festive Splendour</option>
                    <option value="Designer Edit">Designer Edit</option>
                    <option value="Daily Luxe">Daily Luxe</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#554840', marginBottom: '0.3rem' }}>Fabric *</label>
                  <input type="text" value={formData.fabric} onChange={e => setFormData({...formData, fabric: e.target.value})} required style={{ width: '100%', padding: '0.6rem', border: '1px solid #D6C7B2', borderRadius: '4px' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#554840', marginBottom: '0.3rem' }}>Price (INR) *</label>
                  <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required style={{ width: '100%', padding: '0.6rem', border: '1px solid #D6C7B2', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#554840', marginBottom: '0.3rem' }}>Original Price</label>
                  <input type="number" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} style={{ width: '100%', padding: '0.6rem', border: '1px solid #D6C7B2', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#554840', marginBottom: '0.3rem' }}>Stock Quantity *</label>
                  <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required style={{ width: '100%', padding: '0.6rem', border: '1px solid #D6C7B2', borderRadius: '4px' }} />
                </div>
              </div>

              {/* Product Picture Input Section */}
              <div style={{ background: '#FFF', padding: '1rem', border: '1px solid #EAE0D5', borderRadius: '6px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#7A1C2E', marginBottom: '0.5rem' }}>📷 Product Picture</label>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#665A52' }}>Upload New Image File:</span>
                    <input type="file" accept="image/*" onChange={handleImageFileUpload} style={{ width: '100%', marginTop: '0.2rem', fontSize: '0.8rem' }} />
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#665A52' }}>Or Image URL / File Path:</span>
                    <input type="text" value={formData.image} onChange={e => handleImageUrlChange(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #D6C7B2', borderRadius: '4px', fontSize: '0.85rem' }} />
                  </div>

                  {imagePreview && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.72rem', color: '#8C7B72', display: 'block', marginBottom: '0.2rem' }}>Current Image Preview:</span>
                      <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #C8A96E' }} />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#554840', marginBottom: '0.3rem' }}>Reason for Update (Saved in Audit History)</label>
                <input type="text" placeholder="e.g. Restocked 20 units / Updated product picture" value={formData.updateReason} onChange={e => setFormData({...formData, updateReason: e.target.value})} style={{ width: '100%', padding: '0.6rem', border: '1px solid #D6C7B2', borderRadius: '4px' }} />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" style={{ flex: 1, padding: '0.75rem', background: '#7A1C2E', color: '#FFF', border: 'none', cursor: 'pointer', fontWeight: 600, borderRadius: '4px' }}>
                  Update Product
                </button>
                <button type="button" onClick={() => { setEditingSaree(null); resetForm(); }} style={{ flex: 1, padding: '0.75rem', background: '#8C7B72', color: '#FFF', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audit Trail & Inventory History Modal */}
      {historySaree && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '1rem' }}>
          <div style={{ background: '#FAF6F0', padding: '2rem', maxWidth: '650px', width: '100%', maxHeight: '85vh', overflowY: 'auto', borderRadius: '8px', border: '1px solid #C8A96E', boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontFamily: 'Georgia, serif', color: '#7A1C2E', margin: 0 }}>Audit Trail &amp; Inventory Logs</h2>
                <p style={{ fontSize: '0.85rem', color: '#665A52', margin: '0.2rem 0 0' }}>Product: <strong>{historySaree.name}</strong> ({historySaree.id})</p>
              </div>
              <button onClick={() => setHistorySaree(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#7A1C2E' }}>×</button>
            </div>

            {/* Product Overview Summary */}
            <div style={{ background: '#FFF', padding: '1rem', borderRadius: '6px', border: '1px solid #EAE0D5', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.8rem' }}>
              <div>
                <div style={{ color: '#8C7B72' }}>Created By:</div>
                <div style={{ fontWeight: 700, color: '#2C2420' }}>{historySaree.createdBy?.name || 'Aarav Gupta'} ({historySaree.createdBy?.role || 'ADMIN'})</div>
                <div style={{ color: '#908278', fontSize: '0.72rem' }}>{historySaree.createdBy?.email || 'admin@sapnasarees.com'}</div>
              </div>
              <div>
                <div style={{ color: '#8C7B72' }}>Last Updated By:</div>
                <div style={{ fontWeight: 700, color: '#2C2420' }}>{historySaree.updatedBy?.name || 'Aarav Gupta'} ({historySaree.updatedBy?.role || 'ADMIN'})</div>
                <div style={{ color: '#908278', fontSize: '0.72rem' }}>
                  {historySaree.updatedBy?.timestamp ? new Date(historySaree.updatedBy.timestamp).toLocaleString('en-IN') : 'N/A'}
                </div>
              </div>
            </div>

            {/* Inventory Stock Movements */}
            <h3 style={{ fontFamily: 'Georgia, serif', color: '#2C2420', fontSize: '1.1rem', marginBottom: '0.75rem' }}>📦 Stock Movement History</h3>
            {(!historySaree.inventoryLog || historySaree.inventoryLog.length === 0) ? (
              <p style={{ fontSize: '0.8rem', color: '#8C7B72' }}>No stock movement logs recorded yet.</p>
            ) : (
              <div style={{ background: '#FFF', border: '1px solid #EAE0D5', borderRadius: '6px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr style={{ background: '#F5EBE6', textTransform: 'uppercase', fontSize: '0.7rem', color: '#7A1C2E', textAlign: 'left' }}>
                      <th style={{ padding: '0.6rem' }}>Date &amp; Time</th>
                      <th style={{ padding: '0.6rem' }}>Movement</th>
                      <th style={{ padding: '0.6rem' }}>Updated By</th>
                      <th style={{ padding: '0.6rem' }}>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historySaree.inventoryLog.map((log, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #FAF6F0' }}>
                        <td style={{ padding: '0.6rem', color: '#665A52' }}>
                          {log.timestamp ? new Date(log.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
                        </td>
                        <td style={{ padding: '0.6rem', fontWeight: 700 }}>
                          <span style={{ color: log.change > 0 ? '#2E7D32' : log.change < 0 ? '#D32F2F' : '#554840' }}>
                            {log.previousStock} ➔ {log.newStock} ({log.change > 0 ? `+${log.change}` : log.change})
                          </span>
                        </td>
                        <td style={{ padding: '0.6rem', color: '#2C2420' }}>
                          {log.updatedBy?.name || 'Staff'} <span style={{ color: '#8C7B72' }}>({log.updatedBy?.role || 'ADMIN'})</span>
                        </td>
                        <td style={{ padding: '0.6rem', color: '#665A52' }}>{log.reason || 'Inventory Adjustment'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Catalog Edits Audit Log */}
            <h3 style={{ fontFamily: 'Georgia, serif', color: '#2C2420', fontSize: '1.1rem', marginBottom: '0.75rem' }}>📝 Catalog Edits Audit History</h3>
            {(!historySaree.auditLog || historySaree.auditLog.length === 0) ? (
              <p style={{ fontSize: '0.8rem', color: '#8C7B72' }}>No audit history records available.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {historySaree.auditLog.map((entry, idx) => (
                  <div key={idx} style={{ background: '#FFF', padding: '0.85rem', borderRadius: '6px', border: '1px solid #EAE0D5', borderLeft: '4px solid #7A1C2E' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 700, color: '#7A1C2E', textTransform: 'uppercase' }}>{entry.action}</span>
                      <span style={{ color: '#908278' }}>{entry.timestamp ? new Date(entry.timestamp).toLocaleString('en-IN') : ''}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#2C2420' }}>{entry.details}</div>
                    <div style={{ fontSize: '0.72rem', color: '#706259', marginTop: '0.3rem' }}>
                      By: <strong>{entry.updatedBy?.name || 'Aarav Gupta'}</strong> ({entry.updatedBy?.role || 'ADMIN'}) &bull; {entry.updatedBy?.email}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
