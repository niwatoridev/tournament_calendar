import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import '../styles/LoginSection.css';

const LoginSection = () => {
  const { t, isLanguageFading } = useTranslation();

  const handleLogin = (e) => {
    e.preventDefault();
    alert(t('login.submit'));
  };

  return (
    <div className={`login-section ${isLanguageFading ? 'fade-transition' : ''}`}>
      <h3>{t('login.title')}</h3>
      <p>{t('login.subtitle')}</p>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder={t('login.email')}
          disabled
          className="login-input"
        />
        <input
          type="password"
          placeholder={t('login.password')}
          disabled
          className="login-input"
        />
        <button type="submit" className="login-button" disabled>
          {t('login.submit')}
        </button>
      </form>
    </div>
  );
};

export default LoginSection;
