# Sistema de Internacionalización (i18n)

Este proyecto incluye un sistema completo de internacionalización que permite cambiar entre Español (es-MX) e Inglés (en-US), y es escalable para agregar más idiomas.

## Estructura del Sistema

### Archivos Principales

1. **`locales.json`** - Archivo de configuración central con todas las traducciones
2. **`src/context/TranslationContext.jsx`** - Contexto React que maneja el estado del idioma
3. **`src/hooks/useTranslation.js`** - Hook personalizado para acceder a las traducciones
4. **`src/components/LanguageSwitcher.jsx`** - Componente de cambio de idioma

## Cómo Usar

### En Componentes

```jsx
import { useTranslation } from '../hooks/useTranslation';

function MiComponente() {
  const { t, currentLanguage, isLanguageFading } = useTranslation();

  return (
    <div className={isLanguageFading ? 'fade-transition' : ''}>
      <h1>{t('app.title')}</h1>
      <p>{t('app.subtitle')}</p>
    </div>
  );
}
```

### Propiedades del Hook

- **`t(key)`** - Función para obtener una traducción usando una clave con notación de punto
- **`currentLanguage`** - Idioma actual ('es-MX' o 'en-US')
- **`changeLanguage(lang)`** - Función para cambiar el idioma
- **`isLanguageFading`** - Estado booleano para animaciones de transición

## Agregar Nuevos Idiomas

### Paso 1: Agregar al archivo locales.json

```json
{
  "es-MX": { ... },
  "en-US": { ... },
  "fr-FR": {
    "app": {
      "title": "Calendrier des Tournois TCG",
      "subtitle": "Trouvez des tournois dans votre ville"
    }
  }
}
```

### Paso 2: Actualizar TranslationContext.jsx

Modificar la detección automática de idioma si es necesario:

```jsx
const savedLanguage = localStorage.getItem('preferredLanguage');
if (savedLanguage && ['es-MX', 'en-US', 'fr-FR'].includes(savedLanguage)) {
  return savedLanguage;
}
```

### Paso 3: Actualizar LanguageSwitcher.jsx

Agregar soporte para el nuevo idioma en el componente de cambio:

```jsx
const handleToggle = () => {
  // Lógica para rotar entre los idiomas disponibles
  const languages = ['es-MX', 'en-US', 'fr-FR'];
  const currentIndex = languages.indexOf(currentLanguage);
  const nextIndex = (currentIndex + 1) % languages.length;
  changeLanguage(languages[nextIndex]);
};
```

## Características

### Persistencia
- El idioma seleccionado se guarda en `localStorage`
- Se mantiene entre sesiones del navegador
- Actualiza automáticamente el atributo `lang` del HTML

### Detección Automática
- Si no hay preferencia guardada, detecta el idioma del navegador
- Fallback a inglés si el idioma no está soportado

### Animaciones
- Transiciones suaves al cambiar de idioma usando `isLanguageFading`
- Efecto fade-in/fade-out de 300ms

### Formateo de Fechas
El sistema también adapta el formateo de fechas según el idioma:

```jsx
const locale = currentLanguage === 'es-MX' ? 'es-MX' : 'en-US';
date.toLocaleDateString(locale, options);
```

## Estructura de las Claves de Traducción

Las traducciones están organizadas por secciones:

```
app.*           - Textos generales de la aplicación
filters.*       - Filtros y opciones de búsqueda
calendar.*      - Componente del calendario
tournament.*    - Tarjetas de torneo
addTournament.* - Formulario de agregar torneo
login.*         - Sección de login
days.*          - Días de la semana
```

## Ejemplo Completo

```jsx
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

function ExampleComponent() {
  const { t, currentLanguage, isLanguageFading, changeLanguage } = useTranslation();

  const handleClick = () => {
    const newLang = currentLanguage === 'es-MX' ? 'en-US' : 'es-MX';
    changeLanguage(newLang);
  };

  return (
    <div className={isLanguageFading ? 'fade-transition' : ''}>
      <h1>{t('app.title')}</h1>
      <p>{t('app.subtitle')}</p>
      <button onClick={handleClick}>
        {currentLanguage === 'es-MX' ? 'Switch to English' : 'Cambiar a Español'}
      </button>
    </div>
  );
}
```

## Notas Importantes

1. Siempre usar el hook `useTranslation` dentro de componentes que estén envueltos por `TranslationProvider`
2. Las claves de traducción usan notación de punto: `'seccion.subseccion.texto'`
3. Si una clave no existe, se retorna la clave misma como fallback
4. Las animaciones de transición son opcionales - agregar la clase solo si se desea el efecto
