import React, { useEffect, useState } from 'react';
import orderService, { Order } from '../services/orderService';
import { CheckCircle } from 'lucide-react';

interface OrderConfirmationPageProps {
  orderId: string;
  onNavigate: (page: string) => void;
}

const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ orderId, onNavigate }) => {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const orderData = orderService.getOrderById(orderId);
    setOrder(orderData || null);
  }, [orderId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!order) {
    return (
      <div className="container">
        <p>Pedido no encontrado</p>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="confirmation-header">
          <CheckCircle size={60} className="success-icon" />
          <h1>¡Pedido Realizado con Éxito!</h1>
          <p>Tu número de pedido es: <strong>{order.id}</strong></p>
        </div>

        <div className="order-details">
          <div className="order-section">
            <h2>Información del Pedido</h2>
            <p><strong>Fecha:</strong> {formatDate(order.date)}</p>
            <p><strong>Estado:</strong> {order.status}</p>
            <p><strong>Método de pago:</strong> {order.paymentMethod}</p>
          </div>

          <div className="order-section">
            <h2>Datos de Envío</h2>
            <p><strong>Nombre:</strong> {order.user.name}</p>
            <p><strong>Email:</strong> {order.user.email}</p>
            <p><strong>Teléfono:</strong> {order.user.phone}</p>
            <p><strong>Dirección:</strong> {order.shippingAddress}</p>
          </div>

          <div className="order-section">
            <h2>Productos</h2>
            <div className="order-items-list">
              {order.items.map((item, index) => (
                <div key={index} className="order-item-row">
                  <img src={item.product.image} alt={item.product.name} />
                  <div className="item-info">
                    <h4>{item.product.name}</h4>
                    <p>Talle: {item.size} | Color: {item.color}</p>
                    <p>Cantidad: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-total-section">
            <h2>Total del Pedido</h2>
            <div className="total-amount">{formatPrice(order.total)}</div>
          </div>

          <div className="order-actions">
            <button className="btn-primary" onClick={() => onNavigate('home')}>
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
