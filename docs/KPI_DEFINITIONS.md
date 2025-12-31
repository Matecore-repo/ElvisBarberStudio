# 📊 KPI Definitions & Calculation Rules

## Definiciones Precisas de Cada Métrica

---

## 💰 INGRESOS (Revenue Tier)

### 1. Ingresos Hoy (Today's Revenue)

**Definición:**
Dinero generado por citas **completadas** entre hoy 00:00:00 y hoy 23:59:59.

**Cálculo:**
```sql
SELECT SUM(service.price)
FROM appointments
JOIN services ON appointments.service_id = services.id
WHERE appointments.salon_id = ?
  AND appointments.status = 'COMPLETED'
  AND DATE(appointments.completed_at) = CURRENT_DATE
```

**Casos especiales:**
- ❌ NO incluye citas agendadas (aún no completadas)
- ❌ NO incluye citas canceladas
- ✅ Incluye todos los servicios asociados
- ✅ Moneda: USD (configurar por salón)

**Uso:**
- Gerente mira cada mañana: "¿Cuánto dinero entró ayer?"
- Indicador de caja diaria

---

### 2. MES a la Fecha (Month-to-Date Revenue)

**Definición:**
Dinero acumulado desde el 1 del mes actual hasta hoy, citas completadas.

**Cálculo:**
```sql
SELECT SUM(service.price)
FROM appointments
JOIN services ON appointments.service_id = services.id
WHERE appointments.salon_id = ?
  AND appointments.status = 'COMPLETED'
  AND DATE_TRUNC('month', appointments.completed_at) = DATE_TRUNC('month', CURRENT_DATE)
  AND appointments.completed_at <= NOW()
```

**Visualización:**
- Valor principal
- **Comparación secundaria:** vs Mes anterior (mismo período)
- **Flecha:** ↑ +12% o ↓ -5%

**Ejemplo:**
```
MES a la Fecha: $8,420
vs $7,500 mes anterior
↑ +12.3%
```

**Uso:**
- Responder: "¿Vamos bien este mes?"
- Proyección: Si hoy (día 28) = $8,420 × (30/28) = $9,000 estimado final

---

### 3. Ticket Promedio (Average Ticket Value / ATV)

**Definición:**
Ingreso promedio por cita completada.

**Cálculo:**
```sql
SELECT AVG(service.price)
FROM appointments
JOIN services ON appointments.service_id = services.id
WHERE appointments.salon_id = ?
  AND appointments.status = 'COMPLETED'
  -- Últimos 30 días para evitar distorsiones
  AND appointments.completed_at >= NOW() - INTERVAL '30 days'
```

**Interpretación:**
- **$15-20:** Barbería estándar (haircuts)
- **$25-35:** Barbería premium + servicios adicionales
- **$40+:** Barbería de lujo o combos completos

**Ejemplo:**
```
Ticket Promedio: $18.50
Por cita (últimos 30 días)
```

**Uso:**
- ¿Clientes gastando suficiente?
- Detectar downtrend (puede indicar descuentos excesivos)
- Oportunidad: "Si lo subo $2, gano $2 × 10 citas/día = $20/día"

---

### 4. Comisiones Pendientes (Pending Commissions)

**Definición:**
Dinero adeudado a peluqueros (comisiones sin pagar).

**Cálculo:**
```sql
SELECT SUM(amount)
FROM commissions
WHERE salon_id = ?
  AND status = 'PENDING'
```

**Estructura:**
- Comisiones: PERCENT (15-25%) o FIXED ($5-10)
- Se generan cuando: cita se marca COMPLETED
- Se pagan: Manual (gerente hace transferencia + marca PAID)

**Ejemplo:**
```
Comisiones Pendientes: $320.00
12 comisiones sin pagar
```

**Riesgo asociado:**
- Si $320 > presupuesto semanal → Alerta ⚠️
- Si antigüedad > 7 días → Alerta 🔴

---

## ⚙️ OPERACIONES (Operations Tier)

### 5. Citas Hoy (Today's Appointments)

**Definición:**
Cantidad de citas **agendadas** para hoy, estado SCHEDULED.

**Cálculo:**
```sql
SELECT COUNT(*)
FROM appointments
WHERE salon_id = ?
  AND status = 'SCHEDULED'
  AND DATE(scheduled_start) = CURRENT_DATE
```

**Estado Visual:**
```
Citas Hoy: 12
Agendadas
```

**Uso:**
- Gerente llegando: "¿Cuántos clientes espero hoy?"
- Permite alerta: "Pocas citas, aprovechar para limpiar"

---

### 6. Ocupación (Occupancy Rate)

**Definición:**
Porcentaje de citas completadas vs totales agendadas para hoy.

