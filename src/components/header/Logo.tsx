import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logo: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="site-branding" onClick={() => navigate('/') } role="button" aria-label="Ir al inicio">
      <img
        className="logo-image"
        src="https://www.cavallaro.com.py/img/logo-web-blanco.png"
        alt="Cavallaro - Elegancia Masculina"
      />
    </div>
  );
};

export default Logo;
