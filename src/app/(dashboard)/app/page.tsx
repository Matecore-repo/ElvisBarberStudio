import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const [appointmentsCount, barbersCount, clientsCount, pendingCommissions] = await Promise.all([
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
  ])

  const pendingAmount = pendingCommissions._sum?.amount?.toString() || "0"

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-foreground-muted mt-1">Resumen del negocio</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-info/20 flex items-center justify-center">
              <span className="text-2xl" aria-hidden="true">
                📅
              </span>
            </div>
            <div>
              <p className="text-foreground-muted text-sm">Turnos pendientes</p>
              <p className="text-3xl font-bold">{appointmentsCount}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
              <span className="text-2xl" aria-hidden="true">
                ✂️
              </span>
            </div>
            <div>
              <p className="text-foreground-muted text-sm">Peluqueros activos</p>
              <p className="text-3xl font-bold">{barbersCount}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <span className="text-2xl" aria-hidden="true">
                👥
              </span>
            </div>
            <div>
              <p className="text-foreground-muted text-sm">Clientes</p>
              <p className="text-3xl font-bold">{clientsCount}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
              <span className="text-2xl" aria-hidden="true">
                💰
              </span>
            </div>
            <div>
              <p className="text-foreground-muted text-sm">Comisiones pendientes</p>
              <p className="text-3xl font-bold">${pendingAmount}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">Acciones rápidas</h2>
            <p className="text-foreground-muted text-sm mt-1">
              Atajos para lo más común del día a día.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <Link href="/app/appointments" className="btn-primary w-full sm:w-auto">
              Nuevo turno
            </Link>
            <Link href="/app/barbers" className="btn-secondary w-full sm:w-auto">
              Gestionar peluqueros
            </Link>
            <Link href="/app/commissions" className="btn-secondary w-full sm:w-auto">
              Ver comisiones
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

