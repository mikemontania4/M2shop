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

  return (
    <div className="departments-menu" ref={menuRef}>
      <button className="departments-toggle" onClick={() => setOpen(!open)}>
        <span className="departments-icon" />
        <span>Categorías</span>
        <ChevronDown size={16} />
      </button>
      {open && (
        <div className="departments-dropdown">
          <ul className="departments-list">
            {categories.map((c) => (
              <li key={c.id} className="department-item">
                <button className="department-link" onClick={() => setExpandedCat(expandedCat === c.id ? null : c.id)}>
                  <span className="square-color" />
                  <span>{c.name}</span>
                  {getSubcategories(c.id).length > 0 && <ChevronRight size={14} />}
                </button>
                {expandedCat === c.id && (
                  <div className="subcategory-panel">
                    <div className="subcategory-title">{c.name}</div>
                    <ul className="subcategory-listing">
                      {getSubcategories(c.id).map((s) => (
                        <li key={s.id}>
                          <button className="subcategory-link" onClick={() => handleSubcategoryClick(s.id)}>{s.name}</button>
                        </li>
                      ))}
                      <li>
                        <button className="subcategory-link view-all" onClick={() => handleCategoryClick(c.id)}>
                          Ver todo en "{c.name}"
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DepartmentsMenu;
