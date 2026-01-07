"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"

// Imágenes de barbería - puedes reemplazar con imágenes locales
const salonImages = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2574&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2669&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=2574&auto=format&fit=crop",
]

export const Hero = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  )

  return (
    <section id="inicio" className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Carousel */}
      <div className="absolute inset-0">
        <Carousel
          opts={{
            loop: true,
            duration: 50,
          }}
          plugins={[plugin.current]}
          className="h-full w-full"
        >
          <CarouselContent className="h-full -ml-0">
            {salonImages.map((image, index) => (
              <CarouselItem key={index} className="h-screen basis-full pl-0">
                <div className="relative h-full w-full">
                  <img
                    src={image}
                    alt={`Vista del salón ${index + 1}`}
                    className="h-full w-full object-cover transition-opacity duration-1000"
                  />
                  {/* Individual image fade overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/40" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Metallic gold glow effect */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-yellow-600/10" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Radial gradient spotlight */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-gradient-radial from-amber-500/20 to-transparent blur-3xl" />

      {/* Main Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            {/* Small Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <span className="gold-metallic-text inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider backdrop-blur-sm">
                Barbería Premium
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl"
            >
              Estilo y{" "}
              <br className="hidden sm:block" />
              <span className="gold-gradient-text inline-block">Profesionalismo</span>
              <br />
              <span className="text-white">en cada corte</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-10 max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl"
            >
              Experimenta el cuidado premium con nuestros barberos certificados.
              Diseños modernos, técnica clásica y un servicio excepcional.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <Link href="#servicios">
                <Button
                  size="lg"
                  className="gold-metallic-button group relative overflow-hidden text-base font-semibold shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-gold"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Ver Servicios
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </Button>
              </Link>

              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 bg-white/5 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/10"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Agendar Turno
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-16 grid grid-cols-3 gap-8 border-t border-white/10 pt-8"
            >
              <div>
                <div className="gold-metallic-text mb-1 text-2xl font-bold md:text-3xl">
                  50+
                </div>
                <div className="text-sm text-gray-400">Clientes Felices</div>
              </div>
              <div>
                <div className="gold-metallic-text mb-1 text-2xl font-bold md:text-3xl">
                  5
                </div>
                <div className="text-sm text-gray-400">Años Experiencia</div>
              </div>
              <div>
                <div className="gold-metallic-text mb-1 text-2xl font-bold md:text-3xl">
                  100%
                </div>
                <div className="text-sm text-gray-400">Satisfacción</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  )
}
