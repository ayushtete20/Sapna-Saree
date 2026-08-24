import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../utils/config';

export default function Approvals() {
  const { token, isOwner } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStaff = () => {
    fetch(`${API_URL}/employees`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.staff) {
          const pending = data.staff.filter(s => s.accountStatus === 'PENDING_APPROVAL' || s.accountStatus === 'PENDING_DELETION');
          setRequests(pending);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStaff();
  }, [token]);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${API_URL}/employees/${id}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      alert(data.message);
      fetchStaff();
    } catch (err) {
      alert('Failed to approve request');
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`${API_URL}/employees/${id}/reject`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      alert(data.message);
      fetchStaff();
    } catch (err) {
      alert('Failed to reject request');
    }
  };

  if (!isOwner) {
    return <div style={{ padding: '2rem', color: '#78281f' }}>Access Denied. Owner credentials required.</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#2C2420', margin: 0 }}>Staff Account Approvals &amp; Requests</h1>
        <p style={{ fontSize: '0.85rem', color: '#8C7B72', margin: '0.2rem 0 0' }}>Review and approve staff account creation and deletion requests submitted by Admins.</p>
      </div>

      {requests.length === 0 ? (
        <div style={{ background: '#FFFFFF', padding: '3rem', textAlign: 'center', border: '1px solid rgba(200,169,110,0.3)' }}>
          <p style={{ fontSize: '1.1rem', color: '#2C2420', fontFamily: 'Georgia, serif', margin: 0 }}>✨ No Pending Account Requests</p>
          <p style={{ fontSize: '0.85rem', color: '#8C7B72', margin: '0.5rem 0 0' }}>All submitted staff account requests have been reviewed and activated.</p>
        </div>
      ) : (
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(200,169,110,0.25)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#FAF6F0', borderBottom: '1px solid rgba(200,169,110,0.3)', color: '#7A1C2E' }}>
                <th style={{ padding: '1rem' }}>Staff Name</th>
                <th style={{ padding: '1rem' }}>Email Address</th>
                <th style={{ padding: '1rem' }}>Assigned Role</th>
                <th style={{ padding: '1rem' }}>Request Type</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id} style={{ borderBottom: '1px solid #FAF6F0' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{req.name}</td>
                  <td style={{ padding: '1rem' }}>{req.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '0.2rem 0.5rem', background: '#2C2420', color: '#FFF', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                      {req.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.6rem',
                      borderRadius: '3px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      background: req.accountStatus === 'PENDING_DELETION' ? '#faded4' : '#fcf3cf',
                      color: req.accountStatus === 'PENDING_DELETION' ? '#a93226' : '#7d6608'
                    }}>
                      {req.accountStatus === 'PENDING_DELETION' ? '🔴 Deletion Request' : '🟡 Account Activation Request'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => handleApprove(req.id)}
                      style={{ padding: '0.4rem 0.8rem', background: '#196f3d', color: '#FFF', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}
                    >
                      ✓ Approve &amp; Activate
                    </button>
                    <button 
                      onClick={() => handleReject(req.id)}
                      style={{ padding: '0.4rem 0.8rem', background: '#c0392b', color: '#FFF', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}
                    >
                      ✕ Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
