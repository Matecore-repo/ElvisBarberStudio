"use client"

import { useEffect, useState } from "react"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { DataTable } from "@/components/dashboard/DataTable"

interface ServiceCategory {
  id: string
  name: string
  salonId: string
  createdAt: string
  updatedAt: string
}

interface Service {
  id: string
  name: string
  categoryId: string | null
  price: number | string
  durationMinutes: number
  salonId: string
  createdAt: string
  updatedAt: string
  category?: ServiceCategory | null
}

export function ServicesList({ salonId }: { salonId: string }) {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null)
  const [formError, setFormError] = useState("")

  const [serviceForm, setServiceForm] = useState({
    name: "",
    categoryId: "",
    price: "",
    durationMinutes: "30",
  })

  const [categoryForm, setCategoryForm] = useState({
    name: "",
  })

  // Cargar datos
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [servicesRes, categoriesRes] = await Promise.all([
        fetch("/api/services"),
        fetch("/api/service-categories"),
      ])

      if (!servicesRes.ok || !categoriesRes.ok) {
        throw new Error("Error al cargar datos")
      }

      const servicesData = await servicesRes.json()
      const categoriesData = await categoriesRes.json()

      setServices(servicesData.data || [])
      setCategories(categoriesData.data || [])
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("No se pudieron cargar los datos")
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryForm.name.trim()) return

    setFormError("")

    try {
      if (editingCategory) {
        const res = await fetch(`/api/service-categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: categoryForm.name }),
        })

        if (!res.ok) throw new Error("Error al actualizar")
        const updated = await res.json()
        setCategories(
          categories.map((c) => (c.id === editingCategory.id ? updated : c))
        )
        setEditingCategory(null)
      } else {
        const res = await fetch("/api/service-categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: categoryForm.name, salonId }),
        })

        if (!res.ok) throw new Error("Error al crear")
        const newCat = await res.json()
        setCategories([newCat, ...categories])
      }

      setCategoryForm({ name: "" })
      setShowCategoryForm(false)
    } catch (err) {
      console.error("Error:", err)
      setFormError("Error al guardar categoría")
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/service-categories/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Error al eliminar")
      setCategories(categories.filter((c) => c.id !== id))
      setServices(
        services.map((s) => (s.categoryId === id ? { ...s, categoryId: null } : s))
      )
    } catch (err) {
      console.error("Error:", err)
      setFormError("Error al eliminar categoría")
    }
  }

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!serviceForm.name.trim() || !serviceForm.price) return

    setFormError("")

    try {
      if (editingService) {
        const res = await fetch(`/api/services/${editingService.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: serviceForm.name,
            categoryId: serviceForm.categoryId || null,
            price: parseFloat(serviceForm.price),
            durationMinutes: parseInt(serviceForm.durationMinutes),
          }),
        })

        if (!res.ok) throw new Error("Error al actualizar")
        const updated = await res.json()
        setServices(services.map((s) => (s.id === editingService.id ? updated : s)))
        setEditingService(null)
      } else {
        const res = await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: serviceForm.name,
            categoryId: serviceForm.categoryId || null,
            price: parseFloat(serviceForm.price),
            durationMinutes: parseInt(serviceForm.durationMinutes),
          }),
        })

        if (!res.ok) throw new Error("Error al crear")
        const newService = await res.json()
        setServices([newService, ...services])
      }

      setServiceForm({ name: "", categoryId: "", price: "", durationMinutes: "30" })
      setShowServiceForm(false)
    } catch (err) {
      console.error("Error:", err)
      setFormError("Error al guardar servicio")
    }
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setServiceForm({
      name: service.name,
      categoryId: service.categoryId || "",
      price: String(service.price),
      durationMinutes: service.durationMinutes.toString(),
    })
    setShowServiceForm(true)
  }

  const handleDeleteService = async (id: string) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Error al eliminar")
      setServices(services.filter((s) => s.id !== id))
    } catch (err) {
      console.error("Error:", err)
      setFormError("Error al eliminar servicio")
    }
  }

  const groupedServices = categories.reduce(
    (acc, cat) => {
      acc[cat.id] = services.filter((s) => s.categoryId === cat.id)
      return acc
    },
    {} as Record<string, Service[]>
  )

  const uncategorizedServices = services.filter((s) => !s.categoryId)

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
          <h1 className="text-3xl font-bold">Servicios</h1>
          <p className="text-foreground-muted mt-1">Gestiona servicios y categorías</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              setEditingCategory(null)
              setCategoryForm({ name: "" })
              setFormError("")
              setShowCategoryForm(!showCategoryForm)
            }}
            className="btn-secondary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Categoría
          </button>
          <button
            onClick={() => {
              setEditingService(null)
              setServiceForm({ name: "", categoryId: "", price: "", durationMinutes: "30" })
              setFormError("")
              setShowServiceForm(!showServiceForm)
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Servicio
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Category Form */}
      {showCategoryForm && (
        <div className="p-6 border border-border rounded-xl bg-card/40">
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre de la Categoría</label>
              <input
                type="text"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                className="input w-full"
                placeholder="Ej. Cortes, Barba, Coloración"
                required
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
                  setShowCategoryForm(false)
                  setEditingCategory(null)
                  setCategoryForm({ name: "" })
                  setFormError("")
                }}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                {editingCategory ? "Actualizar" : "Crear"} Categoría
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Service Form */}
      {showServiceForm && (
        <div className="p-6 border border-border rounded-xl bg-card/40">
          <form onSubmit={handleAddService} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre del Servicio</label>
              <input
                type="text"
                value={serviceForm.name}
                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                className="input w-full"
                placeholder="Ej. Corte de cabello"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Categoría</label>
                <select
                  value={serviceForm.categoryId}
                  onChange={(e) => setServiceForm({ ...serviceForm, categoryId: e.target.value })}
                  className="input w-full"
                >
                  <option value="">Sin categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Duración (minutos)</label>
                <input
                  type="number"
                  min="15"
                  step="15"
                  value={serviceForm.durationMinutes}
                  onChange={(e) => setServiceForm({ ...serviceForm, durationMinutes: e.target.value })}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Precio ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={serviceForm.price}
                  onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                  className="input w-full"
                  required
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
                  setShowServiceForm(false)
                  setEditingService(null)
                  setServiceForm({ name: "", categoryId: "", price: "", durationMinutes: "30" })
                  setFormError("")
                }}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                {editingService ? "Actualizar" : "Crear"} Servicio
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Management */}
      {categories.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Categorías</h2>
          <div className="grid gap-2">
            {categories.map((category) => {
              const categoryServices = groupedServices[category.id] || []
              return (
                <div
                  key={category.id}
                  className="p-4 border border-border rounded-lg bg-card/40 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-medium text-white">{category.name}</h3>
                    <p className="text-sm text-foreground-muted">{categoryServices.length} servicios</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingCategory(category)
                        setCategoryForm({ name: category.name })
                        setShowCategoryForm(true)
                      }}
                      className="p-2 hover:bg-card/60 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 hover:bg-red-500/10 text-red-500 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Services Table by Category */}
      {services.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Servicios por Categoría</h2>

          {/* Uncategorized services */}
          {uncategorizedServices.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-accent">Sin categoría</h3>
              <DataTable
                columns={[
                  {
                    key: "name" as const,
                    label: "Nombre",
                    searchable: true,
                    sortable: true,
                  },
                  {
                    key: "durationMinutes" as const,
                    label: "Duración",
                    align: "center",
                    render: (value) => `${value} min`,
                  },
                  {
                    key: "price" as const,
                    label: "Precio",
                    align: "right",
                    render: (value) => `$${parseFloat(String(value)).toFixed(2)}`,
                  },
                  {
                    key: "id" as const,
                    label: "Acciones",
                    align: "center",
                    render: (_, service: Service) => (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEditService(service)}
                          className="p-1 hover:bg-card/60 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="p-1 hover:bg-red-500/10 text-red-500 rounded transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ),
                  },
                ]}
                data={uncategorizedServices}
              />
            </div>
          )}

          {/* Categorized services */}
          {categories.map((category) => {
            const categoryServices = groupedServices[category.id] || []
            if (categoryServices.length === 0) return null

            return (
              <div key={category.id} className="space-y-3">
                <h3 className="text-lg font-semibold text-accent">{category.name}</h3>
                <DataTable
                  columns={[
                    {
                      key: "name" as const,
                      label: "Nombre",
                      searchable: true,
                      sortable: true,
                    },
                    {
                      key: "durationMinutes" as const,
                      label: "Duración",
                      align: "center",
                      render: (value) => `${value} min`,
                    },
                    {
                      key: "price" as const,
                      label: "Precio",
                      align: "right",
                      render: (value) => `$${parseFloat(String(value)).toFixed(2)}`,
                    },
                    {
                      key: "id" as const,
                      label: "Acciones",
                      align: "center",
                      render: (_, service: Service) => (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEditService(service)}
                            className="p-1 hover:bg-card/60 rounded transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="p-1 hover:bg-red-500/10 text-red-500 rounded transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ),
                    },
                  ]}
                  data={categoryServices}
                />
              </div>
            )
          })}
        </div>
      )}

      {/* Empty state */}
      {services.length === 0 && (
        <div className="p-12 text-center border border-border rounded-xl bg-card/20">
          <p className="text-foreground-muted mb-4">No hay servicios registrados aún.</p>
          <button
            onClick={() => {
              setEditingService(null)
              setServiceForm({ name: "", categoryId: "", price: "", durationMinutes: "30" })
              setFormError("")
              setShowServiceForm(true)
            }}
            className="btn-primary"
          >
            Crear primer servicio
          </button>
        </div>
      )}
    </div>
  )
}
