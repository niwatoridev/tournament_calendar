import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../hooks/useAuth';
import { createUniqueTournament, createRecurringTournament } from '../services/api';
import Toast from './Toast';
import '../styles/AddTournament.css';

const CITIES = ['Puebla', 'Ciudad de Mexico'];
const TCGS = ['Pokemon TCG', 'Magic: The Gathering', 'Yu-Gi-Oh!'];
const TOURNAMENT_TYPES = ['Standard', 'Expanded', 'League Cup', 'Regional Qualifier', 'Torneo de Liga', 'Competitivo'];

const AddTournament = ({ onTournamentAdded, useAPI }) => {
  const { t, isLanguageFading } = useTranslation();
  const { isAuthenticated, token } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // No mostrar el formulario si no está autenticado y useAPI es true
  if (useAPI && !isAuthenticated) {
    return null;
  }

  const DAYS_OF_WEEK = [
    { value: 0, label: t('days.sunday') },
    { value: 1, label: t('days.monday') },
    { value: 2, label: t('days.tuesday') },
    { value: 3, label: t('days.wednesday') },
    { value: 4, label: t('days.thursday') },
    { value: 5, label: t('days.friday') },
    { value: 6, label: t('days.saturday') }
  ];

  const [formData, setFormData] = useState({
    tcg: 'Pokemon TCG',
    city: 'Puebla',
    store: '',
    time: '18:00',
    entryFee: 0,
    tournamentType: 'Torneo de Liga',
    // Para torneos únicos
    date: '',
    // Para torneos recurrentes
    dayOfWeek: 4,
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'entryFee' || name === 'dayOfWeek' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!formData.store.trim()) {
      setToast({ message: t('addTournament.name'), type: 'error' });
      return;
    }

    if (!isRecurring && !formData.date) {
      setToast({ message: t('addTournament.date'), type: 'error' });
      return;
    }

    const newTournament = {
      tcg: formData.tcg,
      city: formData.city,
      store: formData.store.trim(),
      time: formData.time,
      entryFee: formData.entryFee,
      tournamentType: formData.tournamentType
    };

    if (isRecurring) {
      newTournament.recurrence = {
        type: 'weekly',
        dayOfWeek: formData.dayOfWeek,
        startDate: formData.startDate,
        endDate: formData.endDate || '2025-12-31'
      };
    } else {
      newTournament.date = formData.date;
    }

    // Si useAPI es true, enviar al backend con token
    if (useAPI) {
      setIsSubmitting(true);
      try {
        let savedTournament;
        if (isRecurring) {
          savedTournament = await createRecurringTournament(newTournament, token);
        } else {
          savedTournament = await createUniqueTournament(newTournament, token);
        }

        // Notificar al componente padre con el torneo guardado
        if (onTournamentAdded) {
          onTournamentAdded(savedTournament, isRecurring);
        }

        setToast({ message: t('addTournament.success'), type: 'success' });
      } catch (error) {
        setToast({ message: `${t('addTournament.error')}: ${error.message}`, type: 'error' });
        setIsSubmitting(false);
        return;
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Modo sin API: usar localStorage (comportamiento actual)
      const tournamentWithId = {
        ...newTournament,
        id: isRecurring ? `r_${Date.now()}` : Date.now()
      };

      if (onTournamentAdded) {
        onTournamentAdded(tournamentWithId, isRecurring);
      }

      setToast({ message: t('addTournament.success'), type: 'success' });
    }

    // Resetear formulario
    setFormData({
      tcg: 'Pokemon TCG',
      city: 'Puebla',
      store: '',
      time: '18:00',
      entryFee: 0,
      tournamentType: 'Torneo de Liga',
      date: '',
      dayOfWeek: 4,
      startDate: new Date().toISOString().split('T')[0],
      endDate: ''
    });

    // Cerrar el formulario
    setIsExpanded(false);
  };

  return (
    <div className={`add-tournament ${isLanguageFading ? 'fade-transition' : ''}`}>
      <button
        className="toggle-form-button"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? `− ${t('addTournament.title')}` : `+ ${t('addTournament.title')}`}
      </button>

      {isExpanded && (
        <div className="add-tournament-form-container">
          <h3>{t('addTournament.title')}</h3>

          <div className="tournament-type-toggle">
            <button
              type="button"
              className={`toggle-button ${!isRecurring ? 'active' : ''}`}
              onClick={() => setIsRecurring(false)}
            >
              {t('addTournament.name')}
            </button>
            <button
              type="button"
              className={`toggle-button ${isRecurring ? 'active' : ''}`}
              onClick={() => setIsRecurring(true)}
            >
              {t('addTournament.isRecurring')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="add-tournament-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="tcg">{t('addTournament.tcg')}</label>
                <select
                  id="tcg"
                  name="tcg"
                  value={formData.tcg}
                  onChange={handleChange}
                  required
                >
                  {TCGS.map(tcg => (
                    <option key={tcg} value={tcg}>{tcg}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="city">{t('addTournament.city')}</label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                >
                  {CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="store">{t('addTournament.location')}</label>
                <input
                  type="text"
                  id="store"
                  name="store"
                  value={formData.store}
                  onChange={handleChange}
                  placeholder={t('addTournament.name')}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">{t('addTournament.time')}</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="entryFee">{t('addTournament.fee')}</label>
                <input
                  type="number"
                  id="entryFee"
                  name="entryFee"
                  value={formData.entryFee}
                  onChange={handleChange}
                  min="0"
                  step="10"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="tournamentType">{t('addTournament.tournamentType')}</label>
                <select
                  id="tournamentType"
                  name="tournamentType"
                  value={formData.tournamentType}
                  onChange={handleChange}
                  required
                >
                  {TOURNAMENT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {!isRecurring ? (
                <div className="form-group full-width">
                  <label htmlFor="date">{t('addTournament.date')}</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label htmlFor="dayOfWeek">{t('addTournament.recurringDay')}</label>
                    <select
                      id="dayOfWeek"
                      name="dayOfWeek"
                      value={formData.dayOfWeek}
                      onChange={handleChange}
                      required
                    >
                      {DAYS_OF_WEEK.map(day => (
                        <option key={day.value} value={day.value}>{day.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="startDate">{t('addTournament.date')}</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="endDate">{t('addTournament.date')}</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? `${t('app.loading')}` : t('addTournament.submit')}
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setIsExpanded(false)}
                disabled={isSubmitting}
              >
                {t('addTournament.title')}
              </button>
            </div>
          </form>
        </div>
      )}

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

export default AddTournament;