# 🔌 REFERENCIA RÁPIDA DE ENDPOINTS CRUD

## 🧔 BARBERS (Peluqueros)

```
GET    /api/barbers                      ← Listar todos
POST   /api/barbers                      ← Crear uno
GET    /api/barbers/:id                  ← Obtener detalle
PUT    /api/barbers/:id                  ← Actualizar
DELETE /api/barbers/:id                  ← Eliminar
```

### Parámetros

**POST /api/barbers** (Crear)
```json
{
  "name": "Carlos García",
  "email": "carlos@barberia.com",
  "phone": "+54 9 1234 5678",
  "specialization": "Barbería Premium",
  "active": true
}
```

**PUT /api/barbers/:id** (Actualizar)
```json
{
  "name": "Nuevo nombre",
  "phone": "Nuevo teléfono",
  "specialization": "Nueva especialización",
  "active": false
}
```

---

## 👥 CLIENTS (Clientes)

```
GET    /api/clients                      ← Listar todos
POST   /api/clients                      ← Crear uno
GET    /api/clients/:id                  ← Obtener detalle
PUT    /api/clients/:id                  ← Actualizar
DELETE /api/clients/:id                  ← Eliminar
```

### Parámetros

**POST /api/clients** (Crear)
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+54 9 1111 2222",
  "status": "active"
}
```

**PUT /api/clients/:id** (Actualizar)
```json
{
  "name": "Nuevo nombre",
  "email": "newemail@example.com",
  "phone": "Nuevo teléfono",
  "status": "active"
}
```

---

## 📅 APPOINTMENTS (Turnos)

```
GET    /api/appointments                 ← Listar todos
POST   /api/appointments                 ← Crear uno
GET    /api/appointments/:id             ← Obtener detalle
PUT    /api/appointments/:id             ← Actualizar
DELETE /api/appointments/:id             ← Eliminar
```

### Parámetros

**POST /api/appointments** (Crear)
```json
{
  "clientId": "456...",
  "barberId": "123...",
  "date": "2026-01-01T00:00:00.000Z",
  "time": "14:30",
  "service": "Haircut + Beard",
  "status": "SCHEDULED"
}
```

**PUT /api/appointments/:id** (Actualizar)
```json
{
  "time": "15:00",
  "service": "Haircut + Beard + Massage",
  "status": "SCHEDULED"
}
```

---

## 🔐 Autenticación

Todos los endpoints requieren sesión autenticada.

**Acceso:** Debes estar logueado en `/app`

**Headers automáticos:** Las cookies de sesión se envían automáticamente

---

## 📝 Ejemplos cURL

### Crear Peluquero

```bash
curl -X POST http://localhost:3000/api/barbers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Carlos García",
    "email": "carlos@barberia.com",
    "phone": "+54 9 1234 5678",
    "specialization": "Barbería Premium",
    "active": true
  }'
```

### Actualizar Peluquero

```bash
curl -X PUT http://localhost:3000/api/barbers/123 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Carlos García Actualizado",
    "phone": "+54 9 9876 5432"
  }'
```

### Eliminar Peluquero

```bash
curl -X DELETE http://localhost:3000/api/barbers/123
```

---

## 🧪 Respuestas

### Success (201 Created / 200 OK)

```json
{
  "id": "123...",
  "name": "Carlos García",
  "email": "carlos@barberia.com",
  "phone": "+54 9 1234 5678",
  "specialization": "Barbería Premium",
  "active": true,
  "createdAt": "2025-12-31T...",
  "updatedAt": "2025-12-31T..."
}
```

### Error (400 Bad Request)

```json
{
  "error": "Nombre y email son requeridos"
}
```

### Error (404 Not Found)

```json
{
  "error": "Peluquero no encontrado"
}
```

### Error (401 Unauthorized)

```json
{
  "error": "No autorizado"
}
```

---

## ⚡ Filtros en GET

### Barbers
```
?page=1&limit=10
?search=Carlos
?active=true
```

### Clients
```
?page=1&limit=10
?search=Juan
?status=active
```

### Appointments
```
?page=1&limit=10
?status=SCHEDULED
```

---

## 📊 Status Codes

| Código | Significado |
|--------|------------|
| 200 | OK - Éxito |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - No autenticado |
| 404 | Not Found - Recurso no encontrado |
| 500 | Server Error - Error interno |

---

## 🎯 Prueba Rápida

Copia en la consola (F12):

```javascript
// Test BARBERS
await fetch('/api/barbers').then(r => r.json()).then(console.log)

// Test CLIENTS
await fetch('/api/clients').then(r => r.json()).then(console.log)

// Test APPOINTMENTS
await fetch('/api/appointments').then(r => r.json()).then(console.log)
```

---

**Todos los endpoints CRUD están funcionales y listos para probar.** ✅
