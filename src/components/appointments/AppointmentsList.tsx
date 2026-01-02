"use client"

import { useEffect, useMemo, useState } from "react"
import { Appointment, Client, Service, Barber } from "@prisma/client"
import { X } from "lucide-react"
import { DataTable } from "@/components/dashboard/DataTable"

interface ServiceSerialized extends Omit<Service, 'price'> {
  price: number
}

interface AppointmentSerialized extends Omit<Appointment, 'totalAmount'> {
  totalAmount: number | null
}

type AppointmentWithRelations = AppointmentSerialized & {
  client: Client | null
  service: ServiceSerialized | null
  barber: Barber | null
}

interface BarberSerialized extends Omit<Barber, 'commissionValue'> {
  commissionValue: number
}

interface AppointmentsListProps {
  initialAppointments: AppointmentWithRelations[]
  barbers: BarberSerialized[]
}

type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "CANCELED"

export function AppointmentsList({ initialAppointments, barbers }: AppointmentsListProps) {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithRelations | null>(null)
  const [selectedBarberId, setSelectedBarberId] = useState("")
  const [totalAmount, setTotalAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const barberOptions = useMemo(() => {
    return barbers.map((b) => ({ value: b.id, label: b.name }))
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

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filters = [
    {
      key: "status",
      label: "Estado",
      options: [
        { value: "SCHEDULED", label: "Programado" },
        { value: "COMPLETED", label: "Completado" },
        { value: "CANCELED", label: "Cancelado" },
      ],
    },
    {
      key: "barberId",
      label: "Peluquero",
      options: barberOptions,
    },
  ]

  return (
    <div className="space-y-8">
      <DataTable
        columns={[
          {
            key: "client" as any,
            label: "Cliente",
            searchable: true,
            sortable: true,
            render: (_, apt: AppointmentWithRelations) => apt.client?.name || "Sin cliente",
          },
          {
            key: "service" as any,
            label: "Servicio",
            searchable: true,
            sortable: true,
            render: (_, apt: AppointmentWithRelations) => apt.service?.name || "Sin servicio",
          },
          {
            key: "barber" as any,
            label: "Peluquero",
            searchable: true,
            sortable: true,
            render: (_, apt: AppointmentWithRelations) => apt.barber?.name || "Sin asignar",
          },
          {
            key: "scheduledStart" as any,
            label: "Fecha",
            sortable: true,
            render: (value: any) => value ? formatDate(value) : '-',
          },
          {
            key: "scheduledStart" as any,
            label: "Hora",
            align: "center",
            render: (value: any) => value ? formatTime(value) : '-',
          },
          {
            key: "status" as any,
            label: "Estado",
            align: "center",
            render: (value) => (
              <span
                className={`badge ${value === "SCHEDULED"
                  ? "bg-info/15 text-info"
                  : value === "COMPLETED"
                    ? "bg-success/15 text-success"
                    : "bg-error/15 text-error"
                  }`}
              >
                {getStatusLabel(String(value))}
              </span>
            ),
          },
          {
            key: "id" as any,
            label: "Acción",
            align: "center",
            render: (_, apt: AppointmentWithRelations) =>
              apt.status === "SCHEDULED" && (
                <button
                  onClick={() => handleComplete(apt)}
                  className="btn-primary text-xs py-1 px-3"
                >
                  Completar
                </button>
              ),
          },
        ]}
        data={appointments}
        filters={filters}
        searchPlaceholder="Buscar cliente, servicio..."
        emptyState={{
          icon: "📅",
          title: "Sin turnos",
          description: "No hay turnos registrados aún.",
        }}
      />

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
                  {selectedAppointment.service?.name || "Servicio"} · {selectedAppointment.client?.name || "Cliente"}
                </p>
              </div>
              <button type="button" className="btn-ghost p-2 rounded-lg" onClick={closeModal} aria-label="Cerrar">
                <X className="w-5 h-5" />
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
                  <option value="">Seleccionar peluquero</option>
                  {barbers.map((b) => (
                    <option key={b.id} value={b.id}>
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
