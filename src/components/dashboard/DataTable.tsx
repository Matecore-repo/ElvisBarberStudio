"use client"

import React, { useMemo, useState } from "react"
import { Search, X } from "lucide-react"

interface Column<T> {
  key: keyof T
  label: string
  width?: string
  render?: (value: T[keyof T], item: T) => React.ReactNode
  align?: "left" | "center" | "right"
  sortable?: boolean
  searchable?: boolean
}

interface Filter {
  key: string
  label: string
  options: { value: string; label: string }[]
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyState?: {
    icon?: React.ReactNode
    title: string
    description?: string
    action?: {
      label: string
      onClick: () => void
    }
  }
  onRowClick?: (item: T) => void
  striped?: boolean
  filters?: Filter[]
  searchPlaceholder?: string
  onFilterChange?: (filters: Record<string, string>) => void
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  loading,
  emptyState,
  onRowClick,
  striped = true,
  filters = [],
  searchPlaceholder = "Buscar...",
  onFilterChange,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [sortKey, setSortKey] = useState<keyof T | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  const filteredData = useMemo(() => {
    let result = [...data]

    // Búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      result = result.filter((item) =>
        columns.some((col) => {
          if (!col.searchable) return false
          const value = item[col.key]
          return String(value).toLowerCase().includes(searchLower)
        })
      )
    }

    // Filtros
    Object.entries(activeFilters).forEach(([filterKey, filterValue]) => {
      if (!filterValue) return
      result = result.filter((item) => {
        const itemValue = String(item[filterKey as keyof T])
        return itemValue === filterValue
      })
    })

    // Ordenamiento
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey]
        const bVal = b[sortKey]
        const comparison = String(aVal).localeCompare(String(bVal))
        return sortDir === "asc" ? comparison : -comparison
      })
    }

    return result
  }, [data, searchTerm, activeFilters, sortKey, sortDir, columns])

  const handleFilterChange = (filterKey: string, value: string) => {
    const newFilters = { ...activeFilters, [filterKey]: value }
    setActiveFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return
    if (sortKey === column.key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortKey(column.key)
      setSortDir("asc")
    }
  }

  if (loading) {
    return (
      <div className="w-full space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-card/40 border border-border rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  const hasActiveFilters = Object.values(activeFilters).some((v) => v)

  return (
    <div className="w-full space-y-4">
      {/* Controles de búsqueda y filtros */}
      <div className="space-y-3">
        {/* Búsqueda */}
        {columns.some((c) => c.searchable) && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="input pl-10 w-full"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-card/60 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Filtros */}
        {filters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <select
                key={filter.key}
                value={activeFilters[filter.key] || ""}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className="input text-sm"
              >
                <option value="">{filter.label}</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ))}

            {hasActiveFilters && (
              <button
                onClick={() => {
                  setActiveFilters({})
                  onFilterChange?.({})
                }}
                className="btn-secondary text-sm"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tabla */}
      {filteredData.length === 0 ? (
        <div className="w-full p-8 sm:p-12 text-center border border-border rounded-xl bg-card/20">
          {emptyState?.icon && <div className="flex justify-center mb-4 text-4xl">{emptyState.icon}</div>}
          <h3 className="font-semibold text-white mb-2">{emptyState?.title || "Sin datos"}</h3>
          {emptyState?.description && (
            <p className="text-foreground-muted text-sm mb-4">{emptyState.description}</p>
          )}
          {emptyState?.action && (
            <button onClick={emptyState.action.onClick} className="btn-primary mt-4">
              {emptyState.action.label}
            </button>
          )}
        </div>
      ) : (
        <div className="w-full border border-border rounded-xl overflow-hidden bg-card/20">
          {/* Desktop table view */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-card/40">
                  {columns.map((column) => (
                    <th
                      key={String(column.key)}
                      className={`px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-foreground-muted ${
                        alignClass[column.align || "left"]
                      } ${column.sortable ? "cursor-pointer hover:bg-card/60" : ""}`}
                      style={{ width: column.width }}
                      onClick={() => handleSort(column)}
                    >
                      <div className="flex items-center gap-2">
                        {column.label}
                        {column.sortable && (
                          <span className="text-xs opacity-50">
                            {sortKey === column.key
                              ? sortDir === "asc"
                                ? "↑"
                                : "↓"
                              : "↕"}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    className={`border-b border-border transition-colors hover:bg-card/60 ${
                      striped && idx % 2 === 0 ? "bg-background/30" : ""
                    } ${onRowClick ? "cursor-pointer" : ""}`}
                    onClick={() => onRowClick?.(item)}
                  >
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={`px-4 sm:px-6 py-4 text-sm text-foreground ${
                          alignClass[column.align || "left"]
                        }`}
                      >
                        {column.render ? column.render(item[column.key], item) : String(item[column.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card view */}
          <div className="sm:hidden space-y-3 p-4">
            {filteredData.map((item, idx) => (
              <div
                key={item.id || idx}
                className={`p-4 border border-border rounded-lg bg-card/40 transition-colors hover:bg-card/60 ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <div key={String(column.key)} className="flex justify-between items-start mb-2 last:mb-0 gap-2">
                    <span className="text-xs font-medium text-foreground-muted uppercase tracking-wider flex-shrink-0">
                      {column.label}
                    </span>
                    <span className="text-sm font-medium text-white text-right break-words">
                      {column.render ? column.render(item[column.key], item) : String(item[column.key])}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
