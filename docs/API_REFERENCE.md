# API Endpoints - Elvis Barber Studio CRM

## Base URL
```
http://localhost:3000/api
```

## Authentication
Todos los endpoints requieren una sesión activa (NextAuth). Si no hay sesión, devuelven `401 Unauthorized`.

---

## 👥 CLIENTES (Clients)

### GET `/api/clients`
Obtener lista de clientes con paginación y búsqueda.

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Resultados por página (default: 10)
- `search` (opcional): Buscar por nombre, email o teléfono
- `status` (opcional): Filtrar por estado (active, inactive, all)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "phone": "+54 11 2345-6789",
      "status": "active",
      "createdAt": "2024-12-28T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 47,
    "pages": 5
  }
}
```

### POST `/api/clients`
Crear nuevo cliente.

**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+54 11 2345-6789",
  "status": "active"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+54 11 2345-6789",
  "status": "active",
  "createdAt": "2024-12-28T10:00:00Z"
}
```

### GET `/api/clients/:id`
Obtener cliente específico con historial de citas.

**Response:**
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+54 11 2345-6789",
  "status": "active",
  "appointments": [
    {
      "id": 1,
      "date": "2024-12-28T15:00:00Z",
      "time": "15:00",
      "status": "SCHEDULED"
    }
  ],
  "createdAt": "2024-12-28T10:00:00Z"
}
```

### PUT `/api/clients/:id`
Actualizar cliente.

**Body:** (todos los campos opcionales)
```json
{
  "name": "Juan Pérez Updated",
  "email": "newemail@example.com",
  "phone": "+54 11 9999-9999",
  "status": "inactive"
}
```

**Response:** Cliente actualizado

### DELETE `/api/clients/:id`
Eliminar cliente.

**Response:**
```json
{
  "message": "Cliente eliminado"
}
```

---

## 📅 TURNOS (Appointments)

### GET `/api/appointments`
Obtener lista de turnos.

**Query Parameters:**
- `page` (opcional)
- `limit` (opcional)
- `status` (opcional): SCHEDULED, COMPLETED, CANCELLED

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "clientId": 1,
      "barberId": 1,
      "date": "2024-12-28T15:00:00Z",
      "time": "15:00",
      "service": "Corte",
      "status": "SCHEDULED",
      "client": { "id": 1, "name": "Juan Pérez" },
      "barber": { "id": 1, "name": "Carlos García" }
    }
  ],
  "pagination": { ... }
}
```

### POST `/api/appointments`
Crear nuevo turno.

**Body:**
```json
{
  "clientId": 1,
  "barberId": 1,
  "date": "2024-12-28",
  "time": "15:00",
  "service": "Corte Clásico",
  "status": "SCHEDULED"
}
```

**Response:** `201 Created` - Turno creado

### GET `/api/appointments/:id`
Obtener turno específico.

**Response:** Objeto turno con client y barber

### PUT `/api/appointments/:id`
Actualizar turno.

**Body:**
```json
{
  "date": "2024-12-29",
  "time": "16:00",
  "service": "Afeitado",
  "status": "SCHEDULED"
}
```

### DELETE `/api/appointments/:id`
Eliminar turno.

---

## ✂️ PELUQUEROS (Barbers)

### GET `/api/barbers`
Obtener lista de peluqueros.

**Query Parameters:**
- `page`, `limit`
- `search`: Buscar por nombre
- `active`: true/false

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Carlos García",
      "email": "carlos@example.com",
      "phone": "+54 11 3456-7890",
      "specialization": "Barbería General",
      "active": true,
      "createdAt": "2024-12-01T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### POST `/api/barbers`
Crear nuevo peluquero.

**Body:**
```json
{
  "name": "Carlos García",
  "email": "carlos@example.com",
  "phone": "+54 11 3456-7890",
  "specialization": "Barbería Clásica",
  "active": true
}
```

### GET `/api/barbers/:id`
Obtener peluquero con histórico de turnos.

### PUT `/api/barbers/:id`
Actualizar peluquero.

### DELETE `/api/barbers/:id`
Eliminar peluquero.

---

## 💰 COMISIONES (Commissions)

### GET `/api/commissions`
Obtener lista de comisiones.

**Query Parameters:**
- `page`, `limit`
- `status`: PENDING, PAID
- `barberId`: Filtrar por peluquero

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "barberId": 1,
      "appointmentId": 1,
      "amount": 150.00,
      "status": "PENDING",
      "barber": { "id": 1, "name": "Carlos García" },
      "createdAt": "2024-12-28T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### POST `/api/commissions`
Crear nueva comisión.

**Body:**
```json
{
  "barberId": 1,
  "appointmentId": 1,
  "amount": 150.00,
  "status": "PENDING"
}
```

### GET `/api/commissions/:id`
Obtener comisión específica.

### PUT `/api/commissions/:id`
Actualizar comisión (marcar como pagada).

**Body:**
```json
{
  "amount": 150.00,
  "status": "PAID"
}
```

### DELETE `/api/commissions/:id`
Eliminar comisión.

---

## Error Handling

Todos los endpoints devuelven errores en este formato:

```json
{
  "error": "Descripción del error"
}
```

**Códigos HTTP comunes:**
- `201`: Recurso creado exitosamente
- `400`: Datos inválidos o faltantes
- `401`: No autorizado (sin sesión)
- `404`: Recurso no encontrado
- `500`: Error interno del servidor

---

## Ejemplos de Uso (cURL)

### Crear cliente
```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+54 11 2345-6789"
  }'
```

### Obtener clientes
```bash
curl "http://localhost:3000/api/clients?page=1&limit=10&search=juan"
```

### Actualizar cliente
```bash
curl -X PUT http://localhost:3000/api/clients/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez Updated"
  }'
```

### Eliminar cliente
```bash
curl -X DELETE http://localhost:3000/api/clients/1
```

---

## Notas Importantes

1. **Paginación**: Por defecto, cada endpoint devuelve 10 resultados. Usar `?limit=` para cambiar.
2. **Búsqueda**: El parámetro `search` busca en múltiples campos (name, email, phone).
3. **Autenticación**: Requiere sesión válida. Si no hay sesión, obtendrás 401.
4. **Timestamps**: Todos están en ISO 8601 (UTC).
5. **IDs**: Todos son números enteros.

