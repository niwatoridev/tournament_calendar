const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Obtiene todos los torneos (únicos y recurrentes)
 */
export const getTournaments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tournaments`);
    if (!response.ok) {
      throw new Error('Error al obtener torneos');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    throw error;
  }
};

/**
 * Crea un nuevo torneo (único o recurrente)
 * El backend decide automáticamente basándose en si tiene 'date' o 'recurrence'
 */
export const createTournament = async (tournamentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tournaments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tournamentData),
    });
    if (!response.ok) {
      throw new Error('Error al crear torneo');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating tournament:', error);
    throw error;
  }
};

// Aliases para mantener compatibilidad con código existente
export const createUniqueTournament = createTournament;
export const createRecurringTournament = createTournament;

/**
 * Actualiza un torneo (único o recurrente)
 */
export const updateTournament = async (id, tournamentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tournaments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tournamentData),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar torneo');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating tournament:', error);
    throw error;
  }
};

// Aliases para mantener compatibilidad
export const updateUniqueTournament = updateTournament;
export const updateRecurringTournament = updateTournament;

/**
 * Elimina un torneo (único o recurrente)
 */
export const deleteTournament = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tournaments/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error al eliminar torneo');
    }
    return true;
  } catch (error) {
    console.error('Error deleting tournament:', error);
    throw error;
  }
};

// Aliases para mantener compatibilidad
export const deleteUniqueTournament = deleteTournament;
export const deleteRecurringTournament = deleteTournament;