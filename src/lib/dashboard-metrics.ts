import { prisma } from "./prisma"
import { Decimal } from "@prisma/client/runtime/library"

export interface DashboardMetrics {
  // Revenue Metrics
  revenue: {
    today: Decimal
    monthToDate: Decimal
    prevMonthToDate: Decimal
    averageTicket: Decimal
    pendingPayments: Decimal
  }
  // Operations Metrics
  operations: {
    appointmentsToday: number
    occupancyRate: number
    activeStaffToday: number
    cancelationsToday: number
    noShowsToday: number
  }
  // Business Health
  health: {
    totalClients: number
    newClientsThisMonth: number
    returningClients: number
    clientChurn: number
    revenuePerStaff: Decimal
    staffUtilization: number[]
  }
  // Risk Indicators
  risks: {
    unpaidAppointments: number
    overdueCommissions: number
    staffWithZeroBookings: string[]
    highCancellationRiskClients: string[]
    lowOccupancySlots: string[]
  }
}

export async function getDashboardMetrics(salonId: string): Promise<DashboardMetrics> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const prevMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const prevMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)

  // === REVENUE METRICS ===
  const [todayAppointments, monthAppointments, prevMonthAppointments, allAppointments, pendingCommissions, staffCount] =
    await Promise.all([
      prisma.appointment.findMany({
        where: {
          salonId,
          status: "COMPLETED",
          completedAt: {
            gte: today,
            lt: tomorrow,
          },
        },
        include: { service: true },
      }),
      prisma.appointment.findMany({
        where: {
          salonId,
          status: "COMPLETED",
          completedAt: {
            gte: monthStart,
          },
        },
        include: { service: true },
      }),
      prisma.appointment.findMany({
        where: {
          salonId,
          status: "COMPLETED",
          completedAt: {
            gte: prevMonthStart,
            lte: prevMonthEnd,
          },
        },
        include: { service: true },
      }),
      prisma.appointment.findMany({
        where: { salonId },
        include: { service: true },
      }),
      prisma.commission.findMany({
        where: {
          salonId,
          status: "PENDING",
        },
      }),
      prisma.barber.count({ where: { salonId, active: true } }),
    ])

  const todayRevenue = todayAppointments.reduce((sum, a) => sum.plus(a.service?.price || 0), new Decimal(0))
  const monthRevenue = monthAppointments.reduce((sum, a) => sum.plus(a.service?.price || 0), new Decimal(0))
  const prevMonthRevenue = prevMonthAppointments.reduce((sum, a) => sum.plus(a.service?.price || 0), new Decimal(0))
  const averageTicket =
    allAppointments.length > 0
      ? allAppointments.reduce((sum, a) => sum.plus(a.service?.price || 0), new Decimal(0)).dividedBy(allAppointments.length)
      : new Decimal(0)
  const pendingAmount = pendingCommissions.reduce((sum, c) => sum.plus(c.amount), new Decimal(0))

  // === OPERATIONS METRICS ===
  const [appointmentsTodayScheduled, cancelationsToday, completedTodayCount, barbers, allAppointmentsToday] =
    await Promise.all([
      prisma.appointment.count({
        where: {
          salonId,
          status: "SCHEDULED",
          scheduledStart: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      prisma.appointment.count({
        where: {
          salonId,
          status: "CANCELED",
          updatedAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      prisma.appointment.count({
        where: {
          salonId,
          status: "COMPLETED",
          completedAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      prisma.barber.findMany({
        where: { salonId, active: true },
        include: {
          appointments: {
            where: {
              scheduledStart: {
                gte: today,
                lt: tomorrow,
              },
              status: "SCHEDULED",
            },
          },
        },
      }),
      prisma.appointment.findMany({
        where: {
          salonId,
          status: "SCHEDULED",
          scheduledStart: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
    ])

  const activeStaff = barbers.filter((b) => b.appointments.length > 0).length
  const occupancyRate = allAppointmentsToday.length > 0 ? Math.round((completedTodayCount / allAppointmentsToday.length) * 100) : 0

  // === BUSINESS HEALTH ===
  const [totalClients, newClientsThisMonth, appointmentsPerClient] = await Promise.all([
    prisma.client.count({ where: { salonId } }),
    prisma.client.count({
      where: {
        salonId,
        createdAt: { gte: monthStart },
      },
    }),
    prisma.appointment.groupBy({
      by: ["clientId"],
      where: { salonId, status: "COMPLETED" },
      _count: {
        id: true,
      },
    }),
  ])

  const returningClientsCount = appointmentsPerClient.filter((a) => a._count.id > 1).length
  const clientChurn = Math.max(0, totalClients - newClientsThisMonth - returningClientsCount)
  const revenuePerStaff = staffCount > 0 ? monthRevenue.dividedBy(staffCount) : new Decimal(0)

  const staffUtilization = barbers.map((b) => (b.appointments.length > 0 ? 100 : 0))

  // === RISK INDICATORS ===
  const [unpaidAppointments, highCancellationClients, staffZeroBookings] = await Promise.all([
    prisma.appointment.count({
      where: {
        salonId,
        status: "COMPLETED",
        completedAt: {
          gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    prisma.client.findMany({
      where: { salonId },
      include: {
        appointments: {
          where: { status: "CANCELED" },
        },
      },
    }),
    prisma.barber.findMany({
      where: { salonId, active: true },
      include: {
        appointments: {
          where: {
            status: "SCHEDULED",
            scheduledStart: {
              gte: today,
              lt: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
            },
          },
        },
      },
    }),
  ])

  const highCancellationRiskClients = highCancellationClients
    .filter((c) => c.appointments.length > 2)
    .slice(0, 5)
    .map((c) => c.name)

  const staffWithZeroBookings = staffZeroBookings.filter((b) => b.appointments.length === 0).map((b) => b.name)

  return {
    revenue: {
      today: todayRevenue,
      monthToDate: monthRevenue,
      prevMonthToDate: prevMonthRevenue,
      averageTicket,
      pendingPayments: pendingAmount,
    },
    operations: {
      appointmentsToday: appointmentsTodayScheduled,
      occupancyRate,
      activeStaffToday: activeStaff,
      cancelationsToday,
      noShowsToday: 0,
    },
    health: {
      totalClients,
      newClientsThisMonth,
      returningClients: returningClientsCount,
      clientChurn,
      revenuePerStaff,
      staffUtilization,
    },
    risks: {
      unpaidAppointments,
      overdueCommissions: pendingCommissions.length,
      staffWithZeroBookings,
      highCancellationRiskClients,
      lowOccupancySlots: [],
    },
  }
}

export function calculateTrendPercentage(current: Decimal, previous: Decimal): number {
  if (previous.isZero()) return 0
  return parseFloat(current.minus(previous).dividedBy(previous).times(100).toFixed(1))
}
