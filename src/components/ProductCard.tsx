"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Product } from "../services/productService"

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
        {hasDiscount && <div className="product-badge-oferta">OFERTA</div>}
        {/* </CHANGE> */}

        <div className="product-image">
          <img src={product.image || "/placeholder.svg"} alt={product.name} />
        </div>

        <div className="product-info">
          <div className="product-price">
            <span className="current-price">{formatPrice(product.price)}</span>
            {hasDiscount && <span className="original-price">{formatPrice(product.originalPrice)}</span>}
          </div>
          {/* </CHANGE> */}

          <h3 className="product-name">{product.name}</h3>
          {/* </CHANGE> */}

          <div className="product-card-quantity">
            <button
              onClick={(e) => handleQuantityChange(-1, e)}
              className="quantity-btn"
              aria-label="Disminuir cantidad"
            >
              -
            </button>
            <span className="quantity-display">{quantity} Un.</span>
            <button onClick={(e) => handleQuantityChange(1, e)} className="quantity-btn" aria-label="Aumentar cantidad">
              +
            </button>
          </div>
          {/* </CHANGE> */}
        </div>
      </div>

      <button className="btn-add-to-cart-card" onClick={handleAddToCart}>
        Agregar al carrito
      </button>
      {/* </CHANGE> */}
    </div>
  )
}

export default ProductCard
