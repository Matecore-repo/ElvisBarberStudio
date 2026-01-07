# 📖 Documentación - Elvis Barber Studio

## 🎯 Descripción General

**Elvis Barber Studio** es una aplicación web completa para gestionar una barbería moderna con:
- 🛏️ Sistema de reserva de turnos
- 💰 Planilla digital de caja
- 💼 Gestión de comisiones
- 📊 Dashboard administrativo
- 🔐 Control de acceso por roles

---

## 📚 Archivos de Documentación

### 1. **[DOCUMENTACION_COMPLETA.md](./DOCUMENTACION_COMPLETA.md)** 📋
Documentación técnica completa del proyecto:
- Arquitectura del sistema
- Esquema de base de datos
- Descripciones detalladas de tablas
- APIs y endpoints
- Flujos de trabajo
- Instalación y setup

### 2. **[CREDENCIALES_USUARIOS.txt](./CREDENCIALES_USUARIOS.txt)** 🔑
Credenciales de acceso para diferentes usuarios:
- Administrador (acceso total)
- Propietario/Elvis (acceso total)
- 3 Barberos (acceso limitado)
- Matriz de permisos por rol
- Políticas de seguridad

### 3. **[GUIA_SEGURIDAD_ROLES.md](./GUIA_SEGURIDAD_ROLES.md)** 🔐
Guía completa de seguridad y control de roles:
- Sistema de roles implementado
- Middleware de autenticación
- Protección de rutas
- Validación de permisos
- Mejores prácticas
- Checklist de seguridad en producción

---

## 🚀 Inicio Rápido

### 1. Instalación
```bash
npm install
```

### 2. Configuración de Base de Datos
```bash
npx prisma db push
npx prisma generate
```

### 3. Ejecución en Desarrollo
```bash
npm run dev
```

### 4. Acceso
- **Landing Page**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **Email Admin**: admin@barber.com / admin123
- **Email Owner**: elvis@barber.com / elvis123

---

## 📊 Estructura del Proyecto

```
ElvisBarberStudio/
├── src/
│   ├── app/
│   │   ├── (dashboard)/      # Dashboard protegido
│   │   │   └── app/          # Páginas del dashboard
│   │   ├── api/              # API endpoints
│   │   ├── page.tsx          # Landing page
│   │   └── layout.tsx        # Layout global
│   ├── components/           # Componentes reutilizables
│   ├── lib/                  # Librerías y utilidades
│   └── types/                # Tipos TypeScript
├── prisma/
│   ├── schema.prisma         # Esquema de BD
│   └── seed-simple.js        # Script seed
└── docs/                     # Documentación
    ├── README.md
    ├── DOCUMENTACION_COMPLETA.md
    ├── CREDENCIALES_USUARIOS.txt
    └── GUIA_SEGURIDAD_ROLES.md
```

---

## 🔐 Roles y Permisos

### 👤 ADMIN (Administrador)
- ✅ Ver dashboard completo
- ✅ Gestionar turnos
- ✅ Ver comisiones
- ✅ Gestionar caja
- ✅ Ver barberos

### 👨‍💼 OWNER (Propietario - Elvis)
- ✅ Ver dashboard completo
- ✅ Gestionar turnos
- ✅ Ver comisiones
- ✅ Gestionar caja
- ✅ Ver barberos

### 💈 BARBER (Peluquero)
- ✅ Ver mis turnos
- ✅ Crear turnos
- ✅ Editar mis turnos
- ✅ Borrar mis turnos
- ❌ Ver comisiones
- ❌ Ver caja

---

## 🌐 Rutas Principales

### Landing Page (Pública)
| Ruta | Descripción |
|------|-------------|
| `GET /` | Landing con servicios y barberos |
| `POST /api/appointments` | Crear nuevo turno |

### Dashboard (Privado)
| Ruta | Rol Required | Descripción |
|------|-------------|-------------|
| `GET /dashboard` | admin, owner | Dashboard principal |
| `GET /dashboard/appointments` | admin, owner | Todos los turnos |
| `GET /dashboard/commissions` | admin, owner | Comisiones |
| `GET /dashboard/cash` | admin, owner | Gestión de caja |
| `GET /dashboard/staff` | admin, owner | Barberos |

