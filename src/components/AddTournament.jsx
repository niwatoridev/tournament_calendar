import React, { useState } from 'react';
import { createUniqueTournament, createRecurringTournament } from '../services/api';
import '../styles/AddTournament.css';

const CITIES = ['Puebla', 'Ciudad de Mexico'];
const TCGS = ['Pokemon TCG', 'Magic: The Gathering', 'Yu-Gi-Oh!'];
const TOURNAMENT_TYPES = ['Standard', 'Expanded', 'League Cup', 'Regional Qualifier', 'Torneo de Liga', 'Competitivo'];
const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' }
];

const AddTournament = ({ onTournamentAdded, useAPI }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      alert('Por favor ingresa el nombre de la tienda');
      return;
    }

    if (!isRecurring && !formData.date) {
      alert('Por favor selecciona una fecha');
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

    // Si useAPI es true, enviar al backend
    if (useAPI) {
      setIsSubmitting(true);
      try {
        let savedTournament;
        if (isRecurring) {
          savedTournament = await createRecurringTournament(newTournament);
        } else {
          savedTournament = await createUniqueTournament(newTournament);
        }

        // Notificar al componente padre con el torneo guardado
        if (onTournamentAdded) {
          onTournamentAdded(savedTournament, isRecurring);
        }

        alert(`Torneo ${isRecurring ? 'recurrente' : 'único'} agregado exitosamente`);
      } catch (error) {
        alert(`Error al guardar el torneo: ${error.message}`);
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

      alert(`Torneo ${isRecurring ? 'recurrente' : 'único'} agregado exitosamente`);
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
    <div className="add-tournament">
      <button
        className="toggle-form-button"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '− Cerrar Formulario' : '+ Agregar Torneo'}
      </button>

      {isExpanded && (
        <div className="add-tournament-form-container">
          <h3>Agregar Nuevo Torneo</h3>

          <div className="tournament-type-toggle">
            <button
              type="button"
              className={`toggle-button ${!isRecurring ? 'active' : ''}`}
              onClick={() => setIsRecurring(false)}
            >
              Torneo Único
            </button>
            <button
              type="button"
              className={`toggle-button ${isRecurring ? 'active' : ''}`}
              onClick={() => setIsRecurring(true)}
            >
              Torneo Recurrente
            </button>
          </div>

          <form onSubmit={handleSubmit} className="add-tournament-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="tcg">Juego (TCG)</label>
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
                <label htmlFor="city">Ciudad</label>
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
                <label htmlFor="store">Tienda</label>
                <input
                  type="text"
                  id="store"
                  name="store"
                  value={formData.store}
                  onChange={handleChange}
                  placeholder="Nombre de la tienda"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">Hora</label>
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
                <label htmlFor="entryFee">Precio de Entrada (MXN)</label>
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
                <label htmlFor="tournamentType">Tipo de Torneo</label>
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
                  <label htmlFor="date">Fecha</label>
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
                    <label htmlFor="dayOfWeek">Día de la Semana</label>
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
                    <label htmlFor="startDate">Fecha de Inicio</label>
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
                    <label htmlFor="endDate">Fecha de Fin (Opcional)</label>
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
                {isSubmitting ? 'Guardando...' : 'Agregar Torneo'}
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setIsExpanded(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddTournament;