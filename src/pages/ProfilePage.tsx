import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import authService from '../services/authService';
import orderService from '../services/orderService';
import { User, Phone, MapPin, FileText, Save } from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user } = useApp();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [documentType, setDocumentType] = useState(user?.documentType || 'none');
  const [documentNumber, setDocumentNumber] = useState(user?.documentNumber || '');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [userOrders, setUserOrders] = useState(orderService.getOrdersByUser(user?.id || 0));

  useEffect(() => {
    if (user) {
      setUserOrders(orderService.getOrdersByUser(user.id));
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const result = authService.updateProfile({
      name,
      phone,
      address,
      documentType: documentType as 'ci' | 'ruc' | 'none',
      documentNumber: documentType === 'none' ? '' : documentNumber
    });

    if (result.success) {
      setSuccess('Perfil actualizado correctamente');
      window.location.reload();
    } else {
      setError(result.message || 'Error al actualizar el perfil');
    }
  };

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
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="profile-error">
            <h2>Debes iniciar sesión</h2>
            <button className="btn-primary" onClick={() => onNavigate('login')}>
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <h1>Mi Perfil</h1>

        <div className="profile-content">
          <div className="profile-form-section">
            <h2>Información Personal</h2>

            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  <User size={20} />
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <Phone size={20} />
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0981234567"
                />
              </div>

              <div className="form-group">
                <label>
                  <MapPin size={20} />
                  Dirección
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Tu dirección completa"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>
                  <FileText size={20} />
                  Tipo de Documento
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                >
                  <option value="none">Prefiero no dar información</option>
                  <option value="ci">Cédula de Identidad</option>
                  <option value="ruc">RUC</option>
                </select>
              </div>

              {documentType !== 'none' && (
                <div className="form-group">
                  <label>
                    <FileText size={20} />
                    Número de Documento
                  </label>
                  <input
                    type="text"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    placeholder="Número de documento"
                  />
                </div>
              )}

              <button type="submit" className="btn-primary">
                <Save size={20} />
                Guardar Cambios
              </button>
            </form>
          </div>

          <div className="profile-orders-section">
            <h2>Mis Pedidos</h2>
            {userOrders.length === 0 ? (
              <div className="empty-orders">
                <p>No tienes pedidos aún</p>
                <button className="btn-primary" onClick={() => onNavigate('home')}>
                  Ir a Comprar
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {userOrders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <h3>Pedido #{order.id}</h3>
                      <span className={`order-status ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="order-date">{formatDate(order.date)}</p>
                    <p className="order-total">Total: {formatPrice(order.total)}</p>
                    <p className="order-items-count">
                      {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                    </p>
                    <button
                      className="btn-secondary"
                      onClick={() => onNavigate(`order-${order.id}`)}
                    >
                      Ver Detalles
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
