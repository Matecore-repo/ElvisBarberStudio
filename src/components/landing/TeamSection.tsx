'use client';

import { Star, Scissors } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Barber {
  id: string;
  name: string;
  commissionRateDefault: number;
  active: boolean;
}

interface TeamSectionProps {
  staff: Barber[];
}

export const TeamSection = ({ staff }: TeamSectionProps) => {
  return (
    <section id="barberos" className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-neutral-800">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-600/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-white">Nuestros</span>
            <span className="text-yellow-500 ml-3">Barberos</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Profesionales certificados con años de experiencia en cortes modernos y técnicas clásicas
          </p>
        </div>

        {/* Team Grid */}
        {staff.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {staff.map((barber) => (
              <div
                key={barber.id}
                className="group relative border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/50 hover:border-yellow-600/50 transition-all duration-300"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/0 to-yellow-600/0 group-hover:from-yellow-600/10 group-hover:to-yellow-600/5 transition-all duration-300 pointer-events-none" />

                {/* Avatar Placeholder */}
                <div className="relative h-64 bg-gradient-to-br from-yellow-600/20 to-neutral-900 flex items-center justify-center overflow-hidden">
                  <Scissors className="w-16 h-16 text-yellow-500/30" />
                </div>

                {/* Content */}
                <div className="relative z-10 p-6">
                  {/* Name */}
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                    {barber.name}
                  </h3>

                  {/* Status */}
                  <div className="mb-4">
                    <Badge
                      variant={barber.active ? 'default' : 'secondary'}
                      className={barber.active ? 'bg-green-600/20 text-green-400 border-green-600/30' : 'bg-gray-600/20 text-gray-400 border-gray-600/30'}
                    >
                      {barber.active ? '● Disponible' : 'No disponible'}
                    </Badge>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center justify-between text-gray-400">
                      <span>Comisión:</span>
                      <span className="text-yellow-500 font-semibold">{(barber.commissionRateDefault * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>4.9/5 (28 reseñas)</span>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="text-xs px-2 py-1 rounded-full bg-yellow-600/10 text-yellow-400 border border-yellow-600/20">
                      Cortes
                    </div>
                    <div className="text-xs px-2 py-1 rounded-full bg-yellow-600/10 text-yellow-400 border border-yellow-600/20">
                      Barba
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    disabled={!barber.active}
                    className="w-full py-2 px-3 rounded-lg bg-yellow-600/20 text-yellow-500 hover:bg-yellow-600/30 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors border border-yellow-600/30"
                  >
                    {barber.active ? 'Agendar con ' + barber.name : 'No disponible'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No hay barberos disponibles en este momento</p>
          </div>
        )}
      </div>
    </section>
  );
};
