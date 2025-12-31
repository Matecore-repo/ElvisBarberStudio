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

    // Convertir Decimals a números para serializar al cliente
    const commissionsForClient = commissions.map(commission => ({
        ...commission,
        amount: parseFloat(commission.amount.toString()),
        barber: {
            ...commission.barber,
            commissionValue: parseFloat(commission.barber.commissionValue.toString())
        },
        appointment: commission.appointment ? {
            ...commission.appointment,
            totalAmount: commission.appointment.totalAmount ? parseFloat(commission.appointment.totalAmount.toString()) : null,
            service: commission.appointment.service ? {
                ...commission.appointment.service,
                price: parseFloat(commission.appointment.service.price.toString())
            } : null
        } : null
    }))

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Comisiones</h1>
                <p className="text-foreground-muted mt-1">Pagos pendientes a peluqueros</p>
            </div>

            <CommissionsList initialCommissions={commissionsForClient} />
        </div>
    )
}
