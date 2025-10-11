import React, { useState } from 'react';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onSearch }) => {
  const { user, cartCount, logout } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    onNavigate('search');
  };

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <div className="header-contact">
              <span>Tel: (021) 123-4567</span>
              <span>Email: info@cavallaro.com.py</span>
            </div>
            <div className="header-user">
              {user ? (
                <>
                  <button onClick={() => onNavigate('profile')} className="btn-link">
                    <User size={16} />
                    {user.name}
                  </button>
                  <button onClick={handleLogout} className="btn-link">Cerrar Sesión</button>
                </>
              ) : (
                <button onClick={() => onNavigate('login')} className="btn-link">
                  <User size={16} />
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="header-main">
        <div className="container">
          <div className="header-main-content">
            <button
              className="mobile-menu-btn"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="logo" onClick={() => onNavigate('home')}>
              <h1>CAVALLARO</h1>
              <p>Elegancia Masculina</p>
            </div>

            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">
                <Search size={20} />
              </button>
            </form>

            <button className="cart-btn" onClick={() => onNavigate('cart')}>
              <ShoppingCart size={24} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
          </div>
        </div>
      </div>

      <nav className={`main-nav ${showMobileMenu ? 'mobile-active' : ''}`}>
        <div className="container">
          <ul className="nav-list">
            <li><button onClick={() => { onNavigate('home'); setShowMobileMenu(false); }}>Inicio</button></li>
            <li><button onClick={() => { onNavigate('category-camisas'); setShowMobileMenu(false); }}>Camisas</button></li>
            <li><button onClick={() => { onNavigate('category-pantalones'); setShowMobileMenu(false); }}>Pantalones</button></li>
            <li><button onClick={() => { onNavigate('category-sacos'); setShowMobileMenu(false); }}>Sacos</button></li>
            <li><button onClick={() => { onNavigate('category-calzados'); setShowMobileMenu(false); }}>Calzados</button></li>
            <li><button onClick={() => { onNavigate('category-accesorios'); setShowMobileMenu(false); }}>Accesorios</button></li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
