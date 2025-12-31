"use client"

import { useState } from "react"
import { Barber } from "@prisma/client"
import { Plus } from "lucide-react"
import { DataTable } from "@/components/dashboard/DataTable"

interface BarberSerialized extends Omit<Barber, 'commissionValue'> {
  commissionValue: number
}

interface BarbersListProps {
  initialBarbers: BarberSerialized[]
}

export function BarbersList({ initialBarbers }: BarbersListProps) {
  const [barbers, setBarbers] = useState<BarberSerialized[]>(initialBarbers)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    commissionType: "PERCENT" as "PERCENT" | "FIXED",
    commissionValue: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    setLoading(true)

    try {
      const res = await fetch("/api/barbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          commissionType: formData.commissionType,
          commissionValue: parseFloat(formData.commissionValue) || 0,
        }),
      })

      if (!res.ok) {
        setFormError("No se pudo guardar. Probá de nuevo.")
        return
      }

      const newBarber = await res.json()
      setBarbers([newBarber, ...barbers])
      setFormData({ name: "", commissionType: "PERCENT", commissionValue: "" })
      setShowForm(false)
    } catch (error) {
      console.error("Error creating barber:", error)
      setFormError("Ocurrió un error inesperado.")
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (id: string, active: boolean) => {
    try {
      const res = await fetch(`/api/barbers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      })

      if (!res.ok) return
      setBarbers(barbers.map((barber) => (barber.id === id ? { ...barber, active: !active } : barber)))
    } catch (error) {
      console.error("Error updating barber:", error)
    }
  }

  const filters = [
    {
      key: "active",
      label: "Estado",
      options: [
        { value: "true", label: "Activo" },
        { value: "false", label: "Inactivo" },
      ],
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Peluqueros</h1>
          <p className="text-foreground-muted mt-1">Gestiona tu equipo de peluqueros</p>
        </div>
        <button
          onClick={() => {
            setFormError("")
            setFormData({ name: "", commissionType: "PERCENT", commissionValue: "" })
            setShowForm(!showForm)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo peluquero
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Nuevo peluquero</h2>
              <p className="text-foreground-muted text-sm mt-1">Cargá el nombre y la comisión.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="space-y-2">
              <label htmlFor="barber-name" className="block text-sm font-medium">
                Nombre
              </label>
              <input
                id="barber-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                placeholder="Ej. Juan Pérez"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="commission-type" className="block text-sm font-medium">
                  Tipo de comisión
                </label>
                <select
                  id="commission-type"
                  value={formData.commissionType}
                  onChange={(e) =>
                    setFormData({ ...formData, commissionType: e.target.value as "PERCENT" | "FIXED" })
                  }
                  className="input"
                >
                  <option value="PERCENT">Porcentaje (%)</option>
                  <option value="FIXED">Monto fijo ($)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="commission-value" className="block text-sm font-medium">
                  Valor {formData.commissionType === "PERCENT" ? "(%)" : "($)"}
                </label>
                <input
                  id="commission-value"
                  type="number"
                  step="0.01"
                  value={formData.commissionValue}
                  onChange={(e) => setFormData({ ...formData, commissionValue: e.target.value })}
                  className="input"
                  placeholder={formData.commissionType === "PERCENT" ? "Ej. 40" : "Ej. 3500"}
                  required
                />
              </div>
            </div>

            {formError && (
              <div role="alert" className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg text-sm">
                {formError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button type="button" className="btn-secondary w-full sm:w-auto" onClick={() => setShowForm(false)}>
                Cerrar
              </button>
              <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <DataTable
        columns={[
          {
            key: "name" as any,
            label: "Nombre",
            searchable: true,
            sortable: true,
          },
          {
            key: "commissionType" as any,
            label: "Tipo de Comisión",
            align: "center",
            render: (value) => (value === "PERCENT" ? "Porcentaje %" : "Monto fijo $"),
          },
          {
            key: "commissionValue" as any,
            label: "Comisión",
            align: "center",
            render: (value, barber: BarberSerialized) =>
              barber.commissionType === "PERCENT" ? `${value}%` : `$${parseFloat(String(value)).toFixed(2)}`,
          },
          {
            key: "active" as any,
            label: "Estado",
            align: "center",
            render: (value) => (
              <span className={`badge ${value ? "bg-success/15 text-success" : "bg-error/15 text-error"}`}>
                {value ? "Activo" : "Inactivo"}
              </span>
            ),
          },
          {
            key: "id" as any,
            label: "Acciones",
            align: "center",
            render: (_, barber: BarberSerialized) => (
              <button
                onClick={() => toggleActive(barber.id, barber.active)}
                className="btn-secondary text-xs py-1 px-3"
              >
                {barber.active ? "Desactivar" : "Activar"}
              </button>
            ),
          },
        ]}
        data={barbers}
        filters={filters}
        searchPlaceholder="Buscar peluquero..."
        emptyState={{
          icon: "💇",
          title: "Sin peluqueros",
          description: "No hay peluqueros registrados aún.",
        }}
      />
    </div>
  )
}
