# 📊 Dashboard Empresarial - Elvis Barber Studio

## Visión General

Dashboard diseñado para **toma de decisiones en menos de 10 segundos**. Interfaz sin decoraciones, enfocada únicamente en métricas de negocio accionables.

---

## 1️⃣ Jerarquía de KPIs (3 Niveles)

### NIVEL 1: INGRESOS (Prioridad Máxima)

Visible al cargar la página, con máximo protagonismo visual.

| KPI | Descripción | Valor | Comparación |
|-----|-------------|-------|------------|
| **Ingresos Hoy** | Dinero generado por citas completadas hoy | $XXX.XX | Línea base |
| **MES a la Fecha** | Acumulado del mes actual | $XXXX.XX | vs Mes anterior (%) |
| **Ticket Promedio** | Inreso promedio por cita | $XX.XX | Histórico |
| **Comisiones Pendientes** | Dinero adeudado a personal | $XXX.XX | Indicador de riesgo |

**Justificación:** El dueño necesita entender en 2 segundos qué dinero entra hoy y qué está pendiente. 

---

### NIVEL 2: OPERACIONES

Visible inmediatamente debajo de ingresos. Responde: "¿Mi negocio funciona hoy?"

| KPI | Descripción | Valor | Estado |
|-----|-------------|-------|--------|
| **Citas Hoy** | Turnos agendados | N | Texto |
| **Ocupación** | % de slots ocupados | XX% | Verde/Naranja/Rojo |
| **Personal Activo** | Peluqueros con citas hoy | N/Total | Texto |
| **Cancelaciones** | Citas canceladas hoy | N | Indicador |

**Justificación:** Permite detectar problemas operativos: "¿Tengo personal? ¿Están ocupados? ¿Hay cancelaciones?"

---

### NIVEL 3: SALUD DEL NEGOCIO

Tercera sección. Indicadores de crecimiento y sostenibilidad.

| KPI | Descripción | Valor | Métrica |
|-----|-------------|-------|--------|
| **Clientes Total** | Base de clientes acumulada | N | +X nuevos/mes |
| **Recurrentes** | % de clientes que repiten | XX% | Fidelización |
| **Ingreso por Personal** | Revenue / Peluqueros | $X.XX | Productividad |
| **Churn** | Clientes inactivos | N | Riesgo |

**Justificación:** Muestra si el negocio crece de forma sostenible.

---

## 2️⃣ Sección de Alertas - "NECESITA ATENCIÓN"

### Reglas de Generación

Basadas en reglas de negocio, no arbitrarias:

```typescript
// Crítica (Roja)
- Clientes con alto riesgo de churn (>3 cancelaciones)
- Ingresos MES < 70% del mes anterior

// Advertencia (Naranja)
- Comisiones pendientes > $500
- Citas sin pagar en últimos 7 días
- Ocupación < 50% hoy
- Personal con 0 citas en la próxima semana

// Informativa (Azul)
- Sugerencias de optimización
- Oportunidades de venta cruzada
```

Cada alerta incluye:
- ✅ Título claro
- ✅ Descripción breve
- ✅ CTA (llamada a acción)
- ✅ Link directo a la sección relevante

---

## 3️⃣ Sección de Actividad Reciente

### Tabla Inteligente

Muestra **últimas 20 citas** con filtros rápidos:

**Columnas:**
- Cliente (nombre + teléfono)
- Peluquero
- Servicio
- Duración (minutos)
- Monto ($)
- Estado (Badge: Pendiente/Completado/Cancelado)
- Fecha

**Filtros rápidos (botones):**
- 🔘 Hoy
- 🔘 Mañana
- 🔘 Esta semana

**Comportamiento Responsive:**
- Desktop: Tabla horizontal con scroll
- Mobile: Cards apiladas con información relevante

---

## 4️⃣ Acciones Rápidas

Tres botones de navegación directa a acciones críticas:

| Acción | Destino | Justificación |
|--------|---------|---------------|
| Agendar Cita | `/app/appointments` | Tarea más común |
| Nuevo Cliente | `/app/clients` | Crecimiento |
| Procesar Pagos | `/app/commissions` | Finanzas |

