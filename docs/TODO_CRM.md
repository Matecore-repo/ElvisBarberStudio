# TODO - CRM Dashboard Phase 2

## 🔄 Backend & Base de Datos

- [ ] Migrar esquema Prisma si es necesario
- [ ] Crear endpoints API para:
  - [ ] GET /api/clients - Lista con paginación
  - [ ] POST /api/clients - Crear cliente
  - [ ] PUT /api/clients/:id - Actualizar
  - [ ] DELETE /api/clients/:id - Eliminar
  - [ ] GET /api/clients/:id/history - Historial de visitas
  - [ ] GET /api/appointments/recent - Turnos recientes
  - [ ] GET /api/statistics - KPIs para dashboard

## 📝 Formularios

- [ ] Crear ClientFormDialog component
  - [ ] Validación de teléfono (Argentina)
  - [ ] Email validation
  - [ ] Campos requeridos
  - [ ] Submit a API
  
- [ ] Mejorar SearchInput con debounce
- [ ] Agregar FilterSelect reutilizable

## 📊 Reportes & Analytics

- [ ] Dashboard metrics mejorados:
  - [ ] Tasa de conversión
  - [ ] Lifetime value por cliente
  - [ ] Churn rate
  - [ ] Revenue por peluquero
  
- [ ] Gráficos (considerar Recharts):
  - [ ] Ingresos por mes (línea)
  - [ ] Clientes por origen (pie)
  - [ ] Conversión por etapa (funnel)

## 🎯 Pipeline & Workflow

- [ ] Crear Kanban board para turnos
- [ ] Estados progresivos:
  - [ ] Prospecto
  - [ ] Agendado
  - [ ] En proceso
  - [ ] Completado
  - [ ] Facturado
  
- [ ] Drag & drop entre etapas
- [ ] Automación de estados

## 📱 Mobile Improvements

- [ ] Optimizar DataTable para pantallas pequeñas
- [ ] Mejorar formularios en mobile
- [ ] Touch-friendly buttons (min 44x44px)

## 🔔 Notificaciones & Automatización

- [ ] Sistema de notificaciones en app
- [ ] Email a cliente (turno confirmado)
- [ ] WhatsApp reminder (24hs antes)
- [ ] Tareas automáticas para staff

## 👥 Seguridad & Roles

- [ ] Implementar Role-based Access Control (RBAC)
  - [ ] Admin (acceso total)
  - [ ] Manager (reportes, configuración)
  - [ ] Barber (solo sus turnos/comisiones)
  - [ ] Receptionist (gestión de turnos)
  
- [ ] Auditoría de cambios
- [ ] Rate limiting en API

## 🧪 Testing

- [ ] Unit tests para componentes
- [ ] Integration tests para DataTable
- [ ] E2E tests (Cypress/Playwright)
- [ ] Performance benchmarks

## 📚 Documentación

- [ ] API documentation (OpenAPI/Swagger)
- [ ] Component library Storybook
- [ ] User guide para staff
- [ ] Admin onboarding docs

---

## Priority: HIGH 🔴

1. API endpoints funcionando
2. CRUD de clientes
3. Conectar datos reales a dashboard
4. Email/WhatsApp notifications

## Priority: MEDIUM 🟡

1. Reportes avanzados
2. RBAC completo
3. Mobile optimizado
4. Testing coverage

## Priority: LOW 🟢

1. Gráficos avanzados
2. Kanban board
3. Storybook
4. Performance tuning
