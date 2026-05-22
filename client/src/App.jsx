import React, { useState } from 'react';
import Layout from './components/Layout';
import CartSidebar from './components/CartSidebar';
import { CartProvider, useCart } from './context/CartContext';
import { ToastProvider } from './components/Toast';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Vendors from './pages/Vendors';
import Analytics from './pages/Analytics';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';

function AppInner() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [themeIcon, setThemeIcon] = useState('☀');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const { cartCount } = useCart();

  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    setThemeIcon(isDark ? '☾' : '☀');
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
    setCurrentPage('products');
  };

  const handleNavigate = (page) => {
    if (page !== 'products') setSearchQuery('');
    setCurrentPage(page);
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setCurrentPage('checkout');
  };

  const handleOrderConfirm = (result) => {
    setOrderResult(result);
    setCurrentPage('confirmation');
  };

  const handleContinueShopping = () => {
    setOrderResult(null);
    setCurrentPage('products');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'products': return <Products initialSearch={searchQuery} />;
      case 'orders': return <Orders />;
      case 'vendors': return <Vendors />;
      case 'analytics': return <Analytics />;
      case 'checkout': return <Checkout onConfirm={handleOrderConfirm} onBack={() => setCurrentPage('products')} />;
      case 'confirmation': return <OrderConfirmation order={orderResult} onContinue={handleContinueShopping} />;
      default: return <Dashboard />;
    }
  };

  return (
    <>
      <Layout
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onSearch={handleSearch}
        collapsed={collapsed}
        onToggleSidebar={() => setCollapsed(!collapsed)}
        onToggleTheme={toggleTheme}
        themeIcon={themeIcon}
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
      >
        {renderPage()}
      </Layout>
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={handleCheckout} />
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <ToastProvider>
        <AppInner />
      </ToastProvider>
    </CartProvider>
  );
}
