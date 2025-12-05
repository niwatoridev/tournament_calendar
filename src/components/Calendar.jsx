import React, { useState } from 'react';
import '../styles/Calendar.css';

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const DAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const Calendar = ({ tournaments, onDateSelect, selectedDate }) => {
  const today = new Date();
  const [viewMode, setViewMode] = useState('weekly'); // 'weekly', 'monthly', 'yearly'
  const [currentDate, setCurrentDate] = useState(today);

  const getTournamentsForDate = (dateStr) => {
    return tournaments.filter(t => t.date === dateStr);
  };

  const formatDateStr = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateClick = (dateStr) => {
    onDateSelect(dateStr);
  };

  const getWeekDays = (date) => {
    const dayOfWeek = date.getDay();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - dayOfWeek);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handlePrevYear = () => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(currentDate.getFullYear() - 1);
    setCurrentDate(newDate);
  };

  const handleNextYear = () => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(currentDate.getFullYear() + 1);
    setCurrentDate(newDate);
  };

  const renderWeeklyView = () => {
    const weekDays = getWeekDays(currentDate);
    const startDate = weekDays[0];
    const endDate = weekDays[6];

    return (
      <>
        <div className="calendar-header">
          <button onClick={handlePrevWeek} className="nav-button">&lt;</button>
          <h2>
            {startDate.getDate()} {MONTHS[startDate.getMonth()]} - {endDate.getDate()} {MONTHS[endDate.getMonth()]} {endDate.getFullYear()}
          </h2>
          <button onClick={handleNextWeek} className="nav-button">&gt;</button>
        </div>
        <div className="weekly-grid">
          {weekDays.map((day, idx) => {
            const dateStr = formatDateStr(day);
            const dayTournaments = getTournamentsForDate(dateStr);
            const isToday = formatDateStr(today) === dateStr;
            const isSelected = selectedDate === dateStr;

            return (
              <div key={idx} className="weekly-day">
                <div className={`weekly-day-header ${isToday ? 'today' : ''}`}>
                  <div className="day-name">{DAYS[idx]}</div>
                  <div className="day-date">
                    {day.getDate()} {MONTHS[day.getMonth()]}
                  </div>
                  {dayTournaments.length > 0 && (
                    <span className="tournament-count">{dayTournaments.length}</span>
                  )}
                </div>
                <div
                  className={`weekly-day-content ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleDateClick(dateStr)}
                >
                  {dayTournaments.length > 0 ? (
                    <div className="day-tournaments">
                      {dayTournaments.map((tournament) => (
                        <div key={tournament.id} className="mini-tournament">
                          <div className="mini-tournament-time">{tournament.time}</div>
                          <div className="mini-tournament-store">{tournament.store}</div>
                          <div className="mini-tournament-price">
                            {tournament.entryFee === 0 ? 'Gratis' : `$${tournament.entryFee}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-events">Sin torneos</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const renderMonthlyView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = formatDateStr(date);
      const dayTournaments = getTournamentsForDate(dateStr);
      const isToday = formatDateStr(today) === dateStr;
      const isSelected = selectedDate === dateStr;

      days.push(
        <div
          key={day}
          className={`calendar-day ${dayTournaments.length > 0 ? 'has-tournaments' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => handleDateClick(dateStr)}
        >
          <div className="day-header">
            <span className="day-number">{day}</span>
            {dayTournaments.length > 0 && (
              <span className="tournament-count">{dayTournaments.length}</span>
            )}
          </div>

          {dayTournaments.length > 0 && (
            <div className="day-tournaments">
              {dayTournaments.map((tournament) => (
                <div key={tournament.id} className="mini-tournament">
                  <div className="mini-tournament-store">{tournament.store}</div>
                  <div className="mini-tournament-price">
                    {tournament.entryFee === 0 ? 'Gratis' : `$${tournament.entryFee}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <>
        <div className="calendar-header">
          <button onClick={handlePrevMonth} className="nav-button">&lt;</button>
          <h2>{MONTHS[month]} {year}</h2>
          <button onClick={handleNextMonth} className="nav-button">&gt;</button>
        </div>
        <div className="calendar-days-header">
          {DAYS_SHORT.map(day => (
            <div key={day} className="day-label">{day}</div>
          ))}
        </div>
        <div className="calendar-grid">
          {days}
        </div>
      </>
    );
  };

  const renderYearlyView = () => {
    const year = currentDate.getFullYear();
    const months = [];

    for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
      const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
      const firstDay = new Date(year, monthIdx, 1).getDay();
      const days = [];

      // Empty cells before first day
      for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="mini-day empty"></div>);
      }

      // Days of the month
      let monthTournamentsCount = 0;
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, monthIdx, day);
        const dateStr = formatDateStr(date);
        const dayTournaments = getTournamentsForDate(dateStr);
        const hasTournaments = dayTournaments.length > 0;
        const isToday = formatDateStr(today) === dateStr;

        if (hasTournaments) monthTournamentsCount += dayTournaments.length;

        days.push(
          <div
            key={day}
            className={`mini-day ${hasTournaments ? 'has-tournaments' : ''} ${isToday ? 'today' : ''}`}
            onClick={() => {
              setCurrentDate(date);
              setViewMode('monthly');
            }}
            title={hasTournaments ? `${dayTournaments.length} torneo(s)` : ''}
          >
            {day}
          </div>
        );
      }

      months.push(
        <div key={monthIdx} className="year-month">
          <div className="year-month-header">
            <span>{MONTHS[monthIdx]}</span>
            {monthTournamentsCount > 0 && (
              <span className="month-tournament-count">{monthTournamentsCount}</span>
            )}
          </div>
          <div className="year-month-days-header">
            {DAYS_SHORT.map(day => (
              <div key={day} className="mini-day-label">{day[0]}</div>
            ))}
          </div>
          <div className="year-month-grid">
            {days}
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="calendar-header">
          <button onClick={handlePrevYear} className="nav-button">&lt;</button>
          <h2>{year}</h2>
          <button onClick={handleNextYear} className="nav-button">&gt;</button>
        </div>
        <div className="yearly-grid">
          {months}
        </div>
      </>
    );
  };

  return (
    <div className="calendar">
      <div className="view-selector">
        <button
          className={`view-button ${viewMode === 'weekly' ? 'active' : ''}`}
          onClick={() => setViewMode('weekly')}
        >
          Semana
        </button>
        <button
          className={`view-button ${viewMode === 'monthly' ? 'active' : ''}`}
          onClick={() => setViewMode('monthly')}
        >
          Mes
        </button>
        <button
          className={`view-button ${viewMode === 'yearly' ? 'active' : ''}`}
          onClick={() => setViewMode('yearly')}
        >
          Año
        </button>
      </div>

      {viewMode === 'weekly' && renderWeeklyView()}
      {viewMode === 'monthly' && renderMonthlyView()}
      {viewMode === 'yearly' && renderYearlyView()}
    </div>
  );
};

export default Calendar;
