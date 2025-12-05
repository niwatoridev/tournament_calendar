import React from 'react';
import '../styles/LoginSection.css';

const LoginSection = () => {
  const handleLogin = (e) => {
    e.preventDefault();
    alert('Funcionalidad de login próximamente disponible');
  };

  return (
    <div className="login-section">
      <h3>¿Tienes una tienda?</h3>
      <p>Inicia sesión para administrar tus torneos</p>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Correo electrónico"
          disabled
          className="login-input"
        />
        <input
          type="password"
          placeholder="Contraseña"
          disabled
          className="login-input"
        />
        <button type="submit" className="login-button" disabled>
          Iniciar sesión (Próximamente)
        </button>
      </form>
    </div>
  );
};

export default LoginSection;
