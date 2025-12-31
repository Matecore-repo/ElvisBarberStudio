import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" suppressHydrationWarning>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <span className="text-xl sm:text-2xl font-bold tracking-tight">ELVIS<span className="text-accent">.</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs sm:text-sm font-medium tracking-wide uppercase">
            <a href="#servicios" className="hover:text-accent transition-colors">Servicios</a>
            <a href="#experiencia" className="hover:text-accent transition-colors">Experiencia</a>
            <a href="#contacto" className="hover:text-accent transition-colors">Contacto</a>
            <Link href="/login" className="text-foreground-muted hover:text-accent transition-colors">
              Sistema
            </Link>
          </div>

          <a href="#contacto" className="btn-primary min-h-9 sm:min-h-10 px-3 sm:px-5 text-xs sm:text-sm">
            Reservar
          </a>
        </div>
      </nav>

      {/* Hero Section - Cinematic Luxury */}
      <section className="relative min-h-screen pt-16 sm:pt-20 flex items-center justify-center overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Hero.jpg"
            alt="Elvis Barber Studio Interior"
            fill
            sizes="100vw"
            className="object-cover opacity-30"
            priority
          />
          {/* Editorial Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8 md:space-y-10">
          <div className="inline-block px-3 sm:px-4 py-1 border-y border-accent/40 text-accent text-[9px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase font-medium">
            Est. 2024 • Buenos Aires
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-white leading-[0.95] tracking-tight">
            Mastery. <br className="md:hidden" />
            <span className="italic text-white/90">Tradition.</span> <br />
            Ritual.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-foreground-muted max-w-xl mx-auto leading-relaxed tracking-wide font-light">
            Donde la vieja escuela se encuentra con la excelencia moderna.
            Un espacio de desconexión, diseñado para el caballero contemporáneo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-6 sm:pt-8">
            <a href="#contacto" className="group relative px-8 sm:px-10 py-3 sm:py-4 bg-transparent border border-white/20 text-white text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-500 ease-out overflow-hidden w-full sm:w-auto text-center">
              <span className="relative z-10">Reservar Cita</span>
            </a>
            <a href="#servicios" className="text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase text-foreground-muted hover:text-accent transition-colors duration-300 border-b border-transparent hover:border-accent pb-1">
              Explorar Servicios
            </a>
          </div>
        </div>
      </section>

      {/* Servicios Menu Section */}
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
            {/* Column 1 */}
            <div className="space-y-6 sm:space-y-8">
              <h3 className="text-xl sm:text-2xl font-serif border-b border-white/10 pb-3 sm:pb-4 mb-4 sm:mb-6">Cortes</h3>

              <div className="group flex justify-between items-baseline w-full gap-3">
                <div className="relative z-10 bg-background pr-2">
                  <h4 className="font-bold text-base sm:text-lg group-hover:text-accent transition-colors">Corte Clásico</h4>
                  <p className="text-xs sm:text-sm text-foreground-muted">Tijera o máquina, lavado incluido</p>
                </div>
                <div className="flex-grow border-b border-dotted border-white/20 relative -top-1 mx-1"></div>
                <div className="relative z-10 bg-background pl-2 font-bold text-accent text-sm sm:text-base">$2,500</div>
              </div>

              <div className="group flex justify-between items-baseline w-full gap-3">
                <div className="relative z-10 bg-background pr-2">
                  <h4 className="font-bold text-base sm:text-lg group-hover:text-accent transition-colors">Skin Fade</h4>
                  <p className="text-xs sm:text-sm text-foreground-muted">Degradado perfecto a navaja</p>
                </div>
                <div className="flex-grow border-b border-dotted border-white/20 relative -top-1 mx-1"></div>
                <div className="relative z-10 bg-background pl-2 font-bold text-accent text-sm sm:text-base">$3,000</div>
              </div>

              <div className="group flex justify-between items-baseline w-full gap-3">
                <div className="relative z-10 bg-background pr-2">
                  <h4 className="font-bold text-base sm:text-lg group-hover:text-accent transition-colors">Corte Infantil</h4>
                  <p className="text-xs sm:text-sm text-foreground-muted">Menores de 12 años</p>
                </div>
                <div className="flex-grow border-b border-dotted border-white/20 relative -top-1 mx-1"></div>
                <div className="relative z-10 bg-background pl-2 font-bold text-accent text-sm sm:text-base">$2,000</div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-6 sm:space-y-8">
              <h3 className="text-xl sm:text-2xl font-serif border-b border-white/10 pb-3 sm:pb-4 mb-4 sm:mb-6">Barba & Afeitado</h3>

              <div className="group flex justify-between items-baseline w-full gap-3">
                <div className="relative z-10 bg-background pr-2">
                  <h4 className="font-bold text-base sm:text-lg group-hover:text-accent transition-colors">Perfilado Express</h4>
                  <p className="text-xs sm:text-sm text-foreground-muted">Solo máquina, sin toalla</p>
                </div>
                <div className="flex-grow border-b border-dotted border-white/20 relative -top-1 mx-1"></div>
                <div className="relative z-10 bg-background pl-2 font-bold text-accent text-sm sm:text-base">$1,500</div>
              </div>

              <div className="group flex justify-between items-baseline w-full gap-3">
                <div className="relative z-10 bg-background pr-2">
                  <h4 className="font-bold text-base sm:text-lg group-hover:text-accent transition-colors">Ritual de Barba</h4>
                  <p className="text-xs sm:text-sm text-foreground-muted">Toalla caliente, aceites, navaja</p>
                </div>
                <div className="flex-grow border-b border-dotted border-white/20 relative -top-1 mx-1"></div>
                <div className="relative z-10 bg-background pl-2 font-bold text-accent text-sm sm:text-base">$2,200</div>
              </div>

              <div className="group flex justify-between items-baseline w-full gap-3">
                <div className="relative z-10 bg-background pr-2">
                  <h4 className="font-bold text-base sm:text-lg group-hover:text-accent transition-colors">Afeitado Tradicional</h4>
                  <p className="text-xs sm:text-sm text-foreground-muted">Navaja completa, masaje facial</p>
                </div>
                <div className="flex-grow border-b border-dotted border-white/20 relative -top-1 mx-1"></div>
                <div className="relative z-10 bg-background pl-2 font-bold text-accent text-sm sm:text-base">$2,500</div>
              </div>
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

      {/* Experience Section - Split Screen */}
      <section id="experiencia" className="relative min-h-screen grid md:grid-cols-2 bg-[#050505]">
        {/* Left - Image */}
        <div className="relative h-[40vh] sm:h-[50vh] md:h-screen order-1 md:order-1 overflow-hidden group">
          <Image
            src="/JackDaniels.webp"
            alt="Whisky Experience"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center w-3/4 h-3/4 mx-auto my-auto"
          />
          {/* Pro Blending Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-[#050505] opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent md:hidden" />
          <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
        </div>

        {/* Right - Content */}
        <div className="flex items-center p-6 sm:p-8 md:p-16 lg:p-32 bg-[#050505] order-2 md:order-2">
          <div className="space-y-6 sm:space-y-8 md:space-y-10 max-w-lg">
            <span className="text-accent text-xs font-bold tracking-[0.2em] uppercase border-b border-accent/20 pb-2">La Experiencia</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] text-white">
              Más que un corte, <br />
              <span className="italic text-foreground-muted/80">un ritual.</span>
            </h2>
            <p className="text-base sm:text-lg text-foreground-muted leading-relaxed font-light">
              En Elvis Barber Studio, entendemos que el cuidado personal es un momento sagrado.
              Por eso, cada servicio incluye nuestra firma: una bebida de cortesía, toallas calientes y un ambiente
              diseñado para tu desconexión total.
            </p>

            <div className="grid grid-cols-2 gap-6 sm:gap-8 md:gap-12 pt-8 sm:pt-10 md:pt-10 border-t border-white/5">
              <div>
                <h4 className="font-serif text-xl sm:text-2xl mb-2 sm:mb-3 text-white">Premium</h4>
                <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">Productos de alta gama importados.</p>
              </div>
              <div>
                <h4 className="font-serif text-xl sm:text-2xl mb-2 sm:mb-3 text-white">Relax</h4>
                <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">Ambiente lounge y bebidas de cortesía.</p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-20 items-center">
          {/* Left - Barber Pole Image (Blended) */}
          <div className="relative h-[300px] sm:h-[400px] md:h-[700px] w-full rounded-sm overflow-hidden order-2 md:order-1">
            <Image
              src="/BarberPole.webp"
              alt="Barber Pole"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover opacity-80"
            />
            {/* Complex Gradient Masking for Seamless Blend */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-background" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
            <div className="absolute top-4 sm:top-10 left-4 sm:left-10 z-10">
              <span className="text-accent text-[9px] sm:text-[10px] font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase border border-accent/30 px-3 sm:px-4 py-1.5 sm:py-2 bg-black/50 backdrop-blur-sm">Est. 2024</span>
            </div>
          </div>

          {/* Right - Text Content */}
          <div className="text-center md:text-left relative z-10 pl-0 md:pl-6 lg:pl-10 order-1 md:order-2">
            <span className="text-accent text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif opacity-20 absolute -top-12 sm:-top-16 left-0 md:-left-8 lg:-left-12 font-italic">&quot;</span>
            <blockquote className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif leading-[1.1] mb-8 sm:mb-10 md:mb-12 relative z-10 text-foreground">
              La atención es impecable. El detallismo de los barberos y la atmósfera hacen que valga cada segundo.
            </blockquote>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent font-serif text-xl sm:text-2xl border border-accent/20 flex-shrink-0">I</div>
              <cite className="not-italic flex flex-col items-center md:items-start text-left">
                <span className="font-bold text-base sm:text-lg uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white mb-0.5 sm:mb-1">Ignacio Angelone</span>
                <span className="text-accent/60 text-xs font-medium tracking-widest uppercase">Cliente Frecuente</span>
              </cite>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto Section */}
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

          {/* Branches Grid - Mobile First Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {/* Branch 1 */}
            <div className="group flex flex-col h-full p-5 sm:p-6 border border-border rounded-xl bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-accent/50 hover:bg-card/60">
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-3 sm:space-y-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <span className="text-accent font-bold text-sm">01</span>
                  </div>
                  <div>
                    <p className="text-foreground-muted text-xs uppercase tracking-widest font-medium mb-2">Sucursal Centro</p>
                    <p className="text-white font-semibold text-sm sm:text-base leading-relaxed">Av. Rivadavia 2222</p>
                  </div>
                </div>
                <a href="tel:+541132975792" className="mt-4 inline-flex items-center text-accent hover:text-accent/80 transition-colors text-xs sm:text-sm font-medium">
                  <span>11 3297-5792</span>
                  <svg className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Branch 2 */}
            <div className="group flex flex-col h-full p-5 sm:p-6 border border-border rounded-xl bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-accent/50 hover:bg-card/60">
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-3 sm:space-y-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <span className="text-accent font-bold text-sm">02</span>
                  </div>
                  <div>
                    <p className="text-foreground-muted text-xs uppercase tracking-widest font-medium mb-2">Sucursal Recoleta</p>
                    <p className="text-white font-semibold text-sm sm:text-base leading-relaxed">Viamonte 2600</p>
                  </div>
                </div>
                <a href="tel:+541138326831" className="mt-4 inline-flex items-center text-accent hover:text-accent/80 transition-colors text-xs sm:text-sm font-medium">
                  <span>11 3832-6831</span>
                  <svg className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Branch 3 */}
            <div className="group flex flex-col h-full p-5 sm:p-6 border border-border rounded-xl bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-accent/50 hover:bg-card/60">
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-3 sm:space-y-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <span className="text-accent font-bold text-sm">03</span>
                  </div>
                  <div>
                    <p className="text-foreground-muted text-xs uppercase tracking-widest font-medium mb-2">Sucursal Caballito</p>
                    <p className="text-white font-semibold text-sm sm:text-base leading-relaxed">Av. Iriarte 2847</p>
                  </div>
                </div>
                <a href="tel:+541169714636" className="mt-4 inline-flex items-center text-accent hover:text-accent/80 transition-colors text-xs sm:text-sm font-medium">
                  <span>11 6971-4636</span>
                  <svg className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Branch 4 */}
            <div className="group flex flex-col h-full p-5 sm:p-6 border border-border rounded-xl bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-accent/50 hover:bg-card/60">
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-3 sm:space-y-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <span className="text-accent font-bold text-sm">04</span>
                  </div>
                  <div>
                    <p className="text-foreground-muted text-xs uppercase tracking-widest font-medium mb-2">Sucursal Flores</p>
                    <p className="text-white font-semibold text-sm sm:text-base leading-relaxed">Av. Iriarte 1673</p>
                  </div>
                </div>
                <div className="mt-4 inline-flex items-center text-foreground-muted/60 text-xs sm:text-sm font-medium">
                  <span>Sin línea disponible</span>
                </div>
              </div>
            </div>
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

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-foreground-muted text-xs sm:text-sm text-center sm:text-left order-2 sm:order-1">
            © 2024 Elvis Barber Studio. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 sm:gap-6 order-1 sm:order-2">
            <a href="#" className="text-foreground-muted hover:text-accent transition-colors text-xs sm:text-sm">
              Instagram
            </a>
            <a href="#" className="text-foreground-muted hover:text-accent transition-colors text-xs sm:text-sm">
              Facebook
            </a>
            <a href="#" className="text-foreground-muted hover:text-accent transition-colors text-xs sm:text-sm">
              WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
