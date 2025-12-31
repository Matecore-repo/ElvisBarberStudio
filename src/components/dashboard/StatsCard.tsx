"use client"

import React from "react"

interface StatsCardProps {
  label: string
  value: string | number
  sublabel?: string
  trend?: {
    value: number
    direction: "up" | "down"
  }
  variant?: "default" | "accent" | "success" | "warning"
  onClick?: () => void
}

const variantStyles = {
  default: "border-border/50 bg-card/20 hover:border-foreground-muted/30 hover:bg-card/30",
  accent:
    "border-accent/20 bg-accent/5 hover:border-accent/40 hover:bg-accent/10",
  success:
    "border-success/20 bg-success/5 hover:border-success/40 hover:bg-success/10",
  warning:
    "border-warning/20 bg-warning/5 hover:border-warning/40 hover:bg-warning/10",
}

export function StatsCard({
  label,
  value,
  sublabel,
  trend,
  variant = "default",
  onClick,
}: StatsCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-5 sm:p-6 border rounded-xl transition-all duration-200 group text-left ${
        variantStyles[variant]
      } ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm uppercase tracking-wider text-foreground-muted font-semibold mb-2 sm:mb-3">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-white mb-1 leading-tight">
            {value}
          </p>
          {sublabel && (
            <p className="text-xs sm:text-sm text-foreground-muted">{sublabel}</p>
          )}
        </div>
      </div>

      {/* Trend Indicator */}
      {trend && (
        <div className="mt-3 sm:mt-4 flex items-center gap-1.5">
          <span
            className={`text-xs sm:text-sm font-semibold ${
              trend.direction === "up" ? "text-success" : "text-warning"
            }`}
          >
            {trend.direction === "up" ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-foreground-muted">vs mes anterior</span>
        </div>
      )}
    </button>
  )
}
