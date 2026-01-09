import { prisma } from '@/lib/prisma';
import { AppointmentsTable } from '@/components/dashboard/AppointmentsTable';

export default async function AppointmentsPage() {
  const sales = await prisma.sale.findMany({
    include: {
      customer: true,
      staff: true,
    },
    orderBy: {
      dateTime: 'desc',
    },
  }).catch(() => []);

  const appointmentsForClient = sales.map((sale) => ({
    id: sale.id,
    dateTime: sale.dateTime.toISOString(),
    customer: sale.customer,
    staff: sale.staff,
    paymentMethod: sale.paymentMethod,
    totalAmount: sale.totalAmount ? parseFloat(sale.totalAmount.toString()) : null,
    servicesText: sale.servicesText,
    status: sale.status, // Add status
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Turnos</h1>
        <p className="text-gray-600 mt-1">Gestiona los turnos registrados</p>
      </div>

      <AppointmentsTable appointments={appointmentsForClient} />
    </div>
  );
}
