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
        "fixed left-0 top-0 h-screen w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col z-50 transition-transform duration-300 shadow-2xl",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Menú principal"
    >
      {/* Search/Logo Header */}
      <div className="h-20 flex items-center px-6 border-b border-white/10 bg-gradient-to-r from-background to-transparent">
        <Link href="/app" className="group flex items-center gap-3" onClick={onNavigate}>
          <div className="w-8 h-8 rounded bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
            <span className="text-accent font-serif font-bold text-lg">E</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-widest uppercase text-white group-hover:text-accent transition-colors">Elvis</span>
            <span className="text-[10px] text-foreground-muted tracking-[0.2em] uppercase">Studio CRM</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-foreground-muted/50">Menu Principal</div>
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                if (onNavigate) onNavigate()
              }}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 relative overflow-hidden ${isActive
                  ? "text-white bg-white/5 border border-white/5 shadow-sm"
                  : "text-foreground-muted hover:text-white hover:bg-white/5"
                }`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-accent transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`} />
              <span className={`transition-colors duration-200 ${isActive ? "text-accent" : "group-hover:text-accent"}`}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg border border-white/5 bg-white/5 hover:border-accent/20 transition-colors group cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center flex-shrink-0 border border-accent/10 shadow-inner">
            <span className="text-accent font-serif font-bold text-sm">
              {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-white truncate group-hover:text-accent transition-colors">{user.name || "Usuario"}</p>
            <p className="text-[10px] text-foreground-muted truncate uppercase tracking-wider">{user.role || "Staff"}</p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-foreground-muted hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20 uppercase tracking-wider"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Cerrar sesión</span>
        </button>
      </div>

      {showClose && (
        <button
          type="button"
          className="absolute top-4 right-4 p-2 text-foreground-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors md:hidden"
          onClick={onClose}
          aria-label="Cerrar menú"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </aside>
  )
}
