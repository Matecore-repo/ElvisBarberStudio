import { prisma } from "@/lib/prisma"
import { CommissionsList } from "@/components/commissions/CommissionsList"

export default async function CommissionsPage() {
    const commissions = await prisma.commission.findMany({
        include: {
            barber: true,
            appointment: {
                include: {
                    client: true,
                    service: true,
                }
            }
        },
        orderBy: { createdAt: "desc" }
    }).catch(() => [])

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Comisiones</h1>
                <p className="text-foreground-muted mt-1">Pagos pendientes a peluqueros</p>
            </div>

            <CommissionsList initialCommissions={commissions} />
        </div>
    )
}
