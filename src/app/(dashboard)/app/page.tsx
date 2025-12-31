import Link from "next/link"
import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { KPICard } from "@/components/dashboard/KPICard"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { AlertsComponent } from "@/components/dashboard/AlertsComponent"
import { SkeletonCardGrid, SkeletonTable } from "@/components/dashboard/SkeletonLoaders"
import { ChevronRight, TrendingUp, TrendingDown, Users, CreditCard, Zap, AlertTriangle } from "lucide-react"
import { getDashboardMetrics, calculateTrendPercentage, type DashboardMetrics } from "@/lib/dashboard-metrics"
import { auth } from "@/auth"

// Componente para la sección de ingresos
async function RevenueSection({ metrics }: { metrics: DashboardMetrics }) {
  const revenueTrend = calculateTrendPercentage(metrics.revenue.monthToDate, metrics.revenue.prevMonthToDate)
  
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-accent" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">Ingresos</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/app/appointments">
          <KPICard
            label="Ingresos Hoy"
            value={`$${metrics.revenue.today.toFixed(2)}`}
            sublabel="Citas completadas"
            variant="accent"
            icon={<TrendingUp className="w-5 h-5" />}
            tooltip="Ingresos generados por citas completadas hoy"
          />
        </Link>

        <Link href="/app/appointments">
          <KPICard
            label="MES a la Fecha"
            value={`$${metrics.revenue.monthToDate.toFixed(2)}`}
            sublabel={`vs $${metrics.revenue.prevMonthToDate.toFixed(2)} mes anterior`}
            trend={{
              value: Math.abs(revenueTrend),
              direction: revenueTrend >= 0 ? "up" : "down",
              period: "vs mes anterior",
            }}
            variant="default"
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </Link>

        <Link href="/app/appointments">
          <KPICard
            label="Ticket Promedio"
            value={`$${metrics.revenue.averageTicket.toFixed(2)}`}
            sublabel="Por cita"
            variant="success"
            icon={<CreditCard className="w-5 h-5" />}
          />
        </Link>

        <Link href="/app/commissions">
          <KPICard
            label="Comisiones Pendientes"
            value={`$${metrics.revenue.pendingPayments.toFixed(2)}`}
            sublabel={`${metrics.risks.overdueCommissions} comisiones`}
            variant={metrics.risks.overdueCommissions > 0 ? "warning" : "default"}
            icon={<AlertTriangle className="w-5 h-5" />}
            tooltip="Monto total de comisiones sin pagar"
          />
        </Link>
      </div>
    </section>
  )
}

// Componente para la sección de operaciones
async function OperationsSection({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-green-500" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-green-500">Operaciones</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/app/appointments">
          <KPICard
            label="Citas Hoy"
            value={metrics.operations.appointmentsToday}
            sublabel="Agendadas"
            variant="default"
            icon={<Zap className="w-5 h-5" />}
          />
        </Link>

        <KPICard
          label="Ocupación"
          value={`${metrics.operations.occupancyRate}%`}
          sublabel={`${metrics.operations.occupancyRate >= 75 ? "Óptima" : metrics.operations.occupancyRate >= 50 ? "Buena" : "Baja"}`}
          variant={metrics.operations.occupancyRate >= 75 ? "success" : metrics.operations.occupancyRate >= 50 ? "default" : "warning"}
          icon={<TrendingUp className="w-5 h-5" />}
          tooltip={`${metrics.operations.appointmentsToday} slots ocupados`}
        />

        <KPICard
          label="Personal Activo"
          value={metrics.operations.activeStaffToday}
          sublabel={`de ${metrics.health.staffUtilization.length} disponibles`}
          variant="success"
          icon={<Users className="w-5 h-5" />}
        />

        <KPICard
          label="Cancelaciones"
          value={metrics.operations.cancelationsToday}
          sublabel="Hoy"
          variant={metrics.operations.cancelationsToday > 0 ? "warning" : "default"}
          icon={<AlertTriangle className="w-5 h-5" />}
        />
      </div>
    </section>
  )
}

// Componente para la sección de salud
async function HealthSection({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-500" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-500">Salud del Negocio</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/app/clients">
          <KPICard
            label="Clientes Total"
            value={metrics.health.totalClients}
            sublabel={`+${metrics.health.newClientsThisMonth} nuevos este mes`}
            variant="default"
            icon={<Users className="w-5 h-5" />}
          />
        </Link>

        <KPICard
          label="Clientes Recurrentes"
          value={metrics.health.returningClients}
          sublabel={`${((metrics.health.returningClients / metrics.health.totalClients) * 100).toFixed(0)}% del total`}
          variant="success"
          icon={<TrendingUp className="w-5 h-5" />}
        />

        <KPICard
          label="Ingreso por Personal"
          value={`$${metrics.health.revenuePerStaff.toFixed(2)}`}
          sublabel="Promedio mensual"
          variant="default"
          icon={<CreditCard className="w-5 h-5" />}
        />

        <KPICard
          label="Churn"
          value={metrics.health.clientChurn}
          sublabel="Clientes inactivos"
          variant={metrics.health.clientChurn > 0 ? "warning" : "success"}
          icon={<TrendingDown className="w-5 h-5" />}
        />
      </div>
    </section>
  )
}

