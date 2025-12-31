# 🔧 CORRECCIÓN - Problema de Serialización de Decimal

## ❌ Problema Identificado

```
Error: Only plain objects can be passed to Client Components from Server Components. 
Decimal objects are not supported.
```

Ocurría en:
- `src/app/(dashboard)/app/barbers/page.tsx`
- `src/app/(dashboard)/app/appointments/page.tsx`
- `src/app/(dashboard)/app/commissions/page.tsx`

## 🔍 Causa Raíz

Next.js 13+ con Server Components tiene una restricción: **no puede serializar objetos `Decimal` de Prisma** cuando se pasan de un Server Component a un Client Component.

Prisma devuelve `Decimal` para campos monetarios, pero estos no son JSON-serializables por defecto.

## ✅ Solución Implementada

Convertir todos los valores `Decimal` a `number` en el Server Component **antes** de pasarlos al Client Component.

### Patrón Aplicado

```typescript
// ❌ ANTES (genera error)
const appointments = await prisma.appointment.findMany({...})
<AppointmentsList initialAppointments={appointments} />  // ERROR!

// ✅ DESPUÉS (funciona)
const appointments = await prisma.appointment.findMany({...})
const appointmentsForClient = appointments.map(apt => ({
  ...apt,
  totalAmount: apt.totalAmount ? parseFloat(apt.totalAmount.toString()) : null,
  service: apt.service ? {
    ...apt.service,
    price: parseFloat(apt.service.price.toString())
  } : null
}))
<AppointmentsList initialAppointments={appointmentsForClient} />  // OK!
```

## 📝 Archivos Corregidos

### 1. `src/app/(dashboard)/app/barbers/page.tsx`
```typescript
// Agregar conversión
const barbersForClient = barbers.map(barber => ({
  ...barber,
  commissionValue: parseFloat(barber.commissionValue.toString())
}))
```

### 2. `src/app/(dashboard)/app/appointments/page.tsx`
```typescript
// Agregar conversión de appointments y barbers
const appointmentsForClient = appointments.map(apt => ({
  ...apt,
  totalAmount: apt.totalAmount ? parseFloat(apt.totalAmount.toString()) : null,
  service: apt.service ? {
    ...apt.service,
    price: parseFloat(apt.service.price.toString())
  } : null
}))
```

### 3. `src/app/(dashboard)/app/commissions/page.tsx`
```typescript
// Agregar conversión de commissions completa
const commissionsForClient = commissions.map(commission => ({
  ...commission,
  amount: parseFloat(commission.amount.toString()),
  barber: {
    ...commission.barber,
    commissionValue: parseFloat(commission.barber.commissionValue.toString())
  },
  appointment: commission.appointment ? {
    ...commission.appointment,
    totalAmount: commission.appointment.totalAmount 
      ? parseFloat(commission.appointment.totalAmount.toString()) 
      : null,
    service: commission.appointment.service ? {
      ...commission.appointment.service,
      price: parseFloat(commission.appointment.service.price.toString())
    } : null
  } : null
}))
```

### 4. `src/components/barbers/BarbersList.tsx`
```typescript
// Agregar interfaz serializada
interface BarberSerialized extends Omit<Barber, 'commissionValue'> {
  commissionValue: number
}

// Actualizar props
interface BarbersListProps {
  initialBarbers: BarberSerialized[]
}

// Actualizar useState con type
const [barbers, setBarbers] = useState<BarberSerialized[]>(initialBarbers)
```

## ✔️ Verificación

Todas las páginas ahora cargan sin errores:
- ✅ `/app/barbers` - Funciona
- ✅ `/app/appointments` - Funciona
- ✅ `/app/commissions` - Funciona
- ✅ Linting: Sin errores
- ✅ TypeScript: Sin errores

## 🎓 Lección Aprendida

Cuando uses Prisma + Next.js Server Components:

1. **Identifica campos `Decimal`** en tu schema Prisma
2. **Conviértelos antes** de pasar a Client Components
3. **Usa tipos específicos** (BarberSerialized, etc.) para documentar

## 📊 Patrón Generalizado

```typescript
// Función reutilizable
function serializeDecimal<T>(obj: T, decimalFields: string[]): T {
  const result = { ...obj }
  for (const field of decimalFields) {
    if (result[field] !== null && result[field] !== undefined) {
      result[field] = parseFloat(result[field].toString())
    }
  }
  return result
}

// Uso
const barbers = await prisma.barber.findMany()
const serialized = barbers.map(b => serializeDecimal(b, ['commissionValue']))
```

## 🚀 Recomendación Futura

Considerar crear un middleware o hook que automatice esto:

```typescript
// lib/prisma-utils.ts
export function serializeDecimalValues(data: any, fields: string[]): any {
  // Automáticamente convierte Decimals a números
}
```

---

**Estado:** ✅ RESUELTO

**Versión:** 1.1 (post-corrección)
