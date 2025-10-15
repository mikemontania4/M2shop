import React from 'react';
import { ShoppingCart, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

const UserCart: React.FC = () => {
  const { user, cartCount, logout } = useApp();
  const navigate = useNavigate();

  return (
    <div className="user-cart">
      {user ? (
        <>
          <button onClick={() => navigate('/profile')} className="btn-link">
            <User size={16} />
            {user.name}
          </button>
          <button onClick={() => { logout(); navigate('/'); }} className="btn-link">Cerrar Sesión</button>
        </>
      ) : (
        <button onClick={() => navigate('/login')} className="btn-link">
          <User size={16} />
          Ingresar
        </button>
      )}
      <button className="cart-btn" onClick={() => navigate('/carrito')}>
        <ShoppingCart size={24} />
        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
      </button>
    </div>
  );
};

export default UserCart;
