"use client"

import { useEffect, useState } from "react"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { DataTable } from "@/components/dashboard/DataTable"

interface Salon {
  id: string
  name: string
  address: string | null
  phone: string | null
  createdAt: string
  updatedAt: string
}

export default function SalonsPage() {
  const [salons, setSalons] = useState<Salon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formError, setFormError] = useState("")
  const [formLoading, setFormLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  })

  useEffect(() => {
    fetchSalons()
  }, [])

  const fetchSalons = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/salons")
      if (!res.ok) throw new Error("Error al cargar")
      const data = await res.json()
      setSalons(data.data || [])
    } catch (err) {
      console.error("Error:", err)
      setError("No se pudieron cargar las peluquerías")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    setFormLoading(true)
    setFormError("")

    try {
      if (editingId) {
        const res = await fetch(`/api/salons/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            address: formData.address || null,
            phone: formData.phone || null,
          }),
        })

        if (!res.ok) throw new Error("Error al actualizar")
        const updated = await res.json()
        setSalons(salons.map((s) => (s.id === editingId ? updated : s)))
        setEditingId(null)
      } else {
        const res = await fetch("/api/salons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            address: formData.address || null,
            phone: formData.phone || null,
          }),
        })

        if (!res.ok) throw new Error("Error al crear")
        const newSalon = await res.json()
        setSalons([newSalon, ...salons])
      }

      setFormData({ name: "", address: "", phone: "" })
      setShowForm(false)
    } catch (err) {
      console.error("Error:", err)
      setFormError("Error al guardar peluquería")
    } finally {
      setFormLoading(false)
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
    if (!window.confirm("¿Estás seguro?")) return

    try {
      const res = await fetch(`/api/salons/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Error al eliminar")
      setSalons(salons.filter((s) => s.id !== id))
    } catch (err) {
      console.error("Error:", err)
      setError("Error al eliminar peluquería")
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-card/40 rounded w-1/3" />
          <div className="h-64 bg-card/40 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Peluquerías</h1>
          <p className="text-foreground-muted mt-1">Gestiona tus sucursales</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null)
            setFormData({ name: "", address: "", phone: "" })
            setFormError("")
            setShowForm(!showForm)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva peluquería
        </button>
      </div>

      {error && (
        <div role="alert" className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="p-6 border border-border rounded-xl bg-card/40">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input w-full"
                placeholder="Ej. Elvis Barber Studio - Centro"
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
                placeholder="Ej. Av. Corrientes 1234, CABA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Teléfono</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input w-full"
                placeholder="Ej. +54 11 1234-5678"
              />
            </div>

            {formError && (
              <div role="alert" className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg text-sm">
                {formError}
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  setFormData({ name: "", address: "", phone: "" })
                  setFormError("")
                }}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button type="submit" disabled={formLoading} className="btn-primary">
                {formLoading ? "Guardando..." : editingId ? "Actualizar" : "Crear"} Peluquería
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
            key: "address" as any,
            label: "Dirección",
            searchable: true,
            sortable: true,
          },
          {
            key: "phone" as any,
            label: "Teléfono",
            searchable: true,
          },
          {
            key: "createdAt" as any,
            label: "Fecha de creación",
            sortable: true,
            render: (value) =>
              value ? new Date(value).toLocaleDateString("es-AR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }) : "-",
          },
          {
            key: "id" as any,
            label: "Acciones",
            align: "center",
            render: (_, salon: Salon) => (
              <div className="flex gap-1 justify-center">
                <button
                  onClick={() => handleEdit(salon)}
                  className="p-1 hover:bg-card/60 rounded transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(salon.id)}
                  className="p-1 hover:bg-red-500/10 text-red-500 rounded transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ),
          },
        ]}
        data={salons}
        searchPlaceholder="Buscar por nombre, dirección o teléfono..."
        emptyState={{
          icon: "🏪",
          title: "Sin peluquerías",
          description: "No hay peluquerías registradas aún.",
        }}
      />
    </div>
  )
}
