"use client"

import { useEffect, useMemo, useState } from "react"
import { Appointment, Client, Service, Barber } from "@prisma/client"

type AppointmentWithRelations = Appointment & {
  client: Client | null
  service: Service | null
  barber: Barber | null
}

interface AppointmentsListProps {
  initialAppointments: AppointmentWithRelations[]
  barbers: Barber[]
}

export function AppointmentsList({ initialAppointments, barbers }: AppointmentsListProps) {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithRelations | null>(null)
  const [selectedBarberId, setSelectedBarberId] = useState("")
  const [totalAmount, setTotalAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const selectedServiceName = selectedAppointment?.service?.name || "Servicio"
  const selectedClientName = selectedAppointment?.client?.name || "Cliente"

  const barberOptions = useMemo(() => {
    return [{ id: "", name: "Seleccionar peluquero" }, ...barbers.map((b) => ({ id: b.id, name: b.name }))]
  }, [barbers])

  const closeModal = () => {
    setShowCompleteModal(false)
    setSelectedAppointment(null)
    setSelectedBarberId("")
    setTotalAmount("")
    setError("")
  }

  useEffect(() => {
    if (!showCompleteModal) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCompleteModal])

  useEffect(() => {
    if (!showCompleteModal) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [showCompleteModal])

  const handleComplete = (appointment: AppointmentWithRelations) => {
    setSelectedAppointment(appointment)
    setTotalAmount(appointment.service?.price?.toString() || "")
    setSelectedBarberId(appointment.barberId || "")
    setShowCompleteModal(true)
  }

  const submitComplete = async () => {
    if (!selectedAppointment || !selectedBarberId) return
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/appointments/${selectedAppointment.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barberId: selectedBarberId,
          totalAmount: parseFloat(totalAmount) || 0,
        }),
      })

      if (!res.ok) {
        setError("No se pudo completar el turno. Probá de nuevo.")
        return
      }

      setAppointments(
        appointments.map((a) => (a.id === selectedAppointment.id ? { ...a, status: "COMPLETED" as const } : a)),
      )
      closeModal()
    } catch (err) {
      console.error("Error completing appointment:", err)
      setError("Ocurrió un error inesperado.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-info/15 text-info"
      case "COMPLETED":
        return "bg-success/15 text-success"
      case "CANCELED":
        return "bg-error/15 text-error"
      default:
        return "bg-foreground-muted/15 text-foreground-muted"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "Programado"
      case "COMPLETED":
        return "Completado"
      case "CANCELED":
        return "Cancelado"
      default:
        return status
    }
  }

  return (
    <div className="space-y-4">
      {appointments.length === 0 ? (
        <div className="card">
          <p className="text-foreground-muted text-center py-10">No hay turnos registrados aún.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => {
            const dateLabel = new Date(appointment.scheduledStart).toLocaleString("es-AR", {
              weekday: "short",
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })

            return (
              <div key={appointment.id} className="card">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                      <span className="text-xl" aria-hidden="true">
                        👤
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold truncate">{appointment.client?.name || "Cliente sin nombre"}</h3>
                      <p className="text-foreground-muted text-sm">
                        {appointment.service?.name || "Servicio"} <span aria-hidden="true">•</span> {dateLabel}
                      </p>
                      {appointment.barber && (
                        <p className="text-foreground-muted text-sm">Peluquero: {appointment.barber.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <span className={["badge w-fit", getStatusClasses(appointment.status)].join(" ")}>
                      {getStatusLabel(appointment.status)}
                    </span>

                    {appointment.status === "SCHEDULED" && (
                      <button onClick={() => handleComplete(appointment)} className="btn-primary w-full sm:w-auto">
                        Completar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showCompleteModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 p-4 flex items-center justify-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Cerrar"
            onClick={closeModal}
          />

          <div
            className="card relative max-w-md w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="complete-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="complete-title" className="text-xl font-bold">
                  Completar turno
                </h2>
                <p className="text-foreground-muted text-sm mt-1">
                  {selectedServiceName} · {selectedClientName}
                </p>
              </div>
              <button type="button" className="btn-ghost min-h-10 px-3" onClick={closeModal} aria-label="Cerrar">
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="complete-barber" className="block text-sm font-medium">
                  Peluquero que realizó el servicio <span className="text-accent">*</span>
                </label>
                <select
                  id="complete-barber"
                  value={selectedBarberId}
                  onChange={(e) => setSelectedBarberId(e.target.value)}
                  className="input"
                  required
                >
                  {barberOptions.map((b) => (
                    <option key={b.id} value={b.id} disabled={b.id === ""}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="complete-total" className="block text-sm font-medium">
                  Monto total ($)
                </label>
                <input
                  id="complete-total"
                  type="number"
                  step="0.01"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="input"
                />
              </div>

              {error && (
                <div role="alert" className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={submitComplete}
                  disabled={loading || !selectedBarberId}
                  className="btn-primary flex-1"
                >
                  {loading ? "Procesando..." : "Confirmar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

