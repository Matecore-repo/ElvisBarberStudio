"use client"

import { useData } from "@/contexts/DataContext"

export function SalonsSection() {
  const { salons } = useData()

  return (
    <section id="contacto" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-background-alt">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <span className="text-accent text-xs sm:text-sm font-medium uppercase tracking-wider">Sucursales</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-medium mt-3 sm:mt-4 mb-4 sm:mb-6 text-white">
            ¿Listo para tu{" "}
            <span className="text-gold-gradient">Transformación</span>?
          </h2>
          <p className="text-foreground-muted text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Visita cualquiera de nuestras sucursales en Buenos Aires. Estamos listos para darte el mejor servicio de barbería.
          </p>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {salons.map((salon, idx) => (
            <div key={salon.id} className="group flex flex-col h-full p-5 sm:p-6 border border-border rounded-xl bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-accent/50 hover:bg-card/60">
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-3 sm:space-y-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <span className="text-accent font-bold text-sm">{String(idx + 1).padStart(2, "0")}</span>
                  </div>
                  <div>
                    <p className="text-foreground-muted text-xs uppercase tracking-widest font-medium mb-2">{salon.name}</p>
                    <p className="text-white font-semibold text-sm sm:text-base leading-relaxed">{salon.address}</p>
                  </div>
                </div>
                {salon.phone ? (
                  <a href={`tel:${salon.phone}`} className="mt-4 inline-flex items-center text-accent hover:text-accent/80 transition-colors text-xs sm:text-sm font-medium">
                    <span>{salon.phone}</span>
                    <svg className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                ) : (
                  <div className="mt-4 inline-flex items-center text-foreground-muted/60 text-xs sm:text-sm font-medium">
                    <span>Sin línea disponible</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 sm:mt-16 md:mt-20 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <a href="#" className="btn-primary min-h-11 sm:min-h-12 px-6 sm:px-8 text-xs sm:text-sm w-full sm:w-auto text-center">
            Reservar Turno
          </a>
          <a href="#" className="inline-flex items-center justify-center min-h-11 sm:min-h-12 px-6 sm:px-8 border border-border rounded-lg hover:border-accent/50 hover:bg-card/40 transition-all text-xs sm:text-sm font-medium w-full sm:w-auto">
            Ver Ubicaciones en Mapa
          </a>
        </div>
      </div>
    </section>
  )
}
