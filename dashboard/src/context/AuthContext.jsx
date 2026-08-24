import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../utils/config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sapna_dashboard_token') || null);
  const [loading, setLoading] = useState(true);

  // Subdomain & Path Role Detection
  const getDetectedRoleFromLocation = () => {
    const hostname = window.location.hostname.toLowerCase();
    const pathname = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    if (hostname.startsWith('owner.') || pathname.startsWith('/owner') || hash.startsWith('#/owner') || hash === '#owner') {
      return 'OWNER';
    }
    if (hostname.startsWith('admin.') || pathname.startsWith('/admin') || hash.startsWith('#/admin') || hash === '#admin') {
      return 'ADMIN';
    }
    if (hostname.startsWith('employee.') || hostname.startsWith('staff.') || pathname.startsWith('/employee') || hash.startsWith('#/employee') || hash === '#employee') {
      return 'EMPLOYEE';
    }
    return 'ANY';
  };

  const [activePortalRole, setActivePortalRole] = useState(getDetectedRoleFromLocation());

  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setUser(data.user);
          } else {
            logout();
          }
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password, requiredRole = 'ANY') => {
    const res = await fetch(`${API_URL}/auth/staff/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, requiredRole, portalSource: 'dashboard' })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    const roleUpper = data.user.role ? data.user.role.toUpperCase() : '';
    if (roleUpper !== 'ADMIN' && roleUpper !== 'OWNER' && roleUpper !== 'EMPLOYEE') {
      throw new Error('Access denied. Only Employee, Admin & Owner accounts may access the Atelier Staff Portal.');
    }

    localStorage.setItem('sapna_dashboard_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('sapna_dashboard_token');
    setToken(null);
    setUser(null);
  };

  const userRole = user?.role ? user.role.toUpperCase() : '';
  const isOwner = userRole === 'OWNER';
  const isAdmin = userRole === 'ADMIN';
  const isEmployee = userRole === 'EMPLOYEE';

  // Granular permission flags
  const canManageCatalog = isOwner || isAdmin || Boolean(user?.permissions?.canManageCatalog);
  const canManageOrders  = isOwner || isAdmin || Boolean(user?.permissions?.canManageOrders);
  const canViewRevenue   = isOwner || Boolean(user?.permissions?.canViewRevenue);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isOwner,
      isAdmin,
      isEmployee,
      activePortalRole,
      setActivePortalRole,
      canManageCatalog,
      canManageOrders,
      canViewRevenue,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
