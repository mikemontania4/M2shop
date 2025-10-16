import React from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

const HeaderUser: React.FC = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  return (
    <div className="header-user">
      {user ? (
        <>
          <button onClick={() => navigate('/profile')} className="btn-link">
            <User size={16} />
            <span className="label">{user.name}</span>
          </button>
          <button onClick={() => { logout(); navigate('/'); }} className="btn-link">
            <span className="label">Cerrar Sesión</span>
          </button>
        </>
      ) : (
        <button onClick={() => navigate('/login')} className="btn-link">
          <User size={16} />
          <span className="label">Iniciar Sesión</span>
        </button>
      )}
    </div>
  );
};

export default HeaderUser;
