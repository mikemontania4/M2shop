import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Product } from "../services/productService"
import { ShoppingCart, Plus, Minus } from "lucide-react"

interface ProductCardProps {
  product: Product
  onProductClick?: (productId: number) => void
  onAddToCart: (product: Product, quantity: number) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1)
  const navigate = useNavigate()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PY", {
      style: "currency",
      currency: "PYG",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const hasDiscount = product.originalPrice > 0
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleQuantityChange = (delta: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setQuantity(Math.max(1, quantity + delta))
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart(product, quantity)
    setQuantity(1)
  }

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product.id)
    } else {
      navigate(`/producto/${product.id}`)
    }
  }

  return (
    <div className="product-card-wrap">
      <div className="product-card" onClick={handleCardClick}>
        <div className="product-image">
          <img src={product.image || "/placeholder.svg"} alt={product.name} />
          <div className="product-labels">
            {hasDiscount && <span className="product-label label-discount">Oferta</span>}
            {product.featured && <span className="product-label label-featured">Destacado</span>}
          </div>
          {/* </CHANGE> */}
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-price">
            <span className="current-price">{formatPrice(product.price)}</span>
            {hasDiscount && <span className="original-price">{formatPrice(product.originalPrice)}</span>}
          </div>

          <div className="product-card-quantity">
            <button
              onClick={(e) => handleQuantityChange(-1, e)}
              className="quantity-btn"
              aria-label="Disminuir cantidad"
            >
              <Minus size={16} />
            </button>
            <span className="quantity-display">{quantity}</span>
            <button onClick={(e) => handleQuantityChange(1, e)} className="quantity-btn" aria-label="Aumentar cantidad">
              <Plus size={16} />
            </button>
          </div>
          {/* </CHANGE> */}
        </div>
      </div>
      <button className="btn-add-to-cart-card" onClick={handleAddToCart}>
        <ShoppingCart size={18} /> Agregar al Carrito
      </button>
      {/* </CHANGE> */}
    </div>
  )
}

export default ProductCard
