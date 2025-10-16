import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Category } from '../../services/productService';

interface MainNavProps {
  categories: Category[];
  mobileActive?: boolean;
  onCloseMobile?: () => void;
}

const MainNav: React.FC<MainNavProps> = ({ categories, mobileActive, onCloseMobile }) => {
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef<number>(0);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY || document.documentElement.scrollTop;
      const goingDown = current > lastScroll.current;
      // Hide only when scrolling down past header height
      setHidden(goingDown && current > 140);
      lastScroll.current = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className={`main-nav ${mobileActive ? 'mobile-active' : ''} ${hidden ? 'nav-hidden' : ''}`}>
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
