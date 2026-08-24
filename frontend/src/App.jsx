import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import { DEMO_SAREES } from './utils/demoData';
import { DASHBOARD_URL } from './utils/config';

import './index.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function App() {
  const [page, setPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(DEMO_SAREES[0].id);
  const [sarees, setSarees] = useState(DEMO_SAREES);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Check URL parameters / hash for direct product page linking
  const checkUrlRoute = (allSarees = sarees) => {
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(window.location.search);
    const productParam = searchParams.get('product') || searchParams.get('saree') || searchParams.get('id');

    let targetId = null;
    if (productParam) {
      targetId = productParam;
    } else if (hash.startsWith('#product/')) {
      targetId = hash.replace('#product/', '');
    } else if (hash.startsWith('#saree/')) {
      targetId = hash.replace('#saree/', '');
    } else if (hash === '#catalog') {
      setPage('catalog');
      return;
    }

    if (targetId) {
      setSelectedProductId(targetId);
      setPage('detail');
    }
  };

  useEffect(() => {
    // Fetch Sarees from backend API
    const loadProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        if (data.success && data.products && data.products.length > 0) {
          const formatted = data.products.map(p => ({
            id: p.id,
            name: p.name,
            collection: p.collection || (p.origin ? `${p.origin} Collection` : 'Handloom Heritage'),
            fabric: p.fabric,
            origin: p.origin || 'Varanasi',
            price: Number(p.price),
            originalPrice: p.originalPrice ? Number(p.originalPrice) : Math.round(Number(p.price) * 1.25),
            tag: p.tag || (p.isBestseller ? 'BESTSELLER' : 'NEW IN'),
            hue: p.hue || '#6B1E2E',
            image: p.image || '/images/banarasi_red.png',
            secondaryImage: p.secondaryImage || p.image || '/images/kanjivaram_ivory.png',
            weaveTime: p.weaveTime || '14 Days Handloom',
            silkMark: p.silkMark !== undefined ? p.silkMark : true,
            stock: p.stock !== undefined ? p.stock : 10,
            description: p.description || `${p.name} handcrafted with authentic zari.`
          }));

          // Merge backend products with fallback demo sarees by unique id
          const idMap = new Map();
          formatted.forEach(item => idMap.set(String(item.id), item));
          DEMO_SAREES.forEach(item => {
            if (!idMap.has(String(item.id))) idMap.set(String(item.id), item);
          });

          const merged = Array.from(idMap.values());
          setSarees(merged);
          checkUrlRoute(merged);
        } else {
          setSarees(DEMO_SAREES);
          checkUrlRoute(DEMO_SAREES);
        }
      } catch (err) {
        setSarees(DEMO_SAREES);
        checkUrlRoute(DEMO_SAREES);
      }
    };

    loadProducts();

    // Listen to hash changes for deep linking
    const handleHashChange = () => checkUrlRoute();
    window.addEventListener('hashchange', handleHashChange);

    // Check stored user session
    const token = localStorage.getItem('sapna_token');
    const storedUser = localStorage.getItem('sapna_user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLogin = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/customer/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    localStorage.setItem('sapna_token', data.token);
    localStorage.setItem('sapna_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const handleRegister = async (name, email, password, phone) => {
    const res = await fetch(`${API_URL}/auth/customer/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    localStorage.setItem('sapna_token', data.token);
    localStorage.setItem('sapna_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('sapna_token');
    localStorage.removeItem('sapna_user');
    setUser(null);
  };

  const handleAddToCart = (saree) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === saree.id);
      if (existing) {
        return prev.map(item => item.id === saree.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...saree, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    if (!user) {
      setIsCartOpen(false);
      setIsAuthOpen(true);
      alert('Please Sign In or Register a profile to place your order.');
      return;
    }

    try {
      const token = localStorage.getItem('sapna_token');
      const totalVal = cart.reduce((sum, it) => sum + (it.price * it.quantity), 0);

      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart.map(it => ({
            id: it.id,
            productId: it.id,
            name: it.name,
            price: it.price,
            quantity: it.quantity
          })),
          totalAmount: totalVal
        })
      });

      const data = await res.json();
      if (data.success && data.order) {
        setConfirmedOrder(data.order);
        setCart([]);
        setIsCartOpen(false);
      } else {
        alert(data.message || 'Failed to place order.');
      }
    } catch (err) {
      alert('Error connecting to backend API engine.');
    }
  };

  const navigateTo = (targetPage, productId = null) => {
    setPage(targetPage);
    if (productId) {
      setSelectedProductId(productId);
      window.location.hash = `product/${productId}`;
    } else if (targetPage === 'catalog') {
      window.location.hash = 'catalog';
    } else {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedSaree = sarees.find(s => String(s.id) === String(selectedProductId)) || sarees[0];

  return (
    <div className="sapna-app min-h-screen bg-[#FAF8F5] font-sans text-charcoal selection:bg-primary selection:text-white">
      <Navbar 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => navigateTo('catalog')}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        onLogout={handleLogout}
        navigateTo={navigateTo}
        isHomePage={page === 'home'}
      />

      {page === 'home' && (
        <Home 
          sarees={sarees} 
          onSelectProduct={(id) => navigateTo('detail', id)} 
          onAddToCart={handleAddToCart}
          navigateTo={navigateTo}
        />
      )}

      {page === 'catalog' && (
        <Catalog 
          sarees={sarees} 
          onSelectProduct={(id) => navigateTo('detail', id)} 
          onAddToCart={handleAddToCart}
        />
      )}

      {page === 'detail' && (
        <ProductDetail 
          saree={selectedSaree} 
          onAddToCart={handleAddToCart}
          navigateTo={navigateTo}
        />
      )}

      <Footer navigateTo={navigateTo} />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        onCheckout={handleCheckout}
        user={user}
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      <OrderConfirmationModal 
        isOpen={Boolean(confirmedOrder)}
        onClose={() => setConfirmedOrder(null)}
        order={confirmedOrder}
      />
    </div>
  );
}
