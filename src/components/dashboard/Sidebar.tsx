"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  user: {
    name?: string | null
    email?: string | null
    role?: string
  }
  className?: string
  showClose?: boolean
  onClose?: () => void
  onNavigate?: () => void
}

const menuItems = [
  { href: "/app", label: "Dashboard", icon: "📊" },
  { href: "/app/salons", label: "Peluquerías", icon: "🏠" },
  { href: "/app/barbers", label: "Peluqueros", icon: "✂️" },
  { href: "/app/clients", label: "Clientes", icon: "👥" },
  { href: "/app/appointments", label: "Turnos", icon: "📅" },
  { href: "/app/commissions", label: "Comisiones", icon: "💰" },
  { href: "/app/settings", label: "Configuración", icon: "⚙️" },
]

export function Sidebar({ user, className, showClose, onClose, onNavigate }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={[
        "fixed left-0 top-0 h-screen w-64 bg-sidebar/90 backdrop-blur-md border-r border-border flex flex-col",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Menú principal"
    >
      <div className="p-5 border-b border-border flex items-center justify-between gap-4">
        <Link href="/app" className="text-lg font-bold text-gold-gradient" onClick={onNavigate}>
          Elvis Barber Studio
        </Link>

        {showClose && (
          <button
            type="button"
            className="btn-ghost min-h-10 px-3"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              onClick={onNavigate}
              className={[
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
                isActive
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-foreground-muted hover:bg-card hover:text-foreground",
              ].join(" ")}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-background/30 border border-border">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-accent font-bold">
              {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user.name || "Usuario"}</p>
            <p className="text-sm text-foreground-muted truncate">{user.role || "Staff"}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

