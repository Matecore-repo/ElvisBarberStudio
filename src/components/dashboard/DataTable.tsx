"use client"

import React from "react"

interface Column<T> {
  key: keyof T
  label: string
  width?: string
  render?: (value: T[keyof T], item: T) => React.ReactNode
  align?: "left" | "center" | "right"
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
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  loading,
  emptyState,
  onRowClick,
  striped = true,
}: DataTableProps<T>) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
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

  if (data.length === 0) {
    return (
      <div className="w-full p-8 sm:p-12 text-center border border-border rounded-xl bg-card/20">
        {emptyState?.icon && <div className="flex justify-center mb-4 text-4xl">{emptyState.icon}</div>}
        <h3 className="font-semibold text-white mb-2">{emptyState?.title || "Sin datos"}</h3>
        {emptyState?.description && (
          <p className="text-foreground-muted text-sm mb-4">{emptyState.description}</p>
        )}
        {emptyState?.action && (
          <button
            onClick={emptyState.action.onClick}
            className="btn-primary mt-4"
          >
            {emptyState.action.label}
          </button>
        )}
      </div>
    )
  }

  return (
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
                  }`}
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
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
        {data.map((item, idx) => (
          <div
            key={item.id || idx}
            className={`p-4 border border-border rounded-lg bg-card/40 transition-colors hover:bg-card/60 ${
              onRowClick ? "cursor-pointer" : ""
            }`}
            onClick={() => onRowClick?.(item)}
          >
            {columns.map((column) => (
              <div key={String(column.key)} className="flex justify-between items-start mb-2 last:mb-0">
                <span className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
                  {column.label}
                </span>
                <span className="text-sm font-medium text-white text-right">
                  {column.render ? column.render(item[column.key], item) : String(item[column.key])}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
