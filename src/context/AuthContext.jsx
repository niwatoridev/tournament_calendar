import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Cargar datos de autenticación desde localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedRefreshToken && storedUser) {
      setToken(storedToken);
      setRefreshToken(storedRefreshToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  // Función para guardar tokens en localStorage
  const saveAuthData = useCallback((accessToken, refreshTokenValue, userData) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshTokenValue);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(accessToken);
    setRefreshToken(refreshTokenValue);
    setUser(userData);
  }, []);

  // Función para limpiar datos de autenticación
  const clearAuthData = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  // Función de login
  const login = useCallback(async (email, password) => {
    setIsAuthenticating(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
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

      const data = await response.json();
      saveAuthData(data.accessToken, data.refreshToken, data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsAuthenticating(false);
    }
  }, [saveAuthData]);

  // Función de logout
  const logout = useCallback(async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      // Intentar cerrar sesión en el servidor
      if (refreshToken) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
    }
  }, [refreshToken, clearAuthData]);

  // Función para refrescar el token
  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) {
      clearAuthData();
      return null;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('No se pudo refrescar el token');
      }

      const data = await response.json();
      saveAuthData(data.accessToken, refreshToken, user);
      return data.accessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      clearAuthData();
      return null;
    }
  }, [refreshToken, user, saveAuthData, clearAuthData]);

  // Verificar si el usuario es admin
  const isAdmin = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  // Verificar si el usuario es tienda
  const isStore = useCallback(() => {
    return user?.role === 'store';
  }, [user]);

  // Obtener el store ID si es usuario tipo tienda
  const getStoreId = useCallback(() => {
    return user?.storeId || null;
  }, [user]);

  const value = {
    user,
    token,
    refreshToken,
    isLoading,
    isAuthenticating,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    refreshAccessToken,
    isAdmin,
    isStore,
    getStoreId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
