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
          <div className="departments-columns">
            <ul className="departments-list">
              {categories.map((c) => (
                <li key={c.id} className={`department-item ${expandedCat === c.id ? 'active' : ''}`}>
                  <button className="department-link" onClick={() => setExpandedCat(expandedCat === c.id ? null : c.id)}>
                    <span className="square-color" />
                    <span>{c.name}</span>
                    {getSubcategories(c.id).length > 0 && <ChevronRight size={14} />}
                  </button>
                </li>
              ))}
            </ul>
            <div className="departments-subpanel">
              {expandedCat && (
                <div className="subcategory-panel">
                  <div className="subcategory-title">{categories.find(cc => cc.id === expandedCat)?.name}</div>
                  <ul className="subcategory-listing">
                    {getSubcategories(expandedCat).map((s) => (
                      <li key={s.id}>
                        <button className="subcategory-link" onClick={() => handleSubcategoryClick(s.id)}>{s.name}</button>
                      </li>
                    ))}
                    <li>
                      <button className="subcategory-link view-all" onClick={() => handleCategoryClick(expandedCat)}>
                        Ver todo en "{categories.find(cc => cc.id === expandedCat)?.name}"
                      </button>
                    </li>
                  </ul>
                </div>
              )}
              {!expandedCat && (
                <div className="subcategory-empty">Seleccioná una categoría para ver subcategorías</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsMenu;
