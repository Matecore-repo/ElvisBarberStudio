"use client"

import { useState } from "react"
import { Badge } from "@/components/dashboard/Badge"
import { User, Plus, Search, Calendar, Edit2, X } from "lucide-react"

// Mock data - en producción vendría de la BD
const mockClients = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "+54 11 2345-6789",
    visits: 12,
    lastVisit: "2024-12-28",
    status: "active",
    totalSpent: "$840",
  },
  {
    id: 2,
    name: "Carlos García",
    email: "carlos@example.com",
    phone: "+54 11 3456-7890",
    visits: 8,
    lastVisit: "2024-12-20",
    status: "active",
    totalSpent: "$560",
  },
  {
    id: 3,
    name: "Miguel López",
    email: "miguel@example.com",
    phone: "+54 11 4567-8901",
    visits: 3,
    lastVisit: "2024-11-15",
    status: "inactive",
    totalSpent: "$210",
  },
]

export default function ClientsPage() {
  const [selectedClient, setSelectedClient] = useState<(typeof mockClients)[0] | null>(null)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl font-serif font-medium">Clientes</h1>
          <p className="text-foreground-muted">Vista 360° de tu base de clientes</p>
        </div>
        <button className="btn-primary w-full sm:w-auto">
          <Plus className="w-5 h-5" />
          Nuevo cliente
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 relative">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Buscar por nombre o teléfono..."
            className="input pl-10 w-full"
          />
        </div>
        <select className="input min-w-[200px]">
          <option>Todos los estados</option>
          <option>Activos</option>
          <option>Inactivos</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Table */}
        <div className="lg:col-span-2">
          <div className="w-full border border-border rounded-xl overflow-hidden bg-card/20">
            {/* Desktop table view */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-card/40">
                    <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-foreground-muted text-left">
                      Cliente
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-foreground-muted text-center">
                      Visitas
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-foreground-muted text-left">
                      Última Visita
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-foreground-muted text-center">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockClients.map((client, idx) => (
                    <tr
                      key={client.id}
                      className={`border-b border-border transition-colors hover:bg-card/60 cursor-pointer ${
                        idx % 2 === 0 ? "bg-background/30" : ""
                      }`}
                      onClick={() => setSelectedClient(client)}
                    >
                      <td className="px-4 sm:px-6 py-4 text-sm text-foreground">
                        <div className="flex flex-col">
                          <span className="font-medium text-white">{client.name}</span>
                          <span className="text-xs text-foreground-muted">{client.phone}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-center">
                        <div className="font-medium text-accent">{client.visits}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-foreground">
                        {new Date(client.lastVisit).toLocaleDateString("es-AR")}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-center">
                        <Badge
                          label={client.status === "active" ? "Activo" : "Inactivo"}
                          variant={client.status === "active" ? "success" : "default"}
                          size="sm"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="sm:hidden space-y-3 p-4">
              {mockClients.map((client) => (
                <div
                  key={client.id}
                  className="p-4 border border-border rounded-lg bg-card/40 transition-colors hover:bg-card/60 cursor-pointer"
                  onClick={() => setSelectedClient(client)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
                      Cliente
                    </span>
                    <span className="text-sm font-medium text-white">{client.name}</span>
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
                      Visitas
                    </span>
                    <span className="text-sm font-medium text-white">{client.visits}</span>
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
                      Ult. Visita
                    </span>
                    <span className="text-sm font-medium text-white">
                      {new Date(client.lastVisit).toLocaleDateString("es-AR")}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
                      Estado
                    </span>
                    <Badge
                      label={client.status === "active" ? "Activo" : "Inactivo"}
                      variant={client.status === "active" ? "success" : "default"}
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Details Panel (360°) */}
        {selectedClient ? (
          <div className="lg:col-span-1">
            <div className="border border-border rounded-xl bg-card/40 p-6 sticky top-24 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedClient.name}</h3>
                  <p className="text-sm text-foreground-muted mt-1">{selectedClient.email}</p>
                </div>
                <Badge
                  label={selectedClient.status === "active" ? "Activo" : "Inactivo"}
                  variant={selectedClient.status === "active" ? "success" : "default"}
                  size="sm"
                />
              </div>

              {/* Contact Info */}
              <div className="space-y-3 pb-4 border-b border-border">
                <div>
                  <p className="text-xs uppercase tracking-wider text-foreground-muted font-medium mb-1">
                    Teléfono
                  </p>
                  <p className="text-sm text-white font-medium">{selectedClient.phone}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-foreground-muted font-medium mb-1">
                    Email
                  </p>
                  <p className="text-sm text-white font-medium">{selectedClient.email}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border">
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">{selectedClient.visits}</p>
                  <p className="text-xs text-foreground-muted mt-1">Visitas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">{selectedClient.totalSpent}</p>
                  <p className="text-xs text-foreground-muted mt-1">Gastado</p>
                </div>
              </div>

              {/* History */}
              <div>
                <p className="text-xs uppercase tracking-wider text-foreground-muted font-medium mb-3">
                  Última visita
                </p>
                <p className="text-sm text-white">
                  {new Date(selectedClient.lastVisit).toLocaleDateString("es-AR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
                <button className="btn-primary text-sm py-2">
                  <Calendar className="w-4 h-4" />
                  Agendar
                </button>
                <button className="btn-secondary text-sm py-2">
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
              </div>

              <button
                onClick={() => setSelectedClient(null)}
                className="w-full btn-ghost text-sm py-2 flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-1">
            <div className="border border-border rounded-xl bg-card/20 p-8 text-center sticky top-24">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-accent" />
                </div>
              </div>
              <h3 className="font-medium text-white mb-2">Selecciona un cliente</h3>
              <p className="text-sm text-foreground-muted">
                Haz clic en cualquier cliente para ver su perfil 360° completo con historial de visitas,
                interacciones y más.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
