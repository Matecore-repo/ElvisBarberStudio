import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { Badge } from "@/components/dashboard/Badge"
import { ChevronRight } from "lucide-react"

export default async function DashboardPage() {
  const [appointmentsCount, barbersCount, clientsCount, pendingCommissions, recentAppointments] =
    await Promise.all([
      prisma.appointment
        .count({
          where: { status: "SCHEDULED" },
        })
        .catch(() => 0),
      prisma.barber
        .count({
          where: { active: true },
        })
        .catch(() => 0),
      prisma.client.count().catch(() => 0),
      prisma.commission
        .aggregate({
          where: { status: "PENDING" },
          _sum: { amount: true },
        })
        .catch(() => ({ _sum: { amount: null } })),
      prisma.appointment
        .findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            client: true,
            barber: true,
          },
        })
        .catch(() => []),
    ])

  const pendingAmount = pendingCommissions._sum?.amount || 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-serif font-medium">Dashboard</h1>
        <p className="text-foreground-muted">Vista general del negocio en tiempo real</p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Link href="/app/appointments">
          <StatsCard
            label="Turnos pendientes"
            value={appointmentsCount}
            sublabel="Sin completar"
            trend={{ value: 12, direction: "up" }}
            variant="accent"
          />
        </Link>

        <Link href="/app/barbers">
          <StatsCard
            label="Peluqueros activos"
            value={barbersCount}
            sublabel="Disponibles hoy"
            trend={{ value: 0, direction: "up" }}
            variant="success"
          />
        </Link>

        <Link href="/app/clients">
          <StatsCard
            label="Base de clientes"
            value={clientsCount}
            sublabel="Registrados"
            trend={{ value: 8, direction: "up" }}
            variant="default"
          />
        </Link>

        <Link href="/app/commissions">
          <StatsCard
            label="Comisiones pendientes"
            value={`$${pendingAmount.toFixed(2)}`}
            sublabel="Por pagar"
            trend={{ value: 5, direction: "down" }}
            variant="warning"
          />
        </Link>
      </div>

      {/* Recent Appointments Table */}
      <section className="space-y-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-serif font-medium">Turnos recientes</h2>
          <p className="text-sm text-foreground-muted">Últimas citas agendadas</p>
        </div>

        <div className="w-full border border-border rounded-xl overflow-hidden bg-card/20">
          {/* Desktop table view */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-card/40">
                  <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-foreground-muted text-left">
                    Cliente
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-foreground-muted text-left">
                    Peluquero
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-foreground-muted text-center">
                    Estado
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-foreground-muted text-right">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.length > 0 ? (
                  recentAppointments.map((appointment, idx) => (
                    <tr
                      key={appointment.id}
                      className={`border-b border-border transition-colors hover:bg-card/60 ${
                        idx % 2 === 0 ? "bg-background/30" : ""
                      }`}
                    >
                      <td className="px-4 sm:px-6 py-4 text-sm">
                        <div className="flex flex-col">
                          <p className="font-medium text-white">{appointment.client?.name || "Sin nombre"}</p>
                          <p className="text-xs text-foreground-muted">{appointment.client?.phone || "Sin teléfono"}</p>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-foreground">
                        {appointment.barber?.name || "Sin asignar"}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-center">
                        <Badge
                          label={appointment.status === "SCHEDULED" ? "Pendiente" : "Completado"}
                          variant={appointment.status === "SCHEDULED" ? "accent" : "success"}
                          size="sm"
                        />
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-right text-foreground">
                        {new Date(appointment.createdAt).toLocaleDateString("es-AR")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 sm:px-6 py-8 text-center text-foreground-muted">
                      Sin turnos registrados aún
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile card view */}
          <div className="sm:hidden space-y-3 p-4">
            {recentAppointments.length > 0 ? (
              recentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 border border-border rounded-lg bg-card/40"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
                      Cliente
                    </span>
                    <span className="text-sm font-medium text-white">{appointment.client?.name || "Sin nombre"}</span>
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
                      Peluquero
                    </span>
                    <span className="text-sm font-medium text-white">{appointment.barber?.name || "Sin asignar"}</span>
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
                      Estado
                    </span>
                    <Badge
                      label={appointment.status === "SCHEDULED" ? "Pendiente" : "Completado"}
                      variant={appointment.status === "SCHEDULED" ? "accent" : "success"}
                      size="sm"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
                      Fecha
                    </span>
                    <span className="text-sm font-medium text-white">
                      {new Date(appointment.createdAt).toLocaleDateString("es-AR")}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-foreground-muted">Sin turnos registrados aún</div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Link
          href="/app/appointments"
          className="p-6 border border-border rounded-xl bg-card/20 hover:border-accent/40 hover:bg-card/40 transition-all group"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-medium mb-1">Agendar turno</h3>
              <p className="text-sm text-foreground-muted">Nuevo cliente o cliente recurrente</p>
            </div>
            <ChevronRight className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>

        <Link
          href="/app/clients"
          className="p-6 border border-border rounded-xl bg-card/20 hover:border-accent/40 hover:bg-card/40 transition-all group"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-medium mb-1">Agregar cliente</h3>
              <p className="text-sm text-foreground-muted">Nuevo cliente a la base de datos</p>
            </div>
            <ChevronRight className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>

        <Link
          href="/app/commissions"
          className="p-6 border border-border rounded-xl bg-card/20 hover:border-accent/40 hover:bg-card/40 transition-all group"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-medium mb-1">Ver comisiones</h3>
              <p className="text-sm text-foreground-muted">Revisar pagos pendientes</p>
            </div>
            <ChevronRight className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>
      </section>
    </div>
  )
}
