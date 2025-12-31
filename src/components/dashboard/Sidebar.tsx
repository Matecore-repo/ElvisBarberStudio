"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Scissors, 
  DollarSign, 
  Store, 
  Settings,
  LogOut,
  X,
  Shirt
} from "lucide-react"

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
  {
    href: "/app",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    href: "/app/clients",
    label: "Clientes",
    icon: <Users className="w-5 h-5" />,
  },
  {
    href: "/app/appointments",
    label: "Turnos",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    href: "/app/barbers",
    label: "Peluqueros",
    icon: <Scissors className="w-5 h-5" />,
  },
  {
    href: "/app/commissions",
    label: "Comisiones",
    icon: <DollarSign className="w-5 h-5" />,
  },
  {
    href: "/app/servicios",
    label: "Servicios",
    icon: <Shirt className="w-5 h-5" />,
  },
  {
    href: "/app/salons",
    label: "Salones",
    icon: <Store className="w-5 h-5" />,
  },
  {
    href: "/app/settings",
    label: "Configuración",
    icon: <Settings className="w-5 h-5" />,
  },
]

export function Sidebar({ user, className, showClose, onClose, onNavigate }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={[
        "fixed left-0 top-0 h-screen w-64 bg-sidebar/95 backdrop-blur-md border-r border-border flex flex-col",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Menú principal"
    >
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/app" className="text-sm font-bold tracking-wider uppercase" onClick={onNavigate}>
          <span className="text-accent">Elvis</span> CRM
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                if (onNavigate) onNavigate()
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar ${
                isActive
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "text-foreground-muted hover:bg-card/40 hover:text-foreground"
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-border space-y-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-background/40 border border-border">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
            <span className="text-accent font-bold text-sm">
              {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{user.name || "Usuario"}</p>
            <p className="text-xs text-foreground-muted truncate">{user.role || "Staff"}</p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-foreground-muted hover:bg-card/40 hover:text-foreground transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Cerrar sesión
        </button>
      </div>

      {showClose && (
        <button
          type="button"
          className="absolute top-4 right-4 p-2 hover:bg-card/40 rounded-lg transition-colors"
          onClick={onClose}
          aria-label="Cerrar menú"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </aside>
  )
}
