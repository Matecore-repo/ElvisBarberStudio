import { prisma } from '@/lib/prisma';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default async function CashPage() {
  const closings = await prisma.cashClosing.findMany({
    orderBy: {
      date: 'desc',
    },
  }).catch(() => []);

  const totalCash = closings.reduce((sum, c) => sum + parseFloat(c.cashTotal.toString()), 0);
  const totalMP = closings.reduce((sum, c) => sum + parseFloat(c.mpTotal.toString()), 0);
  const totalExpenses = closings.reduce((sum, c) => sum + parseFloat(c.expensesTotal.toString()), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Caja</h1>
        <p className="text-gray-600 mt-1">Gestiona los cierres diarios de caja</p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm mb-1">Efectivo Total</p>
          <p className="text-2xl font-bold text-green-600">${totalCash.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm mb-1">Mercado Pago Total</p>
          <p className="text-2xl font-bold text-blue-600">${totalMP.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm mb-1">Gastos Total</p>
          <p className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
        </div>
      </div>

      {/* Tabla de cierres */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Fecha</TableHead>
              <TableHead>Efectivo</TableHead>
              <TableHead>Mercado Pago</TableHead>
              <TableHead>Gastos</TableHead>
              <TableHead>Total Neto</TableHead>
              <TableHead>Notas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {closings.length > 0 ? (
              closings.map((closing) => (
                <TableRow key={closing.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {new Date(closing.date).toLocaleDateString('es-AR')}
                  </TableCell>
                  <TableCell className="text-green-600 font-medium">
                    ${parseFloat(closing.cashTotal.toString()).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-blue-600 font-medium">
                    ${parseFloat(closing.mpTotal.toString()).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-red-600 font-medium">
                    ${parseFloat(closing.expensesTotal.toString()).toFixed(2)}
                  </TableCell>
                  <TableCell className="font-bold">
                    ${parseFloat(closing.cashFinal.toString()).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{closing.notes || '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Sin cierres registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
