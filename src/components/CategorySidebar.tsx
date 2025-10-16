import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export interface SubCategoryItem {
  id: string;
  name: string;
  count?: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  count?: number;
  subCategories?: SubCategoryItem[];
}

interface CategorySidebarProps {
  categories: CategoryItem[];
  selectedCategory?: string;
  selectedSubCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
  onSubCategorySelect?: (categoryId: string, subCategoryId: string) => void;
  className?: string;
}

const cn = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  selectedSubCategory,
  onCategorySelect,
  onSubCategorySelect,
  className,
}) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    const next = new Set(expanded);
    if (next.has(categoryId)) next.delete(categoryId); else next.add(categoryId);
    setExpanded(next);
  };

  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect?.(categoryId);
    const cat = categories.find(c => c.id === categoryId);
    if (cat?.subCategories && cat.subCategories.length > 0) toggleCategory(categoryId);
  };

  return (
    <div className={cn('category-sidebar-panel', className)}>
      <div className="category-sidebar-header">
        <h2>Categorías</h2>
      </div>
      <div className="category-sidebar-scroll">
        <div className="category-sidebar-content">
          {categories.map((cat) => {
            const isExpanded = expanded.has(cat.id);
            const isSelected = selectedCategory === cat.id;
            const hasSubs = !!(cat.subCategories && cat.subCategories.length > 0);
            return (
              <div key={cat.id} className="category-sidebar-block">
                <button
                  className={cn('cat-btn', isSelected && 'active')}
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  <span className="cat-label">
                    {hasSubs && (
                      <span className="chev">{isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>
                    )}
                    <span className={!hasSubs ? 'ml-6' : ''}>{cat.name}</span>
                  </span>
                  {typeof cat.count === 'number' && <span className="cat-count">({cat.count})</span>}
                </button>
                {hasSubs && isExpanded && (
                  <div className="subcat-list">
                    {cat.subCategories!.map((sub) => {
                      const isSubSelected = selectedSubCategory === sub.id && selectedCategory === cat.id;
                      return (
                        <button
                          key={sub.id}
                          className={cn('subcat-btn', isSubSelected && 'active')}
                          onClick={() => onSubCategorySelect?.(cat.id, sub.id)}
                        >
                          <span>{sub.name}</span>
                          {typeof sub.count === 'number' && <span className="subcat-count">({sub.count})</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;
