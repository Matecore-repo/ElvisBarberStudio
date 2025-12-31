"use client"

import { useState } from "react"
import { Barber } from "@prisma/client"

interface BarbersListProps {
  initialBarbers: Barber[]
}

export function BarbersList({ initialBarbers }: BarbersListProps) {
  const [barbers, setBarbers] = useState(initialBarbers)
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

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className={showForm ? "btn-secondary" : "btn-primary"}>
          {showForm ? "Cancelar" : "Nuevo peluquero"}
        </button>
      </div>

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

      {barbers.length === 0 ? (
        <div className="card">
          <p className="text-foreground-muted text-center py-10">No hay peluqueros registrados aún.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {barbers.map((barber) => (
            <div key={barber.id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                    <span className="text-xl" aria-hidden="true">
                      🧔
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold truncate">{barber.name}</h3>
                    <p className="text-foreground-muted text-sm">
                      Comisión:{" "}
                      {barber.commissionType === "PERCENT" ? `${barber.commissionValue}%` : `$${barber.commissionValue}`}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <span
                    className={[
                      "badge w-fit",
                      barber.active ? "bg-success/15 text-success" : "bg-error/15 text-error",
                    ].join(" ")}
                  >
                    {barber.active ? "Activo" : "Inactivo"}
                  </span>
                  <button
                    onClick={() => toggleActive(barber.id, barber.active)}
                    className="btn-secondary w-full sm:w-auto"
                  >
                    {barber.active ? "Desactivar" : "Activar"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

