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
            {user.name}
          </button>
          <button onClick={() => { logout(); navigate('/'); }} className="btn-link">Cerrar Sesión</button>
        </>
      ) : (
        <button onClick={() => navigate('/login')} className="btn-link">
          <User size={16} />
          Iniciar Sesión
        </button>
      )}
    </div>
  );
};

export default HeaderUser;
