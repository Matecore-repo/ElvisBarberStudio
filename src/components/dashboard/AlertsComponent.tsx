"use client"

import { AlertCircle } from "lucide-react"

interface Alert {
  id: string
  severity: "critical" | "warning" | "info"
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
  icon?: React.ReactNode
}

interface AlertsComponentProps {
  alerts: Alert[]
}

export function AlertsComponent({ alerts }: AlertsComponentProps) {
  if (alerts.length === 0) {
    return null
  }

  const severityConfig = {
    critical: {
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      icon: "text-red-500",
      dot: "bg-red-500",
    },
    warning: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      icon: "text-yellow-500",
      dot: "bg-yellow-500",
    },
    info: {
      bg: "bg-blue-500/5 border-blue-500/10",
      border: "border-blue-500/20",
      icon: "text-blue-400",
      dot: "bg-blue-400",
    },
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-serif font-medium">Necesita Atención</h2>
        </div>
        <span className="text-sm text-foreground-muted px-2 py-1 rounded bg-card/40">
          {alerts.length} {alerts.length === 1 ? "alerta" : "alertas"}
        </span>
      </div>

      <div className="grid gap-3">
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity]
          return (
            <div
              key={alert.id}
              className={`p-4 border rounded-lg ${config.bg} ${config.border} flex gap-4 items-start backdrop-blur-sm hover:border-opacity-60 transition-all`}
            >
              <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${config.dot}`} />

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-white mb-1">{alert.title}</h3>
                <p className="text-xs text-foreground-muted">{alert.description}</p>

                {alert.action && (
                  <a
                    href={alert.action.href}
                    className="inline-block text-xs font-medium text-accent hover:text-accent/80 mt-2"
                  >
                    {alert.action.label} →
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
