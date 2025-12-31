# Guía de Degradados del Sistema

Este documento recopila los degradados (gradients) utilizados en la interfaz de Ritsudo para mantener la consistencia visual.

## Degradados Atmosféricos (Fondos)

### Dashboard - Fondo Principal
Utilizado en el `DashboardLayout.tsx` para crear profundidad.
- **Tipo**: Radial (Capa base)
- **Clases**: `bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-brand-surface-1 via-brand-dark to-brand-dark`
- **Ubicación**: `components/layout/DashboardLayout.tsx`

### Login - Fondo Atmosférico
Efecto de luz sutil en la parte superior.
- **Tipo**: Radial (Difuminado)
- **Clases**: `bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-main/10 via-black to-black`
- **Ubicación**: `app/(auth)/login/page.tsx`

### Landing - Hero Background
Degradado de oscurecimiento sobre la imagen principal.
- **Tipo**: Lineal (Hacia arriba)
- **Clases**: `bg-gradient-to-t from-black via-black/40 to-black/20`
- **Ubicación**: `app/page.tsx`

---

## Degradados de Componentes y Texto

### Texto Hero (Landing)
Efecto de texto brillante.
- **Tipo**: Lineal (Derecha)
- **Clases**: `bg-gradient-to-r from-brand-main to-brand-light`
- **Ubicación**: `app/page.tsx`

### Logo/Icono (Sidebar)
Fondo del icono "R".
- **Tipo**: Lineal (Abajo Derecha)
- **Clases**: `bg-gradient-to-br from-brand-main to-brand-muted`
- **Ubicación**: `components/layout/Sidebar.tsx`

### Brillo Superior (Tarjetas/Login)
Línea de 1px para efecto 3D.
- **Tipo**: Lineal (Derecha)
- **Clases**: `bg-gradient-to-r from-transparent via-white/20 to-transparent`
- **Ubicación**: `app/(auth)/login/page.tsx`

### Glass Gradient (Tailwind Config)
Utilizado para efectos de vidrio.
- **Definición**: `linear-gradient(rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01))`
- **Clase**: `bg-glass-gradient`
- **Ubicación**: `tailwind.config.js`
