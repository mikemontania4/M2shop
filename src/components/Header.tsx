import React, { useEffect, useRef, useState } from 'react';
import { ShoppingCart, User, Search, Menu, X, MapPin } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import productService, { Product } from '../services/productService';

const Header: React.FC = () => {
  const { user, cartCount, logout } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLFormElement | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    navigate(`/catalogo${params.toString() ? `?${params.toString()}` : ''}`);
    setShowMobileMenu(false);
    setShowSuggestions(false);
  };
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const all = productService.searchProducts(searchQuery.trim());
    setSuggestions(all.slice(0, 6));
    setShowSuggestions(true);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <div className="header-contact">
              <span>Tel: (021) 123-4567</span>
              <span>Email: info@cavallaro.com.py</span>
            <button className="coverage-link" onClick={() => navigate('/mapa-de-cobertura')}>
              <MapPin size={14} /> Mapa de Cobertura
            </button>
            </div>
            <div className="header-user">
              {user ? (
                <>
                  <button onClick={() => navigate('/profile')} className="btn-link">
                    <User size={16} />
                    {user.name}
                  </button>
                  <button onClick={handleLogout} className="btn-link">Cerrar Sesión</button>
                </>
              ) : (
                <button onClick={() => navigate('/login')} className="btn-link">
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

            <div className="logo" onClick={() => navigate('/') }>
              <h1>CAVALLARO</h1>
              <p>Elegancia Masculina</p>
            </div>

            <form className="search-form" onSubmit={handleSearch} ref={searchRef}>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
              />
              <button type="submit">
                <Search size={20} />
              </button>
            {showSuggestions && suggestions.length > 0 && (
                <div className="search-suggestions">
                  <ul>
                    {suggestions.map((p) => (
                      <li key={p.id}>
                        <button
                          className="suggestion-item"
                          onClick={() => {
                            navigate(`/producto/${p.id}`);
                            setShowSuggestions(false);
                            setSearchQuery('');
                          }}
                        >
                          <img src={p.image} alt={p.name} />
                          <div className="suggestion-info">
                            <span className="suggestion-name">{p.name}</span>
                            <span className="suggestion-sub">{p.subcategory || p.category}</span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>

            <button className="cart-btn" onClick={() => navigate('/carrito')}>
              <ShoppingCart size={24} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
          </div>
        </div>
      </div>

      <nav className={`main-nav ${showMobileMenu ? 'mobile-active' : ''}`}>
        <div className="container">
          <ul className="nav-list">
            <li><button onClick={() => { navigate('/'); setShowMobileMenu(false); }}>Inicio</button></li>
            <li><button onClick={() => { navigate('/camisas'); setShowMobileMenu(false); }}>Camisas</button></li>
            <li><button onClick={() => { navigate('/pantalones'); setShowMobileMenu(false); }}>Pantalones</button></li>
            <li><button onClick={() => { navigate('/sacos'); setShowMobileMenu(false); }}>Sacos</button></li>
            <li><button onClick={() => { navigate('/calzados'); setShowMobileMenu(false); }}>Calzados</button></li>
            <li><button onClick={() => { navigate('/accesorios'); setShowMobileMenu(false); }}>Accesorios</button></li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
