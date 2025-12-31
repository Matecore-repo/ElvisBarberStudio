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
    <div className="space-y-6">
      {/* Actions Toolbar */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            setFormError("")
            setFormData({ name: "", commissionType: "PERCENT", commissionValue: "" })
            setShowForm(!showForm)
          }}
          className="btn-primary flex items-center gap-2 shadow-lg shadow-accent/10"
        >
          <Plus className="w-4 h-4" />
          Nuevo profesional
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card-premium animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4 mb-6">
            <div>
              <h2 className="text-lg font-serif text-white">Nuevo profesional</h2>
              <p className="text-foreground-muted text-xs tracking-wide uppercase mt-1">Información básica y comisiones</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="barber-name" className="block text-xs font-medium uppercase tracking-wider text-foreground-muted">
                  Nombre Completo
                </label>
                <input
                  id="barber-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input bg-black/20 focus:bg-black/40 transition-colors"
                  placeholder="Ej. Juan Pérez"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="commission-type" className="block text-xs font-medium uppercase tracking-wider text-foreground-muted">
                    Tipo
                  </label>
                  <select
                    id="commission-type"
                    value={formData.commissionType}
                    onChange={(e) =>
                      setFormData({ ...formData, commissionType: e.target.value as "PERCENT" | "FIXED" })
                    }
                    className="input bg-black/20 focus:bg-black/40"
                  >
                    <option value="PERCENT">Porcentaje (%)</option>
                    <option value="FIXED">Fijo ($)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="commission-value" className="block text-xs font-medium uppercase tracking-wider text-foreground-muted">
                    Valor
                  </label>
                  <input
                    id="commission-value"
                    type="number"
                    step="0.01"
                    value={formData.commissionValue}
                    onChange={(e) => setFormData({ ...formData, commissionValue: e.target.value })}
                    className="input bg-black/20 focus:bg-black/40"
                    placeholder="0"
                    required
                  />
                </div>
              </div>
            </div>

            {formError && (
              <div role="alert" className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                {formError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end border-t border-border pt-4">
              <button type="button" className="btn-secondary w-full sm:w-auto text-xs uppercase tracking-wider" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
              <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto text-xs uppercase tracking-wider">
                {loading ? "Guardando..." : "Guardar Profesional"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table Card */}
      <div className="card-premium">
        <DataTable
          columns={[
            {
              key: "name" as keyof BarberSerialized,
              label: "Profesional",
              searchable: true,
              sortable: true,
              render: (value: string | number | boolean | Date) => <span className="font-medium text-white">{String(value)}</span>
            },
            {
              key: "commissionType" as keyof BarberSerialized,
              label: "Modalidad",
              align: "center",
              render: (value: string | number | boolean | Date) => (
                <span className="text-xs text-foreground-muted uppercase tracking-wider">
                  {value === "PERCENT" ? "Porcentaje" : "Fijo"}
                </span>
              ),
            },
            {
              key: "commissionValue" as keyof BarberSerialized,
              label: "Valor",
              align: "right",
              render: (value: string | number | boolean | Date, barber: BarberSerialized) => (
                <span className="font-mono text-accent">
                  {barber.commissionType === "PERCENT" ? `${value}%` : `$${parseFloat(String(value)).toFixed(2)}`}
                </span>
              ),
            },
            {
              key: "active" as keyof BarberSerialized,
              label: "Estado",
              align: "center",
              render: (value: string | number | boolean | Date) => (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium border ${value
                  ? "bg-accent/10 text-accent border-accent/20"
                  : "bg-white/5 text-foreground-muted border-white/10"
                  }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${value ? "bg-accent" : "bg-foreground-muted"}`}></span>
                  {value ? "Activo" : "Inactivo"}
                </span>
              ),
            },
            {
              key: "id" as keyof BarberSerialized,
              label: "Acciones",
              align: "right",
              render: (_, barber: BarberSerialized) => (
                <div className="flex justify-end">
                  <button
                    onClick={() => toggleActive(barber.id, barber.active)}
                    className={`text-xs px-3 py-1.5 rounded transition-colors border ${barber.active
                      ? "border-red-500/20 text-red-400 hover:bg-red-500/10"
                      : "border-accent/20 text-accent hover:bg-accent/10"
                      }`}
                  >
                    {barber.active ? "Desactivar" : "Activar"}
                  </button>
                </div>
              ),
            },
          ]}
          data={barbers}
          filters={filters}
          searchPlaceholder="Buscar por nombre..."
          emptyState={{
            icon: "✂️",
            title: "Equipo vacío",
            description: "Comienza agregando profesionales a tu equipo.",
          }}
        />
      </div>
    </div>
  )
}
