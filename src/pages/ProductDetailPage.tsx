import React, { useEffect, useState } from 'react';
import productService, { Product } from '../services/productService';
import { useApp } from '../contexts/AppContext';
import { ShoppingCart, Check } from 'lucide-react';

interface ProductDetailPageProps {
  productId: number;
  onNavigate: (page: string) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId, onNavigate }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addToCart } = useApp();

  useEffect(() => {
    const productData = productService.getProductById(productId);
    if (productData) {
      setProduct(productData);
      setSelectedSize(productData.sizes[0]);
      setSelectedColor(productData.colors[0]);
    }
  }, [productId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = () => {
    if (product && selectedSize && selectedColor) {
      addToCart(product, quantity, selectedSize, selectedColor);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  if (!product) {
    return <div className="container"><p>Producto no encontrado</p></div>;
  }

  const hasDiscount = product.originalPrice > 0;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail-grid">
          <div className="product-images">
            <div className="main-image">
              <img src={product.images[selectedImage]} alt={product.name} />
              {hasDiscount && (
                <span className="discount-badge">-{discountPercentage}%</span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="thumbnail-images">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-details">
            <h1>{product.name}</h1>

            <div className="product-price-section">
              <div className="price-row">
                <span className="current-price">{formatPrice(product.price)}</span>
                {hasDiscount && (
                  <>
                    <span className="original-price">{formatPrice(product.originalPrice)}</span>
                    <span className="discount-tag">¡Ahorrás {formatPrice(product.originalPrice - product.price)}!</span>
                  </>
                )}
              </div>
            </div>

            <p className="product-description">{product.description}</p>

            <div className="product-options">
              <div className="option-group">
                <label>Talle:</label>
                <div className="size-options">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="option-group">
                <label>Color:</label>
                <div className="color-options">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div className="option-group">
                <label>Cantidad:</label>
                <div className="quantity-selector">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                  />
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>
            </div>

            <div className="product-actions">
              <button className="btn-add-cart" onClick={handleAddToCart}>
                <ShoppingCart size={20} />
                Agregar al Carrito
              </button>
              {showSuccess && (
                <div className="success-message">
                  <Check size={20} />
                  Producto agregado al carrito
                </div>
              )}
            </div>

            <div className="product-info-list">
              <p><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} unidades disponibles` : 'Sin stock'}</p>
              <p><strong>Categoría:</strong> {product.category}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
