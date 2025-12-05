import React, { createContext, useState, useEffect } from 'react';
import locales from '../../locales.json';

export const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Obtener idioma guardado en localStorage o usar el idioma del navegador
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && (savedLanguage === 'es-MX' || savedLanguage === 'en-US')) {
      return savedLanguage;
    }
    // Detectar idioma del navegador
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('es') ? 'es-MX' : 'en-US';
  });

  const [isLanguageFading, setIsLanguageFading] = useState(false);

  // Guardar idioma preferido en localStorage
  useEffect(() => {
    localStorage.setItem('preferredLanguage', currentLanguage);
    // Actualizar el atributo lang del HTML
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const changeLanguage = (newLanguage) => {
    if (newLanguage === currentLanguage) return;

    // Animación de fade out
    setIsLanguageFading(true);

    setTimeout(() => {
      setCurrentLanguage(newLanguage);

      // Animación de fade in
      setTimeout(() => {
        setIsLanguageFading(false);
      }, 50);
    }, 300);
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = locales[currentLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key} for language ${currentLanguage}`);
        return key;
      }
    }

    return value || key;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    isLanguageFading,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};
