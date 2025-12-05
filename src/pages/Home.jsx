import React, { useState, useMemo, useEffect } from 'react';
import Calendar from '../components/Calendar';
import Filters from '../components/Filters';
import TournamentCard from '../components/TournamentCard';
import LoginSection from '../components/LoginSection';
import AddTournament from '../components/AddTournament';
import LanguageSwitcher from '../components/LanguageSwitcher';
import useLocalStorage from '../utils/useLocalStorage';
import { useTranslation } from '../hooks/useTranslation';
import tournamentsData from '../data/tournaments.json';
import { getTournamentsForDateRange } from '../utils/tournamentUtils';
import { getTournaments } from '../services/api';
import '../styles/App.css';

function Home() {
  const { t, isLanguageFading, currentLanguage } = useTranslation();
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedTCG, setSelectedTCG] = useState('Pokemon TCG');
  const [selectedDate, setSelectedDate] = useState('');
  const [interestedTournaments, setInterestedTournaments] = useLocalStorage('interestedTournaments', []);
  const [localTournaments, setLocalTournaments] = useLocalStorage('localTournaments', { uniqueTournaments: [], recurringTournaments: [] });

  // Estados para API
  const [apiTournaments, setApiTournaments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useAPI, setUseAPI] = useState(true); // API activada - Backend en http://localhost:5000

  // Cargar torneos desde la API cuando useAPI es true
  useEffect(() => {
    if (useAPI) {
      const fetchTournaments = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getTournaments();
          setApiTournaments(data);
        } catch (err) {
          setError(t('app.error'));
          console.error(err);
          // Fallback al JSON local si falla la API
          setApiTournaments(tournamentsData);
        } finally {
          setLoading(false);
        }
      };
      fetchTournaments();
    }
  }, [useAPI]);

  // Combinar torneos del JSON o API con torneos agregados localmente
  const combinedTournamentsData = useMemo(() => {
    const baseData = useAPI && apiTournaments ? apiTournaments : tournamentsData;

    return {
      uniqueTournaments: [
        ...(baseData.uniqueTournaments || []),
        ...(localTournaments.uniqueTournaments || [])
      ],
      recurringTournaments: [
        ...(baseData.recurringTournaments || []),
        ...(localTournaments.recurringTournaments || [])
      ]
    };
  }, [useAPI, apiTournaments, localTournaments]);

  // Generate tournaments for the entire year (can be optimized later)
  const allTournaments = useMemo(() => {
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-12-31');
    return getTournamentsForDateRange(combinedTournamentsData, startDate, endDate);
  }, [combinedTournamentsData]);

  // Filter tournaments by city and TCG
  const filteredTournaments = useMemo(() => {
    return allTournaments.filter(tournament => {
      const matchesCity = !selectedCity || tournament.city === selectedCity;
      const matchesTCG = !selectedTCG || tournament.tcg === selectedTCG;
      return matchesCity && matchesTCG;
    });
  }, [allTournaments, selectedCity, selectedTCG]);

  // Get tournaments for selected date
  const tournamentsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return filteredTournaments.filter(t => t.date === selectedDate);
  }, [selectedDate, filteredTournaments]);

  const handleToggleInterest = (tournamentId) => {
    setInterestedTournaments(prev => {
      if (prev.includes(tournamentId)) {
        return prev.filter(id => id !== tournamentId);
      } else {
        return [...prev, tournamentId];
      }
    });
  };

  const handleTournamentAdded = (newTournament, isRecurring) => {
    setLocalTournaments(prev => {
      if (isRecurring) {
        return {
          ...prev,
          recurringTournaments: [...prev.recurringTournaments, newTournament]
        };
      } else {
        return {
          ...prev,
          uniqueTournaments: [...prev.uniqueTournaments, newTournament]
        };
      }
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className={isLanguageFading ? 'fade-transition' : ''}>
            <h1>{t('app.title')}</h1>
            <p>{t('app.subtitle')}</p>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {loading && (
        <div className="loading-message">
          {t('app.loading')}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <main className="app-main">
        <AddTournament onTournamentAdded={handleTournamentAdded} useAPI={useAPI} />

        <Filters
          selectedCity={selectedCity}
          selectedTCG={selectedTCG}
          onCityChange={setSelectedCity}
          onTCGChange={setSelectedTCG}
        />

        <Calendar
          tournaments={filteredTournaments}
          onDateSelect={setSelectedDate}
          selectedDate={selectedDate}
        />

        {selectedDate && (
          <div className="tournaments-section">
            <h2 className={isLanguageFading ? 'fade-transition' : ''}>
              {t('calendar.tournamentsFor')} {new Date(selectedDate + 'T00:00:00').toLocaleDateString(
                currentLanguage === 'es-MX' ? 'es-MX' : 'en-US',
                {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }
              )}
            </h2>

            {tournamentsForSelectedDate.length > 0 ? (
              <div className="tournaments-grid">
                {tournamentsForSelectedDate.map(tournament => (
                  <TournamentCard
                    key={tournament.id}
                    tournament={tournament}
                    isInterested={interestedTournaments.includes(tournament.id)}
                    onToggleInterest={handleToggleInterest}
                  />
                ))}
              </div>
            ) : (
              <p className={`no-tournaments ${isLanguageFading ? 'fade-transition' : ''}`}>
                {t('app.noTournaments')}
              </p>
            )}
          </div>
        )}

        <LoginSection />
      </main>
    </div>
  );
}

export default Home;
