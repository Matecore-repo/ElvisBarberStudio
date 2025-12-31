"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { useData, type Salon } from "@/contexts/DataContext"

export function SalonsList() {
  const { salons, updateSalons } = useData()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Salon, "id">>({
    name: "",
    address: "",
    phone: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingId) {
      // Update
      updateSalons(salons.map(s => s.id === editingId ? { ...s, ...formData, phone: formData.phone || null } : s))
      setEditingId(null)
    } else {
      // Create
      updateSalons([...salons, { ...formData, id: Date.now().toString(), phone: formData.phone || null }])
    }
    
    setFormData({ name: "", address: "", phone: "" })
    setShowForm(false)
  }

  const handleEdit = (salon: Salon) => {
    setEditingId(salon.id)
    setFormData({
      name: salon.name,
      address: salon.address,
      phone: salon.phone || "",
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    updateSalons(salons.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Salones/Sucursales</h1>
          <p className="text-foreground-muted mt-1">Gestiona ubicaciones y contactos</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null)
            setFormData({ name: "", address: "", phone: "" })
            setShowForm(!showForm)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Sucursal
        </button>
      </div>

      {showForm && (
        <div className="p-6 border border-border rounded-xl bg-card/40">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre de la Sucursal</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input w-full"
                placeholder="Ej: Sucursal Centro"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Dirección</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="input w-full"
                placeholder="Ej: Av. Rivadavia 2222"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Teléfono (Opcional)</label>
              <input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input w-full"
                placeholder="Ej: +541132975792"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                {editingId ? "Actualizar" : "Crear"} Sucursal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {salons.map(salon => (
          <div key={salon.id} className="p-6 border border-border rounded-xl bg-card/40 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 mb-4">
                <span className="text-accent font-bold text-sm">{salons.indexOf(salon) + 1}</span>
              </div>
              <p className="text-foreground-muted text-xs uppercase tracking-widest font-medium mb-2">{salon.name}</p>
              <p className="text-white font-semibold text-sm mb-2">{salon.address}</p>
              {salon.phone && (
                <p className="text-accent text-sm font-medium">{salon.phone}</p>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(salon)}
                className="flex-1 p-2 hover:bg-card/60 rounded transition-colors text-sm"
              >
                <Edit2 className="w-4 h-4 inline mr-1" /> Editar
              </button>
              <button
                onClick={() => handleDelete(salon.id)}
                className="flex-1 p-2 hover:bg-red-500/10 text-red-500 rounded transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4 inline mr-1" /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
