import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { Decimal } from "@prisma/client/runtime/library"

// POST /api/appointments/[id]/complete - Complete appointment and create commission
export async function POST(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    try {
        const { id } = await props.params
        const body = await request.json()
        const { barberId, totalAmount } = body

        if (!barberId) {
            return NextResponse.json({ error: "Peluquero requerido" }, { status: 400 })
        }

        // Get appointment
        const appointment = await prisma.appointment.findUnique({
            where: { id },
            include: { service: true }
        })

        if (!appointment) {
            return NextResponse.json({ error: "Turno no encontrado" }, { status: 404 })
        }

        if (appointment.status === "COMPLETED") {
            return NextResponse.json({ error: "Turno ya completado" }, { status: 400 })
        }

        // Get barber for commission calculation
        const barber = await prisma.barber.findUnique({
            where: { id: barberId }
        })

        if (!barber) {
            return NextResponse.json({ error: "Peluquero no encontrado" }, { status: 404 })
        }

        // Calculate commission
        const serviceAmount = totalAmount || appointment.service?.price || 0
        let commissionAmount: Decimal

        if (barber.commissionType === "PERCENT") {
            commissionAmount = new Decimal(Number(serviceAmount) * Number(barber.commissionValue) / 100)
        } else {
            commissionAmount = barber.commissionValue
        }

        // Transaction: Update appointment + Create commission
        const [updatedAppointment, commission] = await prisma.$transaction([
            // 1. Mark appointment as COMPLETED
            prisma.appointment.update({
                where: { id },
                data: {
                    status: "COMPLETED",
                    completedAt: new Date(),
                    completedByUserId: session.user.id,
                    barberId: barberId,
                    totalAmount: serviceAmount,
                }
            }),
            // 2. Create commission in PENDING status
            prisma.commission.create({
                data: {
                    salonId: appointment.salonId,
                    appointmentId: id,
                    barberId: barberId,
                    amount: commissionAmount,
                    status: "PENDING",
                }
            })
        ])

        return NextResponse.json({
            appointment: updatedAppointment,
            commission,
            message: "Turno completado y comisión registrada"
        })
    } catch (error) {
        console.error("Error completing appointment:", error)
        return NextResponse.json({ error: "Error al completar turno" }, { status: 500 })
    }
}
