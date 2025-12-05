import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitcher from '../components/LanguageSwitcher';
import '../styles/Dashboard.css';

const StoreDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, getStoreId } = useAuth();
  const { t, isLanguageFading } = useTranslation();
  const [activeTab, setActiveTab] = useState('tournaments');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={`dashboard ${isLanguageFading ? 'fade-transition' : ''}`}>
      <header className="dashboard-header">
        <div className="header-content">
          <h1>{t('store.title')}</h1>
          <div className="header-actions">
            <span className="user-info">
              {user?.email} ({t('store.role')})
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
            className={`nav-tab ${activeTab === 'tournaments' ? 'active' : ''}`}
            onClick={() => setActiveTab('tournaments')}
          >
            {t('store.myTournaments')}
          </button>
          <button
            className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            {t('store.profile')}
          </button>
        </nav>

        <div className="dashboard-panel">
          {activeTab === 'tournaments' && (
            <div className="panel-content">
              <h2>{t('store.tournamentManagement')}</h2>
              <p className="placeholder-text">{t('store.comingSoon')}</p>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="panel-content">
              <h2>{t('store.storeProfile')}</h2>
              <p className="placeholder-text">
                Store ID: {getStoreId()}
                <br />
                {t('store.comingSoon')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreDashboard;
