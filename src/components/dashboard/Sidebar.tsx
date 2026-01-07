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
    href: "/app/cash",
    label: "Caja",
    icon: <DollarSign className="w-5 h-5" />,
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
        "fixed left-0 top-0 h-screen w-64 bg-black border-r border-neutral-800 flex flex-col z-50 transition-transform duration-300 shadow-2xl",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Menú principal"
    >
      {/* Logo Header */}
      <div className="h-20 flex items-center px-6 border-b border-neutral-800 bg-black">
        <Link href="/app" className="group flex items-center gap-3 w-full" onClick={onNavigate}>
          <div className="w-8 h-8 rounded-lg bg-yellow-600/20 border border-yellow-600/50 flex items-center justify-center group-hover:bg-yellow-600/30 transition-all">
            <span className="text-yellow-500 font-bold text-lg">E</span>
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-sm font-bold text-white group-hover:text-yellow-500 transition-colors">Elvis</span>
            <span className="text-[10px] text-gray-500">Barber Studio</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <div className="px-3 mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-600">Menu</div>
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (onNavigate) onNavigate()
              }}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative ${isActive
                ? "text-white bg-neutral-900 border border-neutral-700"
                : "text-gray-400 hover:text-white hover:bg-neutral-900/50"
                }`}
            >
              {/* Indicador dorado cuando activo */}
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-yellow-500 rounded-r transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-0"}`} />
              <span className={`transition-colors duration-200 ${isActive ? "text-yellow-500" : "group-hover:text-yellow-500"}`}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-950">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg border border-neutral-700 bg-neutral-900 hover:border-yellow-600/50 transition-all group cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-yellow-600/20 flex items-center justify-center flex-shrink-0 border border-yellow-600/50">
            <span className="text-yellow-500 font-bold text-sm">
              {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-white truncate group-hover:text-yellow-500 transition-colors">{user.name || "Usuario"}</p>
            <p className="text-[10px] text-gray-500 truncate uppercase tracking-wider">{user.role || "Staff"}</p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-neutral-700 hover:border-red-600/30 uppercase tracking-wider"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Cerrar sesión</span>
        </button>
      </div>

      {showClose && (
        <button
          type="button"
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors md:hidden"
          onClick={onClose}
          aria-label="Cerrar menú"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </aside>
  )
}
