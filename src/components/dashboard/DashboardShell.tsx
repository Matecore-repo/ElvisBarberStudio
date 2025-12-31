"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopNav } from "@/components/dashboard/TopNav"

interface DashboardShellProps {
  user: {
    name?: string | null
    email?: string | null
    role?: string
  }
  children: React.ReactNode
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!sidebarOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [sidebarOpen])

  useEffect(() => {
    if (!sidebarOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [sidebarOpen])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black">
      {/* Degradado atmosférico: gris muy oscuro a negro sin azules */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(30,_30,_30,_0.15)_0%,_rgba(0,_0,_0,_0)_70%)] pointer-events-none" />
      
      <Sidebar user={user} className="hidden md:flex" />

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <Sidebar
            user={user}
            className="fixed inset-y-0 left-0 z-10 w-[18.5rem] max-w-[85vw]"
            showClose
            onClose={() => setSidebarOpen(false)}
            onNavigate={() => setSidebarOpen(false)}
          />
        </div>
      )}

      <div className="md:pl-64 relative z-10">
        <TopNav user={user} onOpenMenu={() => setSidebarOpen(true)} />
        <main className="container-app pt-20 pb-10">{children}</main>
      </div>
    </div>
  )
}

