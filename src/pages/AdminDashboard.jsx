import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitcher from '../components/LanguageSwitcher';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t, isLanguageFading } = useTranslation();
  const [activeTab, setActiveTab] = useState('users');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={`dashboard ${isLanguageFading ? 'fade-transition' : ''}`}>
      <header className="dashboard-header">
        <div className="header-content">
          <h1>{t('admin.title')}</h1>
          <div className="header-actions">
            <span className="user-info">
              {user?.email} ({t('admin.role')})
            </span>
            <LanguageSwitcher />
            <button onClick={handleLogout} className="logout-button">
              {t('app.logout')}
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <nav className="dashboard-nav">
          <button
            className={`nav-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            {t('admin.users')}
          </button>
          <button
            className={`nav-tab ${activeTab === 'stores' ? 'active' : ''}`}
            onClick={() => setActiveTab('stores')}
          >
            {t('admin.stores')}
          </button>
          <button
            className={`nav-tab ${activeTab === 'tournaments' ? 'active' : ''}`}
            onClick={() => setActiveTab('tournaments')}
          >
            {t('admin.tournaments')}
          </button>
        </nav>

        <div className="dashboard-panel">
          {activeTab === 'users' && (
            <div className="panel-content">
              <h2>{t('admin.userManagement')}</h2>
              <p className="placeholder-text">{t('admin.comingSoon')}</p>
            </div>
          )}

          {activeTab === 'stores' && (
            <div className="panel-content">
              <h2>{t('admin.storeManagement')}</h2>
              <p className="placeholder-text">{t('admin.comingSoon')}</p>
            </div>
          )}

          {activeTab === 'tournaments' && (
            <div className="panel-content">
              <h2>{t('admin.tournamentManagement')}</h2>
              <p className="placeholder-text">{t('admin.comingSoon')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
