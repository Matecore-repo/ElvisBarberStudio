import { prisma } from '@/lib/prisma';
import { CommissionsTable } from '@/components/dashboard/CommissionsTable';

export default async function CommissionsPage() {
  const commissions = await prisma.commissionPayment.findMany({
    include: {
      staff: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  }).catch(() => []);

  const commissionsForClient = commissions.map((commission) => ({
    id: commission.id,
    staff: commission.staff,
    periodStart: commission.periodStart.toISOString(),
    periodEnd: commission.periodEnd.toISOString(),
    totalSales: parseFloat(commission.totalSales.toString()),
    commissionRate: commission.commissionRate,
    commissionAmount: parseFloat(commission.commissionAmount.toString()),
    status: commission.status,
    paidAt: commission.paidAt?.toISOString() || null,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Comisiones</h1>
        <p className="text-gray-600 mt-1">Gestiona las comisiones de los barberos</p>
      </div>

      <CommissionsTable commissions={commissionsForClient} />
    </div>
  );
}
