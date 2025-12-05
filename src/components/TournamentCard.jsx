import React from 'react';
import '../styles/TournamentCard.css';

const TournamentCard = ({ tournament, isInterested, onToggleInterest }) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-MX', options);
  };

  return (
    <div className="tournament-card">
      <div className="tournament-header">
        <h3>{tournament.store}</h3>
        <span className="tournament-type">{tournament.tournamentType}</span>
      </div>

      <div className="tournament-info">
        <div className="info-row">
          <span className="info-label">Juego:</span>
          <span className="info-value">{tournament.tcg}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Ciudad:</span>
          <span className="info-value">{tournament.city}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Fecha:</span>
          <span className="info-value">{formatDate(tournament.date)}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Hora:</span>
          <span className="info-value">{tournament.time}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Entrada:</span>
          <span className="info-value price">${tournament.entryFee} MXN</span>
        </div>
      </div>

      <button
        className={`interest-button ${isInterested ? 'interested' : ''}`}
        onClick={() => onToggleInterest(tournament.id)}
      >
        {isInterested ? '✓ Me interesa' : 'Me interesa'}
      </button>
    </div>
  );
};

export default TournamentCard;
