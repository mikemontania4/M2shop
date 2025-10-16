import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeaderLogo: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="logo" onClick={() => navigate('/') }>
      <h1>CAVALLARO</h1>
      <p>Elegancia Masculina</p>
    </div>
  );
};

export default HeaderLogo;
