// dashboard/src/components/security/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute Component
 * Intercepts access to views/routes and enforces role-based and granular permission checks.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string} [props.requiredRole] - Specific role required ('ADMIN', 'OWNER', 'EMPLOYEE')
 * @param {string} [props.requiredPermission] - Boolean permission flag required ('canManageCatalog', 'canManageOrders', 'canViewRevenue')
 * @param {React.ReactNode} [props.fallback] - Optional custom fallback component when unauthorized
 */
export default function ProtectedRoute({ children, requiredRole, requiredPermission, fallback }) {
  const { user, isOwner, isAdmin, loading, canManageCatalog, canManageOrders, canViewRevenue } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'Georgia, serif', color: '#8C7B72' }}>
        Verifying Atelier security credentials...
      </div>
    );
  }

  // 1. Unauthenticated users are blocked
  if (!user) {
    return fallback || (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#78281f', background: '#FDF2F4', border: '1px solid #EAE0D5', borderRadius: '8px' }}>
        <h2>🔒 Access Restricted</h2>
        <p>Please log in with valid Atelier staff credentials to access this dashboard module.</p>
      </div>
    );
  }

  // 2. OWNER role bypasses all granular permission checks
  if (isOwner) {
    return <>{children}</>;
  }

  // 3. Specific role level check (e.g. requiredRole="ADMIN")
  if (requiredRole) {
    const userRole = (user.role || '').toUpperCase();
    const targetRole = requiredRole.toUpperCase();
    if (userRole !== targetRole && !isOwner) {
      return fallback || (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#78281f', background: '#FDF2F4', border: '1px solid #EAE0D5', borderRadius: '8px' }}>
          <h2>⛔ Role Level Restriction</h2>
          <p>This module requires <strong>{targetRole}</strong> level privileges. Your current role is <strong>{userRole}</strong>.</p>
        </div>
      );
    }
  }

  // 4. Granular boolean permission flag check (for EMPLOYEE accounts)
  if (requiredPermission && !isOwner && !isAdmin) {
    let hasFlag = false;

    if (requiredPermission === 'canManageCatalog') hasFlag = canManageCatalog;
    if (requiredPermission === 'canManageOrders') hasFlag = canManageOrders;
    if (requiredPermission === 'canViewRevenue') hasFlag = canViewRevenue;

    if (!hasFlag) {
      return fallback || (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#78281f', background: '#FDF2F4', border: '1px solid #EAE0D5', borderRadius: '8px' }}>
          <h2>⛔ Permission Flag Missing</h2>
          <p>Your account lacks the <strong>{requiredPermission}</strong> permission flag. Please contact an Admin to assign access.</p>
        </div>
      );
    }
  }

  return <>{children}</>;
}
