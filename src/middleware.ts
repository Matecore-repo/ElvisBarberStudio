import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { pathname } = req.nextUrl

    // Rutas de API protegidas (excepto auth)
    const isApiRoute = pathname.startsWith("/api")
    const isAuthApiRoute = pathname.startsWith("/api/auth")

    // Rutas de dashboard
    const isDashboardRoute = pathname.startsWith("/app")

    // Si intenta acceder a /app sin estar logueado
    if (isDashboardRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    // Rutas públicas de API (solo GET)
    const isPublicApiRoute = (
        (pathname.startsWith("/api/services") || pathname.startsWith("/api/salons")) &&
        req.method === "GET"
    )

    // Si intenta acceder a API protegida sin estar logueado
    if (isApiRoute && !isAuthApiRoute && !isPublicApiRoute && !isLoggedIn) {
        return NextResponse.json(
            { error: "No autorizado" },
            { status: 401 }
        )
    }

    // Si está logueado e intenta ir a login, NO redirigimos automáticamente
    // Permitimos que la página de login maneje la UI de "Ya hay una cuenta"
    // if (pathname === "/login" && isLoggedIn) {
    //     return NextResponse.redirect(new URL("/app", req.url))
    // }

    return NextResponse.next()
})

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
}
