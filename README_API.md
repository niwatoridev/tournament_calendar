# Integración con Backend API

Este documento explica cómo activar la integración con el backend cuando esté listo.

## Estado Actual

Por defecto, la aplicación funciona con:
- Datos estáticos del archivo `src/data/tournaments.json`
- Torneos agregados localmente se guardan en `localStorage`

## Activar la API

Para conectar con el backend, sigue estos pasos:

### 1. Verificar que el backend esté corriendo

Asegúrate de que tu backend esté corriendo en `http://localhost:3000` (o la URL que hayas configurado).

### 2. Actualizar la URL de la API (si es necesario)

Si tu backend está en una URL diferente a `http://localhost:3000/api`, actualiza el archivo `.env`:

```env
VITE_API_URL=http://tu-url-del-backend/api
```

### 3. Activar el modo API en App.jsx

Abre `src/App.jsx` y cambia la línea 24:

**ANTES:**
```javascript
const [useAPI, setUseAPI] = useState(false); // Cambiar a true cuando el backend esté listo
```

**DESPUÉS:**
```javascript
const [useAPI, setUseAPI] = useState(true); // API activada
```

### 4. Reiniciar el servidor de desarrollo

```bash
npm run dev
```

## Cómo funciona

### Carga de Torneos

- **Modo API OFF** (`useAPI = false`):
  - Lee torneos del JSON local
  - Los torneos agregados se guardan en localStorage

- **Modo API ON** (`useAPI = true`):
  - Carga torneos desde el backend al iniciar
  - Si falla la conexión, hace fallback al JSON local
  - Muestra mensajes de carga y error

### Agregar Torneos

- **Modo API OFF**: Guarda en localStorage
- **Modo API ON**:
  - Envía POST a `/api/tournaments/unique` o `/api/tournaments/recurring`
  - Muestra "Guardando..." mientras se procesa
  - Deshabilita botones durante el envío

## Estructura de la API

El frontend espera estos endpoints:

```
GET  /api/tournaments              # Obtener todos los torneos
POST /api/tournaments/unique       # Crear torneo único
POST /api/tournaments/recurring    # Crear torneo recurrente
PUT  /api/tournaments/unique/:id   # Actualizar torneo único
PUT  /api/tournaments/recurring/:id # Actualizar torneo recurrente
DELETE /api/tournaments/unique/:id  # Eliminar torneo único
DELETE /api/tournaments/recurring/:id # Eliminar torneo recurrente
```

## Formato de Datos

### GET /api/tournaments
Debe devolver:
```json
{
  "uniqueTournaments": [...],
  "recurringTournaments": [...]
}
```

### POST /api/tournaments/unique
Envía:
```json
{
  "tcg": "Pokemon TCG",
  "city": "Puebla",
  "store": "Top Tier",
  "time": "19:00",
  "entryFee": 100,
  "tournamentType": "Torneo de Liga",
  "date": "2025-12-05"
}
```

### POST /api/tournaments/recurring
Envía:
```json
{
  "tcg": "Pokemon TCG",
  "city": "Puebla",
  "store": "Top Tier",
  "time": "19:00",
  "entryFee": 100,
  "tournamentType": "Torneo de Liga",
  "recurrence": {
    "type": "weekly",
    "dayOfWeek": 4,
    "startDate": "2025-01-01",
    "endDate": "2025-12-31"
  }
}
```

## Solución de Problemas

### Error de CORS
Si ves errores de CORS en la consola, asegúrate de que el backend tenga configurado:
```javascript
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

### La API no responde
1. Verifica que el backend esté corriendo
2. Verifica la URL en `.env`
3. Revisa la consola del navegador para ver errores específicos
4. La app hará fallback al JSON local automáticamente

### Los torneos no se guardan
1. Revisa la consola del navegador
2. Verifica que los endpoints POST estén funcionando
3. Confirma que el formato de datos sea correcto

## Desarrollo Local

Para probar sin backend:
1. Mantén `useAPI = false` en App.jsx
2. Los datos se guardarán en localStorage
3. Puedes ver los datos guardados en DevTools > Application > Local Storage