---

## 🛢️ Base de Datos

### Tablas Principales
- `users` - Usuarios con roles
- `staff` - Barberos
- `customers` - Clientes
- `sales` - Turnos/Ventas
- `commission_payments` - Comisiones
- `cash_closings` - Cierres de caja

### Ver Más
👉 [Esquema Completo](./DOCUMENTACION_COMPLETA.md#-base-de-datos)

---

## 🔌 APIs

### Crear Turno
```bash
POST /api/appointments
Content-Type: application/json

{
  "customerName": "Pedro García",
  "customerPhone": "1123456789",
  "staffId": "staff-001",
  "service": "Corte Clásico",
  "paymentMethod": "CASH"
}
```

### Obtener Servicios
```bash
GET /api/services
```

### Obtener Barberos
```bash
GET /api/staff
```

### Ver Más
👉 [APIs Completas](./DOCUMENTACION_COMPLETA.md#-apis)

---

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **Validación**: Zod

---

## 📱 Características

✅ Responsive design (mobile-first)  
✅ Tablas interactivas con shadcn/ui  
✅ Footer sticky para turnos  
✅ Autenticación con roles  
✅ Control de acceso por rol  
✅ Gestión de comisiones automática  
✅ Planilla digital de caja  
✅ Dark mode compatible  
✅ PWA ready  
✅ SEO optimizado  

---

## 🔒 Seguridad

- ✅ Validación de entrada en APIs
- ✅ Middleware de autenticación
- ✅ Control de acceso por roles
- ✅ Protección CSRF
- ✅ Sesiones seguras
- ✅ Hashing de contraseñas
- ✅ Filtrado de datos por rol

👉 [Guía de Seguridad Completa](./GUIA_SEGURIDAD_ROLES.md)

---

## 📊 Datos de Ejemplo

La BD viene preloadeda con:
- ✅ 1 Admin
- ✅ 1 Owner (Elvis)
- ✅ 3 Barberos
- ✅ 3 Clientes
- ✅ 3 Turnos
- ✅ Cierre de caja
- ✅ Comisiones ejemplo

---

## 🚀 Deployment

### A Vercel
```bash
vercel deploy
```

### Variables de Entorno Requeridas
```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.vercel.app
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@prisma/client'"
```bash
npm install
npx prisma generate
```

### Error de autenticación
- Verificar `.env` con `DATABASE_URL` correcto
- Regenerar cliente Prisma: `npx prisma generate`
- Limpiar cookies del navegador

### Tabla no encontrada
```bash
npx prisma db push
```

---

## 📞 Soporte

**Email**: admin@elvisbarber.com  
**Teléfono**: +54 11 XXXX-XXXX  
**Horario**: Lunes a Viernes, 10:00-18:00 (ART)

---

## 📝 Próximas Mejoras

- [ ] Integración con WhatsApp
- [ ] Envío de emails de confirmación
- [ ] Notificaciones en tiempo real
- [ ] Reportes PDF
- [ ] Integración Mercado Pago
- [ ] Calendario visual
- [ ] SMS de recordatorio
- [ ] Exportar datos
- [ ] Analytics avanzado
- [ ] App móvil nativa

---

## 📄 Licencia

Este proyecto es privado y confidencial.  
Solo para uso interno de Elvis Barber Studio.

---

## 👥 Contribuidores

- Elvis (Propietario)
- Admin (Gestor)
- Dev Team

---

**Última actualización**: Enero 2026  
**Versión**: 1.0.0  
**Status**: ✅ Producción

---

### 📚 Documentación Relacionada

- [Documentación Técnica Completa](./DOCUMENTACION_COMPLETA.md)
- [Credenciales de Usuarios](./CREDENCIALES_USUARIOS.txt)
- [Guía de Seguridad y Roles](./GUIA_SEGURIDAD_ROLES.md)
