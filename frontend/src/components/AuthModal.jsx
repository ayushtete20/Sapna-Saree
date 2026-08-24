import React, { useState } from 'react';
import { DASHBOARD_URL } from '../utils/config';

export default function AuthModal({ isOpen, onClose, onLogin, onRegister }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await onRegister(name, email, password, phone);
      } else {
        await onLogin(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillCustomerDemo = () => {
    setEmail('user@sapnasarees.com');
    setPassword('user123');
    setIsRegister(false);
    setError('');
  };

  const inputStyle = {
    width: '100%',
    height: '48px',
    minHeight: '48px',
    padding: '12px 16px',
    border: '1px solid rgba(200,169,110,0.4)',
    background: '#FFFFFF',
    fontFamily: "'Montserrat', 'Jost', sans-serif",
    fontSize: '14px',
    color: '#2C2420',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
    borderRadius: '2px',
  };

  const labelStyle = {
    display: 'block',
    fontFamily: "'Montserrat', 'Jost', sans-serif",
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    color: '#7C6E66',
    marginBottom: '6px',
    fontWeight: 600,
  };

  return (
    /* Overlay */
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(44,36,32,0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 3000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* Modal card */}
      <div
        onClick={e => e.stopPropagation()}
        className="grid grid-cols-1 md:grid-cols-2 max-w-3xl w-full bg-[#FAF8F5] relative shadow-2xl border border-[#C8A96E]/40 max-h-[90vh] overflow-y-auto rounded-xs"
      >
        {/* LEFT — decorative saree image panel (hidden on small mobile) */}
        <div className="hidden md:block relative overflow-hidden min-h-[480px] bg-[#7A1C2E]">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=80"
            alt="Sapna Sarees"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }}
          />
          {/* Overlay gradient */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(122,28,46,0.92) 0%, rgba(44,36,32,0.4) 100%)',
          }} />
          {/* Gold border frame */}
          <div style={{
            position: 'absolute', inset: '16px',
            border: '1px solid rgba(200,169,110,0.40)',
            pointerEvents: 'none',
          }} />
          {/* Brand text */}
          <div style={{
            position: 'absolute', bottom: '36px', left: '32px', right: '32px',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid rgba(200,169,110,0.8)',
              marginBottom: '14px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}>
              <img
                src="/images/sapna_saree_logo.jpg"
                alt="Sapna Saree Logo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <p style={{
              fontFamily: "'Montserrat', 'Jost', sans-serif", fontSize: '9px',
              letterSpacing: '0.24em', textTransform: 'uppercase',
              color: '#C8A96E', marginBottom: '8px',
            }}>
              ✦ Customer Atelier Access
            </p>
            <h2 style={{
              fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
              fontSize: '32px', fontWeight: 400,
              color: '#FAF8F5', lineHeight: 1.15,
              margin: '0 0 10px',
            }}>
              Welcome to<br /><em style={{ color: '#E8D5A3', fontStyle: 'italic' }}>Sapna Sarees</em>
            </h2>
            <p style={{
              fontFamily: "'Montserrat', 'Jost', sans-serif", fontSize: '12px',
              color: 'rgba(250,246,240,0.78)', lineHeight: 1.7,
            }}>
              Access your personal wardrobe wishlist, order tracking, and bespoke bridal saree consultations.
            </p>
          </div>
        </div>

        {/* RIGHT — form panel */}
        <div style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column', background: '#FAF8F5' }}>
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '16px', right: '18px',
              background: 'none', border: 'none',
              fontSize: '22px', cursor: 'pointer',
              color: '#7C6E66', lineHeight: 1,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = '#2C2420'}
            onMouseLeave={e => e.target.style.color = '#7C6E66'}
          >
            ✕
          </button>

          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <span style={{
              fontFamily: "'Montserrat', 'Jost', sans-serif", fontSize: '9px',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: '#C8A96E', display: 'block', marginBottom: '6px', fontWeight: 600,
            }}>
              {isRegister ? 'New Customer Registration' : 'Customer Sign In'}
            </span>
            <h3 style={{
              fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
              fontSize: '26px', fontWeight: 500,
              color: '#2C2420', lineHeight: 1.2, margin: 0,
            }}>
              {isRegister ? 'Join the Sapna Heritage' : 'Welcome Back'}
            </h3>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: '10px 14px',
              background: '#fadbd8', color: '#78281f',
              fontSize: '12px', marginBottom: '16px',
              borderLeft: '3px solid #7A1C2E',
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {isRegister && (
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text" value={name}
                  onChange={e => setName(e.target.value)}
                  required placeholder="e.g., Priya Sharma"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#C8A96E'}
                  onBlur={e => e.target.style.borderColor = 'rgba(200,169,110,0.4)'}
                />
              </div>
            )}
            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                required placeholder="you@example.com"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#C8A96E'}
                onBlur={e => e.target.style.borderColor = 'rgba(200,169,110,0.4)'}
              />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                required placeholder="Enter your password"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#C8A96E'}
                onBlur={e => e.target.style.borderColor = 'rgba(200,169,110,0.4)'}
              />
            </div>
            {isRegister && (
              <div>
                <label style={labelStyle}>Phone Number (Optional)</label>
                <input
                  type="tel" value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#C8A96E'}
                  onBlur={e => e.target.style.borderColor = 'rgba(200,169,110,0.4)'}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                height: '48px',
                minHeight: '48px',
                padding: '14px',
                background: loading ? '#7C6E66' : '#7A1C2E',
                color: '#FAF8F5',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'Montserrat', 'Jost', sans-serif",
                fontSize: '11px', letterSpacing: '0.14em',
                textTransform: 'uppercase', fontWeight: 600,
                transition: 'background 0.25s, transform 0.15s',
                marginTop: '6px',
                boxShadow: '0 4px 12px rgba(122,28,46,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={e => { if (!loading) e.target.style.background = '#5C1220'; }}
              onMouseLeave={e => { if (!loading) e.target.style.background = '#7A1C2E'; }}
            >
              {loading ? 'Authenticating…' : isRegister ? 'Create Customer Account' : 'Sign In to Storefront'}
            </button>
          </form>

          {/* Toggle Register/Login */}
          <div style={{ textAlign: 'center', marginTop: '14px' }}>
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              style={{
                background: 'none', border: 'none',
                fontFamily: "'Montserrat', 'Jost', sans-serif",
                fontSize: '12px', color: '#7C6E66',
                cursor: 'pointer', letterSpacing: '0.02em',
              }}
            >
              {isRegister
                ? <>Already have an account? <span style={{ color: '#7A1C2E', fontWeight: 600, textDecoration: 'underline' }}>Sign In</span></>
                : <>New to Sapna Sarees? <span style={{ color: '#7A1C2E', fontWeight: 600, textDecoration: 'underline' }}>Create Account</span></>
              }
            </button>
          </div>

          {/* Customer Quick Fill */}
          <div style={{
            marginTop: '18px', paddingTop: '14px',
            borderTop: '1px solid rgba(200,169,110,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <span style={{
              fontFamily: "'Montserrat', 'Jost', sans-serif", fontSize: '9px',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#7C6E66',
            }}>
              Demo Customer:
            </span>
            <button
              onClick={fillCustomerDemo}
              style={{
                padding: '4px 10px',
                border: '1px solid rgba(200,169,110,0.5)',
                background: '#F4EFEA',
                fontFamily: "'Montserrat', 'Jost', sans-serif",
                fontSize: '10px', cursor: 'pointer',
                color: '#2C2420',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#E8D5A3'}
              onMouseLeave={e => e.currentTarget.style.background = '#F4EFEA'}
            >
              👤 Fill Test Customer
            </button>
          </div>

          {/* Discreet Staff Portal Link */}
          <div style={{
            marginTop: '14px', padding: '10px 14px',
            background: '#2C2420',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderRadius: '2px'
          }}>
            <div>
              <p style={{
                fontFamily: "'Montserrat', 'Jost', sans-serif", fontSize: '8px',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: '#C8A96E', margin: 0, fontWeight: 600
              }}>
                Atelier Staff & Management
              </p>
            </div>
            <a
              href={DASHBOARD_URL}
              target="_blank" rel="noreferrer"
              style={{
                padding: '5px 10px',
                background: '#7A1C2E', color: '#FAF8F5',
                textDecoration: 'none',
                fontFamily: "'Montserrat', 'Jost', sans-serif",
                fontSize: '9px', fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                borderRadius: '2px'
              }}
            >
              Staff Portal ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