---

## 5️⃣ Componentes Reutilizables

### `KPICard`

```typescript
interface KPICardProps {
  label: string              // "Ingresos Hoy"
  value: string | number     // "$1234.56"
  sublabel?: string          // "Citas completadas"
  trend?: {                  // Indicador de tendencia
    value: number            // 12.5
    direction: "up" | "down"
    period?: string          // "vs mes anterior"
  }
  variant?: "default" | "accent" | "success" | "warning"
  sparkData?: number[]       // Mini gráfico (7 últimos días)
  icon?: React.ReactNode     // SVG icon
  tooltip?: string           // Información adicional
}
```

**Características:**
- ✅ Sparkline de 7 días (línea mini)
- ✅ Indicador tendencia ↑↓
- ✅ Colores semánticos
- ✅ Hover animation
- ✅ Tooltip explicativo

### `RecentActivity`

```typescript
interface RecentActivityProps {
  appointments: Appointment[]  // Últimas citas
}

// Filtros internos: Today | Tomorrow | Week
// Responsive: Tabla (desktop) → Cards (mobile)
// Ordenado por fecha descendente
```

### `AlertsComponent`

```typescript
interface Alert {
  id: string
  severity: "critical" | "warning" | "info"
  title: string
  description: string
  action?: { label: string; href: string }
}
```

---

## 6️⃣ Cálculo de Métricas

### Función: `getDashboardMetrics(salonId)`

Retorna todas las métricas en una sola llamada optimizada:

```typescript
interface DashboardMetrics {
  revenue: {
    today: Decimal              // Hoy
    monthToDate: Decimal        // Este mes
    prevMonthToDate: Decimal    // Mes anterior
    averageTicket: Decimal      // Ticket promedio
    pendingPayments: Decimal    // Comisiones pendientes
  }
  
  operations: {
    appointmentsToday: number   // Citas agendadas hoy
    occupancyRate: number       // % de ocupación
    activeStaffToday: number    // Personal con citas
    cancelationsToday: number   // Cancelaciones hoy
    noShowsToday: number        // No-shows
  }
  
  health: {
    totalClients: number
    newClientsThisMonth: number
    returningClients: number
    clientChurn: number
    revenuePerStaff: Decimal
    staffUtilization: number[]  // % por peluquero
  }
  
  risks: {
    unpaidAppointments: number
    overdueCommissions: number
    staffWithZeroBookings: string[]
    highCancellationRiskClients: string[]
    lowOccupancySlots: string[]
  }
}
```

**Optimizaciones:**
- ✅ Queries agrupadas con `Promise.all()`
- ✅ `.catch()` para fallos sin bloquear
- ✅ Decimals de Prisma para precisión monetaria
- ✅ Índices en BD por `salonId` + `status` + `date`

---

## 7️⃣ Guía Visual & Colores

### Variantes de Tarjeta

| Variante | Uso | Color |
|----------|-----|-------|
| **accent** | Ingresos destacados | `#FFB500` (Oro) |
| **success** | Métricas positivas | `#10B981` (Verde) |
| **warning** | Alertas/Riesgos | `#F59E0B` (Naranja) |
| **default** | Información neutral | `#6B7280` (Gris) |

### Tipografía

```
Headings: Serif (Cormorant/Crimson)
Body: Sans-serif (Inter)
Monospace: Números monetarios (Monaco/Courier)
```

### Jerarquía Visual

1. **KPIs Nivel 1** (Mayor tamaño, colores brillantes)
2. **Alertas** (Rojo/Naranja)
3. **KPIs Nivel 2-3** (Tamaño medio)
4. **Actividad Reciente** (Tabla secundaria)
5. **Acciones Rápidas** (Buttons discretos)

---

## 8️⃣ Datos & Rendimiento

### Estrategia de Carga

```
1. Page Load
   ↓
2. getDashboardMetrics() [con Promise.all]
   ├─ Calcula revenue (HOY, MES, PREV)
   ├─ Calcula operations (staff, ocupación)
   ├─ Calcula health (clientes, churn)
   └─ Detecta risks (alertas)
   ↓
3. Renderiza componentes con datos

⏱️ Tiempo esperado: 300-500ms con BD conectada
```

