import { prisma } from "@/lib/prisma"
import { AppointmentsComponent } from "./appointments-component"

export default async function AppointmentsPage() {
    const [appointments, barbers, clients, services] = await Promise.all([
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
        }).catch(() => []),
        prisma.client.findMany({
            orderBy: { name: "asc" }
        }).catch(() => []),
        prisma.service.findMany({
            orderBy: { name: "asc" }
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

    const servicesForClient = services.map(service => ({
        ...service,
        price: parseFloat(service.price.toString())
    }))

    return (
        <AppointmentsComponent
            initialAppointments={appointmentsForClient}
            barbers={barbersForClient}
            clients={clients}
            services={servicesForClient}
        />
    )
}
