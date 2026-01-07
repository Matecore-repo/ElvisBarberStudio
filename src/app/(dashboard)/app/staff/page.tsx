import { prisma } from '@/lib/prisma';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default async function StaffPage() {
  const staff = await prisma.staff.findMany({
    orderBy: {
      name: 'asc',
    },
  }).catch(() => []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Barberos</h1>
        <p className="text-gray-600 mt-1">Gestiona el equipo de barbería</p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Nombre</TableHead>
              <TableHead>Comisión Predeterminada</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha de Registro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.length > 0 ? (
              staff.map((person) => (
                <TableRow key={person.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{person.name}</TableCell>
                  <TableCell>{(person.commissionRateDefault * 100).toFixed(0)}%</TableCell>
                  <TableCell>
                    <Badge variant={person.active ? 'default' : 'outline'}>
                      {person.active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(person.createdAt).toLocaleDateString('es-AR')}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  Sin barberos registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
