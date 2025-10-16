import React from 'react';
import { MapPin, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="top-bar top-bar-v1">
      <div className="col-full">
        <ul className="topbar-nav">
          <li className="menu-item">
            <button className="topbar-link" onClick={() => navigate('/mapa-de-cobertura')}>
              <MapPin size={14} /> Área de cobertura
            </button>
          </li>
          <li className="menu-item">
            <a className="topbar-link" title="+595 21 588 9000" href="tel:595215889000">
              <Phone size={14} /> +595 21 588 9000
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TopBar;
