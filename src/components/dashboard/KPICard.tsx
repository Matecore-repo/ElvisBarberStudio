"use client"

import { TrendingUp, TrendingDown } from "lucide-react"

interface KPICardProps {
  label: string
  value: string | number
  sublabel?: string
  trend?: {
    value: number
    direction: "up" | "down"
    period?: string
  }
  variant?: "default" | "accent" | "success" | "warning"
  sparkData?: number[]
  icon?: React.ReactNode
  tooltip?: string
}

export function KPICard({
  label,
  value,
  sublabel,
  trend,
  variant = "default",
  sparkData,
  icon,
  tooltip,
}: KPICardProps) {
  const variantClasses = {
    default: {
      bg: "bg-neutral-900/40",
      border: "border-neutral-800",
      accent: "text-gray-200",
      label: "text-gray-500",
      hoverBorder: "hover:border-neutral-700",
    },
    accent: {
      bg: "bg-yellow-600/5",
      border: "border-yellow-600/20",
      accent: "text-yellow-500",
      label: "text-gray-500",
      hoverBorder: "hover:border-yellow-600/40",
    },
    success: {
      bg: "bg-green-500/5",
      border: "border-green-500/20",
      accent: "text-green-400",
      label: "text-gray-500",
      hoverBorder: "hover:border-green-500/40",
    },
    warning: {
      bg: "bg-yellow-500/5",
      border: "border-yellow-500/20",
      accent: "text-yellow-400",
      label: "text-gray-500",
      hoverBorder: "hover:border-yellow-500/40",
    },
  }

  const styles = variantClasses[variant]

  return (
    <div
      className={`p-6 border rounded-xl ${styles.bg} ${styles.border} ${styles.hoverBorder} transition-all cursor-pointer group min-h-[160px] flex flex-col`}
      title={tooltip}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${styles.label} mb-1`}>{label}</p>
          <p className={`text-3xl font-semibold font-mono ${styles.accent}`}>{value}</p>
        </div>
        {icon && <div className={`flex-shrink-0 opacity-40 group-hover:opacity-60 transition-opacity ${styles.accent}`}>{icon}</div>}
      </div>

      <div className="flex items-end justify-between gap-4 mt-3">
        <div className="flex-1">
          {sublabel && <p className="text-xs text-foreground-muted mb-1">{sublabel}</p>}

          {trend && (
            <div className="flex items-center gap-1">
              {trend.direction === "up" ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              <span className={`text-xs font-medium ${trend.direction === "up" ? "text-green-500" : "text-red-500"}`}>
                {trend.direction === "up" ? "+" : "-"}
                {Math.abs(trend.value)}% {trend.period || "vs mes anterior"}
              </span>
            </div>
          )}
        </div>

        {/* Mini sparkline */}
        {sparkData && sparkData.length > 0 && (
          <div className="flex items-end gap-0.5 h-12 opacity-50">
            {sparkData.map((value, idx) => {
              const maxValue = Math.max(...sparkData)
              const height = maxValue > 0 ? (value / maxValue) * 100 : 0
              return (
                <div
                  key={idx}
                  className={`flex-1 rounded-t ${styles.accent}`}
                  style={{
                    height: `${Math.max(height, 10)}%`,
                    opacity: 0.6 + idx / sparkData.length * 0.4,
                  }}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
