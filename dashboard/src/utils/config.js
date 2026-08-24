const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_URL = import.meta.env.VITE_API_URL || (isLocalhost ? 'http://localhost:8000/api' : '/api');
export const STOREFRONT_URL = import.meta.env.VITE_STOREFRONT_URL || (isLocalhost ? 'http://localhost:3000' : '/');