**Cálculo:**
```sql
SELECT 
  ROUND(
    (CAST(completed AS DECIMAL) / total) * 100, 0
  ) as occupancy_pct
FROM (
  SELECT 
    COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed,
    COUNT(CASE WHEN status IN ('SCHEDULED', 'COMPLETED', 'CANCELED') THEN 1 END) as total
  FROM appointments
  WHERE salon_id = ?
    AND DATE(scheduled_start) = CURRENT_DATE
) stats
```

**Rangos & Colores:**
```
75-100%  → Verde ✅ (Óptimo)
50-74%   → Naranja ⚠️ (Aceptable)
0-49%    → Rojo 🔴 (Crítico - promocionar)
```

**Ejemplo:**
```
Ocupación: 85%
8 de 9 citas completadas
```

**Uso:**
- KPI operacional crítico
- Si < 50% → Alertar: "Promociona y agenda más"

---

### 7. Personal Activo Hoy (Active Staff Today)

**Definición:**
Cantidad de peluqueros con **al menos 1 cita agendada** para hoy.

**Cálculo:**
```sql
SELECT COUNT(DISTINCT barber_id)
FROM appointments
WHERE salon_id = ?
  AND status = 'SCHEDULED'
  AND DATE(scheduled_start) = CURRENT_DATE
  AND barber_id IS NOT NULL
```

**Ejemplo:**
```
Personal Activo: 3
de 5 disponibles
```

**Interpretación:**
- 3/5 = 60% utilización
- ¿Dónde están los otros 2? ¿Libres o fuera?

---

### 8. Cancelaciones (Cancellations Today)

**Definición:**
Cantidad de citas canceladas hoy.

**Cálculo:**
```sql
SELECT COUNT(*)
FROM appointments
WHERE salon_id = ?
  AND status = 'CANCELED'
  AND DATE(updated_at) = CURRENT_DATE
```

**Color:**
```
0          → Gris (Normal)
1-2        → Naranja ⚠️ (Aceptable)
3+         → Rojo 🔴 (Investigar causa)
```

**Uso:**
- Indicador de salud operacional
- Si > 3: ¿Sistema de confirmación de citas?

---

## 👥 SALUD DEL NEGOCIO (Health Tier)

### 9. Clientes Total (Total Clients)

**Definición:**
Cantidad acumulada de clientes registrados.

**Cálculo:**
```sql
SELECT COUNT(*)
FROM clients
WHERE salon_id = ?
```

**Contexto:**
```
Clientes Total: 127
+8 nuevos este mes
```

**Uso:**
- Métrica de tamaño de negocio
- "Base de 127 clientes = potencial $2,540/mes"

---

### 10. Clientes Recurrentes (Returning Clients)

**Definición:**
Clientes con 2+ citas completadas (repitieron).

**Cálculo:**
```sql
SELECT COUNT(DISTINCT client_id)
FROM appointments
WHERE salon_id = ?
  AND status = 'COMPLETED'
GROUP BY client_id
HAVING COUNT(*) >= 2
```

**Porcentaje:**
```
Recurrentes: 76 (60% del total)
```

**Interpretación:**
```
60% = Saludable ✅
40% = Crítico 🔴 (fidelización débil)
```

**Uso:**
- Métrica de fidelización
- Si baja → Estrategia de retención urgente

---

### 11. Ingresos por Personal (Revenue Per Staff)

**Definición:**
Ingresos mensuales acumulados ÷ Peluqueros activos.

**Cálculo:**
```sql
SELECT 
  SUM(s.price) / COUNT(DISTINCT b.id) as revenue_per_staff
FROM appointments a
JOIN services s ON a.service_id = s.id
JOIN barbers b ON a.barber_id = b.id
WHERE a.salon_id = ?
  AND a.status = 'COMPLETED'
  AND DATE_TRUNC('month', a.completed_at) = DATE_TRUNC('month', CURRENT_DATE)
  AND b.active = true
```

**Ejemplo:**
```
Ingresos por Personal: $420.50
(Mes actual: 3 peluqueros activos)
```

**Evaluación de Productividad:**
```
$300/mes    → Personal débil 🔴
$400-500/mes → Promedio ✅
$600+/mes   → Muy productivo 🟢
```

---

### 12. Churn (Client Churn)

**Definición:**
Clientes inactivos (sin citas en últimos 60 días).

**Cálculo:**
```sql
SELECT COUNT(*)
FROM clients c
WHERE c.salon_id = ?
  AND NOT EXISTS (
    SELECT 1 FROM appointments a
    WHERE a.client_id = c.id
      AND a.status = 'COMPLETED'
      AND a.completed_at >= NOW() - INTERVAL '60 days'
  )
```

**Riesgo:**
```
Churn: 18 clientes
14.2% de la base
```

