"use client"

import { useState, use } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage(props: {
  params: Promise<any>
  searchParams: Promise<any>
}) {
  const params = use(props.params)
  const searchParams = use(props.searchParams)
  
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
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 relative overflow-hidden" suppressHydrationWarning>
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 pointer-events-none" />
      
      {/* Floating Golden Orbs with Blur */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent rounded-full blur-2xl opacity-15 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-accent rounded-full blur-2xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-accent rounded-full blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 w-56 h-56 bg-accent rounded-full blur-2xl opacity-12 animate-pulse" style={{ animationDelay: '0.5s' }} />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-white">
            Elvis Barber Studio
          </Link>
          <p className="text-foreground-muted mt-2 text-sm sm:text-base">
            Accedé al panel de gestión.
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="tu@email.com"
                autoComplete="email"
                inputMode="email"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Ingresando...
                </span>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-foreground-muted hover:text-accent transition-colors text-sm"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

