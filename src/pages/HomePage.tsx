import React, { useEffect, useState } from 'react';
import productService, { Product, Category } from '../services/productService';
import bannerService, { Banner } from '../services/bannerService';
import ProductCard from '../components/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { addToCart } = useApp();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setFeaturedProducts(productService.getFeaturedProducts());
    setCategories(productService.getCategories());
    setBanners(bannerService.getBanners());
  }, []);

  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    addToCart(product, quantity, product.sizes[0], product.colors[0]);
  };

  const handleCategoryClick = (categoryId: string) => {
    onNavigate(`category-${categoryId}`);
  };

  const handleProductClick = (productId: number) => {
    onNavigate(`product-${productId}`);
  };

  return (
    <div className="home-page">
      <section className="hero-slider">
        <div className="slider-container">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${banner.image})` }}
            >
              <div className="slide-content">
                <h2>{banner.title}</h2>
                <p>{banner.subtitle}</p>
                <button className="btn-primary">Ver Colección</button>
              </div>
            </div>
          ))}
        </div>
        <button className="slider-btn prev" onClick={prevSlide}>
          <ChevronLeft size={30} />
        </button>
        <button className="slider-btn next" onClick={nextSlide}>
          <ChevronRight size={30} />
        </button>
        <div className="slider-dots">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Categorías</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <div
                key={category.id}
                className="category-card"
                onClick={() => handleCategoryClick(category.id)}
              >
                <img src={category.image} alt={category.name} />
                <div className="category-overlay">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Productos Destacados</h2>
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={handleProductClick}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="promo-section">
        <div className="container">
          <div className="promo-grid">
            <div className="promo-card">
              <h3>Envío Gratis</h3>
              <p>En compras superiores a Gs. 500.000</p>
            </div>
            <div className="promo-card">
              <h3>Pago Seguro</h3>
              <p>Garantía de seguridad en todas las transacciones</p>
            </div>
            <div className="promo-card">
              <h3>Devoluciones</h3>
              <p>30 días para cambios y devoluciones</p>
            </div>
            <div className="promo-card">
              <h3>Atención 24/7</h3>
              <p>Estamos para ayudarte cuando lo necesites</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
