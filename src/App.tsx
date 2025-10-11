import React, { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setCurrentPage('admin-dashboard');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentPage('home');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const renderPage = () => {
    if (currentPage === 'panelsecreto') {
      return <AdminLoginPage onAdminLogin={handleAdminLogin} onNavigate={handleNavigate} />;
    }

    if (currentPage === 'admin-dashboard') {
      if (!isAdminLoggedIn) {
        handleNavigate('panelsecreto');
        return null;
      }
      return <AdminDashboard onLogout={handleAdminLogout} />;
    }

    if (currentPage === 'home') {
      return <HomePage onNavigate={handleNavigate} />;
    }

    if (currentPage.startsWith('category-')) {
      const categoryId = currentPage.replace('category-', '');
      return <CategoryPage categoryId={categoryId} onNavigate={handleNavigate} />;
    }

    if (currentPage.startsWith('product-')) {
      const productId = parseInt(currentPage.replace('product-', ''));
      return <ProductDetailPage productId={productId} onNavigate={handleNavigate} />;
    }

    if (currentPage === 'search') {
      return <SearchPage searchQuery={searchQuery} onNavigate={handleNavigate} />;
    }

    if (currentPage === 'cart') {
      return <CartPage onNavigate={handleNavigate} />;
    }

    if (currentPage === 'login') {
      return <LoginPage onNavigate={handleNavigate} />;
    }

    if (currentPage === 'register') {
      return <RegisterPage onNavigate={handleNavigate} />;
    }

    if (currentPage === 'profile') {
      return <ProfilePage onNavigate={handleNavigate} />;
    }

    if (currentPage === 'checkout') {
      return <CheckoutPage onNavigate={handleNavigate} />;
    }

    if (currentPage.startsWith('order-')) {
      const orderId = currentPage.replace('order-', '');
      return <OrderConfirmationPage orderId={orderId} onNavigate={handleNavigate} />;
    }

    return <HomePage onNavigate={handleNavigate} />;
  };

  const isAdminPanel = currentPage === 'panelsecreto' || currentPage === 'admin-dashboard';

  return (
    <AppProvider>
      <div className="app">
        {!isAdminPanel && <Header onNavigate={handleNavigate} onSearch={handleSearch} />}
        <main>{renderPage()}</main>
        {!isAdminPanel && <Footer />}
      </div>
    </AppProvider>
  );
}

export default App;