### Graceful Degradation

```typescript
// Si BD falla
metrics = null
→ Renderizar mensaje "Error cargando métricas"

// Si una query falla
.catch(() => 0)  // Retorna default
→ Las otras métricas siguen funcionando
```

---

## 9️⃣ Casos de Uso

### Escenario 1: Admin llega por la mañana

```
[Carga Dashboard]
  ↓
Ve INGRESOS HOY = $0 (es temprano) ✓
  ↓
Ve ALERTAS = "Comisiones pendientes $320 de ayer" ⚠️
  ↓
Hace clic → Va a /app/commissions
  ↓
Procesa pagos en 30 segundos
```

### Escenario 2: Reunión rápida con gerente

```
[Abre Dashboard]
  ↓
Lee en 10 segundos:
- Ingresos MES = $8,420 (↑12% vs mes anterior) ✓
- Ocupación hoy = 85% ✓
- Clientes recurrentes = 60% (saludable) ✓
- Churn = 2 clientes (bajo) ✓
  ↓
"Todo OK, vamos a agendas promoción"
```

### Escenario 3: Crisis de tarde

```
[Abre Dashboard]
  ↓
ALERTAS gritando:
- CRÍTICA: "Cancelaciones = 3 hoy"
- ADVERTENCIA: "Ocupación = 30%"
  ↓
Hace clic "Riesgo de churn"
  ↓
Ve clientes problemáticos
  ↓
Llama para retenerlos
```

---

## 🔟 Mejoras Futuras (AI-Ready)

### Espacio reservado para insights impulsados por IA:

```
[AI INSIGHTS]
├─ 📈 "Demanda esperada: +15% próxima semana"
├─ 🎯 "Precio óptimo: Sube haircut a $18"
├─ ⚡ "Carlos está sobrecargado: 8h trabajadas"
└─ ⚠️  "Juan cancela mucho: riesgo del 78%"
```

---

## 📊 Estructura de Archivos

```
src/
├── lib/
│   ├── dashboard-metrics.ts    ← Lógica de cálculo
│   └── prisma.ts
│
├── components/dashboard/
│   ├── KPICard.tsx             ← Tarjeta genérica
│   ├── RecentActivity.tsx       ← Tabla + filtros
│   ├── AlertsComponent.tsx      ← Alertas
│   ├── Badge.tsx               ← Etiqueta estado
│   ├── StatsCard.tsx           ← (Legacy, puede eliminar)
│   ├── Sidebar.tsx
│   ├── TopNav.tsx
│   └── DashboardShell.tsx
│
└── app/(dashboard)/app/
    ├── page.tsx                ← Página principal (ACTUALIZADA)
    ├── appointments/
    ├── clients/
    ├── barbers/
    └── commissions/
```

---

## ✅ Checklist de Decisiones

- ✅ Ingresos en Nivel 1 (máxima visibilidad)
- ✅ Alertas generadas automáticamente (sin entrada manual)
- ✅ Filtros rápidos en Actividad (Today/Tomorrow/Week)
- ✅ Cards responsivas (Desktop/Tablet/Mobile)
- ✅ Tendencias históricas (↑ ↓ %)
- ✅ Tooltips en KPIs complejos
- ✅ CTA en cada alerta
- ✅ Componentización reutilizable
- ✅ Sin decoraciones innecesarias
- ✅ Escalable para múltiples salones

---

## 📋 Conclusión

Este dashboard es:

🎯 **Orientado a decisiones** - Cada métrica justifica su presencia  
⚡ **Rápido** - 10 segundos máximo para entender el negocio  
🎨 **Profesional** - SaaS enterprise aesthetic  
📱 **Responsivo** - Mobile-first design  
🔧 **Mantenible** - Componentes reutilizables  
🚀 **Escalable** - Preparado para múltiples sucursales + IA  

**Elvis Barber Studio merece un dashboard tan premium como su barbería.** 💈✨
