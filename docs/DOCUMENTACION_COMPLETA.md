# 📚 Elvis Barber Studio - Documentación Completa

## 📑 Índice
1. [Introducción](#introducción)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Base de Datos](#base-de-datos)
4. [Autenticación y Roles](#autenticación-y-roles)
5. [Landing Page](#landing-page)
6. [Dashboard](#dashboard)
7. [APIs](#apis)
8. [Instalación y Setup](#instalación-y-setup)
9. [Flujos de Trabajo](#flujos-de-trabajo)

---

## 🎯 Introducción

**Elvis Barber Studio** es una aplicación web para gestión de barbería especializada en:
- **Planilla Digital de Caja**: Registro de ventas/turnos
- **Gestión de Comisiones**: Cálculo automático de comisiones
- **Reserva de Turnos**: Sistema público de reservas
- **Dashboard Administrativo**: Panel de control completo

### Stack Tecnológico
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: PostgreSQL (Neon)
- **UI Components**: shadcn/ui
- **Autenticación**: NextAuth.js

---

## 🏗️ Arquitectura del Sistema

### Estructura de Carpetas
```
ElvisBarberStudio/
├── src/
│   ├── app/
│   │   ├── (dashboard)/          # Layout privado del dashboard
│   │   │   └── app/
│   │   │       ├── appointments/  # Gestión de turnos
│   │   │       ├── commissions/   # Gestión de comisiones
│   │   │       ├── cash/          # Gestión de caja
│   │   │       └── staff/         # Gestión de barberos
│   │   ├── api/                   # API Routes
│   │   │   ├── appointments/      # Endpoints de turnos
│   │   │   ├── services/          # Endpoints de servicios
│   │   │   └── staff/             # Endpoints de barberos
│   │   ├── page.tsx               # Landing page
│   │   └── layout.tsx             # Layout global
│   ├── components/
│   │   ├── dashboard/             # Componentes del dashboard
│   │   └── landing/               # Componentes de landing
│   ├── lib/                       # Librerías y utilidades
│   └── types/                     # Tipos TypeScript
├── prisma/
│   ├── schema.prisma              # Esquema de BD
│   └── seed-simple.js             # Script de seed
└── docs/                          # Documentación

```

---

## 💾 Base de Datos

### Esquema Relacional

```
┌─────────────┐         ┌──────────────┐
│   users     │         │   customers  │
├─────────────┤         ├──────────────┤
│ id (PK)     │         │ id (PK)      │
│ email (UQ)  │         │ name         │
│ password    │         │ phone        │
│ name        │         │ created_at   │
│ role        │         └──────────────┘
└─────────────┘                │
      │                        │ (1:N)
      │ (1:N)                  │
      │                        ▼
      │              ┌──────────────┐
      │              │    sales     │
      │              ├──────────────┤
      │              │ id (PK)      │
      │              │ date_time    │
      │              │ customer_id  │ (FK)
      │              │ staff_id     │ (FK)
      │              │ payment_meth │
      │              │ total_amount │
      │              │ services_txt │
      │              │ created_at   │
      │              └──────────────┘
      │                      │
      │ (1:N)                │ (N:1)
      │                      │
      ▼                      ▼
┌──────────────┐      ┌──────────────┐
│    staff     │      │commission_pay│
├──────────────┤      ├──────────────┤
│ id (PK)      │      │ id (PK)      │
│ name         │      │ staff_id (FK)│
│ commission_% │      │ period_start │
│ active       │      │ period_end   │
│ created_at   │      │ total_sales  │
└──────────────┘      │ commission_% │
                      │ commission_$ │
                      │ status       │
                      │ paid_at      │
                      └──────────────┘

┌──────────────────┐
│   cash_closings  │
├──────────────────┤
│ id (PK)          │
│ date (UQ)        │
│ cash_total       │
│ mp_total         │
│ expenses_total   │
│ cash_final       │
│ notes            │
│ created_at       │
│ updated_at       │
└──────────────────┘
```

### Descripciones de Tablas

#### `users`
Usuarios del sistema con roles diferenciados

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| email | VARCHAR(UNIQUE) | Email único para login |
| password | VARCHAR | Contraseña hasheada |
| name | VARCHAR | Nombre completo |
| role | VARCHAR | admin, owner, barber |

#### `staff`
Barberos/Peluqueros del salón

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| name | VARCHAR | Nombre del barbero |
| commission_rate_default | FLOAT | Comisión predeterminada (ej: 0.4 = 40%) |
| active | BOOLEAN | Si está activo/disponible |
| created_at | TIMESTAMP | Fecha de registro |

#### `customers`
Clientes que reservan turnos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| name | VARCHAR | Nombre del cliente |
| phone | VARCHAR | Teléfono de contacto |
| created_at | TIMESTAMP | Fecha de registro |

#### `sales`
Registro de ventas/turnos completados

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| date_time | TIMESTAMP | Fecha y hora del turno |
| customer_id | UUID (FK) | Cliente (nullable) |
| staff_id | UUID (FK) | Barbero asignado |
| payment_method | VARCHAR | CASH o MP |
| total_amount | DECIMAL | Monto total |
| services_text | VARCHAR | Descripción de servicios |
| notes | TEXT | Notas adicionales |
| created_at | TIMESTAMP | Fecha de creación |

#### `commission_payments`
Cálculo de comisiones a barberos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| staff_id | UUID (FK) | Barbero |
| period_start | TIMESTAMP | Inicio del período |
| period_end | TIMESTAMP | Fin del período |
| total_sales | DECIMAL | Total de ventas en el período |
| commission_rate | FLOAT | % de comisión |
| commission_amount | DECIMAL | Monto de comisión |
| status | VARCHAR | PENDING o PAID |
| paid_at | TIMESTAMP (nullable) | Fecha de pago |
| created_at | TIMESTAMP | Fecha de creación |

#### `cash_closings`
Cierre diario de caja

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| date | DATE (UNIQUE) | Fecha del cierre |
| cash_total | DECIMAL | Total en efectivo |
| mp_total | DECIMAL | Total en Mercado Pago |
| expenses_total | DECIMAL | Total de gastos |
| cash_final | DECIMAL | Saldo final (cash - expenses) |
| notes | TEXT | Observaciones |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

---

## 🔐 Autenticación y Roles

### Roles y Permisos

#### 👤 **ADMIN** (Administrador - Usuario)
- ✅ Ver todo el dashboard
- ✅ Gestionar turnos (crear, editar, borrar, leer)
- ✅ Gestionar comisiones
- ✅ Gestionar caja
- ✅ Ver barberos

#### 👨‍💼 **OWNER** (Propietario - Elvis)
- ✅ Ver todo el dashboard
- ✅ Gestionar turnos
- ✅ Gestionar comisiones
- ✅ Gestionar caja
- ✅ Ver barberos

#### 💈 **BARBER** (Peluquero)
- ✅ Ver mis turnos asignados
- ✅ Crear turnos
- ✅ Editar mis turnos
- ✅ Borrar mis turnos
- ❌ Ver comisiones
- ❌ Ver caja
- ❌ Ver otros turnos

### Flujo de Autenticación

```
1. Usuario intenta acceder
2. NextAuth.js valida credenciales
3. Se asigna rol según la BD
4. Se genera JWT con rol
5. Middleware valida permisos en rutas protegidas
```

---

## 🎨 Landing Page

### Ruta: `/`

**Propósito**: Página pública para clientes

### Secciones

#### 1. Header
- Logo y nombre del estudio (Elvis Barber Studio)
- Frase atractiva

#### 2. Servicios
Muestra tarjetas de servicios disponibles:
- Corte Clásico - $100
- Corte Degradado - $120
- Afeitado Clásico - $80
- Corte + Barba - $150
- Tinte - $200

#### 3. Barberos
Muestra tarjetas de barberos activos:
- Nombre
- Comisión predeterminada
- Estado (Activo/Inactivo)

#### 4. Footer Sticky
Formulario fijo en la base para crear turnos

**Campos**:
- 📝 Nombre (required)
- 📞 Teléfono (required)
- 💈 Barbero (select, required)
- 🛠️ Servicio (text, required)
- 💳 Método de Pago (CASH/MP)
- ✅ Botón "Generar Turno"

**Validaciones**:
- Todos los campos obligatorios
- Teléfono con formato
- Petición POST a `/api/appointments`

### Componentes

```typescript
// AppointmentFooter.tsx
- Maneja estado del formulario
- Envía datos a API
- Muestra confirmación/error
- Responsive en móvil

// ServiceCard.tsx
- Nombre, descripción, precio
- Estilos hover

// StaffCard.tsx
- Nombre, comisión, estado
- Badges de estado
```

---

## 📊 Dashboard

### Rutas Protegidas: `/dashboard/*`

Requiere autenticación y rol adecuado

### Página: `/dashboard/appointments` (Turnos)

**Acceso**: Admin, Owner, Barber (solo propios)

**Tabla**: `AppointmentsTable`

| Columna | Descripción |
|---------|-------------|
| Cliente | Nombre y teléfono |
| Barbero | Nombre del barbero |
| Servicio | Tipo de servicio |
| Fecha/Hora | Fecha y hora del turno |
| Pago | Método de pago (Badge) |
| Monto | Total del turno |

**Acciones**:
- Admin/Owner: Ver todos
- Barber: Ver solo sus turnos

---

### Página: `/dashboard/commissions` (Comisiones)

**Acceso**: Admin, Owner

**Tabla**: `CommissionsTable`

| Columna | Descripción |
|---------|-------------|
| Barbero | Nombre del barbero |
| Período | Rango de fechas |
| Ventas Totales | $ total vendido |
| % Comisión | Porcentaje |
| Monto Comisión | $ de comisión |
| Estado | PENDING/PAID (Badge) |
| Pagado | Fecha de pago |

**Cálculo de Comisión**:
```
commission_amount = total_sales * commission_rate
Ejemplo: $1000 * 0.4 = $400
```

---

### Página: `/dashboard/cash` (Caja)

**Acceso**: Admin, Owner

**Resumen de KPIs**:
- 💵 Efectivo Total
- 💳 Mercado Pago Total
- 📉 Gastos Total

**Tabla**: Cierres Diarios

| Columna | Descripción |
|---------|-------------|
| Fecha | Fecha del cierre |
| Efectivo | Total en efectivo |
| Mercado Pago | Total en MP |
| Gastos | Total de gastos |
| Total Neto | Saldo final |
| Notas | Observaciones |

**Fórmula de Cálculo**:
```
cash_final = cash_total - expenses_total
```

---

### Página: `/dashboard/staff` (Barberos)

**Acceso**: Admin, Owner

**Tabla**: Información de barberos

| Columna | Descripción |
|---------|-------------|
| Nombre | Nombre del barbero |
| Comisión % | % predeterminado |
| Estado | Activo/Inactivo (Badge) |
| Fecha Registro | Cuándo fue registrado |

---

## 📡 APIs

### Autenticación

**POST `/api/auth/signin`**
```json
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Response 200**:
```json
{
  "token": "jwt_token",
  "user": {
    "id": "user-001",
    "email": "usuario@example.com",
    "name": "Usuario",
    "role": "admin"
  }
}
```

---

### Servicios

**GET `/api/services`**

Obtiene lista de servicios disponibles

**Response 200**:
```json
[
  {
    "id": "1",
    "name": "Corte Clásico",
    "price": 100,
    "description": "Corte de cabello clásico"
  }
]
```

---

### Barberos

**GET `/api/staff`**

Obtiene lista de barberos activos

**Response 200**:
```json
[
  {
    "id": "staff-001",
    "name": "Carlos",
    "active": true,
    "commissionRateDefault": 0.4
  }
]
```

---

### Turnos/Appointments

**POST `/api/appointments`**

Crea un nuevo turno

**Request**:
```json
{
  "customerName": "Pedro García",
  "customerPhone": "1123456789",
  "staffId": "staff-001",
  "service": "Corte Clásico",
  "paymentMethod": "CASH"
}
```

**Response 201**:
```json
{
  "id": "sale-001",
  "dateTime": "2026-01-07T18:30:00Z",
  "customerId": "cust-001",
  "staffId": "staff-001",
  "paymentMethod": "CASH",
  "totalAmount": 100,
  "servicesText": "Corte Clásico",
  "createdAt": "2026-01-07T18:25:00Z"
}
```

**Errores**:
- 400: Campos requeridos faltantes
- 500: Error en servidor

---

**GET `/api/appointments`**

Obtiene todos los turnos

**Response 200**:
```json
[
  {
    "id": "sale-001",
    "dateTime": "2026-01-07T18:30:00Z",
    "customer": {
      "id": "cust-001",
      "name": "Pedro García",
      "phone": "1123456789"
    },
    "staff": {
      "id": "staff-001",
      "name": "Carlos"
    },
    "paymentMethod": "CASH",
    "totalAmount": 100,
    "servicesText": "Corte Clásico"
  }
]
```

---

## 🚀 Instalación y Setup

### Requisitos Previos
- Node.js 18+
- npm o yarn
- PostgreSQL (Neon)

### Pasos de Instalación

#### 1. Clonar repositorio
```bash
git clone <repo-url>
cd ElvisBarberStudio
```

#### 2. Instalar dependencias
```bash
npm install
```

#### 3. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con credenciales reales
```

**Variables necesarias**:
```
DATABASE_URL="postgresql://user:password@host/database"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

#### 4. Sincronizar base de datos
```bash
npx prisma db push
```

#### 5. Generar cliente Prisma
```bash
npx prisma generate
```

#### 6. Ejecutar en desarrollo
```bash
npm run dev
```

**Acceso**: http://localhost:3000

---

### Seed de Datos

Para cargar datos de ejemplo:

```bash
node prisma/seed-simple.js
```

**Datos precargados**:
- 1 Admin (admin@barber.com / admin123)
- 1 Owner (elvis@barber.com / elvis123)
- 3 Barberos
- 3 Clientes
- 3 Turnos ejemplo
- 1 Cierre de caja

---

## 🔄 Flujos de Trabajo

### Flujo 1: Cliente Genera Turno

```
1. Cliente accede a landing page (/)
2. Completa formulario del footer sticky
3. Sistema valida datos
4. POST a /api/appointments
5. Sistema crea cliente si no existe
6. Sistema crea turno (sale)
7. Confirmación al cliente
```

### Flujo 2: Admin Gestiona Turnos

```
1. Admin entra a /dashboard/appointments
2. Ve tabla de todos los turnos
3. Puede filtrar por estado, barbero, fecha
4. Acciones:
   - Ver detalles
   - Editar
   - Borrar
   - Completar
```

### Flujo 3: Cálculo de Comisiones

```
1. Sistema recopila turnos del período
2. Calcula: total_sales = sum(sale.total_amount)
3. Calcula: commission = total_sales * commission_rate
4. Crea registro en commission_payments
5. Status = PENDING hasta que admin lo pague
```

### Flujo 4: Cierre de Caja

```
1. Al final del día, admin accede a /dashboard/cash
2. Ingresa:
   - cash_total (efectivo recolectado)
   - mp_total (pagos Mercado Pago)
   - expenses_total (gastos del día)
3. Sistema calcula: cash_final = cash_total - expenses_total
4. Crea registro en cash_closings
5. Genera reporte diario
```

### Flujo 5: Barber Ve Sus Turnos

```
1. Barber entra con rol BARBER
2. Accede a /dashboard/appointments
3. Middleware filtra: WHERE staff_id = current_user.id
4. Solo ve sus turnos asignados
5. Puede crear nuevos turnos
6. Puede editar/borrar solo los suyos
```

---

## 🛡️ Seguridad

### Validaciones

- ✅ Validación de entrada en APIs
- ✅ Middleware de autenticación
- ✅ Control de acceso por roles
- ✅ Validación de permisos en endpoints
- ✅ CSRF protection (NextAuth)
- ✅ Rate limiting (recomendado)

### Contraseñas

- 🔒 Hasheadas en base de datos
- 🔒 Transmitidas solo por HTTPS
- 🔒 Cambiar en producción

---

## 📱 Responsive Design

- ✅ Mobile-first design
- ✅ Tablas responsivas
- ✅ Footer sticky se adapta
- ✅ Grid layouts flexible

---

## 🎓 Próximas Mejoras

- [ ] Envío de emails de confirmación
- [ ] SMS de recordatorio
- [ ] Estadísticas y reportes
- [ ] Calendario visual
- [ ] Integración con WhatsApp
- [ ] Exportar reportes a PDF
- [ ] Notificaciones en tiempo real

---

## 📞 Soporte

Para dudas o problemas, contactar a Elvis Barber Studio

**Email**: admin@elvisbarber.com  
**Teléfono**: +54 11 XXXX-XXXX

---

**Última actualización**: Enero 2026  
**Versión**: 1.0.0