export default async function DashboardPage() {
  const session = await auth()
  const salonId = session?.user?.salonId || "default"

  const [metrics, appointments] = await Promise.all([
    getDashboardMetrics(salonId).catch(() => null),
    prisma.appointment
      .findMany({
        where: { salonId },
        take: 20,
        orderBy: { scheduledStart: "desc" },
        include: {
          client: true,
          barber: true,
          service: true,
        },
      })
      .catch(() => []),
  ])

  // Serializar Decimals a números
  const recentAppointments = appointments.map(apt => ({
    ...apt,
    totalAmount: apt.totalAmount ? parseFloat(apt.totalAmount.toString()) : null,
    service: apt.service ? {
      ...apt.service,
      price: parseFloat(apt.service.price.toString())
    } : null
  })) as any[] // eslint-disable-line @typescript-eslint/no-explicit-any

  if (!metrics) {
    return (
      <div className="space-y-8">
        <div className="text-center text-foreground-muted">Error cargando métricas</div>
      </div>
    )
  }

  const alerts = [
    ...(metrics.risks.unpaidAppointments > 0
      ? [
          {
            id: "unpaid",
            severity: "warning" as const,
            title: "Citas sin pagar",
            description: `${metrics.risks.unpaidAppointments} citas completadas no han sido pagadas en los últimos 7 días.`,
            action: { label: "Ver detalles", href: "/app/commissions" },
          },
        ]
      : []),
    ...(metrics.risks.overdueCommissions > 0
      ? [
          {
            id: "commissions",
            severity: "warning" as const,
            title: "Comisiones pendientes",
            description: `${metrics.risks.overdueCommissions} comisiones esperan ser pagadas por $${metrics.revenue.pendingPayments.toFixed(2)}.`,
            action: { label: "Procesar pagos", href: "/app/commissions" },
          },
        ]
      : []),
    ...(metrics.risks.staffWithZeroBookings.length > 0
      ? [
          {
            id: "zero-bookings",
            severity: "info" as const,
            title: "Personal sin citas",
            description: `${metrics.risks.staffWithZeroBookings.join(", ")} no tienen citas agendadas para hoy.`,
            action: { label: "Agendar", href: "/app/appointments" },
          },
        ]
      : []),
    ...(metrics.operations.occupancyRate < 50 && metrics.operations.occupancyRate > 0
      ? [
          {
            id: "low-occupancy",
            severity: "info" as const,
            title: "Baja ocupación",
            description: `La ocupación hoy es del ${metrics.operations.occupancyRate}%. Considera promociones.`,
          },
        ]
      : []),
    ...(metrics.risks.highCancellationRiskClients.length > 0
      ? [
          {
            id: "churn",
            severity: "critical" as const,
            title: "Riesgo de churn",
            description: `Clientes con alta tasa de cancelación: ${metrics.risks.highCancellationRiskClients.slice(0, 2).join(", ")}.`,
            action: { label: "Contactar", href: "/app/clients" },
          },
        ]
      : []),
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-serif font-medium">Dashboard de Negocio</h1>
        <p className="text-foreground-muted">Vista ejecutiva para tomar decisiones en segundos</p>
      </div>

      <Suspense fallback={<SkeletonCardGrid count={4} />}>
        <RevenueSection metrics={metrics} />
      </Suspense>

      <Suspense fallback={<SkeletonCardGrid count={4} />}>
        <OperationsSection metrics={metrics} />
      </Suspense>

      <Suspense fallback={<SkeletonCardGrid count={4} />}>
        <HealthSection metrics={metrics} />
      </Suspense>

      {alerts.length > 0 && <AlertsComponent alerts={alerts} />}

      <Suspense fallback={<SkeletonTable />}>
        <RecentActivity appointments={recentAppointments} />
      </Suspense>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground-muted">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/app/appointments"
            className="p-6 border border-slate-700/50 rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-950/80 hover:border-accent/40 hover:from-slate-900 hover:to-slate-900 transition-all group backdrop-blur-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium mb-1">Agendar Cita</h3>
                <p className="text-xs text-foreground-muted">Nuevo o recurrente</p>
              </div>
              <ChevronRight className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>

          <Link
            href="/app/clients"
            className="p-6 border border-slate-700/50 rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-950/80 hover:border-accent/40 hover:from-slate-900 hover:to-slate-900 transition-all group backdrop-blur-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium mb-1">Nuevo Cliente</h3>
                <p className="text-xs text-foreground-muted">Agregar a base de datos</p>
              </div>
              <ChevronRight className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>

          <Link
            href="/app/commissions"
            className="p-6 border border-slate-700/50 rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-950/80 hover:border-accent/40 hover:from-slate-900 hover:to-slate-900 transition-all group backdrop-blur-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium mb-1">Procesar Pagos</h3>
                <p className="text-xs text-foreground-muted">Comisiones pendientes</p>
              </div>
              <ChevronRight className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
