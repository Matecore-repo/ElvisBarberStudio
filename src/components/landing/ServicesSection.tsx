"use client"

import { useData } from "@/contexts/DataContext"

export function ServicesSection() {
  const { services } = useData()

  const cortes = services.filter(s => s.category === "Cortes")
  const barbas = services.filter(s => s.category === "Barba")

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

        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-24">
          {/* Column 1: Cortes */}
          <div className="space-y-6 sm:space-y-8">
            <h3 className="text-xl sm:text-2xl font-serif border-b border-white/10 pb-3 sm:pb-4 mb-4 sm:mb-6">Cortes</h3>
            {cortes.map(service => (
              <div key={service.id} className="group flex justify-between items-baseline w-full gap-3">
                <div className="relative z-10 bg-background pr-2">
                  <h4 className="font-bold text-base sm:text-lg group-hover:text-accent transition-colors">{service.name}</h4>
                  <p className="text-xs sm:text-sm text-foreground-muted">{service.description}</p>
                </div>
                <div className="flex-grow border-b border-dotted border-white/20 relative -top-1 mx-1"></div>
                <div className="relative z-10 bg-background pl-2 font-bold text-accent text-sm sm:text-base">${service.price.toFixed(0)}</div>
              </div>
            ))}
          </div>

          {/* Column 2: Barba */}
          <div className="space-y-6 sm:space-y-8">
            <h3 className="text-xl sm:text-2xl font-serif border-b border-white/10 pb-3 sm:pb-4 mb-4 sm:mb-6">Barba & Afeitado</h3>
            {barbas.map(service => (
              <div key={service.id} className="group flex justify-between items-baseline w-full gap-3">
                <div className="relative z-10 bg-background pr-2">
                  <h4 className="font-bold text-base sm:text-lg group-hover:text-accent transition-colors">{service.name}</h4>
                  <p className="text-xs sm:text-sm text-foreground-muted">{service.description}</p>
                </div>
                <div className="flex-grow border-b border-dotted border-white/20 relative -top-1 mx-1"></div>
                <div className="relative z-10 bg-background pl-2 font-bold text-accent text-sm sm:text-base">${service.price.toFixed(0)}</div>
              </div>
            ))}
          </div>
        </div>

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
