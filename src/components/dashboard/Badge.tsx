"use client"

import React from "react"

interface BadgeProps {
  label: string
  variant?: "default" | "success" | "warning" | "error" | "info" | "accent"
  size?: "sm" | "md"
  icon?: React.ReactNode
  onRemove?: () => void
}

const variantStyles = {
  default: "bg-foreground-muted/10 text-foreground border-foreground-muted/20",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  error: "bg-error/10 text-error border-error/20",
  info: "bg-info/10 text-info border-info/20",
  accent: "bg-accent/10 text-accent border-accent/20",
}

const sizeStyles = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
}

export function Badge({
  label,
  variant = "default",
  size = "md",
  icon,
  onRemove,
}: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border font-medium transition-all ${
        variantStyles[variant]
      } ${sizeStyles[size]} ${onRemove ? "pr-1.5" : ""}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
          aria-label={`Remover ${label}`}
        >
          ✕
        </button>
      )}
    </div>
  )
}
