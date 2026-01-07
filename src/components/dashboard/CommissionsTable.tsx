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

interface Commission {
  id: string;
  staff: { name: string };
  periodStart: string;
  periodEnd: string;
  totalSales: number;
  commissionRate: number;
  commissionAmount: number;
  status: string;
  paidAt: string | null;
}

interface CommissionsTableProps {
  commissions: Commission[];
}

export const CommissionsTable = ({ commissions }: CommissionsTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  const getStatusBadge = (status: string) => {
    return status === 'PAID' 
      ? { label: 'Pagada', variant: 'default' as const }
      : { label: 'Pendiente', variant: 'outline' as const };
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Barbero</TableHead>
            <TableHead>Período</TableHead>
            <TableHead>Ventas Totales</TableHead>
            <TableHead>% Comisión</TableHead>
            <TableHead>Monto Comisión</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Pagado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {commissions.length > 0 ? (
            commissions.map((commission) => {
              const statusConfig = getStatusBadge(commission.status);
              return (
                <TableRow key={commission.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{commission.staff.name}</TableCell>
                  <TableCell className="text-sm">
                    {formatDate(commission.periodStart)} - {formatDate(commission.periodEnd)}
                  </TableCell>
                  <TableCell className="font-semibold">${commission.totalSales.toFixed(2)}</TableCell>
                  <TableCell>{(commission.commissionRate * 100).toFixed(0)}%</TableCell>
                  <TableCell className="font-bold text-blue-600">
                    ${commission.commissionAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig.variant}>
                      {statusConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {commission.paidAt ? formatDate(commission.paidAt) : '-'}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                Sin comisiones registradas
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
