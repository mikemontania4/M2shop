import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Category } from '../../services/productService';
import productService from '../../services/productService';

interface MainNavProps {
  categories?: Category[];
  mobileActive?: boolean;
  onCloseMobile?: () => void;
}

const MainNav: React.FC<MainNavProps> = ({ categories, mobileActive, onCloseMobile }) => {
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [offsetTop, setOffsetTop] = useState<number>(0);
  const lastScroll = useRef<number>(0);
  const [mobileActiveInternal, setMobileActiveInternal] = useState(false);
  const [cats, setCats] = useState<Category[]>(categories ?? []);

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
      const anyMobileActive = mobileActive || mobileActiveInternal;
      setHidden(!anyMobileActive && goingDown && current > offsetTop + 20);
      lastScroll.current = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobileActive, mobileActiveInternal, offsetTop]);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      setCats(productService.getCategories());
    } else {
      setCats(categories);
    }
  }, [categories]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<boolean>).detail;
      setMobileActiveInternal(!!detail);
    };
    window.addEventListener('nav-toggle', handler as EventListener);
    return () => window.removeEventListener('nav-toggle', handler as EventListener);
  }, []);
  const isMobileActive = mobileActive || mobileActiveInternal;

  // Desktop: inline under header in normal flow. Mobile: render as overlay panel.
  const isDesktop = typeof window === 'undefined' ? true : window.innerWidth > 968;

  if (!isDesktop) {
    if (!isMobileActive) return null;
    return (
      <div className="mobile-nav-overlay" onClick={() => onCloseMobile?.()}>
        <div className="mobile-nav-panel" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-nav-header">
            <span>Categorías</span>
            <button className="mobile-nav-close" onClick={() => onCloseMobile?.()}>✕</button>
          </div>
          <ul className="mobile-nav-list">
            {cats.map((c) => (
              <li key={c.id}>
                <button className="mobile-nav-item" onClick={() => { navigate(`/${c.id}`); onCloseMobile?.(); }}>{c.name}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <nav className={`main-nav ${hidden ? 'nav-hidden' : ''} ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <ul className="nav-list">
          {cats.map((c) => (
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
