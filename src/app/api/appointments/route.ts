import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET /api/appointments - List appointments
export async function GET() {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    try {
        const appointments = await prisma.appointment.findMany({
            include: {
                client: true,
                service: true,
                barber: true,
            },
            orderBy: { scheduledStart: "desc" }
        })
        return NextResponse.json(appointments)
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener turnos" }, { status: 500 })
    }
}

// POST /api/appointments - Create appointment
export async function POST(request: Request) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { clientId, serviceId, barberId, scheduledStart, scheduledEnd, salonId } = body

        if (!scheduledStart) {
            return NextResponse.json({ error: "Fecha de inicio requerida" }, { status: 400 })
        }

        const appointment = await prisma.appointment.create({
            data: {
                salonId: salonId || session.user.salonId || "default-salon",
                clientId,
                serviceId,
                barberId,
                scheduledStart: new Date(scheduledStart),
                scheduledEnd: scheduledEnd ? new Date(scheduledEnd) : new Date(new Date(scheduledStart).getTime() + 30 * 60000),
                status: "SCHEDULED",
            },
            include: {
                client: true,
                service: true,
                barber: true,
            }
        })

        return NextResponse.json(appointment, { status: 201 })
    } catch (error) {
        console.error("Error creating appointment:", error)
        return NextResponse.json({ error: "Error al crear turno" }, { status: 500 })
    }
}
