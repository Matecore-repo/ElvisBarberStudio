"use client"

import { useMemo, useState } from "react"
import { Commission, Barber, Appointment, Client, Service } from "@prisma/client"

type CommissionWithRelations = Commission & {
  barber: Barber
  appointment: Appointment & {
    client: Client | null
    service: Service | null
  }
}

interface CommissionsListProps {
  initialCommissions: CommissionWithRelations[]
}

export function CommissionsList({ initialCommissions }: CommissionsListProps) {
  const [commissions, setCommissions] = useState(initialCommissions)
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "PAID">("PENDING")
  const [loading, setLoading] = useState<string | null>(null)

  const filteredCommissions = useMemo(() => {
    return commissions.filter((c) => (filter === "ALL" ? true : c.status === filter))
  }, [commissions, filter])

  const totalPending = useMemo(() => {
    return commissions
      .filter((c) => c.status === "PENDING")
      .reduce((sum, c) => sum + parseFloat(c.amount.toString()), 0)
  }, [commissions])

  const handlePay = async (id: string) => {
    setLoading(id)

    try {
      const res = await fetch(`/api/commissions/${id}/pay`, { method: "POST" })
      if (!res.ok) return
      setCommissions(commissions.map((c) => (c.id === id ? { ...c, status: "PAID" as const } : c)))
    } catch (error) {
      console.error("Error paying commission:", error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-8">
      <div className="card bg-accent/10 border-accent/20">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-foreground-muted text-sm">Total pendiente de pago</p>
            <p className="text-4xl font-bold text-accent">${totalPending.toFixed(2)}</p>
          </div>
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-accent/15 flex items-center justify-center">
            <span className="text-3xl" aria-hidden="true">
              💸
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        {(["PENDING", "PAID", "ALL"] as const).map((status) => {
          const active = filter === status
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={active ? "btn-primary w-full sm:w-auto" : "btn-secondary w-full sm:w-auto"}
            >
              {status === "PENDING" ? "Pendientes" : status === "PAID" ? "Pagadas" : "Todas"}
            </button>
          )
        })}
      </div>

      {filteredCommissions.length === 0 ? (
        <div className="card">
          <p className="text-foreground-muted text-center py-10">
            No hay comisiones{" "}
            {filter === "PENDING" ? "pendientes" : filter === "PAID" ? "pagadas" : "registradas"}.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCommissions.map((commission) => (
            <div key={commission.id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                    <span className="text-xl" aria-hidden="true">
                      🧾
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold truncate">{commission.barber.name}</h3>
                    <p className="text-foreground-muted text-sm">
                      {commission.appointment.service?.name || "Servicio"} <span aria-hidden="true">•</span>{" "}
                      {commission.appointment.client?.name || "Cliente"}
                    </p>
                    <p className="text-foreground-muted text-xs">
                      {new Date(commission.createdAt).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="sm:text-right">
                    <p className="text-2xl font-bold text-accent">${commission.amount.toString()}</p>
                    <span
                      className={[
                        "badge w-fit",
                        commission.status === "PENDING" ? "bg-warning/15 text-warning" : "bg-success/15 text-success",
                      ].join(" ")}
                    >
                      {commission.status === "PENDING" ? "Pendiente" : "Pagada"}
                    </span>
                  </div>

                  {commission.status === "PENDING" && (
                    <button
                      onClick={() => handlePay(commission.id)}
                      disabled={loading === commission.id}
                      className="btn-primary w-full sm:w-auto"
                    >
                      {loading === commission.id ? "Procesando..." : "Pagar"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

