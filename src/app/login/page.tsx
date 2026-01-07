"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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
        return
      }

      router.push("/app")
      router.refresh()
    } catch {
      setError("No se pudo iniciar sesión. Intentá de nuevo en unos segundos.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 relative overflow-hidden" suppressHydrationWarning>
      {/* Fondo oscuro con ligero dorado */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-black pointer-events-none" />
      
      {/* Orbes dorados muy sutiles (máximo 10% del espacio) */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-yellow-600 rounded-full blur-3xl opacity-5 animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-yellow-700 rounded-full blur-3xl opacity-4 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-md z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-4">
            <div className="text-4xl font-bold tracking-tight">
              <span className="text-white">Elvis</span>
              <span className="text-yellow-500 ml-2">Barber</span>
            </div>
          </Link>
          <p className="text-gray-400 text-sm">
            Acceso al panel de gestión
          </p>
        </div>

        {/* Card de Login */}
        <div className="relative border border-neutral-800 rounded-2xl p-8 bg-neutral-950 backdrop-blur-sm overflow-hidden group">
          {/* Borde dorado sutil en hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-600 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />
          
          {/* Contenido */}
          <div className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-white">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  autoComplete="email"
                  inputMode="email"
                  required
                  className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white placeholder-gray-600 focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600/20 outline-none transition-all duration-200"
                />
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-white">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white placeholder-gray-600 focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600/20 outline-none transition-all duration-200"
                />
              </div>

              {/* Error Alert */}
              {error && (
                <div className="bg-red-950/30 border border-red-900/50 text-red-300 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Botón Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-yellow-600 hover:bg-yellow-500 text-black font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Ingresando...
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center pt-8 border-t border-neutral-800">
              <Link
                href="/"
                className="text-gray-400 hover:text-yellow-500 transition-colors text-sm font-medium"
              >
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </div>

        {/* Credenciales de prueba */}
        <div className="mt-8 p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl">
          <p className="text-gray-500 text-xs mb-3 font-semibold">CREDENCIALES DE PRUEBA:</p>
          <div className="space-y-2 text-xs text-gray-400">
            <p><span className="text-yellow-500 font-mono">admin@barber.com</span> / admin123</p>
            <p><span className="text-yellow-500 font-mono">elvis@barber.com</span> / elvis123</p>
          </div>
        </div>
      </div>
    </div>
  )
}

