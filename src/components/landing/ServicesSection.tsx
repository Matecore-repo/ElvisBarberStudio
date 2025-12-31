"use client"

import { useData } from "@/contexts/DataContext"
import { useMemo } from "react"

export function ServicesSection() {
  const { services, loading } = useData()

  // Agrupar servicios por nombre de categoría
  const servicesByCategory = useMemo(() => {
    const groups: Record<string, typeof services> = {}

    services.forEach(service => {
      // Usar el nombre de la categoría si existe, o "Otros" si no
      const categoryName = service.category?.name || "Otros"

      if (!groups[categoryName]) {
        groups[categoryName] = []
      }
      groups[categoryName].push(service)
    })

    return groups
  }, [services])

  const categoryNames = Object.keys(servicesByCategory).sort()

  return (
    <section id="servicios" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-background relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 md:mb-24">
          <span className="text-accent text-xs font-bold tracking-[0.2em] uppercase">Nuestro Menú</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mt-4 sm:mt-6 mb-6 sm:mb-8 text-white">
            Servicios <span className="text-accent italic">&</span> Precios
          </h2>
          <div className="w-16 sm:w-24 h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent mx-auto" />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center text-foreground-muted py-12">
            <p>Servicios no disponibles momentáneamente.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-24 items-start">
            {categoryNames.map((categoryName) => (
              <div key={categoryName} className="space-y-6 sm:space-y-8 w-full">
                <h3 className="text-xl sm:text-2xl font-serif border-b border-white/10 pb-3 sm:pb-4 mb-4 sm:mb-6 text-white capitalize">
                  {categoryName}
                </h3>
                {servicesByCategory[categoryName].map(service => (
                  <div key={service.id} className="group flex justify-between items-baseline w-full gap-3">
                    <div className="relative z-10 bg-background pr-2 max-w-[70%]">
                      <h4 className="font-bold text-base sm:text-lg group-hover:text-accent transition-colors text-white">
                        {service.name}
                      </h4>
                      {service.description && (
                        <p className="text-xs sm:text-sm text-foreground-muted mt-0.5">{service.description}</p>
                      )}
                    </div>
                    <div className="flex-grow border-b border-dotted border-white/20 relative -top-1 mx-1"></div>
                    <div className="relative z-10 bg-background pl-2 font-bold text-accent text-sm sm:text-base whitespace-nowrap">
                      ${typeof service.price === 'number' ? service.price.toFixed(0) : service.price}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <div className="mt-12 sm:mt-16 text-center">
          <a href="#contacto" className="inline-block border border-white/20 px-8 sm:px-10 py-2.5 sm:py-3 text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300">
            Ver Menú Completo
          </a>
        </div>
      </div>
    </section>
  )
}
