import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import '../styles/Filters.css';

const CITIES = ['Puebla', 'Ciudad de Mexico'];
const TCGS = ['Pokemon TCG', 'Magic: The Gathering', 'Yu-Gi-Oh!'];

const Filters = ({ selectedCity, selectedTCG, onCityChange, onTCGChange }) => {
  const { t, isLanguageFading } = useTranslation();

  return (
    <div className={`filters ${isLanguageFading ? 'fade-transition' : ''}`}>
      <div className="filter-group">
        <label htmlFor="city-select">{t('filters.city')}:</label>
        <select
          id="city-select"
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          className="filter-select"
        >
          <option value="">{t('filters.allCities')}</option>
          {CITIES.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="tcg-select">{t('filters.tcg')}:</label>
        <select
          id="tcg-select"
          value={selectedTCG}
          onChange={(e) => onTCGChange(e.target.value)}
          className="filter-select"
        >
          <option value="">{t('filters.allTCGs')}</option>
          {TCGS.map(tcg => (
            <option key={tcg} value={tcg}>{tcg}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;
