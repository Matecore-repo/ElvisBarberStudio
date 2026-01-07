"use client"

import { useEffect, useState } from "react"
import { Plus, Edit2, Trash2, Scissors } from "lucide-react"
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
}

type ServiceKey = keyof Service

interface ExtendedService extends Service {
  salonId: string
  createdAt: string
  updatedAt: string
  category?: ServiceCategory | null
}

export function ServicesList({ salonId }: { salonId: string }) {
  const [services, setServices] = useState<ExtendedService[]>([])
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
        <div className="flex gap-4">
          <div className="h-10 w-32 bg-card/40 rounded animate-pulse" />
          <div className="h-10 w-32 bg-card/40 rounded animate-pulse" />
        </div>
        <div className="h-64 bg-card/40 rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Actions Toolbar */}
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button
          onClick={() => {
            setEditingCategory(null)
            setCategoryForm({ name: "" })
            setFormError("")
            setShowCategoryForm(!showCategoryForm)
          }}
          className="btn-secondary flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
        >
          <Plus className="w-3.5 h-3.5" />
          Nueva Categoría
        </button>
        <button
          onClick={() => {
            setEditingService(null)
            setServiceForm({ name: "", categoryId: "", price: "", durationMinutes: "30" })
            setFormError("")
            setShowServiceForm(!showServiceForm)
          }}
          className="btn-primary flex items-center justify-center gap-2 shadow-lg shadow-accent/10 text-xs uppercase tracking-wider"
        >
          <Plus className="w-3.5 h-3.5" />
          Nuevo Servicio
        </button>
      </div>

      {error && (
        <div role="alert" className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
          {error}
        </div>
      )}

      {/* Category Form */}
      {showCategoryForm && (
        <div className="card-premium animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4 mb-6">
            <div>
              <h2 className="text-lg font-serif text-white">{editingCategory ? "Editar" : "Nueva"} Categoría</h2>
              <p className="text-foreground-muted text-xs tracking-wide uppercase mt-1">Agrupa tus servicios</p>
            </div>
          </div>
          <form onSubmit={handleAddCategory} className="space-y-6">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-foreground-muted mb-2">Nombre</label>
              <input
                type="text"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                className="input bg-black/20 focus:bg-black/40"
                placeholder="Ej. Cortes, Barba..."
                required
              />
            </div>
            {formError && (
              <div role="alert" className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg text-sm">
                {formError}
              </div>
            )}
            <div className="flex gap-3 justify-end border-t border-border pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowCategoryForm(false)
                  setEditingCategory(null)
                  setCategoryForm({ name: "" })
                  setFormError("")
                }}
                className="btn-secondary text-xs uppercase tracking-wider"
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary text-xs uppercase tracking-wider">
                {editingCategory ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Service Form */}
      {showServiceForm && (
        <div className="card-premium animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4 mb-6">
            <div>
              <h2 className="text-lg font-serif text-white">{editingService ? "Editar" : "Nuevo"} Servicio</h2>
              <p className="text-foreground-muted text-xs tracking-wide uppercase mt-1">Detalles del servicio</p>
            </div>
          </div>
          <form onSubmit={handleAddService} className="space-y-6">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-foreground-muted mb-2">Nombre del Servicio</label>
              <input
                type="text"
                value={serviceForm.name}
                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                className="input bg-black/20 focus:bg-black/40 w-full"
                placeholder="Ej. Corte Clásico"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-foreground-muted mb-2">Categoría</label>
                <select
                  value={serviceForm.categoryId}
                  onChange={(e) => setServiceForm({ ...serviceForm, categoryId: e.target.value })}
                  className="input bg-black/20 focus:bg-black/40 w-full"
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
                <label className="block text-xs font-medium uppercase tracking-wider text-foreground-muted mb-2">Duración (min)</label>
                <input
                  type="number"
                  min="15"
                  step="15"
                  value={serviceForm.durationMinutes}
                  onChange={(e) => setServiceForm({ ...serviceForm, durationMinutes: e.target.value })}
                  className="input bg-black/20 focus:bg-black/40 w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-foreground-muted mb-2">Precio ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={serviceForm.price}
                  onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                  className="input bg-black/20 focus:bg-black/40 w-full"
                  required
                />
              </div>
            </div>

            {formError && (
              <div role="alert" className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg text-sm">
                {formError}
              </div>
            )}

            <div className="flex gap-3 justify-end border-t border-border pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowServiceForm(false)
                  setEditingService(null)
                  setServiceForm({ name: "", categoryId: "", price: "", durationMinutes: "30" })
                  setFormError("")
                }}
                className="btn-secondary text-xs uppercase tracking-wider"
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary text-xs uppercase tracking-wider">
                {editingService ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Management */}
      {categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const categoryServices = groupedServices[category.id] || []
            return (
              <div key={category.id} className="group p-4 border border-border rounded-lg bg-card/40 flex items-center justify-between hover:border-accent/30 transition-colors">
                <div>
                  <h3 className="font-medium text-white text-sm">{category.name}</h3>
                  <p className="text-xs text-foreground-muted mt-0.5">{categoryServices.length} servicios</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingCategory(category)
                      setCategoryForm({ name: category.name })
                      setShowCategoryForm(true)
                    }}
                    className="p-1.5 hover:bg-white/10 rounded text-foreground-muted hover:text-white transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-1.5 hover:bg-red-500/10 rounded text-foreground-muted hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Services Table by Category */}
      {services.length > 0 && (
        <div className="space-y-8">
          {/* Uncategorized services */}
          {uncategorizedServices.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-foreground-muted uppercase tracking-widest pl-1">Sin categoría</h3>
              <div className="card-premium">
                <DataTable
                  columns={[
                    {
                      key: "name" as ServiceKey,
                      label: "Nombre",
                      searchable: true,
                      sortable: true,
                      render: (value: unknown) => <span className="font-medium text-white">{String(value)}</span>
                    },
                    {
                      key: "durationMinutes" as ServiceKey,
                      label: "Duración",
                      align: "center",
                      render: (value: unknown) => <span className="text-xs text-foreground-muted">{String(value)} min</span>,
                    },
                    {
                      key: "price" as ServiceKey,
                      label: "Precio",
                      align: "right",
                      render: (value: unknown) => <span className="text-accent font-mono">${parseFloat(String(value)).toFixed(2)}</span>,
                    },
                    {
                      key: "id" as ServiceKey,
                      label: "Acciones",
                      align: "right",
                      render: (_, service: ExtendedService) => (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleEditService(service)}
                            className="p-1.5 hover:bg-white/10 rounded text-foreground-muted hover:text-white transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="p-1.5 hover:bg-red-500/10 text-foreground-muted hover:text-red-400 rounded transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ),
                    },
                  ]}
                  data={uncategorizedServices}
                  searchPlaceholder="Buscar servicio..."
                />
              </div>
            </div>
          )}

          {/* Categorized services */}
          {categories.map((category) => {
            const categoryServices = groupedServices[category.id] || []
            if (categoryServices.length === 0) return null

            return (
              <div key={category.id} className="space-y-3">
                <h3 className="text-sm font-bold text-accent uppercase tracking-widest pl-1">{category.name}</h3>
                <div className="card-premium">
                  <DataTable
                    columns={[
                      {
                        key: "name" as ServiceKey,
                        label: "Nombre",
                        searchable: true,
                        sortable: true,
                        render: (value: unknown) => <span className="font-medium text-white">{String(value)}</span>
                      },
                      {
                        key: "durationMinutes" as ServiceKey,
                        label: "Duración",
                        align: "center",
                        render: (value: unknown) => <span className="text-xs text-foreground-muted">{String(value)} min</span>,
                      },
                      {
                        key: "price" as ServiceKey,
                        label: "Precio",
                        align: "right",
                        render: (value: unknown) => <span className="text-accent font-mono">${parseFloat(String(value)).toFixed(2)}</span>,
                      },
                      {
                        key: "id" as ServiceKey,
                        label: "Acciones",
                        align: "right",
                        render: (_, service: Service) => (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleEditService(service)}
                              className="p-1.5 hover:bg-white/10 rounded text-foreground-muted hover:text-white transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteService(service.id)}
                              className="p-1.5 hover:bg-red-500/10 text-foreground-muted hover:text-red-400 rounded transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ),
                      },
                    ]}
                    data={categoryServices}
                    searchPlaceholder={`Buscar en ${category.name}...`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty state */}
      {services.length === 0 && (
        <div className="p-12 text-center border border-border rounded-xl bg-card/20 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <Scissors className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Menú de servicios vacío</h3>
          <p className="text-foreground-muted mb-6 max-w-sm">No has creado ningún servicio todavía. Empieza creando tu primer servicio para que los clientes puedan reservar.</p>
          <button
            onClick={() => {
              setEditingService(null)
              setServiceForm({ name: "", categoryId: "", price: "", durationMinutes: "30" })
              setFormError("")
              setShowServiceForm(true)
            }}
            className="btn-primary uppercase tracking-wider text-xs"
          >
            Crear primer servicio
          </button>
        </div>
      )}
    </div>
  )
}
