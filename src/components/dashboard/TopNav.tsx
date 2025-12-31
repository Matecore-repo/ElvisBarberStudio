"use client"

import { signOut } from "next-auth/react"

interface TopNavProps {
  user: {
    name?: string | null
    email?: string | null
  }
  onOpenMenu?: () => void
}

export function TopNav({ user, onOpenMenu }: TopNavProps) {
  return (
    <header className="fixed top-0 left-0 right-0 md:left-64 h-16 bg-background/85 backdrop-blur-md border-b border-border z-40">
      <div className="h-full container-app flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            className="btn-ghost min-h-10 px-3 md:hidden"
            onClick={onOpenMenu}
            aria-label="Abrir menú"
          >
            ☰
          </button>

          <div className="min-w-0">
            <p className="text-xs uppercase tracking-widest text-foreground-muted">Dashboard</p>
            <h1 className="text-base sm:text-lg font-semibold truncate">
              Bienvenido, {user.name || "Usuario"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="btn-ghost min-h-10 px-3"
            aria-label="Notificaciones"
          >
            🔔
          </button>

          <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-secondary min-h-10 px-3 sm:px-4">
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  )
}

