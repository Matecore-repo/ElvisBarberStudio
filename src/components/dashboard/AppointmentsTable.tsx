'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Appointment {
  id: string;
  dateTime: string;
  customer: { name: string; phone: string } | null;
  staff: { name: string };
  paymentMethod: string | null; // Make nullable
  totalAmount: number | null;
  servicesText: string;
  status?: string; // Add status
}

interface AppointmentsTableProps {
  appointments: Appointment[];
}

export const AppointmentsTable = ({ appointments }: AppointmentsTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-AR');
  };

  const getPaymentBadge = (method: string | null) => {
    if (!method) return <Badge variant="outline" className="text-gray-400">Pendiente</Badge>;
    return method === 'CASH'
      ? 'Efectivo'
      : method === 'MP'
        ? 'Mercado Pago'
        : method;
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Cliente</TableHead>
            <TableHead>Barbero</TableHead>
            <TableHead>Servicio</TableHead>
            <TableHead>Fecha/Hora</TableHead>
            <TableHead>Pago</TableHead>
            <TableHead>Monto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.length > 0 ? (
            appointments.map((apt) => (
              <TableRow key={apt.id} className={`hover:bg-gray-50 ${apt.status === 'CANCELED' ? 'opacity-50 line-through bg-red-50' : ''}`}>
                <TableCell>
                  <div>
                    <p className="font-medium">{apt.customer?.name || 'Sin cliente'}</p>
                    <p className="text-xs text-gray-500">{apt.customer?.phone}</p>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{apt.staff.name}</TableCell>
                <TableCell>{apt.servicesText}</TableCell>
                <TableCell className="text-sm">{formatDate(apt.dateTime)}</TableCell>
                <TableCell>
                  {getPaymentBadge(apt.paymentMethod)}
                </TableCell>
                <TableCell className={`font-semibold ${apt.status === 'CANCELED' ? 'text-gray-400' : 'text-green-600'}`}>
                  ${apt.totalAmount?.toFixed(2) || 'N/A'}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                Sin turnos registrados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
