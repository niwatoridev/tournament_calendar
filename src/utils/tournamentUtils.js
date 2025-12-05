/**
 * Genera torneos a partir de torneos únicos y recurrentes
 */
export const generateTournaments = (tournamentsData, startDate, endDate) => {
  const tournaments = [];

  // Agregar torneos únicos
  if (tournamentsData.uniqueTournaments) {
    tournamentsData.uniqueTournaments.forEach(tournament => {
      const tournamentDate = new Date(tournament.date + 'T00:00:00');
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (tournamentDate >= start && tournamentDate <= end) {
        tournaments.push(tournament);
      }
    });
  }

  // Generar torneos recurrentes
  if (tournamentsData.recurringTournaments) {
    tournamentsData.recurringTournaments.forEach(recurringTournament => {
      const generatedTournaments = generateRecurringTournament(
        recurringTournament,
        startDate,
        endDate
      );
      tournaments.push(...generatedTournaments);
    });
  }

  return tournaments;
};

/**
 * Genera instancias de un torneo recurrente dentro de un rango de fechas
 */
const generateRecurringTournament = (recurringTournament, rangeStart, rangeEnd) => {
  const tournaments = [];
  const { recurrence } = recurringTournament;

  const recurrenceStart = new Date(recurrence.startDate + 'T00:00:00');
  const recurrenceEnd = recurrence.endDate
    ? new Date(recurrence.endDate + 'T00:00:00')
    : new Date('2099-12-31T00:00:00');

  const start = new Date(Math.max(new Date(rangeStart), recurrenceStart));
  const end = new Date(Math.min(new Date(rangeEnd), recurrenceEnd));

  if (recurrence.type === 'weekly') {
    generateWeeklyTournaments(recurringTournament, start, end, tournaments);
  }
  // Aquí se pueden agregar otros tipos: biweekly, monthly, etc.

  return tournaments;
};

/**
 * Genera torneos semanales
 */
const generateWeeklyTournaments = (recurringTournament, start, end, tournaments) => {
  const { recurrence } = recurringTournament;
  const targetDayOfWeek = recurrence.dayOfWeek; // 0=Domingo, 1=Lunes, ..., 6=Sábado

  // Encontrar el primer día que coincida con el día de la semana objetivo
  let currentDate = new Date(start);
  const currentDayOfWeek = currentDate.getDay();

  // Calcular días hasta el próximo día objetivo
  let daysUntilTarget = (targetDayOfWeek - currentDayOfWeek + 7) % 7;
  if (daysUntilTarget === 0 && currentDate > start) {
    daysUntilTarget = 7;
  }

  currentDate.setDate(currentDate.getDate() + daysUntilTarget);

  // Generar torneos semanales
  while (currentDate <= end) {
    const dateStr = formatDateToString(currentDate);

    // Crear una instancia del torneo para esta fecha
    const tournamentInstance = {
      ...recurringTournament,
      id: `${recurringTournament.id}_${dateStr}`,
      date: dateStr,
      isRecurring: true,
      recurringId: recurringTournament.id
    };

    // Remover la propiedad recurrence del torneo generado
    delete tournamentInstance.recurrence;

    tournaments.push(tournamentInstance);

    // Avanzar una semana
    currentDate.setDate(currentDate.getDate() + 7);
  }
};

/**
 * Formatea una fecha a string YYYY-MM-DD
 */
const formatDateToString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Obtiene todos los torneos para un rango de fechas específico
 * Esta función es la que se debe usar en los componentes
 */
export const getTournamentsForDateRange = (tournamentsData, startDate, endDate) => {
  return generateTournaments(tournamentsData, startDate, endDate);
};

/**
 * Obtiene torneos para una fecha específica
 */
export const getTournamentsForDate = (tournamentsData, dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);

  return generateTournaments(tournamentsData, date, nextDay);
};