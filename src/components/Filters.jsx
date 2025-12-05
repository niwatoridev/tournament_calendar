import React from 'react';
import '../styles/Filters.css';

const CITIES = ['Puebla', 'Ciudad de Mexico'];
const TCGS = ['Pokemon TCG', 'Magic: The Gathering', 'Yu-Gi-Oh!'];

const Filters = ({ selectedCity, selectedTCG, onCityChange, onTCGChange }) => {
  return (
    <div className="filters">
      <div className="filter-group">
        <label htmlFor="city-select">Ciudad:</label>
        <select
          id="city-select"
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          className="filter-select"
        >
          <option value="">Todas las ciudades</option>
          {CITIES.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="tcg-select">Juego:</label>
        <select
          id="tcg-select"
          value={selectedTCG}
          onChange={(e) => onTCGChange(e.target.value)}
          className="filter-select"
        >
          <option value="">Todos los juegos</option>
          {TCGS.map(tcg => (
            <option key={tcg} value={tcg}>{tcg}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;
