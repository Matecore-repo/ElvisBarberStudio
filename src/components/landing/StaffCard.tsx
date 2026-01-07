'use client';

interface StaffCardProps {
  name: string;
  commissionRate: number;
  active: boolean;
}

export const StaffCard = ({ name, commissionRate, active }: StaffCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Comisión: {(commissionRate * 100).toFixed(0)}%</span>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {active ? 'Activo' : 'Inactivo'}
        </div>
      </div>
    </div>
  );
};
