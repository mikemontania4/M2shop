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
  const [scrolled, setScrolled] = useState(false);
  const [offsetTop, setOffsetTop] = useState<number>(0);
  const lastScroll = useRef<number>(0);

  useEffect(() => {
    const measure = () => {
      const header = document.querySelector('.header') as HTMLElement | null;
      setOffsetTop((header?.offsetHeight || 0));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY || document.documentElement.scrollTop;
      const goingDown = current > lastScroll.current;
      setScrolled(current > 0);
      // Hide only when scrolling down past header height and no mobile panel
      setHidden(!mobileActive && goingDown && current > offsetTop + 20);
      lastScroll.current = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobileActive, offsetTop]);
  return (
    <nav
      className={`main-nav ${mobileActive ? 'mobile-active' : ''} ${hidden ? 'nav-hidden' : ''} ${scrolled ? 'scrolled' : ''}`}
      style={{ top: offsetTop }}
    >
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
