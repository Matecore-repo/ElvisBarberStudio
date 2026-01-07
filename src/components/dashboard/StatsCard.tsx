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
  default: "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900/60",
  accent: "border-yellow-600/20 bg-yellow-600/5 hover:border-yellow-600/40 hover:bg-yellow-600/10",
  success: "border-green-500/20 bg-green-500/5 hover:border-green-500/40 hover:bg-green-500/10",
  warning: "border-yellow-500/20 bg-yellow-500/5 hover:border-yellow-500/40 hover:bg-yellow-500/10",
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
          <p className="text-xs sm:text-sm uppercase tracking-wider text-gray-500 font-semibold mb-2 sm:mb-3">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-white mb-1 leading-tight">
            {value}
          </p>
          {sublabel && (
            <p className="text-xs sm:text-sm text-gray-500">{sublabel}</p>
          )}
        </div>
      </div>

      {/* Trend Indicator */}
      {trend && (
        <div className="mt-3 sm:mt-4 flex items-center gap-1.5">
          <span
            className={`text-xs sm:text-sm font-semibold ${
              trend.direction === "up" ? "text-green-400" : "text-red-400"
            }`}
          >
            {trend.direction === "up" ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-gray-500">vs mes anterior</span>
        </div>
      )}
    </button>
  )
}
