import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import '../styles/LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, t } = useTranslation();

  const handleToggle = () => {
    const newLanguage = currentLanguage === 'es-MX' ? 'en-US' : 'es-MX';
    changeLanguage(newLanguage);
  };

  return (
    <button
      className="language-switcher"
      onClick={handleToggle}
      aria-label="Change language"
      title={currentLanguage === 'es-MX' ? t('languageSwitcher.switchToEnglish') : t('languageSwitcher.switchToSpanish')}
    >
      <span className="language-flag">
        {currentLanguage === 'es-MX' ? '🇲🇽' : '🇺🇸'}
      </span>
      <span className="language-code">
        {currentLanguage === 'es-MX' ? 'ES' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
