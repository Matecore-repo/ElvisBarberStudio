"use client"

interface TopNavProps {
  user: {
    name?: string | null
    email?: string | null
  }
  onOpenMenu?: () => void
}

export function TopNav({ user, onOpenMenu }: TopNavProps) {
  const currentHour = new Date().getHours()
  const greeting =
    currentHour < 12 ? "Buenos días" : currentHour < 18 ? "Buenas tardes" : "Buenas noches"

  return (
    <header className="fixed top-0 left-0 right-0 md:left-64 h-20 bg-black/80 backdrop-blur-lg border-b border-neutral-800 z-40">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left Section - Menu + Greeting */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={onOpenMenu}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-neutral-800 transition-colors flex-shrink-0 text-white"
            aria-label="Abrir menú"
            title="Abrir menú"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Greeting */}
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">
              {greeting}
            </p>
            <h1 className="text-base sm:text-lg font-semibold text-white truncate">
              {user.name || "Usuario"}
            </h1>
          </div>
        </div>

        {/* Right Section - Status Badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* System Status Badge - Dorado */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-lg bg-yellow-600/10 border border-yellow-600/30 hover:border-yellow-600/50 transition-all">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-xs text-yellow-500 font-medium">Activo</span>
          </div>
        </div>
      </div>
    </header>
  )
}
