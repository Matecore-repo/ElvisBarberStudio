"use client"

import { useState } from "react"
import { Calendar, Clock, DollarSign } from "lucide-react"
import { Badge } from "./Badge"

interface Appointment {
  id: string
  client: {
    name: string
    phone?: string | null
  } | null
  barber: {
    name: string
  } | null
  service: {
    name: string
    price: number | string
    durationMinutes: number
  } | null
  status: string
  scheduledStart: Date
  completedAt?: Date | null
  totalAmount?: number | string
}

interface RecentActivityProps {
  appointments: Appointment[]
}

type FilterType = "today" | "tomorrow" | "week"

export function RecentActivity({ appointments }: RecentActivityProps) {
  const [filter, setFilter] = useState<FilterType>("today")

  const filterAppointments = (data: Appointment[]) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    return data.filter((apt) => {
      const aptDate = new Date(apt.scheduledStart)
      const aptDay = new Date(aptDate.getFullYear(), aptDate.getMonth(), aptDate.getDate())

      switch (filter) {
        case "today":
          return aptDay.getTime() === today.getTime()
        case "tomorrow":
          return aptDay.getTime() === tomorrow.getTime()
        case "week":
          return aptDay >= today && aptDay < weekEnd
        default:
          return true
      }
    })
  }

  const filtered = filterAppointments(appointments).sort((a, b) => new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime())

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-white">Actividad Reciente</h2>
          <p className="text-sm text-gray-500">Últimas citas agendadas</p>
        </div>

        <div className="flex gap-2">
          {(["today", "tomorrow", "week"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                filter === f ? "bg-yellow-600 text-black hover:bg-yellow-500" : "bg-neutral-800 text-gray-400 hover:bg-neutral-700"
              }`}
            >
              {f === "today" ? "Hoy" : f === "tomorrow" ? "Mañana" : "Esta semana"}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/40">
        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Peluquero
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Servicio
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Duración
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Monto
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((apt, idx) => (
                  <tr key={apt.id} className={`border-b border-neutral-800 ${idx % 2 === 0 ? "bg-black/20" : ""} hover:bg-neutral-800/50 transition-colors`}>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white text-sm">{apt.client?.name || "Cliente"}</p>
                        <p className="text-xs text-foreground-muted">{apt.client?.phone || "Sin teléfono"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{apt.barber?.name || "Sin asignar"}</td>
                    <td className="px-6 py-4 text-sm">{apt.service?.name || "Servicio"}</td>
                    <td className="px-6 py-4 text-center text-sm">{apt.service?.durationMinutes || 0}m</td>
                    <td className="px-6 py-4 text-right text-sm font-mono font-medium text-yellow-500">${parseFloat(String(apt.service?.price || 0)).toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge
                        label={apt.status === "SCHEDULED" ? "Pendiente" : apt.status === "COMPLETED" ? "Completado" : "Cancelado"}
                        variant={apt.status === "SCHEDULED" ? "accent" : apt.status === "COMPLETED" ? "success" : "warning"}
                        size="sm"
                      />
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-500">
                      {new Date(apt.scheduledStart).toLocaleDateString("es-AR", { month: "2-digit", day: "2-digit" })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No hay citas en este período
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden space-y-3 p-4">
          {filtered.length > 0 ? (
            filtered.map((apt) => (
              <div key={apt.id} className="p-4 border border-neutral-800 rounded-lg bg-neutral-900/50 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-500">Cliente</p>
                    <p className="text-sm font-medium text-white">{apt.client?.name || "Cliente"}</p>
                  </div>
                  <Badge
                    label={apt.status === "SCHEDULED" ? "Pendiente" : apt.status === "COMPLETED" ? "Completado" : "Cancelado"}
                    variant={apt.status === "SCHEDULED" ? "accent" : apt.status === "COMPLETED" ? "success" : "warning"}
                    size="sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-500">Peluquero</p>
                    <p className="text-sm text-white">{apt.barber?.name || "Sin asignar"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-500">Servicio</p>
                    <p className="text-sm text-white">{apt.service?.name || "Servicio"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-400">{apt.service?.durationMinutes || 0}m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-yellow-500" />
                    <span className="font-mono text-yellow-500">${parseFloat(String(apt.service?.price || 0)).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-500">{new Date(apt.scheduledStart).toLocaleDateString("es-AR", { month: "short", day: "numeric" })}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No hay citas en este período</div>
          )}
        </div>
      </div>
    </section>
  )
}
