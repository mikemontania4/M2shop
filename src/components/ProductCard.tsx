import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../services/productService';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onProductClick?: (productId: number) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(price);
  };

  const hasDiscount = product.originalPrice > 0;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuantityChange = (delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <div className="product-card-wrap">
      <div className="product-card">
        <div className="product-image" onClick={() => (onProductClick ? onProductClick(product.id) : navigate(`/producto/${product.id}`))}>
          <img src={product.image} alt={product.name} />
          {hasDiscount && (
            <span className="discount-badge">-{discountPercentage}%</span>
          )}
        </div>
        <div className="product-info">
          <h3 onClick={() => (onProductClick ? onProductClick(product.id) : navigate(`/producto/${product.id}`))}>{product.name}</h3>
          <div className="product-price">
            <span className="current-price">{formatPrice(product.price)}</span>
            {hasDiscount && (
              <span className="original-price">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          <div className="product-card-quantity">
            <button
              onClick={(e) => handleQuantityChange(-1, e)}
              className="quantity-btn"
            >
              <Minus size={16} />
            </button>
            <span className="quantity-display">{quantity}</span>
            <button
              onClick={(e) => handleQuantityChange(1, e)}
              className="quantity-btn"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
      <button className="btn-add-to-cart-card add-to-cart-bar" onClick={handleAddToCart}>
        <ShoppingCart size={18} />
        Agregar al Carrito
      </button>
    </div>
  );
};

export default ProductCard;