**Acción:**
- Si > 10% → Campaña de reenganche urgente
- Email/SMS: "¿Te extrañamos? 20% descuento"

---

## 🚨 INDICADORES DE RIESGO (Risk Indicators)

### 13. Citas Sin Pagar (Unpaid Appointments)

**Definición:**
Citas completadas en últimos 7 días sin pago registrado.

**Cálculo:**
```sql
SELECT COUNT(*)
FROM appointments
WHERE salon_id = ?
  AND status = 'COMPLETED'
  AND completed_at >= NOW() - INTERVAL '7 days'
  AND NOT EXISTS (
    SELECT 1 FROM commissions
    WHERE appointment_id = appointments.id
      AND status = 'PAID'
  )
```

**Alerta:**
```
🔴 CRÍTICA: 3 citas sin pagar
"Valor: $54 en últimos 7 días"
[Cobrar ahora]
```

---

### 14. Comisiones Vencidas (Overdue Commissions)

**Definición:**
Comisiones pendientes > 7 días sin pagar.

**Cálculo:**
```sql
SELECT COUNT(*)
FROM commissions
WHERE salon_id = ?
  AND status = 'PENDING'
  AND created_at <= NOW() - INTERVAL '7 days'
```

**Alerta:**
```
⚠️ ADVERTENCIA: 5 comisiones vencidas
"$95 adeudado hace 10+ días"
[Procesar pagos]
```

---

### 15. Personal sin Citas (Zero Bookings Staff)

**Definición:**
Peluqueros activos sin citas agendadas en próximos 7 días.

**Cálculo:**
```sql
SELECT b.name
FROM barbers b
WHERE b.salon_id = ?
  AND b.active = true
  AND NOT EXISTS (
    SELECT 1 FROM appointments a
    WHERE a.barber_id = b.id
      AND a.status = 'SCHEDULED'
      AND a.scheduled_start >= NOW()
      AND a.scheduled_start < NOW() + INTERVAL '7 days'
  )
```

**Alerta:**
```
ℹ️ INFO: Personal sin citas
"João y Carlos no tienen reservas para mañana"
[Agendar citas]
```

---

### 16. Clientes de Alto Riesgo (High Churn Risk)

**Definición:**
Clientes con 3+ cancelaciones en últimos 30 días.

**Cálculo:**
```sql
SELECT c.name
FROM clients c
WHERE c.salon_id = ?
  AND (
    SELECT COUNT(*)
    FROM appointments a
    WHERE a.client_id = c.id
      AND a.status = 'CANCELED'
      AND a.updated_at >= NOW() - INTERVAL '30 days'
  ) >= 3
```

**Alerta:**
```
🔴 CRÍTICA: Riesgo de churn
"Juan Pérez cancela frecuentemente (3 en 30 días)"
[Contactar y retener]
```

---

## 📊 Matriz de Dependencias

```
Revenue Metrics
├─ Appointments (completed)
├─ Services (pricing)
└─ Commissions (payables)

Operations Metrics
├─ Appointments (status, barber)
└─ Barbers (active)

Health Metrics
├─ Clients (count, history)
├─ Appointments (frequency)
└─ Churn calculation

Risk Indicators
├─ Appointments (status, payment)
├─ Commissions (status, age)
├─ Barbers (availability)
└─ Clients (cancellation pattern)
```

---

## 🔄 Frecuencia de Cálculo

| Métrica | Frecuencia | Cache |
|---------|-----------|-------|
| Ingresos hoy | En tiempo real | 5 min |
| MES a la fecha | En tiempo real | 5 min |
| Ticket promedio | Cada 1 hora | 1 hora |
| Comisiones pendientes | En tiempo real | 5 min |
| Citas hoy | En tiempo real | 2 min |
| Ocupación | Cada 30 min | 30 min |
| Personal activo | En tiempo real | 5 min |
| Cancelaciones | En tiempo real | 5 min |
| Clientes total | Cada 1 hora | 1 hora |
| Recurrentes | Cada 24 horas | 24 horas |
| Ingresos por staff | Cada 1 hora | 1 hora |
| Churn | Cada 24 horas | 24 horas |
| Riesgos | Cada 30 min | 30 min |

---

## ✅ Validación de Datos

Cada métrica debe validarse:

```typescript
function validateMetrics(metrics: DashboardMetrics): ValidationResult {
  const rules = [
    { metric: 'revenue.today', min: 0, max: 10000 },
    { metric: 'operations.occupancyRate', min: 0, max: 100 },
    { metric: 'health.clientChurn', min: 0, type: 'integer' },
  ]
  
  return rules.map(rule => validate(metrics[rule.metric], rule))
}
```

---

*Documento de referencia para implementadores y analistas de Elvis Barber Studio.*
