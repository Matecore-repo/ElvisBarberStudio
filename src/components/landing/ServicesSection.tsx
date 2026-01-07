'use client';

import { Clock, Users, Zap } from 'lucide-react';
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
  const serviceIcons = [
    <Zap key="zap" className="w-6 h-6" />,
    <Clock key="clock" className="w-6 h-6" />,
    <Users key="users" className="w-6 h-6" />,
  ];

  return (
    <section id="servicios" className="relative py-20 px-4 sm:px-6 lg:px-8">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-600/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-white">Nuestros</span>
            <span className="text-yellow-500 ml-3">Servicios</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Ofrecemos una variedad de servicios premium diseñados para mantener tu estilo impecable
          </p>
        </div>

        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {services.map((service, idx) => (
              <div
                key={service.id}
                className="group relative border border-neutral-800 rounded-xl p-6 bg-neutral-900/50 hover:border-yellow-600/50 hover:bg-neutral-900 transition-all duration-300"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/0 to-yellow-600/0 group-hover:from-yellow-600/10 group-hover:to-yellow-600/5 rounded-xl transition-all duration-300 pointer-events-none" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-4 text-yellow-500 group-hover:text-yellow-400 transition-colors">
                    {serviceIcons[idx % serviceIcons.length]}
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                    {service.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-500 text-sm mb-4">{service.description}</p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold text-yellow-500">${service.price}</span>
                  </div>

                  {/* CTA Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-yellow-600/30 text-yellow-500 hover:bg-yellow-600/10 group-hover:border-yellow-500"
                  >
                    Agendar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No hay servicios disponibles en este momento</p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-gray-400 mb-4">¿Tienes dudas sobre nuestros servicios?</p>
          <Button className="bg-yellow-600 hover:bg-yellow-500 text-black font-semibold">
            Contacta con nosotros
          </Button>
        </div>
      </div>
    </section>
  );
};
