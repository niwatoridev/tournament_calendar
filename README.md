# Calendario de Torneos TCG

Aplicación web para visualizar torneos de Trading Card Games (TCG) en diferentes ciudades de México.

## Características

- 📅 Calendario mensual interactivo con navegación
- 🎮 Filtrado por ciudad y juego (Pokemon TCG, Magic: The Gathering, Yu-Gi-Oh!)
- 🏪 Visualización de torneos por tienda
- ⭐ Marcar torneos como "Me interesa" (guardado en localStorage)
- 📱 Diseño responsivo para móviles y tablets
- 🔐 UI preparada para sistema de autenticación (próximamente)

## Tecnologías

- React 18
- Vite
- CSS3 (sin frameworks adicionales)

## Instalación

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Build para producción

```bash
npm run build
```

## Preview del build

```bash
npm run preview
```

## Estructura del proyecto

```
src/
├── components/          # Componentes React
│   ├── Calendar.jsx    # Calendario principal
│   ├── Filters.jsx     # Filtros de ciudad y TCG
│   ├── TournamentCard.jsx  # Tarjeta de torneo
│   └── LoginSection.jsx    # UI de login (no funcional)
├── data/
│   └── tournaments.json    # Datos de torneos
├── styles/             # Estilos CSS
├── utils/              # Utilidades (hooks personalizados)
└── App.jsx            # Componente principal

```

## Datos de ejemplo

Los torneos están definidos en [src/data/tournaments.json](src/data/tournaments.json). Cada torneo incluye:

- TCG (juego)
- Ciudad
- Tienda
- Fecha
- Hora
- Precio de entrada
- Tipo de torneo

## Próximas funcionalidades

- [ ] Sistema de autenticación para dueños de tiendas
- [ ] Backend API para gestión de torneos
- [ ] Base de datos para almacenamiento persistente
- [ ] Registro de usuarios a torneos
- [ ] Sistema de notificaciones

## Deploy

Este proyecto está listo para ser desplegado en Netlify:

1. Conecta tu repositorio a Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`