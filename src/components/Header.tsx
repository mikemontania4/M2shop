import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import productService, { Category } from '../services/productService';
import { useNavigate } from 'react-router-dom'; 
import DepartmentsMenu from './DepartmentsMenu';
import HeaderLogo from './header/HeaderLogo';
import SearchBar from './header/SearchBar';
import HeaderUser from './header/HeaderUser';
import CartButton from './header/CartButton';
import MainNav from './header/MainNav';

const Header: React.FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [navCategories, setNavCategories] = useState<Category[]>([]);
  const navigate = useNavigate();


  // Load categories for nav
  React.useEffect(() => {
    setNavCategories(productService.getCategories());
  }, []);

  return (
    <header className="header">
      {/* Top bar removed here; using separate TopBar component above header */}

      <div className="header-main">
        <div className="container">
          <div className="header-main-content">
            <div className="header-left">
              <button
                className="mobile-menu-btn"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>

              <HeaderLogo />

              <DepartmentsMenu categories={navCategories} />
            </div>

            <SearchBar />

            <div className="header-actions">
              <HeaderUser />
              <CartButton />
            </div>
          </div>
        </div>
      </div>

      <MainNav categories={navCategories} mobileActive={showMobileMenu} onCloseMobile={() => setShowMobileMenu(false)} />
    </header>
  );
};

export default Header;
