'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface ServicesSectionProps {
  services: Service[];
}

export const ServicesSection = ({ services }: ServicesSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentRef = tableRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section id="servicios" className="relative py-20 px-4 sm:px-6 lg:px-8">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-600/5 to-transparent pointer-events-none" />

      <div
        ref={tableRef}
        className="max-w-3xl mx-auto relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-white">Nuestros </span>
            <span className="gold-gradient-text">Servicios</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Servicios profesionales de barbería premium
          </p>
        </div>

        {/* Pricing Table */}
        {services.length > 0 ? (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden shadow-lg backdrop-blur-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-900/80">
                  <th className="text-left py-4 px-6 font-semibold text-sm text-white">
                    Servicio
                  </th>
                  <th className="text-right py-4 px-6 font-semibold text-sm text-white">
                    Precio
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr
                    key={service.id}
                    className="border-b border-neutral-800 last:border-b-0 transition-colors duration-200 hover:bg-neutral-800/50 group"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                      transition: `opacity 0.5s ease-out ${index * 0.1}s, transform 0.5s ease-out ${index * 0.1}s`,
                      willChange: isVisible ? 'auto' : 'opacity, transform',
                    }}
                  >
                    <td className="py-5 px-6">
                      <div className="flex flex-col">
                        <span className="font-medium text-white group-hover:text-yellow-400 transition-colors">
                          {service.name}
                        </span>
                        {service.description && (
                          <span className="text-sm text-gray-500 mt-0.5">
                            {service.description}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <span className="font-semibold text-lg gold-metallic-text tabular-nums">
                        ${service.price}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 border border-neutral-800 rounded-xl bg-neutral-900/50">
            <p className="text-lg">No hay servicios disponibles en este momento</p>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-6">
            Todos los servicios incluyen consulta personalizada
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/login">
              <Button className="gold-metallic-button font-semibold px-6 py-3 hover:scale-105 transition-transform">
                Reservar Cita
              </Button>
            </Link>
            <a href="#contacto">
              <Button
                variant="outline"
                className="border-neutral-700 text-white hover:bg-neutral-800 px-6 py-3"
              >
                Ver Ubicación
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
