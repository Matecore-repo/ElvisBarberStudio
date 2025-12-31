# 🧪 GUÍA COMPLETA DE PRUEBAS CRUD

## Instrucciones

Ejecuta esto en la consola del navegador (F12) mientras estés en cualquier página autenticada (`http://localhost:3000/app`).

---

## 1️⃣ PRUEBAS DE BARBERS (Peluqueros)

### 1.1 GET - Obtener lista de peluqueros

```javascript
// Obtener lista paginada de peluqueros
await fetch('/api/barbers?page=1&limit=10').then(r => r.json()).then(console.log)
```

**Respuesta esperada:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "pages": 0
  }
}
```

### 1.2 POST - Crear peluquero

```javascript
// Crear nuevo peluquero
const barberData = {
  name: 'Carlos García',
  email: 'carlos@barberia.com',
  phone: '+54 9 1234 5678',
  specialization: 'Barbería Premium',
  active: true
}

const barber = await fetch('/api/barbers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(barberData)
}).then(r => r.json())

console.log('Peluquero creado:', barber)
// Guardar el ID para los siguientes tests
const barberId = barber.id
console.log('ID del peluquero:', barberId)
```

**Respuesta esperada:**
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

### 1.3 GET - Obtener peluquero específico

```javascript
// Obtener detalles de un peluquero específico
await fetch(`/api/barbers/${barberId}`).then(r => r.json()).then(console.log)
```

**Respuesta esperada:** Objeto del peluquero con sus citas (últimas 10)

### 1.4 PUT - Actualizar peluquero

```javascript
// Actualizar peluquero
const updatedBarberData = {
  name: 'Carlos García Actualizado',
  phone: '+54 9 9876 5432',
  specialization: 'Diseñador de Barba',
  active: true
}

const updatedBarber = await fetch(`/api/barbers/${barberId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(updatedBarberData)
}).then(r => r.json())

console.log('Peluquero actualizado:', updatedBarber)
```

### 1.5 DELETE - Eliminar peluquero

```javascript
// Eliminar peluquero
const deleteResult = await fetch(`/api/barbers/${barberId}`, {
  method: 'DELETE'
}).then(r => r.json())

console.log('Resultado eliminación:', deleteResult)
// Esperado: { "message": "Peluquero eliminado" }
```

---

## 2️⃣ PRUEBAS DE CLIENTS (Clientes)

### 2.1 GET - Obtener lista de clientes

```javascript
// Obtener lista paginada de clientes
await fetch('/api/clients?page=1&limit=10').then(r => r.json()).then(console.log)
```

### 2.2 POST - Crear cliente

```javascript
// Crear nuevo cliente
const clientData = {
  name: 'Juan Pérez',
  email: 'juan@example.com',
  phone: '+54 9 1111 2222',
  status: 'active'
}

const client = await fetch('/api/clients', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(clientData)
}).then(r => r.json())

console.log('Cliente creado:', client)
const clientId = client.id
console.log('ID del cliente:', clientId)
```

**Respuesta esperada:**
```json
{
  "id": "456...",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+54 9 1111 2222",
  "status": "active",
  "createdAt": "2025-12-31T...",
  "updatedAt": "2025-12-31T..."
}
```

### 2.3 GET - Obtener cliente específico

```javascript
// Obtener detalles de un cliente
await fetch(`/api/clients/${clientId}`).then(r => r.json()).then(console.log)
```

### 2.4 PUT - Actualizar cliente

```javascript
// Actualizar cliente
const updatedClientData = {
  name: 'Juan Pérez Martínez',
  phone: '+54 9 3333 4444',
  status: 'active'
}

const updatedClient = await fetch(`/api/clients/${clientId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(updatedClientData)
}).then(r => r.json())

console.log('Cliente actualizado:', updatedClient)
```

### 2.5 DELETE - Eliminar cliente

```javascript
// Eliminar cliente
const deleteResult = await fetch(`/api/clients/${clientId}`, {
  method: 'DELETE'
}).then(r => r.json())

console.log('Resultado eliminación:', deleteResult)
// Esperado: { "message": "Cliente eliminado" }
```

---

## 3️⃣ PRUEBAS DE APPOINTMENTS (Turnos)

### 3.1 GET - Obtener lista de turnos

```javascript
// Obtener lista paginada de turnos
await fetch('/api/appointments?page=1&limit=10').then(r => r.json()).then(console.log)
```

### 3.2 POST - Crear turno

```javascript
// IMPORTANTE: Primero crear un cliente y un peluquero como se mostró arriba
// Luego:

