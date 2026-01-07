# 🔐 Guía de Seguridad y Roles - Elvis Barber Studio

## 📋 Tabla de Contenidos
1. [Sistema de Roles](#sistema-de-roles)
2. [Implementación de Permisos](#implementación-de-permisos)
3. [Middleware de Autenticación](#middleware-de-autenticación)
4. [Protección de Rutas](#protección-de-rutas)
5. [Validación de Permisos](#validación-de-permisos)
6. [Mejores Prácticas](#mejores-prácticas)

---

## 🎯 Sistema de Roles

### Estructura de Roles

```
┌─────────────────────────────────────────────────┐
│                  USUARIOS                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  👤 ADMIN (Administrador)                       │
│  └─ Rol: "admin"                               │
│  └─ Acceso: TOTAL                              │
│                                                 │
│  👨‍💼 OWNER (Propietario - Elvis)                │
│  └─ Rol: "owner"                               │
│  └─ Acceso: TOTAL                              │
│                                                 │
│  💈 BARBER (Peluquero)                          │
│  └─ Rol: "barber"                              │
│  └─ Acceso: LIMITADO                           │
│     └─ Mis turnos                              │
│     └─ Crear/editar/borrar turnos              │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Tabla de Permisos

| Recurso | Admin | Owner | Barber | Público |
|---------|-------|-------|--------|---------|
| Ver Dashboard | ✅ | ✅ | ❌ | ❌ |
| Ver todos los turnos | ✅ | ✅ | ❌ | ❌ |
| Ver mis turnos | ✅ | ✅ | ✅ | ❌ |
| Crear turno | ✅ | ✅ | ✅ | ✅ |
| Editar turno | ✅ | ✅ | ✅* | ✅* |
| Borrar turno | ✅ | ✅ | ✅* | ✅* |
| Ver comisiones | ✅ | ✅ | ❌ | ❌ |
| Crear comisiones | ✅ | ✅ | ❌ | ❌ |
| Pagar comisiones | ✅ | ✅ | ❌ | ❌ |
| Ver caja | ✅ | ✅ | ❌ | ❌ |
| Crear cierre de caja | ✅ | ✅ | ❌ | ❌ |
| Ver barberos | ✅ | ✅ | ❌ | ❌ |
| Ver reportes | ✅ | ✅ | ❌ | ❌ |

*Solo los propios

---

## 🛠️ Implementación de Permisos

### Archivo: `src/lib/permissions.ts` (A crear)

```typescript
// Definir tipos de roles
export type UserRole = 'admin' | 'owner' | 'barber';

// Matriz de permisos
export const PERMISSIONS = {
  // Dashboard
  'dashboard.view': ['admin', 'owner'],
  
  // Turnos
  'appointments.view.all': ['admin', 'owner'],
  'appointments.view.own': ['admin', 'owner', 'barber'],
  'appointments.create': ['admin', 'owner', 'barber'],
  'appointments.update': ['admin', 'owner', 'barber'],
  'appointments.delete': ['admin', 'owner', 'barber'],
  
  // Comisiones
  'commissions.view': ['admin', 'owner'],
  'commissions.create': ['admin', 'owner'],
  'commissions.pay': ['admin', 'owner'],
  
  // Caja
  'cash.view': ['admin', 'owner'],
  'cash.create': ['admin', 'owner'],
  
  // Barberos
  'staff.view': ['admin', 'owner'],
  'staff.manage': ['admin', 'owner'],
};

// Función para verificar permiso
export function hasPermission(
  role: UserRole,
  permission: string
): boolean {
  const allowedRoles = PERMISSIONS[permission as keyof typeof PERMISSIONS];
  return allowedRoles?.includes(role) ?? false;
}

// Función para verificar si puede ver recurso específico
export function canViewAppointment(
  userRole: UserRole,
  userId: string,
  appointmentUserId: string
): boolean {
  // Admin y Owner ven todo
  if (userRole === 'admin' || userRole === 'owner') {
    return true;
  }
  
  // Barber solo ve sus propios
  if (userRole === 'barber') {
    return userId === appointmentUserId;
  }
  
  return false;
}
```

---

## 🔒 Middleware de Autenticación

### Archivo: `src/middleware.ts` (Actualizar)

```typescript
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Rutas públicas que no necesitan autenticación
  const publicRoutes = ['/', '/api/appointments', '/api/services', '/api/staff'];
  
  if (publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Obtener token JWT
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // Si no hay token, redirigir a login
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
  
  // Verificar rol para rutas protegidas
  const pathname = request.nextUrl.pathname;
  
  if (pathname.startsWith('/dashboard')) {
    // Solo admin y owner pueden acceder al dashboard
    if (!['admin', 'owner'].includes(token.role as string)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'],
};
```

---

## 🛡️ Protección de Rutas

### Rutas Públicas

```
GET  /                    (Landing Page)
GET  /api/services        (Servicios públicos)
GET  /api/staff           (Barberos públicos)
POST /api/appointments    (Crear turno)
GET  /api/appointments    (Listar turnos públicos)
```

### Rutas Protegidas - Dashboard (Admin/Owner)

```
GET  /dashboard                    (Dashboard principal)
GET  /dashboard/appointments       (Todos los turnos)
GET  /dashboard/commissions        (Comisiones)
GET  /dashboard/cash               (Caja)
GET  /dashboard/staff              (Barberos)
```

### Rutas Protegidas - Barbero

```
GET  /dashboard/appointments?own   (Mis turnos)
POST /api/appointments             (Crear turno)
PUT  /api/appointments/:id         (Editar mi turno)
DELETE /api/appointments/:id       (Borrar mi turno)
```

---

## ✅ Validación de Permisos

### En API Routes

```typescript
// src/app/api/appointments/route.ts

import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/auth';

export async function POST(request: Request) {
  // Obtener sesión
  const session = await getServerSession(authOptions);
  
  // Verificar autenticación
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const userRole = session.user.role as UserRole;
  
  // Verificar permiso
  if (!hasPermission(userRole, 'appointments.create')) {
    return new Response('Forbidden', { status: 403 });
  }
  
  // Procesar petición
  const body = await request.json();
  
  // ... resto del código
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const userRole = session.user.role as UserRole;
  const userId = session.user.id;
  
  // Si es barber, filtrar por usuario
  if (userRole === 'barber') {
    const appointments = await prisma.sale.findMany({
      where: {
        staffId: session.user.staffId, // Usar staffId del usuario
      },
    });
    return Response.json(appointments);
  }
  
  // Si es admin/owner, ver todo
  const appointments = await prisma.sale.findMany();
  return Response.json(appointments);
}
```

### En Componentes del Dashboard

```typescript
// src/components/dashboard/AppointmentsTable.tsx

import { getServerSession } from 'next-auth';

export async function AppointmentsTable() {
  const session = await getServerSession();
  
  if (!session) {
    return <div>No autorizado</div>;
  }
  
  const userRole = session.user?.role as UserRole;
  
  // Obtener datos según rol
  const isAdminOrOwner = ['admin', 'owner'].includes(userRole);
  const appointments = await getAppointments(isAdminOrOwner);
  
  return (
    <table>
      {/* Renderizar tabla */}
    </table>
  );
}
```

---

## 🔐 Mejores Prácticas

### 1. Validación en Cliente y Servidor

✅ **Hacer**:
```typescript
// Cliente - muestra/oculta elementos
{canEdit && <EditButton />}

// Servidor - valida antes de procesar
if (!hasPermission(role, 'appointments.update')) {
  return Response.json({error: 'No permitido'}, {status: 403});
}
```

❌ **No Hacer**:
```typescript
// Solo validar en cliente - inseguro
if (localStorage.getItem('canEdit')) {
  // Procesar
}
```

### 2. Filtrado de Datos

✅ **Hacer**:
```typescript
// Filtrar en base de datos
const appointments = await prisma.sale.findMany({
  where: {
    staffId: currentUserStaffId,
  },
});
```

❌ **No Hacer**:
```typescript
// Obtener todo y filtrar en cliente - inseguro
const allAppointments = await prisma.sale.findMany();
const filtered = allAppointments.filter(a => a.staffId === id);
```

### 3. Sesión Segura

✅ **Hacer**:
```typescript
const session = await getServerSession(authOptions);
const userRole = session?.user?.role;
// Verificar y procesar
```

❌ **No Hacer**:
```typescript
// Confiar en headers del cliente
const role = request.headers.get('x-user-role');
```

### 4. Variables de Entorno

✅ Guardar en `.env`:
```env
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars
NEXTAUTH_URL=https://elvis-barber-studio.vercel.app
DATABASE_URL=postgresql://...
```

❌ No incluir en código:
```typescript
const SECRET = 'hardcoded-secret'; // ¡Inseguro!
```

### 5. Logs de Auditoría

```typescript
// Registrar acciones importantes
async function logAction(
  userId: string,
  action: string,
  resource: string,
  status: 'success' | 'failed'
) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      resource,
      status,
      timestamp: new Date(),
    },
  });
}

// Usar en operaciones críticas
await logAction(
  session.user.id,
  'CREATE',
  'appointment',
  'success'
);
```

---

## 🚨 Seguridad en Producción

### Checklist de Seguridad

- [ ] Cambiar todas las credenciales predeterminadas
- [ ] Habilitar HTTPS
- [ ] Configurar CORS correctamente
- [ ] Implementar rate limiting
- [ ] Configurar firewall de BD
- [ ] Habilitar backups automáticos
- [ ] Implementar 2FA para admin/owner
- [ ] Rotar secretos regularmente
- [ ] Monitorear logs de acceso
- [ ] Realizar auditoría de código
- [ ] Implementar CSRF protection
- [ ] Validar todas las entradas

### Políticas de Contraseña

```
Requisitos:
- Mínimo 12 caracteres
- Mayúsculas (A-Z)
- Minúsculas (a-z)
- Números (0-9)
- Símbolos (!@#$%^&*)

Expiración:
- Admin/Owner: 90 días
- Barber: 180 días

Historial: Último 5 cambios
```

---

## 📊 Monitoreo y Auditoría

### Eventos para Registrar

```typescript
enum AuditEvent {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  CREATE_APPOINTMENT = 'CREATE_APPOINTMENT',
  UPDATE_APPOINTMENT = 'UPDATE_APPOINTMENT',
  DELETE_APPOINTMENT = 'DELETE_APPOINTMENT',
  CREATE_COMMISSION = 'CREATE_COMMISSION',
  PAY_COMMISSION = 'PAY_COMMISSION',
  ACCESS_DENIED = 'ACCESS_DENIED',
  FAILED_LOGIN = 'FAILED_LOGIN',
}
```

### Alertas

Notificar si:
- ❌ Múltiples intentos fallidos de login
- ❌ Acceso denegado a recursos
- ❌ Cambios en comisiones
- ❌ Cierres de caja
- ✅ Acceso exitoso a admin

---

## 🔄 Renovación de Sesión

```typescript
// NextAuth.js
export const authOptions = {
  providers: [
    CredentialsProvider({
      // ...
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.staffId = user.staffId;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.staffId = token.staffId;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};
```

---

## 📞 Reportar Problemas de Seguridad

⚠️ Si encuentras vulnerabilidades:
1. NO publicar en redes sociales
2. Contactar a: security@elvisbarber.com
3. Proporcionar detalles de la vulnerabilidad
4. Esperar respuesta en 48 horas
5. No explotar la vulnerabilidad

---

**Última actualización**: Enero 2026  
**Versión**: 1.0.0
