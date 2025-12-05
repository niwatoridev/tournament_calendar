import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import '../styles/TournamentCard.css';

const TournamentCard = ({ tournament, isInterested, onToggleInterest }) => {
  const { t, currentLanguage, isLanguageFading } = useTranslation();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const locale = currentLanguage === 'es-MX' ? 'es-MX' : 'en-US';
    return date.toLocaleDateString(locale, options);
  };

  return (
    <div className={`tournament-card ${isLanguageFading ? 'fade-transition' : ''}`}>
      <div className="tournament-header">
        <h3>{tournament.store}</h3>
        <span className="tournament-type">{tournament.tournamentType}</span>
      </div>

      <div className="tournament-info">
        <div className="info-row">
          <span className="info-label">{t('filters.tcg')}:</span>
          <span className="info-value">{tournament.tcg}</span>
        </div>

        <div className="info-row">
          <span className="info-label">{t('filters.city')}:</span>
          <span className="info-value">{tournament.city}</span>
        </div>

        <div className="info-row">
          <span className="info-label">{t('addTournament.date')}:</span>
          <span className="info-value">{formatDate(tournament.date)}</span>
        </div>

        <div className="info-row">
          <span className="info-label">{t('addTournament.time')}:</span>
          <span className="info-value">{tournament.time}</span>
        </div>

        <div className="info-row">
          <span className="info-label">{t('tournament.fee')}:</span>
          <span className="info-value price">${tournament.entryFee} MXN</span>
        </div>
      </div>

      <button
        className={`interest-button ${isInterested ? 'interested' : ''}`}
        onClick={() => onToggleInterest(tournament.id)}
      >
        {isInterested ? `✓ ${t('tournament.interested')}` : t('tournament.interested')}
      </button>
    </div>
  );
};

export default TournamentCard;
