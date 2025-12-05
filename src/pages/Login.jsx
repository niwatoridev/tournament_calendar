import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import Toast from '../components/Toast';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticating } = useAuth();
  const { t, isLanguageFading } = useTranslation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!formData.email.trim() || !formData.password.trim()) {
      setToast({
        message: t('login.validation.required'),
        type: 'error'
      });
      return;
    }

    // Intentar login
    const result = await login(formData.email, formData.password);

    if (result.success) {
      setToast({
        message: t('login.success'),
        type: 'success'
      });

      // Redirigir según el rol del usuario
      setTimeout(() => {
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else if (result.user.role === 'store') {
          navigate('/dashboard');
        }
      }, 500);
    } else {
      setToast({
        message: result.error || t('login.error'),
        type: 'error'
      });
    }
  };

  return (
    <div className={`login-page ${isLanguageFading ? 'fade-transition' : ''}`}>
      <div className="login-container">
        <div className="login-card">
          <h1>{t('login.title')}</h1>
          <p className="login-subtitle">{t('login.subtitle')}</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">{t('login.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('login.emailPlaceholder')}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{t('login.password')}</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('login.passwordPlaceholder')}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isAuthenticating}
            >
              {isAuthenticating ? t('app.loading') : t('login.submit')}
            </button>
          </form>

          <button
            className="back-button"
            onClick={() => navigate('/')}
            disabled={isAuthenticating}
          >
            {t('login.backToHome')}
          </button>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Login;
