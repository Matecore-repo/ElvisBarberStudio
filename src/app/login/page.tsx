"use client"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const { status } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // State for "Existing Account" spinner
  const [isRedirecting, setIsRedirecting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      setIsRedirecting(true)
      // Delay for UX to show the message
      const timer = setTimeout(() => {
        router.push("/app")
        router.refresh()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Credenciales inválidas. Revisá tu email y contraseña.")
        setLoading(false)
        return
      }

      // Successful login
      router.push("/app")
      router.refresh()
    } catch {
      setError("No se pudo iniciar sesión. Intentá de nuevo en unos segundos.")
      setLoading(false)
    }
  }

  // Full screen spinner if already logged in
  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white z-50">
        <div className="w-12 h-12 border-4 border-neutral-800 border-t-yellow-500 rounded-full animate-spin mb-4" />
        <h2 className="text-lg font-medium animate-pulse text-yellow-500">Ya hay una cuenta activa</h2>
        <p className="text-neutral-500 text-sm mt-2">Redirigiendo al sistema...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center px-4 sm:px-6 relative overflow-hidden font-sans text-neutral-200">
      {/* Background patterns - Vercel style subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Subtle 10% Gold Glow - Top Center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none opacity-50" />

      <div className="w-full max-w-[400px] z-10 relative">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-8 h-8 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-center group-hover:border-yellow-500/50 transition-colors">
              <span className="font-serif font-bold text-yellow-500">E</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-yellow-500 transition-colors">
              Elvis Barber
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
            Bienvenido de nuevo
          </h1>
          <p className="text-neutral-400 text-sm">
            Ingresá tus credenciales para acceder al panel
          </p>
        </div>

        {/* Card */}
        <div className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-6 backdrop-blur-sm shadow-2xl shadow-black/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-medium text-neutral-300 uppercase tracking-widest">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@ejemplo.com"
                required
                className="w-full px-3 py-2 bg-black border border-neutral-800 rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all placeholder:text-neutral-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-medium text-neutral-300 uppercase tracking-widest">
                  Contraseña
                </label>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-black border border-neutral-800 rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all placeholder:text-neutral-600"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-center gap-2 text-red-400 text-xs">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-white hover:bg-neutral-200 text-black font-medium text-sm rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>Ingresando...</span>
                </>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-neutral-500">
          ¿No tenés cuenta? <span className="text-yellow-500 hover:text-yellow-400 cursor-pointer transition-colors">Contactá al administrador</span>
        </p>

        {/* Credentials hints (can be removed in prod) */}
        <div className="mt-8 p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg">
          <p className="text-[10px] text-neutral-500 font-mono mb-2 uppercase tracking-wider">Cuentas Demo</p>
          <div className="flex flex-col gap-1 text-[11px] font-mono text-neutral-400">
            <div className="flex justify-between"><span>admin@barber.com</span> <span className="text-neutral-600">admin123</span></div>
            <div className="flex justify-between"><span>elvis@barber.com</span> <span className="text-neutral-600">elvis123</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}

