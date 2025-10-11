import React, { useEffect, useState } from 'react';
import productService, { Product, Subcategory } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { useApp } from '../contexts/AppContext';

interface CategoryPageProps {
  categoryId: string;
  onNavigate: (page: string) => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categoryId, onNavigate }) => {
  const { addToCart } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('default');

  useEffect(() => {
    const categoryData = productService.getCategoryById(categoryId);
    setCategory(categoryData);

    const subcats = productService.getSubcategoriesByCategory(categoryId);
    setSubcategories(subcats);

    setSelectedSubcategory(null);
    loadProducts(categoryId, null, sortBy);
  }, [categoryId]);

  useEffect(() => {
    loadProducts(categoryId, selectedSubcategory, sortBy);
  }, [selectedSubcategory, sortBy]);

  const loadProducts = (catId: string, subcat: string | null, sort: string) => {
    let categoryProducts = productService.getProductsByCategory(catId, subcat || undefined);

    if (sort === 'price-asc') {
      categoryProducts = [...categoryProducts].sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      categoryProducts = [...categoryProducts].sort((a, b) => b.price - a.price);
    } else if (sort === 'name') {
      categoryProducts = [...categoryProducts].sort((a, b) => a.name.localeCompare(b.name));
    }

    setProducts(categoryProducts);
  };

  const handleProductClick = (productId: number) => {
    onNavigate(`product-${productId}`);
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    addToCart(product, quantity, product.sizes[0], product.colors[0]);
  };

  const handleSubcategoryClick = (subcategoryId: string | null) => {
    setSelectedSubcategory(subcategoryId);
  };

  if (!category) {
    return <div className="container"><p>Categoría no encontrada</p></div>;
  }

  return (
    <div className="category-page">
      <div className="category-hero" style={{ backgroundImage: `url(${category.image})` }}>
        <div className="category-hero-content">
          <h1>{category.name}</h1>
          <p>{category.description}</p>
        </div>
      </div>

      <div className="container">
        <div className="category-layout">
          {subcategories.length > 0 && (
            <aside className="category-sidebar">
              <h3>Subcategorías</h3>
              <ul className="subcategory-list">
                <li>
                  <button
                    className={selectedSubcategory === null ? 'active' : ''}
                    onClick={() => handleSubcategoryClick(null)}
                  >
                    Todas
                  </button>
                </li>
                {subcategories.map((subcat) => (
                  <li key={subcat.id}>
                    <button
                      className={selectedSubcategory === subcat.id ? 'active' : ''}
                      onClick={() => handleSubcategoryClick(subcat.id)}
                    >
                      {subcat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          <div className="category-main-content">
            <div className="category-toolbar">
              <div className="product-count">
                {products.length} {products.length === 1 ? 'producto' : 'productos'}
              </div>
              <div className="sort-controls">
                <label>Ordenar por:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="default">Predeterminado</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="name">Nombre A-Z</option>
                </select>
              </div>
            </div>

            <div className="products-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={handleProductClick}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {products.length === 0 && (
              <div className="empty-state">
                <p>No hay productos disponibles en esta categoría.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
