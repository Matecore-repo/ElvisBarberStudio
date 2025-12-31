import { PrismaClient } from '@prisma/client'
import { unstable_cache } from 'next/cache'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// === FUNCIONES DE CACHÉ OPTIMIZADAS ===

/**
 * Obtiene peluqueros con caché
 * Revalida cada 5 minutos
 */
export const getCachedBarbers = unstable_cache(
  async (salonId: string) => {
    return await prisma.barber.findMany({
      where: { salonId },
      select: {
        id: true,
        salonId: true,
        name: true,
        commissionType: true,
        commissionValue: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },
  ['barbers'],
  { revalidate: 300, tags: ['barbers'] }
)

/**
 * Obtiene clientes con caché
 */
export const getCachedClients = unstable_cache(
  async (salonId: string) => {
    return await prisma.client.findMany({
      where: { salonId },
      select: {
        id: true,
        salonId: true,
        name: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },
  ['clients'],
  { revalidate: 300, tags: ['clients'] }
)

/**
 * Obtiene citas con caché (últimas 20)
 */
export const getCachedAppointments = unstable_cache(
  async (salonId: string) => {
    return await prisma.appointment.findMany({
      where: { salonId },
      include: {
        client: { select: { id: true, name: true, phone: true } },
        barber: { select: { id: true, name: true } },
        service: { select: { id: true, name: true, price: true, durationMinutes: true } },
      },
      orderBy: { scheduledStart: 'desc' },
      take: 20,
    })
  },
  ['appointments'],
  { revalidate: 60, tags: ['appointments'] } // Más frecuente que barbers
)

/**
 * Obtiene comisiones con caché
 */
export const getCachedCommissions = unstable_cache(
  async (salonId: string) => {
    return await prisma.commission.findMany({
      where: { salonId },
      include: {
        barber: { select: { id: true, name: true, commissionValue: true } },
        appointment: {
          include: {
            client: { select: { id: true, name: true } },
            service: { select: { id: true, name: true, price: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
    })
  },
  ['commissions'],
  { revalidate: 120, tags: ['commissions'] }
)

// === INVALIDACIÓN DE CACHÉ ===
export function invalidateCache() {
  // En el future, cuando uses revalidatePath/revalidateTag
}
