'use client';

interface ServiceCardProps {
  name: string;
  price: number;
  description: string;
}

export const ServiceCard = ({ name, price, description }: ServiceCardProps) => {
  return (
    <div className="group relative border border-neutral-800 rounded-xl p-6 bg-neutral-900/50 hover:border-yellow-600/50 hover:bg-neutral-900 transition-all duration-300">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/0 via-yellow-600/0 to-yellow-600/0 group-hover:from-yellow-600/5 group-hover:via-yellow-600/5 group-hover:to-yellow-600/5 rounded-xl transition-all duration-300 pointer-events-none" />
      
      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">{name}</h3>
        <p className="text-gray-500 text-sm mb-4">{description}</p>
        <div className="text-3xl font-bold text-yellow-500">${price}</div>
      </div>
    </div>
  );
};
