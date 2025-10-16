import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import productService, { Category, Subcategory } from '../services/productService';

interface DepartmentsMenuProps {
  categories: Category[];
}

const DepartmentsMenu: React.FC<DepartmentsMenuProps> = ({ categories }) => {
  const [open, setOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [hoverCat, setHoverCat] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleCategoryClick = (catId: string) => {
    navigate(`/${catId}`);
    setOpen(false);
  };

  const handleSubcategoryClick = (subId: string) => {
    navigate(`/catalogo/${subId}`);
    setOpen(false);
  };

  const getSubcategories = (catId: string): Subcategory[] => {
    return productService.getSubcategoriesByCategory(catId);
  };

  const activeCat = hoverCat || expandedCat || null;

  return (
    <div className="departments-menu" ref={menuRef}>
      <button className="departments-toggle" onClick={() => setOpen(!open)}>
        <span className="departments-icon" />
        <span>Categorías</span>
        <ChevronDown size={16} />
      </button>
      {open && (
        <div className="departments-dropdown">
          <div className="departments-columns">
            <ul className="departments-list">
              {categories.map((c) => (
                <li
                  key={c.id}
                  className={`department-item ${activeCat === c.id ? 'active' : ''}`}
                  onMouseEnter={() => setHoverCat(c.id)}
                  onMouseLeave={() => setHoverCat(null)}
                >
                  <button className="department-link" onClick={() => setExpandedCat(expandedCat === c.id ? null : c.id)}>
                    <span className="square-color" />
                    <span>{c.name}</span>
                    {getSubcategories(c.id).length > 0 && <ChevronRight size={14} />}
                  </button>
                </li>
              ))}
            </ul>
            <div className="departments-subpanel">
              {activeCat && (
                <div className="subcategory-panel">
                  <div className="subcategory-title">
                    {categories.find(cc => cc.id === activeCat)?.name}
                  </div>
                  <ul className="subcategory-listing">
                    <li>
                      <button className="subcategory-link view-all" onClick={() => handleCategoryClick(activeCat)}>
                        Todos
                      </button>
                    </li>
                    {getSubcategories(activeCat).map((s) => (
                      <li key={s.id}>
                        <button className="subcategory-link" onClick={() => handleSubcategoryClick(s.id)}>{s.name}</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {!activeCat && (
                <div className="subcategory-empty">Pasá el cursor por una categoría</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsMenu;
