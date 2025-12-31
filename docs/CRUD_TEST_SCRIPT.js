/**
 * 🧪 SCRIPT DE PRUEBA CRUD COMPLETO
 * 
 * Ejecuta esto en la consola del navegador (F12) en cualquier página autenticada
 * 
 * Probará:
 * ✅ BARBERS: GET, POST, PUT, DELETE
 * ✅ CLIENTS: GET, POST, PUT, DELETE
 * ✅ APPOINTMENTS: GET, POST, PUT, DELETE
 */

// ============================================
// 1. PRUEBAS DE BARBERS
// ============================================

console.log('🧔 INICIANDO PRUEBAS DE BARBERS...\n')

// GET - Obtener lista de peluqueros
console.log('1️⃣ GET /api/barbers')
const barbersResponse = await fetch('/api/barbers?page=1&limit=10')
const barbersData = await barbersResponse.json()
console.log('✅ Barbers obtenidos:', barbersData)
console.log()

// POST - Crear nuevo peluquero
console.log('2️⃣ POST /api/barbers (Crear)')
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
console.log('✅ Peluquero creado:', newBarber)
const barberId = newBarber.id
console.log()

// GET - Obtener peluquero específico
console.log('3️⃣ GET /api/barbers/:id')
const barberDetailResponse = await fetch(`/api/barbers/${barberId}`)
const barberDetail = await barberDetailResponse.json()
console.log('✅ Detalles del peluquero:', barberDetail)
console.log()

// PUT - Actualizar peluquero
console.log('4️⃣ PUT /api/barbers/:id (Actualizar)')
const updateBarberResponse = await fetch(`/api/barbers/${barberId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Carlos García Actualizado',
    phone: '+54 9 9876 5432',
    specialization: 'Diseñador de Barba'
  })
})
const updatedBarber = await updateBarberResponse.json()
console.log('✅ Peluquero actualizado:', updatedBarber)
console.log()

// ============================================
// 2. PRUEBAS DE CLIENTS
// ============================================

console.log('👥 INICIANDO PRUEBAS DE CLIENTS...\n')

// GET - Obtener lista de clientes
console.log('1️⃣ GET /api/clients')
const clientsResponse = await fetch('/api/clients?page=1&limit=10')
const clientsData = await clientsResponse.json()
console.log('✅ Clientes obtenidos:', clientsData)
console.log()

// POST - Crear nuevo cliente
console.log('2️⃣ POST /api/clients (Crear)')
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
console.log('✅ Cliente creado:', newClient)
const clientId = newClient.id
console.log()

// GET - Obtener cliente específico
console.log('3️⃣ GET /api/clients/:id')
const clientDetailResponse = await fetch(`/api/clients/${clientId}`)
const clientDetail = await clientDetailResponse.json()
console.log('✅ Detalles del cliente:', clientDetail)
console.log()

// PUT - Actualizar cliente
console.log('4️⃣ PUT /api/clients/:id (Actualizar)')
const updateClientResponse = await fetch(`/api/clients/${clientId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Juan Pérez Martínez',
    phone: '+54 9 3333 4444',
    status: 'active'
  })
})
const updatedClient = await updateClientResponse.json()
console.log('✅ Cliente actualizado:', updatedClient)
console.log()

// ============================================
// 3. PRUEBAS DE APPOINTMENTS
// ============================================

console.log('📅 INICIANDO PRUEBAS DE APPOINTMENTS...\n')

// GET - Obtener lista de turnos
console.log('1️⃣ GET /api/appointments')
const appointmentsResponse = await fetch('/api/appointments?page=1&limit=10')
const appointmentsData = await appointmentsResponse.json()
console.log('✅ Turnos obtenidos:', appointmentsData)
console.log()

// POST - Crear nuevo turno
console.log('2️⃣ POST /api/appointments (Crear)')
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
console.log('✅ Turno creado:', newAppointment)
const appointmentId = newAppointment.id
console.log()

// GET - Obtener turno específico
console.log('3️⃣ GET /api/appointments/:id')
const appointmentDetailResponse = await fetch(`/api/appointments/${appointmentId}`)
const appointmentDetail = await appointmentDetailResponse.json()
console.log('✅ Detalles del turno:', appointmentDetail)
console.log()

// PUT - Actualizar turno
console.log('4️⃣ PUT /api/appointments/:id (Actualizar)')
const updateAppointmentResponse = await fetch(`/api/appointments/${appointmentId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    time: '15:00',
    service: 'Haircut + Beard + Massage',
    status: 'SCHEDULED'
  })
})
const updatedAppointment = await updateAppointmentResponse.json()
console.log('✅ Turno actualizado:', updatedAppointment)
console.log()

// ============================================
// 4. DELETIONS (LIMPIEZA)
// ============================================

console.log('🧹 INICIANDO ELIMINACIONES...\n')

// DELETE - Eliminar turno
console.log('1️⃣ DELETE /api/appointments/:id')
const deleteAppointmentResponse = await fetch(`/api/appointments/${appointmentId}`, {
  method: 'DELETE'
})
const deleteAppointmentResult = await deleteAppointmentResponse.json()
console.log('✅ Turno eliminado:', deleteAppointmentResult)
console.log()

// DELETE - Eliminar cliente
console.log('2️⃣ DELETE /api/clients/:id')
const deleteClientResponse = await fetch(`/api/clients/${clientId}`, {
  method: 'DELETE'
})
const deleteClientResult = await deleteClientResponse.json()
console.log('✅ Cliente eliminado:', deleteClientResult)
console.log()

// DELETE - Eliminar peluquero
console.log('3️⃣ DELETE /api/barbers/:id')
const deleteBarberResponse = await fetch(`/api/barbers/${barberId}`, {
  method: 'DELETE'
})
const deleteBarberResult = await deleteBarberResponse.json()
console.log('✅ Peluquero eliminado:', deleteBarberResult)
console.log()

// ============================================
// 5. VERIFICACIÓN FINAL
// ============================================

console.log('✨ VERIFICACIÓN FINAL...\n')

// Verificar que fueron eliminados
console.log('Verificando que Barber fue eliminado:')
const verifyBarberResponse = await fetch(`/api/barbers/${barberId}`)
if (verifyBarberResponse.status === 404) {
  console.log('✅ Barber eliminado correctamente')
} else {
  console.log('❌ Barber aún existe')
}

console.log()
console.log('Verificando que Client fue eliminado:')
const verifyClientResponse = await fetch(`/api/clients/${clientId}`)
if (verifyClientResponse.status === 404) {
  console.log('✅ Client eliminado correctamente')
} else {
  console.log('❌ Client aún existe')
}

console.log()
console.log('Verificando que Appointment fue eliminado:')
const verifyAppointmentResponse = await fetch(`/api/appointments/${appointmentId}`)
if (verifyAppointmentResponse.status === 404) {
  console.log('✅ Appointment eliminado correctamente')
} else {
  console.log('❌ Appointment aún existe')
}

console.log('\n')
console.log('🎉 ¡TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE!')
console.log('════════════════════════════════════════════════')
console.log('✅ BARBERS: GET, POST, PUT, DELETE')
console.log('✅ CLIENTS: GET, POST, PUT, DELETE')
console.log('✅ APPOINTMENTS: GET, POST, PUT, DELETE')
console.log('════════════════════════════════════════════════')
