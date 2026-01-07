'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Staff {
  id: string;
  name: string;
  active: boolean;
}

interface AppointmentFooterProps {
  staff: Staff[];
}

export const AppointmentFooter = ({ staff }: AppointmentFooterProps) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [service, setService] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !customerPhone || !selectedStaff || !service) {
      alert('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          staffId: selectedStaff,
          service,
          paymentMethod,
        }),
      });

      if (response.ok) {
        alert('¡Turno creado exitosamente!');
        setCustomerName('');
        setCustomerPhone('');
        setSelectedStaff('');
        setService('');
        setPaymentMethod('CASH');
      } else {
        alert('Error al crear el turno');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear el turno');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          {/* Cliente */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nombre</label>
            <Input
              placeholder="Tu nombre"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="h-10"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Teléfono</label>
            <Input
              placeholder="Tu teléfono"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="h-10"
            />
          </div>

          {/* Barbero */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Barbero</label>
            <Select value={selectedStaff} onValueChange={setSelectedStaff}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                {staff.map((person) => (
                  <SelectItem key={person.id} value={person.id}>
                    {person.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Servicio */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Servicio</label>
            <Input
              placeholder="Servicio"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="h-10"
            />
          </div>

          {/* Método de Pago */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Pago</label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Efectivo</SelectItem>
                <SelectItem value="MP">Mercado Pago</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botón */}
          <div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-10"
            >
              {isLoading ? 'Creando...' : 'Generar Turno'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
