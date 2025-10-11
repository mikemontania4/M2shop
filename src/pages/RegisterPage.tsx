import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import authService from '../services/authService';
import { User, Mail, Lock } from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const result = authService.register(email, password, name);
    if (result.success) {
      login(email, password);
      onNavigate('home');
    } else {
      setError(result.message || 'Error al registrarse');
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-container">
          <div className="login-box">
            <h1>Crear Cuenta</h1>
            <p className="login-subtitle">Completa el formulario para registrarte</p>

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
                  placeholder="Tu nombre completo"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <Mail size={20} />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <Lock size={20} />
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <Lock size={20} />
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="btn-primary btn-block">
                Registrarse
              </button>
            </form>

            <div className="login-demo">
              <p>¿Ya tienes cuenta? <button onClick={() => onNavigate('login')} className="link-button">Inicia sesión aquí</button></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
