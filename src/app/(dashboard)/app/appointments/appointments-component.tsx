"use client"

import { useEffect, useMemo, useState } from "react"
import { Sale, Customer, Staff } from "@prisma/client"
import { Plus, X } from "lucide-react"
import { DataTable } from "@/components/dashboard/DataTable"

// Definir interfaz manual ya que Service no está en el esquema actual
interface Service {
    id: string
    name: string
    price: number
    description?: string
}

interface ServiceSerialized extends Omit<Service, 'price'> {
    price: number
}

interface SaleSerialized extends Omit<Sale, 'totalAmount'> {
    totalAmount: number | null
}

type SaleWithRelations = SaleSerialized & {
    client: Customer | null
    service: ServiceSerialized | null
    barber: Staff | null
}

interface StaffSerialized extends Omit<Staff, 'commissionValue'> {
    commissionValue: number
}

interface SalesComponentProps {
    initialSales: SaleWithRelations[]
    barbers: StaffSerialized[]
    clients: Customer[]
    services: ServiceSerialized[]
}

// Type is used in status values but type inference handles it

export function SalesComponent({ initialSales, barbers, clients, services }: SalesComponentProps) {
    const [appointments, setSales] = useState(initialSales)
    const [showCompleteModal, setShowCompleteModal] = useState(false)
    const [showNewModal, setShowNewModal] = useState(false)
    const [selectedSale, setSelectedSale] = useState<SaleWithRelations | null>(null)
    const [selectedStaffId, setSelectedStaffId] = useState("")
    const [totalAmount, setTotalAmount] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Form state for new appointment
    const [newForm, setNewForm] = useState({
        clientId: "",
        staffId: "",
        serviceId: "",
        date: "",
        time: "",
    })

    const barberOptions = useMemo(() => {
        return barbers.map((b) => ({ value: b.id, label: b.name }))
    }, [barbers])

    const closeModal = () => {
        setShowCompleteModal(false)
        setSelectedSale(null)
        setSelectedStaffId("")
        setTotalAmount("")
        setError("")
    }

    const closeNewModal = () => {
        setShowNewModal(false)
        setNewForm({ clientId: "", staffId: "", serviceId: "", date: "", time: "" })
        setError("")
    }

    useEffect(() => {
        if (!showCompleteModal && !showNewModal) return
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeModal()
                closeNewModal()
                // closeCancelModal if implemented
            }
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [showCompleteModal, showNewModal])

    useEffect(() => {
        if (!showCompleteModal && !showNewModal) return
        const originalOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => {
            document.body.style.overflow = originalOverflow
        }
    }, [showCompleteModal, showNewModal])

    const handleComplete = (appointment: SaleWithRelations) => {
        setSelectedSale(appointment)
        setTotalAmount(appointment.service?.price?.toString() || "")
        setSelectedStaffId(appointment.staffId || "")
        setShowCompleteModal(true)
    }

    const submitComplete = async () => {
        if (!selectedSale || !selectedStaffId) return
        setLoading(true)
        setError("")

        try {
            const res = await fetch(`/api/appointments/${selectedSale.id}/complete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    staffId: selectedStaffId,
                    totalAmount: parseFloat(totalAmount) || 0,
                }),
            })

            if (!res.ok) {
                setError("No se pudo completar el turno. Probá de nuevo.")
                return
            }

            setSales(
                appointments.map((a) => (a.id === selectedSale.id ? { ...a, status: "COMPLETED" as const } : a)),
            )
            closeModal()
        } catch (err) {
            console.error("Error completing appointment:", err)
            setError("Ocurrió un error inesperado.")
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = async (appointment: SaleWithRelations) => {
        if (!confirm('¿Seguro que querés cancelar este turno? (Quedará tachado en la planilla)')) return;

        try {
            const res = await fetch(`/api/appointments/${appointment.id}/cancel`, {
                method: "POST",
            })

            if (!res.ok) {
                alert("No se pudo cancelar el turno")
                return
            }

            setSales(
                appointments.map((a) => (a.id === appointment.id ? { ...a, status: "CANCELED" as const } : a)),
            )
        } catch (err) {
            console.error("Error canceling appointment:", err)
            alert("Error al cancelar")
        }
    }

    const submitNewSale = async () => {
        if (!newForm.clientId || !newForm.staffId || !newForm.date || !newForm.time) {
            setError("Por favor completa todos los campos obligatorios.")
            return
        }
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientId: newForm.clientId,
                    staffId: newForm.staffId,
                    serviceId: newForm.serviceId || null,
                    service: services.find(s => s.id === newForm.serviceId)?.name || "", // Send name
                    date: newForm.date,
                    time: newForm.time,
                }),
            })

            if (!res.ok) {
                const data = await res.json()
                setError(data.error || "No se pudo crear el turno.")
                return
            }

            const newSale = await res.json()

            // Find related data for display
            const client = clients.find(c => c.id === newForm.clientId) || null
            const barber = barbers.find(b => b.id === newForm.staffId) || null
            const service = services.find(s => s.id === newForm.serviceId) || null

            const appointmentWithRelations: SaleWithRelations = {
                ...newSale,
                totalAmount: newSale.totalAmount ? parseFloat(newSale.totalAmount.toString()) : null,
                client,
                barber,
                service: service ? { ...service, price: service.price } : null,
            }

            setSales([appointmentWithRelations, ...appointments])
            closeNewModal()
        } catch (err) {
            console.error("Error creating appointment:", err)
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

    // Get today's date for min date on input
    const today = new Date().toISOString().split('T')[0]

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
            key: "staffId",
            label: "Peluquero",
            options: barberOptions,
        },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Turnos</h1>
                    <p className="text-foreground-muted mt-1">Gestiona las citas de tus clientes</p>
                </div>
                <button
                    onClick={() => {
                        setError("")
                        setShowNewModal(true)
                    }}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo turno
                </button>
            </div>

            <DataTable
                columns={[
                    {

                        key: "client" as keyof SaleWithRelations,
                        label: "Customere",
                        searchable: true,
                        sortable: true,
                        render: (_, apt: SaleWithRelations) => apt.client?.name || "Sin cliente",
                    },
                    {

                        key: "service" as keyof SaleWithRelations,
                        label: "Servicio",
                        searchable: true,
                        sortable: true,
                        render: (_, apt: SaleWithRelations) => apt.service?.name || "Sin servicio",
                    },
                    {

                        key: "barber" as keyof SaleWithRelations,
                        label: "Peluquero",
                        searchable: true,
                        sortable: true,
                        render: (_, apt: SaleWithRelations) => apt.barber?.name || "Sin asignar",
                    },
                    {
                        key: "dateTime",
                        label: "Fecha",
                        sortable: true,
                        render: (value) => value ? formatDate(value as Date | string) : '-',
                    },
                    {
                        key: "dateTime",
                        label: "Hora",
                        align: "center",
                        render: (value) => value ? formatTime(value as Date | string) : '-',
                    },
                    {
                        key: "status",
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
                        key: "id",
                        label: "Acción",
                        align: "center",
                        render: (_, apt: SaleWithRelations) =>
                            (apt.status === "SCHEDULED" || !apt.status) && (
                                <div className="flex gap-2 justify-center">
                                    <button
                                        onClick={() => handleComplete(apt)}
                                        className="btn-primary text-xs py-1 px-3"
                                        title="Completar y cobrar"
                                    >
                                        ✓
                                    </button>
                                    <button
                                        onClick={() => handleCancel(apt)}
                                        className="btn-ghost text-xs py-1 px-3 text-error hover:bg-error/10"
                                        title="Cancelar (Tachar)"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ),
                    },
                ]}
                data={appointments}
                filters={filters}
                searchPlaceholder="Buscar cliente, servicio..."
                emptyState={{
                    icon: "📅",
                    title: "Sin turnos",
                    description: "No hay turnos registrados aún. ¡Crea uno nuevo!",
                }}
            />

            {/* New Sale Modal */}
            {showNewModal && (
                <div className="fixed inset-0 z-50 p-4 flex items-center justify-center">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/60"
                        aria-label="Cerrar"
                        onClick={closeNewModal}
                    />

                    <div
                        className="card relative max-w-md w-full"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="new-title"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 id="new-title" className="text-xl font-bold">
                                    Nuevo turno
                                </h2>
                                <p className="text-foreground-muted text-sm mt-1">
                                    Completa los datos para agendar un turno
                                </p>
                            </div>
                            <button type="button" className="btn-ghost p-2 rounded-lg" onClick={closeNewModal} aria-label="Cerrar">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="new-client" className="block text-sm font-medium">
                                    Customere <span className="text-accent">*</span>
                                </label>
                                <select
                                    id="new-client"
                                    value={newForm.clientId}
                                    onChange={(e) => setNewForm({ ...newForm, clientId: e.target.value })}
                                    className="input"
                                    required
                                >
                                    <option value="">Seleccionar cliente</option>
                                    {clients.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="new-barber" className="block text-sm font-medium">
                                    Peluquero <span className="text-accent">*</span>
                                </label>
                                <select
                                    id="new-barber"
                                    value={newForm.staffId}
                                    onChange={(e) => setNewForm({ ...newForm, staffId: e.target.value })}
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
                                <label htmlFor="new-service" className="block text-sm font-medium">
                                    Servicio
                                </label>
                                <select
                                    id="new-service"
                                    value={newForm.serviceId}
                                    onChange={(e) => setNewForm({ ...newForm, serviceId: e.target.value })}
                                    className="input"
                                >
                                    <option value="">Sin servicio específico</option>
                                    {services.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name} - ${s.price.toLocaleString()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="new-date" className="block text-sm font-medium">
                                        Fecha <span className="text-accent">*</span>
                                    </label>
                                    <input
                                        id="new-date"
                                        type="date"
                                        value={newForm.date}
                                        min={today}
                                        onChange={(e) => setNewForm({ ...newForm, date: e.target.value })}
                                        className="input"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="new-time" className="block text-sm font-medium">
                                        Hora <span className="text-accent">*</span>
                                    </label>
                                    <input
                                        id="new-time"
                                        type="time"
                                        value={newForm.time}
                                        onChange={(e) => setNewForm({ ...newForm, time: e.target.value })}
                                        className="input"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div role="alert" className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button type="button" onClick={closeNewModal} className="btn-secondary flex-1">
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={submitNewSale}
                                    disabled={loading || !newForm.clientId || !newForm.staffId || !newForm.date || !newForm.time}
                                    className="btn-primary flex-1"
                                >
                                    {loading ? "Creando..." : "Crear turno"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Complete Sale Modal */}
            {showCompleteModal && selectedSale && (
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
                                    {selectedSale.service?.name || "Servicio"} · {selectedSale.client?.name || "Customere"}
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
                                    value={selectedStaffId}
                                    onChange={(e) => setSelectedStaffId(e.target.value)}
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
                                    disabled={loading || !selectedStaffId}
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
