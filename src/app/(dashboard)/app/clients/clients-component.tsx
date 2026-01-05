"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { DataTable } from "@/components/dashboard/DataTable"
import { Client } from "@prisma/client"

interface ClientsComponentProps {
  initialClients: Client[]
}

export default function ClientsComponent({ initialClients }: ClientsComponentProps) {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formError, setFormError] = useState("")
  const [formLoading, setFormLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.phone.trim()) return

    setFormLoading(true)
    setFormError("")

    try {
      if (editingId) {
        const res = await fetch(`/api/clients/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            notes: formData.notes || null,
          }),
        })

        if (!res.ok) throw new Error("Error al actualizar")
        const updated = await res.json()
        setClients(clients.map((c) => (c.id === editingId ? updated : c)))
        setEditingId(null)
      } else {
        const res = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            notes: formData.notes || null,
          }),
        })

        if (!res.ok) throw new Error("Error al crear")
        const newClient = await res.json()
        setClients([newClient, ...clients])
      }

      setFormData({ name: "", phone: "", notes: "" })
      setShowForm(false)
    } catch (err) {
      console.error("Error:", err)
      setFormError("Error al guardar cliente")
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (client: Client) => {
    setEditingId(client.id)
    setFormData({
      name: client.name,
      phone: client.phone || "",
      notes: client.notes || "",
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro?")) return

    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Error al eliminar")
      setClients(clients.filter((c) => c.id !== id))
    } catch (err) {
      console.error("Error:", err)
      setFormError("Error al eliminar cliente")
    }
  }

  const filters: { key: string; label: string; options: { value: string; label: string }[] }[] = []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-foreground-muted mt-1">Gestiona tu base de clientes</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null)
            setFormData({ name: "", phone: "", notes: "" })
            setFormError("")
            setShowForm(!showForm)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo cliente
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="p-6 border border-border rounded-xl bg-card/40">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre completo</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input w-full"
                placeholder="Ej. Juan Pérez"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input w-full"
                  placeholder="Ej. +54 11 1234-5678"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Notas</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input w-full"
                  placeholder="Notas adicionales"
                />
              </div>
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
                  setFormData({ name: "", phone: "", notes: "" })
                  setFormError("")
                }}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button type="submit" disabled={formLoading} className="btn-primary">
                {formLoading ? "Guardando..." : editingId ? "Actualizar" : "Crear"} Cliente
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <DataTable
        columns={[
          {
            key: "name",
            label: "Nombre",
            searchable: true,
            sortable: true,
          },
          {
            key: "phone",
            label: "Teléfono",
            searchable: true,
            sortable: true,
          },
          {
            key: "notes",
            label: "Notas",
            searchable: true,
            render: (value) => (value ? String(value).substring(0, 50) : "-"),
          },
          {
            key: "createdAt",
            label: "Fecha de registro",
            sortable: true,
            render: (value) =>
              value ? new Date(value as string | Date).toLocaleDateString("es-AR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }) : "-",
          },
          {
            key: "id",
            label: "Acciones",
            align: "center",
            render: (_, client: Client) => (
              <div className="flex gap-1 justify-center">
                <button
                  onClick={() => handleEdit(client)}
                  className="p-1 hover:bg-card/60 rounded transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="p-1 hover:bg-red-500/10 text-red-500 rounded transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ),
          },
        ]}
        data={clients}
        filters={filters}
        searchPlaceholder="Buscar por nombre o teléfono..."
        emptyState={{
          icon: "👥",
          title: "Sin clientes",
          description: "No hay clientes registrados aún.",
        }}
      />
    </div>
  )
}
