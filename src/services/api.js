const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper para obtener headers con autenticación
const getAuthHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// ==================== AUTHENTICATION ====================

/**
 * Inicia sesión con email y password
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al iniciar sesión');
    }
    return await response.json();
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Cierra sesión
 */
export const logout = async (refreshToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) {
      throw new Error('Error al cerrar sesión');
    }
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

/**
 * Refresca el access token
 */
export const refreshToken = async (refreshToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) {
      throw new Error('Error al refrescar token');
    }
    return await response.json();
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

/**
 * Solicita reseteo de contraseña
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/request-password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al solicitar reseteo');
    }
    return await response.json();
  } catch (error) {
    console.error('Error requesting password reset:', error);
    throw error;
  }
};

/**
 * Resetea la contraseña usando un token
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPassword }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al resetear contraseña');
    }
    return await response.json();
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// ==================== TOURNAMENTS ====================

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
 * Crea un nuevo torneo (único o recurrente) - requiere autenticación
 * El backend decide automáticamente basándose en si tiene 'date' o 'recurrence'
 */
export const createTournament = async (tournamentData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tournaments`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(tournamentData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear torneo');
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
 * Actualiza un torneo (único o recurrente) - requiere autenticación
 */
export const updateTournament = async (id, tournamentData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tournaments/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(tournamentData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al actualizar torneo');
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
 * Elimina un torneo (único o recurrente) - requiere autenticación
 */
export const deleteTournament = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tournaments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al eliminar torneo');
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

// ==================== USER MANAGEMENT (ADMIN) ====================

/**
 * Obtiene todos los usuarios (solo admin)
 */
export const getUsers = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al obtener usuarios');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Crea un nuevo usuario (solo admin)
 */
export const createUser = async (userData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear usuario');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Actualiza un usuario (solo admin)
 */
export const updateUser = async (userId, userData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al actualizar usuario');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Elimina un usuario (solo admin)
 */
export const deleteUser = async (userId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al eliminar usuario');
    }
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

/**
 * Resetea la contraseña de un usuario (solo admin)
 */
export const adminResetPassword = async (userId, newPassword, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/reset-password`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ newPassword }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al resetear contraseña');
    }
    return await response.json();
  } catch (error) {
    console.error('Error resetting user password:', error);
    throw error;
  }
};

// ==================== STORE MANAGEMENT ====================

/**
 * Obtiene todas las tiendas
 */
export const getStores = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stores`);
    if (!response.ok) {
      throw new Error('Error al obtener tiendas');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching stores:', error);
    throw error;
  }
};

/**
 * Obtiene una tienda por ID
 */
export const getStoreById = async (storeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stores/${storeId}`);
    if (!response.ok) {
      throw new Error('Error al obtener tienda');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching store:', error);
    throw error;
  }
};

/**
 * Obtiene los torneos de una tienda específica
 */
export const getStoreTournaments = async (storeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stores/${storeId}/tournaments`);
    if (!response.ok) {
      throw new Error('Error al obtener torneos de tienda');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching store tournaments:', error);
    throw error;
  }
};

/**
 * Crea una nueva tienda (solo admin)
 */
export const createStore = async (storeData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stores`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(storeData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear tienda');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating store:', error);
    throw error;
  }
};

/**
 * Actualiza una tienda (admin o store owner)
 */
export const updateStore = async (storeId, storeData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stores/${storeId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(storeData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al actualizar tienda');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating store:', error);
    throw error;
  }
};

/**
 * Elimina una tienda (solo admin)
 */
export const deleteStore = async (storeId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stores/${storeId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al eliminar tienda');
    }
    return true;
  } catch (error) {
    console.error('Error deleting store:', error);
    throw error;
  }
};

/**
 * Sube un logo para una tienda (admin o store owner)
 */
export const uploadStoreLogo = async (storeId, logoFile, token) => {
  try {
    const formData = new FormData();
    formData.append('logo', logoFile);

    const response = await fetch(`${API_BASE_URL}/stores/${storeId}/logo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al subir logo');
    }
    return await response.json();
  } catch (error) {
    console.error('Error uploading store logo:', error);
    throw error;
  }
};