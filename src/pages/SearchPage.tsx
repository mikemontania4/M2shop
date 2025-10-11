import React, { useEffect, useState } from 'react';
import productService, { Product } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { useApp } from '../contexts/AppContext';

interface SearchPageProps {
  searchQuery: string;
  onNavigate: (page: string) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ searchQuery, onNavigate }) => {
  const { addToCart } = useApp();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (searchQuery) {
      const results = productService.searchProducts(searchQuery);
      setProducts(results);
    }
  }, [searchQuery]);

  const handleProductClick = (productId: number) => {
    onNavigate(`product-${productId}`);
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    addToCart(product, quantity, product.sizes[0], product.colors[0]);
  };

  return (
    <div className="search-page">
      <div className="container">
        <h1>Resultados de búsqueda para "{searchQuery}"</h1>
        <p className="search-count">
          {products.length} {products.length === 1 ? 'producto encontrado' : 'productos encontrados'}
        </p>

        {products.length > 0 ? (
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
        ) : (
          <div className="empty-state">
            <p>No se encontraron productos con tu búsqueda.</p>
            <button className="btn-primary" onClick={() => onNavigate('home')}>
              Volver al Inicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
