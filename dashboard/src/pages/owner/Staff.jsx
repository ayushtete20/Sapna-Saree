import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../utils/config';

const PERMISSION_PRESETS = [
  {
    label: '👗 Saree Catalog Only',
    desc: 'Can manage the product catalog, add/edit/update inventory. Cannot view orders.',
    canManageCatalog: true,
    canManageOrders: false
  },
  {
    label: '📦 Orders & Shipping Only',
    desc: 'Can process, update, and manage customer orders & shipping. Cannot edit catalog.',
    canManageCatalog: false,
    canManageOrders: true
  },
  {
    label: '✅ Both — Full Employee Access',
    desc: 'Can manage both the Saree Catalog and Orders & Shipping modules.',
    canManageCatalog: true,
    canManageOrders: true
  }
];

export default function Staff() {
  const { token, isAdmin, isOwner, user: currentUser } = useAuth();
  const [staff, setStaff] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [permissionsModal, setPermissionsModal] = useState(null); // holds staff member being edited
  const [savingPermissions, setSavingPermissions] = useState(false);

  // Create form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [selectedPreset, setSelectedPreset] = useState(2); // default: Both

  // Permission editor state (for existing employee)
  const [editCanManageCatalog, setEditCanManageCatalog] = useState(true);
  const [editCanManageOrders, setEditCanManageOrders] = useState(true);

  const fetchStaff = () => {
    fetch(`${API_URL}/employees`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.staff) setStaff(data.staff);
      });
  };

  useEffect(() => {
    fetchStaff();
  }, [token]);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    const preset = PERMISSION_PRESETS[selectedPreset];
    try {
      const res = await fetch(`${API_URL}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          canManageCatalog: role === 'EMPLOYEE' ? preset.canManageCatalog : true,
          canManageOrders:  role === 'EMPLOYEE' ? preset.canManageOrders  : true,
          canViewRevenue: false
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setShowAddModal(false);
        setName(''); setEmail(''); setPassword('');
        setSelectedPreset(2);
        fetchStaff();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Failed to submit staff account request');
    }
  };

  const openPermissionsModal = (member) => {
    setEditCanManageCatalog(Boolean(member.canManageCatalog));
    setEditCanManageOrders(Boolean(member.canManageOrders));
    setPermissionsModal(member);
  };

  const handleSavePermissions = async () => {
    if (!permissionsModal) return;
    setSavingPermissions(true);
    try {
      const res = await fetch(`${API_URL}/employees/${permissionsModal.id}/permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          canManageCatalog: editCanManageCatalog,
          canManageOrders:  editCanManageOrders,
          canViewRevenue: false
        })
      });
      const data = await res.json();
      if (data.success) {
        setStaff(prev => prev.map(s =>
          s.id === permissionsModal.id
            ? { ...s, canManageCatalog: editCanManageCatalog, canManageOrders: editCanManageOrders }
            : s
        ));
        setPermissionsModal(null);
      } else {
        alert(data.message || 'Failed to update permissions');
      }
    } catch (err) {
      alert('Failed to save permissions');
    } finally {
      setSavingPermissions(false);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm('Request deletion for this staff account?')) return;
    try {
      const res = await fetch(`${API_URL}/employees/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      alert(data.message);
      fetchStaff();
    } catch (err) {
      alert('Failed to submit deletion request');
    }
  };

  const getAccessLabel = (member) => {
    if (member.role !== 'EMPLOYEE') return null;
    const c = member.canManageCatalog;
    const o = member.canManageOrders;
    if (c && o) return { text: 'Both Modules', color: '#1a5276', bg: '#d6eaf8' };
    if (c)      return { text: 'Catalog Only', color: '#4a235a', bg: '#e8daef' };
    if (o)      return { text: 'Orders Only',  color: '#1e8449', bg: '#d5f5e3' };
    return       { text: 'No Access',         color: '#922b21', bg: '#fadbd8' };
  };

  if (!isAdmin && !isOwner) {
    return <div style={{ color: '#78281f', padding: '2rem' }}>Access Denied. Admin or Owner credentials required.</div>;
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#2C2420', margin: 0 }}>Staff Account &amp; Permission Management</h1>
          <p style={{ fontSize: '0.85rem', color: '#8C7B72', margin: '0.2rem 0 0' }}>
            Create employee accounts, set their dashboard access (Catalog / Orders / Both), and manage account lifecycle.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{ padding: '0.75rem 1.5rem', background: '#7A1C2E', color: '#FAF6F0', border: 'none', cursor: 'pointer', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '4px' }}
        >
          + Add Staff Account
        </button>
      </div>

      {/* ── ADD STAFF MODAL ─────────────────────────────────────── */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#FAF6F0', padding: '2rem', maxWidth: '520px', width: '100%', border: '1px solid #C8A96E', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', color: '#7A1C2E', marginTop: 0 }}>Request New Staff Account</h3>
            <p style={{ fontSize: '0.8rem', color: '#8C7B72', marginBottom: '1.25rem' }}>
              No Owner password required. Account will enter the Owner approval queue.
            </p>

            <form onSubmit={handleAddStaff} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="Staff Full Name" value={name} onChange={e => setName(e.target.value)} required
                style={{ padding: '0.6rem', border: '1px solid #D6C7B2', borderRadius: '4px' }} />
              <input type="email" placeholder="Staff Work Email" value={email} onChange={e => setEmail(e.target.value)} required
                style={{ padding: '0.6rem', border: '1px solid #D6C7B2', borderRadius: '4px' }} />
              <input type="password" placeholder="Staff Password" value={password} onChange={e => setPassword(e.target.value)} required
                style={{ padding: '0.6rem', border: '1px solid #D6C7B2', borderRadius: '4px' }} />

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#554840', marginBottom: '0.3rem' }}>Account Role</label>
                <select value={role} onChange={e => setRole(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid #D6C7B2', borderRadius: '4px', background: '#FFF' }}>
                  <option value="EMPLOYEE">Employee</option>
                  <option value="ADMIN">Admin (Store &amp; Staff Manager)</option>
                </select>
              </div>

              {/* Dashboard Access Permissions — only for EMPLOYEE */}
              {role === 'EMPLOYEE' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#7A1C2E', marginBottom: '0.6rem' }}>
                    🔒 Dashboard Access Permissions
                  </label>
                  <p style={{ fontSize: '0.75rem', color: '#8C7B72', margin: '0 0 0.75rem' }}>
                    Select which sections of the dashboard this employee can access.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {PERMISSION_PRESETS.map((preset, idx) => (
                      <label
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          padding: '0.85rem 1rem',
                          border: `2px solid ${selectedPreset === idx ? '#7A1C2E' : '#EAE0D5'}`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          background: selectedPreset === idx ? '#FDF2F4' : '#FFF',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <input
                          type="radio"
                          name="permissionPreset"
                          checked={selectedPreset === idx}
                          onChange={() => setSelectedPreset(idx)}
                          style={{ marginTop: '0.15rem', accentColor: '#7A1C2E' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#2C2420' }}>{preset.label}</div>
                          <div style={{ fontSize: '0.75rem', color: '#665A52', marginTop: '0.1rem' }}>{preset.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" style={{ flex: 1, padding: '0.75rem', background: '#7A1C2E', color: '#FFF', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 600 }}>
                  Submit Request
                </button>
                <button type="button" onClick={() => setShowAddModal(false)}
                  style={{ flex: 1, padding: '0.75rem', background: '#8C7B72', color: '#FFF', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── SET PERMISSIONS MODAL ────────────────────────────────── */}
      {permissionsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#FAF6F0', padding: '2rem', maxWidth: '480px', width: '100%', border: '1px solid #C8A96E', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', color: '#7A1C2E', marginTop: 0 }}>
              Set Dashboard Access Permissions
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#665A52', marginBottom: '1.5rem' }}>
              Employee: <strong>{permissionsModal.name}</strong> ({permissionsModal.email})
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {/* Saree Catalog toggle */}
              <label style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                border: `2px solid ${editCanManageCatalog ? '#7A1C2E' : '#EAE0D5'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                background: editCanManageCatalog ? '#FDF2F4' : '#FFF'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#2C2420' }}>👗 Saree Catalog</div>
                  <div style={{ fontSize: '0.75rem', color: '#665A52', marginTop: '0.1rem' }}>Add, edit, and manage saree products &amp; inventory</div>
                </div>
                <input
                  type="checkbox"
                  checked={editCanManageCatalog}
                  onChange={e => setEditCanManageCatalog(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#7A1C2E', cursor: 'pointer' }}
                />
              </label>

              {/* Orders & Shipping toggle */}
              <label style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                border: `2px solid ${editCanManageOrders ? '#7A1C2E' : '#EAE0D5'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                background: editCanManageOrders ? '#FDF2F4' : '#FFF'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#2C2420' }}>📦 Orders &amp; Shipping</div>
                  <div style={{ fontSize: '0.75rem', color: '#665A52', marginTop: '0.1rem' }}>Process, track, and update customer orders</div>
                </div>
                <input
                  type="checkbox"
                  checked={editCanManageOrders}
                  onChange={e => setEditCanManageOrders(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#7A1C2E', cursor: 'pointer' }}
                />
              </label>

              {/* Summary chip */}
              <div style={{ padding: '0.6rem 1rem', background: '#F5EBE6', borderRadius: '6px', fontSize: '0.8rem', color: '#554840' }}>
                {editCanManageCatalog && editCanManageOrders && <span>✅ Full Access — Catalog &amp; Orders</span>}
                {editCanManageCatalog && !editCanManageOrders && <span>👗 Catalog Only</span>}
                {!editCanManageCatalog && editCanManageOrders && <span>📦 Orders Only</span>}
                {!editCanManageCatalog && !editCanManageOrders && <span style={{ color: '#922b21' }}>⚠️ No Access — employee will see an empty dashboard</span>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleSavePermissions}
                disabled={savingPermissions}
                style={{ flex: 1, padding: '0.75rem', background: '#7A1C2E', color: '#FFF', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 600 }}
              >
                {savingPermissions ? 'Saving…' : 'Save Permissions'}
              </button>
              <button
                onClick={() => setPermissionsModal(null)}
                style={{ flex: 1, padding: '0.75rem', background: '#8C7B72', color: '#FFF', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STAFF TABLE ─────────────────────────────────────────── */}
      <div style={{ background: '#FFFFFF', border: '1px solid rgba(200,169,110,0.25)', borderRadius: '6px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#FAF6F0', borderBottom: '1px solid rgba(200,169,110,0.3)', color: '#7A1C2E' }}>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Email</th>
              <th style={{ padding: '1rem' }}>Role</th>
              <th style={{ padding: '1rem' }}>Dashboard Access</th>
              <th style={{ padding: '1rem' }}>Account Status</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(s => {
              const accessLabel = getAccessLabel(s);
              return (
                <tr key={s.id} style={{ borderBottom: '1px solid #FAF6F0' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{s.name}</td>
                  <td style={{ padding: '1rem', color: '#665A52' }}>{s.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.2rem 0.5rem',
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      background: s.role === 'OWNER' ? '#7A1C2E' : s.role === 'ADMIN' ? '#2C2420' : '#8C7B72',
                      color: '#FAF6F0',
                      borderRadius: '3px'
                    }}>
                      {s.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {accessLabel ? (
                      <span style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 600, borderRadius: '20px', background: accessLabel.bg, color: accessLabel.color }}>
                        {accessLabel.text}
                      </span>
                    ) : (
                      <span style={{ color: '#8C7B72', fontSize: '0.8rem' }}>Full Access</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.6rem',
                      borderRadius: '3px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      background: s.accountStatus === 'ACTIVE' ? '#d4efdf' : s.accountStatus === 'PENDING_DELETION' ? '#faded4' : '#fcf3cf',
                      color: s.accountStatus === 'ACTIVE' ? '#196f3d' : s.accountStatus === 'PENDING_DELETION' ? '#a93226' : '#7d6608'
                    }}>
                      {s.accountStatus === 'ACTIVE' ? '🟢 Active' : s.accountStatus === 'PENDING_DELETION' ? '🔴 Pending Deletion' : '🟡 Pending Approval'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {/* Set Permissions — only for EMPLOYEE accounts */}
                      {s.role === 'EMPLOYEE' && s.id !== currentUser?.id && (
                        <button
                          onClick={() => openPermissionsModal(s)}
                          style={{ background: 'none', border: '1px solid #7A1C2E', color: '#7A1C2E', padding: '0.3rem 0.6rem', fontSize: '0.73rem', cursor: 'pointer', borderRadius: '3px', fontWeight: 600 }}
                        >
                          🔒 Set Access
                        </button>
                      )}
                      {/* Delete / Request Deletion */}
                      {s.id !== currentUser?.id && (
                        <button
                          onClick={() => handleDeleteStaff(s.id)}
                          style={{ background: 'none', border: '1px solid #c0392b', color: '#c0392b', padding: '0.3rem 0.6rem', fontSize: '0.73rem', cursor: 'pointer', borderRadius: '3px' }}
                        >
                          Request Deletion
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