const appointmentData = {
  clientId: clientId,           // ID del cliente creado
  barberId: barberId,           // ID del peluquero creado
  date: new Date(Date.now() + 86400000).toISOString(),  // Mañana
  time: '14:30',
  service: 'Haircut + Beard',
  status: 'SCHEDULED'
}

const appointment = await fetch('/api/appointments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(appointmentData)
}).then(r => r.json())

console.log('Turno creado:', appointment)
const appointmentId = appointment.id
console.log('ID del turno:', appointmentId)
```

**Respuesta esperada:**
```json
{
  "id": "789...",
  "clientId": "456...",
  "barberId": "123...",
  "date": "2026-01-01T00:00:00.000Z",
  "time": "14:30",
  "service": "Haircut + Beard",
  "status": "SCHEDULED",
  "client": {...},
  "barber": {...},
  "createdAt": "2025-12-31T...",
  "updatedAt": "2025-12-31T..."
}
```

### 3.3 GET - Obtener turno específico

```javascript
// Obtener detalles de un turno
await fetch(`/api/appointments/${appointmentId}`).then(r => r.json()).then(console.log)
```

### 3.4 PUT - Actualizar turno

```javascript
// Actualizar turno
const updatedAppointmentData = {
  time: '15:00',
  service: 'Haircut + Beard + Massage',
  status: 'SCHEDULED'
}

const updatedAppointment = await fetch(`/api/appointments/${appointmentId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(updatedAppointmentData)
}).then(r => r.json())

console.log('Turno actualizado:', updatedAppointment)
```

### 3.5 DELETE - Eliminar turno

```javascript
// Eliminar turno
const deleteResult = await fetch(`/api/appointments/${appointmentId}`, {
  method: 'DELETE'
}).then(r => r.json())

console.log('Resultado eliminación:', deleteResult)
// Esperado: { "message": "Turno eliminado" }
```

---

## 🧪 SCRIPT COMPLETO AUTOMATIZADO

Si prefieres ejecutar todo de una vez, copia y pega esto en la consola:

```javascript
console.log('🧔 INICIANDO PRUEBAS DE BARBERS...\n')

// 1. GET Barbers
const barbersResponse = await fetch('/api/barbers?page=1&limit=10')
const barbersData = await barbersResponse.json()
console.log('1️⃣ GET /api/barbers:', barbersData)

// 2. POST Barber
const newBarberResponse = await fetch('/api/barbers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Carlos García',
    email: 'carlos@barberia.com',
    phone: '+54 9 1234 5678',
    specialization: 'Barbería Premium',
    active: true
  })
})
const newBarber = await newBarberResponse.json()
console.log('2️⃣ POST /api/barbers:', newBarber)
const barberId = newBarber.id

// 3. GET Barber by ID
const barberDetailResponse = await fetch(`/api/barbers/${barberId}`)
const barberDetail = await barberDetailResponse.json()
console.log('3️⃣ GET /api/barbers/:id:', barberDetail)

// 4. PUT Barber
const updateBarberResponse = await fetch(`/api/barbers/${barberId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Carlos García Actualizado',
    phone: '+54 9 9876 5432'
  })
})
const updatedBarber = await updateBarberResponse.json()
console.log('4️⃣ PUT /api/barbers/:id:', updatedBarber)

console.log('\n👥 INICIANDO PRUEBAS DE CLIENTS...\n')

// 5. GET Clients
const clientsResponse = await fetch('/api/clients?page=1&limit=10')
const clientsData = await clientsResponse.json()
console.log('5️⃣ GET /api/clients:', clientsData)

// 6. POST Client
const newClientResponse = await fetch('/api/clients', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '+54 9 1111 2222',
    status: 'active'
  })
})
const newClient = await newClientResponse.json()
console.log('6️⃣ POST /api/clients:', newClient)
const clientId = newClient.id

// 7. GET Client by ID
const clientDetailResponse = await fetch(`/api/clients/${clientId}`)
const clientDetail = await clientDetailResponse.json()
console.log('7️⃣ GET /api/clients/:id:', clientDetail)

