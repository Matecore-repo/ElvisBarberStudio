"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, MapPin, Phone } from "lucide-react"
import { useData, type Salon } from "@/contexts/DataContext"

export function SalonsList() {
  const { salons, refreshData } = useData()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<Omit<Salon, "id">>({
    name: "",
    address: "",
    phone: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const endpoint = editingId ? `/api/salons/${editingId}` : "/api/salons"
      const method = editingId ? "PUT" : "POST"

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phone: formData.phone || null,
        }),
      })

      if (!res.ok) {
        throw new Error("Error al guardar la sucursal")
      }

      await refreshData()
      setFormData({ name: "", address: "", phone: "" })
      setEditingId(null)
      setShowForm(false)
    } catch (err) {
      console.error("Error saving salon:", err)
      setError("No se pudo guardar la sucursal. Intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (salon: Salon) => {
    setEditingId(salon.id)
    setFormData({
      name: salon.name,
      address: salon.address || "",
      phone: salon.phone || "",
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta sucursal?")) return

    try {
      const res = await fetch(`/api/salons/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Error al eliminar")
      await refreshData()
    } catch (err) {
      console.error("Error deleting salon:", err)
      setError("No se pudo eliminar la sucursal")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => {
            setEditingId(null)
            setFormData({ name: "", address: "", phone: "" })
            setShowForm(!showForm)
          }}
          className="btn-primary flex items-center gap-2 shadow-lg shadow-accent/10"
        >
          <Plus className="w-4 h-4" />
          Nueva Sucursal
        </button>
      </div>

      {error && (
        <div role="alert" className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
          {error}
        </div>
      )}

      {showForm && (
        <div className="card-premium animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4 mb-6">
            <div>
              <h2 className="text-lg font-serif text-white">{editingId ? "Editar" : "Nueva"} Sucursal</h2>
              <p className="text-foreground-muted text-xs tracking-wide uppercase mt-1">Ubicación y contacto</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-foreground-muted mb-2">Nombre de la Sucursal</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input bg-black/20 focus:bg-black/40 w-full"
                  placeholder="Ej: Sucursal Centro"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-foreground-muted mb-2">Dirección</label>
                <input
                  type="text"
                  value={formData.address || ""}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input bg-black/20 focus:bg-black/40 w-full"
                  placeholder="Ej: Av. Rivadavia 2222"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-foreground-muted mb-2">Teléfono (Opcional)</label>
                <input
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input bg-black/20 focus:bg-black/40 w-full"
                  placeholder="Ej: +541132975792"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary text-xs uppercase tracking-wider"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary text-xs uppercase tracking-wider"
                disabled={loading}
              >
                {loading ? "Guardando..." : (editingId ? "Actualizar" : "Crear")}
              </button>
            </div>
          </form>
        </div>
      )}

      {salons.length === 0 ? (
        <div className="p-12 text-center border border-border rounded-xl bg-card/20 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Sin sucursales</h3>
          <p className="text-foreground-muted mb-6 max-w-sm">No has configurado ninguna sucursal todavía.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {salons.map((salon, index) => (
            <div key={salon.id} className="card-premium group hover:border-accent/30 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded bg-accent/10 text-accent font-bold text-sm">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(salon)}
                    className="p-1.5 hover:bg-white/10 rounded text-foreground-muted hover:text-white transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(salon.id)}
                    className="p-1.5 hover:bg-red-500/10 rounded text-foreground-muted hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{salon.name}</h3>
              <div className="space-y-2 mt-4">
                <div className="flex items-start gap-2 text-sm text-foreground-muted">
                  <MapPin className="w-4 h-4 mt-0.5 text-accent/60" />
                  <span>{salon.address}</span>
                </div>
                {salon.phone && (
                  <div className="flex items-center gap-2 text-sm text-foreground-muted">
                    <Phone className="w-4 h-4 text-accent/60" />
                    <span>{salon.phone}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
