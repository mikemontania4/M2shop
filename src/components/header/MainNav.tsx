import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Category } from '../../services/productService';

interface MainNavProps {
  categories: Category[];
  mobileActive?: boolean;
  onCloseMobile?: () => void;
}

const MainNav: React.FC<MainNavProps> = ({ categories, mobileActive, onCloseMobile }) => {
  const navigate = useNavigate();
  return (
    <nav className={`main-nav ${mobileActive ? 'mobile-active' : ''}`}>
      <div className="container">
        <ul className="nav-list">
          {categories.map((c) => (
            <li key={c.id}>
              <button onClick={() => { navigate(`/${c.id}`); onCloseMobile?.(); }}>{c.name}</button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default MainNav;
