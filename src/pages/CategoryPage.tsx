import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productService, { Product, Subcategory } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { useApp } from '../contexts/AppContext';

const CategoryPage: React.FC<{ categoryId?: string }> = ({ categoryId }) => {
  const { addToCart } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('default');
  const params = useParams();
  const navigate = useNavigate();
  const effectiveCategoryId = useMemo(() => {
    if (categoryId && categoryId.length > 0) return categoryId;
    if (params.categoriaSlug) return params.categoriaSlug;
    if (params.subcategoriaSlug) {
      // When we are in /catalogo/:subcategoriaSlug, infer base category from subcategory
      const allCategories = productService.getCategories();
      const found = allCategories.find(c => c.subcategories.some(s => s.id === params.subcategoriaSlug));
      return found?.id || '';
    }
    return '';
  }, [categoryId, params.categoriaSlug, params.subcategoriaSlug]);

  useEffect(() => {
    const categoryData = productService.getCategoryById(effectiveCategoryId);
    setCategory(categoryData);

    const subcats = productService.getSubcategoriesByCategory(effectiveCategoryId);
    setSubcategories(subcats);

    setSelectedSubcategory(null);
    loadProducts(effectiveCategoryId, null, sortBy);
  }, [effectiveCategoryId]);

  useEffect(() => {
    loadProducts(effectiveCategoryId, selectedSubcategory, sortBy);
  }, [effectiveCategoryId, selectedSubcategory, sortBy]);

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
    navigate(`/producto/${productId}`);
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    addToCart(product, quantity, product.sizes[0], product.colors[0]);
  };

  const handleSubcategoryClick = (subcategoryId: string | null) => {
    setSelectedSubcategory(subcategoryId);
    if (subcategoryId) {
      navigate(`/catalogo/${subcategoryId}`);
    } else if (effectiveCategoryId) {
      navigate(`/${effectiveCategoryId}`);
    }
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
