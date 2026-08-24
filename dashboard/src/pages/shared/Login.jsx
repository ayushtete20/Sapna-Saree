import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login, activePortalRole, setActivePortalRole } = useAuth();
  
  // Set default active tab based on detected subdomain / path (defaulting to Owner or Admin or Employee)
  const [selectedRole, setSelectedRole] = useState(
    activePortalRole && activePortalRole !== 'ANY' ? activePortalRole : 'OWNER'
  );
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Set default credentials when switching role tab
  useEffect(() => {
    if (selectedRole === 'OWNER') {
      setEmail('owner@sapnasarees.com');
      setPassword('owner123');
    } else if (selectedRole === 'ADMIN') {
      setEmail('admin@sapnasarees.com');
      setPassword('admin123');
    } else if (selectedRole === 'EMPLOYEE') {
      setEmail('employee@sapnasarees.com');
      setPassword('employee123');
    }
    setError('');
  }, [selectedRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password, selectedRole);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const portalMeta = {
    OWNER: {
      title: 'Executive Owner Suite',
      badge: '👑 Founder & Director Level',
      desc: 'Full Atelier control: Financial oversight, net revenue, staff approvals, and weaver looms.',
      accent: '#C8A96E',
      bgHeader: 'linear-gradient(135deg, #7A1C2E 0%, #5C1220 100%)',
    },
    ADMIN: {
      title: 'Operations Admin Portal',
      badge: '🛠️ General Management',
      desc: 'Manage saree collections, catalog metadata, client orders, shipments & staff requests.',
      accent: '#E8D5A3',
      bgHeader: 'linear-gradient(135deg, #2C2420 0%, #1A1412 100%)',
    },
    EMPLOYEE: {
      title: 'Staff Atelier Desk',
      badge: '👗 Inventory & Dispatch',
      desc: 'Catalog inventory updates, order packing tracking, and customer dispatch handling.',
      accent: '#C8A96E',
      bgHeader: 'linear-gradient(135deg, #5C1220 0%, #2C2420 100%)',
    }
  };

  const currentMeta = portalMeta[selectedRole] || portalMeta.OWNER;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at center, #2C2420 0%, #18140F 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decorative Gold Grid Lines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(rgba(200, 169, 110, 0.08) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: '520px',
        width: '100%',
        background: '#FAF8F5',
        boxShadow: '0 30px 70px rgba(0,0,0,0.6)',
        border: '1px solid rgba(200,169,110,0.5)',
        borderRadius: '2px',
        position: 'relative',
        zIndex: 10,
        overflow: 'hidden'
      }}>
        {/* Top Header Panel */}
        <div style={{
          background: currentMeta.bgHeader,
          padding: '2rem 2rem 1.75rem',
          textAlign: 'center',
          color: '#FAF8F5',
          borderBottom: '2px solid #C8A96E',
          position: 'relative'
        }}>
          {/* Royal Crest Mark */}
          <div style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 12px',
            borderRadius: '50%',
            border: '2px solid #C8A96E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(200, 169, 110, 0.15)',
            boxShadow: '0 0 16px rgba(200, 169, 110, 0.3)'
          }}>
            <span style={{ fontSize: '1.2rem', color: '#E8D5A3' }}>✦</span>
          </div>

          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '9px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: currentMeta.accent,
            margin: '0 0 4px',
            fontWeight: 600
          }}>
            Sapna Sarees by Lavichitra
          </p>

          <h1 style={{
            fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
            fontSize: '1.75rem',
            fontWeight: 500,
            color: '#FAF8F5',
            margin: '0 0 6px'
          }}>
            {currentMeta.title}
          </h1>

          <span style={{
            display: 'inline-block',
            padding: '3px 12px',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(200,169,110,0.4)',
            fontSize: '10px',
            color: '#FAF8F5',
            letterSpacing: '0.08em',
            borderRadius: '2px'
          }}>
            {currentMeta.badge}
          </span>
        </div>

        {/* Dedicated Role Subdomain / Portal Selector */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          background: '#F4EFEA',
          borderBottom: '1px solid rgba(200,169,110,0.3)'
        }}>
          {[
            { role: 'OWNER', label: '👑 Owner', sub: 'Executive' },
            { role: 'ADMIN', label: '🛠️ Admin', sub: 'Operations' },
            { role: 'EMPLOYEE', label: '👗 Staff', sub: 'Catalog/Orders' }
          ].map(tab => {
            const isActive = selectedRole === tab.role;
            return (
              <button
                key={tab.role}
                type="button"
                onClick={() => {
                  setSelectedRole(tab.role);
                  if (setActivePortalRole) setActivePortalRole(tab.role);
                }}
                style={{
                  padding: '12px 8px',
                  background: isActive ? '#FAF8F5' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #7A1C2E' : '3px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  borderRight: '1px solid rgba(200,169,110,0.2)'
                }}
              >
                <div style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '11px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#7A1C2E' : '#7C6E66',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {tab.label}
                </div>
                <div style={{
                  fontSize: '9px',
                  color: isActive ? '#C8A96E' : '#A89F91',
                  marginTop: '2px'
                }}>
                  {tab.sub}
                </div>
              </button>
            );
          })}
        </div>

        {/* Body & Form */}
        <div style={{ padding: '2rem 2.25rem' }}>
          <p style={{
            fontSize: '11px',
            color: '#7C6E66',
            lineHeight: 1.6,
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}>
            {currentMeta.desc}
          </p>

          {error && (
            <div style={{
              padding: '10px 14px',
              background: '#FADBD8',
              color: '#78281F',
              fontSize: '11px',
              marginBottom: '1.25rem',
              borderLeft: '3px solid #7A1C2E',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>⚠️</span>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: '#7C6E66',
                marginBottom: '6px',
                fontWeight: 600
              }}>
                {selectedRole} Registered Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`${selectedRole.toLowerCase()}@sapnasarees.com`}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid rgba(200,169,110,0.45)',
                  background: '#FFFFFF',
                  color: '#2C2420',
                  outline: 'none',
                  fontSize: '12px',
                  borderRadius: '2px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7A1C2E'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(200,169,110,0.45)'}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: '#7C6E66',
                marginBottom: '6px',
                fontWeight: 600
              }}>
                Secret Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid rgba(200,169,110,0.45)',
                  background: '#FFFFFF',
                  color: '#2C2420',
                  outline: 'none',
                  fontSize: '12px',
                  borderRadius: '2px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7A1C2E'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(200,169,110,0.45)'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="luxury-btn-primary"
              style={{
                padding: '14px',
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: loading ? '#7C6E66' : '#7A1C2E'
              }}
            >
              {loading ? 'Authenticating Staff...' : `Sign In as ${selectedRole}`} ➔
            </button>
          </form>

          {/* Separation Notice */}
          <div style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(200,169,110,0.25)',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              background: '#F4EFEA',
              border: '1px solid rgba(200,169,110,0.3)',
              fontSize: '10px',
              color: '#7C6E66'
            }}>
              🔒 <strong>Isolated Database:</strong> Staff credentials only. Customers must use storefront.
            </div>

            <div style={{ marginTop: '1rem' }}>
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '11px',
                  color: '#7A1C2E',
                  textDecoration: 'none',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                ↗ Switch to Customer Storefront
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
