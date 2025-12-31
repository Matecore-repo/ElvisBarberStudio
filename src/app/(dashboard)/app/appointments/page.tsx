import { prisma } from "@/lib/prisma"
import { AppointmentsList } from "@/components/appointments/AppointmentsList"

export default async function AppointmentsPage() {
    const [appointments, barbers] = await Promise.all([
        prisma.appointment.findMany({
            include: {
                client: true,
                service: true,
                barber: true,
            },
            orderBy: { scheduledStart: "desc" }
        }).catch(() => []),
        prisma.barber.findMany({
            where: { active: true }
        }).catch(() => [])
    ])

    // Convertir Decimals a números para serializar al cliente
    const appointmentsForClient = appointments.map(apt => ({
        ...apt,
        totalAmount: apt.totalAmount ? parseFloat(apt.totalAmount.toString()) : null,
        service: apt.service ? {
            ...apt.service,
            price: parseFloat(apt.service.price.toString())
        } : null
    }))

    const barbersForClient = barbers.map(barber => ({
        ...barber,
        commissionValue: parseFloat(barber.commissionValue.toString())
    }))

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Turnos</h1>
                <p className="text-foreground-muted mt-1">Gestiona las citas de tus clientes</p>
            </div>

            <AppointmentsList initialAppointments={appointmentsForClient} barbers={barbersForClient} />
        </div>
    )
}