// 8. PUT Client
const updateClientResponse = await fetch(`/api/clients/${clientId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Juan Pérez Martínez',
    phone: '+54 9 3333 4444'
  })
})
const updatedClient = await updateClientResponse.json()
console.log('8️⃣ PUT /api/clients/:id:', updatedClient)

console.log('\n📅 INICIANDO PRUEBAS DE APPOINTMENTS...\n')

// 9. GET Appointments
const appointmentsResponse = await fetch('/api/appointments?page=1&limit=10')
const appointmentsData = await appointmentsResponse.json()
console.log('9️⃣ GET /api/appointments:', appointmentsData)

// 10. POST Appointment
const newAppointmentResponse = await fetch('/api/appointments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    clientId: clientId,
    barberId: barberId,
    date: new Date(Date.now() + 86400000).toISOString(),
    time: '14:30',
    service: 'Haircut + Beard',
    status: 'SCHEDULED'
  })
})
const newAppointment = await newAppointmentResponse.json()
console.log('🔟 POST /api/appointments:', newAppointment)
const appointmentId = newAppointment.id

// 11. GET Appointment by ID
const appointmentDetailResponse = await fetch(`/api/appointments/${appointmentId}`)
const appointmentDetail = await appointmentDetailResponse.json()
console.log('1️⃣1️⃣ GET /api/appointments/:id:', appointmentDetail)

// 12. PUT Appointment
const updateAppointmentResponse = await fetch(`/api/appointments/${appointmentId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    time: '15:00',
    service: 'Haircut + Beard + Massage'
  })
})
const updatedAppointment = await updateAppointmentResponse.json()
console.log('1️⃣2️⃣ PUT /api/appointments/:id:', updatedAppointment)

console.log('\n🧹 INICIANDO ELIMINACIONES...\n')

// 13. DELETE Appointment
const deleteAppointmentResponse = await fetch(`/api/appointments/${appointmentId}`, {
  method: 'DELETE'
})
const deleteAppointmentResult = await deleteAppointmentResponse.json()
console.log('1️⃣3️⃣ DELETE /api/appointments/:id:', deleteAppointmentResult)

// 14. DELETE Client
const deleteClientResponse = await fetch(`/api/clients/${clientId}`, {
  method: 'DELETE'
})
const deleteClientResult = await deleteClientResponse.json()
console.log('1️⃣4️⃣ DELETE /api/clients/:id:', deleteClientResult)

// 15. DELETE Barber
const deleteBarberResponse = await fetch(`/api/barbers/${barberId}`, {
  method: 'DELETE'
})
const deleteBarberResult = await deleteBarberResponse.json()
console.log('1️⃣5️⃣ DELETE /api/barbers/:id:', deleteBarberResult)

console.log('\n✨ VERIFICACIÓN FINAL...\n')

// Verificar que fueron eliminados
const verifyBarber = await fetch(`/api/barbers/${barberId}`)
console.log('Barber status después de DELETE:', verifyBarber.status === 404 ? '✅ Eliminado' : '❌ Aún existe')

const verifyClient = await fetch(`/api/clients/${clientId}`)
console.log('Client status después de DELETE:', verifyClient.status === 404 ? '✅ Eliminado' : '❌ Aún existe')

const verifyAppointment = await fetch(`/api/appointments/${appointmentId}`)
console.log('Appointment status después de DELETE:', verifyAppointment.status === 404 ? '✅ Eliminado' : '❌ Aún existe')

console.log('\n🎉 ¡TODAS LAS PRUEBAS COMPLETADAS!')
console.log('════════════════════════════════════════════════')
console.log('✅ BARBERS: GET, POST, PUT, DELETE')
console.log('✅ CLIENTS: GET, POST, PUT, DELETE')
console.log('✅ APPOINTMENTS: GET, POST, PUT, DELETE')
console.log('════════════════════════════════════════════════')
```

---

## 📊 Resultados Esperados

### ✅ Todos los CRUD funcionan:

- **BARBERS** ✓
  - GET: Lista de peluqueros
  - POST: Crear peluquero
  - GET by ID: Obtener detalle
  - PUT: Actualizar peluquero
  - DELETE: Eliminar peluquero

- **CLIENTS** ✓
  - GET: Lista de clientes
  - POST: Crear cliente
  - GET by ID: Obtener detalle
  - PUT: Actualizar cliente
  - DELETE: Eliminar cliente

- **APPOINTMENTS** ✓
  - GET: Lista de turnos
  - POST: Crear turno
  - GET by ID: Obtener detalle
  - PUT: Actualizar turno
  - DELETE: Eliminar turno

---

## 🔍 Troubleshooting

### Error 401 "No autorizado"
- Asegúrate de estar en una página autenticada (`/app`)
- Recarga la página si es necesario

### Error 400 "Datos requeridos faltantes"
- Verifica que estés enviando todos los campos obligatorios
- Para Barbers: `name` y `email` son obligatorios
- Para Clients: `name` y `phone` son obligatorios
- Para Appointments: `clientId`, `barberId`, `date`, `time` son obligatorios

### Error 404 "Recurso no encontrado"
- El ID que intentas acceder no existe
- Verifica que el ID sea correcto

---

**¡Listo para probar!** 🚀
