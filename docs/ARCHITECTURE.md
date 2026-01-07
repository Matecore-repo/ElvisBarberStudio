# 🏗️ Arquitectura del Sistema

## 🏗️ Resumen del Stack

Elvis Barber Studio está construido sobre un stack moderno y escalable:

| Componente | Tecnología |
|------------|------------|
| **Framework** | Next.js 16.1.1 (App Router) |
| **Runtime** | Node.js (con Turbopack en desarrollo) |
| **Idioma** | TypeScript |
| **Base de Datos** | PostgreSQL (Alojado en Neon) |
| **ORM** | Prisma |
| **Autenticación** | Auth.js (NextAuth) |
| **Estilos** | Tailwind CSS |

## 📂 Estructura del Proyecto

```text
/src
  /app           # Rutas del App Router (Frontend y API)
    /(dashboard) # Grupo de rutas protegidas para el panel
    /api         # Endpoints de la API REST
  /components    # Componentes React reutilizables
    /dashboard   # Componentes específicos del panel
    /ui          # Componentes base de UI
  /lib           # Utilidades, lógica compartida y clientes (Prisma, etc.)
  /types         # Definiciones de tipos globales
/prisma          # Esquema de la base de datos y migraciones
/docs            # Documentación detallada del proyecto
```

## 🔒 Seguridad e Infraestructura

- **Aislamiento Multi-tenant:** Los datos están filtrados por `salonId` en cada consulta.
- **Autenticación Robusta:** Manejada mediante Auth.js con secretos configurados vía `AUTH_SECRET`.
- **Performance:** Optimización mediante caching y queries concurrentes (`Promise.all`).

Para más detalles sobre el diseño del dashboard, consulta **[Dashboard Arquitectura](./DASHBOARD_ARQUITECTURA.md)**.
